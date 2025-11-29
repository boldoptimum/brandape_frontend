import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Modal from '../shared/Modal';

const ConfirmationModals: React.FC = () => {
    const { confirmation, setConfirmation, setToast } = useAppContext();

    if (!confirmation) return null;

    const { title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' } = confirmation;

    const handleConfirm = () => {
        onConfirm();
        setConfirmation(null);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        setConfirmation(null);
    };

    return (
        <Modal isOpen={!!confirmation} onClose={handleCancel} title={title}>
            <div>
                <p className="text-sm text-slate-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={handleCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">
                        {cancelText}
                    </button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModals;
