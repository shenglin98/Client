<template>
  <div class="company_settlement">
    <!-- 内容主体 -->
    <div class="main">
      <!-- 内容左侧 -->
      <div class="main_left">
        <!-- 左侧头部 -->
        <div class="main_left_head"></div>
        <!-- 左侧内容 -->
        <div class="main_left_menu">
          <el-menu class="el-menu-vertical-demo left_menu" background-color="#fff" text-color="#606266" active-text-color="#4689cb" @select="handleSelect">
            <!-- <el-menu-item index="8" @click="handelObtainhSuggestion()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病复查建议</span>
            </el-menu-item> -->
            <el-menu-item index="1" @click="handelSelfServiceMachines()">
              <i class="el-icon-menu"></i>
              <span slot="title">自助机字典</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="main_right">
        <!-- 右侧头部 -->
        <div class="main_right_head">
          <!-- 头部操作控件 -->
          <sticky :className="'sub-navbar'">
            <div class="filter-container">
              <!-- <el-input size="mini" v-model="searchValue" style="width: 200px;" :placeholder="'名称'"></el-input>
              <el-button size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->

              <!-- <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked9" v-if="selfHelpFlag" index='8'></permission-btn> -->
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked9" v-if="selfHelpFlag" index='1'></permission-btn>
            </div>
          </sticky>
        </div>
        <!-- 右侧内容 -->
        <div class="main_right_menu">
          <el-empty description="点击左侧菜单加载数据" v-show="empty"></el-empty>
          <!-- 自助机字典   字典表格 -->
          <el-table :data="selfHelpData" height="calc(100vh - 152px)" v-loading="tableLoading" v-if="selfHelpFlag" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="id">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditselfHelp(scope.row)">{{ scope.row.id }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="introduce" label="中心介绍" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditselfHelp(scope.row)">{{ scope.row.introduce }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="flow" label="体检流程" show-overflow-tooltip></el-table-column>
            <el-table-column prop="notice" label="体检须知" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- -------------------------------------------------------------------------------------------------------- -->
      <!-- 添加/编辑职业病 职业建议 字典弹窗 -->
      <el-dialog title="添加/编辑" label-position="right" :modal-append-to-body="false" :visible.sync="dialogFormVisible" width="70%" :append-to-body="false">
        <el-tabs v-model="richtextMsg" type="card" @tab-click="handleRichtextClick">
          <el-tab-pane label="中心介绍" name="introduce">
            <div class="richtext">
              <vue-tinymce :key="tinymceFlag1" v-model="addAll.introduce" :setting="setting" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="体检流程" name="flow">
            <div class="richtext">
              <vue-tinymce :key="tinymceFlag2" v-model="addAll.flow" :setting="setting" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="体检须知" name="notice">
            <div class="richtext">
              <vue-tinymce :key="tinymceFlag3" v-model="addAll.notice" :setting="setting" />
            </div>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="iseditFlag" size="mini" type="primary" @click="handelOccupation(); dialogFormVisible = false;">确 定</el-button>
          <el-button v-else size="mini" type="primary" @click="handelEditOccupation(); dialogFormVisible = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible = false,handelSelfServiceMachines()">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
  <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";

import {
  GetData,
  UpdataSelfServiceData,
} from "@/api/dic_self_service_machine.js";
export default {
  name: "dic_self_service_machine",
  components: {
    Sticky,
    permissionBtn,
  },
  data() {
    return {
      tableLoading: true, // 表格loading
      richtextMsg: "introduce", // 富文本  introduce--flow--notice
      tinymceFlag1: 1,
      tinymceFlag2: 2,
      tinymceFlag3: 3,
      iseditFlag: false, // 是否为编辑
      setting: {
        // menubar: 'file edit insert view format table',
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN", //本地化设置
        language_url: "../../utils/zh_CN.js", //  本地汉化包路径
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        quickbars_selection_toolbar: "bold forecolor backcolor",
        quickbars_insert_toolbar: true,
        plugins: "quickbars",
        plugins: "link image media table lists fullscreen quickbars emoticons",
        height: "100%",
        setup: function (editor) {
          editor.on("focus", function (e) {
            console.log("触发");
          });
        },
      }, // 富文本配置器
      searchValue: "",
      empty: true,
      // 添加字典表单--传此对象
      addAll: {
        id: 0,
        introduce: "",
        flow: "",
        notice: "",
      },
      // 删除编码集
      codeset: [],
      // 编辑编码集
      editcodeset: {},
      open: [],
      //  -----------------------------------------------
      // 自助机字典 -- 数据
      selfHelpData: [],
      // 自助机字典展示状态
      selfHelpFlag: false,
      // 自助机字典 字典添加弹窗
      dialogFormVisible: false,
      changeFormVisible: false,
      // 自助机字典 字典编辑弹窗
      editFormVisible: false,

      // 表单的label宽度
      formLabelWidth: "110px",
      editor: null,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mounted() {},

  methods: {
    // 编辑/新增时切换富文本
    handleRichtextClick(name) {
      // console.log(name);
    },
    // -------------------点击表格名字回调
    // 自助机 点击id/介绍中心回调, 调用编辑
    handleEditselfHelp(item) {
      if (!item) return false;
      this.addAll = item;
      this.dialogFormVisible = true; // 打开dialog
    },
    // 切换表单
    handleSelect(key) {
      console.log(key, "key--------------");
      this.empty = false;
      switch (key) {
        case "1":
          this.StateAllShutDownFun();
          this.selfHelpFlag = true;
          break;
        default:
          break;
      }
    },
    // 关闭全部数据框
    StateAllShutDownFun() {
      this.selfHelpFlag = false;
    },
    // ------------------------获取字典数据回调
    // 获取自助机数据
    handelSelfServiceMachines() {
      GetData().then((res) => {
        console.log(res);
        res.code == 200 && (this.selfHelpData = [res.result]);
        this.tableLoading = false; // 关闭loading
      });
    },
    // ------------------------ 添加回调
    // 点击添加自助机字典
    handelOccupation() {
      console.log(this.addAll);
      this.addAll.id = 0; //新增id传0
      UpdataSelfServiceData(this.addAll).then((res) => {
        if (res.code == 200) {
          this.handelSelfServiceMachines();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 勾选数据 打开编辑回调
    handleSelectChange(row) {
      this.open = row; //点击按钮时判断当前数组长度 再做后续操作
    },
    // ---------------------------编辑按钮回调
    // 编辑回调
    handelEditOccupation() {
      // 编辑传正常id
      UpdataSelfServiceData(this.addAll).then((res) => {
        if (res.code == 200) {
          this.handelSelfServiceMachines();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // -------------------------------按钮组回调
    // 职业病职业建议字典按钮回调
    hadnleOnBtnClicked9(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible = true;
          this.iseditFlag = false; // 不是编辑按钮触发
          this.addAll = {
            id: 0,
            introduce: "",
            flow: "",
            notice: "",
          };
          break;
        case "btnEdit": // 编辑
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.dialogFormVisible = true;
            this.iseditFlag = true;
            this.addAll = { ...this.open[0] };
          }
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
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

    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#d0ddeb";
      return stylejson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
  },

  watch: {},
};
</script>
  
  <style lang='scss' scoped>
@import "./css/index.scss";
</style>
  