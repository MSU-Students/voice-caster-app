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
                Broadcaster Page Content
                <q-card class="my-card">
                  My card for table
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
      tab: "broadcast"
    };
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
