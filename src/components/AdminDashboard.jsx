import { useContext, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Search,
  Mail,
  Phone,
  Eye,
  ArrowLeft,
} from "lucide-react";

import { OrderContext } from "../context/OrderContext.js";
import { ProductContext } from "../context/ProductContext.js";
import "./AdminDashboard.css";

function AdminDashboard({ onExit }) {
  const { orders, updateOrderStatus } = useContext(OrderContext);

  const { products, addProduct, updateProduct, deleteProduct } =
    useContext(ProductContext);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProductId, setEditingProductId] = useState(null);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    oldPrice: "",
    rating: "4.5",
    discount: "",
    image: "",
    description: "",
    stock: "20",
  });

  // Dashboard Statistics

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  const pendingOrders = orders.filter((order) =>
    ["Placed", "Processing"].includes(order.status),
  ).length;

  // Dashboard Analytics

  const completedOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled",
  ).length;

  const activeOrders = orders.filter((order) => order.status !== "Cancelled");

  const averageOrderValue =
    activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 5,
  ).length;

  const orderStatuses = [
    { label: "Placed", color: "#b79558" },
    { label: "Processing", color: "#6c8ebf" },
    { label: "Shipped", color: "#8b79b8" },
    { label: "Delivered", color: "#43845b" },
    { label: "Cancelled", color: "#c0392b" },
  ].map((status) => ({
    ...status,
    count: orders.filter((order) => order.status === status.label).length,
  }));

  const topSellingProducts = Object.values(
    activeOrders.reduce((result, order) => {
      (order.items || []).forEach((item) => {
        const key = item.id;

        if (!result[key]) {
          result[key] = {
            id: key,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }

        result[key].quantity += Number(item.quantity || 0);
        result[key].revenue +=
          Number(item.price || 0) * Number(item.quantity || 0);
      });

      return result;
    }, {}),
  )
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Customer Management

  const customers = Object.values(
    orders.reduce((result, order) => {
      const customer = order.customer || {};

      const email = (customer.email || "").trim().toLowerCase();

      const key =
        email ||
        [customer.name || "Unknown", customer.phone || ""]
          .join("-")
          .toLowerCase();

      if (!result[key]) {
        result[key] = {
          id: key,
          name: customer.name || "Unknown Customer",
          email: customer.email || "Not available",
          phone: customer.phone || "Not available",
          orders: [],
          totalSpent: 0,
        };
      }

      result[key].orders.push(order);

      if (order.status !== "Cancelled") {
        result[key].totalSpent += Number(order.total || 0);
      }

      return result;
    }, {}),
  );

  const filteredCustomers = customers.filter((customer) => {
    const search = customerSearch.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone.toLowerCase().includes(search)
    );
  });

  // Reset Product Form

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      category: "",
      price: "",
      oldPrice: "",
      rating: "4.5",
      discount: "",
      image: "",
      description: "",
      stock: "20",
    });

    setEditingProductId(null);
  };

  // Add Product

  const handleAddProduct = (e) => {
    e.preventDefault();

    const product = {
      ...newProduct,
      price: Number(newProduct.price),
      oldPrice: Number(newProduct.oldPrice),
      rating: Number(newProduct.rating),
      stock: Number(newProduct.stock),
    };

    addProduct(product);

    resetProductForm();

    alert("Product added successfully!");
  };

  // Update Product

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...newProduct,
      price: Number(newProduct.price),
      oldPrice: Number(newProduct.oldPrice),
      rating: Number(newProduct.rating),
      stock: Number(newProduct.stock),
    };

    updateProduct(editingProductId, updatedProduct);

    resetProductForm();

    alert("Product updated successfully!");
  };

  // Edit Product

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setNewProduct({
      name: product.name,
      category: product.category,
      price: String(product.price),
      oldPrice: String(product.oldPrice),
      rating: String(product.rating),
      discount: product.discount || "",
      image: product.image,
      description: product.description,
      stock: String(product.stock),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sidebar Menu

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>
          ONE<span>CART</span>
        </h2>

        <p>ADMIN PANEL</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedCustomer(null);
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        <button className="admin-exit" onClick={onExit}>
          <LogOut size={18} />
          Exit Admin
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>ONECART MANAGEMENT</span>

            <h1>
              {activeTab === "dashboard"
                ? "Dashboard"
                : menuItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>

          <span className="admin-badge">Administrator</span>
        </header>

        {/* Dashboard */}

        {activeTab === "dashboard" && (
          <div className="admin-analytics">
            {/* Main Statistics */}
            <div className="admin-stats">
              <div>
                <span>Total Orders</span>
                <h2>{orders.length}</h2>
              </div>

              <div>
                <span>Total Revenue</span>
                <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
              </div>

              <div>
                <span>Pending Orders</span>
                <h2>{pendingOrders}</h2>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="analytics-grid">
              <div className="analytics-card">
                <span>Total Products</span>
                <h2>{products.length}</h2>
                <p>Products in your store</p>
              </div>

              <div className="analytics-card">
                <span>Total Customers</span>
                <h2>{customers.length}</h2>
                <p>Customers who placed orders</p>
              </div>

              <div className="analytics-card">
                <span>Delivered Orders</span>
                <h2>{completedOrders}</h2>
                <p>Successfully delivered</p>
              </div>

              <div className="analytics-card">
                <span>Average Order Value</span>
                <h2>
                  ₹{Math.round(averageOrderValue).toLocaleString("en-IN")}
                </h2>
                <p>Per non-cancelled order</p>
              </div>

              <div className="analytics-card">
                <span>Low Stock Products</span>
                <h2>{lowStockProducts}</h2>
                <p>Products with 5 or fewer items</p>
              </div>

              <div className="analytics-card">
                <span>Cancelled Orders</span>
                <h2>{cancelledOrders}</h2>
                <p>Cancelled transactions</p>
              </div>
            </div>

            {/* Analytics Panels */}
            <div className="analytics-panels">
              {/* Order Status */}
              <div className="analytics-panel">
                <h2>Order Status Overview</h2>
                <p className="analytics-subtitle">
                  Current distribution of all orders
                </p>

                {orderStatuses.map((status) => {
                  const percentage =
                    orders.length > 0
                      ? (status.count / orders.length) * 100
                      : 0;

                  return (
                    <div className="status-analytics" key={status.label}>
                      <div className="status-analytics-heading">
                        <span>{status.label}</span>
                        <strong>{status.count}</strong>
                      </div>

                      <div className="analytics-progress">
                        <div
                          style={{
                            width: `${percentage}%`,
                            background: status.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top Selling Products */}
              <div className="analytics-panel">
                <h2>Top Selling Products</h2>
                <p className="analytics-subtitle">
                  Based on non-cancelled orders
                </p>

                {topSellingProducts.length === 0 ? (
                  <div className="analytics-empty">
                    No sales data available yet.
                  </div>
                ) : (
                  topSellingProducts.map((product, index) => (
                    <div className="top-product-row" key={product.id}>
                      <div className="top-product-rank">{index + 1}</div>

                      <div className="top-product-info">
                        <h3>{product.name}</h3>
                        <p>{product.quantity} units sold</p>
                      </div>

                      <strong>
                        ₹{product.revenue.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Management */}

        {activeTab === "orders" && (
          <div className="admin-orders">
            <h2>Manage Orders</h2>

            {orders.length === 0 ? (
              <p>No orders available.</p>
            ) : (
              orders.map((order) => (
                <div className="admin-order-card" key={order.id}>
                  <div className="admin-order-details">
                    <span>ORDER ID</span>

                    <h3>{order.id}</h3>

                    <p>Customer: {order.customer?.name || "Not available"}</p>

                    <p>Email: {order.customer?.email || "Not available"}</p>

                    <p>Phone: {order.customer?.phone || "Not available"}</p>

                    <p>Order Date: {order.date}</p>

                    <h4>Products Purchased</h4>

                    {order.items.map((item) => (
                      <p key={item.id}>
                        {item.name} × {item.quantity}
                        {" — "}₹
                        {(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    ))}

                    <h3 className="admin-order-total">
                      Total: ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </h3>
                  </div>

                  <div className="admin-order-actions">
                    <label>Update Order Status</label>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      disabled={order.status === "Cancelled"}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Products Management */}

        {activeTab === "products" && (
          <div className="admin-products">
            <form
              className="admin-product-form"
              onSubmit={
                editingProductId ? handleUpdateProduct : handleAddProduct
              }
            >
              <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>

              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Category (Fashion, Electronics...)"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
              />

              <div className="admin-form-row">
                <input
                  type="number"
                  placeholder="Price"
                  min="1"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Old Price"
                  min="0"
                  value={newProduct.oldPrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, oldPrice: e.target.value })
                  }
                  required
                />
              </div>

              <div className="admin-form-row">
                <input
                  type="number"
                  placeholder="Rating (0–5)"
                  min="0"
                  max="5"
                  step="0.1"
                  value={newProduct.rating}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, rating: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Discount (e.g. 20% OFF)"
                  value={newProduct.discount}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Stock"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  required
                />
              </div>

              <input
                type="url"
                placeholder="Product Image URL"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                required
              />

              <button type="submit" className="admin-add-button">
                {editingProductId ? "Update Product" : "+ Add Product"}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={resetProductForm}
                >
                  Cancel Edit
                </button>
              )}
            </form>

            <div className="admin-products-header">
              <h2>Manage Products</h2>
              <span>Total Products: {products.length}</span>
            </div>

            <div className="admin-products-list">
              {products.length === 0 ? (
                <p>No products available.</p>
              ) : (
                products.map((product) => (
                  <div className="admin-product-card" key={product.id}>
                    <img src={product.image} alt={product.name} />

                    <div className="admin-product-info">
                      <h3>{product.name}</h3>
                      <p>Category: {product.category}</p>
                      <p>Price: ₹{product.price.toLocaleString("en-IN")}</p>
                      <p>Stock: {product.stock}</p>
                    </div>

                    <button
                      className="admin-edit-button"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-button"
                      onClick={() => {
                        if (window.confirm(`Delete ${product.name}?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Customer Management */}

        {activeTab === "customers" && (
          <div className="admin-customers">
            {selectedCustomer ? (
              <>
                <button
                  className="customer-back-btn"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <ArrowLeft size={16} />
                  Back to Customers
                </button>

                <div className="customer-detail-card">
                  <div className="customer-detail-avatar">
                    <Users size={28} />
                  </div>

                  <h2>{selectedCustomer.name}</h2>
                  <p>{selectedCustomer.email}</p>

                  <div className="customer-detail-info">
                    <div>
                      <Mail size={17} />
                      <span>{selectedCustomer.email}</span>
                    </div>

                    <div>
                      <Phone size={17} />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>

                  <div className="customer-stats">
                    <div>
                      <span>Total Orders</span>
                      <h3>{selectedCustomer.orders.length}</h3>
                    </div>

                    <div>
                      <span>Total Spending</span>
                      <h3>
                        ₹{selectedCustomer.totalSpent.toLocaleString("en-IN")}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="customer-history">
                  <h2>Order History</h2>

                  {selectedCustomer.orders.map((order) => (
                    <div className="customer-history-card" key={order.id}>
                      <div>
                        <label>ORDER ID</label>
                        <h3>{order.id}</h3>
                        <p>Date: {order.date}</p>
                        <p>Products: {order.items.length}</p>
                      </div>

                      <div className="customer-history-right">
                        <span
                          className={`customer-status status-${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>

                        <strong>
                          ₹{Number(order.total || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="customer-section-heading">
                  <div>
                    <h2>Customer Management</h2>
                    <p>View and manage your customers.</p>
                  </div>

                  <span className="customer-count">
                    Total Customers: {customers.length}
                  </span>
                </div>

                <div className="customer-search">
                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>

                {filteredCustomers.length === 0 ? (
                  <div className="customer-empty">
                    <Users size={35} />
                    <h3>No customers found</h3>

                    <p>
                      {customers.length === 0
                        ? "Customers will appear after their first order."
                        : "Try searching with another name, email or phone."}
                    </p>
                  </div>
                ) : (
                  <div className="customer-list">
                    {filteredCustomers.map((customer) => (
                      <div className="customer-card" key={customer.id}>
                        <div className="customer-avatar">
                          <Users size={22} />
                        </div>

                        <div className="customer-main-info">
                          <h3>{customer.name}</h3>
                          <p>{customer.email}</p>
                          <p>{customer.phone}</p>
                        </div>

                        <div className="customer-order-count">
                          <span>Total Orders</span>
                          <strong>{customer.orders.length}</strong>
                        </div>

                        <div className="customer-spending">
                          <span>Total Spending</span>
                          <strong>
                            ₹{customer.totalSpent.toLocaleString("en-IN")}
                          </strong>
                        </div>

                        <button
                          className="customer-view-btn"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
