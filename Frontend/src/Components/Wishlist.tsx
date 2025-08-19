import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
    const { wishlistItems, removeFromWishlist, isWishlistOpen, toggleWishlist } = useWishlist();
    const { addToCart: addProductToCart } = useCart();

    const addToCart = (item: any) => {
        try {
            // Add to cart context
            addProductToCart({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                image_url: item.image_url,
                productId: item.id
            });

            // Create a more visible notification
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
            notification.textContent = 'Product added to cart successfully!';
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            // Show fallback notification for demo
            const errorNotification = document.createElement('div');
            errorNotification.style.cssText = `
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
            errorNotification.textContent = 'Error adding product to cart';
            document.body.appendChild(errorNotification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                if (document.body.contains(errorNotification)) {
                    document.body.removeChild(errorNotification);
                }
            }, 3000);
        }
    };

    return (
        <div className="wishlist-wrapper">
            <div style={{ position: 'relative' }}>
                <i className="ri-heart-fill" onClick={toggleWishlist}></i>
                {wishlistItems.length > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4757',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8vw',
                        fontWeight: 'bold',
                        border: '1px solid white'
                    }}>
                        {wishlistItems.length}
                    </span>
                )}
            </div>
            <div className="wishlist" style={{ opacity: isWishlistOpen ? 1 : 0, zIndex: isWishlistOpen ? 10 : -1 }}>
                <h2>Wishlist</h2>
                {wishlistItems.length === 0 ? (
                    <p>Your wishlist is empty.</p>
                ) : (
                    wishlistItems.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <div className="wishlist-elem-part1">
                                <img src={item.image_url} alt={item.name} />
                            </div>
                            <div className="wishlist-elem-part2">
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <h4>Price: ${item.price}</h4>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                    <button 
                                        onClick={() => addToCart(item)}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '0.9vw',
                                            minWidth: 'fit-content',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                    <button 
                                        onClick={() => removeFromWishlist(item.id)}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '0.9vw',
                                            minWidth: 'fit-content',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Wishlist;