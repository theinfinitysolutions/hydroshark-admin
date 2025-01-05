'use client';
import React from 'react';
import useStore from '@/utils/store';
import MerchandiseTypesTable from './_merchandiseTypesTable';

const MerchandiseTypes = () => {
  const { showCreateMerchandiseTypeModal, setShowCreateMerchandiseTypeModal } = useStore();

  return (
    <div className='w-full flex flex-col items-center h-full p-4'>
      <div className='flex flex-row justify-between w-full items-center'>
        <p className='text-2xl font-semibold text-black'>Merchandise Types</p>

        <button
          onClick={() => {
            setShowCreateMerchandiseTypeModal({
              show: true,
              id: '',
              mode: 'create',
              refresh: !showCreateMerchandiseTypeModal?.refresh,
            });
          }}
          className='bg-black text-white px-4 py-2 rounded-md'
        >
          Add Type
        </button>
      </div>
      <div className='w-full flex flex-col max-h-[70vh] mt-4'>
        <MerchandiseTypesTable />
      </div>
    </div>
  );
};

export default MerchandiseTypes;
