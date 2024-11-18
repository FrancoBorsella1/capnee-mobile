import Fondo from "../../../components/Fondo";
import CartaAlumno from "../../../components/CartaAlumno";
import colors from "../../../constants/colors";
import BotonS from "../../../components/BotonS";
import { Gear, Close } from "../../../components/Icons";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_URL = 'http://149.50.140.55:8081';

export default function Perfil() {
    const { logout, getPayloadFromJWT } = useAuth();
    const router = useRouter();
    const { getToken } = useAuth();
    const [decodedToken, setDecodedToken] = useState(null);
    const [curso, setCurso] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //Obtener token guardado
                const token = await getToken();

                if (!token) {
                    throw new Error("Token no disponible");
                };

                //Decodificar token
                const decoded = getPayloadFromJWT(token);
                setDecodedToken(decoded);
                console.log("Decodificado: ", decoded);

                if (!decoded) {
                    throw new Error("El token no es válido");
                };

                //Petición para traer alumno por id
                const response1 = await axios.get(`${API_URL}/person/get-by-id?id=${decoded.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const userData = response1.data;
                console.log("Usuario:", userData);

                if (userData && userData.courseId) {
                    //Petición para traer cursos por id
                    const response2 = await axios.get(`${API_URL}/course/get-by-id?id=${userData.courseId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const courseData = response2.data;
                    setCurso(courseData);
                    console.log("Curso: ", curso);
                } else {
                    throw new Error("El usuario no tiene courseId");
                }
    
            } catch (error) {
                console.error('Error decodificando el token: ', error);
            } 
        };

        fetchData();
    }, []);

    //Cambiar el formato del dato Nivel para mostrarlo en pantalla
    const formatearNivel = (nivel) => {
        switch (nivel) {
            case "LEVEL_1":
                return "1";
            case "LEVEL_2":
                return "2";
            case "LEVEL_3":
                return "3";
            default:
                return "X";
        }
    };

    const handleOptions = async () => {
        router.replace('/opciones');
    }

    const handleLogout = async () => {
        await logout();
    }

    return (
        <Fondo color={colors.amarillo}>
            <CartaAlumno
                nombre={decodedToken ? `${decodedToken.name || 'Nombre Apellido'}`: 'Cargando...'}
                curso={curso ? `${formatearNivel(curso.level)}°${curso.division} - ${curso.academicYear}` || 'X°X - 20XX' : 'Cargando...'}
            />
            <BotonS
                titulo="Ajustes"
                IconoComponente={Gear}
                onPress={handleOptions}
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