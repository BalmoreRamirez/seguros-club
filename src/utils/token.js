import {jwtDecode} from "jwt-decode";
const token = localStorage.getItem('auth');
const decode = jwtDecode(token);
export const loginId = decode.id;
export const roleId = decode.roleId;


