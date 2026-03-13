<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>
        <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <permission-btn moduleName="sys_reg_hospital" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <div class="bg-white fh" style="height:100vh">
        <el-table ref="mainTable" height="calc(100vh - 147px)" :key="tableKey" :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column align="left" width="85" prop="id" label="机构编码" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="name" label="机构名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="licensekey" label="许可秘钥" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="pycode" label="拼音码" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="wbcode" label="五笔码" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="seqno" label="排序" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>

      <el-dialog v-el-drag-dialog :close-on-click-modal="false" class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px">
          <el-form-item size="small" :label="'机构编码'">
            <el-input v-model="temp.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'机构名称'" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'许可秘钥'" prop="licensekey">
            <el-input v-model="temp.licensekey"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'排序'" prop="seqno">
            <el-input v-model="temp.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog v-el-drag-dialog :close-on-click-modal="false" class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="adddialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="addtemp" label-position="right" label-width="130px">
          <el-form-item size="small" :label="'机构编码'">
            <el-input :disabled="true" placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'机构名称'" prop="name">
            <el-input v-model="addtemp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'许可秘钥'" prop="licensekey">
            <el-input v-model="addtemp.licensekey"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'排序'" prop="seqno">
            <el-input v-model="addtemp.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="adddialogFormVisible = false">取消</el-button>
          <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as sys_reg_hospital from "@/api/sys_reg_hospital";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/delRows.js";
import { tabHeader } from "@/utils/tool";
import { mapGetters } from "vuex";

export default {
  name: "sys_reg_hospital",
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
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      saveLoading: false,
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
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Sys_reg_hospital",
      },
      addtemp: {
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Sys_reg_hospital",
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
        name: [
          {
            required: true,
            message: "机构名称",
            trigger: "blur",
          },
        ],
        licensekey: [
          {
            required: true,
            message: "许可秘钥",
            trigger: "blur",
          },
        ],
        seqno: [
          {
            required: true,
            message: "排序",
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
        case "btnRefresh":
          this.getList();
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
      sys_reg_hospital.getList(this.listQuery).then((response) => {
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
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Sys_reg_hospital",
      };
    },
    addresetTemp() {
      this.addtemp = {
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Sys_reg_hospital",
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
          if (this.saveLoading) return;
          this.saveLoading = true;
          sys_reg_hospital.add(this.addtemp).then(() => {
            this.adddialogFormVisible = false;
            this.getList();
            this.addresetTemp();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
            this.saveLoading = false;
          });
        }
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.temp = Object.assign({}, row); // copy obj
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
          if (this.saveLoading) return;
          this.saveLoading = true;
          const tempData = Object.assign({}, this.temp);
          sys_reg_hospital.update(tempData).then(() => {
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
            this.getList();
            this.saveLoading = false;
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行删除
      this.delrows(sys_reg_hospital, rows);
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
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
