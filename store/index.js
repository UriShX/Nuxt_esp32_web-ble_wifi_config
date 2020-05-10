export const state = () => ({
  available: false,
  connected: false,
  APName: '',
  form: {
    ssidPrim: null,
    pwPrim: null,
    ssidSec: null,
    pwSec: null
  },
  apStatus: -1,
  onDevice: {
    ssidPrim: null,
    ssidSec: null
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
    let formSelector = recievedObj[0]
    const formObject = JSON.parse(recievedObj[1])

    if (formSelector === 'form') formSelector = state.form
    else if (formSelector === 'onDevice') formSelector = state.onDevice

    for (let i = 0; i < Object.keys(formObject).length; i++) {
      if (
        Object.prototype.hasOwnProperty.call(
          formSelector,
          Object.keys(formObject)[i]
        )
      ) {
        formSelector[Object.keys(formObject)[i]] = Object.values(formObject)[i]
      }
    }
  },
  apStatusMutation(state, code) {
    state.apStatus = code
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
    commit('formMutation', ['form', formJson])
  },
  setOnDevice({ commit }, formJson) {
    commit('formMutation', ['onDevice', formJson])
  },
  setApStatus({ commit }, code) {
    commit('apStatusMutation', code)
  }
}

export const getters = {
  getAvailability(state) {
    return state.available
  },
  getConnection(state) {
    return state.connected
  },
  getForm(state) {
    return state.form
  },
  getOnDevice(state) {
    return state.onDevice
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
