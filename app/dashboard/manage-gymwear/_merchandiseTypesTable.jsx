'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { MdEdit } from 'react-icons/md';
import { GoInbox } from 'react-icons/go';
import Spinner from '@/components/Spinner';
import { MdDelete } from 'react-icons/md';

const MerchandiseTypesTable = () => {
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([
    {
      id: 1,
      name: 'T-Shirt',
      description: 'Regular fit cotton t-shirts',
      slug: 't-shirt',
      has_size: true,
      has_color: true,
      created_at: '2024-03-20',
    },
    {
      id: 2,
      name: 'Hoodie',
      description: 'Comfortable hooded sweatshirts',
      slug: 'hoodie',
      has_size: true,
      has_color: true,
      created_at: '2024-03-20',
    },
  ]);
  const { showCreateMerchandiseTypeModal, setShowCreateMerchandiseTypeModal } = useStore();

  if (loading) {
    return (
      <div className='flex flex-col h-[60vh] w-full justify-center items-center'>
        <Spinner loading={loading} size={40} color={'#000000'} />
        <p className='text-base mt-2 text-black'>Loading Merchandise Types</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {types.length > 0 ? (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 gap-4'>
            {types.map((type) => (
              <div key={type.id} className='flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow'>
                <div className='flex flex-col'>
                  <div className='flex flex-row items-center gap-2'>
                    <p className='text-xl text-black'>{type.name}</p>
                  </div>
                  <p className='text-sm text-black/70 mt-1'>{type.description}</p>
                  <div className='flex flex-row gap-2 mt-2'>
                    {type.has_size && (
                      <span className='text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full'>Has Sizes</span>
                    )}
                    {type.has_color && (
                      <span className='text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full'>Has Colors</span>
                    )}
                  </div>
                </div>
                <div className='flex flex-row items-center gap-x-4'>
                  <button
                    onClick={() => {
                      setShowCreateMerchandiseTypeModal({
                        show: true,
                        id: type.id,
                        mode: 'edit',
                        refresh: !showCreateMerchandiseTypeModal?.refresh,
                      });
                    }}
                    className='text-black hover:bg-gray-100 p-2 rounded-full transition-colors'
                  >
                    <MdEdit className='text-xl' />
                  </button>
                  <button
                    onClick={() => {}}
                    className='text-black hover:bg-gray-100 p-2 rounded-full transition-colors'
                  >
                    <MdDelete className='text-xl' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-[40vh]'>
          <GoInbox className='text-4xl text-black' />
          <p className='text-base text-black'>No Merchandise Types Found</p>
        </div>
      )}
    </div>
  );
};

export default MerchandiseTypesTable;
