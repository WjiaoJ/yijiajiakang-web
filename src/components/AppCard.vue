<style lang="scss" scoped>
.app-card-home {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: #fff;
  border: 1px solid #ebeef5;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  .title {
    padding-left: 20px;
    line-height: 2;
    background-color: #59a4ca;
  }
  .card-container {
    min-height: 0;
    flex: 1;
  }
}
</style>
<template>
  <div class="app-card-home">
    <div class="title">{{title}}</div>
    <div class="card-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {}
  }
}
</script>

