<template>
       <span v-for="error in props.errors" class="text-red-600">
        {{ error.$message }}
            <br>
      </span>
</template>

<script setup>
const props = defineProps({
  errors: {
    type: Array,
    required: true,
  },
});
</script>