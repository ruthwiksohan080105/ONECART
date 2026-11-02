import { useContext } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

import { CartContext } from "../context/CartContext.js";
import "./Cart.css";

function Cart() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    setCheckoutOpen,
    stockMessage,
  } = useContext(CartContext);

  if (!cartOpen) return null;

  return (
    <div className="cart-overlay" onClick={() => setCartOpen(false)}>
      <div className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div>
            <h2>Your Shopping Bag</h2>
            <p>{cart.length} different products</p>
          </div>

          <button
            className="close-cart"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            <X />
          </button>
        </div>

        {/* Cart Products */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <ShoppingBag size={42} strokeWidth={1.3} />
              </div>

              <span className="empty-cart-label">YOUR SHOPPING BAG</span>

              <h3>Your cart is waiting.</h3>

              <p>
                Looks like you haven't added anything yet. Discover something
                special and make it yours.
              </p>

              <button
                onClick={() => {
                  setCartOpen(false);
                  document.getElementById("trending")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                EXPLORE PRODUCTS →
              </button>

              <span className="empty-cart-footer">
                GOOD FINDS. GREAT CHOICES. ONECART.
              </span>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>

                  <p className="cart-item-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  {/* Stock Availability */}
                  {Number(item.stock) <= 0 ? (
                    <p className="cart-stock-unavailable">Out of stock</p>
                  ) : Number(item.stock) <= 5 ? (
                    <p className="cart-stock-low">
                      Only {item.stock} left in stock
                    </p>
                  ) : (
                    <p className="cart-stock-available">In stock</p>
                  )}

                  <div className="quantity-controls">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={
                        item.quantity >= Number(item.stock) ||
                        Number(item.stock) <= 0
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <strong>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stock Notification */}
        {stockMessage && cart.length > 0 && (
          <div className="cart-stock-notification">⚠️ {stockMessage}</div>
        )}

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
            </div>

            <p className="shipping-note">
              Shipping and taxes calculated at checkout.
            </p>

            <button
              className="checkout-btn"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            >
              PROCEED TO CHECKOUT
            </button>

            <button
              className="continue-shopping"
              onClick={() => setCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
