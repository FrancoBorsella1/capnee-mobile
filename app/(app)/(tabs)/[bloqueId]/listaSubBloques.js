import Fondo from "../../../../components/Fondo";
import colors from "../../../../constants/colors";
import { Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import BotonL from "../../../../components/BotonL";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../../components/Header";
import Constants from 'expo-constants';

const API_URL = 'http://149.50.140.55:8082';

//HARDCODEADO POR AHORA
let courseId = 1;

export default function SubBloques() {
    const [subBloques, setSubBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    //Recuperar bloqueId y nombre del bloque al que se accedió
    const { bloqueId, pantallaAnterior } = useLocalSearchParams();
    
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
            console.log('Sub-bloques: ', subBloques);
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

    //Navegación a contenidos temáticos asociado a un sub-bloque por ID
    const handleSubBlockPress = (subBloqueId, subBloqueNombre) => {
        router.push({
            pathname: `/${bloqueId}/${subBloqueId}/listaContenidos`,
            params: { 
                pantallaAnterior: subBloqueNombre,
            }
        });
    };

    //Volver a pantalla bloques
    const handleBack = () => {
        router.push({
            pathname: `/bloques`,
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
                {subBloques.map((subBloque) => (
                    <BotonL
                        key={subBloque.id}
                        titulo={subBloque.name}
                        tamanoFuente={30}
                        habilitado={subBloque.isEnabled}
                        onPress={() => handleSubBlockPress(subBloque.id)}
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
});