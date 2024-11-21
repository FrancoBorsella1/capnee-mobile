/* eslint-disable no-undef */
import { ScrollView, View, Text, Image, StyleSheet, Modal, Animated, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import Fondo from "../../../../../../../components/Fondo";
import Header from "../../../../../../../components/Header";
import BotonS from "../../../../../../../components/BotonS";
import { BackWhite } from "../../../../../../../components/Icons";
import colors from "../../../../../../../constants/colors";
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Audio } from "expo-av";
import { useAuth } from "../../../../../../context/AuthContext";
import { useGestos } from "../../../../../../context/GestosContext";
import axios from "axios";

//Imagenes
const imagenModal = require('../../../../../../../assets/calculator2.png');
const medalla = require('../../../../../../../assets/medal.png');

const API_URL = 'http://149.50.140.55:8082';

export default function Ejercicio(){
    const [ejercicio, setEjercicio] = useState({});
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

    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(0);
    const buttonActionsRef = useRef({});
    const backActionRef = useRef(null);

    //Recuperar indice de botones
    const { gesture} = useGestos();

    const registerButtonAction = (index, action) => {
        buttonActionsRef.current[index] = action;
    };

    // Eliminar la función de presión de un botón
    const unregisterButtonAction = (index) => {
        delete buttonActionsRef.current[index];
    };

    // Registrar la función de volver hacia atrás 
    const registerBackAction = (action) => {
        backActionRef.current = action;
    };
    
    // Eliminar la función de volver hacia atrás
    const unregisterBackAction = () => {
        backActionRef.current = null;
    };

    //Referencia para el autoscroll de la pantalla
    const scrollViewRef = useRef(null);
    const buttonRefs = useRef([]);

    // Referencia para almacenar el intervalo
    const intervaloRef = useRef(null);

    const getEjercicio = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await axios.get(`${API_URL}/exercises/get-by-id?id=${ejercicioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.options) {
                setEjercicio(response.data);
                setOpcionCorrecta(response.data.options[response.data.correctOptionPosition]);
                setCantidadBotones(response.data.options.length);

            } else {
                throw new Error('Datos del ejercicio incompletos');
            }

        } catch (e) {
            console.error('Error al obtener ejercicio: ', e);
            setError('Error al obtener el ejercicio.');
            // setCantidadBotones(0);
        } finally {
            setLoading(false);
        }
    };

    //Obtener el ejercicio
    useEffect(() => {
        if (isAuthenticated) {
            getEjercicio();
            if (isResolved !== undefined) {
                setResuelto(isResolved === 'true');
            }
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, ejercicioId, isResolved]);

    useFocusEffect(
        useCallback(() => {
            if (ejercicio && ejercicio.options) {
                console.log("Pantalla en foco, ejecutando el efecto");
                setCantidadBotones(ejercicio.options.length);
                console.log("Cantidad de opciones:", ejercicio.options.length);
            }
        }, [ejercicio])
    );

    //Lógica para volver hacia atrás con gestos
    useFocusEffect(
        useCallback(() => {
            registerBackAction(handleBack);
            return () => unregisterBackAction();
        }, [handleBack, registerBackAction, unregisterBackAction])
    );

    //Volver a pantalla de lista de ejercicios
    const handleBack = useCallback(() => {

        if (resuelto) {
            setCantidadFallos(0);
        }

        setIsModalOpen(false);
        router.replace({
            pathname: `/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/listaEjercicios`,
        });

    }, [router]);

    // Detección de gestos
    useFocusEffect(
        useCallback(() => {
            if (gesture !== null) {
                const interval = setInterval(() => {
                    if (gesture === "rightWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo derecho!");
                        setIndiceBotonFocus((prevIndex) => (prevIndex + 1) % cantidadBotones);
                    } else if (gesture === "leftWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo izquierdo!");
                        if (backActionRef.current) {
                            backActionRef.current();
                        }
                        // setIndiceBotonFocus((prevIndex) => (prevIndex - 1 + cantidadBotones) % cantidadBotones);
                    } else if (gesture === "smile" && cantidadBotones > 0) {
                        console.log("Estás sonriendo!");
                        const action = buttonActionsRef.current[indiceBotonFocus];
                        if (action) {
                            action();
                        }
                    }
                }, 400);
    
                // Limpieza para evitar fugas de memoria
                return () => clearInterval(interval);
            }
        }, [gesture, cantidadBotones, indiceBotonFocus])
    );

    //Obtener el estado de ejercicio (Resuelto o no resuelto) cuando se monta el componente
    useFocusEffect(
        useCallback(() => {
            if (isResolved !== undefined) {
                setResuelto(isResolved === 'true');
            }
        }, [isResolved, ejercicioId])
    );
    
    //Capturar el tiempo de estadía en pantalla
    useFocusEffect(
        useCallback(() => {
            if (!resuelto) {
                // Reiniciar el contador de tiempo cada vez que entre al ejercicio
                setTiempoEnPantalla(0);
    
                // Limpiar el intervalo anterior
                if (intervaloRef.current) {
                    clearInterval(intervaloRef.current);
                }
    
                // Establecer un nuevo intervalo para el conteo de tiempo
                intervaloRef.current = setInterval(() => {
                    setTiempoEnPantalla((prevTiempo) => prevTiempo + 1);
                }, 1000);
            }
    
            // Limpiar el intervalo cuando se deje de ver la pantalla
            return () => {
                if (intervaloRef.current) {
                    clearInterval(intervaloRef.current);
                }
            };
        }, [ejercicioId, resuelto])
    );

    console.log(`Tiempo en pantalla: ${tiempoEnPantalla} segundos`);

    //Gestionar opciones de respuesta
    const handlePress = async (opcionSeleccionada) => {
        if (resuelto) return;
    
        const esCorrecta = opcionSeleccionada === ejercicio.options[ejercicio.correctOptionPosition];
        
        if (esCorrecta) {
            // Actualizar estados locales inmediatamente
            setResuelto(true);
            setIsModalOpen(true);
            setOpcionCorrecta(ejercicio.options[ejercicio.correctOptionPosition]);
            playCorrectSound(); 
    
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
            }
    
            // Enviar datos al backend en segundo plano
            try {
                const data = {
                    studentId: estudianteId,
                    exerciseId: ejercicioId,
                    numberOfAttempts: cantidadFallos,
                    solved: true,
                    resolutionTime: tiempoEnPantalla * 1000,
                };
                
                await axios.post(`${API_URL}/exercises/solve`, data);
            } catch (error) {
                console.error('Error al enviar los datos: ', error);
                // Opcional: Mostrar un toast o notificación de error al usuario
            }
        } else {
            if (!resuelto) {
                temblar();
                playErrorSound();
                setCantidadFallos(cantidadFallos + 1);
            }
        }
    };

    // Función para hacer scroll hasta el botón enfocado
    useEffect(() => {
        if (scrollViewRef.current && buttonRefs.current[indiceBotonFocus]) {
            buttonRefs.current[indiceBotonFocus].measureLayout(
                scrollViewRef.current,
                (x, y) => {
                    scrollViewRef.current.scrollTo({ y: y - 100, animated: true });
                }
            );
        }
    }, [indiceBotonFocus]);

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

    return (
        <Fondo color={colors.celeste}>
            <Header
                nombrePagina={ejercicio.title || "Cargando..."}
                onPress={handleBack}
            />
            {loading ? (
                // Indicador de carga
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.blanco} />
                </View>
            ) : (
                // Contenido principal
                <>
                    {resuelto ? (
                        <Image
                            source={medalla}
                            style={styles.medalla}
                        />
                    ) : null}
    
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
                            <Text style={styles.texto}>{ejercicio.statement}</Text>
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
    
                    <Animated.ScrollView 
                        style={[{ transform: [{ translateX: shakeAnimation }] }]} 
                        ref={scrollViewRef}
                    >
                        {ejercicio.options.map((opcion, index) => (
                            <BotonS
                                key={index}
                                titulo={opcion}
                                onPress={() => handlePress(opcion)}
                                reproducirSonido={false}
                                index={index}
                                focused={indiceBotonFocus === index}
                                habilitado={!resuelto}
                                colorFondo={resuelto && opcion === opcionCorrecta ? colors.verde : undefined}
                                buttonRef={(ref) => {
                                    buttonRefs.current[index] = ref;
                                    registerButtonAction(index, () => !resuelto && handlePress(opcion));
                                }}
                            />
                        ))}
                    </Animated.ScrollView>
                </>
            )}
        </Fondo>
    );
    
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