<template>
  <q-page padding>
    <div class="q-pt-md">
      <Header/>
      <div class="q-pa-md">
        <q-card flat class="my-card">
          <q-tabs v-model="tab" class="text-purple ">
            <q-tab icon="mic" label="Broadcast" name="one" />
            <q-tab icon="people" label="Manage Client" name="two" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="one">
                <div class="q-pa-sm">
                Broadcaster Page Content
                <q-card class="my-card">
                  My card for table
                </q-card>
              </div>
                  
            </q-tab-panel>

            <q-tab-panel name="two">
              <div class="q-pa-sm">
                Manage Client Content
                <q-card class="my-card">
                  My card for table
                </q-card>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Header from "src/components/Header.vue";
export default {
  // name: 'Popup',
  components: { Header },
  data() {
    return {
      tab: "one"
    };
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
