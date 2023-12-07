<template>
  <el-table :data="tableData">
    <el-table-column v-if="selection" type="selection" width="55"></el-table-column>
    <el-table-column v-for="key in columns"
                     :prop="key"
                     :label="key"
    >
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data(){
    return{
      columns:[],
      selection:false
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
