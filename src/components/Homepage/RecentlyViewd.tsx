import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { fetchRecentlyViewedBoards } from "../../store/slices/boardSlice";
import { api } from "../../services/api";
import BoardCard from "../Board/BoardCard";
import CardSkeleton from "../SkeletonLoader/CardSkeleton";

export default function RecentlyViewed() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { recentBoards, loading } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(fetchRecentlyViewedBoards());
  }, [dispatch]);

  const handleSelect = async (boardId: string) => {
    try {
      await api.recentlyViewedBoards.addView(boardId);
    } catch (error) {
      console.error("Failed to record view:", error);
    }
    navigate(`/boards/${boardId}`);
  };

  return (
    <div className="">
      <div className="">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} />
          <h1 className="text-lg font-bold leading-tight text-foreground">
            Recently viewed
          </h1>
        </div>

        {loading ? (
          <div className="grid xl:grid-cols-4 xl:gap-x-1 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 xs:gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : recentBoards.length === 0 ? (
          <p className="text-gray-500">No recently viewed boards yet.</p>
        ) : (
          <div className="grid xl:grid-cols-4 xl:gap-x-1 lg:grid-cols-3 xs:grid-cols-1 xs:gap-y-3 xxs:grid-cols-2 sm:grid-cols-2 xs:gap-2">
            {recentBoards.map((board, index) => (
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
}
