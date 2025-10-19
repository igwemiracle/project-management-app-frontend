import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Layout, ArrowLeft, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBoards, createBoard } from '../../store/slices/boardSlice';
import { CreateBoardModal } from './CreateBoardModal';

interface BoardListProps {
  workspaceId: string;
  onSelectBoard: (boardId: string) => void;
  onBack: () => void;
}

const BOARD_COLORS = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-red-500 to-red-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
];

export const BoardList = ({ workspaceId, onSelectBoard, onBack }: BoardListProps) => {
  const dispatch = useAppDispatch();
  const { boards, loading } = useAppSelector((state) => state.boards);
  const { currentWorkspace } = useAppSelector((state) => state.workspaces);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards(workspaceId));
  }, [dispatch, workspaceId]);

  const handleCreateBoard = async (data: { name: string; description?: string; color?: string }) => {
    await dispatch(createBoard({ ...data, workspace: workspaceId }));
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentWorkspace?.name}</h1>
            <p className="text-gray-600">Manage your boards and projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Board
          </motion.button>
        </div>

        {boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No boards yet</h3>
            <p className="text-gray-500 mb-6">Create your first board to start organizing tasks</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Board
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boards.map((board, index) => {
              const colorClass = BOARD_COLORS[index % BOARD_COLORS.length];
              return (
                <motion.div
                  key={board._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => onSelectBoard(board._id)}
                  className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition cursor-pointer overflow-hidden"
                >
                  <div className={`h-32 bg-gradient-to-br ${colorClass} p-6 flex items-end`}>
                    <h3 className="text-xl font-bold text-white">{board.name}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {board.description || 'No description'}
                    </p>
                  </div>
                  {board.isFavorite && (
                    <div className="absolute top-3 right-3">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </div>
  );
};
