import Fondo from "../../../../../../components/Fondo";
import colors from "../../../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet, View, Image } from "react-native";
import BotonL from "../../../../../../components/BotonL";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../../../context/AuthContext";
import { useGestos } from "../../../../../context/GestosContext";
import Header from "../../../../../../components/Header";
import Constants from 'expo-constants';

const API_URL = 'http://149.50.140.55:8082';

//Imagen que se muestra si no hay ejercicios cargados
const imagenAviso = require('../../../../../../assets/calculator3.png');

export default function Ejercicios() {
    const [nombreContenido, setNombreContenido] = useState("");
    const [ejercicios, setEjercicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(0);
    const buttonActionsRef = useRef({})

    //Recuperar indice de botones
    const { gesture} = useGestos();

    const registerButtonAction = (index, action) => {
        buttonActionsRef.current[index] = action;
    };

    // Eliminar la función de presión de un botón
    const unregisterButtonAction = (index) => {
        delete buttonActionsRef.current[index];
    };
    //Recuperar parámetros de ruta
    const { bloqueId, subBloqueId, contenidoTematicoId } = useLocalSearchParams();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, cursoId } = useAuth();

    //Referencia para el autoscroll de la pantalla
    const scrollViewRef = useRef(null);
    const buttonRefs = useRef([]);

    const getEjercicios = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/exercises-students/get-all-by-course-id-and-thematic-content-id?courseId=${cursoId}&thematicContentId=${contenidoTematicoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('ejercicios: ', response.data)
            setNombreContenido(response.data.thematicContent);
            setEjercicios(response.data.exerciseForStudents);
        } catch (e) {
            console.error('Error al obtener Ejercicios: ', e);
            setError('Error al obtener los Ejercicios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getEjercicios();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, contenidoTematicoId]);

    useFocusEffect(
        useCallback(() => {
            if (ejercicios.length > 0) {
                console.log("Pantalla en foco, ejecutando el efecto");
                setCantidadBotones(ejercicios.length);
                console.log("Cantidad de ejercicios:", ejercicios.length);
            }
        }, [ejercicios])
    );

    // Función para hacer scroll hasta el botón enfocado
    useFocusEffect(
        useCallback(() => {
            console.log("SUBBLOQUES");
            if (gesture !== null) {
                const interval = setInterval(() => {
                    if (gesture === "rightWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo derecho!");
                        setIndiceBotonFocus((prevIndex) => (prevIndex + 1) % cantidadBotones);
                    } else if (gesture === "leftWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo izquierdo!");
                        setIndiceBotonFocus((prevIndex) => (prevIndex - 1 + cantidadBotones) % cantidadBotones);
                    } else if (gesture === "smile" && cantidadBotones > 0) {
                        console.log("Estás sonriendo!");
                        console.log("Indice boton:" + indiceBotonFocus);
                        console.log(buttonActionsRef.current[indiceBotonFocus]);
                        const action = buttonActionsRef.current[indiceBotonFocus];
                        if (action) {
                            action();
                        }
                    }
                }, 300); // Repite cada 300ms (ajusta según sea necesario)
    
                // Limpieza para evitar fugas de memoria
                return () => clearInterval(interval);
            }
        }, [gesture, cantidadBotones, indiceBotonFocus]) // Asegúrate de incluir las dependencias necesarias
    );


    if (loading) {
        return (
            <Fondo color={colors.celeste}>
                <ActivityIndicator size="large" color={colors.blanco} style={{flex: 1}}/>
            </Fondo>
        );
    }

    if (error) {
        return <Text>{error}</Text>
    }

    //Navegar hacia un ejercicio en particular
    const handleExercisePress = (ejercicioId, isResolved) => {
        router.replace({
            pathname: `/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/${ejercicioId}/ejercicio`,
            params: { isResolved }
        })
    };

    //Volver a pantalla de contenidos
    const handleBack = () => {
        router.replace({
            pathname: `/${bloqueId}/${subBloqueId}/listaContenidos`,
        });
    };


    return (
        <Fondo color={colors.celeste}>
            <Header
                onPress={handleBack}
                nombrePagina={`Ejercicios: ${nombreContenido}`}
            />
            { ejercicios.length > 0 ?
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner} ref={scrollViewRef}>
                    {ejercicios.map((ejercicio, index) => (
                        <BotonL
                            key={ejercicio.id}
                            titulo={ejercicio.title}
                            tamanoFuente={30}
                            index={index}
                            focused={indiceBotonFocus === index}
                            onPress={() => handleExercisePress(ejercicio.id, ejercicio.isResolved)}
                            resuelto={ejercicio.isResolved}
                            buttonRef={(ref) => {
                                buttonRefs.current[index] = ref;
                                 registerButtonAction(index, () => handleExercisePress(ejercicio.id)); // Registro de acción
                                 }}
                        />
                    ))}
                </ScrollView>
                :
                <View style={styles.aviso}>
                    <Text style={styles.texto}>Todavía no hay ejercicios</Text>
                    <Image
                        source={imagenAviso}
                        style={styles.imagenAviso}
                        resizeMode="contain"
                    />      
                </View>
            }
        </Fondo>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        marginTop: Constants.statusBarHeight + 60
    },
    conteiner: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 10
    },
    texto: {
        fontSize: 26,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center'
    },
    aviso: {
        alignItems: 'center'
    },
    imagenAviso: {
        height: 250
    }
});