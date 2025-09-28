<template>
  <div v-if="isVisible" class="click-animation" :style="animationStyle">
    <img :src="currentAnimation" alt="Animation" class="animation-image" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import animation1 from '../assets/animation1.png'
import animation2 from '../assets/animation2.png'
import animation3 from '../assets/animation3.png'

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
})

const isVisible = ref(true)

const animations = [animation1, animation2, animation3]

const currentAnimation = ref(
  animations[Math.floor(Math.random() * animations.length)]
)

const animationStyle = computed(() => ({
  left: `${props.x - 30}px`,
  top: `${props.y - 30}px`
}))

let animationTimer

onMounted(() => {
  animationTimer = setTimeout(() => {
    isVisible.value = false
  }, 800)
})

onUnmounted(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})
</script>

<style scoped>
.click-animation {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  animation: fadeUp 0.8s ease-out forwards;
}

.animation-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(0px) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }
}
</style>
