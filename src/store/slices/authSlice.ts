import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { User } from "../../types";

interface LoginResponse {
  user: User;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  ownedAccounts: [],
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
  ownedAccounts: [],
};

// ✅ REGISTER
export const register = createAsyncThunk<
  LoginResponse,
  { username: string; email: string; password: string; fullName: string }
>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.auth.register(data);

      // ✅ Return response.user if exists
      if (response.user) {
        return response;
      }

      return rejectWithValue(response.message || "Registration failed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registration failed");
    }
  }
);

// ✅ LOGIN
export const login = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(data);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Invalid credentials");
    }
  }
);

// ✅ GET PROFILE (verifies if cookie session is still valid)
export const getProfile = createAsyncThunk<LoginResponse>(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.users.getProfile();

      if (response.user || response._id) {
        return response;
      }
      return rejectWithValue("No active session found");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get profile");
    }
  }
);

// ✅ SWITCH ACCOUNT
export const switchAccount = createAsyncThunk<User, string>(
  "auth/switchAccount",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const user = await api.users.SwitchAccount(targetUserId);
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to switch account");
    }
  }
);

// ✅ REMOVE CURRENT ACCOUNT
export const removeAccount = createAsyncThunk<string>(
  "auth/removeAccount",
  async (_, { rejectWithValue }) => {
    try {
      const message = await api.users.RemoveAccount();
      return message;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to remove account");
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk<boolean, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.auth.logout();
      if (response.success) return true;
      return rejectWithValue(response.message || "Logout failed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Logout failed");
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
      state.loading = false;

    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Login failed";;
      })

      // ✅ GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })

      // ✅ LOGOUT USER
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


      // ✅ SWITCH ACCOUNT
      .addCase(switchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(switchAccount.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(switchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ REMOVE ACCOUNTS
      .addCase(removeAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeAccount.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(removeAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;