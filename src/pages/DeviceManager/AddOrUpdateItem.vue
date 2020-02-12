<template>
  <AppDialog :title="isReadOnly?'设备详情':(data?'编辑':'新建')+'设备'">
    <el-form :model="form" :rules="formRules" :disabled="isReadOnly" ref="form" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="id" label="设备号">
            <el-input :disabled="!!data" v-model="form.id" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="devicename" label="设备名称">
            <el-input v-model="form.devicename" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="unitcount" label="单元数">
            <el-input v-model="form.unitcount" type="number" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="groupid" label="场地名称">
            <el-select
              v-model="form.groupid"
              :focus="false"
              clearable
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in stationsNameAll"
                :key="item.groupid"
                :label="item.groupname"
                :value="item.groupid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="freeminute" label="免费时长（分钟）">
            <el-input v-model="form.freeminute" type="number" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="feeperhour" label="收费（元）/小时">
            <el-input v-model="form.feeperhour" type="number" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="maxfeeperday" label="单日最高收费（分）">
            <el-input v-model="form.maxfeeperday" type="number" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="deposit" label="押金（元）">
            <el-input v-model="form.deposit" type="number" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="设备类型">
            <el-select
              v-model="form.type"
              :focus="false"
              clearable
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in [{type:1,name:'轮椅'},{type:2,name:'陪护床'}]"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="devicepos" label="设备地址">
            <el-input v-model="form.devicepos" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="允许开锁时间1">
            <el-time-picker
              disabled
              is-range
              v-model="period"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="允许开锁时间2">
            <el-time-picker
              is-range
              disabled
              v-model="period"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="longitude" label="经度">
            <el-input v-model="form.longitude" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="latitude" label="纬度">
            <el-input v-model="form.latitude" clearable autocomplete="off"></el-input>
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
        id: '',
        unitcount: '',
        groupid: '',
        devicename: '',
        feeperhour: '',
        freeminute: '',
        deposit: '',
        maxfeeperday: '',
        type: '',
        devicepos: '',
        latitude: 0,
        longitude: 0,
        allowstarttime: '00:00:00',
        allowendtime: '23:59:59',
        allowstarttime2: '00:00:00',
        allowendtime2: '23:59:59'
      },
      period: [new Date(2020, 1, 1, 0, 0), new Date(2020, 1, 1, 23, 59, 59)],
      stationsNameAll: []
    }
  },
  computed: {
    isReadOnly() {
      return this.mode === 'view'
    }
  },
  async created() {
    this.stationsNameAll = (await api.getStationsName(0)).data
    if (this.data) {
      Object.assign(this.form, this.data)
    }
  },
  beforeMount() {
    const required = rules.required()
    const greaterOrEqualThan0 = rules.greaterOrEqualThan(0)
    this.formRules = {
      id: [required],
      unitcount: [required, greaterOrEqualThan0],
      groupid: [required],
      devicename: [required],
      feeperhour: [required, greaterOrEqualThan0],
      freeminute: [required, greaterOrEqualThan0],
      deposit: [required, greaterOrEqualThan0],
      maxfeeperday: [required, greaterOrEqualThan0],
      type: [required],
      devicepos: [required],
      latitude: [required, rules.latitudeFormat()],
      longitude: [required, rules.longitudeFormat()]
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
          await api.updateDevice(postBody)
          this.$emit('close', 'update')
        } else {
          await api.addDevice(postBody)
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

