<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import AuthBar from './AuthBar.vue'
import StatsBar from './StatsBar.vue'
import DimSumButton from './DimSumButton.vue'
import UpgradesList from './UpgradesList.vue'
import Leaderboard from './Leaderboard.vue'

const store = useStore()

const cookies = computed(() => store.getters.cookies)
const autoRate = computed(() => store.getters.autoRate)
const multiplier = computed(() => store.getters.multiplier)
const upgrades = computed(() => store.getters.upgrades)

const usernames = computed(() => store.getters.usernames)
const currentUser = computed(() => store.getters.currentUser)
const leaderboard = computed(() => store.getters.leaderboard)
const leaderboardAvg = computed(() => store.getters.leaderboardAvg)

const showLeaderboard = ref(false)
const leaderboardMode = ref('total')

const buy = (id) => store.dispatch('buyUpgrade', id)
const nextCost = (id) => store.getters.nextCost(id)
const onClick = () => store.dispatch('click')

const login = (username) => store.dispatch('login', username)
const load = (username) => store.dispatch('load', username)
const logout = () => store.dispatch('logout')

onMounted(() => {
  store.dispatch('initAuto')
})
</script>

<template>
  <section>
    <h1>Dim Sum Clicker</h1>

    <AuthBar
      :current-user="currentUser"
      :usernames="usernames"
      @login="login"
      @load="load"
      @logout="logout"
    />

    <StatsBar :cookies="cookies" :auto-rate="autoRate" :multiplier="multiplier" />

    <DimSumButton @click="onClick" />

    <UpgradesList :upgrades="upgrades" :next-cost="nextCost" @buy="buy" />

    <Leaderboard
      :show="showLeaderboard"
      :mode="leaderboardMode"
      :leaderboard="leaderboard"
      :leaderboard-avg="leaderboardAvg"
      @toggle="showLeaderboard = !showLeaderboard"
      @changeMode="(m) => leaderboardMode = m"
    />
  </section>
  </template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
</style>


