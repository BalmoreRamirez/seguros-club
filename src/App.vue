<template>
  <div class="h-screen overflow-hidden relative">
    <div v-if="isLoggedIn">
      <aside
          class="fixed top-0 left-0 h-full w-full md:w-64 bg-customWhite-500 text-white p-4 z-20 transform transition-transform duration-300 ease-in-out"
          :class="{ '-translate-x-full': !menuOpen, 'translate-x-0': menuOpen }">
        <div class="text-center mb-4">
          <p class="text-customBlack-500">Seguros APS</p>
        </div>
        <div class="flex justify-between">
          <Menu :model="filteredSidebarItems" class="border border-none" @item-select="hideSidebar"/>
          <div class="md:hidden">
            <i class="pi pi-times text-customBlack-500" @click="menuOpen = !menuOpen"></i>
          </div>
        </div>
        <div class="bg-pastelGreen-500 bottom-0 absolute cursor-pointer px-10 py-2 rounded-lg w-[80%] mb-6"
             @click="handleLogout">
          <i class="pi pi-sign-out text-customBlack-500"></i>
        </div>
      </aside>
    </div>

    <div class="flex-1 transition-all duration-300 ease-in-out p-6"
         :class="{ 'ml-64': menuOpen && isLoggedIn, 'ml-0': !menuOpen || !isLoggedIn }">
      <button
          v-if="isLoggedIn"
          @click="menuOpen = !menuOpen"
          class="mb-4 px-4 py-2  text-customBlack-500 rounded"
      >
        <i class="pi pi-bars"></i>
      </button>
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from 'vue-router';
import {ref, computed, onMounted, watch} from 'vue';
import Menu from 'primevue/menu';
import {user_id, id_role, logout} from './utils/auth.js';

const menuOpen = ref(true);
const mensaje = ref("");
const router = useRouter();
const isSidebarOpen = ref(false);
const isLargeScreen = ref(window.innerWidth >= 641);
const sidebarItems = ref([
  {label: 'Inicio', icon: 'pi pi-home', command: () => navigateTo('/homeadmin'), roles: [1]},
  {label: 'Inicio', icon: 'pi pi-home', command: () => navigateTo('/homemanager'), roles: [2]},
  {label: 'Miembros', icon: 'pi pi-users', command: () => navigateTo('/miembros'), roles: []},
  {label: 'Mi club', icon: 'pi pi-users', command: () => navigateTo('/home'), roles: [2]},
  {label: 'Configuración', icon: 'pi pi-cog', command: () => navigateTo('/configuracion'), roles: []},
  {label: 'Clubes', icon: 'pi pi-users', command: () => navigateTo('/listClubes'), roles: [1]},
]);

const filteredSidebarItems = computed(() => {
  return sidebarItems.value.filter(item => item.roles.includes(id_role.value));
});
const isLoggedIn = computed(() => user_id.value !== null);
const messageRole = () => {
  if (id_role.value === 1) {
    mensaje.value = "Administrador";
  } else if (id_role.value === 2) {
    mensaje.value = "Director";
  }
};

const hideSidebar = () => {
  isLargeScreen.value = window.innerWidth >= 641;
  if (!isLargeScreen.value) {
    menuOpen.value = !menuOpen.value;
  }

};
const navigateTo = (path) => {
  router.push(path);
  hideSidebar();
};

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 641;
  if (isLargeScreen.value) {
    isSidebarOpen.value = false;
  }
};
const handleLogout = () => {
  logout(router);
  id_role.value = 0;
  mensaje.value = "";
  localStorage.removeItem('user_id');
  localStorage.removeItem('id_role');
};

window.addEventListener('resize', updateScreenSize);

onMounted(() => {
  updateScreenSize();
  menuOpen.value = !!isLargeScreen.value;
});

watch(user_id, () => {
  messageRole();
});
</script>

<style>
/* TailwindCSS is used for styling */
</style>