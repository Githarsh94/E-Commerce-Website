import React, { useEffect } from "react";
import "../../Components/Wishlist/Wishlist.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";

interface WishlistItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const Wishlist: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, isWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart: addProductToCart } = useCart();

  // Open modal if navigated with state (run only once)
  useEffect(() => {
    if ((location.state as any)?.openWishlist && !isWishlistOpen) {
      toggleWishlist();
      // Remove the state after opening once
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, isWishlistOpen, toggleWishlist, navigate, location.pathname]);

  const addToCart = (item: WishlistItem) => {
    try {
      const productId = typeof item.id === "string" ? parseInt(item.id, 10) : item.id;

      addProductToCart({
        id: productId,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        productId: productId,
      });

      const notification = document.createElement("div");
      notification.className = "wishlist-notification success";
      notification.textContent = "✅ Product added to cart successfully!";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      const errorNotification = document.createElement("div");
      errorNotification.className = "wishlist-notification error";
      errorNotification.textContent = "❌ Error adding product to cart.";
      document.body.appendChild(errorNotification);
      setTimeout(() => errorNotification.remove(), 3000);
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
                <h4>Price: ${item.price}</h4>
                <div className="wishlist-elem-part2-last">
                  <button className="wishlist-add-btn" onClick={() => addToCart(item)}>
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
