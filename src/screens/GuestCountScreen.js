import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setGuestCount, setGamePhase } from '../redux/slices/gameSlice';
import { setPlayerCount } from '../redux/slices/playersSlice';
import { colors, shadows } from '../styles/theme';

const patternImage = require('../../assets/pattern.png');

export default function GuestCountScreen() {
  const dispatch = useDispatch();
  const playerStatus = useSelector((state) => state.playerPool.status);
  const [count, setCount] = useState('');
  const [error, setError] = useState('');

  const isLoading = playerStatus === 'prefetching';

  const handleSubmit = () => {
    const num = parseInt(count);
    
    if (isNaN(num) || num < 3 || num > 10) {
      setError('Please enter a number between 3 and 10');
      return;
    }

    dispatch(setGuestCount(num));
    dispatch(setPlayerCount(num));
    dispatch(setGamePhase('enterNames'));
  };

  return (
    <ImageBackground source={patternImage} style={styles.background} imageStyle={styles.patternImage}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
        <Text style={styles.title}>⚽ Mr. White Football Card Game</Text>
        <Text style={styles.subtitle}>How many guests are playing?</Text>
        
        {isLoading && (
          <Text style={styles.loadingText}>⚡ Loading players...</Text>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Enter number (3-10)"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={count}
          onChangeText={(text) => {
            setCount(text);
            setError('');
          }}
          maxLength={2}
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 30,
    width: '100%',
    maxWidth: 400,
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
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 25,
  },
  loadingText: {
    fontSize: 14,
    color: colors.success,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
