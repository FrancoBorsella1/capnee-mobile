//Este archivo envuelve a toda la aplicación. Aquí se renderiza el contenido.

import { View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";

//Importaciones para fuentes

import { Inter_700Bold, Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useReducer } from "react";
import { AuthContextProvider, useAuth } from "./context/AuthContext";
import { RootSiblingParent } from 'react-native-root-siblings';

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        //Checkea si el usuario está autenticado o no
        if(typeof isAuthenticated === 'undefined') return;

        //El usuario debe estar dentro de la carpeta de rutas protegidas: Todas las rutas bajo (app)
        const inProtectedRoutes = segments[0] === '(app)';

        if (isAuthenticated && !inProtectedRoutes){
            //Redireccionar a index
            router.replace('/');
        } else if (!isAuthenticated && inProtectedRoutes){
            //Redireccionar a login
            router.replace('/login');
        }
    }, [isAuthenticated, segments, router])

    return (
        <RootSiblingParent>
            <View style={{flex: 1}}>
                <StatusBar style="auto"/>
                <Slot />
            </View>
        </RootSiblingParent>
    );
}

export default function Root() {

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
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
}
