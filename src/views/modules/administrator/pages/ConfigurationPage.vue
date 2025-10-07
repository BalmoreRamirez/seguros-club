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
              <Calendar v-model="currentPeriod.startDate" dateFormat="dd/mm/yy"
                        :showIcon="true" class="w-full" disabled />
            </div>

            <div>
              <label class="font-semibold block mb-2">Fecha de Fin</label>
              <Calendar v-model="currentPeriod.endDate" dateFormat="dd/mm/yy"
                        :showIcon="true" class="w-full" disabled />
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
          <h3 class="font-bold mb-4 text-lg">Configurar Nuevo Período</h3>

          <div class="space-y-4">
            <div>
              <label class="font-semibold block mb-2">Nueva Fecha de Inicio</label>
              <Calendar v-model="newPeriod.startDate" dateFormat="dd/mm/yy"
                        :showIcon="true" class="w-full"
                        :class="{'p-invalid': v$.startDate.$invalid && v$.startDate.$dirty}" />
              <small v-if="v$.startDate.$invalid && v$.startDate.$dirty" class="p-error block mt-1">
                La fecha de inicio es requerida
              </small>
            </div>

            <div>
              <label class="font-semibold block mb-2">Nueva Fecha de Fin</label>
              <Calendar v-model="newPeriod.endDate" dateFormat="dd/mm/yy"
                        :showIcon="true" class="w-full"
                        :minDate="newPeriod.startDate"
                        :class="{'p-invalid': v$.endDate.$invalid && v$.endDate.$dirty}" />
              <small v-if="v$.endDate.$invalid && v$.endDate.$dirty" class="p-error block mt-1">
                La fecha de fin es requerida
              </small>
              <small v-if="newPeriod.endDate && newPeriod.startDate && newPeriod.endDate <= newPeriod.startDate"
                     class="p-error block mt-1">
                La fecha de fin debe ser posterior a la fecha de inicio
              </small>
            </div>

            <div v-if="newPeriod.startDate && newPeriod.endDate" class="bg-green-50 border-l-4 border-green-500 p-3 mt-4">
              <p class="text-sm text-green-700">
                <i class="pi pi-check-circle mr-2"></i>
                Nuevo período: {{ formatPeriod(newPeriod.startDate) }} - {{ formatPeriod(newPeriod.endDate) }}
              </p>
              <p class="text-xs text-green-600 mt-2">
                Duración: {{ calculateDuration() }} días
              </p>
            </div>

            <Button
              label="Guardar Configuración"
              icon="pi pi-save"
              class="bg-customBlue-700 w-full mt-4"
              @click="saveConfiguration"
              :disabled="!isValidConfiguration"
              :loading="loading"
            />
          </div>
        </div>
      </div>

      <!-- Historial de períodos -->
      <div class="mt-8">
        <h3 class="font-bold mb-4 text-lg">
          <i class="pi pi-history mr-2"></i>Historial de Períodos
        </h3>

        <DataTable :value="periodHistory" paginator :rows="5" class="p-datatable-sm">
          <Column field="startDate" header="Fecha Inicio">
            <template #body="slotProps">
              {{ formatPeriod(slotProps.data.startDate) }}
            </template>
          </Column>
          <Column field="endDate" header="Fecha Fin">
            <template #body="slotProps">
              {{ formatPeriod(slotProps.data.endDate) }}
            </template>
          </Column>
          <Column field="duration" header="Duración">
            <template #body="slotProps">
              {{ slotProps.data.duration }} días
            </template>
          </Column>
          <Column field="status" header="Estado">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status"
                   :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </Column>
          <Column field="createdAt" header="Fecha Creación">
            <template #body="slotProps">
              {{ formatDateTime(slotProps.data.createdAt) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
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
import dayjs from 'dayjs';
import adminServices from '../services/adminServices.js';

const toast = useToast();
const loading = ref(false);

// Estado actual del período
const currentPeriod = ref({
  startDate: new Date(2024, 3, 1), // 1 de abril 2024
  endDate: new Date(2025, 2, 31), // 31 de marzo 2025
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
  if (!date) return '';
  return dayjs(date).format('DD/MM/YYYY');
};

const formatDateTime = (date) => {
  if (!date) return '';
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
    const data = {
      startDate: dayjs(newPeriod.value.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(newPeriod.value.endDate).format('YYYY-MM-DD'),
      duration: calculateDuration(),
    };

    await adminServices.saveInsurancePeriod(data);

    toast.add({
      severity: 'success',
      summary: 'Configuración Guardada',
      detail: 'El nuevo período del seguro ha sido configurado exitosamente',
      life: 3000
    });

    // Actualizar el período actual
    currentPeriod.value = {
      startDate: newPeriod.value.startDate,
      endDate: newPeriod.value.endDate,
    };

    // Limpiar el formulario
    newPeriod.value = {
      startDate: null,
      endDate: null,
    };

    v$.value.$reset();

    // Recargar historial
    await loadPeriodHistory();

  } catch (error) {
    console.error('Error al guardar configuración:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la configuración. Intente nuevamente.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const loadCurrentPeriod = async () => {
  try {
    const response = await adminServices.getCurrentInsurancePeriod();
    if (response.data) {
      currentPeriod.value = {
        startDate: new Date(response.data.startDate),
        endDate: new Date(response.data.endDate),
      };
    }
  } catch (error) {
    console.error('Error al cargar período actual:', error);
  }
};

const loadPeriodHistory = async () => {
  try {
    const response = await adminServices.getInsurancePeriodHistory();
    if (response.data) {
      periodHistory.value = response.data.map(period => ({
        ...period,
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate),
        createdAt: new Date(period.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error al cargar historial:', error);
    // Datos de ejemplo si no hay backend configurado
    periodHistory.value = [
      {
        startDate: new Date(2024, 3, 1),
        endDate: new Date(2025, 2, 31),
        duration: 365,
        status: 'Activo',
        createdAt: new Date(2024, 2, 15),
      },
      {
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2024, 2, 31),
        duration: 366,
        status: 'Finalizado',
        createdAt: new Date(2023, 2, 15),
      },
    ];
  }
};

onMounted(async () => {
  await loadCurrentPeriod();
  await loadPeriodHistory();

  // Sugerir el siguiente período automáticamente
  const nextStart = dayjs(currentPeriod.value.endDate).add(1, 'day').toDate();
  const nextEnd = dayjs(nextStart).add(1, 'year').subtract(1, 'day').toDate();

  newPeriod.value = {
    startDate: nextStart,
    endDate: nextEnd,
  };
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
</style>

