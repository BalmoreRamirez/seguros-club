<template>
          <div class="container mx-auto p-4">
            <!-- Mensaje de bienvenida -->
            <div v-if="!loading && !error" class="welcome-message mb-8">
              <h2 class="text-3xl font-bold text-customBlack-500">
                <span v-if="id_role === 1">Bienvenido Administrador</span>
                <span v-else-if="id_role === 2 && clubName">Bienvenido, {{ clubName }}</span>
              </h2>
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
              <div v-if="noDataAvailable" class="alert-message p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <p class="font-bold">¡No hay datos disponibles!</p>
                <p>Para ver estadísticas reales de su club, necesita actualizar la información de tipo en los miembros registrados.</p>
                <p class="mt-2">Diríjase a la sección de Mi club y edita la información de los miembros para asignarles sus categorías correspondientes.</p>
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
        import { ref, onMounted, computed } from 'vue';
        import dashboardService from '../services/dashboardService.js';
        import { user_id, id_role } from '../utils/auth.js';
        import adminServices from '../views/modules/administrator/services/adminServices.js';

        const dashboardData = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const clubName = ref('');

        const pastelColors = ['bg-pastelPink-500', 'bg-pastelGreen-500', 'bg-pastelYellow-500', 'bg-pastelPurple-500'];

        // Comprobamos si no hay datos disponibles (todos los totales son 0)
        const noDataAvailable = computed(() => {
          if (!dashboardData.value.length) return true;

          return dashboardData.value.every(item =>
            (item.total || 0) === 0
          );
        });

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

            // Procesamos las estadísticas (asegurando valores por defecto)
            const estadisticas = response.data.estadisticas || {
              aventurero: { total: 0, sinSeguro: 0, conSeguro: 0 },
              conquistador: { total: 0, sinSeguro: 0, conSeguro: 0 },
              guiaMayor: { total: 0, sinSeguro: 0, conSeguro: 0 },
              ja: { total: 0, sinSeguro: 0, conSeguro: 0 }
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