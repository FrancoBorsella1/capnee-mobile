/* eslint-disable no-undef */
import Fondo from "../../../components/Fondo";
import CartaAlumno from "../../../components/CartaAlumno";
import colors from "../../../constants/colors";
import BotonS from "../../../components/BotonS";
import { Gear, Close } from "../../../components/Icons";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { useGestos } from "../../context/GestosContext";
// import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_URL = 'http://149.50.140.55:8081';

export default function Perfil() {
    const { logout, getPayloadFromJWT } = useAuth();
    const router = useRouter();
    const { getToken } = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);
    const [curso, setCurso] = useState(null);
    const { gesture } = useGestos();

    // Estado para manejar la navegación con gestos
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(2);
    const buttonActionsRef = useRef({});
    const buttonRefs = useRef([]);
    const [lastGesture, setLastGesture] = useState(null);
    const lastGestureTimeRef = useRef(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //Obtener token guardado
                const token = await getToken();

                if (!token) {
                    throw new Error("Token no disponible");
                };

                //Decodificar token
                const decoded = getPayloadFromJWT(token);
                setDecodedToken(decoded);
                console.log("Decodificado: ", decoded);

                if (!decoded) {
                    throw new Error("El token no es válido");
                };

                //Petición para traer alumno por id
                const response1 = await axios.get(`${API_URL}/person/get-by-id?id=${decoded.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const userData = response1.data;
                console.log("Usuario:", userData);

                if (userData && userData.courseId) {
                    //Petición para traer cursos por id
                    const response2 = await axios.get(`${API_URL}/course/get-by-id?id=${userData.courseId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const courseData = response2.data;
                    setCurso(courseData);
                    console.log("Curso: ", curso);
                } else {
                    throw new Error("El usuario no tiene courseId");
                }
    
            } catch (error) {
                console.error('Error decodificando el token: ', error);
            } 
        };

        fetchData();
    }, []);

    //Cambiar el formato del dato Nivel para mostrarlo en pantalla
    const formatearNivel = (nivel) => {
        switch (nivel) {
            case "LEVEL_1":
                return "1";
            case "LEVEL_2":
                return "2";
            case "LEVEL_3":
                return "3";
            default:
                return "X";
        }
    };

    // Registro de acciones de botón
    const registerButtonAction = (index, action) => {
        buttonActionsRef.current[index] = action;
    };

    const handleOptions = async () => {
        router.replace('/opciones');
    }

    const handleLogout = async () => {
        await logout();
    }

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
                    } else if (gesture === "smile" && cantidadBotones > 0) {
                        console.log("Estás sonriendo!");
                        const action = buttonActionsRef.current[indiceBotonFocus];
                        if (action) {
                            action();
                        }
                    } else if (gesture === "turnLeft") {
                        console.log("Estás girando la cabeza hacia la izquierda!");
                        router.replace('/');
                    } else if (gesture === "turnRight") {
                        console.log("Estás girando la cabeza hacia la derecha!"); 
                        router.replace('/bloques');
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
            <CartaAlumno
                nombre={decodedToken ? `${decodedToken.name || 'Nombre Apellido'}`: 'Cargando...'}
                curso={curso ? `${formatearNivel(curso.level)}°${curso.division} - ${curso.academicYear}` || 'X°X - 20XX' : 'Cargando...'}
            />
            <BotonS
                titulo="Ajustes"
                IconoComponente={Gear}
                onPress={handleOptions}
                focused={indiceBotonFocus === 0}
                buttonRef={(ref) => {
                    buttonRefs.current[0] = ref;
                    registerButtonAction(0, handleOptions);
                }}
            />
            <BotonS 
                titulo="Cerrar sesión"
                IconoComponente={Close}
                colorFondo={colors.rojo}
                onPress={handleLogout}
                focused={indiceBotonFocus === 1}
                buttonRef={(ref) => {
                    buttonRefs.current[1] = ref;
                    registerButtonAction(1, handleLogout);
                }}
            />
        </Fondo>
    );
}