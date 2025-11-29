
import React, { useState, useMemo } from 'react';
import { AppView, Product } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TrashIcon from '../../components/icons/TrashIcon';
import { useAppContext } from '../../hooks/useAppContext';

const getStatusClass = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800';
};

const getStockClass = (stock: number) => {
    if (stock > 50) return 'text-green-600';
    if (stock > 0) return 'text-yellow-600';
    return 'text-red-600';
};

const AdminProductsScreen: React.FC = () => {
    const { 
        products, 
        categories,
        setSelectedProduct, 
        navigateTo, 
        handleDeleteProduct,
        handleBulkDeleteProducts
    } = useAppContext();
    
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortOption, setSortOption] = useState('Name');

    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
            return matchesSearch && matchesCategory;
        });

        return result.sort((a, b) => {
            switch (sortOption) {
                case 'Name': return a.name.localeCompare(b.name);
                case 'Category': return a.category.localeCompare(b.category);
                case 'PriceLowHigh': return a.price - b.price;
                case 'PriceHighLow': return b.price - a.price;
                case 'StockLowHigh': return a.stock - b.stock;
                case 'StockHighLow': return b.stock - a.stock;
                case 'SalesHighLow': return b.sales - a.sales;
                case 'SalesLowHigh': return a.sales - b.sales;
                default: return 0;
            }
        });
    }, [products, searchTerm, categoryFilter, sortOption]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProductIds(filteredProducts.map(p => p.id));
        } else {
            setSelectedProductIds([]);
        }
    };

    const handleSelectOne = (productId: string) => {
        if (selectedProductIds.includes(productId)) {
            setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
        } else {
            setSelectedProductIds([...selectedProductIds, productId]);
        }
    };

    const handleBulkDeleteClick = () => {
        const productsToDelete = products.filter(p => selectedProductIds.includes(p.id));
        if(productsToDelete.length > 0) {
            handleBulkDeleteProducts(productsToDelete);
            setSelectedProductIds([]); // Clear selection after action
        }
    };
    
    const onEditProduct = (product: Product) => {
        // This functionality is shared with vendors for now
        // A more specific admin edit could be made
        setSelectedProduct(product);
        navigateTo(AppView.VENDOR_ADD_EDIT_PRODUCT);
    };
    
    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <input 
                        type="search" 
                        placeholder="Search product name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-slate-300 rounded shadow-sm sm:text-sm bg-white" 
                    />
                    <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <select 
                        value={sortOption} 
                        onChange={(e) => setSortOption(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                        <option value="Name">Name (A-Z)</option>
                        <option value="Category">Category</option>
                        <option value="PriceLowHigh">Price: Low to High</option>
                        <option value="PriceHighLow">Price: High to Low</option>
                        <option value="StockLowHigh">Stock: Low to High</option>
                        <option value="StockHighLow">Stock: High to Low</option>
                        <option value="SalesHighLow">Sales: High to Low</option>
                        <option value="SalesLowHigh">Sales: Low to High</option>
                    </select>
                </div>
            </div>
            {selectedProductIds.length > 0 && (
                <div className="mb-4">
                    <button 
                        onClick={handleBulkDeleteClick} 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium flex items-center"
                    >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Selected ({selectedProductIds.length})
                    </button>
                </div>
            )}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input 
                                            id="checkbox-all-products" 
                                            type="checkbox" 
                                            onChange={handleSelectAll} 
                                            checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                                            className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500"
                                        />
                                        <label htmlFor="checkbox-all-products" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Stock</th>
                                <th scope="col" className="px-6 py-3">Sales</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <tr key={product.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input 
                                                id={`checkbox-product-${product.id}`}
                                                type="checkbox" 
                                                onChange={() => handleSelectOne(product.id)}
                                                checked={selectedProductIds.includes(product.id)}
                                                className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500"
                                            />
                                            <label htmlFor={`checkbox-product-${product.id}`} className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-4" />
                                        <span>{product.name}</span>
                                    </th>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4 font-semibold">N {product.price.toLocaleString()}</td>
                                    <td className={`px-6 py-4 font-medium ${getStockClass(product.stock)}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </td>
                                    <td className="px-6 py-4">{product.sales}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button onClick={() => onEditProduct(product)} className="text-emerald-600 hover:underline text-xs">Edit</button>
                                            <button onClick={() => handleDeleteProduct(product)} className="text-red-600 hover:underline text-xs">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminProductsScreen;
