<style lang="scss">
#app {
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .router-view {
    min-width: 1360px;
    min-height: 750px;
  }
  @media (max-width: 1023px) {
    .router-view {
      min-width: 100px;
    }
  }
}
</style>

<template>
  <div id="app">
    <router-view class="router-view" />
  </div>
</template>
