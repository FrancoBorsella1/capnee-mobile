import { ScrollView, View, Text, Image, StyleSheet, Modal, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Fondo from "../../../../../../../components/Fondo";
import Header from "../../../../../../../components/Header";
import BotonS from "../../../../../../../components/BotonS";
import { BackWhite } from "../../../../../../../components/Icons";
import colors from "../../../../../../../constants/colors";
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

const imagenEnunciadoEjemplo = require('../../../../../../../assets/ejemplo_ejercicio.jpg');

//Imagen Modal
const imagenModal = require('../../../../../../../assets/calculator2.png')

const ejercicio = { 
        id: 1,
        titulo: 'Ejercicio',
        enunciado: '¿Cuántos dedos tiene el ser humano?',
        opciones: [4, 6, 5, 7],
        posicionOpcionCorrecta: 2
}

export default function Ejercicio(){
    //Estado para manejar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Estado para manejar sonidos
    const [errorSound, setErrorSound] = useState();
    const [correctSound, setCorrectSound] = useState();

    //Variable para animación de temblar
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const router = useRouter();

    //Recuperar parámetros de ruta
    const { bloqueId, subBloqueId, contenidoTematicoId, ejercicioId, pantallaAnterior } = useLocalSearchParams();

    //Volver a pantalla de contenidos
    const handleBack = () => {
        setIsModalOpen(false);
        router.push(`/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/listaEjercicios`);
    };

    //Gestionar opciones de respuesta
    const handlePress = (opcionSeleccionada) => {
        if (opcionSeleccionada === ejercicio.opciones[ejercicio.posicionOpcionCorrecta]) {
            setIsModalOpen(true);
            playCorrectSound();

        } else {
            temblar();
            playErrorSound();
        }
    }

    // Función para animación de temblar
    const temblar = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    }

    //Reproducir sonido de error
    async function playErrorSound() {
        const { sound } = await Audio.Sound.createAsync( require('./../../../../../../../assets/sounds/error.mp3'));
        setErrorSound(sound);
        await sound.playAsync();
    }

    //Reproducir sonido correcto
    async function playCorrectSound() {
        const { sound } = await Audio.Sound.createAsync( require('./../../../../../../../assets/sounds/acierto.mp3'));
        setCorrectSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return () => {
            if (correctSound) {
                correctSound.unloadAsync();
            }

            if (errorSound) {
                errorSound.unloadAsync();
            }
        };
    }, [correctSound, errorSound]);

    return(
        <Fondo color={colors.celeste}>
            <Header
                nombrePagina={"Ejercicio"}
                onPress={handleBack}
            />
            <Modal animationType="fade" visible={isModalOpen} transparent>
                <View style={styles.modal}>
                    <View style={styles.modalCard}>
                        <Text style={styles.textoModal}>¡Muy bien!</Text>
                        <Image
                            source={imagenModal}
                            style={styles.imagenModal}
                            resizeMode="contain"
                        />
                        <BotonS
                            titulo="Volver a ejercicios"
                            IconoComponente={BackWhite}
                            onPress={handleBack}
                        />
                    </View>
                </View>
            </Modal>
            <View style={styles.enunciadoWrapper}>
                <ScrollView contentContainerStyle={styles.scrollContenido}>
                    <Text style={styles.texto}>
                        {ejercicio.enunciado}
                    </Text>
                </ScrollView>
            </View>
            <View style={styles.imagenContainer}>
                <Image 
                    source={imagenEnunciadoEjemplo} 
                    style={styles.imagen}
                    resizeMode="contain"
                />
            </View>
            <Animated.ScrollView style={[{ transform: [{ translateX: shakeAnimation }]} ]}>
                {ejercicio.opciones.map((opcion, index) => (
                    <BotonS
                        key={index}
                        titulo={opcion}
                        onPress={() => handlePress(opcion)}
                    />
                ))}
            </Animated.ScrollView>
        </Fondo>
    )
}

const styles = StyleSheet.create({
    texto: {
        fontSize: 24,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center'
    },
    enunciadoWrapper: {
        maxHeight: 140,
        width: '100%',
        marginTop: Constants.statusBarHeight + 60,
    },
    scrollContenido: {
        flexGrow: 1
    },
    imagen: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imagenContainer: {
        width: 300,
        height: 200,
        margin: 10,
        borderRadius: 10,
        backgroundColor: colors.blanco,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        //Sombra para Android
        elevation: 5
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalCard: {
        height: 470,
        width: 340,
        backgroundColor: colors.blanco,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagenModal: {
        height: 250
    },
    textoModal: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
    }
})