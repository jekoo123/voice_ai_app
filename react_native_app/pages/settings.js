import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";

export default function SettingScreen() {
  const [language, setLanguage] = useState("");
  const [contextMode, setContextMode] = useState(false);
  const [flowFlag, setFlowFlag] = useState(0);
  const user_id = useSelector((state) => {
    return state.id;
  });
  const serverURL = "http://192.168.0.8:5000";
  useEffect(() => {
    fetchLanguageFromServer();
  }, []);

  const fetchLanguageFromServer = async () => {
    try {
      const response = await axios.post(`${serverURL}/language`, {
        id: user_id,
      });
      const languageCode = response.data.language;
      console.log(languageCode);
      setLanguage(languageCode);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLanguage = async (language) => {
    try {
      const response = await axios.post(`${serverURL}/change_language`,{
        id : user_id,
        language : language,
      });
      const languageCode = response.data.language;
      setLanguage(languageCode);
    } catch (error) {
      console.log(error);
    }
  };

  // const toggleLanguage = async (newLanguage) => {
  //   try {
  //     setLanguage(newLanguage);
  //     await axios.post(`${serverURL}/set_language`, {
  //       language: newLanguage,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const toggleContextMode = async () => {
    try {
      setContextMode(!contextMode);
      setFlowFlag(contextMode ? 1 : 0);
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
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.languageContainer}>
          <Text style={styles.label}>Language:</Text>
          <View style={styles.radioButtonGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
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
                English
              </Text>
              {language === "en-US" && <View style={styles.radioButtonDot} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
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
                日本語
              </Text>
              {language === "ja-JP" && (
                <View style={styles.radioButtonDot} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contextModeContainer}>
          <Text style={styles.label}>Context Mode:</Text>
          <TouchableOpacity
            style={[
              styles.contextModeButton,
              contextMode && styles.contextModeButtonOn,
            ]}
            onPress={toggleContextMode}
          >
            <Text style={styles.contextModeButtonText}>
              {contextMode ? "Turn Off" : "Turn On"}
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    borderRadius: 20,
    marginBottom: 30,
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

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import Toolbar from "../components/toolbar";
// import { useSelector } from "react-redux";
// export default function SettingScreen() {
//   const data = useSelector((state) => {
//     return state.number;
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.contentsContainer}>
//         <View style={styles.contentBox}>
//           <Text style={styles.title}>설정</Text>
//           <View style={styles.languageSettingContainer}>
//             <Text style={styles.languageSettingText}>언어</Text>
//             <View style={styles.optionContainer}>
//               <TouchableOpacity style={styles.languageButton}>
//                 <Text style={styles.languageText}>EN</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.languageButton, styles.jpButton]}>
//                 <Text style={styles.languageText}>JP</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={styles.toolbarContainer}>
//         <Toolbar />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   toolbarContainer: {
//     flex: 0.1,
//   },
//   contentsContainer: {
//     flex: 0.9,
//     alignItems: "center",
//   },
//   contentBox: {
//     marginTop: 35,
//     alignItems: "center",
//     backgroundColor: "#ACB1FF",
//     width: 304,
//     height: 446,
//     borderRadius: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 800,
//     letterSpacing: 4,
//     marginTop: 20,
//     color: "white",
//   },
//   languageSettingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 30,
//     backgroundColor: "white",
//     borderRadius: 20,
//     width: 250,
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     justifyContent:"space-between"
//   },
//   languageSettingText: {
//     fontSize: 20,
//   },
//   optionContainer: {
//     flexDirection:"row",
//     padding:10,
//     borderRadius: 20,
//     backgroundColor: "#E6E6E6",
//     width:100,
//     justifyContent:"center"
//   },
//   languageButton:{
//     alignItems:"center",
//     paddingHorizontal:10,
//   },
//   languageText:{
//     fontSize:15,
//   },
//   jpButton:{
//     borderLeftWidth:1,
//   }

// });
