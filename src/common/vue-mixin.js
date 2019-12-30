export const ManagerPageMixin = {
  data() {
    return {
      tableHeight: 410,
      loading: true,
      tableData: [],
      openCardMode: null,
      updateItem: null,
      pagination: {
        page: 1,
        rows: 20,
        sizeList: [10, 20, 30, 40, 50],
        total: 0
      }
    }
  },
  mounted() {
    this.adjustTableHeight()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._updateTableHeight)
  },
  methods: {
    setApi(api) {
      this._api = api
    },
    genRequestParams() {
      return {
        ...this.form,
        pageNumber: this.pagination.page,
        rows: this.pagination.rows
      }
    },
    updateTableData() {
      this.loading = true
      if (!this._api) throw 'you must use this.setApi to set a api'
      const params = this.genRequestParams()
      this._api(params)
        .then(res => {
          this.tableData = res.data.items
          this.pagination.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    adjustTableHeight() {
      this._updateTableHeight = () => {
        this.tableHeight = this.$refs['tableContainer']
          ? this.$refs['tableContainer'].offsetHeight
          : 700
      }
      window.setTimeout(this._updateTableHeight, 100)
      window.addEventListener('resize', this._updateTableHeight, false)
    },
    search() {
      this.pagination.page = 1
      this.updateTableData()
    },
    cleanForm() {
      this.pagination.page = 1
      this.$refs.form.resetFields()
      this.updateTableData()
    },
    createItem() {
      this.openCardMode = 'add'
    },
    editItem(item) {
      this.openCardMode = 'edit'
      this.updateItem = item
    },
    deleteItem(item, api) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await api(item)
          this.updateTableData()
        })
        .catch(() => { })
    },
    cancelItem(item, api) {
      this.$confirm('此操作将取消修复该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await api(item)
          this.updateTableData()
        })
        .catch(() => { })
    },
    viewItem(item) {
      this.openCardMode = 'view'
      this.updateItem = item
    },
    closeDialog(type) {
      this.openCardMode = null
      this.updateItem = null
      if (type !== 'cancle') {
        this.updateTableData()
      }
    },
    pageChange(page) {
      this.pagination.page = page
      this.updateTableData()
    },
    pageSizeChange(rows) {
      this.pagination.rows = rows
      this.pagination.page = 1
      this.updateTableData()
    }
  }
}
