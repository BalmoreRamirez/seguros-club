<template>
  <div class="container p-4 space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500">
      Miembros del club - {{ $route.params.id }}
    </h1>
    <div class="flex justify-between w-4/5 mx-auto">
      <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="generarPdf">
        PDF
      </button>
      <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="showModal = true">
        Agregar
      </button>
    </div>
    <div class="flex flex-col space-y-10 w-4/5 mx-auto">
      <DataTable :data="DataClub" :columns="columns" :haveActions="true">
        <template #actions="{data}">
          <div class="flex justify-center items-center">
            <div v-for="(action, index) in actions" :key="index">
              <button  :key="action.label" type="button" class="bg-transparent rounded-full px-1" @click="() => action.onClick(data)">
                <i class="pi pi-pencil text-customBlue-500"></i>
              </button>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
    <Dialog header="Agregar Transacción" v-model:visible="showModal" :modal="true" :closable="true">
      <div class="p-fluid grid grid-cols-2 gap-4">
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
          <label for="cuenta">Dirección</label>
          <InputText v-model="v$.direccion.$model" class="!w-full"/>
          <span v-if="v$.direccion.$dirty && v$.direccion.$error" class="text-red-600">
            {{ v$.direccion.required.$message }}
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

const router = useRouter();
const showModal = ref(false);
const DataClub = ref([
  {
    id: 1,
    nombre: "Juan",
    edad: 20,
    telefono: "123456789",
    seguro: true
  },
  {
    id: 2,
    nombre: "Pedro",
    edad: 25,
    telefono: "987654321",
    seguro: false
  },
  {
    id: 3,
    nombre: "María",
    edad: 30,
    telefono: "123456789",
    seguro: true
  },
]);
const club = ref({
  nombre: "",
  edad: "",
  telefono: "",
  seguro: ""
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
  direccion: {
    required: helpers.withMessage("La dirección es requerida", required),
  },
  pastor: {
    required: helpers.withMessage("El pastor es requerido", required),
  },
};
const v$ = useVuelidate(rules, club);

const columns = [
  {field: "nombre", header: "Nombre"},
  {field: "edad", header: "Edad"},
  {field: "telefono", header: "Teléfono"}
];
const actions = ref([
  {
    label: "Editar",
    icon: "visibility",
    onClick: (value) => {
      console.log(value.id);
      router.push({name: 'Perfil', params: {id: value.id}});
    },
  }
]);
const addClub = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    await axiosInstance.post('/clubes', club.value);
    console.log('Club agregado');
  } catch (e) {
    console.error(e);
  }
}
const generarPdf = () => {
  const doc = new jsPDF();
  const title = "Miembros del club";
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;

  doc.text(title, x, 10);
  let newColumns = columns.map(col => ({header: col.header, field: col.field}));
  newColumns.push({header: "Seguro", field: "seguro"});
  doc.autoTable({
    head: [newColumns.map(col => col.header)],
    body: DataClub.value.map(club => newColumns.map(col => club[col.field])),
  });
  doc.save("lista_de_clubes.pdf");
}
</script>

<style>
/* TailwindCSS is used for styling */
</style>