import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { SERVER_IP } from "../config";
import { changeLanguage, changeContext,resetState } from "../storage/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingScreen({ navigation }) {
  const [language, setLanguage] = useState("");
  const [flowFlag, setFlowFlag] = useState(0);
  const dispatch = useDispatch();
  
  const data = useSelector((state) => {
    return state.USER;
  });
  
  useEffect(() => {
    setLanguage(data[1]);
    setFlowFlag(data[2]);
  }, []);
  
  const toggleLanguage = async (language) => {
    try {
      const response = await axios.post(`${SERVER_IP}/change_language`, {
        id: data[0],
        language: language,
      });
      setLanguage(response.data.language);
      dispatch(changeLanguage(language));
    } catch (error) {
      console.log(error);
    }
  };
  
  const toggleFlowFlag = async (flag) => {
    try {
      const response = await axios.post(`${SERVER_IP}/flow_flag`, {
        id: data[0],
        flow_flag: flag,
      });
      setFlowFlag(response.data.contextMode);
      dispatch(changeContext(flag))
    } catch (error) {
      console.log(error);
    }
  };
  
  function getRadioButtonColor(selectedLanguage) {
    if (language === selectedLanguage) {
      return "#AED6F1";
    } else {
      return "#F1F1F1";
    }
  }

  function getRadioButtonColor1(selectedFlowFlag) {
    if (flowFlag === selectedFlowFlag) {
      return "#AED6F1";
    } else {
      return "#F1F1F1";
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
      dispatch(resetState);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.languageContainer}>
          <Text style={styles.label}>Language :</Text>
          <View style={styles.radioButtonGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton1,
                { backgroundColor: getRadioButtonColor("en-US") },
              ]}
              onPress={() => toggleLanguage("en-US")}
            >
              <Text
                style={[
                  styles.radioButtonLabel,
                  language === "en-US" && styles.selectedLabel,
                ]}
              >
                EN
              </Text>
              {language === "en-US" && <View style={styles.radioButtonDot} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton2,
                { backgroundColor: getRadioButtonColor("ja-JP") },
              ]}
              onPress={() => toggleLanguage("ja-JP")}
            >
              <Text
                style={[
                  styles.radioButtonLabel,
                  language === "ja-JP" && styles.selectedLabel,
                ]}
              >
                JP
              </Text>
              {language === "ja-JP" && <View style={styles.radioButtonDot} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contextModeContainer}>
          <Text style={styles.label}>Context Mode :</Text>
          <View style={styles.radioButtonGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton1,
                { backgroundColor: getRadioButtonColor1(1) },
              ]}
              onPress={() => toggleFlowFlag(1)}
            >
              <Text
                style={[
                  styles.radioButtonLabel,
                  flowFlag === 1 && styles.selectedLabel,
                ]}
              >
                On
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton2,
                { backgroundColor: getRadioButtonColor1(0) },
              ]}
              onPress={() => toggleFlowFlag(0)}
            >
              <Text
                style={[
                  styles.radioButtonLabel,
                  flowFlag === 0 && styles.selectedLabel,
                ]}
              >
                Off
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              logout();
              navigation.navigate("로그인");
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8E5FF", // Light Purple
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 35,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    marginBottom: 40,
    fontWeight: "bold",
    color: "#555555", // Dark Gray
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFD4EB",
    padding: 10,
    borderRadius: 10,
    width: 270,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: 20,
    marginRight: 10,
    color: "#555555", // Dark Gray
  },
  radioButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton1: {
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioButton2: {
    flexDirection: "row",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "#555555", // Dark Gray
  },
  selectedLabel: {
    fontWeight: "bold",
  },
  contextModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFD4EB",
    padding: 10,
    borderRadius: 10,
    width: 270,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  contextModeButton: {
    backgroundColor: "#AED6F1", // Light Blue
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contextModeButtonOn: {
    backgroundColor: "#F1F1F1", // Default Background Color
  },
  contextModeButtonText: {
    fontSize: 16,
    color: "#555555", // Dark Gray
  },
  logoutButton: {
    marginTop: 45,
    marginLeft:170,
    backgroundColor: "#F1F1F1", // Light Blue
    fontWeight: "bold",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  logoutText:{
    fontSize:20,
  },
});