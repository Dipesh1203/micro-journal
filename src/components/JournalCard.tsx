import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from '../utils/dateUtils';
import EmotionBadge from './EmotionBadge';

interface JournalCardProps {
  entry: {
    _id: string;
    content: string;
    detectedEmotion: string;
    date: string;
  };
}

const JournalCard: React.FC<JournalCardProps> = ({ entry }) => {
  const navigate = useNavigate();
  
  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    navigate(`/entries/${entry._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <EmotionBadge emotion={entry.detectedEmotion} />
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(entry.date))}
        </span>
      </div>
      <p className="text-gray-700 mb-2">{truncateContent(entry.content)}</p>
      <div className="text-sm text-gray-500">
        {new Date(entry.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default JournalCard;