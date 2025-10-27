import UserAvatar from "./UserAvatar";

interface Account {
  _id: string | number;
  fullName: string;
  email: string;
}

export default function AccountList({
  accounts,
  currentAccount,
  onSelectAccount
}: {
  accounts: Account[];
  currentAccount?: Account | null;
  onSelectAccount: (account: Account) => void;
}) {
  return (
    <div className="w-[330px] bg-white">
      {accounts.length > 0
        ? accounts.map((account) => {
            const isActive = currentAccount?.email === account.email;

            return (
              <div
                key={account._id}
                onClick={() => onSelectAccount(account)}
                className={`py-5 px-3 flex items-center gap-3 cursor-pointer transition-all duration-200 rounded-md ${
                  isActive
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <UserAvatar user={account} />
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      isActive ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {account.fullName}
                  </p>
                  <p className="text-xs text-gray-600">{account.email}</p>
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
}
