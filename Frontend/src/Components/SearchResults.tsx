import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

interface SearchResultsProps {
    searchTerm: string;
}

function SearchResults({ searchTerm }: SearchResultsProps) {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart: addProductToCart } = useCart();

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // Try to fetch from API first
                const categoriesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
                
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();

                    if (Array.isArray(categoriesData)) {
                        let allProducts: Product[] = [];
                        
                        for (const category of categoriesData) {
                            const productsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${category.id}`);
                            if (productsResponse.ok) {
                                const productsData = await productsResponse.json();
                                if (Array.isArray(productsData)) {
                                    allProducts = [...allProducts, ...productsData];
                                }
                            }
                        }

                        // Filter products based on search term
                        const filtered = allProducts.filter(product =>
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        setSearchResults(filtered);
                    }
                } else {
                    // Fallback to local data
                    const response = await fetch('/data/categories.json');
                    const data = await response.json();
                    let allProducts: Product[] = [];
                    
                    data.forEach((categoryData: any) => {
                        if (categoryData.products) {
                            allProducts = [...allProducts, ...categoryData.products];
                        }
                    });

                    // Filter products based on search term
                    const filtered = allProducts.filter(product =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    setSearchResults(filtered);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                // Fallback to local data
                try {
                    const response = await fetch('/data/categories.json');
                    const data = await response.json();
                    let allProducts: Product[] = [];
                    
                    data.forEach((categoryData: any) => {
                        if (categoryData.products) {
                            allProducts = [...allProducts, ...categoryData.products];
                        }
                    });

                    // Filter products based on search term
                    const filtered = allProducts.filter(product =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    setSearchResults(filtered);
                } catch (fallbackError) {
                    console.error('Error loading fallback data:', fallbackError);
                }
            }
            setLoading(false);
        };

        if (searchTerm.trim()) {
            fetchSearchResults();
        }
    }, [searchTerm]);

    const addToCart = (product: Product) => {
        try {
            // Add to cart context
            addProductToCart({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image_url: product.image_url,
                productId: product.id
            });
            
            // Show success notification
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
            notification.textContent = `${product.name} added to cart!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) {
        return (
            <div className="search-results-container">
                <div className="search-results-header">
                    <h1>Searching for "{searchTerm}"...</h1>
                </div>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="search-results-container">
            <div className="search-results-header">
                <h1>Search Results for "{searchTerm}"</h1>
                <p>{searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found</p>
            </div>

            {searchResults.length === 0 ? (
                <div className="no-results">
                    <h2>No products found for "{searchTerm}"</h2>
                    <p>Try searching with different keywords</p>
                </div>
            ) : (
                <div className="search-results-grid">
                    {searchResults.map((product) => (
                        <div key={product.id} className="card">
                            <h5>₹{product.price}</h5>
                            <img src={product.image_url} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <h4 onClick={() => addToCart(product)}>Add to Cart</h4>
                            <h5
                                className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                onClick={() => {
                                    if (isInWishlist(product.id)) {
                                        removeFromWishlist(product.id);
                                    } else {
                                        addToWishlist(product);
                                    }
                                }}
                            >
                                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </h5>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResults;
