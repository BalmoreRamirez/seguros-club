<template>
  <Card>
    <template #title>Historial de seguros</template>
    <template #content>
      <div class="card flex flex-col gap-4">
        <div class="flex justify-between">

          <Dropdown v-model="selectedYear" :options="years" optionLabel="name" placeholder="Seleccionar Año"
                    class="w-full md:w-14rem" @change="loadHistoricalData"/>
          <Button icon="pi pi-file-pdf"
                  tooltip="Exportar a PDF"
                  class="p-button-danger"
                  :disabled="!selectedYear || loading || historicalData.length === 0"
                  @click="exportToPdf"/>

        </div>

        <div v-if="loading" class="flex justify-content-center">
          <ProgressSpinner style="width:50px;height:50px"/>
        </div>

        <div v-else-if="!selectedYear" class="flex justify-content-center p-4 text-customBlack-400">
          Seleccione un año para ver el historial de seguros
        </div>

        <div v-else>
          <DataTable :value="historicalData" stripedRows paginator :rows="10"
                     :rowsPerPageOptions="[5, 10, 25, 50]" tableStyle="min-width: 50rem"
                     ref="dataTable">
            <Column field="id" header="ID" sortable></Column>
            <Column field="clubNombre" header="Club" sortable></Column>
            <Column field="distrito" header="Distrito" sortable></Column>
            <Column field="zona" header="Zona" sortable></Column>
            <Column field="totalMiembros" header="Total Miembros" sortable>
              <template #body="{ data }">
                {{ data.totalMiembros }}
              </template>
            </Column>
            <Column field="segurosActivos" header="Seguros Activos" sortable>
              <template #body="{ data }">
                <span :class="getColorClass(data.segurosActivos, data.totalMiembros)">
                  {{ data.segurosActivos }}
                </span>
              </template>
            </Column>
            <Column field="porcentaje" header="% Asegurados" sortable>
              <template #body="{ data }">
                <span :class="getColorClass(data.segurosActivos, data.totalMiembros)">
                  {{ calcularPorcentaje(data.segurosActivos, data.totalMiembros) }}%
                </span>
              </template>
            </Column>
            <Column field="ultimaActualizacion" header="Última Actualización" sortable>
              <template #body="{ data }">
                {{ formatDate(data.ultimaActualizacion) }}
              </template>
            </Column>
          </DataTable>

          <div class="flex justify-content-between mt-4">
            <div class="text-customBlack-500">
              <h3>Resumen del año {{ selectedYear.name }}</h3>
              <p>Total de clubes: {{ historicalData.length }}</p>
              <p>Total de miembros: {{ getTotalMiembros() }}</p>
              <p>Total de seguros activos: {{ getTotalSeguros() }}</p>
              <p>Porcentaje global de asegurados: {{ calcularPorcentaje(getTotalSeguros(), getTotalMiembros()) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {useToast} from "primevue/usetoast";

const toast = useToast();
const dataTable = ref(null);
const selectedYear = ref();
const years = ref([
  {name: '2021', code: '1'},
  {name: '2022', code: '2'},
  {name: '2023', code: '3'},
  {name: '2024', code: '4'},
]);

const loading = ref(false);
const historicalData = ref([]);

// Datos mock por año
const mockData = {
  '2021': [
    {
      id: 1,
      clubNombre: "Conquistadores del Este",
      distrito: "Oriental",
      zona: "Este",
      totalMiembros: 25,
      segurosActivos: 18,
      ultimaActualizacion: "2021-12-15T10:30:00"
    },
    {
      id: 2,
      clubNombre: "Leones del Norte",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 32,
      segurosActivos: 20,
      ultimaActualizacion: "2021-11-20T14:45:00"
    },
    {
      id: 3,
      clubNombre: "Águilas Reales",
      distrito: "Occidental",
      zona: "Oeste",
      totalMiembros: 18,
      segurosActivos: 15,
      ultimaActualizacion: "2021-12-01T09:15:00"
    },
    {
      id: 4,
      clubNombre: "Guardianes del Sur",
      distrito: "Sur",
      zona: "Sur",
      totalMiembros: 22,
      segurosActivos: 12,
      ultimaActualizacion: "2021-10-25T16:20:00"
    },
    {
      id: 5,
      clubNombre: "Centinelas",
      distrito: "Central",
      zona: "Centro",
      totalMiembros: 28,
      segurosActivos: 25,
      ultimaActualizacion: "2021-12-10T11:45:00"
    }
  ],
  '2022': [
    {
      id: 1,
      clubNombre: "Conquistadores del Este",
      distrito: "Oriental",
      zona: "Este",
      totalMiembros: 28,
      segurosActivos: 22,
      ultimaActualizacion: "2022-12-12T10:30:00"
    },
    {
      id: 2,
      clubNombre: "Leones del Norte",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 35,
      segurosActivos: 28,
      ultimaActualizacion: "2022-11-15T14:45:00"
    },
    {
      id: 3,
      clubNombre: "Águilas Reales",
      distrito: "Occidental",
      zona: "Oeste",
      totalMiembros: 20,
      segurosActivos: 18,
      ultimaActualizacion: "2022-12-05T09:15:00"
    },
    {
      id: 4,
      clubNombre: "Guardianes del Sur",
      distrito: "Sur",
      zona: "Sur",
      totalMiembros: 24,
      segurosActivos: 18,
      ultimaActualizacion: "2022-10-20T16:20:00"
    },
    {
      id: 5,
      clubNombre: "Centinelas",
      distrito: "Central",
      zona: "Centro",
      totalMiembros: 30,
      segurosActivos: 27,
      ultimaActualizacion: "2022-12-08T11:45:00"
    },
    {
      id: 6,
      clubNombre: "Estrellas del Camino",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 26,
      segurosActivos: 20,
      ultimaActualizacion: "2022-11-30T13:10:00"
    }
  ],
  '2023': [
    {
      id: 1,
      clubNombre: "Conquistadores del Este",
      distrito: "Oriental",
      zona: "Este",
      totalMiembros: 32,
      segurosActivos: 28,
      ultimaActualizacion: "2023-12-10T10:30:00"
    },
    {
      id: 2,
      clubNombre: "Leones del Norte",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 38,
      segurosActivos: 32,
      ultimaActualizacion: "2023-11-12T14:45:00"
    },
    {
      id: 3,
      clubNombre: "Águilas Reales",
      distrito: "Occidental",
      zona: "Oeste",
      totalMiembros: 24,
      segurosActivos: 20,
      ultimaActualizacion: "2023-12-03T09:15:00"
    },
    {
      id: 4,
      clubNombre: "Guardianes del Sur",
      distrito: "Sur",
      zona: "Sur",
      totalMiembros: 26,
      segurosActivos: 22,
      ultimaActualizacion: "2023-10-18T16:20:00"
    },
    {
      id: 5,
      clubNombre: "Centinelas",
      distrito: "Central",
      zona: "Centro",
      totalMiembros: 33,
      segurosActivos: 29,
      ultimaActualizacion: "2023-12-05T11:45:00"
    },
    {
      id: 6,
      clubNombre: "Estrellas del Camino",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 29,
      segurosActivos: 25,
      ultimaActualizacion: "2023-11-25T13:10:00"
    },
    {
      id: 7,
      clubNombre: "Exploradores Valientes",
      distrito: "Occidental",
      zona: "Oeste",
      totalMiembros: 22,
      segurosActivos: 18,
      ultimaActualizacion: "2023-11-02T15:30:00"
    },
    {
      id: 8,
      clubNombre: "Halcones del Cielo",
      distrito: "Oriental",
      zona: "Este",
      totalMiembros: 27,
      segurosActivos: 24,
      ultimaActualizacion: "2023-12-01T08:45:00"
    }
  ],
  '2024': [
    {
      id: 1,
      clubNombre: "Conquistadores del Este",
      distrito: "Oriental",
      zona: "Este",
      totalMiembros: 35,
      segurosActivos: 32,
      ultimaActualizacion: "2024-06-05T10:30:00"
    },
    {
      id: 2,
      clubNombre: "Leones del Norte",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 40,
      segurosActivos: 36,
      ultimaActualizacion: "2024-05-20T14:45:00"
    },
    {
      id: 3,
      clubNombre: "Águilas Reales",
      distrito: "Occidental",
      zona: "Oeste",
      totalMiembros: 28,
      segurosActivos: 23,
      ultimaActualizacion: "2024-06-02T09:15:00"
    },
    {
      id: 4,
      clubNombre: "Guardianes del Sur",
      distrito: "Sur",
      zona: "Sur",
      totalMiembros: 30,
      segurosActivos: 25,
      ultimaActualizacion: "2024-05-15T16:20:00"
    },
    {
      id: 5,
      clubNombre: "Centinelas",
      distrito: "Central",
      zona: "Centro",
      totalMiembros: 36,
      segurosActivos: 33,
      ultimaActualizacion: "2024-06-01T11:45:00"
    },
    {
      id: 6,
      clubNombre: "Estrellas del Camino",
      distrito: "Norte",
      zona: "Norte",
      totalMiembros: 33,
      segurosActivos: 28,
      ultimaActualizacion: "2024-05-25T13:10:00"
    },
    {
      id: 7,
      clubNombre: "Exploradores Valientes",
      distrito: "Occidental",
      zona: "Oeste",
      totalMiembros: 25,
      segurosActivos: 22,
      ultimaActualizacion: "2024-05-18T15:30:00"
    },
    {
      id: 8,
      clubNombre: "Halcones del Cielo",
      distrito: "Oriental",
      zona: "Este",
      totalMiembros: 30,
      segurosActivos: 27,
      ultimaActualizacion: "2024-05-30T08:45:00"
    },
    {
      id: 9,
      clubNombre: "Pioneros del Futuro",
      distrito: "Central",
      zona: "Centro",
      totalMiembros: 27,
      segurosActivos: 24,
      ultimaActualizacion: "2024-06-03T12:15:00"
    },
    {
      id: 10,
      clubNombre: "Guías del Amanecer",
      distrito: "Sur",
      zona: "Sur",
      totalMiembros: 32,
      segurosActivos: 29,
      ultimaActualizacion: "2024-05-22T09:40:00"
    }
  ]
};

// Función para exportar a PDF
const exportToPdf = () => {
  if (!selectedYear.value || historicalData.value.length === 0) return;

  try {
    const doc = new jsPDF('landscape');

    // Título y fecha
    const reportTitle = `Historial de Seguros - Año ${selectedYear.value.name}`;
    const currentDate = new Date().toLocaleDateString('es-ES');

    doc.setFontSize(18);
    doc.text(reportTitle, 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${currentDate}`, 14, 30);

    // Crear tabla
    const tableColumn = ["Club", "Distrito", "Zona", "Total Miembros", "Seguros Activos", "% Asegurados", "Última Actualización"];

    // Datos para la tabla
    const tableRows = historicalData.value.map(item => [
      item.clubNombre,
      item.distrito,
      item.zona,
      item.totalMiembros,
      item.segurosActivos,
      `${calcularPorcentaje(item.segurosActivos, item.totalMiembros)}%`,
      formatDate(item.ultimaActualizacion)
    ]);

    // Crear tabla
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [200, 200, 200]
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      }
    });

    // Añadir resumen
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Resumen del año ${selectedYear.value.name}`, 14, finalY);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de clubes: ${historicalData.value.length}`, 14, finalY + 8);
    doc.text(`Total de miembros: ${getTotalMiembros()}`, 14, finalY + 16);
    doc.text(`Total de seguros activos: ${getTotalSeguros()}`, 14, finalY + 24);
    doc.text(`Porcentaje global de asegurados: ${calcularPorcentaje(getTotalSeguros(), getTotalMiembros())}%`, 14, finalY + 32);

    // Guardar PDF
    doc.save(`historial-seguros-${selectedYear.value.name}.pdf`);

    toast.add({
      severity: 'success',
      summary: 'PDF generado',
      detail: `El reporte del año ${selectedYear.value.name} se ha generado correctamente`,
      life: 3000
    });

  } catch (error) {
    console.error('Error al generar PDF:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo generar el PDF. Intente nuevamente.',
      life: 3000
    });
  }
};

const loadHistoricalData = () => {
  if (!selectedYear.value) return;

  loading.value = true;

  // Simular retardo de carga de datos
  setTimeout(() => {
    historicalData.value = mockData[selectedYear.value.name] || [];
    loading.value = false;
  }, 800);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const calcularPorcentaje = (activos, total) => {
  if (!total) return 0;
  return Math.round((activos / total) * 100);
};

const getColorClass = (activos, total) => {
  const porcentaje = calcularPorcentaje(activos, total);
  if (porcentaje >= 80) return 'text-green-600';
  if (porcentaje >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getTotalMiembros = () => {
  return historicalData.value.reduce((sum, club) => sum + club.totalMiembros, 0);
};

const getTotalSeguros = () => {
  return historicalData.value.reduce((sum, club) => sum + club.segurosActivos, 0);
};

onMounted(() => {
  // Cargar año actual por defecto al montar el componente
  const currentYear = new Date().getFullYear().toString();
  const yearOption = years.value.find(y => y.name === currentYear);
  if (yearOption) {
    selectedYear.value = yearOption;
    loadHistoricalData();
  }
});
</script>

<style scoped>
/* Estilos adicionales */
.p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
}
</style>