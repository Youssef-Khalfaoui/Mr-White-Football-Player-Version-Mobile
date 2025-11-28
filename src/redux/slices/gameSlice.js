import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gamePhase: 'guestCount',
  guestCount: 0,
  selectedPlayer: null,
  revealedCards: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGamePhase: (state, action) => {
      state.gamePhase = action.payload;
    },
    setGuestCount: (state, action) => {
      state.guestCount = action.payload;
    },
    selectPlayerForCard: (state, action) => {
      state.selectedPlayer = action.payload;
    },
    markCardRevealed: (state, action) => {
      if (!state.revealedCards.includes(action.payload)) {
        state.revealedCards.push(action.payload);
      }
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const {
  setGamePhase,
  setGuestCount,
  selectPlayerForCard,
  markCardRevealed,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
