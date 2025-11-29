
import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from '../icons/UploadIcon';

interface FileUploadProps {
  label: string;
  onFileChange: (file: File | null) => void;
  currentImageUrl?: string;
  isAvatar?: boolean;
  acceptedFormats?: string[]; // e.g. ['.jpg', '.png', '.pdf']
  maxSizeInMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
    label, 
    onFileChange, 
    currentImageUrl, 
    isAvatar = false,
    acceptedFormats = ['.pdf', '.jpeg', '.jpg', '.png'],
    maxSizeInMB = 5 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate Size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
          setError(`File too large. Max size is ${maxSizeInMB}MB.`);
          onFileChange(null);
          setFileName(null);
          return;
      }

      // Validate Type (Simple extension check for UX)
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      // Ensure acceptedFormats are lowercase for comparison
      const formats = acceptedFormats.map(f => f.toLowerCase());
      if (formats.length > 0 && !formats.includes(fileExtension) && !acceptedFormats.some(fmt => file.type.includes(fmt.replace('.','')))) {
           // Fallback to checking MIME type if extension check is ambiguous, but for now simple extension check is standard for this context
           // Or strictly check if acceptedFormats contains the extension
           setError(`Invalid file format. Accepted: ${acceptedFormats.join(', ')}`);
           onFileChange(null);
           setFileName(null);
           return;
      }

      onFileChange(file);
      setFileName(file.name);
      
      if (file.type.startsWith('image/')) {
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
      } else {
        setPreviewUrl(null); // Not an image file, show icon/name instead
      }
    } else {
      onFileChange(null);
      setFileName(null);
      setPreviewUrl(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const containerClasses = isAvatar 
    ? "relative w-24 h-24 cursor-pointer group"
    : `flex flex-col items-center justify-center p-6 border-2 border-dashed ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50'} rounded text-center cursor-pointer hover:bg-slate-100 transition-colors`;

  return (
    <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">{label}</h3>
        <div 
            className={containerClasses}
            onClick={handleClick}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept={acceptedFormats.join(',')}
            />
             {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className={`object-cover w-full h-full ${isAvatar ? 'rounded-full' : 'rounded'}`} />
                  {isAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold">Change</span>
                    </div>
                  )}
                </>
             ) : (
                <>
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                        <UploadIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    {fileName ? (
                        <p className="text-sm text-slate-700 font-medium">{fileName}</p>
                    ) : (
                        <>
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-emerald-600">Browse files</span> or drop here
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {acceptedFormats.join(', ')} up to {maxSizeInMB}MB
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FileUpload;
