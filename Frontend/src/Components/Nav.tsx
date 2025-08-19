import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
// At the top of your Nav.tsx
import type { FC } from 'react';
import {
  SignInButton,
  UserButton,
  SignedIn as SignedInComponent,
  SignedOut as SignedOutComponent,
} from '@clerk/clerk-react';

const SignedIn = SignedInComponent as FC<{ children?: React.ReactNode }>;
const SignedOut = SignedOutComponent as FC<{ children?: React.ReactNode }>;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface NavProps {
  handleComponentChange: (component: string) => void;
  onSearch: (searchTerm: string) => void;
}

function Nav({ handleComponentChange, onSearch }: NavProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const handleNavClick = (component: string) => {
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
    handleComponentChange(component);
  };

  // Fetch all products for search
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Check if backend URL is available
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        
        if (backendUrl) {
          // Try to fetch from API first
          const categoriesResponse = await fetch(`${backendUrl}/api/categories`);
          
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            
            if (Array.isArray(categoriesData)) {
              let allProductsList: Product[] = [];
              
              for (const category of categoriesData) {
                try {
                  const productsResponse = await fetch(`${backendUrl}/api/products/${category.id}`);
                  if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    if (Array.isArray(productsData)) {
                      allProductsList = [...allProductsList, ...productsData];
                    }
                  }
                } catch (error) {
                  console.warn(`Failed to fetch products for category ${category.id}:`, error);
                }
              }
              
              // Remove duplicates based on product name (case-insensitive) and keep the first occurrence
              const uniqueProducts = allProductsList.filter((product, index, self) => 
                index === self.findIndex(p => p.name.toLowerCase() === product.name.toLowerCase())
              );
              
              setAllProducts(uniqueProducts);
              return; // Success, exit early
            }
          }
        }
        
        // Fallback to local data if backend is not available
        const response = await fetch('/data/categories.json');
        const data = await response.json();
        let allProductsList: Product[] = [];
        
        data.forEach((categoryData: any) => {
          if (categoryData.products) {
            allProductsList = [...allProductsList, ...categoryData.products];
          }
        });
        
        // Remove duplicates based on product id
        const uniqueProducts = allProductsList.filter((product, index, self) => 
          index === self.findIndex(p => p.id === product.id)
        );
        
        setAllProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products for search:', error);
        // Fallback to local data
        try {
          const response = await fetch('/data/categories.json');
          const data = await response.json();
          let allProductsList: Product[] = [];
          
          data.forEach((categoryData: any) => {
            if (categoryData.products) {
              allProductsList = [...allProductsList, ...categoryData.products];
            }
          });
          
          // Remove duplicates based on product id
          const uniqueProducts = allProductsList.filter((product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
          );
          
          setAllProducts(uniqueProducts);
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
        }
      }
    };

    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);

    if (value.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
    } else {
      // Filter products that start with the search term (case-insensitive)
      // Keep products unique by ID, but allow same names with different IDs
      const filtered = allProducts
        .filter(product => 
          product.name.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 5); // Just limit to 5, keeping ID-based uniqueness
      
      setSearchResults(filtered);
      setShowDropdown(true);
    }
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim() === '') {
      // Show first 5 products when clicked without search term (based on product ID)
      const uniqueProducts = allProducts.slice(0, 5);
      setSearchResults(uniqueProducts);
      setShowDropdown(true);
    } else {
      // If there's already a search term, filter and show results
      const filtered = allProducts
        .filter(product => 
          product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      
      setSearchResults(filtered);
      setShowDropdown(true);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSearchTerm(product.name);
    onSearch(product.name);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearch(searchTerm);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleDocumentClick = () => setShowDropdown(false);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Initialize Shery.js effects
  useEffect(() => {
    const initializeSheryEffects = () => {
      try {
        // Import Shery dynamically to avoid module errors
        import('sheryjs').then((Shery: any) => {
          // Initialize mouse follower globally
          Shery.default.mouseFollower({
            skew: true,
            ease: "cubic-bezier(0.23, 1, 0.320, 1)",
            duration: 1,
          });

          // Apply stronger magnet effect to navigation links only
          Shery.default.makeMagnet(".magnet-target", {
            ease: "cubic-bezier(0.23, 1, 0.320, 1)",
            duration: 1,
             strength: 3,   // default is ~1, increase for stronger pull
             distance: 200  // increase area of effect (default is ~100)
          });
          
        }).catch((error) => {
          // Shery.js failed to load
        });
      } catch (error) {
        // Shery.js initialization failed
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initializeSheryEffects, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo magnet-target">
          <h1>EazyCart</h1>
          <span className="logo-symbol">&copy;</span>
          <span className="logo-tagline">Makes Easy</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <button className="nav-link magnet-target" onClick={() => handleNavClick('home')}>
            Home
          </button>
          <button className="nav-link magnet-target" onClick={() => handleNavClick('cart')}>
            Cart
          </button>
        </div>

        {/* Search Bar */}
        <div className="nav-search" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Search for items, brands and grocery"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onFocus={handleSearchFocus}
            onKeyPress={handleKeyPress}
          />
          {showDropdown && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="search-item"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img src={product.image_url} alt={product.name} />
                    <div className="search-item-details">
                      <h4>{product.name}</h4>
                      <p>₹{product.price}</p>
                    </div>
                  </div>
                ))
              ) : searchTerm.trim() !== '' ? (
                <div className="search-no-results">
                  <p>Item not found</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Side Links */}
        <div className="nav-right">
          <button className="nav-link magnet-target" onClick={() => handleNavClick('about')}>
            About
          </button>
          <button className="nav-link magnet-target" onClick={() => handleNavClick('contact')}>
            Contact Us
          </button>

          {/* Auth Controls */}
          <div className="nav-auth">
            <SignedOut>
              <SignInButton mode="modal">
                <i
                  className="ri-login-circle-fill nav-auth-icon magnet-target"
                  title="Login"
                ></i>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
