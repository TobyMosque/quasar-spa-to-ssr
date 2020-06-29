import axios from 'axios'
import inject from './inject'
import { Notify } from 'quasar'

export default inject(({ store, router }) => {
  const instance = axios.create({
    baseURL: 'http://localhost:40984/entities',
    withCredentials: true
  })

  instance.interceptors.request.use((config) => {
    const token = store.getters['app/credentials']
    config.headers.Authorization = `Basic ${token}`
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  instance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    const { status } = error.response || {}
    let message = 'Generic'
    switch (status) {
      case 400: message = 'Bad Request'; break
      case 401: message = 'Unauthorized'; break
      case 403: message = 'Forbidden'; break
      case 422: message = 'Unprocessable'; break
      case 500: message = 'Server Error'; break
      case 503: message = 'Service Unavailable'; break
    }
    Notify.create({
      type: 'negative',
      html: true,
      message: message
    })
    if (status === 401) {
      store.commit('app/token', undefined)
      router.push('/login')
    }
    return Promise.reject(error)
  })

  return {
    axios: instance
  }
})
