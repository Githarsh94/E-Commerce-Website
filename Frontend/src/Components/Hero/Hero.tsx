import React from "react";
import * as RiIcons from "react-icons/ri"; // Icons
import "./Hero.css";
import { useNavigate } from "react-router-dom";
const HeroSection: React.FC = () => {
    const navigate = useNavigate();

  // Sanity checks for react-icons to produce clearer errors
  // If any icon is missing, throw an explicit error instead of letting React render an undefined element
  if (!RiIcons || typeof RiIcons.RiTruckLine !== 'function' || typeof RiIcons.RiShieldCheckLine !== 'function' || typeof RiIcons.RiRefund2Line !== 'function' || typeof RiIcons.RiHeadphoneLine !== 'function') {
    throw new Error('Hero: expected react-icons/ri exports (RiTruckLine, RiShieldCheckLine, RiRefund2Line, RiHeadphoneLine) to be available.');
  }

    function handleLearn(){
        navigate("/about");
    }
  return (
    <div className="hero-section">
        <div className="hero-content">
        {/* Left Text Section */}
            <div className="hero-text">
                <div className="hero-text-main">
                    <h2>Season Style</h2>
                    <h1>Winter's Fashion</h1>
                    <h3>Min. 35-70% Off</h3>
                </div>
                <div className="hero-buttons">
                    <button className="btn-primary">Shop Now</button>
                    <button className="btn-secondary" onClick={()=>handleLearn()}>Learn More</button>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="hero-image">
            <img
                src="/hero-man.png"
                alt="Men Fashion"
            />
            </div>
        </div>
        <div className="hero-features">
            <div className="feature">
              <span className="icon"><RiIcons.RiTruckLine size={40} /></span>
              <span>Free Shipping</span>
            </div>
            <div className="feature">
              <span className="icon"><RiIcons.RiShieldCheckLine size={40} /></span>
              <span>Secure Payment</span>
            </div>
            <div className="feature">
              <span className="icon"><RiIcons.RiRefund2Line size={40} /></span>
              <span>100% Money Back</span>
            </div>
            <div className="feature">
              <span className="icon"><RiIcons.RiHeadphoneLine size={40} /></span>
              <span>Online Support</span>
            </div>
        </div>
    </div>
  );
};

export default HeroSection;

