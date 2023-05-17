import React from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <Text></Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Voice")}
        >
          <Text style={styles.buttonText}>Start to Talk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "beige",
    borderWidth: 1,
    borderColor: "black", //
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
