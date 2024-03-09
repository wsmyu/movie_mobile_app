import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CartPage = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [orderSent, setOrderSent] = useState(false); 

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartJson = await AsyncStorage.getItem('cart');
        if (cartJson !== null) {
          setCart(JSON.parse(cartJson));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  const saveCart = async (newCart) => {
    try {
      const cartJson = JSON.stringify(newCart);
      await AsyncStorage.setItem('cart', cartJson);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };
  const totalPrice = calculateTotalPrice();

  const handleCheckout = () => {
    Alert.alert('Checkout', 'Proceed to Checkout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'OK', 
        onPress: async () => {
          console.log('Proceeding to checkout...');
          await AsyncStorage.removeItem('cart'); // Clear the cart
          setCart([]);
          setOrderSent(true); 
        }
      },
    ]);
  };

  const increaseQuantity = (movieId) => {
    const newCart = cart.map((item) => {
      if (item.id === movieId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setCart(newCart);
    saveCart(newCart);
  };

  const decreaseQuantity = (movieId) => {
    const newCart = cart.map((item) => {
      if (item.id === movieId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (movieId) => {
    const newCart = cart.filter((item) => item.id !== movieId);

    setCart(newCart);
    saveCart(newCart);
  };

  const renderItem = ({ item }) => (
    <View style={styles.movieContainer}>
      <Image source={{ uri: item.poster }} style={styles.posterImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Unit Price: ${item.price}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <View style={styles.quantityButtons}>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
            <Text style={styles.quantityButtonsText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
            <Text style={styles.quantityButtonsText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}>
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
 if (orderSent) {
    return (
      <View style={styles.container}>
        <Text style={styles.boldText}>Your order has been sent!</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Your Cart</Text>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
          <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}>
            <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.boldText}>Your cart is empty</Text>
      )}
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
    textAlign: 'center',
    marginBottom: 20,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButtonsText: {
    padding: 5,
    color: 'blue',
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButtonText: {
    color: 'red',
    padding: 5,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 5,
  },
     boldText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CartPage;
