import {createRouter, createWebHistory} from 'vue-router';
import {is_admin} from "../utils/auth.js";

const isAuthenticated = () => {
    return localStorage.getItem('auth') !== null;
};
const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/modules/Auth/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/modules/manager/pages/InfoClubPage.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/listClubes',
        name: 'ListClubes',
        component: () => import('../views/modules/administrator/pages/ListClubesPage.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/detalleClub/:id',
        name: 'DetalleClub',
        component: () => import('../views/modules/manager/pages/MembersClubPage.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/perfil/:id',
        name: 'Perfil',
        component: () => import('../views/modules/manager/pages/PerfilUserPage.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/clubes/:id',
        name: 'Clubes',
        component: () => import('../views/modules/administrator/pages/MembersClubPage.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    },
    {
        path:'/homeadmin',
        name: 'HomeAdmin',
        component: () => import('../views/modules/administrator/pages/HomePage.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    }
    ,
    {
        path: '/homemanager',
        name: 'HomeManager',
        component: () => import('../views/modules/manager/pages/HomePage.vue'),
        meta: {requiresAuth: true}
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