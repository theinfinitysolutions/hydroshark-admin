'use client';
import React, { useState, useEffect, useCallback } from 'react';
import useStore from '@/utils/store';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineFileUpload } from 'react-icons/md';
import instance from '@/utils/instance';
import { FaFileAlt } from 'react-icons/fa';
import Spinner from '../Spinner';
import * as dayjs from 'dayjs';
import Image from 'next/image';

dayjs().format();

const labelClass = 'text-black text-sm ';
const inputClass = 'border border-black rounded-md p-1 text-black focus:outline-none';

const ViewOrderDetailsModal = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showOrderDetailsModal, setShowOrderDetailsModal } = useStore();
  const [orderDetails, setOrderDetails] = useState({});
  const [shippingDetails, setShippingDetails] = useState({});

  const getShippingDetails = useCallback((id) => {
    setLoading(true);
    instance
      .get(`/billing/shipping/track/${id}/`)
      .then((res) => {
        console.log('res', res.data);
        setShippingDetails(res.data.data);
        setLoading(false);
      })
      .then((err) => {
        console.log('err', err);
        setLoading(false);
      });
  }, []);

  const getOrderDetials = useCallback((id) => {
    setLoading(true);
    instance
      .get(`/admin/orders/${id}/`)
      .then((res) => {
        setOrderDetails(res.data);
        if (res.data.shipping?.id) {
          getShippingDetails(id);
        } else {
          setShippingDetails({});
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsOpen(showOrderDetailsModal.show);
    if (showOrderDetailsModal.show) {
      getOrderDetials(showOrderDetailsModal.id);
    }
  }, [showOrderDetailsModal.show]);

  const handleModalClose = () => {
    setShowOrderDetailsModal({ show: false, id: '' });
    setOrderDetails({});
    setShippingDetails({});
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
              <h3 className='text-black text-2xl font-bold'>Order Details</h3>
              <IoMdClose onClick={() => handleModalClose()} className='text-black text-2xl cursor-pointer' />
            </div>
            <div className='bg-gray-100 w-full mt-4 py-2 px-4 rounded-md grid grid-cols-3'>
              <div className=' flex flex-col items-start'>
                <p className=' text-xs text-black/70'>Order ID</p>
                <p className=' text-base text-black'>{`Order# ${orderDetails.id}`}</p>
              </div>

              <div className=' flex flex-col items-start'>
                <p className=' text-xs text-black/70'>Order Date</p>
                <p className=' text-base text-black'>
                  {dayjs(orderDetails.created_at).format('hh:MM A , DD/MM/YYYY ')}
                </p>
              </div>

              <div className=' flex flex-col items-start'>
                <p className=' text-xs text-black/70'>Order Total</p>
                <p className=' text-base text-black'>{orderDetails.order_total_amount}</p>
              </div>
            </div>
            <div className=' bg-gray-100  py-2 px-4 rounded-md flex mt-4 flex-col items-start w-full'>
              <p className=' text-base text-black font-semibold'>Payment Details</p>
              <div className=' w-full mt-4 rounded-md grid grid-cols-3'>
                <div className='flex flex-col items-start'>
                  <p className='text-xs text-black/70'>Payment Amount</p>
                  <p className='text-base text-black'>{orderDetails.payment?.payment_amount || 'N/A'}</p>
                </div>

                <div className='flex flex-col items-start'>
                  <p className='text-xs text-black/70'>Payment Method</p>
                  <p className='text-base text-black'>{orderDetails.payment?.payment_method || 'N/A'}</p>
                </div>

                <div className='flex flex-col items-start'>
                  <p className='text-xs text-black/70'>Payment Status</p>
                  <p className='text-base text-black'>{orderDetails.payment?.payment_status || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className=' bg-gray-100  py-2 px-4 rounded-md flex mt-4 flex-col items-start w-full'>
              <p className=' text-base text-black font-semibold'>Shipping Details</p>
              {Object.keys(shippingDetails).length > 0 ? (
                <div className=' flex flex-col items-start w-full'>
                  <div className=' w-full grid grid-cols-3'>
                    <div className=' w-full mt-4 flex flex-col items-start'>
                      <p className='text-xs text-black/70'>Shipping Status</p>
                      <p className='text-sm text-black'>{shippingDetails?.status || 'N/A'}</p>
                    </div>
                    <div className=' w-full mt-4 flex flex-col items-start'>
                      <p className='text-xs text-black/70'>AWB Number</p>
                      <p className='text-sm text-black'>{shippingDetails?.awb_number || 'N/A'}</p>
                    </div>
                    <div className=' w-full mt-4 flex flex-col items-start'>
                      <p className='text-xs text-black/70'>Shipment Info</p>
                      <p className='text-sm text-black'>{shippingDetails?.awb_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className='flex flex-col w-full items-start'>
                    {shippingDetails?.history?.length > 0 ? (
                      <div className=' w-full mt-4 flex flex-col items-start'>
                        <p className='text-xs text-black/70'>Shipment History</p>
                        <div className=' w-full mt-2 flex flex-col items-start'>
                          <div className=' w-9/12 flex flex-row justify-between bg-black p-2 -ml-1  items-start'>
                            <p className='text-xs text-white w-1/2'>Location</p>
                            <p className='text-xs text-white w-1/4'>Date and Time</p>
                            <p className='text-xs text-white w-1/4'>Message</p>
                          </div>

                          {shippingDetails?.history.map((history, index) => {
                            return (
                              <div
                                key={index}
                                className={`  w-9/12 flex flex-row justify-between ${
                                  index % 2 == 0 ? 'bg-white' : 'bg-[#e4e3e3]'
                                }  p-2 -ml-1  items-start`}
                              >
                                <p className='text-xs text-black w-1/2'>{history?.location}</p>
                                <p className='text-xs text-black w-1/4'>
                                  {dayjs(history?.event_time).format('hh:MM A , DD/MM/YYYY ')}
                                </p>
                                <p className='text-xs text-black w-1/4'>{history?.message}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className='text-sm text-black/80'>Shipment History Not Available</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className=' w-full grid grid-cols-3'>
                  <div className=' w-full mt-4 flex flex-col items-start'>
                    <p className='text-xs text-black/70'>Shipping Status</p>
                    <p className='text-sm text-black'>{orderDetails.shipping?.shipping_status || 'N/A'}</p>
                  </div>
                  <div className=' w-full mt-4 flex flex-col items-start'>
                    <p className='text-xs text-black/70'>AWB Number</p>
                    <p className='text-sm text-black'>{orderDetails.shipping?.awb_number || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className='   py-2 rounded-md flex mt-4 flex-col items-start w-full'>
              <p className=' text-base text-black font-semibold'>Cart Items</p>
              {orderDetails.cart_items?.length > 0 ? (
                <div className=' flex flex-col items-start w-full mt-4 max-h-[40] overflow-y-scroll'>
                  {orderDetails.cart_items.map((item, index) => (
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

            <div className=' bg-gray-100  py-2 px-4 rounded-md flex mt-4 flex-col items-start w-full'>
              <p className=' text-base text-black font-semibold'>Invoice Details</p>
              <div className=' w-full mt-4 grid grid-cols-2'>
                <div className=' w-full  flex flex-col items-start'>
                  <p className=' text-xs text-black/70'>Created At</p>
                  <p className=' text-base text-black'>
                    {dayjs(orderDetails.invoice?.created_at).format('hh:MM A , DD/MM/YYYY ')}
                  </p>
                </div>
                <div className=' w-full mt-4 flex flex-col items-start'>
                  <p className='text-xs text-black/70'>Invoice Status</p>
                  <p className='text-sm text-black'>{orderDetails.invoice?.invoice_status || 'N/A'}</p>
                </div>
                <div className=' w-full mt-4 flex flex-col items-start'>
                  <p className='text-xs text-black/70'>Invoice Document</p>
                  {orderDetails.invoice?.invoice_url ? (
                    <button
                      onClick={() => {
                        window.open(orderDetails.invoice?.invoice_url, '_blank');
                      }}
                      className='text-sm flex flex-row justify-start items-center mt-1 bg-gray-200 rounded-md px-2 py-1 hover:bg-gray-300  text-black gap-x-2'
                    >
                      <FaFileAlt className='text-xl' />
                      <p>Download Invoice</p>
                    </button>
                  ) : (
                    <p className=' text-sm text-black/80'>Not Available</p>
                  )}
                </div>
              </div>
            </div>

            <div className=' bg-gray-100  py-2 px-4 rounded-md flex mt-4 flex-col items-start w-1/2'>
              <p className=' text-base text-black font-semibold'>Order Summary</p>

              <div className=' w-full mt-4 flex flex-col items-start'>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Shipping Charges</p>
                  <p className='text-sm text-black'>{orderDetails?.shipping_charges || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Shipping Discount</p>
                  <p className='text-sm text-black'>{orderDetails?.shipping_discount || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Order Discount</p>
                  <p className='text-sm text-black'>{orderDetails.order_discount || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Order Final Amount</p>
                  <p className='text-sm text-black'>{orderDetails.order_final_amount || 'N/A'}</p>
                </div>

                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Order Sub Total</p>
                  <p className='text-sm text-black'>{orderDetails.order_sub_total || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Order Total Amount</p>
                  <p className='text-sm text-black'>{orderDetails.order_total_amount || 'N/A'}</p>
                </div>
                <div className='w-full mt-4 flex flex-row items-center justify-between'>
                  <p className='text-xs text-black/70'>Order Status</p>
                  <p className='text-sm text-black'>{orderDetails.order_status || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrderDetailsModal;
