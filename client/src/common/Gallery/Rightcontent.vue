<template>
  <div class="Rightcontent">
    <div class="send" @click="sendinfo">
      <span>
        <h3>发送</h3>
      </span>
    </div>
    <div class="chart">
      <span class="first">
        <h3>图形类:</h3>
      </span>
      <span class="second" v-for="(item, i) in this.imgkey[0]" :key="i" @click="selectchart(item)" :class="{'Color':mgeColor}">
        <p>{{ item }}</p>
        </span>

    </div>
    <div class="layout">
      <span class="first"><h3>可视化布局:</h3></span>
      <span class="second" v-for="(item, i) in this.imgkey[2]" :key="i"
        ><p>{{ item }}</p></span
      >
      <!-- <span></span> -->
    </div>
    <div class="colorboard">
      <div style="display: flex;flex-direction: column;align-items: flex-start;margin: 2vw;">
        <h3>调色板</h3>
        <div v-for="(item,i) in this.imgkey[0]" :key="`color${i}`">
          <span>{{item}}:<input :ref="`chartColor${i}`" type="color" @input="setChartColor(i)" style="height: 30px;margin-left: 1rem"></input></span>
        </div>
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
      // pwdColor: false
    };
  },
  computed: {
    ...mapState(["imgkey"]),
  },
  mounted() {

  },
  methods: {
    sendinfo(){
      // console.log(this.imgkey[0]);
      //调用发送图表类型的接口
      if(this.imgkey.length > 0 ){
        this.$store.commit("galleryCharts", this.imgkey[0])
        this.$store.commit('galleryColor', this.imgkey[1])
        this.$router.replace('/blue')
      }else {
        alert('未选择图表!!!')
      }

    },
    selectchart(index){
      console.log(index)
    //   if(this.mgeColor == true)
    //   {
    //     this.mgeColor = false
    //     this.pwdColor = true
    //   }
    //   else{
    //     this.mgeColor = true
    //     this.pwdColor = false
    //   }
    },
    setChartColor(index){
      let dom = this.$refs[`chartColor${index}`]
      this.$store.commit('setImgKeyColorValue', {index:index, value:dom[0].value})
    }
  },
};
</script>


  <style scoped>
.Rightcontent {
  flex: 0.3 0 200px;

  display: flex;
  flex-direction: column;
  /* background-color: rgb(11, 86, 61, 1); */
  margin-right: 0.5vw;
  position: relative;
}
.chart {
  flex: 1;
  background-color: rgb(239, 246, 253);
  /* position: relative;
  width: 100%; */

}
.layout {
  flex: 1;
  background-color: rgb(239, 246, 253);
  /* position: relative;
  width: 100%;*/
}
.colorboard {
  flex: 3;
  background-color: rgb(239, 246, 253);
  width: 100%;
}
.first {
  float: left;
  margin: 2vw;
  margin-right: 0.5pt;
}
p {
  font-size: 30px;
  font-family: Calibri;
  font-weight: 350;
}
.second {
  float: left;
  /* margin: 0.5pt; */
  margin-top: 2vw;
  margin-left: 0.5vw;

}
.Color{
      background-color: #ffd700;
      color: #fff;
    }
.send {
  background-color: #ffd700;
  font-size: large;
  /* width: 30%; */
}
</style>
