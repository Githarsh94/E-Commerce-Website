import {useLenis} from '../hooks/useLenis';
import Categories from './Categories';
import Card from './Cards';
import React from 'react';
import CursorBubble from './CursorBubble';
function Home() {
    useLenis();
    return (
        <div>
            <CursorBubble />
            <Card/>
            <Categories />
        </div>
    );

}

export default Home;