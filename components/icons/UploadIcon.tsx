
import React from 'react';

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75c0-1.148.927-2.075 2.075-2.075H18.925c1.148 0 2.075.927 2.075 2.075v10.5c0 1.148-.927 2.075-2.075 2.075H5.075C3.927 19.325 3 18.398 3 17.25z" />
  </svg>
);

export default UploadIcon;
