import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import playersReducer from './slices/playersSlice';
import playerPoolReducer from './slices/playerPoolSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    players: playersReducer,
    playerPool: playerPoolReducer,
  },
});
