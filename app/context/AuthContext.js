import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
// Para almacenar token en Web, ya que secure store no es soportado por la web
import { Platform } from 'react-native';
import { useRouter } from "expo-router";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [cursoId, setCursoId] = useState(null);
    const API_URL = 'http://149.50.140.55:8081';
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = await getToken();
            if (token) {
                setIsAuthenticated(true);
                console.log('Token encontrado, autenticado');
            } else {
                setIsAuthenticated(false);
                console.log('No se encontró token, no autenticado');
            }
        };
        loadUser();

        // Verificar si el token es válido
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response && error.response.status === 401 || 403) {
                    // Si el token está expirado y el usuario no tiene acceso, se desloguea
                    await logout(); 
                    router.replace('/login'); // Redirigir al login
                }
                return Promise.reject(error);
            }
        );

        // Limpieza del interceptor al desmontar el componente
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [])

    //Recuperar el token dependiendo de la plataforma

    const getToken = async () => {
        if (Platform.OS === 'web') {
            return window.localStorage.getItem('token-jwt');
        } else {
            return await SecureStore.getItemAsync('token-jwt');
        }
    };

    //Login
    const login = async (user, password) => {
        try{
            const response = await axios.post(`${API_URL}/auth/user-password`, {user, password});
            if (response.data) {
                const accessToken = response.data.accessToken;

                if (Platform.OS === 'web') {
                    window.localStorage.setItem('token-jwt', accessToken);
                } else {
                    await SecureStore.setItemAsync('token-jwt', accessToken);
                }

                setUser({ user });
                setIsAuthenticated(true);

                console.log('Inicio de sesión exitoso');
                return true;
            } else {
                setIsAuthenticated(false);
                return false;
            }

        }catch(error){
            console.error('Error durante el inicio de sesión: ', error);
            setIsAuthenticated(false);
            return false;
        }
    }

    //Logout
    const logout = async () => {
        try{
            if (Platform.OS === 'web') {
                window.localStorage.removeItem('token-jwt');
            } else {
                await SecureStore.deleteItemAsync('token-jwt');
            }

            setUser(null);
            setIsAuthenticated(false);
            setCursoId(null);
            console.log('Cierre de sesión exitoso');
        }catch(error){
            if (error.response) {
                if (error.response.status === 401) {
                    console.error('Error 401: No autorizado');
                } else {
                    console.error('Error en la respuesta del servidor: ', error.response.data);        
                }
            } else if (error.request) {
                console.error('Error durante el cierre de sesión: ', error);
            }
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, getToken, cursoId, setCursoId }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth debe estar contenida dentro de AuthContextProvider');
    }
    return value;
}