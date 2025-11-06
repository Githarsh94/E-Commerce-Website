import './Footer.css';

function Footer() {
    return (
        <footer id="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2>EazyCart</h2>
                    <p>Your go-to destination for hassle-free online shopping.</p>
                </div>

                <div className="footer-section-Details">
                    {/* <h3>Customer Service</h3> */}
                    <h4>Help Centre</h4>
                    <h4>Returns</h4>
                    <h4>Terms of Service</h4>
                    <h4>Privacy Policy</h4>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} EazyCart. All rights reserved.</p>
                <div className="social-icons">
                    <button type="button" className="social-link" aria-label="Facebook">
                        <i className="fab fa-facebook-f" />
                    </button>
                    <button type="button" className="social-link" aria-label="Twitter">
                        <i className="fab fa-twitter" />
                    </button>
                    <button type="button" className="social-link" aria-label="Instagram">
                        <i className="fab fa-instagram" />
                    </button>
                    <button type="button" className="social-link" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
