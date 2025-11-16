import { Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import BoardCard from "./BoardCard";
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

  // Click on the card itself (NOT the star)
  const handleCardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  // Click on the star icon
  const handleStarClick = (boardId: string) => {
    dispatch(toggleFavorite({ boardId, isFavorite: false }));
  };

  return (
    <div className="mt-20">
      {loading ? (
        <></>
      ) : starredBoards.length === 0 ? (
        ""
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 ">
            <Star size={20} />
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
                onClick={handleCardClick}
                onFavoriteClick={handleStarClick}
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
