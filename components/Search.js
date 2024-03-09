import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  FlatList,
  Image,
} from 'react-native';


const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [movies, setMovies] = useState([]);

  const getMovieRequest = (searchValue) => {
    const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=41f83b90&plot=full`;
    console.log(searchValue);
    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setMovies(json.Search);
        console.log(movies);
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = () => {
    getMovieRequest(searchQuery);
  };


  const handleMovieClick = (id) => {
   navigation.navigate('Movie Description Page', {
      id: id,
    });
  };

  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for movies..."
          value={searchQuery}
            onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(); 
          }}
            
        />

      </View>
    <Text style={styles.title}>Search Result</Text>
  
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.imdbID}
            onPress={() => handleMovieClick(item.imdbID)}
            style={styles.posterContainer}>
            <View>
              <Image style={styles.posterImage} source={{ uri: item.Poster }} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  posterContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 2 / 3,
  },
  posterImage: {
    width: 100, // Adjust this value based on your layout
    height: 150, // Adjust this value based on your layout
    borderRadius: 5,
    margin: 5,
  },
  title:{
    marginTop:10
  }
});
export default Search;
