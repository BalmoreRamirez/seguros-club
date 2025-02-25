<template>
        <div class="container">
          <div class="flex justify-between my-10">
            <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500">
              Perfil de {{ informacionPersonal.nombre + " " + informacionPersonal.apellido }}
            </h1>
            <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="generarPdf">
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
              <h3 class="text-customBlue-700 text-2xl mb-2">¿Padece alguna enfermedad?</h3>
              <p class="text-gray-700">{{ informacionPersonal.enfermedad }}</p>
            </div>
            <div>
              <h3 class="text-customBlue-700 text-2xl mb-2">¿Medicamento con receta?</h3>
              <p class="text-gray-700">{{ informacionPersonal.medicamento }}</p>
            </div>
            <div>
              <h3 class="text-customBlue-700 text-2xl mb-2">Fecha de nacimiento</h3>
              <p class="text-gray-700">{{ informacionPersonal.fechaNacimiento }}</p>
            </div>
          </div>
          <div class="flex justify-start my-10">
            <h1 class="text-customBlue-700 text-3xl mb-5">Información del Responsable</h1>
          </div>
          <div class="mx-auto grid grid-cols-4 gap-4">
            <div>
              <h3 class="text-customBlue-700 text-2xl mb-2">Nombres</h3>
              <p class="text-gray-700">{{ informacionResponsable.nombresReponsable }}</p>
            </div>
            <div>
              <h3 class="text-customBlue-700 text-2xl mb-2">Apellidos</h3>
              <p class="text-gray-700">{{ informacionResponsable.apellidosReponsable }}</p>
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
      import { ref } from 'vue';
      import jsPDF from 'jspdf';
      import 'jspdf-autotable';

      const informacionPersonal = ref({
        nombre: "Juan Perez",
        apellido: "Perez",
        enfermedad: "diabetes",
        medicamento: "loratadina",
        fechaNacimiento: "12/12/1990"
      });

      const informacionResponsable = ref({
        nombresReponsable: "Maria Perez",
        apellidosReponsable: "Maria Perez",
        telefono: "68542345",
        parentesco: "Madre"
      });

      const generarPdf = () => {
        const doc = new jsPDF();
        const title = "Perfil de " + informacionPersonal.value.nombre + " " + informacionPersonal.value.apellido;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(title);
        const x = (pageWidth - textWidth) / 2;

        doc.text(title, x, 10);

        doc.autoTable({
          head: [['Información Personal', '']],
          body: [
            ['Nombres', informacionPersonal.value.nombre],
            ['Apellidos', informacionPersonal.value.apellido],
            ['¿Padece alguna enfermedad?', informacionPersonal.value.enfermedad],
            ['¿Medicamento con receta?', informacionPersonal.value.medicamento],
            ['Fecha de nacimiento', informacionPersonal.value.fechaNacimiento]
          ],
          startY: 20
        });

        doc.autoTable({
          head: [['Información del Responsable', '']],
          body: [
            ['Nombres', informacionResponsable.value.nombresReponsable],
            ['Apellidos', informacionResponsable.value.apellidosReponsable],
            ['Teléfono', informacionResponsable.value.telefono],
            ['Parentesco', informacionResponsable.value.parentesco]
          ],
          startY: doc.previousAutoTable.finalY + 10
        });

        doc.save("perfil.pdf");
      };
      </script>

      <style scoped>
      /* Add any scoped styles here */
      </style>