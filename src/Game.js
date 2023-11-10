import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  where,
  updateDoc,
  getDocs,
  query,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebaseConfig.js";

import Board from "./Board";

const Game = ({ route, navigation }) => {
  const { gameId, playerIcon } = route.params;


  const ref = doc(db, "game", gameId);

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [playerTurned, setPlayerTurned] = useState("");

  const initialBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    checkWinner();
  }, [board]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    onSnapshot(collection(db, "game"), (snapshot) => {
    fetchPlayers();  
    });
  };

  const fetchPlayers = async () => {
    const q = query(collection(db, "game"), where("gameId", "==", gameId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setPlayer1(doc.data().player1);
      setPlayer2(doc.data().player2 ?? "");
      setPlayerTurned(doc.data().player);
      setBoard([doc.data().row0,
        doc.data().row1,
        doc.data().row2 ])
    });
  };

  const updateBoard = async (rowIndex, newBoard) => {
    switch (rowIndex) {
      case 0:
        await updateDoc(ref, {
          row0: newBoard,
        });
        break;
      case 1:
        await updateDoc(ref, {
          row1: newBoard,
        });
        break;
      case 2:
        await updateDoc(ref, {
          row2: newBoard,
        });
        break;
      default:
        break;
    }
  };

  const playerTurn = async () => {
    await updateDoc(ref, {
      player: playerIcon === "X" ? "O" : "X",
    });
  };

  const handlePress = (rowIndex, cellIndex) => {
    if ( playerIcon === playerTurned) {
      if (board[rowIndex][cellIndex] === "" && !winner) {
        const newBoard = [...board];
        newBoard[rowIndex][cellIndex] = playerIcon;
        updateBoard(rowIndex, newBoard[rowIndex]);
        playerTurn();
      }
    }
    
  };

  const checkWinner = () => {
    //rows checking
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== "" &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        setWinner(board[i][0]);
        break;
      }
    }

    // columns checking
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== "" &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        setWinner(board[0][i]);
        break;
      }
    }

    //diagonal checking
    if (
      board[0][0] !== "" &&
      board[0][0] === board[1][2] &&
      board[0][0] === board[2][2]
    ) {
      setWinner(board[0][0]);
    } else if (
      board[0][2] !== "" &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      setWinner(board[0][2]);
    }
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setPlayer("X");
    setWinner("");
  };

  useEffect(() => {
    if (winner) {
      Alert.alert(`Player ${winner} won!`, " ", [
        { text: "OK", onPress: closeGame },
      ]);
    }
  }, [winner]);

  const closeGame = () => {
    navigation.navigate("GameList");
  }

  useEffect(() => {
    if (!winner) {
      const isBoardFull = board.every((row) =>
        row.every((cell) => cell !== "")
      );
      if (isBoardFull) {
        Alert.alert("It's a tie!", " ", [{ text: "OK", onPress: resetBoard }]);
      }
    }
  }, [board]);

  return (
    <View style={styles.container}>
      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>{player1}</Text>
        <Text style={styles.playersTitle}>{player2}</Text>
      </View>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Board board={board} onPress={handlePress} />
    </View>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  playersContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 130,
  },
  playersTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
