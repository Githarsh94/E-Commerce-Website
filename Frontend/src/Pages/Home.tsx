import React, { useState } from 'react';
import Categories from '../Components/Categories/Categories';
import Wishlistbutton from '../Components/Wishlistbutton/Wishlistbutton';
import Hero from '../Components/Hero/Hero'; 
import Hero2 from '../Components/Hero2/Hero2';
import useHomeAnimation from '../hooks/useHomeAnimation';
import Nav from '../Components/Nav/Nav';
import Footer from '../Components/Footer/Footer';

const Home = () => {
  // Runtime sanity checks to catch undefined imports early
  if (typeof Hero === 'undefined') throw new Error('Home: Hero component is undefined');
  if (typeof Hero2 === 'undefined') throw new Error('Home: Hero2 component is undefined');
  if (typeof Wishlistbutton === 'undefined') throw new Error('Home: Wishlistbutton component is undefined');
  if (typeof Categories === 'undefined') throw new Error('Home: Categories component is undefined');

  // run the homepage animation hook
  useHomeAnimation();

  return (
    <div>
      <Hero />
      <Hero2 />
      <Wishlistbutton />
      <Categories />
    </div>
  );
}

export default Home;
