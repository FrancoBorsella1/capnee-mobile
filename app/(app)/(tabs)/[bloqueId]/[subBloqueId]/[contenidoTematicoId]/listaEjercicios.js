import Fondo from "../../../../../../components/Fondo";
import colors from "../../../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet, View, Image } from "react-native";
import BotonL from "../../../../../../components/BotonL";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../../../context/AuthContext";
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
    
    //Recuperar parámetros de ruta
    const { bloqueId, subBloqueId, contenidoTematicoId } = useLocalSearchParams();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, cursoId } = useAuth();

    const getEjercicios = async () => {
        try {
            const token = await getToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/exercises/get-all-by-course-id-and-thematic-content-id?courseId=${cursoId}&thematicContentId=${contenidoTematicoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNombreContenido(response.data.thematicContent);
            setEjercicios(response.data.exercises);
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
    const handleExercisePress = (ejercicioId) => {
        router.push(`/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/${ejercicioId}/ejercicio`)
    };

    //Volver a pantalla de contenidos
    const handleBack = () => {
        router.push({
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
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner}>
                    {ejercicios.map((ejercicio) => (
                        <BotonL
                            key={ejercicio.id}
                            titulo={ejercicio.title}
                            tamanoFuente={30}
                            onPress={() => handleExercisePress(ejercicio.id)}
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