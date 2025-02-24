'use client';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/30'>
      <div className='bg-white w-10/12 max-h-[80vh] overflow-y-auto py-6 px-8 rounded-lg shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-black'>{title}</h2>
          <IoMdClose onClick={onClose} className='text-2xl cursor-pointer' />
        </div>
        <div className='space-y-6'>{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;
