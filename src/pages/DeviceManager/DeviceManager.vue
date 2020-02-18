<style lang="scss" >
.device-list {
  .app-dialog__wrapper {
    .app-dialog {
      width: 700px;
    }
  }
}
</style>

<template>
  <div class="app-card manager-page department-manager-page device-list" v-loading="loading">
    <AddOrUpdateItem
      v-if="openCardMode"
      @close="closeDialog"
      :mode="openCardMode"
      :data="updateItem"
    />
    <div class="manager-page-tool-bar">
      <div class="manager-page-tool-bar-search">
        <div class="manager-page-tool-bar-input-container">
          <el-form :model="form" :inline="true" ref="form" size="small" label-width="150px">
            <el-form-item label="设备号" prop="imei">
              <el-input v-model="form.imei" style="width:200px;" clearable placeholder="请输入设备号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="manager-page-tool-bar-action-container">
          <el-button @click="search" type="primary" icon="el-icon-search" size="small">搜索</el-button>
          <el-button @click="cleanForm" icon="el-icon-close" size="small">重置</el-button>
        </div>
      </div>
      <el-button @click="createItem" size="small" type="primary" icon="el-icon-plus">新建</el-button>
    </div>
    <div class="manager-page-table-container" ref="tableContainer">
      <el-table :height="tableHeight" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column label="序号" align="center" prop="order" width="80px"></el-table-column>

        <el-table-column label="设备号" prop="id"></el-table-column>
        <el-table-column label="设备名称" prop="devicename"></el-table-column>
        <el-table-column label="设备类型">
          <template slot-scope="props">{{props.row.type == '1' ? '轮椅': '陪护床' }}</template>
        </el-table-column>
        <el-table-column label="场站id" prop="groupid"></el-table-column>
        <el-table-column label="场站名称" prop="groupname"></el-table-column>
        <el-table-column label="设备地址" prop="devicepos"></el-table-column>
        <el-table-column label="设备状态">
          <template slot-scope="props">{{props.row.status == '0' ? '在线': '离线' }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-link @click="editItem(scope.row)" :underline="false" icon="el-icon-edit">编辑</el-link>
            <span style="display:inline-block;width:10px"></span>
            <el-link @click="isDelete(scope.row)" :underline="false" icon="el-icon-delete">删除</el-link>
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
import store from '../../store'

export default {
  mixins: [ManagerPageMixin],
  components: {
    AddOrUpdateItem
  },
  data() {
    return {
      form: {
        imei: ''
      }
    }
  },
  async mounted() {
    this.setApi(api.getDevice)
    this.updateTableData()
  },
  methods: {
    isDelete(item) {
      this.deleteItem(item, api.deleteDevice)
    }
  }
}
</script>
