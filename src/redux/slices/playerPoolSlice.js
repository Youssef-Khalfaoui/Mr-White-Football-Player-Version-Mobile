import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTwoRandomPlayers } from '../../services/footballApi';

const initialState = {
  principalPlayer: null,
  secondaryPlayer: null,
  mrWhiteGuestId: null,
  playerAssignments: {},
  status: 'idle',
  error: null,
  cachedPlayers: null,
};

export const prefetchPlayers = createAsyncThunk(
  'playerPool/prefetchPlayers',
  async () => {
    const players = await fetchTwoRandomPlayers();
    return players;
  }
);

export const loadPlayersForRound = createAsyncThunk(
  'playerPool/loadPlayersForRound',
  async (_, { getState }) => {
    const { playerPool } = getState();
    if (playerPool.cachedPlayers) {
      return playerPool.cachedPlayers;
    }
    const players = await fetchTwoRandomPlayers();
    return players;
  }
);

const playerPoolSlice = createSlice({
  name: 'playerPool',
  initialState,
  reducers: {
    assignPlayersToGuests: (state, action) => {
      const guestList = action.payload;
      
      if (!state.principalPlayer || !state.secondaryPlayer) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * guestList.length);
      const mrWhiteGuest = guestList[randomIndex];
      state.mrWhiteGuestId = mrWhiteGuest.id;

      state.playerAssignments = {};
      guestList.forEach((guest) => {
        if (guest.id === mrWhiteGuest.id) {
          state.playerAssignments[guest.id] = state.secondaryPlayer;
        } else {
          state.playerAssignments[guest.id] = state.principalPlayer;
        }
      });
    },
    resetPlayerPool: (state) => {
      state.principalPlayer = null;
      state.secondaryPlayer = null;
      state.mrWhiteGuestId = null;
      state.playerAssignments = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(prefetchPlayers.pending, (state) => {
        state.status = 'prefetching';
      })
      .addCase(prefetchPlayers.fulfilled, (state, action) => {
        state.status = 'ready';
        state.cachedPlayers = action.payload;
      })
      .addCase(prefetchPlayers.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(loadPlayersForRound.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadPlayersForRound.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.principalPlayer = action.payload.principal;
        state.secondaryPlayer = action.payload.secondary;
        state.cachedPlayers = null;
      })
      .addCase(loadPlayersForRound.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { assignPlayersToGuests, resetPlayerPool } = playerPoolSlice.actions;

export default playerPoolSlice.reducer;
