import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
      tabledata:null,
      chartArray: [], //所有图的basedata
      selectChartId: "", //选中图表的ID
      isActive: false,
      templateData:""
    },
    actions:{
        changeData(ctx,data){
            ctx.commit('changeData',data)
        }
    },
    mutations:{
        changeData(state,data){
            state.tabledata = data
        },
      changeSelectId(state, payload) {
          state.selectChartId = payload;
        },
    },
    getters:{
      getIsActive: state=>{
        return state.isActive
      },
      getSelectChartId:state=>{
        return state.selectChartId
      },
    }
})
