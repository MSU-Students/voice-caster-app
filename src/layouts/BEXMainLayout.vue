<template>
    <q-layout view="lHh Lpr lFf">
      <Header/>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from "src/components/Header.vue";
export default {
  components: { Header }
}
</script>