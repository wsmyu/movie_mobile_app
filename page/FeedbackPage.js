import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import * as Progress from 'react-native-progress';

const FeedbackPage = () => {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFeedbackSubmit = () => {
    if (!rating || !feedback) {
      Alert.alert('Error', 'Please provide all the information.');
      return;
    }

    setIsModalVisible(true);
  };

  const handleConfirmSubmit = () => {
    Alert.alert(
      'Feedback Submitted',
      `Rating: ${rating}\nFeedback: ${feedback}\nLast Name: ${lastName}\nPhone Number: ${phoneNumber}\nEmail: ${email}`
    );

    setRating('');
    setFeedback('');
    setEmail('');
    setLastName('');
    setPhoneNumber('');

    setIsModalVisible(false);
  };

  const handleCancelSubmit = () => {
    setIsModalVisible(false);
  };

  const calculateProgress = () => {
    const fields = [rating, feedback, email, lastName, phoneNumber];
    const filledFields = fields.filter((field) => field !== '');
    const progress = filledFields.length / fields.length;
    return progress >= 1 ? 1 : progress;
  };

  return (
    <ScrollView style={styles.container}>
      <Progress.Bar
        progress={calculateProgress()}
        width={null}
        color={calculateProgress() === 1 ? 'green' : 'red'}
        style={styles.progressBar}
      />
      <Text style={styles.heading}>Feedback Section</Text>

      <View style={styles.inputContainer}>
        <Text>Rating (1-5):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rating}
          onChangeText={(text) => setRating(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Feedback:</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={feedback}
          onChangeText={(text) => setFeedback(text)}
        />
      </View>

      <Text style={styles.heading}>Personal Information Section</Text>

      <View style={styles.inputContainer}>
        <Text>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Phone Number:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Email:</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleFeedbackSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Confirm Submission?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmSubmit}>
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelSubmit}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  progressBar: {
    marginBottom: 20,
    borderColor: 'black'
  },
});

export default FeedbackPage;