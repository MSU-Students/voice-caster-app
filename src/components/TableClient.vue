<template>
 <div class="q-pt-xs">
    <q-card flat class="my-card">
      <q-table
        class="my-sticky-column-table"
        :data="clientList"
        :columns="columns"
        row-key="client"
        :filter="filter"
      > 
        <template v-slot:top-right>
          <q-input rounded outlined dense debounce="300" v-model="filter" placeholder="Search colleges/offices...">
            <template v-slot:append>
              <q-icon v-if="filter !== ''" name="close" @click="filter = ''"/>
              <q-icon v-else name="search"/>  
            </template>
          </q-input>
        </template>
      </q-table>
        
    </q-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import officeDBService from "../services/office-db.service.js"

export default {

  data() {
    return {
      filter: '',
      columns: [
        { name: 'client', required: true, label: 'Colleges/Offices', align: 'left', field: 'client', sortable: true, headerClasses: 'bg-cyan-11 text-black'},
        { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true }
      ],
      clientList: [],
      
    };
  },

  async mounted() {
      const office = await officeDBService.displayOffices();
      this.clientList = office;
  },
  computed: {
      ...mapState('broadcaster', ['area'])
  }
}
</script>

<style lang="sass">
.my-sticky-column-table

  thead tr:first-child th:first-child
    background-color: #fff

  td:first-child
    background-color: #f5f5dc
</style>