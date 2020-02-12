import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './common/api'

Vue.use(Vuex)

let userInfo = localStorage.userInfo

export default new Vuex.Store({
  state: {
    userInfo: userInfo,
    hasNewMessage: false,
    customersAll: [],
    deviceTypeAll: [
      {
        name: '拉晶',
        typeValue: 'LAJIndicatorType'
      },
      {
        name: 'MRI',
        typeValue: 'MRIIndicatorType'
      }
    ],
    deviceAll: []
  },
  getters: {
    isAdmin(state) {
      if (typeof state.userInfo != 'object') {
        state.userInfo = JSON.parse(localStorage.userInfo)
      }
      return state.userInfo.rolenum == '0'
    }
  },
  mutations: {
    setState(state, payload) {
      Object.assign(state, payload)
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
      localStorage.userInfo = JSON.stringify(payload)
      localStorage.type = payload.role
    },
    setHasNewMessage(state, hasNewMessage) {
      state.hasNewMessage = hasNewMessage
    }
  },
  actions: {
    // async updateCustomers({ commit }) {
    //   const res = await api.getCustomers({
    //     pageNumber: 1,
    //     pageSize: 99999
    //   })
    //   commit('setState', { customersAll: res.data.data })
    // },
    // async updateDevice({ commit }) {
    //   const res = await api.getDeviceList({
    //     pageNumber: 1,
    //     pageSize: 99999
    //   })
    //   commit('setState', { deviceAll: res.data.data })
    // }
  }
})
