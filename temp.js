import { React, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector, useDispatch } from "react-redux";
import {
  setDialog,
  setGraScore,
  setDiaScore,
  setPoint,
  pointRef,
} from "../storage/actions";
import words from "../assets/words";
import * as Progress from "react-native-progress";

export default function MyScreen({ navigation }) {
  const [daysentence, setDaysentence] = useState(words[0]);
  const [grammer_score, setGrammer_score] = useState(0);
  const [dia_score, setDia_score] = useState(-1);
  const [proScore, setProScore] = useState(0);
  const [point, set_Point] = useState(0);
  const dispatch = useDispatch();

  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (data.DIALOG.length > 1) {
      receiveScore();
      setProScore(computePronuncitaionScore());
    }
  }, []);

  //3개 점수 다 받아오면 점수 계산
  useEffect(() => {
    if (dia_score > -1) {
      set_Point(
        Math.floor(
          (dia_score + grammer_score + proScore) * data.DIALOG.length * 10
        )
      );
      dispatch(
        setPoint(
          Math.floor(
            (dia_score + grammer_score + proScore) *
              (data.DIALOG.length - data.POINT_REF) *
              10
          )
        )
      );
      dispatch(pointRef(data.DIALOG.length));
    }
  }, [dia_score]);

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
      const promises = data.DIALOG.map(async (e) => {
        const response = await axios.post(`${SERVER_IP}/score`, {
          input: e[0],
          input2: e[2],
        });
        return response.data.grammer_score;
      });
      const results = await Promise.all(promises);
      const totalScore = results.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      const averageScore = totalScore / results.length;
      setGrammer_score(averageScore);
      dispatch(setGraScore(averageScore));
    } catch (error) {
      console.log(error);
    }

    try {
      const newContextResult = data.DIALOG.slice(1).map(async (e, i) => {
        const response = await axios.post(`${SERVER_IP}/context`, {
          aisentence: data.DIALOG[i][1],
          usersentenceinput: e[0],
        });
        return response.data.output;
      });
      const newArray2 = await Promise.all(newContextResult);
      const total = newArray2.reduce((acc, curr) => {
        return curr ? acc + curr : acc;
      }, 0);
      const average = total / newArray2.length;
      setDia_score(average);
      dispatch(setDiaScore(average));
    } catch (error) {
      console.log(error);
    }
  };

  const computePronuncitaionScore = () => {
    const sum = data.PRO_SCORE.reduce((acc, curr) => acc + curr, 0);
    return sum / data.PRO_SCORE.length;
  };
  const ScoreComponent = ({ score, scoreTitle }) => (
    <View>
      <View style={styles.scoreSmallTitle}>
        <Text style={styles.scoreText}>{scoreTitle} :</Text>
        {score > 0 && (
          <Text style={styles.scoreText}>
            {" "}
            {Math.floor(score * 100) / 10}
          </Text>
        )}
      </View>
  
      {score > 0 ? (
        <Progress.Bar progress={score} width={200} color="#FFB14E" />
      ) : (
        <Text>Loading or Not enough talking.</Text>
      )}
    </View>
  );
  


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
          <Text style={styles.scoreTitle}>내 점수 : {point}</Text>
          {point == 0 ? (
            <Text  style={styles.text}>Not enough talking.</Text>
          ) : (
            <View>
              <ScoreComponent score={grammer_score} scoreTitle="문법 점수" />
              <ScoreComponent score={dia_score} scoreTitle="문맥 점수" />
              <ScoreComponent score={proScore} scoreTitle="발음 점수" />
            </View>
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
    marginTop: 25,
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
    marginTop: 25,
    paddingTop: 17,
    width: 327,
    height: 250,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  scoreTitle: {
    backgroundColor: "#FFE4AF",
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  scoreSmallTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontWeight: "bold",
    marginVertical: 10,
  },
  memoContainer: {
    backgroundColor: "#FDF6E7",
    alignItems: "center",
    marginTop: 20,
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
  text: {
    fontSize:20,
    marginTop:40,
    fontStyle:"italic",

  },
});
