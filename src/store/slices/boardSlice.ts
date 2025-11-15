import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { Board, List, Card } from '../../types';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  recentBoards: Board[];
  starredBoards: Board[];
  lists: List[];
  cards: Card[];
  loading: boolean;
  error: string | null;
}

interface CreateCardPayload {
  title: string;
  description?: string;
  listId: string;
  board: string;
  position?: number;
  assignedTo?: string[];
  labels?: string[];
  attachments?: string[];
  dueDate?: string | null;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  lists: [],
  cards: [],
  loading: false,
  error: null,
  recentBoards: [],
  starredBoards: []
};

// ✅ BOARD ACTIONS
export const fetchBoards = createAsyncThunk<Board[], string>(
  'boards/fetchAll',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await api.boards.getAll(workspaceId);
      return response.boards;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBoard = createAsyncThunk(
  "boards/create",
  async (
    data: { title: string; workspaceId: string; description?: string; color?: string; isFavorite?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.boards.create(data);
      return response.board;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ TOGGLE FAVORITE BOARD
export const toggleFavorite = createAsyncThunk(
  "boards/toggleFavorite",
  async ({ boardId, isFavorite }: { boardId: string; isFavorite: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.boards.updateFavorite(boardId, isFavorite);
      return response.board;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchBoard = createAsyncThunk('boards/fetchOne', async (id: string) => {
  const response = await api.boards.getById(id);
  return response;
});

// ✅ FETCH RECENTLY VIEWED BOARDS
export const fetchRecentlyViewedBoards = createAsyncThunk<
  { success: boolean; boards: Board[] },
  void,
  { rejectValue: string }
>(
  "boards/fetchRecentlyViewed",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.recentlyViewedBoards.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchStarredBoards = createAsyncThunk<
  { success: boolean; favorites: Board[] },
  void,
  { rejectValue: string }
>(
  "boards/fetchStarred",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.starredBoards.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchBoardData = createAsyncThunk<
  { board: Board; lists: List[]; cards: Card[] },
  string
>(
  "boards/fetchBoardData",
  async (boardId, { rejectWithValue }) => {
    try {
      const [board, listsResponse, cardsResponse] = await Promise.all([
        api.boards.getById(boardId),
        api.lists.getAll(boardId),
        api.cards.getAll(boardId),
      ]);

      return {
        board,
        lists: listsResponse.lists,
        cards: cardsResponse.cards,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// ✅ LIST ACTIONS
export const createList = createAsyncThunk<List, { title: string; board: string; position?: number }>(
  "boards/createList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.lists.create({
        title: data.title,
        boardId: data.board,
        position: data.position,
      });
      return response.list;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
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

// ✅ CARD ACTIONS
export const createCard = createAsyncThunk<Card, CreateCardPayload>(
  "boards/createCard",
  async (data) => {
    const response = await api.cards.create(data);
    return response.card;
  }
);

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
      // ✅ FETCH BOARDS
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
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.currentBoard = action.payload.board;
        state.lists = Array.isArray(action.payload.lists)
          ? action.payload.lists.sort((a: List, b: List) => (a.position || 0) - (b.position || 0))
          : [];
        state.cards = Array.isArray(action.payload.cards)
          ? action.payload.cards.sort((a: Card, b: Card) => (a.position || 0) - (b.position || 0))
          : [];
        state.loading = false;
      })

      // ✅ FETCH RECENTLY VIEWED BOARDS
      .addCase(fetchRecentlyViewedBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentlyViewedBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.recentBoards = action.payload.boards;
      })

      .addCase(fetchRecentlyViewedBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ FETCH STARRED BOARDS
      .addCase(fetchStarredBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStarredBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.starredBoards = action.payload.favorites;
      })

      // ✅ TOGGLE STAR BOARD
      .addCase(toggleFavorite.pending, (state, action) => {
        const { boardId, isFavorite } = action.meta.arg;

        if (isFavorite) {
          const exists = state.starredBoards.find(b => b._id === boardId);
          if (!exists && state.boards) {
            const boardToAdd = state.boards.find(b => b._id === boardId);
            if (boardToAdd) state.starredBoards = [boardToAdd, ...state.starredBoards];
          }
        } else {
          state.starredBoards = state.starredBoards.filter(b => b._id !== boardId);
        }

        if (state.starredBoards.length > 4) {
          state.starredBoards = state.starredBoards.slice(0, 4);
        }
      })

      // inside extraReducers
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<Board>) => {
        const updatedBoard = action.payload;

        // ---------- Update starredBoards ----------
        const starredIndex = state.starredBoards.findIndex(b => b._id === updatedBoard._id);
        if (updatedBoard.isFavorite) {
          // Add to starred if not already there
          if (starredIndex === -1) state.starredBoards.push(updatedBoard);
          else state.starredBoards[starredIndex] = updatedBoard;
        } else {
          // Remove from starred if it exists
          if (starredIndex !== -1) state.starredBoards.splice(starredIndex, 1);
        }

        // ---------- Update recentBoards ----------
        const recentIndex = state.recentBoards.findIndex(b => b._id === updatedBoard._id);
        if (recentIndex !== -1) {
          state.recentBoards[recentIndex] = updatedBoard;
        }

        // ---------- Update currentBoard if needed ----------
        if (state.currentBoard?._id === updatedBoard._id) {
          state.currentBoard = updatedBoard;
        }
      })


      .addCase(fetchStarredBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ LIST
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
