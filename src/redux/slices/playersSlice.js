import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerList: [],
  maxPlayers: 0,
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerCount: (state, action) => {
      state.maxPlayers = action.payload;
    },
    addPlayer: (state, action) => {
      if (state.playerList.length < state.maxPlayers) {
        state.playerList.push({
          id: Date.now(),
          name: action.payload,
        });
      }
    },
    removePlayer: (state, action) => {
      state.playerList = state.playerList.filter((p) => p.id !== action.payload);
    },
    resetPlayers: () => {
      return initialState;
    },
  },
});

export const { setPlayerCount, addPlayer, removePlayer, resetPlayers } = playersSlice.actions;

export default playersSlice.reducer;
