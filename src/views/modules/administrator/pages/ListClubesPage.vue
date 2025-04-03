<template>
  <div class="space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlack-500">Lista de clubes</h1>
    <div class="flex flex-col md:flex-row justify-between w-full  mx-auto space-y-4 md:space-y-0">
      <Button class="bg-customBlue-700 text-white" v-if="is_admin" @click="generarPdf(DataClub, columns)">
        <i class="pi pi-file-pdf mr-2"></i> Exportar a PDF
      </Button>
      <Button class="bg-customBlue-700 text-white" v-if="is_admin" @click="reporteGeneral">
        <i class="pi pi-chart-bar mr-2"></i> Reporte General
      </Button>
    </div>
    <div class="space-y-10">
      <DataTableClubesComponent :data="DataClub" :columns="columns" :haveActions="true">
        <template #actions="{ data }">
          <div class="flex justify-left items-center">
            <div v-for="(action, index) in actions" :key="index">
              <button :key="action.label" type="button" class="bg-transparent rounded-full px-1"
                      @click="() => action.onClick(data)">
                <i :class="action.icon(data)" class="text-customBlue-700"></i>
              </button>
            </div>
          </div>
        </template>
      </DataTableClubesComponent>
    </div>
    <Dialog header="Agregar Información" v-model:visible="showModal" :modal="true" :closable="true"
            :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw'}">
      <div class="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field">
          <label for="cuenta">Club</label>
          <InputText v-model="v$.nombre.$model" class="!w-full"/>
          <errors :errors="v$.nombre.$errors"/>
        </div>
        <div class="field">
          <label for="cuenta">Iglesia</label>
          <InputText v-model="v$.iglesia.$model" class="!w-full"/>
          <errors :errors="v$.iglesia.$errors"/>
        </div>
        <div class="field">
          <label for="cuenta">Distrito</label>
          <InputText v-model="v$.distrito.$model" class="!w-full"/>
          <errors :errors="v$.distrito.$errors"/>
        </div>
        <div class="field flex flex-col">
          <label for="cuenta">Zona</label>
          <Dropdown v-model="v$.zona.$model" :options="zonas" optionLabel="nombre" placeholder="Zonas" class="!w-full"/>
          <errors :errors="v$.zona.$errors"/>
        </div>
        <div class="field">
          <label for="cuenta">Pastor</label>
          <InputText v-model="v$.pastor.$model" class="!w-full"/>
          <errors :errors="v$.pastor.$errors"/>
        </div>
        <div class="field">
          <p class="text-yellow-500 italic">
            Nota: Al agregar la información del club debe de iniciar sesión nuevamente.
          </p>
        </div>
        <div class="field">
          <Button class="text-white bg-customBlue-700 rounded-lg" label="Actualizar" @click="updateClub"/>
        </div>
      </div>
    </Dialog>
  </div>
  <Toast/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useVuelidate} from "@vuelidate/core";
import {helpers, maxLength, minLength, required} from "@vuelidate/validators";
import "jspdf-autotable";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Errors from "../../../../components/errors.vue";
import DataTableClubesComponent from "../components/DataTableClubesComponent.vue";
import {generarPdf} from "../../../../utils/ListClubesPdf.js";
import {reporteGeneral} from "../../../../utils/ClubesReportGeneral.js";
import {id_role, is_admin, user_id} from "../../../../utils/auth.js";
import adminServices from "../services/adminServices.js";
import {encrypt} from "../../../../utils/crypto.js";

const toast = useToast();
const router = useRouter();
const showModal = ref(false);
const opcionActualizar = ref(false);
const idClubActualizar = ref(0);
const DataClub = ref([]);
const club = ref({
  iglesia: "",
  distrito: "",
  zona: "",
  nombre: "",
  pastor: "",
});

const zonas = ref([
  {id: 1, nombre: "Zona 1"},
  {id: 2, nombre: "Zona 2"},
  {id: 3, nombre: "Zona 3"},
  {id: 4, nombre: "Zona 4"}
]);

const textValidation = (value) => {
  if (!value) return true;
  const reget = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return reget.test(value);
};

const textNumberValidation = (value) => {
  if (!value) return true;
  const reget = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s1-9]+$/;
  return reget.test(value);
};

const rules = {
  iglesia: {
    required: helpers.withMessage("La iglesia es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras y números", textNumberValidation),
  },
  distrito: {
    required: helpers.withMessage("El distrito es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras y números", textNumberValidation),
  },
  zona: {
    required: helpers.withMessage("La zona es requerida", required),
  },
  nombre: {
    required: helpers.withMessage("El club es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras y números", textNumberValidation),
  },
  pastor: {
    required: helpers.withMessage("El pastor es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
};

const v$ = useVuelidate(rules, club);

const columns = [
  {field: 'nombre', header: 'Clubs'},
  {field: 'miembros', header: 'Miembros'},
  {field: 'pagados', header: 'Pagados'},
  {field: 'pendientes', header: 'Pendientes'},
  {field: 'iglesia', header: 'Iglesia'},
  {field: 'distrito', header: 'Distrito'},
  {field: 'zona', header: 'Zona'},
  {field: 'pastor', header: 'Pastor'},
];

const actions = ref([
  {
    label: "Ver",
    icon: () => "pi pi-eye",
    onClick: (value) => {
      const encryptedId = encrypt(value.id.toString());
      if (is_admin.value) {
        router.push({name: 'Clubes', params: {id: encryptedId}});
      } else {
        router.push({name: 'DetalleClub', params: {id: encryptedId}});
      }
    },
  },
  {
    label: (club) => club.estado ? "Deactivate" : "Activate",
    icon: (club) => club.estado ? "pi pi-times" : "pi pi-check",
    onClick: (club) => updateClubStatus(club),
  },
  {
    label: 'Editar',
    icon: () => 'pi pi-pencil',
    onClick: (value) => {
      opcionActualizar.value = true;
      idClubActualizar.value = parseInt(value.id);
      club.value = {
        iglesia: value.iglesia,
        distrito: value.distrito,
        zona: zonas.value.find(zona => zona.nombre === value.zona),
        nombre: value.nombre,
        pastor: value.pastor,
      };
      showModal.value = true;
    },
  }
]);

const listarClubes = async () => {
  try {
    const response = await adminServices.ListClubes(id_role.value, user_id.value);
    DataClub.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const updateClub = async () => {
  try {
    const data = {
      iglesia: club.value.iglesia,
      distrito: club.value.distrito,
      zona: club.value.zona.nombre,
      nombre: club.value.nombre,
      pastor: club.value.pastor,
    };
    const response = await adminServices.UpdateClub(idClubActualizar.value, data);
    if (response.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Club actualizado con éxito',
        life: 3000
      });
      await listarClubes();
      resetClubForm();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Mensaje de error',
        detail: 'Error al actualizar el club',
        life: 3000
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const updateClubStatus = async (club) => {
  try {
    const newState = !club.estado;
    const response = await adminServices.UpdateStatusClub(club.id);
    if (response.status === 200) {
      await listarClubes();
      toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: `Club ${newState ? 'activado' : 'desactivado'} con éxito`,
        life: 3000
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const resetClubForm = () => {
  club.value = {
    iglesia: "",
    distrito: "",
    zona: "",
    nombre: "",
    pastor: "",
  };
  showModal.value = false;
};

onMounted(() => {
  listarClubes();
});
</script>

<style>
/* TailwindCSS is used for styling */
</style>