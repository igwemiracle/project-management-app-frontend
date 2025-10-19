import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnlineUser } from '../../types';

interface RealtimeState {
  onlineUsers: OnlineUser[];
  isConnected: boolean;
}

const initialState: RealtimeState = {
  onlineUsers: [],
  isConnected: false,
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    userOnline: (state, action: PayloadAction<OnlineUser>) => {
      const exists = state.onlineUsers.find((u) => u.userId === action.payload.userId);
      if (!exists) {
        state.onlineUsers.push(action.payload);
      }
    },
    userOffline: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter((u) => u.userId !== action.payload);
    },
    updateOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setConnected, userOnline, userOffline, updateOnlineUsers } = realtimeSlice.actions;
export default realtimeSlice.reducer;
