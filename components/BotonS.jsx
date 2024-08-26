import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../constants/colors";

// Función para oscurecer cualquier color
const darkenColor = (color, factor = 0.2) => {
    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * factor * 100);
    let R = (num >> 16) - amt,
      G = ((num >> 8) & 0x00FF) - amt,
      B = (num & 0x0000FF) - amt;
  
    return `#${(
      0x1000000 +
      (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 +
      (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 +
      (B < 0 ? 0 : B > 255 ? 255 : B)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
};
  

export default function BotonS({
    titulo,
    colorFondo = colors.violeta,
    IconoComponente,
    tamanoFuente = 22,
    onPress
}) {
    
    // Función para oscurecer al botón cuando se presiona
    const colorFondoOscuro = darkenColor(colorFondo);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? colorFondoOscuro : colorFondo,
                },
                styles.boton
            ]}
        >
            <View style={styles.conteiner}>
                {IconoComponente && (
                    <IconoComponente
                        style={styles.icono}
                    />
                )}
                <Text style={[styles.texto, {fontSize: tamanoFuente}, ]}>
                    {titulo}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    boton: {
        height: 80,
        width: 300,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        //Sombra para Android
        elevation: 5
    },
    conteiner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icono: {
        marginRight: 8,
    },
    texto: {
        fontFamily: 'Inter_700Bold',
        color: colors.blanco,
    }
}
)
