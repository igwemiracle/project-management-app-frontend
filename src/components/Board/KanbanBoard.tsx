import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Users as UsersIcon } from "lucide-react";
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

  const { currentBoard, boards, lists, cards, loading } = useAppSelector(
    (state) => state.boards
  );
  const activeBoard = boards?.find(
    (b) => b._id?.toString() === boardId?.toString()
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
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleOnBack}
              className="p-2 transition rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <h2>{activeBoard?.title}</h2>
              </h1>
              {currentBoard?.description && (
                <p className="text-sm text-gray-600">
                  {activeBoard?.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {boardOnlineUsers.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50">
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
        <div className="inline-flex min-h-full gap-4 p-6">
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
                className="p-4 bg-white rounded-lg shadow-sm"
              >
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                  autoFocus
                  className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewList(false);
                      setNewListName("");
                    }}
                    className="px-4 py-2 text-gray-600 transition rounded-lg hover:bg-gray-100"
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
                className="flex items-center w-full gap-2 p-4 font-medium text-gray-700 transition bg-white bg-opacity-50 rounded-lg hover:bg-opacity-70"
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
