'use client';
import React from 'react';
import MerchandiseAccordion from '@/components/MerchandiseAccordion';

const ManageGymwear = () => {
  return (
    <div className='w-full h-[90vh] overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-6'>Manage Gymwear</h1>
        <MerchandiseAccordion />
      </div>
    </div>
  );
};

export default ManageGymwear;
