<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="text-9xl font-bold text-customBlack-500">404</div>
    <div class="text-2xl font-medium text-customBlack-400 mt-4">Página no encontrada</div>
    <p class="text-customBlack-300 mt-2">La página que estás buscando no existe o ha sido movida.</p>
    <button
      @click="goBack"
      class="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
      Volver atrás
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>