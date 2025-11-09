import React, { useEffect, useState } from 'react';
import "./wishlistbutton.css";
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiFetch from '../../utils/apiFetch';

const Wishlistbutton = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !token) { setCount(0); return; }
      try {
        const rows: any = await apiFetch('/wishlist');
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