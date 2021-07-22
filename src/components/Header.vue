<template>
  <q-header
    style="background: linear-gradient(145deg, #15503e 15%, #133154 70%);"
  >
    <q-toolbar>
      <q-avatar size="50px">
        <img src="~assets/VoiceCasterBEX.png" />
      </q-avatar>
      <q-toolbar-title>Voice Caster</q-toolbar-title>
      <q-btn
        class="text-overline"
        outline
        rounded
        icon="settings"
        color="white"
        label="Manage Network"
        @click="() => $router.replace('/office')"
        no-caps
      >
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
<script>
export default {
  
}
</script>
