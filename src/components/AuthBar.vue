<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentUser: { type: String, default: null },
  usernames: { type: Array, default: () => [] }
})

const emit = defineEmits(['login', 'load', 'logout'])

const username = ref('')
const selectedUser = ref('')

const onLogin = () => {
  if (username.value.trim()) {
    emit('login', username.value.trim())
  }
}

const onLoad = () => {
  const target = selectedUser.value || username.value
  if (target.trim()) {
    emit('load', target.trim())
  }
}

const onLogout = () => {
  emit('logout')
}

watch(() => props.currentUser, (newUser) => {
  if (newUser) {
    username.value = ''
    selectedUser.value = ''
  }
})
</script>

<template>
  <div class="auth">
    <div v-if="!currentUser">
      <input v-model="username" placeholder="Choisir un pseudo" />
      <button @click="onLogin">Commencer</button>
      <select v-model="selectedUser">
        <option value="">— Utilisateurs existants —</option>
        <option v-for="u in usernames" :key="u" :value="u">{{ u }}</option>
      </select>
      <button @click="onLoad">Charger</button>
    </div>
    <div v-else>
      <span>Connecté: <strong>{{ currentUser }}</strong></span>
      <button @click="onLogout">Déconnexion</button>
    </div>
  </div>
  </template>

<style scoped>
.auth {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.auth input,
.auth select {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.auth input:focus,
.auth select:focus {
  border-color: #3498db;
  outline: none;
}
</style>


