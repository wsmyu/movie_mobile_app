import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../page/HomePage';
import MovieDescriptionPage from '../page/MovieDescriptionPage';
import Header from './Header';
import Search from './Search';
import MenuPage from '../page/MenuPage';
import FeedbackPage from '../page/FeedbackPage';
import FavoritesPage from '../page/FavoritesPage';
import CartPage from '../page/CartPage';

const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Menu" component={MenuPage} />
        <Stack.Screen
          name="Movie Description Page"
          component={MovieDescriptionPage}
        />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Feedback" component={FeedbackPage} />
        <Stack.Screen name="Favorites" component={FavoritesPage} />
                <Stack.Screen name="Cart" component={CartPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
