export const state = () => ({
  connected: false
})

export const mutations = {
  connectionStat(state) {
    state.connected = !state.connected
  }
}

export const actions = {}

export const getters = {
  getConnection(state) {
    return state.connected
  }
}
