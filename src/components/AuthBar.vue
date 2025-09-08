<script setup>
import { ref, watch, toRefs } from 'vue'

const props = defineProps({
  currentUser: { type: String, default: null },
  usernames: { type: Array, default: () => [] }
})
const { currentUser, usernames } = toRefs(props)
const emit = defineEmits(['login', 'load', 'save', 'logout'])

const username = ref('')
const selectedUser = ref('')

const onLogin = () => username.value.trim() && emit('login', username.value.trim())
const onLoad = () => {
  const target = (selectedUser.value || username.value).trim()
  target && emit('load', target)
}
const onSave = () => emit('save')
const onLogout = () => emit('logout')

watch(() => props.currentUser, (u) => {
  if (u) { username.value = ''; selectedUser.value = '' }
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
      <button @click="onSave">Sauvegarder</button>
      <button @click="onLogout">Déconnexion</button>
    </div>
  </div>
  </template>

<style scoped>
.auth { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.auth input, .auth select { padding: 8px 10px; border-radius: 8px; border: 1px solid #ddd; }
</style>


