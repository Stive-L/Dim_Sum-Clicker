<script setup>
const props = defineProps({
  upgrades: { type: Array, required: true },
  nextCost: { type: Function, required: true }
})
const emit = defineEmits(['buy'])
</script>

<template>
  <div class="upgrades">
    <h2>Améliorations</h2>
    <ul>
      <li v-for="u in props.upgrades" :key="u.id">
        <div class="row">
          <div>
            <div class="name">{{ u.name }} (possédées: {{ u.owned }})</div>
            <div class="desc">+{{ u.rate }}/s chacune</div>
          </div>
          <button @click="$emit('buy', u.id)">Acheter ({{ props.nextCost(u.id) }} dim sum)</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.upgrades { width: 100%; max-width: 560px; }
.row { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; }
.name { font-weight: 600; }
.desc { font-size: 12px; color: #666; }
</style>
