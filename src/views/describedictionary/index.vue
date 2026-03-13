<template>
  <div>
    <div class="main">
      <div class="main_left">
        <div class="main_left_head"></div>
        <div class="main_left_menu">
          <el-row>
            <el-col :span="24">
              <el-menu class="el-menu-vertical-demo" background-color="#fff" text-color="#606266" active-text-color="#4689cb" @select="handleSelect">
                <el-menu-item index="ZXJS">
                  <i class="el-icon-menu"></i>
                  <span slot="title">中心介绍</span>
                </el-menu-item>
                <el-menu-item index="ZJJS">
                  <i class="el-icon-menu"></i>
                  <span slot="title">专家介绍</span>
                </el-menu-item>
                <el-menu-item index="TJLC">
                  <i class="el-icon-menu"></i>
                  <span slot="title">体检流程</span>
                </el-menu-item>
                <el-menu-item index="TJXZ">
                  <i class="el-icon-menu"></i>
                  <span slot="title">体检须知</span>
                </el-menu-item>
                <el-menu-item index="KSDH">
                  <i class="el-icon-menu"></i>
                  <span slot="title">科室导航</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="main_right">
        <div class="main_right_head">
          <sticky :className="'sub-navbar'">
            <div class="filter-container">
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked" index="1" v-show="navPage != 0"></permission-btn>
            </div>
          </sticky>
        </div>
        <div class="main_right_menu">
          <!-- <div class="mask" v-if="false"></div> -->
          <el-empty description="点击左侧菜单加载数据" v-if="navPage == 0"></el-empty>
          <div class="rich_text">
            <quill-editor v-model="value" ref="myQuillEditor" :options="editorOption" :setting="setting" :disabled="disabledSwitch" v-show="navPage != 0">
            </quill-editor>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";

import { Detail, Save, deleteRelatedTroduce } from "@/api/describedictionary";
export default {
  name: "describedictionary",
  props: {},
  components: {
    Sticky,
    permissionBtn,
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  data() {
    return {
      navPage: 0,
      value: "",
      editorOption: {
        placeholder: "",
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            // ["blockquote", "code-block"], //引用，代码块
            // [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: "ordered" }, { list: "bullet" }], //列表
            // [{ script: "sub" }, { script: "super" }], // 上下标
            // [{ indent: "-1" }, { indent: "+1" }], // 缩进
            // [{ direction: "rtl" }], // 文本方向
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            // [{ font: [] }], //字体
            [{ align: [] }], //对齐方式
            ["clean"], //清除字体样式
            ["image", "video"], //上传图片、上传视频
          ],
        },
      },
      setting: {
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN", //本地化设置
        language_url:
          "https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js", //使用language_url会相对灵活
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars emoticons",
        height: "100%",
        setup: function (editor) {
          editor.on("change", function (e) {
            console.log("change event", e);
          });
        },
      },
      disabledSwitch: true,
      userInfo: null,
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || null;
  },
  methods: {
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter(
        (k) => k.path === this.$route.path
      )[0];
      if (view) {
        // 设置删除vuex中tabs值
        if (view.path.split("/")[1]) {
          this.$store.commit("handlerSetTabRemove", view.path.split("/")[1]);
        }
        this.$store.dispatch("delVisitedViews", view).then((views) => {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        });
      }
    },
    // 菜单切换
    handleSelect(key) {
      console.log(key);
      this.navPage = key;
      if (key == "ZXJS") {
        this.handleGetTroduceList(key);
      } else if (key == "ZJJS") {
        this.handleGetTroduceList(key);
      } else if (key == "TJLC") {
        this.handleGetTroduceList(key);
      } else if (key == "TJXZ") {
        this.handleGetTroduceList(key);
      } else if (key == "KSDH") {
        this.handleGetTroduceList(key);
      }
    },
    // 编辑
    handleEdit() {
      this.disabledSwitch = false;
    },
    // 相关介绍列表
    handleGetTroduceList(code) {
      Detail({ code, meccode: this.userInfo.meccode }).then((res) => {
        this.value = res.result?.introduce || "";
        this.disabledSwitch = true;
      });
    },
    // 相关介绍详情
    // 相关介绍保存
    handleAddTroduceSave() {
      Save({
        code: this.navPage,
        introduce: this.value,
        meccode: this.userInfo.meccode,
      }).then((res) => {
        this.$message.success(res.message);
        res.code === 200 && this.handleGetTroduceList(this.navPage),
          (this.disabledSwitch = true);
      });
    },

    // 按钮
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnEdit": // 编辑
          this.handleEdit();
          break;
        case "btnSave": // 保存
          this.handleAddTroduceSave();
          break;
        case "btnImport": // 导入
          console.log("导入");
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
@import "./css/zh_CN.scss";
</style>
