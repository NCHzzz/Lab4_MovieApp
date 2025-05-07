import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Dimensions, ImageBackground, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { mockMovies } from '../data/movies';
import { VideoPlayer } from '../components/VideoPlayer';
import { Movie } from '../types';

export default function MoviePlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const isTVMode = Platform.isTV;
  const router = useRouter();

  useEffect(() => {
    // Find the movie with the matching id
    const foundMovie = mockMovies.find(m => m.id === id);
    if (foundMovie) {
      setMovie(foundMovie);
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  // Get similar movies (same genre)
  const similarMovies = mockMovies.filter(
    m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g))
  ).slice(0, 6);

  const renderSimilarMovies = () => (
    <View style={styles.similarSection}>
      <Text style={styles.sectionTitle}>You May Also Like</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.similarScrollContent}
      >
        {similarMovies.map((similar) => (
          <Link href={`/${similar.id}`} key={similar.id} asChild>
            <TouchableOpacity style={styles.similarItem}>
              <ImageBackground
                source={{ uri: similar.thumbnail }}
                style={styles.similarImage}
                imageStyle={{ borderRadius: 8 }}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.similarGradient}
                >
                  <Text style={styles.similarTitle} numberOfLines={1}>
                    {similar.title}
                  </Text>
                  <View style={styles.similarMeta}>
                    <Ionicons name="time-outline" size={12} color="#ddd" />
                    <Text style={styles.similarDuration}>{similar.duration}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isTVMode && isLandscape ? (
          // Enhanced TV Layout for landscape mode
          <View>
            <View style={styles.tvLandscapeContainer}>
              <View style={styles.videoWrapper}>
                <VideoPlayer 
                  videoUri={movie.videoUrl} 
                  thumbnailUri={movie.thumbnail}
                  title={movie.title}
                />
              </View>
              
              <View style={styles.tvSideInfo}>
                <Text style={styles.tvTitle}>{movie.title}</Text>
                
                <View style={styles.metaInfo}>
                  <View style={styles.durationContainer}>
                    <Ionicons name="time-outline" size={18} color="#0077ff" />
                    <Text style={styles.tvDuration}>{movie.duration}</Text>
                  </View>
                  
                  <View style={styles.genreContainer}>
                    {movie.genre.map((genre, index) => (
                      <View key={index} style={styles.tvGenreTag}>
                        <Text style={styles.tvGenreText}>{genre}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <Text style={styles.tvDescription}>{movie.description}</Text>
                
                {/* Back to Home Button */}
                <TouchableOpacity 
                  style={styles.backToHomeButton}
                  onPress={handleBack}
                >
                  <Ionicons name="home" size={24} color="white" />
                  <Text style={styles.backToHomeText}>Back to Home</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {similarMovies.length > 0 && renderSimilarMovies()}
          </View>
        ) : (
          // Modern mobile layout
          <>
            <VideoPlayer 
              videoUri={movie.videoUrl} 
              thumbnailUri={movie.thumbnail}
              title={movie.title}
            />
            
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{movie.title}</Text>
              
              <View style={styles.metaInfo}>
                <View style={styles.durationContainer}>
                  <Ionicons name="time-outline" size={16} color="#0077ff" />
                  <Text style={styles.duration}>{movie.duration}</Text>
                </View>
                
                <View style={styles.genreContainer}>
                  {movie.genre.map((genre, index) => (
                    <View key={index} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <Text style={styles.description}>{movie.description}</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-social-outline" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="add-outline" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>My List</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download-outline" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
              
              {similarMovies.length > 0 && renderSimilarMovies()}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  tvLandscapeContainer: {
    flexDirection: 'row',
    height: Dimensions.get('window').height - 80,
  },
  videoWrapper: {
    flex: 3,
  },
  tvSideInfo: {
    flex: 2,
    padding: 40,
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  tvTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 4,
  },
  tvDuration: {
    fontSize: 18,
    color: '#aaa',
    marginLeft: 6,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tvGenreTag: {
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  genreText: {
    color: 'white',
    fontSize: 13,
  },
  tvGenreText: {
    color: 'white',
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ddd',
  },
  tvDescription: {
    fontSize: 20,
    lineHeight: 32,
    marginTop: 20,
    color: '#ddd',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1a1a1a',
    paddingVertical: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  backToHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    alignSelf: 'flex-start',
  },
  backToHomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  similarSection: {
    paddingVertical: 24,
    paddingHorizontal: Platform.isTV ? 40 : 16,
  },
  sectionTitle: {
    fontSize: Platform.isTV ? 24 : 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  similarScrollContent: {
    paddingBottom: 8,
  },
  similarItem: {
    width: Platform.isTV ? 240 : 160,
    height: Platform.isTV ? 135 : 90,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: '100%',
  },
  similarGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  similarTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  similarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarDuration: {
    color: '#ddd',
    fontSize: 12,
    marginLeft: 4,
  },
});