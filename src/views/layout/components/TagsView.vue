<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper" ref="scrollPane">
      <router-link
        ref="tag"
        :class="isActive(tag) ? 'active tags-view-item' : ' tags-view-item'"
        v-for="tag in Array.from(visitedViews)"
        :to="tag"
        :key="tag.path"
        @contextmenu.prevent.native="openMenu(tag, $event)"
        @click.native="handlerNavSelect(tag)"
      >
        <span class="tags-view-item-in">{{ tag.title }}</span>
        <!-- <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)' v-if="tag.title !== '主页'"></span> -->
        <i
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
          v-if="tag.title !== '主页'"
        ></i>
      </router-link>
    </scroll-pane>
    <ul
      class="contextmenu"
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">全部关闭</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "@/components/ScrollPane";
import { ApichangeUsedRegid } from "@/api/totalcheck.js"; // 引入接口文件
import { mapGetters } from "vuex";
import { ClearSign } from "@/api/sign.js";
export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // visitedViews() {
    //   return this.$store.state.tagsView.visitedViews
    // }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    // 侧边栏激活的回调
    handlerNavSelect(item) {
      let index = item.path;
      // 设置vuex中tabs值
      if (index.split("/")[1]) {
        this.$store.commit("handlerSetTabsArr", index.split("/")[1]);
      }
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.$store.dispatch("addVisitedViews", route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    closeSelectedTag(view) {
      if (view && view.path == "/sign/index") {
        ClearSign({ flag: 0 }).then((res) => {});
        ClearSign({ flag: 1 }).then((res) => {});
      }
      // 设置删除vuex中tabs值
      if (view.path.split("/")[1]) {
        this.$store.commit("handlerSetTabRemove", view.path.split("/")[1]);
      }
      this.$store.dispatch("delVisitedViews", view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
      if (
        this.Hospitals == "index_gyey" ||
        (this.Hospitals == "index_mzjyyy" &&
          view.path.split("/")[1] == "totalcheck")
      ) {
        if (!localStorage.getItem("ChangeUsedRegid")) return;
        let data = {
          regid: localStorage.getItem("ChangeUsedRegid"),
          used: 0,
        };
        ApichangeUsedRegid(data).then((res) => {
          this.$message.success(res.message);
        });
      }
    },
    closeOthersTags() {
      // 设置删除vuex中tabs值
      if (this.selectedTag.path.split("/")[1]) {
        this.$store.commit(
          "handlerSetTabRemoveOther",
          this.selectedTag.path.split("/")[1]
        );
      }
      this.$router.push(this.selectedTag);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.commit("handlerSetTabRemoveAll");
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      this.left = e.clientX - offsetLeft + 15; // 15: margin right
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-theme {
  .tags-view-container {
    .tags-view-wrapper {
      .tags-view-item {
        //  transform: skewX(-20deg);
        .tags-view-item-in {
          display: inline-block;
          color: #000;
          font-weight: 500;
          // transform: skewX(20deg);
        }
        .el-icon-close {
          // transform: skewX(20deg);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 5px;
        }
        &.active {
          // color: #fff;
          background-color: #e2e2e2;
          // background-color: #409eff;
          border-color: #dcdfe6;
          &::before {
            display: none;
          }
        }
      }
      .tags-view-items {
        .tags-view-item-in {
          display: inline-block;
          // transform: skewX(20deg);
        }
        .el-icon-close {
          // transform: skewX(20deg);
          position: absolute;
          top: 0;
          right: 0;
        }
        &.active {
          // color: #fff;
          background-color: #e2e2e2;
          // background-color: #409eff;
          border-color: #dcdfe6;
          &::before {
            display: none;
          }
        }
      }
    }
  }
}
.tags-view-container {
  margin-top: 45px;
  .tags-view-wrapper {
    background: #efefef;
    height: 35px;
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-item {
      display: inline-block;
      padding: 0 30px 0 18px;
      position: relative;
      height: 35px;
      line-height: 35px;
      // border: 1px solid #d8dce5;
      color: #495060;
      background: #d0ddeb;
      // padding: 0 8px;
      font-size: 12px;
      // margin-left: 5px;
      // margin-top: 4px;
      &.active {
        // color: #fff;
        background-color: #e2e2e2;
        // background-color: #409eff;
        border-color: #409eff;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 10000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      // width: 12px;
      // height: 12px;
      font-size: 20px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: 0px;
      }
      &:hover {
        background-color: #b4bccc;
        // color: #fff;
      }
    }
  }
}
</style>
