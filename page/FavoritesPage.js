import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setFavorites, deleteFavorite, clearFavorites } from '../redux/actions';

const FavoritesPage = ({ favorites, setFavorites, deleteFavorite, clearFavorites }) => {
  const navigation = useNavigation();
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  const deleteFavoriteHandler = (movieId) => {
    Alert.alert(
      'Delete Favorite',
      'Are you sure you want to remove this movie from your favorites?',
      [
        {
          text: 'OK',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(
                (favorite) => favorite.id !== movieId
              );
              await AsyncStorage.setItem(
                'favorites',
                JSON.stringify(updatedFavorites)
              );
              deleteFavorite(movieId);
            } catch (error) {
              console.error('Error deleting favorite:', error);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const clearFavoritesHandler = async () => {
    setIsClearModalVisible(true);
  };

  const confirmClearFavorites = async () => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify([]));
      clearFavorites();
      setIsClearModalVisible(false);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesJson = await AsyncStorage.getItem('favorites');
        if (favoritesJson !== null) {
          setFavorites(JSON.parse(favoritesJson));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  const navigateToMovieDescription = (movieId) => {
    navigation.navigate('Movie Description Page', { id: movieId });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Your Favorites</Text>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieContainer}>
              <TouchableOpacity
                onPress={() => navigateToMovieDescription(item.id)}>
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFavoriteHandler(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No Favorites Movie Added </Text>
      )}
      {favorites.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFavoritesHandler}>
          <Text style={styles.buttonText}>Clear Favorites</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={isClearModalVisible}
        onRequestClose={() => setIsClearModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to clear all favorites?
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={confirmClearFavorites}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsClearModalVisible(false)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  movieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clearButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
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
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonText: {
    color: 'white',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 5,
    marginLeft: 'auto',
  },
});

const mapStateToProps = (state) => ({
  favorites: state.favorites,
});

const mapDispatchToProps = {
  setFavorites,
  deleteFavorite,
  clearFavorites,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesPage);
