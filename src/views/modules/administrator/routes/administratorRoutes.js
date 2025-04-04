import {decrypt} from "../../../../utils/crypto.js";
export default [
    {
        path: '/clubes/:id',
        name: 'Clubes',
        component: () => import('../../administrator/pages/MembersClubPage.vue'),
        meta: {requiresAuth: true, requiresAdmin: true},
        props: route => ({id: decrypt(route.params.id)})
    },
    {
        path: '/listClubes',
        name: 'ListClubes',
        component: () => import('../../administrator/pages/ListClubesPage.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('../../administrator/pages/UserPage.vue'),
        meta: {requiresAuth: true, requiresAdmin: true}
    }
];