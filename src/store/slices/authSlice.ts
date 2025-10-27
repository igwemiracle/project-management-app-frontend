import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  ownedAccounts: User[];
  subAccounts: User[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
  ownedAccounts: [],
  subAccounts: [],
};

// ✅ Login
export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(data);
      return response;
    } catch (error: any) {
      // ensure error is string
      return rejectWithValue(error?.message || "Invalid credentials");
    }
  }
);

// ✅ Get Profile (verifies if cookie session is still valid)
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.auth.getProfile();

      if (response.user || response._id) {
        return response;
      }
      return rejectWithValue("No active session found");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get profile");
    }
  }
);

// ✅ Register
export const register = createAsyncThunk(
  "auth/register",
  async (
    data: {
      username: string,
      email: string,
      password: string,
      fullName: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.auth.register(data);

      // ✅ Return response.user if exists
      if (response.user) {
        return response;
      }

      return rejectWithValue(response.message || "Registration failed");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  }
);

// ✅ Create sub-account
export const createSubAccount = createAsyncThunk(
  "users/createSubAccount",
  async (
    data: { fullName: string; username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.auth.createSubAccount(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create sub-account");
    }
  }
);

// ✅ Get all owned accounts
export const fetchOwnedAccounts = createAsyncThunk(
  "auth/fetchOwnedAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const accounts = await api.users.getOwnedAccounts();
      return accounts;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch owned accounts");
    }
  }
);

// ✅ Switch account
export const switchAccount = createAsyncThunk(
  "auth/switchAccount",
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await api.auth.switchAccount(targetUserId);
      return response.user; // returns the switched sub-account
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to switch account");
    }
  }
);
// ✅ LOGOUT
export const logoutUser = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string } // ✅ Rejected value type
>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.auth.logout();

      if (response.success) {
        return true; // success
      }

      return rejectWithValue(response.message || "Logout failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Login failed";;
      })

      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        state.initialized = true; // ✅ finished checking
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true; // ✅ even if failed, mark initialized
      })

      // LOGOUT USER
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ CREATE SUB ACCOUNT
      .addCase(createSubAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubAccount.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.subAccounts = [...(state.subAccounts || []), action.payload.user];
      })
      .addCase(createSubAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ FETCH ACCOUNTS OWNED BY A USER
      .addCase(fetchOwnedAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnedAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.subAccounts = action.payload;
      })
      .addCase(fetchOwnedAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ SWITCH ACCOUNT
      .addCase(switchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchAccount.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(switchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
