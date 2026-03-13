<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="!item.children || item.children.length <= 0 || item.alwaysShow"
    >
      <el-menu-item
        v-if="!isCollapse"
        :index="item.path"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <i :class="`iconfont icon-${item.meta.icon}`"></i>
        <span v-if="item.meta && item.meta.title" slot="title">{{
          item.meta.title
        }}</span>
      </el-menu-item>
      <el-menu-item
        v-else
        :index="item.path"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <div :class="[containArr.includes(item.name) ? 'putaway' : '']">
          <i :class="`iconfont icon-${item.meta.icon}`"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </div>
      </el-menu-item>
    </template>

    <el-submenu v-else :index="item.path">
      <template v-if="!isCollapse" slot="title">
        <i :class="`iconfont icon-${item.meta.icon}`"></i>
        <span v-if="item.meta && item.meta.title" slot="title">{{
          item.meta.title
        }}</span>
      </template>
      <template v-else slot="title">
        <div :class="[containArr.includes(item.name) ? 'putaway' : '']">
          <i :class="`iconfont icon-${item.meta.icon}`"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </div>
      </template>

      <template v-for="child in routes">
        <template v-if="!child.hidden">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children && child.children.length > 0"
            :item="child"
            :key="child.path"
          ></sidebar-item>
          <el-menu-item v-else :key="child.name" :index="child.path">
            <i :class="`iconfont icon-${child.meta.icon}`"></i>
            <span v-if="child.meta && child.meta.title" slot="title">{{
              child.meta.title
            }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarItem",
  props: {
    // route配置json
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
    containArr: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters(["sidebar", "permission_routers", "themeStatus"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  mounted() {},
  data() {
    return {
      routes: [],
    };
  },
  watch: {
    item() {
      this.groupRouters();
    },
  },
  created() {
    this.groupRouters();
  },
  methods: {
    groupRouters() {
      this.routes =
        this.item.children &&
        this.item.children.length > 0 &&
        this.item.children.sort((a, b) => a.meta.sortNo - b.meta.sortNo);
    },
  },
};
</script>
<style lang="scss">
.menu-wrapper .iconfont {
  margin-right: 5px;
  font-size: 16px;
  vertical-align: middle;
}
.el-menu-item.is-active {
  background-color: #07425c;
}
.hideSidebar {
  .putaway {
    .iconfont {
      font-size: 24px !important;
    }
  }
}
.custom-theme .el-menu-item {
  // height: 56px !important;
  // line-height: 56px !important;
}

.putaway {
  margin: 8px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  > i {
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  span {
    height: 20px;
    margin-top: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>


