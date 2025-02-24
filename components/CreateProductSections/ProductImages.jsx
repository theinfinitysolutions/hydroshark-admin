'use client';
import React, { useEffect, useState } from 'react';
import instance from '@/utils/instance';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { MdOutlineFileUpload } from 'react-icons/md';
import useStore from '@/utils/store';
import { MdDelete } from 'react-icons/md';
import Spinner from '@/components/Spinner';
import { MdStar, MdStarBorder } from 'react-icons/md';

const labelClass = 'text-black text-sm ';
const inputClass = 'border border-black rounded-md p-1 text-black focus:outline-none';

const ProductImages = ({ productId, productImages }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(productImages);
  const [isPrimary, setIsPrimary] = useState(false);
  const { showCreateProductModal, setShowCreateProductModal } = useStore();

  const onDrop = (acceptedFiles) => {
    setLoading(true);
    console.log('acceptedFiles', acceptedFiles);
    const formData = new FormData();
    formData.append(`file`, acceptedFiles[0]);
    instance
      .post('/utils/file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setLoading(false);
        console.log('res files', res.data);
        AddProductImages(res.data.id);
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  const AddProductImages = (id) => {
    setLoading(true);
    instance
      .post(`/drinks/product-image/`, {
        product: productId,
        image: id,
      })
      .then((res) => {
        setLoading(false);
        setShowCreateProductModal({
          ...showCreateProductModal,
          refresh: !showCreateProductModal.refresh,
        });
        console.log('res', res);
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  const deleteProductImage = (id) => {
    setLoading(true);
    instance
      .patch(`/drinks/product-image/${id}/`, {
        is_deleted: true,
      })
      .then((res) => {
        console.log('res', res);
        setLoading(false);
        setShowCreateProductModal({
          ...showCreateProductModal,
          refresh: !showCreateProductModal.refresh,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handlePrimaryImage = (id, value) => {
    setLoading(true);
    instance
      .patch(`/drinks/product-image/${id}/`, {
        is_primary: value,
      })
      .then((res) => {
        console.log('res', res);
        setLoading(false);
        setShowCreateProductModal({
          ...showCreateProductModal,
          refresh: !showCreateProductModal.refresh,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  useEffect(() => {
    if (productImages && productImages.length > 0) {
      let primary = false;
      productImages.map((image) => {
        if (image.is_primary) {
          primary = true;
        }
      });
      setIsPrimary(primary);
    }
  }, [productImages]);

  if (loading) {
    return (
      <div className='flex flex-col h-[40vh] w-full justify-center items-center'>
        <Spinner loading={loading} size={40} color={'#000000'} />
        <p className='text-base mt-2 text-black'>Loading Product Data</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full mt-4'>
      <label className={`${labelClass}`} htmlFor='productImage'>
        Product Images
      </label>
      <div
        {...getRootProps({ className: 'dropzone' })}
        className='w-full mt-2 h-[10vh] border-[1px] border-gray-500 rounded-xl border-dashed text-gray-500 bg-gray-50 flex flex-col justify-center items-center'
      >
        <input {...getInputProps()} />
        <MdOutlineFileUpload className='text-gray-500' />
        <p>{"Drag 'n' drop some files here, or click to select files"}</p>
      </div>
      <div className='flex flex-wrap gap-4 w-full mt-4'>
        {files.map((file, index) => {
          return (
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
                  onClick={() => handlePrimaryImage(file.id, !file.is_primary)}
                  className={`p-2 rounded-full ${
                    file.is_primary
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title={file.is_primary ? 'Primary Image' : 'Set as Primary'}
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
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
