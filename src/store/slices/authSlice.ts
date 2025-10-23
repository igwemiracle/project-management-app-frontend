import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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

      // Backend might automatically log in after registration (cookie set)
      if (response.success || response.user) {
        return response;
      }

      return rejectWithValue(response.message || "Registration failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
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
        state.user = action.payload.user || action.payload;
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
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        // state.error = null;
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
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
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
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
