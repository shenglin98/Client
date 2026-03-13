<!--待处理列表-->

<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>

        <el-button size="mini" class="filter-item" type="success" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <permission-btn size="mini" moduleName='/flowinstances/wait' v-on:btn-event="onBtnClicked"></permission-btn>

        <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showDescription">描述</el-checkbox>
      </div>
    </sticky>
    <div class="app-container flex-item">

      <el-table ref="mainTable" :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%;" height="calc(100% - 52px)" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <el-table-column :label="'实例编码'" min-width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="80px" :label="'名称'">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.customName}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="80px" :label="'当前活动节点'">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.activityName}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" v-if='showDescription' :label="'描述'">
          <template slot-scope="scope">
            <span style='color:red;'>{{scope.row.description}}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="'状态'" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isFinish | statusFilter">{{statusOptions.find(u =>u.key == scope.row.isFinish).display_name}}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
import Layout from "@/views/layout/Layout";
import * as flowinstances from "@/api/flowinstances";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters, mapActions } from "vuex";
import { statusOptions } from "@/utils/const.js";

export default {
  name: "flowInstanceWait",
  components: {
    Sticky,
    permissionBtn,
  },
  directives: {
    waves,
  },
  computed: {
    ...mapGetters(["isWaitRender", "iframeViews", "visitedViews"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.isWaitRender) {
        vm.getList();
      }
    });
  },
  data() {
    return {
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        key: undefined,
        type: "wait",
      },
      statusOptions: statusOptions,
      showDescription: true,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  filters: {
    statusFilter(isFinish) {
      const statusMap = {
        0: "info",
        1: "success",
        2: "danger",
        3: "danger",
        4: "danger",
      };
      return statusMap[isFinish];
    },
  },
  created() {
    this.getList();
    var addRouter = [
      {
        path: "/flowinstances",
        component: Layout,
        redirect: "noredirect",
        name: "flowinstances",
        meta: {
          title: "流程中心",
          icon: "guide",
        },
        children: [
          {
            path: "detail/:id",
            component: () => import("@/views/flowinstances/detail"),
            name: "flowinstanceDtl",
            hidden: true,
            meta: {
              notauth: true,
              title: "流程详情",
              noCache: true,
              icon: "list",
            },
          },
          {
            path: "verify/:id",
            component: () => import("@/views/flowinstances/verify"),
            name: "verifyFlowinstance",
            hidden: true,
            meta: {
              notauth: true,
              title: "处理流程",
              noCache: true,
              icon: "list",
            },
          },

          {
            path: "add",
            component: () => import("@/views/flowinstances/add"),
            name: "instanceAdd",
            meta: {
              notauth: true,
              title: "发起流程",
              noCache: true,
              icon: "star",
            },
          },
        ],
      },
    ];
    this.$router.addRoutes(addRouter);
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
    ...mapActions(["updateInstancesIsRender"]),
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked: function (domId) {
      console.log("you click:" + domId);
      switch (domId) {
        case "btnDetail":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行查看",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnVerification":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "同时只能处理一个",
              type: "error",
            });
            return;
          }
          this.handleVerify(this.multipleSelection[0]);
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      flowinstances.getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.count;
        this.updateInstancesIsRender({ type: "isWaitRender", val: false });
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleModifyStatus(row, isFinish) {
      // 模拟修改状态
      this.$message({
        showClose: true,
        message: "操作成功",
        type: "success",
      });
      row.isFinish = isFinish;
    },
    handleUpdate(row) {
      // 弹出编辑框
      this.$router.push("/flowinstances/detail/" + row.id);
    },
    handleVerify(row) {
      // 处理流程
      this.$router.push("/flowinstances/verify/" + row.id);
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
};
</script>