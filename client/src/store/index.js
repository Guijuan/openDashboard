import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        tabledata:null,
      chartArray: [], //所有图的basedata
      selectChartId: "", //选中图表的ID

    },
    actions:{
        changeData(ctx,data){
            ctx.commit('changeData',data)
        }
    },
    mutations:{
        changeData(state,data){
            state.tabledata = data
        }
    }
})
