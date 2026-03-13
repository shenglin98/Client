<template>
  <div id="app">
    <router-view></router-view>
    <!-- <CompoentsFileMD5 :isFlag="mdFlag" @setFun="setMdFlag"></CompoentsFileMD5> -->
  </div>
</template>

<script>
import fileMD5Flag from "./utils/fileMD5code";
import { mapGetters } from "vuex";
import CompoentsFileMD5 from "./components/fileMD5/index.vue";
export default {
  name: "App",
  components: {
    CompoentsFileMD5,
  },
  computed: {},
  data() {
    return {
      userInfo: null,
      // mdFlag: false,
    };
  },
  methods: {
    userLoaded: function (e) {
      console.log(
        "I am listening to the user loaded event in vuex-oidc",
        e.detail
      );
    },
    // setMdFlag(flg) {
    //   this.mdFlag = flg;
    // },
  },
  mounted() {
    window.addEventListener("vuexoidc:userLoaded", this.userLoaded);
    this.$store.dispatch("CloseSideBar", false);
    // this.mdFlag = fileMD5Flag;
  },
  destroyed() {
    window.removeEventListener("vuexoidc:userLoaded", this.userLoaded);
  },
};
</script>
<style lang="scss">
body {
  font-family: "Microsoft YaHei", "Arial", sans-serif;
}
.projectdictionary-content {
  overflow: hidden !important;
}
.el-message {
  top: 1% !important;
  // left: 50% !important;
  // transform: translateY(-50%) !important;
  // transform: translateX(-50%) !important;
}
.el-notification {
  position: fixed;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.el-notification.right {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.el-notification.left {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
.el-input.is-disabled {
  .el-input__inner {
    background: #fff !important;
    color: #000 !important;
  }
}
.el-textarea {
  .el-textarea__inner {
    color: #000 !important;
  }
}
.el-table {
  .el-textarea.is-disabled {
    .el-textarea__inner {
      color: #000 !important;
      background-color: #fff !important;
    }
  }
}
.tox-tinymce-aux {
  z-index: 99999 !important;
}
.el-message-box.expiretips {
  .el-message-box__header {
    .el-message-box__title {
      font-weight: 600;
      color: red;
    }
  }
}
.systemWarnTips {
  width: 800px !important;
  .el-message-box__content {
    height: 500px !important;
    overflow-y: auto;
  }
}
input[aria-hidden="true"] {
  display: none !important;
}
</style>
