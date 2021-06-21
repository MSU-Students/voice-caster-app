<template>
  <q-page padding style="min-width: 600px">
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
              <q-card class="my-card" flat>
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
                      v-model="selectedMic"
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
                      :loading="record_loading"
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
      record_loading: false,
      microphones: [],
      selectedMic: "",
      audioStreamSelected: undefined,
      isDisabled: false
    };
  },

  async created() {
    this.getConnectedDevices();
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
      const mediaRecorder = new MediaRecorder(this.audioStreamSelected);
      mediaRecorder.start();
      this["record_loading"] = true;
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        console.log(audio);
        audio.play();
      });

      setTimeout(() => {
        mediaRecorder.stop();
        this["record_loading"] = false;
      }, 3000);
    },

    async getConnectedDevices(val) {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const listMic = devices.filter(device => device.kind === "audioinput");
      this.microphones = listMic.map(d => {
        return d.label;
      });
    },

    async setConnectedDevices(device) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const listMic = devices.filter(device => device.kind === "audioinput");
      let selectedDevice = listMic.find(d => d.label == device);
      console.log(selectedDevice);
      const constraints = {
        audio: {
          deviceId: selectedDevice.deviceId
            ? { exact: selectedDevice.deviceId }
            : undefined
        }
      };
      this.audioStreamSelected = await navigator.mediaDevices.getUserMedia(
        constraints
      );
    }
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
