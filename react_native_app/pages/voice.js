import React, { useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useDispatch, useSelector } from "react-redux";
import { addDialog, changeContext, addDialog } from "../storage/actions";
import * as FileSystem from "expo-file-system";

export default function VoiceScreen() {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [img, setImg] = useState(0);
  // const [context, setContext] = useState(0);
  const dispatch = useDispatch();
  // const [language , setLanguage] = useState("");
  // const isFocused = useIsFocused();

  const data = useSelector((state) => {
    return state.USER;
  });
  // useEffect(()=>{
  //   getInfo();
  // },[isFocused])

  // const getInfo = async () => {
  //   try {
  //     const response = await axios.post(`${SERVER_IP}/init`, {
  //       id: data.id,
  //     });
  //     setLanguage(response.data.language);
  //     if(data.context ===2){
  //       setContext(2);
  //     }
  //     else{
  //       setContext(response.data.context);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function startRecording() {
    try {
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

      setRecording(undefined);
      setIsRecording(false);
      setImg(2);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "audio.m4a",
        type: "audio/m4a",
      });
      formData.append("languageCode", data[1]);
      formData.append("contextMode", data[2]);
      // if(context === 2){
      //   formData.append('early',data.array1.map(subArray => `User: ${subArray[0]}\n AI: ${subArray[1]}\n`).join(''));
      // }
      const response = await axios.post(`${SERVER_IP}/transcribe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(
        addDialog([
          response.data.sttResponse,
          response.data.chatResponse,
        ])
      );
      dispatch(setScore(response.data.pronunciation))

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
      }, 3000);

      if (context === 1) {
        dispatch(changeContext(2));
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  return (
    <ImageBackground
      style={styles.voice_screen}
      source={
        img === 0
          ? require("../assets/Ai_default.png")
          : img === 1
          ? require("../assets/Ai_listening.png")
          : require("../assets/Ai_talking.png")
      }
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
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
  },
  toolbar: {
    flex: 0.1,
  },
});
