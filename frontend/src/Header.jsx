import { Link } from "react-router-dom";


function Header() {
  return (
    <>
      {/* TOP HEADER */}
      <div className="top-header">
        <h2>🌱 KrishiRatna</h2>
      </div>

      {/* MENU STRIP */}
      <nav className="menu-strip">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/help">Help</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/news">News</Link>
      </nav>
    </>
  );
}

export default Header;
