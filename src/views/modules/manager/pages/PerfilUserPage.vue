<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row justify-between my-10">
      <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlack-500">
        Perfil de
        {{ informacionPersonal.primer_nombre + " " + informacionPersonal.primer_apellido }}
      </h1>
      <button
        class="px-4 py-2 text-white bg-customBlue-700 rounded-lg mt-5 md:mt-0"
        @click="generarPdf"
        v-if="is_admin"
      >
        Exportar a PDF
      </button>
    </div>
    <div class="my-10">
      <h1 class="text-customBlack-500 text-3xl mb-5">Información Personal</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-100 px-4 py-4 rounded-lg">
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Nombres</h3>
        <p class="text-gray-700">{{ informacionPersonal.primer_nombre || '-' }} {{ informacionPersonal.segundo_nombre || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Apellidos</h3>
        <p class="text-gray-700">{{ informacionPersonal.primer_apellido || '-' }} {{ informacionPersonal.segundo_apellido || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">¿Padece alguna enfermedad?</h3>
        <p class="text-gray-700">{{ informacionPersonal.enfermedad || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">¿Medicamento con receta?</h3>
        <p class="text-gray-700">{{ informacionPersonal.medicamento || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Edad</h3>
        <p class="text-gray-700">{{ informacionPersonal.edad || '-' }}</p>
      </div>
      <div class="flex flex-wrap gap-3 bg-gray-300 p-2 rounded-lg">
        <div class="flex items-center">
          <InputSwitch v-model="seguro" class="mr-2" :disabled="!is_admin" />
          <label for="ingredient1" class="ml-2">{{seguro ? 'Seguro cancelado' : 'Seguro no cancelado'}}</label>
        </div>
      </div>
    </div>
    <div class="my-10">
      <h1 class="text-customBlack-500 text-3xl mb-5">Información del Responsable</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-100 px-4 py-4 rounded-lg">
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Nombres</h3>
        <p class="text-gray-700">{{ informacionResponsable.nombresReponsable || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Apellidos</h3>
        <p class="text-gray-700">{{ informacionResponsable.apellidosReponsable || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Teléfono</h3>
        <p class="text-gray-700">{{ informacionResponsable.telefono || '-' }}</p>
      </div>
      <div>
        <h3 class="text-customBlack-500 text-2xl mb-2">Parentesco</h3>
        <p class="text-gray-700">{{ informacionResponsable.parentesco || '-' }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axiosInstance from "../../../../axiosConfig.js";
import { useRoute, useRouter } from "vue-router";
import InputSwitch from 'primevue/inputswitch';
import { is_admin } from "../../../../utils/auth.js";

const route = useRoute();
const router = useRouter();
const seguro = ref(false);
const informacionPersonal = ref({
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  enfermedad: "",
  medicamento: "",
  edad: "",
});

const informacionResponsable = ref({
  nombresReponsable: "",
  apellidosReponsable: "",
  telefono: "",
  parentesco: "",
});

const fetchMiPerfil = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get("/miembro/" + id);
    const data = response.data;
    seguro.value = data.pago_seguro;
    informacionPersonal.value = {
      primer_nombre: data.primer_nombre,
      segundo_nombre: data.segundo_nombre,
      primer_apellido: data.primer_apellido,
      segundo_apellido: data.segundo_apellido,
      enfermedad: data.enfermedad_padese,
      medicamento: data.medicamento_receta,
      edad: data.edad,
    };

    informacionResponsable.value = {
      nombresReponsable: data.nombres_responsable,
      apellidosReponsable: data.apellidos_responsable,
      telefono: data.telefono_responsable,
      parentesco: data.parentesco_responsable,
    };
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchMiPerfil();
});

const generarPdf = () => {
  const doc = new jsPDF();
  const title =
    "Perfil de " +
    informacionPersonal.value.primer_nombre +
    " " +
    informacionPersonal.value.primer_apellido;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;

  doc.text(title, x, 10);

  doc.autoTable({
    head: [["Información Personal", ""]],
    body: [
      ["Nombres", informacionPersonal.value.primer_nombre + " " + informacionPersonal.value.segundo_nombre],
      ["Apellidos", informacionPersonal.value.primer_apellido + " " + informacionPersonal.value.segundo_apellido],
      ["¿Padece alguna enfermedad?", informacionPersonal.value.enfermedad],
      ["¿Medicamento con receta?", informacionPersonal.value.medicamento],
      ["Edad", informacionPersonal.value.edad],
    ],
    startY: 20,
  });

  doc.autoTable({
    head: [["Información del Responsable", ""]],
    body: [
      ["Nombres", informacionResponsable.value.nombresReponsable],
      ["Apellidos", informacionResponsable.value.apellidosReponsable],
      ["Teléfono", informacionResponsable.value.telefono],
      ["Parentesco", informacionResponsable.value.parentesco],
    ],
    startY: doc.previousAutoTable.finalY + 10,
  });

  doc.save("perfil.pdf");
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>