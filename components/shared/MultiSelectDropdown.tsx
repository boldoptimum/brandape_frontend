
import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface Option {
    label: string;
    value: string;
    subtitle?: string; // Optional subtitle (e.g. email for users)
}

interface MultiSelectDropdownProps {
    label: string;
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ 
    label, 
    options, 
    selectedValues, 
    onChange,
    placeholder = "Select options..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setIsOpen(false));

    const toggleOption = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const handleSelectAll = () => {
        if (selectedValues.length === filteredOptions.length) {
            // Deselect visible
            const visibleValues = filteredOptions.map(o => o.value);
            onChange(selectedValues.filter(v => !visibleValues.includes(v)));
        } else {
            // Select visible
            const newValues = new Set([...selectedValues, ...filteredOptions.map(o => o.value)]);
            onChange(Array.from(newValues));
        }
    };

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase()) || 
        (opt.subtitle && opt.subtitle.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm flex justify-between items-center"
            >
                <span className={`truncate ${selectedValues.length === 0 ? 'text-slate-400' : 'text-slate-800'}`}>
                    {selectedValues.length === 0 
                        ? placeholder 
                        : `${selectedValues.length} selected`}
                </span>
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <input 
                            type="text" 
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {filteredOptions.length > 0 && (
                        <div className="px-2 py-1 border-b border-slate-100 bg-slate-50 flex justify-end">
                            <button 
                                type="button" 
                                onClick={handleSelectAll} 
                                className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                            >
                                {selectedValues.length === filteredOptions.length && filteredOptions.length > 0 ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    )}
                    <div className="overflow-y-auto flex-1 p-1 space-y-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div 
                                    key={option.value} 
                                    onClick={() => toggleOption(option.value)}
                                    className={`flex items-start p-2 rounded cursor-pointer text-sm ${selectedValues.includes(option.value) ? 'bg-emerald-50' : 'hover:bg-slate-100'}`}
                                >
                                    <div className={`flex-shrink-0 h-4 w-4 mt-0.5 border rounded mr-2 flex items-center justify-center ${selectedValues.includes(option.value) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white'}`}>
                                        {selectedValues.includes(option.value) && (
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-slate-700 font-medium">{option.label}</div>
                                        {option.subtitle && <div className="text-xs text-slate-500">{option.subtitle}</div>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-sm text-slate-500">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
