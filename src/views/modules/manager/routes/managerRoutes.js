import {decrypt} from "../../../../utils/crypto.js";

export default [
    {
        path: '/detalleClub/:id',
        name: 'DetalleClub',
        component: () => import('../../manager/pages/MembersClubPage.vue'),
        meta: {requiresAuth: true},
        props: route => ({id: decrypt(route.params.id)})
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../../manager/pages/InfoClubPage.vue'),
        meta: {requiresAuth: true}
    },
];