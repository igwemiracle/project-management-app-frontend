import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Layout, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBoards, toggleFavorite } from "../../store/slices/boardSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { api } from "../../services/api";
import BoardCard from "./BoardCard";
import CardSkeleton from "../SkeletonLoader/CardSkeleton";

export const BoardList = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useAppDispatch();
  const { boards, loading } = useAppSelector((state) => state.boards);
  const { workspaces } = useAppSelector((state) => state.workspaces);
  const navigate = useNavigate();
  const { openModal } = useModal();

  // ✅ Local state for immediate star toggle feedback
  const [localBoards, setLocalBoards] = useState(boards);

  const activeWorkspace = workspaces?.find(
    (w) => w._id?.toString() === workspaceId?.toString()
  );

  // Sync localBoards whenever Redux boards change
  useEffect(() => {
    setLocalBoards(boards);
  }, [boards]);

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchBoards(workspaceId));
    }
  }, [dispatch, workspaceId]);

  const handleCardClick = async (boardId: string) => {
    try {
      await api.recentlyViewedBoards.addView(boardId);
    } catch (error) {
      console.error("Failed to record view:", error);
    }
    navigate(`/boards/${boardId}`);
  };

  // Click on the star icon
  const handleStarClick = (boardId: string) => {
    setLocalBoards((prev) =>
      prev.map((b) =>
        b._id === boardId ? { ...b, isFavorite: !b.isFavorite } : b
      )
    );

    // 2️⃣ Update Redux (keeps other components in sync)
    const currentFavorite = boards.find((b) => b._id === boardId)?.isFavorite;
    dispatch(toggleFavorite({ boardId, isFavorite: !currentFavorite }));
  };

  const handleOnBack = () => {
    navigate("/");
  };

  return (
    // <div className="min-h-screen px-3 py-4 sm:mt-10 xs:px-4 xs:py-6 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="min-h-screen py-4 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="flex xs:flex-col sm:flex-row items-start justify-between mt-6 w-auto px-3 py-4  bg-white">
        <div className="flex items-center justify-center xs:gap-1 gap-4">
          <button
            onClick={handleOnBack}
            className="p-2 transition rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 lg:text-2xl">
              {activeWorkspace?.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex justify-between my-6 w-[95%] max-w-7xl mx-auto">
        <div></div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal("board", { workspaceId })}
          // className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-white transition rounded-lg bg-blue-600 hover:bg-blue-700 xs:w-auto xs:px-5 xs:py-2.5 xs:text-base sm:px-6 sm:py-3"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white transition rounded-lg bg-blue-600 hover:bg-blue-700 w-auto  float-right"
        >
          <Plus className="w-4 h-4 xs:w-5 xs:h-5" />
          New Board
        </motion.button>
      </div>

      <div className="w-[95%] mx-auto max-w-7xl">
        {loading ? (
          <div className=" grid xl:grid-cols-4 xl:gap-x-1 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 xs:gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !localBoards || localBoards.length === 0 ? (
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
          <div className="grid xl:grid-cols-4 xl:gap-x-1 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 xs:gap-2">
            {localBoards.map((board, index) => (
              <BoardCard
                key={board._id}
                board={board}
                index={index}
                onClick={handleCardClick}
                onFavoriteClick={handleStarClick}
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
