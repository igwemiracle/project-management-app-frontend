import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical } from "lucide-react";
import { List, Card } from "../../types";
import { KanbanCard } from "./KanbanCard";
import { ListActionModal } from "../List/ListActionModal";
import { useAppSelector } from "../../store/hooks";
import { COLORS } from "./CreateBoardModal";
import Loader from "../UI/Loader";

interface KanbanListProps {
  list: List;
  cards: Card[];
  onCreateCard: (listId: string, title: string) => void;
  onSelectCard: (card: Card) => void;
}

const isColorDark = (hexColor?: string) => {
  if (!hexColor || !hexColor.startsWith("#")) return false;
  const c = hexColor.substring(1);
  const fullHex =
    c.length === 3
      ? c
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : c;
  const rgb = parseInt(fullHex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // Use relative luminance formula (WCAG standard)
  const luminance =
    0.2126 * (r / 255) ** 2.2 +
    0.7152 * (g / 255) ** 2.2 +
    0.0722 * (b / 255) ** 2.2;

  // Adjust threshold — lower value = darker perceived color
  return luminance < 0.5;
};

export const KanbanList = ({
  list,
  cards,
  onCreateCard,
  onSelectCard
}: KanbanListProps) => {
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showListActionModal, setShowListActionModal] = useState(false);
  const [listColor, setListColor] = useState(list.color || "");
  const isDark = useMemo(() => isColorDark(listColor), [listColor]);
  const currentColor = COLORS.find((c) => c.value === listColor);
  const hoverColor = currentColor ? currentColor.hover : "#CBD5E1";

  const { loading } = useAppSelector((state) => state.auth);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleListColorChange = async (color: string) => {
    try {
      setListColor(color);
      // ✅ Persist color to backend
      const response = await fetch(`${API_BASE_URL}/lists/${list._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ color })
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Failed to update list color:", error);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onCreateCard(list._id, newCardTitle);
    setNewCardTitle("");
    setShowNewCard(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex-shrink-0 mx-auto w-80">
      <div
        style={{ backgroundColor: listColor || "#E2E8F0" }}
        className="relative transition-colors duration-200 rounded-lg"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3
            className={`font-semibold ${
              isDark ? "text-white" : "text-gray-600"
            }`}
          >
            {list.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isDark ? "text-gray-100" : "text-gray-500"
              }`}
            >
              {cards.length}
            </span>
            <button
              onClick={() => setShowListActionModal(true)}
              className={` p-1 rounded transition ${
                isDark ? "hover:bg-slate-200" : ""
              }`}
            >
              <MoreVertical
                className={`w-4 h-4${
                  isDark ? "hover:text-gray-600 text-white " : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-2 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
          <AnimatePresence>
            {cards
              .sort((a, b) => a.position - b.position)
              .map((card) => (
                <KanbanCard
                  key={card._id}
                  card={card}
                  onClick={() => onSelectCard(card)}
                />
              ))}
          </AnimatePresence>

          {showNewCard ? (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleCreateCard}
              className="p-2"
            >
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Enter card title..."
                autoFocus
                rows={3}
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Adding Card..." : "Add Card"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCard(false);
                    setNewCardTitle("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 transition rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewCard(true)}
              className={`w-full p-2 text-left flex items-center gap-2 text-sm rounded-lg transition-colors duration-200 ${
                isDark ? "text-white" : "text-gray-600"
              }`}
              style={{
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  hoverColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <Plus className="w-4 h-4" />
              Add a card
            </motion.button>
          )}
        </div>

        {/* List Action Modal */}
        {showListActionModal && (
          <ListActionModal
            list={list}
            onListActionClose={() => setShowListActionModal(false)}
            onColorChange={handleListColorChange}
          />
        )}
      </div>
    </div>
  );
};
