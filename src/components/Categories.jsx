import { ArrowUpRight } from "lucide-react";
import "./Categories.css";

const categories = [
  {
    id: 1,
    name: "Fashion",
    description: "Style that speaks for you",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
  },
  {
    id: 2,
    name: "Electronics",
    description: "Technology made simple",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
  },
  {
    id: 3,
    name: "Accessories",
    description: "The details matter",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  },
  {
    id: 4,
    name: "Lifestyle",
    description: "Make every day better",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
  },
];

function Categories() {
  return (
    <section className="categories-section" id="categories">
      <div className="categories-heading">
        <div>
          <span className="section-label">EXPLORE OUR COLLECTION</span>
          <h2>
            Shop by <span>Categories.</span>
          </h2>
          <p>Find everything you need, thoughtfully organized.</p>
        </div>

        <a href="#trending" className="view-all">
          VIEW ALL <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <a href="#trending" className="category-card" key={category.id}>
            <img src={category.image} alt={category.name} />

            <div className="category-overlay">
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <span className="category-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Categories;
