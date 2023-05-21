import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export const DialogBox = () => {
  const data = useSelector((state) => state);

  return (
    <View >
      <Text style={styles.styleAiText}>{data.my_input[0]}</Text>
      <Text style={styles.styleAiText}>{data.ai_response[0]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  styleAiText: {
    backgroundColor:"#DAC2FC",
    width: 255,
    height: 142,
    transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: "0deg" }],
    fontWeight: "400",
    textDecorationLine: "none",
    fontSize: 12,
    textAlign: "left",
    textAlignVertical: "top",
    letterSpacing: 0.1,
    borderRadius:10,
  },
});
