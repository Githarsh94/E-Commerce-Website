import React, { useEffect, useState } from 'react';
import { useLenis } from '../hooks/useLenis';

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image_url: string;
  productId: number;
}

interface CartProps {
  items: Item[];
  onRemove: (id: number) => void;
  onAdd: (id: number) => void;
  onDecrease: (id: number) => void;
}

const Cart: React.FC<CartProps> = () => {
  useLenis();
  const [cartData, setCartData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
          },
        });

        const cartItems = await cartResponse.json();
        const productPromises = cartItems.map(async (cartItem: any) => {
          const productResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/single/${cartItem.productId}`, {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
            },
          });
          const productData = await productResponse.json();
          console.log('Product data:', cartItems);
          return {
            id: parseInt(cartItem.id),
            name: productData.name,
            price: parseFloat(productData.price),
            quantity: cartItem.quantity,
            description: productData.description,
            image_url: productData.image_url,
            productId: productData.id,
          };
        });

        const formattedData = await Promise.all(productPromises);
        setCartData(formattedData);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  const handleAdd = async (productId: number, id: number) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });
      setCartData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleDecrease = async (productId: number, id: number) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/decrease/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });
      setCartData((prev) => {
        const item = prev.find((item) => item.id === id);
        if (item && item.quantity <= 1) {
          alert('Quantity cannot be less than 1.');
          return prev;
        }
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      });
    } catch (error) {
      console.error('Error decreasing item quantity:', error);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        },
      });
      setCartData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

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
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className="cart-elem-part2">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="cart-elem-part2-last">
                <h4 className="quantity-controller">
                  <i className="ri-add-line icon-btn" onClick={() => handleAdd(item.productId, item.id)}></i>
                  <span className="quantity">{item.quantity}</span>
                  <i className="ri-subtract-line icon-btn" onClick={() => handleDecrease(item.productId, item.id)}></i>
                </h4>
                <h4>Price: ${(item.price * item.quantity).toFixed(2)}</h4>
                <h4 className="remove-btn" onClick={() => handleRemove(item.id)}>Remove</h4>
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
