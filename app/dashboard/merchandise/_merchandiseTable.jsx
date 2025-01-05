'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { MdEdit } from 'react-icons/md';
import { GoInbox } from 'react-icons/go';
import Spinner from '@/components/Spinner';

const MerchandiseDataTable = () => {
  const [loading, setLoading] = useState(false);
  const [merchandise, setMerchandise] = useState([
    {
      id: 1,
      product_title: 'HydroShark T-Shirt',
      slug: 'hydroshark-t-shirt',
      sku: 'HS-TS-001',
      product_description: 'Premium quality HydroShark branded t-shirt',
      mrp: 39.99,
      selling_price: 29.99,
      discount: 25.0,
      rating: 4.5,
      weight: '0.3kg',
      hydroshark_points_accepted: true,
      image_url: 'https://placehold.co/100x100',
    },
    {
      id: 2,
      product_title: 'HydroShark Hoodie',
      slug: 'hydroshark-hoodie',
      sku: 'HS-HD-001',
      product_description: 'Comfortable HydroShark branded hoodie',
      mrp: 59.99,
      selling_price: 49.99,
      discount: 16.67,
      rating: 4.8,
      weight: '0.5kg',
      hydroshark_points_accepted: true,
      image_url: 'https://placehold.co/100x100',
    },
  ]);
  const { showCreateMerchandiseModal, setShowCreateMerchandiseModal } = useStore();

  if (loading) {
    return (
      <div className='flex flex-col h-[60vh] w-full justify-center items-center'>
        <Spinner loading={loading} size={40} color={'#000000'} />
        <p className='text-base mt-2 text-black'>Loading Merchandise Data</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {merchandise.length > 0 ? (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 gap-4'>
            {merchandise.map((item) => (
              <div key={item.id} className='flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow'>
                <div className='flex flex-row gap-4 items-center'>
                  <img src={item.image_url} alt={item.product_title} className='w-20 h-20 rounded-md object-cover' />
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-2'>
                      <p className='text-xl text-black'>{item.product_title}</p>
                    </div>
                    <p className='text-sm text-black/70'>SKU: {item.sku}</p>
                    <p className='text-sm text-black/70 max-w-md line-clamp-2 mt-1'>{item.product_description}</p>
                  </div>
                </div>
                <div className='flex flex-row items-center gap-x-4'>
                  <div className='flex flex-col items-end'>
                    {item.hydroshark_points_accepted && (
                      <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                        HydroShark Coins Accepted
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateMerchandiseModal({
                        show: true,
                        id: item.id,
                        mode: 'edit',
                        refresh: !showCreateMerchandiseModal?.refresh,
                      });
                    }}
                    className='text-black hover:bg-gray-100 p-2 rounded-full transition-colors'
                  >
                    <MdEdit className='text-xl' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-[40vh]'>
          <GoInbox className='text-4xl text-black' />
          <p className='text-base text-black'>No Merchandise Data Found</p>
        </div>
      )}
    </div>
  );
};

export default MerchandiseDataTable;
