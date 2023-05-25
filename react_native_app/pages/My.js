import { React, useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector, useDispatch } from "react-redux";
import { setArray1 } from "../storage/actions";
import words from "../assets/words";

export default function MyScreen() {
  const [daysentence, setDaysentence] = useState(words[0]);

  let previousIndex = -1; // 이전에 출력한 행의 인덱스

  // 현재 날짜를 기준으로 다음 행을 출력하는 함수
  function printNextProverb() {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();

    // 다음 행의 인덱스 계산
    let nextIndex = (previousIndex + 1) % proverbs.length;

    // 날짜가 변경되면 다음 행 출력
    if (dayOfMonth === 1) {
      setDaysentence(proverbs[nextIndex]); // daysentence 상태 업데이트
      previousIndex = nextIndex; // 이전에 출력한 행의 인덱스 업데이트
    }
  }

  // 매 시간마다 printNextProverb 함수를 호출하여 날짜 변경 여부를 확인
  setInterval(printNextProverb, 1000 * 60 * 60);
  //const [daysentence, setDaysentence] = useState(words[0]);

  // useEffect(() => {
  // const currentDate = new Date();
  // const dayOfMonth = currentDate.getDate();

  // const randomIndex = dayOfMonth % words.length;
  // const randomSentence = words[randomIndex];

  // setDaysentence(randomSentence);
  //}, []);
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

  const [grammer_score_sum, setGrammer_score_sum] = useState(0);
  const receiveScore = async () => {
    try {
      const promises = data.array1.map((e) =>
        axios.post("http://192.168.212.72:5000/score", {
          input: e[0],
          input2: e[2],
        })
      );
      const results = await Promise.all(promises);
      const totalScore = results.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.data.grammer_score;
      }, 0);

      // 평균 계산
      const averageScore = totalScore / results.length;

      setGrammer_score_sum(averageScore);
    } catch (error) {
      console.error(error);
    }
  };

  // const [grammer_score_sum,setGrammer_score_sum]= useState(0);
  // const receiveScore = async () => {
  //   try {
  //     const promises = data.array1.map((e) =>
  //       axios.post("http://192.168.28.72:5000/score", {
  //         input: e[0],
  //         input2: e[2],
  //       })
  //     );
  //     const results = await Promise.all(promises);
  //     setGrammer_score_sum(results.reduce((accumulator, currentValue) => {
  //       return accumulator + currentValue.data.grammer_score;
  //     }, 0));

  //     // const newArray1 = data.array1.map((item, index) => [
  //     //   ...item,
  //     //   results[index].data.grammer_score,
  //     // ]);
  //     // const arrayWithMaxScore = newArray1.reduce(
  //     //   (maxArray, currentArray) =>
  //     //     currentArray[currentArray.length - 1] > maxArray[maxArray.length - 1]
  //     //       ? currentArray
  //     //       : maxArray,
  //     //   [0, 0, 0]
  //     // );
  //     // setMySentence(arrayWithMaxScore[0]);

  //     // console.log("at my", mySentence);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.todayContainer}>
          <Text style={styles.title}>오늘의 표현</Text>
          <Text style={styles.todayContent}>{daysentence[0]}</Text>
          <Text style={styles.todayContent}>{daysentence[1]}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.title}>점수</Text>
          <Text>문법 점수 : {grammer_score_sum}</Text>
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
