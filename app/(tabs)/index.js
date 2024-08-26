import { Text, Image, StyleSheet } from "react-native";
import Fondo from "../../components/Fondo";
import colors from "../../constants/colors";
import { useRouter, Link } from "expo-router";
import BotonL from "../../components/BotonL";

const logo = require('../../assets/calculator.png');

export default function Index() {
    const router = useRouter();

    const handlePress = () => {
        router.push('/bloques');
    };

    return (
        <Fondo color={colors.verde}>
            <Image source={logo} style={styles.image}/>
            <Text style={styles.texto1}>¡Hola, Nombre!</Text>
            <Text style={styles.texto2}>¿Estás listo/a para aprender?</Text>
            <BotonL
                titulo="¡Resolver!"
                tamanoFuente={42}
                style={styles.boton}
                onPress={handlePress}
            />
            <Link href="/login">
                Ir al login
            </Link>
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
        fontSize: 32
    },
    texto2: {
        fontFamily: "Inter_400Regular",
        fontSize: 24,
        marginTop: -5,
        marginBottom: 20
    }
})