import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isTVMode?: boolean;
  index?: number;
}

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

// Calculate card width dynamically based on screen size and orientation
const getCardWidth = (isTVMode: boolean) => {
  if (isTVMode) {
    // 6 columns for TV
    return (width / 6) - 24;
  } else {
    // 2 columns for mobile portrait, 3 for landscape
    const columns = isLandscape ? 3 : 2;
    return (width / columns) - 24;
  }
};

// Fallback image for thumbnail errors
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

export const MovieCard = ({ movie, isTVMode = false, index = 0 }: MovieCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isFocused, setIsFocused] = useState(index === 0 && isTVMode);
  const [scaleAnim] = useState(new Animated.Value(1));
  const cardWidth = getCardWidth(isTVMode);
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Link href={`/${movie.id}`} asChild>
      <TouchableOpacity 
        activeOpacity={0.7}
        hasTVPreferredFocus={index === 0 && isTVMode}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...(Platform.OS === 'ios' && Platform.isTV ? { tvParallaxProperties: { enabled: true, magnification: 1.1 } } : {})}
      >
        <Animated.View 
          style={[
            styles.card,
            { width: cardWidth, transform: [{ scale: scaleAnim }] },
            isTVMode ? styles.tvCard : styles.mobileCard,
            isFocused && styles.focusedCard
          ]}
        >
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: imageError ? FALLBACK_IMAGE : movie.thumbnail }} 
              style={[
                styles.thumbnail,
                { width: cardWidth }
              ]} 
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            />
            
            {isTVMode && isFocused && (
              <View style={styles.playIconContainer}>
                <Ionicons name="play-circle" size={40} color="white" />
              </View>
            )}
            
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={10} color="white" />
              <Text style={styles.durationText}>{movie.duration}</Text>
            </View>
          </View>
          
          <View style={styles.info}>
            <Text style={[
              styles.title, 
              isFocused && styles.focusedText
            ]} numberOfLines={1}>
              {movie.title}
            </Text>
            
            {!isTVMode && (
              <Text style={styles.description} numberOfLines={2}>{movie.description}</Text>
            )}
            
            <View style={styles.genreContainer}>
              {movie.genre.slice(0, isTVMode ? 1 : 2).map((genre, index) => (
                <Text key={index} style={[
                  styles.genre,
                  isFocused && styles.focusedGenre
                ]}>
                  {genre}
                </Text>
              ))}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171717',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mobileCard: {
    height: 240,
  },
  tvCard: {
    height: 220,
  },
  focusedCard: {
    borderColor: '#0077ff',
    borderWidth: 2,
    backgroundColor: '#1a1a1a',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    height: 160,
    backgroundColor: '#333',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  durationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
  },
  info: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  focusedText: {
    color: '#0077ff',
  },
  description: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 'auto',
  },
  genre: {
    fontSize: 10,
    color: '#aaa',
    backgroundColor: '#272727',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  focusedGenre: {
    backgroundColor: '#0077ff33',
    color: '#fff',
  },
});