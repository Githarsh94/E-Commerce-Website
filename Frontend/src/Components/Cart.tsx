import React, { useEffect, useState } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
}

interface CartProps {
  items: Item[];
  onRemove: (id: number) => void;
  onAdd: (id: number) => void;
  onDecrease: (id: number) => void;
}

const Cart: React.FC<CartProps> = ({ onRemove, onAdd, onDecrease }) => {
  const [cartData, setCartData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('/data/cart.json');
        const data = await response.json();
        const formattedData = data.cart.map((item: any) => ({
          id: parseInt(item.productId),
          name: item.productName,
          price: parseFloat(item.price.replace('$', '')),
          quantity: item.quantity,
          description: item.description,
          image: item.image,
        }));
        setCartData(formattedData);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartData.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartData.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-elem-part1">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-elem-part2">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="cart-elem-part2-last">
                <h4 className="quantity-controller">
                  <i className="ri-add-line icon-btn" onClick={() => onAdd(item.id)}></i>
                  <span className="quantity">{item.quantity}</span>
                  <i className="ri-subtract-line icon-btn" onClick={() => onDecrease(item.id)}></i>
                </h4>
                <h4>Price: ${(item.price * item.quantity).toFixed(2)}</h4>
                <h4 className="remove-btn" onClick={() => onRemove(item.id)}>Remove</h4>
              </div>
            </div>
          </div>
        ))
      )}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
};

export default Cart;
