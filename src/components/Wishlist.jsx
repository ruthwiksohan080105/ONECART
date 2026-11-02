import { useContext } from "react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";

import { CartContext } from "../context/CartContext.js";
import { ProductContext } from "../context/ProductContext.js";
import "./Wishlist.css";

function Wishlist() {
  const {
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    removeFromWishlist,
    addToCart,
    stockMessage,
  } = useContext(CartContext);

  const { products } = useContext(ProductContext);

  if (!wishlistOpen) return null;

  // Always display the latest product information
  const syncedWishlist = wishlist
    .map((savedItem) => products.find((product) => product.id === savedItem.id))
    .filter(Boolean);

  // Add to cart and remove from wishlist only on success
  const handleAddToCart = (product) => {
    const added = addToCart(product);

    if (added) {
      removeFromWishlist(product.id);
    }
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
            <p>{syncedWishlist.length} saved products</p>
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
          {syncedWishlist.length === 0 ? (
            <div className="wishlist-empty">
              <Heart size={48} />

              <h3>Your wishlist is empty</h3>

              <p>Save your favourite products and find them here.</p>

              <button onClick={() => setWishlistOpen(false)}>
                EXPLORE PRODUCTS
              </button>
            </div>
          ) : (
            syncedWishlist.map((product) => (
              <div className="wishlist-item" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="wishlist-details">
                  <span>{product.category}</span>

                  <h3>{product.name}</h3>

                  <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                  {/* Stock Availability */}
                  {Number(product.stock) <= 0 ? (
                    <p className="wishlist-stock-out">OUT OF STOCK</p>
                  ) : Number(product.stock) <= 5 ? (
                    <p className="wishlist-stock-low">
                      Only {product.stock} left in stock
                    </p>
                  ) : (
                    <p className="wishlist-stock-available">In stock</p>
                  )}

                  <button
                    className="wishlist-add-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={Number(product.stock) <= 0}
                  >
                    <ShoppingBag size={15} />

                    {Number(product.stock) <= 0
                      ? "OUT OF STOCK"
                      : "MOVE TO CART"}
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

        {/* Stock Notification */}
        {stockMessage && syncedWishlist.length > 0 && (
          <div className="wishlist-stock-notification">⚠️ {stockMessage}</div>
        )}

        {/* Footer */}
        {syncedWishlist.length > 0 && (
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
