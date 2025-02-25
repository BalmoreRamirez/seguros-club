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
              <button :key="action.label" type="button" class="bg-transparent rounded-full px-1"
                      @click="() => action.onClick(data)">
                <i class="pi pi-pencil text-customBlue-500"></i>
              </button>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
    <Dialog header="Agregar Transacción" v-model:visible="showModal" :modal="true" :closable="true">
      <div>
        <h1 class="text-customBlue-700 text-2xl">Información Personal</h1>
      </div>
      <div class="p-fluid grid grid-cols-3 gap-4">
        <div class="field">
          <label for="nombres">Nombres</label>
          <InputText v-model="v$.nombres.$model" class="!w-full"/>
          <span v-if="v$.nombres.$dirty && v$.nombres.$error" class="text-red-600">
        {{ v$.nombres.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="apellidos">Apellidos</label>
          <InputText v-model="v$.apellidos.$model" class="!w-full"/>
          <span v-if="v$.apellidos.$dirty && v$.apellidos.$error" class="text-red-600">
        {{ v$.apellidos.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="telefono">Teléfono</label>
          <InputMask v-model="v$.telefono.$model" mask="9999-9999" class="!w-full"/>
          <span v-if="v$.telefono.$dirty && v$.telefono.$error" class="text-red-600">
        {{ v$.telefono.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="es_alergico">¿Es alérgico a?</label>
          <InputText v-model="v$.is_alergico_a.$model" class="!w-full"/>
          <span v-if="v$.is_alergico_a.$dirty && v$.is_alergico_a.$error" class="text-red-600">
        {{ v$.is_alergico_a.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="enfermedad">¿Padece alguna enfermedad?</label>
          <InputText v-model="v$.enfermedad_padese.$model" class="!w-full"/>
          <span v-if="v$.enfermedad_padese.$dirty && v$.enfermedad_padese.$error" class="text-red-600">
        {{ v$.enfermedad_padese.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="medicamento">¿Medicamento con receta?</label>
          <InputText v-model="v$.medicamento_receta.$model" class="!w-full"/>
          <span v-if="v$.medicamento_receta.$dirty && v$.medicamento_receta.$error" class="text-red-600">
        {{ v$.medicamento_receta.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="fecha_nacimiento">Fecha de nacimiento</label>
          <Calendar v-model="v$.fecha_nacimiento.$model" :maxDate="new Date()" class="!w-full"/>
          <span v-if="v$.fecha_nacimiento.$dirty && v$.fecha_nacimiento.$error" class="text-red-600">
        {{ v$.fecha_nacimiento.required.$message }}
      </span>
        </div>
      </div>
      <div>
        <h1 class="text-customBlue-700 text-2xl">Información del Responsable</h1>
      </div>
      <div class="p-fluid grid grid-cols-3 gap-4">
        <div class="field">
          <label for="nombres_responsable">Nombres</label>
          <InputText v-model="v$.nombres_responsable.$model" class="!w-full"/>
          <span v-if="v$.nombres_responsable.$dirty && v$.nombres_responsable.$error" class="text-red-600">
        {{ v$.nombres_responsable.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="apellidos_responsable">Apellidos</label>
          <InputText v-model="v$.apellidos_responsable.$model" class="!w-full"/>
          <span v-if="v$.apellidos_responsable.$dirty && v$.apellidos_responsable.$error" class="text-red-600">
        {{ v$.apellidos_responsable.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="telefono_responsable">Teléfono</label>
          <InputMask v-model="v$.telefono_responsable.$model" mask="9999-9999" class="!w-full"/>
          <span v-if="v$.telefono_responsable.$dirty && v$.telefono_responsable.$error" class="text-red-600">
        {{ v$.telefono_responsable.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="parentesco">Parentesco</label>
          <InputText v-model="v$.parentesco_responsable.$model" class="!w-full"/>
          <span v-if="v$.parentesco_responsable.$dirty && v$.parentesco_responsable.$error" class="text-red-600">
        {{ v$.parentesco_responsable.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="seguro">¿Pago de seguro?</label>
          <RadioButton v-model="v$.pago_seguro.$model" inputId="seguro1" name="seguro" value="true"/>
          <RadioButton v-model="v$.pago_seguro.$model" inputId="seguro2" name="seguro" value="false"/>
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
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import axiosInstance from "../axiosConfig.js";
import {useVuelidate} from "@vuelidate/core";
import DataTable from "../components/DataTable.vue";
import {helpers, required} from "@vuelidate/validators";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute()
const showModal = ref(false);
const DataClub = ref([]);

const miembroClub = ref({
  nombres: "",
  apellidos: "",
  telefono: "",
  is_alergico_a: "",
  enfermedad_padese: "",
  medicamento_receta: "",
  fecha_nacimiento: "",
  nombres_responsable: "",
  apellidos_responsable: "",
  telefono_responsable: "",
  parentesco_responsable: "",
  pago_seguro: false
});

const rules = {
  nombres: {
    required: helpers.withMessage("Los nombres son requeridos", required),
  },
  apellidos: {
    required: helpers.withMessage("Los apellidos son requeridos", required),
  },
  telefono: {
    required: helpers.withMessage("El teléfono es requerido", required),
  },
  is_alergico_a: {
    required: helpers.withMessage("La información sobre alergias es requerida", required),
  },
  enfermedad_padese: {
    required: helpers.withMessage("La información sobre enfermedades es requerida", required),
  },
  medicamento_receta: {
    required: helpers.withMessage("La información sobre medicamentos es requerida", required),
  },
  fecha_nacimiento: {
    required: helpers.withMessage("La fecha de nacimiento es requerida", required),
  },
  nombres_responsable: {
    required: helpers.withMessage("Los nombres del responsable son requeridos", required),
  },
  apellidos_responsable: {
    required: helpers.withMessage("Los apellidos del responsable son requeridos", required),
  },
  telefono_responsable: {
    required: helpers.withMessage("El teléfono del responsable es requerido", required),
  },
  parentesco_responsable: {
    required: helpers.withMessage("El parentesco es requerido", required),
  },
  pago_seguro: {
    required: helpers.withMessage("La información sobre el seguro es requerida", required),
  },
};

const v$ = useVuelidate(rules, miembroClub);

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

const addConquis = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    let data = {
      ...miembroClub.value,
      club_id: route.params.id
    };
    await axiosInstance.post('/miembros', data);
    showModal.value = false;
    await fetchMiembros();

  } catch (e) {
    console.error(e);
  }
}

const fetchMiembros = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/miembros/${id}`);
    console.log(response.data);
    DataClub.value = response.data;
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  fetchMiembros();
});

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