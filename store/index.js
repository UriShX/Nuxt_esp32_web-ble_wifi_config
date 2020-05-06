export const state = () => ({
  available: false,
  connected: false,
  APName: '',
  form: {
    ssidPrim: null,
    pwPrim: null,
    ssidSec: null,
    pwSec: null
  }
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
  },
  formMutation(state, recievedObj) {
    const formObject = JSON.parse(recievedObj)

    for (let i = 0; i < Object.keys(formObject).length; i++) {
      if (
        Object.prototype.hasOwnProperty.call(
          state.form,
          Object.keys(formObject)[i]
        )
      ) {
        state.form[Object.keys(formObject)[i]] = Object.values(formObject)[i]
      }
    }
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
  },
  setForm({ commit }, formJson) {
    commit('formMutation', formJson)
  }
}

export const getters = {
  getAvailability(state) {
    return state.available
  },
  getConnection(state) {
    return state.connected
  },
  getPrimSsid(state) {
    return state.form.ssidPrim
  },
  getSecSsid(state) {
    return state.form.ssidSec
  },
  getPrimPw(state) {
    return state.form.pwPrim
  },
  getSecPw(state) {
    return state.form.pwSec
  }
}
