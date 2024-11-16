import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../constants/colors";
import { Lock, Check } from "./Icons";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { useGestos } from "../app/context/GestosContext";

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
  

export default function BotonL({
    titulo,
    colorFondo = colors.violeta,
    tamanoFuente = 26,
    onPress,
    habilitado = true, //El botón está habilitado por defecto. Cuando habilitado = false, el botón no puede utilizarse
    resuelto = false, //Si es un ejercicio, el botón está marcado como "no resuelto" por defecto. Cuando el ejercicio se resuelve, cambia el estilo del botón
    focused,
    index,
    buttonRef
}) {
    // Variables de estado de sonido
    const [sound, setSound] = useState();

    // Función para oscurecer al botón cuando se presiona
    const colorFondoOscuro = darkenColor(colorFondo);

    //Reproducir sonido
    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/pop.mp3')
            );
            setSound(sound);
            await sound.setVolumeAsync(0.1);
            await sound.playAsync();
        } catch (error) {
            console.error("Error al reproducir el sonido: ", error);
        }
    };

    //Descargar el sonido cuando el componente se desmonte
    React.useEffect(() => {
        return sound
        ? () => {
            sound.unloadAsync();
        }
        : undefined;
    }, [sound]);

    // Manejar la pulsación del botón
    const handlePress = () => {
        playSound();
        if (onPress) {
            onPress();
        }
    };

    //Manejar el enfoque del botón
    const { indiceBotonFocus } = useGestos();

    const isFocused = indiceBotonFocus === index;

    return (
        <Pressable
            onPress={habilitado ? handlePress : null}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? colorFondoOscuro : colorFondo,
                },
                !habilitado && styles.botonDeshabilitado,
                resuelto && styles.botonResuelto,
                styles.boton,
                focused ? styles.focused : null,
            ]}
            disabled={!habilitado} //El botón no se puede presionar si está deshabilitado
            ref={buttonRef}
        >
            {!habilitado && <Lock style={styles.icon}/>}
            {resuelto && <Check style={styles.icon}/>}
            <View style={styles.conteiner}>
                <Text style={[styles.texto, {fontSize: tamanoFuente}]}>
                    {titulo}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    boton: {
        height: 170,
        width: 300,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginTop: 10,
        marginBottom: 10,
        //Sombra para Android
        elevation: 5,
    },
    botonDeshabilitado: {
        backgroundColor: colors.gris,
    },
    conteiner: {
        alignItems: 'center',
        height: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    texto: {
        fontFamily: 'Inter_700Bold',
        color: colors.blanco,
        textAlign: 'center',
    },
    icon: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    botonResuelto: {
        backgroundColor: colors.verde,
    },
    focused: {
        borderWidth: 8,
        borderColor: colors.blanco,
        borderStyle: 'dashed'
    },
}
)
