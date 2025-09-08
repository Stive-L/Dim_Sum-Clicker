import { createStore } from 'vuex'

const AUTO_TICK_MS = 1000
const STORAGE_KEY = 'dsc_users'

function defaultGameState() {
  return {
    cookies: 0,
    autoRate: 0,
    upgrades: [
      { id: 'folder', name: 'Plieur de dim sum', baseCost: 10, rate: 0.1, owned: 0 },
      { id: 'basket', name: 'Panier vapeur', baseCost: 100, rate: 1, owned: 0 },
      { id: 'kitchen', name: 'Cuisine centrale', baseCost: 1000, rate: 8, owned: 0 }
    ],
    autoTimerId: null,
    startedAt: Date.now(),
  }
}

function cloneGame(state) {
  return JSON.parse(JSON.stringify({
    cookies: state.cookies,
    autoRate: state.autoRate,
    upgrades: state.upgrades,
    startedAt: state.startedAt,
  }))
}

function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsersToStorage(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function computeAvgPerSecond(game) {
  const start = game.startedAt || Date.now()
  const elapsedMs = Math.max(1, Date.now() - start)
  const seconds = elapsedMs / 1000
  return (game.cookies || 0) / seconds
}

const store = createStore({
  state() {
    const users = loadUsersFromStorage()
    return {
      // état de la partie courante
      ...defaultGameState(),
      // gestion utilisateurs
      users, // { username: gameState }
      currentUser: null,
    }
  },
  getters: {
    cookies(state) { return state.cookies },
    autoRate(state) { return state.autoRate },
    upgrades(state) { return state.upgrades },
    nextCost: (state) => (id) => {
      const up = state.upgrades.find(u => u.id === id)
      if (!up) return 0
      return Math.floor(up.baseCost * Math.pow(1.15, up.owned))
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
    // jeu
    ADD_COOKIES(state, amount) { state.cookies += amount },
    SPEND_COOKIES(state, amount) { state.cookies = Math.max(0, state.cookies - amount) },
    BUY_UPGRADE(state, id) {
      const up = state.upgrades.find(u => u.id === id)
      if (!up) return
      up.owned += 1
      state.autoRate = state.upgrades.reduce((sum, u) => sum + u.owned * u.rate, 0)
    },
    SET_TIMER_ID(state, id) { state.autoTimerId = id },
    REPLACE_GAME_STATE(state, game) {
      state.cookies = game.cookies ?? 0
      state.autoRate = game.autoRate ?? 0
      state.upgrades = game.upgrades ?? defaultGameState().upgrades
      state.startedAt = game.startedAt ?? Date.now()
    },

    // utilisateurs
    SET_CURRENT_USER(state, username) { state.currentUser = username },
    SET_USERS(state, users) { state.users = users },
  },
  actions: {
    // jeu
    click({ commit, dispatch, state }) {
      commit('ADD_COOKIES', 1)
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
      const id = setInterval(() => {
        const cps = getters.autoRate
        if (cps > 0) {
          commit('ADD_COOKIES', cps)
          if (state.currentUser) dispatch('save')
        }
      }, AUTO_TICK_MS)
      commit('SET_TIMER_ID', id)
    },
    stopAuto({ state, commit }) {
      if (state.autoTimerId) {
        clearInterval(state.autoTimerId)
        commit('SET_TIMER_ID', null)
      }
    },

    // utilisateurs
    login({ state, commit, dispatch }, username) {
      const users = { ...state.users }
      if (!users[username]) {
        users[username] = defaultGameState()
      } else if (!users[username].startedAt) {
        users[username].startedAt = Date.now()
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
        if (!users[username].startedAt) users[username].startedAt = Date.now()
        commit('SET_USERS', users)
        commit('SET_CURRENT_USER', username)
        commit('REPLACE_GAME_STATE', users[username])
        dispatch('startAuto')
      }
    },
  }
})

export default store
