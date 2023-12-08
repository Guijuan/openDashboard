<template>
  <div style="width: 99%;max-height:1000px;padding: 0px;overflow: auto">
    <el-table :data="tableData"
              @current-change="handleChange"
              highlight-current-row
    >
      <el-table-column v-for="key in columns" :key="key"
                       :prop="key"
                       :label="key"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data(){
    return{
      columns:[],
      selection:true,
      currentRow:null
    }
  },
  computed:{
    tableData(){
      let data = this.$store.state.commonData
      if(data.length > 0){
        this.columns = Object.keys(data[0])
      }
      console.log(data)
      return data
    }
  },
  methods:{
    handleChange(val){
      this.currentRow = val;
    }
  }
}
</script>

<style scoped>

</style>
