import Fondo from "../../../../components/Fondo";
import colors from "../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import BotonL from "../../../../components/BotonL";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigation} from "expo-router";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useGestos } from "../../../context/GestosContext";
import Header from "../../../../components/Header";
import Constants from 'expo-constants';

const API_URL = 'http://149.50.140.55:8082';

export default function SubBloques() {
    const [nombreBloque, setNombreBloque] = useState("");
    const [subBloques, setSubBloques] = useState([]);
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
    
    //Recuperar bloqueId y nombre del bloque al que se accedió
    const { bloqueId } = useLocalSearchParams();
    
    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, cursoId } = useAuth();

    //Referencia para el autoscroll de la pantalla
    const scrollViewRef = useRef(null);
    const buttonRefs = useRef([]);

    const getSubBloques = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/thematic-subblocks/get-all-by-course-and-thematic-block?courseId=${cursoId}&thematicBlockId=${bloqueId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNombreBloque(response.data.thematicBlock);
            setSubBloques(response.data.subBlocks);
        } catch (e) {
            console.error('Error al obtener Sub-bloques: ', e);
            setError('Error al obtener los Sub-bloques.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getSubBloques();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, bloqueId]);

    useFocusEffect(
        useCallback(() => {
            if (subBloques.length > 0) {
                console.log("Pantalla en foco, ejecutando el efecto");
                setCantidadBotones(subBloques.length);
                console.log("Cantidad de bloques:", subBloques.length);
            }
        }, [subBloques])
    );

    // Función para hacer scroll hasta el botón enfocado
    // Función para hacer scroll hasta el botón enfocado
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

    //Navegación a contenidos temáticos asociado a un sub-bloque por ID
    const handleSubBlockPress = (subBloqueId) => {
        router.replace({
            pathname: `/${bloqueId}/${subBloqueId}/listaContenidos`,
        });
    };

    //Volver a pantalla bloques
    const handleBack = () => {
        router.replace({
            pathname: `/bloques`,
        });
    };

    return (
        <Fondo color={colors.celeste}>
            <Header
                onPress={handleBack}
                nombrePagina={nombreBloque}
            />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner} ref={scrollViewRef}>
                {Array.isArray(subBloques) && subBloques.length > 0 ? (
                    subBloques.map((subBloque, index) => (
                        <BotonL
                            key={subBloque.id}
                            titulo={subBloque.name}
                            tamanoFuente={30}
                            habilitado={subBloque.isEnabled}
                            index={index}
                            focused={indiceBotonFocus === index}
                            onPress={() => handleSubBlockPress(subBloque.id, subBloque.name)}
                            buttonRef={(ref) => {
                                buttonRefs.current[index] = ref;
                                 registerButtonAction(index, () => handleSubBlockPress(subBloque.id)); // Registro de acción
                                 }}
                        />
                    ))
                ) : (
                    <Text>No hay sub-bloques disponibles</Text>
                )}
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
});