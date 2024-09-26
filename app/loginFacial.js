import Fondo from "../components/Fondo";
import Header from "../components/Header";
import colors from "../constants/colors";
import { Text, View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const logo = require('../assets/logo_capnee.png')


export default function LoginFacial() {
    const router = useRouter();
    
    //Volver a la ruta anterior
    const handleBack = () => {
        router.back();
    }

    return(
        <Fondo color={colors.violeta}>
            <Header
                onPress={handleBack}
            />
            <Image source={logo} style={styles.image}/>
            <Text style={styles.texto}>Coloca tu cara dentro de la figura</Text>
            <View style={styles.conteiner}>
                <View style={styles.cameraContainer}></View>
            </View>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    conteiner: {
        height: '85%',
        width: '100%',
        backgroundColor: colors.blanco,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        alignItems: 'center',
        marginTop: 'auto',
    },
    image: {
        height: '10%',
        width: '40%'
    },
    texto: {
        fontSize: 22,
        fontFamily: 'Inter_700Bold',
        width: '100%',
        textAlign: 'center',
    },
    cameraContainer: {
        height: 580,
        width: 320,
        backgroundColor: '#000',
        borderRadius: 100,
        overflow: 'hidden',
        margin: 'auto'
    }
})