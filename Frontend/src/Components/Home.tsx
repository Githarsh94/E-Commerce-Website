import { useLenis } from '../hooks/useLenis';
import Categories from './Categories';
import Cards from './Cards';
import CursorBubble from './CursorBubble';
import Wishlist from './Wishlist';
function Home() {
    useLenis();
    return (
        <div>
            <Wishlist />
            <CursorBubble />
            <Cards />
            <Categories />
        </div>
    );

}

export default Home;