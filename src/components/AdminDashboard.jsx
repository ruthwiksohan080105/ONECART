import { useContext, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
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

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + order.total, 0);
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

    alert("Product added successfully!");
  };

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

    setEditingProductId(null);

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

    alert("Product updated successfully!");
  };

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
              onClick={() => setActiveTab(item.id)}
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

        {activeTab === "dashboard" && (
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
              <h2>
                {
                  orders.filter((order) =>
                    ["Placed", "Processing"].includes(order.status),
                  ).length
                }
              </h2>
            </div>
          </div>
        )}

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

                    <p>Customer: {order.customer.name}</p>
                    <p>Email: {order.customer.email}</p>
                    <p>Phone: {order.customer.phone}</p>
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
                      Total: ₹{order.total.toLocaleString("en-IN")}
                    </h3>
                  </div>

                  <div className="admin-order-actions">
                    <label>Update Order Status</label>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
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
                  setNewProduct({ ...newProduct, description: e.target.value })
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
                  onClick={() => {
                    setEditingProductId(null);

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
                  }}
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

        {activeTab === "customers" && (
          <div className="admin-placeholder">
            <Users size={35} />
            <h2>Customer Management</h2>
            <p>We'll connect customer management in a later step.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
