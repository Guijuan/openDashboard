<template>
  <div class="Leftcontent">
    <div
      class="item"
      v-for="index in this.covidkey"
      :key="index"
      @click="selectclick(index)"
    >
      <el-tooltip  placement="top"  effect="light">
        <div slot="content" ref='content' style="max-width:300px;" class = "all">
          <span>Publisher:</span>{{getPublisher(index)}}<br>
          <span>Publisher Type:</span>{{getPublisherType(index)}}<br>
           <span>Visual Forms:</span>{{getChartType(index)}}<br>
          <span class = "website"><a :href="getOriginal(index)" target="_blank" >Link to website,</a></span>
          <span class = "website"><a :href="getNew(index) " target="_blank" > Link to archive</a><br></span>
          
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
import Publishers from "../../../static/publisher.json";
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
      let dat = data[index]['VisualForms'].replace("Encoding:","")
      return dat.replace(/\//g,",")+"\n" ;
    },
    getPublisherType(index){
      return data[index]['publisher-type'] +"\n"
    },
    getContext(index){
      return data[index]['context']
    },
    getPublisher(index){
      if(index <= Publishers.length)
        return Publishers[index]['publisher-name']
        else
        return null
    },
    
   
      selectclick(index) {
    
      let senddata = [];
      let layoutlist = [];
      layoutlist.push(layout[index]);
      let visform = data[index]["VisualForms"].split(':')
      senddata.push(visform[1].split('/'));
      
      //生成默认的颜色数组
      // let defaultColor = new Array(senddata[0].length).fill("#ffffff")
      //通过id获取img对象
      let img = document.getElementById("img" + index)
      //colors：提取出来的颜色
      let colors = themeColor(img)
      colors = colors.map(color => "#" + ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1))
      senddata.push(colors)
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
  color:steelblue;
  line-height: 1.4;
  font-family:'Times New Roman';
}
.all{
   font-family:'Times New Roman';
   font-size:18px;
}
.website{
  float: left;
}

</style>
  