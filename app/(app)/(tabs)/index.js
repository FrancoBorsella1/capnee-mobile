/* eslint-disable no-undef */
import { Text, Image, StyleSheet, Animated } from "react-native";
import Fondo from "../../../components/Fondo";
import colors from "../../../constants/colors";
import { useRouter, useFocusEffect } from "expo-router";
import BotonL from "../../../components/BotonL";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGestos } from "../../context/GestosContext";
// import { jwtDecode } from "jwt-decode";

const logo = require('../../../assets/calculator.png');

export default function Index() {
    const [user, setUser] = useState({});
    const router = useRouter();
    const { getToken, getPayloadFromJWT } = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);
    const { gesture } = useGestos();

    // Estado para manejar el índice del botón en foco
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(1);
    const buttonActionsRef = useRef({});
    const buttonRefs = useRef([]);
    const [lastGesture, setLastGesture] = useState(null);
    const lastGestureTimeRef = useRef(0);

    //Referencia a la animación de pulsación
    const animacion = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulsacion = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animacion, {
                        toValue: 1.04,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animacion, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        };

        pulsacion();
    }, [animacion]);

    //Obtener token y decodificarlo
    useEffect(() => {
        const getTokenDecodificado = async () => {
            try {
             const token = await getToken();

             if (token) {
                const decoded = getPayloadFromJWT(token);
                console.log(decoded);
                setDecodedToken(decoded);
             }
            } catch (error) {
                console.error('Error decodificando el token: ', error);
            }
        };

        getTokenDecodificado();
    }, [])

    // Registro de acciones de botón
    const registerButtonAction = (index, action) => {
        buttonActionsRef.current[index] = action;
    };

    const handlePress = () => {
        router.push('/bloques');
    };

    // Efecto para establecer la cantidad de botones
    useFocusEffect(
        useCallback(() => {
            setCantidadBotones(1);
            registerButtonAction(0, handlePress);
        }, [])
    );

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
                        // setIndiceBotonFocus((prevIndex) => (prevIndex + 1) % cantidadBotones);
                    } else if (gesture === "leftWink" && cantidadBotones > 0) {
                        console.log("Estás guiñando el ojo izquierdo!");
                    } else if (gesture === "smile" && cantidadBotones > 0) {
                        console.log("Estás sonriendo!");
                        const action = buttonActionsRef.current[indiceBotonFocus];
                        if (action) {
                            action();
                        }
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

    return (
        <Fondo color={colors.verde}>
            <Image source={logo} style={styles.image}/>
            <Text style={styles.texto1}>
                {/* Si el token está decodificado, muestra el nombre del usuario (corta el apellido)*/}
                {decodedToken ? `¡Hola, ${decodedToken.name.split(" ")[0] || 'Usuario'}!` : 'Cargando...'}
            </Text>
            <Text style={styles.texto2}>¿Estás listo/a para aprender?</Text>
            <Animated.View style={{ transform: [{ scale: animacion }] }}>
                <BotonL
                    titulo="¡Resolver!"
                    tamanoFuente={42}
                    style={styles.boton}
                    onPress={handlePress}
                    focused={true}
                    buttonRef={(ref) => {
                        buttonRefs.current[0] = ref;
                        registerButtonAction(0, handlePress);
                    }}
                />
            </Animated.View>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: 300
    },
    texto1: {
        fontFamily: "Inter_700Bold",
        fontSize: 32,
        textAlign: 'center'
    },
    texto2: {
        fontFamily: "Inter_400Regular",
        fontSize: 24,
        marginTop: -5,
        marginBottom: 20,
        textAlign: 'center'
    }
})