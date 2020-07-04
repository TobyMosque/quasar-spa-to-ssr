<template>
  <q-page id="page-people" class="flex">
    <q-table
      title="People"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      class="full-width"
      row-key="id"
    >
      <template v-slot:top-right>
        <q-btn color="positive" label="new person" @click="show"></q-btn>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="_id" :props="props">
            <q-avatar>
              <img :src="props.row.read.avatar">
            </q-avatar>
          </q-td>
          <template v-if="props.row.mode === 'edit'">
            <q-td key="firstName" :props="props">
              <q-input type="text" filled v-model="props.row.edit.firstName" />
            </q-td>
            <q-td key="lastName" :props="props">
              <q-input type="text" filled v-model="props.row.edit.lastName" />
            </q-td>
            <q-td key="email" :props="props">
              <q-input type="email" filled v-model="props.row.edit.email" />
            </q-td>
            <q-td key="job" :props="props">
              <q-select filled v-model="props.row.edit.job" :options="options" map-options emit-value />
            </q-td>
            <q-td key="actions" :props="props" class="q-gutter-x-sm">
              <q-btn icon="undo" round :color="props.row.pending ? 'warning' : 'secondary'" @click="cancel(props.row)" />
              <q-btn icon="save" round color="positive" :disable="!props.row.pending" @click="update(props.row)" />
            </q-td>
          </template>
          <template v-if="props.row.mode === 'read'">
            <q-td key="firstName" :props="props">
              {{props.row.read.firstName}}
            </q-td>
            <q-td key="lastName" :props="props">
              {{props.row.read.lastName}}
            </q-td>
            <q-td key="email" :props="props">
              {{props.row.read.email}}
            </q-td>
            <q-td key="job" :props="props">
              {{jobById(props.row.read.job).name}}
            </q-td>
            <q-td key="actions" :props="props" class="q-gutter-x-sm">
              <q-btn icon="edit" round color="primary" @click="edit(props.row)" />
              <q-btn icon="delete" round color="negative" @click="remove(props.row)" />
            </q-td>
          </template>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="modal.show" :persistent="modal.pending">
      <q-card>
        <q-card-section>
          <h5 class="q-ma-none">Create Person</h5>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section class="row q-gutter-y-sm">
          <div class="full-width">
            <q-input type="text" label="First Name" filled v-model="modal.person.firstName" />
          </div>
          <div class="full-width">
            <q-input type="text" label="Last Name" filled v-model="modal.person.lastName" />
          </div>
          <div class="full-width">
            <q-input type="email" label="Email" filled v-model="modal.person.email" />
          </div>
          <div class="full-width">
            <q-select filled label="Job" v-model="modal.person.job" :options="options" map-options emit-value />
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn icon="undo" label="cancel" :color="modal.pending ? 'warning' : 'secondary'" @click="close" />
          <q-btn icon="save" label="save" color="positive" :disable="!modal.pending" @click="create" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script src="./index.js">
</script>

<style src="./index.sass" lang="sass">
</style>
