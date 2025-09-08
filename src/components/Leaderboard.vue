<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  mode: { type: String, default: 'total' }, // 'total' | 'avg'
  leaderboard: { type: Array, default: () => [] },
  leaderboardAvg: { type: Array, default: () => [] }
})
const emit = defineEmits(['toggle', 'changeMode'])
</script>

<template>
  <div class="leaderboard-wrap">
    <div class="lb-controls">
      <button @click="$emit('toggle')">{{ props.show ? 'Masquer' : 'Voir' }} le classement</button>
      <template v-if="props.show">
        <label>
          <input type="radio" value="total" :checked="props.mode==='total'" @change="$emit('changeMode', 'total')" /> Total
        </label>
        <label>
          <input type="radio" value="avg" :checked="props.mode==='avg'" @change="$emit('changeMode', 'avg')" /> Moyenne/s
        </label>
      </template>
    </div>
    <div v-if="props.show" class="leaderboard">
      <h2>Classement</h2>
      <ol v-if="props.mode === 'total'">
        <li v-for="entry in props.leaderboard" :key="entry.username">
          <strong>{{ entry.username }}</strong>: {{ entry.cookies.toFixed(1) }} dim sum
        </li>
      </ol>
      <ol v-else>
        <li v-for="entry in props.leaderboardAvg" :key="entry.username">
          <strong>{{ entry.username }}</strong>: {{ entry.avgPerSecond.toFixed(2) }} dim sum/s
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-wrap { width: 100%; max-width: 560px; }
.lb-controls { display: flex; gap: 12px; align-items: center; }
.leaderboard { width: 100%; }
.leaderboard ol { padding-left: 20px; }
</style>
