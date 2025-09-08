<script setup>
const props = defineProps({
  cookies: { type: Number, required: true },
  autoRate: { type: Number, required: true },
  avgPerSecond: { type: Number, required: true }
})
</script>

<template>
  <div class="stats">
    <div class="stat"><strong>Dim sum:</strong> {{ props.cookies.toFixed(1) }}</div>
    <div class="stat"><strong>Auto:</strong> {{ props.autoRate.toFixed(1) }} /s</div>
    <div class="stat"><strong>Moy/s:</strong> {{ props.avgPerSecond.toFixed(2) }}</div>
  </div>
</template>

<style scoped>
.stats { display: flex; gap: 16px; flex-wrap: wrap; }
.stat { background: #f2f2f2; padding: 8px 12px; border-radius: 8px; }
</style>
