import { isValidArray } from "@/utils/func";
import dynamic from "next/dynamic";
import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AnalyticsTotalSale = ({ data, isReq,vsDateRange }) => {
  if (isReq&& !isValidArray(data?.series)) return null;

  const options = {
    chart: {
      type: "bar",
      height: 400,
      stacked: false, // Disable stacking
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%", // Adjust column width for better fit
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: data?.categories,
      labels: {
        style: {
          fontSize: "12px", // Smaller font size for labels
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          // Ensure value is a valid number before formatting
          return value ? `$${value.toFixed(2)}` : "$0.00";
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          // Ensure value is a valid number before formatting
          return value ? `$${value.toFixed(2)}` : "$0.00";
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    title: {
      text: ["H&B VS Auctropin Orders (Last 7 Days)",`${vsDateRange?.fromDate}  to  ${vsDateRange?.toDate}`],
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    colors: ["#008FFB", "#00E396"], // Colors for each series
  };

  const series = data?.series||[];
  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default AnalyticsTotalSale;
