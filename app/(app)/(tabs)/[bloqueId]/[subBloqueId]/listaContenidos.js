import Fondo from "../../../../../components/Fondo";
import colors from "../../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import BotonL from "../../../../../components/BotonL";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import Header from "../../../../../components/Header";
import Constants from 'expo-constants';

const API_URL = 'http://149.50.140.55:8082';

//HARDCODEADO POR AHORA
let courseId = 1;

export default function Contenidos() {
    const [contenidos, setContenidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    //Recuperar id y nombre del sub-bloque al que se accedió
    const { bloqueId, subBloqueId, pantallaAnterior } = useLocalSearchParams();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated } = useAuth();

    const getContenidos = async () => {
        try {
            const token = await getToken();
            console.log('Token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/thematic-content/get-all-by-thematic-subblock-id-and-course-id?thematicSubblockId=${subBloqueId}&courseId=${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setContenidos(response.data);
            console.log('Contenidos temáticos: ', contenidos);
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
    const handleContentPress = (contenidoTematicoId, contenidoTematicoNombre) => {
        router.push({
            pathname: `/${bloqueId}/${subBloqueId}/${contenidoTematicoId}/listaEjercicios`,
            params: {
                pantallaAnterior: contenidoTematicoNombre,
            }
        });
    };

    //Volver a pantalla de sub-bloques
    const handleBack = () => {
        router.push({
            pathname: `/${bloqueId}/listaSubBloques`,
            params: { pantallaAnterior }
        });
    };

    return (
        <Fondo color={colors.celeste}>
            <Header
                onPress={handleBack}
                nombrePagina={pantallaAnterior}
            />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner}>
                {contenidos.map((contenido) => (
                    <BotonL
                        key={contenido.id}
                        titulo={contenido.name}
                        tamanoFuente={30}
                        onPress={() => handleContentPress(contenido.id)}
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