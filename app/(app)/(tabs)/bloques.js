/* eslint-disable no-undef */
import Fondo from "../../../components/Fondo";
import BotonL from "../../../components/BotonL";
import colors from "../../../constants/colors";
import { Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { useEffect, useState, useRef, useCallback} from "react";
import { useNavigation} from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import { useGestos } from "../../context/GestosContext";
// import { jwtDecode } from "jwt-decode";

const mathLogo = require('../../../assets/math_symbols.png');
const API_URL_USER = 'http://200.58.106.151:8081';
const API_URL_ACADEMY = 'http://200.58.106.151:8082';

export default function Bloques() {
    //Estados para manejar la carga de bloques
    const [bloques, setBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Estados para la navegación con gestos
    const { gesture} = useGestos();
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(0);
    const buttonActionsRef = useRef({});
    const [lastGesture, setLastGesture] = useState(null);
    const lastGestureTimeRef = useRef(0);

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, getPayloadFromJWT, setCursoId, cursoId } = useAuth();


    //Referencia para el autoscroll de la pantalla
    const scrollViewRef = useRef(null);
    const buttonRefs = useRef([]);
    

    const getBloques = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL_ACADEMY}/thematic-blocks/get-all-by-course?id=${cursoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBloques(response.data);
            // console.log('Bloques: ', bloques);
        } catch (e) {
            console.error('Error al obtener bloques: ', e);
            setError('Error al obtener los bloques.');
        } finally {
            setLoading(false);
        }
    };

    const getCourse = async () => {
        try {
            setLoading(true);
            //Obtener token
            const token = await getToken();

            if (!token) {
                throw new Error("Token no disponible");
            };

            //Decodificar token
            const decoded = getPayloadFromJWT(token);

            if (!decoded) {
                throw new Error("El token no es válido");
            };

            //Petición para traer alumno por id
            const response = await axios.get(`${API_URL_USER}/person/get-by-id?id=${decoded.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCursoId(response.data.courseId);

        } catch (error) {
            console.error('Error decodificando el token: ', error);
        }
    }

    useEffect(() => {
        const fetchCourseAndBlocks = async () => {
            if (isAuthenticated) {
                await getCourse(); 
                if (cursoId) {  
                    await getBloques();     
                }
            } else {
                setLoading(false);
            }
        };
    
        fetchCourseAndBlocks();
    }, [isAuthenticated, cursoId]);

    useFocusEffect(
        useCallback(() => {
            if (bloques.length > 0) {
                console.log("Pantalla en foco, ejecutando el efecto");
                setCantidadBotones(bloques.length);
                console.log("Cantidad de bloques:", bloques.length);
            }
        }, [bloques])
    );


    const registerButtonAction = (index, action) => {
        buttonActionsRef.current[index] = action;
    };

    // Eliminar la función de presión de un botón
    const unregisterButtonAction = (index) => {
        delete buttonActionsRef.current[index];
    };
    
    // Detección de gestos
    useFocusEffect(
        useCallback(() => {
            const handleGesture = () => {
                const currentTime = Date.now();
                
                // Prevenir detecciones repetidas del mismo gesto
                if (gesture === lastGesture) {
                    // Ignorar si el mismo gesto se repite en menos de 1.5 segundos
                    if (currentTime - lastGestureTimeRef.current < 1500) {
                        return;
                    }
                }

                if (gesture !== null) {
                    // Actualizar último gesto y tiempo
                    setLastGesture(gesture);
                    lastGestureTimeRef.current = currentTime;

                    if (gesture === "rightWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo derecho!");
                        setIndiceBotonFocus((prevIndex) => (prevIndex + 1) % cantidadBotones);
                    } else if (gesture === "leftWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo izquierdo!");
                        // setIndiceBotonFocus((prevIndex) => (prevIndex - 1 + cantidadBotones) % cantidadBotones);
                    } else if (gesture === "smile" && cantidadBotones > 0) {
                        console.log("Estás sonriendo!");
                        console.log("Indice boton:" + indiceBotonFocus);
                        console.log(buttonActionsRef.current[indiceBotonFocus]);
                        const action = buttonActionsRef.current[indiceBotonFocus];
                        if (action) {
                            action();
                        }
                    } else if (gesture === "turnLeft") {
                        console.log("Estás girando la cabeza hacia la izquierda!");
                        // router.replace('/perfil');
                    } else if (gesture === "turnRight") {
                        console.log("Estás girando la cabeza hacia la derecha!"); 
                        router.replace('/');
                    }
                }
            };

            // Llamar a handleGesture inmediatamente cuando cambia el gesto
            handleGesture();

            return () => {
                // Limpiar estado de último gesto
                setLastGesture(null);
            };
        }, [gesture, cantidadBotones, indiceBotonFocus])
    );
    
    
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

    //Navegación a sub-bloques asociados a un bloque por ID
    const handleBlockPress = (bloqueId) => {
        router.replace({
            pathname: `/${bloqueId}/listaSubBloques`,
            params: {
                cursoId: cursoId
            }
        });
    };

    return (
        <Fondo color={colors.celeste}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner} ref={scrollViewRef}>
                <Image source={mathLogo} style={styles.image}/>
                <Text style={styles.texto}>¡A resolver!</Text>
                {bloques.map((bloque, index) => (
                    <BotonL
                        key={bloque.id}
                        titulo={bloque.name}
                        tamanoFuente={36}
                        habilitado={bloque.isEnabled}
                        index={index}
                        focused={indiceBotonFocus === index}
                        onPress={() => handleBlockPress(bloque.id)}
                        buttonRef={(ref) => {
                        buttonRefs.current[index] = ref;
                         registerButtonAction(index, () => handleBlockPress(bloque.id)); // Registro de acción
                         }}
                    />
                ))}
            </ScrollView>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
    },
    image: {
        width: 130,
        height: 130,
        marginTop: 20,
    },
    conteiner: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 10
    },
    texto: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        margin: 15
    }
});