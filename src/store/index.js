import { createStore } from 'vuex'

const AUTO_TICK_MS = 1000
const STORAGE_KEY = 'dsc_users'

function defaultGameState() {
  return {
    cookies: 0,
    autoRate: 0,
    multiplier: 1,
    upgrades: [
      { id: 'folder', name: 'Plieur de dim sum', baseCost: 10, rate: 0.1, owned: 0 },
      { id: 'basket', name: 'Panier vapeur', baseCost: 100, rate: 1, owned: 0 },
      { id: 'kitchen', name: 'Cuisine centrale', baseCost: 1000, rate: 8, owned: 0 },
      { id: 'multiplier', name: 'Multiplicateur de gains', baseCost: 50, multiplier: 2, owned: 0 }
    ],
    autoTimerId: null,
    startedAt: Date.now(),
  }
}

function cloneGame(state) {
  return {
    cookies: state.cookies,
    autoRate: state.autoRate,
    multiplier: state.multiplier,
    upgrades: [...state.upgrades],
    startedAt: state.startedAt,
  }
}

function loadUsersFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveUsersToStorage(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function computeAvgPerSecond(game) {
  const elapsedSeconds = (Date.now() - game.startedAt) / 1000
  return game.cookies / elapsedSeconds
}

const store = createStore({
  state() {
    const users = loadUsersFromStorage()
    return {
      ...defaultGameState(),
      users,
      currentUser: null,
    }
  },
  getters: {
    cookies(state) { return state.cookies },
    autoRate(state) { return state.autoRate },
    multiplier(state) { return state.multiplier },
    upgrades(state) { return state.upgrades },
    
    nextCost: (state) => (id) => {
      const upgrade = state.upgrades.find(u => u.id === id)
      if (!upgrade) return 0
      
      if (upgrade.id === 'multiplier') {
        return upgrade.baseCost * Math.pow(2, upgrade.owned)
      }
      
      return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned))
    },
    stats(state) {
      return {
        cookies: state.cookies,
        autoRate: state.autoRate,
        avgPerSecond: computeAvgPerSecond(state),
        totalUpgrades: state.upgrades.reduce((s, u) => s + u.owned, 0)
      }
    },
    currentUser(state) { return state.currentUser },
    usernames(state) { return Object.keys(state.users || {}) },
    leaderboard(state) { // total cookies
      const entries = Object.entries(state.users).map(([username, game]) => ({
        username,
        cookies: game.cookies ?? 0,
      }))
      entries.sort((a, b) => b.cookies - a.cookies)
      return entries
    },
    leaderboardAvg(state) { // moyenne par seconde
      const entries = Object.entries(state.users).map(([username, game]) => ({
        username,
        avgPerSecond: computeAvgPerSecond(game),
      }))
      entries.sort((a, b) => b.avgPerSecond - a.avgPerSecond)
      return entries
    }
  },
  mutations: {
    ADD_COOKIES(state, amount) { 
      state.cookies += amount 
    },
    
    SPEND_COOKIES(state, amount) { 
      state.cookies = Math.max(0, state.cookies - amount) 
    },
    
    BUY_UPGRADE(state, id) {
      const upgrade = state.upgrades.find(u => u.id === id)
      if (!upgrade) return
      
      upgrade.owned += 1
      
      if (upgrade.id === 'multiplier') {
        state.multiplier = Math.pow(2, upgrade.owned)
      } else {
        state.autoRate = state.upgrades
          .filter(u => u.rate)
          .reduce((total, u) => total + (u.owned * u.rate), 0)
      }
    },
    SET_TIMER_ID(state, id) { state.autoTimerId = id },
    REPLACE_GAME_STATE(state, game) {
      state.cookies = game.cookies ?? 0
      state.autoRate = game.autoRate ?? 0
      state.upgrades = game.upgrades ?? defaultGameState().upgrades
      state.startedAt = game.startedAt ?? Date.now()
      
      const multiplierUpgrade = state.upgrades.find(u => u.id === 'multiplier')
      if (multiplierUpgrade) {
        state.multiplier = Math.pow(2, multiplierUpgrade.owned)
      } else {
        state.multiplier = 1
      }
    },

    SET_CURRENT_USER(state, username) { state.currentUser = username },
    SET_USERS(state, users) { state.users = users },
  },
  actions: {
    click({ commit, dispatch, state, getters }) {
      const gains = 1 * getters.multiplier
      commit('ADD_COOKIES', gains)
      if (state.currentUser) dispatch('save')
    },
    
    buyUpgrade({ state, getters, commit, dispatch }, id) {
      const cost = getters.nextCost(id)
      if (state.cookies >= cost) {
        commit('SPEND_COOKIES', cost)
        commit('BUY_UPGRADE', id)
        if (state.currentUser) dispatch('save')
      }
    },
    
    startAuto({ state, commit, getters, dispatch }) {
      if (state.autoTimerId) return
      
      const timer = setInterval(() => {
        const autoGains = getters.autoRate * getters.multiplier
        if (autoGains > 0) {
          commit('ADD_COOKIES', autoGains)
          if (state.currentUser) dispatch('save')
        }
      }, AUTO_TICK_MS)
      
      commit('SET_TIMER_ID', timer)
    },
    
    stopAuto({ state, commit }) {
      if (state.autoTimerId) {
        clearInterval(state.autoTimerId)
        commit('SET_TIMER_ID', null)
      }
    },

    login({ state, commit, dispatch }, username) {
      const users = { ...state.users }
      
      if (!users[username]) {
        users[username] = defaultGameState()
      }
      
      commit('SET_USERS', users)
      commit('SET_CURRENT_USER', username)
      commit('REPLACE_GAME_STATE', users[username])
      saveUsersToStorage(users)
      dispatch('startAuto')
    },
    
    logout({ commit }) {
      commit('SET_CURRENT_USER', null)
    },
    
    save({ state }) {
      if (!state.currentUser) return
      const users = { ...state.users }
      users[state.currentUser] = cloneGame(state)
      saveUsersToStorage(users)
    },
    
    load({ state, commit, dispatch }, username) {
      const users = loadUsersFromStorage()
      if (users[username]) {
        commit('SET_USERS', users)
        commit('SET_CURRENT_USER', username)
        commit('REPLACE_GAME_STATE', users[username])
        dispatch('startAuto')
      }
    },
    
    initAuto({ dispatch }) {
      dispatch('startAuto')
    },
  }
})

export default store
