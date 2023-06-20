<template>
    <div class="word-highlight" :id="container">
        {{text}}
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

    }
  },
  mounted() {
    this.hightLight()
    console.log("加载wordHighlight")
  },
  methods:{
    hightLight(){
      const div = document.getElementById(this.container);
      const text = div.innerText; // 获取 div 元素中的文本

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
</style>
