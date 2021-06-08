<template>
 <div class="q-pt-xs">
    <q-card flat class="my-card">
      <q-table
        class="my-sticky-column-table"
        :data="clientList"
        :columns="columns"
        row-key="client"
        selection="multiple"
        :selected.sync="selected"
        :filter="filter"
      >
       <template v-slot:header-selection="scope">
          <q-toggle v-model="scope.selected" />
        </template>

        <template v-slot:body-selection="scope">
          <q-toggle v-model="scope.selected" />
        </template>
        
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

export default {

  data() {
    return {
      filter: '',
      selected: [],
      columns: [
        { name: 'client', required: true, label: 'Colleges/Offices', align: 'left', field: 'client', sortable: true, headerClasses: 'bg-primary text-white'},
        { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
        { name: 'code', label: 'Code #', field: 'code', sortable: true, align: 'left' },
      ],
      clientList: [],
      
    };
  },

  mounted() {
      this.clientList = this.area;
  },
  computed: {
      ...mapState('broadcaster', ['area'])
  }
}
</script>

<style lang="sass">
.my-sticky-column-table

  max-width: 600px

  thead tr:first-child th:first-child
    background-color: #fff

  td:first-child
    background-color: #f5f5dc
</style>