import { useState } from 'react';
import './App.css';
import Home from './Components/Home';
import Footer from './Components/footer';
import Nav from './Components/Nav';
import Background from './Components/Background';
import Card from './Components/Cards';
import Cart from './Components/Cart';
import Loader from './Components/Loader';
import About from './Components/About';
import Contact from './Components/Contact';

function App() {
  const [activeComponent, setActiveComponent] = useState('home');
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return (
          <div>
            <Background url="/videoplayback.mp4" />
            <Home />
          </div>
        );
      case 'cart':
        return (
          <div>
            <Background url="Cart.mp4" />
            <Cart 
              items={[]} 
              onRemove={() => { }} 
              onAdd={() => { }} 
              onDecrease={() => { }} 
            />
          </div>
        );
      case 'card':
        return <Card />;
      case 'about':
        return (
          <div>
            <Background url="/About.mp4" />
            <About />
          </div>
        );
      case 'contact':
        return (
          <div>
            <Background url="/Contact.mp4" />
            <Contact />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {!loadingComplete ? (
        <Loader onComplete={() => setLoadingComplete(true)} />
      ) : (
        <>
          <Nav handleComponentChange={handleComponentChange} />
          {renderComponent()}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
