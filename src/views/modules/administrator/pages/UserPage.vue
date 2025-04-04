<template>
  <div class="space-y-10">
    <div class="flex justify-between items-center mt-5">
      <h1 class="text-2xl font-bold uppercase text-customBlack-500">
        Usuarios
      </h1>
      <Button label="Nuevo Usuario" icon="pi pi-plus" class="bg-customBlue-700" @click="openNewUserModal"/>
    </div>

    <div class="card p-fluid">
      <DataTable v-model:editingRows="editingRows" :value="users" editMode="row" dataKey="id"
                 @row-edit-save="onRowEditSave"
                 :pt="{
                            table: { style: 'min-width: 50rem' },
                            column: {
                                bodycell: ({ state }) => ({
                                    style:  state['d_editing']&&'padding-top: 0.6rem; padding-bottom: 0.6rem'
                                })
                            }
                        }"
                 paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column field="nombre" header="Nombre" style="width: 20%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]"/>
          </template>
        </Column>

        <Column header="Acciones" style="width: 15%; min-width: 10rem">
          <template #body="slotProps">
            <Button icon="pi pi-key" class="p-button-rounded p-button-warning p-button-sm mr-2"
                    @click="openResetPasswordModal(slotProps.data)"
                    tooltip="Restablecer contraseña" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal para agregar nuevo usuario -->
    <Dialog v-model:visible="displayModal" header="Agregar Nuevo Usuario" :modal="true" class="w-[90vw] md:w-[50vw]">
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="username" class="font-bold block mb-2">Nombre de Usuario</label>
          <InputText id="username" v-model="newUser.user" :class="{'p-invalid': v$.user.$invalid && v$.user.$dirty}"/>
          <small v-if="v$.user.$invalid && v$.user.$dirty" class="p-error block mt-1">
            {{ v$.user.$errors[0].$message }}
          </small>
        </div>
        <div class="field mb-4">
          <label for="password" class="font-bold block mb-2">Contraseña</label>
          <div class="p-inputgroup">
            <InputText id="password" v-model="newUser.password" required/>
            <Button icon="pi pi-refresh" @click="generatePassword" class="bg-customBlue-700"/>
            <Button icon="pi pi-copy" @click="copyCredentials"
                    :disabled="!newUser.user || !newUser.password || v$.user.$invalid"
                    class="bg-customBlue-700"/>
          </div>
          <small class="block mt-1">
            Genera una contraseña y copia las credenciales antes de guardar.
            <span v-if="copySuccess" class="text-green-600 ml-2">¡Credenciales copiadas!</span>
          </small>
        </div>

        <div v-if="!credentialsCopied && newUser.user && newUser.password && !v$.user.$invalid"
             class="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mt-4">
          <p>⚠️ Debe copiar las credenciales antes de guardar el usuario</p>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeModal"/>
        <Button label="Guardar" icon="pi pi-check" class="bg-customBlue-700"
                @click="saveNewUser"
                :disabled="v$.$invalid || !credentialsCopied"/>
      </template>
    </Dialog>
    <Dialog v-model:visible="resetPasswordModal" header="Restablecer Contraseña" :modal="true" class="w-[90vw] md:w-[50vw]">
      <div class="p-fluid">
        <div class="field mb-4">
          <label class="font-bold block mb-2">Usuario</label>
          <InputText v-model="selectedUser.nombre" disabled />
        </div>
        <div class="field mb-4">
          <label class="font-bold block mb-2">Nueva Contraseña</label>
          <div class="p-inputgroup">
            <InputText v-model="newPassword" readonly />
            <Button icon="pi pi-refresh" @click="generateNewPassword" class="bg-customBlue-700" />
            <Button icon="pi pi-copy" @click="copyNewCredentials"
                    :disabled="!selectedUser || !newPassword"
                    class="bg-customBlue-700" />
          </div>
          <small class="block mt-1">
            Genera una contraseña y copia las credenciales antes de guardar.
            <span v-if="resetCopySuccess" class="text-green-600 ml-2">¡Credenciales copiadas!</span>
          </small>
        </div>

        <div v-if="!resetCredentialsCopied && selectedUser && newPassword"
             class="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mt-4">
          <p>⚠️ Debe copiar las credenciales antes de restablecer la contraseña</p>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeResetModal" />
        <Button label="Restablecer" icon="pi pi-check" class="bg-customBlue-700"
                @click="resetPassword"
                :disabled="!resetCredentialsCopied" />
      </template>
    </Dialog>
  </div>
  <Toast/>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import adminServices from "../services/adminServices.js";
import {useVuelidate} from '@vuelidate/core';
import {required, helpers} from '@vuelidate/validators';
import {useToast} from "primevue/usetoast";

const toast = useToast();
const users = ref([]);
const editingRows = ref([]);
const displayModal = ref(false);
const copySuccess = ref(false);
const credentialsCopied = ref(false);

const resetPasswordModal = ref(false);
const selectedUser = ref(null);
const newPassword = ref('');
const resetCopySuccess = ref(false);
const resetCredentialsCopied = ref(false);
const newUser = ref({
  user: '',
  password: '',
  is_admin: false,
  complete_club: false,
  id_role: 2
});

const openResetPasswordModal = (user) => {
  selectedUser.value = user;
  newPassword.value = '';
  resetCredentialsCopied.value = false;
  resetCopySuccess.value = false;
  resetPasswordModal.value = true;
  // Generar contraseña automáticamente al abrir
  generateNewPassword();
};

// Función para generar una nueva contraseña
const generateNewPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  newPassword.value = password;
  resetCredentialsCopied.value = false;
};

// Función para copiar las credenciales
const copyNewCredentials = async () => {
  if (!selectedUser.value || !newPassword.value) return;

  const credentialsText = `Usuario: ${selectedUser.value.nombre}\nContraseña: ${newPassword.value}`;

  try {
    await navigator.clipboard.writeText(credentialsText);
    resetCopySuccess.value = true;
    resetCredentialsCopied.value = true;

    // Ocultar el mensaje de éxito después de 2 segundos
    setTimeout(() => {
      resetCopySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar: ', err);
  }
};

const resetPassword = async () => {
  if (!selectedUser.value || !newPassword.value || !resetCredentialsCopied.value) return;

  try {
    await adminServices.resetPassword(selectedUser.value.id, newPassword.value);

    toast.add({
      severity: 'success',
      summary: 'Mensaje de éxito',
      detail: 'Contraseña restablecida correctamente',
      life: 3000
    });

    // Actualizar la lista de usuarios para reflejar el cambio
    await getAllUsers();
    resetPasswordModal.value = false;
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Error al restablecer la contraseña',
      life: 3000
    });
  }
};
const closeResetModal = () => {
  resetPasswordModal.value = false;
};
// Función de validación para solo permitir letras de a-z sin espacios
const onlyLettersValidation = (value) => {
  if (!value) return true;
  const regex = /^[a-zA-Z]+$/;
  return regex.test(value);
};

const rules = {
  user: {
    required: helpers.withMessage("El nombre de usuario es requerido", required),
    onlyLetters: helpers.withMessage("Solo se permiten letras (a-z) sin espacios, números o caracteres especiales", onlyLettersValidation)
  },
  password: {
    required: helpers.withMessage("La contraseña es requerida", required)
  }
};

const v$ = useVuelidate(rules, newUser);

const onRowEditSave = (event) => {
  let {newData, index} = event;
  users.value[index] = newData;
};

const getAllUsers = async () => {
  const response = await adminServices.getAllUsers();
  users.value = response.data.map(user => ({
    id: user.id,
    nombre: user.user,
    password: user.password
  }));
};

const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  newUser.value.password = password;
  // Resetear estado de copiado cuando se genera nueva contraseña
  credentialsCopied.value = false;
};

const copyCredentials = async () => {
  if (!newUser.value.user || !newUser.value.password || v$.value.user.$invalid) return;

  const credentialsText = `Usuario: ${newUser.value.user}\nContraseña: ${newUser.value.password}`;

  try {
    await navigator.clipboard.writeText(credentialsText);
    copySuccess.value = true;
    credentialsCopied.value = true;

    // Ocultar el mensaje de éxito después de 2 segundos
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar: ', err);
  }
};

const openNewUserModal = () => {
  newUser.value = {
    user: '',
    password: '',
    is_admin: false,
    complete_club: false,
    id_role: 2
  };
  v$.value.$reset();
  credentialsCopied.value = false;
  displayModal.value = true;
};

const closeModal = () => {
  displayModal.value = false;
  copySuccess.value = false;
};

const saveNewUser = async () => {
  try {
    const isValid = await v$.value.$validate();
    if (!isValid || !credentialsCopied.value) return;

    const response = await adminServices.saveUser(newUser.value);

    if (response.status === 200 || response.status === 201) {
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Usuario creado con éxito',
        life: 3000
      });

      await getAllUsers();
      displayModal.value = false;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear el usuario',
        life: 3000
      });
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response.data.message,
      life: 3000
    });
  }
};


onMounted(() => {
  getAllUsers();
});
</script>
Usuario: leones
Contraseña: $@ppnEBj