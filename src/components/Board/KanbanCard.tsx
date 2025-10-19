import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Card } from '../../types';

interface KanbanCardProps {
  card: Card;
  onClick: () => void;
}

export const KanbanCard = ({ card, onClick }: KanbanCardProps) => {
  const hasDetails =
    card.description || card.dueDate || card.assignedTo.length > 0 || card.attachments.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer p-3"
    >
      <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>

      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {hasDetails && (
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
          {card.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{new Date(card.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {card.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-4 h-4" />
              <span className="text-xs">{card.attachments.length}</span>
            </div>
          )}
        </div>
      )}

      {card.assignedTo && card.assignedTo.length > 0 && (
        <div className="flex -space-x-2 mt-2">
          {card.assignedTo.slice(0, 3).map((userId, index) => (
            <div
              key={userId}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
            >
              {index + 1}
            </div>
          ))}
          {card.assignedTo.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
              +{card.assignedTo.length - 3}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
