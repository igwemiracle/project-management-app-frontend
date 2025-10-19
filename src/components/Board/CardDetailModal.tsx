import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MessageSquare, Paperclip, Tag } from 'lucide-react';
import { Card, Comment } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateCard, deleteCard } from '../../store/slices/boardSlice';
import { api } from '../../services/api';

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
}

export const CardDetailModal = ({ card, onClose }: CardDetailModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [description, setDescription] = useState(card.description || '');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    loadComments();
  }, [card._id]);

  const loadComments = async () => {
    try {
      const data = await api.comments.getAll(card._id);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleUpdateDescription = async () => {
    await dispatch(updateCard({ id: card._id, data: { description } }));
    setIsEditingDescription(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.comments.create({ content: newComment, card: card._id });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteCard = async () => {
    if (confirm('Are you sure you want to delete this card?')) {
      await dispatch(deleteCard(card._id));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h2>
              <p className="text-sm text-gray-500">
                Created {new Date(card.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Description</h3>
                  </div>
                  {isEditingDescription ? (
                    <div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleUpdateDescription}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingDescription(false);
                            setDescription(card.description || '');
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition min-h-[100px]"
                    >
                      {description || (
                        <span className="text-gray-400">Click to add description...</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Comments</h3>
                  </div>

                  <form onSubmit={handleAddComment} className="mb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Add Comment
                    </button>
                  </form>

                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                            {comment.user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{comment.user.username}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Add to card</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm">
                      <User className="w-4 h-4" />
                      Members
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm">
                      <Tag className="w-4 h-4" />
                      Labels
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm">
                      <Paperclip className="w-4 h-4" />
                      Attachment
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                  <button
                    onClick={handleDeleteCard}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition text-sm"
                  >
                    Delete Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
