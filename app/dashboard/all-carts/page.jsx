'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import instance from '@/utils/instance';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';
import Spinner from '@/components/Spinner';
import { GoInbox } from 'react-icons/go';
import { LuEye } from 'react-icons/lu';
import Pagination from '@/components/Pagination';
import * as dayjs from 'dayjs';
dayjs().format();

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setShowCartDetailsModal, showCartDetailsModal } = useStore();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getAbandonedCarts = () => {
    instance
      .get(`/billing/cart/?all_carts=true&page=${page}`)
      .then((res) => {
        console.log('res', res.data);
        setTotalPages(Math.ceil(res.data.count / 10));
        setCarts(res.data.results);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    getAbandonedCarts();
  }, [page]);

  if (loading) {
    return (
      <div className='flex flex-col h-[60vh] w-full justify-center items-center'>
        <Spinner loading={loading} />
        <p className='text-base mt-2 text-black'>Loading Cart Data</p>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col items-center h-full p-4'>
      <div className=' flex flex-row justify-between w-full items-center'>
        <p className=' text-2xl font-semibold text-black'>Carts</p>
      </div>
      <div className='w-full flex flex-col max-h-[80vh] mt-4'>
        {carts.length > 0 ? (
          <div className=' flex flex-col items-end w-full'>
            <div className=' flex flex-col items-start h-[75vh] w-full'>
              {carts.map((cart, index) => {
                return (
                  <div
                    key={index}
                    className=' w-full flex flex-row justify-between items-center  border-[1px] border-[#c7c7c7] px-4 py-2 rounded-md mb-2'
                  >
                    <div className=' flex flex-col items-start'>
                      <p className=' text-xs text-black/70'>Cart</p>
                      <p className=' text-sm text-black'>{`Cart #${parseInt(cart.id)}`}</p>
                    </div>

                    <div className=' flex flex-col items-start'>
                      <p className=' text-xs text-black/70'>Created At</p>
                      <p className=' text-sm text-black'>{`${dayjs(cart.created_at).format('hh:MM A, DD/MM/YYYY')}`}</p>
                    </div>
                    <div className=' flex flex-col items-start'>
                      <p className=' text-xs text-black/70'>Cart Status</p>
                      <p className=' text-sm text-black'>{`${cart.cart_status}`}</p>
                    </div>

                    <div className=' flex flex-col items-start'>
                      <p className=' text-xs text-black/70'>Cart Items</p>
                      <p className=' text-sm text-black'>{`${cart.cart_items.length}`}</p>
                    </div>
                    <div className=' flex flex-col items-start'>
                      <p className=' text-xs text-black/70'>Cart Total</p>
                      <p className=' text-sm text-black'>{`${cart.cart_total_price}`}</p>
                    </div>
                    <div className=' flex flex-col items-start'>
                      <p className=' text-xs text-black/70'>Final Amount</p>
                      <p className=' text-sm text-black'>{`${cart.cart_final_amount}`}</p>
                    </div>
                    <div className=' flex flex-col items-start'>
                      <button
                        onClick={() => {
                          setShowCartDetailsModal({
                            show: true,
                            id: cart.id,
                          });
                        }}
                        className='text-black py-2 rounded-md'
                      >
                        <LuEye className='text-xl' />
                      </button>
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
            <p className=' text-base text-black'>No Cart Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carts;
