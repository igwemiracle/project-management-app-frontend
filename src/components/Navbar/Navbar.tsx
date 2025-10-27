import {
  Search,
  Bell,
  HelpCircle,
  Megaphone,
  WorkflowIcon
} from "lucide-react";
import { IconButton } from "../UI/IconButton";
import CreateMenu from "./CreateMenu";
import { useState } from "react";
import AccountFloatingContainer from "./AccountFloatingContainer";
import { Link } from "react-router-dom";
import UserAvatar from "../Auth/UserAvatar";
import { useAppSelector } from "../../store/hooks";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <nav className="bg-[#1D2125] h-12 flex items-center justify-between px-4 text-white relative w-screen">
      {/* Left Section - Logo */}
      <Link to={"/"} className="flex items-center space-x-2">
        <WorkflowIcon size={22} className="text-blue-400" />
        <span className="font-semibold text-[15px] tracking-wide text-gray-100">
          Planora
        </span>
      </Link>

      {/* Center Section - Search + Create */}
      <div className="flex gap-2 items-center w-[40%]">
        <div className="flex items-center bg-[#2C2F33] rounded-md w-full px-3 py-[5px] border border-[#3A3F44]">
          <Search size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-sm text-gray-300 placeholder-gray-400 bg-transparent focus:outline-none"
          />
        </div>

        {/* Create Button */}
        <div>
          <button
            onClick={() => setShowCreateMenu((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-sm text-gray-800 rounded-md px-3 py-[6px]"
          >
            Create
          </button>

          {showCreateMenu && (
            <CreateMenu closeMenu={() => setShowCreateMenu(false)} />
          )}
        </div>
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center space-x-2">
        <IconButton>
          <Megaphone size={18} className="text-gray-300" />
        </IconButton>
        <IconButton>
          <Bell size={18} className="text-gray-300" />
        </IconButton>
        <IconButton>
          <HelpCircle size={18} className="text-gray-300" />
        </IconButton>

        <IconButton
          className="cursor-pointer"
          onClick={() => setShowAccountMenu((prev) => !prev)}
        >
          <UserAvatar className="w-5 h-5 text-[9px]" user={user} />
        </IconButton>
        {showAccountMenu && (
          <AccountFloatingContainer
            closeMenu={() => setShowAccountMenu(false)}
          />
        )}
      </div>
    </nav>
  );
}
