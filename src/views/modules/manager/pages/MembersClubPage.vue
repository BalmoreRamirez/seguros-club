<template>
  <div v-bind="$attrs" class=" space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlack-500">
      Miembros del club - {{ nombre_club }}
    </h1>
    <div class="flex flex-col md:flex-row justify-between w-full  mx-auto space-y-4 md:space-y-0">
      <Button
          class="bg-customBlue-700 text-white"
          @click="constranciaSeguroMiembros(nombre_club, columns, DataClub)" :disabled="isPdfButtonDisabled">
        <i class="pi pi-file-pdf mr-2"></i> Generar constancia
      </Button>
      <Button
          class="bg-customBlue-700 text-white"
          @click="showModal = true">
        <i class="pi pi-user-plus mr-2"></i> Agregar miembro
      </Button>
    </div>
    <div class="flex flex-col space-y-10  mx-auto">
      <div class="flex flex-col justify-between">
        <span class="text-customBlue-500">Total pagado: {{ totalPagado }}</span>
        <span class="text-customBlue-500">Total pendiente: {{ totalPendiente }}</span>
      </div>
      <DataTableMembersComponent :data="transformedData" :columns="columns" :haveActions="true">
        <template #actions="{data}">
          <div class="flex justify-center items-center">
            <div v-for="(action, index) in actions" :key="index">
              <button :key="action.label" type="button" class="bg-transparent rounded-full px-1"
                      @click="() => action.onClick(data)">
                <i :class="action.icon" class="text-customBlue-500"></i>
              </button>
            </div>
          </div>
        </template>

      </DataTableMembersComponent>
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
        <div class="field">
          <label for="cuenta">Tipo</label>{{ miembroClub.tipo.nombre }}
          <Dropdown v-model="v$.tipo.$model" :options="tipo" optionLabel="nombre" placeholder="Tipo" class="!w-full"/>
          <errors :errors="v$.tipo.$errors"/>
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
      <Divider/>
      <div class="my-5 flex justify-center">
        <Button class="text-white bg-customBlue-700 rounded-lg" icon="pi pi-user-plus" label="Agregar"
                @click="SaveMember"/>
        <Button class=" mx-2" icon="pi pi-times" label="Cancelar"
                @click="showModal = false" outlined/>
      </div>
    </Dialog>
    <ViewInfoMember
        v-model="showViewModal"
        :member="selectedMember"
    />
    <Dialog header="Editar Miembro" v-model:visible="showEditModal" :modal="true" :closable="true"
            :style="{ width: '90vw', maxWidth: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw'}">
      <div class="p-fluid">
        <h2 class="text-customBlue-700 text-2xl mb-4">Información Personal</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Primer nombre:</h3>
            <InputText v-model="selectedMember.primer_nombre" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Segundo nombre:</h3>
            <InputText v-model="selectedMember.segundo_nombre" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Primer apellido:</h3>
            <InputText v-model="selectedMember.primer_apellido" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Segundo apellido:</h3>
            <InputText v-model="selectedMember.segundo_apellido" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Teléfono:</h3>
            <InputMask v-model="selectedMember.telefono" mask="9999-9999" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">¿Es alérgico a?</h3>
            <InputText v-model="selectedMember.is_alergico_a" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">¿Padece alguna enfermedad?</h3>
            <InputText v-model="selectedMember.enfermedad_padese" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">¿Medicamento con receta?</h3>
            <InputText v-model="selectedMember.medicamento_receta" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Edad:</h3>
            <InputNumber v-model="selectedMember.edad" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Tipo:</h3>
            <Dropdown v-model="selectedMember.tipo" :options="tipo" optionLabel="nombre"
                      class="text-customBlack-300 capitalize"/>
          </div>
        </div>
        <h2 class="text-customBlue-700 text-2xl mb-4 mt-4">Información del Responsable</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Nombres:</h3>
            <InputText v-model="selectedMember.nombres_responsable" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Apellidos:</h3>
            <InputText v-model="selectedMember.apellidos_responsable" class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Teléfono:</h3>
            <InputMask v-model="selectedMember.telefono_responsable" mask="9999-9999"
                       class="text-customBlack-300 capitalize"/>
          </div>
          <div>
            <h3 class="text-customBlack-500 text-xl mb-2">Parentesco:</h3>
            <InputText v-model="selectedMember.parentesco_responsable" class="text-customBlack-300 capitalize"/>
          </div>
        </div>
        <Divider/>
        <div class="my-5 flex justify-center">
          <Button class="text-white bg-customBlue-700 rounded-lg" icon="pi pi-save" label="Actualizar"
                  @click="saveEditedMember"/>
          <Button class=" mx-2" icon="pi pi-times" label="Cancelar"
                  @click="showEditModal = false" outlined/>
        </div>
      </div>
    </Dialog>
  </div>
  <Toast/>
</template>

<script setup>
defineOptions({
  inheritAttrs: true
});
import {ref, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {helpers, required, maxLength, minLength} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Divider from "primevue/divider";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DataTableMembersComponent from "../components/DataTableMembersComponent.vue";
import Errors from "../../../../components/errors.vue";
import axiosInstance from "../../../../axiosConfig.js";
import {decrypt} from "../../../../utils/crypto.js";
import {constranciaSeguroMiembros} from "../../../../utils/constranciaSeguroMiembros.js";
import ViewInfoMember from "../components/ViewInfoMember.vue";

// Referencias y estados
const selectedMember = ref({});
const showViewModal = ref(false);
const toast = useToast();
const route = useRoute()
const showModal = ref(false);
const showEditModal = ref(false);
const DataClub = ref([]);
const nombre_club = ref("");
const tipo = ref([
  {id: 1, nombre: "Aventurero"},
  {id: 2, nombre: "Conquistador"},
  {id: 3, nombre: "Guia Mayor"},
  {id: 4, nombre: "JA"},
]);
const textValidation = (value) => {
  if (!value) {
    return true;
  } else {
    const reget = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return reget.test(value);
  }
}
const medicamentoValidation = (value) => {
  if (!value) {
    return true;
  } else {
    const reget = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ,;.\s\-_()]+$/
    return reget.test(value);
  }
}
const alergiaValidation = (value) => {
  if (!value) {
    return true;
  } else {
    const reget = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]+$/
    return reget.test(value);
  }
}
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
  pago_seguro: false,
  tipo: "",
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
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  segundo_nombre: {
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  primer_apellido: {
    required: helpers.withMessage("El primer apellido es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  segundo_apellido: {
    required: helpers.withMessage("El segundo apellido es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  telefono: {
    required: helpers.withMessage("El teléfono es requerido", required),
    startsWith: helpers.withMessage("El teléfono debe comenzar con 6, 2 o 7", phoneStart),
  },
  is_alergico_a: {
    required: helpers.withMessage("La información sobre alergias es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(2)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras y comas", alergiaValidation),
  },
  enfermedad_padese: {
    required: helpers.withMessage("La información sobre enfermedades es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(2)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  medicamento_receta: {
    required: helpers.withMessage("La información sobre medicamentos es requerida", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(2)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras y ,;.-_()", medicamentoValidation),
  },
  edad: {
    required: helpers.withMessage("La edad es requerida", required),
    minValue: helpers.withMessage("La edad esta fuera del rango", (value) => value > 0),
    maxValue: helpers.withMessage("La edad esta fuera del rango", (value) => value < 100),
  },
  nombres_responsable: {
    required: helpers.withMessage("Los nombres del responsable son requeridos", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  apellidos_responsable: {
    required: helpers.withMessage("Los apellidos del responsable son requeridos", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  telefono_responsable: {
    required: helpers.withMessage("El teléfono del responsable es requerido", required),
  },
  parentesco_responsable: {
    required: helpers.withMessage("El parentesco es requerido", required),
    minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
    maxLength: helpers.withMessage("Máximo 25 caracteres", maxLength(25)),
    typeText: helpers.withMessage("Solo se permiten letras", textValidation),
  },
  tipo: {
    required: helpers.withMessage("El tipo es requerido", required),
  },
};
const isPdfButtonDisabled = computed(() => {
  return DataClub.value.every(item => item.seguro);
});
const v$ = useVuelidate(rules, miembroClub);
const columns = [
  {field: "nombres", header: "Nombres"},
  {field: "apellidos", header: "Apellidos"},
  {field: "edad", header: "Edad"},

  {field: "telefono", header: "Teléfono"}
];
const actions = ref([
  {
    label: "Ver",
    icon: "pi pi-eye",
    onClick: (value) => {
      selectedMember.value = value;
      showViewModal.value = true;
    },
  },
  {
    label: "Editar",
    icon: "pi pi-pencil",
    onClick: (value) => {
      const tipoSeleccionado = tipo.value.find(t => t.nombre === value.tipo.nombre);
      selectedMember.value = {
        ...value,
        tipo: tipoSeleccionado
      };
      showEditModal.value = true;
    },
  }
]);

const SaveMember = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    let data = {
      ...miembroClub.value,
      tipo: miembroClub.value.tipo.nombre,
      id_club: decrypt(route.params.id)
    };
    const response = await axiosInstance.post('/miembros', data);
    if (response.status === 201) {
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Miembro agregado con éxito',
        life: 3000
      });
      showModal.value = false;
      limpiarData();
      await fetchMiembros();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Mensaje de error',
        detail: 'No se completo la acción',
        life: 3000
      });
    }
  } catch (e) {
    console.error(e);
  }
}

const fetchMiembros = async () => {
  try {
    const id = decrypt(route.params.id);
    const response = await axiosInstance.get(`/miembros/${id}`);
    DataClub.value = response.data;
  } catch (e) {
    console.error(e);
  }
}

const getClubId = async () => {
  try {
    const id = decrypt(route.params.id);
    const response = await axiosInstance.get(`/club/${id}`);
    nombre_club.value = response.data.nombre;
  } catch (e) {
    console.error(e);
  }
}
const saveEditedMember = async () => {
  try {
    const tipoNombre = typeof selectedMember.value.tipo === 'object' && selectedMember.value.tipo !== null
      ? selectedMember.value.tipo.nombre
      : selectedMember.value.tipo;

    const data = {
      ...selectedMember.value,
      tipo: tipoNombre,
    };

    const response = await axiosInstance.put(`/miembro/${selectedMember.value.id}`, data);
    if (response.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Miembro actualizado con éxito',
        life: 3000
      });
      showEditModal.value = false;
      await fetchMiembros();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Mensaje de error',
        detail: 'Error al actualizar el miembro',
        life: 3000
      });
    }
  } catch (e) {
    console.error(e);
  }
};
const transformedData = computed(() => {
  return DataClub.value.map(member => ({
    ...member,
    seguro: member.seguro ? 'pagado' : 'pendiente'
  }));
});
const limpiarData = () => {
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
}
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

</script>

<style>
/* TailwindCSS is used for styling */
</style>