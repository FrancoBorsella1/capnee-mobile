import Fondo from "../components/Fondo";
import colors from "../constants/colors";
import { Text, View, Image, StyleSheet } from "react-native";

const logo = require('../assets/logo_capnee.png')

export default function LoginFacial() {
    return(
        <Fondo color={colors.violeta}>
            <Image source={logo} style={styles.image}/>
            <View style={styles.conteiner}>
                <Text style={styles.texto}>Coloca tu cara dentro del óvalo</Text>
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
        justifyContent: 'center',
        gap: 20
    },
    image: {
        height: '10%',
        width: '50%',
        marginBottom: 'auto',
        marginTop: '10%'
    },
    texto: {
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        width: '100%',
        textAlign: 'center',
    },
    cameraContainer: {
        height: '80%',
        width: '80%',
        backgroundColor: '#000',
        borderRadius: 180,
        overflow: 'hidden'
    }
})