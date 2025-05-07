import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Animated, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface VideoPlayerProps {
  videoUri: string;
  thumbnailUri?: string;
  title?: string;
}

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;
const videoHeight = isLandscape ? height * 0.9 : width * 0.5625; // 16:9 aspect ratio

export const VideoPlayer = ({ videoUri, thumbnailUri, title }: VideoPlayerProps) => {
  const [status, setStatus] = useState<any>({});
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef<Video>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const isTVMode = Platform.isTV;
  const router = useRouter();

  useEffect(() => {
    if (controlsVisible && !isTVMode && status.isPlaying) {
      // Auto-hide controls after 3 seconds
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        hideControls();
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [controlsVisible, status.isPlaying]);

  // Handle buffering state change
  useEffect(() => {
    if (status.isBuffering) {
      setIsBuffering(true);
    } else if (status.isLoaded && status.isPlaying) {
      setIsBuffering(false);
    }
    
    if (status.isLoaded) {
      setIsVideoReady(true);
    }
  }, [status]);

  const hideControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setControlsVisible(false));
  };

  const showControls = () => {
    setControlsVisible(true);
    fadeAnim.setValue(1);
    
    if (!isTVMode && status.isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        hideControls();
      }, 3000);
    }
  };

  const formatTime = (milliseconds: number) => {
    if (!milliseconds) return '0:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      showControls();
    }
  };

  const toggleControls = () => {
    if (controlsVisible) {
      hideControls();
    } else {
      showControls();
    }
  };

  const seekBackward = async () => {
    if (videoRef.current && status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 10000);
      await videoRef.current.setPositionAsync(newPosition);
      showControls();
    }
  };

  const seekForward = async () => {
    if (videoRef.current && status.positionMillis && status.durationMillis) {
      const newPosition = Math.min(status.durationMillis, status.positionMillis + 10000);
      await videoRef.current.setPositionAsync(newPosition);
      showControls();
    }
  };

  const calculateProgress = () => {
    if (!status.durationMillis) return 0;
    return (status.positionMillis / status.durationMillis) * 100;
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={[
      styles.container, 
      isTVMode && isLandscape && styles.tvLandscapeContainer
    ]}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={toggleControls} 
        style={styles.videoContainer}
      >
        {/* Thumbnail shows until video is ready */}
        {thumbnailUri && isBuffering && !isVideoReady && (
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.bufferingOverlay}>
              <View style={styles.bufferingIndicator} />
            </View>
          </View>
        )}

        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUri }}
          useNativeControls={isTVMode}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          shouldPlay={true}
          progressUpdateIntervalMillis={200}
        />
        
        {/* Header Overlay with Back Button and Title */}
        <Animated.View 
          style={[
            styles.headerOverlay, 
            { opacity: fadeAnim }
          ]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            {title && (
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </Text>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Buffering Indicator */}
        {isBuffering && (
          <View style={styles.bufferingContainer}>
            <View style={styles.bufferingIndicator} />
            <Text style={styles.bufferingText}>Loading...</Text>
          </View>
        )}

        {!isTVMode && controlsVisible && (
          <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.controlsGradient}
            >
              <View style={styles.progressBarContainer}>
                <Text style={styles.timeText}>
                  {formatTime(status.positionMillis || 0)}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]} />
                  <View 
                    style={[
                      styles.progressHandle, 
                      { left: `${calculateProgress()}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.timeText}>
                  {formatTime(status.durationMillis || 0)}
                </Text>
              </View>
              
              <View style={styles.controlsRow}>
                <TouchableOpacity onPress={seekBackward} style={styles.controlButton}>
                  <Ionicons name="play-back" size={24} color="white" />
                  <Text style={styles.controlText}>10s</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                  <Ionicons 
                    name={status.isPlaying ? "pause" : "play"} 
                    size={30} 
                    color="white" 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={seekForward} style={styles.controlButton}>
                  <Ionicons name="play-forward" size={24} color="white" />
                  <Text style={styles.controlText}>10s</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
        
        {/* Time display for TV mode */}
        {isTVMode && (
          <View style={styles.tvControlsOverlay}>
            <Text style={styles.tvTimeDisplay}>
              {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
  },
  tvLandscapeContainer: {
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: videoHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.isTV ? 30 : 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bufferingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopColor: '#0077ff',
    transform: [{ rotate: '45deg' }],
    margin: 8,
  },
  bufferingText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  controlsGradient: {
    padding: 16,
    paddingBottom: 24,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0077ff',
    borderRadius: 3,
  },
  progressHandle: {
    position: 'absolute',
    top: -6,
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0077ff',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,119,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  tvControlsOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
  },
  tvTimeDisplay: {
    color: '#FFFFFF',
    fontSize: Platform.isTV ? 20 : 16,
    fontWeight: '600',
  },
});