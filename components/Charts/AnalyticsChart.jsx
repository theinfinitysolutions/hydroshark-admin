import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsChart = ({ data, type, title, dataKey }) => {
  const formatValue = (value, type) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(value);
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  console.log('data', data);

  const formatTooltipValue = (value, name, props) => {
    if (name.includes('revenue') || name.includes('sales') || name.includes('value')) {
      return formatValue(value, 'currency');
    }
    if (name.includes('rate') || name.includes('conversion')) {
      return formatValue(value, 'percentage');
    }
    return formatValue(value, 'number');
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='period'
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => formatValue(value, dataKey.includes('revenue') ? 'currency' : 'number')}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Bar dataKey={dataKey} fill='#181818' />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='period'
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => formatValue(value, dataKey.includes('revenue') ? 'currency' : 'number')}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Line type='monotone' dataKey={dataKey} stroke='#181818' strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = data.map((item, index) => ({
          name: item.product_type,
          value: item[dataKey],
          fill: COLORS[index % COLORS.length],
        }));

        return (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatValue(value, dataKey.includes('revenue') ? 'currency' : 'number')} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className='flex items-center justify-center w-full h-full'>
            <p className='text-gray-500'>No chart data available</p>
          </div>
        );
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <p className='text-gray-500'>No data available</p>
      </div>
    );
  }

  return renderChart();
};

export default AnalyticsChart;
