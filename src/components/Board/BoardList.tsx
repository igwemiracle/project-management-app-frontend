import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Layout, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBoards } from "../../store/slices/boardSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { api } from "../../services/api";
import BoardCard from "./BoardCard";
import CardSkeleton from "../SkeletonLoader/CardSkeleton";

export const BoardList = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useAppDispatch();
  const { boards, loading } = useAppSelector((state) => state.boards);
  const { currentWorkspace } = useAppSelector((state) => state.workspaces);
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleSelect = async (boardId: string) => {
    try {
      await api.recentlyViewedBoards.addView(boardId);
    } catch (error) {
      console.error("Failed to record board view:", error);
    }
    // Navigate to board details page
    navigate(`/boards/${boardId}`);
  };

  const handleOnBack = () => {
    navigate("/");
  };

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchBoards(workspaceId));
    }
  }, [dispatch, workspaceId]);

  return (
    <div className="min-h-screen px-3 py-4 xs:px-4 xs:py-6 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col items-start gap-3 mb-6 xs:gap-4 xs:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center w-full gap-3 sm:w-auto">
            {/* Back Button */}
            <button
              onClick={handleOnBack}
              className="p-2 transition rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 xs:w-6 xs:h-6" />
            </button>

            {/* Workspace Info */}
            <div className="flex-1 min-w-0">
              <h1 className="mb-1 text-2xl font-bold leading-tight text-gray-900 xs:text-3xl sm:text-4xl">
                {currentWorkspace?.name}
              </h1>
              <p className="text-sm text-muted-foreground xs:text-base">
                Manage your boards and projects
              </p>
            </div>
          </div>

          {/* New Board Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("board", { workspaceId })}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-white transition rounded-lg bg-blue-600 hover:bg-blue-700 xs:w-auto xs:px-5 xs:py-2.5 xs:text-base sm:px-6 sm:py-3"
          >
            <Plus className="w-4 h-4 xs:w-5 xs:h-5" />
            New Board
          </motion.button>
        </div>

        {loading ? (
          <div className="grid xl:grid-cols-4 xl:gap-x-1 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 xs:gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !boards || boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center xs:py-12 sm:py-16"
          >
            <Layout className="w-12 h-12 mx-auto mb-3 text-gray-400 xs:w-14 xs:h-14 sm:w-16 sm:h-16 sm:mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700 xs:text-xl">
              No boards yet
            </h3>
            <p className="mb-4 text-sm text-gray-500 xs:text-base xs:mb-6">
              Create your first board to start organizing tasks
            </p>
          </motion.div>
        ) : (
          // Board Grid
          <div className="grid xl:grid-cols-4 xl:gap-x-1 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 xs:gap-2">
            {boards.map((board, index) => (
              <BoardCard
                key={board._id}
                board={board}
                index={index}
                onClick={handleSelect}
                animate={false}
                showFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
