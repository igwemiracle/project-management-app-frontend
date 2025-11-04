import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import RecentBoardSkeleton from "../SkeletonLoader/RecentBoardSkeleton";
import { IconButton } from "../UI/IconButton";
import { Clock, Info, Star, X } from "lucide-react";
import {
  fetchRecentlyViewedBoards,
  toggleFavorite
} from "../../store/slices/boardSlice";
import { Board } from "../../types";

interface SearchDropdownProps {
  onClose: () => void;
  showFavorite?: boolean;
  onClick: (boardId: string) => void;
}

export default function SearchDropdown({
  onClose,
  showFavorite = true,
  onClick
}: SearchDropdownProps) {
  const { recentBoards, loading } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRecentlyViewedBoards());
  }, [dispatch]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 👇 Nested component for star toggle logic per board
  const FavoriteButton = ({ board }: { board: Board }) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(!!board.isFavorite);

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = !isFavorite;
      setIsFavorite(newValue);
      dispatch(toggleFavorite({ boardId: board._id, isFavorite: newValue }));
    };

    return (
      <div onClick={handleFavoriteClick}>
        <Star
          className={`w-5 h-5 cursor-pointer transition-colors ${
            isFavorite
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-800 hover:text-yellow-400 fill-none"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="font-bold text-xl z-50 bg-white w-full absolute top-[48px] left-0 right-0 min-h-screen overflow-y-auto">
      <IconButton className="float-right mt-4 mr-3" onClick={onClose}>
        <X size={18} className="text-gray-700 " />
      </IconButton>

      <div className="w-full max-w-[270px] sm:max-w-[300px] md:max-w-[400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start justify-center gap-8 mt-20 mx-auto">
          <h1 className="text-2xl text-gray-800 font-semibold">Search</h1>
          <div className="flex items-center justify-between gap-1 w-full">
            <input
              type="text"
              placeholder="Enter your search keyword"
              className="placeholder:text-gray-400 placeholder:font-medium w-full text-sm rounded-[4px] px-3 border border-gray-400 text-gray-800 py-[8px] placeholder-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <IconButton className="hover:bg-gray-100">
              <Info size={20} className="text-gray-800" />
            </IconButton>
          </div>

          {/* RECENT BOARDS */}
          <h1 className="text-base font-bold leading-tight text-gray-800">
            Recently viewed boards
          </h1>

          {/* RECENT BOARDS LIST */}
          <div className="w-full">
            {loading ? (
              <RecentBoardSkeleton />
            ) : recentBoards.length === 0 ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} />
                  <h1 className="text-lg font-bold leading-tight text-foreground">
                    Recently viewed
                  </h1>
                </div>
                <p className="text-gray-500">No recently viewed boards yet.</p>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {recentBoards.map((board, index) => (
                  <div
                    onClick={() => {
                      if (onClose) onClose(); // Close the modal/page
                      if (onClick) onClick(board._id); // Redirect to the board page
                    }}
                    key={board._id || index}
                    className="flex items-start justify-between gap-3 w-full pl-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${
                            board.color || "#3B82F6"
                          }, ${board.color || "#2563EB"})`
                        }}
                        className="size-6 rounded-sm"
                      ></div>
                      <div className="-mt-1">
                        <p className="text-gray-800 font-medium text-base">
                          {board.title}
                        </p>
                        {/* Display workspace title if available */}
                        <p className="text-gray-700 text-xs font-normal">
                          {typeof board.workspace === "object"
                            ? board.workspace.name || "Personal Workspace"
                            : "Personal Workspace"}
                        </p>
                      </div>
                    </div>

                    {/* Star icon only if showFavorite is true */}
                    {showFavorite && <FavoriteButton board={board} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
