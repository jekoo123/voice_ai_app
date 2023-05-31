import React, { useState } from "react";
import { SERVER_IP } from "../config";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setId } from "../storage/actions";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const response = await axios.post(`${SERVER_IP}/login`, {
      id: id,
      password: password,
    });

    if (response.data.message === "Success") {
      await AsyncStorage.setItem('user_id', id);
      Alert.alert("Success!", "로그인 성공.");
      dispatch(setId(id));
      navigation.navigate("대화");
    } else {
      Alert.alert("Fail", "정보가 일치하지 않습니다.");
      setID("");
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <TextInput
          style={styles.input}
          placeholder="ID"
          value={id}
          onChangeText={setID}
        />
        <TextInput
          style={styles.input}
          placeholder="PassWord"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("회원가입");
          }}
        >
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
  },
  frame: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  button: {
    height: 40,
    backgroundColor: "#FDF5E6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "#708090",
    fontWeight: "bold",
  },
});
