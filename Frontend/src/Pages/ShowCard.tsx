import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductList from '../Components/ProductList/ProductList';
import apiFetch from '../utils/apiFetch';
import './ShowCard.css';

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

export default function ShowCard() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductRaw[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Fetch categories from backend to resolve slug -> id
                const cats: any = await apiFetch('/categories');
                const foundCat = Array.isArray(cats)
                    ? cats.find((c: any) => (c.name || c.category || '').toLowerCase().replace(/\s+/g, '-') === (slug || ''))
                    : null;

                if (foundCat) {
                    setCategoryName(foundCat.name || foundCat.category || `Category ${foundCat.id}`);
                    // fetch products for this category using backend controller
                    try {
                        const prods: any = await apiFetch(`/products/${foundCat.id}`);
                        setProducts(Array.isArray(prods) ? prods : []);
                    } catch (e) {
                        console.warn('Failed to load products for category from backend', e);
                        setProducts([]);
                    }
                } else {
                    // fallback: no such category on backend
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
        <div className="showcard-container">
            {/* <div className="showcard-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h2 className="showcard-title">
                    {categoryName ? `Products — ${categoryName}` : 'Products'}
                </h2>
            </div> */}

            {loading ? (
                <div className="loading-message">
                    <p>Loading products…</p>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-message">
                    <p>No products found for this category.</p>
                </div>
            ) : (
                <ProductList products={products} />
            )}
        </div>
    );
}