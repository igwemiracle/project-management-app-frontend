import UserAvatar from "./UserAvatar";
import { X } from "lucide-react";

interface Account {
  _id?: string | number;
  id?: string | number;
  fullName: string;
  email: string;
}

interface AccountListProps {
  accounts: any[];
  currentAccount?: any | null;
  onSelectAccount: (account: Account) => void;
  onRemoveAccount?: (id: string | number) => void;
}

export default function AccountList({
  accounts,
  currentAccount,
  onSelectAccount,
  onRemoveAccount
}: AccountListProps) {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="py-5 text-center text-gray-400 bg-white">
        No accounts logged in
      </div>
    );
  }

  // Flatten accounts: unwrap nested `user` objects
  const flattenedAccounts: Account[] = accounts.map((acc) => acc.user || acc);

  // Flatten current account
  const current = currentAccount?.user || currentAccount;

  // Sort: current account first
  const sortedAccounts = [...flattenedAccounts].sort((a, b) => {
    if (current && a.email === current.email) return -1;
    if (current && b.email === current.email) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-2 bg-white ">
      {sortedAccounts.map((account, index) => {
        const isCurrent = current?.email === account.email;
        const accountId = account._id || account.id || index;

        return (
          <div
            key={accountId}
            className={`py-4 px-3 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 rounded-lg ${
              isCurrent
                ? "bg-blue-100 border border-blue-300 shadow-sm"
                : "hover:bg-gray-100 border border-transparent"
            }`}
          >
            {/* Selectable section */}
            <div
              className="flex items-center flex-1 gap-3"
              onClick={() => onSelectAccount(account)}
            >
              <UserAvatar user={account} />
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isCurrent ? "text-blue-800" : "text-gray-800"
                  }`}
                >
                  {account.fullName}
                </p>
                <p className="text-xs text-gray-600">{account.email}</p>
              </div>
            </div>

            {/* Delete icon only for non-current accounts */}
            {!isCurrent && onRemoveAccount && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAccount(accountId);
                }}
                className="text-gray-400 transition hover:text-red-500"
                title="Remove account"
              >
                <X size={16} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
