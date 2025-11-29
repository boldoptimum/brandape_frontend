
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

interface BrandApeLogoProps extends React.SVGProps<SVGSVGElement> {
    variant?: 'dark' | 'light'; // 'dark' = dark logo for light bg, 'light' = light logo for dark bg
}

const BrandApeLogo: React.FC<BrandApeLogoProps> = ({ variant = 'dark', ...props }) => {
  const { homepageContent } = useAppContext();
  const branding = homepageContent?.branding;

  // If branding exists and the specific logo variant is set, render image
  if (branding) {
      if (variant === 'dark' && branding.logoDark) {
          return <img src={branding.logoDark} alt="Logo" className={props.className} style={{height: 'inherit', width: 'auto'}} />;
      }
      if (variant === 'light' && branding.logoLight) {
          return <img src={branding.logoLight} alt="Logo" className={props.className} style={{height: 'inherit', width: 'auto'}} />;
      }
  }

  // Fallback SVG
  return (
    <svg viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 2L12 12L6 22L0 12L6 2Z" fill="currentColor" fillOpacity="0.7"/>
      <path d="M14 2L20 12L14 22L8 12L14 2Z" fill="currentColor"/>
      <text x="30" y="18" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="800" fill="currentColor">
        BrandApe
      </text>
    </svg>
  );
};

export default BrandApeLogo;
