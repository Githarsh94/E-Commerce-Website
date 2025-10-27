import React from 'react'
import './Hero2.css'

const Hero2 = () => {
  return (
    <div className="main">
        <div className="part1">
            <div className="part1-image">
                <img src="Women.jpg" alt="" />
            </div>
            <div className="part1-text">
                <h4>New Arrivals</h4>
                <h2>Women's Style</h2>
                <h3>Up to 70% off</h3>
                <button>Shop Now</button>
            </div>
        </div>
        <div className="part2">
            <div className="part2-two">
                <div className="part2-two-first">
                    <h4>25% OFF</h4>
                    <h2>HANDBAG</h2>
                    <h3>Shop Now</h3>
                    <div className="part2-two-first-image">
                        <img src="handbag.jpg" alt="" />
                    </div>
                </div>
                <div className="part2-two-second">
                    <h4>35% OFF</h4>
                    <h2>Men's Watch</h2>
                    <h3>Shop Now</h3>
                    <div className="part2-two-second-image">
                        <img src="watch.jpeg" alt="" />
                    </div>
                </div>
            </div>
            <div className="part2-one">
                <div className="part2-one-main-text">
                    <h3>Accessories</h3>
                    <h2>BackPack</h2>
                    <h4 id="min">Min.40-70% OFF</h4>
                    <h4 id="shop">Shop Now</h4>
                </div>
                <div className="part2-one-image">
                    <div className="backpack">
                        <img src="backpack.png" alt="" />
                    </div>
                    <div className='part2-one-image-text'>
                        <p>Designed for Comfort and Durability.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero2