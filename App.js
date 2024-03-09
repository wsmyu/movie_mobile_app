
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './components/AppNavigator'; // Replace with your actual navigation component

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
