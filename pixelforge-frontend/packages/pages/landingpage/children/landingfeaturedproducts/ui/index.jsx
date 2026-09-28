import { Link } from 'react-router-dom';
import { products } from '@pixelforge/products';
import { ProductCard } from '@pixelforge/productcard';
import './index.css';

export const LandingFeaturedProducts = () => {
    const featuredProducts = products.filter(product => product.featured);

    return (
        <section className="landing-featured wrapper">
            <div className="landing-featured__header">
                <div className="landing-featured__heading">
                    <h2 className="landing-featured__title">
                        Featured products
                    </h2>

                    <p className="landing-featured__description">
                        Hand-picked by our hardware team
                    </p>
                </div>

                <Link
                    className="landing-featured__link"
                    to="/products"
                >
                    View all
                    <span aria-hidden="true">›</span>
                </Link>
            </div>

            <div className="landing-featured__products">
                {
                    featuredProducts.map(product => (
                        <ProductCard 
                            key={ product.id }
                            product={ product }
                        />
                    ))
                }
            </div>
        </section>
    );
};