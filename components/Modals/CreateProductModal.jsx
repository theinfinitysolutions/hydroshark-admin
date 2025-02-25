'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { useForm, useFieldArray, set, get } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import instance from '@/utils/instance';
import Spinner from '../Spinner';
import ProductSections from '../CreateProductSections/ProductSections';
import ProductImages from '../CreateProductSections/ProductImages';

const productSections = [
  {
    title: ' Product Details',
    value: 'productDetails',
    disabled: false,
  },
  {
    title: ' Product Sections',
    value: 'productSections',
    disabled: true,
  },
  {
    title: ' Product Images',
    value: 'productImage',
    disabled: true,
  },
];

const initialSections = [
  {
    title: ' Product Details',
    value: 'productDetails',
    disabled: false,
  },
];

const defaultValues = {
  productName: '',
  productDescription: '',
  slug: '',
  hydroshark_points_accepted: false,
};

const labelClass = 'text-black text-sm ';
const inputClass = 'border border-black rounded-md p-1 text-black focus:outline-none';

const CreateProductModal = () => {
  const [tabs, setTabs] = useState(initialSections);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productSubSections, setProductSubSections] = useState([]);
  const [newProductSubSections, setNewProductSubSections] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productData, setProductData] = useState({});
  const [activeTab, setActiveTab] = useState('productDetails');
  const { showCreateProductModal, setShowCreateProductModal } = useStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    setIsOpen(showCreateProductModal.show);
  }, [showCreateProductModal]);

  const handleModalClose = () => {
    setShowCreateProductModal({
      ...showCreateProductModal,
      show: false,
      id: '',
    });
    reset(defaultValues);
    setActiveTab('productDetails');
    setIsOpen(false);
  };

  const onSubmit = (data) => {
    if (showCreateProductModal.mode == 'create') {
      createProduct(data);
    } else {
      updateProduct(data);
    }
  };

  const getProducts = (id) => {
    setLoading(true);
    instance
      .get(`/drinks/product/${id}/`)
      .then((res) => {
        setLoading(false);
        setProductData(res.data);
        setProductSubSections(res.data.product_sections);
        setProductImages(res.data.product_images);
        setValue('productName', res.data.product_title);
        setValue('productDescription', res.data.product_description);
        setValue('hydroshark_points_accepted', res.data.hydroshark_points_accepted);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const updateProduct = (data) => {
    let obj = {
      product_title: data.productName,
      product_description: data.productDescription,
      hydroshark_points_accepted: data.hydroshark_points_accepted,
    };

    instance
      .patch(`/drinks/product/${showCreateProductModal.id}/`, obj)
      .then((res) => {
        console.log('res', res);
        setActiveTab('productSections');
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const createProduct = (data) => {
    setLoading(true);
    let obj = {
      product_title: data.productName,
      product_description: data.productDescription,
      hydroshark_points_accepted: data.hydroshark_points_accepted,
    };

    instance
      .post('/drinks/product/', obj)
      .then((res) => {
        console.log('res', res);
        setLoading(false);
        getProducts(res.data.id);
        setShowCreateProductModal({
          ...showCreateProductModal,
          refresh: !showCreateProductModal.refresh,
        });
        setTabs(productSections);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (showCreateProductModal.mode == 'edit') {
      getProducts(showCreateProductModal.id);
      setTabs(productSections);
    }
  }, [showCreateProductModal.refresh]);

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
              <p className=' text-black text-2xl font-semibold'>{`${
                showCreateProductModal.mode == 'create' ? 'Create' : 'Edit'
              } Product`}</p>
              <IoMdClose onClick={() => handleModalClose()} className='text-black text-2xl cursor-pointer' />
            </div>
            <div className='w-full flex flex-row justify-start items-center gap-x-4 mt-4 border-b-[0.5px] border-[#c7c7c7]'>
              {tabs.map((item, index) => {
                return (
                  <button
                    key={index}
                    className={` flex flex-col items-center gap-y-[2px] text-black px-2`}
                    onClick={() => {
                      setActiveTab(item.value);
                    }}
                  >
                    <p className=' text-sm'>{item.title}</p>
                    {activeTab == item.value ? (
                      <div className='w-full h-[2px] bg-black rounded-full'></div>
                    ) : (
                      <div className='w-full h-[2px] bg-white rounded-full'></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className=' w-full flex flex-col items-start'>
              {activeTab == 'productDetails' ? (
                <div className=' flex flex-col items-start w-full'>
                  <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full mt-4'>
                    <div className=' w-full grid grid-cols-2 gap-4'>
                      <div className='flex flex-col w-full mt-2'>
                        <label className={`${labelClass}`} htmlFor='productName'>
                          Product Name
                        </label>
                        <input
                          type='text'
                          id='productName'
                          {...register('productName', { required: true })}
                          className={`${inputClass}`}
                        />
                        {errors.productName && <p className='text-red-500'>Product Name is required</p>}
                      </div>
                    </div>

                    <div className='flex flex-col w-full mt-4'>
                      <label className={`${labelClass}`} htmlFor='productDescription'>
                        Product Description
                      </label>
                      <textarea
                        id='productDescription'
                        {...register('productDescription', { required: true })}
                        className={`${inputClass} h-[10vh]`}
                      />
                      {errors.productDescription && <p className='text-red-500'>Product Description is required</p>}
                    </div>

                    <div className='flex flex-col w-full mt-4'>
                      <label className={`${labelClass}`} htmlFor='slug'>
                        Slug
                      </label>
                      <input
                        type='text'
                        id='slug'
                        {...register('slug', { required: true })}
                        className={`${inputClass}`}
                      />
                      {errors.slug && <p className='text-red-500'>Slug is required</p>}
                    </div>

                    <div className='flex flex-col w-full mt-4'>
                      <div className=' flex flex-row justify-start gap-x-2'>
                        <input
                          type={'checkbox'}
                          {...register('hydroshark_points_accepted', {
                            required: true,
                          })}
                        />
                        <label className={`${labelClass}`} htmlFor='hydroshark_points_accepted'>
                          Hydroshark Points Accepted
                        </label>
                      </div>
                      {errors.hydroshark_points_accepted && <p className='text-red-500'>Field is required</p>}
                    </div>
                    <div className=' flex flex-row justify-end w-full mt-8 gap-x-4'>
                      <button
                        onClick={() => {
                          handleModalClose();
                        }}
                        className='border-[1px]  border-red-400 text-red-400 bg-white px-4 py-2 rounded-md'
                      >
                        Cancel
                      </button>
                      <button type='submit' className='bg-black text-white px-4 py-2 rounded-md'>
                        {showCreateProductModal.mode == 'create' ? 'Create' : 'Update'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
              {activeTab == 'productSections' ? (
                <ProductSections productId={productData.id} productSections={productSubSections} />
              ) : null}
              {activeTab == 'productImage' ? (
                <ProductImages productId={productData.id} productImages={productImages} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProductModal;
