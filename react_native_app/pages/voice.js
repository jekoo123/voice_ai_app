import React, { useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
  Text,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { addDialog, setProScore } from "../storage/actions";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import initialData from "../assets/items";
// import { useIsFocused } from "@react-navigation/native";

export default function VoiceScreen() {
  const isFocused = useIsFocused();
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [img, setImg] = useState(0);
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState([]);
  const [isAiTaking, setIsAiTaking] = useState(false);
  const [equipItem, setEquipItem] = useState(null);

  const data = useSelector((state) => {
    return state;
  });
  useEffect(() => {
    const image = initialData.find((item) => item.id === data.EQUIP);
    setEquipItem(image);
    if (data.DIALOG.length > 0) {
      makingDialog(data.DIALOG);
    }
  }, []);

  useEffect(()=>{
    if(isFocused){
      const image = initialData.find((item) => item.id === data.EQUIP);

      setEquipItem(image);

    }


  },[isFocused])

  const makingDialog = (array) => {
    const temp = array
      .map((subArray) => `User: ${subArray[0]}\n AI: ${subArray[1]}\n`)
      .join("");
    setDialog(temp);
  };

  async function startRecording() {
    try {
      makingDialog(data.DIALOG);

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 48000,
          numberOfChannels: 2,
          bitRate: 192000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 48000,
          numberOfChannels: 2,
          bitRate: 192000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
      setImg(1);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsAiTaking(true);
      setRecording(undefined);
      setIsRecording(false);
      setImg(2);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "audio.m4a",
        type: "audio/m4a",
      });
      formData.append("languageCode", data.USER[1]);
      formData.append("prevDialog", dialog);

      const response = await axios.post(`${SERVER_IP}/transcribe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const audio = response.data.audio;
      const audioFileUri = FileSystem.documentDirectory + "temp.mp3";
      await FileSystem.writeAsStringAsync(audioFileUri, audio, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const { sound: audioSound } = await Audio.Sound.createAsync({
        uri: audioFileUri,
      });
      audioSound.playAsync();

      dispatch(
        addDialog([response.data.sttResponse, response.data.chatResponse])
      );
      dispatch(setProScore(response.data.pronunciation));

      setTimeout(() => {
        setImg(0);
        setIsAiTaking(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  const onPress = async () => {
    if (data.USER[2] === 0) {
      alert("설정창에서 ContextMode를 설정해주세요");
    } else {
      setIsAiTaking(true);
      setImg(2);
      const response = await axios.post(`${SERVER_IP}/contextstart`, {
        input: data.USER[1],
      });
      const audio = response.data.audio;
      const audioFileUri = FileSystem.documentDirectory + "temp.mp3";
      await FileSystem.writeAsStringAsync(audioFileUri, audio, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const { sound: audioSound } = await Audio.Sound.createAsync({
        uri: audioFileUri,
      });
      audioSound.playAsync();
      setTimeout(() => {
        setImg(0);
        setIsAiTaking(false);
      }, 2000);
    }
  };

  return (
    // <ImageBackground
    //   style={styles.voice_screen}
    //   source={
    //     equipItem.backgroundImage === null
    //       ? require("../assets/Ai_default.png")
    //       : equipItem.backgroundImage

    //     // img === 0
    //     //   ? equipItem.backgroundImage
    //     //   : img === 1
    //     //   ? require("../assets/Ai_listening.png")
    //     //   : require("../assets/Ai_talking.png")
    //   }
    // >

    //     <ImageBackground
    //   style={styles.voice_screen}
    //   source={
    //     img === 0
    //       ? equipItem.backgroundImage
    //       : img === 1
    //       ? require("../assets/Ai_listening.png")
    //       : require("../assets/Ai_talking.png")
    //   }
    // >
    // <ImageBackground
    //   style={styles.voice_screen}
    //   source={
    //     img === 0
    //       ? require("../assets/Ai_default.png")
    //       : img === 1
    //       ? require("../assets/Ai_listening.png")
    //       : require("../assets/Ai_talking.png")
    //   }
    // >

    <ImageBackground
      style={styles.voice_screen}
      source={
        img === 0
          ? equipItem?.backgroundImage_default
          : img === 1
          ? equipItem?.backgroundImage_listening
          : equipItem?.backgroundImage_talking
      }
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.contextButton} onPress={onPress}>
          <LinearGradient
            colors={["#D7C4FB", "#D3E3FF"]}
            style={styles.gradient}
          >
            <Text style={styles.text}>context</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isAiTaking}
        >
          <Image
            style={styles.button_bg}
            source={
              isRecording
                ? require("../assets/Mike_on_img.png")
                : require("../assets/Mike_off_img.png")
            }
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.toolbar}>
        <Toolbar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  voice_screen: {
    flex: 1,
  },
  container: {
    flex: 0.9,
  },
  toolbar: {
    flex: 0.1,
  },
  recordButton: {
    position: "absolute",
    left: "36.53%",
    right: "36.8%",
    top: "80%",
    bottom: "30%",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D7C4FB",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },

  contextButton: {
    position: "absolute",
    top: "2%",
    right: "3%",
    width: 100,
  },
  gradient: {
    borderRadius: 20,
    width: 100,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    fontSize: 17,
    letterSpacing: 2,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});
