/* eslint-disable no-undef */
import Fondo from "../../../../../components/Fondo";
import colors from "../../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import BotonL from "../../../../../components/BotonL";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { useGestos } from "../../../../context/GestosContext";
import Header from "../../../../../components/Header";
import Constants from 'expo-constants';

const API_URL = 'http://149.50.140.55:8082';

export default function Contenidos() {
    const [nombreSubBloque, setNombreSubBloque] = useState("");
    const [contenidos, setContenidos] = useState([]);
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
    
    //Recuperar id y nombre del sub-bloque al que se accedió
    const { bloqueId, subBloqueId } = useLocalSearchParams();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, cursoId } = useAuth();

    //Referencia para el autoscroll de la pantalla
    const scrollViewRef = useRef(null);
    const buttonRefs = useRef([]);

    const getContenidos = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/thematic-content/get-all-by-thematic-subblock-id-and-course-id?thematicSubblockId=${subBloqueId}&courseId=${cursoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNombreSubBloque(response.data.thematicSubblock)
            setContenidos(response.data.thematicContents);
        } catch (e) {
            console.error('Error al obtener Contenidos: ', e);
            setError('Error al obtener los Contenidos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getContenidos();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, subBloqueId]);

    useFocusEffect(
        useCallback(() => {
            if (contenidos.length > 0) {
                console.log("Pantalla en foco, ejecutando el efecto");
                setCantidadBotones(contenidos.length);
                console.log("Cantidad de contenidos:", contenidos.length);
            }
        }, [contenidos])
    );

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
                }, 400);
    
                // Limpieza para evitar fugas de memoria
                return () => clearInterval(interval);
            }
        }, [gesture, cantidadBotones, indiceBotonFocus]) // Asegúrate de incluir las dependencias necesarias
    );

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

    //Navegación a ejercicios asociados a un contenido por ID
    const handleContentPress = (contenidoTematicoId) => {
        router.replace({
            pathname: `/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/listaEjercicios`,
        });
    };

    //Volver a pantalla de sub-bloques
    const handleBack = () => {
        router.replace({
            pathname: `/${bloqueId}/listaSubBloques`,
        });
    };

    return (
        <Fondo color={colors.celeste}>
            <Header
                onPress={handleBack}
                nombrePagina={nombreSubBloque}
            />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner} ref={scrollViewRef}>
                {contenidos.map((contenido, index) => (
                    <BotonL
                        key={contenido.id}
                        titulo={contenido.name}
                        tamanoFuente={30}
                        index={index}
                        focused={indiceBotonFocus === index}
                        onPress={() => handleContentPress(contenido.id)}
                        buttonRef={(ref) => {
                            buttonRefs.current[index] = ref;
                             registerButtonAction(index, () => handleContentPress(contenido.id)); // Registro de acción
                             }}
                    />
                ))}
            </ScrollView>
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
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center'
    }
});