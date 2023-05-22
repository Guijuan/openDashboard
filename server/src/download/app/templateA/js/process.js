var app = new Vue({
	el: '#autoboard',
	data() {
		return {
			items: [],
			ModularInfo: {},
			chartStyle: {
				"chartA": {
					"width": 828,
					"height": 390
				},
				"chartB": {
					"width": 828,
					"height": 390
				},
				"chartC": {
					"width": 828,
					"height": 390
				},
				"chartD": {
					"width": 828,
					"height": 390
				}
			},
			layoutObj: {}
		}
	},
	mounted() {
		this._init()
	},
	props: ["layout"],
	methods: {
		_init() {
			let that = this
			d3.json("config.json", function(err, data) {
				const layoutName = Object.keys(data)[0]
				for(let key in data['Layout-0']){
					console.log(key);
					console.log(data['Layout-0'][key]);
					that.chartStyle[key]['width'] = data['Layout-0'][key]['data']['layer'][0]['width'];
					that.chartStyle[key]['height'] = data['Layout-0'][key]['data']['layer'][0]['height'];
					document.getElementById(key).style.transform = `translate3d(${data['Layout-0'][key]['data']['x']}px,${data['Layout-0'][key]['data']['y']}px,0px)`;
				}
				that.getModularInfo({
					"config": data[layoutName],
					"layoutname": layoutName
				})
			})
		},
		getModularInfo(m) {
			let that = this
			this.layoutObj = JSON.parse(JSON.stringify(m))
			console.log(this.layoutObj);
			//this.calculateChartWH()
			//this.setBackgroundColor()
			this.adaptWidthHeight()
			this.generateGraph()

		},
		adaptWidthHeight() {
			//this.layoutObj.[chartA].data.height/width
			let that = this
			let chartList = Object.keys(that.chartStyle)
			chartList.forEach(function(d) {
				if(that.layoutObj["config"][d] != undefined) {
					//用vega model 自带的set方法
					that.layoutObj["config"][d]["data"]["height"] = that.chartStyle[d]["height"]
					that.layoutObj["config"][d]["data"]["width"] = that.chartStyle[d]["width"]
					let _layer = that.layoutObj["config"][d]["data"]["layer"]
					//console.log("_layer", _layer)
					_layer.forEach(function(v) {
						v.height = that.chartStyle[d]["height"]
						v.width = that.chartStyle[d]["width"]
					})
				}
			})
		},
		generateGraph() {
			let that = this
			let charts = Object.keys(that.layoutObj["config"])
			charts.forEach(function(d) {
				console.log(d);
				if(that.layoutObj['config'][d]['chartType']=='Map'){
					document.getElementById(d).style.height = that.layoutObj["config"][d]['data']['height'].toString()+'px'
					document.getElementById(d).style.width = that.layoutObj["config"][d]['data']['width'].toString()+'px'
					that.createMap(d,that.layoutObj["config"][d]["data"]['data']['values'])
				}
				else {
					vegaEmbed("#" + d, that.layoutObj["config"][d]["data"])
				}
			})
		},
		createMap(container,data) {
			// console.log(this.getMapData)
			console.log(container);
			mapboxgl.accessToken = 'pk.eyJ1Ijoid2pzMjIyIiwiYSI6ImNreGVkYnBlbDBtMnoyb3BlM2Jib3dxcDAifQ.GKErleh4uNcXyGpxdQa-og'
			this.map = new mapboxgl.Map({
				container: container,
				// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
				style: 'mapbox://styles/mapbox/light-v11',
				// center: this.getMapData.length>0?this.getMapData[0].geometry.coordinates:[-90.96, -0.47],
				center:[-90.96, -0.47],
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
						'features':data
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
	}
})