// TrafficChart.js
import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TrafficChart = () => {
  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Traffic Sources"
    },
    data: [{
      type: "pie",
      startAngle: 75,
      toolTipContent: "<b>{label}</b>: {y}%",
      showInLegend: "true",
      legendText: "{label}",
      indexLabelFontSize: 16,
      indexLabel: "{label} - {y}%",
      dataPoints: [
        { y: 18, label: "Direct" },
        { y: 49, label: "Organic Search" },
        { y: 5, label: "Referral" },
        { y: 19, label: "Social" }
      ]
    }]
  };

  return (
    <div className='mt-4'>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default TrafficChart;
