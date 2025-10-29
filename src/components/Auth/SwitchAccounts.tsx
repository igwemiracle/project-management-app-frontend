import { motion } from "framer-motion";
import { Workflow, User as UserIcon } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-[400px] mt-36 mx-auto max-w-md p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex items-start justify-center gap-3"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl ">
            <Workflow className="text-white w-7 h-7" />
          </div>
          <h2 className="mt-1 text-3xl font-bold text-gray-800">Planora</h2>
        </motion.div>
        <p className="mt-2 font-bold text-gray-600">
          Choose or add another account
        </p>
      </div>

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
        className="border-b py-7 px-3 border-slate-200 flex items-center gap-3 hover:bg-gray-100 w-[330px] cursor-pointer"
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
  );
};
