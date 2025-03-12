import {createRouter, createWebHistory} from 'vue-router';
import {is_admin} from "../utils/auth.js";

const isAuthenticated = () => {
    return localStorage.getItem('auth') !== null;
};
const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/director/Home.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/homeAdmin',
        name: 'HomeAdmin',
        component: () => import('../views/admin/Home.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/detalleClub/:id',
        name: 'DetalleClub',
        component: () => import('../views/director/DetalleClub.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/perfil/:id',
        name: 'Perfil',
        component: () => import('../views/director/perfil.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/clubes/:id',
        name: 'Clubes',
        component: () => import('../views/admin/Clubes.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    }
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
                console.log('es admin');
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