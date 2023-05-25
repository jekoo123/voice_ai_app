import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setArray1 } from "../storage/actions";
export default function ChatScreen() {
  const dispatch = useDispatch();
  const [evaluation, setEvaluation] = useState([]);
  const data = useSelector((state) => {
    return state;
  });
  //to 동진
  // const data = useSelector((state) => {
  //   return state.number;
  // });
  //if numver ->  data = 1 or 0
  console.log(data.array1)
  useEffect(() => {
    if (data.array1) {
      submitAllMessages();
    }
    // console.log('charScreen:21', data);
  }, []);

  // useEffect(() => {
  //   const updateData = async () => {
  //     dispatch(deleteALL());
  //     for (const item of evaluation) {
  //       await dispatch(addToMyData(item));
  //     }
  //   };
  //   if (evaluation.length > 0) {
  //     updateData();
  //   }
  // }, [evaluation]);

  const submitAllMessages = async () => {
    const newArray1Promises = data.array1.map(async (e) => {
      if(e.length<3){
        try{
          const response = await axios.post("http://192.168.212.72:5000/evaluation", { input: e[0] });
          return [...e, response.data.grammer];  // updated item with evaluation result
        } catch (error) {
          console.error(error);
          return e;  // if error occurs, return original item
        }
      } else {
        return e;  // if item already has evaluation result, return original item
      }
    });
  
    const newArray1 = await Promise.all(newArray1Promises);
    setEvaluation(newArray1);
    dispatch(setArray1(newArray1));
  };
  // const submitAllMessages = async () => {
  
  //   const newArray1 = data.array1.map(async (e) => {
  //     if(e.length<3){
  //       try{
  //         const response = await axios.post("http://192.168.28.72:5000/evaluation", { input: e[0] });
  //         e.push(response.data.grammer)
  //       } catch (error) {
  //         console.error(error);
  //       }

  //     }

  //   })
  //   setEvaluation(newArray1);

  //   dispatch(setArray1(newArray1));
  //   // try {
  //   //   const promises = data.array1.map((e) =>
  //   //     axios.post("http://192.168.28.72:5000/evaluation", { input: e[0] })
  //   //   );
  //   //   const results = await Promise.all(promises);

  //   //   const newArray1 = data.array1.map((item, index) => [
  //   //     ...item,
  //   //     results[index].data.grammer,
  //   //   ]);
  //   //   setEvaluation(newArray1);

  //   //   dispatch(setArray1(newArray1));
  //   //   // dispatch(1);
  //   //   console.log("at chat", data.array1)
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // };
  // // console.log(evaluation);

  const renderItem = ({ item }) => (
    <View style={styles.scroll}>
      <View style={styles.MyTextBoxContainer}>
        <View style={styles.MyTextBox}>
          <Text style={styles.textTitle}>Me</Text>
          <Text style={styles.text}>{item[0]}</Text>
        </View>
      </View>
      <View style={styles.EvaluationTextBoxContainer}>
        <View style={styles.EvaluationTextBox}>
          <Text style={styles.EvaluationTextTitle}>Correct Grammer</Text>
          <Text style={styles.text}>{item[2]}</Text>
        </View>
      </View>
      <View>
        <View style={styles.AiTextBox}>
          <Text style={styles.textTitle}>AI</Text>
          <Text style={styles.text}>{item[1]}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.selectEvaluationContainer}>
          <TouchableOpacity style={styles.selectEvaluation}>
            <Text style={styles.selectText}>문법</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectEvaluation}>
            <Text style={styles.selectText}>문맥</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectEvaluation}>
            <Text style={styles.selectText}>발음</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={evaluation}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
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
  listContainer: {
    flex: 0.9,
  },
  toolbarContainer: {
    flex: 0.1,
  },
  MyTextBoxContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  MyTextBox: {
    backgroundColor: "#CFE6FB",
    width: 200,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  AiTextBox: {
    backgroundColor: "#DAC2FC",
    width: 200,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  textTitle: {
    marginBottom: 10,
    width: 50,
    textAlign: "center",
    borderRadius: 50,
    backgroundColor: "white",
  },
  text: {
    fontWeight: "500",
    textDecorationLine: "none",
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "top",
    letterSpacing: 0.1,
  },
  EvaluationTextBoxContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  EvaluationTextBox: {
    backgroundColor: "#FEFFC7",
    width: 200,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  EvaluationTextTitle: {
    marginBottom: 10,
    width: 120,
    textAlign: "center",
    borderRadius: 50,
    backgroundColor: "white",
  },
  selectEvaluationContainer: {
    position: "absolute",
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 1,
  },
  selectEvaluation: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 0.5,
    marginHorizontal: 1,
    borderRadius: 10,
    backgroundColor: "#D6FFF3",
  },
  selectText: {
    textAlign: "center",
    fontSize: 15,
  },
});

// export default function ChatScreen({ route }) {
//   const { chatdata } = route.params;
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={chatdata}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.chatItem}>
//             <Text style={styles.inputText}>{item.input}</Text>
//             <Text style={styles.responseText}>{item.response}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   chatItem: {
//     marginBottom: 10,
//   },
//   inputText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   responseText: {
//     fontSize: 16,
//     marginLeft: 20,
//   },
// });
