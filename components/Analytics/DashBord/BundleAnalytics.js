/* eslint-disable react/jsx-key */
import { isValidArray } from "@/utils/func";
import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BundleAnalytics = ({ data, type, isLoading = false, title = "Bundle Analytics" }) => {
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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-500 border-r-pink-500"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-indigo-500 border-l-blue-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">📦</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Loading bundle data...</p>
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
            <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-3xl border border-purple-200 dark:border-purple-700">
              <span className="text-5xl">📦</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Bundle Data</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm max-w-xs">Bundle analytics will appear once bundles are purchased.</p>
        </div>
      </div>
    );
  }

  const professionalColors = ['#8B5CF6', '#EC4899', '#6366F1', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#14B8A6', '#F97316'];

  const chartOptions = {
    labels: data.labels,
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
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val ? val.toFixed(1) + "%" : "";
      },
      style: {
        fontSize: '11px',
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
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Bundles',
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
          return val.toFixed(1) + '%';
        },
        title: {
          formatter: function (seriesName) {
            return seriesName || "";
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-750 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
            <span className="text-white text-base">📦</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Distribution by type</p>
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

export default BundleAnalytics;
