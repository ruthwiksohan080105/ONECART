import { useContext } from "react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";

import { CartContext } from "../context/CartContext.js";
import "./Wishlist.css";

function Wishlist() {
  const {
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    removeFromWishlist,
    addToCart,
  } = useContext(CartContext);

  if (!wishlistOpen) return null;

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="wishlist-overlay" onClick={() => setWishlistOpen(false)}>
      <div
        className="wishlist-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="wishlist-header">
          <div>
            <h2>My Wishlist</h2>
            <p>{wishlist.length} saved products</p>
          </div>

          <button
            className="wishlist-close"
            onClick={() => setWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            <X size={23} />
          </button>
        </div>

        {/* Wishlist Products */}
        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <Heart size={48} />

              <h3>Your wishlist is empty</h3>

              <p>Save your favourite products and find them here.</p>

              <button onClick={() => setWishlistOpen(false)}>
                EXPLORE PRODUCTS
              </button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div className="wishlist-item" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="wishlist-details">
                  <span>{product.category}</span>

                  <h3>{product.name}</h3>

                  <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                  <button
                    className="wishlist-add-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingBag size={15} />
                    ADD TO CART
                  </button>
                </div>

                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="wishlist-footer">
            <button onClick={() => setWishlistOpen(false)}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
