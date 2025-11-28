import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame } from '../redux/slices/gameSlice';
import { resetPlayers } from '../redux/slices/playersSlice';
import { resetPlayerPool, prefetchPlayers } from '../redux/slices/playerPoolSlice';
import { colors, shadows } from '../styles/theme';

const patternImage = require('../../assets/pattern.png');

export default function VotingScreen() {
  const dispatch = useDispatch();
  const playerList = useSelector((state) => state.players.playerList);
  const mrWhiteGuestId = useSelector((state) => state.playerPool.mrWhiteGuestId);
  const principalPlayer = useSelector((state) => state.playerPool.principalPlayer);
  const secondaryPlayer = useSelector((state) => state.playerPool.secondaryPlayer);
  
  const [selectedVote, setSelectedVote] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleVote = (guestId) => {
    setSelectedVote(guestId);
  };

  const handleRevealResult = () => {
    setShowResult(true);
  };

  const handleNewGame = () => {
    dispatch(resetGame());
    dispatch(resetPlayers());
    dispatch(resetPlayerPool());
    dispatch(prefetchPlayers());
  };

  const isCorrectGuess = selectedVote === mrWhiteGuestId;
  const mrWhiteGuest = playerList.find(p => p.id === mrWhiteGuestId);

  if (showResult) {
    return (
      <ImageBackground source={patternImage} style={styles.background} imageStyle={styles.patternImage}>
        <View style={styles.container}>
          <View style={styles.card}>
          <Text style={styles.title}>🎭 Results 🎭</Text>
          
          <View style={[
            styles.resultBox,
            isCorrectGuess ? styles.resultCorrect : styles.resultWrong
          ]}>
            <Text style={styles.resultTitle}>
              {isCorrectGuess ? '🎉 Correct!' : '❌ Wrong!'}
            </Text>
            <Text style={styles.resultText}>
              Mr. White was: <Text style={styles.bold}>{mrWhiteGuest?.name}</Text>
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Principal Player (Most guests had):</Text>
            <Text style={styles.infoValue}>{principalPlayer?.name}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Mr. White's Player:</Text>
            <Text style={styles.infoValue}>{secondaryPlayer?.name}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNewGame}>
            <Text style={styles.buttonText}>🎮 New Game</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={patternImage} style={styles.background} imageStyle={styles.patternImage}>
      <View style={styles.container}>
        <View style={styles.card}>
        <Text style={styles.title}>🗳️ Vote for Mr. White</Text>
        <Text style={styles.subtitle}>Who do you think has a different player?</Text>

        <ScrollView style={styles.voteList}>
          {playerList.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={[
                styles.voteButton,
                selectedVote === player.id && styles.voteButtonSelected,
              ]}
              onPress={() => handleVote(player.id)}
            >
              <Text style={[
                styles.voteButtonText,
                selectedVote === player.id && styles.voteButtonTextSelected,
              ]}>
                {player.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.button, !selectedVote && styles.buttonDisabled]}
          onPress={handleRevealResult}
          disabled={!selectedVote}
        >
          <Text style={styles.buttonText}>Reveal Result</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  patternImage: {
    opacity: 0.15,
    resizeMode: 'repeat',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    ...shadows.large,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  voteList: {
    maxHeight: 250,
    marginBottom: 15,
  },
  voteButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  voteButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  voteButtonTextSelected: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultBox: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  resultCorrect: {
    backgroundColor: colors.success,
  },
  resultWrong: {
    backgroundColor: colors.error,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: colors.white,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: colors.grayDark,
  },
});
