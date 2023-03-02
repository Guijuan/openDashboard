<template>
    <div class="word-highlight">
        这是一段测试文本，其中包含数据1000，动物1000只，等数据、
    </div>
</template>

<script>
export default {
  name: "WordHighlight"
}
</script>

<style scoped>
.word-highlight{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: auto;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1)
}
</style>
