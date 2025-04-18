import 'remixicon/fonts/remixicon.css';

interface NavProps {
    handleComponentChange: (component: string) => void;
}

function Nav({ handleComponentChange }: NavProps) {
    return (
        <nav>
            <div id="nav-parent">
                <h1>EazyCart</h1>
                <h2>&copy;</h2>
                <h3>Makes Easy</h3>
                <h4 onClick={() => handleComponentChange('home')}>Home</h4>
                <h4 onClick={() => handleComponentChange('cart')}>Cart</h4>
                <input type="text" placeholder="Search for items, brands and grocery" />
                <h4 onClick={() => handleComponentChange('about')}>About</h4>
                <h4 onClick={() => handleComponentChange('contact')}>Contact Us</h4>
                <i className="ri-login-circle-fill"></i>
            </div>
        </nav>
    );
}

export default Nav;