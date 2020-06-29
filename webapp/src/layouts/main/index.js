export default {
  name: 'LayoutMain',
  data () {
    return {
      companies: []
    }
  },
  mounted () {
    this.fetch()
  },
  computed: {
    user () {
      return this.$store.getters['app/decoded']
    },
    company: {
      get () { return this.$store.state.app.company },
      set (value) { this.$store.commit('app/company', value) }
    },
    options () {
      return this.companies.map(company => ({
        value: company._id.split(':')[1],
        label: company.name
      }))
    }
  },
  methods: {
    async fetch () {
      const { data: { rows } } = await this.$axios.get('/_partition/company/_all_docs', {
        params: {
          include_docs: true
        }
      })
      this.companies = rows.map(row => row.doc)
    }
  }
}
