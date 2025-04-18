import { useState } from 'react';
import './App.css';
import Home from './Components/Home';
import Footer from './Components/footer';
import Nav from './Components/Nav';
import Background from './Components/Background';
import Card from './Components/Cards';
import Cart from './Components/Cart';

function App() {
  const [activeComponent, setActiveComponent] = useState('home');

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <div>
          <Background url="/videoplayback.mp4" />
          <Home />
        </div>;
      case 'cart':
        return <div>
          <Background url="/86.jpg" />
          <Cart items={[]} onRemove={() => { }} />
        </div>;
      case 'card':
        return <Card />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Nav handleComponentChange={handleComponentChange} />
      {renderComponent()}
      <Footer />
    </div>
  );
}

export default App;
