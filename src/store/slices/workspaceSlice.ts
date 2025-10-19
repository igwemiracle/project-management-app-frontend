import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { Workspace } from '../../types';

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

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchAll', async () => {
  const response = await api.workspaces.getAll();
  return response;
});

export const createWorkspace = createAsyncThunk(
  'workspaces/create',
  async (data: { name: string; description?: string }) => {
    const response = await api.workspaces.create(data);
    return response;
  }
);

export const fetchWorkspace = createAsyncThunk('workspaces/fetchOne', async (id: string) => {
  const response = await api.workspaces.getById(id);
  return response;
});

export const updateWorkspace = createAsyncThunk(
  'workspaces/update',
  async ({ id, data }: { id: string; data: Partial<{ name: string; description: string }> }) => {
    const response = await api.workspaces.update(id, data);
    return response;
  }
);

export const deleteWorkspace = createAsyncThunk('workspaces/delete', async (id: string) => {
  await api.workspaces.delete(id);
  return id;
});

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
    },
    workspaceUpdatedRealtime: (state, action: PayloadAction<Workspace>) => {
      const index = state.workspaces.findIndex((w) => w._id === action.payload._id);
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
      if (state.currentWorkspace?._id === action.payload._id) {
        state.currentWorkspace = action.payload;
      }
    },
    workspaceDeletedRealtime: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w._id !== action.payload);
      if (state.currentWorkspace?._id === action.payload) {
        state.currentWorkspace = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action: PayloadAction<Workspace[]>) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workspaces';
      })
      .addCase(createWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.workspaces.push(action.payload);
      })
      .addCase(fetchWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.currentWorkspace = action.payload;
      })
      .addCase(updateWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        const index = state.workspaces.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(deleteWorkspace.fulfilled, (state, action: PayloadAction<string>) => {
        state.workspaces = state.workspaces.filter((w) => w._id !== action.payload);
        if (state.currentWorkspace?._id === action.payload) {
          state.currentWorkspace = null;
        }
      });
  },
});

export const { setCurrentWorkspace, workspaceUpdatedRealtime, workspaceDeletedRealtime } = workspaceSlice.actions;
export default workspaceSlice.reducer;
