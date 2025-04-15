import 'remixicon/fonts/remixicon.css';

function Nav() {
    return (
        <nav>
            <div id="nav-parent">
                <h1>EazyCart</h1>
                <h2>&copy;</h2>
                <h3>Makes Easy</h3>
                <h4>Home</h4>
                <h4>Cart</h4>
                <input type="text" placeholder="Search for items,brands and grocery" />
                <h4>About</h4>
                <h4>Contact Us</h4>
                <i className="ri-login-circle-fill"></i>
            </div>
            
        </nav>
    )
}

export default Nav;