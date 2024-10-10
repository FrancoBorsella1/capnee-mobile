import Fondo from "../../../components/Fondo";
import BotonL from "../../../components/BotonL";
import colors from "../../../constants/colors";
import { Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

const mathLogo = require('../../../assets/math_symbols.png');
const API_URL_USER = 'http://149.50.140.55:8081';
const API_URL_ACADEMY = 'http://149.50.140.55:8082';

export default function Bloques() {
    //Estados para manejar la carga de bloques
    const [bloques, setBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, setCursoId, cursoId } = useAuth();

    const getBloques = async () => {
        try {
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
            //Obtener token
            const token = await getToken();

            if (!token) {
                throw new Error("Token no disponible");
            };

            //Decodificar token
            const decoded = jwtDecode(token);

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
        router.push({
            pathname: `/${bloqueId}/listaSubBloques`,
            params: {
                cursoId: cursoId
            }
        });
    };

    return (
        <Fondo color={colors.celeste}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner}>
                <Image source={mathLogo} style={styles.image}/>
                <Text style={styles.texto}>¡A resolver!</Text>
                {bloques.map((bloque) => (
                    <BotonL
                        key={bloque.id}
                        titulo={bloque.name}
                        tamanoFuente={36}
                        habilitado={bloque.isEnabled}
                        onPress={() => handleBlockPress(bloque.id)}
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