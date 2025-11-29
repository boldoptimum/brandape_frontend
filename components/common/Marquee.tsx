
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

const Marquee: React.FC = () => {
  const { homepageContent } = useAppContext();

  // Guard clause if content isn't loaded or marquee is disabled
  if (!homepageContent || !homepageContent.marquee || !homepageContent.marquee.enabled) {
    return null;
  }

  const items = homepageContent.marquee.items;

  // If no items, don't render
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white text-emerald-800 overflow-hidden py-2 border-b border-emerald-100">
      <div className="animate-marquee flex space-x-12">
        {/* Repeat items 3 times to ensure smooth looping for typical screen widths */}
        {[...items, ...items, ...items].map((item, index) => (
          <span key={index} className="text-sm font-semibold uppercase tracking-wider flex items-center whitespace-nowrap">
            <span className="mr-2 text-emerald-500">★</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
