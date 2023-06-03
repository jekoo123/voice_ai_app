import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { SERVER_IP } from "../config";
import { changeLanguage, changeContext } from "../storage/actions";
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
    // fetchLanguageFromServer();
  }, []);

  // const fetchLanguageFromServer = async () => {
  //   try {
  //     const response = await axios.post(`${SERVER_IP}/fetch`, {
  //       id: data[0],
  //     });
  //     setLanguage(response.data.language);
  //     setFlowFlag(response.data.context);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const toggleLanguage = async (language) => {
    try {
      const response = await axios.post(`${SERVER_IP}/change_language`, {
        id: user_id,
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
        id: user_id,
        flow_flag: flag,
      });
      setFlowFlag(response.data.contextMode);
      dispatch(changeContext(flag))
    } catch (error) {
      console.log(error);
    }
  };

  // function getRadioButtonColor(selectedLanguage, selectedFlowFlag) {
  //   if (selectedLanguage) {
  //     if (language === selectedLanguage) {
  //       return "#AED6F1";
  //     } else {
  //       return "#F1F1F1";
  //     }
  //   } else {
  //     if (flowFlag === selectedFlowFlag) {
  //       return "#AED6F1";
  //     } else {
  //       return "#F1F1F1";
  //     }
  //   }
  // }

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
      dispatch(setId([]));
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
