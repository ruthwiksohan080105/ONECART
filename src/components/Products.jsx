import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";
import { ProductContext } from "../context/ProductContext.js";
import {
  Heart,
  ShoppingBag,
  Star,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import "./Products.css";

function Products({ onProductClick }) {
  const { addToCart, cartCount, wishlist, toggleWishlist } =
    useContext(CartContext);
  const { products } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      let matchesPrice = true;

      if (selectedPrice === "under1500") {
        matchesPrice = product.price < 1500;
      } else if (selectedPrice === "1500-3000") {
        matchesPrice = product.price >= 1500 && product.price <= 3000;
      } else if (selectedPrice === "3000-5000") {
        matchesPrice = product.price > 3000 && product.price <= 5000;
      } else if (selectedPrice === "above5000") {
        matchesPrice = product.price > 5000;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "low-high") return a.price - b.price;
      if (sortBy === "high-low") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;

      return 0;
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedPrice("All");
    setSortBy("default");
  };

  return (
    <section className="products-section" id="trending">
      <div className="products-heading">
        <div>
          <span className="section-label">HANDPICKED FOR YOU</span>

          <h2>
            Trending <span>Products.</span>
          </h2>

          <p>Discover the products everyone is talking about.</p>
        </div>

        <a href="#categories" className="products-view-all">
          EXPLORE MORE →
        </a>
      </div>
      {/* Search and Filters */}
      <div className="product-controls">
        <div className="product-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search your favourite products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>
              <X size={17} />
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-item">
            <SlidersHorizontal size={16} />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <select
            className="filter-select"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option value="All">All Prices</option>
            <option value="under1500">Under ₹1,500</option>
            <option value="1500-3000">₹1,500 – ₹3,000</option>
            <option value="3000-5000">₹3,000 – ₹5,000</option>
            <option value="above5000">Above ₹5,000</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <button className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        </div>
      </div>

      <div className="results-count">
        Showing <strong>{filteredProducts.length}</strong> of{" "}
        <strong>{products.length}</strong> products
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={product.image}
                alt={product.name}
                onClick={() => onProductClick(product)}
                style={{ cursor: "pointer" }}
              />

              <span className="discount-badge">{product.discount}</span>

              <button
                className={`wishlist-btn ${
                  wishlist.some((item) => item.id === product.id)
                    ? "active"
                    : ""
                }`}
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={19}
                  fill={
                    wishlist.some((item) => item.id === product.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            <div className="product-info">
              <span className="product-category">{product.category}</span>

              <h3
                onClick={() => onProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                {product.name}
              </h3>

              <div className="product-rating">
                <Star size={14} fill="#C69B58" color="#C69B58" />
                <span>{product.rating}</span>
                <span className="rating-label">(Customer rating)</span>
              </div>

              <div className="product-price">
                <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
              </div>

              <button
                className="add-cart-btn"
                onClick={() => addToCart(product)}
              >
                <ShoppingBag size={17} />
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <Search size={35} />

          <h3>No products found</h3>

          <p>Try changing your search or filters.</p>

          <button onClick={clearFilters}>CLEAR FILTERS</button>
        </div>
      )}

      <div className="cart-status">
        <ShoppingBag size={18} />
        Items added to cart: <strong>{cartCount}</strong>
        <span> | </span>
        Wishlist: <strong>{wishlist.length}</strong>
      </div>
    </section>
  );
}

export default Products;
