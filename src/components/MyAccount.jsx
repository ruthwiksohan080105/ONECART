import { useState, useContext } from "react";
import {
  UserRound,
  Package,
  Settings,
  LogOut,
  ArrowLeft,
  Eye,
  MapPin,
  CreditCard,
  CalendarDays,
  XCircle,
  CheckCircle2,
  Pencil,
  Save,
  X,
} from "lucide-react";

import "./MyAccount.css";
import { OrderContext } from "../context/OrderContext.js";

function MyAccount({ currentUser, onBack, onLogout, onUpdateUser }) {
  const { orders, updateOrderStatus } = useContext(OrderContext);

  const [activeTab, setActiveTab] = useState("profile");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
  });

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();

    const name = profileForm.name.trim();
    const email = profileForm.email.trim();

    if (!name || !email) {
      setProfileError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    onUpdateUser({ name, email });

    setProfileForm({ name, email });
    setProfileError("");
    setProfileSuccess("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleProfileCancel = () => {
    setProfileForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
    });

    setProfileError("");
    setProfileSuccess("");
    setIsEditing(false);
  };

  const statuses = ["Placed", "Processing", "Shipped", "Delivered"];

  const handleCancelOrder = (order) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel order ${order.id}?`,
    );

    if (!confirmed) return;

    updateOrderStatus(order.id, "Cancelled");
    setSelectedOrder(null);
  };

  const formatPrice = (amount) => Number(amount || 0).toLocaleString("en-IN");

  const getAddress = (customer) => {
    if (!customer) return "Address not available";

    return (
      [customer.address, customer.city, customer.state, customer.pincode]
        .filter(Boolean)
        .join(", ") || "Address not available"
    );
  };

  const renderTimeline = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="cancelled-timeline">
          <XCircle size={22} />
          <div>
            <strong>Order Cancelled</strong>
            <p>This order has been cancelled.</p>
          </div>
        </div>
      );
    }

    const currentIndex = statuses.indexOf(status);

    return (
      <div className="order-tracking">
        {statuses.map((step, index) => {
          const completed = currentIndex >= index;
          const active = currentIndex === index;

          return (
            <div
              key={step}
              className={`tracking-step ${completed ? "completed" : ""} ${
                active ? "current" : ""
              }`}
            >
              <div className="tracking-dot">
                {completed && <CheckCircle2 size={12} />}
              </div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="account-page">
      <button
        className="account-back"
        onClick={() => {
          if (selectedOrder) {
            setSelectedOrder(null);
          } else {
            onBack();
          }
        }}
      >
        <ArrowLeft size={17} />
        {selectedOrder ? "BACK TO ORDERS" : "BACK TO SHOPPING"}
      </button>

      <div className="account-heading">
        <span>ONECART CUSTOMER AREA</span>
        <h1>My Account</h1>
        <p>Manage your personal information and orders.</p>
      </div>

      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-user">
            <div className="account-avatar">
              <UserRound size={28} />
            </div>

            <h3>{currentUser.name}</h3>
            <p>{currentUser.email}</p>
          </div>

          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => {
              setActiveTab("profile");
              setSelectedOrder(null);
            }}
          >
            <UserRound size={18} />
            My Profile
          </button>

          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => {
              setActiveTab("orders");
              setSelectedOrder(null);
            }}
          >
            <Package size={18} />
            My Orders
          </button>

          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => {
              setActiveTab("settings");
              setSelectedOrder(null);
            }}
          >
            <Settings size={18} />
            Settings
          </button>

          <button className="account-logout" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="account-content">
          {activeTab === "profile" && (
            <div>
              <div className="profile-heading">
                <div>
                  <h2>Personal Information</h2>
                  <p className="account-subtitle">
                    Manage your personal details.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    className="edit-profile-btn"
                    onClick={() => {
                      setProfileSuccess("");
                      setIsEditing(true);
                    }}
                  >
                    <Pencil size={15} />
                    Edit Profile
                  </button>
                )}
              </div>

              {profileSuccess && (
                <p className="profile-success">{profileSuccess}</p>
              )}

              {isEditing ? (
                <form
                  className="profile-edit-form"
                  onSubmit={handleProfileSave}
                >
                  <div>
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  {profileError && (
                    <p className="profile-error">{profileError}</p>
                  )}

                  <div className="profile-form-actions">
                    <button type="submit" className="save-profile-btn">
                      <Save size={15} />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="cancel-edit-btn"
                      onClick={handleProfileCancel}
                    >
                      <X size={15} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="account-info-grid">
                  <div>
                    <label>Full Name</label>
                    <p>{currentUser.name}</p>
                  </div>

                  <div>
                    <label>Email Address</label>
                    <p>{currentUser.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              {selectedOrder ? (
                <div className="order-details-page">
                  <h2>Order Details</h2>
                  <p className="account-subtitle">
                    Complete information about your purchase.
                  </p>

                  <div className="order-detail-top">
                    <div>
                      <label>ORDER ID</label>
                      <h3>{selectedOrder.id}</h3>
                    </div>

                    <span className="order-status">{selectedOrder.status}</span>
                  </div>

                  <div className="order-detail-meta">
                    <div>
                      <CalendarDays size={17} />
                      <span>Order Date: {selectedOrder.date}</span>
                    </div>

                    <div>
                      <CreditCard size={17} />
                      <span>
                        Payment:{" "}
                        {selectedOrder.paymentMethod || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <h3 className="detail-section-title">Order Tracking</h3>

                  {renderTimeline(selectedOrder.status)}

                  <h3 className="detail-section-title">Ordered Products</h3>

                  <div className="detail-products">
                    {selectedOrder.items.map((item) => (
                      <div className="detail-product" key={item.id}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="detail-product-placeholder">
                            <Package size={22} />
                          </div>
                        )}

                        <div className="detail-product-info">
                          <strong>{item.name}</strong>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{formatPrice(item.price)}</p>
                        </div>

                        <strong className="detail-product-total">
                          ₹{formatPrice(item.price * item.quantity)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <h3 className="detail-section-title">Delivery Information</h3>

                  <div className="delivery-detail">
                    <MapPin size={20} />

                    <div>
                      <strong>
                        {selectedOrder.customer?.name || currentUser.name}
                      </strong>

                      <p>{getAddress(selectedOrder.customer)}</p>

                      {selectedOrder.customer?.phone && (
                        <p>Phone: {selectedOrder.customer.phone}</p>
                      )}

                      {selectedOrder.customer?.email && (
                        <p>Email: {selectedOrder.customer.email}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="detail-section-title">Payment Summary</h3>

                  <div className="detail-payment">
                    <div>
                      <span>Subtotal</span>
                      <strong>₹{formatPrice(selectedOrder.subtotal)}</strong>
                    </div>

                    <div>
                      <span>Delivery Charge</span>
                      <strong>
                        ₹{formatPrice(selectedOrder.deliveryCharge)}
                      </strong>
                    </div>

                    <div className="detail-grand-total">
                      <span>Total Amount</span>
                      <strong>₹{formatPrice(selectedOrder.total)}</strong>
                    </div>
                  </div>

                  {["Placed", "Processing"].includes(selectedOrder.status) && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(selectedOrder)}
                    >
                      <XCircle size={16} />
                      Cancel Order
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <h2>My Orders</h2>
                  <p className="account-subtitle">
                    Keep track of your purchases.
                  </p>

                  {orders.length === 0 ? (
                    <div className="empty-orders">
                      <Package size={38} />
                      <h3>No orders yet</h3>
                      <p>Your placed orders will appear here.</p>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                          <div className="order-card-header">
                            <div>
                              <label>ORDER ID</label>
                              <h3>{order.id}</h3>
                            </div>

                            <span
                              className={`order-status status-${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <p className="order-date">Order Date: {order.date}</p>

                          {renderTimeline(order.status)}

                          <div className="order-items">
                            {order.items.map((item) => (
                              <div key={item.id}>
                                <span>
                                  {item.name} × {item.quantity}
                                </span>

                                <strong>
                                  ₹{formatPrice(item.price * item.quantity)}
                                </strong>
                              </div>
                            ))}
                          </div>

                          <div className="order-total">
                            <span>Total Amount</span>
                            <strong>₹{formatPrice(order.total)}</strong>
                          </div>

                          <button
                            className="view-order-btn"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2>Account Settings</h2>
              <p className="account-subtitle">Manage your ONECART account.</p>

              <div className="settings-info">
                <p>Account email</p>
                <strong>{currentUser.email}</strong>
              </div>

              <div className="settings-info">
                <p>Account status</p>
                <strong>Active</strong>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

export default MyAccount;
