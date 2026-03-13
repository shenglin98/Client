<template>
  <el-scrollbar wrapClass="scrollbar-wrapper" style="border-right: 1px solid #f5f5f5">
    <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" router background-color="#074f6f" :text-color="themeStatus ? '#bfcbd9' : ''" :active-text-color="themeStatus ? '#409EFF' : '#409eff'" @select="handlerNavSelect" :popper-append-to-body="true">
      <!-- :background-color="themeStatus ? '#304156' : ''" -->
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path" :containArr="containArr"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  data() {
    return {
      routes: [],
      containArr: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "permission_routers", "themeStatus"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  created() {
    this.permission_routers.length > 0 &&
      this.permission_routers.forEach((item) => {
        if (item.name === "layout") {
          this.routes = item.children.sort(
            (a, b) => a.meta.sortNo - b.meta.sortNo
          );
        }
      });
    this.containArr = this.routes.map((k) => {
      return k.name;
    });
  },
  mounted() {
    // setInterval(() => {
    //   var elmenuvertical = document.querySelectorAll(".el-menu--vertical");
    //   if (elmenuvertical.length > 0) {
    //     var arr = 0;
    //     for (var i = 0; i < elmenuvertical.length; i++) {
    //       if (elmenuvertical[i].style.display != "none") {
    //         var Height = window.innerHeight; //屏幕高
    //         arr += elmenuvertical[i].offsetTop; //盒子顶部距离
    //         var tall = arr + elmenuvertical[i].offsetHeight;
    //         if (tall > Height) {
    //           //有两种选择
    //           elmenuvertical[i].style.top =
    //             elmenuvertical[i].offsetTop -
    //             elmenuvertical[i].offsetHeight / 2 +
    //             "px";
    //           // elmenuvertical[i].style.top =
    //           //   elmenuvertical[i].offsetTop -
    //           //   elmenuvertical[i].offsetHeight +
    //           //   56 +
    //           //   "px";
    //           arr = 0;
    //         }
    //       }
    //     }
    //   }
    // }, 1);
  },
  methods: {
    // 侧边栏激活的回调
    handlerNavSelect(index, indexPath) {
      // 设置vuex中tabs值
      if (index.split("/")[1]) {
        this.$store.commit("handlerSetTabsArr", index.split("/")[1]);
      }
    },
  },
};
</script>