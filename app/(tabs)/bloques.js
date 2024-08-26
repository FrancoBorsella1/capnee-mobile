import Fondo from "../../components/Fondo";
import BotonL from "../../components/BotonL";
import colors from "../../constants/colors";
import { Text, Image, ScrollView, StyleSheet } from "react-native";

const mathLogo = require('../../assets/math_symbols.png')

export default function Perfil() {
    return (
        <Fondo color={colors.celeste}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.conteiner}>
                <Image source={mathLogo} style={styles.image}/>
                <Text style={styles.texto}>¡A resolver!</Text>
                <BotonL
                    titulo="Números naturales"
                    tamanoFuente={36}
                />
                <BotonL
                    titulo="Operaciones con números naturales"
                    tamanoFuente={32}
                />
                <BotonL
                    titulo="Medida"
                    tamanoFuente={36}
                    habilitado= {false}
                />
                <BotonL
                    titulo="Ejemplo"
                    tamanoFuente={36}
                    habilitado= {false}
                />
                <BotonL
                    titulo="Ejemplo"
                    tamanoFuente={36}
                    habilitado= {false}
                />               
            </ScrollView>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
    },
    image: {
        width: 130,
        height: 130,
        marginTop: 60,
    },
    conteiner: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 10
    },
    texto: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        margin: 15
    }
});