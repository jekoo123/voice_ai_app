import { React, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector, useDispatch } from "react-redux";
import { setDialog, setGraScore, setDiaScore } from "../storage/actions";
import words from "../assets/words";
import * as Progress from "react-native-progress";

export default function MyScreen({ navigation }) {
  const [daysentence, setDaysentence] = useState(words[0]);
  const [grammer_score, setGrammer_score] = useState(0);
  const [dia_log, setDia_log] = useState([]);
  const [dia_score, setDia_score] = useState(11);
  const [proScore, setProScore] = useState(0);
  const dispatch = useDispatch();

  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    setDia_log(data.DIALOG);
    if (data.DIALOG.length > 1) {
      receiveScore();
      setProScore(computePronuncitaionScore());
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const promises = dia_log.map(async (e) => {
        try {
          const response = await axios.post(`${SERVER_IP}/score`, {
            input: e[0],
            input2: e[2],
          });
          return response.data.grammer_score;
        } catch (error) {
          console.error(error);
        }
      });

      const results = await Promise.all(promises);
      const totalScore = results.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      const averageScore = totalScore / results.length;
      setGrammer_score(averageScore);
      dispatch(setGraScore(averageScore));
    };

    if (dia_log.length > 0) {
      fetchData();
    }
  }, [dia_log]);

  let previousIndex = -1;
  function printNextProverb() {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    let nextIndex = (previousIndex + 1) % words.length;
    if (dayOfMonth === 1) {
      setDaysentence(words[nextIndex]);
      previousIndex = nextIndex;
    }
  }
  setInterval(printNextProverb, 1000 * 60 * 60);

  const receiveScore = async () => {
    //문법이랑 문맥점수 받아오기
    try {
      const newArray1Promises = data.DIALOG.map(async (e) => {
        try {
          const response = await axios.post(`${SERVER_IP}/grammer`, {
            input: e[0],
            id: data.USER[0],
          });
          return [...e, response.data.grammer];
        } catch (error) {
          console.error(error);
          return e;
        }
      });

      const newArray1 = await Promise.all(newArray1Promises);
      setDia_log(newArray1);
      dispatch(setDialog(newArray1));

      const newContextResult = data.DIALOG.slice(1).map(async (e, i) => {
        if (data.DIALOG.length > 1 && e.length > 2) {
          const response = await axios.post(`${SERVER_IP}/context`, {
            aisentence: data.DIALOG[i][1],
            usersentenceinput: e[0],
          });
          return response.data.output;
        } else return e;
      });
      const newArray2 = await Promise.all(newContextResult);
      const total = newArray2.reduce((acc, curr) => {
        return acc + curr;
      }, 0);
      const average = total / newArray2.length;
      console.log(newArray2);
      setDia_score(average);
      dispatch(setDiaScore(average));
    } catch (error) {
      console.error(error);
    }
  };

  const computePronuncitaionScore = () => {
    const sum = data.PRO_SCORE.reduce((acc, curr) => acc + curr, 0);
    return sum / data.PRO_SCORE.length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.todayContainer}>
          <Text style={styles.title}>오늘의 표현</Text>
          <View style={styles.todayContentsContainer}>
            <Text style={styles.todayContent}>{daysentence[0]}</Text>
            <Text style={styles.todayContent}>{daysentence[1]}</Text>
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>오늘의 점수</Text>
          {grammer_score > 0 ? (
            <Text style={styles.scoreText}>
              문법 점수 : {Math.floor(grammer_score * 100) / 10}
            </Text>
          ) : (
            <Text style={styles.scoreText}>
              문법 점수 : Not enough talking.
            </Text>
          )}
          {grammer_score > 0 && (
            <Progress.Bar
              progress={grammer_score}
              width={200}
              color="#FFB14E"
            />
          )}
          {dia_score < 11 ? (
            <Text style={styles.scoreText}>
              문맥 점수 : {Math.floor(dia_score * 100) / 10}
            </Text>
          ) : (
            <Text style={styles.scoreText}>
              문맥 점수 : Not enough talking.
            </Text>
          )}

          {dia_score < 11 && (
            <Progress.Bar progress={dia_score} width={200} color="#FFB14E" />
          )}
          {proScore > 0 ? (
            <Text style={styles.scoreText}>
              발음 점수 : {Math.floor(proScore * 100) / 10}
            </Text>
          ) : (
            <Text style={styles.scoreText}>
              발음 점수 : Not enough talking.
            </Text>
          )}

          {proScore > 0 && (
            <Progress.Bar progress={proScore} width={200} color="#FFB14E" />
          )}
        </View>
        <TouchableOpacity
          style={styles.memoContainer}
          onPress={() => {
            navigation.navigate("나의 문장");
          }}
        >
          <Text style={styles.buttonTitle}>찜한 문장</Text>
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
    marginTop: 40,
    padding: 20,
    width: 327,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center",
  },
  todayContentsContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#FDF6E7",
    paddingBottom: 30,
    paddingHorizontal: 17,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  todayContent: {
    marginTop: 30,
    fontSize: 18,
  },
  scoreContainer: {
    backgroundColor: "#FAEBD7",
    borderRadius: 10,
    marginTop: 35,
    paddingTop:17,
    width: 327,
    height: 210,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 5,
  },
  scoreText: {
    fontWeight: "bold",
    marginVertical:10,
  },
  memoContainer: {
    backgroundColor: "#FDF6E7",
    alignItems: "center",
    marginTop: 30,
    marginLeft: 210,
    marginBottom: 80,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonTitle: {
    fontSize: 20,
  },
});
