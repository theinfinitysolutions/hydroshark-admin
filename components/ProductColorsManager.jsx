'use client';
import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import AddColorModal from './Modals/AddColorModal';
import instance from '@/utils/instance';
import Spinner from './Spinner';

const ProductColorsManager = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);

  const fetchColors = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/merchandise/merchandise-color/');
      setColors(response.data.results);
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleAddColor = async (newColor) => {
    await fetchColors(); // Refresh the list after adding
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setShowAddModal(true);
  };

  const handleDeleteColor = async (id) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      try {
        await instance.delete(`/merchandise/merchandise-color/${id}/`);
        await fetchColors(); // Refresh the list after deleting
      } catch (error) {
        console.error('Error deleting color:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingColor(null);
  };

  if (loading && colors.length === 0) {
    return (
      <div className='flex justify-center items-center p-8'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h4 className='text-lg font-medium text-gray-900'>Color Management</h4>
        <button
          onClick={() => setShowAddModal(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Add New Color
        </button>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        {colors.map((color) => (
          <div key={color.id} className='bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-lg border shadow-inner' style={{ backgroundColor: color.color_code }} />
              <div>
                <h5 className='font-medium text-gray-900'>{color.color_name}</h5>
                <p className='text-sm text-gray-500'>{color.color_code}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handleEditColor(color)}
                className='p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                title='Edit Color'
              >
                <MdEdit className='text-xl' />
              </button>
              <button
                onClick={() => handleDeleteColor(color.id)}
                className='p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                title='Delete Color'
              >
                <MdDelete className='text-xl' />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddColorModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleAddColor}
        editingColor={editingColor}
      />
    </div>
  );
};

export default ProductColorsManager;
