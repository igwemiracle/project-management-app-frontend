import { Megaphone, Bell, HelpCircle, Info, LogOut } from "lucide-react";
import { IconButton } from "../UI/IconButton";
import UserAvatar from "../UserAccount/UserAvatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";
import {
  getStoredAccounts,
  removeAccountFromStorage,
  STORAGE_KEY
} from "../../utils/storage";
import { getProfile, logout, logoutUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AccountFloatingContainer from "../Common/AccountFloatingContainer";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const { accounts, currentAccount } = getStoredAccounts();

      // Normalize current account id
      const normalizeId = (acc: any) =>
        acc?._id || acc?.id || acc?.user?.id || acc?.user?._id;

      if (accounts.length > 1) {
        const curId = normalizeId(currentAccount);
        if (curId) {
          removeAccountFromStorage(curId.toString());
        }

        try {
          await dispatch(getProfile()).unwrap();
        } catch (e) {
          console.warn("getProfile after local removal failed:", e);
        }
        navigate("/switch-accounts");
      } else {
        await dispatch(logoutUser()).unwrap();
        localStorage.removeItem(STORAGE_KEY);
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      {/* Backdrop with fade effect */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div
        className={`fixed top-[48px] right-0 w-64 bg-white z-50 shadow-up-down transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200">
          {/* Search (Mobile) */}
          <input
            type="text"
            placeholder="Search"
            className="w-full text-sm rounded-[4px] px-3 border border-gray-600 text-gray-800 py-[6px] placeholder-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <IconButton onClick={onClose} className="hover:bg-gray-100">
            <Info size={20} className="text-gray-800" />
          </IconButton>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 ">
          <div className="">
            <button
              onClick={() => setShowAccountMenu((prev) => !prev)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
            >
              {user && (
                <UserAvatar
                  className="xs:size-5 xxs:size-6 text-[10px]"
                  user={user}
                />
              )}
              <span className="text-sm text-gray-800">Account</span>
            </button>
            {showAccountMenu && (
              <AccountFloatingContainer
                className="top-0 left-0 right-0 w-full"
                closeMenu={() => setShowAccountMenu(false)}
              />
            )}
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left">
            <Megaphone size={18} className="text-gray-900" />
            <span className="text-sm text-gray-800">Announcements</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left">
            <Bell size={18} className="text-gray-900" />
            <span className="text-sm text-gray-800">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left">
            <HelpCircle size={18} className="text-gray-900" />
            <span className="text-sm text-gray-800">Help</span>
          </button>
          <hr className="mt-5 text-gray-200" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
          >
            <LogOut size={18} className="text-gray-900" />
            <span className="text-sm text-gray-800">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
