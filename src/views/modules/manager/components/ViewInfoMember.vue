<template>
  <Dialog
    header="Detalles del Miembro"
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    :style="{ width: '90vw', maxWidth: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw'}"
  >
    <div class="p-fluid">
      <h2 class="text-customBlue-700 text-2xl mb-4">Información Personal</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Nombres:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.nombres) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Apellidos:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.apellidos) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Teléfono:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.telefono) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">¿Es alérgico a?</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.is_alergico_a) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">¿Padece alguna enfermedad?</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.enfermedad_padese) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">¿Medicamento con receta?</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.medicamento_receta) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Edad:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.edad) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Tipo:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.tipo.nombre) }}</p>
        </div>
      </div>
      <h2 class="text-customBlue-700 text-2xl mb-4 mt-4">Información del Responsable</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Nombres:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.nombres_responsable) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Apellidos:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.apellidos_responsable) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Teléfono:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.telefono_responsable) }}</p>
        </div>
        <div>
          <h3 class="text-customBlack-500 text-xl mb-2">Parentesco:</h3>
          <p class="text-customBlack-300 capitalize">{{ formatValue(member.parentesco_responsable) }}</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  member: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const formatValue = (value) => value ? value : '-';
</script>