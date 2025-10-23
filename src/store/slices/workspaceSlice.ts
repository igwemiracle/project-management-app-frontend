import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "../../services/axiosConfig";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


interface Workspace {
  _id: string;
  name: string;
  description?: string;
  members: any[];
  createdAt: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

// ✅ Fetch all workspaces
export const fetchWorkspaces = createAsyncThunk<Workspace[]>(
  "workspaces/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // 👇 Explicitly type the Axios response
      // 👇 Type the expected structure of your backend response
      const response = await axiosInstance.get<{ workspaces: Workspace[] }>("/workspaces");
      return response.data.workspaces; // ✅ No more "unknown"
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Create a new workspace
export const createWorkspace = createAsyncThunk<
  Workspace,
  { name: string; description?: string }
>(
  "workspaces/create",
  async (data, { rejectWithValue }) => {
    try {
      // 👇 Explicitly type this response too
      const response = await axios.post<{ workspace?: Workspace } | Workspace>(
        `${API_BASE_URL}/workspaces`,
        data,
        { withCredentials: true }
      );

      // ✅ Handle both shapes
      return response.data && "workspace" in response.data
        ? response.data.workspace!
        : (response.data as Workspace);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ FETCH WORKSPACES
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action: PayloadAction<Workspace[]>) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ CREATE WORKSPACE
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          state.workspaces.push(action.payload);
        }
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
