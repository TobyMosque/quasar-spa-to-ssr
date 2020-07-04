import { uuid } from '@toby.mosque/utils'
import faker from 'faker'

export default {
  name: 'PagePeople',
  data () {
    return {
      jobs: [],
      people: [],
      modal: {
        person: {},
        show: false,
        pending: false,
        unwatch: null
      },
      columns: [
        { name: '_id', label: 'Avatar', field: '_id', align: 'left', sortable: true },
        { name: 'firstName', label: 'First Name', field: 'firstName', align: 'left', sortable: true },
        { name: 'lastName', label: 'Last Name', field: 'lastName', align: 'left', sortable: true },
        { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
        { name: 'job', label: 'Job', field: 'job', align: 'left', sortable: true },
        { name: 'actions', label: 'Actions', field: '_id', align: 'center' }
      ],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
      }
    }
  },
  mounted () {
    this.fetch()
  },
  computed: {
    company () {
      return this.$store.state.app.company
    },
    options () {
      return this.jobs.map(company => ({
        value: company._id.split(':')[1],
        label: company.name
      }))
    },
    data () {
      return this.people.filter(row => row.read.company === this.company)
    },
    jobsIndex () {
      return this.jobs.reduce((map, job, index) => {
        const id = job._id.split(':')[1]
        map.set(id, index)
        return map
      }, new Map())
    },
    peopleIndex () {
      return this.people.reduce((map, person, index) => {
        map.set(person.id, index)
        return map
      }, new Map())
    }
  },
  methods: {
    clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    async fetch () {
      const options = {
        params: {
          include_docs: true
        }
      }
      const { data: { rows: jobs } } = await this.$axios.get('/_partition/job/_all_docs', options)
      const { data: { rows: people } } = await this.$axios.get('/_partition/person/_all_docs', options)
      this.jobs = jobs.map(row => row.doc)
      this.people = people.map(row => {
        return {
          id: row.id,
          rev: row.value.rev,
          mode: 'read',
          read: row.doc,
          edit: {},
          pending: false,
          unwatch: null
        }
      })
    },
    jobById (id) {
      const index = this.jobsIndex.get(id)
      return this.jobs[index]
    },
    edit (row) {
      row.mode = 'edit'
      row.edit = this.clone(row.read)
      row.unwatch = this.$watch(() => row.edit, () => this.change(row, true), { deep: true })
      row.pending = false
    },
    change (row, pending) {
      row.pending = pending
      if (row.unwatch) {
        row.unwatch()
        row.unwatch = null
      }
    },
    cancel (row) {
      if (row.pending) {
        this.$q.dialog({
          title: 'Pending Changes',
          message: 'All pending changes will be lost, do you sure?',
          color: 'warning',
          ok: 'yes',
          cancel: 'no'
        }).onOk(() => {
          this.cancelConfirm(row)
        })
      } else {
        this.cancelConfirm(row)
      }
    },
    cancelConfirm (row) {
      this.change(row, false)
      row.mode = 'read'
    },
    remove (row) {
      this.$q.dialog({
        title: 'Delete',
        message: 'This person will be delete, do you sure?',
        color: 'negative',
        ok: 'yes',
        cancel: 'no'
      }).onOk(() => {
        this.deleteAsync(row)
      })
    },
    async deleteAsync (row) {
      await this.$axios.delete(`${row.id}?rev=${row.rev}`)
      this.$delete(this.people, this.peopleIndex.get(row.id))
      this.$q.notify({ message: 'person deleted', color: 'positive' })
    },
    async update (row) {
      const { data } = await this.$axios.put(`${row.id}?rev=${row.rev}`, row.edit)
      if (data.ok) {
        row.rev = row.edit._rev = data.rev
        row.read = row.edit
        row.edit = {}
        row.pending = false
        this.cancel(row)
        this.$q.notify({ message: 'person updated', color: 'positive' })
      } else {
        this.$q.notify({ message: 'something bad happened', color: 'negative' })
      }
    },
    show () {
      const person = {
        id: null,
        avatar: null,
        firstName: '',
        lastName: '',
        company: null,
        job: null
      }

      this.$set(this.modal, 'person', person)
      this.modal.unwatch = this.$watch(() => this.modal.person, () => {
        this.modal.unwatch()
        this.modal.pending = true
        this.modal.unwatch = null
      }, { deep: true })
      this.modal.pending = false
      this.modal.show = true
    },
    close () {
      if (this.modal.pending) {
        this.$q.dialog({
          title: 'Pending Changes',
          message: 'All pending changes will be lost, do you sure?',
          color: 'warning',
          ok: 'yes',
          cancel: 'no'
        }).onOk(this.closeConfirm)
      } else {
        this.closeConfirm()
      }
    },
    closeConfirm (pending) {
      if (this.modal.unwatch) {
        this.modal.unwatch()
        this.modal.unwatch = null
      }
      this.modal.pending = false
      this.modal.show = false
    },
    async create () {
      const person = this.modal.person
      person.id = 'person:' + uuid.comb()
      person.avatar = faker.internet.avatar()
      person.company = this.company
      const { data } = await this.$axios.put(`${person.id}`, person)
      if (data.ok) {
        person._rev = data.rev
        this.people.push({
          id: person.id,
          rev: person._rev,
          mode: 'read',
          read: person,
          edit: {},
          pending: false,
          unwatch: null
        })
        this.$q.notify({ message: 'person created', color: 'positive' })
        this.closeConfirm()
      } else {
        this.$q.notify({ message: 'something bad happened', color: 'negative' })
      }
    }
  }
}
