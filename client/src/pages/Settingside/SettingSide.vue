<template>
  <el-collapse v-model="activeNames" style="width:100%">
    <el-collapse-item
      v-for="(value, key) in baseData"
      :key="key"
      :title="key"
      :name="key"
      v-show="collapseShow(key)"
    >
      <div v-for="(val, k) in value" :key="k">
        <div v-if="key =='Config'" >
          <span>{{k}}</span>
          <el-input v-model="value.title" size="mini" v-if="value.hasOwnProperty('title')"></el-input>
        </div>

        <div v-if="key =='style'">
          <span>{{k}}</span>
          <div>
            <div v-if="k==='backgroundColor'">
              <el-input class="colorInput" v-model="value.backgroundColor" size="mini"></el-input>
              <el-color-picker v-model="value.backgroundColor" size="mini"></el-color-picker>
            </div>
            <div v-if="k==='fontColor'">
              <el-input class="colorInput" v-model="value.fontColor" size="mini"></el-input>
              <el-color-picker v-model="value.fontColor" size="mini"></el-color-picker>
            </div>
          </div>
          <div v-for="(v, i, index) in val" :key="index">
            <el-input
              class="colorInput"
              v-model="val[i]"
              size="mini"
              v-if="value.hasOwnProperty('color')"
            ></el-input>
            <el-color-picker v-model="val[i]" size="mini" v-if="value.hasOwnProperty('color')"></el-color-picker>
          </div>
        </div>

<!--        <div v-if="key =='datamappers'" :id="getDatamappersId(k)">-->
<!--          <div v-for="(v, i, index) in val" :key="index">-->
<!--            <span v-if="i=='Fieldname'||i=='Fieldtype'">{{i}}:{{v}}</span>-->
<!--            <div v-if="i=='Mapfrom'">-->
<!--              <span>{{i}}</span>-->
<!--              <el-input v-model="val.Mapfrom" size="mini"></el-input>-->
<!--            </div>-->
<!--            <div v-if="i=='Alias'">-->
<!--              <span>{{i}}</span>-->
<!--              <el-input v-model="val.Alias" size="mini"></el-input>-->
<!--            </div>-->
<!--          </div>-->
<!--          <el-divider v-if="k==0"></el-divider>-->
<!--        </div>-->
      </div>

<!--      <div v-if="key =='data' && value.length !== 0">-->
<!--        <v-table-->
<!--          v-if="value[0].hasOwnProperty('name')"-->
<!--          column-width-drag-->
<!--          :table-data="value"-->
<!--          :columns="columnsName"-->
<!--          :cell-edit-done="cellEditDone"-->
<!--          style="width:100%"-->
<!--        ></v-table>-->
<!--        <v-table-->
<!--          v-if="value[0].hasOwnProperty('x')"-->
<!--          column-width-drag-->
<!--          :table-data="value"-->
<!--          :columns="columnsX"-->
<!--          :cell-edit-done="cellEditDone"-->
<!--          style="width:100%"-->
<!--        ></v-table>-->
<!--        <v-table-->
<!--          v-if="value[0].hasOwnProperty('item')"-->
<!--          column-width-drag-->
<!--          :table-data="value"-->
<!--          :columns="columnsItem"-->
<!--          :cell-edit-done="cellEditDone"-->
<!--          style="width:100%"-->
<!--        ></v-table>-->
<!--        <v-table-->
<!--          v-if="value[0].hasOwnProperty('date')"-->
<!--          column-width-drag-->
<!--          :table-data="value"-->
<!--          :columns="columnsDate"-->
<!--          :cell-edit-done="cellEditDone"-->
<!--          style="width:100%"-->
<!--        ></v-table>-->
<!--        <v-table-->
<!--          v-if="value[0].hasOwnProperty('city')"-->
<!--          column-width-drag-->
<!--          :table-data="value"-->
<!--          :columns="columnsCity"-->
<!--          :cell-edit-done="cellEditDone"-->
<!--          style="width:100%"-->
<!--        ></v-table>-->
<!--      </div>-->
      <div v-if="key == ' '">
        <el-button v-on:click="sendIsActive(value.method)" size="small">{{value.title}}</el-button>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { mapGetters } from "vuex";
import mapperdataM from "../../store/MapperDataManage.js";
import vegaEmbed from "vega-embed";
export default {
  name: "settingside",
  data() {
    return {
      layoutObj:null,
      baseData: {
        Config: {
          title: "background"
        },
        style: {
          color: []
        },
        // data: [],
        // datamappers: [
        //   {
        //     Fieldname: "value",
        //     Fieldtype: "num",
        //     Mapfrom: null,
        //     Alias: null
        //   },
        //   {
        //     Fieldname: "name",
        //     Fieldtype: "string",
        //     Mapfrom: null,
        //     Alias: null
        //   }
        // ]
      },

      activeNames: ["Config", "style", "data", "button", "datamappers"], //折叠面板

      columnsName: [
        {
          field: "name",
          title: "name",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        },
        {
          field: "value",
          title: "value",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        }
      ],
      columnsX: [
        {
          field: "x",
          title: "x",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        },
        {
          field: "y",
          title: "y",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        }
      ],
      columnsItem: [
        {
          field: "item",
          title: "item",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        },
        {
          field: "count",
          title: "count",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        }
      ],
      columnsDate: [
        {
          field: "date",
          title: "date",
          width: 120,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        },
        {
          field: "value",
          title: "value",
          width: 80,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        }
      ],
      columnsCity: [
        {
          field: "time",
          title: "x",///右边表格的变量名字
          width: 120,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        },
        {
          field: "temperature",
          title: "y",
          width: 80,
          titleAlign: "center",
          columnAlign: "center",
          isEdit: true,
          isResize: true
        }
      ],
      layoutObj:[]
    };
  },
  mounted(){
    // this.baseData = {
    //   "Config": {
    //     "title": "柱状图"
    //   },
    //   "style": {
    //     "color": ["#1F9CC9"]
    //   },
    //   "id": "this.id",
    //   "data": [
    //     {
    //       "name": "id",
    //       "value": 1
    //     },
    //     {
    //       "name": "time",
    //       "value": "10"
    //     },
    //     {
    //       "name": "lat",
    //       "value": "40"
    //     },
    //     {
    //       "name": "lng",
    //       "value": "100.20"
    //     },
    //   ],
    //   "datamappers": [
    //     {
    //       "Fieldname": "value",
    //       "Fieldtype": "num",
    //       "Mapfrom": null,
    //       "Alias": null
    //     },
    //     {
    //       "Fieldname": "name",
    //       "Fieldtype": "string",
    //       "Mapfrom": null,
    //       "Alias": null
    //     }
    //   ],
    //   "button": {
    //     "method": "startanalyzedata",
    //     "title": "Apply"
    //   },
    //   "mapperdatas": null
    // }
    let baseData1 = {
        "Config": {
          "title": "柱状图"
        },
        "style": {
          "color": ["#1F9CC9"]
        },
        "id": "this.id",
        // "data": [
        //   {
        //     "name": "id",
        //     "value": 1
        //   },
        //   {
        //     "name": "time",
        //     "value": "10"
        //   },
        //   {
        //     "name": "lat",
        //     "value": "40"
        //   },
        //   {
        //     "name": "lng",
        //     "value": "100.20"
        //   },
        // ],
        // "datamappers": [
        //   {
        //     "Fieldname": "value",
        //     "Fieldtype": "num",
        //     "Mapfrom": null,
        //     "Alias": null
        //   },
        //   {
        //     "Fieldname": "name",
        //     "Fieldtype": "string",
        //     "Mapfrom": null,
        //     "Alias": null
        //   }
        // ],
        "button": {
          "method": "startanalyzedata",
          "title": "Apply"
        },
        "mapperdatas": null
      }
    let baseData2 = {
      "Config": {
        "title": "柱状图"
      },
      "style": {
        "color": ["#1F9CC9"]
      },
      "id": "this.id",
      // "data": [
      //   {
      //     "name": "id",
      //     "value": 1
      //   },
      //   {
      //     "name": "time",
      //     "value": "10"
      //   },
      //   {
      //     "name": "lat",
      //     "value": "40"
      //   },
      //   {
      //     "name": "lng",
      //     "value": "100.20"
      //   },
      // ],
      // "datamappers": [
      //   {
      //     "Fieldname": "value",
      //     "Fieldtype": "num",
      //     "Mapfrom": null,
      //     "Alias": null
      //   },
      //   {
      //     "Fieldname": "name",
      //     "Fieldtype": "string",
      //     "Mapfrom": null,
      //     "Alias": null
      //   }
      // ],
      "button": {
        "method": "startanalyzedata",
        "title": "Apply"
      },
      "mapperdatas": null
    }
    let baseData3 = {
      "Config": {
        "title": "柱状图"
      },
      "style": {
        "color": ["#1F9CC9"]
      },
      "id": "this.id",
      // "data": [
      //   {
      //     "name": "id",
      //     "value": 1
      //   },
      //   {
      //     "name": "time",
      //     "value": "10"
      //   },
      //   {
      //     "name": "lat",
      //     "value": "40"
      //   },
      //   {
      //     "name": "lng",
      //     "value": "100.20"
      //   },
      // ],
      // "datamappers": [
      //   {
      //     "Fieldname": "value",
      //     "Fieldtype": "num",
      //     "Mapfrom": null,
      //     "Alias": null
      //   },
      //   {
      //     "Fieldname": "name",
      //     "Fieldtype": "string",
      //     "Mapfrom": null,
      //     "Alias": null
      //   }
      // ],
      "button": {
        "method": "startanalyzedata",
        "title": "Apply"
      },
      "mapperdatas": null
    }
    let baseData4 = {
      "Config": {
        "title": "柱状图"
      },
      "style": {
        "color": ["#1F9CC9"]
      },
      "id": "this.id",
      // "data": [
      //   {
      //     "name": "id",
      //     "value": 1
      //   },
      //   {
      //     "name": "time",
      //     "value": "10"
      //   },
      //   {
      //     "name": "lat",
      //     "value": "40"
      //   },
      //   {
      //     "name": "lng",
      //     "value": "100.20"
      //   },
      // ],
      // "datamappers": [
      //   {
      //     "Fieldname": "value",
      //     "Fieldtype": "num",
      //     "Mapfrom": null,
      //     "Alias": null
      //   },
      //   {
      //     "Fieldname": "name",
      //     "Fieldtype": "string",
      //     "Mapfrom": null,
      //     "Alias": null
      //   }
      // ],
      // "button": {
      //   "method": "startanalyzedata",
      //   "title": "Apply"
      // },
      "mapperdatas": null
    }
    this.$store.state.chartArray.push({id:'0',baseData:baseData1})
    this.$store.state.chartArray.push({id:'1',baseData:baseData2})
    this.$store.state.chartArray.push({id:'2',baseData:baseData3})
    this.$store.state.chartArray.push({id:'3',baseData:baseData4})
    console.log(this.layoutObj);
  },
  computed: {
    // ...mapGetters({ storeBaseData: "getPropsData" }),
    ...mapGetters({ isClick: "getIsActive" }),
    ...mapGetters({ selectChartId: "getSelectChartId"}),
  },
  watch: {
    // layoutObj:{
    //   handler(newVal){
    //     debugger;
    //     console.log("layoutObj改变")
    //     let that = this
    //     this.$store.state.chartArray = []
    //     let charts = Object.keys(that.layoutObj["config"])
    //     let id = 0
    //     charts.forEach(function(d){
    //       let tempBaseData = {}
    //       if(that.layoutObj['config'][d]['chartType']=='Map'){
    //         tempBaseData = {
    //           "Config": {
    //             "title": "柱状图"
    //           },
    //           "style": {
    //             "color": ["#1F9CC9"]
    //           },
    //           "id": "this.id",
    //           "data": [
    //             {
    //               "name": "id",
    //               "value": 1
    //             },
    //             {
    //               "name": "time",
    //               "value": "10"
    //             },
    //             {
    //               "name": "lat",
    //               "value": "40"
    //             },
    //             {
    //               "name": "lng",
    //               "value": "100.20"
    //             },
    //           ],
    //           "datamappers": [
    //             {
    //               "Fieldname": "value",
    //               "Fieldtype": "num",
    //               "Mapfrom": null,
    //               "Alias": null
    //             },
    //             {
    //               "Fieldname": "name",
    //               "Fieldtype": "string",
    //               "Mapfrom": null,
    //               "Alias": null
    //             }
    //           ],
    //           "button": {
    //             "method": "startanalyzedata",
    //             "title": "Apply"
    //           },
    //           "mapperdatas": null
    //         }
    //       }
    //       else if(that.layoutObj['config'][d]['chartType']=="TextChart"){
    //         tempBaseData = {
    //           "Config": {
    //             "title": "柱状图"
    //           },
    //           "style": {
    //             "color": ["#1F9CC9"]
    //           },
    //           "id": "this.id",
    //           "data": [
    //             {
    //               "name": "id",
    //               "value": 1
    //             },
    //             {
    //               "name": "time",
    //               "value": "10"
    //             },
    //             {
    //               "name": "lat",
    //               "value": "40"
    //             },
    //             {
    //               "name": "lng",
    //               "value": "100.20"
    //             },
    //           ],
    //           "datamappers": [
    //             {
    //               "Fieldname": "value",
    //               "Fieldtype": "num",
    //               "Mapfrom": null,
    //               "Alias": null
    //             },
    //             {
    //               "Fieldname": "name",
    //               "Fieldtype": "string",
    //               "Mapfrom": null,
    //               "Alias": null
    //             }
    //           ],
    //           "button": {
    //             "method": "startanalyzedata",
    //             "title": "Apply"
    //           },
    //           "mapperdatas": null
    //         }
    //       }
    //       else{
    //         tempBaseData = {
    //           "Config": {
    //             "title": "柱状图"
    //           },
    //           "style": {
    //             "color": ["#1F9CC9"]
    //           },
    //           "id": "this.id",
    //           "data": [
    //             {
    //               "name": "id",
    //               "value": 1
    //             },
    //             {
    //               "name": "time",
    //               "value": "10"
    //             },
    //             {
    //               "name": "lat",
    //               "value": "40"
    //             },
    //             {
    //               "name": "lng",
    //               "value": "100.20"
    //             },
    //           ],
    //           "datamappers": [
    //             {
    //               "Fieldname": "value",
    //               "Fieldtype": "num",
    //               "Mapfrom": null,
    //               "Alias": null
    //             },
    //             {
    //               "Fieldname": "name",
    //               "Fieldtype": "string",
    //               "Mapfrom": null,
    //               "Alias": null
    //             }
    //           ],
    //           "button": {
    //             "method": "startanalyzedata",
    //             "title": "Apply"
    //           },
    //           "mapperdatas": null
    //         }
    //       }
    //       that.$store.state.chartArray.push({id:id.toString(),baseData:tempBaseData})
    //       id += 1;
    //     })
    //     console.log(that.$store.state.chartArray);
    //   },
    //   deep:true
    // },
    baseData: {
      handler(newVal) {
        console.log('basedata改变')
        // this.$store.commit("commitPropsData", newVal);
        console.log(this.baseData['style']['color'])
        // this.$store.state.chartArray.push(1)
        console.log(this.$store.state.chartArray)
        this.$emit('reGenerateChart',this.baseData);
      },
      deep: true
    },
    // storeBaseData: {
    //   handler(newVal) {
    //     this.baseData = newVal;
    //   },
    //   deep: true
    // },
    selectChartId: {
      handler(newVal){
        console.log('settting-watch-newVal',newVal);
        if(newVal === "template"){
          this.baseData = this.$store.state.templateData.baseData
        } else {
          console.log('图表配置')
          // this.baseData = this.$store.state.chartArray[newVal].baseData
          this.baseData = this.$store.state.chartArray[newVal].baseData
        }
      }

    }
  },
  methods: {
    getLayoutObj(m){
      this.layoutObj = m;
      console.log("layout",this.layoutObj)
      console.log("layoutObj改变")
      let chartObj = {
        "chartA":0,
        "chartB":1,
        "chartC":2,
        "chartD":3,
      }
      let that = this
      let charts = Object.keys(that.layoutObj["config"])
      console.log(charts);
      // debugger;
      // console.log(this.$store.state.chartArray['1']);
      charts.forEach(function(d){
        let tempBaseData = {}
        if(that.layoutObj['config'][d]['chartType']=="TextChart") {
          tempBaseData = {
            "Config": {
              "title": "柱状图"
            },
            "style": {
              "color": ["#1F9CC9"]
            },
            "id": "this.id",
            // "data": [
            //   {
            //     "name": "id",
            //     "value": 1
            //   },
            //   {
            //     "name": "time",
            //     "value": "10"
            //   },
            //   {
            //     "name": "lat",
            //     "value": "40"
            //   },
            //   {
            //     "name": "lng",
            //     "value": "100.20"
            //   },
            // ],
            // "datamappers": [
            //   {
            //     "Fieldname": "value",
            //     "Fieldtype": "num",
            //     "Mapfrom": null,
            //     "Alias": null
            //   },
            //   {
            //     "Fieldname": "name",
            //     "Fieldtype": "string",
            //     "Mapfrom": null,
            //     "Alias": null
            //   }
            // ],
            "button": {
              "method": "startanalyzedata",
              "title": "Apply"
            },
            "mapperdatas": null
          }
          console.log(that.$store.state.chartArray[chartObj[d].toString()]);
          that.$store.state.chartArray[chartObj[d].toString()]['baseData'] = tempBaseData
        }
      })
      console.log(that.$store.state.chartArray["1"]);
      console.log(that.$store.state.chartArray);
    },
    getModularInfo(m){
      console.log(m);
      let that = this
      this.layoutObj = JSON.parse(JSON.stringify(m))
      console.log(this.layoutObj)
      //this.calculateChartWH()
      //this.setBackgroundColor()
      console.log(this.layoutObj['config']['data']['values'].slice(0, 5));
      this.baseData={
        "Config": {
          "title": this.layoutObj['config']['layer'][0]['mark']['type']
        },
        "style": {
          "color": [this.layoutObj['config']['layer'][0]['mark']['fill']],
          "stroke":[this.layoutObj['config']['layer'][0]['mark']['stroke']]
        },
        "id": this.layoutObj['config']['title']['text'],
        // "data": this.layoutObj['config']['data']['values'].slice(0,5),
        // "datamappers": [
        //   {
        //     "Fieldname": "value",
        //     "Fieldtype": "num",
        //     "Mapfrom": null,
        //     "Alias": null
        //   },
        //   {
        //     "Fieldname": "name",
        //     "Fieldtype": "string",
        //     "Mapfrom": null,
        //     "Alias": null
        //   }
        // ],
        " ": {
          "method": "startanalyzedata",
          "title": "Apply"
        },
        "mapperdatas": null
      }
      console.log('baseData',this.baseData);
    },
    cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
      this.baseData.data[rowIndex][field] = newValue;
    },
    sendIsActive(key) {
      console.log(this.layoutObj);
      if (key == "template") {
        this.$store.commit("commitIsActive", !this.isClick);
      } else if (key == "startanalyzedata") {
        mapperdataM.startanalyzedata(); //不知道是否在这里用
      }
    },
    getDatamappersId(a) {
      if (a % 2) return "y";
      else return "x";
    },
    collapseShow(key) {
      return (key == "Config" ||key == "style" ||(key == "data" && this.baseData.data.length != 0)||key == " " ||key == "datamappers");
    }
  }
};
</script>
<style>
.el-input {
  width: 100%;
  /* float: right; */
}
.colorInput {
  width: 100px;
  float: left;
}
.el-collapse-item__content {
    font-size: 10px !important;
    color: black !important;
}
.el-input__inner{
  width: 80% !important;
}
.colorInput {
  padding-left: 10px !important;
}
.el-color-picker__panel{
  z-index: 200000!important;
}
</style>
