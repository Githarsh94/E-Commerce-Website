import React, { useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const categoriesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
                const categoriesData = await categoriesResponse.json();

                if (Array.isArray(categoriesData)) {
                    const categoriesWithProducts = await Promise.all(
                        categoriesData.map(async (category: { id: number; name: string }) => {
                            const productsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${category.id}`);
                            const productsData = await productsResponse.json();

                            return {
                                category: category.name,
                                products: Array.isArray(productsData) ? productsData : [],
                            };
                        })
                    );

                    setAllCategories(categoriesWithProducts);
                    setCategories(categoriesWithProducts);
                } else {
                    console.error("Invalid categories data format");
                    setAllCategories([]);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories or products:", error);
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

    const addToCart = async (productId: number) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`, // Replace with your actual token
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1, // Default quantity set to 1
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            alert("Product added to cart");
        } catch (error) {
            console.error("Error adding product to cart:", error);
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
                                    <img src={product.image_url} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <h5>Price: ${product.price}</h5>
                                    <h4 onClick={() => addToCart(product.id)}>Add to Cart</h4>
                                </div>
                            ))}
                            {/* Duplicate for seamless loop */}
                            {categoryData.products.map((product) => (
                                <div className="card" key={`dup-${product.id}`}>
                                    <img src={product.image_url} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <h5>Price: ${product.price}</h5>
                                    <h4 onClick={() => addToCart(product.id)}>Add to Cart</h4>
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
