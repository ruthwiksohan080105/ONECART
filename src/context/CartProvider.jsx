import { useState, useContext } from "react";
import { CartContext } from "./CartContext.js";
import { ProductContext } from "./ProductContext.js";

export function CartProvider({ children }) {
  const { products } = useContext(ProductContext);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Always use the latest product information
  const syncedCart = cart
    .map((item) => {
      const latestProduct = products.find((product) => product.id === item.id);

      if (!latestProduct) return null;

      return {
        ...latestProduct,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id,
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const exists = previousWishlist.some((item) => item.id === product.id);

      if (exists) {
        return previousWishlist.filter((item) => item.id !== product.id);
      }

      return [...previousWishlist, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter((item) => item.id !== id),
    );
  };

  const cartCount = syncedCart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = syncedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart: syncedCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        wishlistOpen,
        setWishlistOpen,
        checkoutOpen,
        setCheckoutOpen,
        clearCart,
        clearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
