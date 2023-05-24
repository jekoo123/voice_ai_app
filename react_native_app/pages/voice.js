import React, { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { addArray1 } from "../storage/actions";

export default function VoiceScreen() {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();

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

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "audio.m4a",
        type: "audio/m4a",
      });
      const response = await axios.post(
        "http://192.168.28.72:5000/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(addArray1([response.data.sttResponse, response.data.chatResponse]));
      const audioUrl = response.data.audioUrl;
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      newSound.playAsync();
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  return (
    <ImageBackground
      style={styles.voice_screen}
      source={
        isRecording
          ? require("../assets/Ai_talking.png")
          : require("../assets/Ai_listening.png")
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
      <View style={styles.toolbar} >
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
  toolbar:{
    flex:0.1

  }
});