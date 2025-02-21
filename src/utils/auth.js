export const logout = (router) => {
  localStorage.removeItem('auth');
  router.push('/');
};