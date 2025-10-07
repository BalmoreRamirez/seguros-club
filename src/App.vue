<template>
  <div class="overflow-hidden relative">
    <!-- Sidebar / Menú lateral -->
    <div v-if="isLoggedIn">
      <aside
          class="fixed top-0 left-0 h-full w-full md:w-64 bg-customWhite-500 p-4 z-20 transform transition-transform duration-300 ease-in-out"
          :class="{ '-translate-x-full': !menuOpen, 'translate-x-0': menuOpen }">
        <!-- Encabezado del menú -->
        <div class="text-center mb-4">
          <p class="text-customBlack-500">Seguros APS</p>
        </div>

        <!-- Contenido del menú -->
        <div class="flex justify-between">
          <Menu :model="filteredSidebarItems" class="border border-none" @item-select="hideSidebar">
            <template #item="{ item }">
              <div :class="{ 'active-menu-item': isActiveRoute(item.path) }" class="menu-item">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </Menu>
          <div class="md:hidden">
            <i class="pi pi-times text-customBlack-500" @click="menuOpen = !menuOpen"></i>
          </div>
        </div>

        <!-- Botón de cerrar sesión -->
        <div class="bg-pastelGreen-500 bottom-0 absolute cursor-pointer px-5 py-2 rounded-lg w-[80%] mb-6"
             @click="handleLogout">
          <i class="pi pi-sign-out text-customBlack-500 mr-2"></i>Cerrar sesión
        </div>
      </aside>
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 transition-all duration-300 ease-in-out p-6"
         :class="{ 'ml-64': menuOpen && isLoggedIn, 'ml-0': !menuOpen || !isLoggedIn }">
      <button
          v-if="isLoggedIn"
          @click="menuOpen = !menuOpen"
          class="mb-4 px-4 py-2 text-customBlack-500 rounded">
        <i class="pi pi-bars"></i>
      </button>
      <div class="my-5">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importaciones
import {ref, computed, onMounted, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import Menu from 'primevue/menu';
import {user_id, id_role, logout} from './utils/auth.js';

// Estado reactivo
const router = useRouter();
const route = useRoute();
const menuOpen = ref(true);
const mensaje = ref("");
const isSidebarOpen = ref(false);
const isLargeScreen = ref(window.innerWidth >= 641);

// Configuración de elementos del menú
const sidebarItems = ref([
  {label: 'Inicio', icon: 'pi pi-home', command: () => navigateTo('/dashboard'), roles: [1, 2], path: '/dashboard'},
  {label: 'Miembros', icon: 'pi pi-users', command: () => navigateTo('/miembros'), roles: [], path: '/miembros'},
  {label: 'Mi club', icon: 'pi pi-users', command: () => navigateTo('/home'), roles: [2], path: '/home'},
  {label: 'Usuarios', icon: 'pi pi-cog', command: () => navigateTo('/users'), roles: [1], path: '/users'},
  {label: 'Clubes', icon: 'pi pi-users', command: () => navigateTo('/listClubes'), roles: [1], path: '/listClubes'},
  {label: 'Configuración', icon: 'pi pi-cog', command: () => navigateTo('/configuracion'), roles: [1], path: '/configuracion'},
]);

// Propiedades computadas
const filteredSidebarItems = computed(() => {
  return sidebarItems.value.filter(item => item.roles.includes(id_role.value));
});

const isLoggedIn = computed(() => !!user_id.value);

// Métodos para navegación y UI
const navigateTo = (path) => {
  router.push(path);
  hideSidebar();
};

const hideSidebar = () => {
  isLargeScreen.value = window.innerWidth >= 641;
  if (!isLargeScreen.value) {
    menuOpen.value = !menuOpen.value;
  }
};

const isActiveRoute = (path) => {
  return route.path === path;
};

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 641;
  if (isLargeScreen.value) {
    isSidebarOpen.value = false;
  }
};

// Métodos para gestión de usuarios
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
};

// Event listeners
window.addEventListener('resize', updateScreenSize);

// Hooks del ciclo de vida
onMounted(() => {
  updateScreenSize();
  menuOpen.value = !!isLargeScreen.value;
});

watch(user_id, () => {
  messageRole();
});
</script>

<style>
.active-menu-item {
  background-color: #D1FFD6;
  color: #000;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.menu-item i {
  margin-right: 10px;
}
</style>