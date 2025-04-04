import axiosInstance from "../../../../axiosConfig.js";

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
export default {
    ListClubes,
    UpdateClub,
    AddClub,
    UpdateStatusClub,
    GeneralReport,
    getAllMembersClub,
    getInfoClub,
    getAllUsers,
    saveUser
}