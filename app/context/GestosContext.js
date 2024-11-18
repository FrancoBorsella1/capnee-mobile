import { createContext, useContext, useState, useRef } from "react";

export const GestosContext = createContext();

export const GestosContextProvider = ({ children }) => {
    const [navegacionActivada, setNavegacionActivada] = useState(false);
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(0);
    const [gesture, setGesture]= useState(null);
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
        setGesture(gestoDetectado);
        /*
        //Acciones a realizar según los gestos
        if (gestoDetectado === "rightWink" && cantidadBotones > 0) {
            console.log("Estás guiñando el ojo derecho!");
            //setIndiceBotonFocus((prevIndex) => (prevIndex + 1) % cantidadBotones);
        } else if (gestoDetectado === "leftWink" && cantidadBotones > 0) {
            console.log("Estás guiñando el ojo izquierdo!");
            //setIndiceBotonFocus((prevIndex) => (prevIndex - 1 + cantidadBotones) % cantidadBotones);
        } 
        else if (gestoDetectado === "smile" && cantidadBotones > 0) {
            console.log("Estás sonriendo!");
            const action = buttonActionsRef.current[indiceBotonFocus];
            if (action) {
                action();
            }
        } */
    };

    return (
        <GestosContext.Provider value={{
            navegacionActivada, 
            toggleNavegacion,
            handleGestos,
            indiceBotonFocus,
            setCantidadBotones,
            registerButtonAction,
            unregisterButtonAction,
            gesture,
            setGesture
        }}>
            {children}
        </GestosContext.Provider>
    )
}

export const useGestos = () => useContext(GestosContext);