<template>
  <div :id="container" style="width: 99%;height: 99%;padding: 0px"></div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "Map",
  data() {
    return {
      mapObj: null
    }
  },
  props:{
    container:null
  },
  mounted() {
    // console.log(this.getMapData)
    this.createMap()
  },
  computed:{
    ...mapGetters(['getMapData'])
  },
  methods: {
    createMap() {
      console.log(this.getMapData)
      console.log(this.container);
      console.log(this.getMapData);
      mapboxgl.accessToken = this.mapToken
      this.map = new mapboxgl.Map({
        container: this.container,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/light-v11',
        center: this.getMapData.length>0?this.getMapData[0].geometry.coordinates:[-90.96, -0.47],
        zoom: 7.2
      });
      this.map.on('load', () => {
        // Add a GeoJSON source with 3 points.
        this.map.addSource('points', {
          'type': 'geojson',
          // 'data': {
          //   'type': 'FeatureCollection',
          //   'features': [
          //     {
          //       'type': 'Feature',
          //       'properties': {},
          //       'geometry': {
          //         'type': 'Point',
          //         'coordinates': [-91.3952, -0.9145]
          //       }
          //     },
          //     {
          //       'type': 'Feature',
          //       'properties': {},
          //       'geometry': {
          //         'type': 'Point',
          //         'coordinates': [-90.3295, -0.6344]
          //       }
          //     },
          //     {
          //       'type': 'Feature',
          //       'properties': {},
          //       'geometry': {
          //         'type': 'Point',
          //         'coordinates': [-91.3403, 0.0164]
          //       }
          //     }
          //   ]
          // }
          'data':{
            'type':'FeatureCollection',
            'features':this.getMapData
          }
        });
        // Add a circle layer
        this.map.addLayer({
          'id': 'circle',
          'type': 'circle',
          'source': 'points',
          'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Center the map on the coordinates of any clicked circle from the 'circle' layer.
        this.map.on('click', 'circle', (e) => {
          this.map.flyTo({
            center: e.features[0].geometry.coordinates
          });
        });

        // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
        this.map.on('mouseenter', 'circle', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        this.map.on('mouseleave', 'circle', () => {
          this.map.getCanvas().style.cursor = '';
        });
      });
    },
    reSizeMap(){
      console.log(document.getElementById(this.container).parentNode);
      this.map.resize();
    }
  }
}
</script>

<style scoped>
/*#map{*/
/*  width: 80%;*/
/*  height: 80%;*/
/*}*/
</style>
