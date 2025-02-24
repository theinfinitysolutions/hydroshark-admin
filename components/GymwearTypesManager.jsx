'use client';
import React, { useState, useEffect } from 'react';
import AddTypeModal from './Modals/AddTypeModal';
import instance from '@/utils/instance';
import { MdDelete, MdEdit } from 'react-icons/md';
import Spinner from './Spinner';

const GymwearTypesManager = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const getTypes = async () => {
    setLoading(true);
    try {
      const res = await instance.get('/merchandise/merchandise-category/');
      setTypes(res.data.results);
    } catch (error) {
      console.error('Error fetching types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTypes();
  }, []);

  const handleEditType = async (id) => {
    const type = types.find((type) => type.id === id);
    setShowAddModal(true);
    setShowAddModal({
      ...showAddModal,
      mode: 'edit',
      data: type,
    });
  };

  const handleUpdateType = async (data, id) => {
    setLoading(true);
    try {
      const res = await instance.patch(`/merchandise/merchandise-category/${id}/`, data);
      console.log('res', res);
      getTypes();
    } catch (error) {
      console.error('Error updating type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = async (data, id = null) => {
    if (id) {
      handleUpdateType(data, id);
      return;
    }
    try {
      setLoading(true);
      const res = await instance.post('/merchandise/merchandise-category/', data);

      console.log('res', res);
      getTypes();
    } catch (error) {
      console.error('Error adding type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    try {
      const res = await instance.delete(`/merchandise/merchandise-category/${id}/`);
      console.log('res', res);
      getTypes();
    } catch (error) {
      console.error('Error deleting type:', error);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h4 className='text-lg font-medium text-gray-900'>Available Types</h4>
        <button
          onClick={() => setShowAddModal(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Add New Type
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <Spinner />
        </div>
      ) : types.length > 0 ? (
        <div className='bg-white rounded-lg shadow-sm border p-4'>
          {types.map((type) => (
            <div key={type.id} className='flex justify-between items-center'>
              <p className='text-gray-500'>{type.name}</p>
              <div className='flex items-center gap-x-2'>
                <button onClick={() => handleDeleteType(type.id)} className='text-gray-500'>
                  <MdDelete className='text-2xl' />
                </button>
                <button onClick={() => handleEditType(type.id)} className='text-gray-500'>
                  <MdEdit className='text-2xl' />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <p className='text-gray-500'>Your types will appear here</p>
        </div>
      )}

      <AddTypeModal
        mode={showAddModal ? 'create' : 'edit'}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddType}
      />
    </div>
  );
};

export default GymwearTypesManager;
