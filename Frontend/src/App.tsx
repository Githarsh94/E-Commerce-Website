import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/footer';
import Nav from './Components/Nav';
import Background from './Components/Background';
import Categories from './Components/Categories'; 
function App() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const handleFooterToggle = () => {
    setIsHeaderVisible(!isHeaderVisible);
    setIsFooterVisible(!isFooterVisible);
  };
  return (
    <div className="App">
      {/* {isHeaderVisible && <Header handleFooterToggle={handleFooterToggle} />}
      {isFooterVisible && <Footer />} */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <Nav />
      <Background />
      <Categories/>
      <Categories/>
      <Footer />
    </div>
  );
}

export default App;
