import { isValidArray } from '@/utils/func';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BundleAnalytics = ({ data, type = 'donut' }) => {
  // Check if data is present and valid
  console.log(data,'series');
  const hasValidData = data && isValidArray(data?.series) && isValidArray(data.series);

  if (!hasValidData) {
    return <p className='text-center h-[300px] pt-[30px]'>No Data Available</p>;
  }

  const chartOptions = {
    labels: data.labels,
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val}%`;
        },
        title: {
          formatter: function (seriesName) {
            return seriesName;
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
    <div className="rounded-[5px] w-full h-full">
      <Chart options={chartOptions} series={chartSeries} type={type} height={"100%"} width={"100%"} />
    </div>
  );
};

BundleAnalytics.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  type: PropTypes.string,
};

export default BundleAnalytics;
