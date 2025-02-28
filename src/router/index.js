import {createRouter, createWebHistory} from 'vue-router';
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
        component: () => import('../views/Home.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/detalleClub/:id',
        name: 'DetalleClub',
        component: () => import('../views/DetalleClub.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/perfil/:id',
        name: 'Perfil',
        component: () => import('../views/perfil.vue'),
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
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;