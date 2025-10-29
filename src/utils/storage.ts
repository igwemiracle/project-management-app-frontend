export const STORAGE_KEY = "multiAccounts";

export const getStoredAccounts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : { currentAccount: null, accounts: [] };
};

export const setStoredAccounts = (data: { currentAccount: any; accounts: any[] }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Add a new account to storage.
 * - Prevents duplicates
 * - Updates currentAccount to the newly added account
 */
export const addAccountToStorage = (account: any) => {
  const { accounts } = getStoredAccounts();

  // Ensure we always store { user: {...} }
  const normalizedAccount = account.user ? account : { user: account };
  const newId = normalizedAccount.user.id || normalizedAccount.user._id;

  const exists = accounts.some(
    (acc: any) => (acc.user?.id || acc.user?._id) === newId
  );

  const updatedAccounts = exists ? accounts : [...accounts, normalizedAccount];
  setStoredAccounts({ currentAccount: normalizedAccount, accounts: updatedAccounts });
};


/**
 * Remove an account from storage by ID
 * - Updates currentAccount if the removed account was active
 * @returns { updatedAccounts, newCurrent }
 */
export const removeAccountFromStorage = (id: string | number) => {
  const { accounts, currentAccount } = getStoredAccounts();

  const updatedAccounts = accounts.filter(
    (acc: any) => (acc.user?.id || acc.user?._id) !== id
  );

  const newCurrent =
    (currentAccount?.user?.id || currentAccount?.user?._id) === id
      ? updatedAccounts[0] || null
      : currentAccount;

  setStoredAccounts({ currentAccount: newCurrent, accounts: updatedAccounts });
  return { updatedAccounts, newCurrent };
};

/**
 * Clear all accounts from storage
 */
export const clearAccountsFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
