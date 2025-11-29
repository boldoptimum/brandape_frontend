import React from 'react';
import Spinner from './Spinner';

interface GlobalSpinnerProps {
    isLoading: boolean;
}

const GlobalSpinner: React.FC<GlobalSpinnerProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed top-5 right-5 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <Spinner size="md" />
        </div>
    );
};

export default GlobalSpinner;
