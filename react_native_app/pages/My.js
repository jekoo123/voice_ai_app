import { React, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector } from "react-redux";
import words from "../assets/words";
import * as Progress from "react-native-progress";

export default function MyScreen({ navigation }) {
  const [daysentence, setDaysentence] = useState(words[0]);
  const [grammer_score, setGrammer_score] = useState(0);
  const [proScore, setProScore] = useState(0);
  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (data.array1.length > 0) {
      receiveScore();
      setProScore(computePronuncitaionScore());
    }
  }, []);

  let previousIndex = -1;
  function printNextProverb() {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    // let nextIndex = (previousIndex + 1) % proverbs.length;
    let nextIndex = (previousIndex + 1) % words.length;
    if (dayOfMonth === 1) {
      setDaysentence(words[nextIndex]);
      previousIndex = nextIndex;
    }
  }
  setInterval(printNextProverb, 1000 * 60 * 60);

  const receiveScore = async () => {
    try {
      const promises = data.array1.map((e) =>
        axios.post(`${SERVER_IP}/score`, {
          input: e[0],
          input2: e[3],
        })
      );

      const results = await Promise.all(promises);
      console.log(results);
      const totalScore = results.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.data.grammer_score;
      }, 0);
      const averageScore = totalScore / results.length;
      setGrammer_score(averageScore);
    } catch (error) {
      console.error(error);
    }
  };

  const computePronuncitaionScore = () => {
    const sum = data.array1.reduce((acc, curr) => acc + curr[2], 0);
    return sum / data.array1.length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.todayContainer}>
          <Text style={styles.title}>오늘의 표현</Text>
          <Text style={styles.todayContent}>{daysentence[0]}</Text>
          <Text style={styles.todayContent}>{daysentence[1]}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>점수</Text>
          <Text style={styles.scoreText}>
            문법 점수 : {Math.floor(grammer_score * 100) / 10}
          </Text>
          {grammer_score > 0 && (
            <Progress.Bar
              progress={grammer_score}
              width={200}
              color="#FFB14E"
            />
          )}

          <Text style={styles.scoreText}>
            문맥 점수 : {Math.floor(grammer_score * 100) / 10}
          </Text>
          {grammer_score > 0 && (
            <Progress.Bar
              progress={grammer_score}
              width={200}
              color="#FFB14E"
            />
          )}

          <Text style={styles.scoreText}>
            발음 점수 : {Math.floor(proScore * 100) / 10}
          </Text>
          {grammer_score > 0 && (
            <Progress.Bar progress={proScore} width={200} color="#FFB14E" />
          )}
        </View>

        <TouchableOpacity
          style={styles.memoContainer}
          onPress={() => {
            navigation.navigate("나의 문장");
          }}
        >
          <Text style={styles.title}>찜한 문장</Text>
        </TouchableOpacity>
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

    marginVertical: 20,
    padding: 20,
    width: 327,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center",
  },

  todayContent: {
    paddingTop: 20,
    fontSize: 18,
  },
  scoreContainer: {
    backgroundColor: "#FAEBD7",
    borderRadius: 10,
    marginVertical: 20,
    padding: 25,
    width: 327,
    alignItems: "center",
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontWeight: "bold",
  },
  memoContainer: {
    backgroundColor: "#FDF6E7",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    width: 327,
  },
});
