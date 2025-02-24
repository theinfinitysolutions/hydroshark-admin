'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import instance from '@/utils/instance';
import Spinner from '@/components/Spinner';

const AddColorModal = ({ isOpen, onClose, onSubmit, editingColor }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      color_name: '',
      color_code: '#000000',
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (editingColor) {
      setValue('color_name', editingColor.color_name);
      setValue('color_code', editingColor.color_code);
    }
  }, [editingColor, setValue]);

  const colorCode = watch('color_code');

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setValue('color_code', newColor);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (editingColor) {
        response = await instance.patch(`/merchandise/merchandise-color/${editingColor.id}/`, {
          color_name: data.color_name,
          color_code: data.color_code,
        });
      } else {
        response = await instance.post('/merchandise/merchandise-color/', {
          color_name: data.color_name,
          color_code: data.color_code,
        });
      }

      onSubmit(response.data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/30'>
      <div className='bg-white w-[400px] rounded-lg shadow-lg'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>{editingColor ? 'Edit Color' : 'Add New Color'}</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            <IoMdClose className='text-2xl' />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Color Name</label>
            <input
              {...register('color_name', { required: 'Color name is required' })}
              className='w-full p-2 border rounded-md focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500'
              placeholder='e.g., Navy Blue'
            />
            {errors.color_name && <p className='mt-1 text-sm text-red-600'>{errors.color_name.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Color Code</label>
            <div className='flex gap-3'>
              <input
                type='color'
                value={colorCode}
                onChange={handleColorChange}
                className='h-10 w-20 p-1 border rounded-md cursor-pointer'
              />
              <input
                {...register('color_code', { required: 'Color code is required' })}
                value={colorCode}
                onChange={(e) => setValue('color_code', e.target.value)}
                className='flex-1 p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='#000000'
              />
            </div>
            {errors.color_code && <p className='mt-1 text-sm text-red-600'>{errors.color_code.message}</p>}
          </div>

          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Color'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColorModal;
