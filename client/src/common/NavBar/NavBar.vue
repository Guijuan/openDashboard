<template>
  <vs-navbar class="nabarx" color='rgb(50, 60, 90)'>
    <div slot="title" style="display: flex;align-items: center">
      <vs-navbar-title style="color:white;">
        FlowDashboard
      </vs-navbar-title>
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
    <vs-popup class="color-panel" :active.sync="colorPanelState" >
      <div class="panel-content">
        <div>
          <vs-divider>Vis Palette</vs-divider>
          <h4>Color</h4>
          <div style="display: flex;">
            <div class="color-item" v-for="(item,index) in preDefineColor" :key="index" :style="{background:item}"></div>
          </div>
          <vs-divider></vs-divider>
          <h4>Background</h4>
          <vs-divider></vs-divider>
          <h4>Other</h4>
          <vs-button color="#1473e6">Use In My Design</vs-button>
        </div>
        <div>
          <vs-divider>Visual Forms</vs-divider>
          <h3>gridPanel</h3>
          <div style="display: flex;margin-bottom: 10px">
            <div class="color-item" v-for="(item,index) in preDefineGrid" style="width: auto" :key="index">{{item}}</div>
          </div>
          <vs-button color="#1473e6">Use In My Design</vs-button>
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

.con-vs-popup .vs-popup{
  width: 300px;
}
.vs-button{
  width: 100%;
}
</style>
