import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const apiKey = '191767f7a76d9bfc1cb8011f24d6d60e';
const trendingUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
const HomePage = ({ navigation }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchMovies = async (url, setState) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setState(data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovies(trendingUrl, setTrendingMovies);
    fetchMovies(topRatedUrl, setTopRatedMovies);
    fetchMovies(nowPlayingUrl, setNowPlayingMovies);
    fetchMovies(upcomingUrl, setUpcomingMovies);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
    }).start();
    console.log(fadeAnim);
  }, []);

  const handleMovieClick = (id) => {
    navigation.navigate('Movie Description Page', {
      id: id,
    });
  };

  const renderMoviePosters = (movieList) => {
    return movieList.slice(0, 10).map((movie) => (
      <TouchableOpacity
        key={movie.id}
        onPress={() => handleMovieClick(movie.id)}>
        <View style={styles.movieContainer}>
          <Image
            style={styles.posterImage}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            }}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ ...styles.banner, opacity: fadeAnim }}>
        <Text style={styles.bannerText}>Welcome to Movie Max</Text>
      </Animated.View>
      <View style={styles.movieRow}>
        <Text style={styles.sectionTitle}>Trending Movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderMoviePosters(trendingMovies)}
        </ScrollView>
      </View>
      <View style={styles.movieRow}>
        <Text style={styles.sectionTitle}>Top Rated Movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderMoviePosters(topRatedMovies)}
        </ScrollView>
      </View>
      <View style={styles.movieRow}>
        <Text style={styles.sectionTitle}>Now Playing Movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderMoviePosters(nowPlayingMovies)}
        </ScrollView>
      </View>
      <View style={styles.movieRow}>
        <Text style={styles.sectionTitle}>Upcoming Movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderMoviePosters(upcomingMovies)}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
    gap: 20,
  },
  banner: {
    backgroundColor: '#474643',
    height: 100,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieContainer: {
    marginHorizontal: 5,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  movieRow: {
    marginTop: 20,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
