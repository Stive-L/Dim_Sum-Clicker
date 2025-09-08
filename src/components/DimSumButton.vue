<script setup>
import dimSum from '../assets/dim_sum.png'
const emit = defineEmits(['click'])
</script>

<template>
  <button class="main" @click="$emit('click', $event)" aria-label="Ajouter un dim sum">
    <img :src="dimSum" alt="Dim Sum" />
  </button>
</template>

<style scoped>
button.main { padding: 10px 18px; border-radius: 16px; background: #fff; color: inherit; border: 2px solid #42b883; cursor: pointer; }
button.main:hover { background: #f3fff9; }
button.main img { height: 120px; width: 120px; object-fit: contain; display: block; }
</style>
