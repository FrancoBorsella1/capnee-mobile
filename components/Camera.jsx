import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, AppState } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useGestos } from "../app/context/GestosContext";

export default function CameraBackground() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const { handleGestos, navegacionActivada } = useGestos();
  const lastGestureTime = useRef(Date.now());
  const GESTURE_COOLDOWN = 500;

  // Manejo de permisos de cámara
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error al solicitar permisos de cámara:", error);
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  // Manejo del estado de la aplicación (activo/inactivo)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      setIsActive(nextAppState === "active");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleFacesDetected = useCallback(({ faces }) => {
    if (!navegacionActivada || !isActive || faces.length === 0) return;

    const currentTime = Date.now();
    if (currentTime - lastGestureTime.current < GESTURE_COOLDOWN) return;

    const face = faces[0]; // Usar la primera cara detectada
    const gestureDetected = detectGesture(face);
     
    if (gestureDetected) {
      lastGestureTime.current = currentTime;
      handleGestos(gestureDetected);
    }
  }, [navegacionActivada, isActive, handleGestos]);

  const detectGesture = (face) => {
    const {
      leftEyeOpenProbability,
      rightEyeOpenProbability,
      smilingProbability
    } = face;

    const isRightEyeClosed = leftEyeOpenProbability < 0.1;
    const isLeftEyeClosed = rightEyeOpenProbability < 0.1;
    const isSmiling = smilingProbability > 0.8;

    // Detección de gestos más precisa
    if (isRightEyeClosed && !isLeftEyeClosed) {
      return "rightWink";
    } else if (isLeftEyeClosed && !isRightEyeClosed) {
      return "leftWink";
    } else if (isSmiling) {
      return "smile";
    }

    return null;
  };

  if (hasPermission === null) {
    return <View style={styles.messageContainer}><Text>Solicitando permiso de cámara...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.messageContainer}><Text>Sin acceso a la cámara</Text></View>;
  }

  return (
    <Camera
      type={Camera.Constants.Type.front}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 400,
        tracking: true,
      }}
      style={styles.camera}
    />
  );
}

const styles = StyleSheet.create({
  camera: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    zIndex: -1,
  },
  messageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  }
});