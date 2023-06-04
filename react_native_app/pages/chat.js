import { React, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setDialog, setSave, setDiaScore } from "../storage/actions";
export default function ChatScreen() {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [evaluation, setEvaluation] = useState([]);

  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (data.DIALOG.length > 0) {
      submitAllMessages();
    }
  }, []);

  useEffect(() => {
    if (!isFocused) {
      const updateList = async () => {
        await axios.post(`${SERVER_IP}/update_list`, {
          id: data.USER[0],
          list: data.SAVE,
        });
      };
      updateList();


    }
  }, [isFocused]);

  const submitAllMessages = async () => {
    const newArray1Promises = data.DIALOG.map(async (e) => {
      if (e.length < 3) {
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
      } else {
        return e;
      }
    });

    const newArray1 = await Promise.all(newArray1Promises);
    setEvaluation(newArray1);
    dispatch(setDialog(newArray1));
  };

  const renderItem = ({ item }) => {
    const handleSave = () => {
      dispatch(setSave(item[2]));
    };

    return (
      <View style={styles.scroll}>
        <View style={styles.MyTextBoxContainer}>
          <View style={styles.MyTextBox}>
            <Text style={styles.textTitle}>Me</Text>

            <Text style={styles.text}>{item[0]}</Text>
          </View>
        </View>
        <View style={styles.EvaluationTextBoxContainer}>
          <View style={styles.EvaluationTextBox}>
            <View style={styles.textBoxHeader}>
              <Text style={styles.EvaluationTextTitle}>Revised Sentence</Text>
              <TouchableOpacity onPress={handleSave}>
                <Icon
                  style={styles.icon}
                  name="save"
                  size={27}
                  color={
                    data.SAVE.find((sentence) => sentence === item[2])
                      ? "blue"
                      : "black"
                  }
                />
              </TouchableOpacity>
            </View>
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
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
  textBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  icon: {
    position: "relative",
    bottom: 4,
    width: 25,
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
});
