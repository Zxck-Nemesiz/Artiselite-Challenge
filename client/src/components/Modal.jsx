import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-n-8 rounded-lg p-6 relative max-w-lg w-full">
        <button className="absolute top-3 right-4 text-white" onClick={onClose}>
          &times;
        </button>
        <div className="flex justify-center mt-4 text-center mb-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
