import { useEffect, useRef, useState } from "react";
import FloatingContainer from "../FloatingContainer";
import { IconButton } from "../UI/IconButton";
import { CircuitBoard, LayoutTemplate } from "lucide-react";
import CreateBoardForm from "./CreateBoardForm";

interface CreateMenuProps {
  closeMenu: () => void;
}

export default function CreateMenu({ closeMenu }: CreateMenuProps) {
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  const items = [
    {
      icon: <CircuitBoard size={18} className="text-gray-300" />,
      title: "Create board",
      description:
        "A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.",
      hasSubmenu: true
    },
    {
      icon: <LayoutTemplate size={18} className="text-gray-300" />,
      title: "Start with a template",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, nesciunt!"
    }
  ];

  return (
    <FloatingContainer className="top-12 right-[21rem] w-[320px]" ref={menuRef}>
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => {
            if (item.hasSubmenu) setShowBoardForm(true);
          }}
          className="hover:bg-[#34363a] w-full px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <IconButton className="hover:bg-[#35393d]">{item.icon}</IconButton>
            <span>{item.title}</span>
          </div>
          <p className="text-xs">{item.description}</p>
        </div>
      ))}

      {/* ✅ Nested FloatingContainer */}
      {showBoardForm && (
        <CreateBoardForm
          onBack={() => {
            setShowBoardForm(false);
            setShowMenu(true);
          }}
          onClose={closeMenu}
        />
      )}
    </FloatingContainer>
  );
}
