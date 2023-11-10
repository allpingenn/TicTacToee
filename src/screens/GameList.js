import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

import React, { useEffect, useState } from "react";

const GameList = ({ navigation }) => {
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    onSnapshot(collection(db, "game"), (snapshot) => {
      updateFetchData();
    });
  };

  const updateFetchData = async () => {
    const datas = [];
    const querySnapshot = await getDocs(collection(db, "game"));
    querySnapshot.forEach((doc) => {
      datas.push(doc.data());
    });
    setGameData(datas);
  };

  const goGame = (value, playerIcon) => {
    navigation.navigate("Game", { gameId: value, playerIcon: playerIcon });
  };

  const createGame = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const username = await AsyncStorage.getItem("username");

    try {
      const docRef = await addDoc(collection(db, "game"), {
        userId: userId,
        player1: username,
        row0: ["", "", ""],
        row1: ["", "", ""],
        row2: ["", "", ""],
        player: "X",
        isGameOpen: true
      });
      const gameId = docRef.id;
      const ref = doc(db, "game", gameId);

      await updateDoc(ref, {
        gameId: gameId,
      });
      const playerIcon = "X";
      goGame(gameId,playerIcon);
    } catch (e) {
      console.log("error:", e);
    }
  };

  const joinGame = async (gameId) => {
    const username = await AsyncStorage.getItem("username");
    const docRef = doc(db, "game", gameId);

    await updateDoc(docRef, {
      player2: username,
      isGameOpen: false
    }).then(() => {
      const playerIcon = "O";
      goGame(gameId,playerIcon);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Game List</Text>
      </View>
      <ScrollView style={{ width: "100%" }}>
        <View>
          {gameData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.cardContainer, { opacity: item.isGameOpen ? 1 : 0.5 }]}
              onPress={() => {
                item.isGameOpen ? 
                joinGame(item.gameId)
              : null}}
            >
              <View style={styles.card}>
                <View style={styles.gameTextContainer}>
                  <Text style={styles.gameTextTitle}>{item.player1}</Text>
                  <Text style={styles.gameTextTitle}>{item.player2}</Text>
                </View>
                <Text style={styles.gameText}>{item.gameId}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => createGame()}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    paddingTop: 65,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: "black",
    height: 75,
    width: 75,
    borderRadius: 75,
    position: "absolute",
    bottom: 50,
    right: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 45,
  },
  cardContainer: {
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  gameText: {
    fontSize: 18,
  },
  gameTextTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gameTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
