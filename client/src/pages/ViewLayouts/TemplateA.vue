<template>
  <div class="layout">
    <div class="header">
      System Preview
    </div>
    <el-container v-on:dblclick="getData">
      <el-main @click.native="getData"  @contextmenu.prevent = "alert('触发了')">
              <grid-layout class="gridLayout"
                           :layout.sync="ttlayout"
                           v-if="!(typeof ttlayout==='undefined')"
                           :col-num="15"
                           :row-height="30"
                           :is-draggable="true"
                           :is-resizable="true"
                           :vertical-compact="true"
                           :use-css-transforms="true"
                           :style="{height:'800px'}"
              >
                <grid-item
                  v-for="item in ttlayout"
                  :key="item.i"
                  :static="item.static"
                  :x="item.x"
                  :y="item.y"
                  :w="item.w"
                  :h="item.h"
                  :i="item.i"
                  :id="item.i"

                  @resized="resizeEvent"
                  @move="moveEvent"
                >
                  <component
                    v-if="item.component=='Map'"
                    ref="MapChart"
                    :is="item.component"
                    :id="item.name"
                    :container="item.name"
                    ></component>
                  <div
                    v-if="item.component==null"
                    :id="item.name"></div>
                </grid-item>
              </grid-layout>
      </el-main>
      <el-aside width="200px" style="border-left: 2px solid #eee9e9">
        <el-divider><i class="el-icon-setting"></i></el-divider>
        <SettingSide ref="setting"></SettingSide>
      </el-aside>
    </el-container>
  </div>
</template>

<script>

import vegaEmbed from "vega-embed";
import Map from '../../common/DataListBar/Map'
import * as d3 from "d3";
import VueGridLayout from 'vue-grid-layout';
import SettingSide from '../Settingside/SettingSide'
import { mapGetters } from "vuex";
export default{
  data() {
    return {
      targetSelect:[],
      sourceSelect:[],
      select1Option:null,
      select2Option:null,
      selectCard:false,
      selectText:false,
      component:'null',
      ModularInfo:{},
      chartStyle:{"chartA":{"width": 197,"height": 70},
        "chartB":{"width": 197,"height": 70},
        "chartC":{"width": 197,"height": 70},
        "chartD":{"width": 197,"height": 70}
      },
      layoutObj:{},
      ttlayout: [
        // {"x":0,"y":0,"w":2,"h":2,"i":"0", static: false, name:'chartA',component:null},
        // {"x":2,"y":0,"w":2,"h":4,"i":"1", static: false, name:'chartB',component:null},
        // {"x":4,"y":0,"w":2,"h":5,"i":"2", static: false, name:'chartC',component:null},
        // {"x":6,"y":0,"w":2,"h":3,"i":"3", static: false, name:'chartD',component:null},
        // {"x":8,"y":0,"w":2,"h":3,"i":"4", static: false},
        // {"x":10,"y":0,"w":2,"h":3,"i":"5", static: false},
        // {"x":0,"y":5,"w":2,"h":5,"i":"6", static: false},
        // {"x":2,"y":5,"w":2,"h":5,"i":"7", static: false},
        // {"x":4,"y":5,"w":2,"h":5,"i":"8", static: false},
        // {"x":6,"y":3,"w":2,"h":4,"i":"9", static: true},
        // {"x":8,"y":4,"w":2,"h":4,"i":"10", static: false},
        // {"x":10,"y":4,"w":2,"h":4,"i":"11", static: false},
        // {"x":0,"y":10,"w":2,"h":5,"i":"12", static: false},
        // {"x":2,"y":10,"w":2,"h":5,"i":"13", static: false},
        // {"x":4,"y":8,"w":2,"h":4,"i":"14", static: false},
        // {"x":6,"y":8,"w":2,"h":4,"i":"15", static: false},
        // {"x":8,"y":10,"w":2,"h":5,"i":"16", static: false},
        // {"x":10,"y":4,"w":2,"h":2,"i":"17", static: false},
        // {"x":0,"y":9,"w":2,"h":3,"i":"18", static: false},
        // {"x":2,"y":6,"w":2,"h":2,"i":"19", static: false}
      ],
      draggable: true,
      resizable: true,
      index: 0,
      baseData: {
        //基本配置
        MetaConfig: {
          title: ""
        },
        style: {
          backgroundColor: "",
          fontColor: "" //字体颜色
        },
        data: [],
        button: {
          method: "template",
          title: "apply to all charts"
        }
      },
      selectChart:{}
    }
  },
  props:["layout"],
  computed:{
    // ...mapGetters(['layout'])
    ...mapGetters({getChartArray: 'getChartArray'}),
    ...mapGetters({getChartArray: 'getMapData_2'})
  },
  components: {
    //图表组件
    //chartA,
    //chartB,
    //chartC,
    //chartD
    GridLayout:VueGridLayout.GridLayout,
    GridItem:VueGridLayout.GridItem,
    SettingSide,
    Map
  },
  watch:{
    layout:{
      handler(curval){
        console.log(curval)
      },
      deep: true
    },
    selectChart:{
      handler(newVal) {
        console.log(newVal);
        if(newVal.i=='template'){
          this.callReDraw(newVal.i,newVal.baseData)
        }
        // else {
        //   this.generateGraph();
        // }
      },
      deep:true
    },
    getChartArray:{
      handler(newVal){
        console.log(newVal);
        console.log('config',this.$store.state.model_config_text)
        console.log('数据改动',this.$store.state.chartArray)
        // console.log('颜色',this.$store.state.chartArray[0]['baseData']['style']['color'])
        console.log('layoutObj',this.layoutObj)
        console.log('chartArray',this.$store.state.chartArray)
        // this.layoutObj["config"]["chartA"]["data"]['layer'][0]['mark']['fill'] = this.$store.state.chartArray[0]['baseData']['style']['color']
        // this.generateGraph(this.layoutObj["config"]["chartA"]["data"]['layer'][0]['mark']['fill'])
        this.reGenerateGraphByStyle(newVal)
      },
      deep: true
    },
    getMapData_2:{
      handler(newVal){
        this.generateGraph();
        console.log("重绘---：",newVal)
      }
    }
  },
  mounted(){
    console.log("template开始渲染")
    console.log('this.$store.state.ttlayout',this.ttlayout);
    this.$store.commit("pushToTemplateData", {baseData: this.baseData, i: "template" });
    this.$store.commit("changeSelectId", "template");
    this.targetSelect = this.$store.state.mapData_2.select.split(' ')
    // 设置setting值
    // console.log(this.layoutObj);
    // for(let item in this.ttlayout){
    //
    // }
    // this.$refs.setting.getLayoutObj(this.layoutObj);
  },
  methods:{
    //获取translate
    getTranslate(node,sty){
      var translates=document.defaultView.getComputedStyle(node,null).transform.substring(7);
      var result = translates.match(/\(([^)]*)\)/);// 正则()内容
      var matrix=result?result[1].split(','):translates.split(',');
      if(sty=="x" || sty==undefined){
        return matrix.length>6?parseFloat(matrix[12]):parseFloat(matrix[4]);
      }else if(sty=="y"){
        return matrix.length>6?parseFloat(matrix[13]):parseFloat(matrix[5]);
      }else if(sty=="z"){
        return matrix.length>6?parseFloat(matrix[14]):0;
      }else if(sty=="rotate"){
        return matrix.length>6?getRotate([parseFloat(matrix[0]),parseFloat(matrix[1]),parseFloat(matrix[4]),parseFloat(matrix[5])]):getRotate(matrix);
      }
    },
    // 移动事件
    moveEvent(i){
      let name = ''
      for(let item of this.ttlayout){
        if(item['i']==i){
          name = item['name']
        }
      }
      console.log(name);
      let x = this.getTranslate(document.getElementById(i),'x')
      let y = this.getTranslate(document.getElementById(i),'y')
      this.$store.state.model_config_text['Layout-0'][name]['data']['x'] = x
      this.$store.state.model_config_text['Layout-0'][name]['data']['y'] = y
      console.log('name-x-----------------------',name,x);
      console.log(name,y);
    },
    // grid大小调整，触发cavans大小调整
    resizeEvent(i, newH, newW, newHPx, newWPx) {
      console.log('resize');
      console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
      console.log('layoutObj',this.layoutObj)
      this.reGenerateGraphBySize(i,newWPx,newHPx)
      console.log(this.$refs);
      this.$refs['MapChart'][0].reSizeMap();
      // console.log(document.getElementById(this.container).parentNode);
    },
    // 选中焦点时的触发事件，之后要改变setting状态栏
    getData(id){
      console.log('getData')
      let re = /^[0-9]+.?[0-9]*/; //判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
      if(!re.test(id)){
        this.$store.commit('changeSelectId','template');
        this.selectChart = this.$store.state.templateData;
        // console.log('selectChart',this.selectChart);
        // console.log(this.$store.state.selectChartId)
      }else{
        // console.log('带参数的')
        this.$store.commit('changeSelectId',id);
        // this.selectChart = this.$store.state.chartArray[id]
        this.selectChart = {
          "baseData": {
            "MetaConfig": {
              "title": "降雨量"
            },
            "style": {
              "color": ["#69C0FF"]
            },
            "id": "this.id",
            "data": [
              {
                "name": "Mon",
                "value": "10"
              },
              {
                "name": "Tue",
                "value": "706"
              },
              {
                "name": "Wed",
                "value": "239"
              },
              {
                "name": "Thu",
                "value": 172
              }
            ],
            "datamappers": [
              {
                "Fieldname": "value",
                "Fieldtype": "num",
                "Mapfrom": null,
                "Alias": null
              },
              {
                "Fieldname": "name",
                "Fieldtype": "string",
                "Mapfrom": null,
                "Alias": null
              }
            ],
            "button": {
              "method": "startanalyzedata",
              "title": "Apply"
            },
            "mapperdatas": null
          }
        }
        console.log('selectChart',this.selectChart);
      }
    },
    callReDraw(id,newVal) {
      let that = this;
      if (id<2000) {
        that.$refs[id][0].reDraw(newVal);
      } else {
        console.log('背景颜色更改');
        document.getElementsByClassName("vue-grid-layout")[0].style.backgroundColor = newVal.style.backgroundColor;
      }
    },
    getModularInfo(m){
      console.log(m);
      let that = this
      this.layoutObj = JSON.parse(JSON.stringify(m))
      console.log(this.layoutObj)
      //this.calculateChartWH()
      //this.setBackgroundColor()
      this.adaptWidthHeight()
      this.generateGraph()

    },
    adaptWidthHeight(){
      //this.layoutObj.[chartA].data.height/width
      let that = this
      // debugger
      let chartList = Object.keys(that.chartStyle)
      let charts = Object.keys(that.layoutObj["config"])
      charts.forEach(function(d){
        if(that.layoutObj["config"][d] != undefined){
          that.layoutObj["config"][d]["data"]["height"] = 197;
          that.layoutObj["config"][d]["data"]["width"] = 70;
          let _layer = that.layoutObj["config"][d]["data"]["layer"]
          _layer.forEach(function(v){
            v.height = 197
            v.width = 70
          })
        }
      })
      chartList.forEach(function(d){
        if(that.layoutObj["config"][d] != undefined){
          //用vega model 自带的set方法
          that.layoutObj["config"][d]["data"]["height"] = that.chartStyle[d]["height"]
          that.layoutObj["config"][d]["data"]["width"] = that.chartStyle[d]["width"]
          let _layer = that.layoutObj["config"][d]["data"]["layer"]
          //console.log("_layer", _layer)
          _layer.forEach(function(v){
            v.height = that.chartStyle[d]["height"]
            v.width = that.chartStyle[d]["width"]
          })
        }
      })

    },
    setBackgroundColor(){
      let that = this
      for(let key in that.layoutObj["config"]){
        //key chartA chartB
        that.layoutObj["config"][key]["data"]["background"] = "#242E47"
      }
    },
    setAxisColor(){
      let that = this
      for(let key in that.layoutObj["layers"]){
        //key chartA chartB
        if(that.layoutObj["layers"][key]["encoding"]["x"]){
          if(!that.layoutObj["layers"][key]["encoding"]["x"]["axis"]){
            that.layoutObj["layers"][key]["encoding"]["x"]["axis"] = {
              "domainColor" : "white",
              "labelColor": "white",
              "tickColor": "white",
              "titleColor": "white",
              "gridColor": "white"
            }
          }
        }
        if(that.layoutObj["layers"][key]["encoding"]["y"]){
          if(!that.layoutObj["layers"][key]["encoding"]["y"]["axis"]){
            that.layoutObj["layers"][key]["encoding"]["y"]["axis"] = {
              "domainColor" : "white",
              "labelColor": "white",
              "tickColor": "white",
              "titleColor": "white",
              "gridColor": "white"
            }
          }
        }
      }
    },
    setHeaderColor(){

    },
    createSelect(width=200,height=400,select,data){
      let selectName = select.split(' ')[0]
      // 创建下拉框元素
      const select1 = document.createElement('select');

      select1.innerHTML = `
      <option value="Cases">Cases</option>
      <option value="Deaths">Deaths</option>
    `;
      select1.setAttribute("class","WHO-text");
      const select2 = document.createElement('select');
      select2.innerHTML = `
      <option value="cumulative total">total</option>
      <option value="cumulative total per 100000 population">total per 100000 population</option>
      <option value="newly reported in last 7 days">newly reported in last 7 days</option>
    `;
      select2.setAttribute("class","WHO-text");
      //加入change事件
      let that = this;
      select1.addEventListener('change',function (event) {
        debugger;
        that.select1Option = event.target.value;
        console.log(that.select1Option);
        let div1 = document.getElementById("div1");
        let div3 = document.getElementById("div3");
        let div5 = document.getElementById("div5");
        div1.textContent = `${data[0][`${that.select1Option} - cumulative total`]}`;
        div3.textContent = `${data[0][`${that.select1Option} - cumulative total per 100000 population`]}`;
        div5.textContent = `${data[0][`${that.select1Option} - newly reported in last 7 days`]}`;
        that.targetSelect[0] = that.select1Option;
        that.$store.state.mapData_2['select'] = `${that.targetSelect[0]} - ${that.targetSelect[2]}`
        that.$refs.MapChart[0].reCreate();
        console.log(that.$store.state.mapData_2['select']);

      })
      select2.addEventListener('change',function (event) {
        that.select2Option = event.target.value;
        that.targetSelect[2] = that.select2Option;
        that.$store.state.mapData_2['select'] = `${that.targetSelect[0]} - ${that.targetSelect[2]}`
        that.$refs.MapChart[0].reCreate();
        console.log(that.$store.state.mapData_2['select']);


      })
      console.log(this.select1Option,this.select2Option)
      select1.setAttribute('id', 'select1');
      select2.setAttribute('id', 'select2');
      // 创建文本
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      const div4 = document.createElement('div');
      const div5 = document.createElement('div');
      const div6 = document.createElement('div');

      div1.textContent = `${data[0][`${selectName} - cumulative total`]}`;
      div2.textContent = `cumulative total`;
      div3.textContent = `${data[0][`${selectName} - cumulative total per 100000 population`]}`;
      div4.textContent = `cumulative total`;
      div5.textContent = `${data[0][`${selectName} - newly reported in last 7 days`]}`;
      div6.textContent = `newly reported in last 7 days`;

      div1.setAttribute('id', 'div1');
      div2.setAttribute('id', 'div2');
      div3.setAttribute('id', 'div3');
      div4.setAttribute('id', 'div4');
      div5.setAttribute('id', 'div5');
      div6.setAttribute('id', 'div6');
      // 获取目标容器
      const formContainer = document.getElementById('select');

      // 添加下拉框和多行文本框到目标容器
      formContainer.appendChild(select1);
      formContainer.appendChild(select2);
      formContainer.appendChild(div1);
      formContainer.appendChild(div2);
      formContainer.appendChild(div3);
      formContainer.appendChild(div4);
      formContainer.appendChild(div5);
      formContainer.appendChild(div6);
      formContainer.style.width=`${width}px`;
      formContainer.style.height=`${height}px`;
    },
    generateGraph(color='#1F9CC9'){
      let that = this
      // debugger;
      let charts = Object.keys(that.layoutObj["config"])
      // 构造ttlayout
      this.$refs.setting.getLayoutObj(this.layoutObj);
      // debugger
      console.log('generateGraph',charts);
      // for(let i=0;i<charts.length;i++){
      //   that.ttlayout[i]["component"] = "DA"
      // }
      that.ttlayout=[]
      charts.forEach(function(d){
        // 构造ttlayout
        if(that.layoutObj['config'][d]['chartType']=='Map'){
          that.ttlayout.push({"x":charts.indexOf(d)*2+2,"y":0,"w":2,"h":2,"i":charts.indexOf(d).toString(), static: false, name:`A-${d}`,component:'Map'})
          // console.log('这是一个地图，接下来进行地图在GraphView中的绘制');
          // for(let item in that.ttlayout){
          //   console.log(that.ttlayout[item],d)
          //   if(that.ttlayout[item].name == d){
          //     console.log('地图的数据处理以及绘制',that.ttlayout[item])
          //     that.ttlayout[item].component = 'Map'
          //     // let data =that.layoutObj['config'][d].getMapData();
          //     // that.$store.commit("setMapData", data)
          //     // that.ttlayout[item].component = () => import(`../../common/DataListBar/Map`)
          //     console.log(that.ttlayout[item].component);
          //   }
          // }
        }
        else if(that.layoutObj['config'][d]['chartType']=="TextChart"){
          vegaEmbed("#" + d, that.layoutObj["config"][d]["data"])
        }
        else{
          that.ttlayout.push({"x":charts.indexOf(d)*2+2,"y":0,"w":2,"h":2,"i":charts.indexOf(d).toString(), static: false, name:`A-${d}`,component:null})
          console.log(that.layoutObj["config"][d]["data"]);
          that.layoutObj["config"][d]["data"]['layer'][0]['mark']['fill'] = color
          vegaEmbed("#" + `A-${d}`, that.layoutObj["config"][d]["data"])
        }
      })
      let len = that.ttlayout.length
      if(Object.keys(that.$store.state.mapData_2).length!=null){
        if(document.getElementById("select")==null){
          that.ttlayout.push({"x":(len)*2+2,"y":0,"w":2,"h":2,"i":100, static: false, name:`select`,component:null})
          that.ttlayout.push({"x":(len+1)*2+2,"y":0,"w":2,"h":2,"i":200, static: false, name:`WHOText`,component:null})
          // this.createSelect();
        }
      }
      console.log(that.ttlayout)
      // console.log(document.getElementById(this.container).parentNode);
    },
    reGenerateGraphByStyle(newVal){
      let that = this
      let i = 0
      let charts = Object.keys(that.layoutObj["config"])
      //  Layout-0
      let table = {0:'chartA',1:'chartB',2:'chartC',3:'chartD'}
      console.log(newVal);
      console.log('generateGraph',charts);
      console.log('config',this.$store.state.model_config_text)
      charts.forEach(function(d){
        console.log(that.layoutObj["config"][d]["data"]);
        console.log(newVal[i]['baseData']['style']['color'][0]);
        that.layoutObj["config"][d]["data"]['layer'][0]['mark']['fill'] = newVal[i]['baseData']['style']['color'][0]
        that.$store.state.model_config_text['Layout-0'][table[i]]['data']['layer'][0]['mark']['fill'] = newVal[i]['baseData']['style']['color'][0]
        vegaEmbed("#" + d, that.layoutObj["config"][d]["data"])
        i = i + 1
      })
      console.log('config---------------1',this.$store.state.model_config_text)

    },
    reGenerateGraphBySize(i,width,height){
      let that = this
      let charts = Object.keys(that.layoutObj["config"])
      let table = {0:'chartA',1:'chartB',2:'chartC',3:'chartD'}
      let name = ''
      let _ref = "MapChart"
      console.log(i);
      if(i==100){
        if(this.selectCard==false){
          this.createSelect(width,height,that.$store.state.mapData_2.select,that.$store.state.mapData_2.data.values);
          this.selectCard=true;
        }
        else {
          let select_div = document.getElementById("select")
          select_div.style.width = `${width}px`;
          select_div.style.height = `${height}px`
        }
      }
      if(i==200){
        debugger
        document.getElementById("WHOText").style.width = `${width}px`;
        document.getElementById('WHOText').style.height = `${height}px`;
        console.log("width:",width,"height:",height)
        if(this.selectText == false){
          this.setWHOText(width,height);
          this.selectText = true;
        }
      }
      else {
        for(let item of this.ttlayout){
          if(item['i']==i){
            name = item['name']
          }
        }
        name = name.slice(2,);
        if(that.layoutObj['config'][name]['chartType']=='Map'){
          console.log("map重绘");
          // that.$refs[_ref].clearMap();
          this.$refs.MapChart[0].reCreate();
          // this.generateGraph();
        }
        console.log(name);
        // debugger
        that.layoutObj["config"][name]["data"]['layer'][0]['width'] =width
        that.layoutObj["config"][name]["data"]['layer'][0]['height'] =height
        that.layoutObj["config"][name]["data"]['width'] = width
        that.layoutObj["config"][name]["data"]['height'] = height

        console.log(that.$store.state.model_config_text)
        that.$store.state.model_config_text[name]['data']['width'] = width
        that.$store.state.model_config_text[name]['data']['height'] = height
        that.$store.state.model_config_text[name]['data']['layer'][0]['width'] = width
        that.$store.state.model_config_text[name]['data']['layer'][0]['height'] = width
        // that.$store.state.model_config_text['Layout-0'][name]['data']['width'] = width
        // that.$store.state.model_config_text['Layout-0'][name]['data']['height'] = height
        // that.$store.state.model_config_text['Layout-0'][name]['data']['layer'][0]['width'] = width
        // that.$store.state.model_config_text['Layout-0'][name]['data']['layer'][0]['height'] = height


        // console.log(that.$store.state.model_config_text['Layout-0'][name]['data']['layer'][0]['height']);
        // console.log('reSize---------------config---------------1',this.$store.state.model_config_text)
        console.log('reGenerateGraphBySize---重绘');
        vegaEmbed(`#A-${name}`, that.layoutObj["config"][name]["data"])
        console.log('generateGraph',that.layoutObj);
      }
    },
    setWHOText(width,height){
      const textContainer = document.getElementById('WHOText');

      const line1 = document.createElement('p');
      //const line1Text = document.createTextNode('In China, from 3 January 2020 to 6:03am CEST, 24 May 2023, there have been ');
      //line1.appendChild(line1Text);

      line1.appendChild(getSpan("In "));
      line1.appendChild(getSpan("China","blue"));
      line1.appendChild(getSpan(", from "));
      line1.appendChild(getSpan("3 January 2020","blue"));
      line1.appendChild(getSpan(" to "));
      line1.appendChild(getSpan("6:03am CEST, 24 May 2023","blue"));
      line1.appendChild(getSpan(", there have been "));
      line1.appendChild(getSpan("99,261,812 confirmed cases","blue"));
      line1.appendChild(getSpan(" of COVID-19 with "));
      line1.appendChild(getSpan("121,144","orange"));

      // const line2 = document.createElement('p');
      line1.appendChild(getSpan("deaths","orange"));
      line1.appendChild(getSpan(", reported to WHO. As of "));
      line1.appendChild(getSpan("22 March 2023","blue"));
      line1.appendChild(getSpan(", a total of "));
      line1.appendChild(getSpan("3,515,872,818 vaccine doses","blue"));
      line1.appendChild(getSpan(" have been administered."));

      const line2Continuation = document.createTextNode(' vaccine doses have been administered.');

      // 将文本节点添加到容器中
      textContainer.appendChild(line1);
      // textContainer.appendChild(line2);
      function getSpan(str,className = "WHO-Text"){
        let cases = document.createElement("span");
        cases.classList.add(className);
        let casesText = document.createTextNode(str);
        cases.appendChild(casesText);
        return cases;
      }
    }
  }

}

</script>
<style type="text/css">

.layout{
  width: 1800px;
  margin: 0 auto;
  height: 1000px;
  background-color: #ffffff;
  border-radius:5px
}
.header{
  padding: 0.5% 0 0.5% 2%;
  font-size: 25px;
  color:white;
  border-radius:5px;
}
.mutiItem{
  height: 95%;
  background-color: white;
}
.left{
  width: 50%;
  height: 100%;
  float: left;
}
.right{
  width: 50%;
  height: 100%;
  float: left;
}
#chartA,#chartB,#chartC,#chartD{
  height: 100% ;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

#t1,#t2,#t3,#t4{
  height:46%;
  width:96%;
  padding:2%
}
.el-aside {
  color: #333;
  text-align: center;
  height: 1180px;
}
.el-color-picker{
  z-index: 100;
}
/* Add space between Vega-Embed links  */
.container{
  height: 800px;
}
.gridLayout{
  width: 100%;
  height: 800px;
  border: 1px solid;
}
.grid{
  width: 50px;
  height: 50px;
}
.vue-grid-layout {
  height: 800px;
}
.container .vue-grid-item.vue-grid-placeholder {
  background: green;
}
/*控制背景颜色*/
.vue-grid-layout {
  background: #eee;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: #cce;
}
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
#select{
  display:flex;
  flex-direction:column;
}
#select1{
  flex:1;
}
#select2{
  flex:1;
}
#div1{
  flex:1;
  text-align: right;
  font-size:2.5em;
  font-weight:bold;
  margin-right: 10px;
}
#div2{
  flex:1;
  text-align: right;
  margin-right: 10px;
  font-size:1.5em;
}
#div3{
  flex:1;
  text-align: right;
  font-size:2.5em;
  font-weight:bold;
  margin-right: 10px;
}
#div4{
  flex:1;
  text-align: right;
  margin-right: 10px;
  font-size:1.5em;
}
#div5{
  flex:1;
  font-size:2.5em;
  font-weight:bold;
  text-align: right;
  margin-right: 10px;
}
#div6{
  flex:1;
  text-align: right;
  margin-right: 10px;
  font-size:1.5em;
}
p{
  text-align:center
}
.blue {
  color: blue;
  font-size:20px;
  font-weight: bold;
}
.orange{
  color: orange;
  font-size:20px;
  font-weight: bold;
}
.WHO-Text{
  font-size:20px;
}
#WHOText{
  background-color:#FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}
.WHO-text{
  font-size: 2em;
}
</style>





