import {number} from "mathjs/lib/utils";
import mapData from "../../assets/us-10m.json";
import earthQuakes from "../../assets/earthquakes.json"
import worldMap from "../../assets/world-110m.json"

export default class VegaModel {

  constructor(height, width, name) {
    this.data = {}
    this.data["width"] = width;
    this.data["height"] = height;
    this.data["layer"] = [];
    this.data['background'] = '#ffffff'
    // this.data['$schema'] = "https://vega.github.io/schema/vega-lite/v5.json"
    this.data["autosize"] = {
      "type": "fit",
      "contains": "padding"
    }
    this.data['marks'] = []
    this.data['projections'] = []
    this.config = {}

    this['data'].title = {
      "text": name,
      "anchor": "middle",
      "fontSize": 20
    }

    this.layers = {}
    this.chartType = ''
    this.filterAttr=""
    this.isFilterSource = false
  }

  getData() {
    return this.data['data']['values']
  }

  setData(values, type = 0) {
    if (type == 0) {
      this.data['data'] = {}
      this.data['data']['values'] = values
    } else {
      this.data['data'] = []
      this.data['data'].push({
        "name": "sphere",
        "values": [
          {"type": "Sphere"}
        ]
      })
      this.data['data'].push({
        "name": "world",
        "values": worldMap,
        "format": {"type": "topojson", "feature": "countries"},
      })
      this.data['data'].push({
        "name": "earthquakes", "values": earthQuakes, "format": {
          "type": "json",
          "property": "features"
        }
      })
      // this.data['data'].push({'name': "mapdata", 'values': values})
    }

  }

  //Set the encoding rule, if there are one more layer, the encoding will add to corresponding with layer ID
  setEncoding(parent, rule) {
    if (parent in this.layers) {
      let meta = {'field': rule.name, 'type': rule.type}
      this.layers[parent].encoding[rule.key] = meta
    } else {
      this.layers[parent] = {'encoding': {}}
      let meta = {'field': rule.name, 'type': rule.type}
      this.layers[parent].encoding[rule.key] = meta
      this.layers[parent]['width'] = this.data["width"]
      this.layers[parent]['height'] = this.data["height"]
      this.data.layer.push(this.layers[parent])
    }
  }
  setDescription(text) {
    this['data'].description = text
  }
  setTransform(data){
    this.data.layer.transform = [data]
  }
  setMark(parent, mark) {

    this.layers[parent].mark = mark

    if (mark == 'line') {

      let fill = ''
      let stroke = '#FE7F2D'
      this.layers[parent].mark = {'type': mark, 'fill': fill, 'stroke': stroke}
    } else if (mark == 'bar') {

      let fill = '#FCCA46'
      let stroke = ''
      this.layers[parent].mark = {'type': mark, 'fill': fill, 'stroke': stroke}
    } else if (mark == 'point') {

      let fill = '#A1C181'
      let stroke = '#fff'
      this.layers[parent].mark = {'type': mark, 'fill': fill, 'stroke': stroke}
    } else if (mark == 'boxplot') {

      let fill = '#57EC87'
      let stroke = '#fff'
      let opacity = '0.7'
      this.layers[parent].mark = {'type': mark, 'fill': fill, 'stroke': stroke, 'opacity': opacity}
    } else if (mark == 'path') { //新增的地图组件
      let markSet = {
        "type": mark,
        "from": {"data": "states"},
        "encode": {"enter": {"fill": {"value": "#dedede"}, "stroke": {"value": "white"}}}
      }
      this.layers[parent].mark = markSet
    }else if(mark == 'text'){
      this.data["$schema"] = "https://vega.github.io/schema/vega/v5.json"
      // this.data['data'] = []
      // this.data['layer'] = []
      let width = this.data['width']
      let height = this.data['height']
      // this.data['signals'] = [{
      //   "name": "myText",
      //   "value": "Hello, World!"
      // }]
      this.data["title"] = {}
      this.data['chartType'] = "textChart"
      let fontSize = 18
      let len = 10
      let text1 = "Globally"
      let text2 = "6:06pm CET, 21 March 2023"
      let text3 = "761,071,826"
      let text4 = "6,879,677"
      this.data['marks'] = [
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": text1},
              "x": {"value": 10},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
              "fill":{'value':"blue"},
              "fontWeight":{"value":"bold"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": ",as of "},
              "x": {"value": 10+len*text1.length},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "6:06pm CET, 21 March 2023"},
              "x": {"value": 10+len*(text1.length+7)},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
              "fill":{'value':"blue"},
              "fontWeight":{"value":"bold"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": ", there have been "},
              "x": {"value": 10+len*(text1.length+7+text2.length)},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "761,071,826"},
              "x": {"value": 10+len*(text1.length+7+text2.length + (", there have been ").length)},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
              "fill":{'value':"blue"},
              "fontWeight":{"value":"bold"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "confirmed cases of COVID-19, includng"},
              "x": {"value": 10+len*(text1.length+7+text2.length + (", there have been ").length + text3.length)},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "6,879,677"},
              "x": {"value": 10+len*(text1.length+7+text2.length + (", there have been ").length + text3.length + ("confirmed cases of COVID-19, includng").length)},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
              "fill":{'value':"orange"},
              "fontWeight":{"value":"bold"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": " deaths. reported to WHO. As of"},
              "x": {"value": 10+len*(text1.length+7+text2.length + (", there have been ").length + text3.length + ("confirmed cases of COVID-19, includng").length + text4.length)},
              "y": {"value": 80},
              "fontSize": {"value": fontSize},
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "20 Marrh 2021"},
              "x": {"value": 200},
              "y": {"value": 100},
              "fontSize": {"value": fontSize},
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": " a total nf"},
              "x": {"value": 200 + len*(("20 Marrh 2021").length)},
              "y": {"value": 100},
              "fontSize": {"value": fontSize},
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "13 760 401 200"},
              "x": {"value": 200 + len*(("20 Marrh 2021").length + " a total nf".length)},
              "y": {"value": 100},
              "fontSize": {"value": fontSize},
              "fill":{'value':"green"},
              "fontWeight":{"value":"bold"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "text": {"value": "varrina rinuae have hoen administered"},
              "x": {"value": 200 + len*(("20 Marrh 2021").length + " a total nf".length + "13 760 401 200".length)},
              "y": {"value": 100},
              "fontSize": {"value": fontSize},
            }
          }
        },
        ]
    }


  }
  getOutput() {

    if (this.data['data'] != undefined && this.data['data']['values'] != undefined) {

      if (this.mark != undefined) {

        if (this['data']['encoding'] != undefined) {

          return this.data
        }
      }
    }

    return 'wrong argument'
  }

  //Output vega configuration and without check
  getOutputForced() {
    return this.data
  }

  getMapData() {
    console.log(this.data)
    let mapData = []
    this.data['data'].values.forEach(item => {
      mapData.push({
        'type': 'Feature',
        'properties': {
          'id': item.id,
          'time': item.time
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [parseFloat(item.lng), parseFloat(item.lat)]
        }
      })
    })
    return mapData
  }

  getConfig() {
    for (let key in this.data) {
      if (key !== 'data') {
        this.config[key] = this.data[key]
      }
    }

    return this.config
  }

  reset() {
    //console.log("reset before", this.data.layer)
    this.data["layer"] = [];
    //this.data["data"] = {};
    //console.log("reset after", this.data.layer)
    this.layers = {}
  }
  setMarks(type) {
    if (type.indexOf('Map') != -1) {
      this.data['marks'].push({
        "type": "shape",
        "from": {"data": "sphere"},
        "encode": {
          "update": {
            "fill": {"value": "aliceblue"},
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 1.5}
          }
        },
        "transform": [
          {
            "type": "geoshape",
            "projection": "projection"
          }
        ]
      })
      this.data['marks'].push({
        "type": "shape",
        "from": {"data": "world"},
        "encode": {
          "update": {
            "fill": {"value": "mintcream"},
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 0.35}
          }
        },
        "transform": [
          {
            "type": "geoshape",
            "projection": "projection"
          }
        ]
      })
      this.data['marks'].push({
        "type": "shape",
        "from": {"data": "earthquakes"},
        "encode": {
          "update": {
            "opacity": {"value": 0.25},
            "fill": {"value": "red"}
          }
        },
        "transform": [
          {
            "type": "geoshape",
            "projection": "projection",
            "pointRadius": {"expr": "scale('size', exp(datum.properties.mag))"}
          }
        ]
      })
      this.data['projections'].push({
        "name": "projection", "type": "mercator", "scale": {"signal": "scale"},
        "translate": [{"signal": "translateX"}, {"signal": "translateY"}]
      })
      // this.data['projections'].push()
      this.data['signals'] = []
      this.data['signals'].push({
        "name": "translateX",
        "value": 450,
        "bind": {"input": "range", "min": -500, "max": 1200},
        "padding": {"top": 10, "left": 0, "right": 100, "bottom": 0},
      })
      this.data['signals'].push({
        "name": "translateY", "value": 260,
        "bind": {"input": "range", "min": -300, "max": 700},
        "padding": {"top": 10, "left": 0, "right": 30, "bottom": 0},
      })
      this.data['signals'].push({
        "name": "scale", "value": 100,
        "bind": {"input": "range", "min": 0, "max": 3000},
        "padding": {"top": 10, "left": 0, "right": 30, "bottom": 0},
      })
      this.data['scales'] = []
      this.data['scales'].push({
        "name": "size",
        "type": "sqrt",
        "domain": [0, 100],
        "range": [0, 6]
      })
    }
  }
}


//vega lite根据下面的配置，增加点击高亮 显示的功能

