<template>
  <div class="Leftcontent">
    <div
      class="item"
      v-for="index in this.covidkey"
      :key="index"
      @click="selectclick(index)"
    >
      <el-tooltip  placement="top"  effect="light">
        <div slot="content" ref='content' style="max-width:300px;">
          <span>Chart Type:</span>{{getChartType(index)}}<br>
          <span>Publisher Type:</span>{{getPublisherType(index)}}<br>
          <!-- <span>context:</span>{{getContext(index)}}<br> -->
          <a :href="getOriginal(index)" target="_blank" >原始网站   </a>
          <a :href="getNew(index) " target="_blank" >最新归档网站</a><br>
          
          </div>
      <img :src="require('../../papers_img/' + index + '.jpg')" :id="genId(index)" class="imgTool" />
    </el-tooltip>
    </div>
  </div>
</template>
  
  <script>
import data from "../../../static/covid_data_e.json";
import layout from "../../../static/covid_data_layout.json";
import dashboardWebList  from "../../../static/dashboardWebList.json"
import { mapState } from "vuex";
import {themeColor} from "../ColorExtraction/colorExtraction";
export default {
  name: "Leftcontent",
  components: {},
  data() {
    return {
      chartdata: {},
      datakey: [],
      // colorData: ["black", "pink", "blue"],
    };
  },
  computed: {
    ...mapState(["covidkey"]),
  },
  mounted() {
    console.log(data);
    let key = Object.getOwnPropertyNames(data);
    console.log(key);
    this.datakey = this.covidkey;
  
  },
  methods: {
    
    getOriginal(index) {
      // console.log(index)
      // console.log(dashboardWebList.length)
      if(index <= dashboardWebList.length)
        return dashboardWebList[index].originalWeb;
      else
        return "无"
},

getNew(index) {
  if(index <= dashboardWebList.length)
       return dashboardWebList[index].newWeb;
      else
        return "无"
  
},
    genId(index) {
      return "img" + index
    },
    getChartType(index){
      return data[index]['Visual Forms'] +"\n" ;
    },
    getPublisherType(index){
      return data[index]['publisher-name'] +"\n"
    },
    getContext(index){
      return data[index]['context']
    },
    // selectclick(index) {
    // console.log()
    //   let senddata = [];
    //   let layoutlist = [];
    //   layoutlist.push(layout[index]);
    //   senddata.push(data[index]["Visual Forms"].split(","));
    //   senddata.push(layoutlist);
    //   this.$store.commit("getimgkey", senddata);
    // },
      selectclick(index) {
    
      //   console.log(data[index]["图形类"].split(','));
      let senddata = [];
      let layoutlist = [];

      layoutlist.push(layout[index]);
      senddata.push(data[index]["Visual Forms"].split(","));
      //生成默认的颜色数组
      // let defaultColor = new Array(senddata[0].length).fill("#ffffff")
      //通过id获取img对象
      let img = document.getElementById("img" + index)
      //colors：提取出来的颜色
      let colors = themeColor(img)
      colors = colors.map(color => "#" + ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1))
      senddata.push(colors)
      senddata.push(layoutlist);
      // console.log(senddata);
      this.$store.commit("getimgkey", senddata);
    },
  },
};
</script>
  
  
  <style scoped>
.Leftcontent {
  flex: 0.79 0 700px;
  display: flex;
  margin-left: 1vw;
  margin-right: 5px;
  /* background-color: rgba(239,246,253); */
   background-color: rgb(242,242,242);

  flex-wrap: wrap;
  overflow: auto;
}
.item {
  width: 25%;
  height: 10vw;
  padding-bottom: 10px;
  padding-left: 10px;
}
img{
    border-radius: 5px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 2px 2px 2px rgba(0,0,0,.5);
}
a,span{
  color:steelblue
}

</style>
  