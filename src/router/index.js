import {createRouter, createWebHistory} from 'vue-router';
import {is_admin} from "../utils/auth.js";
import administratorRoutes from "../views/modules/administrator/routes/administratorRoutes.js";
import managerRoutes from "../views/modules/manager/routes/managerRoutes.js";

const isAuthenticated = () => {
    return localStorage.getItem('auth') !== null;
};

const routes = [
    ...administratorRoutes,
    ...managerRoutes,
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/modules/Auth/Login.vue')
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated()) {
            next({name: 'Login'});
        } else if (to.matched.some(record => record.meta.requiresAdmin)) {
            if (is_admin.value) {
                next();
            } else {
                next({name: 'Home'});
            }
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;