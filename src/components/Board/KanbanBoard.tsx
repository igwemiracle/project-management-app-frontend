import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Users as UsersIcon
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchBoardData,
  createList,
  createCard
} from "../../store/slices/boardSlice";
import { KanbanList } from "./KanbanList";
import { CardDetailModal } from "./CardDetailModal";
import { Card } from "../../types";
import { useNavigate, useParams } from "react-router-dom";

export const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();

  const { currentBoard, lists, cards, loading } = useAppSelector(
    (state) => state.boards
  );
  const { onlineUsers } = useAppSelector((state) => state.realtime);

  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // ✅ Go back to previous page
  const handleOnBack = () => {
    navigate(-1);
  };

  // ✅ Fetch board data if boardId exists
  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardData(boardId));
    }
  }, [dispatch, boardId]);

  // ✅ Create new list safely
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !boardId) return;

    await dispatch(
      createList({
        title: newListName,
        board: boardId,
        position: lists.length
      })
    );

    setNewListName("");
    setShowNewList(false);
  };

  // ✅ Create new card safely
  const handleCreateCard = async (listId: string, title: string) => {
    if (!boardId) return;

    const listCards = cards.filter((c) => c.list === listId);
    await dispatch(
      createCard({
        title,
        listId,
        board: boardId,
        position: listCards.length,
        assignedTo: [],
        labels: [],
        attachments: [],
        dueDate: null
      })
    );
  };

  // ✅ Safely filter users for this board
  const boardOnlineUsers = boardId
    ? onlineUsers.filter((u) => u.boardId === boardId)
    : [];

  // ✅ Show loader when data is being fetched
  if (loading && !currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleOnBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentBoard?.title}
              </h1>
              {currentBoard?.description && (
                <p className="text-sm text-gray-600">
                  {currentBoard.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {boardOnlineUsers.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <UsersIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {boardOnlineUsers.length} online
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-4 p-6 min-h-full">
          {lists.map((list) => (
            <KanbanList
              key={list._id}
              list={list}
              cards={cards.filter(
                (c) => c && c.list && c.list.toString() === list._id.toString()
              )}
              onCreateCard={handleCreateCard}
              onSelectCard={setSelectedCard}
            />
          ))}

          <div className="flex-shrink-0 w-80">
            {showNewList ? (
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleCreateList}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewList(false);
                      setNewListName("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewList(true)}
                className="w-full p-4 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-lg transition flex items-center gap-2 text-gray-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add another list
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};
