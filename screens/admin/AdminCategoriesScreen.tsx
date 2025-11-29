
import React, { useState, useEffect } from 'react';
import { AppView, Category } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/shared/Modal';
import { useAppContext } from '../../hooks/useAppContext';

const AdminCategoriesScreen: React.FC = () => {
    const { 
        categories, handleAddCategory, handleUpdateCategory, 
        handleDeleteCategory, handleAddSubCategory, handleDeleteSubCategory
    } = useAppContext();

    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryToManage, setCategoryToManage] = useState<Category | null>(null);

    // State for inside the modal
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [newSubCategoryName, setNewSubCategoryName] = useState('');

    useEffect(() => {
        if (categoryToManage) {
            setEditingCategoryName(categoryToManage.name);
        } else {
            // Reset when modal is closed
            setEditingCategoryName('');
            setNewSubCategoryName('');
        }
    }, [categoryToManage]);

    const handleAddCategoryClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            handleAddCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    const handleSaveChanges = () => {
        if (!categoryToManage) return;
        if (editingCategoryName.trim() && editingCategoryName.trim() !== categoryToManage.name) {
            handleUpdateCategory(categoryToManage.id, editingCategoryName.trim());
        }
        setCategoryToManage(null);
    };
    
    const handleAddSubCategoryClick = () => {
        if (!categoryToManage || !newSubCategoryName.trim()) return;
        handleAddSubCategory(categoryToManage.id, newSubCategoryName.trim());
        setNewSubCategoryName('');
    };

    // This ensures the modal always shows the most up-to-date category info from props
    const categoryInModal = categoryToManage ? categories.find(c => c.id === categoryToManage.id) : null;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Manage Product Categories</h2>
                
                <div className="bg-white shadow rounded p-6 mb-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Add New Category</h3>
                    <form onSubmit={handleAddCategoryClick} className="flex space-x-2">
                        <input 
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            className="flex-grow px-3 py-2 border border-slate-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                        />
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium">Add</button>
                    </form>
                </div>

                <div className="bg-white shadow rounded overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-500">
                          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                              <tr>
                                  <th className="px-6 py-3">Category</th>
                                  <th className="px-6 py-3">Sub-categories Count</th>
                                  <th className="px-6 py-3 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {categories.map(category => (
                                  <tr key={category.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                      <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                                      <td className="px-6 py-4">{(category.subcategories || []).length}</td>
                                      <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end space-x-4">
                                            <button onClick={() => setCategoryToManage(category)} className="font-medium text-emerald-600 hover:underline text-xs">Manage</button>
                                            <button onClick={() => handleDeleteCategory(category)} className="font-medium text-red-600 hover:underline text-xs">Delete</button>
                                        </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>
            </div>
            
            <Modal isOpen={!!categoryToManage} onClose={() => setCategoryToManage(null)} title={`Manage: ${categoryToManage?.name}`}>
                {categoryInModal && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Category Name</label>
                            <input 
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm bg-white"
                            />
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Sub-categories</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border rounded p-2 bg-slate-50">
                                {(categoryInModal.subcategories || []).length > 0 ? (
                                    (categoryInModal.subcategories || []).map(sub => (
                                        <div key={sub} className="flex justify-between items-center bg-slate-200 p-2 rounded">
                                            <span className="text-sm text-slate-800">{sub}</span>
                                            <button onClick={() => handleDeleteSubCategory(categoryInModal.id, sub)} className="text-red-500 hover:text-red-700" aria-label={`Delete ${sub}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 italic text-center py-4">No sub-categories yet.</p>
                                )}
                            </div>
                             <div className="flex space-x-2 mt-3">
                                <input 
                                    type="text" 
                                    placeholder="New sub-category name"
                                    value={newSubCategoryName}
                                    onChange={e => setNewSubCategoryName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddSubCategoryClick()}
                                    className="flex-grow px-3 py-2 border border-slate-300 rounded shadow-sm bg-white"
                                />
                                <button onClick={handleAddSubCategoryClick} className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm font-medium">Add</button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button onClick={() => setCategoryToManage(null)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300">Cancel</button>
                            <button onClick={handleSaveChanges} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Changes</button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default AdminCategoriesScreen;