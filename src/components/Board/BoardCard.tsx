import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";
import { Board } from "../../types";
import { toggleFavorite } from "../../store/slices/boardSlice";
import { useAppDispatch } from "../../store/hooks";

export interface BoardCardProps {
  board: Board;
  index?: number;
  onClick: (boardId: string) => void;
  onFavoriteClick?: (boardId: string) => void;
  animate?: boolean;
  showFavorite?: boolean;
}

const BoardCard = ({
  board,
  index = 0,
  onClick,
  onFavoriteClick,
  animate = true,
  showFavorite = true
}: BoardCardProps) => {
  const CardWrapper = animate ? motion.div : "div";
  const isFavorite = !!board.isFavorite;

  const [hovered, setHovered] = useState(false);
  const dispatch = useAppDispatch();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(board._id);
    } else {
      dispatch(
        toggleFavorite({ boardId: board._id, isFavorite: !board.isFavorite })
      );
    }
  };

  const truncateText = (text: string | undefined, maxLength: number) =>
    text && text.length > maxLength
      ? text.slice(0, maxLength) + "..."
      : text || "";

  return (
    <CardWrapper
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={animate ? { delay: index * 0.1 } : {}}
      whileHover={animate ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={() => onClick(board._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden transition-all bg-white border rounded-lg shadow-sm cursor-pointer xs:rounded-xl hover:shadow-lg hover:border-blue-500/20 xs:w-full xxs:min-w-[10rem]"
    >
      {/* Header */}
      <div
        className="flex items-end lg:p-4 xs:h-16 md:h-20 xs:p-2"
        style={{
          background: `linear-gradient(135deg, ${board.color || "#3B82F6"}, ${
            board.color || "#2563EB"
          })`
        }}
      >
        <h3 className="font-semibold text-white xs:text-base xxs:text-[14px] sm:text-base lg:text-lg">
          {board.title}
        </h3>
      </div>

      {/* Body */}
      <div className="h-10 px-3 md:h-12">
        <p className="lg:text-[14px] xs:text-[12px] sm:text-[16px] text-gray-600 line-clamp-2 py-2">
          {truncateText(board.description, 20)}
        </p>
      </div>

      {/* Favorite Star */}
      {showFavorite && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-2 right-2 xs:top-3 xs:right-3"
          onClick={handleFavoriteClick}
        >
          <Star
            className={`w-5 h-5 cursor-pointer transition-colors ${
              isFavorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-white hover:text-yellow-400 fill-none"
            }`}
          />
        </motion.div>
      )}
    </CardWrapper>
  );
};

export default BoardCard;
