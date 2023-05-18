import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
export default function VoiceScreen({ navigation }) {
  const [recording, setRecording] = useState();
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [chatdata, setChatdata] = useState([]);
  useEffect(() => {
    if (transcription !== "") {
      submitMessage();
    }
  }, [transcription]);

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
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "audio.m4a",
      type: "audio/m4a",
    });
    const response = await axios.post(
      "http://192.168.0.8:5000/transcribe",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setIsRecording(false);
    setTranscription(response.data.transcription || null);
  }

  const submitMessage = async () => {
    try {
      const result = await axios.post("http://192.168.0.8:5000/chat", {
        input: transcription,
      });
      setChatdata([
        ...chatdata,
        { input: transcription, response: result.data.response },
      ]);
      playSound(result.data.response);
    } catch (error) {
      console.error(error);
    }
  };
  async function playSound(text) {
    try {
      const response = await axios.post("http://192.168.0.8:5000/tts", {
        text,
      });
  
      // Assuming the TTS service returns a JSON object with the URL of the audio file
      const audioUrl = response.data.url;
  
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      newSound.playAsync();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={[styles.button, styles.chatButton]}
        onPress={() => navigation.navigate("Chat", { chatdata })}
      >
        <Text style={styles.buttonText}>Chat Log</Text>
      </TouchableOpacity>
      <Image
        source={
          isRecording
            ? require("../assets/asuna.png")
            : require("../assets/asuna1.png")
        }
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.recordContainer}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={[styles.buttonText, { color: "black" }]}>
            {isRecording ? "Off" : "On"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#B814B4",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  recordButton: {
    backgroundColor: "beige",
    borderRadius: 10,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatButton: {
    position: "absolute",
    top: 0,
    right: 0,
    marginRight: 20,
    marginTop: 20,
  },
  image: {
    marginLeft: 10,
    width: 300,
    height: 500,
  },
});
