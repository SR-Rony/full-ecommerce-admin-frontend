import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DevoiceVisitingChart = ({data}) => {
  if(!data?.labels) return null;
  
  const chartOptions = {
    labels: data.labels,
    options: {
        chart: {
          height: 325,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontSize: "15px",
          fontWeight: 500,
          labels: {
            color: ["rgb(100, 116, 139)"],
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          colors: "#fff",
          width: 0,
          dashArray: 0,
        },
        grid: {
          borderColor: "rgba(107, 114, 128, 0.1)",
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "80%",
              background: "transparent",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "10px",
                  color: "#495057",
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "15px",
                  fontWeight: 600,
                  offsetY: 8,
                  formatter: function (val) {
                  
                    return val + "%";
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total",
                  fontSize: "15px",
                  color: "rgb(100, 116, 139)",
                },
              },
            },
          },
        },
        colors: [
          "rgba(90, 102, 241, 1)",
          "rgba(96, 165, 250, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(203, 213, 225, 1)",
        ],
      },
  };

  const chartSeries = data?.series;
  return (
    <div className="bg-white rounded-md">
      <Chart options={chartOptions} series={chartSeries} type="donut" height={350} />
    </div>
  );
};

export default DevoiceVisitingChart;
