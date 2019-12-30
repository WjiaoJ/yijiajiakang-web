<style lang="scss">
.navbar {
  height: 44px;
  color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .user-profile-container {
    cursor: pointer;
    .user-profile-content {
      display: flex;
      padding: 20px 0;
    }
    .menu-icons {
      display: flex;
      align-items: center;
      .menu-icon {
        padding: 0 12px;
        .icon {
          display: inline-block;
          font-size: 18px;
          text-align: center;
        }
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-right: 14px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
    }
    .user-name {
      color: #fff;
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 13px;
      font-size: 12px;
    }
  }
}
</style>

<template>
  <div class="navbar">
    <div class="user-profile-container" trigger="click">
      <div class="user-profile-content">
        <el-dropdown>
          <div class="user-profile-body">
            <img
              class="user-avatar"
              src="https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png"
            />
            <div>
              <span class="user-name">{{ userInfo.username }}</span>
            </div>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item>
              <span @click="dialogVisible = true" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout" style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dialog title="修改密码" id="el-dialog" :visible.sync="dialogVisible">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
            >
              <el-form-item label="用户名">
                <span>{{ userInfo.username }}</span>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/common/api'
import { AuthToken } from '@/common/utils'
import { mapState } from 'vuex'
import * as rules from '@/common/form-rules'

export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      ruleForm: {
        pass: '',
        checkPass: ''
      }
    }
  },
  computed: {
    ...mapState(['hasNewMessage'])
  },
  created() {
    if (typeof this.userInfo != 'object') {
      this.userInfo = JSON.parse(localStorage.userInfo)
    }
    this.rules = {
      pass: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 10, message: '密码长度为6-10个字符', trigger: 'blur' },
        rules.validId()
      ],
      checkPass: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== this.ruleForm.pass) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  methods: {
    async submitForm(formName) {
      this.loading = true
      try {
        await this.$refs[formName].validate()
        await api.modifyPassword(this.userInfo.id, {
          newPassword: this.ruleForm.pass
        })
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogVisible = false
        AuthToken.clean()
        this.$router.push('/login')
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    logout() {
      this.$confirm('确定退出?', '退出提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          AuthToken.clean()
          localStorage.userInfo = ''
          localStorage.type = ''
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>
