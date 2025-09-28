<script setup>
const props = defineProps({
  cookies: { type: Number, required: true },
  autoRate: { type: Number, required: true },
  multiplier: { type: Number, required: true }
})
</script>

<template>
  <div class="stats">
    <div class="stat">
      <strong>Dim sum:</strong> {{ props.cookies.toFixed(1) }}
    </div>
    <div class="stat">
      <strong>Auto:</strong> {{ props.autoRate.toFixed(1) }} /s
    </div>
    <div class="stat">
      <strong>Multiplicateur:</strong> x{{ props.multiplier.toFixed(1) }}
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.stat {
  background-color: #ecf0f1;
  padding: 15px 20px;
  border-radius: 10px;
  border: 2px solid #bdc3c7;
  font-size: 16px;
}

.stat strong {
  color: #2c3e50;
}
</style>
