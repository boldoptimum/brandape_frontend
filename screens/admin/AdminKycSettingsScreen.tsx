
import React, { useState } from 'react';
import { AppView, KycField } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { useAppContext } from '../../hooks/useAppContext';

const AdminKycSettingsScreen: React.FC = () => {
  const { navigateTo, kycFields: initialKycFields, handleUpdateKycFields } = useAppContext();
  const [fields, setFields] = useState<KycField[]>(initialKycFields);

  const handleAddField = () => {
    setFields([...fields, { 
        id: `new_${Date.now()}`, 
        label: '', 
        type: 'text', 
        required: true,
        textInputType: 'text' 
    }]);
  };

  const handleFieldChange = (id: string, key: keyof KycField, value: any) => {
    setFields(fields.map(f => {
        if (f.id !== id) return f;
        
        // Handle specific type resets
        if (key === 'type') {
            if (value === 'file') {
                return { ...f, type: 'file', allowedFormats: ['.jpg', '.png', '.pdf'], maxSize: 5, textInputType: undefined, placeholder: undefined };
            } else {
                return { ...f, type: 'text', textInputType: 'text', allowedFormats: undefined, maxSize: undefined };
            }
        }
        
        return { ...f, [key]: value };
    }));
  };
  
  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSaveChanges = () => {
    const validFields = fields.filter(f => f.label.trim() !== '');
    handleUpdateKycFields(validFields);
  };

  const toggleFormat = (fieldId: string, format: string) => {
      const field = fields.find(f => f.id === fieldId);
      if (!field || !field.allowedFormats) return;
      
      const newFormats = field.allowedFormats.includes(format)
        ? field.allowedFormats.filter(f => f !== format)
        : [...field.allowedFormats, format];
      
      handleFieldChange(fieldId, 'allowedFormats', newFormats);
  };
  
  return (
    <DashboardLayout>
       <div>
         <button onClick={() => navigateTo(AppView.SETTINGS)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to General Settings
        </button>
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">KYC Requirements</h2>
                    <p className="text-sm text-gray-600 mt-1">Configure documents and information users must provide.</p>
                </div>
                <button onClick={handleAddField} className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Field
                </button>
            </div>

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 relative group transition-all hover:shadow-md">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleRemoveField(field.id)} className="text-red-400 hover:text-red-600 p-2">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Main Info */}
                            <div className="md:col-span-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Field Label</label>
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                                        placeholder="e.g. Driver's License"
                                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Input Type</label>
                                        <select 
                                            value={field.type} 
                                            onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                                        >
                                            <option value="text">Text Input</option>
                                            <option value="file">File Upload</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center h-full pt-6">
                                        <input 
                                            id={`req-${field.id}`}
                                            type="checkbox" 
                                            checked={field.required} 
                                            onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                                        />
                                        <label htmlFor={`req-${field.id}`} className="ml-2 block text-sm text-slate-700">Required</label>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Area */}
                            <div className="md:col-span-7 bg-slate-50 rounded-lg p-4 border border-slate-100 h-full">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Configuration</h4>
                                
                                {field.type === 'file' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-2">Allowed Formats</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['.pdf', '.jpg', '.png', '.doc'].map(fmt => (
                                                    <label key={fmt} className="inline-flex items-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={field.allowedFormats?.includes(fmt)}
                                                            onChange={() => toggleFormat(field.id, fmt)}
                                                            className="h-3 w-3 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
                                                        />
                                                        <span className="ml-1 text-sm text-slate-600 uppercase">{fmt.replace('.','')}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Max Size (MB)</label>
                                            <select 
                                                value={field.maxSize} 
                                                onChange={(e) => handleFieldChange(field.id, 'maxSize', Number(e.target.value))}
                                                className="block w-full max-w-[120px] px-2 py-1 border border-slate-300 rounded shadow-sm text-sm"
                                            >
                                                <option value={1}>1 MB</option>
                                                <option value={2}>2 MB</option>
                                                <option value={5}>5 MB</option>
                                                <option value={10}>10 MB</option>
                                                <option value={20}>20 MB</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Text Type</label>
                                                <select 
                                                    value={field.textInputType} 
                                                    onChange={(e) => handleFieldChange(field.id, 'textInputType', e.target.value)}
                                                    className="block w-full px-2 py-1 border border-slate-300 rounded shadow-sm text-sm"
                                                >
                                                    <option value="text">Single Line Text</option>
                                                    <option value="email">Email</option>
                                                    <option value="number">Number</option>
                                                    <option value="date">Date</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Placeholder</label>
                                                <input 
                                                    type="text" 
                                                    value={field.placeholder || ''} 
                                                    onChange={(e) => handleFieldChange(field.id, 'placeholder', e.target.value)}
                                                    className="block w-full px-2 py-1 border border-slate-300 rounded shadow-sm text-sm"
                                                    placeholder="Placeholder text..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end pt-6 border-t border-slate-200">
                <button onClick={handleSaveChanges} className="px-8 py-3 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 font-bold transform transition hover:-translate-y-0.5">
                    Save Changes
                </button>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminKycSettingsScreen;
