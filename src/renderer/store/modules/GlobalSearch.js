const state = {
  type: '',
  key: '',
  open: false,
  localFormulaImages: {},
  localMedicineImages: {}
}

const mutations = {
  search (state, params) {
    let { type, key } = params

    console.log('===================')
    console.log(type, key)
    state.type = type
    state.key = key
    state.open = key && key !== ''
  },
  searchOpen (state, open) {
    state.open = open
  },
  setLocalImages (state, { type, data }) {
    if (type === 'formula') {
      state.localFormulaImages = data
    }
    if (type === 'medicine') {
      state.localMedicineImages = data
    }
  }
}

const actions = {
  search ({ commit }, { type, key }) {
    commit('search', { type, key })
  },
  searchOpen ({ commit }, val) {
    commit('searchOpen', val)
  },
  setLocalImages ({ commit }, { type, data }) {
    commit('setLocalImages', { type, data })
  }
}

export default {
  state,
  mutations,
  actions
}
