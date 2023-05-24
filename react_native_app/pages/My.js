import { React, useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector, useDispatch } from "react-redux";
import { setArray1 } from "../storage/actions";

export default function MyScreen() {
  const [mySentence, setMySentence] = useState("");
  const dispatch = useDispatch();

  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (data) {
      receiveScore();
    }
    // console.log('charScreen:21', data);
  }, []);

  const receiveScore = async () => {
    try {
      const promises = data.array1.map((e) =>
        axios.post("http://192.168.28.72:5000/score", {
          input: e[0],
          input2: e[2],
        })
      );
      const results = await Promise.all(promises);
      const newArray1 = data.array1.map((item, index) => [
        ...item,
        results[index].data.grammer_score,
      ]);
      dispatch(setArray1(newArray1));
      console.log(data.array1);
      const arrayWithMaxScore = newArray1.reduce(
        (maxArray, currentArray) =>
          currentArray[currentArray.length - 1] > maxArray[maxArray.length - 1]
            ? currentArray
            : maxArray,
        [0, 0, 0]
      );
      setMySentence(arrayWithMaxScore[0]);

      console.log(
        "First element of array with max score:",mySentence
      );
      console.log(data.array1);
    } catch (error) {
      console.error(error);
    }
  };

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
    flex: 0.1,
  },
  contentsContainer: {
    flex: 0.9,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  todayContainer: {
    backgroundColor: "#FFE4AF",
    borderRadius: 10,
    marginTop: 20,
    padding: 20,
    width: 327,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: 4,
    textAlign: "center",
  },
  todayContent: {
    paddingTop: 20,
    marginBottom: 10,
    fontSize: 18,
  },
});
