<template>
  <AppDialog :title="isReadOnly?'用户详情':(data?'编辑':'新建')+'用户'">
    <el-form :model="form" :rules="formRules" :disabled="isReadOnly" ref="form" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="username" label="用户名称">
            <el-input :disabled="!!data" v-model="form.username" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!data">
          <el-form-item prop="password" label="密码">
            <el-input :disabled="!!data" v-model="form.password" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="fullname" label="真实姓名">
            <el-input v-model="form.fullname" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="phonenum" label="手机号">
            <el-input v-model="form.phonenum" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button v-if="isReadOnly" @click="$emit('close','cancle')" :disabled="loading">完成</el-button>
      <template v-else>
        <el-button @click="$emit('close','cancle')" :disabled="loading">取消</el-button>
        <el-button @click="submit" :loading="loading" type="primary">保存</el-button>
      </template>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import * as api from '../../common/api'
import * as rules from '../../common/form-rules'

export default {
  components: {
    AppDialog
  },
  props: {
    data: {},
    mode: {}
  },
  data() {
    return {
      loading: false,
      form: {
        id: null,
        username: '',
        password: '',
        fullname: '',
        phonenum: ''
      }
    }
  },
  computed: {
    isReadOnly() {
      return this.mode === 'view'
    }
  },
  created() {
    if (this.data) {
      Object.assign(this.form, this.data)
    }
  },
  beforeMount() {
    const required = rules.required()
    this.formRules = {
      username: [required],
      password: this.data ? [] : [required],
      fullname: [required],
      phonenum: [required, rules.phoneFormat()]
    }
  },
  methods: {
    async submit() {
      this.loading = true
      try {
        await this.$refs.form.validate()
        const postBody = {
          ...this.form
        }

        if (this.data) {
          await api.updateUser(postBody)
          this.$emit('close', 'update')
        } else {
          await api.addUser(postBody)
          this.$emit('close', 'add')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

