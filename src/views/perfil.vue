<template>
  <div class="container">
    <div class="flex justify-between my-10">
      <h1
        class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500"
      >
        Perfil de
        {{ informacionPersonal.nombre + " " + informacionPersonal.apellido }}
      </h1>
      <button
        class="px-4 py-2 text-white bg-customBlue-700 rounded-lg"
        @click="generarPdf"
      >
        PDF
      </button>
    </div>
    <div class="flex justify-start my-10">
      <h1 class="text-customBlue-700 text-3xl mb-5">Información Personal</h1>
    </div>
    <div class="mx-auto grid grid-cols-4 gap-4">
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Nombres</h3>
        <p class="text-gray-700">{{ informacionPersonal.nombre }}</p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Apellidos</h3>
        <p class="text-gray-700">{{ informacionPersonal.apellido }}</p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">
          ¿Padece alguna enfermedad?
        </h3>
        <p class="text-gray-700">{{ informacionPersonal.enfermedad }}</p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">
          ¿Medicamento con receta?
        </h3>
        <p class="text-gray-700">{{ informacionPersonal.medicamento }}</p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Fecha de nacimiento</h3>
        <p class="text-gray-700">{{ informacionPersonal.fechaNacimiento }}</p>
      </div>
    </div>
    <div class="flex justify-start my-10">
      <h1 class="text-customBlue-700 text-3xl mb-5">
        Información del Responsable
      </h1>
    </div>
    <div class="mx-auto grid grid-cols-4 gap-4">
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Nombres</h3>
        <p class="text-gray-700">
          {{ informacionResponsable.nombresReponsable }}
        </p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Apellidos</h3>
        <p class="text-gray-700">
          {{ informacionResponsable.apellidosReponsable }}
        </p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Teléfono</h3>
        <p class="text-gray-700">{{ informacionResponsable.telefono }}</p>
      </div>
      <div>
        <h3 class="text-customBlue-700 text-2xl mb-2">Parentesco</h3>
        <p class="text-gray-700">{{ informacionResponsable.parentesco }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axiosInstance from "../axiosConfig.js";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const informacionPersonal = ref({
  nombre: "",
  apellido: "",
  enfermedad: "",
  medicamento: "",
  fechaNacimiento: "",
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

    informacionPersonal.value = {
      nombre: data.nombres,
      apellido: data.apellidos,
      enfermedad: data.enfermedad_padese,
      medicamento: data.medicamento_receta,
      fechaNacimiento: new Date(data.fecha_nacimiento).toLocaleDateString(),
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
    informacionPersonal.value.nombre +
    " " +
    informacionPersonal.value.apellido;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;

  doc.text(title, x, 10);

  doc.autoTable({
    head: [["Información Personal", ""]],
    body: [
      ["Nombres", informacionPersonal.value.nombre],
      ["Apellidos", informacionPersonal.value.apellido],
      ["¿Padece alguna enfermedad?", informacionPersonal.value.enfermedad],
      ["¿Medicamento con receta?", informacionPersonal.value.medicamento],
      ["Fecha de nacimiento", informacionPersonal.value.fechaNacimiento],
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
