<template>
  <div class="container p-4 space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500">
      Lista de clubes
    </h1>
    <div class="flex justify-between w-4/5 mx-auto">
      <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" :disabled="isPdfButtonDisabled"
              @click="generarPdf">
        PDF
      </button>
      <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg"
              @click="showModal = true" v-if="is_admin||!complete_club">
        Agregar
      </button>
    </div>
    <div class="flex flex-col space-y-10 w-4/5 mx-auto">
      <DataTable :data="DataClub" :columns="columns" :haveActions="true">
        <template #actions="{data}">
          <div class="flex justify-left items-center">
            <div v-for="(action, index) in actions" :key="index">
              <button :key="action.label" type="button" class="bg-transparent rounded-full px-1"
                      @click="() => action.onClick(data)">
                <i class="pi pi-eye text-customBlue-500"></i>
              </button>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
    <Dialog header="Agregar Transacción" v-model:visible="showModal" :modal="true" :closable="true">
      <div class="p-fluid grid grid-cols-2 gap-4">
        <div class="field">
          <label for="cuenta">Club</label>
          <InputText v-model="v$.nombre.$model" class="!w-full"/>
          <span v-if="v$.nombre.$dirty && v$.nombre.$error" class="text-red-600">
            {{ v$.nombre.required.$message }}
          </span>
        </div>
        <div class="field">
          <label for="cuenta">Iglesia</label>
          <InputText v-model="v$.iglesia.$model" class="!w-full"/>
          <span v-if="v$.iglesia.$dirty && v$.iglesia.$error" class="text-red-600">
            {{ v$.iglesia.required.$message }}
          </span>
        </div>
        <div class="field">
          <label for="cuenta">Distrito</label>
          <InputText v-model="v$.distrito.$model" class="!w-full"/>
          <span v-if="v$.distrito.$dirty && v$.distrito.$error" class="text-red-600">
            {{ v$.distrito.required.$message }}
          </span>
        </div>

        <div class="field">
          <label for="cuenta">Zona</label>
          <InputText v-model="v$.zona.$model" class="!w-full"/>
          <span v-if="v$.zona.$dirty && v$.zona.$error" class="text-red-600">
            {{ v$.zona.required.$message }}
          </span>
        </div>

        <div class="field">
          <label for="cuenta">Pastor</label>
          <InputText v-model="v$.pastor.$model" class="!w-full"/>
          <span v-if="v$.pastor.$dirty && v$.pastor.$error" class="text-red-600">
            {{ v$.pastor.required.$message }}
          </span>
        </div>
        <div class="field">
          <Button class="text-white bg-customBlue-700 rounded-lg" label="Agregar" @click="addClub"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import axiosInstance from "../axiosConfig.js";
import {useVuelidate} from "@vuelidate/core";
import DataTable from "../components/DataTable.vue";
import {helpers, required} from "@vuelidate/validators";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {useRouter} from "vue-router";
import {is_admin, complete_club, user_id, id_role, logout} from "../utils/auth.js";


const router = useRouter();
const showModal = ref(false);
const DataClub = ref([]);
const estadoButton = ref(false);
const club = ref({
  iglesia: "",
  distrito: "",
  zona: "",
  nombre: "",
  pastor: "",
});

const rules = {
  iglesia: {
    required: helpers.withMessage("La iglesia es requerida", required),
  },
  distrito: {
    required: helpers.withMessage("El distrito es requerido", required),
  },
  zona: {
    required: helpers.withMessage("La zona es requerida", required),
  },
  nombre: {
    required: helpers.withMessage("El club es requerido", required),
  },
  pastor: {
    required: helpers.withMessage("El pastor es requerido", required),
  },
};

const v$ = useVuelidate(rules, club);

const columns = [
  {field: 'nombre', header: 'Club'},
  {field: 'iglesia', header: 'Iglesia'},
  {field: 'distrito', header: 'Distrito'},
  {field: 'zona', header: 'Zona'},
  {field: 'pastor', header: 'Pastor'},
];
const actions = ref([
  {
    label: "Editar",
    icon: "visibility",
    onClick: (value) => {
      console.log(value.id);
      router.push({name: 'DetalleClub', params: {id: value.id}});
    },
  }
]);
const isPdfButtonDisabled = computed(() => DataClub.value.length === 0);
const fetchClubs = async () => {
  try {

    const response = await axiosInstance.get(`/clubs/${id_role.value}/${user_id.value}`);
    DataClub.value = response.data;
  } catch (e) {
    console.error(e);
  }
};
const addClub = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    const response = await axiosInstance.post('/clubs', {id_usuario: user_id.value, ...club.value});
    if (response.status === 201) {
      DataClub.value.push(response.data);
      club.value = {
        iglesia: "",
        distrito: "",
        zona: "",
        nombre: "",
        pastor: "",
      };
      showModal.value = false;
      logout(router)
    }

  } catch (e) {
    console.error(e);
  }
}
const generarPdf = () => {
  const doc = new jsPDF();
  const title = "Lista de clubes";
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;

  doc.text(title, x, 10);
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: DataClub.value.map(club => columns.map(col => club[col.field])),
  });
  doc.save("lista_de_clubes.pdf");
}
onMounted(() => {
  fetchClubs();
});
</script>

<style>
/* TailwindCSS is used for styling */
</style>