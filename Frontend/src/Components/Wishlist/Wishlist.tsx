import React, { useEffect, useState } from "react";
import "../../Components/Wishlist/Wishlist.css";
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError, showConfirm } from '../../utils/alert';
import { useLocation, useNavigate } from "react-router-dom";

interface WishlistItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const Wishlist: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3002/api';

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isWishlistOpen] = useState(false);
  const toggleWishlist = () => { /* no-op for now, kept for backward compat */ };

  // Open modal if navigated with state (run only once)
  useEffect(() => {
    if ((location.state as any)?.openWishlist && !isWishlistOpen) {
      toggleWishlist();
      // Remove the state after opening once
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, isWishlistOpen, toggleWishlist, navigate, location.pathname]);

  // Load wishlist from server when authenticated
  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !token) {
        setWishlistItems([]);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/wishlist`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
          setWishlistItems([]);
          return;
        }
        const rows = await res.json();
        // rows are wishlist rows { id, productId }
        const detailed = await Promise.all(rows.map(async (row: any) => {
          try {
            const pRes = await fetch(`${API_BASE}/products/single/${row.productId}`, { headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) } });
            if (!pRes.ok) return null;
            const prod = await pRes.json();
            return {
              id: row.id,
              name: prod.name || '',
              description: prod.description || '',
              price: prod.price || 0,
              image_url: prod.image_url || prod.image || '',
            } as WishlistItem;
          } catch (e) { return null; }
        }));
        setWishlistItems(detailed.filter(Boolean) as WishlistItem[]);
      } catch (e) {
        setWishlistItems([]);
      }
    };
    load();
  }, [isAuthenticated, token]);

  const addToCart = async (item: WishlistItem) => {
    try {
      if (!isAuthenticated) {
        const res = await showConfirm({ title: 'Sign in required', text: 'You need to sign in to add items to cart', confirmButtonText: 'Sign in' });
        if (res.isConfirmed) navigate('/auth?mode=signin');
        return;
      }

  // prefer explicit productId (the id of the product), fallback to item.id for compatibility
  const productId = (item as any).productId ? (typeof (item as any).productId === 'string' ? parseInt((item as any).productId, 10) : (item as any).productId) : (typeof item.id === "string" ? parseInt(item.id, 10) : item.id);

      const resp = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ productId, quantity: 1, product: { name: item.name, description: item.description, price: item.price, image_url: item.image_url } })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        try { await showError(txt || 'Failed to add to cart'); } catch (_) {}
        return;
      }

      try { await showSuccess('Product added to cart successfully!'); } catch (_) {}
    } catch (error) {
      console.error("Error adding product to cart:", error);
      try { await showError('Error adding product to cart'); } catch (_) {}
    }
  };

  const removeFromWishlist = async (wishlistId: number) => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch(`${API_BASE}/wishlist/remove/${wishlistId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) {
        const txt = await res.text();
        try { await showError(txt || 'Failed to remove from wishlist'); } catch (_) {}
        return;
      }
      setWishlistItems(prev => prev.filter(it => Number(it.id) !== Number(wishlistId)));
      try { await showSuccess('Removed from wishlist'); } catch (_) {}
    } catch (e) {
      // ignore
    }
  };

  const removeFromWishlistAfterAddToCart = async (wishlistId: number) => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch(`${API_BASE}/wishlist/remove/${wishlistId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) {
        const txt = await res.text();
        try { await showError(txt || 'Failed to remove from wishlist'); } catch (_) {}
        return;
      }
      setWishlistItems(prev => prev.filter(it => Number(it.id) !== Number(wishlistId)));
      // try { await showSuccess('Wishlist updated'); } catch (_) {}
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="wishlist">
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty !!.</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={item.id} className="wishlist-item">
            <div className="wishlist-elem-part1">
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className="wishlist-elem-part2">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
                <h4>Price: ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              <div className="wishlist-elem-part2-last">
                <button className="wishlist-add-btn" onClick={() => { 
                  addToCart(item).then(() => removeFromWishlistAfterAddToCart(typeof item.id === 'string' ? parseInt(item.id as string, 10) : Number(item.id)));
                }}>
                  Add to Cart
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(typeof item.id === 'string' ? parseInt(item.id as string, 10) : Number(item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
