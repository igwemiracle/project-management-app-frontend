import { ArrowLeft, LogOut, Users } from "lucide-react";
import FloatingContainer from "../FloatingContainer";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useModal } from "../../context/ModalContext";
import UserAvatar from "../Auth/UserAvatar";
import {
  getStoredAccounts,
  removeAccountFromStorage,
  STORAGE_KEY
} from "../../utils/storage";
import { IconButton } from "../UI/IconButton";

interface CreateAccountMenuProps {
  closeMenu: () => void;
  onClose?: () => void;
}

export default function AccountFloatingContainer({
  closeMenu
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
      {/* <div
        className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity duration-500 ease-in-out `}
        onClick={() => setIsOpening(false)}
      /> */}
      <FloatingContainer
        ref={menuRef}
        className={`top-0 left-0 w-full h-full z-50 transform transition-transform duration-500 ease-in-out ${
          isOpening ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full px-4 py-6 space-y-3 text-gray-200 shadow-lg rounded-b-xl bg-white">
          <IconButton className="hover:bg-gray-100 -ml-3">
            <ArrowLeft size={18} className="text-black" onClick={closeMenu} />
          </IconButton>

          <div>
            <h2 className="mb-3 text-[12px] lg:text-sm font-semibold text-gray-600">
              ACCOUNT
            </h2>
            {user && (
              <div className="flex items-center gap-2 mb-2">
                <UserAvatar className="xs:size-7 text-[12px]" user={flatUser} />
                <div>
                  <p className="font-medium xs:text-[13px] text-gray-800 lg:text-sm">
                    {flatUser?.fullName}
                  </p>
                  <p className="xs:text-[11px] lg:text-sm text-gray-700">
                    {flatUser?.email}
                  </p>
                </div>
              </div>
            )}
            <ul className="text-[14px] text-gray-800">
              <li
                onClick={() => navigate("/switch-accounts")}
                className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200"
              >
                Switch accounts
              </li>
              <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
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
              <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                Profile and visibility
              </li>
              <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                Activity
              </li>
              <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                Cards
              </li>
              <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                Settings
              </li>
              <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer flex justify-between items-center">
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
            className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
          >
            <span>
              <Users size={18} className="text-black" />
            </span>
            <span className="text-[14px] text-gray-800">Create Workspace</span>
          </div>

          <hr className="border-gray-300" />

          <ul className="text-[14px] text-gray-800">
            <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Help
            </li>
            <li className="hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Shortcuts
            </li>
          </ul>

          <hr className="border-gray-300" />

          <div
            onClick={handleLogout}
            className="hover:bg-gray-100 text-gray-800 px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
          >
            <LogOut size={18} />
            <p className="text-[14px]">Log out</p>
          </div>
        </div>
      </FloatingContainer>
    </>
  );
}
