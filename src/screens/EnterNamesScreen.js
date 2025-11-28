import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';

const patternImage = require('../../assets/pattern.png');
import { useDispatch, useSelector } from 'react-redux';
import { setGamePhase } from '../redux/slices/gameSlice';
import { addPlayer, removePlayer } from '../redux/slices/playersSlice';
import { assignPlayersToGuests, loadPlayersForRound, prefetchPlayers } from '../redux/slices/playerPoolSlice';
import { colors, shadows } from '../styles/theme';

export default function EnterNamesScreen() {
  const dispatch = useDispatch();
  const guestCount = useSelector((state) => state.game.guestCount);
  const playerList = useSelector((state) => state.players.playerList);
  const playerStatus = useSelector((state) => state.playerPool.status);
  
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const playersReady = playerStatus === 'ready';

  const handleAddPlayer = () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (playerList.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Name already exists');
      return;
    }

    dispatch(addPlayer(name.trim()));
    setName('');
    setError('');
  };

  const handleRemovePlayer = (id) => {
    dispatch(removePlayer(id));
  };

  const handleContinue = async () => {
    if (playerList.length !== guestCount) {
      setError(`Please add all ${guestCount} guest names`);
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(loadPlayersForRound()).unwrap();
      dispatch(assignPlayersToGuests(playerList));
      dispatch(setGamePhase('playerList'));
      dispatch(prefetchPlayers());
    } catch (err) {
      Alert.alert('Error', 'Failed to load players. Please try again.');
      dispatch(prefetchPlayers());
    }
    setIsLoading(false);
  };

  const renderNameItem = ({ item }) => (
    <View style={styles.nameItem}>
      <Text style={styles.nameText}>{item.name}</Text>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemovePlayer(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={patternImage} style={styles.background} imageStyle={styles.patternImage}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
        <Text style={styles.title}>Enter Guest Names</Text>
        <Text style={styles.progress}>
          {playerList.length} of {guestCount} guests added
          {playersReady && <Text style={styles.readyText}> ✓ Players ready</Text>}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter guest name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError('');
          }}
          onSubmitEditing={handleAddPlayer}
          editable={!isLoading}
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, styles.addButton, playerList.length >= guestCount && styles.buttonDisabled]}
          onPress={handleAddPlayer}
          disabled={playerList.length >= guestCount || isLoading}
        >
          <Text style={styles.buttonText}>Add Guest</Text>
        </TouchableOpacity>

        <FlatList
          data={playerList}
          renderItem={renderNameItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />

        <TouchableOpacity 
          style={[styles.button, (playerList.length !== guestCount || isLoading) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={playerList.length !== guestCount || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Start Game'}
          </Text>
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
  progress: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  readyText: {
    color: colors.success,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: colors.primaryLight,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    maxHeight: 200,
    marginVertical: 15,
  },
  nameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 16,
    color: colors.grayDark,
  },
  removeButton: {
    backgroundColor: colors.error,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
