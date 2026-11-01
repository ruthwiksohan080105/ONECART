import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";

import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
} from "lucide-react";

import "./ProductDetails.css";

function ProductDetails({ product, onBack }) {
  const { addToCart, wishlist, toggleWishlist } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <section className="product-details-page">
      {/* Back Navigation */}
      <button className="product-back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        BACK TO SHOPPING
      </button>

      <div className="product-details-container">
        {/* Product Image */}
        <div className="details-image-wrapper">
          <span className="details-discount">{product.discount}</span>

          <img
            src={product.image}
            alt={product.name}
            className="details-main-image"
          />
        </div>

        {/* Product Information */}
        <div className="details-information">
          <span className="details-category">{product.category}</span>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <Star size={17} fill="#C69B58" color="#C69B58" />

            <strong>{product.rating}</strong>

            <span>(Customer rating)</span>
          </div>

          <div className="details-price">
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>

            <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
          </div>

          <p className="details-description">{product.description}</p>

          <div className="details-divider"></div>

          {/* Quantity */}
          <div className="quantity-section">
            <span>Quantity</span>

            <div className="quantity-control">
              <button
                onClick={() =>
                  setQuantity((previous) => Math.max(1, previous - 1))
                }
                disabled={quantity === 1}
              >
                <Minus size={15} />
              </button>

              <strong>{quantity}</strong>

              <button onClick={() => setQuantity((previous) => previous + 1)}>
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="details-action-buttons">
            <button className="details-add-cart" onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              ADD TO CART
            </button>

            <button
              className={`details-wishlist ${isWishlisted ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Benefits */}
          <div className="details-benefits">
            <div>
              <Truck size={20} />
              <span>Free shipping on orders above ₹999</span>
            </div>

            <div>
              <ShieldCheck size={20} />
              <span>Secure shopping experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
