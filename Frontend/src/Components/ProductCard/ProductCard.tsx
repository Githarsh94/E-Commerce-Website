import React from 'react';
import './ProductCard.css';
import { showSuccess, showConfirm, showError } from '../../utils/alert';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3002/api';

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    rating?: number;
    totalRatings?: number;
    totalReviews?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    image,
    description,
    price,
    rating = 0,
    totalRatings = 0,
    totalReviews = 0
}) => {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        // determine color according to rating thresholds
        const starColor = getStarColor(rating);
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="star-filled" style={{ color: starColor }}>★</span>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="star-half">
                        <span style={{ color: '#d1d5db' }}>★</span>
                        <span className="star-half-fill" style={{ color: starColor }}>★</span>
                    </span>
                );
            } else {
                stars.push(
                    <span key={i} className="star-empty" style={{ color: '#d1d5db' }}>★</span>
                );
            }
        }
        return stars;
    };

    const getRatingClass = (r: number) => {
        // include zero in the low bucket so 0.0 appears as low (red)
        if (r >= 0 && r < 2.5) return 'low';
        if (r >= 2.5 && r < 3.5) return 'mid';
        if (r >= 3.5) return 'high';
        return 'none';
    };

    const getStarColor = (r: number) => {
        // include zero as red per requested thresholds (0 - 2.5 => red)
        if (r >= 0 && r < 2.5) return '#ef4444'; // red
        if (r >= 2.5 && r < 3.5) return '#eab308'; // yellow
        if (r >= 3.5) return '#16a34a'; // green
        return '#9ca3af'; // fallback grey
    };

    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (!isAuthenticated) {
                const res = await showConfirm({ title: 'Sign in required', text: 'You need to sign in to add items to cart', confirmButtonText: 'Sign in' });
                if (res.isConfirmed) navigate('/auth?mode=signin');
                return;
            }

            const resp = await fetch(`${API_BASE}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    productId: id,
                    quantity: 1,
                    product: { name, description, price, image_url: image }
                })
            });

            if (!resp.ok) {
                const txt = await resp.text();
                try { await showError(txt || 'Failed to add to cart'); } catch (_) {}
                return;
            }

            try { await showSuccess('Added to cart'); } catch (_) {}
        } catch (err: any) {
            try { await showError(err?.message || 'Failed to add to cart'); } catch (_) {}
            // eslint-disable-next-line no-console
            console.error('Add to cart failed', err);
        }
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (!isAuthenticated) {
                const res = await showConfirm({ title: 'Sign in required', text: 'You need to sign in to use wishlist', confirmButtonText: 'Sign in' });
                if (res.isConfirmed) navigate('/auth?mode=signin');
                return;
            }

            // add to wishlist (server is source-of-truth)
            const resp = await fetch(`${API_BASE}/wishlist/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
                body: JSON.stringify({ productId: id, product: { name, description, price, image_url: image } })
            });
            if (!resp.ok) {
                const txt = await resp.text();
                try { await showError(txt || 'Failed to update wishlist'); } catch (_) {}
                return;
            }
            try { await showSuccess('Wishlist updated'); } catch (_) {}
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Wishlist toggle failed', err);
        }
    };

    return (
        <div className="product-card">
            <div className="product-card-image-wrapper">
                <img
                    src={image}
                    alt={name}
                    className="product-card-image"
                />
            </div>

            <div className="product-card-content">
                <h3 className="product-card-name">{name}</h3>
                <p className="product-card-description">{description}</p>

                <div className="product-card-rating">
                    <div className={`product-card-rating-box ${getRatingClass(rating)}`}>
                        <span
                            className="product-card-rating-value"
                            style={{ color: getStarColor(rating) }}
                        >
                            {rating.toFixed(1)}
                        </span>
                        <div className="star-container">
                            {renderStars()}
                        </div>
                    </div>
                    <span className="product-card-rating-text">
                        {totalRatings} ratings & {totalReviews} reviews
                    </span>
                </div>

                <div className="product-card-price">
                    <span className="product-card-price-value">₹{price.toLocaleString('en-IN')}</span>
                </div>

                <div className="product-card-buttons">
                    <button
                        className="product-card-btn-add-cart"
                        onClick={handleAddToCart}
                    >
                        <span>🛒</span>
                        Add to Cart
                    </button>
                    <button
                        className="product-card-btn-wishlist"
                        onClick={handleWishlist}
                    >
                        ♡
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;