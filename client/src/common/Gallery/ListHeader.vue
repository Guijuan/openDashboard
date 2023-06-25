<template>
  <div class="ListHeader">
    <div class="select">
      <el-form ref="ni" :model="form" label-width="80px">
        <br>
        <el-form-item>
          <span style="display: inline-block; margin-right: 10px;">Publisher Types</span>
          <el-select v-model="form.publishertype" placeholder="请选择活动区域" :popper-append-to-body="false" style="width: 30%;">
            <el-option
              v-for="(item, i) in publisher"
              :key="i"
              :label="item"
              :value="item"
              style=" font-size:16px;font-family:'Times New Roman'"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>


    <div class="select">
      <br>
      <span style="display: inline-block; margin-right: 10px;">Interactions</span>
      <el-popover placement="bottom" width="400" trigger="click">
        <el-checkbox-group
          v-model="checktask"
        >
          <el-checkbox v-for="(task, iii) in tasks" :label="task" :key="'task-' + iii"  style="font-size:18px;font-family:'Times New Roman'">{{
            task
          }}</el-checkbox>
        </el-checkbox-group>
        <el-button slot="reference">All</el-button>
      </el-popover>
    </div>

    <div class="select">
      <br>
      <span style="display: inline-block; margin-right: 10px;">Visual Forms</span>
      <el-popover placement="bottom" width="400" trigger="click">
        <el-checkbox-group
          v-model="checkedchart"
        >
          <el-checkbox v-for="(chart, iii) in charttype" :label="chart" :key="'chart-' + iii"  style="font-size:18px;font-family:'Times New Roman'">{{
            chart
          }}</el-checkbox>
        </el-checkbox-group>
        <el-button slot="reference">All</el-button>
      </el-popover>
    </div>

    <div class="select">
      <div class="buttom-span" @click="selectcontent"><span>Filter</span></div>
    </div>
  </div>
</template>

<script>
import data from "../../../static/covid_data_e.json";
import { mapState } from "vuex";
export default {
  name: "ListHeader",
  props: {
    msg: String,
  },
  data() {
    return {
      checkedchart: [],
      checktask:[],
      form: {
        publishertype: "ALL",
      },
      publisher: [
        "none",
        "News Media",
        "Individual",
        "Organization",
        "Government",
        "Company",
        "Social Media",
        "Academic",
      ],
      tasks:["select","tooltips","zoom","pan","reconfigure","explore","re-encode","animation"],
      charttype: [
        "none",
        "Map",
        "Table",
        "Bar",
        "Line",
        "Pie",
        "Scatter Plot",
        "Sunburst",
        "node-link",
      ],
    };
  },
  mounted() {
    let key = Object.getOwnPropertyNames(data);
    this.$store.commit("getcovidkey", key)
    
    this.init();
  },
  methods: {
    selectcontent() {
      console.log(this.checkedchart);
      let keydata = [];
      let publisher = []
      let chart = []
      console.log(data)
      for (let i in data) {
        if (data[i]["publisher-type"].search(this.form.publishertype) != -1) {
          keydata.push(i);
          continue;
        }
        for(let j in this.checktask){
          if (data[i]["Interactions"].search(this.checktask[j]) != -1) {
          keydata.push(i);
        }
        }
        for(let j in this.checkedchart){
          if (data[i]["Visual Forms"].search(this.checkedchart[j]) != -1) {
            keydata.push(i);
        }
        }
      }

      this.$store.commit("getcovidkey", keydata);
    },
    init() {
      console.log(this.checkedchart);
    },
  },
};
</script>


<style scoped>
.ListHeader {
  height: 10%;
  text-align: center;
  line-height: 30px;
  font-family:'Times New Roman';
  display: flex;
  background-color: #9599a6;
}
.select {
  flex: 1 0 200px;
  margin: -0.2vw;
  font-family: 'Times New Roman';
  font-size:16px;
  
}
.publisherType {
  
}
.buttom-span {
  width: 120px;
  height: 40px;
  line-height: 40px;
  margin-top: 1.7vw;
  margin-left: 6vw;
  background-color: rgb(142,170,255);
  float: left;
  /* font-family: sans-serif; */
  font-family:'Times New Roman';
  border-radius: 8px;
  font-size:18px;
  color:white;
  /* margin-left: 6vw; */
}
</style>
