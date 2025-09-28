<script setup>
import { ref } from 'vue'
import dimSum from '../assets/dim_sum.png'
import ClickAnimation from './ClickAnimation.vue'

const emit = defineEmits(['click'])

const animations = ref([])

const handleClick = (event) => {
  const x = event.clientX
  const y = event.clientY
  
  animations.value.push({
    id: Date.now(),
    x: x,
    y: y
  })
  
  emit('click', event)
}

const removeAnimation = (id) => {
  animations.value = animations.value.filter(anim => anim.id !== id)
}
</script>

<template>
  <div class="button-container">
    <button class="main" @click="handleClick" aria-label="Ajouter un dim sum">
      <img :src="dimSum" alt="Dim Sum" />
    </button>
    
    <!-- Animations de clic -->
    <ClickAnimation
      v-for="animation in animations"
      :key="animation.id"
      :x="animation.x"
      :y="animation.y"
      @remove="removeAnimation(animation.id)"
    />
  </div>
</template>

<style scoped>
.button-container {
  position: relative;
  display: inline-block;
  margin: 20px 0;
}

button.main {
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  border: 3px solid #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
}

button.main:hover {
  background-color: #fdf2f2;
  border-color: #c0392b;
  transform: scale(1.05);
}

button.main:active {
  transform: scale(0.95);
}

button.main img {
  height: 120px;
  width: 120px;
  object-fit: contain;
  display: block;
}
</style>
