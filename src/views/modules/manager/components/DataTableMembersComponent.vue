<template>
  <div  class="bg-customWhite-500 p-3 rounded-md shadow-md">
    <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
               tableStyle="min-width: 50rem">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable></Column>
      <Column header="Seguro" sortable>
        <template #body="{data}" >
          <Tag :value="data.seguro" :severity="data.seguro=='pagado'?'success' : 'warning'">
            {{data.seguro }}
          </Tag>
        </template>
      </Column>
      <Column v-if="haveActions">
        <template #header>
          <span>Acciones</span>
        </template>
        <template #body="{data}">
          <slot name="actions" :data="data"></slot>
        </template>
      </Column>
    </DataTable>
  </div>

</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const props = defineProps({
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true,
      },
      haveActions: {
        type: Boolean,
        default: false,
      },
    }
);

</script>
<style scoped>

::v-deep .p-datatable-thead > tr > th {
  background-color: #FFFFFF;
  color: #334155;
}
</style>