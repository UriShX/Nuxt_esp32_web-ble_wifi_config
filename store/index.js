export const state = () => ({
  available: false,
  connected: false,
  APName: ''
})

export const mutations = {
  availableStat(state, currStat) {
    state.available = currStat
  },
  connectionStat(state, currStat) {
    state.connected = currStat
  },
  apNameState(state, name) {
    state.APName = name
  }
}

export const actions = {
  switchAvailability({ commit }, OsAndNav) {
    commit('availableStat', OsAndNav)
  },
  switchConnection({ commit }, btStat) {
    commit('connectionStat', btStat)
  },
  setApName({ commit }, name) {
    commit('apNameState', name)
  }
}

export const getters = {
  getAvailability(state) {
    return state.available
  },
  getConnection(state) {
    return state.connected
  }
}
