import Fondo from "../../../components/Fondo";
import CartaAlumno from "../../../components/CartaAlumno";
import colors from "../../../constants/colors";
import BotonS from "../../../components/BotonS";
import { Hat, Gear, Close } from "../../../components/Icons";
import { useAuth } from "../../context/AuthContext";

export default function Perfil() {
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

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
                onPress={handleLogout}
            />
        </Fondo>
    );
}