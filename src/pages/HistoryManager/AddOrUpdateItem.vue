<style lang="scss" >
textarea {
  height: 150px;
}
</style>
<template>
  <AppDialog :title="isReadOnly?'备注详情':'编辑备注'">
    <el-form :model="form" :disabled="isReadOnly" ref="form" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="tradeid" label="商户单号">
            <el-input :disabled="!!data" v-model="form.tradeid" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="wxtradeid" label="微信单号">
            <el-input :disabled="!!data" v-model="form.wxtradeid" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="imei" label="设备号">
            <el-input :disabled="!!data" v-model="form.imei" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reserve" label="备注">
            <el-input v-model="form.reserve" type="textarea" autocomplete="off"></el-input>
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
        reserve: ''
      },
      stationsNameAll: []
    }
  },
  computed: {
    isReadOnly() {
      return this.mode === 'view'
    }
  },
  async created() {
    if (this.data) {
      Object.assign(this.form, this.data)
    }
  },
  beforeMount() {
    const required = rules.required()
    this.formRules = {
      reserve: [required]
    }
  },
  methods: {
    async submit() {
      this.loading = true
      try {
        await this.$refs.form.validate()
        const body = new FormData()

        body.append('id', this.form.id)
        body.append('reserve', this.form.reserve)
        body.append('orderPay', 1)
        if (this.data) {
          await api.updateDeposit(body)
          this.$emit('close', 'update')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

