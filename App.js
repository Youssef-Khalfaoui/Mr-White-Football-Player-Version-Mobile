import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { prefetchPlayers } from './src/redux/slices/playerPoolSlice';

import GuestCountScreen from './src/screens/GuestCountScreen';
import EnterNamesScreen from './src/screens/EnterNamesScreen';
import PlayerListScreen from './src/screens/PlayerListScreen';
import VotingScreen from './src/screens/VotingScreen';

function AppContent() {
  const dispatch = useDispatch();
  const gamePhase = useSelector((state) => state.game.gamePhase);
  const playerStatus = useSelector((state) => state.playerPool.status);

  useEffect(() => {
    if (playerStatus === 'idle') {
      dispatch(prefetchPlayers());
    }
  }, [dispatch, playerStatus]);

  return (
    <View style={styles.container}>
      {gamePhase === 'guestCount' && <GuestCountScreen />}
      {gamePhase === 'enterNames' && <EnterNamesScreen />}
      {gamePhase === 'playerList' && <PlayerListScreen />}
      {gamePhase === 'voting' && <VotingScreen />}
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7E1532',
  },
});
