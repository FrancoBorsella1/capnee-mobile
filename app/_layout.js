//Este archivo envuelve a toda la aplicación. Aquí se renderiza el contenido.

import { StyleSheet, View, SafeAreaView } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

//Importaciones para fuentes

import { Inter_700Bold, Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function Layout() {

    //Manejo de fuentes de texto

    const [loaded, error] = useFonts({
        Inter_700Bold,
        Inter_400Regular
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={styles.conteiner}>
            <StatusBar style="auto"/>
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
    }
});