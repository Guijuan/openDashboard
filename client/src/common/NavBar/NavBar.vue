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
    <vs-button @click="colorPanelState=true" class='tool_button' radius color="#1473e6" type="filled"
               icon="star"></vs-button>
    <vs-popup class="color-panel" title="Vis Palette" :active.sync="colorPanelState">
      <div class="panel-content">
        <div>
          <vs-divider>Colors</vs-divider>
          <div style="display: flex;">
            <div class="color-item" v-for="(item,index) in preDefineColor" :key="index" :style="{background:item}"></div>
          </div>
          <div>
            <h3>自定义</h3>
          </div>
        </div>
        <div>
          <h3>gridPanel</h3>
          <div style="display: flex;">
            <div class="color-item" v-for="(item,index) in preDefineGrid" style="width: auto" :key="index">{{item}}</div>
          </div>
          <div>
            <h3>自定义</h3>
          </div>
        </div>
      </div>
    </vs-popup>
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
      colorPanelState:false,
      gridPanelState:false,

      preDefineColor:['red', 'green', 'blue','write'],
      preDefineGrid:['templateA','templateB']
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
</style>
