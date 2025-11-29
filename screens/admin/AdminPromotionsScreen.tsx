
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import { Promotion, UserType } from '../../types/index';
import Modal from '../../components/shared/Modal';
import MultiSelectDropdown, { Option } from '../../components/shared/MultiSelectDropdown';

const AdminPromotionsScreen: React.FC = () => {
    const { promotions, handleCreatePromotion, handleDeletePromotion, categories, users, products } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [code, setCode] = useState('');
    const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [usageLimit, setUsageLimit] = useState<number | ''>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const handleSubmit = () => {
        if (!code || !value || !expiryDate) return;
        handleCreatePromotion({
            code: code.toUpperCase(),
            type,
            value,
            expiryDate,
            usageLimit: usageLimit === '' ? undefined : usageLimit,
            applicableCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
            applicableSubcategories: selectedSubcategories.length > 0 ? selectedSubcategories : undefined,
            applicableVendors: selectedVendors.length > 0 ? selectedVendors : undefined,
            applicableProductIds: selectedProducts.length > 0 ? selectedProducts : undefined,
        });
        setIsModalOpen(false);
        // Reset
        setCode('');
        setValue(0);
        setExpiryDate('');
        setUsageLimit('');
        setSelectedCategories([]);
        setSelectedSubcategories([]);
        setSelectedVendors([]);
        setSelectedProducts([]);
    };

    // --- Derived Options ---

    // 1. Category Options
    const categoryOptions: Option[] = categories.map(c => ({ label: c.name, value: c.name }));

    // 2. Subcategory Options (Filtered by selected categories)
    const subcategoryOptions: Option[] = useMemo(() => {
        if (selectedCategories.length === 0) return []; 
        return categories
            .filter(c => selectedCategories.includes(c.name))
            .flatMap(c => c.subcategories || [])
            .filter((val, index, self) => self.indexOf(val) === index) // Unique
            .map(s => ({ label: s, value: s }));
    }, [categories, selectedCategories]);

    // 3. Vendor Options
    const vendorOptions: Option[] = useMemo(() => {
        return users
            .filter(u => u.type === UserType.VENDOR)
            .map(v => ({ label: v.name, value: v.id, subtitle: v.email }));
    }, [users]);

    // 4. Product Options (Filtered by Category AND Vendor if selected)
    const productOptions: Option[] = useMemo(() => {
        return products
            .filter(p => {
                const catMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
                const subCatMatch = selectedSubcategories.length === 0 || (p.subcategory && selectedSubcategories.includes(p.subcategory));
                const vendorMatch = selectedVendors.length === 0 || selectedVendors.includes(p.vendorId);
                return catMatch && (!selectedSubcategories.length || subCatMatch) && vendorMatch;
            })
            .map(p => ({ label: p.name, value: p.id, subtitle: `N${p.price}` }));
    }, [products, selectedCategories, selectedSubcategories, selectedVendors]);


    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Promotions & Coupons</h2>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium">
                    + Create Promotion
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Value</th>
                                <th className="px-6 py-3">Restrictions</th>
                                <th className="px-6 py-3">Usage</th>
                                <th className="px-6 py-3">Expiry</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promo => (
                                <tr key={promo.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{promo.code}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${promo.type === 'percentage' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                            {promo.type === 'fixed' ? `N ${promo.value.toLocaleString()}` : `${promo.value}%`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs space-y-1">
                                            {(!promo.applicableCategories?.length && !promo.applicableVendors?.length && !promo.applicableProductIds?.length) && <span className="text-slate-400">None (All Items)</span>}
                                            
                                            {promo.applicableCategories && promo.applicableCategories.length > 0 && 
                                                <span className="block text-slate-700">Cats: {promo.applicableCategories.length} selected</span>}
                                            
                                            {promo.applicableVendors && promo.applicableVendors.length > 0 && 
                                                <span className="block text-slate-700">Vendors: {promo.applicableVendors.length} selected</span>}
                                            
                                            {promo.applicableProductIds && promo.applicableProductIds.length > 0 && 
                                                <span className="block text-emerald-600 font-medium">Products: {promo.applicableProductIds.length} specific items</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{promo.usageCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : ''}</td>
                                    <td className="px-6 py-4">{promo.expiryDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${promo.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeletePromotion(promo.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {promotions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">No active promotions.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Promotion">
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 pb-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Coupon Code</label>
                        <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SAVE20" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Type</label>
                            <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (N)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Value</label>
                            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                            <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Usage Limit</label>
                            <input type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Unlimited" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" />
                        </div>
                    </div>
                    
                    <div className="border-t pt-4 space-y-4">
                        <h4 className="font-semibold text-slate-800 text-sm">Applicability Criteria</h4>
                        <p className="text-xs text-slate-500 -mt-2">Leave sections empty to apply to all.</p>

                        {/* Categories */}
                        <MultiSelectDropdown 
                            label="Target Categories" 
                            options={categoryOptions} 
                            selectedValues={selectedCategories} 
                            onChange={setSelectedCategories} 
                            placeholder="All Categories"
                        />

                        {/* Subcategories (Conditional) */}
                        {subcategoryOptions.length > 0 && (
                            <MultiSelectDropdown 
                                label="Target Subcategories" 
                                options={subcategoryOptions} 
                                selectedValues={selectedSubcategories} 
                                onChange={setSelectedSubcategories} 
                                placeholder="All Subcategories"
                            />
                        )}

                        {/* Vendors */}
                        <MultiSelectDropdown 
                            label="Specific Vendors" 
                            options={vendorOptions} 
                            selectedValues={selectedVendors} 
                            onChange={setSelectedVendors} 
                            placeholder="All Vendors"
                        />

                        {/* Specific Products */}
                        <MultiSelectDropdown 
                            label="Specific Products" 
                            options={productOptions} 
                            selectedValues={selectedProducts} 
                            onChange={setSelectedProducts} 
                            placeholder="All Products (matching above filters)"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full">Save Promotion</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminPromotionsScreen;
