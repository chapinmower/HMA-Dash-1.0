import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Default styling options that can be overridden
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const defaultColors = [
  'rgba(16, 89, 56, 0.7)',    // HMA primary green
  'rgba(16, 89, 56, 0.5)',    // Lighter green
  'rgba(54, 162, 235, 0.7)',  // Blue
  'rgba(255, 206, 86, 0.7)',  // Yellow
  'rgba(75, 192, 192, 0.7)',  // Teal
  'rgba(153, 102, 255, 0.7)', // Purple
  'rgba(255, 159, 64, 0.7)',  // Orange
  'rgba(255, 99, 132, 0.7)',  // Red
];

// Base chart container with consistent styling
const ChartContainer = ({ title, children, height = 300 }) => (
  <Paper sx={{ p: 2, mb: 3 }}>
    {title && (
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
    )}
    <Box sx={{ height: height }}>
      {children}
    </Box>
  </Paper>
);

/**
 * Line Chart Component for time series data
 * @param {Object} props Component props
 * @param {string} props.title Chart title
 * @param {Object} props.data Chart data object with labels and datasets
 * @param {Object} props.options Chart options (will be merged with defaults)
 * @param {number} props.height Chart height in pixels
 */
export const LineChart = ({ title, data, options = {}, height }) => (
  <ChartContainer title={title} height={height}>
    <Line 
      options={{ ...defaultOptions, ...options }} 
      data={data} 
    />
  </ChartContainer>
);

/**
 * Bar Chart Component for category comparisons
 * @param {Object} props Component props
 * @param {string} props.title Chart title
 * @param {Object} props.data Chart data object with labels and datasets
 * @param {Object} props.options Chart options (will be merged with defaults)
 * @param {number} props.height Chart height in pixels
 */
export const BarChart = ({ title, data, options = {}, height }) => (
  <ChartContainer title={title} height={height}>
    <Bar 
      options={{ ...defaultOptions, ...options }} 
      data={data} 
    />
  </ChartContainer>
);

/**
 * Pie Chart Component for showing proportions
 * @param {Object} props Component props
 * @param {string} props.title Chart title
 * @param {Object} props.data Chart data object with labels and datasets
 * @param {Object} props.options Chart options (will be merged with defaults)
 * @param {number} props.height Chart height in pixels
 */
export const PieChart = ({ title, data, options = {}, height }) => (
  <ChartContainer title={title} height={height}>
    <Pie 
      options={{ ...defaultOptions, ...options }} 
      data={data} 
    />
  </ChartContainer>
);

/**
 * Doughnut Chart Component (alternative to pie chart)
 * @param {Object} props Component props
 * @param {string} props.title Chart title
 * @param {Object} props.data Chart data object with labels and datasets
 * @param {Object} props.options Chart options (will be merged with defaults)
 * @param {number} props.height Chart height in pixels
 */
export const DoughnutChart = ({ title, data, options = {}, height }) => (
  <ChartContainer title={title} height={height}>
    <Doughnut 
      options={{ ...defaultOptions, ...options }} 
      data={data} 
    />
  </ChartContainer>
);

/**
 * Helper function to create consistent chart data object
 * @param {Array} labels Array of labels
 * @param {Array} datasets Array of dataset objects (value arrays with optional styling)
 * @param {Array} colors Optional array of colors (will use defaults if not provided)
 * @returns {Object} Formatted chart data object
 */
export const createChartData = (labels, datasets, colors = defaultColors) => {
  return {
    labels,
    datasets: datasets.map((dataset, index) => {
      // If the dataset is already formatted, use it as is
      if (dataset.data) {
        return dataset;
      }
      
      // Otherwise, format it with default styling
      const color = colors[index % colors.length];
      return {
        label: dataset.label,
        data: dataset.values,
        backgroundColor: dataset.backgroundColor || color,
        borderColor: dataset.borderColor || color.replace('0.7', '1'),
        borderWidth: dataset.borderWidth || 1,
        ...dataset.options
      };
    })
  };
};

export default {
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
  createChartData
};