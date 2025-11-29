// Fix: The ProductDetailScreen component was created as the file was empty, causing a module resolution error.
import React, { useState, useEffect } from 'react';
import { AppView, Product, Review } from '../types/index';
import PublicLayout from '../components/layouts/PublicLayout';
import { useAppContext } from '../hooks/useAppContext';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ProductDetailScreen: React.FC = () => {
  const { selectedProduct: product, handleAddToCart, navigateTo } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  
  const [mainImage, setMainImage] = useState(product?.imageUrl);
  
  useEffect(() => {
    if (product) {
        setMainImage(product.imageUrl);
        setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <PublicLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-slate-800">Product not found</h2>
          <p className="mt-2 text-slate-600">The product you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigateTo(AppView.HOME)} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium">
            Back to Home
          </button>
        </div>
      </PublicLayout>
    );
  }
  
  const handleBuyNow = () => {
    handleAddToCart(product, quantity);
    navigateTo(AppView.CART);
  };
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const renderRating = (rating: number) => (
    <div className="flex items-center">
        <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} />)}
        </div>
        <span className="text-sm text-slate-600 ml-2">{rating.toFixed(1)} ({product.reviewCount} reviews)</span>
    </div>
  );

  return (
    <PublicLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="border rounded-lg mb-4">
              <img src={mainImage} alt={product.name} loading="lazy" className="w-full h-96 object-cover rounded-lg" />
            </div>
            <div className="flex space-x-2">
              {[product.imageUrl, ...product.images].slice(0, 4).map((img, index) => (
                <button key={index} onMouseEnter={() => setMainImage(img)} className={`w-20 h-20 border rounded-md overflow-hidden ${mainImage === img ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-slate-200'}`}>
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
            <div className="my-3">{renderRating(product.rating)}</div>
            <p className="text-3xl font-bold text-emerald-600 mb-4">N {product.price.toLocaleString()}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description.substring(0, 150)}...</p>
            
            <div className="my-6 space-y-2">
              <p className="text-sm"><span className="font-semibold text-slate-700">Availability:</span> <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</span></p>
              <p className="text-sm"><span className="font-semibold text-slate-700">Category:</span> {product.category}</p>
              {product.subcategory && <p className="text-sm"><span className="font-semibold text-slate-700">Sub-category:</span> {product.subcategory}</p>}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded">
                <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 text-lg font-bold">-</button>
                <span className="px-4 py-1">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 text-lg font-bold">+</button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => handleAddToCart(product, quantity)} disabled={product.stock < 1} className="flex-1 py-3 px-6 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed">Add to Cart</button>
              <button onClick={handleBuyNow} disabled={product.stock < 1} className="flex-1 py-3 px-6 border border-emerald-600 text-emerald-600 font-semibold rounded hover:bg-emerald-50 disabled:border-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description, Specs, Reviews */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('description')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Description</button>
            <button onClick={() => setActiveTab('specs')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specs' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Specifications</button>
            <button onClick={() => setActiveTab('reviews')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Reviews ({product.reviewCount})</button>
          </nav>
        </div>
        <div className="pt-6">
          {activeTab === 'description' && (
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          )}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {product.specs.map(spec => (
                <div key={spec.key} className="flex text-sm border-b pb-2">
                  <span className="font-semibold text-slate-600 w-1/3">{spec.key}</span>
                  <span className="text-slate-800 w-2/3">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              {product.reviews.length > 0 ? (
                product.reviews.map(review => (
                  <div key={review.id} className="border-b py-4">
                    <div className="flex items-center mb-2">
                      <img src={review.avatarUrl} alt={review.userName} loading="lazy" className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <p className="font-semibold text-slate-800">{review.userName}</p>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                      <div className="ml-auto">{renderRating(review.rating)}</div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No reviews for this product yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetailScreen;