<template>
  <q-page padding style="min-width: 600px">
      <div class="q-pa-md">
        <q-card flat class="my-card">
          <q-tabs 
            dense
            v-model="tab" 
            indicator-color="blue-9"
            active-color="blue-9"
            class="text-grey-10"
            >
            <q-tab icon="keyboard_voice" label="Broadcast" name="broadcast" />
            <q-tab icon="manage_accounts" label="Manage Client" name="manage_client" />
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
                      icon="mic"
                      @click="startMicOff()"
                    />
                    <div class="row justify-center text-overline">
                      {{ statusMessage.mic_on }}
                    </div>
                  </q-card-section>

                  <q-card-section v-else class="text-center">
                    <q-btn
                      class="shadow-1"
                      size="35px"
                      round
                      color="green-6"
                      icon="mic_off"
                      @click="startMicOn()"
                    />
                    <div class="row justify-center text-overline">
                      {{ statusMessage.mic_off }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
                  
            </q-tab-panel>

            <q-tab-panel name="manage_client">
              <TableClient/>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
  </q-page>
</template>

<script>
import TableClient from "src/components/TableClient.vue"
export default {
  name: 'PopupPage',
  components: { TableClient },
  data() {
    return {
      statusMessage: {
        mic_on: 'STOP',
        mic_off: 'Press to Start Announce '
      },
      tab: "broadcast",
      status: 'Press to Start Announce',
      isMicOn: false
    };
  },

  methods: {
    startMicOn() {
      return this.isMicOn = true;
    },
    startMicOff() {
      return this.isMicOn = false;
    }
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
