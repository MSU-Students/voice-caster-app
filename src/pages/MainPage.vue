<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card flat class="my-card">
        <q-tabs
          align="justify"
          dense
          v-model="tab"
          indicator-color="blue-9"
          active-color="blue-9"
          class="text-grey-10"
        >
          <q-tab icon="keyboard_voice" label="Broadcast" name="broadcast" />
          <q-tab
            icon="manage_accounts"
            label="Manage Client"
            name="manage_client"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="broadcast">
            <div class="q-pa-sm">
              <q-toolbar>
                <q-btn
                  push
                  color="white"
                  text-color="negative"
                  label="connect server"
                />
                <div class="q-ml-md">
                  <q-badge outline color="red" label="Not connected"></q-badge>
                </div>
                <q-space />
                <div class="text-overline">
                  Status:
                  <q-badge color="yellow-14" label="On Air"></q-badge>
                </div>
              </q-toolbar>
              <q-card class="my-card q-pt-xs" flat>
                <q-card-section v-if="isMicOn" class="text-center">
                  <q-btn
                    class="shadow-24"
                    size="35px"
                    round
                    color="red-6"
                    icon="mic_off"
                    @click="startMicOff()"
                  />
                  <div class="row justify-center text-overline">
                    {{ statusMessage.mic_on }}
                  </div>
                </q-card-section>

                <q-card-section v-else class="text-center">
                  <q-btn
                    outline
                    class="shadow-1"
                    size="35px"
                    round
                    color="green-6"
                    icon="mic"
                    @click="startMicOn()"
                  />
                  <div class="row justify-center text-overline">
                    {{ statusMessage.mic_off }}
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-subtitle2 text-blue-grey-9 q-pb-sm">
                    Microphone:
                  </div>
                  <div class="q-gutter-sm">
                    <q-select
                      :disable="isDisabled"
                      id="audioInput"
                      class="full-width"
                      :options="microphones"
                      outlined
                      label="Select Microphone"
                      v-model="selectedDevice"
                      @input="setConnectedDevices($event)"
                    />
                    <q-btn
                      :disable="isDisabled"
                      no-caps
                      outline
                      rounded
                      color="blue-9"
                      icon="mic"
                      label="Test Mic"
                      style="width: 140px"
                      class="full-width"
                      :loading="showAudioLoader"
                      @click="testMic()"
                    >
                      <template v-slot:loading>
                        <q-spinner-bars class="on-left" />
                        Recording...
                      </template>
                      <q-tooltip
                        content-class="bg-yellow-11 text-black"
                        anchor="top middle"
                        self="bottom middle"
                      >
                        Click Test Mic to make sure others can hear you!
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="manage_client">
            <TableClient />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import TableClient from "src/components/TableClient.vue";
import audioRecorderService from "../services/audio-recorder.service.js";
import microphoneSettingService from "../services/microphone-setting.service.js";
export default {
  name: "PopupPage",
  components: { TableClient },
  data() {
    return {
      statusMessage: {
        mic_on: "Click to STOP",
        mic_off: "Press to Start Announce "
      },
      tab: "broadcast",
      status: "Press to Start Announce",
      isMicOn: false,
      showAudioLoader: false,
      microphones: [],
      selectedDevice: "",
      audioStreamSelected: undefined,
      isDisabled: false
    };
  },

  async created() {
    const devices = await microphoneSettingService.devices();
    this.microphones = devices;
    console.log("devices: ", devices);
    this.selectedDevice = devices[0];
  },

  methods: {
    startMicOn() {
      this.isDisabled = true;
      return (this.isMicOn = true);
    },

    startMicOff() {
      this.isDisabled = false;
      return (this.isMicOn = false);
    },

    async testMic() {
      await audioRecorderService.recordAudio().then(() => {
        this.showAudioLoader = true;
      });
      setTimeout(() => {
        this.showAudioLoader = false;
      }, 3000);
    },

    async setConnectedDevices(device) {
      const selectedDevice = await microphoneSettingService.setConnectedDevices(
        device
      );
      this.audioStreamSelected = selectedDevice;
    }
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
