import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { Back } from "./Icons";
import Constants from 'expo-constants';
import React, { useState } from "react";
import { Audio } from "expo-av";

export default function Header({ 
    nombrePagina,
    onPress 
}) {

// Variables de estado de sonido
const [sound, setSound] = useState();

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

    return(
        <View style={styles.container}>
            <Pressable  
                onPress={handlePress}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ?  colors.grisClaro : colors.blanco,
                    },
                    styles.boton
                ]}
            >
                <Back/>
            </Pressable>
            <Text style={styles.texto} numberOfLines={2} ellipsizeMode="tail">
                {nombrePagina}
            </Text>
            <View style={styles.box}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        position: 'absolute',
        top: Constants.statusBarHeight
    },
    boton: {
        width: 60,
        height: 60,
        margin: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        //Sombra para Android
        elevation: 5,
    },
    texto: {
        fontFamily: 'Inter_700Bold',
        fontSize: 26,
        textAlign: 'center',
        width: 250
    },
    box: {
        width: 60,
        height: 60,
        margin: 10
    }
})