import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.home_container}>
      <TouchableOpacity
        style={styles.home}
        onPress={() => navigation.navigate("대화")}
      >
        <Text style={styles.buttonText}>Start to Talk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  home_container : {
    flex:1,
  },
  home: {
    flex:1,
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
