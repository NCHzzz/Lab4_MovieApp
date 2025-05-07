import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, Platform, Dimensions, Text, ScrollView, 
         SafeAreaView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MovieCard } from '../components/MovieCard';
import { mockMovies } from '../data/movies';
import { router } from 'expo-router';

// Create categorized sections
const categories = {
  featured: mockMovies.slice(0, 6),
  animation: mockMovies.filter(movie => movie.genre.includes('Animation')),
  commercial: mockMovies.filter(movie => movie.genre.includes('Commercial')),
  other: mockMovies.filter(movie => !movie.genre.includes('Animation') && !movie.genre.includes('Commercial')),
};

export default function HomeScreen() {
  const [isTVMode, setIsTVMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { width, height } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    // Check if running on TV platform
    setIsTVMode(Platform.isTV || Platform.OS === 'android' && Platform.Version >= 24);
  }, []);
  
  const isLandscape = width > height;
  const numColumns = isTVMode ? 
    (isLandscape ? 6 : 3) : // 6 columns for TV landscape
    (isLandscape ? 3 : 2);  // 3 columns for mobile landscape
  
  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {isTVMode && <View style={styles.sectionDivider} />}
    </View>
  );

  const handleBackToTop = () => {
    // Scroll to top of screen
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const renderFeaturedMovie = () => {
    const featured = mockMovies[0];
    return (
      <TouchableOpacity 
        style={styles.featuredContainer}
        onPress={() => router.push(`/${featured.id}`)}
      >
        <ImageBackground
          source={{ uri: featured.thumbnail }}
          style={styles.featuredBackground}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredDescription} numberOfLines={2}>
                {featured.description}
              </Text>
              <View style={styles.featuredMeta}>
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.durationText}>{featured.duration}</Text>
                </View>
                {featured.genre.map((g, i) => (
                  <View key={i} style={styles.genreBadge}>
                    <Text style={styles.genreText}>{g}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.playText}>Play Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderCategoryTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryTabsContainer}
      contentContainerStyle={styles.categoryTabs}
    >
      {['all', 'animation', 'commercial', 'documentary'].map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryTab, 
            activeCategory === category && styles.activeTab
          ]}
          onPress={() => setActiveCategory(category)}
        >
          <Text style={[
            styles.categoryTabText,
            activeCategory === category && styles.activeTabText
          ]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
    
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Modern Header with Logo and Search */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="film-outline" size={isTVMode ? 32 : 24} color="#0077ff" />
            <Text style={styles.headerTitle}>MovieFlix</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={isTVMode ? 28 : 22} color="#fff" />
          </TouchableOpacity>
        </View>

        {isTVMode ? (
          // TV Layout with sections
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView}
          >
            {/* Featured Movie Banner */}
            {renderFeaturedMovie()}
            
            {/* Category Selection */}
            {renderCategoryTabs()}

            <View style={styles.section}>
              {renderSectionHeader("Featured")}
              <FlatList
                horizontal
                data={categories.featured}
                renderItem={({ item, index }) => (
                  <MovieCard movie={item} isTVMode={true} index={index} />
                )}
                keyExtractor={(item) => `featured-${item.id}`}
                contentContainerStyle={styles.horizontalList}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            
            <View style={styles.section}>
              {renderSectionHeader("Animation")}
              <FlatList
                horizontal
                data={categories.animation}
                renderItem={({ item, index }) => (
                  <MovieCard movie={item} isTVMode={true} index={0} />
                )}
                keyExtractor={(item) => `animation-${item.id}`}
                contentContainerStyle={styles.horizontalList}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            
            <View style={styles.section}>
              {renderSectionHeader("Commercial")}
              <FlatList
                horizontal
                data={categories.commercial}
                renderItem={({ item }) => (
                  <MovieCard movie={item} isTVMode={true} index={0} />
                )}
                keyExtractor={(item) => `commercial-${item.id}`}
                contentContainerStyle={styles.horizontalList}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <TouchableOpacity 
              style={styles.backToTopButton}
              onPress={handleBackToTop}
            >
              <Ionicons name="arrow-up-circle" size={24} color="white" />
              <Text style={styles.backToTopText}>Back to Top</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          // Mobile Layout
          <ScrollView ref={scrollViewRef}>
            {/* Featured Movie Banner */}
            {renderFeaturedMovie()}
            
            {/* Category Selection */}
            {renderCategoryTabs()}
            
            <FlatList
              data={activeCategory === 'all' ? mockMovies : 
                    categories[activeCategory as keyof typeof categories] || mockMovies}
              numColumns={numColumns}
              key={`grid-${numColumns}-${activeCategory}`}
              renderItem={({ item, index }) => (
                <MovieCard movie={item} isTVMode={false} index={index} />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.gridContainer}
              scrollEnabled={false}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.isTV ? 30 : 16,
    paddingBottom: Platform.isTV ? 20 : 10,
    paddingHorizontal: Platform.isTV ? 40 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: Platform.isTV ? 36 : 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchButton: {
    width: Platform.isTV ? 48 : 38,
    height: Platform.isTV ? 48 : 38,
    borderRadius: Platform.isTV ? 24 : 19,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: Platform.isTV ? 40 : 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Platform.isTV ? 40 : 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: Platform.isTV ? 24 : 18,
    fontWeight: 'bold',
  },
  sectionDivider: {
    flex: 1,
    height: 2,
    backgroundColor: '#2a2a2a',
    marginLeft: 16,
  },
  horizontalList: {
    paddingLeft: Platform.isTV ? 40 : 16,
  },
  gridContainer: {
    padding: Platform.isTV ? 10 : 4,
    paddingHorizontal: Platform.isTV ? 40 : 16,
  },
  backToTopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,119,255,0.2)',
    borderRadius: 25,
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#0077ff',
  },
  backToTopText: {
    color: '#0077ff',
    fontSize: 16,
    marginLeft: 8,
  },
  // Featured movie styles
  featuredContainer: {
    width: '100%',
    height: Platform.isTV ? 400 : 240,
    marginBottom: 16,
  },
  featuredBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Platform.isTV ? 40 : 16,
  },
  featuredContent: {
    maxWidth: Platform.isTV ? '50%' : '100%',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: Platform.isTV ? 36 : 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  featuredDescription: {
    color: '#ddd',
    fontSize: Platform.isTV ? 18 : 14,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  genreBadge: {
    backgroundColor: 'rgba(0,119,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  playText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Category tabs
  categoryTabsContainer: {
    marginVertical: 16,
  },
  categoryTabs: {
    paddingHorizontal: Platform.isTV ? 40 : 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#1a1a1a',
  },
  activeTab: {
    backgroundColor: '#0077ff',
  },
  categoryTabText: {
    color: '#aaa',
    fontSize: Platform.isTV ? 18 : 14,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});