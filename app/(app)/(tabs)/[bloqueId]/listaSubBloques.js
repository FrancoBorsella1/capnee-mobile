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

export default function SubBloques() {
    const [nombreBloque, setNombreBloque] = useState("");
    const [subBloques, setSubBloques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    //Recuperar bloqueId y nombre del bloque al que se accedió
    const { bloqueId } = useLocalSearchParams();
    
    //Recuperar token y estado de autenticación del AuthContext
    const { getToken, isAuthenticated, cursoId } = useAuth();

    const getSubBloques = async () => {
        try {
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
        router.push({
            pathname: `/${bloqueId}/${subBloqueId}/listaContenidos`,
        });
    };

    //Volver a pantalla bloques
    const handleBack = () => {
        router.push({
            pathname: `/bloques`,
        });
    };

    return (
        <Fondo color={colors.celeste}>
            <Header
                onPress={handleBack}
                nombrePagina={nombreBloque}
            />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner}>
                {Array.isArray(subBloques) && subBloques.length > 0 ? (
                    subBloques.map((subBloque) => (
                        <BotonL
                            key={subBloque.id}
                            titulo={subBloque.name}
                            tamanoFuente={30}
                            habilitado={subBloque.isEnabled}
                            onPress={() => handleSubBlockPress(subBloque.id, subBloque.name)}
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