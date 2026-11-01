import { CartProvider } from "./context/CartProvider";
import { OrderProvider } from "./context/OrderProvider";
import { ProductProvider } from "./context/ProductProvider";
import AppContent from "./components/AppContent";

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
