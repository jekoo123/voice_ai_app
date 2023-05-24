import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Toolbar from "../components/toolbar";
import { useSelector } from "react-redux";
export default function SettingScreen() {
  const data = useSelector((state) => {
    return state.number;
  });
  

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.contentBox}>
          <Text style={styles.title}>설정</Text>
          <View style={styles.languageSettingContainer}>
            <Text style={styles.languageSettingText}>언어</Text>
            <View style={styles.optionContainer}>
              <TouchableOpacity style={styles.languageButton}>
                <Text style={styles.languageText}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.languageButton, styles.jpButton]}>
                <Text style={styles.languageText}>JP</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flex: 0.1,
  },
  contentsContainer: {
    flex: 0.9,
    alignItems: "center",
  },
  contentBox: {
    marginTop: 35,
    alignItems: "center",
    backgroundColor: "#ACB1FF",
    width: 304,
    height: 446,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: 4,
    marginTop: 20,
    color: "white",
  },
  languageSettingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 20,
    width: 250,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent:"space-between"
  },
  languageSettingText: {
    fontSize: 20,
  },
  optionContainer: {
    flexDirection:"row",
    padding:10,
    borderRadius: 20,
    backgroundColor: "#E6E6E6",
    width:100,
    justifyContent:"center"
  },
  languageButton:{
    alignItems:"center",
    paddingHorizontal:10,
  },
  languageText:{
    fontSize:15,
  },
  jpButton:{
    borderLeftWidth:1,
  }

});
