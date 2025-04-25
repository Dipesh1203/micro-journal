import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EmotionLineChartProps {
  data: Record<string, Record<string, number>>;
  month: string;
}

const EmotionLineChart: React.FC<EmotionLineChartProps> = ({ data, month }) => {
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'fear', 'surprise'];
  
  // Filter data for the selected month
  const filteredDates = Object.keys(data).filter(date => date.startsWith(month));
  
  // Sort dates chronologically
  filteredDates.sort();
  
  const getEmotionColor = (emotion: string) => {
    const emotionColors = {
      happy: '#10B981',    // green
      sad: '#6366F1',      // indigo
      angry: '#EF4444',    // red
      neutral: '#6B7280',  // gray
      fear: '#8B5CF6',     // purple
      surprise: '#F59E0B', // amber
    };
    
    return emotionColors[emotion as keyof typeof emotionColors] || '#6B7280';
  };
  
  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric' });
  };
  
  const chartData = {
    labels: filteredDates.map(formatDate),
    datasets: emotions.map(emotion => ({
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      data: filteredDates.map(date => data[date]?.[emotion] || 0),
      borderColor: getEmotionColor(emotion),
      backgroundColor: `${getEmotionColor(emotion)}20`,
      borderWidth: 2,
      pointBackgroundColor: getEmotionColor(emotion),
      tension: 0.4,
      fill: false,
    })),
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const index = context[0].dataIndex;
            const date = new Date(filteredDates[index]);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
        }
      }
    },
  };

  return <Line data={chartData} options={options} />;
};

export default EmotionLineChart;