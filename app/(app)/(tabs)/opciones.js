/* eslint-disable no-undef */
import BotonS from "../../../components/BotonS";
import Fondo from "../../../components/Fondo";
import Header from "../../../components/Header";
import colors from "../../../constants/colors";
import { Text, View, StyleSheet } from "react-native";
import { Camera, Eye, Smiley } from "../../../components/Icons";
import { useState, useRef, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { GestosContext, useGestos } from "../../context/GestosContext";

export default function Opciones() {
    //Estados para manejar el cambio de color y texto del botón cuando se activa y desactiva
    const { navegacionActivada, toggleNavegacion, gesture } = useGestos();

    // Estado para manejar la detección de gestos
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(1);
    const buttonActionsRef = useRef({});
    const buttonRefs = useRef([]);
    const backActionRef = useRef(null);
    const [lastGesture, setLastGesture] = useState(null);
    const lastGestureTimeRef = useRef(0);

    const handleActivarNavegacion = () => {
        if (navegacionActivada) {
            toggleNavegacion(false);
            return;
        } else {
            toggleNavegacion(true);
        }
    }

    const router = useRouter();

    // Registro de acciones de botón
    const registerButtonAction = (index, action) => {
    buttonActionsRef.current[index] = action;
    };

    // Registrar la función de volver hacia atrás 
    const registerBackAction = (action) => {
        backActionRef.current = action;
    };

    // Eliminar la función de volver hacia atrás
    const unregisterBackAction = () => {
        backActionRef.current = null;
    };

    //Volver a la ruta anterior
    const handleBack = () => {
        router.replace('/perfil')
    }

    // Efecto para establecer la cantidad de botones
    useFocusEffect(
        useCallback(() => {
            setCantidadBotones(1);
            registerButtonAction(0, handleActivarNavegacion);
        }, [])
    );

    //Lógica para volver hacia atrás con gestos
    useFocusEffect(
        useCallback(() => {
            registerBackAction(handleBack);
            return () => unregisterBackAction();
        }, [handleBack, registerBackAction, unregisterBackAction])
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
                        if (backActionRef.current) {
                            backActionRef.current();
                        }
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
        <Fondo color={colors.amarillo}>
            <Header
                nombrePagina='Ajustes'
                onPress={handleBack}
            />
            {/* <View style={styles.container}>
                <Text style={styles.text}>Inicio de sesión</Text>
                <BotonS
                    titulo="Agregar registro facial"
                    IconoComponente={Camera}
                    tamanoFuente={22}
                />
            </View> */}
            <View style={styles.container}>
                <Text style={styles.text}>Navegación con gestos</Text>
                <BotonS
                    titulo={navegacionActivada ? 'Activado' : 'Desactivado'}
                    IconoComponente={Smiley}
                    tamanoFuente={22}
                    colorFondo={navegacionActivada ? colors.verde : colors.rojo}
                    onPress={handleActivarNavegacion}
                    focused={true}
                    buttonRef={(ref) => {
                        buttonRefs.current[0] = ref;
                        registerButtonAction(0, handleActivarNavegacion);
                    }} 
                />
                {/* <BotonS
                    titulo="Configurar gestos"
                    IconoComponente={Eye}
                    tamanoFuente={22}
                /> */}
            </View>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '85%',
        backgroundColor: colors.blanco,
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        //Sombras para android
        elevation: 5,
    },
    text: {
        width: '100%',
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    }
})