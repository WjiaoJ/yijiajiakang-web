<style lang="scss">
.login-page {
  background: #00142a;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  .login-pannel {
    width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translateY(-30%);
    .title {
      color: white;
      text-align: center;
      font-size: 30px;
      font-weight: bolder;
      color: #59a4ca;
      margin-bottom: 30px;
      .title-sm {
        font-size: 24px;
        font-weight: initial;
      }
    }
    .username {
      margin-bottom: 30px;
    }
    .login {
      width: 100%;
    }
    .error-msg {
      height: 30px;
      line-height: 30px;
      color: #f00;
    }
  }
  @media (max-width: 1023px) {
    .login-pannel {
      width: 260px;
    }
  }
}
</style>

<template>
  <div class="login-page">
    <div class="login-pannel">
      <div class="title">
        <div class="title-sm">医家家康后台管理系统</div>
      </div>
      <el-input v-model="username" @keyup.enter.native="login" class="username" placeholder="用户名"></el-input>
      <el-input
        v-model="password"
        @keyup.enter.native="login"
        class="password"
        type="password"
        placeholder="密码"
      ></el-input>
      <div class="error-msg">{{ errorMsg }}</div>
      <el-button @click="login" :loading="loading" class="login" type="primary">登录</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '../common/api'
import { AuthToken } from '../common/utils'
import store from '../store'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMsg: null,
      loading: false
    }
  },
  methods: {
    login() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.errorMsg = null
      api
        .login({ username: this.username, password: this.password })
        .then(res => {
          store.commit('setUserInfo', res.data)
          this.$router.replace({ path: '/' })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
