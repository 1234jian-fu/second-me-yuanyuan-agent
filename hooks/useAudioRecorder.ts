import { useState } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export type RecordedAudio = {
  uri: string;
  durationSeconds: number | null;
  fileSize: number | null;
};

export function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);

  async function startRecording() {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      throw new Error("Microphone permission was not granted.");
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    setDurationSeconds(0);

    const { recording: nextRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      (status) => {
        setDurationSeconds(Math.round(status.durationMillis / 1000));
      },
      250,
    );

    setRecording(nextRecording);
    setIsRecording(true);
  }

  async function stopRecording(): Promise<RecordedAudio> {
    if (!recording) {
      throw new Error("No active recording.");
    }

    recording.setOnRecordingStatusUpdate(null);
    const finalStatus = await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();

    setRecording(null);
    setIsRecording(false);

    if (!uri) {
      throw new Error("Recording finished without a file URI.");
    }

    const fileInfo = await FileSystem.getInfoAsync(uri);

    return {
      uri,
      durationSeconds:
        "durationMillis" in finalStatus && typeof finalStatus.durationMillis === "number"
          ? Math.round(finalStatus.durationMillis / 1000)
          : null,
      fileSize: fileInfo.exists && "size" in fileInfo ? fileInfo.size ?? null : null,
    };
  }

  return {
    durationSeconds,
    isRecording,
    startRecording,
    stopRecording,
  };
}
