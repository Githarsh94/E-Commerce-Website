import React from 'react';
import "./Cart.css";
import { useLenis } from '../../hooks/useLenis';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  useLenis();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const handleAdd = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDecrease = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleBuyNow = () => {
    if (cartItems.length === 0) {
      // Show notification for empty cart
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      `;
      notification.textContent = 'Your cart is empty!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  return (
    <div className="cart-container">
      {/* Cart UI here */}
    </div>
  );
};

export default Cart;
