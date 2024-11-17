import { createContext, useContext, useState, useRef } from "react";

export const GestosContext = createContext();

export const GestosContextProvider = ({ children }) => {
    const [navegacionActivada, setNavegacionActivada] = useState(false);
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(0);
    const buttonActionsRef = useRef({})
    
    const toggleNavegacion = (valor) => {
        setNavegacionActivada(valor);
    };

    // Registrar la función de presión de un botón
    const registerButtonAction = (index, action) => {
        buttonActionsRef.current[index] = action;
    };

    // Eliminar la función de presión de un botón
    const unregisterButtonAction = (index) => {
        delete buttonActionsRef.current[index];
    };

    const handleGestos = (gestoDetectado) => {

        //Acciones a realizar según los gestos

        if (gestoDetectado === "rightWink" && cantidadBotones > 0) {
            console.log("Estás guiñando el ojo derecho!");
            setIndiceBotonFocus((prevIndex) => (prevIndex + 1) % cantidadBotones);
        } else if (gestoDetectado === "leftWink" && cantidadBotones > 0) {
            console.log("Estás guiñando el ojo izquierdo!");
            setIndiceBotonFocus((prevIndex) => (prevIndex - 1 + cantidadBotones) % cantidadBotones);
        } 
        else if (gestoDetectado === "smile" && cantidadBotones > 0) {
            console.log("Estás sonriendo!");
            const action = buttonActionsRef.current[indiceBotonFocus];
            if (action) {
                action();
            }
        }
    };

    return (
        <GestosContext.Provider value={{
            navegacionActivada, 
            toggleNavegacion,
            handleGestos,
            indiceBotonFocus,
            setCantidadBotones,
            registerButtonAction,
            unregisterButtonAction
        }}>
            {children}
        </GestosContext.Provider>
    )
}

export const useGestos = () => useContext(GestosContext);