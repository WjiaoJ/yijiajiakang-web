<style lang="scss">
.user-list {
  .el-col-9 {
    display: flex;
    flex-direction: column;
    height: 440px;
    border: 1px solid #ddd;
    border-radius: 5px;
    .device-table {
      flex: 1;
      overflow-y: auto;
    }
    .title {
      background-color: #f5f7fa;
      border-left: 1px solid #ddd;
      padding: 5px;
      .title-top {
        line-height: 30px;
        font-size: 16px;
        color: #999;
        font-weight: 500;
      }
      .title-serch_filter {
        margin: 0px 20px;
        .el-input__inner {
          height: 32px;
          line-height: 32px;
          border-radius: 16px;
          padding: 0 10px;
        }
      }
    }
  }
  .el-col-4 {
    margin: 16px;
  }
  .opSetting {
    text-align: center;
    margin-top: 30px;
  }
  .spacing {
    margin-top: 10px;
  }
  .el-steps--horizontal {
    margin-bottom: 20px;
  }
  .app-dialog__footer {
    margin-top: 20px;
  }
  .el-date-editor.el-input {
    width: 150px;
  }
}
</style>
<template>
  <AppDialog title="管理授权设备">
    <div style="text-align: center;height:450px;">
      <div>
        <el-col :span="9">
          <div class="title">
            <div class="title-top">可选设备</div>
            <div class="title-serch_filter">
              <input
                type="text"
                autocomplete="off"
                v-model="deviceName"
                placeholder="设备号/设备名"
                class="el-input__inner"
              />
            </div>
          </div>
          <el-table
            class="device-table"
            :data="deviceData"
            border
            ref="selection"
            @selection-change="deviceCheckAll"
            style="width: 100%"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="devicename" label="设备名称"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <div class="opSetting">
            <div @click="deviceHandelSelect">
              <el-button
                icon="el-icon-d-arrow-right"
                :disabled="nowSelectData.length?false:true"
                size="small"
                type="primary"
              >选中</el-button>
            </div>
            <div class="spacing" @click="deviceHandelRemoveSelect">
              <el-button
                icon="el-icon-d-arrow-left"
                :disabled="nowSelectRightData.length?false:true"
                size="small"
                type="primary"
              >取消</el-button>
            </div>
          </div>
        </el-col>

        <el-col :span="9">
          <div class="title">
            <div class="title-top">已选设备</div>
            <div class="title-serch_filter">
              <input
                type="text"
                autocomplete="off"
                v-model="seleDeviceName"
                placeholder="设备号/设备名"
                class="el-input__inner"
              />
            </div>
          </div>
          <el-table
            :data="deviceSelectArr"
            border
            ref="selection"
            @selection-change="deviceCheckRightAll"
            style="width: 100%"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="devicename" label="设备名称"></el-table-column>
          </el-table>
        </el-col>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="$emit('close','cancle')" :disabled="loading">取消</el-button>
      <el-button @click="submit" :loading="loading" type="primary">保存</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import * as api from '../../common/api'
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
      username: '',
      // 选择设备
      deviceName: '',
      seleDeviceName: '',
      deviceValue: [], // 右边列表
      deviceIdList: [], // 左边列表
      nowSelectData: [], // 左边选中列表数据
      nowSelectRightData: [] // 右边选中列表数据,
    }
  },
  computed: {
    deviceData() {
      if (!this.deviceName) {
        return this.deviceIdList
      } else {
        return this.deviceIdList.filter(item => {
          return (
            item.devicename.includes(this.deviceName) ||
            item.id.includes(this.deviceName)
          )
        })
      }
    },
    deviceSelectArr() {
      if (!this.seleDeviceName) {
        return this.deviceValue
      } else {
        return this.deviceValue.filter(item => {
          return (
            item.devicename.includes(this.seleDeviceName) ||
            item.id.includes(this.seleDeviceName)
          )
        })
      }
    }
  },
  async created() {
    this.username = this.data.username
    await this.getUserDevice()
    this.deviceGenerateData()
  },
  beforeMount() {},
  methods: {
    async submit() {
      const deviceKeyList = []
      console.log(this.deviceValue)

      this.deviceValue.forEach(item => {
        const i = {
          deviceid: item.id || item.deviceid,
          username: this.username
        }
        deviceKeyList.push(i)
      })

      this.loading = true
      try {
        await api.updateUserDevice(deviceKeyList)
        this.$emit('close', 'add')
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    async getUserDevice() {
      const res = (await api.getUserDevice({ username: this.username })).data
      this.deviceValue = res
    },
    async deviceGenerateData() {
      const res = (await api.getDevice('')).data.content
      res.map(item => (item.deviceid = item.id))
      res.forEach(item => {
        if (
          !this.deviceValue.filter(e => {
            return e.deviceid == item.deviceid
          }).length
        ) {
          this.deviceIdList.push(item)
        }
      })
    },
    deviceCheckAll(val) {
      this.nowSelectData = val
    },
    deviceCheckRightAll(val) {
      this.nowSelectRightData = val
    },
    // 选中
    deviceHandelSelect() {
      this.deviceValue = this.handleConcatArr(
        this.deviceValue,
        this.nowSelectData
      )
      this.handleRemoveTabList(this.nowSelectData, this.deviceIdList)
      this.nowSelectData = []
    },
    // 取消
    deviceHandelRemoveSelect() {
      this.deviceIdList = this.handleConcatArr(
        this.deviceIdList,
        this.nowSelectRightData
      )
      this.handleRemoveTabList(this.nowSelectRightData, this.deviceValue)
      this.nowSelectRightData = []
    },
    handleConcatArr(deviceValue, nowSelectData) {
      let arr = []
      arr = arr.concat(deviceValue, nowSelectData)
      return arr
    },
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]['devicename'] === originalArr[k]['devicename']) {
              originalArr.splice(k, 1)
            }
          }
        }
      }
    }
  }
}
</script>

