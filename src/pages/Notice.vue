<style lang="scss" scoped>
.department-list {
  .table-expand-form {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
  .tool-bar {
    padding-left: 15px;
    height: 50px;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 5px solid #f0f2f5;
    span {
      cursor: pointer;
    }
    .active {
      font-size: 18px;
    }
  }
  .table-container {
    flex: 1;
    overflow-y: hidden;
  }
}
</style>

<template>
  <div class="app-card department-list">
    <div class="tool-bar">
      <span @click="switchTab('warning')" :class="{'active':tabView==='warning'}">异常通知</span>
      &nbsp; &nbsp; | &nbsp; &nbsp;
      <span
        @click="switchTab('repair')"
        :class="{'active':tabView==='repair'}"
      >报修通知</span>
    </div>
    <div class="table-container" v-if="tabView=='warning'" ref="tableContainer" v-loading="loading">
      <el-table
        :height="tableHeight"
        :data="tableData"
        :loading="loading"
        style="width: 100%; cursor: pointer;"
        highlight-current-row
      >
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <el-table-column v-if="$store.getters.isAdmin" label="客户名称" prop="customerName"></el-table-column>
        <el-table-column label="指标">
          <template slot-scope="props">{{props.row.indicatorName|| '-'}}</template>
        </el-table-column>
        <el-table-column label="异常值">
          <template slot-scope="props">{{ props.row.alarmValue }}</template>
        </el-table-column>
        <el-table-column label="正常范围" min-width="140">
          <template slot-scope="props">{{props.row.normalRange|| '-'}}</template>
        </el-table-column>
        <el-table-column label="异常时间" width="150">
          <template slot-scope="props">{{props.row.alarmTime|dateformat('YYYY-MM-DD HH:mm')}}</template>
        </el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="props">{{props.row.operatorName||'-'}}</template>
        </el-table-column>
        <el-table-column label="异常结束时间" width="150">
          <template slot-scope="props">{{props.row.abnormalEndTime|dateformat('YYYY-MM-DD HH:mm')}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-container" v-if="tabView=='repair'" ref="tableContainer" v-loading="loading">
      <el-table
        :height="tableHeight"
        :data="tableData"
        :loading="loading"
        style="width: 100%; cursor: pointer;"
        highlight-current-row
      >
        <el-table-column label="报修设备" prop="deviceName"></el-table-column>
        <el-table-column label="报修主题" width="150" prop="repairSubject"></el-table-column>
        <el-table-column label="报修时间" width="150">
          <template slot-scope="props">{{props.row.reportTime|dateformat('YYYY-MM-DD HH:mm')}}</template>
        </el-table-column>
        <el-table-column label="报修人">
          <template slot-scope="props">{{props.row.reportUserName||'-'}}</template>
        </el-table-column>
        <el-table-column label="问题描述">
          <template slot-scope="props">{{props.row.reportDescription||'-'}}</template>
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
import { ManagerPageMixin } from '../common/vue-mixin'
import * as api from '../common/api'

export default {
  mixins: [ManagerPageMixin],
  data() {
    return {
      tabView: 'warning',
      form: {
        notityType: 'warning'
      }
    }
  },
  async mounted() {
    this.setApi(api.getNotice)
    this.updateTableData()
  },
  methods: {
    switchTab(notityType) {
      this.tabView = notityType
      this.form.notityType = notityType
      this.setApi(api.getNotice)
      this.updateTableData()
    }
  }
}
</script>
