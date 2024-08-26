import Fondo from "../../components/Fondo";
import CartaAlumno from "../../components/CartaAlumno";
import colors from "../../constants/colors";
import { Text } from "react-native";
import { Link } from "expo-router"
import BotonS from "../../components/BotonS";
import { Hat, Gear, Close } from "../../components/Icons";

export default function Perfil() {
    return (
        <Fondo color={colors.amarillo}>
            <CartaAlumno/>
            <BotonS
                titulo="Notas" 
                IconoComponente={Hat}
            />
            <BotonS
                titulo="Ajustes"
                IconoComponente={Gear}
            />
            <BotonS 
                titulo="Cerrar sesión"
                IconoComponente={Close}
                colorFondo={colors.rojo}
            />
        </Fondo>
    );
}