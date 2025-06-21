'use client';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdDelete, MdOutlineFileUpload, MdStar, MdStarBorder } from 'react-icons/md';
import { BsImages } from 'react-icons/bs';
import instance from '@/utils/instance';
import Spinner from '@/components/Spinner';
import useStore from '@/utils/store';

const ProductImagesTab = ({
  files,
  setFiles,
  setActiveTab,
  handleSubmit: onSubmit,
  initialLoading,
  mode,
  product,
  getMerchandiseDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setShowCreateMerchandiseModal, showCreateMerchandiseModal } = useStore();

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await instance.post('/utils/file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      handleUpdateImages(response.data.id, product.id);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryImage = async (id, value) => {
    setLoading(true);

    try {
      if (value) {
        // If setting this image as primary, first unset all other primary images
        const unsetPromises = files
          .filter((file) => file.is_primary && file.id !== id)
          .map((file) =>
            instance.patch(`/merchandise/merchandise-image/${file.id}/`, {
              is_primary: false,
            })
          );

        // Wait for all unset operations to complete
        await Promise.all(unsetPromises);
      }

      // Now set/unset the selected image
      const response = await instance.patch(`/merchandise/merchandise-image/${id}/`, {
        is_primary: value,
      });

      console.log('Primary image updated:', response);

      // Refresh the merchandise details to get updated data
      await getMerchandiseDetails(showCreateMerchandiseModal.id);

      // Update the modal state to trigger refresh
      setShowCreateMerchandiseModal({
        ...showCreateMerchandiseModal,
        refresh: !showCreateMerchandiseModal.refresh,
      });

      setLoading(false);
    } catch (err) {
      console.error('Error updating primary image:', err);
      setError('Failed to update primary image. Please try again.');
      setLoading(false);
    }
  };

  const handleUpdateImages = async (imageId, productId) => {
    setLoading(true);
    instance
      .post('/merchandise/merchandise-image/', {
        image: imageId,
        product: productId,
      })
      .then((res) => {
        setLoading(false);
        setShowCreateMerchandiseModal({
          ...showCreateMerchandiseModal,
          refresh: !showCreateMerchandiseModal.refresh,
        });
        getMerchandiseDetails(showCreateMerchandiseModal.id);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    // Upload files one by one
    for (const file of acceptedFiles) {
      await handleFileUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  });

  const deleteMerchandiseImage = (id) => {
    setLoading(true);
    instance
      .patch(`/merchandise/merchandise-image/${id}/`, {
        is_deleted: true,
      })
      .then((res) => {
        console.log('res', res);
        setLoading(false);
        setShowCreateMerchandiseModal({
          ...showCreateMerchandiseModal,
          refresh: !showCreateMerchandiseModal.refresh,
        });
        getMerchandiseDetails(showCreateMerchandiseModal.id);
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='bg-white p-6 rounded-xl shadow-sm border'>
        <h3 className='text-xl text-black font-semibold flex items-center gap-2'>
          <BsImages className='text-2xl' />
          Product Images
        </h3>
        <p className='text-gray-500 mt-2'>Upload product images. The first image will be set as primary by default.</p>
      </div>

      {/* Upload Section */}
      <div className='bg-white p-8 rounded-xl shadow-sm border'>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-black bg-black/5' : 'border-gray-300 hover:border-black/50'
          }`}
        >
          <input {...getInputProps()} />
          <MdOutlineFileUpload className='mx-auto text-4xl text-gray-400' />
          <p className='text-gray-600 mt-2'>Drag & drop images here or click to select files</p>
          <p className='text-gray-400 text-sm mt-1'>Supports: JPG, JPEG, PNG, WebP</p>
        </div>
        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
      </div>

      {/* Images Grid */}
      {files.length > 0 && (
        <div className='bg-white p-6 rounded-xl shadow-sm border'>
          <div className='flex justify-between items-center mb-4'>
            <h4 className='font-semibold text-black'>Uploaded Images ({files.length})</h4>
            <p className='text-sm text-gray-500'>Click the star icon to set primary image</p>
          </div>

          <div className='grid grid-cols-4 gap-4'>
            {files.map((file) => (
              <div
                key={file.id}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  file.is_primary ? 'border-yellow-400 shadow-lg' : 'border-transparent'
                }`}
              >
                <img src={file?.image?.cloudfront} alt='Product' className='w-full h-48 object-cover' />

                {/* Overlay */}
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                  <button
                    type='button'
                    onClick={() => {
                      // Only allow setting as primary if not already primary
                      // If already primary, don't allow unsetting (must have one primary)
                      if (!file.is_primary) {
                        handlePrimaryImage(file.id, true);
                      }
                    }}
                    className={`p-2 rounded-full ${
                      file.is_primary ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title={file.is_primary ? 'Primary Image' : 'Set as Primary'}
                    disabled={loading}
                  >
                    {file.is_primary ? <MdStar className='text-xl' /> : <MdStarBorder className='text-xl' />}
                  </button>
                  <button
                    type='button'
                    onClick={() => deleteMerchandiseImage(file.id)}
                    className='bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500'
                    title='Remove Image'
                  >
                    <MdDelete className='text-xl' />
                  </button>
                </div>

                {/* Primary Badge */}
                {file.is_primary && (
                  <div className='absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium'>
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Loading State */}
      {loading && (
        <div className='flex items-center justify-center p-4'>
          <Spinner />
          <span className='ml-2 text-gray-600'>Uploading images...</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className='flex justify-end space-x-4 pt-4'>
        <button
          type='button'
          onClick={() => setActiveTab('productSections')}
          className='px-6 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors'
        >
          Back
        </button>
        <button
          type='button'
          onClick={onSubmit}
          className='px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors'
          disabled={loading || files.length === 0}
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Spinner size='sm' />
              <span>{mode === 'create' ? 'Creating...' : 'Updating...'}</span>
            </div>
          ) : mode === 'create' ? (
            'Create Product'
          ) : (
            'Update Product'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductImagesTab;
