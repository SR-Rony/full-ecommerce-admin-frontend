import { isValidArray } from '@/utils/func';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Use dynamic import to load ApexCharts only on the client side
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DailySalesChart = ({ data }) => {
  if (!isValidArray(data?.labels)) return null;

  const [chartOptions, setChartOptions] = useState({
    xaxis: {
      categories: data?.labels||[],
    },
    tooltip: {
      y: {
        formatter: function (value) {
         if(value){
          return "$"+value ;
         }
        },
      },
     
    },
   
  });

  const [chartSeries, setChartSeries] = useState(data?.datasets||{});

  useEffect(() => {
    if (data) {
      setChartOptions({
  
        xaxis: {
          categories: data.labels || [],
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return "$"+""+ value ;
            },
          },
         
        },
    
      });
  
      setChartSeries(data.datasets || {});
    }
  }, [data]);
  
  return (
    <div className="bg-white p-4 rounded-md ">
      <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
    </div>
  );
};

export default DailySalesChart;
