<template>
  <div class="container p-4 space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500">
      Miembros del club - {{ nombre_club }}
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
          <label for="nombres">Primer nombre</label>
          <InputText v-model="v$.primer_nombre.$model" class="!w-full"/>
          <span v-if="v$.primer_nombre.$dirty && v$.primer_nombre.$error" class="text-red-600">
        {{ v$.primer_nombre.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="nombres">Segundo nombre</label>
          <InputText v-model="v$.segundo_nombre.$model" class="!w-full"/>
          <span v-if="v$.segundo_nombre.$dirty && v$.segundo_nombre.$error" class="text-red-600">
        {{ v$.segundo_nombre.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="apellidos">Primer apellido</label>
          <InputText v-model="v$.primer_apellido.$model" class="!w-full"/>
          <span v-if="v$.primer_apellido.$dirty && v$.primer_apellido.$error" class="text-red-600">
        {{ v$.primer_apellido.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="apellidos">Segundo apellido</label>
          <InputText v-model="v$.segundo_apellido.$model" class="!w-full"/>
          <span v-if="v$.segundo_apellido.$dirty && v$.segundo_apellido.$error" class="text-red-600">
        {{ v$.segundo_apellido.required.$message }}
      </span>
        </div>
        <div class="field">
          <label for="telefono">Teléfono</label>
          <InputMask v-model="v$.telefono.$model" mask="9999-9999" class="!w-full"/>
          <errors :errors="v$.telefono.$errors"/>
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
          <label for="edad">Edad</label>
          <InputNumber v-model="v$.edad.$model" class="!w-full"/>
          <span v-if="v$.edad.$dirty && v$.edad.$error" class="text-red-600">
        {{ v$.edad.required.$message }}
      </span>
        </div>
      </div>
      <div class="my-5">
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
          <errors :errors="v$.telefono_responsable.$errors"/>
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
          <div class="flex flex-wrap gap-3">
            <div class="flex align-items-center">
              <RadioButton v-model="v$.pago_seguro.$model" inputId="seguro1" name="seguro" value="true"/>
              <label for="ingredient1" class="ml-2">si</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="v$.pago_seguro.$model" inputId="seguro2" name="seguro" value="false"/>
              <label for="ingredient2" class="ml-2">no</label>
            </div>
          </div>
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
import RadioButton from "primevue/radiobutton";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import axiosInstance from "../axiosConfig.js";
import {useVuelidate} from "@vuelidate/core";
import DataTable from "../components/DataTable.vue";
import {helpers, required} from "@vuelidate/validators";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {useRoute, useRouter} from "vue-router";
import Errors from "../components/errors.vue";

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
    required: helpers.withMessage("Los nombres son requeridos", required),
  },
  segundo_nombre: {
    required: helpers.withMessage("Los nombres son requeridos", required),
  },
  primer_apellido: {
    required: helpers.withMessage("Los apellidos son requeridos", required),
  },
  segundo_apellido: {
    required: helpers.withMessage("Los apellidos son requeridos", required),
  },
  telefono: {
    required: helpers.withMessage("El teléfono es requerido", required),
    startsWith: helpers.withMessage("El teléfono debe comenzar con 6, 2 o 7", phoneStart),
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
  edad: {
    required: helpers.withMessage("La edad es requerida", required),
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
  {field: "nombres", header: "Nombre"},
  {field: "apellidos", header: "Apellido"},
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
    console.log(route.params.id);

    let data = {
      ...miembroClub.value,
      id_club: parseInt(route.params.id),
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

onMounted(() => {
  fetchMiembros();
  getClubId()
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