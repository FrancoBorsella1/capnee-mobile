import BotonS from "../../../components/BotonS";
import Fondo from "../../../components/Fondo";
import Header from "../../../components/Header";
import colors from "../../../constants/colors";
import { Text, View, StyleSheet } from "react-native";
import { Camera, Eye, Smiley } from "../../../components/Icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Opciones() {
    //Estados para manejar el cambio de color y texto del botón cuando se activa y desactiva
    const [navegacionActivada, setNavegacionActivada] = useState(false);

    const handleActivarNavegacion = () => {
        if (navegacionActivada) {
            setNavegacionActivada(false);
            return;
        } else {
            setNavegacionActivada(true);
        }
    }

    const router = useRouter();

    //Volver a la ruta anterior
    const handleBack = () => {
        router.replace('/perfil')
    }

    return (
        <Fondo color={colors.amarillo}>
            <Header
                nombrePagina='Ajustes'
                onPress={handleBack}
            />
            <View style={styles.container}>
                <Text style={styles.text}>Inicio de sesión</Text>
                <BotonS
                    titulo="Agregar registro facial"
                    IconoComponente={Camera}
                    tamanoFuente={22}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Navegación con gestos</Text>
                <BotonS
                    titulo={navegacionActivada ? 'Activado' : 'Desactivado'}
                    IconoComponente={Smiley}
                    tamanoFuente={22}
                    colorFondo={navegacionActivada ? colors.verde : colors.rojo}
                    onPress={handleActivarNavegacion} 
                />
                <BotonS
                    titulo="Configurar gestos"
                    IconoComponente={Eye}
                    tamanoFuente={22} 
                />
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