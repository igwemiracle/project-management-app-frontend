const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = {
  'Content-Type': 'application/json',
};

export const api = {
  auth: {
    register: async (data: { username: string; email: string; password: string; fullName: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return response.json();
    },

    login: async (data: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Invalid email or password');
      }
      return result;
    },

    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: "include",
      });
      return response.json();
    },
  },

  users: {
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },

    // ✅ CREATE SUB-ACCOUNT
    createSubAccount: async (data: { fullName: string; username: string; email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/users/subaccounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create sub-account");
      return result.user;
    },

    // ✅ SWITCH ACCOUNT
    SwitchAccount: async (targetUserId: string) => {
      const response = await fetch(`${API_BASE_URL}/account/switch-account`, {
        method: "POST",
        credentials: "include", // important to send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to switch account");
      }

      return result.user;
    },

    // ✅ REMOVE ACCOUNT FROM THIS BROWSER
    RemoveAccount: async () => {
      const response = await fetch(`${API_BASE_URL}/account/remove-account`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove account");
      }

      return result.message;
    },

    // ✅ GET OWNED ACCOUNTS
    getOwnedAccounts: async () => {
      const response = await fetch(`${API_BASE_URL}/users/owned-accounts`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch sub-accounts");
      }


      const data = await response.json();
      return data.accounts;

    },
  },

  recentlyViewedBoards: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/recently-viewed`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    addView: async (boardId: string) => {
      const response = await fetch(`${API_BASE_URL}/recently-viewed/${boardId}`, {
        method: "POST",
        credentials: "include",
      });
      return response.json();
    },
  },

  workspaces: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: "GET",
        credentials: "include", // ✅ include cookie
      });
      return response.json();
    },
    create: async (data: { name: string; description?: string }) => {
      const response = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'POST',
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    update: async (id: string, data: Partial<{ name: string; description: string }>) => {
      const response = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
        method: "PUT",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.json();
    },
  },

  boards: {
    getAll: async (workspaceId: string) => {
      const response = await fetch(`${API_BASE_URL}/boards?workspace=${workspaceId}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    create: async (data: { title: string; workspaceId: string; description?: string; color?: string; isFavorite?: boolean }) => {
      const response = await fetch(`${API_BASE_URL}/boards`, {
        method: "POST",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateFavorite: async (boardId: string, isFavorite: boolean) => {
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: "PATCH",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify({ isFavorite }),
      });
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
        method: "PUT",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.json();
    },
  },

  lists: {
    getAll: async (boardId: string) => {
      const response = await fetch(`${API_BASE_URL}/lists?board=${boardId}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    create: async (data: { title: string; boardId: string; position?: number; color?: string }) => {
      const response = await fetch(`${API_BASE_URL}/lists`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
        method: "PUT",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.json();
    },
  },

  cards: {
    getAll: async (boardId: string) => {
      const response = await fetch(`${API_BASE_URL}/cards?board=${boardId}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: "PUT",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.json();
    },
  },

  comments: {
    getAll: async (cardId: string) => {
      const response = await fetch(`${API_BASE_URL}/comments?card=${cardId}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
    create: async (data: { content: string; card: string }) => {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id: string, data: { content: string }) => {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "PUT",
        headers: getAuthHeaders,
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.json();
    },
  },

  activityLogs: {
    getAll: async (filters: { workspace?: string; board?: string }) => {
      const params = new URLSearchParams();
      if (filters.workspace) params.append('workspace', filters.workspace);
      if (filters.board) params.append('board', filters.board);
      const response = await fetch(`${API_BASE_URL}/activity-logs?${params}`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    },
  },
};