import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Input from "../UI/Input";

interface CreateBoardModalProps {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    color?: string;
  }) => Promise<void> | void;
}

export const COLORS = [
  { name: "Blue", value: "#3B82F6", hover: "#60A5FA" },
  { name: "Green", value: "#10B981", hover: "#34D399" },
  { name: "Orange", value: "#F97316", hover: "#FB923C" },
  { name: "Red", value: "#EF4444", hover: "#F87171" },
  { name: "Pink", value: "#EC4899", hover: "#F472B6" },
  { name: "Teal", value: "#14B8A6", hover: "#2DD4BF" }
];

export const CreateBoardModal = ({
  onClose,
  onCreate
}: CreateBoardModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: COLORS[0].value
  });

  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await onCreate(formData);
    } catch (error) {
      console.error("Failed to create board:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const inputsDisabled = loading;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[black] bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md bg-white shadow-2xl rounded-xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Create Board</h2>
            <button
              onClick={onClose}
              className="p-2 transition rounded-lg hover:bg-gray-100"
              aria-label="Close create board modal"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Board Name
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={inputsDisabled}
                className="pl-4 placeholder:text-base"
                placeholder="Project Board"
                aria-disabled={inputsDisabled}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                disabled={inputsDisabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="What's this board for?"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Board Color
              </label>
              <div className="grid grid-cols-6 gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      !inputsDisabled &&
                      setFormData({ ...formData, color: color.value })
                    }
                    className={`w-full aspect-square rounded-lg transition ${
                      formData.color === color.value
                        ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name}`}
                    disabled={inputsDisabled}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-busy={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
