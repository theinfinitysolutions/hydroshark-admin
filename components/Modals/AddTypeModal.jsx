'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';

const AddTypeModal = ({ isOpen, onClose, onSubmit, mode, data }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || '',
    },
  });

  const handleFormSubmit = (formData) => {
    onSubmit(formData, data?.id);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/30'>
      <div className='bg-white w-[400px] rounded-lg shadow-lg'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>Add New Type</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            <IoMdClose className='text-2xl' />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Type Name</label>
            <input
              {...register('name', { required: 'Type name is required' })}
              className='w-full p-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='e.g., Hoodie'
            />
            {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
          </div>

          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
            >
              Add Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTypeModal;
