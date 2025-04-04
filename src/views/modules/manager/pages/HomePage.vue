<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center">
      <i class="pi pi-spin pi-spinner text-3xl"></i>
      <p>Cargando datos...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, index) in dashboardData" :key="index" class="card">
        <div :class="['icon-container', pastelColors[index % pastelColors.length]]">
          <i class="pi pi-users text-customBlack-500"></i>
        </div>
        <h3 class="text-primaryText-500">{{ item.title }}</h3>
        <p class="text-secondaryText-500">Total: {{ item.total }}</p>
        <p class="text-secondaryText-500">Sin Seguro: {{ item.sinSeguro }}</p>
        <p class="text-secondaryText-500">Con Seguro: {{ item.conSeguro }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dashboardService from '../../../../services/dashboardService.js';
import { user_id, id_role } from '../../../../utils/auth.js';
import adminServices from '../../administrator/services/adminServices.js';

const dashboardData = ref([]);
const loading = ref(true);
const error = ref(null);

const pastelColors = ['bg-pastelPink-500', 'bg-pastelGreen-500', 'bg-pastelYellow-500', 'bg-pastelPurple-500'];

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
        const id_club = clubInfo.data[0].id_club;
        response = await dashboardService.reportByClub(id_club);
      } else {
        throw new Error("No se encontró información del club");
      }
    }
    // Administrador: obtener datos generales
    else if (id_role.value === 1) {
      response = await dashboardService.reportByClubAll();
    }
    else {
      throw new Error("Rol no autorizado");
    }

    // Procesamos las estadísticas
    const estadisticas = response.data.estadisticas;

    // Transformamos los datos al formato requerido por la UI
    dashboardData.value = [
      {
        title: 'Total de Aventureros',
        total: estadisticas.aventurero.total,
        sinSeguro: estadisticas.aventurero.sinSeguro,
        conSeguro: estadisticas.aventurero.conSeguro
      },
      {
        title: 'Total de Conquistadores',
        total: estadisticas.conquistador.total,
        sinSeguro: estadisticas.conquistador.sinSeguro,
        conSeguro: estadisticas.conquistador.conSeguro
      },
      {
        title: 'Total de Guías Mayores',
        total: estadisticas.guiaMayor.total,
        sinSeguro: estadisticas.guiaMayor.sinSeguro,
        conSeguro: estadisticas.guiaMayor.conSeguro
      },
      {
        title: 'Total de JA',
        total: estadisticas.ja.total,
        sinSeguro: estadisticas.ja.sinSeguro,
        conSeguro: estadisticas.ja.conSeguro
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

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
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
</style>