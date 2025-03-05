<template>
  <div class="container p-4 space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlue-500">
      Miembros del club - {{ club_name }}
    </h1>
    <div class="flex justify-between w-4/5 mx-auto">
      <button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="generarPdf" :disabled="DataClub.length===0"
      >
        Generar PDF
      </button>
      <Button class="px-4 py-2 text-white bg-customBlue-700 rounded-lg" @click="UpdateSecureState"
              :disabled="selectedStatusInsurance.length === 0">
        Pagar seguro
      </Button>
    </div>
    <div class="flex flex-col space-y-10 w-4/5 mx-auto">
      <div class="flex flex-col justify-between">
        <span class="text-customBlue-500">Total pagado: {{ totalPagado }}</span>
        <span class="text-customBlue-500">Total pendiente: {{ totalPendiente }}</span>
      </div>
      <DataTable v-model:selection="selectedStatusInsurance" :value="DataClub" dataKey="id"
                 tableStyle="min-width: 50rem">
        <Column selectionMode="multiple" headerStyle="width: 3rem" class="bg-gray-200">
          <template #body="slotProps">
            <Checkbox v-model="selectedStatusInsurance" :value="slotProps.data" :disabled="slotProps.data.seguro"/>
          </template>
        </Column>
        <Column field="nombres" header="Nombres"></Column>
        <Column field="apellidos" header="Apellidos"></Column>
        <Column field="edad" header="Edad"></Column>
        <Column field="seguro" header="Seguro">
          <template #body="slotProps">
            <span>{{ slotProps.data.seguro ? 'Pagado' : 'Pendiente' }}</span>
          </template>
        </Column>
        <Column field="telefono" header="Teléfono"></Column>
      </DataTable>
    </div>
  </div>
  <Toast/>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import DataTable from 'primevue/datatable'
import Button from "primevue/button";
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox';
import {useToast} from "primevue/usetoast";

const toast = useToast();
const selectedStatusInsurance = ref([]);
import axiosInstance from "../../axiosConfig.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {useRoute, useRouter} from "vue-router";
const route = useRoute()
const DataClub = ref([]);
const club_name = ref("");
const dataIdMiembros = ref([]);
const columns = [
  {field: "nombres", header: "Nombres"},
  {field: "apellidos", header: "Apellidos"},
  {field: "edad", header: "Edad"},
  {field: "seguro", header: "Seguro"},
  {field: "telefono", header: "Teléfono"}
];

/**
 * Fetch the members of the selected club
 * @returns {Promise<void>}
 */
const fetchMiembros = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/miembros/${id}`);
    DataClub.value = response.data;
    DataClub.value.forEach((item) => {
      console.log(item.seguro)
     if (item.seguro){

       selectedStatusInsurance.value.push(item);
     }
    })
    console.log(selectedStatusInsurance.value)
  } catch (e) {
    console.error(e);
  }
}
/**
 * Get the club id
 * @returns {Promise<void>}
 */
const getClubId = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/club/${id}`);
    club_name.value = response.data.nombre;
  } catch (e) {
    console.error(e);
  }
}
/**
 * Update the secure state of the selected members
 * @returns {Promise<void>}
 * @constructor
 */
const UpdateSecureState = async () => {
  selectedStatusInsurance.value.forEach((value) => {
    dataIdMiembros.value.push(value.id);
  })
  try {
    const id_club = route.params.id;
    const response = await axiosInstance.put('updateMiembros', {
      "id_club": id_club,
      "id_miembros": dataIdMiembros.value
    });
    if (response.status === 200) {
      await fetchMiembros();
      selectedStatusInsurance.value = [];
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Estados actualizados con éxito',
        life: 3000
      });
    }
  } catch (e) {
    console.error(e);
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
const generarPdf = () => {
  const doc = new jsPDF();
  const title = "ASOCIACION PARACENTRAL SALVADOREÑA";
  const subtitle = "PAGO DE SEGUROS";
  const clubName = `Club: ${club_name.value}`;
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

  const newColumns = columns.map(col => ({header: col.header, field: col.field}));

  const transformedDataForPdf = DataClub.value.map(member => ({
    ...member,
    seguro: member.seguro ? 'pagado' : 'pendiente'
  }));

  doc.autoTable({
    head: [newColumns.map(col => col.header)],
    body: transformedDataForPdf.map(member => newColumns.map(col => member[col.field])),
    startY: 40
  });

  const totalAmount = DataClub.value.filter(member => member.seguro).length * 1.50;
  doc.text(`Total cancelado: $${totalAmount.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

  doc.save(`${clubName}.pdf`);
};
</script>

<style>
/* TailwindCSS is used for styling */
</style>