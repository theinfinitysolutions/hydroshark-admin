'use client';
import React, { useState, useEffect } from 'react';
import useStore from '@/utils/store';
import { IoMdClose } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import Spinner from '../Spinner';
import instance from '@/utils/instance';

const defaultValues = {
  name: '',
  description: '',
  has_size: true,
  has_color: true,
};

const labelClass = 'text-black text-sm';
const inputClass = 'border border-black rounded-md p-1 text-black focus:outline-none';

const CreateMerchandiseTypeModal = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showCreateMerchandiseTypeModal, setShowCreateMerchandiseTypeModal } = useStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    setIsOpen(showCreateMerchandiseTypeModal.show);
    if (showCreateMerchandiseTypeModal.show && showCreateMerchandiseTypeModal.mode === 'edit') {
      fetchTypeDetails(showCreateMerchandiseTypeModal.id);
    }
  }, [showCreateMerchandiseTypeModal]);

  const fetchTypeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await instance.get(`/api/merchandise-types/${id}`);
      const data = response.data;
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, data[key]);
      });
    } catch (error) {
      console.error('Error fetching type details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowCreateMerchandiseTypeModal({
      show: false,
      id: '',
      mode: 'create',
      refresh: showCreateMerchandiseTypeModal.refresh,
    });
    reset(defaultValues);
    setIsOpen(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const endpoint =
        showCreateMerchandiseTypeModal.mode === 'create'
          ? '/api/merchandise-types'
          : `/api/merchandise-types/${showCreateMerchandiseTypeModal.id}`;

      const method = showCreateMerchandiseTypeModal.mode === 'create' ? 'POST' : 'PUT';

      await instance({
        method,
        url: endpoint,
        data,
      });

      handleModalClose();
      setShowCreateMerchandiseTypeModal({
        ...showCreateMerchandiseTypeModal,
        refresh: !showCreateMerchandiseTypeModal.refresh,
      });
    } catch (error) {
      console.error('Error saving merchandise type:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showCreateMerchandiseTypeModal.mode == 'edit') {
      fetchTypeDetails(showCreateMerchandiseTypeModal.id);
    }
  }, [showCreateMerchandiseTypeModal.refresh]);

  if (!isOpen) return null;

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/30'>
      <div className='bg-white w-[500px] py-6 px-8 rounded-md'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-black'>
            {showCreateMerchandiseTypeModal.mode === 'create' ? 'Create' : 'Edit'} Merchandise Type
          </h2>
          <IoMdClose onClick={handleModalClose} className='text-2xl cursor-pointer' />
        </div>

        {loading ? (
          <div className='h-[200px] flex items-center justify-center'>
            <Spinner loading={loading} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className={labelClass}>Type Name</label>
              <input {...register('name', { required: true })} className={inputClass + ' w-full'} />
              {errors.name && <span className='text-red-500'>Name is required</span>}
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                {...register('description', { required: true })}
                className={inputClass + ' w-full h-24 resize-none'}
              />
              {errors.description && <span className='text-red-500'>Description is required</span>}
            </div>

            <div className='flex gap-4'>
              <div className='flex items-center gap-2'>
                <input type='checkbox' {...register('has_size')} className='w-4 h-4' />
                <label className={labelClass}>Has Sizes</label>
              </div>

              <div className='flex items-center gap-2'>
                <input type='checkbox' {...register('has_color')} className='w-4 h-4' />
                <label className={labelClass}>Has Colors</label>
              </div>
            </div>

            <div className='flex justify-end space-x-4 pt-4'>
              <button
                type='button'
                onClick={handleModalClose}
                className='px-4 py-2 border text-black border-gray-300 rounded-md'
              >
                Cancel
              </button>
              <button type='submit' className='px-4 py-2 bg-black text-white rounded-md' disabled={loading}>
                {loading ? <Spinner /> : showCreateMerchandiseTypeModal.mode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateMerchandiseTypeModal;
