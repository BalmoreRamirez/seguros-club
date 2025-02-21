import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/detalleClub/:id',
        name: 'DetalleClub',
        component: () => import('../views/DetalleClub.vue')
    },
    {
        path: '/perfil/:id',
        name: 'Perfil',
        component: () => import('../views/perfil.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;