import { ArrowRight, Sparkles } from "lucide-react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <div className="hero-label">
          <Sparkles size={15} />
          <span>THE NEW WAY TO SHOP</span>
        </div>

        <h1>
          Discover More.
          <br />
          <span>Shop Better.</span>
        </h1>

        <p>
          Explore a world of fashion, technology and lifestyle. Find everything
          you love, all in one place.
        </p>

        <div className="hero-buttons">
          <a href="#trending" className="shop-btn">
            SHOP NOW
            <ArrowRight size={17} />
          </a>

          <a href="#categories" className="explore-btn">
            Explore Collections
          </a>
        </div>

        <div className="hero-trust">
          <span>✦ Premium Collections</span>
          <span>✦ Quality Products</span>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
          alt="Premium shopping collection"
        />

        <div className="image-caption">
          <span>YOUR STYLE, YOUR CHOICE</span>
          <strong>Everything starts here.</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;
