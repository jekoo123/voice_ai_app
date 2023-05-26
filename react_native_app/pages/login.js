import { React, useState } from "react";
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

export default function LoginScreen({ navigation }) {
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    // Alert.alert(
    //   "Login Information",
    //   `Username: ${username}\nPassword: ${password}`
    // );
    const response = await axios.post("http://192.168.0.8:5000/login", {
      id: id,
      password: password,
    });

    if (response.data.message === "Success") {
      Alert.alert("Success!", "로그인 성공.");
      dispatch(setId(id));
      navigation.navigate("대화");
    } else {
      Alert.alert("Fail", "정보가 일치하지 않습니다.");
      setId("");
      setPassword("");
    }
  };

  return (
    <View>
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
        style={styles.gotoButton}
        onPress={() => {
          navigation.navigate("회원가입");
        }}
      >
        <Text>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gotoButton} onPress={handleSubmit}>
        <Text>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  gotoButton: {},
});
