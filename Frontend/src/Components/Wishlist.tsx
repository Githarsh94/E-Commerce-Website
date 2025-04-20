import { useEffect, useState } from "react";
    function Wishlist() {
        interface WishlistItem {
            id: number;
            name: string;
            description: string;
            price: number;
            image: string;
        }

        const [wishlistData, setWishlistData] = useState<WishlistItem[]>([]);

        useEffect(() => {
            fetch("/data/wishlist.json")
                .then((response) => response.json())
                .then((data) => setWishlistData(data))
                .catch((error) => console.error("Error fetching wishlist data:", error));
        }, []);

        return (
            <div className="wishlist-wrapper">
                <i className="ri-heart-fill"></i> 
                <div className="wishlist">
                    <h2>Wishlist</h2>
                    {wishlistData.length === 0 ? (
                    <p>Your wishlist is empty.</p>
                    ) : (
                    wishlistData.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <div className="wishlist-elem-part1">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="wishlist-elem-part2">
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <h4>Price: ${item.price}</h4>
                            </div>
                        </div>
                    ))
                )}
                </div>
            </div>
        );
    }

export default Wishlist;