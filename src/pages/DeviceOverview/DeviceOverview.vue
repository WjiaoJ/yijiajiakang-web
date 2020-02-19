<style lang="scss" scoped>
.user-list {
  .app-dialog {
    width: 500px;
  }
  .redCircle {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: red;
    display: inline-block;
    margin-right: 6px;
  }
  .greenCircle {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: #479456;
    display: inline-block;
    margin-right: 6px;
  }
  .grayCircle {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: #ccc;
    display: inline-block;
    margin-right: 6px;
  }
}
</style>

<template>
  <div class="app-card manager-page department-manager-page user-list" v-loading="loading">
    <div class="manager-page-tool-bar">
      <div class="manager-page-tool-bar-search">
        <div class="manager-page-tool-bar-input-container">
          <el-form :model="form" :inline="true" ref="form" size="small" label-width="150px">
            <el-form-item label="场站名称或场站号" prop="groupId">
              <el-input
                v-model="form.groupId"
                style="width:200px;"
                clearable
                placeholder="请输入场站名称或场站号"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="manager-page-tool-bar-action-container">
          <el-button @click="search" type="primary" icon="el-icon-search" size="small">搜索</el-button>
          <el-button @click="cleanForm" icon="el-icon-close" size="small">重置</el-button>
        </div>
      </div>
    </div>
    <div class="manager-page-table-container" ref="tableContainer">
      <el-table
        :height="tableHeight"
        :data="tableData"
        :row-key="getRowKeys"
        :expand-row-keys="expand"
        @expand-change="exChange"
        style="width: 100%;"
        highlight-current-row
      >
        <el-table-column align="center" type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.deviceTable?props.row.deviceTable :[] "
              style="width: 100%;"
              v-loading="tableLoading"
              :default-expand-all="true"
              :border="true"
            >
              <el-table-column align="center" type="expand">
                <template slot-scope="props">
                  <el-table
                    :data="props.row.unit?props.row.unit :[] "
                    style="width: 100%;"
                    v-loading="tableLoading"
                    :border="true"
                  >
                    <el-table-column label="设备状态">
                      <template slot-scope="props">
                        <div v-if="props.row.status == '1'" class="redCircle"></div>
                        <div v-else class="greenCircle"></div>
                        {{props.row.status == '0' ? '在线': '离线' }}
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="id" prop="id" :resizable="false"></el-table-column>
                    <el-table-column align="center" label="设备号" prop="imei" :resizable="false"></el-table-column>
                    <el-table-column align="center" label="单元号" prop="num" :resizable="false"></el-table-column>
                    <el-table-column align="center" label="轮椅卡号" prop="cardnum" :resizable="false"></el-table-column>
                    <el-table-column align="center" label="电池电量" prop="electric" :resizable="false"></el-table-column>
                    <el-table-column align="center" label="借出时间" :resizable="false">
                      <template slot-scope="props">
                        {{
                        props.row.unlock_time | dateformat('YYYY-MM-DD HH:mm')
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="用户手机号"
                      prop="username"
                      :resizable="false"
                    ></el-table-column>
                    <el-table-column align="center" label="设备操作" width="220px">
                      <template slot-scope="scope">
                        <el-link
                          @click="openLock(scope.row,2)"
                          :underline="false"
                          icon="el-icon-unlock"
                        >开锁</el-link>
                        <span style="display:inline-block;width:10px"></span>
                        <el-link
                          @click="openLock(scope.row,6)"
                          :underline="false"
                          icon="el-icon-refresh"
                        >重新识别</el-link>
                        <span style="display:inline-block;width:10px"></span>
                        <el-link
                          @click="openLock(scope.row,7)"
                          :underline="false"
                          icon="el-icon-switch-button"
                        >重启</el-link>
                        <span style="display:inline-block;width:40px"></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="设备状态">
                <template slot-scope="props">
                  <div v-if="props.row.status == '1'" class="grayCircle"></div>
                  <div v-else class="greenCircle"></div>
                  {{props.row.status == '0' ? '在线': '离线' }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="id" prop="id" :resizable="false"></el-table-column>
              <el-table-column align="center" label="设备名称" prop="devicename" :resizable="false"></el-table-column>
              <el-table-column align="center" label="电量" prop="electric" :resizable="false"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-link
              :disabled="!scope.row.deviceTable"
              @click="refresh(scope.row)"
              :underline="false"
              icon="el-icon-refresh"
            >刷新</el-link>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" prop="order" width="80px"></el-table-column>
        <el-table-column label="场站号" prop="groupid"></el-table-column>
        <el-table-column label="场站名称" prop="groupname"></el-table-column>
        <el-table-column label="地址" prop="grouppos"></el-table-column>
        <el-table-column label="负责人" prop="charge_man"></el-table-column>
        <el-table-column label="负责人手机号" prop="charge_phone"></el-table-column>
      </el-table>
    </div>
    <div class="manager-page-pagination-container">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageChange"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.sizeList"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script>
import * as api from '../../common/api'
import { ManagerPageMixin } from '../../common/vue-mixin'
import store from '../../store'

export default {
  mixins: [ManagerPageMixin],

  data() {
    return {
      tableLoading: true,
      isRefresh: false,
      form: {
        groupId: ''
      },
      expands: []
    }
  },
  computed: {
    expand() {
      if (this.expands.length) {
        const expandTable = this.tableData.filter(
          item => item.id == this.expands[0]
        )
        this.exChange(expandTable[0], expandTable)
      }
      return this.expands
    }
  },
  async mounted() {
    this.setApi(api.getStations)
    this.updateTableData()
  },
  methods: {
    getRowKeys: function(row) {
      return row.id
    },
    async exChange(row, rowList) {
      this.tableLoading = true

      if (!row.deviceTable || this.isRefresh) {
        const res = (await api.getStationsDevice(row.groupid)).data
        this.tableData = this.tableData.map(item => {
          if (item.id == row.id) {
            item.deviceTable = res
          }
          return item
        })
      }

      var that = this
      if (rowList.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.id)
        }
      } else {
        that.expands = []
      }
      this.tableLoading = false
    },
    async refresh(row) {
      this.isRefresh = true
      const rowList = []
      rowList.push(row)

      await this.exChange(row, rowList)
      this.isRefresh = false
    },
    openLock(row, type) {
      const operating = type == 2 ? '开锁' : type == 6 ? '重新识别' : '重启'
      this.$confirm('是否' + operating + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.loading = true
          const body = new FormData()

          body.append('imei', row.imei)
          body.append('unitNum', row.num)
          body.append('userId', JSON.parse(localStorage.userInfo).id)
          body.append('type', type)
          await api.openLock(body)

          this.setApi(api.getStations)
          await this.updateTableData()
          this.loading = false
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message.error('请求失败，请稍后再试')
          this.loading = false
        })
    }
  }
}
</script>
