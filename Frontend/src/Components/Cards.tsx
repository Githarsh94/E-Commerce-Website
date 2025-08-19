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

interface CategoryData {
    category: string;
    products: Product[];
}

interface CardsProps {
    searchTerm: string;
}

function Cards({ searchTerm }: CardsProps) {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [allCategories, setAllCategories] = useState<CategoryData[]>([]);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart: addProductToCart } = useCart();

    // No Shery.js effects on images to maintain visibility
    useEffect(() => {
        // Image effects disabled to prevent visibility issues after hover
    }, [categories]);

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                // Check if backend URL is available
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                
                if (backendUrl) {
                    // Try to fetch from API first
                    const categoriesResponse = await fetch(`${backendUrl}/api/categories`);
                    
                    if (categoriesResponse.ok) {
                        const categoriesData = await categoriesResponse.json();

                        if (Array.isArray(categoriesData)) {
                            const categoriesWithProducts = await Promise.all(
                                categoriesData.map(async (category: { id: number; name: string }) => {
                                    try {
                                        const productsResponse = await fetch(`${backendUrl}/api/products/${category.id}`);
                                        const productsData = await productsResponse.json();

                                        return {
                                            category: category.name,
                                            products: Array.isArray(productsData) ? productsData : [],
                                        };
                                    } catch (error) {
                                        console.warn(`Failed to fetch products for category ${category.name}:`, error);
                                        return {
                                            category: category.name,
                                            products: [],
                                        };
                                    }
                                })
                            );

                            setAllCategories(categoriesWithProducts);
                            setCategories(categoriesWithProducts);
                            return; // Success, exit early
                        }
                    }
                }
                
                // If API fails, use fallback data with portrait real product images
                const fallbackData = [
                    {
                        category: "Electronics",
                        products: [
                            {
                                id: 1,
                                name: "Smartphone",
                                description: "Latest smartphone with advanced features",
                                price: 699,
                                image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=400&fit=crop"
                            },
                            {
                                id: 2,
                                name: "Laptop",
                                description: "High-performance laptop for work and gaming",
                                price: 1299,
                                image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=400&fit=crop"
                            },
                            {
                                id: 3,
                                name: "Wireless Headphones",
                                description: "Premium noise-cancelling headphones",
                                price: 299,
                                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop"
                            }
                        ]
                    },
                    {
                        category: "Fashion",
                        products: [
                            {
                                id: 4,
                                name: "Designer Jacket",
                                description: "Stylish winter jacket for all occasions",
                                price: 199,
                                image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop"
                            },
                            {
                                id: 5,
                                name: "Running Shoes",
                                description: "Comfortable running shoes with great support",
                                price: 129,
                                image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop"
                            },
                            {
                                id: 6,
                                name: "Designer Handbag",
                                description: "Elegant handbag for everyday use",
                                price: 249,
                                image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop"
                            }
                        ]
                    },
                    {
                        category: "Home & Kitchen",
                        products: [
                            {
                                id: 7,
                                name: "Coffee Machine",
                                description: "Professional espresso machine for home use",
                                price: 449,
                                image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=400&fit=crop"
                            },
                            {
                                id: 8,
                                name: "Air Fryer",
                                description: "Healthy cooking with less oil",
                                price: 159,
                                image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop"
                            }
                        ]
                    },
                    {
                        category: "Sports & Fitness",
                        products: [
                            {
                                id: 9,
                                name: "Yoga Mat",
                                description: "Premium non-slip yoga mat",
                                price: 39,
                                image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop"
                            },
                            {
                                id: 10,
                                name: "Dumbbell Set",
                                description: "Adjustable weight dumbbells",
                                price: 299,
                                image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop"
                            }
                        ]
                    }
                ];

                setAllCategories(fallbackData);
                setCategories(fallbackData);
                
            } catch (error) {
                console.error("Error fetching categories or products:", error);
                // Use fallback data on error
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    // Filter products based on search term
    useEffect(() => {
        if (!searchTerm) {
            setCategories(allCategories);
            return;
        }

        const term = searchTerm.toLowerCase().trim();

        const filteredCategories = allCategories.map(categoryData => {
            const filteredProducts = categoryData.products.filter(product =>
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term)
            );

            return {
                ...categoryData,
                products: filteredProducts
            };
        }).filter(categoryData => categoryData.products.length > 0);

        setCategories(filteredCategories);
    }, [searchTerm, allCategories]);

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
            // Show error notification
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

    const handleWishlistToggle = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div id="card-section">
            <h1>Card Section</h1>
            {categories.length === 0 && searchTerm && (
                <div className="no-results">
                    <p>No products found matching "{searchTerm}"</p>
                </div>
            )}
            <div className="category-card">
                {categories.map((categoryData, index) => (
                    <div className="card-category-diff" key={index}>
                        <h2>{categoryData.category}</h2>
                        <div className="card-track">
                            {categoryData.products.map((product) => (
                                <div className="card" key={product.id}>
                                    <img 
                                        className="img"
                                        src={product.image_url} 
                                        alt={product.name}
                                        onError={(e) => {
                                            // eslint-disable-next-line no-script-url
                                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E`;
                                        }}
                                        style={{ 
                                            width: '100%', 
                                            height: '70%', 
                                            objectFit: 'cover', 
                                            border: '1px solid #ddd',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5f5f5',
                                            display: 'block', // Ensure image is displayed
                                            visibility: 'visible', // Force visibility
                                            opacity: 1, // Ensure not transparent
                                            zIndex: 1 // Ensure on top
                                        }}
                                    />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <h5>Price: ${product.price}</h5>
                                    <h4 onClick={() => addToCart(product)}>Add to Cart</h4>
                                    <h4 
                                        onClick={() => handleWishlistToggle(product)}
                                        className="wishlist-btn"
                                        style={{
                                            color: '#132892',
                                            fontSize: '1vw',
                                            fontWeight: 'bolder',
                                            border: '1px solid #000',
                                            borderRadius: '1vw',
                                            width: '10vw',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            marginTop: '0.5vw'
                                        }}
                                    >
                                        {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </h4>
                                </div>
                            ))}
                            {/* Duplicate for seamless loop */}
                            {categoryData.products.map((product) => (
                                <div className="card" key={`dup-${product.id}`}>
                                    <img 
                                        className="img"
                                        src={product.image_url} 
                                        alt={product.name}
                                        onError={(e) => {
                                            // eslint-disable-next-line no-script-url
                                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E`;
                                        }}
                                        style={{ 
                                            width: '100%', 
                                            height: '70%', 
                                            objectFit: 'cover', 
                                            border: '1px solid #ddd',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5f5f5',
                                            display: 'block', // Ensure image is displayed
                                            visibility: 'visible', // Force visibility
                                            opacity: 1, // Ensure not transparent
                                            zIndex: 1 // Ensure on top
                                        }}
                                    />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <h5>Price: ${product.price}</h5>
                                    <h4 onClick={() => addToCart(product)}>Add to Cart</h4>
                                    <h4 
                                        onClick={() => handleWishlistToggle(product)}
                                        className="wishlist-btn"
                                        style={{
                                            color: '#132892',
                                            fontSize: '1vw',
                                            fontWeight: 'bolder',
                                            border: '1px solid #000',
                                            borderRadius: '1vw',
                                            width: '10vw',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            marginTop: '0.5vw'
                                        }}
                                    >
                                        {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cards;
