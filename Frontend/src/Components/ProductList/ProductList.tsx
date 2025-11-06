import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

interface ProductRaw {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
    rating?: number;
    totalRatings?: number;
    totalReviews?: number;
}

interface ProductListProps {
    products: ProductRaw[];
}

export default function ProductList({ products }: ProductListProps) {
    return (
        <div className="product-list-container">
            <div className="product-list-grid">
                {products.map((product) => (
                    <div className="product-list-item" key={product.id}>
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            /* accept both `image` and `image_url` naming from different data sources */
                            image={product.image || (product as any).image_url || ''}
                            description={product.description || ''}
                            price={product.price}
                            /* accept multiple possible rating/count field names */
                            rating={(product as any).rating ?? (product as any).averageRating ?? 0}
                            totalRatings={(product as any).totalRatings ?? (product as any).numRatings ?? 0}
                            totalReviews={(product as any).totalReviews ?? (product as any).numReviews ?? 0}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}