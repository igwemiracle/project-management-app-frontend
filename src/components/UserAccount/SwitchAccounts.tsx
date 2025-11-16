import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import { useAppDispatch } from "../../store/hooks";
import {
  getProfile,
  logoutUser,
  switchAccount,
  removeAccount,
  logout
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AccountList from "./AccountList";
import { useEffect, useState } from "react";
import {
  addAccountToStorage,
  getStoredAccounts,
  removeAccountFromStorage,
  STORAGE_KEY
} from "../../utils/storage";
import BrandHeader from "../BrandHeader/BrandHeader";
import BottomImage from "../Auth/BottomImage";
import { images } from "../../assets";

export const SwitchAccounts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currentAccount, setCurrentAccount] = useState<any | null>(null);

  // Load localStorage on mount
  useEffect(() => {
    const { accounts, currentAccount } = getStoredAccounts();
    setAccounts(accounts);
    setCurrentAccount(currentAccount);
  }, []);

  const handleSelectAccount = async (account: any) => {
    try {
      const targetId = account.id || account._id;

      await dispatch(switchAccount(targetId)).unwrap();
      await dispatch(getProfile()).unwrap();

      addAccountToStorage(account);
      const { accounts, currentAccount } = getStoredAccounts();
      setAccounts(accounts);
      setCurrentAccount(currentAccount);

      navigate("/");
    } catch (error) {
      console.error("Switch failed:", error);
    }
  };

  const handleDeleteAccount = async (id: string | number) => {
    try {
      const normalizeId = (acc: any) =>
        acc._id || acc.user?.id || acc.user?._id;

      if (normalizeId(currentAccount) === id) {
        // Only remove from backend if it's the current active account
        await dispatch(removeAccount()).unwrap();
      }

      // Always remove from localStorage
      const { updatedAccounts, newCurrent } = removeAccountFromStorage(
        id.toString()
      );
      setAccounts(updatedAccounts);
      setCurrentAccount(newCurrent);

      if (!newCurrent) navigate("/login");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem(STORAGE_KEY);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddAccount = () => navigate("/login");

  const handleRemoveAll = async () => {
    try {
      await dispatch(removeAccount()).unwrap();
      localStorage.removeItem(STORAGE_KEY);
      setAccounts([]);
      setCurrentAccount(null);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Failed to remove all accounts:", error);
    }
  };

  return (
    <div className="relative xs:w-[90%] xs:max-w-[300px] xxs:w-[90%] xxs:max-w-[300px] sm:w-[60%] sm:max-w-[300px] md:w-[50%] md:max-w-[350px] lg:w-[60%] lg:max-w-[370px] xl:w-[70%] xl:max-w-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:shadow-up-down md:rounded-sm md:p-9"
      >
        {/* Brand Header */}
        <BrandHeader />
        {/* Account List */}
        <AccountList
          accounts={accounts}
          currentAccount={currentAccount}
          onSelectAccount={handleSelectAccount}
          onRemoveAccount={handleDeleteAccount}
        />

        {/* Add account */}
        <div
          onClick={handleAddAccount}
          className="flex items-center gap-3 px-3 border-b cursor-pointer py-7 border-slate-200 hover:bg-slate-100"
        >
          <UserIcon size={26} />
          <p className="text-gray-600">Add another account</p>
        </div>

        {/* Footer link */}
        <div className="text-center my-7">
          {accounts.length <= 1 ? (
            <p
              onClick={handleLogout}
              className="text-blue-600 text-[15px] hover:underline cursor-pointer"
            >
              Log out
            </p>
          ) : (
            <p
              onClick={handleRemoveAll}
              className="text-blue-600 text-[15px] hover:underline cursor-pointer"
            >
              Remove all accounts
            </p>
          )}
        </div>

        <hr className="border-gray-300" />
      </motion.div>

      {/* Bottom image */}
      <BottomImage src={images.v1} alt="first verify image" position="left" />
      <BottomImage src={images.v2} alt="second verify image" position="right" />
    </div>
  );
};
