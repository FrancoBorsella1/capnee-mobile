import { Text, View, StyleSheet, Image, TextInput } from "react-native";
import { Link } from "expo-router";
import Fondo from "../components/Fondo";
import colors from "../constants/colors";
import BotonS from "../components/BotonS";
import BotonL from "../components/BotonL";

const logo = require('../assets/logo_capnee.png')

export default function Login() {
    return(
        <Fondo color={colors.violeta}>
            <Image source={logo} style={styles.image}/>
            <View style={styles.conteiner}>
                <Text style={styles.texto}>¡Bienvenido/a!</Text>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Usuario/a"
                    maxLength={20}
                />
                <TextInput 
                    style={styles.textInput}
                    placeholder="Contraseña"
                    maxLength={20}
                    secureTextEntry={true}
                />
                <BotonS
                    titulo="Iniciar sesión"
                />
                <BotonL
                    titulo="Inicio de sesión facial"
                />         
                <Link href="/">
                    Ir al Index
                </Link>
            </View>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    conteiner: {
        height: '70%',
        width: '100%',
        backgroundColor: colors.blanco,
        marginTop: 'auto',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        alignItems: 'center',
        padding: 10
    },
    image: {
        height: '20%',
        width: '80%',
        marginBottom: 'auto',
        marginTop: '12%'
    },
    texto: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        margin: 15
    },
    textInput: {
        height: 60,
        width: 300,
        borderRadius: 10,
        backgroundColor: colors.grisClaro,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 24,
        margin: 10
    }
});