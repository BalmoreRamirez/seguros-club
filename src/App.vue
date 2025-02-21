<template>
  <nav class="bg-customBlue-500 px-10 flex justify-between flex-row items-center text-white">
    <span><router-link to="/home" class="uppercase">Seguros aps</router-link></span>
    <button @click="handleLogout"><span class="pi pi-user py-4 text-customOrange-500 cursor-pointer"></span>
    </button>
  </nav>
  <router-view></router-view>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { logout } from './utils/auth.js';

const router = useRouter();

const handleLogout = () => {
  logout(router);
};
</script>