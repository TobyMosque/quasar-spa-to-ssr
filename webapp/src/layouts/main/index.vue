<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Quasar - SPA to SSR
        </q-toolbar-title>
        {{user.name}} | Company:
        <q-select v-model="company" :options="options" emit-value map-options filled dense class="q-pl-sm text-white" style="min-width: 300px;" ></q-select>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script src="./index.js">
</script>
