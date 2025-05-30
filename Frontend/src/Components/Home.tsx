import { useLenis } from '../hooks/useLenis';
import Categories from './Categories';
import Cards from './Cards';
import CursorBubble from './CursorBubble';
import Wishlist from './Wishlist';

interface HomeProps {
    searchTerm: string;
}

function Home({ searchTerm }: HomeProps) {
    useLenis();
    return (
        <div>
            <Wishlist />
            <CursorBubble />
            <Cards searchTerm={searchTerm} />
            <Categories />
        </div>
    );

}

export default Home;