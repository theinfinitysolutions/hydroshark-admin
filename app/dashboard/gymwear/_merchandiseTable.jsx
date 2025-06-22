'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { MdEdit } from 'react-icons/md';
import { GoInbox } from 'react-icons/go';
import Spinner from '@/components/Spinner';
import instance from '@/utils/instance';
import ConfirmDeleteModal from '@/components/Modals/ConfirmDeleteModal';

const MerchandiseDataTable = () => {
  const [loading, setLoading] = useState(true);
  const [merchandise, setMerchandise] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteMerchandiseModal, setDeleteMerchandiseModal] = useState({});
  const { showCreateMerchandiseModal, setShowCreateMerchandiseModal } = useStore();

  const getMerchandise = async () => {
    try {
      setLoading(true);
      const res = await instance.get('/merchandise/merchandise/');
      console.log('Merchandise data:', res.data);
      setMerchandise(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMerchandise();
  }, [showCreateMerchandiseModal?.refresh]);

  if (loading) {
    return (
      <div className='flex flex-col h-[60vh] w-full justify-center items-center'>
        <Spinner loading={loading} size={40} color={'#000000'} />
        <p className='text-base mt-2 text-black'>Loading Merchandise Data</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    instance
      .delete(`/merchandise/merchandise/${id}/`)
      .then((response) => {
        console.log('Merchandise deleted successfully:', response.data);
        getMerchandise(); // Refresh the merchandise list
      })
      .catch((error) => {
        console.error('Error deleting merchandise:', error);
      });
  };

  return (
    <div className='w-full'>
      {merchandise.length > 0 ? (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 gap-4'>
            {merchandise.map((item) => (
              <div key={item.id} className='flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow'>
                <div className='flex flex-row gap-4 items-center'>
                  {item.product_primary_image ? (
                    <img
                      src={item.product_primary_image?.image?.cloudfront}
                      alt={item.product_title}
                      className='w-20 h-20 rounded-md object-cover'
                    />
                  ) : (
                    <div className='w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center'>
                      <p className='text-sm text-gray-500'>No Image</p>
                    </div>
                  )}
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-2'>
                      <p className='text-xl text-black'>{item.product_title}</p>
                    </div>
                    <p className='text-sm text-black/70'>SKU: {item.sku}</p>
                    <p className='text-sm text-black/70 max-w-md line-clamp-2 mt-1'>{item.product_description}</p>
                  </div>
                </div>
                <div className='flex flex-row items-center gap-x-4'>
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
                  <ConfirmDeleteModal
                    id={item.id}
                    title={'Merchandise'}
                    onConfirm={() => {
                      handleDelete(item.id);
                    }}
                  />
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
