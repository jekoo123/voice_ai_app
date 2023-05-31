import React from "react";
import {
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Toolbar() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      style={styles.style_Toolbar}
      source={require("../assets/Toolbar.png")}
    >
      <TouchableOpacity onPress={() => navigation.navigate("대화")}>
        <Image
          style={styles.style_chat_img}
          source={require("../assets/Chat_img.png")}
        />
        <Text style={styles.text}>대화</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("기록")}>
        <Image
          style={styles.style_chat_img}
          source={require("../assets/Log_img.png")}
        />
        <Text style={styles.text}>로그</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("MY")}>
        <Image
          style={styles.style_chat_img}
          source={require("../assets/My_img.png")}
        />
        <Text style={styles.text}>마이</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("상점")}>
        <Image
          style={styles.style_chat_img}
          source={require("../assets/Shop_img.png")}
        />
        <Text style={styles.text}>상점</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  style_Toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10,
  },
  text: {
    textAlign: "center",
  },
});
