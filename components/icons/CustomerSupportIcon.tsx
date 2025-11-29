import React from 'react';

const CustomerSupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v1.5a6 6 0 00-6 6v1.5a6 6 0 006 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75v.008" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12.75h.008" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 15.75h.008" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75v.008" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12.75h.008" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75h.008" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default CustomerSupportIcon;
