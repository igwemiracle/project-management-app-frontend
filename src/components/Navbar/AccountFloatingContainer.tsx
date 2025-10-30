import { Users } from "lucide-react";
import FloatingContainer from "../FloatingContainer";
import { useEffect, useRef } from "react";
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

interface CreateAccountMenuProps {
  closeMenu: () => void;
}

export default function AccountFloatingContainer({
  closeMenu
}: CreateAccountMenuProps) {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
    <FloatingContainer
      className="xs:-right-[57px] lg:-right-4 top-[42px] w-[310px]"
      ref={menuRef}
    >
      <div className="w-full p-4 space-y-3 text-gray-200 shadow-lg rounded-b-xl">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-400">ACCOUNT</h2>
          {user && (
            <div className="flex items-center gap-3 mb-2">
              <UserAvatar user={flatUser} />
              <div>
                <p className="font-medium">{flatUser?.fullName}</p>
                <p className="text-sm text-gray-400">{flatUser?.email}</p>
              </div>
            </div>
          )}
          <ul className="">
            <li
              onClick={() => navigate("/switch-accounts")}
              className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200"
            >
              Switch accounts
            </li>
            <li className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer">
              Manage account
            </li>
          </ul>
        </div>

        <hr className="border-gray-700" />

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-400">PLANORA</h2>
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
          onClick={() => {
            openModal("workspace");
            closeMenu();
          }}
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
          className="hover:bg-[#34363a] px-3 py-2 rounded-lg cursor-pointer flex items-baseline"
        >
          <p className="">Log out</p>
        </div>
      </div>
    </FloatingContainer>
  );
}
