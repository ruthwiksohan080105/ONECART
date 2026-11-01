import { CartProvider } from "./context/CartProvider";
import { OrderProvider } from "./context/OrderProvider";
import { ProductProvider } from "./context/ProductProvider";
import AppContent from "./components/AppContent";

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;
