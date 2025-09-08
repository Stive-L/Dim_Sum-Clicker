<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import AuthBar from './AuthBar.vue'
import StatsBar from './StatsBar.vue'
import DimSumButton from './DimSumButton.vue'
import UpgradesList from './UpgradesList.vue'
import Leaderboard from './Leaderboard.vue'

const store = useStore()

const cookies = computed(() => store.getters.cookies)
const autoRate = computed(() => store.getters.autoRate)
const avgPerSecond = computed(() => store.getters.stats.avgPerSecond)
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
const login = (u) => store.dispatch('login', u)
const load = (u) => store.dispatch('load', u)
const save = () => store.dispatch('save')
const logout = () => store.dispatch('logout')
</script>

<template>
  <section>
    <h1>Dim Sum Clicker</h1>

    <AuthBar
      :current-user="currentUser"
      :usernames="usernames"
      @login="login"
      @load="load"
      @save="save"
      @logout="logout"
    />

    <StatsBar :cookies="cookies" :auto-rate="autoRate" :avg-per-second="avgPerSecond" />

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
section { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px; }
</style>


