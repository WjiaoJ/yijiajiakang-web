<style lang="scss">
.sidebar-container {
  transition: width 0.28s;
  width: 200px;
  height: 100%;

  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 94px;
    color: #59a4ca;
    margin-right: 40px;
    text-align: center;
    line-height: 1.8;
    font-weight: 600;
    overflow: hidden;
  }
  .site-name {
    font-size: 24px;
  }
  .site-name-sm {
    font-size: 18px;
  }
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    width: 100%;
    border: none;
  }
  .el-submenu .el-menu-item {
    padding-left: 48px;
    background: #000c17;
    &:hover {
      color: #fff;
    }
  }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      background: #188fff;
      color: #fff;
    }
  }
  .el-submenu__title i {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
  }
}
.active {
  .el-menu-item,
  .el-menu-item i {
    color: rgb(64, 158, 255) !important;
  }
  color: rgb(64, 158, 255) !important;
}
</style>

<template>
  <div class="sidebar-container" :class="{ open: open }">
    <div class="sidebar-container_main">
      <div class="sidebar-mask" @click="toggleSidebar"></div>

      <div class="logo">
        <div class="site-name">医家家康</div>
        <span class="site-name-sm">后台管理系统</span>
      </div>
      <el-menu
        mode="vertical"
        :show-timeout="200"
        background-color="#00142a"
        text-color="hsla(0, 0%, 100%, .65)"
        active-text-color="#409EFF"
        ref="menu"
      >
        <template v-for="item in menuShow">
          <router-link v-if="!item.children" :to="item.path" :key="item.name">
            <el-menu-item :index="item.path">
              <i v-if="item.icon" :class="item.icon"></i>
              <span v-if="item.name" slot="title">{{ item.name }}</span>
            </el-menu-item>
          </router-link>

          <el-submenu v-else :index="item.name" :key="item.name">
            <template slot="title">
              <i v-if="item && item.icon" :class="item.icon"></i>
              <span v-if="item && item.name" slot="title">{{ item.name }}</span>
            </template>
            <template v-for="child in item.children">
              <router-link :to="item.path + child.path" :key="child.name">
                <el-menu-item :index="item.path + child.path">
                  <span v-if="child && child.name" slot="title">
                    {{
                    child.name
                    }}
                  </span>
                </el-menu-item>
              </router-link>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {},
  data() {
    return {
      open: false,
      asideMenuConfig: [
        {
          path: '/device-overview',
          name: '设备概况',
          icon: 'el-icon-s-data'
        },

        {
          path: '/stations',
          name: '场站管理',
          icon: 'el-icon-s-management'
        },
        {
          path: '/device',
          name: '设备管理',
          icon: 'el-icon-magic-stick'
        },
        {
          adminOnly: true,
          path: '/payment',
          name: '押金查询',
          icon: 'el-icon-document'
        },
        {
          adminOnly: true,
          path: '/use',
          name: '使用查询',
          icon: 'el-icon-edit-outline'
        },
        {
          adminOnly: true,
          path: '/deposit',
          name: '交费查询',
          icon: 'el-icon-tickets'
        },
        {
          adminOnly: true,
          path: '/history',
          name: '历史查询',
          icon: 'el-icon-data-analysis'
        },
        {
          path: '/user',
          name: '用户管理',
          icon: 'el-icon-user-solid'
        }
      ]
    }
  },
  mounted() {
    const path = this.$route.path
    this.asideMenuConfig
      .filter(item => item.children)
      .forEach(item => {
        if (item.children.find(item => path.includes(item.path))) {
          this.$refs['menu'].openMenu(item.name)
          return
        }
      })
    window.addEventListener('resize', () => {
      this.open = false
    })
  },
  computed: {
    ...mapGetters(['isAdmin']),
    menuShow() {
      if (this.isAdmin) {
        return this.asideMenuConfig
      } else {
        let menuConfig = JSON.parse(
          JSON.stringify(this.asideMenuConfig.filter(item => !item.adminOnly))
        )
        if (
          JSON.parse(localStorage.userInfo).userType == 'customer_operation'
        ) {
          menuConfig = JSON.parse(
            JSON.stringify(
              this.asideMenuConfig.filter(item => !item.UnOperation)
            )
          )
        }

        return menuConfig.reduce((prev, menu) => {
          if (!menu.adminOnly) {
            if (menu.children) {
              menu.children = menu.children.filter(item => !item.adminOnly)
            }
            prev.push(menu)
          }
          return prev
        }, [])
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.open = !this.open
    }
  }
}
</script>
