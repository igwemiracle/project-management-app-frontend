import { Users } from "lucide-react";
import FloatingContainer from "../FloatingContainer";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { useModal } from "../../context/ModalContext";

interface CreateAccountMenuProps {
  closeMenu: () => void;
}

export default function AccountFloatingContainer({
  closeMenu
}: CreateAccountMenuProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { openModal } = useModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <FloatingContainer className="right-0 top-12 w-[310px]" ref={menuRef}>
      <div className="w-full text-gray-200 rounded-b-xl shadow-lg space-y-3 p-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">ACCOUNT</h2>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
              IN
            </div>
            <div>
              <p className="font-medium">Igwe Miracle Nzube</p>
              <p className="text-sm text-gray-400">
                igwemiraclenszube@gmail.com
              </p>
            </div>
          </div>
          <ul className="">
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Switch accounts
            </li>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Manage account
            </li>
          </ul>
        </div>

        <hr className="border-gray-700" />

        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">PLANORA</h2>
          <ul>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Profile and visibility
            </li>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Activity
            </li>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Cards
            </li>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Settings
            </li>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer flex justify-between items-center">
              <span>Theme</span>
              <span className="text-gray-400">›</span>
            </li>
          </ul>
        </div>
        <hr className="border-gray-700" />
        <div
          onClick={() => openModal("workspace")}
          className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
        >
          <span>
            <Users size={18} />
          </span>
          <span>Create Workspace</span>
        </div>

        <hr className="border-gray-700" />

        <ul className="">
          <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
            Help
          </li>
          <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
            Shortcuts
          </li>
        </ul>

        <hr className="border-gray-700" />

        <div
          onClick={handleLogout}
          className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer"
        >
          Log out
        </div>
      </div>
    </FloatingContainer>
  );
}
