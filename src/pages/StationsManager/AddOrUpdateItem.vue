<template>
  <AppDialog :title="isReadOnly?'场站详情':(data?'编辑':'新建')+'场站'">
    <el-form :model="form" :rules="formRules" :disabled="isReadOnly" ref="form" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="groupid" label="场站号">
            <el-input :disabled="!!data" clearable v-model="form.groupid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="groupname" label="场站名称">
            <el-input clearable v-model="form.groupname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="grouppos" label="地址">
            <el-input clearable v-model="form.grouppos"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="charge_man" label="负责人">
            <el-input clearable v-model="form.charge_man"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="charge_phone" label="负责人手机号">
            <el-input clearable v-model="form.charge_phone"></el-input>
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
        groupid: '',
        groupname: '',
        grouppos: '',
        charge_man: '',
        charge_phone: ''
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
      groupid: [required],
      groupname: [required],
      grouppos: [required],
      charge_man: [required],
      charge_phone: [required, rules.phoneFormat()]
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
          await api.updateStations(postBody)
          this.$emit('close', 'update')
        } else {
          await api.addStations(postBody)
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

