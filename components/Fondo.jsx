//Fondo con patrón numérico. El color se pasa como prop.

import { StyleSheet, ImageBackground } from "react-native";

export default function Fondo({ color, children }) {
    return (
        <ImageBackground
            source={require('../assets/number_pattern.png')}
            style={[styles.fondo, { backgroundColor: color }]}
        >
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});