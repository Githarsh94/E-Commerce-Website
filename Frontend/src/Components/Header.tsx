
function Header({ handleFooterToggle }: any) {

    const handleButton = () => {
        // alert("Button clicked!");
        // console.log("Button clicked!");
        handleFooterToggle();
    }
    return (
        <header>
            <h1>My E-commerce Store</h1>
            {/* <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/products">Products</a></li>
                    <li><a href="/cart">Cart</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
            </nav> */}
            <button onClick={handleButton}>Click me</button>
        </header>
    )
}

export default Header;