import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import axios from "axios";

export default function SignupScreen({ navigation }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const onSignupPress = async () => {
    if (password !== confirmPassword) {
      setId("");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    const response = await axios.post("http://192.168.0.32:5000/signup", {
      id: id,
      password: password,
      name: name,
    });
    if (response.data.message === "Success") {
      Alert.alert("Success!", "회원가입 성공.");
      navigation.navigate("로그인");
    } else {
      Alert.alert("Fail", "정보가 일치하지 않습니다.");
      setId("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <TextInput
          value={id}
          onChangeText={(text) => setId(text)}
          placeholder={"ID"}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder={"Password"}
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          placeholder={"Confirm Password"}
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder={"Name"}
          style={styles.input}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onSignupPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  frame: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  button: {
    width: 250,
    height: 40,
    backgroundColor: "#FDF5E6",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#708090",
    fontWeight: "bold",
  },
});


