<template>
  <div>
    <div class="word-highlight" :id="container">
      {{text}}
    </div>
<!--    <el-dialog-->
<!--      id="text-input"-->
<!--      title="提示"-->
<!--      :visible.sync="visible"-->
<!--      width="30%"-->
<!--      :before-close="handleClose">-->
<!--      <span>这是一段信息</span>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="visible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="visible = false">确 定</el-button>-->
<!--  </span>-->
<!--    </el-dialog>-->
    <el-popover
      placement="top-start"
      id="text-input"
      :width="elWidth"
      v-model="visible">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="text">
      </el-input>
    </el-popover>
  </div>

</template>

<script>
export default {
  name: "WordHighlight",
  props:{
    text:{
      default:'测试用例.数据1：10000；数据2：2123123'
    },
    container: null
  },
  data(){
    return{
      visible:false,
      elWidth:160,
    }
  },
  watch:{
    text:{
      handler(newVal){
        this.hightLight()
        this.$store.state.wordText = this.text;
      }
    }
  },
  mounted() {
    let that = this
    this.hightLight()
    console.log("加载wordHighlight")
    // 添加双击事件
    let element = document.getElementById(this.container)
    let text_input = document.getElementById("text-input")
    element.ondblclick = function () {
      // text_input.width = `${element.clientWidth}px`
      that.elWidth = element.clientWidth
      that.visible = !that.visible
      console.log("文本双击事件")
      return false
    }
  },
  methods:{
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    hightLight(){
      const div = document.getElementById(this.container);
      let that = this;
      const text = this.text; // 获取 div 元素中的文本

      // 使用正则表达式匹配数字和单位，然后用 <span> 标签包裹起来
      const regex = /(\d+\.\d+|\d+)(个|只|匹|头|支|张|颗|粒|条|份|份儿|瓶|杯|碗|盘|包|袋|桶|箱|件|罐|盒|斤|千克|公斤|毫升|升|厘米|毫米|米|千米|英寸|寸|英尺|尺|码|公里|里|分钟|小时|天|年|月|周|季度)?/g;
      const highlightedText = text.replace(regex, (match, number, unit) => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); // 生成随机颜色
        return `<strong style="color: ${randomColor};font-weight: 600">${number}${unit==undefined?"":unit}</strong>`;
      });

      // 将高亮的文本放回到 div 中
      div.innerHTML = highlightedText;
    }
  }
}
</script>

<style scoped>
.word-highlight{
  display: flex;
  padding: 10px;
  width: auto;
  min-width: 300px;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1)
}
.el-dialog{
  z-index: 200;
}
#text-input{
  z-index: 10000;
}
</style>
