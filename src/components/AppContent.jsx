import { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Categories from "./Categories";
import Products from "./Products";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import Checkout from "./Checkout";
import ProductDetails from "./ProductDetails";
import Login from "./Login";
import { useContext } from "react";
import { CartContext } from "../context/CartContext.js";
import MyAccount from "./MyAccount";
import AdminDashboard from "./AdminDashboard";

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const { clearCart, clearWishlist } = useContext(CartContext);

  const handleLogout = () => {
    setCurrentUser(null);
    setAccountOpen(false);
    setLoginOpen(false);
    clearCart();
    clearWishlist();
  };

  return (
    <>
      {adminOpen ? (
        <AdminDashboard onExit={() => setAdminOpen(false)} />
      ) : loginOpen ? (
        <Login
          onBack={() => setLoginOpen(false)}
          onLogin={(user) => setCurrentUser(user)}
        />
      ) : (
        <>
          {accountOpen && currentUser ? (
            <MyAccount
              currentUser={currentUser}
              onBack={() => setAccountOpen(false)}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Navbar
                onAccountClick={() => setLoginOpen(true)}
                currentUser={currentUser}
                onLogout={handleLogout}
                onMyAccountClick={() => setAccountOpen(true)}
                onAdminClick={() => setAdminOpen(true)}
              />

              {selectedProduct ? (
                <ProductDetails
                  product={selectedProduct}
                  onBack={() => setSelectedProduct(null)}
                />
              ) : (
                <>
                  <Hero />
                  <Categories />
                  <Products onProductClick={setSelectedProduct} />
                </>
              )}

              <Cart />
              <Wishlist />
              <Checkout />
            </>
          )}
        </>
      )}
    </>
  );
}

export default AppContent;
