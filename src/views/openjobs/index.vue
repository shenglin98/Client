<template>
  <div class="openjobs">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>
        <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <permission-btn moduleName='openJobs' size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container ">
      <div class="bg-white">
        <el-table ref="mainTable" :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column align="center" prop="jobName" label="任务名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" min-width="80px" prop="runCount" label="执行次数">
          </el-table-column>
          <el-table-column align="center" prop="lastRunTime" label="最后一次执行" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="jobCall" label="任务地址" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="cron" label="CRON表达式" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" width="100" label="运行状态">
            <template slot-scope="scope">
              <span :class="scope.row.status|statusFilter">{{scope.row.status|filterStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>

          <el-table-column align="center" :label="'操作'" width="80" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" :type="`${scope.row.status === 0 ? 'success' : 'danger'}`" @click="handleModifyStatus(scope.row)">{{scope.row.status === 0 ? '启用' : '停止'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>

      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px">

          <el-form-item v-if="temp.id" size="small" :label="'ID'" prop="id">
            <el-input :disabled="true" v-model="temp.id"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'任务名称'" prop="jobName">
            <el-input v-model="temp.jobName"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'CRON表达式'" prop="cron">
            <cron-input v-model="temp.cron"></cron-input>
          </el-form-item>
          <el-form-item size="small" :label="'任务执行方式'" prop="jobType">
            <el-select class="filter-item" v-model="temp.jobType" placeholder="选择执行方式" @change="temp.jobCall = ''">
              <el-option v-for="item in  jogTypes" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'任务地址'" prop="jobCall">
            <el-input v-if="temp.jobType !== 0" v-model="temp.jobCall"></el-input>
            <el-select v-else class="filter-item" v-model="temp.jobCall" placeholder="选择执行方式">
              <el-option v-for="item in  jobCallList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'任务参数，JSON格式'" prop="jobCallParams">
            <el-input v-model="temp.jobCallParams"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'备注'" prop="remark">
            <el-input v-model="temp.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import * as openJobs from "@/api/openjobs";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import CronInput from "@/components/cron/cron-input";
import extend from "@/extensions/delRows.js";
import { mapGetters } from "vuex";

export default {
  name: "OpenJobs",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
    CronInput,
  },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  data() {
    return {
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        key: undefined,
        appId: undefined,
      },
      // 0：本地任务；1：外部接口任务
      jogTypes: [
        {
          key: 0,
          name: "本地任务",
        },
        {
          key: 1,
          name: "外部接口任务",
        },
      ],
      statusOptions: [
        {
          key: 0,
          display_name: "停止",
        },
        {
          key: 1,
          display_name: "正在运行",
        },
        {
          key: 2,
          display_name: "暂停",
        },
      ],
      temp: {
        id: "", // Id
        jobName: "", // 任务名称
        jobType: 0, // 任务执行方式0：本地任务；1：外部接口任务
        jobCall: "", // 任务地址
        jobCallParams: "", // 任务参数，JSON格式
        cron: "", // CRON表达式
        // status: 0, // 任务运行状态（0：停止，1：正在运行，2：暂停）
        remark: "", // 备注
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        cron: [
          {
            required: true,
            message: "规则不能为空",
            trigger: "blur",
          },
        ],
        jobName: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
        jobType: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
        jobCall: [
          {
            required: true,
            message: "任务地址不能为空",
            trigger: "blur",
          },
        ],
      },
      jobCallList: [],
      downloadLoading: false,
    };
  },
  filters: {
    filterJobType(val) {
      switch (val) {
        case 0:
          return "本地任务";
        case 1:
          return "外部接口任务";
      }
    },
    filterStatus(val) {
      switch (val) {
        case 0:
          return "停止";
        case 1:
          return "正在运行";
        case 2:
          return "暂停";
      }
    },
    statusFilter(val) {
      const disable = val === 0;
      const statusMap = {
        false: "color-success",
        true: "color-danger",
      };
      return statusMap[disable];
    },
  },
  created() {
    this.getList();
    this.queryLocalHandlers();
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
    queryLocalHandlers() {
      openJobs.QueryLocalHandlers().then((res) => {
        this.jobCallList = res.result;
      });
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length < 1) {
            this.$message({
              showClose: true,
              message: "至少删除一个",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
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
      openJobs.getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.count;
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
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleModifyStatus(row) {
      // 模拟修改状态
      const status = row.status === 0 ? 1 : 0;
      this.$confirm(
        `确认${status === 0 ? "停止" : "启动"}定时任务"${row.jobName}"?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              openJobs
                .changeStatus({ id: row.id, status: status })
                .then(() => {
                  this.$message.success(
                    `"${row.jobName}"${status === 0 ? "已停止" : "已启动"}`
                  );
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "确定";
                  row.status = status;
                  done();
                })
                .catch(() => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "确定";
                });
            } else {
              done();
            }
          },
        }
      );
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
    resetTemp() {
      this.temp = {
        id: "",
        jobName: "",
        jobType: 0,
        jobCall: "",
        jobCallParams: "",
        cron: "",
        remark: "",
      };
    },
    handleCreate() {
      // 弹出添加框
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          openJobs.add(this.temp).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
          });
        }
      });
    },
    handleUpdate(row) {
      // 弹出编辑框
      this.temp = Object.assign({}, row); // copy obj
      this.temp.jobCallParams =
        row.jobCallParams === "null" ? "" : row.jobCallParams;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          openJobs.update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
            });
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行删除
      this.delrows(openJobs, rows);
    },
  },
};
</script>
<style lang="scss">
.dialog-mini .el-select {
  width: 100%;
}
.openjobs {
  height: 100%;
  .app-container {
    height: calc(100% - 45px);
    .bg-white {
      height: 100%;
      .el-table {
        height: calc(100% - 60px);
      }
    }
  }
}
</style>
