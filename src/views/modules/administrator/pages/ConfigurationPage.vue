<template>
  <div class="space-y-10">
    <div class="flex justify-between items-center mt-5">
      <h1 class="text-2xl font-bold uppercase text-customBlack-500">
        Configuración del Sistema
      </h1>
    </div>

    <div class="card p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6 text-customBlack-500">
        <i class="pi pi-calendar mr-2"></i>Período del Seguro
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Configuración del período actual -->
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-bold mb-4 text-lg">Período Actual</h3>

          <div class="space-y-4">
            <div>
              <label class="font-semibold block mb-2">Fecha de Inicio</label>
              <Calendar v-model="currentPeriod.startDate" dateFormat="dd/mm/yy" :showIcon="true" class="w-full"
                disabled />
            </div>

            <div>
              <label class="font-semibold block mb-2">Fecha de Fin</label>
              <Calendar v-model="currentPeriod.endDate" dateFormat="dd/mm/yy" :showIcon="true" class="w-full"
                disabled />
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mt-4">
              <p class="text-sm text-blue-700">
                <i class="pi pi-info-circle mr-2"></i>
                Período actual: {{ formatPeriod(currentPeriod.startDate) }} - {{ formatPeriod(currentPeriod.endDate) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Configuración del nuevo período -->
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-bold mb-4 text-lg">{{ editingPeriod ? 'Editar Período' : 'Configurar Nuevo Período' }}</h3>

          <div class="space-y-4">
            <div>
              <label class="font-semibold block mb-2">Nueva Fecha de Inicio</label>
              <Calendar v-model="newPeriod.startDate" dateFormat="dd/mm/yy" :showIcon="true" class="w-full"
                :class="{ 'p-invalid': v$.startDate.$invalid && v$.startDate.$dirty }" />
              <small v-if="v$.startDate.$invalid && v$.startDate.$dirty" class="p-error block mt-1">
                La fecha de inicio es requerida
              </small>
            </div>

            <div>
              <label class="font-semibold block mb-2">Nueva Fecha de Fin</label>
              <Calendar v-model="newPeriod.endDate" dateFormat="dd/mm/yy" :showIcon="true" class="w-full"
                :minDate="newPeriod.startDate" :class="{ 'p-invalid': v$.endDate.$invalid && v$.endDate.$dirty }" />
              <small v-if="v$.endDate.$invalid && v$.endDate.$dirty" class="p-error block mt-1">
                La fecha de fin es requerida
              </small>
              <small v-if="newPeriod.endDate && newPeriod.startDate && newPeriod.endDate <= newPeriod.startDate"
                class="p-error block mt-1">
                La fecha de fin debe ser posterior a la fecha de inicio
              </small>
            </div>

            <div v-if="newPeriod.startDate && newPeriod.endDate"
              class="bg-green-50 border-l-4 border-green-500 p-3 mt-4">
              <p class="text-sm text-green-700">
                <i class="pi pi-check-circle mr-2"></i>
                Nuevo período: {{ formatPeriod(newPeriod.startDate) }} - {{ formatPeriod(newPeriod.endDate) }}
              </p>
              <p class="text-xs text-green-600 mt-2">
                Duración: {{ calculateDuration() }} días
              </p>
            </div>

            <div class="flex gap-2">
              <Button :label="editingPeriod ? 'Actualizar' : 'Guardar Configuración'" icon="pi pi-save"
                class="bg-customBlue-700 flex-1" @click="editingPeriod ? updateConfiguration() : saveConfiguration()"
                :disabled="!isValidConfiguration" :loading="loading" />
              <Button v-if="editingPeriod" label="Cancelar" icon="pi pi-times" class="p-button-secondary"
                @click="cancelEdit" />
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de períodos -->
      <div class="mt-8">
        <h3 class="font-bold mb-4 text-lg">
          <i class="pi pi-history mr-2"></i>Historial de Períodos
        </h3>

        <DataTable :value="periodHistory" paginator :rows="5" class="p-datatable-sm" :loading="loadingTable">
          <template #empty>
            <div class="text-center py-4">
              <i class="pi pi-inbox text-4xl text-gray-400"></i>
              <p class="text-gray-500 mt-2">No hay períodos registrados</p>
            </div>
          </template>

          <Column field="startDate" header="Fecha Inicio" sortable>
            <template #body="slotProps">
              {{ formatPeriod(slotProps.data.start_date || slotProps.data.startDate) }}
            </template>
          </Column>
          <Column field="endDate" header="Fecha Fin" sortable>
            <template #body="slotProps">
              {{ formatPeriod(slotProps.data.end_date || slotProps.data.endDate) }}
            </template>
          </Column>
          <Column field="duration" header="Duración" sortable>
            <template #body="slotProps">
              {{ slotProps.data.duration }} días
            </template>
          </Column>
          <Column field="status" header="Estado" sortable>
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </Column>
          <Column field="createdAt" header="Fecha Creación" sortable>
            <template #body="slotProps">
              {{ formatDateTime(slotProps.data.created_at || slotProps.data.createdAt) }}
            </template>
          </Column>
          <Column header="Acciones" style="width: 150px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning p-button-sm"
                  @click="editPeriod(slotProps.data)" v-tooltip.top="'Editar'"
                  :disabled="slotProps.data.status === 'Finalizado'" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm"
                  @click="confirmDeletePeriod(slotProps.data)" v-tooltip.top="'Eliminar'"
                  :disabled="slotProps.data.status === 'Activo'" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Dialog de confirmación para eliminar -->
    <Dialog v-model:visible="deleteDialog" header="Confirmar Eliminación" :modal="true" class="w-[90vw] md:w-[30vw]">
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
        <span>¿Está seguro de eliminar este período?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
        <Button label="Eliminar" icon="pi pi-check" class="p-button-danger" @click="deletePeriod" :loading="deleting" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Tooltip from 'primevue/tooltip';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import adminServices from '../services/adminServices.js';

// Extender dayjs con plugins necesarios
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const toast = useToast();
const loading = ref(false);
const loadingTable = ref(false);
const deleting = ref(false);
const deleteDialog = ref(false);
const editingPeriod = ref(null);
const periodToDelete = ref(null);

// Estado actual del período
const currentPeriod = ref({
  startDate: null,
  endDate: null,
});

// Nuevo período a configurar
const newPeriod = ref({
  startDate: null,
  endDate: null,
});

// Historial de períodos
const periodHistory = ref([]);

// Validaciones
const rules = {
  startDate: { required },
  endDate: { required },
};

const v$ = useVuelidate(rules, newPeriod);

// Computed
const isValidConfiguration = computed(() => {
  return newPeriod.value.startDate &&
    newPeriod.value.endDate &&
    newPeriod.value.endDate > newPeriod.value.startDate &&
    !v$.value.$invalid;
});

// Métodos
const formatPeriod = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('DD/MM/YYYY');
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const calculateDuration = () => {
  if (!newPeriod.value.startDate || !newPeriod.value.endDate) return 0;
  const start = dayjs(newPeriod.value.startDate);
  const end = dayjs(newPeriod.value.endDate);
  return end.diff(start, 'day') + 1;
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Activo':
      return 'success';
    case 'Finalizado':
      return 'secondary';
    case 'Próximo':
      return 'info';
    default:
      return 'warning';
  }
};

const saveConfiguration = async () => {
  v$.value.$touch();

  if (v$.value.$invalid) {
    toast.add({
      severity: 'warn',
      summary: 'Validación',
      detail: 'Por favor complete todos los campos correctamente',
      life: 3000
    });
    return;
  }

  if (!newPeriod.value.startDate || !newPeriod.value.endDate) {
    toast.add({
      severity: 'warn',
      summary: 'Validación',
      detail: 'Por favor seleccione las fechas de inicio y fin',
      life: 3000
    });
    return;
  }

  if (newPeriod.value.endDate <= newPeriod.value.startDate) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'La fecha de fin debe ser posterior a la fecha de inicio',
      life: 3000
    });
    return;
  }

  loading.value = true;

  try {
    // Determinar el estado basado en las fechas
    const today = dayjs();
    const startDate = dayjs(newPeriod.value.startDate);
    const endDate = dayjs(newPeriod.value.endDate);

    let status = 'Próximo';
    if (today.isSameOrAfter(startDate, 'day') && today.isSameOrBefore(endDate, 'day')) {
      status = 'Activo';
    } else if (today.isAfter(endDate, 'day')) {
      status = 'Finalizado';
    }

    const data = {
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      status: status,
      created_by: 1
    };

    console.log('Guardando período:', data);
    const response = await adminServices.saveInsurancePeriod(data);
    console.log('Respuesta del servidor:', response);

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'El nuevo período del seguro ha sido configurado exitosamente',
      life: 3000
    });

    // Limpiar el formulario
    newPeriod.value = {
      startDate: null,
      endDate: null,
    };

    v$.value.$reset();

    // Recargar datos
    await loadPeriodHistory();
    await loadCurrentPeriod();

  } catch (error) {
    console.error('Error al guardar configuración:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo guardar la configuración. Intente nuevamente.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const updateConfiguration = async () => {
  v$.value.$touch();

  if (v$.value.$invalid || !editingPeriod.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validación',
      detail: 'Por favor complete todos los campos correctamente',
      life: 3000
    });
    return;
  }

  if (newPeriod.value.endDate <= newPeriod.value.startDate) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'La fecha de fin debe ser posterior a la fecha de inicio',
      life: 3000
    });
    return;
  }

  loading.value = true;

  try {
    // Determinar el estado basado en las fechas
    const today = dayjs();
    const startDate = dayjs(newPeriod.value.startDate);
    const endDate = dayjs(newPeriod.value.endDate);

    let status = 'Próximo';
    if (today.isSameOrAfter(startDate, 'day') && today.isSameOrBefore(endDate, 'day')) {
      status = 'Activo';
    } else if (today.isAfter(endDate, 'day')) {
      status = 'Finalizado';
    }

    const data = {
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      status: status,
      created_by: 1
    };

    await adminServices.updateInsurancePeriod(editingPeriod.value.id, data);

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'El período ha sido actualizado exitosamente',
      life: 3000
    });

    cancelEdit();
    await loadCurrentPeriod();
    await loadPeriodHistory();

  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo actualizar la configuración. Intente nuevamente.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const editPeriod = (period) => {
  editingPeriod.value = period;
  newPeriod.value = {
    startDate: dayjs(period.start_date || period.startDate).toDate(),
    endDate: dayjs(period.end_date || period.endDate).toDate(),
  };
};

const cancelEdit = () => {
  editingPeriod.value = null;
  newPeriod.value = {
    startDate: null,
    endDate: null,
  };
  v$.value.$reset();

  // Sugerir el siguiente período automáticamente
  if (currentPeriod.value.endDate) {
    const nextStart = dayjs(currentPeriod.value.endDate).add(1, 'day').toDate();
    const nextEnd = dayjs(nextStart).add(1, 'year').subtract(1, 'day').toDate();

    newPeriod.value = {
      startDate: nextStart,
      endDate: nextEnd,
    };
  }
};

const confirmDeletePeriod = (period) => {
  periodToDelete.value = period;
  deleteDialog.value = true;
};

const deletePeriod = async () => {
  if (!periodToDelete.value) return;

  deleting.value = true;

  try {
    await adminServices.deleteInsurancePeriod(periodToDelete.value.id);

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'El período ha sido eliminado exitosamente',
      life: 3000
    });

    deleteDialog.value = false;
    periodToDelete.value = null;

    await loadCurrentPeriod();
    await loadPeriodHistory();

  } catch (error) {
    console.error('Error al eliminar período:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo eliminar el período. Intente nuevamente.',
      life: 3000
    });
  } finally {
    deleting.value = false;
  }
};

const loadCurrentPeriod = async () => {
  try {
    // Cargar el historial si aún no está cargado
    if (periodHistory.value.length === 0) {
      await loadPeriodHistory();
    }
    
    // Buscar el período con estado 'Activo'
    const activePeriod = periodHistory.value.find(period => period.status === 'Activo');
    
    if (activePeriod) {
      currentPeriod.value = {
        startDate: dayjs(activePeriod.start_date || activePeriod.startDate).toDate(),
        endDate: dayjs(activePeriod.end_date || activePeriod.endDate).toDate(),
      };
    } else {
      // Si no hay período activo, dejar vacío o con valores por defecto
      currentPeriod.value = {
        startDate: null,
        endDate: null,
      };
    }
  } catch (error) {
    console.warn('Error al cargar el período actual:', error);
    currentPeriod.value = {
      startDate: null,
      endDate: null,
    };
  }
};

const loadPeriodHistory = async () => {
  loadingTable.value = true;
  try {
    const response = await adminServices.getInsurancePeriodHistory();
    if (response.data) {
      periodHistory.value = Array.isArray(response.data) ? response.data : [];
    }
  } catch (error) {
    console.warn('El endpoint de historial no está disponible. Tabla vacía.');
    periodHistory.value = [];
    // No mostrar toast de error cuando el backend no está listo
  } finally {
    loadingTable.value = false;
  }
};

onMounted(async () => {
  // Primero cargar el historial
  await loadPeriodHistory();
  // Luego cargar el período actual (que busca en el historial)
  await loadCurrentPeriod();

  // Sugerir el siguiente período automáticamente
  if (currentPeriod.value.endDate) {
    const nextStart = dayjs(currentPeriod.value.endDate).add(1, 'day').toDate();
    const nextEnd = dayjs(nextStart).add(1, 'year').subtract(1, 'day').toDate();

    newPeriod.value = {
      startDate: nextStart,
      endDate: nextEnd,
    };
  }
});
</script>

<style scoped>
.p-calendar {
  width: 100%;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f3f4f6;
  color: #1f2937;
  font-weight: 600;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger) {
  background-color: #1e40af;
  border-color: #1e40af;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger:hover) {
  background-color: #1e3a8a;
  border-color: #1e3a8a;
}

:deep(.p-button-danger) {
  background-color: #dc2626;
  border-color: #dc2626;
}

:deep(.p-button-danger:hover) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}
</style>
