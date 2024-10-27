import { ScrollView, View, Text, Image, StyleSheet, Modal, Animated, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import Fondo from "../../../../../../../components/Fondo";
import Header from "../../../../../../../components/Header";
import BotonS from "../../../../../../../components/BotonS";
import { BackWhite } from "../../../../../../../components/Icons";
import colors from "../../../../../../../constants/colors";
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { useAuth } from "../../../../../../context/AuthContext";
import axios from "axios";

//Imagenes
const imagenModal = require('../../../../../../../assets/calculator2.png');
const medalla = require('../../../../../../../assets/medal.png');

const API_URL = 'http://149.50.140.55:8082';

export default function Ejercicio(){
    const [ejercicio, setEjercicio] = useState([]);
    //Estado para manejar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Estado para manejar sonidos
    const [errorSound, setErrorSound] = useState();
    const [correctSound, setCorrectSound] = useState();

    //Variable para animación de temblar
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    //Estados para manejar el tiempo
    const [tiempoEnPantalla, setTiempoEnPantalla] = useState(0);

    //Contador de fallos
    const [cantidadFallos, setCantidadFallos] = useState(0);

    //Estado para ejercicio resuelto (HARDCODEADO)
    const [resuelto, setResuelto] = useState(false);
    const [opcionCorrecta, setOpcionCorrecta] = useState(null);

    //Estados de error y de carga
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    //Recuperar parámetros de ruta
    const { bloqueId, subBloqueId, contenidoTematicoId, ejercicioId, isResolved } = useLocalSearchParams();

    //Recuperar token y estado de autenticación
    const { getToken, isAuthenticated, estudianteId } = useAuth();

    const getEjercicio = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${API_URL}/exercises/get-by-id?id=${ejercicioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEjercicio(response.data);
            setOpcionCorrecta(response.data.options[response.data.correctOptionPosition]);

        } catch (e) {
            console.error('Error al obtener ejercicio: ', e);
            setError('Error al obtener el ejercicio.')
        } finally {
            setLoading(false);
        }
    };

    //Obtener el ejercicio
    useEffect(() => {
        if (isAuthenticated) {
            getEjercicio();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, ejercicioId]);

    //Obtener el estado de ejercicio (Resuelto o no resuelto) cuando se monta el componente
    useEffect(() => {
        if (isResolved !== undefined) {
            setResuelto(isResolved === 'true');
        }
    }, [isResolved]);

    //Capturar el tiempo de estadía en pantalla
    useFocusEffect(
        React.useCallback(() => {
            if (resuelto) return;
            let intervalo;

            // eslint-disable-next-line no-undef
            intervalo = setInterval(() => {
                setTiempoEnPantalla((prevTiempo) => prevTiempo + 1);
            }, 1000);

            return () => {
                // eslint-disable-next-line no-undef
                clearInterval(intervalo);
                console.log(`Tiempo en pantalla: ${tiempoEnPantalla} segundos`);
            };
        }, [tiempoEnPantalla, resuelto])
    );

    //Volver a pantalla de contenidos
    const handleBack = () => {

        if (resuelto) {
            setCantidadFallos(0);
        }

        setIsModalOpen(false);
        router.replace(`/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/listaEjercicios`);
    };

    //Gestionar opciones de respuesta
    const handlePress = async (opcionSeleccionada) => {
        if (opcionSeleccionada === ejercicio.options[ejercicio.correctOptionPosition]) {
            setResuelto(true);
            setIsModalOpen(true);
            playCorrectSound();

            //Se construye el objeto que se va a enviar en la petición
            const data = {
                studentId: estudianteId,
                exerciseId: ejercicioId,
                numberOfAttempts: cantidadFallos,
                solved: true,
                resolutionTime: tiempoEnPantalla*1000
            };

            try {
                const response = await axios.post(`${API_URL}/exercises/solve`, data);
                console.log('Se ha enviado el ejercicio correctamente: ', response.data)
            } catch (error) {
                console.error('Error al enviar los datos: ', error);
            }

        } else {
            temblar();
            playErrorSound();
            setCantidadFallos(cantidadFallos + 1);
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
                nombrePagina={ejercicio.title}
                onPress={handleBack}
            />
            {resuelto ? 
                <Image
                source={medalla}
                style={styles.medalla}
                />
                :
                null
            }

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
                        {ejercicio.statement}
                    </Text>
                </ScrollView>
            </View>
            <View style={styles.imagenContainer}>
                <Image 
                    source={{
                        uri: ejercicio.attachedImageBase64
                        ? `data:image/jpeg;base64, ${ejercicio.attachedImageBase64}`
                        : `data:image/png;base64, ${ejercicio.attachedImageBase64}`
                    }} 
                    style={styles.imagen}
                    resizeMode="contain"
                />
            </View>
            <Animated.ScrollView style={[{ transform: [{ translateX: shakeAnimation }] }]}>
            {ejercicio.options && Array.isArray(ejercicio.options) ? (
                ejercicio.options.map((opcion, index) => (
                <BotonS
                    key={index}
                    titulo={opcion}
                    onPress={() => handlePress(opcion)}
                    reproducirSonido={false}
                    habilitado={!resuelto} //El botón se deshabilita si el ejercicio está resuelto
                    colorFondo={resuelto && opcion === opcionCorrecta ? colors.verde : undefined}
                />
                ))
            ) : (
                <Fondo color={colors.celeste}>
                    <ActivityIndicator size="large" color={colors.blanco} style={{flex: 1}}/>
                </Fondo>
            )}
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
    },
    medalla: {
        position: 'absolute',
        zIndex: 1,
        height: 60,
        width: 60,
        top: Constants.statusBarHeight + 10,
        right: 10
    }
})