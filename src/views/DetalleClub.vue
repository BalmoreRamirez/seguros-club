<template>
  <div class="container p-4 space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500">
      Miembros del club - {{ nombre_club }}
    </h1>
    <div class="flex justify-between w-4/5 mx-auto">
      <Button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="generarPdf" :disabled="isPdfButtonDisabled">
        Generar PDF
      </Button>
      <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="showModal = true">
        Agregar miembro
      </button>
    </div>
    <div class="flex flex-col space-y-10 w-4/5 mx-auto">
      <div class="flex flex-col justify-between">
        <span class="text-customBlue-500">Total pagado: {{ totalPagado }}</span>
        <span class="text-customBlue-500">Total pendiente: {{ totalPendiente }}</span>
      </div>
      <DataTable :data="transformedData" :columns="columns" :haveActions="true">
        <template #actions="{data}">
          <div class="flex justify-center items-center">
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
    <Dialog header="Agregar Información" v-model:visible="showModal" :modal="true" :closable="true"
            :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw'}">
      <div class="my-5">
        <h1 class="text-customBlue-700 text-2xl">Información Personal</h1>
      </div>
      <div class="p-fluid grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="field">
          <label for="nombres">Primer nombre</label>
          <InputText v-model="v$.primer_nombre.$model" class="!w-full"/>
          <errors :errors="v$.primer_nombre.$errors"/>
        </div>
        <div class="field">
          <label for="nombres">Segundo nombre</label>
          <InputText v-model="v$.segundo_nombre.$model" class="!w-full"/>
          <errors :errors="v$.segundo_nombre.$errors"/>
        </div>
        <div class="field">
          <label for="apellidos">Primer apellido</label>
          <InputText v-model="v$.primer_apellido.$model" class="!w-full"/>
          <errors :errors="v$.primer_apellido.$errors"/>
        </div>
        <div class="field">
          <label for="apellidos">Segundo apellido</label>
          <InputText v-model="v$.segundo_apellido.$model" class="!w-full"/>
          <errors :errors="v$.segundo_apellido.$errors"/>
        </div>
        <div class="field">
          <label for="telefono">Teléfono</label>
          <InputMask v-model="v$.telefono.$model" mask="9999-9999" class="!w-full"/>
          <errors :errors="v$.telefono.$errors"/>
        </div>
        <div class="field">
          <label for="es_alergico">¿Es alérgico a?</label>
          <InputText v-model="v$.is_alergico_a.$model" class="!w-full"/>
          <errors :errors="v$.is_alergico_a.$errors"/>
        </div>
        <div class="field">
          <label for="enfermedad">¿Padece alguna enfermedad?</label>
          <InputText v-model="v$.enfermedad_padese.$model" class="!w-full"/>
          <errors :errors="v$.enfermedad_padese.$errors"/>
        </div>
        <div class="field">
          <label for="medicamento">¿Medicamento con receta?</label>
          <InputText v-model="v$.medicamento_receta.$model" class="!w-full"/>
          <errors :errors="v$.medicamento_receta.$errors"/>
        </div>
        <div class="field">
          <label for="edad">Edad</label>
          <InputNumber v-model="v$.edad.$model" class="!w-full"/>
          <errors :errors="v$.edad.$errors"/>
        </div>
      </div>
      <div class="my-5">
        <h1 class="text-customBlue-700 text-2xl">Información del Responsable</h1>
      </div>
      <div class="p-fluid grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="field">
          <label for="nombres_responsable">Nombres</label>
          <InputText v-model="v$.nombres_responsable.$model" class="!w-full"/>
          <errors :errors="v$.nombres_responsable.$errors"/>
        </div>
        <div class="field">
          <label for="apellidos_responsable">Apellidos</label>
          <InputText v-model="v$.apellidos_responsable.$model" class="!w-full"/>
          <errors :errors="v$.apellidos_responsable.$errors"/>
        </div>
        <div class="field">
          <label for="telefono_responsable">Teléfono</label>
          <InputMask v-model="v$.telefono_responsable.$model" mask="9999-9999" class="!w-full"/>
          <errors :errors="v$.telefono_responsable.$errors"/>
        </div>
        <div class="field">
          <label for="parentesco">Parentesco</label>
          <InputText v-model="v$.parentesco_responsable.$model" class="!w-full"/>
          <errors :errors="v$.parentesco_responsable.$errors"/>
        </div>
      </div>
      <div class="my-5 flex">
        <Button class="text-white bg-customBlue-700 rounded-lg" label="Agregar" @click="addConquis"/>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import axiosInstance from "../axiosConfig.js";
import {useVuelidate} from "@vuelidate/core";
import DataTable from "../components/DataTable.vue";
import {helpers, required, maxLength, minLength} from "@vuelidate/validators";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {useRoute, useRouter} from "vue-router";
import Errors from "../components/errors.vue";
import {is_admin} from "../utils/auth.js";

const router = useRouter();
const route = useRoute()
const showModal = ref(false);
const DataClub = ref([]);
const nombre_club = ref("");
const miembroClub = ref({
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  telefono: "",
  is_alergico_a: "",
  enfermedad_padese: "",
  medicamento_receta: "",
  edad: "",
  nombres_responsable: "",
  apellidos_responsable: "",
  telefono_responsable: "",
  parentesco_responsable: "",
  pago_seguro: false
});
const phoneStart = (number) => {
  if (!number) {
    return true;
  } else {
    let regex = new RegExp('^[267]');
    return regex.test(number);
  }
}
const rules = {
  primer_nombre: {
    required: helpers.withMessage("El primer nombre es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  segundo_nombre: {
    required: helpers.withMessage("El segundo nombre es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  primer_apellido: {
    required: helpers.withMessage("El primer apellido es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  segundo_apellido: {
    required: helpers.withMessage("El segundo apellido es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  telefono: {
    required: helpers.withMessage("El teléfono es requerido", required),
    startsWith: helpers.withMessage("El teléfono debe comenzar con 6, 2 o 7", phoneStart),
  },
  is_alergico_a: {
    required: helpers.withMessage("La información sobre alergias es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(2)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  enfermedad_padese: {
    required: helpers.withMessage("La información sobre enfermedades es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(2)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  medicamento_receta: {
    required: helpers.withMessage("La información sobre medicamentos es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(2)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  edad: {
    required: helpers.withMessage("La edad es requerida", required),
  },
  nombres_responsable: {
    required: helpers.withMessage("Los nombres del responsable son requeridos", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  apellidos_responsable: {
    required: helpers.withMessage("Los apellidos del responsable son requeridos", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  },
  telefono_responsable: {
    required: helpers.withMessage("El teléfono del responsable es requerido", required),
  },
  parentesco_responsable: {
    required: helpers.withMessage("El parentesco es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
  }
};
const isPdfButtonDisabled = computed(() => {
  return DataClub.value.every(item => item.seguro);
});
const v$ = useVuelidate(rules, miembroClub);
const columns = [
  {field: "nombres", header: "Nombres"},
  {field: "apellidos", header: "Apellidos"},
  {field: "edad", header: "Edad"},
  {field: "seguro", header: "Seguro"},
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

const addConquis = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    let data = {
      ...miembroClub.value,
      id_club: parseInt(route.params.id),
    };
    await axiosInstance.post('/miembros', data);
    showModal.value = false;
    miembroClub.value = {
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
          telefono: "",
          is_alergico_a: "",
          enfermedad_padese: "",
          medicamento_receta: "",
          edad: "",
          nombres_responsable: "",
          apellidos_responsable: "",
          telefono_responsable: "",
          parentesco_responsable: ""
        }
    await fetchMiembros();
  } catch (e) {
    console.error(e);
  }
}

const fetchMiembros = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/miembros/${id}`);
    DataClub.value = response.data;
  } catch (e) {
    console.error(e);
  }
}
const getClubId = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/club/${id}`);
    nombre_club.value = response.data.nombre;
  } catch (e) {
    console.error(e);
  }
}
const transformedData = computed(() => {
  return DataClub.value.map(member => ({
    ...member,
    seguro: member.seguro ? 'pagado' : 'pendiente'
  }));
});
onMounted(() => {
  fetchMiembros();
  getClubId()
});
const totalPagado = computed(() => {
  return DataClub.value.filter(member => member.seguro).length;
});

const totalPendiente = computed(() => {
  return DataClub.value.filter(member => !member.seguro).length;
});
const generarPdf = () => {
  const doc = new jsPDF();
  const title = "ASOCIACION PARACENTRAL SALVADOREÑA";
  const subtitle = "PAGO DE SEGUROS";
  const clubName = `Club: ${nombre_club.value}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth = doc.getTextWidth(title);
  const subtitleWidth = doc.getTextWidth(subtitle);
  const clubNameWidth = doc.getTextWidth(clubName);
  const titleX = (pageWidth - titleWidth) / 2;
  const subtitleX = (pageWidth - subtitleWidth) / 2;
  const clubNameX = (pageWidth - clubNameWidth) / 2;

  doc.text(title, titleX, 10);
  doc.text(subtitle, subtitleX, 20);
  doc.text(clubName, clubNameX, 30);

  const newColumns = columns.map(col => ({ header: col.header, field: col.field }));

  const transformedDataForPdf = DataClub.value
    .filter(member => !member.seguro)
    .map(member => ({
      ...member,
      seguro: 'pendiente'
    }));

  doc.autoTable({
    head: [newColumns.map(col => col.header)],
    body: transformedDataForPdf.map(member => newColumns.map(col => member[col.field])),
    startY: 40
  });

  const totalAmount = transformedDataForPdf.length * 1.50;
  doc.text(`Total a pagar: $${totalAmount.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

  doc.save(`${clubName}.pdf`);
};
</script>

<style>
/* TailwindCSS is used for styling */
</style>