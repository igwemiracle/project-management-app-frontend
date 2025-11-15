import { Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import BoardCard from "../Board/BoardCard";
import CardSkeleton from "../SkeletonLoader/CardSkeleton";
import {
  fetchStarredBoards,
  toggleFavorite
} from "../../store/slices/boardSlice";
import { useNavigate } from "react-router-dom";

export default function StarredBoards() {
  const dispatch = useAppDispatch();
  const { starredBoards, loading } = useAppSelector((state) => state.boards);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchStarredBoards());
  }, [dispatch]);

  const handleStarClick = async (
    boardId: string,
    isCurrentlyFavorite: boolean
  ) => {
    try {
      // Toggle favorite status
      const updatedBoard = await dispatch(
        toggleFavorite({ boardId, isFavorite: !isCurrentlyFavorite })
      ).unwrap(); // unwrap gets the fulfilled payload directly

      // Optionally, you could update local state here if needed,
      // but our slice already updates both starredBoards and recentBoards
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="mt-20">
      {loading ? (
        <>
          <div className="flex items-center gap-2 mb-4 ">
            <Clock size={20} />
            <h1 className="text-lg font-bold leading-tight text-foreground">
              Starred boards
            </h1>
          </div>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 xl:gap-x-3 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xs:gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : starredBoards.length === 0 ? (
        <p className="text-gray-500">No starred boards yet.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 ">
            <Clock size={20} />{" "}
            <h1 className="text-lg font-bold leading-tight text-foreground">
              Starred boards
            </h1>
          </div>

          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 xl:gap-x-3 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xs:gap-2">
            {starredBoards.map((board, index) => (
              <BoardCard
                key={board._id}
                board={board}
                index={index}
                onClick={() =>
                  handleStarClick(board._id, board.isFavorite ?? false)
                }
                animate={false}
                showFavorite={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
