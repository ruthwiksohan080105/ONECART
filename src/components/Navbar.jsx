import { Search, UserRound, Heart, ShoppingBag, Menu } from "lucide-react";
import "./Navbar.css";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";

function Navbar({
  onAccountClick,
  currentUser,
  onLogout,
  onMyAccountClick,
  onAdminClick,
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { cartCount, setCartOpen, wishlist, setWishlistOpen } =
    useContext(CartContext);
  return (
    <>
      <div className="announcement-bar">Free shipping on orders above ₹999</div>

      <nav className="navbar">
        {/* Brand Logo */}
        <div className="nav-logo">
          ONE<span>CART</span>
          <small>EVERYTHING IN ONE PLACE</small>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#trending">Trending</a>
          <a href="#offers">Offers</a>
        </div>
        <button
          type="button"
          className="admin-nav-button"
          onClick={onAdminClick}
        >
          Admin Panel
        </button>

        {/* Search Bar */}
        <div className="nav-search">
          <Search size={18} />
          <input type="text" placeholder="Search products..." />
        </div>

        {/* Navigation Icons */}
        <div className="nav-icons">
          <button
            type="button"
            aria-label="Account"
            onClick={() => {
              if (currentUser) {
                setAccountMenuOpen(!accountMenuOpen);
              } else {
                onAccountClick();
              }
            }}
          >
            <UserRound />
            {currentUser ? currentUser.name : "Account"}
          </button>
          {accountMenuOpen && currentUser && (
            <div className="account-dropdown">
              <h3>{currentUser.name}</h3>
              <p>{currentUser.email}</p>

              <hr />

              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onMyAccountClick();
                }}
              >
                My Account
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}

          <button
            className="wishlist-icon"
            aria-label="Open wishlist"
            onClick={() => setWishlistOpen(true)}
          >
            <Heart />
            <span>{wishlist.length}</span>
          </button>
        </div>

        <button
          aria-label="Shopping cart"
          className="cart-icon"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag />
          <span>{cartCount}</span>
        </button>

        {/* Mobile Menu Icon */}
        <button className="mobile-menu" aria-label="Open menu">
          <Menu />
        </button>
      </nav>
    </>
  );
}

export default Navbar;
