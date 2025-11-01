import { useEffect, useRef } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import gsap from 'gsap';
import './ProductCard.css';

interface ProductCardProps {
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  totalRatings: number;
  totalReviews: number;
}

const ProductCard = ({
  name,
  image,
  description,
  price,
  rating,
  totalRatings,
  totalReviews,
}: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;
    const buttons = buttonsRef.current;

    if (!card || !img || !buttons) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.03,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(img, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(buttons, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(img, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(buttons, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const getStarColor = (rating: number): string => {
    if (rating <= 2) return '#ef4444';
    if (rating < 3.5) return '#eab308';
    return '#22c55e';
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starColor = getStarColor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={16}
            fill={starColor}
            color={starColor}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="star-half">
            <Star size={16} color="#d1d5db" />
            <div className="star-half-fill">
              <Star size={16} fill={starColor} color={starColor} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} size={16} color="#d1d5db" />
        );
      }
    }

    return stars;
  };

  return (
    <div ref={cardRef} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          ref={imageRef}
          src={image}
          alt={name}
          className="product-card-image"
        />
      </div>

      <div className="product-card-content">
        <h3 className="product-card-name">{name}</h3>

        <p className="product-card-description">{description}</p>

        <div className="product-card-rating">
          <div className="product-card-rating-box">
            <span className="product-card-rating-value" style={{ color: getStarColor(rating) }}>
              {rating}
            </span>
            <div className="star-container">
              {renderStars()}
            </div>
          </div>
          <span className="product-card-rating-text">
            {totalRatings.toLocaleString()} ratings & {totalReviews} reviews
          </span>
        </div>

        <div className="product-card-price">
          <span className="product-card-price-value">
            ₹{price.toLocaleString()}
          </span>
        </div>

        <div ref={buttonsRef} className="product-card-buttons">
          <button className="product-card-btn-add-cart">
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
          <button className="product-card-btn-wishlist">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
