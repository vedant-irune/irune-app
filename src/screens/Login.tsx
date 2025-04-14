import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_ID } from '@env';

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_ID,
    });
  }, []);

  const onGoogleButtonPress = async () => {
      try {
        await GoogleSignin.signOut();

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        const signInResult = await GoogleSignin.signIn();
        let idToken = signInResult.idToken || signInResult.data?.idToken;

        if (!idToken) {
          throw new Error('No ID token found');
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);

        Alert.alert('Success', 'Google Sign-In successful');
        navigation.replace('Home');
      } catch (error) {
        console.error('Google Sign-In Error:', JSON.stringify(error, null, 2));

        let message = 'Google Sign-In failed. Please try again.';
        if (typeof error === 'object' && error !== null) {
          message = error.message || message;
        }

        Alert.alert('Error', message);
      }
    };

  const handleContinue = () => {
      if (phoneNumber.length !== 10) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
        return;
      }

      auth()
        .signInWithPhoneNumber(`+91${phoneNumber}`)
        .then((confirmation) => {
          navigation.navigate('OtpScreen', { confirmation, phoneNumber });
        })
        .catch((error) => {
          console.error('OTP Error:', error);
          Alert.alert('Error', 'Failed to send OTP. Please try again.');
        });
    };

return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.topHalf}>
          <Image source={require('../assets/loginImage.png')} style={styles.topImage} />
        </View>

        <View style={styles.bottomHalf}>
          <Text style={styles.introText}>Pressed. Packed. Delivered - Instantly!</Text>

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.text}>Log in or sign up</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.phoneInputContainer}>
            <View style={styles.flagBox}>
              <Image source={require('../assets/indiaFlag.png')} style={styles.flag} />
            </View>

            <View style={styles.phoneNumberBox}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={(text) => setPhoneNumber(text)}
                value={phoneNumber}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Verify via OTP</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>
            <TouchableOpacity style={styles.googleButton} activeOpacity={0.6} onPress={onGoogleButtonPress}>
            <Image source={require('../assets/googleLogo.png')} style={styles.googleLogo} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHalf: {
    flex: 1,
    backgroundColor: '#90AEE0',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Sanchez-Regular',
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#000',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  flagBox: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  flag: {
    width: 30,
    height: 35,
  },
  phoneNumberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#90AEE0',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
  },
  googleButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 40,
    height: 40,
  },
});

export default Login;