<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6  rounded-lg">

      <h2 class="text-2xl font-medium text-center text-customBlack-500">¡Bienvenido de nuevo!</h2>
      <p class="text-customBlack-300 text-center">
        Ingresa tus credenciales para acceder a la plataforma.
      </p>
      <div class="bg-[#ffffff] p-10 rounded-md">
        <div class="space-y-8">
          <div>
            <FloatLabel>
              <InputText id="username" v-model="username" class="w-full"/>
              <label for="username">Usuario</label>
            </FloatLabel>
          </div>
          <div>
            <FloatLabel>
              <Password v-model="password" toggleMask class="w-full"/>
              <label for="password">Contraseña</label>
            </FloatLabel>
          </div>
        </div>
        <div class="mt-6">
          <Button label="Entrar" icon="pi pi-check" class="w-full bg-customBlue-700" @click="handleLogin" :disabled="loading"/>
        </div>
        <div v-if="loading" class="mt-4 text-blue-500 text-center">
          Iniciando sesión...
        </div>
        <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import axiosInstance from "../../../axiosConfig.js";
import {complete_club, is_admin, setToken} from "../../../utils/auth.js";

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axiosInstance.post('/login', {
      user: username.value,
      password: password.value
    });
    const token = response.data.token;
    setToken(token);
    sessionStorage.setItem('authToken', token); // Almacenar el token en sessionStorage
    if (token) {
      await router.push('/dashboard');
    }
  } catch (error) {
    errorMessage.value = error.response.data.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
::v-deep .p-password-input {
  width: 100% !important;
}
</style>
