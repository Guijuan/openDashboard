<template>
  <vs-navbar class="nabarx" color='rgb(50, 60, 90)'>
    <div slot="title" style="display: flex;align-items: center">
      <vs-navbar-title style="color:white;">
        OpenVIS
      </vs-navbar-title>
      <vs-navbar-item index="0" style="color:white; padding-left:5px">
        <a href="http://localhost:8080/home">Home</a>
      </vs-navbar-item>
      <vs-navbar-item index="1" style="color:white; padding-left:5px">
        <a href="http://localhost:8080/blue">Dashboard</a>
      </vs-navbar-item>
      <vs-navbar-item index="2" style="color:white; padding-left:5px">
        <a href="http://localhost:8080/gallery">Gallery</a>
      </vs-navbar-item>
    </div>


    <vs-spacer></vs-spacer>
    <input type="color" style="width: 30px;height: 30px;"></input>
    <vs-button class='tool_button' radius color="#1473e6" type="filled"
               icon="view_quilt"></vs-button>
    <vs-navbar-item index="2" style="color:white; padding-left:5px">
      <a href="http://localhost:8080/blue">about</a>
    </vs-navbar-item>
  </vs-navbar>
</template>
<script>
export default {

  name: "NavBar",
  data: function () {
    return {}
  }
}
</script>
<style>
li {
  margin: 0.1% !important
}
</style>
