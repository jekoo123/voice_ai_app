import { React, useState, useEffect } from "react";

import { View,TouchableOpacity,Modal, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Toolbar from "../components/toolbar";
export default function ListScreen() {
  const data = useSelector((state) => {
    return state.SAVE;
  });
  

  const renderItem = ({ item }) => {


    return (
      <TouchableOpacity style={styles.textContainer} >
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <View style={styles.contentContainer}>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
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
  screenContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal:10,
  },
  
  toolbarContainer: {
    flex: 0.1,
  },
  modalContainer:{
    height:300,
  },  
  contentContainer:{
    width:350,
    paddingVertical:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor:"#FFE4AF",
    height:600,
    borderRadius:15,
    alignItems:"center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    borderRadius: 10,
    paddingVertical: 10,
    width:290,
    paddingHorizontal:10,
    lineHeight: 30,
    backgroundColor:"#FDF6E7",
    marginBottom:10,
  },
});
