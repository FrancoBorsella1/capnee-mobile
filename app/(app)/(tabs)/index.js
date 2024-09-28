import { Text, Image, StyleSheet, Animated } from "react-native";
import Fondo from "../../../components/Fondo";
import colors from "../../../constants/colors";
import { useRouter } from "expo-router";
import BotonL from "../../../components/BotonL";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const logo = require('../../../assets/calculator.png');

export default function Index() {
    const [user, setUser] = useState({});
    const router = useRouter();
    const { getToken } = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);

    //Referencia a la animación de pulsación
    const animacion = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulsacion = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animacion, {
                        toValue: 1.04,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animacion, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        };

        pulsacion();
    }, [animacion]);

    //Obtener token y decodificarlo
    useEffect(() => {
        const getTokenDecodificado = async () => {
            try {
             const token = await getToken();

             if (token) {
                const decoded = jwtDecode(token);
                console.log(decoded);
                setDecodedToken(decoded);
             }
            } catch (error) {
                console.error('Error decodificando el token: ', error);
            }
        };

        getTokenDecodificado();
    }, [])

    const handlePress = () => {
        router.push('/bloques');
    };

    return (
        <Fondo color={colors.verde}>
            <Image source={logo} style={styles.image}/>
            <Text style={styles.texto1}>
                {/* Si el token está decodificado, muestra el nombre del usuario (corta el apellido)*/}
                {decodedToken ? `¡Hola, ${decodedToken.name.split(" ")[0] || 'Usuario'}!` : 'Cargando...'}
            </Text>
            <Text style={styles.texto2}>¿Estás listo/a para aprender?</Text>
            <Animated.View style={{ transform: [{ scale: animacion }] }}>
                <BotonL
                    titulo="¡Resolver!"
                    tamanoFuente={42}
                    style={styles.boton}
                    onPress={handlePress}
                />
            </Animated.View>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: 300
    },
    texto1: {
        fontFamily: "Inter_700Bold",
        fontSize: 32,
        textAlign: 'center'
    },
    texto2: {
        fontFamily: "Inter_400Regular",
        fontSize: 24,
        marginTop: -5,
        marginBottom: 20,
        textAlign: 'center'
    }
})