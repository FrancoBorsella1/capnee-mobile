import Fondo from "../../../components/Fondo";
import BotonL from "../../../components/BotonL";
import colors from "../../../constants/colors";
import { Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

const mathLogo = require('../../../assets/math_symbols.png');
const API_URL = 'http://149.50.140.55:8082';

//CAMBIAR ESTE CURSO A ID DEPENDIENDO DEL USUARIO, POR AHORA ESTÄ HARDCODEADO
let courseId = 1;

export default function Bloques() {
    //Estados para manejar la carga de bloques
    const [bloques, setBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated } = useAuth();

    const getBloques = async () => {
        try {
            const token = await getToken();
            console.log('Token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/thematic-blocks/get-all-by-course?id=${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBloques(response.data);
            console.log('Bloques: ', bloques);
        } catch (e) {
            console.error('Error al obtener bloques: ', e);
            setError('Error al obtener los bloques.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getBloques();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

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
    const handleBlockPress = (bloqueId, bloqueNombre) => {
        router.push({
            pathname: `/${bloqueId}/listaSubBloques`,
            params: { 
                pantallaAnterior: bloqueNombre,
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
                        onPress={() => handleBlockPress(bloque.id, bloque.name)}
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