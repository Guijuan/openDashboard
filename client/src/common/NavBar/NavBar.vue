<template>
  <vs-navbar class="nabarx" color='rgb(50, 60, 90)'>
    <div slot="title" style="display: flex;align-items: center">
      <vs-navbar-title style="color:white;">
        FlowDashboard
      </vs-navbar-title>
<!--      <vs-navbar-item index="0" style="color:white; padding-left:5px">-->
<!--        <a href="http://localhost:8080/home">Home</a>-->
<!--      </vs-navbar-item>-->
      <vs-navbar-item index="0" style="color:white; padding-left:5px">
        <a href="http://localhost:8080/home">Data</a>
      </vs-navbar-item>
      <vs-navbar-item index="2" style="color:white; padding-left:5px">
        <a href="http://localhost:8080/gallery">Gallery</a>
      </vs-navbar-item>
      <vs-navbar-item index="1" style="color:white; padding-left:5px">
        <a href="http://localhost:8080/blue">Editor</a>
      </vs-navbar-item>
    </div>


    <vs-spacer></vs-spacer>
    <vs-dropdown class="color-panel"  vs-custom-content vs-trigger-click>
    <vs-button class='tool_button' radius color="#1473e6" type="filled"
               icon="star" size="small" ></vs-button>
      <vs-dropdown-menu class="loginx">
      <div style="height: 280px;width: 250px">
        <p style="height: 20px;font-size: 15px;text-align: center;background: #2c3e50;color: #FFFFFF">Vis Palette</p>
        <h4>Color</h4>
        <div style="padding-left: 10px;margin-bottom: 2.5rem">
          <div style="display: flex;height: 60px;padding: 5px;border: 1px solid;
          background: #f2f2f2;border-radius: 5px;flex-flow: wrap;overflow: auto">
            <div class="color-item" :id="`color${index}`" v-for="(item,index) in preDefineColor" :key="index"
                 :style="{background:item.color, border:item.select?'2px solid red':'none'}"
                 @click="visPaletteSetting(item, 1, index)"></div>
          </div>
          <vs-button style="width: 150px;height: 30px;position: absolute;right: 10px;margin-top: 0.5rem" color="success" @click="pushSet(1)">Use In My Design</vs-button>
        </div>
        <h4>Visual Forms</h4>
        <div style="padding-left: 10px;height: 80px">
          <div style="display: flex;margin-bottom: 0.5rem;height: 60px;border: 1px solid;padding: 5px;
          background: #f2f2f2;border-radius: 5px;flex-flow: wrap;overflow: auto">
            <div class="color-item" v-for="(item,index) in preDefineGrid"
                 :style="{width:'auto',opacity: item.select?1:0.5}" :key="index"
                 @click="addChart(item.chart)">{{item.chart}}</div>
          </div>
          <vs-button style="width: 150px;height: 30px;position: absolute;right: 10px" color="success" @click="pushSet(2)">Use In My Design</vs-button>
        </div>
      </div>
      </vs-dropdown-menu>
    </vs-dropdown>
    <vs-navbar-item index="2" style="color:white; padding-left:5px">
      <a href="http://localhost:8080/blue">About</a>
    </vs-navbar-item>
  </vs-navbar>
</template>
<script>
export default {
  name: "NavBar",
  data: function () {
    return {
      colors:[],
      others:[],
      forms:[],
    }
  },
  computed:{
    preDefineColor:function (){
      return this.$store.state.chartsColor.map(item=>{
        return {color:item, select:false}
      })
    },
    preDefineGrid:function (){
      return this.$store.state.chartTypes.map(item=>{
        return {chart:item, select:false}
      })
    }
  },
  methods:{
    visPaletteSetting(item, type, index){
      item.select = !item.select
      let dom = document.getElementById( `color${index}`)
      if(item.select == true){
        dom.style.border = "2px solid red"
        switch (type){
          case 1:this.colors.push(item.color);break
          case 2:this.others.push(item.color);break
          case 3:this.forms.push(item.chart);break
        }
      }else {
        dom.style.border = "none"
        switch (type){
          case 1:this.colors = this.colors.filter(e=>{return e!==item.color});break
          case 2:this.others = this.others.filter(e=>{return e!=item.color});break
          case 3:this.forms = this.forms.filter(e=>{return e!=item.chart});break
        }
      }
    },
    addChart(chart){
      console.log(chart)
      this.$emit('addChart', chart)
    },
    pushSet(type){
      switch (type){
        case 1:this.$store.state.preChartStyle.visPalette.Color.Background = this.colors;
          this.$store.state.preChartStyle.visPalette.Color.Other = this.others;break;
        case 2:this.$store.state.preChartStyle.visualForms = this.forms
      }
    }
  }
}
</script>
<style>
li {
  margin: 0.1% !important
}
.color-panel-box{
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #1473e6;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.color-btn{
  width: 20px;
  height: 20px;
  background-color: #FA8BFF;
  background-image: linear-gradient(180deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%);
}
.color-item{
  width: 25px;
  height: 20px;
  background: #1473e6;
  color: white;
  padding: 3px;
  margin-right: 0.5rem;
  box-shadow: 1px 1px;
  border-radius: 3px;
}
.vs-popup{
  width: 20%;
}
</style>
