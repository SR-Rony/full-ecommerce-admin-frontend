
import React from 'react';
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

// ** Chart.JS Souurce **

//Chartjs Line Chart
export const Option1 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
  cutout: 90,
};
export const Data1 = {
  type: 'line',
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ],
  datasets: [{
    label: 'My First dataset',
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

//Chartjs Bar Chart

export const Option2 = {

  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
export const Data2 = {
  type: 'bar',
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(132, 90, 223, 0.2)',
      'rgba(35, 183, 229, 0.2)',
      'rgba(245, 184, 73, 0.2)',
      'rgba(73, 182, 245, 0.2)',
      'rgba(230, 83, 60, 0.2)',
      'rgba(38, 191, 148, 0.2)',
      'rgba(35, 35, 35, 0.2)'
    ],
    borderColor: [
      'rgba(94, 118, 166, 0.2)',
      'rgba(94, 166, 142, 0.2)',
      'rgba(166, 142, 94, 0.2)',
      'rgba(94, 154, 166, 0.2)',
      'rgba(185, 93, 75, 0.2)',
      'rgba(118, 166, 94, 0.2)',
      'rgba(140, 144, 151, 0.2)'
    ],
    borderColor: [
      '#6366f1',
      'rgb(94, 166, 142)',
      'rgb(166, 142, 94)',
      'rgb(94, 154, 166)',
      'rgb(185, 93, 75)',
      'rgb(118, 166, 94)',
      'rgb(140, 144, 151)'
    ],
    borderWidth: 1
  }]
};
//chart js radial chart'

export const RadarData = {
  type: 'radar',
  labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(94, 118, 166, 0.2)',
      borderColor: '#6366f1',
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#6366f1'
    }, {
      label: 'My Second Dataset',
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: 'rgba(94, 166, 142, 0.2)',
      borderColor: 'rgb(94, 166, 142)',
      pointBackgroundColor: 'rgb(94, 166, 142)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(94, 166, 142)'
    }]
};

export const RadarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderWidth: 3
    }
  }
};
//Scatter chart

export const ScatterData = {
  type: 'scatter',
  datasets: [{
    label: 'Scatter Dataset',
    data: [{
      x: -10,
      y: 0
    }, {
      x: 0,
      y: 10
    }, {
      x: 10,
      y: 5
    }, {
      x: 0.5,
      y: 5.5
    }],
    backgroundColor: '#6366f1'
  }],
};

export const ScatterOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom'
    }
  }
};

//mixed chart

export const MixedChartData = {
  type: 'scatter',
  labels: ['January', 'February', 'March', 'April'],
  datasets: [{
    type: 'bar',
    label: 'Bar Dataset',
    data: [10, 20, 30, 40],
    borderColor: '#6366f1',
    backgroundColor: 'rgba(94, 118, 166, 0.2)',
  }, {
    type: 'line',
    label: 'Line Dataset',
    data: [50, 50, 50, 50],
    fill: false,
    borderColor: 'rgb(94, 166, 142)',
  }]
};

export const MixedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
//Bubble chart
export const BubbleData = {
  type: 'bubble',
  datasets: [{
    label: 'First Dataset',
    data: [{
      x: 20,
      y: 30,
      r: 15
    }, {
      x: 40,
      y: 10,
      r: 10
    }],
    backgroundColor: '#6366f1'
  }]
};

export const BubbleOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
//chartpie chart
export const PieData = {
  type: 'pie',
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      '#6366f1',
      'rgb(94, 166, 142)',
      'rgb(166, 142, 94)'
    ],
    hoverOffset: 4,
    borderColor: 'rgba(142, 156, 173,0.1)'
  }]
};

export const PieOptions = {
  responsive: true,
  maintainAspectRatio: false
};

//chart donutchart
export const DoughnutData = {
  type: 'doughnut',
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      '#6366f1',
      'rgb(94, 166, 142)',
      'rgb(166, 142, 94)'
    ],
    hoverOffset: 4,
    borderColor: 'rgba(142, 156, 173,0.1)'
  }]
};

export const DoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false
};
//polar chart
export const polarData = {
  type: 'doughnut',
  labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
  datasets: [{
    label: 'My First Dataset',
    data: [11, 16, 7, 3, 14],
    backgroundColor: [
      '#6366f1',
      'rgb(75, 192, 192)',
      'rgb(166, 142, 94)',
      'rgb(201, 203, 207)',
      'rgb(94, 166, 142)'
    ],
    borderColor: 'rgba(142, 156, 173,0.1)'
  }]
};

export const polarOptions = {
  responsive: true,
  maintainAspectRatio: false
};

//
//Sale Value

export const DoughnutData1 = {
  type: 'doughnut',
  labels: ['Items', 'Revenue'],
  datasets: [{
    label: 'My First Dataset',
    data: [60, 40],
    backgroundColor: ['rgb(90, 102, 241)', 'rgb(96, 165, 250)'],
    borderWidth: 0,

  }]
};

export const DoughnutOptions1 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};
//
export const fileData = {
  type: 'doughnut',
  label: 'My First Dataset',
  datasets: [
    {
      data: [75, 25],
      backgroundColor: [
        'rgb(94, 166, 142)',
        'rgb(249, 250, 251)'
      ],
      borderWidth: 0,
    },
  ],
};

export const fileOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: "75%",
};
