import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../Board/CreateBoardModal";

interface CreateListActionModal {
  list: any;
  onListActionClose: () => void;
  onColorChange: (color: string) => void;
}

export const ListActionModal = ({
  onListActionClose,
  onColorChange
}: CreateListActionModal) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [isColorSectionOpen, setIsColorSectionOpen] = useState(true);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div onClick={onListActionClose} className="inset-0 z-40 bg-transparent">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 -right-[17.5rem] z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 space-y-5 text-gray-800 border border-gray-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h4 className="text-lg font-semibold text-gray-700">List Actions</h4>
          <button
            className="hover:bg-gray-100 p-1 rounded-full transition"
            onClick={onListActionClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Action List */}
        <ul className="space-y-1 text-[15px]">
          {["Add card", "Copy list", "Move list", "Watch"].map((action) => (
            <li
              key={action}
              className="px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition flex items-center justify-between"
            >
              <span>{action}</span>
            </li>
          ))}
        </ul>

        {/* Change Color Section */}
        <div className="border-t border-b py-3 space-y-3">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsColorSectionOpen(!isColorSectionOpen);
            }}
          >
            <p className="text-[14px] font-medium text-gray-700">
              Change list color
            </p>
            {isColorSectionOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </div>

          {/* Collapsible content */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isColorSectionOpen
                ? "max-h-48 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-6 gap-3 mt-4 mx-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-full aspect-square rounded-md transition transform ${
                    selectedColor === color.value
                      ? "ring-2 ring-blue-500 ring-offset-2 scale-110"
                      : "hover:scale-110 hover:ring-2 hover:ring-gray-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>

            <button
              className="mt-4 w-full py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm font-medium"
              onClick={() => handleColorSelect("")}
            >
              Remove color
            </button>
          </div>
        </div>

        {/* Archive List */}
        <button className="w-full px-4 py-2 rounded-lg text-left hover:bg-red-50 text-red-600 font-medium transition">
          Archive list
        </button>
      </div>
    </div>
  );
};
