<template>
  <nav class="bg-customBlue-500 px-10 flex justify-between flex-row items-center text-white">
    <span>
       <router-link to="/" class="uppercase">Seguros aps</router-link></span>
    <router-link to="/configuraciones"><span class="pi pi-cog py-4 text-customOrange-500 cursor-pointer"></span>
    </router-link>
  </nav>
  <router-view></router-view>
</template>
<script setup lang="ts">
</script>