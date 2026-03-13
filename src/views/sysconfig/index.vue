<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input
          @keyup.enter.native="handleFilter"
          size="mini"
          style="width: 200px"
          class="filter-item"
          :placeholder="'名称'"
          v-model="listQuery.key"
        >
        </el-input>
        <el-button
          class="filter-item"
          size="mini"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
          >搜索</el-button
        >
        <permission-btn
          moduleName="sysconfig"
          size="mini"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <div class="bg-white fh" style="height: 100vh">
        <el-table
          ref="mainTable"
          height="calc(100vh - 147px)"
          :key="tableKey"
          :data="list"
          v-loading="listLoading"
          fit
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="conid"
            width="85px"
            label="配置编号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="conitemname" label="参数名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{
                scope.row.conitemname
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="concode"
            label="参数代码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="congitemroup"
            label="模块名称"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column prop="conitemtype" label="参数类型" width="100px" show-overflow-tooltip></el-table-column> -->
          <el-table-column
            prop="conitemValue"
            label="参数值"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="conremark"
            label="参数说明"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
          @pagination="handleCurrentChange" /> -->
      </div>

      <el-dialog
        v-el-drag-dialog
        class="dialog-mini"
        :close-on-click-modal="false"
        width="600px"
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="temp"
          label-position="right"
          label-width="130px"
        >
          <el-form-item size="small" :label="'配置编码'" prop="conid">
            <el-input v-model="temp.conid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'模块名称'" prop="congitemroup">
            <el-input v-model="temp.congitemroup"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'参数代码'" prop="concode">
            <el-input v-model="temp.concode"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'参数名称'" prop="conitemname">
            <el-input v-model="temp.conitemname"></el-input>
          </el-form-item>
          <!-- <el-form-item size="small" :label="'参数类型'" prop="conitemtype">
            <el-input v-model="temp.conitemtype"></el-input>
          </el-form-item> -->
          <el-form-item size="small" :label="'参数值'">
            <el-input v-model="temp.conitemValue"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'参数说明'" prop="conremark">
            <el-input v-model="temp.conremark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button
            size="mini"
            v-if="dialogStatus == 'create'"
            type="primary"
            @click="createData"
            >确认</el-button
          >
          <el-button size="mini" v-else type="primary" @click="updateData"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        v-el-drag-dialog
        class="dialog-mini"
        :close-on-click-modal="false"
        width="600px"
        :title="textMap[dialogStatus]"
        :visible.sync="adddialogFormVisible"
      >
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="addtemp"
          label-position="right"
          label-width="130px"
        >
          <el-form-item size="small" :label="'配置编码'" prop="conid">
            <el-input
              v-model="addtemp.conid"
              placeholder="系统自动生成"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'模块名称'" prop="congitemroup">
            <el-input v-model="addtemp.congitemroup"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'参数代码'" prop="concode">
            <el-input v-model="addtemp.concode"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'参数名称'" prop="conitemname">
            <el-input v-model="addtemp.conitemname"></el-input>
          </el-form-item>
          <!-- <el-form-item size="small" :label="'参数类型'" prop="conitemtype">
            <el-input v-model="addtemp.conitemtype"></el-input>
          </el-form-item> -->
          <el-form-item size="small" :label="'参数值'">
            <el-input v-model="addtemp.conitemValue"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'参数说明'" prop="conremark">
            <el-input v-model="addtemp.conremark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="adddialogFormVisible = false">取消</el-button>
          <el-button
            size="mini"
            v-if="dialogStatus == 'create'"
            type="primary"
            @click="createData"
            >确认</el-button
          >
          <el-button size="mini" v-else type="primary" @click="updateData"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as sysconfig from "@/api/sysconfig";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/delRows.js";
import { tabHeader } from "@/utils/tool";
import { mapGetters } from "vuex";

export default {
  name: "sysconfig",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
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
      saveLoading: false,
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      tabHeader: tabHeader,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        key: undefined,
        appId: undefined,
      },
      temp: {
        conid: "",
        concode: "",
        congitemroup: "",
        conitemname: "",
        conitemtype: "",
        conitemValue: "",
        conremark: "",
      },
      addtemp: {
        conid: "",
        concode: "",
        congitemroup: "",
        conitemname: "",
        conitemtype: "",
        conitemValue: "",
        conremark: "",
      },
      dialogFormVisible: false,
      adddialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        concode: [
          {
            required: true,
            message: "参数代码不能为空",
            trigger: "blur",
          },
        ],
        conitemname: [
          {
            required: true,
            message: "参数名称不能为空",
            trigger: "blur",
          },
        ],
        conitemValue: [
          {
            required: true,
            message: "参数值不能为空",
            trigger: "blur",
          },
        ],
      },
      jobCallList: [],
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter((k) => k.path === this.$route.path)[0];
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
    // rowClick(row) {
    //   // this.$refs.mainTable.clearSelection();
    //   // this.$refs.mainTable.toggleRowSelection(row);
    //   // this.handleUpdate(row);
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除
    handleDeleteItem() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.multipleSelection.map((i) => {
            return i.conid;
          });
          sysconfig.deleteItem(ids).then((res) => {
            console.log(res);
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
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
        case "btnCache":
          this.$confirm("是否要清除系统缓存?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              sysconfig.deleteCache().then((response) => {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "清除成功!",
                });
              });
            })
            .catch(() => {
              this.$message({
                showClose: true,
                type: "info",
                message: "已取消清除",
              });
            });
          break;
        case "btnDelete": // 删除
          this.handleDeleteItem();
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
      this.listQuery.limit = 1000;
      sysconfig.getList(this.listQuery).then((response) => {
        this.list = response.data;
        console.log(this.list);
        // this.total = response.data.length;
        this.listLoading = false;
      });
    },
    handleFilter() {
      if (
        this.listQuery.key != "" &&
        this.listQuery.key != undefined &&
        this.listQuery.key != null
      ) {
        var reg = new RegExp(this.listQuery.key);
        sysconfig.getList(this.listQuery).then((response) => {
          this.list = response.data;
          if (this.list.filter((item, index) => item.conitemname.match(reg)).length > 0) {
            this.list = Object.assign(
              [],
              this.list.filter((item, index) => item.conitemname.match(reg))
            );
          }
          if (this.list.filter((item, index) => item.concode.match(reg)).length > 0) {
            this.list = Object.assign(
              [],
              this.list.filter((item, index) => item.concode.match(reg))
            );
          }
        });
      } else {
        this.listLoading = true;
        sysconfig.getList("").then((response) => {
          this.list = response.data;
          this.listLoading = false;
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
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        conid: "",
        concode: "",
        congitemroup: "",
        conitemname: "",
        conitemtype: "",
        conitemValue: "",
        conremark: "",
      };
    },
    addresetTemp() {
      this.addtemp = {
        conid: "",
        concode: "",
        congitemroup: "",
        conitemname: "",
        conitemtype: "",
        conitemValue: "",
        conremark: "",
      };
    },
    handleCreate() {
      // 弹出添加框

      this.dialogStatus = "create";
      this.adddialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          sysconfig.addOrUpdate(this.addtemp).then((res) => {
            if (res.code === 200) {
              this.getList();
              this.adddialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
              });
              this.addresetTemp();
            }
          });
          this.saveLoading = false;
        }
      });
    },
    handleUpdate(row) {
      // 弹出编辑框
      console.log(row);
      this.temp = Object.assign({}, row); // copy obj
      this.temp.jobCallParams = row.jobCallParams === "null" ? "" : row.jobCallParams;
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
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          const tempData = Object.assign({}, this.temp);
          sysconfig.addOrUpdate(tempData).then((res) => {
            if (res.code === 200) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
              });
              this.getList();
            }
          });
          this.saveLoading = false;
        }
      });
    },
    handleDelete(rows) {
      // 多行删除
      this.delrows(sysconfig, rows);
    },
  },
};
</script>
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
