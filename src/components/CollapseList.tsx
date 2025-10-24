import React, { useState } from "react";

interface CollapseItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface CollapseListProps {
  items: CollapseItem[];
}

const CollapseList: React.FC<CollapseListProps> = ({ items }) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItemId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-md mb-2">
          <button
            className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
            onClick={() => toggleItem(item.id)}
            aria-expanded={openItemId === item.id}
            aria-controls={`collapse-content-${item.id}`}
          >
            <span>{item.title}</span>
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ease-in-out ${
                openItemId === item.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div
            id={`collapse-content-${item.id}`}
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
              openItemId === item.id ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="p-4 border-t border-gray-200 bg-white">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollapseList;
