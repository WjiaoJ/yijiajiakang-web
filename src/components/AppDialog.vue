<style lang="scss" scoped>
.app-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  background: rgba($color: #000, $alpha: 0.1);
  overflow: auto;
}

.app-dialog {
  margin: 150px auto;
  width: 500px;
  padding: 0 15px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
}

.app-dialog__header {
  text-align: center;
  font-size: 18px;
  font-weight: bolder;
  padding: 20px;
}
.app-dialog__body {
  padding-right: 30px;
}

.app-dialog__footer {
  padding-bottom: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div class="app-dialog__wrapper">
    <div class="app-dialog">
      <div class="app-dialog__header">{{ title }}</div>
      <div class="app-dialog__body">
        <slot></slot>
      </div>
      <div class="app-dialog__footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' }
  }
}
</script>

