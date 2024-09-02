import Fondo from "../../../../components/Fondo";
import colors from "../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import BotonL from "../../../../components/BotonL";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const API_URL = 'http://149.50.140.55:8082';

//HARDCODEADO POR AHORA
let courseId = 1;

export default function SubBloques() {
    const [subBloques, setSubBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    //Recuperar bloqueId de
    const { bloqueId } = useLocalSearchParams();

    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated } = useAuth();

    const getSubBloques = async () => {
        try {
            const token = await getToken();
            console.log('Token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/thematic-subblocks/get-all-by-course-and-thematic-block?courseId=${courseId}&thematicBlockId=${bloqueId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSubBloques(response.data);
            console.log('Datos: ', subBloques);
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


    return (
        <Fondo color={colors.celeste}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner}>
                <Text style={styles.texto}>Nombre del Bloque asociado</Text>
                {subBloques.map((subBloque) => (
                    <BotonL
                        key={subBloque.id}
                        titulo={subBloque.name}
                        tamanoFuente={30}
                        habilitado={subBloque.isEnabled}
                        // onPress={() => handleBlockPress(bloque.id)}
                    />
                ))}
            </ScrollView>
        </Fondo>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        paddingTop: '10%'
    },
    conteiner: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 10
    },
    texto: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        margin: 15,
        textAlign: 'center'
    }
});