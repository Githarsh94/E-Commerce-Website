import { useState } from 'react';
import './App.css';
import Home from './Components/Home';
import Footer from './Components/footer';
import Nav from './Components/Nav';
import Background from './Components/Background';
import Cart from './Components/Cart';
import Loader from './Components/Loader';
import About from './Components/About';
import Contact from './Components/Contact';
import SearchResults from './Components/SearchResults';
import ErrorBoundary from './Components/ErrorBoundary';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

function App() {
  const [activeComponent, setActiveComponent] = useState('home');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
    // Reset search when navigating to other components
    if (component !== 'search') {
      setSearchTerm('');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // If search term is provided and user presses enter or selects a product, show search results
    if (term.trim()) {
      setActiveComponent('search');
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return (
          <ErrorBoundary>
            <Background url="/videoplayback.mp4" />
            <Home searchTerm="" />
          </ErrorBoundary>
        );
      case 'search':
        return (
          <ErrorBoundary>
            <Background url="/videoplayback.mp4" />
            <SearchResults searchTerm={searchTerm} />
          </ErrorBoundary>
        );
      case 'cart':
        return (
          <ErrorBoundary>
            <Background url="Cart.mp4" />
            <Cart />
          </ErrorBoundary>
        );
      case 'about':
        return (
          <ErrorBoundary>
            <Background url="/About.mp4" />
            <About />
          </ErrorBoundary>
        );
      case 'contact':
        return (
          <ErrorBoundary>
            <Background url="/Contact.mp4" />
            <Contact />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="App">
          {!loadingComplete ? (
            <Loader onComplete={() => setLoadingComplete(true)} />
          ) : (
            <>
              <ErrorBoundary>
                <Nav handleComponentChange={handleComponentChange} onSearch={handleSearch} />
              </ErrorBoundary>
              {renderComponent()}
              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </>
          )}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
