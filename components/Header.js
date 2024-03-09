import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const Header = ({ navigation }) => {
  const handleTitleClick = () => {
    navigation.navigate('Home');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity>
            <Ionicons
              name="menu"
              size={24}
              color="white"
              onPress={() => navigation.navigate('Menu')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTitleClick}>
            <Text style={styles.headerTitle}>Movie Max</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={styles.searchButton}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'ios' ? 10 : 0, 

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    padding: 10,
    height: 50,
    paddingTop: 10, // Adjust for iOS status bar
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchButton: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Header;
