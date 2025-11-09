import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError, showConfirm } from '../../utils/alert';
import { useNavigate } from "react-router-dom";
import apiFetch from '../../utils/apiFetch';

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from server when authenticated
  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated || !token) {
        setWishlistItems([]);
        return;
      }

      try {
        const wishlistRows: any[] = await apiFetch('/wishlist');

        const wishlistWithDetails = await Promise.all(
          wishlistRows.map(async (row: any) => {
            try {
              const product: any = await apiFetch(`/products/single/${row.productId}`);
              return {
                id: row.id,
                productId: row.productId,
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                image_url: product.image_url || product.image || '',
              } as WishlistItem;
            } catch (error) {
              console.error(`Failed to load product ${row.productId}:`, error);
              return null;
            }
          })
        );

        setWishlistItems(wishlistWithDetails.filter(Boolean) as WishlistItem[]);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        setWishlistItems([]);
      }
    };

    loadWishlist();
  }, [isAuthenticated, token]);

  const addToCart = async (item: WishlistItem) => {
    if (!isAuthenticated) {
      const result = await showConfirm({
        title: 'Sign in required',
        text: 'You need to sign in to add items to cart',
        confirmButtonText: 'Sign in'
      });
      if (result.isConfirmed) navigate('/auth?mode=signin');
      return;
    }

    try {
      await apiFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          productId: item.productId,
          quantity: 1,
          product: {
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url
          }
        })
      });

      // Remove from wishlist after successfully adding to cart
      await removeFromWishlist(item.id, false);
      await showSuccess('Product added to cart and removed from wishlist!');
    } catch (error: any) {
      console.error("Error adding product to cart:", error);
      await showError(error.message || 'Failed to add product to cart');
    }
  };

  const removeFromWishlist = async (wishlistId: number, showMessage: boolean = true) => {
    if (!isAuthenticated || !token) return;

    try {
      await apiFetch(`/wishlist/remove/${wishlistId}`, { method: 'DELETE' });
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));

      if (showMessage) {
        await showSuccess('Removed from wishlist');
      }
    } catch (error: any) {
      console.error('Failed to remove from wishlist:', error);
      if (showMessage) {
        await showError(error.message || 'Failed to remove from wishlist');
      }
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
                <button
                  className="wishlist-add-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
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
