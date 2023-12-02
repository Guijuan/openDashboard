<template>
  <div class="Rightcontent">

    <div class="choose">
      <vs-divider color="dark" >Navigation Bar</vs-divider>
      <div class="menu">
        <span>
          <h3>Navigation Bar</h3>
        </span>
      </div>
      <br>
      <el-row :gutter="20">
         <el-col :span="10"><div class="grid-content bg-purple">
          <span style="display: inline-block; margin-left: 10px;">Publisher Types</span>
          </div></el-col>
         <el-col :span="10"><div class="grid-content bg-purple">
          <el-select v-model="form.publishertype" placeholder="请选择活动区域" :popper-append-to-body="false" style="width: 66%;">
            <el-option
              v-for="(item, i) in publisher"
              :key="i"
              :label="item"
              :value="item"
              style=" font-size:16px;font-family:'Times New Roman'"
            ></el-option>
          </el-select>
          </div></el-col>

      </el-row>

      <el-row :gutter="20">
         <el-col :span="10"><div class="grid-content bg-purple">
          <span style="display: inline-block; margin-left: -15px;">Interactions</span>
          </div></el-col>
         <el-col :span="10"><div class="grid-content bg-purple">
            <el-popover placement="bottom" width="400" trigger="click" >
        <el-checkbox-group
          v-model="checktask">
          <el-checkbox v-for="(task, iii) in tasks" :label="task" :key="'task-' + iii"  style="font-size:18px;font-family:'Times New Roman'">{{
            task
          }}</el-checkbox>
        </el-checkbox-group>
        <el-button slot="reference">All</el-button>
      </el-popover>
          </div></el-col>


      </el-row>
      <el-row :gutter="20">
         <el-col :span="10"><div class="grid-content bg-purple">
          <span style="display: inline-block; margin-left: -5px;">Visual Forms</span>
          </div></el-col>
         <el-col :span="10"><div class="grid-content bg-purple">
          <el-popover placement="bottom" width="400" trigger="click" >
        <el-checkbox-group
          v-model="checkedchart">
          <el-checkbox v-for="(chart, iii) in charttype" :label="chart" :key="'chart-' + iii"  style="font-size:18px;font-family:'Times New Roman'">{{
            chart
          }}</el-checkbox>
        </el-checkbox-group>
        <el-button slot="reference">All</el-button>
      </el-popover>
          </div></el-col>
      </el-row>







      <div class="buttom-span" @click="selectcontent"><span>Filter</span></div>
    </div>

    <div class="chart">
      <vs-divider border-style="solid" color="dark" >Dashboard Details</vs-divider>
      <span class="first">
        <h3>VisualForms</h3>
      </span>
      <br>
      <div
        class="second"
        v-for="(item, i) in this.imgkey[0]"
        :key="'chart-' + i"
        :class="[-1 == chart.indexOf(item) ? 'rolesOut' : 'Color']"
        @click="selectChart(item)"
      >
        {{ item }}
      </div>

    </div>


    <div class="colorboard">
      <div >
        <span class="colorTitle">
          <h3>ColorBoard</h3>
      </span>
        <br>
        <!-- 这是原先的，暂时注释掉了 -->
        <!-- <div v-for="(item,i) in this.imgkey[0]" :key="`color${i}`">
          <span>{{item}}:<input :ref="`chartColor${i}`" type="color" @input="setChartColor(i)" style="height: 30px;margin-left: 1rem"></input></span>
        </div> -->

        <!-- 这个临时改的，直接让所有颜色显示出来 -->
        <div class="coloritem" v-for="(item, i) in this.imgkey[1]" :key="`color${i}`" >
          <span style="font-family: monospace; font-size: 1vw">{{ item }}:<input
              :ref="`chartColor${i}`"
              :value="setColor(item)"
              type="color"
              @input="setChartColor(i)"
              style="height: 25px; margin-left: 1rem; "
              /></span>
        </div>
        <!-- <div @click="addColor" class="third">添加</div> -->
      </div>
    </div>
    <div @click="addChart" class="AddButton">Add to Palette</div>
  </div>
</template>

  <script>
import data from "../../../static/covid_data_e.json";
import { mapState } from "vuex";
export default {
  name: "Rightcontent",
  components: {},
  data() {
    return {
      chartdata: {},
      mgeColor: false,
      className: "Color",
      chart: [],
      color: [],
      selectIndex: {
        chart: [],
        color: [],
      },
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
  computed: {
    ...mapState(["imgkey"]),
  },
  mounted() {
    let key = Object.getOwnPropertyNames(data);
    this.$store.commit("getcovidkey", key)
    console.log(this.imgkey)
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
          if (data[i]["VisualForms"].search(this.checkedchart[j]) != -1) {
            keydata.push(i);
        }
        }
      }
      this.$store.commit("getcovidkey", keydata);
    },
    setColor(item) {
      //为每个input标签设置颜色
      return item;
    },
    sendinfo() {
      // console.log(this.imgkey[0]);
      //调用发送图表类型的接口
      if (this.imgkey.length > 0) {
        // this.$store.commit("galleryCharts", this.imgkey[0]);
        // this.$store.commit("galleryColor", this.imgkey[1]);
        this.$router.replace("/blue");
      } else {
        alert("未选择图表!!!");
      }
    },
    selectChart(index) {
      if (this.chart.indexOf(index) == -1) {
        console.log("元素不存在");
        this.chart.push(index);
      } else {
        console.log("元素已经存在");
        this.chart.splice(this.chart.indexOf(index), 1);
      }
    },
    setChartColor(index) {
      console.log(index)
      let dom = this.$refs[`chartColor${index}`];
      console.log()
      this.imgkey[1][index] = dom[0].value
    },
    addChart() {
      console.log(this.chart)
      this.$store.commit('galleryColor', this.imgkey[1])
      this.$store.commit("galleryCharts", this.chart)
      this.$router.replace('/blue')
    },
  },
};
</script>


  <style scoped>
.Rightcontent {
  flex: 0.2 1 200px;
  display: flex;
  width: 100%;
  height: 100%;
  float: left;
  flex-direction: column;
  margin-right: 0.3vw;
  position: relative;
  overflow: auto;
  background-color: white;

}
.Rightcontent::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.vs-divider {
  background-color: white;
  height: 25px;
}
.choose {
  flex: 1;
  width: 100%;
  float: left;
  background-color: white;
  font-size: 16px;
  font-family: "Times New Roman";
}
.choose h3{
  margin-left: 1vw;

}
.buttom-span {
  width: 120px;
  height: 30px;
  line-height: 30px;
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
.chart {
  flex: 1;
  width: 100%;
  float: left;
  background-color: white;
  font-size: 16px;
  font-family: "Times New Roman";
}
.menu{
  float: left;
}

.colorboard {
  flex: 3;
  width: 100%;
  float: left;
  background-color: white;
  width: 100%;
  font-size: 16px;
  font-family: "Times New Roman";

}
.colorboard h3{
  margin-left: 1vw;
  margin-bottom: 1vw;
}
.first {
  float: left;
  margin-top: 1vw;
  margin-left: 1vw;
  height:30px
}
p {
  font-size: 30px;
  font-family: Calibri;
  font-weight: 350;
}
.second {
  float: left;
  margin-left: 0.3vw;
  width: 30%;
  height: 25px;
  line-height: 25px;
  border: 1px solid black;
  border-radius: 5px;
  margin-top: 1vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.second_menu {
  float: left;
  margin-bottom: 0.5vw;
  margin-left: 1vw;
  width: 30%;
  height: 25px;
  line-height: 25px;
  border: 1px solid black;
  border-radius: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.AddButton {
  margin-top: 2vw;
  float: left;
  width: 40%;
  height: 30px;
  margin-left: 6vw;
  border: 1px solid rgb(7, 7, 7);
  background-color: rgb(142,170,255);
  border-radius: 5px;
  line-height: 30px;
}
.Color {
  background-color: rgb(142,170,255);
  color: #fff;

}
.send {
  background-color: rgb(142,170,255);
  font-size: large;
  /* width: 30%; */
}
.coloritem{
            /*设置最小宽度，才会让元素排不下，导致换行排列*/
    width: 40%;
    height: 30px;
    margin-left: 0.5vw;
    margin-top: 5px;
    float: left;
}
.coloritem span{
  margin-left: 5px;
}
.colorTitle{
  float: left;
  margin-top: 0.5vw;
  height:30px
}
</style>
