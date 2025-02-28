import {jwtDecode} from "jwt-decode";

export let loginId = null;
export let roleId = null;

export const setToken = (token) => {
  const decode = jwtDecode(token);
  loginId = decode.id;
  roleId = decode.roleId;
  localStorage.setItem('auth', token);
  localStorage.setItem('loginId', loginId);
  localStorage.setItem('roleId', roleId);
};

export const clearToken = () => {
  loginId = null;
  roleId = null;
  localStorage.removeItem('auth');
  localStorage.removeItem('loginId');
  localStorage.removeItem('roleId');
};

export const logout = (router) => {
  clearToken();
  router.push('/');
};