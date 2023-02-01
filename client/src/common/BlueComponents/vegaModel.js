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
      this.data['data'].push({"name": "sphere",
        "values": [
          {"type": "Sphere"}
        ]})
      this.data['data'].push({
        "name": "world",
        "values": worldMap,
        "format": {"type": "topojson", "feature": "countries"},
        // "transform": [
        //   {
        //     "type": "geopath",
        //     "projection": "projection"
        //   }
        // ]
      })
      this.data['data'].push({"name":"earthquakes", "values":earthQuakes, "format": {
          "type": "json",
          "property": "features"
        }})
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

  //Get the vega configuration without detail data
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
      // this.data['marks'].push({
      //   "type": "path",
      //   "from": {"data": "states"},
      //   "encode": {
      //     "enter": {
      //       "fill": {"value": "#dedede"},
      //       "stroke": {"value": "white"}
      //     },
      //     "update": {
      //       "path": {"field": "path"}
      //     }
      //   }
      // })
      this.data['marks'].push({"type": "shape",
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
        ]})
      this.data['marks'].push({ "type": "shape",
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
        ]})
      this.data['marks'].push({ "type": "shape",
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
        ]})
      this.data['projections'].push({"name": "projection", "type": "mercator","scale": {"signal": "scale"},
        "translate": [{"signal": "translateX"}, {"signal": "translateY"}]})
      // this.data['projections'].push()
      this.data['signals'] = []
      this.data['signals'].push({
        "name": "translateX",
        "value": 450,
        "bind": {"input": "range", "min": -500, "max": 1200},
        "padding": {"top": 10, "left": 0, "right": 100, "bottom": 0},
      })
      this.data['signals'].push({ "name": "translateY", "value": 260,
        "bind": {"input": "range", "min": -300, "max": 700},
        "padding": {"top": 10, "left": 0, "right": 30, "bottom": 0},
      })
      this.data['signals'].push({"name": "scale", "value": 100,
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
    // setMapBaseData(data){
    //   this.data['data'].values = data
    //   this.data['data'].format = {"type": "topojson","feature": "counties"}
    //   this.data['data'].projection = {"type": "albersUsa"}
    //   this.data['data'].mark = "geoshape"
    // }
