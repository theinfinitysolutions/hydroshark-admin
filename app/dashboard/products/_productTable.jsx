'use client';
import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { IoPencilSharp } from 'react-icons/io5';
import instance from '@/utils/instance';
import Spinner from '@/components/Spinner';
import { MdEdit, MdDelete } from 'react-icons/md';
import useStore from '@/utils/store';
import ConfirmDeleteModal from '@/components/Modals/ConfirmDeleteModal';
import { IoFlash } from 'react-icons/io5';
import { GoInbox } from 'react-icons/go';
import Pagination from '@/components/Pagination';

// Rest of the code...

const ProductDataTable = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { showCreateProductModal, setShowCreateProductModal } = useStore();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getProducts = () => {
    setLoading(true);
    instance
      .get('/drinks/product/')
      .then((res) => {
        setData(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const deleteProduct = (id) => {
    setLoading(true);
    instance
      .patch(`/drinks/product/${id}/`, {
        is_deleted: true,
      })
      .then((res) => {
        console.log('res', res);
        getProducts();
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  useEffect(() => {
    getProducts();
  }, [page, showCreateProductModal.show]);

  if (loading) {
    return (
      <div className='flex flex-col h-[60vh] w-full justify-center items-center'>
        <Spinner loading={loading} size={40} color={'#000000'} />
        <p className='text-base mt-2 text-black'>Loading Product Data</p>
      </div>
    );
  }

  return (
    <div
      className=' flex flex-col items-start w-full h-[80vh]' // applying the grid theme
    >
      {data.length > 0 ? (
        <div className=' flex flex-col items-start w-full'>
          <div className='ag-theme-quartz flex flex-col items-start w-full  h-[70vh] overflow-y-scroll'>
            {data.map((product) => {
              return (
                <div
                  key={product.id}
                  className='flex flex-row justify-between w-full items-center border-[0.5px] border-black/50 text-black p-4 rounded-md mb-4'
                >
                  <div className=' flex flex-row justify-start items-center'>
                    <div className=' h-[5vh] w-[5vh] relative bg-gray-200 flex justify-center items-center rounded-md'>
                      <IoFlash className=' text-black' />
                    </div>
                    <div className='flex w-10/12 flex-col items-start ml-4'>
                      <p className='text-xl text-black'>{product.product_title}</p>
                      <p className=' text-sm text-black/70'>{product.product_description}</p>
                    </div>
                  </div>
                  <div className='flex flex-row justify-end items-center gap-x-2'>
                    <button
                      onClick={() => {
                        setShowCreateProductModal({
                          ...showCreateProductModal,
                          show: true,
                          id: product.id,
                          mode: 'edit',
                          refresh: !showCreateProductModal.refresh,
                        });
                      }}
                      className='text-black py-2 rounded-md'
                    >
                      <MdEdit className='text-xl' />
                    </button>
                    <ConfirmDeleteModal
                      type='icon'
                      onConfirm={() => {
                        deleteProduct(product.id);
                      }}
                      title={product.product_title}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 0 ? <Pagination count={totalPages} page={page} onChange={(val) => setPage(val)} /> : null}
        </div>
      ) : (
        <div className=' flex flex-col items-center justify-center w-full h-[40vh] '>
          <GoInbox className=' text-4xl text-black' />
          <p className=' text-base text-black'>No Product Data Found</p>
        </div>
      )}
    </div>
  );
};

export default ProductDataTable;
