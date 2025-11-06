import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard/ProductCard';
import apiFetch from '../utils/apiFetch';
import './CategoryProducts.css';

interface ProductRaw {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url?: string;
}

export default function CategoryProducts() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductRaw[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const cats: any = await apiFetch('/api/categories');
                const found = Array.isArray(cats) ? cats.find((c: any) => (c.name || c.category || '').toLowerCase().replace(/\s+/g, '-') === (slug || '')) : null;
                if (found) {
                    setCategoryName(found.name || found.category || `Category ${found.id}`);
                    try {
                        const prods: any = await apiFetch(`/api/products/${found.id}`);
                        setProducts(Array.isArray(prods) ? prods : []);
                    } catch (e) {
                        console.warn('Failed to load products for category from backend', e);
                        setProducts([]);
                    }
                } else {
                    setCategoryName(slug || 'Category');
                    setProducts([]);
                }
            } catch (err) {
                console.error('Failed to load category products', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    return (
        <div className="category-products-page">
            <div className="category-products-header">
                <button className="btn-secondary" onClick={() => navigate(-1)}>← Back</button>
                <h2>{categoryName ? `Products — ${categoryName}` : 'Products'}</h2>
            </div>

            {loading ? (
                <p>Loading products…</p>
            ) : products.length === 0 ? (
                <p>No products found for this category.</p>
            ) : (
                <div className="product-grid">
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            id={p.id}
                            name={p.name}
                            image={p.image_url || ''}
                            description={p.description || ''}
                            price={p.price}
                            rating={0}
                            totalRatings={0}
                            totalReviews={0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
