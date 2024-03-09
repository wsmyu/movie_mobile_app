import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Modal,
  ActivityIndicator,
} from 'react-native';

const apiKey = '191767f7a76d9bfc1cb8011f24d6d60e';
var { width, height } = Dimensions.get('window');
const MovieDescriptionPage = ({ route }) => {
  const { id } = route.params;
  console.log('Received movie ID:', id);

  const [movie, setMovie] = useState({});
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [nameText, setNameText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [responseNameText, setResponseNameText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moviePrice, setMoviePrice] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 5,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe right, navigate back
          navigation.goBack();
        }
      },
    })
  ).current;
  const movieDetailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&page=1`;

  const handleNameChange = (text) => {
    setNameText(text);
  };

  const handleResponseNameChange = (text) => {
    setResponseNameText(text);
  };

  const handleReviewChange = (text) => {
    setReviewText(text);
  };

  const loadReviewsFromAsyncStorage = async () => {
    try {
      const idString = id.toString();
      const storedReviewsJson = await AsyncStorage.getItem(idString);
      const storedReviews = JSON.parse(storedReviewsJson) || [];
      setReviews(storedReviews);
    } catch (error) {
      console.error('Error loading reviews from AsyncStorage:', error);
    }
  };

  const getAllResponses = () => {
    const allResponses = reviews.reduce((responses, review) => {
      if (review.responses && review.responses.length > 0) {
        responses.push(...review.responses);
      }
      return responses;
    }, []);

    return allResponses;
  };
  const handleAddReview = async (e) => {
    e.preventDefault();

    if (nameText.trim() !== '' && reviewText.trim() !== '') {
      const newReview = {
        name: nameText,
        text: reviewText,
        date: new Date().toLocaleDateString(),
        responses: [],
      };

      try {
        const idString = id.toString();
        const storedReviewsJson = await AsyncStorage.getItem(idString);
        const storedReviews = JSON.parse(storedReviewsJson) || [];

        const newReviews = [...storedReviews, newReview];

        // Save the updated reviews back to AsyncStorage
        await AsyncStorage.setItem(idString, JSON.stringify(newReviews));

        // Update state with the new reviews
        setReviews(newReviews);
        setReviewText('');
        setNameText('');
      } catch (error) {
        console.error('Error saving review to AsyncStorage:', error);
      }
    }
  };

  const handleResponseChange = (text) => {
    setResponseText(text);
  };

  const handleAddResponse = async (reviewIndex) => {
    try {
      if (responseNameText.trim() !== '' && responseText.trim() !== '') {
        const reviewToUpdate = reviews[reviewIndex];

        if (!reviewToUpdate.responses) {
          reviewToUpdate.responses = [];
        }

        const newResponse = {
          name: responseNameText,
          text: responseText,
          date: new Date().toLocaleDateString(),
        };

        reviewToUpdate.responses.push(newResponse);
         const idString = id.toString();
        // Save the updated reviews back to AsyncStorage
        await AsyncStorage.setItem(idString, JSON.stringify(reviews));

        // Update state with the new reviews
        setReviews([...reviews]);
        setResponseText('');
        setResponseNameText('');
      }
    } catch (error) {
      console.error('Error adding response and saving to AsyncStorage:', error);
    }
  };
  const addToCart = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const movieToAdd = {
        id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        price: moviePrice,
        quantity: 1,
      };

      try {
        let cartJson = await AsyncStorage.getItem('cart');
        let cart = cartJson ? JSON.parse(cartJson) : [];

        const isAlreadyInCart = cart.some(
          (cartItem) => cartItem.id === movie.id
        );

        if (!isAlreadyInCart) {
          cart.push(movieToAdd);
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
          setModalMessage('Movie added to cart!');
          setIsModalVisible(true);
        } else {
          alert('This movie is already in your cart.');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const addToFavorites = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const newFavorite = {
          id: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        };

        let favoritesJson = await AsyncStorage.getItem('favorites');
        let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

        const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id);

        if (!isAlreadyFavorite) {
          // Add the movie to favorites if it's not already there
          favorites.push(newFavorite);
          await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
          setModalMessage('Movie added to favorites!');
          setIsModalVisible(true);
        } else {
          alert('This movie is already in your favorites.');
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log('Fetching movie details from:', movieDetailUrl);
        const response = await fetch(movieDetailUrl);
        const data = await response.json();
        setMovie(data);
        const randomPrice = (Math.random() * (45.99 - 4.99) + 4.99).toFixed(2);
        setMoviePrice(randomPrice);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    // Call the fetch function
    fetchMovieDetails();

    loadReviewsFromAsyncStorage();
    getAllResponses();
  }, [movieDetailUrl]);

  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
        style={styles.posterImage}
      />
      <View style={styles.movieDetails}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.genres}>
          <Text>
            {movie?.genres?.map((genre, index) => {
              return (
                <React.Fragment key={index}>
                  {genre?.name}
                  {index + 1 !== movie.genres.length ? ' • ' : null}
                </React.Fragment>
              );
            })}
          </Text>
        </View>
        <Text style={styles.price}>Price: ${moviePrice}</Text>
        <Text style={styles.text}>{movie.overview}</Text>

        <Text style={styles.text}>Release Date: {movie.release_date}</Text>
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addToFavorites}>
          <Text style={styles.buttonText}>Add to Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={addToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewDisplay}>
        <Text style={styles.reviewTitle}>Audience Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {reviews && reviews.length > 0 ? (
            reviews.map((review, reviewIndex) => (
              <View key={reviewIndex} style={styles.review}>
                <Text style={styles.userName}>{review.name}</Text>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>

                {review.responses && review.responses.length > 0 && (
                  <View style={styles.responses}>
                    <Text style={styles.responsesTitle}>Replies</Text>
                    {review.responses.map((response, responseIndex) => (
                      <View key={responseIndex} style={styles.response}>
                        <Text style={styles.userName}>{response.name}</Text>
                        <Text style={styles.responseText}>{response.text}</Text>
                        <Text style={styles.responseDate}>{response.date}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.responseForm}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor="#6d6f70"
                    value={responseNameText}
                    onChangeText={handleResponseNameChange}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Join the discussion!"
                    placeholderTextColor="#6d6f70"
                    multiline
                    value={responseText}
                    onChangeText={handleResponseChange}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAddResponse(reviewIndex)}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No reviews yet.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.reviewSession}>
        <Text style={styles.reviewTitle}>Create Your Own Review</Text>
        <View style={styles.reviewForm}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#6d6f70"
            value={nameText}
            onChangeText={handleNameChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Write a review"
            placeholderTextColor="#6d6f70"
            multiline
            value={reviewText}
            onChangeText={handleReviewChange}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddReview}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  genres: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  posterImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  movieDetails: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  text: {
    color: '',
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {
    color: 'white',
  },
  reviewDisplay: {
    marginTop: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  review: {
    margin: 10,
    width: width * 0.8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#555',
    padding: 8,
    borderRadius: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  reviewText: {
    color: 'Black',
  },
  reviewSession: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
  },
  reviewDate: {
    color: '#777',
  },
  responses: {
    marginTop: 8,
  },
  responsesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  response: {
    marginTop: 8,
  },
  responseForm: {
    marginTop: 8,
  },
  input: {
    backgroundColor: '#e3e5e6',
    color: 'black',

    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
  },
  responseText: {
    color: 'black',
  },
  responseDate: {
    color: '#777',
  },
  reviewForm: {
    marginTop: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
});

export default MovieDescriptionPage;
