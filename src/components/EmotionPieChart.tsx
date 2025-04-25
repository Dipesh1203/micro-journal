import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmotionPieChartProps {
  data: Record<string, number>;
}

const EmotionPieChart: React.FC<EmotionPieChartProps> = ({ data }) => {
  const emotions = Object.keys(data);
  
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
  
  const chartData = {
    labels: emotions.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    datasets: [
      {
        data: emotions.map(emotion => data[emotion]),
        backgroundColor: emotions.map(emotion => getEmotionColor(emotion)),
        borderColor: emotions.map(emotion => getEmotionColor(emotion)),
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default EmotionPieChart;