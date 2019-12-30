<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.main-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="app-wrapper">
    <side-bar class="sidebar-container"></side-bar>
    <div class="main-container">
      <nav-bar></nav-bar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components'
import { delay } from '@/common/utils'
import store from '@/store'
import * as api from '@/common/api'

export default {
  name: 'layout',
  components: {
    NavBar,
    SideBar,
    AppMain
  },

  beforeDestroy() {
    this._destoryed = true
  },
  methods: {}
}
</script>
