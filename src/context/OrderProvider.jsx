import { useState } from "react";
import { OrderContext } from "./OrderContext.js";

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

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
