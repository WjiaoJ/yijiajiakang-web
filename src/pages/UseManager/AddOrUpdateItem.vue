<style lang="scss" >
textarea {
  height: 150px;
}
</style>
<template>
  <AppDialog :title="isReadOnly?'使用详情':(data?'编辑备注':'新建记录')">
    <el-form :model="form" :rules="formRules" :disabled="isReadOnly" ref="form" label-width="95px">
      <el-row>
        <el-col :span="24" v-if="!data">
          <el-form-item prop="cardnum" label="轮椅设备号">
            <el-input v-model="form.cardnum" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!data">
          <el-form-item prop="imei" label="设备号">
            <el-input v-model="form.imei" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!data">
          <el-form-item prop="unitnum" label="单元号">
            <el-select
              v-model="form.unitnum"
              :focus="false"
              clearable
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in [{id:'01'},{id:'02'},{id:'03'},{id:'04'},{id:'05'},{id:'06'},{id:'07'},{id:'08'},{id:'09'},{id:'10'},{id:'11'},{id:'12'},{id:'13'},{id:'14'},{id:'15'},{id:'16'}]"
                :key="item.id"
                :label="item.id"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!data">
          <el-form-item prop="unlocktime" label="开锁时间">
            <el-date-picker
              value-format="yyyyMMddHHmmss"
              v-model="form.unlocktime"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!data">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="form.phone" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!!data">
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
import dayjs from 'dayjs'

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
        phone: '',
        imei: '',
        cardnum: '',
        unitnum: '01',
        unlocktime: dayjs().format('YYYYMMDDHHmmss'),
        reserve: ''
      }
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
      phone: [required, rules.phoneFormat()],
      imei: [required],
      cardnum: [required],
      unitnum: [required],
      unlocktime: [required]
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
        const body = new FormData()

        body.append('id', this.form.id)
        body.append('reserve', this.form.reserve)
        if (this.data) {
          await api.updateUse(body)
          this.$emit('close', 'update')
        } else {
          await api.addUse(postBody)
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

