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
            <el-form-item label="用户名称或手机号" prop="username">
              <el-input
                v-model="form.username"
                style="width:200px;"
                clearable
                placeholder="请输入用户名称或手机号"
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
              :border="true"
            >
              <el-table-column align="center" label="id" prop="id" :resizable="false"></el-table-column>
              <el-table-column align="center" label="设备名称" prop="deviceid" :resizable="false"></el-table-column>
              <el-table-column align="center" label="用户名称" prop="username" :resizable="false"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" prop="order" width="80px"></el-table-column>
        <el-table-column label="用户名称" align="center" prop="username"></el-table-column>
        <el-table-column label="真实姓名" align="center" prop="fullname"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phonenum"></el-table-column>
        <el-table-column align="center" label="用户类型">
          <template slot-scope="props">{{props.row.rolenum == '0' ? '超级管理员': '普通用户' }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template slot-scope="scope" disabled>
            <el-link
              :disabled="scope.row.rolenum == '0'"
              @click="editItem(scope.row)"
              :underline="false"
              icon="el-icon-edit"
            >编辑</el-link>
            <span style="display:inline-block;width:10px"></span>
            <el-link
              :disabled="scope.row.rolenum == '0'"
              @click="resetPass(scope.row)"
              :underline="false"
              icon="el-icon-refresh"
            >重置密码</el-link>
            <span style="display:inline-block;width:10px"></span>
            <el-link
              :disabled="scope.row.rolenum == '0'"
              @click="isDelete(scope.row)"
              :underline="false"
              icon="el-icon-delete"
            >删除</el-link>
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
      tableLoading: true,
      form: {
        username: ''
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
    this.setApi(api.getUsers)
    this.updateTableData()
  },
  methods: {
    getRowKeys: function(row) {
      return row.id
    },
    async exChange(row, rowList) {
      this.tableLoading = true

      if (!row.deviceTable) {
        const res = (await api.getUserDevice(row)).data

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
    isDelete(item) {
      this.deleteItem(item, api.deleteUser)
    },
    resetPass(row) {
      this.$confirm('确定重置 ' + row.username + ' 的密码' + '?', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const body = new FormData()

          body.append('id', row.id)
          body.append('updateType', 2)
          body.append('password', row.password)

          await api.modifyPassword(body)
          this.$message({
            type: 'success',
            message: '重置成功'
          })
        })
        .catch(() => {})
    }
  }
}
</script>
