import { Routes, Route } from "react-router-dom";
import Home from '../Pages/Home';
import Carts from '../Pages/Carts';
import Loader from '../Components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Wishlist from '../Pages/Wishlist';
import Auth from '../Pages/Auth';
import { Navigate } from 'react-router-dom';
import Profile from '../Pages/Profile';
import React from 'react'

// Application routes
const AppRoutes = () => {
  const navigate = useNavigate();
  const handleLoaderComplete = () => {
    navigate('/home');
  };
  // Debug: log component types to spot undefined imports causing 'Element type is invalid'
  // eslint-disable-next-line no-console
  console.warn('Routes debug:', {
    HomeType: typeof Home,
    CartsType: typeof Carts,
    LoaderType: typeof Loader,
    AboutType: typeof About,
    ContactType: typeof Contact,
    WishlistType: typeof Wishlist,
    AuthType: typeof Auth,
    ProfileType: typeof Profile,
  });
  return (
    <Routes>
      {/* Root redirects to /home — App-level loader handles the initial loading UI */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
  <Route path="/cart" element={<Carts />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
  <Route path="/wishlist" element={<Wishlist />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/signin" element={<Navigate to="/auth?mode=signin" replace />} />
  <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
  <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;