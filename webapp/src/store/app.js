import jwtDecode from 'jwt-decode'

const company = ''
const user = { username: 'admin', password: 'NotTooSecretPassword' }
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlF1YXNhciBTUEEgdG8gU1NSIiwiaWF0IjoxNjQxMDA2MDAwfQ.OPbJ9cHp_4xIVAy1WTWZnaVRb1hW_bRvYuYcTYGtV9k'

export default {
  namespaced: true,
  state () {
    return {
      company: company,
      username: user.username,
      password: user.password,
      token
    }
  },
  mutations: {
    company (state, value) {
      this.$cookies.set('app.company', value, { path: '/' })
      state.company = value
    },
    username (state, value) {
      this.$cookies.set('app.username', value, { path: '/' })
      state.username = value
    },
    password (state, value) {
      this.$cookies.set('app.password', value, { path: '/' })
      state.password = value
    },
    token (state, value) {
      this.$cookies.set('app.token', value, { path: '/' })
      state.token = value
    },
    restore (state) {
      state.company = this.$cookies.get('app.company') || company
      state.username = this.$cookies.get('app.username') || user.username
      state.password = this.$cookies.get('app.password') || user.password
      state.token = this.$cookies.get('app.token') || token
    }
  },
  getters: {
    decoded (state) {
      return jwtDecode(state.token)
    },
    credentials (state) {
      return btoa(`${state.username}:${state.password}`)
    }
  }
}
