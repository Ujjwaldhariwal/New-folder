
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-[var(--card-color)] text-[var(--card-Header-color)] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-red-500 text-lg font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[90vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;