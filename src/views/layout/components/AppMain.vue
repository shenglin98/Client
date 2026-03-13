<template>
  <section class="app-main" ref="appMain">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="keepAliveRoute" v-if="keepAliveRoute.length > 0">
        <router-view></router-view>
      </keep-alive>
      <!-- <keep-alive :include="keepAliveDatas" v-if="keepAliveDatas.length > 0">
        <router-view :key="key"></router-view>
      </keep-alive> -->
      <router-view :key="key" v-else></router-view>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Authorize from "@/views/authorize/index.vue";
export default {
  name: "AppMain",
  computed: {
    ...mapGetters({
      keepAliveData: "keepAliveData",
    }),
    keepAliveDatas() {
      return this.keepAliveData || [];
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    },
    keepAliveRoute() {
      return this.$store.state.tabsCache.tabsArr.map((item) => {
        return item;
      });
    },
  },
  components: { Authorize },
  mounted() {
    // 设置vuex中tabs值
    if (this.$route.path.split("/")[1]) {
      this.$store.commit("handlerSetTabsArr", this.$route.path.split("/")[1]);
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.$refs.appMain.scrollTop = 0;
    },
  },
};
</script>

<style scoped>
.app-main {
  width: 100%;
  height: calc(100% - 35px);
  position: relative;
  overflow: hidden;
  background-color: #efefef;
  box-sizing: border-box;
}
</style>
