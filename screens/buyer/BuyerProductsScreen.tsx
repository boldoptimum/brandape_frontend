import React, { useMemo, useState } from 'react';
import { AppView, Product, User } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import Pagination from '../../components/shared/Pagination';

interface BuyerProductsScreenProps {}

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LocationMarkerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const ProductCard: React.FC<{product: Product, onAddToCart: () => void, onBuyNow: () => void, onViewDetails: () => void, badgeText?: string, isNearby?: boolean}> = ({product, onAddToCart, onBuyNow, onViewDetails, badgeText, isNearby}) => (
  <div className={`border rounded-lg overflow-hidden group bg-white relative flex flex-col h-full transition-all duration-300 hover:shadow-lg ${badgeText ? 'border-emerald-200 shadow-sm ring-1 ring-emerald-100' : 'border-gray-200'}`}>
    {badgeText && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
            {badgeText}
        </div>
    )}
    {isNearby && !badgeText && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm flex items-center">
            <LocationMarkerIcon className="w-3 h-3 mr-1" /> Nearby
        </div>
    )}
    <button onClick={onViewDetails} className="block w-full aspect-w-1 aspect-h-1 bg-gray-100 relative overflow-hidden">
        <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"/>
    </button>
    <div className="p-4 space-y-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500">{product.category}</p>
            {product.stock <= 10 && product.stock > 0 && <span className="text-xs text-red-500 font-medium">Low Stock</span>}
        </div>
        <button onClick={onViewDetails} className="text-left">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-emerald-600 transition-colors">{product.name}</h3>
        </button>
        <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
            </div>
            <span className="text-xs text-gray-500 ml-2">({product.reviewCount})</span>
        </div>
        <div className="flex-1"></div> 
        <p className="text-base font-bold text-gray-900 mt-2">N {product.price.toLocaleString()}</p>
        <div className="flex space-x-2 mt-3">
            <button onClick={onAddToCart} className="flex-1 text-sm py-2 px-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">Add</button>
            <button onClick={onBuyNow} className="flex-1 text-sm py-2 px-3 border border-emerald-600 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">Buy</button>
        </div>
    </div>
  </div>
);

const BuyerProductsScreen: React.FC<BuyerProductsScreenProps> = () => {
    const { products, handleAddToCart, setSelectedProduct, navigateTo, orders, currentUser } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('Recommended');
    const itemsPerPage = 12;
    
    // Algorithm: Calculate a score for each product
    const scoredProducts = useMemo(() => {
        if (!products.length) return [];

        const userOrders = currentUser ? orders.filter(o => o.customerId === currentUser.id) : [];
        const boughtCategories = new Set<string>();
        userOrders.forEach(o => o.items.forEach(i => boughtCategories.add(i.category)));

        const userLocation = currentUser?.address?.city || '';
        const userState = currentUser?.address?.street.split(',').pop()?.trim() || ''; // Basic heuristic

        return products.map(p => {
            let score = 0;
            let isNearby = false;

            // Factor 1: Category History (Weight: 20)
            if (boughtCategories.has(p.category)) {
                score += 20;
            }

            // Factor 2: Location Match (Weight: 15)
            // Check specs for Origin
            const originSpec = p.specs.find(s => s.key === 'Origin' || s.key === 'Location');
            if (originSpec && (originSpec.value.includes(userLocation) || (userState && originSpec.value.includes(userState)))) {
                score += 15;
                isNearby = true;
            }

            // Factor 3: Rating (Weight: 5 per star)
            score += (p.rating * 5);

            // Factor 4: Popularity (Weight: Logarithmic scale of sales)
            score += Math.min(20, Math.log10(p.sales + 1) * 5);

            // Factor 5: Stock availability (Penalize out of stock)
            if (p.stock === 0) score -= 50;

            return { ...p, score, isNearby };
        }).sort((a, b) => b.score - a.score);
    }, [products, orders, currentUser]);

    // Segmentations
    const topPicks = scoredProducts.slice(0, 4);
    const regionalPicks = scoredProducts.filter(p => p.isNearby).slice(0, 4);
    
    // Pagination & Sorting for the main catalog
    const sortedCatalog = useMemo(() => {
        // Exclude top picks from general catalog to avoid duplication at top of page
        let catalog = scoredProducts.filter(p => !topPicks.includes(p));

        switch (sortOption) {
            case 'PriceLowHigh':
                return catalog.sort((a, b) => a.price - b.price);
            case 'PriceHighLow':
                return catalog.sort((a, b) => b.price - a.price);
            case 'Rating':
                return catalog.sort((a, b) => b.rating - a.rating);
            case 'Sales':
                return catalog.sort((a, b) => b.sales - a.sales);
            default: // 'Recommended'
                // Already sorted by score in scoredProducts
                return catalog;
        }
    }, [scoredProducts, topPicks, sortOption]);

    const totalItems = sortedCatalog.length;
    const currentProducts = sortedCatalog.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBuyNow = (product: Product) => {
        handleAddToCart(product);
        navigateTo(AppView.BUYER_CART);
    }
    
    return (
        <DashboardLayout>
            {/* 1. Top Recommendations */}
            {topPicks.length > 0 && (
                <section className="mb-10 animate-fade-in">
                    <div className="flex items-center justify-between mb-4 border-b border-emerald-100 pb-2">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            Top Picks for You
                        </h2>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Personalized</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {topPicks.map(p => (
                            <ProductCard 
                                key={`rec-${p.id}`} 
                                product={p} 
                                onAddToCart={() => handleAddToCart(p)} 
                                onBuyNow={() => handleBuyNow(p)} 
                                onViewDetails={() => setSelectedProduct(p)}
                                badgeText="Recommended"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 2. Regional/Location Based */}
            {regionalPicks.length > 0 && (
                <section className="mb-10 animate-fade-in" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-2">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            Sourced Near You
                        </h2>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Local</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {regionalPicks.map(p => (
                            <ProductCard 
                                key={`loc-${p.id}`} 
                                product={p} 
                                onAddToCart={() => handleAddToCart(p)} 
                                onBuyNow={() => handleBuyNow(p)} 
                                onViewDetails={() => setSelectedProduct(p)}
                                isNearby={true}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 3. General Catalog */}
            <section className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex flex-col sm:flex-row justify-between items-end mb-6 border-b pb-2 gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Browse Catalog</h2>
                        <span className="text-sm text-gray-500">{totalItems} items</span>
                    </div>
                    
                    <div className="flex items-center">
                        <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
                        <select 
                            id="sort"
                            value={sortOption} 
                            onChange={(e) => {
                                setSortOption(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on sort change
                            }}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-1 pl-2 pr-8"
                        >
                            <option value="Recommended">Recommended</option>
                            <option value="PriceLowHigh">Price: Low to High</option>
                            <option value="PriceHighLow">Price: High to Low</option>
                            <option value="Rating">Rating</option>
                            <option value="Sales">Popularity</option>
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map(p => (
                        <ProductCard 
                            key={p.id} 
                            product={p} 
                            onAddToCart={() => handleAddToCart(p)} 
                            onBuyNow={() => handleBuyNow(p)} 
                            onViewDetails={() => setSelectedProduct(p)}
                            isNearby={p.isNearby}
                        />
                    ))}
                </div>
                
                <div className="mt-8">
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </section>
        </DashboardLayout>
    );
};

export default BuyerProductsScreen;