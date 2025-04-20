import {useLenis} from '../hooks/useLenis';
import Categories from './Categories';
import Card from './Cards';
import React from 'react';
import CursorBubble from './CursorBubble';
import Wishlist from './Wishlist';
function Home() {
    useLenis();
    return (
        <div>
            <Wishlist />
            <CursorBubble />
            <Card/>
            <Categories />
        </div>
    );

}

export default Home;