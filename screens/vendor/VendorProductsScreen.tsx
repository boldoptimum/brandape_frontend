

import React from 'react';
import { AppView, Product } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';

const getStatusClass = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800';
};

const getStockClass = (stock: number) => {
    if (stock > 50) return 'text-green-600';
    if (stock > 0) return 'text-yellow-600';
    return 'text-red-600';
};

const VendorProductsScreen: React.FC = () => {
    const { products, navigateTo, setSelectedProduct, handleDeleteProduct } = useAppContext();

    const onAddProduct = () => {
        setSelectedProduct(null); // Clear selected product to indicate creation mode
        navigateTo(AppView.VENDOR_ADD_EDIT_PRODUCT);
    };

    const onEditProduct = (product: Product) => {
        setSelectedProduct(product);
        navigateTo(AppView.VENDOR_ADD_EDIT_PRODUCT);
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">Products</h2>
                <button onClick={onAddProduct} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Product
                </button>
            </div>
            
            <div className="bg-white shadow rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
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
                            {products.map((product) => (
                                <tr key={product.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover mr-4" />
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VendorProductsScreen;