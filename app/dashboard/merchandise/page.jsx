'use client';
import React from 'react';
import useStore from '@/utils/store';
import MerchandiseDataTable from './_merchandiseTable';

const Merchandise = () => {
  const { showCreateMerchandiseModal, setShowCreateMerchandiseModal } = useStore();

  return (
    <div className='w-full flex flex-col items-center h-full p-4'>
      <div className='flex flex-row justify-between w-full items-center'>
        <p className='text-2xl font-semibold text-black'>Merchandise</p>

        <button
          onClick={() => {
            setShowCreateMerchandiseModal({
              show: true,
              id: '',
              mode: 'create',
              refresh: !showCreateMerchandiseModal?.refresh,
            });
          }}
          className='bg-black text-white px-4 py-2 rounded-md'
        >
          Add Merchandise
        </button>
      </div>
      <div className='w-full flex flex-col max-h-[70vh] mt-4'>
        <MerchandiseDataTable />
      </div>
    </div>
  );
};

export default Merchandise;
