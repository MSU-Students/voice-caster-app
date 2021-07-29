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
                  class="btn-fixed-width"
                  rounded
                  size="10px"
                  v-if="isConnected == false"
                  :loading="showConnectLoader"
                  color="green"
                  text-color="white"
                  label="connect"
                  @click.prevent="connect"
                >
                  <template v-slot:loading>
                    Connecting...
                  </template>
                </q-btn>
                <q-btn
                  v-else
                  rounded
                  :loading="showConnectLoader"
                  size="10px"
                  color="negative"
                  text-color="white"
                  label="Disconnect"
                  @click.prevent="disconnect"
                >
                  <template v-slot:loading>
                    <q-spinner-ios v-if="showConnectLoader" class="on-left" />
                    Connecting...
                  </template>
                </q-btn>
                <div v-if="isConnected == false" class="q-ml-md">
                  <q-badge outline color="red" label="Not connected"></q-badge>
                </div>
                <div v-else class="q-ml-md">
                  <q-badge outline color="green" label="Conncected"></q-badge>
                </div>
                <q-space />
                <div v-if="isMicOn == false" class="text-overline">
                  <q-badge color="dark" label="Off Air"></q-badge>
                </div>
                <div v-else class="text-overline">
                  <q-badge color="yellow-14" label="On Air"> </q-badge>
                </div>
              </q-toolbar>

              <q-card class="my-card " flat>
                <q-card-section v-if="isMicOn" class="text-center">
                  <div>
                    <div>
                      <div v-if="isPause == false">
                        <q-btn
                          round
                          outline
                          class="text-red shadow-1 shadow-24"
                          color="white"
                          icon="mic_off"
                          size="30px"
                          @click="pause()"
                        >
                          <q-tooltip
                            content-class="bg-primary text-white"
                            anchor="top middle"
                            self="bottom middle"
                          >
                            Click to pause broadcasting.
                          </q-tooltip>
                        </q-btn>

                        <div class=" text-center q-pt-xs text-overline">
                          STOP
                        </div>
                      </div>
                      <div v-else>
                        <q-btn
                          round
                          outline
                          size="30px"
                          class="text-green shadow-1"
                          icon="play_arrow"
                          @click="resume()"
                        >
                          <q-tooltip
                            content-class="bg-primary text-white"
                            anchor="top middle"
                            self="bottom middle"
                          >
                            Click to resume broadcasting.
                          </q-tooltip>
                        </q-btn>
                        <div class=" text-center q-pt-xs  text-overline">
                          RESUME
                        </div>
                      </div>
                    </div>
                    <div class="q-pt-sm">
                      <q-btn-group outline rounded spread>
                        <q-btn color="blue-6" label="Notice Alert" icon="campaign" />
                        <q-btn
                          color="red"
                          label="Emergency Alert"
                          icon="warning"
                        />
                      </q-btn-group>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section v-else class="text-center">
                  <q-btn
                    :disable="isDisabledMic"
                    outline
                    class="shadow-1"
                    size="30px"
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
                      id="audioInput"
                      class="full-width"
                      :options="microphones"
                      outlined
                      label="Select Microphone"
                      v-model="selectedDevice"
                      @input="setConnectedDevices($event)"
                    />
                    <q-btn
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
import serverConnectionService from "../services/server-connection.service.js";
import audioStreamingService from "../services/audio-streaming.service.js";

export default {
  name: "PopupPage",
  components: { TableClient },
  data() {
    return {
      statusMessage: {
        mic_on: "Click to STOP",
        mic_off: "Press to Start Announce "
      },
      sounds: {
        notice: "src/assets/audio/Alarm.mp3",
        emergency: "src/assets/audio/notice.mp3"
      },
      tab: "broadcast",
      status: "Press to Start Announce",
      isMicOn: false,
      showAudioLoader: false,
      microphones: [],
      selectedDevice: "",
      audioStreamSelected: undefined,
      isDisabled: false,
      isDisabledMic: true,
      received_messages: [],
      send_message: null,
      isConnected: false,
      showConnectLoader: false,
      server_ip: {},
      isPause: false
    };
  },
  mounted() {
    this.getIP();
  },
  async created() {
    const devices = await microphoneSettingService.devices();
    this.microphones = devices;
    this.selectedDevice = devices[0];
  },

  methods: {
    async pause() {
      this.isPause = true;
      await audioStreamingService.pause();
    },
    async resume() {
      this.isPause = false;
      await audioStreamingService.resume();
    },
    async connect() {
      this.showConnectLoader = true;
      this.getIP();
      const connected = await serverConnectionService.connect(
        this.server_ip.ipAddress,
        this.server_ip.port
      );
      if (connected.type != "close") {
        setTimeout(() => {
          this.notifyMessage("Connected to the server", "green-6", "check");
          this.isConnected = true;
          this.isDisabledMic = false;
          this.showConnectLoader = false;
        }, 2000);
      } else {
        setTimeout(() => {
          this.isConnected = false;
          this.showConnectLoader = false;
          this.notifyMessage(
            "ERROR! Can't connect to the server.",
            "red",
            "error"
          );
        }, 2000);
      }
    },

    async disconnect() {
      await serverConnectionService.disconnect();
      this.isConnected = false;
      this.isMicOn = false;
      this.isDisabledMic = true;
      this.isDisabled = false;
    },

    sendAudioToServer(val) {
      serverConnectionService.send(val);
    },

    async startMicOn() {
      this.isDisabled = true;
      this.isMicOn = true;
      audioStreamingService.start2(audio => {
        this.sendAudioToServer(audio);
      });
    },

    async startMicOff() {
      this.isPause = false;
      await audioStreamingService.stop();
      this.isDisabled = false;
      this.isMicOn = false;
    },

    async testMic() {
      this.showAudioLoader = true;
      const recordStream = await audioRecorderService.recordAudio();
      this.showAudioLoader = false;
    },

    async setConnectedDevices(device) {
      const selectedDevice = await microphoneSettingService.setConnectedDevices(
        device
      );
      this.audioStreamSelected = selectedDevice;
    },
    async getIP() {
      const ip = await serverConnectionService.getIpAddress();
      this.server_ip = ip;
    },
    notifyMessage(msg, color, icon) {
      this.$q.notify({
        message: msg,
        color: color,
        timeout: 1000,
        icon: icon,
        position: "center"
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
