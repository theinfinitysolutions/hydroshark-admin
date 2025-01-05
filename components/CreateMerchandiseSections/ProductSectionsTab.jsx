'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDelete, MdAdd, MdLocalOffer } from 'react-icons/md';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { TbRulerMeasure } from 'react-icons/tb';
import { BsBox } from 'react-icons/bs';

const defaultSectionValues = {
  section_title: '',
  size: '',
  chest_measurement: '',
  weight: '',
  price: '',
  hydroshark_points_on_purchase: 0,
  discount_percentage: '',
  discounted_amount: '',
  quantity: 0,
};

const labelClass = 'text-black text-sm font-medium';
const inputClass =
  'border border-black/20 rounded-lg p-2 text-black focus:outline-none focus:border-black transition-colors';

const ProductSectionsTab = ({ productSections, setProductSections, setActiveTab }) => {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState({ color_name: '', color_code: '#000000', in_stock: true });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultSectionValues,
  });

  // Watch price and discount percentage to calculate discounted amount
  const price = watch('price') || 0;
  const discountPercentage = watch('discount_percentage') || 0;

  const calculateDiscountedAmount = (price, percentage) => {
    const discount = (price * percentage) / 100;
    return (price - discount).toFixed(2);
  };

  const onAddSection = (data) => {
    if (colors.length === 0) {
      alert('Please add at least one color variant');
      return;
    }

    const discountedAmount = calculateDiscountedAmount(data.price, data.discount_percentage);
    const newSection = {
      ...data,
      id: Date.now(),
      colors: [...colors],
      discounted_amount: discountedAmount,
    };
    setProductSections([...productSections, newSection]);
    setColors([]);
    reset(defaultSectionValues);
  };

  const addColor = () => {
    if (!newColor.color_name.trim()) return;
    if (colors.some((c) => c.color_name === newColor.color_name)) {
      alert('Color name must be unique');
      return;
    }
    setColors([...colors, { ...newColor, id: Date.now() }]);
    setNewColor({ color_name: '', color_code: '#000000', in_stock: true });
  };

  const removeColor = (colorId) => {
    setColors(colors.filter((color) => color.id !== colorId));
  };

  const removeSection = (id) => {
    setProductSections(productSections.filter((section) => section.id !== id));
  };

  return (
    <div className='space-y-8'>
      {/* Add New Section Form */}
      <div className='bg-white p-8 rounded-xl shadow-sm border'>
        <h3 className='text-xl text-black  font-semibold mb-6 flex items-center gap-2'>
          <BsBox className='text-2xl' />
          Create Merchandise Section
        </h3>

        <form onSubmit={handleSubmit(onAddSection)} className='space-y-8'>
          {/* Basic Information */}
          <div className='grid grid-cols-2 gap-6'>
            <div className='col-span-2'>
              <label className={labelClass}>Section Title</label>
              <input
                {...register('section_title', { required: 'Section title is required' })}
                placeholder='e.g., Small, Medium, Large, Cotton, Polyester'
                className={inputClass + ' w-full mt-1'}
              />
              {errors.section_title && (
                <span className='text-red-500 text-xs mt-1'>{errors.section_title.message}</span>
              )}
            </div>

            {/* Size and Measurements */}
            <div className='col-span-2 bg-gray-50 p-6 rounded-xl space-y-6'>
              <h4 className='font-semibold flex text-black items-center gap-2'>
                <TbRulerMeasure className='text-xl' />
                Size & Measurements
              </h4>

              <div className='grid grid-cols-3 gap-6'>
                <div>
                  <label className={labelClass}>Size</label>
                  <select
                    {...register('size', { required: 'Size is required' })}
                    className={inputClass + ' w-full mt-1'}
                  >
                    <option value=''>Select Size</option>
                    <option value='XS'>XS</option>
                    <option value='S'>S</option>
                    <option value='M'>M</option>
                    <option value='L'>L</option>
                    <option value='XL'>XL</option>
                    <option value='XXL'>XXL</option>
                  </select>
                  {errors.size && <span className='text-red-500 text-xs mt-1'>{errors.size.message}</span>}
                </div>

                <div>
                  <label className={labelClass}>Chest Measurement (inches)</label>
                  <input
                    {...register('chest_measurement', { required: 'Chest measurement is required' })}
                    placeholder='e.g., 40'
                    className={inputClass + ' w-full mt-1'}
                  />
                  {errors.chest_measurement && (
                    <span className='text-red-500 text-xs mt-1'>{errors.chest_measurement.message}</span>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Weight</label>
                  <input
                    {...register('weight', { required: 'Weight is required' })}
                    placeholder='e.g., 0.5kg'
                    className={inputClass + ' w-full mt-1'}
                  />
                  {errors.weight && <span className='text-red-500 text-xs mt-1'>{errors.weight.message}</span>}
                </div>
              </div>
            </div>

            {/* Pricing and Points */}
            <div className='col-span-2 bg-gray-50 p-6 rounded-xl space-y-6'>
              <h4 className='font-semibold flex text-black items-center gap-2'>
                <MdLocalOffer className='text-xl' />
                Pricing & Points
              </h4>

              <div className='grid grid-cols-3 gap-6'>
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type='number'
                    step='0.01'
                    {...register('price', { required: 'Price is required' })}
                    className={inputClass + ' w-full mt-1'}
                  />
                  {errors.price && <span className='text-red-500 text-xs mt-1'>{errors.price.message}</span>}
                </div>

                <div>
                  <label className={labelClass}>Discount (%)</label>
                  <input
                    type='number'
                    step='0.01'
                    {...register('discount_percentage', { required: 'Discount is required' })}
                    className={inputClass + ' w-full mt-1'}
                  />
                  {errors.discount_percentage && (
                    <span className='text-red-500 text-xs mt-1'>{errors.discount_percentage.message}</span>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Final Price</label>
                  <input
                    type='number'
                    value={calculateDiscountedAmount(price, discountPercentage)}
                    disabled
                    className={inputClass + ' w-full mt-1 bg-gray-100'}
                  />
                </div>

                <div>
                  <label className={labelClass}>Points on Purchase</label>
                  <input
                    type='number'
                    {...register('hydroshark_points_on_purchase')}
                    className={inputClass + ' w-full mt-1'}
                  />
                </div>

                <div>
                  <label className={labelClass}>Total Quantity</label>
                  <input
                    type='number'
                    {...register('quantity', { required: 'Quantity is required' })}
                    className={inputClass + ' w-full mt-1'}
                  />
                  {errors.quantity && <span className='text-red-500 text-xs mt-1'>{errors.quantity.message}</span>}
                </div>
              </div>
            </div>

            {/* Color Variants */}
            <div className='col-span-2 bg-gray-50 p-6 rounded-xl space-y-6'>
              <h4 className='font-semibold flex text-black items-center gap-2'>
                <IoColorPaletteOutline className='text-xl' />
                Color Variants ({colors.length})
              </h4>

              <div className='flex gap-4 items-end'>
                <div className='flex-1'>
                  <label className={labelClass}>Color Name</label>
                  <input
                    placeholder='e.g., Navy Blue'
                    value={newColor.color_name}
                    onChange={(e) => setNewColor({ ...newColor, color_name: e.target.value })}
                    className={inputClass + ' w-full mt-1'}
                  />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input
                    type='color'
                    value={newColor.color_code}
                    onChange={(e) => setNewColor({ ...newColor, color_code: e.target.value })}
                    className={inputClass + ' w-20 h-10 mt-1'}
                  />
                </div>
                <button
                  type='button'
                  onClick={addColor}
                  className='bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/80 transition-colors'
                >
                  <MdAdd />
                  Add Color
                </button>
              </div>

              <div className='grid grid-cols-4 gap-4'>
                {colors.map((color) => (
                  <div key={color.id} className='bg-white p-4 rounded-lg border hover:shadow-md transition-shadow'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div
                        className='w-10 h-10 rounded-lg border shadow-inner'
                        style={{ backgroundColor: color.color_code }}
                      />
                      <p className='font-medium text-black'>{color.color_name}</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeColor(color.id)}
                      className='w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-md text-sm font-medium transition-colors'
                    >
                      <MdDelete />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              className='bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-black/80 transition-colors'
            >
              <MdAdd className='text-xl' />
              Add Section
            </button>
          </div>
        </form>
      </div>

      {/* Sections List */}
      <div className='grid grid-cols-2 gap-6'>
        {productSections.map((section) => (
          <div key={section.id} className='bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h4 className='font-semibold text-lg text-black'>{section.section_title}</h4>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
                    Size: {section.size}
                  </span>
                  <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>
                    {section.colors.length} Colors
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeSection(section.id)}
                className='text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors'
              >
                <MdDelete className='text-xl' />
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm text-gray-600'>Price</p>
                <p className='font-medium mt-1'>
                  <span className='text-gray-500 line-through text-sm'>₹{section.price}</span>
                  <span className='text-black ml-2'>₹{section.discounted_amount}</span>
                </p>
              </div>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm text-gray-600'>Points</p>
                <p className='font-medium mt-1 text-black'>{section.hydroshark_points_on_purchase}</p>
              </div>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm text-gray-600'>Chest</p>
                <p className='font-medium mt-1 text-black'>{section.chest_measurement}"</p>
              </div>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm text-gray-600'>Weight</p>
                <p className='font-medium mt-1 text-black'>{section.weight}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-600'>Available Colors:</p>
              <div className='flex gap-2 flex-wrap'>
                {section.colors.map((color) => (
                  <div key={color.id} className='flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border'>
                    <div
                      className='w-4 h-4 rounded-md border shadow-inner'
                      style={{ backgroundColor: color.color_code }}
                    />
                    <span className='text-sm font-medium text-black'>{color.color_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-end space-x-4 pt-4'>
        <button
          type='button'
          onClick={() => setActiveTab('productDetails')}
          className='px-6 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors'
        >
          Back
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('productImages')}
          className='px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors'
          disabled={productSections.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductSectionsTab;
