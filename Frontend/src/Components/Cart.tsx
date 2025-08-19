import React from 'react';
import { useLenis } from '../hooks/useLenis';
import { useCart } from '../context/CartContext';

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
      return;
    }

    // Show success notification for buy now
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 16px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;
    notification.textContent = `Order placed successfully! Total: $${getTotalPrice().toFixed(2)}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);

    // Clear cart after purchase (optional)
    // You can comment this out if you want to keep items in cart
    // clearCart();
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-elem-part1">
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className="cart-elem-part2">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="cart-elem-part2-last">
                <h4 className="quantity-controller">
                  <i className="ri-add-line icon-btn" onClick={() => handleAdd(item.id)}></i>
                  <span className="quantity">{item.quantity}</span>
                  <i className="ri-subtract-line icon-btn" onClick={() => handleDecrease(item.id)}></i>
                </h4>
                <h4>Price: ${(item.price * item.quantity).toFixed(2)}</h4>
                <h4 className="remove-btn" onClick={() => handleRemove(item.id)}>Remove</h4>
              </div>
            </div>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
          <button 
            className="buy-now-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
