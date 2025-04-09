import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const OtpScreen = ({ route, navigation }) => {
  const { confirmation, phoneNumber } = route.params; // Get phoneNumber and confirmation object
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Assuming a 6-digit OTP
  const otpInputsRefs = Array(6).fill(null).map(() => useRef(null)); // Create refs for input fields

  useEffect(() => {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setCanResend(true); // Enable resend OTP after timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }, []);

    const resendOtp = async () => {
      if (!canResend) return;

      try {
        let formattedPhoneNumber = phoneNumber.trim();

        // Ensure consistent E.164 format with '+91-'
        formattedPhoneNumber = formattedPhoneNumber.replace(/[^\d+]/g, ''); // Remove unwanted characters

        if (!formattedPhoneNumber.startsWith('+91')) {
          formattedPhoneNumber = `+91-${formattedPhoneNumber}`;
        } else if (formattedPhoneNumber.startsWith('+91') && !formattedPhoneNumber.startsWith('+91-')) {
          formattedPhoneNumber = formattedPhoneNumber.replace('+91', '+91-'); // Ensure `+91-` format
        }

        if (formattedPhoneNumber.length < 10 || formattedPhoneNumber.length > 15) {
          alert("Please enter a valid phone number.");
          return;
        }

        // Send OTP
        const newConfirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
        navigation.replace('OtpScreen', { confirmation: newConfirmation, phoneNumber: formattedPhoneNumber });

        setTimer(60);
        setCanResend(false);
      } catch (error) {
        alert(error.message || "Failed to resend OTP. Please try again.");
      }
    };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) return; // Restrict to one character per box

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to the next input box automatically
    if (text && index < otp.length - 1) {
      otpInputsRefs[index + 1].current.focus();
    }

    // If last digit is entered, verify OTP automatically
    if (index === otp.length - 1 && newOtp.every(digit => digit !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  // Function to verify OTP
  const verifyOtp = async (enteredOtp) => {
    try {
      await confirmation.confirm(enteredOtp); // Firebase OTP verification
      navigation.replace('Home'); // Redirect to home if OTP is correct
    } catch (error) {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.otpMessage}>
        We have sent a 6-digit OTP to +91-{phoneNumber.replace(/^(\+91-?)/, '')}.
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={otpInputsRefs[index]}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>
      {/* Resend OTP Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the OTP?</Text>
          {canResend ? (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resendLink}> Click here to resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}> Resend in {timer}s</Text>
          )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },

  otpMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 25,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10, // Rounded corners
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
    borderColor: '#90AEE0',
    backgroundColor: '#fff',
    elevation: 2, // Shadow for better UI
  },

  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },

  resendText: {
    fontSize: 14,
    color: '#666'
  },

  timerText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#999'
  },

  resendLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF'
  },
});

export default OtpScreen;
