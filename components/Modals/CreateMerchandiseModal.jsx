'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { IoMdClose } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import Spinner from '../Spinner';
import instance from '@/utils/instance';
import { MdDelete } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import { MdOutlineFileUpload } from 'react-icons/md';
import ProductSectionsTab from '../CreateMerchandiseSections/ProductSectionsTab';
import ProductImagesTab from '../CreateMerchandiseSections/ProductImagesTab';

const modalTabs = [
  {
    title: 'Product Details',
    value: 'productDetails',
  },
  {
    title: 'Product Sections',
    value: 'productSections',
  },
  {
    title: 'Product Images',
    value: 'productImages',
  },
];

const defaultValues = {
  slug: '',
  product_title: '',
  sku: '',
  product_description: '',
  discount: '',
  weight: '',
  category: '',
};

const defaultSectionValues = {
  section_title: '',
  size: '',
  chest_measurement: '',
  weight: '',
  price: '',
  hydroshark_points_on_purchase: 0,
  discount_percentage: '',
  discounted_amount: '',
  category: '',
  quantity: 0,
  in_stock: true,
};

const labelClass = 'text-black text-sm';
const inputClass = 'border border-black rounded-md p-1 text-black focus:outline-none';

const CreateMerchandiseModal = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('productDetails');
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [merchandiseTypes, setMerchandiseTypes] = useState([]);
  const [productSections, setProductSections] = useState([]);
  const [files, setFiles] = useState([]);
  const { showCreateMerchandiseModal, setShowCreateMerchandiseModal } = useStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    setIsOpen(showCreateMerchandiseModal.show);
    if (showCreateMerchandiseModal.show) {
      fetchMerchandiseTypes();
      if (showCreateMerchandiseModal.mode === 'edit') {
        fetchMerchandiseDetails(showCreateMerchandiseModal.id);
      }
    }
  }, [showCreateMerchandiseModal]);

  const fetchMerchandiseTypes = async () => {
    try {
      const response = await instance.get('/merchandise/merchandise-category/');
      setMerchandiseTypes(response.data.results);
    } catch (error) {
      console.error('Error fetching merchandise types:', error);
    }
  };

  const fetchMerchandiseDetails = async (id) => {
    setLoading(true);
    try {
      const response = await instance.get(`/merchandise/merchandise/${id}/`);
      const data = response.data;
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, data[key]);
      });
      setProductSections(data.product_sections || []);
      setFiles(data.product_images || []);
      setValue('category', data.category.id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching merchandise details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowCreateMerchandiseModal({
      show: false,
      id: '',
      mode: 'create',
      refresh: showCreateMerchandiseModal.refresh,
    });
    reset(defaultValues);
    setProductSections([]);
    setFiles([]);
    setActiveTab('productDetails');
    setIsOpen(false);
  };

  const deleteSection = async (id) => {
    try {
      await instance.delete(`/merchandise/merchandise-section/${id}/`);
      setProductSections((prevSections) => prevSections.filter((section) => section.id !== id));
      fetchMerchandiseDetails(showCreateMerchandiseModal.id);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error deleting section:', error.response.data);
        alert(`Failed to delete section: ${error.response.data.detail || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        alert('Failed to delete section: No response from server');
      } else {
        // Something else caused the error
        console.error('Error:', error.message);
        alert(`Failed to delete section: ${error.message}`);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const endpoint =
        showCreateMerchandiseModal.mode === 'create'
          ? '/merchandise/merchandise/'
          : `/merchandise/merchandise/${showCreateMerchandiseModal.id}/`;
      const method = showCreateMerchandiseModal.mode === 'create' ? 'POST' : 'PATCH';

      await instance({
        method,
        url: endpoint,
        data: {
          ...data,
          product_sections: productSections,
          images: files,
          mrp: 0,
          selling_price: 0,
          category: parseInt(data.category),
        },
      });

      if (showCreateMerchandiseModal.mode === 'create') {
        setActiveTab('productSections');
      } else {
        handleModalClose();
        setShowCreateMerchandiseModal({
          ...showCreateMerchandiseModal,
          refresh: !showCreateMerchandiseModal.refresh,
        });
      }
    } catch (error) {
      console.error('Error saving merchandise:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showCreateMerchandiseModal.mode == 'edit') {
      fetchMerchandiseDetails(showCreateMerchandiseModal.id);
    }
  }, [showCreateMerchandiseModal.refresh]);

  // Color management for sections
  const [newColor, setNewColor] = useState({ color_name: '', color_code: '', quantity: 5, in_stock: true });

  if (!isOpen) return null;

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/30'>
      <div className='bg-white w-8/12 max-h-[80vh] overflow-y-scroll py-6 px-8 rounded-md'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-black'>
            {showCreateMerchandiseModal.mode === 'create' ? 'Create New' : 'Edit'} Gymwear
          </h2>
          <button onClick={handleModalClose} className='text-2xl cursor-pointer'>
            <IoMdClose className='text-2xl cursor-pointer text-black' />
          </button>
        </div>

        <div className='w-full flex flex-row justify-start items-center gap-x-4 mb-6 border-b border-gray-200'>
          {modalTabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-4 py-2 ${
                activeTab === tab.value ? 'border-b-2 border-black text-black' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {loading ? (
          <div className='h-[50vh] flex items-center justify-center'>
            <Spinner loading={loading} />
          </div>
        ) : (
          <div className='space-y-6'>
            {activeTab === 'productDetails' && (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-2'>
                    <label className={labelClass}>Merchandise Type</label>
                    <select {...register('category')} className={inputClass + ' w-full'}>
                      <option value=''>Select Type</option>
                      {merchandiseTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && <span className='text-red-500'>Merchandise type is required</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Product Title</label>
                    <input {...register('product_title', { required: true })} className={inputClass + ' w-full'} />
                    {errors.product_title && <span className='text-red-500'>Product title is required</span>}
                  </div>

                  <div>
                    <label className={labelClass}>SKU</label>
                    <input {...register('sku', { required: true })} className={inputClass + ' w-full'} />
                    {errors.sku && <span className='text-red-500'>SKU is required</span>}
                  </div>

                  <div className='col-span-2'>
                    <label className={labelClass}>Product Description</label>
                    <textarea
                      {...register('product_description', { required: true })}
                      className={inputClass + ' w-full h-24 resize-none'}
                    />
                    {errors.product_description && <span className='text-red-500'>Description is required</span>}
                  </div>

                  {/* <div>
                    <label className={labelClass}>MRP</label>
                    <input
                      type='number'
                      step='0.01'
                      {...register('mrp', { required: true })}
                      className={inputClass + ' w-full'}
                    />
                    {errors.mrp && <span className='text-red-500'>MRP is required</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Selling Price</label>
                    <input
                      type='number'
                      step='0.01'
                      {...register('selling_price', { required: true })}
                      className={inputClass + ' w-full'}
                    />
                    {errors.selling_price && <span className='text-red-500'>Selling price is required</span>}
                  </div> */}

                  <div>
                    <label className={labelClass}>Discount (%)</label>
                    <input
                      type='number'
                      step='0.01'
                      {...register('discount', { required: true })}
                      className={inputClass + ' w-full'}
                    />
                    {errors.discount && <span className='text-red-500'>Discount is required</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Weight</label>
                    <input {...register('weight', { required: true })} className={inputClass + ' w-full'} />
                    {errors.weight && <span className='text-red-500'>Weight is required</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Slug</label>
                    <input type='text' {...register('slug', { required: true })} className={inputClass + ' w-full'} />
                    {errors.slug && <span className='text-red-500'>Slug is required</span>}
                  </div>

                  {/* <div className='col-span-2'>
                    <div className='flex items-center gap-2'>
                      <input type='checkbox' {...register('hydroshark_points_accepted')} className='w-4 h-4' />
                      <label className={labelClass}>Accept HydroShark Points</label>
                    </div>
                  </div> */}
                </div>

                <div className='flex justify-end space-x-4'>
                  <button
                    type='button'
                    onClick={handleModalClose}
                    className='px-4 py-2 border text-black border-gray-300 rounded-md'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='px-4 py-2 bg-black text-white rounded-md' disabled={loading}>
                    {loading ? <Spinner /> : 'Next'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'productSections' && (
              <ProductSectionsTab
                productSections={productSections}
                setProductSections={setProductSections}
                setActiveTab={setActiveTab}
                deleteSection={deleteSection}
                linkedProduct={product}
                getMerchandiseDetails={fetchMerchandiseDetails}
              />
            )}

            {activeTab === 'productImages' && (
              <ProductImagesTab
                files={files}
                setFiles={setFiles}
                setActiveTab={setActiveTab}
                handleSubmit={handleSubmit(onSubmit)}
                loading={loading}
                mode={showCreateMerchandiseModal.mode}
                product={product}
                getMerchandiseDetails={fetchMerchandiseDetails}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMerchandiseModal;
