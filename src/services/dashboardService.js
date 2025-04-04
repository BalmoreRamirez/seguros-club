import axiosInstance from "../axiosConfig.js";

const reportByClub = async (id_club) => {
    return await axiosInstance.get(`/dashboard/clubes/${id_club}`);
}
const reportByClubAll = async () => {
    return await axiosInstance.get(`/dashboard/general`);
}
const getDashboardData = async (id_role, id_club) => {
    try {
        let response;

        // Si es director, obtener datos específicos del club
        if (id_role === 2) {
            response = await reportByClub(id_club);
        }
        // Si es administrador, obtener datos generales
        else if (id_role === 1) {
            response = await reportByClubAll();
        } else {
            throw new Error("Rol no autorizado");
        }

        const estadisticas = response.data.estadisticas;

        // Mapeo a formato para componente
        return [
            {
                title: 'Total de Aventureros',
                total: estadisticas.aventurero.total,
                sinSeguro: estadisticas.aventurero.sinSeguro,
                conSeguro: estadisticas.aventurero.conSeguro
            },
            {
                title: 'Total de Conquistadores',
                total: estadisticas.conquistador.total,
                sinSeguro: estadisticas.conquistador.sinSeguro,
                conSeguro: estadisticas.conquistador.conSeguro
            },
            {
                title: 'Total de Guías Mayores',
                total: estadisticas.guiaMayor.total,
                sinSeguro: estadisticas.guiaMayor.sinSeguro,
                conSeguro: estadisticas.guiaMayor.conSeguro
            },
            {
                title: 'Total de JA',
                total: estadisticas.ja.total,
                sinSeguro: estadisticas.ja.sinSeguro,
                conSeguro: estadisticas.ja.conSeguro
            }
        ];
    } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
        throw error;
    }
}
export default {
    reportByClub,
    reportByClubAll,
    getDashboardData
}