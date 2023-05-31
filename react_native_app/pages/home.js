import React, { useState, useEffect } from "react";
import {  Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import { setId } from '../storage/actions';

export default function HomeScreen({ navigation }) {
  const [savedId, setSavedId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        setSavedId(userId);
        dispatch(setId(userId));
      }
    };

    loadUserData();
  }, []);

  return (
    <ImageBackground style={styles.homeContainer}
      source={require("../assets/Ai_default.png")}
    >
      <TouchableOpacity
        style={styles.home}
        onPress={() => savedId ? 
          navigation.navigate("대화"):
          navigation.navigate("로그인")}
      >
        <Text style={styles.buttonText}>Start to Talk</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
  home: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 5,
  },
});
