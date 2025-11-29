
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import FileUpload from '../../components/shared/FileUpload';
import { useAppContext } from '../../hooks/useAppContext';
import { HomepageContent } from '../../types/index';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { AppView } from '../../types/index';

const fileToDataUri = (file: File) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        resolve(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
});

const AdminBrandingScreen: React.FC = () => {
    const { homepageContent, handleUpdateHomepageContent, navigateTo } = useAppContext();
    const [branding, setBranding] = useState({ logoDark: '', logoLight: '', favicon: '' });

    useEffect(() => {
        if (homepageContent?.branding) {
            setBranding(homepageContent.branding);
        }
    }, [homepageContent]);

    const handleSave = () => {
        if (!homepageContent) return;
        const updatedContent: HomepageContent = {
            ...homepageContent,
            branding: branding
        };
        handleUpdateHomepageContent(updatedContent);
    };

    const handleFileChange = async (file: File | null, field: 'logoDark' | 'logoLight' | 'favicon') => {
        if (file) {
            const uri = await fileToDataUri(file);
            setBranding(prev => ({ ...prev, [field]: uri }));
        }
    };

    return (
        <DashboardLayout>
             <button onClick={() => navigateTo(AppView.SETTINGS)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Settings
            </button>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Site Branding & Logos</h2>
                <div className="bg-white p-8 rounded-lg shadow border border-slate-100 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Dark Logo</h3>
                            <p className="text-xs text-slate-500 mb-4">Used on light backgrounds (e.g. Header). Should be dark colored.</p>
                            <FileUpload 
                                label="Upload Dark Logo" 
                                onFileChange={(f) => handleFileChange(f, 'logoDark')} 
                                currentImageUrl={branding.logoDark} 
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Light Logo</h3>
                            <p className="text-xs text-slate-500 mb-4">Used on dark backgrounds (e.g. Footer, Auth Sidebar). Should be light colored.</p>
                            <div className="bg-slate-800 p-4 rounded-md">
                                <FileUpload 
                                    label="Upload Light Logo" 
                                    onFileChange={(f) => handleFileChange(f, 'logoLight')} 
                                    currentImageUrl={branding.logoLight} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-8">
                        <h3 className="font-semibold text-slate-800 mb-2">Favicon</h3>
                        <p className="text-xs text-slate-500 mb-4">Browser tab icon. Recommended size: 32x32px or 64x64px.</p>
                        <div className="w-32">
                            <FileUpload 
                                label="Upload Favicon" 
                                onFileChange={(f) => handleFileChange(f, 'favicon')} 
                                currentImageUrl={branding.favicon} 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminBrandingScreen;
