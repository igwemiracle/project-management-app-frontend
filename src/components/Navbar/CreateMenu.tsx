import { useEffect, useRef, useState } from "react";
import FloatingContainer from "../FloatingContainer";
import { IconButton } from "../UI/IconButton";
import { CircuitBoard, LayoutTemplate } from "lucide-react";
import CreateBoardForm from "./CreateBoardForm";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createBoard } from "../../store/slices/boardSlice";
import { useNavigate } from "react-router-dom";

interface CreateMenuProps {
  closeMenu: () => void;
}

export default function CreateMenu({ closeMenu }: CreateMenuProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { workspaces } = useAppSelector((state) => state.workspaces);
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
    <FloatingContainer className="top-12 w-[320px] bg-[#2c2f33]" ref={menuRef}>
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
          className="bg-[#2c2f33] w-full text-white"
          onBack={() => {
            setShowBoardForm(false);
            setShowMenu(true);
          }}
          onClose={closeMenu}
          onCreate={async (data) => {
            const workspace = workspaces.find(
              (w) => w.name === data.workspaceName
            );

            if (!workspace?._id) {
              console.error("Invalid workspace selected");
              return;
            }

            try {
              // ✅ Dispatch and unwrap the promise to get the actual created board
              const resultAction = await dispatch(
                createBoard({
                  title: data.title,
                  workspaceId: workspace._id,
                  description: data.description,
                  color: data.color
                })
              );

              // ✅ If your createBoard thunk returns { board: {...} }
              const createdBoard = resultAction.payload;

              if (createdBoard?._id) {
                navigate(`/boards/${createdBoard._id}`);
              } else {
                console.error("Board created but ID missing:", createdBoard);
              }
            } catch (error) {
              console.error("Failed to create board:", error);
            }
          }}
        />
      )}
    </FloatingContainer>
  );
}
