import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical } from 'lucide-react';
import { List, Card } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanListProps {
  list: List;
  cards: Card[];
  onCreateCard: (listId: string, title: string) => void;
  onSelectCard: (card: Card) => void;
}

export const KanbanList = ({ list, cards, onCreateCard, onSelectCard }: KanbanListProps) => {
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onCreateCard(list._id, newCardTitle);
    setNewCardTitle('');
    setShowNewCard(false);
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-slate-100 rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold text-gray-900">{list.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{cards.length}</span>
            <button className="p-1 hover:bg-slate-200 rounded transition">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-2 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
          <AnimatePresence>
            {cards
              .sort((a, b) => a.position - b.position)
              .map((card) => (
                <KanbanCard key={card._id} card={card} onClick={() => onSelectCard(card)} />
              ))}
          </AnimatePresence>

          {showNewCard ? (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleCreateCard}
              className="p-2"
            >
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Enter card title..."
                autoFocus
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Add Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCard(false);
                    setNewCardTitle('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewCard(true)}
              className="w-full p-2 text-left text-gray-600 hover:bg-slate-200 rounded-lg transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add a card
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
