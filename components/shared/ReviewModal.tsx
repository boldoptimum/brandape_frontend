
import React, { useState } from 'react';
import Modal from './Modal';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    productName: string;
}

const StarIcon: React.FC<{filled: boolean, onClick?: () => void}> = ({ filled, onClick }) => (
    <svg 
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth={1.5}
        className={`w-8 h-8 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, productName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        onSubmit(rating, comment);
        setRating(0);
        setComment('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Review ${productName}`}>
            <div className="space-y-4">
                <div className="flex justify-center space-x-2 py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                            key={star} 
                            filled={star <= rating} 
                            onClick={() => setRating(star)} 
                        />
                    ))}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Comment (Optional)</label>
                    <textarea 
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                        rows={4}
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                    <button 
                        onClick={handleSubmit} 
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ReviewModal;
