<style lang="scss" >
.history-list {
  .el-table .cell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.el-button--text {
  display: none;
}
</style>

<template>
  <div class="app-card manager-page department-manager-page history-list" v-loading="loading">
    <AddOrUpdateItem
      v-if="openCardMode"
      @close="closeDialog"
      :mode="openCardMode"
      :data="updateItem"
    />
    <div class="manager-page-tool-bar">
      <div class="manager-page-tool-bar-search">
        <div class="manager-page-tool-bar-input-container">
          <el-form :model="form" :inline="true" ref="form" size="small" label-width="80px">
            <el-form-item label="分组" prop="imei">
              <el-select
                v-model="form.imei"
                :focus="false"
                clearable
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in stationsNameAll"
                  :key="item.groupid"
                  :label="item.groupname"
                  :value="item.imeis"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width:200px;" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item label="查询时段" :rules="[{required: true}]">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions0"
              ></el-date-picker>
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
      <el-table :height="tableHeight" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column align="center" label="序号" prop="order" width="50px"></el-table-column>

        <el-table-column align="center" label="手机号" prop="phone"></el-table-column>
        <el-table-column align="center" label="交易时间" prop="tradetime">
          <template slot-scope="props">
            {{
            props.row.tradetime | dateformat('YYYY-MM-DD HH:mm')
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="交易金额（分）" prop="fee"></el-table-column>
        <el-table-column align="center" label="商户单号" prop="tradeid"></el-table-column>
        <el-table-column align="center" label="微信单号" prop="wxtradeid"></el-table-column>
        <el-table-column align="center" label="设备号" prop="imei"></el-table-column>
        <el-table-column align="center" label="场站名称" prop="groupname"></el-table-column>
        <el-table-column align="center" label="设备名称" prop="devname"></el-table-column>
        <el-table-column align="center" label="设备类型">
          <template slot-scope="props">{{props.row.devtype == '1' ? '轮椅': '陪护床' }}</template>
        </el-table-column>
        <el-table-column align="center" label="单元号" prop="unitnum"></el-table-column>
        <el-table-column align="center" label="轮椅号" prop="cardnum"></el-table-column>
        <el-table-column align="center" label="开锁时间" prop="locktime">
          <template slot-scope="props">
            {{
            props.row.locktime | dateformat('YYYY-MM-DD HH:mm')
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="关锁时间" prop="locktime">
          <template slot-scope="props">
            {{
            props.row.locktime | dateformat('YYYY-MM-DD HH:mm')
            }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="备注" prop="reserve"></el-table-column>
        <el-table-column align="center" label="操作" width="70px">
          <template slot-scope="scope">
            <el-link @click="viewItem(scope.row)" :underline="false" icon="el-icon-view">详情</el-link>
          </template>
        </el-table-column>
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
import AddOrUpdateItem from './AddOrUpdateItem'
import { ManagerPageMixin } from '../../common/vue-mixin'
import * as rules from '../../common/form-rules'
import dayjs from 'dayjs'
import store from '../../store'

export default {
  mixins: [ManagerPageMixin],
  components: {
    AddOrUpdateItem
  },
  data() {
    return {
      dateRange: [dayjs(dayjs().format('YYYYMMDD')), dayjs()],
      form: {
        imei: '',
        phone: '',
        startTime: '',
        endTime: ''
      },
      stationsNameAll: [],
      pickerOptions0: {
        disabledDate(time) {
          return (
            dayjs(dayjs(time).format('YYYYMMDD')).valueOf() >
            dayjs(dayjs().format('YYYYMMDD')).valueOf()
          )
        }
      }
    }
  },
  watch: {
    dateRange() {
      this.search()
    }
  },
  async created() {
    this.stationsNameAll = (await api.getStationsName(0)).data
  },
  async mounted() {
    this.setApi(api.getHistory)
    this.updateTableData()
  },
  methods: {
    genRequestParams() {
      const oneDay = 24 * 60 * 60 * 1000
      const [startTime, endTime] = this.dateRange || []
      return {
        ...this.form,
        page: this.pagination.page,
        rows: this.pagination.rows,
        starttime: startTime ? dayjs(startTime).format('YYYYMMDDHHmmss') : '',
        endtime: endTime ? dayjs(endTime).format('YYYYMMDDHHmmss') : ''
      }
    }
  }
}
</script>
