import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useGestos } from "../app/context/GestosContext";
// import { useCameraContext } from "./CameraContext";

export default function CameraBackground() {
  const [hasPermission, setHasPermission] = useState(false);
  // const [faceData, setFaceData] = useState([]);
  // const { setIsLeftEyeOpen } = useCameraContext();
  // const { setIsRightEyeOpen } = useCameraContext(); // cambio
  const { handleGestos } = useGestos();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  

  // Solo se ejecuta cuando se renderiza

  // useEffect(() => {
  //   if (faceData.length > 0) {
  //     const firstFace = faceData[0];
  //     const ojoDerechoAbierto =
  //       firstFace.leftEyeOpenProbability > 0.9 &&
  //       firstFace.rightEyeOpenProbability < 0.1;
  //     const ojoIzquierdoAbierto =
  //       firstFace.rightEyeOpenProbability > 0.9 &&
  //       firstFace.leftEyeOpenProbability < 0.1;
  //     const sonrisa = firstFace.smilingProbability > 0.7;
  //   //   setIsLeftEyeOpen(ojoIzquierdoAbierto);
  //   //   setIsRightEyeOpen(ojoDerechoAbierto);
      
  //   } else {
  //   //   setIsLeftEyeOpen(false);
  //   //   setIsRightEyeOpen(false);
  //   }
  // }, [faceData]);

  const handleFacesDetected = ({ faces }) => {
    console.log(faces);

    if (faces.length > 0) {
      const lastFace = faces[faces.length - 1];
  
      const ojoIzquierdoAbierto =
        lastFace.leftEyeOpenProbability > 0.7 &&
        lastFace.rightEyeOpenProbability < 0.1;
      const ojoDerechoAbierto =
        lastFace.rightEyeOpenProbability > 0.7 &&
        lastFace.leftEyeOpenProbability < 0.1;
      const sonrisa = lastFace.smilingProbability > 0.7;
  
      if (ojoDerechoAbierto) {
        console.log("Última cara: Guiño derecho detectado");
        handleGestos("rightWink"); // Guiño con el ojo derecho
      } else if (ojoIzquierdoAbierto) {
        console.log("Última cara: Guiño izquierdo detectado");
        handleGestos("leftWink"); // Guiño con el ojo izquierdo
      } else if (sonrisa) {
        console.log("Última cara: Sonrisa detectada");
        handleGestos("smile"); // Sonrisa
      }
    }
  };

  if (hasPermission === false) {
    return <Text>Acceso a la camara denegado</Text>;
  }


  return (
    <Camera
      type={Camera.Constants.Type.front}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 800,
        tracking: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: -1,
      }}
    />
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Coloca la cámara detrás del contenido
  },
});