/* eslint-disable react/jsx-key */
import { isValidArray, sliceTextForTitle } from "@/utils/func";
import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TopProductViewStats = ({ data, type, isLoading = false, title = "Top Views" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Professional Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full min-h-[350px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-500 border-r-blue-500"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-indigo-500 border-l-purple-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">👁️</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Loading views...</p>
        </div>
      </div>
    );
  }

  // Professional Empty State
  if (!isValidArray(data?.labels)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full min-h-[350px]">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <div className="relative p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 backdrop-blur-sm rounded-3xl border border-cyan-200 dark:border-cyan-700">
              <span className="text-5xl">👁️</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No View Data</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm max-w-xs">View statistics will appear once products are visited.</p>
        </div>
      </div>
    );
  }

  const slicedLabels = data.labels.map((label) => sliceTextForTitle(label));
  const professionalColors = ['#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#14B8A6', '#F97316'];

  const chartOptions = {
    labels: slicedLabels,
    colors: professionalColors,
    chart: {
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Views',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 500,
      markers: { width: 10, height: 10, radius: 5 },
      itemMargin: { horizontal: 10, vertical: 6 },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val + ' views';
        },
        title: {
          formatter: function (seriesName, opts) {
            return data.labels[opts.seriesIndex];
          },
        },
      },
    },
    stroke: { show: true, width: 2, colors: ['#fff'] },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 280 },
          legend: { fontSize: '10px' },
        },
      },
    ],
  };

  const chartSeries = data?.series;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-750 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-md">
            <span className="text-white text-base">👁️</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">By view count</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        {mounted && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={300}
          />
        )}
      </div>
    </div>
  );
};

export default TopProductViewStats;
