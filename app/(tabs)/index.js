import { Text } from "react-native";
import Fondo from "../../components/Fondo";
import colors from "../../constants/colors";
import { Link } from "expo-router";

export default function Index() {
    return (
        <Fondo color={colors.verde}>
            <Text>Pantalla 1</Text>
            <Link href="/login">
                Ir a Login
            </Link>
        </Fondo>
    );
}