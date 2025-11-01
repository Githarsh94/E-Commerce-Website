import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gsap } from 'gsap';
import './AdminNavbar.css';

interface AdminNavbarProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export default function AdminNavbar({ activeRoute, onNavigate }: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    gsap.from('.admin-nav', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'categories', label: 'Categories' },
    { id: 'add-category', label: 'Add Category' },
    { id: 'shipments', label: 'Shipments' }
  ];

  return (
    <nav className="admin-nav">
      <div className="admin-nav-container">
        <div className="admin-nav-content">
          <div className="admin-brand">Admin Panel</div>

          <div className="admin-nav-desktop">
            {navItems.map((item) => {
                const routeMap: Record<string, string> = {
                  // Dashboard should navigate to AdminHome
                  dashboard: '/admin',
                  categories: '/admin/categories',
                  'add-category': '/admin/AddCategory',
                  shipments: '/admin/shipments'
                };
                const path = routeMap[item.id] || '/admin';
                return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id);
                    navigate(path);
                  }}
                  className={`admin-nav-link ${ (activeRoute ?? '') === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              )})}
            <div className="admin-actions">
              <button
                className="admin-logout"
                onClick={() => {
                  try {
                    logout();
                  } finally {
                    navigate('/');
                  }
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <button
            className="admin-nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="admin-nav-mobile">
            {navItems.map((item) => {
              const routeMap: Record<string, string> = {
                dashboard: '/admin',
                categories: '/admin/categories',
                'add-category': '/admin/AddCategory',
                shipments: '/admin/shipments'
              };
              const path = routeMap[item.id] || '/admin';
              return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate?.(item.id);
                  setIsMobileMenuOpen(false);
                  navigate(path);
                }}
                className={`admin-nav-mobile-link ${(activeRoute ?? '') === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            )})}
            <button
              onClick={() => {
                try { logout(); } finally { setIsMobileMenuOpen(false); navigate('/'); }
              }}
              className="admin-nav-mobile-link admin-logout"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
