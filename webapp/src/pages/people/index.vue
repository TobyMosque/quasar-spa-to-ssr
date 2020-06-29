<template>
  <q-page class="flex">
    <q-table
      title="People"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      class="full-width"
      row-key="id"
    >
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
              <q-btn icon="save" round color="positive" :disable="!props.row.pending" @click="save(props.row)" />
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
  </q-page>
</template>

<script src="./index.js">
</script>
