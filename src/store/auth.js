import {reactive} from 'vue';
import {jwtDecode} from 'jwt-decode';
import {user_id} from "../utils/auth.js";

const state = reactive({
    user_id: null,
    id_role: null,
    is_admin: null,
    complete_club: null,
});

export const useAuthState = () => state;