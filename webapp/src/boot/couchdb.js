// import something here
import faker from 'faker'
import { uuid } from '@toby.mosque/utils'

const companiesCount = 10
const jobsCount = 30
const peopleCount = 1000

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ app, store }) => {
  const { axios } = app
  try {
    await axios.get('/')
  } catch (err) {
    if (err.response.status === 404) {
      await axios.put('/', { id: 'entities', name: 'entities' }, {
        params: { partitioned: true }
      })
    } else {
      throw err
    }
  }

  faker.locale = 'en_US'
  const { data: { rows: companies } } = await axios.get('/_partition/company/_all_docs')
  const { data: { rows: jobs } } = await axios.get('/_partition/job/_all_docs')
  const { data: { rows: people } } = await axios.get('/_partition/person/_all_docs')

  if (!companies.length) {
    for (let i = 0; i < companiesCount; i++) {
      companies.push({
        _id: 'company:' + uuid.comb(),
        name: faker.company.companyName()
      })
    }
    await axios.post('/_bulk_docs', { docs: companies })
  }

  if (!jobs.length) {
    for (let i = 0; i < jobsCount; i++) {
      jobs.push({
        _id: 'job:' + uuid.comb(),
        name: faker.name.jobTitle()
      })
    }
    await axios.post('/_bulk_docs', { docs: jobs })
  }

  if (!people.length) {
    for (let i = 0; i < peopleCount; i++) {
      const companyIndex = Math.floor(Math.random() * Math.floor(companiesCount))
      const jobIndex = Math.floor(Math.random() * Math.floor(jobsCount))
      const company = companies[companyIndex]
      const job = jobs[jobIndex]
      people.push({
        _id: 'person:' + uuid.comb(),
        avatar: faker.internet.avatar(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        company: company._id || company.id,
        job: job._id || job.id
      })
    }
    await axios.post('/_bulk_docs', { docs: people })
  }
}
