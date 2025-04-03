<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, index) in data" :key="index" class="card">
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
const data = [
  { title: 'Total de Aventureros', total: 10, sinSeguro: 4, conSeguro: 6 },
  { title: 'Total de Conquistadores', total: 10, sinSeguro: 4, conSeguro: 6 },
  { title: 'Total de Guías Mayores', total: 10, sinSeguro: 4, conSeguro: 6 },
  { title: 'Total de JA', total: 10, sinSeguro: 4, conSeguro: 6 }
];

const pastelColors = ['bg-pastelPink-500', 'bg-pastelGreen-500', 'bg-pastelYellow-500', 'bg-pastelPurple-500'];
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