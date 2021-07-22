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
        @click="dialog = true"
        no-caps
      >
      </q-btn>
    </q-toolbar>
    <q-dialog
      v-model="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="text-dark" style="width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-weight-bold">Server Setting</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="save()" class="q-gutter-xs">
            <q-input
              dense
              filled
              v-model="server.ipAddress"
              label="IP Address"
              hint="ex. 192.168.100.1"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please type something.'
              ]"
            />

            <q-input
              dense
              filled
              v-model="server.port"
              label="Port"
              hint="ex. 8080"
              lazy-rules
              :rules="[
                val => (val !== null && val !== '') || 'Please type port #.'
              ]"
            />

            <div>
              <q-btn
                :loading="showSaveLoader"
                class="full-width"
                label="Save"
                type="submit"
                color="indigo"
              >
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-header>
</template>
<script>
import serverConnectionService from "../services/server-connection.service.js";
export default {
  data() {
    return {
      dialog: false,
      showSaveLoader: false,
      server: {
        ipAddress: null,
        port: null
      },
      server_ip: {}
    };
  },
  created() {
    serverConnectionService.isItemExist("server_ip");
  },
  methods: {
    async save() {
      console.log("save!");
      this.showSaveLoader = true;
      await serverConnectionService.addServerIP("server_ip", this.server).then(() => {
        setTimeout(() => {
          this.showSaveLoader = false;
          this.notifyMessage("IP Address and Port Saved.", "primary");
        }, 2000);
      });
    },
    notifyMessage(msg, color) {
      this.$q.notify({
        message: msg,
        color: color,
        timeout: 1000,
        icon: "check_circle_outline",
        position: "center"
      });
    }
  }
};
</script>
