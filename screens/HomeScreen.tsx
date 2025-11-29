import React, { useState, useMemo, useEffect } from 'react';
import { AppView, Product } from '../types/index';
import PublicLayout from '../components/layouts/PublicLayout';
import FastShippingIcon from '../components/icons/FastShippingIcon';
import CustomerSupportIcon from '../components/icons/CustomerSupportIcon';
import SecurePaymentIcon from '../components/icons/SecurePaymentIcon';
import MoneyBackIcon from '../components/icons/MoneyBackIcon';
import { useAppContext } from '../hooks/useAppContext';
import Marquee from '../components/common/Marquee';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const iconMap = {
    FastShippingIcon,
    CustomerSupportIcon,
    SecurePaymentIcon,
    MoneyBackIcon
};

const ProductCard: React.FC<{product: Product, onAddToCartClick: () => void, onShopNowClick: () => void, onViewDetails: () => void}> = ({product, onAddToCartClick, onShopNowClick, onViewDetails}) => (
  <div className="border bg-white border-slate-200 rounded overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <button onClick={onViewDetails} className="block w-full aspect-w-1 aspect-h-1 bg-slate-200 overflow-hidden">
        <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
    </button>
    <div className="p-4 space-y-2">
        <p className="text-xs text-slate-500">{product.category} {product.subcategory && `> ${product.subcategory}`}</p>
        <button onClick={onViewDetails} className="text-left">
            <h3 className="text-sm font-semibold text-slate-800 hover:text-emerald-600 h-10 line-clamp-2">{product.name}</h3>
        </button>
        <div className="flex items-center">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-slate-300'}`} />)}
            </div>
            <span className="text-xs text-slate-500 ml-2">| {product.sales} sold</span>
        </div>
        <p className="text-base font-bold text-slate-900">N {product.price.toLocaleString()}</p>
        <div className="flex space-x-2">
            <button onClick={onAddToCartClick} className="w-full text-sm py-2 px-3 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 transition-colors">Add to Cart</button>
            <button onClick={onShopNowClick} className="w-full text-sm py-2 px-3 border border-emerald-600 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">Shop Now</button>
        </div>
    </div>
  </div>
);

const SectionHeader: React.FC<{title: string, categories: string[], activeCategory: string, onSelectCategory: (category: string) => void}> = ({title, categories, activeCategory, onSelectCategory}) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900 relative pl-4">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-600 rounded-full"></span>
            {title}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
             <button onClick={() => onSelectCategory('All')} className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeCategory === 'All' ? 'text-white bg-emerald-600 shadow-lg shadow-emerald-200' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}>All</button>
            {categories.slice(0, 4).map(cat => (
                 <button key={cat} onClick={() => onSelectCategory(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeCategory === cat ? 'text-white bg-emerald-600 shadow-lg shadow-emerald-200' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}>{cat}</button>
            ))}
        </div>
    </div>
)

const HomeScreen: React.FC = () => {
  const { 
    navigateTo, handleAddToCart, products, 
    setSelectedProduct, homepageContent, categories,
    searchQuery
  } = useAppContext();

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
      if (homepageContent?.hero.enabled && homepageContent.hero.mode === 'slider' && homepageContent.hero.autoplay) {
          const timer = setInterval(() => {
              setCurrentSlide(prev => (prev + 1) % homepageContent.hero.slides.length);
          }, homepageContent.hero.interval || 5000);
          return () => clearInterval(timer);
      }
  }, [homepageContent]);

  const filteredProducts = useMemo(() => {
    let prods = products;
    if (activeCategory !== 'All') {
      prods = prods.filter(p => p.category === activeCategory);
    }
    if(searchQuery) {
        prods = prods.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return prods;
  }, [products, activeCategory, searchQuery]);


  const handleShopNow = (product: Product) => {
    handleAddToCart(product);
    navigateTo(AppView.BUYER_CART);
  }
  
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  }

  if (!homepageContent) {
    return (
        <PublicLayout>
            <div className="text-center py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        </PublicLayout>
    );
  }

  const popularProducts = [...filteredProducts].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const moreProducts = filteredProducts.slice(5, 10);
  const categoryNames = categories.map(c => c.name);

  // Helper to get active slide
  const activeSlide = homepageContent.hero.slides[currentSlide] || homepageContent.hero.slides[0];

  return (
    <PublicLayout>
        {homepageContent.marquee?.enabled && (
            <div className="-mt-6 mb-6">
                <Marquee />
            </div>
        )}
        
        <section className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <aside className="hidden md:block w-1/4">
                <div className="bg-emerald-600 text-white p-4 rounded-t-lg font-bold flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    All Categories
                </div>
                <ul className="border bg-white border-t-0 p-2 space-y-1 text-sm rounded-b-lg shadow-sm h-[320px] overflow-y-auto">
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <button onClick={() => setActiveCategory(cat.name)} className={`w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center group ${activeCategory === cat.name ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'}`}>
                                <span>{cat.name}</span>
                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            
            {homepageContent.hero.enabled && activeSlide && (
                <div className="w-full md:w-3/4 relative rounded-xl overflow-hidden shadow-2xl h-[400px] group">
                    <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out" style={{backgroundImage: `url(${activeSlide.imageUrl})`}}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center p-8 md:p-12">
                        <div className="text-white max-w-lg transition-opacity duration-500">
                            <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-sm">
                                GLOBAL EXPORT PLATFORM
                            </span>
                            <h1 key={activeSlide.title} className="text-4xl md:text-5xl font-bold leading-tight mb-4 animate-fade-in">{activeSlide.title}</h1>
                            <p key={activeSlide.subtitle} className="text-lg text-slate-200 mb-8 max-w-md animate-fade-in" style={{animationDelay: '0.1s'}}>{activeSlide.subtitle}</p>
                            <button onClick={() => navigateTo(AppView.BUYER_PRODUCTS)} className="bg-emerald-600 text-white py-3 px-8 rounded-full font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/50 transform hover:-translate-y-1">
                                Start Exploring
                            </button>
                        </div>
                    </div>
                    {/* Slider Dots */}
                    {homepageContent.hero.mode === 'slider' && homepageContent.hero.slides.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {homepageContent.hero.slides.map((_, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-emerald-500 w-6' : 'bg-white/50 hover:bg-white'}`} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>

        {homepageContent.features.enabled && (
            <section className="my-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {homepageContent.features.items.map((feature, index) => {
                        const IconComponent = iconMap[feature.icon];
                        return (
                            <div key={index} className="flex items-center p-6 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mr-4 shrink-0">
                                    <IconComponent className="w-6 h-6 text-emerald-600"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{feature.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        )}

        <section className="my-12">
            <SectionHeader title="Popular Products" categories={categoryNames} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {popularProducts.map(p => <ProductCard key={p.id} product={p} onAddToCartClick={() => handleAddToCart(p)} onShopNowClick={() => handleShopNow(p)} onViewDetails={() => handleViewDetails(p)} />)}
            </div>
        </section>

        {homepageContent.promo.enabled && (
            <section className="my-16 rounded-2xl overflow-hidden relative h-80 shadow-2xl group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{backgroundImage: `url(${homepageContent.promo.imageUrl})`}}></div>
                <div className="absolute inset-0 bg-slate-900/60"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold text-yellow-400 tracking-widest mb-2 uppercase">Limited Time Offer</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            <span className="text-emerald-400">{homepageContent.promo.text}</span> ON ALL BULK ORDERS
                        </h2>
                        <p className="text-slate-200 mb-8 text-lg">Secure your agro-commodities with our trusted escrow service today.</p>
                        <button onClick={() => navigateTo(AppView.BUYER_PRODUCTS)} className="bg-white text-slate-900 py-3 px-8 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>
        )}

        <section className="my-12">
            <SectionHeader title="More Products" categories={categoryNames} activeCategory={activeCategory} onSelectCategory={setActiveCategory}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {moreProducts.map(p => <ProductCard key={p.id} product={p} onAddToCartClick={() => handleAddToCart(p)} onShopNowClick={() => handleShopNow(p)} onViewDetails={() => handleViewDetails(p)} />)}
            </div>
        </section>

        {homepageContent.deliverySection.enabled && (
            <section className="my-16 flex flex-col md:flex-row items-center bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                <div className="w-full md:w-1/2 p-12 lg:p-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">{homepageContent.deliverySection.title}</h2>
                    <p className="text-slate-600 mb-4 text-lg">{homepageContent.deliverySection.description}</p>
                    <p className="text-slate-500 mb-8 italic">{homepageContent.deliverySection.subDescription}</p>
                    <button onClick={() => navigateTo(AppView.BUYER_PRODUCTS)} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30">
                        {homepageContent.deliverySection.buttonText}
                    </button>
                </div>
                <div className="w-full md:w-1/2 h-80 md:h-auto min-h-[400px] relative">
                    <img src={homepageContent.deliverySection.imageUrl} alt="Delivery" loading="lazy" className="absolute inset-0 w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:bg-gradient-to-t"></div>
                </div>
            </section>
        )}
    </PublicLayout>
  );
};

export default HomeScreen;