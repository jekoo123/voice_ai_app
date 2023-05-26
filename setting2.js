import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

export default function SettingScreen() {
  const [language, setLanguage] = useState("");
  const [contextMode, setContextMode] = useState(false);
  const [flowFlag, setFlowFlag] = useState(0); // flow_flag 상태값 추가
  const [radioButtonStyle, setRadioButtonStyle] = useState([
    styles.radioButton,
    { backgroundColor: getRadioButtonColor("english") },
  ]);

  const serverURL = "http://192.168.0.8:5000";

  useEffect(() => {
    fetchLanguageFromServer();
  }, []);

  const fetchLanguageFromServer = async () => {
    try {
      const response = await axios.get(`${serverURL}/get_language`);
      const languageCode = response.data.language_code;
      setLanguage(languageCode);
      console.log(languageCode);
      if (languageCode === "en-US") {
        console.log("if complete");
        setRadioButtonStyle([
          styles.radioButton,
          { backgroundColor: "#AED6F2" },
        ]);
      } else {
        setRadioButtonStyle([
          styles.radioButton,
          { backgroundColor: "#AED6F2" },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    sendLanguageToServer(newLanguage);
  };

  const sendLanguageToServer = async (newLanguage) => {
    try {
      await axios.post(`${serverURL}/set_language`, {
        language: newLanguage,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateContextMode = (newContextMode) => {
    setContextMode(newContextMode);
    setFlowFlag(newContextMode ? 1 : 0);
  };

  const toggleContextMode = async () => {
    updateContextMode(!contextMode);
    try {
      await axios.get(`${serverURL}/flow_flag`);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.languageContainer}>
        <Text style={styles.label}>Language:</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[styles.radioButton, { backgroundColor: getRadioButtonColor("english") }]}
            onPress={() => toggleLanguage("english")}
          >
            <Text
              style={[
                styles.radioButtonLabel,
                language === "english" && styles.selectedLabel,
              ]}
            >
              English
            </Text>
            {language === "english" && <View style={styles.radioButtonDot} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, { backgroundColor: getRadioButtonColor("japanese") }]}
            onPress={() => toggleLanguage("japanese")}
          >
            <Text
              style={[
                styles.radioButtonLabel,
                language === "japanese" && styles.selectedLabel,
              ]}
            >
              日本語
            </Text>
            {language === "japanese" && <View style={styles.radioButtonDot} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contextModeContainer}>
        <Text style={styles.label}>Context Mode:</Text>
        <TouchableOpacity
          style={[styles.contextModeButton, contextMode && styles.contextModeButtonOn]}
          onPress={toggleContextMode}
        >
          <Text style={styles.contextModeButtonText}>{contextMode ? "Turn Off" : "Turn On"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8E5FF", // Light Purple
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#555555", // Dark Gray
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginRight: 10,
    color: "#555555", // Dark Gray
  },
  radioButtonGroup: {
    flexDirection: "row",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 10,
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
  radioButtonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E2A3D6", // Light Pink
    marginLeft: 6,
  },
  contextModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  contextModeButton: {
    backgroundColor: "#AED6F1", // 파스텔톤 파란색
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contextModeButtonOn: {
    backgroundColor: "#F1F1F1", // 기본 배경색
  },
  contextModeButtonText: {
    fontSize: 16,
    color: "#555555", // Dark Gray
  },
});