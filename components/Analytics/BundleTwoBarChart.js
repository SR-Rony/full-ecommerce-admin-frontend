/* eslint-disable react/jsx-key */
import { isValidArray } from '@/utils/func';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BundleTwoBarChart = ({ options,type }) => {
    if (!isValidArray(options?.series)) return <p className='text-center h-[300px] pt-[30px]'>No Data Available</p>;
    const optionsChart = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: 'end', // 'around', 'end'
          borderRadiusWhenStacked: 'last', // 'all', 'last'
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      xaxis: {
        type: 'datetime',
        categories:options.categories,
      },

      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
  
    return (
      <Chart
        options={optionsChart}
        series={options.series}
        height={350}
      />
    );
  };
export default BundleTwoBarChart;
