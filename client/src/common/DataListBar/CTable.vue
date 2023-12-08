<template>
  <div style="width: 99%;height: 200px;padding: 0px;">
    <el-table :data="tableData" height="200">
      <el-table-column v-if="selection" type="selection" width="55"></el-table-column>
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
      selection:true
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
  }
}
</script>

<style scoped>

</style>
