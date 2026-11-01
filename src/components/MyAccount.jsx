import { useState, useContext } from "react";
import { UserRound, Package, Settings, LogOut, ArrowLeft } from "lucide-react";
import "./MyAccount.css";
import { OrderContext } from "../context/OrderContext.js";

function MyAccount({ currentUser, onBack, onLogout }) {
  const { orders } = useContext(OrderContext);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <section className="account-page">
      <button className="account-back" onClick={onBack}>
        <ArrowLeft size={17} />
        BACK TO SHOPPING
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
            onClick={() => setActiveTab("profile")}
          >
            <UserRound size={18} />
            My Profile
          </button>

          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <Package size={18} />
            My Orders
          </button>

          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
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
              <h2>Personal Information</h2>
              <p className="account-subtitle">Your account details.</p>

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
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2>My Orders</h2>
              <p className="account-subtitle">Keep track of your purchases.</p>

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
                        <span className="order-status">{order.status}</span>
                      </div>

                      <p className="order-date">Order Date: {order.date}</p>
                      <div className="order-tracking">
                        {["Placed", "Processing", "Shipped", "Delivered"].map(
                          (status, index) => {
                            const statuses = [
                              "Placed",
                              "Processing",
                              "Shipped",
                              "Delivered",
                            ];

                            const currentIndex = statuses.indexOf(order.status);
                            const completed = currentIndex >= index;

                            return (
                              <div
                                key={status}
                                className={`tracking-step ${completed ? "completed" : ""}`}
                              >
                                <div className="tracking-dot"></div>
                                <span>{status}</span>
                              </div>
                            );
                          },
                        )}
                      </div>

                      <div className="order-items">
                        {order.items.map((item) => (
                          <div key={item.id}>
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <strong>
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN",
                              )}
                            </strong>
                          </div>
                        ))}
                      </div>

                      <div className="order-total">
                        <span>Total Amount</span>
                        <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  ))}
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
