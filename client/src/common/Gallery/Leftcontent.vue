<template>
  <div class="Leftcontent">
    <div
      class="item"
      v-for="index in this.covidkey"
      :key="index"
      @click="selectclick(index)"
    >
      <img :src="require('../../papers_img/' + index + '.jpg')" />
    </div>
  </div>
</template>

  <script>
import data from "../../../static/covid_data_e.json";
import layout from "../../../static/covid_data_layout.json";
import { mapState } from "vuex";
export default {
  name: "Leftcontent",
  components: {},
  data() {
    return {
      chartdata: {},
      datakey: [],
      colorData: ["black", "pink", "blue"],
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
    selectclick(index) {
      //   console.log(data[index]["图形类"].split(','));
      let senddata = [];
      let layoutlist = [];

      layoutlist.push(layout[index]);
      senddata.push(data[index]["图形类"].split(","));

      //生成默认的颜色数组
      let defaultColor = new Array(senddata[0].length).fill("#ffffff")
      senddata.push(defaultColor)
      senddata.push(layoutlist);
      // console.log(senddata);
      this.$store.commit("getimgkey", senddata);
    },
  },
};
</script>


  <style scoped>
.Leftcontent {
  flex: 0.7 0 700px;
  display: flex;
  margin-left: 1vw;
  margin-right: 5px;
  background-color: rgba(230, 191, 190, 0.5);
  flex-wrap: wrap;
  overflow: auto;
}
.item {
  width: 33%;
  height: 17vw;
  padding-bottom: 10px;
  padding-left: 10px;
}
img {
  width: 100%;
  height: 100%;
}
</style>
