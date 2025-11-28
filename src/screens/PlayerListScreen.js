import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPlayerForCard,
  markCardRevealed,
  resetGame,
  setGamePhase,
} from '../redux/slices/gameSlice';
import { resetPlayers } from '../redux/slices/playersSlice';
import { resetPlayerPool } from '../redux/slices/playerPoolSlice';
import { colors, shadows } from '../styles/theme';

const { width, height } = Dimensions.get('window');
const patternImage = require('../../assets/pattern.png');

export default function PlayerListScreen() {
  const dispatch = useDispatch();
  const playerList = useSelector((state) => state.players.playerList);
  const playerAssignments = useSelector((state) => state.playerPool.playerAssignments);
  const revealedCards = useSelector((state) => state.game.revealedCards);
  const selectedPlayer = useSelector((state) => state.game.selectedPlayer);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [displayedPlayer, setDisplayedPlayer] = useState(null);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  const allCardsRevealed = revealedCards.length === playerList.length && playerList.length > 0;

  useEffect(() => {
    if (allCardsRevealed && !modalVisible) {
      setTimeout(() => {
        dispatch(setGamePhase('voting'));
      }, 1500);
    }
  }, [allCardsRevealed, modalVisible, dispatch]);

  const handlePlayerClick = (player) => {
    if (revealedCards.includes(player.id) && selectedPlayer?.id !== player.id) {
      return;
    }

    const footballPlayer = playerAssignments[player.id];
    if (footballPlayer) {
      setDisplayedPlayer(footballPlayer);
      setModalVisible(true);
      
      flipAnim.setValue(0);
      scaleAnim.setValue(0.3);
      
      Animated.parallel([
        Animated.spring(flipAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
      
      dispatch(selectPlayerForCard(player));
      if (!revealedCards.includes(player.id)) {
        dispatch(markCardRevealed(player.id));
      }
    }
  };

  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      dispatch(selectPlayerForCard(null));
    });
  };

  const handleReset = () => {
    Alert.alert(
      'New Game',
      'Are you sure you want to start a new game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            dispatch(resetGame());
            dispatch(resetPlayers());
            dispatch(resetPlayerPool());
          }
        },
      ]
    );
  };

  const spin = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <ImageBackground source={patternImage} style={styles.background} imageStyle={styles.patternImage}>
      <View style={styles.container}>
        <View style={styles.card}>
        <Text style={styles.title}>Click Your Name to Reveal</Text>
        <Text style={styles.progress}>
          {revealedCards.length} of {playerList.length} cards revealed
          {allCardsRevealed && ' ✅'}
        </Text>

        <ScrollView style={styles.buttonList}>
          {playerList.map((player) => {
            const isRevealed = revealedCards.includes(player.id);
            return (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.guestButton,
                  isRevealed && styles.guestButtonRevealed,
                ]}
                onPress={() => handlePlayerClick(player)}
                disabled={isRevealed}
              >
                <Text style={[
                  styles.guestButtonText,
                  isRevealed && styles.guestButtonTextRevealed,
                ]}>
                  {player.name} {isRevealed ? '✓' : '?'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <Animated.View 
            style={[
              styles.playerCard,
              {
                transform: [
                  { rotateY: spin },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {displayedPlayer && (
              <>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderText}>⚽ YOUR PLAYER ⚽</Text>
                </View>
                
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: displayedPlayer.image }}
                    style={styles.playerImage}
                    defaultSource={require('../../assets/placeholder.png')}
                  />
                </View>
                
                <Text style={styles.playerName}>{displayedPlayer.name}</Text>
                <View style={styles.positionBadge}>
                  <Text style={styles.positionText}>{displayedPlayer.position}</Text>
                </View>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🏟️</Text>
                    <Text style={styles.statLabel}>TEAM</Text>
                    <Text style={styles.statValue}>{displayedPlayer.team}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🌍</Text>
                    <Text style={styles.statLabel}>COUNTRY</Text>
                    <Text style={styles.statValue}>{displayedPlayer.country}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🎂</Text>
                    <Text style={styles.statLabel}>AGE</Text>
                    <Text style={styles.statValue}>{displayedPlayer.age} years</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🔢</Text>
                    <Text style={styles.statLabel}>ID</Text>
                    <Text style={styles.statValue}>#{displayedPlayer.id}</Text>
                  </View>
                </View>
                
                <Text style={styles.closeHint}>✨ Tap anywhere to close ✨</Text>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
    fontSize: 22,
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
  buttonList: {
    maxHeight: 300,
  },
  guestButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  guestButtonRevealed: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  guestButtonTextRevealed: {
    color: colors.white,
  },
  resetButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    maxWidth: 350,
    borderWidth: 3,
    borderColor: colors.accent,
    backfaceVisibility: 'hidden',
  },
  cardHeader: {
    backgroundColor: colors.accent,
    marginHorizontal: -20,
    marginTop: -20,
    padding: 15,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    marginBottom: 15,
  },
  cardHeaderText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  imageContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.accent,
    overflow: 'hidden',
    marginBottom: 15,
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  positionBadge: {
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  positionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
