import React, { useEffect, useState } from 'react';
import "./Cart.css";
import { useLenis } from '../../hooks/useLenis';
import { showError, showSuccess } from '../../utils/alert';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  useLenis();
  const { token, isAuthenticated } = useAuth();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3002/api';

  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) { setCartItems([]); return; }
      const rows = await res.json();
      // rows contain cart row { id, productId, quantity }
      const detailed = await Promise.all(rows.map(async (row: any) => {
        try {
          const pRes = await fetch(`${API_BASE}/products/single/${row.productId}`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (!pRes.ok) return null;
          const prod = await pRes.json();
          return {
            id: row.id,
            productId: row.productId,
            quantity: row.quantity,
            name: prod.name || '',
            description: prod.description || '',
            price: prod.price || 0,
            image_url: prod.image_url || prod.image || '',
          };
        } catch (e) { return null; }
      }));
      setCartItems(detailed.filter(Boolean));
    } catch (e) {
      setCartItems([]);
    }
  };

  useEffect(() => { loadCart(); }, [isAuthenticated, token]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAdd = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  // intentionally present for future UI wiring; keep but ignore unused-var lint for now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDecrease = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  // button handler placeholder
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  // buy-now placeholder
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBuyNow = () => {
    if (cartItems.length === 0) {
      try { showError('Your cart is empty!'); } catch (e) { }
    }
    navigate('/order-summary');
  };

  const removeFromCart = async (id: number) => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch(`${API_BASE}/cart/remove/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) {
        try { showError('Failed to remove item'); } catch (_) {}
        return;
      }
      await loadCart();
      try { showSuccess('Removed from cart'); } catch (_) {}
    } catch (e) {
      // ignore
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!isAuthenticated || !token) return;
    try {
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }
      const action = quantity > (cartItems.find(it => it.id === id)?.quantity || 0) ? 'increase' : 'decrease';
      await fetch(`${API_BASE}/cart/${action}/${id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      await loadCart();
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-elem-part1">
                <img src={item.image_url} alt={item.name} />
              </div>
              <div className="cart-elem-part2">
                <h2>{item.name}</h2>
                <h4>{item.description}</h4>
                <div className="cart-elem-part2-last">
                  <div>
                    <button className="icon-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="icon-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div>
                    <span className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</span>
                  </div>
                </div>
              </div>
              <div className="cart-price">
                <h3>₹{(item.price * item.quantity).toLocaleString('en-IN')}</h3>
              </div>
            </div>
          ))}

          <div className="cart-footer">
            <h3>Total: ₹{cartItems.reduce((s, it) => s + it.price * it.quantity, 0).toLocaleString('en-IN')}</h3>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
