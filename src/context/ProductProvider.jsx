import { useState } from "react";
import { ProductContext } from "./ProductContext.js";

const initialProducts = [
  {
    id: 1,
    name: "Premium Sneakers",
    category: "Fashion",
    price: 2499,
    oldPrice: 3499,
    rating: 4.8,
    discount: "29% OFF",
    stock: 20,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    description:
      "Step into everyday comfort with these premium sneakers. Designed with a contemporary silhouette, comfortable cushioning and versatile styling.",
  },
  {
    id: 2,
    name: "Classic Wrist Watch",
    category: "Accessories",
    price: 3299,
    oldPrice: 4299,
    rating: 4.7,
    discount: "23% OFF",
    stock: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    description:
      "A timeless wristwatch combining refined design with everyday functionality. The perfect finishing touch for any outfit.",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1899,
    oldPrice: 2599,
    rating: 4.6,
    discount: "27% OFF",
    stock: 20,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    description:
      "Enjoy your favourite music with stylish wireless headphones designed for comfortable everyday listening.",
  },
  {
    id: 4,
    name: "Leather Backpack",
    category: "Lifestyle",
    price: 2799,
    oldPrice: 3799,
    rating: 4.8,
    discount: "26% OFF",
    stock: 20,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
    description:
      "A versatile backpack with a modern look and practical storage. Ideal for everyday essentials, work and travel.",
  },
  {
    id: 5,
    name: "Smart Watch",
    category: "Electronics",
    price: 4499,
    oldPrice: 5999,
    rating: 4.9,
    discount: "25% OFF",
    stock: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    description:
      "Bring style and technology together with this modern smartwatch, designed to complement your everyday lifestyle.",
  },
  {
    id: 6,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 1299,
    oldPrice: 1799,
    rating: 4.5,
    discount: "28% OFF",
    stock: 20,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
    description:
      "Complete your look with these classic sunglasses. A versatile accessory for a confident, effortless style.",
  },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);

  // Add a new product
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      stock: Math.max(0, Number(product.stock) || 0),
    };

    setProducts((previousProducts) => [...previousProducts, newProduct]);
  };

  // Delete a product
  const deleteProduct = (id) => {
    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== id),
    );
  };

  // Update product details
  const updateProduct = (id, updatedData) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updatedData,
              ...(updatedData.stock !== undefined && {
                stock: Math.max(0, Number(updatedData.stock) || 0),
              }),
            }
          : product,
      ),
    );
  };

  // Deduct stock when an order is placed
  const deductStock = (items) => {
    const quantities = {};

    items.forEach((item) => {
      quantities[item.id] = (quantities[item.id] || 0) + Number(item.quantity);
    });

    // Check availability of every product first
    const hasEnoughStock = Object.entries(quantities).every(
      ([id, quantity]) => {
        const product = products.find((product) => product.id === Number(id));

        return (
          product &&
          Number.isInteger(quantity) &&
          quantity > 0 &&
          Number(product.stock) >= quantity
        );
      },
    );

    if (!hasEnoughStock) {
      return false;
    }

    // Deduct stock only after all products pass validation
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        quantities[product.id]
          ? {
              ...product,
              stock: Number(product.stock) - quantities[product.id],
            }
          : product,
      ),
    );

    return true;
  };

  // Restore stock when an order is cancelled
  const restoreStock = (items) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) => {
        const orderedItem = items.find((item) => item.id === product.id);

        if (!orderedItem) {
          return product;
        }

        return {
          ...product,
          stock: Number(product.stock) + Number(orderedItem.quantity),
        };
      }),
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        deductStock,
        restoreStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
