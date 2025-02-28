import { reactive } from 'vue';
import {jwtDecode} from 'jwt-decode';

const state = reactive({
  loginId: null,
  roleId: null,
});

export const useAuthState = () => state;