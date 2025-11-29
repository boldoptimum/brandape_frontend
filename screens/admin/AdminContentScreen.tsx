
import React, { useState, useEffect } from 'react';
import { HomepageContent } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import FileUpload from '../../components/shared/FileUpload';
import { useAppContext } from '../../hooks/useAppContext';

const fileToDataUri = (file: File) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        resolve(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
});

const AdminContentScreen: React.FC = () => {
  const { homepageContent: content, handleUpdateHomepageContent } = useAppContext();
  const [localContent, setLocalContent] = useState<HomepageContent | null>(null);
  const [activeTab, setActiveTab] = useState<'marquee' | 'hero' | 'promo' | 'features' | 'delivery'>('marquee');
  const [marqueeInput, setMarqueeInput] = useState('');

  useEffect(() => {
    if (content) {
      setLocalContent(content);
      if (content.marquee?.items) {
          setMarqueeInput(content.marquee.items.join('\n'));
      }
    }
  }, [content]);

  if (!localContent) {
    return (
      <DashboardLayout>
        <div>Loading content...</div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const marqueeItems = marqueeInput.split('\n').filter(item => item.trim() !== '');
    
    const updatedContent = {
        ...localContent,
        marquee: {
            ...localContent.marquee,
            items: marqueeItems
        }
    };

    handleUpdateHomepageContent(updatedContent);
  };
  
  const toggleSection = (section: keyof Omit<HomepageContent, 'branding'>) => {
      setLocalContent(prev => {
          if (!prev) return null;
          // @ts-ignore dynamic access
          return { ...prev, [section]: { ...prev[section], enabled: !prev[section].enabled } };
      });
  };

  // Hero Handlers
  const handleHeroModeChange = (mode: 'static' | 'slider') => {
      setLocalContent(prev => prev ? ({ ...prev, hero: { ...prev.hero, mode } }) : null);
  };

  const handleAddSlide = () => {
      setLocalContent(prev => prev ? ({
          ...prev,
          hero: {
              ...prev.hero,
              slides: [...prev.hero.slides, { title: 'New Slide', subtitle: 'Subtitle', imageUrl: '' }]
          }
      }) : null);
  };

  const handleSlideChange = (index: number, field: string, value: string) => {
      setLocalContent(prev => {
          if (!prev) return null;
          const newSlides = [...prev.hero.slides];
          newSlides[index] = { ...newSlides[index], [field]: value };
          return { ...prev, hero: { ...prev.hero, slides: newSlides } };
      });
  };

  const removeSlide = (index: number) => {
       setLocalContent(prev => {
          if (!prev) return null;
          const newSlides = prev.hero.slides.filter((_, i) => i !== index);
          return { ...prev, hero: { ...prev.hero, slides: newSlides } };
      });
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...localContent.features.items];
    newFeatures[index] = {...newFeatures[index], [field]: value};
    setLocalContent({...localContent, features: { ...localContent.features, items: newFeatures }});
  };

  const handleDeliveryChange = (field: keyof HomepageContent['deliverySection'], value: string) => {
    setLocalContent({
        ...localContent, 
        deliverySection: {
            ...localContent.deliverySection, 
            [field]: value
        }
    });
  };

  return (
    <DashboardLayout>
       <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Homepage Content Management</h2>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
                <button onClick={() => setActiveTab('marquee')} className={`flex-1 py-4 px-2 text-sm font-medium whitespace-nowrap ${activeTab === 'marquee' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>Announcement Bar</button>
                <button onClick={() => setActiveTab('hero')} className={`flex-1 py-4 px-2 text-sm font-medium whitespace-nowrap ${activeTab === 'hero' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>Hero Section</button>
                <button onClick={() => setActiveTab('promo')} className={`flex-1 py-4 px-2 text-sm font-medium whitespace-nowrap ${activeTab === 'promo' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>Promotions</button>
                <button onClick={() => setActiveTab('features')} className={`flex-1 py-4 px-2 text-sm font-medium whitespace-nowrap ${activeTab === 'features' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>Features</button>
                <button onClick={() => setActiveTab('delivery')} className={`flex-1 py-4 px-2 text-sm font-medium whitespace-nowrap ${activeTab === 'delivery' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>Delivery</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                
                {/* Global Visibility Toggle for Current Section */}
                <div className="flex justify-end mb-4">
                  <label className="flex items-center cursor-pointer">
                      <div className="relative">
                          <input type="checkbox" className="sr-only" checked={localContent[activeTab]?.enabled} onChange={() => toggleSection(activeTab)} />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${localContent[activeTab]?.enabled ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localContent[activeTab]?.enabled ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                          {localContent[activeTab]?.enabled ? 'Section Visible' : 'Section Hidden'}
                      </div>
                  </label>
                </div>

                {/* Marquee Section */}
                {activeTab === 'marquee' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Announcement Bar Configuration</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Announcements (One per line)</label>
                            <textarea 
                                value={marqueeInput} 
                                onChange={e => setMarqueeInput(e.target.value)} 
                                rows={8} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
                                placeholder="Free Shipping on orders over $50&#10;New arrivals are here!&#10;..."
                            />
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                {activeTab === 'hero' && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-lg font-medium text-gray-900">Hero Banner Configuration</h3>
                        
                        <div className="flex space-x-6 mb-4">
                          <label className="inline-flex items-center">
                              <input type="radio" className="form-radio text-emerald-600" name="heroMode" value="static" checked={localContent.hero.mode === 'static'} onChange={() => handleHeroModeChange('static')} />
                              <span className="ml-2">Static Single Image</span>
                          </label>
                          <label className="inline-flex items-center">
                              <input type="radio" className="form-radio text-emerald-600" name="heroMode" value="slider" checked={localContent.hero.mode === 'slider'} onChange={() => handleHeroModeChange('slider')} />
                              <span className="ml-2">Image Slider</span>
                          </label>
                      </div>

                      {localContent.hero.mode === 'slider' && (
                          <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">Autoplay Interval (ms)</label>
                              <input type="number" value={localContent.hero.interval} onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, interval: Number(e.target.value)}})} className="mt-1 w-32 px-3 py-2 border border-gray-300 rounded shadow-sm" />
                          </div>
                      )}

                      {localContent.hero.slides.map((slide, index) => {
                          // If static, only show first slide config or use dedicated fields
                          if(localContent.hero.mode === 'static' && index > 0) return null;

                          return (
                            <div key={index} className="border p-4 rounded-lg bg-slate-50 relative">
                                <h4 className="font-bold text-slate-700 mb-2">{localContent.hero.mode === 'static' ? 'Static Content' : `Slide ${index + 1}`}</h4>
                                {localContent.hero.mode === 'slider' && index > 0 && (
                                    <button type="button" onClick={() => removeSlide(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">Remove</button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <input type="text" placeholder="Title" value={slide.title} onChange={e => handleSlideChange(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded" />
                                        <textarea placeholder="Subtitle" value={slide.subtitle} onChange={e => handleSlideChange(index, 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded" rows={2} />
                                    </div>
                                    <div>
                                        <FileUpload label="Background Image" currentImageUrl={slide.imageUrl} onFileChange={async (f) => { if(f) { const uri = await fileToDataUri(f); handleSlideChange(index, 'imageUrl', uri); } }} />
                                    </div>
                                </div>
                            </div>
                          );
                      })}
                      
                      {localContent.hero.mode === 'slider' && (
                          <button type="button" onClick={handleAddSlide} className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50">
                              + Add Slide
                          </button>
                      )}
                    </div>
                )}

                {/* Promotion Section */}
                {activeTab === 'promo' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Seasonal Promotion Banner</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Promotion Text (e.g., "37% OFF")</label>
                            <input type="text" value={localContent.promo.text} onChange={e => setLocalContent({...localContent, promo: {...localContent.promo, text: e.target.value}})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" />
                        </div>
                        <div>
                            <FileUpload 
                                label="Promotion Background Image" 
                                onFileChange={async (file) => {
                                    if(file) {
                                        const dataUri = await fileToDataUri(file);
                                        setLocalContent({...localContent, promo: {...localContent.promo, imageUrl: dataUri}});
                                    }
                                }}
                                currentImageUrl={localContent.promo.imageUrl}
                           />
                        </div>
                    </div>
                )}

                {/* Features Section */}
                {activeTab === 'features' && (
                    <div className="animate-fade-in">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Value Propositions</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {localContent.features.items.map((feature, index) => (
                                <div key={index} className="border p-4 rounded-md space-y-2 bg-slate-50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-bold text-slate-700 text-sm">Feature {index + 1}</span>
                                        <span className="text-xs text-slate-500">({feature.icon.replace('Icon','')})</span>
                                    </div>
                                     <div>
                                        <label className="block text-xs font-medium text-gray-600">Title</label>
                                        <input type="text" value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} required className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600">Description</label>
                                        <input type="text" value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} required className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-white" />
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}

                {/* Delivery Section */}
                {activeTab === 'delivery' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Info Section</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={localContent.deliverySection.title} onChange={e => handleDeliveryChange('title', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={localContent.deliverySection.description} onChange={e => handleDeliveryChange('description', e.target.value)} rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Sub-description</label>
                            <input type="text" value={localContent.deliverySection.subDescription} onChange={e => handleDeliveryChange('subDescription', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Button Text</label>
                            <input type="text" value={localContent.deliverySection.buttonText} onChange={e => handleDeliveryChange('buttonText', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" />
                        </div>
                        <div>
                           <FileUpload 
                                label="Delivery Section Image" 
                                onFileChange={async (file) => {
                                    if(file) {
                                      const dataUri = await fileToDataUri(file);
                                      const newDeliverySection = {...localContent.deliverySection, imageUrl: dataUri};
                                      setLocalContent({...localContent, deliverySection: newDeliverySection});
                                    }
                                }}
                                currentImageUrl={localContent.deliverySection.imageUrl}
                           />
                        </div>
                    </div>
                )}

                 <div className="flex justify-end pt-6 border-t mt-6">
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium transform transition hover:-translate-y-0.5">Save Changes</button>
                </div>
            </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminContentScreen;
