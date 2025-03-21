<template>
  <div class="container p-4 space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlack-500">
      Miembros del club - {{ club_name }}
    </h1>
    <div class="flex flex-col md:flex-row justify-between w-full md:w-4/5 mx-auto space-y-4 md:space-y-0">
      <Button
          class="bg-customBlue-700 text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg w-full md:w-auto"
          @click="generarPdf" :disabled="DataClub.length === 0">
        <i class="pi pi-file-pdf mr-2"></i> Generar PDF
      </Button>
      <Button
          class="bg-customBlue-700 text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg w-full md:w-auto"
          @click="UpdateSecureState" :disabled="selectedStatusInsurance.length === 0 || allInsurancesPaid">
        <i class="pi pi-dollar mr-2"></i> Pagar seguro
      </Button>
    </div>

    <div class="flex flex-col space-y-10 w-4/5 mx-auto">
      <div class="flex flex-col justify-between">
        <span class="text-customBlack-300">Total pagado: {{ totalPagado }}</span>
        <span class="text-customBlack-300">Total pendiente: {{ totalPendiente }}</span>
      </div>
      <div class="bg-customWhite-500 p-3 rounded-md shadow-md">
        <DataTable v-model:selection="selectedStatusInsurance" :value="DataClub" dataKey="id" paginator :rows="10"
                   :rowsPerPageOptions="[5, 10, 20, 50]"
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
              <Tag :severity="slotProps.data.seguro?'success':'warning'">{{
                  slotProps.data.seguro ? 'Pagado' : 'Pendiente'
                }}
              </Tag>
            </template>
          </Column>
          <Column field="telefono" header="Teléfono"></Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" severity="info" @click="editMember(slotProps.data)"/>
              <Button icon="pi pi-trash" severity="danger" class="ml-2" @click="deleteMember(slotProps.data)"/>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <Toast/>
  <Dialog v-model:visible="showEditModal" header="Editar Miembro" :modal="true" :closable="true"
          :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw'}">
    <div class="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="field col-span-1 md:col-span-1">
        <label for="primer_nombre">Primer Nombre</label>
        <InputText id="primer_nombre" v-model="editMemberData.primer_nombre"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="segundo_nombre">Segundo Nombre</label>
        <InputText id="segundo_nombre" v-model="editMemberData.segundo_nombre"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="primer_apellido">Primer Apellido</label>
        <InputText id="primer_apellido" v-model="editMemberData.primer_apellido"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="segundo_apellido">Segundo Apellido</label>
        <InputText id="segundo_apellido" v-model="editMemberData.segundo_apellido"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="telefono">Teléfono</label>
        <InputText id="telefono" v-model="editMemberData.telefono"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="is_alergico_a">Alergias</label>
        <InputText id="is_alergico_a" v-model="editMemberData.is_alergico_a"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="enfermedad_padese">Enfermedades</label>
        <InputText id="enfermedad_padese" v-model="editMemberData.enfermedad_padese"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="medicamento_receta">Medicamentos</label>
        <InputText id="medicamento_receta" v-model="editMemberData.medicamento_receta"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="edad">Edad</label>
        <InputText id="edad" v-model="editMemberData.edad"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="nombres_responsable">Nombres del Responsable</label>
        <InputText id="nombres_responsable" v-model="editMemberData.nombres_responsable"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="apellidos_responsable">Apellidos del Responsable</label>
        <InputText id="apellidos_responsable" v-model="editMemberData.apellidos_responsable"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="telefono_responsable">Teléfono del Responsable</label>
        <InputText id="telefono_responsable" v-model="editMemberData.telefono_responsable"/>
      </div>
      <div class="field col-span-1 md:col-span-1">
        <label for="parentesco_responsable">Parentesco del Responsable</label>
        <InputText id="parentesco_responsable" v-model="editMemberData.parentesco_responsable"/>
      </div>
    </div>
    <div class="flex justify-end mt-4 space-x-4">
      <Button label="Cancelar" icon="pi pi-times" severity="info"  variant="outlined" @click="showEditModal = false"/>
      <Button label="Guardar" icon="pi pi-check" severity="success" @click="updatedMember"/>
    </div>
  </Dialog>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import axiosInstance from "../../axiosConfig.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";

const club_name = ref("");
const DataClub = ref([]);
const dataIdMiembros = ref([]);
const editMemberData = ref({
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
const idUpdateMember = ref(0);
const selectedStatusInsurance = ref([]);
const showEditModal = ref(false);
const toast = useToast();
const route = useRoute();
const router = useRouter();

const columns = [
  {field: "nombres", header: "Nombres"},
  {field: "apellidos", header: "Apellidos"},
  {field: "edad", header: "Edad"},
  {field: "seguro", header: "Seguro"},
  {field: "telefono", header: "Teléfono"}
];

const fetchMiembros = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/miembros/${id}`);
    DataClub.value = response.data;
    DataClub.value.forEach((item) => {
      if (item.seguro) {
        selectedStatusInsurance.value.push(item);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const getClubId = async () => {
  try {
    const id = route.params.id;
    const response = await axiosInstance.get(`/club/${id}`);
    club_name.value = response.data.nombre;
  } catch (e) {
    console.error(e);
  }
};

const UpdateSecureState = async () => {
  if (selectedStatusInsurance.value.length === 0 || !selectedStatusInsurance.value.some(item => !item.seguro)) {
    toast.add({
      severity: 'error',
      summary: 'Mensaje de error',
      detail: 'Seleccione al menos un miembro con seguro pendiente',
      life: 3000
    });
    return;
  }

  selectedStatusInsurance.value.forEach((value) => {
    dataIdMiembros.value.push(value.id);
  });
  if (selectedStatusInsurance.value.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Mensaje de error',
      detail: 'Seleccione al menos un miembro',
      life: 3000
    });
    return;
  }
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
};
/**
 * Editar miembro
 * @param member
 * @returns {Promise<void>}
 */
const editMember = async (member) => {
  try {
    const response = await axiosInstance.get(`/miembro/${member.id}`);
    const data = response.data;
    idUpdateMember.value = data.id;
    editMemberData.value = {
      primer_nombre: data.primer_nombre,
      segundo_nombre: data.segundo_nombre,
      primer_apellido: data.primer_apellido,
      segundo_apellido: data.segundo_apellido,
      telefono: data.telefono,
      is_alergico_a: data.is_alergico_a,
      enfermedad_padese: data.enfermedad_padese,
      medicamento_receta: data.medicamento_receta,
      edad: data.edad,
      nombres_responsable: data.nombres_responsable,
      apellidos_responsable: data.apellidos_responsable,
      telefono_responsable: data.telefono_responsable,
      parentesco_responsable: data.parentesco_responsable,
      pago_seguro: data.pago_seguro
    };
    showEditModal.value = true;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Borrar miembro
 * @param member
 * @returns {Promise<void>}
 */
const deleteMember = async (member) => {
  try {
    const response = await axiosInstance.delete(`/miembro/${member.id}`);
    if (response.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Miembro eliminado con éxito',
        life: 3000
      });
      await fetchMiembros();
    }
  } catch (e) {
    console.error(e);
  }
}

const updatedMember = async () => {
  try {
    const response = await axiosInstance.put(`/miembro/${idUpdateMember.value}`, editMemberData.value);
    if (response.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Mensaje de éxito',
        detail: 'Miembro actualizado con éxito',
        life: 3000
      });
      showEditModal.value = false;
      fetchMiembros();
    }
  } catch (e) {
    console.error(e);
  }
};

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

const totalPagado = computed(() => {
  return DataClub.value.filter(member => member.seguro).length;
});

const totalPendiente = computed(() => {
  return DataClub.value.filter(member => !member.seguro).length;
});

const allInsurancesPaid = computed(() => {
  return DataClub.value.every(member => member.seguro);
});
onMounted(() => {
  fetchMiembros();
  getClubId();
});
</script>

<style>
/* TailwindCSS is used for styling */
</style>