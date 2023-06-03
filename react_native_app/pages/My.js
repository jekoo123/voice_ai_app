import { React, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector,useDispatch } from "react-redux";
import setScore from "../storage/actions";
import words from "../assets/words";
import * as Progress from "react-native-progress";

export default function MyScreen({ navigation }) {
  const [daysentence, setDaysentence] = useState(words[0]);
  const [grammer_score, setGrammer_score] = useState(0);
  const [proScore, setProScore] = useState(0);
  const dispatch = useDispatch();
  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (data.DIALOG.length > 2) {
      receiveScore();
      setProScore(computePronuncitaionScore());
    }
  }, []);

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
    try {
      const promises = data.DIALOG.map((e) =>
        axios.post(`${SERVER_IP}/score`, {
          input: e[0],
          input2: e[2],
        })
      );

      const results = await Promise.all(promises);
      console.log(results);
      const totalScore = results.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.data.grammer_score;
      }, 0);
      const averageScore = totalScore / results.length;
      setGrammer_score(averageScore);
      dispatch(setScore(averageScore))
    } catch (error) {
      console.error(error);
    }
  };

  const computePronuncitaionScore = () => {
    const sum = data.SCORE.reduce((acc, curr) => acc + curr[0], 0);
    return sum / data.SCORE.length;
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
    shadowColor: '#000',
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
  todayContentsContainer:{
      marginTop:20,
      alignItems:"center",
      backgroundColor:'#FDF6E7',
      paddingBottom:30,
      paddingHorizontal:17,
      borderRadius:10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
  },
  todayContent: {
    marginTop:30,
    fontSize: 18,
  },
  scoreContainer: {
    backgroundColor: "#FAEBD7",
    borderRadius: 10,
    marginTop:35,
    padding: 25,
    width: 327,
    alignItems: "center",
    shadowColor: '#000',
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
    marginBottom: 10,
  },
  scoreText: {
    fontWeight: "bold",
  },
  memoContainer: {
    backgroundColor: "#FDF6E7",
    alignItems: "center",
    marginTop: 50,
    marginLeft:210,
    marginBottom: 80,
    padding: 20,
    borderRadius:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    
  },
  buttonTitle:{
    fontSize:20,

  },
});
