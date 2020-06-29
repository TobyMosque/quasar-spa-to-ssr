// import something here
export default async ({ app, store }) => {
  store.commit('app/restore')
  if (!store.state.app.company) {
    const { axios } = app
    const { data: { rows: companies } } = await axios.get('/_partition/company/_all_docs', {
      params: {
        skip: 0,
        limit: 1
      }
    })
    if (companies) {
      const companyId = companies[0].id.split(':')[1]
      store.commit('app/company', companyId)
    }
  }
}
