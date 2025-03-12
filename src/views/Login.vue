<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-customBlue-500">Inicia sesión</h2>
      <div>
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
          <Button label="Entrar" icon="pi pi-check" class="w-full" @click="handleLogin"/>
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
import axiosInstance from "../axiosConfig.js";
import {is_admin, setToken} from "../utils/auth.js";

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axiosInstance.post('/login', {
      user: username.value,
      password: password.value
    });
    const token = response.data.token;
    setToken(token);
    if (is_admin){
      await router.push('/HomeAdmin');
    }else{
      await router.push('/home');
    }
  } catch (error) {
    errorMessage.value = error.response.data.message;
  }
};
</script>

<style scoped>
::v-deep .p-password-input {
  width: 100% !important;
}

</style>