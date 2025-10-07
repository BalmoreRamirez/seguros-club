import axiosInstance from "../../../../axiosConfig.js";
import { mockInsurancePeriodService } from "../../../../services/mockInsurancePeriodService.js";

// Flag para usar mock service (cambiar a false cuando el backend esté listo)
const USE_MOCK_SERVICE = false;

const ListClubes = async (id_role, user_id) => {
    return await axiosInstance.get(`/clubs/${id_role}/${user_id}`);
}
const UpdateClub = async (id_club, data) => {
    return await axiosInstance.put(`/clubs/${id_club}}`, data);
}
const AddClub = async (data) => {
    return await axiosInstance.post(`/clubs`, data);
}
const UpdateStatusClub = async (id_club) => {
    return await axiosInstance.put(`/club/${id_club}`);
}
const GeneralReport = async () => {
    return await axiosInstance.get(`/reporte-general`);
}
const getAllMembersClub = async (id_club) => {
    return await axiosInstance.get(`/miembros/${id_club}`);
}
const getInfoClub = async (id_club) => {
    return await axiosInstance.get(`/club/${id_club}`);
}
const getAllUsers = async () => {
    return await axiosInstance.get(`/users`);
}
const saveUser = async (data) => {
    return await axiosInstance.post(`/users`, data);
}
const resetPassword = async (userId, newPassword) => {
    return await axiosInstance.post('/reset-password', {
        userId,
        newPassword
    });
};

// Servicios para configuración de períodos de seguro
const getCurrentInsurancePeriod = async () => {
    if (USE_MOCK_SERVICE) {
        return await mockInsurancePeriodService.getCurrentInsurancePeriod();
    }
    return await axiosInstance.get('/insurance-periods/current');
}

const getAllInsurancePeriods = async () => {
    // Siempre usar el endpoint real para listar
    return await axiosInstance.get('/insurance-periods');
}

const saveInsurancePeriod = async (data) => {
    if (USE_MOCK_SERVICE) {
        return await mockInsurancePeriodService.saveInsurancePeriod(data);
    }
    return await axiosInstance.post('/insurance-periods', data);
}

const updateInsurancePeriod = async (id, data) => {
    if (USE_MOCK_SERVICE) {
        return await mockInsurancePeriodService.updateInsurancePeriod(id, data);
    }
    return await axiosInstance.put(`/insurance-periods/${id}`, data);
}

const deleteInsurancePeriod = async (id) => {
    if (USE_MOCK_SERVICE) {
        return await mockInsurancePeriodService.deleteInsurancePeriod(id);
    }
    return await axiosInstance.delete(`/insurance-periods/${id}`);
}

const getInsurancePeriodHistory = async () => {
    // Siempre usar el endpoint real para el historial
    return await axiosInstance.get('/insurance-periods');
}

export default {
    ListClubes,
    UpdateClub,
    AddClub,
    UpdateStatusClub,
    GeneralReport,
    getAllMembersClub,
    getInfoClub,
    getAllUsers,
    saveUser,
    resetPassword,
    getCurrentInsurancePeriod,
    getAllInsurancePeriods,
    saveInsurancePeriod,
    updateInsurancePeriod,
    deleteInsurancePeriod,
    getInsurancePeriodHistory
}