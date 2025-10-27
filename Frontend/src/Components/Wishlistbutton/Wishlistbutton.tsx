import React, { useState } from 'react';
import "./wishlistbutton.css";
import 'remixicon/fonts/remixicon.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from "../../context/WishlistContext";
const Wishlistbutton = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { wishlistItems, toggleWishlist } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();

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
        {wishlistItems.length > 0 && (
          <span className="wishlist-count">{wishlistItems.length}</span>
        )}
      </div>
  )
}

export default Wishlistbutton