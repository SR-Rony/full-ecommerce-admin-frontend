import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Use dynamic import to load ApexCharts only on the client side
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SearchKeywordsChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({
    xaxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    },
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Daily Sales',
      data: data,
    },
  ]);

  useEffect(() => {
    // Any additional setup can be done here

    // Cleanup function if necessary
    return () => {
      // Cleanup code here
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-md ">
      <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
    </div>
  );
};

export default SearchKeywordsChart;
