<template>
  <div class="container mx-auto p-4">
    <!-- Mensaje de bienvenida -->
    <div v-if="!loading && !error" class="welcome-message mb-8">
      <h2 class="text-3xl font-bold text-customBlack-500 flex justify-center flex-col">
        <span v-if="id_role === 1">Bienvenido Administrador</span>
        <span v-else-if="id_role === 2 && clubName">Bienvenido, {{ clubName }}</span>
        <p>Este seguro vence el <span class="text-yellow-700 font-bold">{{ fechaFin }}</span></p>
      </h2>
    </div>

    <div v-if="id_role === 2 && !clubName"
         class="alert-message p-4 mb-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
      <p class="font-bold">¡Bienvenido, Director!</p>
      <p>No tienes un club asignado aún. Para comenzar, dirígete a la sección "Mi Club" para registrar la información de
        tu club.</p>
    </div>
    <div v-if="loading" class="text-center">
      <i class="pi pi-spin pi-spinner text-3xl"></i>
      <p>Cargando datos...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    <div v-else>
      <!-- Mensaje de alerta cuando no hay datos -->
      <div v-if="noDataAvailable"
           class="alert-message p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p class="font-bold">¡No hay datos disponibles!</p>
        <p>Para ver estadísticas reales de su club, necesita actualizar la información de tipo en los miembros
          registrados.</p>
        <p class="mt-2">Diríjase a la sección de Mi club y edita la información de los miembros para asignarles sus
          categorías correspondientes.</p>
      </div>

      <!-- Tarjeta de resumen general -->
      <div class="mb-8">
        <div class="card general-summary">
          <div class="flex justify-content-between align-items-center mb-4">
            <div class="icon-container bg-pastelBlue-500">
              <i class="pi pi-chart-bar text-customBlack-500"></i>
            </div>
            <h2 class="text-2xl font-bold text-customBlack-600">Resumen General</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="summary-item">
              <span class="summary-label">Total Miembros</span>
              <span class="summary-value">{{ totalMiembros }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Con Seguro</span>
              <span class="summary-value text-green-600">{{ totalConSeguro }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Sin Seguro</span>
              <span class="summary-value text-red-600">{{ totalSinSeguro }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="font-medium">Porcentaje asegurado:</span>
              <div class="relative w-2/3 h-6 bg-gray-200 rounded-full">
                <div class="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                     :style="{ width: porcentajeAsegurado + '%', backgroundColor: getPorcentajeColor(porcentajeAsegurado) }">
                </div>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-bold">{{
                    porcentajeAsegurado
                  }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(item, index) in dashboardData" :key="index" class="card">
          <div :class="['icon-container', pastelColors[index % pastelColors.length]]">
            <i class="pi pi-users text-customBlack-500"></i>
          </div>
          <h3 class="text-primaryText-500">{{ item.title }}</h3>
          <p class="text-secondaryText-500">Total: {{ item.total || 0 }}</p>
          <p class="text-secondaryText-500">Sin Seguro: {{ item.sinSeguro || 0 }}</p>
          <p class="text-secondaryText-500">Con Seguro: {{ item.conSeguro || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import dashboardService from '../services/dashboardService.js';
import {user_id, id_role} from '../utils/auth.js';
import adminServices from '../views/modules/administrator/services/adminServices.js';
import dayjs from "dayjs";

const dashboardData = ref([]);
const loading = ref(true);
const error = ref(null);
const clubName = ref('');
const fechaFin = ref();
const pastelColors = ['bg-pastelPink-500', 'bg-pastelGreen-500', 'bg-pastelYellow-500', 'bg-pastelPurple-500'];

// Comprobamos si no hay datos disponibles (todos los totales son 0)
const noDataAvailable = computed(() => {
  if (!dashboardData.value.length) return true;

  return dashboardData.value.every(item =>
      (item.total || 0) === 0
  );
});

// Cálculo de totales para la card general
const totalMiembros = computed(() => {
  return dashboardData.value.reduce((sum, item) => sum + (item.total || 0), 0);
});

const totalConSeguro = computed(() => {
  return dashboardData.value.reduce((sum, item) => sum + (item.conSeguro || 0), 0);
});

const totalSinSeguro = computed(() => {
  return dashboardData.value.reduce((sum, item) => sum + (item.sinSeguro || 0), 0);
});

const porcentajeAsegurado = computed(() => {
  if (totalMiembros.value === 0) return 0;
  return Math.round((totalConSeguro.value / totalMiembros.value) * 100);
});

// Función para obtener el color de la barra de progreso según el porcentaje
const getPorcentajeColor = (porcentaje) => {
  if (porcentaje >= 80) return '#34D399'; // Verde para porcentaje alto
  if (porcentaje >= 50) return '#FBBF24'; // Amarillo para porcentaje medio
  return '#EF4444'; // Rojo para porcentaje bajo
};

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;

    let response;

    // Director: obtener datos de su club específico
    if (id_role.value === 2) {
      // Primero obtenemos información del club asociado al director
      const clubInfo = await adminServices.ListClubes(id_role.value, user_id.value);

      if (clubInfo.data && clubInfo.data.length > 0) {
        const id_club = clubInfo.data[0].id;
        clubName.value = clubInfo.data[0].nombre; // Guardar el nombre del club
        response = await dashboardService.reportByClub(id_club);
      } else {
        response = {
          data: {
            estadisticas: {
              aventurero: {total: 0, sinSeguro: 0, conSeguro: 0},
              conquistador: {total: 0, sinSeguro: 0, conSeguro: 0},
              guiaMayor: {total: 0, sinSeguro: 0, conSeguro: 0},
              ja: {total: 0, sinSeguro: 0, conSeguro: 0},
              consejero: {total: 0, sinSeguro: 0, conSeguro: 0},
            }
          }
        };
      }
    }
    // Administrador: obtener datos generales
    else if (id_role.value === 1) {
      response = await dashboardService.reportByClubAll();
      fechaFin.value = response.data.fechaFinalizacion;
    } else {
      throw new Error("Rol no autorizado");
    }

    // Procesamos las estadísticas (asegurando valores por defecto)
    const estadisticas = response.data.estadisticas || {
      aventurero: {total: 0, sinSeguro: 0, conSeguro: 0},
      conquistador: {total: 0, sinSeguro: 0, conSeguro: 0},
      guiaMayor: {total: 0, sinSeguro: 0, conSeguro: 0},
      ja: {total: 0, sinSeguro: 0, conSeguro: 0},
      consejero: {total: 0, sinSeguro: 0, conSeguro: 0},
    };

    // Transformamos los datos al formato requerido por la UI
    dashboardData.value = [
      {
        title: 'Total de Aventureros',
        total: estadisticas.aventurero?.total || 0,
        sinSeguro: estadisticas.aventurero?.sinSeguro || 0,
        conSeguro: estadisticas.aventurero?.conSeguro || 0
      },
      {
        title: 'Total de Conquistadores',
        total: estadisticas.conquistador?.total || 0,
        sinSeguro: estadisticas.conquistador?.sinSeguro || 0,
        conSeguro: estadisticas.conquistador?.conSeguro || 0
      },
      {
        title: 'Total de Guías Mayores',
        total: estadisticas.guiaMayor?.total || 0,
        sinSeguro: estadisticas.guiaMayor?.sinSeguro || 0,
        conSeguro: estadisticas.guiaMayor?.conSeguro || 0
      },
      {
        title: 'Total de JA',
        total: estadisticas.ja?.total || 0,
        sinSeguro: estadisticas.ja?.sinSeguro || 0,
        conSeguro: estadisticas.ja?.conSeguro || 0
      },
      {
        title: 'Total de Consejeros',
        total: estadisticas.consejero?.total || 0,
        sinSeguro: estadisticas.consejero?.sinSeguro || 0,
        conSeguro: estadisticas.consejero?.conSeguro || 0
      }
    ];
  } catch (err) {
    console.error('Error al cargar datos del dashboard:', err);
    error.value = "Error al cargar los datos. Por favor, intenta nuevamente.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}

.welcome-message {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #eaeaea;
}

.alert-message {
  text-align: left;
  border-radius: 6px;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.general-summary {
  text-align: left;
  padding: 1.5rem 2rem;
  background: linear-gradient(to right, #f9fafb, #f3f4f6);
}

.general-summary:hover {
  transform: none;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
}

.general-summary .icon-container {
  margin: 0;
}

.card i {
  font-size: 2.5rem;
  color: #334155; /* Darker color for better contrast */
}

.card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.card p {
  margin: 0.5rem 0;
}

.bg-pastelBlue-500 {
  background-color: #bfdbfe;
}
</style>