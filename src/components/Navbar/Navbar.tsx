import {
  Search,
  Bell,
  HelpCircle,
  Megaphone,
  WorkflowIcon,
  MoreHorizontal
} from "lucide-react";
import { IconButton } from "../UI/IconButton";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import UserAvatar from "../UserAccount/UserAvatar";
import { useAppSelector } from "../../store/hooks";
import CreateMenu from "../Board/CreateMenu";
import SearchDropdown from "./SearchDropdown";
import { api } from "../../services/api";
import AccountFloatingContainer from "../Common/AccountFloatingContainer";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { recentBoards } = useAppSelector((state) => state.boards);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSelect = async (boardId: string) => {
    try {
      await api.recentlyViewedBoards.addView(boardId);
    } catch (error) {
      console.error("Failed to record view:", error);
    }
    navigate(`/boards/${boardId}`);
  };
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-12 px-4 text-white bg-white border border-b-gray-300">
        {/* Left Section - Logo */}
        <Link to={"/"} className="flex items-center space-x-2">
          <div className="flex items-center justify-center p-1 bg-blue-600 rounded-md">
            <WorkflowIcon size={16} strokeWidth={3} className="text-white" />
          </div>

          <span className="font-semibold text-[15px] tracking-wide text-gray-800">
            Planora
          </span>
        </Link>

        {/* Center Section - Search + Create */}
        <div className="flex justify-center gap-2 items-center w-[65%] 2xl:w-[55%] lg:w-[65%] md:w-[60%] sm:w-[90%] xs:w-[95%]">
          <div className="xs:hidden lg:flex items-center rounded-md w-full px-3 py-[5px] border border-gray-400">
            <Search size={16} className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full text-sm text-gray-300 placeholder-gray-400 bg-transparent focus:outline-none"
            />
          </div>

          <div className="xs:block lg:hidden">
            {!showSearchDropdown && (
              <IconButton onClick={() => setShowSearchDropdown(true)}>
                <Search size={18} className="text-gray-800 " />
              </IconButton>
            )}

            {showSearchDropdown &&
              recentBoards.map((board, index) => (
                <SearchDropdown
                  onClick={handleSelect}
                  key={board._id || index}
                  showFavorite={true}
                  onClose={() => setShowSearchDropdown(false)}
                />
              ))}
          </div>

          {/* Create Button */}
          <div>
            <button
              onClick={() => setShowCreateMenu((prev) => !prev)}
              className=" bg-blue-600 focus:bg-blue-700 text-sm text-white rounded-md px-3 py-[6px]"
            >
              Create
            </button>

            {showCreateMenu && (
              <CreateMenu closeMenu={() => setShowCreateMenu(false)} />
            )}
          </div>
        </div>

        {/* Right Section - Icons & Account */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          {/* Desktop Icons - Hidden on mobile */}
          <div className="items-center hidden gap-1 sm:flex">
            <IconButton>
              <Megaphone size={18} className="text-gray-700" />
            </IconButton>
            <IconButton>
              <Bell size={18} className="text-gray-700" />
            </IconButton>
            <IconButton>
              <HelpCircle size={18} className="text-gray-700" />
            </IconButton>
          </div>

          {/* Account Button - Always visible */}
          <div className="xs:hidden sm:flex">
            <IconButton
              className="-ml-3 cursor-pointer"
              onClick={() => setShowAccountMenu((prev) => !prev)}
            >
              <UserAvatar
                className="w-6 h-6 sm:w-5 sm:h-5 xs:text-[10px] sm:text-[8px]"
                user={user}
              />
            </IconButton>
            {showAccountMenu && (
              <AccountFloatingContainer
                className="w-64 bg-gray-50 rounded-xl right-0 top-[48px]"
                closeMenu={() => setShowAccountMenu(false)}
              />
            )}
          </div>

          {/* Mobile Menu Button - Visible below lg */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="sm:hidden p-1.5 sm:p-2 hover:bg-gray-100 transition-colors  rounded-md"
          >
            <MoreHorizontal
              size={24}
              className="text-gray-800 w-6 h-6 sm:w-5 sm:h-5 xs:text-[10px] sm:text-[8px] transition"
            />
          </button>
        </div>

        {/* Mobile Slide-in Menu */}
        <MobileMenu
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      </nav>
    </>
  );
}
