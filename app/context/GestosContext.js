import { createContext, useContext, useState } from "react";

export const GestosContext = createContext();

export const GestosContextProvider = ({ children }) => {
    const [navegacionActivada, setNavegacionActivada] = useState(false);
    const [indiceBotonFocus, setIndiceBotonFocus] = useState(0);
    const [cantidadBotones, setCantidadBotones] = useState(0);
    
    const toggleNavegacion = (valor) => {
        setNavegacionActivada(valor);
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
            presionarBoton(indiceBotonFocus);
        }
    };

    const presionarBoton = (index) => {
        console.log(`Ejecutando acción del botón ${index + 1}`);
    };

    return (
        <GestosContext.Provider value={{
            navegacionActivada, 
            toggleNavegacion,
            handleGestos,
            indiceBotonFocus,
            setCantidadBotones,
        }}>
            {children}
        </GestosContext.Provider>
    )
}

export const useGestos = () => useContext(GestosContext);