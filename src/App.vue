<template>
  <nav class="px-4 sm:px-10 flex justify-between items-center text-white py-4 shadow-lg bg-customWhite-500">
    <span v-if="id_role===1"><router-link to="/homeAdmin"
                                          class="uppercase text-customBlack-500">Seguros aps</router-link></span>
    <span v-else><router-link to="/home" class="uppercase text-customBlack-500">Seguros aps</router-link></span>
    <div v-if="isLoggedIn" class="text-center sm:text-left text-customBlack-500">Bienvenido, <span
        class="mx-2">{{ mensaje }}</span></div>
    <Button type="button" icon="pi pi-user" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
            v-if="isLoggedIn" class="bg-customBlue-700"/>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
  </nav>
  <router-view></router-view>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {ref, computed, onMounted, watch} from 'vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import {logout, user_id, id_role} from './utils/auth.js';

const mensaje = ref("");
const router = useRouter();
const menu = ref(null);
const items = ref([
  {
    label: 'Cerrar sesión',
    icon: 'pi pi-sign-out',
    command: () => {
      handleLogout();
    }
  },
]);

const isLoggedIn = computed(() => user_id.value !== null);

const messageRole = () => {
  if (id_role.value === 1) {
    mensaje.value = "Administrador";
  } else if (id_role.value === 2) {
    mensaje.value = "Director";
  }
};

const handleLogout = () => {
  logout(router);
  id_role.value = 0;
  mensaje.value = "";
  localStorage.removeItem('user_id'); // Clear user_id from localStorage
  localStorage.removeItem('id_role'); // Clear id_role from localStorage
};

const toggle = (event) => {
  menu.value.toggle(event);
};

onMounted(() => {
  messageRole();
});

watch(user_id, () => {
  messageRole();
});
</script>