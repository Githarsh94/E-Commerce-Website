import { useState } from 'react';
import './App.css';
import Home from './Components/Home';
import Footer from './Components/footer';
import Nav from './Components/Nav';
import Background from './Components/Background';

function App() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHomeVisible, setIsHomeVisible] = useState(true);

  const handleFooterToggle = () => {
    setIsHeaderVisible(!isHeaderVisible);
    setIsFooterVisible(!isFooterVisible);
  };
  return (
    <div className="App">
      <Nav />
      <Background />
      {isHomeVisible && <Home />}

      <Footer />
    </div>
  );
}

export default App;
