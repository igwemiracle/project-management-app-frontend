import { ArrowLeft, LogOut, Users } from "lucide-react";
import FloatingContainer from "../Common/FloatingContainer";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useModal } from "../../context/ModalContext";
import UserAvatar from "../UserAccount/UserAvatar";
import {
  getStoredAccounts,
  removeAccountFromStorage,
  STORAGE_KEY
} from "../../utils/storage";
import { IconButton } from "../UI/IconButton";

interface CreateAccountMenuProps {
  closeMenu: () => void;
  onClose?: () => void;
  className?: string;
}

export default function AccountFloatingContainer({
  closeMenu,
  className
}: CreateAccountMenuProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { openModal } = useModal();

  useEffect(() => {
    // Trigger open animation
    setTimeout(() => setIsOpening(true), 10);
  }, [closeMenu]);

  // ✅ Detect clicks outside of this container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

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

  const flatUser = user;

  return (
    <>
      <FloatingContainer
        ref={menuRef}
        className={`absolute z-50 shadow-lg transform transition-transform duration-500 ease-in-out w-72
        ${isOpening ? "translate-x-0" : "translate-x-[100%]"} 
        ${className}`}
      >
        <div className="w-full px-4 py-6 space-y-3 text-gray-200 bg-white shadow-lg rounded-b-xl">
          <IconButton className="-ml-3 hover:bg-gray-100">
            <ArrowLeft
              size={18}
              className="text-gray-600"
              onClick={closeMenu}
            />
          </IconButton>

          <div>
            <h2 className="mb-3 text-[12px] lg:text-sm font-semibold text-gray-600">
              ACCOUNT
            </h2>
            {user && (
              <div className="flex items-center gap-2 mb-2">
                <UserAvatar className="xs:size-7 text-[12px]" user={flatUser} />
                <div>
                  <p className="font-medium xs:text-[14px] text-gray-800 lg:text-sm">
                    {flatUser?.fullName}
                  </p>
                  <p className="xs:text-[12px] lg:text-sm text-gray-600">
                    {flatUser?.email}
                  </p>
                </div>
              </div>
            )}
            <ul className="text-[14px] text-gray-800">
              <li
                onClick={() => navigate("/switch-accounts")}
                className="px-3 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                Switch accounts
              </li>
              <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                Manage account
              </li>
            </ul>
          </div>

          <hr className="border-gray-300" />

          <div>
            <h2 className="mb-3 xs:text-[12px] lg:text-sm font-semibold text-gray-600">
              PLANORA
            </h2>
            <ul className="text-[14px] text-gray-800">
              <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                Profile and visibility
              </li>
              <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                Activity
              </li>
              <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                Cards
              </li>
              <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                Settings
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                <span>Theme</span>
                <span className="text-gray-400">›</span>
              </li>
            </ul>
          </div>
          <hr className="border-gray-300" />
          <div
            onClick={() => {
              openModal("workspace");
              closeMenu();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <span>
              <Users size={18} className="text-black" />
            </span>
            <span className="text-[14px] text-gray-800">Create Workspace</span>
          </div>

          <hr className="border-gray-300" />

          <ul className="text-[14px] text-gray-800">
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
              Help
            </li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
              Shortcuts
            </li>
          </ul>

          <hr className="border-gray-300" />

          <div
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <LogOut size={18} />
            <p className="text-[14px]">Log out</p>
          </div>
        </div>
      </FloatingContainer>
    </>
  );
}
