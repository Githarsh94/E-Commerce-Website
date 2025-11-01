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
import AdminHome from '../Pages/AdminHome';
import { useAuth } from '../context/AuthContext';
import AdminCategories from '../Pages/AdminCategories';
import AdminShipment from "../Pages/AdminShipment";
import AddCategory from "../Pages/AddCategory";
import CategoryDescription from "../Pages/categoryDescription";
import React from 'react'

// Application routes
const AppRoutes = () => {
  const navigate = useNavigate();
  const handleLoaderComplete = () => {
    navigate('/home');
  };
  // Read auth state at top-level so hooks are called in the same order every render
  const { isAuthenticated, role } = useAuth();
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
  const rootElement = isAuthenticated && role === 'admin' ? <AdminHome /> : <Home />;

  return (
    <Routes>
      {/* Root renders Home by default; Admins see AdminHome when signed in */}
      <Route path="/" element={rootElement} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Carts />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signin" element={<Navigate to="/auth?mode=signin" replace />} />
      <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
      <Route path="/profile" element={<Profile />} />
  <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/AddCategory" element={<AddCategory />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/shipments" element={<AdminShipment />} />
      <Route path="/admin/category-description" element={<CategoryDescription />} />
    </Routes>
  );
}

export default AppRoutes;