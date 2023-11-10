import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { firebaseConfig, db } from "../../firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  var inputText = "";

  var onChangeText = (value) => {
    inputText = value;
  };

  const goGameList = () => {
    navigation.navigate("GameList");
  };

  const storeData = async (userId, username) => {
    try {
      await AsyncStorage.setItem("userId", userId);
      await AsyncStorage.setItem("username", username);
    } catch (e) {
      console.log("error:", e);
    }
  };

  const onPress = () => {
    signInAnonymously(auth).then(async (userCredential) => {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          player1: inputText,
        });
        storeData(docRef.id, inputText);
        goGameList();
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Tik Tak Toe</Text>
      
      <TextInput
        style={styles.input}
        onChangeText={(value) => {
          onChangeText(value);
        }}
        placeholder="username"
      />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          onPress();
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 250,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 65,
  },

  buttonContainer: {
    backgroundColor: "black",
    paddingHorizontal: 115,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  input: {
    width: 300,
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
});
