<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center">Inicia sesión</h2>
      <div>
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input v-model="username" id="username" type="text" required class="w-full px-3 py-2 border rounded-lg"/>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" id="password" type="password" required
                   class="w-full px-3 py-2 border rounded-lg"/>
          </div>
        </div>
        <div class="mt-6">
          <button type="submit" class="w-full px-4 py-2 text-white bg-blue-600 rounded-lg" @click="handleLogin">Entrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import axiosInstance from "../axiosConfig.js";
import {setToken} from "../utils/auth.js";

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axiosInstance.post('/login', {
      user: username.value,
      password: password.value
    });
    const token = response.data.token;
    setToken(token);
    await router.push('/home');
  } catch (error) {
    alert('Invalid credentials');
  }
};
</script>

<style scoped>
/* Add any additional styling here */
</style>