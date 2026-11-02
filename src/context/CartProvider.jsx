import { useState, useContext, useEffect } from "react";
import { CartContext } from "./CartContext.js";
import { ProductContext } from "./ProductContext.js";

export function CartProvider({ children }) {
  const { products } = useContext(ProductContext);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Stock notification
  const [stockMessage, setStockMessage] = useState("");

  // Automatically clear notification
  useEffect(() => {
    if (!stockMessage) return;

    const timer = setTimeout(() => {
      setStockMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [stockMessage]);

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

  // Add product to cart with stock validation
  const addToCart = (product) => {
    const latestProduct = products.find((item) => item.id === product.id);

    if (!latestProduct) {
      setStockMessage("This product is no longer available.");
      return false;
    }

    const existingProduct = cart.find((item) => item.id === product.id);

    const currentQuantity = existingProduct ? existingProduct.quantity : 0;

    const availableStock = Number(latestProduct.stock) || 0;

    if (availableStock <= 0) {
      setStockMessage("This product is currently out of stock.");
      return false;
    }

    if (currentQuantity >= availableStock) {
      setStockMessage(`Only ${availableStock} items available in stock.`);
      return false;
    }

    setCart((previousCart) => {
      const existing = previousCart.find((item) => item.id === product.id);

      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });

    setStockMessage("");
    return true;
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  };

  // Increase quantity with stock validation
  const increaseQuantity = (id) => {
    const product = products.find((item) => item.id === id);

    if (!product) {
      setStockMessage("This product is no longer available.");
      return;
    }

    const cartItem = cart.find((item) => item.id === id);

    if (!cartItem) return;

    const availableStock = Number(product.stock) || 0;

    if (cartItem.quantity >= availableStock) {
      setStockMessage(`Only ${availableStock} items available in stock.`);
      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );

    setStockMessage("");
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );

    setStockMessage("");
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  // Add or remove wishlist product
  const toggleWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const exists = previousWishlist.some((item) => item.id === product.id);

      if (exists) {
        return previousWishlist.filter((item) => item.id !== product.id);
      }

      return [...previousWishlist, product];
    });
  };

  // Remove wishlist product
  const removeFromWishlist = (id) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter((item) => item.id !== id),
    );
  };

  // Total cart quantity
  const cartCount = syncedCart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Total cart price
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
        stockMessage,
        setStockMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
