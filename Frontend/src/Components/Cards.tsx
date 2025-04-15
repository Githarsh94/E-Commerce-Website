import React, { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface CategoryData {
    category: string;
    products: Product[];
}

function Card() {
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        fetch("/data/card.json")
            .then((response) => response.json())
            .then((data) => {
                if (
                    Array.isArray(data) &&
                    data.every(item => typeof item === "object" && Array.isArray(item.products))
                ) {
                    setCategories(data);
                } else {
                    console.error("Invalid data format");
                    setCategories([]);
                }
            })
            .catch((error) => console.error("Error fetching card data:", error));
    }, []);

    return (
        <div id="card-section">
    <h1>Card Section</h1>
    <div className="category-card">
        {categories.map((categoryData, index) => (
            <div className="card-category-diff" key={index}>
                <h2>{categoryData.category}</h2>
                <div className="card-track">
                    {categoryData.products.map((product) => (
                        <div className="card" key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <h5>Price: ${product.price}</h5>
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {categoryData.products.map((product) => (
                        <div className="card" key={`dup-${product.id}`}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <h5>Price: ${product.price}</h5>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
</div>

    );
}

export default Card;
