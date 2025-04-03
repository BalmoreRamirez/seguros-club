import axiosInstance from "../../../../axiosConfig.js";

const getMemberById = async (id_member) => {
    return await axiosInstance.get(`/miembro/${id_member}`);
}
const updateMember = async (id_member, data) => {
    return await axiosInstance.put(`/miembro/${id_member}`, data);
}
export default {
    getMemberById,
    updateMember,
}