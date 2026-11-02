import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";
import { OrderContext } from "../context/OrderContext.js";
import { ProductContext } from "../context/ProductContext.js";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
} from "lucide-react";

import "./Checkout.css";

function Checkout() {
  const { cart, cartTotal, checkoutOpen, setCheckoutOpen, clearCart } =
    useContext(CartContext);
  const { addOrder } = useContext(OrderContext);
  const { deductStock } = useContext(ProductContext);

  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  const deliveryCharge = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + deliveryCharge;

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (event) => {
    setCustomer({
      ...customer,
      [event.target.name]: event.target.value,
    });
  };

  const handleOrder = (event) => {
    event.preventDefault();

    if (cart.length === 0) return;

    // Validate and deduct available stock
    const stockDeducted = deductStock(cart);

    if (!stockDeducted) {
      setCheckoutError(
        "Some products are no longer available in the requested quantity. Please review your cart.",
      );
      return;
    }

    setCheckoutError("");

    const orderDetails = {
      customer: { ...customer },
      items: cart.map((item) => ({ ...item })),
      subtotal: cartTotal,
      deliveryCharge: deliveryCharge,
      total: grandTotal,
      paymentMethod: payment,
    };

    const newOrder = addOrder(orderDetails);

    setPlacedOrder(newOrder);
    setOrderPlaced(true);

    clearCart();
  };

  if (!checkoutOpen) return null;

  if (orderPlaced) {
    return (
      <div className="checkout-overlay">
        <div className="order-success">
          <CheckCircle size={65} color="#aa8956" />

          <h1>Order Placed!</h1>

          <p>
            Thank you for shopping with ONECART. Your demo order has been placed
            successfully.
          </p>

          {placedOrder && (
            <div className="order-id-display">
              <span>YOUR ORDER ID</span>
              <h3>{placedOrder.id}</h3>
              <p>Order Status: {placedOrder.status}</p>
            </div>
          )}

          <button
            onClick={() => {
              setOrderPlaced(false);
              setCheckoutOpen(false);
              setPlacedOrder(null);
            }}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-overlay">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button
            className="back-to-cart"
            onClick={() => setCheckoutOpen(false)}
          >
            <ArrowLeft size={17} />
            BACK TO SHOPPING
          </button>

          <h1>
            ONE<span>CART</span>
          </h1>

          <div className="secure-label">
            <ShoppingBag size={15} />
            SECURE CHECKOUT
          </div>
        </div>

        <div className="checkout-title">
          <span>ALMOST YOURS</span>
          <h2>
            Complete Your <em>Order.</em>
          </h2>
          <p>Just a few details before your purchase.</p>
        </div>

        <form onSubmit={handleOrder}>
          <div className="checkout-grid">
            {/* Left Column */}
            <div className="checkout-form-section">
              {/* Customer Details */}
              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <MapPin size={20} />
                  <h3>Delivery Information</h3>
                </div>

                <div className="form-fields">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={customer.name}
                    onChange={handleChange}
                    required
                  />

                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={handleChange}
                    required
                  />

                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    pattern="[6-9][0-9]{9}"
                    value={customer.phone}
                    onChange={handleChange}
                    required
                  />

                  <label>Full Address</label>
                  <textarea
                    name="address"
                    placeholder="House number, street, area"
                    value={customer.address}
                    onChange={handleChange}
                    required
                  />

                  <div className="address-row">
                    <div>
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={customer.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={customer.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit PIN code"
                    pattern="[0-9]{6}"
                    value={customer.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <CreditCard size={20} />
                  <h3>Payment Method</h3>
                </div>

                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={payment === "cod"}
                      onChange={(e) => setPayment(e.target.value)}
                    />

                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when your order arrives.</p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={payment === "upi"}
                      onChange={(e) => setPayment(e.target.value)}
                    />

                    <div>
                      <strong>UPI Payment</strong>
                      <p>Demo selection only. No payment processed.</p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={payment === "card"}
                      onChange={(e) => setPayment(e.target.value)}
                    />

                    <div>
                      <strong>Credit / Debit Card</strong>
                      <p>Demo selection only. No payment processed.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="order-summary">
              <div className="checkout-card">
                <h3>Your Order Summary</h3>

                <p className="summary-count">
                  {cart.length} different products
                </p>

                <div className="summary-products">
                  {cart.map((item) => (
                    <div className="summary-product" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div>
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>

                      <strong>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="summary-calculations">
                  <div>
                    <span>Subtotal</span>
                    <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </strong>
                  </div>

                  <div className="grand-total">
                    <span>Total Amount</span>
                    <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                {checkoutError && (
                  <div className="checkout-stock-error">⚠️ {checkoutError}</div>
                )}

                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={cart.length === 0}
                >
                  PLACE YOUR ORDER →
                </button>

                <p className="checkout-disclaimer">
                  This is a frontend demo. No real payment or order processing
                  is performed.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
