<script setup>
const props = defineProps({
  upgrades: { type: Array, required: true },
  nextCost: { type: Function, required: true }
})

const emit = defineEmits(['buy'])

const buyUpgrade = (upgradeId) => {
  emit('buy', upgradeId)
}
</script>

<template>
  <div class="upgrades">
    <h2>Améliorations</h2>
    <ul>
      <li v-for="upgrade in props.upgrades" :key="upgrade.id">
        <div class="row">
          <div>
            <div class="name">
              {{ upgrade.name }} (possédées: {{ upgrade.owned }})
            </div>
            <div class="desc" v-if="upgrade.rate">
              +{{ upgrade.rate }}/s automatiquement
            </div>
            <div class="desc" v-else-if="upgrade.multiplier">
              Multiplie tous vos gains par 2 (à chaque achat)
            </div>
          </div>
          <button @click="buyUpgrade(upgrade.id)">
            Acheter ({{ props.nextCost(upgrade.id) }} dim sum)
          </button>
        </div>
        <div v-if="upgrade.id === 'kitchen'" class="separator"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.upgrades {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.upgrades h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  border: 2px solid #ecf0f1;
}

.name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
}

.desc {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.separator {
  height: 2px;
  background-color: #bdc3c7;
  margin: 20px 0;
  border-radius: 1px;
}
</style>
