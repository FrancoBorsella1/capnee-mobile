import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        setIsAuthenticated(false);
    }, [])

    const login = async (username, password) => {
        const usuarioPrueba = 'franco';
        const contrasenaPrueba = '1234';

        try{

            if (username === usuarioPrueba && password === contrasenaPrueba) {
                setUser({ username });
                setIsAuthenticated(true);
                console.log('Inicio de sesión exitoso');
                return true;
            } else {
                setIsAuthenticated(false);
                return false;
            }

        }catch(error){
            console.error('Error durante el inicio de sesión: ', error);
            return false;
        }
    }

    const logout = async () => {
        try{
            setUser(null);
            setIsAuthenticated(false);
            console.log('Cierre de sesión exitoso');
        }catch(error){
            console.error('Error durante el cierre de sesión: ', error);
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>
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