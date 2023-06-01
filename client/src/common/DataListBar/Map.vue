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
    console.log(this.getMapData_2)
    if("select" in this.getMapData_2){
      this.createMap2()
    }
    else {
      this.createMap()
    }
  },
  watch:{
    getMapData_2:{
      handler(newVal) {
        console.log(newVal);
        this.reCreate()
      },
      deep:true
    },
  },
  computed:{
    ...mapGetters(['getMapData']),
    ...mapGetters(['getMapData_2'])
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
    createMap2(){
      console.log("createMap2")
      this.select = this.getMapData_2.select
      this.data = this.getMapData_2.data
      let nameList = []
      let select_list = []
      console.log("筛选条件：",this.select)
      this.data.values.forEach(item=>{
        if(item.Name!="Global"){
          select_list.push(item[this.select]);
        }
      })
      let select_max = Math.max(...select_list)
      this.data.values.forEach(item=>{
        if(item.Name!="Global"){
          let nameTemp = item.Name;
          let hdi = item[this.select]/select_max
          nameList.push({'code':nameTemp,"hdi":hdi})
        }
      })
      mapboxgl.accessToken = this.mapToken
      this.map = new mapboxgl.Map({
        container:  this.container,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/light-v11',
        center: [12, 50],
        zoom: 5,
      });
      // const data = [
      //   { 'code': 'Croatia', 'hdi': 0.811 },
      // ];

      this.map.on('load', () => {
        // Add source for country polygons using the Mapbox Countries tileset
        // The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
        // https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
        this.map.addSource('countries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });

        // Build a GL match expression that defines the color for every vector tile feature
        // Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
        const matchExpression = ['match', ['get', 'name_en']];

        // Calculate color values for each country based on 'hdi' value
        for (const row of nameList) {
          // Convert the range of data values to a suitable color
          const green = row['hdi'] * 255;
          const color = `rgb(0, ${green}, 0)`;

          matchExpression.push(row['code'], color);
        }

        // Last value is the default, used where there is no data
        matchExpression.push('rgba(0, 0, 0, 0)');


        // The mapbox.country-boundaries-v1 tileset includes multiple polygons for some
        // countries with disputed borders.  The following expression filters the
        // map view to show the "US" perspective of borders for disputed countries.
        // Other world views are available, for more details, see the documentation
        // on the "worldview" feature property at
        // https://docs.mapbox.com/data/tilesets/reference/mapbox-countries-v1/#--polygon---worldview-text
        const WORLDVIEW = "US";
        const worldview_filter = [ "all", [ "==", ["get", "disputed"], "false" ], [ "any", [ "==", "all", ["get", "worldview"] ], [ "in", WORLDVIEW, ["get", "worldview"] ] ] ];

        // Add layer from the vector tile source to create the choropleth
        // Insert it below the 'admin-1-boundary-bg' layer in the style
        this.map.addLayer(
          {
            'id': 'countries-join',
            'type': 'fill',
            'source': 'countries',
            'source-layer': 'country_boundaries',
            'paint': {
              'fill-color': matchExpression
            },
            'filter': worldview_filter
          },
          'admin-1-boundary-bg'
        );
      });
    },
    reCreate(){
      this.map.remove();
      this.createMap2();
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
