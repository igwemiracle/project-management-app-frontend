import { motion } from "framer-motion";
import { Workflow, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchOwnedAccounts,
  logoutUser,
  switchAccount
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AccountList from "./AccountList";

export const SwitchAccounts = () => {
  const { user, subAccounts } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOwnedAccounts());
  }, [dispatch]);

  const handleSelectAccount = async (account: any) => {
    try {
      await dispatch(switchAccount(account._id)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Switch failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-[400px] mt-36 mx-auto max-w-md p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center"
    >
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex items-start justify-center gap-3"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl ">
            <Workflow className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">Planora</h2>
        </motion.div>
        <p className="mt-2 font-bold text-gray-600">
          Choose or add another account
        </p>
      </div>

      {/* Switch accounts section */}
      <div>
        {/* Show current account and sub accounts */}
        <div>
          <AccountList
            accounts={subAccounts}
            currentAccount={user}
            onSelectAccount={handleSelectAccount}
          />
        </div>

        {/* Add another account */}
        <div
          onClick={() => navigate("/register")}
          className="border-b py-7 px-3 border-slate-200 flex items-center gap-3 hover:bg-gray-100 w-[330px] cursor-pointer"
        >
          <User size={26} />
          <p className="text-gray-600">Add another account</p>
        </div>

        {/* Log. out */}
        <div
          onClick={handleLogout}
          className="my-7 text-center text-blue-600 text-[15px] hover:underline cursor-pointer"
        >
          Log out
        </div>
        <hr className="border-gray-300" />
      </div>
    </motion.div>
  );
};
