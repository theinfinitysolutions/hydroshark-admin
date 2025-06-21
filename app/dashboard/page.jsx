'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FaRegCalendarAlt, FaFilter } from 'react-icons/fa';
import AnalyticsChart from '@/components/Charts/AnalyticsChart';
import instance from '@/utils/instance';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    aggregation: 'daily',
    product_type: 'overall',
  });

  const aggregationOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const productTypeOptions = [
    { value: 'overall', label: 'All Products' },
    { value: 'merchandise', label: 'Merchandise' },
    { value: 'drinks', label: 'Drinks' },
  ];

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await instance({
        method: 'POST',
        url: '/analytics/',
        data: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          aggregation: filters.aggregation,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setAnalyticsData(response.data.analytics || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [filters.start_date, filters.end_date, filters.aggregation]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setQuickDateRange = (range) => {
    const today = new Date();
    let startDate,
      endDate = today;

    switch (range) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(today.setMonth(today.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        break;
      default:
        return;
    }

    setFilters((prev) => ({
      ...prev,
      start_date: startDate.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    }));
  };

  const getFilteredData = () => {
    return analyticsData.filter((item) =>
      filters.product_type === 'overall' ? item.product_type === 'overall' : item.product_type === filters.product_type
    );
  };

  const getCurrentData = () => {
    const filteredData = getFilteredData();
    const currentPeriod = filteredData[0] || {};

    return {
      total_sales: currentPeriod.total_sales || 0,
      total_revenue: currentPeriod.total_revenue || 0,
      total_orders: currentPeriod.total_orders || 0,
      total_carts: currentPeriod.total_carts || 0,
      total_gwp: currentPeriod.total_gwp || 0,
      most_sold_item: currentPeriod.most_sold_item_name || 'N/A',
      conversion_rate:
        currentPeriod.total_carts > 0 ? ((currentPeriod.total_orders / currentPeriod.total_carts) * 100).toFixed(1) : 0,
      avg_order_value:
        currentPeriod.total_orders > 0 ? (currentPeriod.total_revenue / currentPeriod.total_orders).toFixed(2) : 0,
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const currentData = getCurrentData();

  const chartData = [
    {
      title: 'Total Sales',
      value: formatCurrency(currentData.total_sales),
      type: 'currency',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(currentData.total_revenue),
      type: 'currency',
    },
    {
      title: 'Conversion Rate',
      value: `${currentData.conversion_rate}%`,
      type: 'percentage',
      breakdown: [
        { label: 'Total Carts', value: currentData.total_carts },
        { label: 'Total Orders', value: currentData.total_orders },
        { label: 'Conversion Rate', value: `${currentData.conversion_rate}%` },
      ],
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(currentData.avg_order_value),
      type: 'currency',
    },
    {
      title: 'Total Orders',
      value: currentData.total_orders.toLocaleString(),
      type: 'number',
    },
    {
      title: 'Top Selling Product',
      value: currentData.most_sold_item,
      type: 'text',
    },
  ];

  return (
    <div className='w-full flex flex-col items-center text-black h-[90vh] p-4 bg-[#f6f6f6] overflow-y-scroll'>
      <div className='flex flex-col items-start w-full'>
        <p className='text-2xl font-semibold text-black'>Analytics Dashboard</p>
        <p className='text-sm text-gray-600 mt-1'>
          {filters.product_type === 'overall'
            ? 'All Products'
            : filters.product_type.charAt(0).toUpperCase() + filters.product_type.slice(1)}{' '}
          •{filters.aggregation.charAt(0).toUpperCase() + filters.aggregation.slice(1)} View
        </p>
      </div>

      {/* Filters Section */}
      <div className='w-full bg-white rounded-lg shadow-sm p-4 mt-4'>
        {/* Quick Date Range Buttons */}
        <div className='flex flex-row gap-2 mb-4 flex-wrap'>
          <span className='text-sm font-medium text-gray-700 mr-2 flex items-center'>Quick Select:</span>
          {[
            { label: 'Today', value: 'today' },
            { label: 'Last 7 Days', value: 'week' },
            { label: 'Last Month', value: 'month' },
            { label: 'Last Quarter', value: 'quarter' },
            { label: 'Last Year', value: 'year' },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setQuickDateRange(preset.value)}
              className='px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors'
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className='flex flex-row items-center gap-4 flex-wrap'>
          <div className='flex flex-col'>
            <label className='text-xs text-gray-600 mb-1'>Start Date</label>
            <input
              type='date'
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-xs text-gray-600 mb-1'>End Date</label>
            <input
              type='date'
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-xs text-gray-600 mb-1'>Frequency</label>
            <select
              value={filters.aggregation}
              onChange={(e) => handleFilterChange('aggregation', e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
            >
              {aggregationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label className='text-xs text-gray-600 mb-1'>Product Type</label>
            <select
              value={filters.product_type}
              onChange={(e) => handleFilterChange('product_type', e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
            >
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className='flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4'
          >
            <FaFilter className='mr-2' />
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
        {chartData.map((chart, index) => (
          <div key={index} className='w-full bg-white rounded-lg shadow-md px-4 py-4 flex flex-col'>
            <p className='text-sm font-medium text-gray-600 mb-2'>{chart.title}</p>

            {loading ? (
              <div className='flex items-center justify-center h-24'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black'></div>
              </div>
            ) : (
              <div className='flex-1'>
                {chart.type === 'percentage' && chart.breakdown ? (
                  <div className='w-full flex flex-col items-start'>
                    <p className='text-2xl font-bold text-black mb-4'>{chart.value}</p>

                    {chart.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className='flex flex-row w-full justify-between items-center py-2 border-b border-gray-200 last:border-b-0'
                      >
                        <div className='flex flex-col items-start'>
                          <p className='text-sm text-black'>{item.label}</p>
                          <p className='text-xs text-gray-500'>
                            {typeof item.value === 'number' ? item.value.toLocaleString() + ' sessions' : item.value}
                          </p>
                        </div>
                        <p className='text-base font-semibold text-black'>
                          {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : chart.type === 'text' ? (
                  <div className='w-full flex flex-col items-start'>
                    <p className='text-lg font-semibold text-black truncate'>{chart.value}</p>
                    <p className='text-xs text-gray-500 mt-1'>Most popular item</p>
                  </div>
                ) : (
                  <div className='w-full flex flex-col items-start'>
                    <p className='text-2xl font-bold text-black'>{chart.value}</p>
                    <p className='text-xs text-gray-500 mt-1'>{chart.type === 'currency' ? 'Total amount' : 'Count'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {!loading && analyticsData.length > 0 && (
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-black mb-4'>Revenue Trend</h3>
            <div className='h-64'>
              <AnalyticsChart data={getFilteredData()} type='bar' title='Revenue' dataKey='total_revenue' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-black mb-4'>Orders Trend</h3>
            <div className='h-64'>
              <AnalyticsChart data={getFilteredData()} type='line' title='Orders' dataKey='total_orders' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-black mb-4'>Sales Distribution</h3>
            <div className='h-64'>
              <AnalyticsChart
                data={analyticsData.filter((item) => item.product_type !== 'overall')}
                type='pie'
                title='Sales by Product Type'
                dataKey='total_sales'
              />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-black mb-4'>Cart vs Orders</h3>
            <div className='h-64'>
              <AnalyticsChart data={getFilteredData()} type='bar' title='Conversion' dataKey='total_carts' />
            </div>
          </div>
        </div>
      )}

      {/* Additional Analytics Summary */}
      {!loading && analyticsData.length > 0 && (
        <div className='w-full bg-white rounded-lg shadow-sm p-4 mt-6'>
          <h3 className='text-lg font-semibold text-black mb-4'>Period Summary</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {productTypeOptions.map((productType) => {
              const typeData = analyticsData.find((item) => item.product_type === productType.value) || {};
              return (
                <div key={productType.value} className='p-3 border border-gray-200 rounded-lg'>
                  <h4 className='font-medium text-gray-800 mb-2'>{productType.label}</h4>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Revenue:</span>
                      <span className='font-medium'>{formatCurrency(typeData.total_revenue || 0)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Orders:</span>
                      <span className='font-medium'>{(typeData.total_orders || 0).toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Carts:</span>
                      <span className='font-medium'>{(typeData.total_carts || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
