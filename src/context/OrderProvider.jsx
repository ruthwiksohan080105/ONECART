import { useState, useContext } from "react";
import { OrderContext } from "./OrderContext.js";
import { ProductContext } from "./ProductContext.js";

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const { restoreStock } = useContext(ProductContext);

  // Create a new order
  const addOrder = (orderDetails) => {
    const newOrder = {
      id: "ORD" + Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      status: "Placed",
      ...orderDetails,
    };

    setOrders((previousOrders) => [newOrder, ...previousOrders]);

    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const validStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const existingOrder = orders.find((order) => order.id === orderId);

    if (!existingOrder) return;

    // Prevent changing an already cancelled order
    if (existingOrder.status === "Cancelled") {
      return;
    }

    // Restore stock only when an order is cancelled
    if (newStatus === "Cancelled") {
      restoreStock(existingOrder.items);
    }

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
