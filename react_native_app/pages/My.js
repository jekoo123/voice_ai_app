import React from "react";
import { View, StyleSheet,Text } from "react-native";
import Toolbar from "../components/toolbar";
export default function MyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.todayContainer}>
          <Text style={styles.title}>오늘의 표현</Text>
          <Text style={styles.todayContent}>Yuuki Asuna Maji Tensi</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.title}>점수</Text>
          <View></View>

        </View>
      </View>
      <View style={styles.toolbarContainer}>
        <Toolbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbarContainer: {
    flex: -0.1,
  },
  contentsContainer: {
    flex: 1,
    justifyContent:"flex-start",
    alignItems:"center",
    padding:20,
  },

  todayContainer: {
    backgroundColor: "#FFE4AF",
    borderRadius: 10,
    padding:20,
    width:327,
    alignItems:"center"
  },
  title:{
    fontSize:20,
    letterSpacing:4,
    textAlign:"center"
  },
  todayContent:{
    paddingTop:20,
    marginBottom:10,
    fontSize:18,
    

  }
});
