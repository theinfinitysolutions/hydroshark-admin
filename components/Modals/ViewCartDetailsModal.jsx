'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineFileUpload } from 'react-icons/md';
import instance from '@/utils/instance';
import { FaFileAlt } from 'react-icons/fa';
import Image from 'next/image';
import Spinner from '../Spinner';
import * as dayjs from 'dayjs';
dayjs().format();

const labelClass = 'text-black text-sm ';
const inputClass = 'border border-black rounded-md p-1 text-black focus:outline-none';

const ViewCartDetailsModal = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showCartDetailsModal, setShowCartDetailsModal } = useStore();
  const [cartDetails, setCartdetails] = useState({});

  const getCartDetials = (id) => {
    setLoading(true);
    instance
      .get(`/admin/abandoned_carts/${id}/`)
      .then((res) => {
        setCartdetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setIsOpen(showCartDetailsModal.show);
    if (showCartDetailsModal.show) {
      getCartDetials(showCartDetailsModal.id);
    }
  }, [showCartDetailsModal.show]);

  const handleModalClose = () => {
    setShowCartDetailsModal({ show: false, id: '' });
    setIsOpen(false);
  };

  return (
    <div className={`${isOpen ? 'fixed' : 'hidden'} z-50 inset-0 flex items-center justify-center bg-black/30`}>
      <div className='bg-white w-8/12 max-h-[80vh] overflow-y-scroll py-6 px-8 rounded-md flex flex-col '>
        {loading ? (
          <div className=' h-[50vh] relative flex flex-col items-center justify-center w-full'>
            <Spinner loading={loading} />
          </div>
        ) : (
          <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between items-center w-full'>
              <h3 className='text-black text-2xl font-bold'>Cart Details</h3>
              <IoMdClose onClick={() => handleModalClose()} className='text-black text-2xl cursor-pointer' />
            </div>
            <div className='bg-gray-100 w-full mt-4 py-2 px-4 rounded-md grid grid-cols-3'>
              <div className=' flex flex-col items-start'>
                <p className=' text-xs text-black/70'>Cart ID</p>
                <p className=' text-base text-black'>{`Cart #${cartDetails.id}`}</p>
              </div>

              <div className=' flex flex-col items-start'>
                <p className=' text-xs text-black/70'>Cart Date</p>
                <p className=' text-base text-black'>{dayjs(cartDetails.created_at).format('hh:MM A , DD/MM/YYYY ')}</p>
              </div>

              <div className=' flex flex-col items-start'>
                <p className=' text-xs text-black/70'>Cart Total</p>
                <p className=' text-base text-black'>{cartDetails.cart_final_amount}</p>
              </div>
            </div>
            <div className='   py-2 rounded-md flex mt-4 flex-col items-start w-full'>
              <p className=' text-base text-black font-semibold'>Cart Items</p>
              {cartDetails.cart_items?.length > 0 ? (
                <div className=' flex flex-col items-start w-full mt-4 max-h-[40] overflow-y-scroll'>
                  {cartDetails.cart_items.map((item, index) => (
                    <div
                      key={index}
                      className=' w-full flex flex-row justify-between items-center  border-[1px] border-[#c7c7c7] px-4 py-2 rounded-md mb-2'
                    >
                      <div className='flex relative h-[7.5vh] w-[7.5vh] bg-gray-100'>
                        <Image
                          src={item.product_section?.linked_product?.product_primary_image?.image?.cloudfront}
                          fill
                          objectFit='contain'
                          alt={item.product_section?.linked_product?.product_title || 'Product image'}
                        />
                      </div>
                      <div className=' flex flex-col items-start'>
                        <p className=' text-xs text-black/70'>Product Title</p>
                        <p className=' text-sm text-black'>{item.product_section?.linked_product?.product_title}</p>
                      </div>
                      <div className=' flex flex-col items-start'>
                        <p className=' text-xs text-black/70'>Product Section</p>
                        <p className=' text-sm text-black'>{item.product_section?.section_title}</p>
                      </div>
                      <div className=' flex flex-col items-start'>
                        <p className=' text-xs text-black/70'>Product Section</p>
                        <p className=' text-sm text-black'>{item.product_section?.section_title}</p>
                      </div>
                      <div className=' flex flex-col items-start'>
                        <p className=' text-xs text-black/70'>Product Quantity</p>
                        <p className=' text-sm text-black'>{item.quantity}</p>
                      </div>
                      <div className=' flex flex-col items-start'>
                        <p className=' text-xs text-black/70'>Product Total</p>
                        <p className=' text-sm text-black'>{item.total_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-black'>No Items Found</p>
              )}
            </div>
            <div className=' bg-gray-100  py-2 px-4 rounded-md flex mt-4 flex-col items-start w-1/2'>
              <p className=' text-base text-black font-semibold'>Cart Summary</p>

              <div className=' w-full mt-4 flex flex-col items-start'>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Cart Total Amount</p>
                  <p className='text-sm text-black'>{cartDetails.cart_total_price || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Cart Discount</p>
                  <p className='text-sm text-black'>{cartDetails.cart_net_discount_percentage || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Cart Final Amount</p>
                  <p className='text-sm text-black'>{cartDetails.cart_final_amount || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Hydroshark Coins</p>
                  <p className='text-sm text-black'>{cartDetails.cart_total_hydroshark_coins || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Cart Status</p>
                  <p className='text-sm text-black'>{cartDetails.cart_status || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCartDetailsModal;
