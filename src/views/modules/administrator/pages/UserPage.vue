<template>
  <div class="space-y-10">
    <h1 class="text-2xl font-bold text-center mt-5 uppercase text-customBlack-500">
      Usuarios
    </h1>
    <div class="card p-fluid">
      <DataTable v-model:editingRows="editingRows" :value="users" editMode="row" dataKey="id"
                 @row-edit-save="onRowEditSave"
                 :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']&&'padding-top: 0.6rem; padding-bottom: 0.6rem'
                    })
                }
            }"
      >
        <Column field="nombre" header="Nombre" style="width: 20%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]"/>
          </template>
        </Column>

        <Column field="password" header="Contraseña" style="width: 20%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]"/>
          </template>
        </Column>
        <Column :rowEditor="true" header="Ac" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import adminServices from "../services/adminServices.js";

const users = ref([]);

const editingRows = ref([]);

const onRowEditSave = (event) => {
  let {newData, index} = event;
  users.value[index] = newData;
  console.log(users.value[index]);
};

const getAllUsers = async () => {
  const response = await adminServices.getAllUsers();
  response.data.forEach(user => {
    users.value.push({
      id: user.id,
      nombre: user.user,
      password: user.password
    });
  })
};
onMounted(
    () => {
      getAllUsers();
    }
)
</script>