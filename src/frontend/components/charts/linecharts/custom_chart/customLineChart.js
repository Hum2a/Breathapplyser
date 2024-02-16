import React from 'react';
import { Line } from 'react-chartjs-2';

const BACTrackerChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.lastUpdated), // Use lastUpdated as labels
    datasets: [
      {
        label: 'BAC Level',
        data: data.map((entry) => entry.value), // Use BAC values
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour', // Adjust time unit as needed
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default BACTrackerChart;
