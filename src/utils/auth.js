// src/utils/auth.js
export const logout = (router) => {
  localStorage.removeItem('auth');
  router.push('/');
};