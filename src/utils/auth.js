import {jwtDecode} from "jwt-decode";
import {ref} from "vue";

let user_id = ref(null);
let id_role = ref(null);
let is_admin = ref(null);
let complete_club = ref(null);

const token = localStorage.getItem('auth');
if (token) {
    const decode = jwtDecode(token);
    user_id.value = decode.id;
    id_role.value = decode.id_role;
    is_admin.value = decode.is_admin;
    complete_club.value = decode.complete_club;
}

export {user_id, id_role, is_admin, complete_club};

export const setToken = (token) => {
    const decode = jwtDecode(token);
    user_id.value = decode.id;
    id_role.value = decode.id_role;
    is_admin.value = decode.is_admin;
    complete_club.value = decode.complete_club;
    localStorage.setItem('auth', token);
};

export const clearToken = () => {
    user_id.value = null;
    id_role.value = null;
    is_admin.value = null;
    complete_club.value = null;
    localStorage.removeItem('auth');

};

export const logout = (router) => {
    clearToken();
    router.push('/');
};