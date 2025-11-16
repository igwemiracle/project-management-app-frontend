import { useEffect, useState, useRef } from "react";
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
import ListSkeleton from "../SkeletonLoader/ListSkeleton";
import Loader from "../UI/Loader";
import Input from "../UI/Input";

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

  const [creatingList, setCreatingList] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardData(boardId));
    }
  }, [dispatch, boardId]);

  useEffect(() => {
    if (!loading) {
      setInitialLoading(false);
    }
  }, [loading]);

  // go back
  const handleOnBack = () => {
    navigate(-1);
  };

  // ✅ HANDLE CREATING NEW LISTS
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !boardId || creatingList) return;

    setCreatingList(true);

    try {
      await dispatch(
        createList({
          title: newListName,
          board: boardId,
          position: lists.length
        })
      ).unwrap();

      setNewListName("");
      setShowNewList(false);
    } catch (error) {
      console.error("Failed to create list:", error);
    } finally {
      // reset after creation completes
      setCreatingList(false);
    }
  };

  // ✅ CREATE CARD
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

  // filter online users for the board
  const boardOnlineUsers = boardId
    ? onlineUsers.filter((u) => u.boardId === boardId)
    : [];

  //✅ SHOW FULL-SCREEN LOADER ONLY DURING INITIAL PAGE LOAD
  if (initialLoading) {
    return <Loader />;
  }

  if (!currentBoard) {
    return <ListSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="px-6 py-4 mt-12 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleOnBack}
              className="p-2 transition rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900 lg:text-2xl">
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
                <Input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                  autoFocus
                  disabled={creatingList}
                  className="pl-4 text-base mb-2"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={creatingList}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {creatingList ? "Adding..." : "Add List"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!creatingList) {
                        setShowNewList(false);
                        setNewListName("");
                      }
                    }}
                    disabled={creatingList}
                    className="px-4 py-2 text-gray-600 transition rounded-lg hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
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
