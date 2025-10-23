import { ChevronDown, ChevronUp, X } from "lucide-react";
import React, { useState } from "react";
import { COLORS } from "../Board/CreateBoardModal";

interface CreateListActionModal {
  list: any;
  onListActionClose: () => void;
  onColorChange: (color: string) => void;
}

export const ListActionModal = ({
  list,
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
    <div onClick={onListActionClose} className="">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md absolute top-12 -right-[17.5rem] z-50 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <div></div>
          <h4>List actions</h4>
          <button className="transition pr-2" onClick={onListActionClose}>
            <X />
          </button>
        </div>

        {/* List actions */}
        <ul className="w-full overflow-auto space-y-1">
          <li className="block w-full hover:bg-gray-400 cursor-pointer px-4 py-[4px]">
            Add card
          </li>
          <li className="block w-full hover:bg-gray-400 cursor-pointer px-4 py-[4px]">
            Copy list
          </li>
          <li className="block w-full hover:bg-gray-400 cursor-pointer px-4 py-[4px]">
            Move list
          </li>
          <li className="block w-full hover:bg-gray-400 cursor-pointer px-4 py-[4px]">
            Watch
          </li>
        </ul>

        {/* Change color list (collapsible section) */}
        <div className="border-t border-b py-4 space-y-2 mx-auto w-[90%]">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsColorSectionOpen(!isColorSectionOpen);
            }}
          >
            <p className="text-[12px] font-medium">Change list color</p>
            {isColorSectionOpen ? <ChevronUp /> : <ChevronDown />}
          </div>

          {/* Collapsible content */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isColorSectionOpen
                ? "max-h-40 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-6 gap-3 w-full">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-full aspect-square rounded-lg transition ${
                    selectedColor === color.value
                      ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>

            <button
              className="bg-gray-400 py-2 w-full mt-3"
              onClick={() => handleColorSelect("")}
            >
              Remove color
            </button>
          </div>
        </div>

        <h4 className="block w-full hover:bg-gray-400 cursor-pointer px-4 py-2">
          Archive list
        </h4>
      </div>
    </div>
  );
};
