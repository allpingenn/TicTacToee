import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { firebaseConfig } from "../firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const Splash = ({ navigation }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const goSignIn = () => {
    navigation.navigate("SignIn");
  };

  const goGameList = () => {
    navigation.navigate("GameList");
  };

  const checkUser = () => {
    const user = auth.currentUser;

    if (user != null) {
      goGameList();
    } else {
      goSignIn();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe Games</Text>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => checkUser()}
      >
        <Text style={styles.buttonText}>Let's Play</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 50,
  },
  buttonContainer: {
    backgroundColor: "black",
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
