import { Text, View, StyleSheet, Image, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import Fondo from "../components/Fondo";
import colors from "../constants/colors";
import BotonS from "../components/BotonS";
import BotonL from "../components/BotonL";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";

const logo = require('../assets/logo_capnee.png')

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        setMensajeError('');

        if (!username || !password) {
            setMensajeError('No te olvides de llenar todas las casillas 😊');
            return;
        }

        const success = await login(username, password);
        if (success) {
            router.replace('/'); // Redirigir a la pantalla principal si está autenticado
        } else {
            setMensajeError('Ups, algo no está bien. ¡Intenta de nuevo!');
        }
    };

    return(
        <Fondo color={colors.violeta}>
            <Image source={logo} style={styles.image}/>
            <View style={styles.conteiner}>
                <Text style={styles.texto}>¡Bienvenido/a!</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername} 
                    style={styles.textInput}
                    placeholder="Usuario/a"
                    maxLength={20}
                />
                <TextInput                     
                    value={password}
                    onChangeText={setPassword} 
                    style={styles.textInput}
                    placeholder="Contraseña"
                    maxLength={20}
                    secureTextEntry={true}
                />
                {mensajeError ? <Text style={styles.errorText}>{mensajeError}</Text> : null}
                <BotonS
                    titulo="Iniciar sesión"
                    onPress={handleLogin}
                />
                <BotonL
                    titulo="Inicio de sesión facial"
                    tamanoFuente={24}
                />         
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
    },
    errorText: {
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
        color: colors.rojo
    }

});