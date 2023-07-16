import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  setCredit,
  setItem,
  equip,
  setUser,
  settingSave,
  resetState
} from "../storage/actions";
import axios from "axios";
import { SERVER_IP } from "../config";

export default function HomeScreen({ navigation }) {
  const [savedId, setSavedId] = useState("");
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
      dispatch(resetState);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        setSavedId(userId);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (savedId !== "") {
      fetchFromServer();
    }
  }, [savedId]);

  const fetchFromServer = async () => {
    try {
      const response = await axios.post(`${SERVER_IP}/fetch`, {
        id: savedId,
      });
      temp = [savedId, response.data.language, response.data.context];
      dispatch(setUser(temp));
      dispatch(settingSave(response.data.list));
      dispatch(setCredit(response.data.credit));
      dispatch(setItem(response.data.item));
      dispatch(equip(response.data.equip));
      console.log(response.data.credit);
    } catch (error) {}
  };
  return (
    <ImageBackground
      style={styles.homeContainer}
      source={require("../assets/Ai_default.png")}
    >
      {/* <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View> */}
      <TouchableOpacity
        style={styles.home}
        onPress={() =>
          savedId ? navigation.navigate("대화") : navigation.navigate("로그인")
        }
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
