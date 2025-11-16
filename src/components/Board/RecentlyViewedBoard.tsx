import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import {
  fetchRecentlyViewedBoards,
  toggleFavorite
} from "../../store/slices/boardSlice";
import { api } from "../../services/api";
import BoardCard from "./BoardCard";

export default function RecentlyViewedBoard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { recentBoards, loading } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(fetchRecentlyViewedBoards());
  }, [dispatch]);

  // Click on the card (not the star)
  const handleCardClick = async (boardId: string) => {
    try {
      await api.recentlyViewedBoards.addView(boardId);
    } catch (error) {
      console.error("Failed to record view:", error);
    }
    navigate(`/boards/${boardId}`);
  };

  // Click on the star icon
  const handleStarClick = (boardId: string, isFavorite: boolean) => {
    dispatch(toggleFavorite({ boardId, isFavorite: !isFavorite }));
  };

  return (
    <div className="mt-12">
      {loading ? (
        <></>
      ) : recentBoards.length === 0 ? (
        ""
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 ">
            <Clock size={20} />
            <h1 className="text-lg font-bold leading-tight text-foreground">
              Recently viewed boards
            </h1>
          </div>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 xl:gap-x-3 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xs:gap-2">
            {recentBoards.map((board, index) => (
              <BoardCard
                key={board._id}
                board={board}
                index={index}
                onClick={handleCardClick}
                onFavoriteClick={(boardId) =>
                  handleStarClick(boardId, board.isFavorite ?? false)
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
