import { isValidArray, sliceTextForTitle } from '@/utils/func';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CountriesVisitingChart = ({ data }) => {
  // console.log(data,'apexchart data');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  // Set this true once mounted in the client side
  }, []);

  if (!isClient || !data || !isValidArray(data.labels) || !isValidArray(data.series)) {
    return <p>No Data Available</p>;
  }

  const slicedLabels = data.labels.map(label => sliceTextForTitle(label));

  const chartOptions = {
    labels: slicedLabels,
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return ``;
        },
        title: {
          formatter: function (seriesName, opts) {
            return data.labels[opts.seriesIndex]; // Use original label in tooltip
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
        },
      },
    ],
  };

  const chartSeries = data.series;

  return (
    <div className="bg-white rounded-[5px] w-full h-[95%]">
      <Chart
    
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={"100%"}  // Adjusted to 90% of parent height
        width={"100%"}   // Adjusted to 90% of parent width
      />
    </div>
  );
};

export default CountriesVisitingChart;
