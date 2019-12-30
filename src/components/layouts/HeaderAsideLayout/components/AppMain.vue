<style lang="scss" scoped>
.app-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-bottom: 10px;
  padding-right: 10px;
  min-height: 0;
  overflow-y: auto;
  .main-layout-router-view {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>

<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <router-view class="main-layout-router-view"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>
