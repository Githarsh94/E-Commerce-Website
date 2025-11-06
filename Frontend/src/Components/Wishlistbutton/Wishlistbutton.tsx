import React, { useEffect, useState } from 'react';
import "./wishlistbutton.css";
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Wishlistbutton = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3002/api';

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !token) { setCount(0); return; }
      try {
        const res = await fetch(`${API_BASE}/wishlist`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) { setCount(0); return; }
        const rows = await res.json();
        setCount(Array.isArray(rows) ? rows.length : 0);
      } catch (e) { setCount(0); }
    };
    load();
  }, [isAuthenticated, token]);

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };
  return (
    <div className="wishlist-wrapper">
      <i
        className="ri-heart-fill"
        onClick={handleWishlistClick}
        aria-label="Wishlist"
        title="Wishlist"
        role="button"
      >
        <span style={{ display: "none" }}>♥</span>
      </i>
      {count > 0 && (
        <span className="wishlist-count">{count}</span>
      )}
    </div>
  )
}

export default Wishlistbutton