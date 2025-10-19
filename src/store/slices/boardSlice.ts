import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { Board, List, Card } from '../../types';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  lists: List[];
  cards: Card[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  lists: [],
  cards: [],
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk('boards/fetchAll', async (workspaceId: string) => {
  const response = await api.boards.getAll(workspaceId);
  return response;
});

export const createBoard = createAsyncThunk(
  'boards/create',
  async (data: { name: string; workspace: string; description?: string; color?: string }) => {
    const response = await api.boards.create(data);
    return response;
  }
);

export const fetchBoard = createAsyncThunk('boards/fetchOne', async (id: string) => {
  const response = await api.boards.getById(id);
  return response;
});

export const fetchBoardData = createAsyncThunk('boards/fetchBoardData', async (boardId: string) => {
  const [board, lists, cards] = await Promise.all([
    api.boards.getById(boardId),
    api.lists.getAll(boardId),
    api.cards.getAll(boardId),
  ]);
  return { board, lists, cards };
});

export const createList = createAsyncThunk(
  'boards/createList',
  async (data: { name: string; board: string; position: number }) => {
    const response = await api.lists.create(data);
    return response;
  }
);

export const updateList = createAsyncThunk(
  'boards/updateList',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await api.lists.update(id, data);
    return response;
  }
);

export const deleteList = createAsyncThunk('boards/deleteList', async (id: string) => {
  await api.lists.delete(id);
  return id;
});

export const createCard = createAsyncThunk('boards/createCard', async (data: any) => {
  const response = await api.cards.create(data);
  return response;
});

export const updateCard = createAsyncThunk(
  'boards/updateCard',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await api.cards.update(id, data);
    return response;
  }
);

export const deleteCard = createAsyncThunk('boards/deleteCard', async (id: string) => {
  await api.cards.delete(id);
  return id;
});

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
    boardCreatedRealtime: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    boardUpdatedRealtime: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      if (state.currentBoard?._id === action.payload._id) {
        state.currentBoard = action.payload;
      }
    },
    boardDeletedRealtime: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((b) => b._id !== action.payload);
      if (state.currentBoard?._id === action.payload) {
        state.currentBoard = null;
      }
    },
    listCreatedRealtime: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    listUpdatedRealtime: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    listDeletedRealtime: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((l) => l._id !== action.payload);
      state.cards = state.cards.filter((c) => c.list !== action.payload);
    },
    cardCreatedRealtime: (state, action: PayloadAction<Card>) => {
      state.cards.push(action.payload);
    },
    cardUpdatedRealtime: (state, action: PayloadAction<Card>) => {
      const index = state.cards.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.cards[index] = action.payload;
      }
    },
    cardDeletedRealtime: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter((c) => c._id !== action.payload);
    },
    moveCard: (state, action: PayloadAction<{ cardId: string; newListId: string; newPosition: number }>) => {
      const card = state.cards.find((c) => c._id === action.payload.cardId);
      if (card) {
        card.list = action.payload.newListId;
        card.position = action.payload.newPosition;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.boards.push(action.payload);
      })
      .addCase(fetchBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.currentBoard = action.payload.board;
        state.lists = action.payload.lists.sort((a: List, b: List) => a.position - b.position);
        state.cards = action.payload.cards.sort((a: Card, b: Card) => a.position - b.position);
      })
      .addCase(createList.fulfilled, (state, action: PayloadAction<List>) => {
        state.lists.push(action.payload);
      })
      .addCase(updateList.fulfilled, (state, action: PayloadAction<List>) => {
        const index = state.lists.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(deleteList.fulfilled, (state, action: PayloadAction<string>) => {
        state.lists = state.lists.filter((l) => l._id !== action.payload);
        state.cards = state.cards.filter((c) => c.list !== action.payload);
      })
      .addCase(createCard.fulfilled, (state, action: PayloadAction<Card>) => {
        state.cards.push(action.payload);
      })
      .addCase(updateCard.fulfilled, (state, action: PayloadAction<Card>) => {
        const index = state.cards.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      .addCase(deleteCard.fulfilled, (state, action: PayloadAction<string>) => {
        state.cards = state.cards.filter((c) => c._id !== action.payload);
      });
  },
});

export const {
  setCurrentBoard,
  boardCreatedRealtime,
  boardUpdatedRealtime,
  boardDeletedRealtime,
  listCreatedRealtime,
  listUpdatedRealtime,
  listDeletedRealtime,
  cardCreatedRealtime,
  cardUpdatedRealtime,
  cardDeletedRealtime,
  moveCard,
} = boardSlice.actions;

export default boardSlice.reducer;
