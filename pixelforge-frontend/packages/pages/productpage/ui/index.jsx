import './index.css';

import { ProductFilters } from '@pixelforge/productfilters';
import { ProductListing } from '@pixelforge/productlisting';
import { ProductToolbar } from '@pixelforge/producttoolbar';
import { products } from '@pixelforge/products';
import { useState, useMemo } from 'react';

const highestPrice = Math.max(...products.map(product => product.price));

export const ProductPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [maxPrice, setMaxPrice] = useState(highestPrice);

    // 2. Filtrering och sortering
    const visibleProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const filtered = products.filter(product => {
            const matchesSearch = [
                product.name,
                product.brand,
                product.category
            ].some(value => value.toLowerCase().includes(query));

            const matchesCategory =
                selectedCategory === 'All Products' ||
                product.category === selectedCategory;

            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.includes(product.brand);

            const matchesPrice = product.price <= maxPrice;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesBrand &&
                matchesPrice
            );
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;

                case 'price-high':
                    return b.price - a.price;

                case 'rating':
                    return b.rating - a.rating;

                case 'name':
                    return a.name.localeCompare(b.name);

                default:
                    return Number(b.popular) - Number(a.popular);
            }
        });
    }, [searchQuery, sortBy, selectedCategory, selectedBrands, maxPrice]);

    return (
        <main className="product-page wrapper">
            <header className="product-page__header">
                <h1>All Products</h1>
                <p>{visibleProducts.length} products</p>
            </header>

            <ProductToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div className="product-page__content">
                <aside className="product-page__sidebar">
                    <ProductFilters 
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                    />
                </aside>

                <section
                    className="product-page__listing"
                    aria-label="Product results"
                >
                    <ProductListing products={ visibleProducts } />
                </section>
            </div>
        </main>
    );
};