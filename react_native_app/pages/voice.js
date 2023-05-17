import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

export default function VoiceScreen() {
  const [recording, setRecording] = useState();
  const [transcription, setTranscription] = useState('');

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
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 48000,
          numberOfChannels: 2,
          bitRate: 192000,
        },
        ios: {
          extension: '.m4a',
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
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'audio.m4a',
      type: 'audio/m4a',
    });

    const response = await axios.post('http://192.168.118.72:5000/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setTranscription(response.data.transcription);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        onPress={recording ? stopRecording : startRecording}
        title={recording ? 'Stop Recording' : 'Start Recording'}
      />
      <Text>Transcription: {transcription}</Text>
    </View>
  );
}