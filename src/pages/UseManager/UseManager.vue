<style lang="scss" >
.use-list {
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
  <div class="app-card manager-page department-manager-page use-list" v-loading="loading">
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
            <el-form-item label="分组" prop="imeis">
              <el-select
                v-model="form.imeis"
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
            <el-form-item label="是否报警" prop="isPolice">
              <el-select
                v-model="form.isPolice"
                :focus="false"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in [{type:'是'},{type:'否'}]"
                  :key="item.type"
                  :label="item.type"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.isPolice=='是'" label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyyMMddHHmmss"
                default-time="23:59:59"
                :clearable="false"
                :picker-options="pickerOptions0"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width:200px;" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="manager-page-tool-bar-action-container">
          <el-button @click="searchAll" type="primary" icon="el-icon-search" size="small">搜索</el-button>
          <el-button @click="cleanForm" icon="el-icon-close" size="small">重置</el-button>
        </div>
      </div>
      <el-button @click="createItem" size="small" type="primary" icon="el-icon-plus">新建</el-button>
    </div>
    <div class="manager-page-table-container" ref="tableContainer">
      <el-table :height="tableHeight" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column align="center" label="序号" prop="order" width="50px"></el-table-column>
        <el-table-column align="center" label="手机号" prop="phone"></el-table-column>
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
        <el-table-column align="center" label="备注" prop="reserve"></el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-link @click="editItem(scope.row)" :underline="false" icon="el-icon-edit">修改备注</el-link>
            <span style="display:inline-block;width:10px"></span>
            <el-link @click="isDelete(scope.row)" :underline="false" icon="el-icon-delete">删除</el-link>
            <el-link @click="stopTime(scope.row)" :underline="false" icon="el-icon-video-play">停止计时</el-link>
            <span style="display:inline-block;width:10px"></span>
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
      form: {
        isPolice: '否',
        imeis: '',
        phone: '',
        startTime: dayjs()
          .subtract(3, 'day')
          .format('YYYYMMDDHHmmss'),
        endTime: dayjs().format('YYYYMMDDHHmmss')
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
  async created() {
    this.stationsNameAll = (await api.getStationsName(0)).data
  },
  async mounted() {
    this.setApi(api.getUse)
    this.updateTableData()
  },
  methods: {
    searchAll() {
      if (this.form.isPolice == '否') {
        this.form.startTime = dayjs()
          .subtract(3, 'day')
          .format('YYYYMMDDHHmmss')
      }
      this.search()
    },
    isDelete(item) {
      this.deleteItem(item, api.deleteUse)
    },
    stopTime(item) {
      this.$confirm('此操作将停止计时, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await api.stopTime(item)
          this.updateTableData()
        })
        .catch(() => {})
    }
  }
}
</script>
