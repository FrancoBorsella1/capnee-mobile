import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../constants/colors";

const logo = require('../assets/student-icon.png');

export default function CartaAlumno({
    nombre = 'Nombre Apellido',
    curso = 'X°X - 20XX'
    //Cambiar por los datos reales que devuelve la petición Año, división, Ciclo lectivo, etc
}) {
    return (
        <View style={styles.conteiner}>
            <View style={styles.imageContainer}>
                <Image source={logo} style={styles.image}/>
            </View>
            <View style={styles.carta}>
                <Text style={styles.nombre}>{nombre}</Text>
                <Text style={styles.curso}>Curso: {curso}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteiner: {
        alignItems: 'center'
    },
    imageContainer: {
        height: 130,
        width: 130,
        borderRadius: 100,
        backgroundColor: colors.gris,
        zIndex: 1,
        marginBottom: -60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 90,
        height: 90,
        marginBottom: -40
    },
    carta: {
        minHeight: 200,
        width: 300,
        backgroundColor: colors.blanco,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 30,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        //Sombra para Android
        elevation: 5
    },
    nombre: {
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        textAlign: 'center',
        margin: 10
    },
    curso: {
        fontFamily: 'Inter_400Regular',
        fontSize: 24
    }
});