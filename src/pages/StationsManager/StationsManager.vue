<style lang="scss" scoped>
.user-list {
  .app-dialog {
    width: 500px;
  }
}
</style>

<template>
  <div class="app-card manager-page department-manager-page user-list" v-loading="loading">
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
      <el-button @click="createItem" size="small" type="primary" icon="el-icon-plus">新建</el-button>
    </div>
    <div class="manager-page-table-container" ref="tableContainer">
      <el-table :height="tableHeight" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column label="序号" align="center" prop="order" width="80px"></el-table-column>
        <el-table-column align="center" label="场站号" prop="groupid"></el-table-column>
        <el-table-column align="center" label="场站名称" prop="groupname"></el-table-column>
        <el-table-column align="center" label="地址" prop="grouppos"></el-table-column>
        <el-table-column align="center" label="负责人" prop="charge_man"></el-table-column>
        <el-table-column align="center" label="负责人手机号" prop="charge_phone"></el-table-column>
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

export default {
  mixins: [ManagerPageMixin],
  components: {
    AddOrUpdateItem
  },
  data() {
    return {
      form: {
        groupId: ''
      }
    }
  },
  async mounted() {
    this.setApi(api.getStations)
    this.updateTableData()
  },
  methods: {
    isDelete(item) {
      this.deleteItem(item, api.deleteStations)
    }
  }
}
</script>
