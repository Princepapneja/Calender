import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  return (
    <div className={`fixed grid place-items-center top-0 left-0 w-screen h-screen z-10 backdrop-blur-sm backdrop-brightness-50 duration-300 ${isOpen ? 'opacity-100 visible transition-opacity' : 'opacity-0 invisible transition-opacity'}`}>
      <div className="shadow-lg">
        <div className="relative bg-white rounded-lg p-8 max-w-md">
          <button className="absolute top-0 right-0 mr-4 mt-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
          {children && <div className="mb-4">{children}</div>}
          {actions && <div className="flex justify-end">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  actions: PropTypes.element
};

export default Modal;
