import React from 'react';

interface CartProps {
    items: { id: number; name: string; price: number; quantity: number }[];
    onRemove: (id: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove }) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="cart">

        </div>
    );
};

export default Cart;