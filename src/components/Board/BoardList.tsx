import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Layout, ArrowLeft, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBoards } from "../../store/slices/boardSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/ModalContext";

export const BoardList = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useAppDispatch();
  const { boards, loading } = useAppSelector((state) => state.boards);
  const { currentWorkspace } = useAppSelector((state) => state.workspaces);
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleOnSelectBoard = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  const handleOnBack = () => {
    navigate("/workspaces");
  };

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchBoards(workspaceId));
    }
  }, [dispatch, workspaceId]);

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
            onClick={handleOnBack}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {currentWorkspace?.name}
            </h1>
            <p className="text-gray-600">Manage your boards and projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("board", { workspaceId })}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Board
          </motion.button>
        </div>

        {!boards || boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No boards yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first board to start organizing tasks
            </p>
            <button
              onClick={() => openModal("board", { workspaceId })}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Board
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boards.map((board, index) => {
              return (
                <motion.div
                  key={board._id || `board-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => handleOnSelectBoard(board._id)}
                  className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition cursor-pointer overflow-hidden"
                >
                  <div
                    className="h-32 p-6 flex items-end"
                    style={{
                      background: `linear-gradient(135deg, ${
                        board.color || "#3B82F6"
                      }, ${board.color || "#2563EB"})`
                    }}
                  >
                    <h3 className="text-xl font-bold text-white">
                      {board.title}
                    </h3>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {board.description || "No description"}
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
    </div>
  );
};
