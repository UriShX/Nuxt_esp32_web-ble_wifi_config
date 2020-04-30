export const state = () => ({
  available: false,
  connected: false
})

export const mutations = {
  availableStat(state, currStat) {
    state.available = currStat
  },
  connectionStat(state) {
    state.connected = !state.connected
  }
}

export const actions = {
  switchAvailability({ commit }, OsAndNav) {
    commit('availableStat', OsAndNav)
  },
  switchConnection({ commit }, btStat) {
    commit('connectionStat', btStat)
  }
}

export const getters = {
  setAvailability(state) {
    return state.available
  },
  getConnection(state) {
    return state.connected
  }
}
