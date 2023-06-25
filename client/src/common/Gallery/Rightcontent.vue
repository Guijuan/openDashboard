<template>
  <div class="Rightcontent">
    <div class="choose">
      <div class="menu">
        <span>
          <h3>Chosen</h3>
        </span>
        
      </div>
      <br>
      <div
        class="second_menu"
        v-for="(item, index) in this.chart"
        :key="index"
        :class="[-1 == chart.indexOf(item) ? 'rolesOut' : 'Color']"
        @click="selectChart(item)"
      >
        {{ item }}
      </div>
    </div>
    <div class="chart">
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
      <div @click="addChart" class="third">添加</div>
    </div>


    <div class="colorboard">
      <div 
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin: 2vw;
        "
      >
        <h3>ColorBoard</h3>
        <br>
        <!-- 这是原先的，暂时注释掉了 -->
        <!-- <div v-for="(item,i) in this.imgkey[0]" :key="`color${i}`">
          <span>{{item}}:<input :ref="`chartColor${i}`" type="color" @input="setChartColor(i)" style="height: 30px;margin-left: 1rem"></input></span>
        </div> -->

        <!-- 这个临时改的，直接让所有颜色显示出来 -->
        <div v-for="(item, i) in this.imgkey[1]" :key="`color${i}`">
          <span
            >{{ item }}:<input
              :ref="`chartColor${i}`"
              :value="setColor(item)"
              type="color"
              @input="setChartColor(i)"
              style="height: 30px; margin-left: 1rem"
          /></span>
        </div>
        <!-- <div @click="addColor" class="third">添加</div> -->
      </div>
    </div>
  </div>
</template>

  <script>
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
    };
  },
  computed: {
    ...mapState(["imgkey"]),
  },
  mounted() {},
  methods: {
    setColor(item) {
      //为每个input标签设置颜色
      return item;
    },
    sendinfo() {
      // console.log(this.imgkey[0]);
      //调用发送图表类型的接口
      if (this.imgkey.length > 0) {
        this.$store.commit("galleryCharts", this.imgkey[0]);
        this.$store.commit("galleryColor", this.imgkey[1]);
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
      let dom = this.$refs[`chartColor${index}`];
      this.$store.commit("galleryColor", {
        index: index,
        value: dom[0].value,
      });
    },
    addChart() {
      this.selectChart["chart"] = this.chart;
      this.$store.commit("galleryCharts", this.selectChart);
    },
  },
};
</script>


  <style scoped>
.Rightcontent {
  flex: 0.2 0 200px;
  display: flex;
  flex-direction: column;
  margin-right: 0.3vw;
  position: relative;
  overflow: auto;
}
.choose {
  flex: 1;
  background-color: white;
  font-size: 16px;
  font-family: "Times New Roman";
}
.choose h3{
  margin-left: 1vw;
  
}
.chart {
  flex: 1;
  background-color: white;
  font-size: 16px;
  font-family: "Times New Roman";
}
.menu{
  float: left;
}

.colorboard {
  flex: 3;
  background-color: white;
  width: 100%;
  font-size: 16px;
  font-family: "Times New Roman";
  
}
.colorboard h3{
  margin-left: 1vw;
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
.third {
  margin-top: 2vw;
  float: left;
  width: 40%;
  height: 30px;
  border: 1px solid rgb(7, 7, 7);
  background-color: rgb(142,170,255);
  border-radius: 5px;
  line-height: 30px;
  margin-left: 1vw;
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
</style>
