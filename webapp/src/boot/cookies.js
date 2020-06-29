// import something here
import { Cookies } from 'quasar'
import inject from './inject'

export default inject(({ ssrContext, store }) => {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies

  return {
    cookies
  }
})
