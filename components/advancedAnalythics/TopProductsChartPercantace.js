/* eslint-disable react/jsx-key */
import { isValidArray, sliceTextForTitle } from '@/utils/func';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TopProductSalesStats = ({ data, type, isLoading = false, title = "Sales Statistics" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Professional Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
          <div className="relative">
            {/* Multi-ring spinner */}
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-emerald-500 border-r-teal-500"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-b-blue-500 border-l-purple-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-pulse">📈</span>
            </div>
          </div>
          
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading statistics...</p>
          
          {/* Loading dots */}
          <div className="flex gap-2 mt-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Professional Empty State
  if (!isValidArray(data?.labels)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
          {/* Glassmorphism Icon Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
            <div className="relative p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-3xl border border-emerald-200 dark:border-emerald-700">
              <span className="text-7xl">📈</span>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Statistics Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6">
            There are no sales statistics to display at the moment. Data will appear once products are sold.
          </p>

          {/* Decorative element */}
          <div className="flex gap-2 mt-2">
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
            <div className="w-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const slicedLabels = data.labels.map(label => sliceTextForTitle(label, 15));

  // Professional color palette
  const professionalColors = [
    '#10B981', // Emerald
    '#14B8A6', // Teal
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#F97316', // Orange
  ];

  const chartOptions = {
    labels: slicedLabels,
    colors: professionalColors,
    chart: {
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#fff'],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: '#1F2937',
              offsetY: 10,
              formatter: function (val) {
                return val + '%';
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6B7280',
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return total.toFixed(1) + '%';
              },
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: '#374151',
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '13px',
      },
      y: {
        formatter: function (val) {
          return val.toFixed(1) + '%';
        },
        title: {
          formatter: function (seriesName, opts) {
            return data.labels[opts.seriesIndex];
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff'],
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350,
          },
          legend: {
            position: 'bottom',
            fontSize: '12px',
            itemMargin: {
              horizontal: 8,
              vertical: 6,
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            fontSize: '11px',
            itemMargin: {
              horizontal: 6,
              vertical: 5,
            },
          },
          dataLabels: {
            style: {
              fontSize: '10px',
            },
          },
        },
      },
    ],
  };

  const chartSeries = data?.series || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Gradient Icon Badge */}
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
              <span className="text-white text-xl">📈</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Percentage distribution breakdown
              </p>
            </div>
          </div>
          
          {/* Total Percentage Badge */}
          <div className="px-4 py-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</span>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {chartSeries.reduce((a, b) => a + b, 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <div className="relative">
          {/* Decorative background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/5 dark:to-teal-900/5 rounded-2xl"></div>
          
          {/* Chart */}
          <div className="relative">
            {mounted && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={400}
                width="100%"
              />
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.labels.slice(0, 3).map((label, index) => (
            <div 
              key={index}
              className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: professionalColors[index] }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                  {sliceTextForTitle(label, 12)}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {chartSeries[index].toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  of total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProductSalesStats;
