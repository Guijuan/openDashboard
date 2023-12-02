var app = new Vue({
	el: '#autoboard',
	data() {
		return {
			selected:null,
			targetSelect:[],
			sourceSelect:[],
			select1Option:null,
			select2Option:null,
			mapData:null,
			mapID:null,
			blueColor:["#007092","#008ebc","#00ace3","#54cbf2","#95dcf4","#ffedc1","#b6b6b6"],
			redColor:["#994414","#bb551b","#d86422","#e08d5e","#e2a786","#ffedc1","#b6b6b6"],
			items: [],
			ModularInfo: {},
			chartStyle: {
				"Chart-0": {
					"width": 828,
					"height": 390
				},
				"Chart-1": {
					"width": 828,
					"height": 390
				},
				"Chart-2": {
					"width": 828,
					"height": 390
				},
				"Chart-3": {
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
				// const layoutName = Object.keys(data)[0]
				for(let key in data){
					console.log(key);
					console.log(data[key]);
					that.chartStyle[key]['width'] = data[key]['data']['layer'][0]['width'];
					that.chartStyle[key]['height'] = data[key]['data']['layer'][0]['height'];
					// document.getElementById(key).style.transform = `translate3d(${data[key]['data']['x']}px,${data[key]['data']['y']}px,0px)`;
				}
				that.getModularInfo({
					"config": data,
					"layoutname": "layout"
				})
			})
		},
		getModularInfo(m) {
			let that = this
			this.layoutObj = JSON.parse(JSON.stringify(m))
			console.log(this.layoutObj);
			//this.calculateChartWH()
			//this.setBackgroundColor()
			if(that.layoutObj['config']["Chart-0"]['chartType']!='Map'){
				this.adaptWidthHeight()
			}
			this.generateGraph()
			this.createAbout(this.layoutObj['config'])
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
					if("select_1" in that.layoutObj['config'][d]){
						document.getElementById(d).style.height = that.layoutObj["config"][d]['data']['height'].toString()+'px'
						document.getElementById(d).style.width = that.layoutObj["config"][d]['data']['width'].toString()+'px'
						that.targetSelect = that.layoutObj["config"][d]["select_1"].split(" ")
						that.createMap2(d,that.layoutObj['config'][d]["select_1"],that.layoutObj["config"][d]["data"]['data']['values'])
						that.setWHOText(that.layoutObj['config'][d]["text_chart"]['width'],that.layoutObj['config'][d]["text_chart"]['height'])
						that.mapID = d;
						that.mapData = that.layoutObj['config'][d]["data"]["data"]["values"];
						that.createSelect(that.layoutObj['config'][d]["select_chart"]['width'],that.layoutObj['config'][d]["select_chart"]['height'],that.layoutObj['config'][d]["select_1"],that.layoutObj['config'][d]["data"]["data"]["values"])
					}
					else{
						document.getElementById(d).style.height = that.layoutObj["config"][d]['data']['height'].toString()+'px'
						document.getElementById(d).style.width = that.layoutObj["config"][d]['data']['width'].toString()+'px'
						that.createMap(d,that.layoutObj["config"][d]["data"]['data']['values'])
					}
				}
				else {
					that.setConfig(that.layoutObj["config"][d].data, that.layoutObj["config"][d].filterStyle)
					vegaEmbed("#" + d, that.layoutObj["config"][d]["data"]).then(res=>{
						that.addChartEvent(res.view, d)
					})
				}
			})
		},
		addChartEvent(view, name){
			let that = this
			view.addSignalListener('pts', function (e, value) {
				console.log(value)
				let vegaModel = that.layoutObj["config"][name]
				console.log(vegaModel)
				if(vegaModel.isFilterSource){
					let target = vegaModel.filterTarget
					let targetObj = that.layoutObj["config"][target]
					let data = targetObj.data
					data.layer[0]['encoding']['opacity']={"condition":{"test":`datum.region=='${value.region[0]}'`,"value":1}, "value":0.3}
					// let dom = document.getElementById(`#${target}`)
					vegaEmbed(`#${target}`, data)
						.then(res=>{
							res.view.addEventListener('click', function (e){
								console.log(e)
								data.layer[0]['encoding']['opacity'] = {"condition":{"selection":"pts", "value":1}, "value":0.3}
								vegaEmbed(`#${target}`, data)
							})
						})
				}
			})
		},
		setConfig(result, hasStyle){
			result.layer[0]['selection'] = {"pts": {"type": "single", "encodings": ["y"]}}
			result.layer[0]['encoding']["opacity"] = {"condition": {"selection": "pts", "value": 1}, "value": 0.1}
			console.log(result)
			if(hasStyle){
				result.layer[0]['encoding']["opacity"] = {"condition": {"selection": "pts", "value": 1}, "value": 0.1}
				result.layer[0]['encoding']["fill"] = {"condition": {"selection": "pts", "value": 0.1}}
				result.layer[0].encoding.fill = {"scale": {
						"domain":['AFRO','AMRO','EMRO','EURO','Other','SEARO','WPRO'],
						"range": hasStyle.unselected}, "field": "region"}
			}
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
		createMap2(container,select,data){
			console.log("createMap2")
			this.select = select
			this.data = data
			let nameList = []
			let select_list = []
			let that = this;
			console.log("筛选条件：",this.select)
			this.data.forEach(item=>{
				if(item.Name!="Global"){
					select_list.push(item[this.select]);
				}
			})
			let select_max = Math.max(...select_list)
			this.data.forEach(item=>{
				if(item.Name!="Global"){
					let nameTemp = item.Name;
					let hdi = item[this.select]/select_max
					nameList.push({'code':nameTemp,"hdi":hdi})
				}
			})
			mapboxgl.accessToken = 'pk.eyJ1Ijoid2pzMjIyIiwiYSI6ImNreGVkYnBlbDBtMnoyb3BlM2Jib3dxcDAifQ.GKErleh4uNcXyGpxdQa-og';
			this.map = new mapboxgl.Map({
				container:  container,
				// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
				style: 'mapbox://styles/mapbox/light-v11',
				center: [12, 50],
				zoom: 5,
			});
			// const data = [
			//   { 'code': 'Croatia', 'hdi': 0.811 },
			// ];

			that.map.on('load', () => {
				// Add source for country polygons using the Mapbox Countries tileset
				// The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
				// https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
				debugger;
				that.map.addSource('countries', {
					type: 'vector',
					url: 'mapbox://mapbox.country-boundaries-v1'
				});
				let colorList = that.select.split(" ")[0]=="Cases"?that.blueColor:that.redColor;
				// Build a GL match expression that defines the color for every vector tile feature
				// Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
				const matchExpression = ['match', ['get', 'name_en']];

				// Calculate color values for each country based on 'hdi' value
				for (const row of nameList) {
					// Convert the range of data values to a suitable color
					// const green = row['hdi'] * 255;
					// const color = `rgb(0, ${green}, 0)`;
					let color = null;
					if(row["hdi"]>=0.9) color = colorList[0];
					else if(row["hdi"]>=0.7&&row["hdi"]<0.9) color = colorList[1];
					else if(row["hdi"]>=0.5&&row["hdi"]<0.7) color = colorList[2];
					else if(row["hdi"]>=0.3&&row["hdi"]<0.5) color = colorList[3];
					else if(row["hdi"]>=0.2&&row["hdi"]<0.3) color = colorList[4];
					else if(row["hdi"]>=0.1&&row["hdi"]<0.2) color = colorList[5];
					else if(row["hdi"]>=0&&row["hdi"]<0.1) color = colorList[6];

					matchExpression.push(row['code'], color);
				}

				// Last value is the default, used where there is no data
				matchExpression.push('rgba(0, 0, 0, 0)');
				console.log(matchExpression);


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
				that.map.addLayer(
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
		},
		createSelect(width=200,height=400,select,data){
			debugger;
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
				debugger;
				div1.textContent = `${data[0][`${that.select1Option} - cumulative total`]}`;
				div3.textContent = `${data[0][`${that.select1Option} - cumulative total per 100000 population`]}`;
				div5.textContent = `${data[0][`${that.select1Option} - newly reported in last 7 days`]}`;
				that.targetSelect[0] = that.select1Option;
				that.selected = `${that.targetSelect[0]} - ${that.targetSelect[2]}`
				that.reCreate();
			})
			select2.addEventListener('change',function (event) {
				that.select2Option = event.target.value;
				that.targetSelect[2] = that.select2Option;
				that.selected = `${that.targetSelect[0]} - ${that.targetSelect[2]}`
				that.reCreate();
				that.reCreate();
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
			formContainer.style.width=width;
			formContainer.style.height=height;
		},
		reCreate(){
			console.log("remove")
			this.map.remove();
			this.createMap2(this.mapID,this.selected,this.mapData);
		},
		createAbout(dataInfo){
			console.log(dataInfo)
			let sourceData = document.getElementById('source-data')
			let visualForm = document.getElementById('visual-forms')
			let interactions = document.getElementById('interactions')
			let sourceDataText = ""
			let visualFormText = ""
			let keys = Object.keys(dataInfo)
			for(let key of keys) {
				let baseData = dataInfo[key].data.baseData
				let dataDes = `${baseData.name} data is originated from <a href="${baseData.description.weblink}">${baseData.description.weblink}</a>, collected by <strong>${baseData.description.collector}</strong>. The update-frequency is ${'daily'
				}. Last update is on/at <strong>${baseData.description.lastUpate}</strong><br />`
				sourceDataText+=dataDes
				let aixText = "Meta for each column/field<br\>" +
											"Name Description Note<br\>"
				baseData.dimensions.forEach(item=>{
					aixText += `${item.name}	${item.description}<br\>`
				})
				sourceDataText += aixText
				sourceDataText += '<br\>'
				let chartType = Object.keys(dataInfo[key].layers)[0]
				let chartTitle = dataInfo[key].data.title.text
				let titleText =` Coding about the ${chartType} with ${chartTitle}\n`
				let encoding = Object.keys(dataInfo[key].data.layer[0].encoding)
				encoding = encoding.filter(item=>{return 'field' in dataInfo[key].data.layer[0].encoding[item]})
				let encodingText = ""
				for(let ek of encoding){
					let ekText = `-${ek} field encodes the ${dataInfo[key].data.layer[0].encoding[ek].field}\n`
					encodingText += ekText
				}
				visualFormText += titleText
				visualFormText += encodingText
				visualFormText += "\n"
			}
			// console.log(visualFormText)
			visualForm.innerText = visualFormText
			sourceData.innerHTML = sourceDataText
			//setting the text of interactions
			let interactionText =""
			interactionText += "Tooltip: more information is shown up on mouse over\n"
			interactionText += "Select: data item is highlighted on mouse click\n"
			interactions.innerText = interactionText
		}
	}
})