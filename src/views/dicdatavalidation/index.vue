<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>
        <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <permission-btn moduleName="dicdatavalidation" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <div class="bg-white fh" style="height:100vh">
        <el-table ref="mainTable" height="calc(100vh - 147px)" :key="tableKey" :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column align="left" width="120" prop="valid" label="自增ID" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" width="200" prop="validationname" label="效验名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.validationname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" width="300" prop="varlidationtips" label="效验名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" width="300" prop="varlidationtips" label="效验提示" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="validationtype" label="效验类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.validationtype==0?'项目': scope.row.validationtype==1?'小结': scope.row.validationtype==2?'建议': scope.row.validationtype==3?'全部': ""}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" width="200" prop="itemname" label="项目名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="relation" label="关系" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.relation=='='?'等于': scope.row.relation=='>'?'大于': scope.row.relation=='>='?'大于等于': scope.row.relation=='<'?'小于':scope.row.relation=='<='?'小于等于':scope.row.relation=='LIKE'?'包含':""}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="keyword" label="关键字" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="group" label="分组" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="expression" label="计算公式" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="sex" label="性别控制" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.sex==0?'未知': scope.row.sex==1?'男': scope.row.sex==2?'女': ""}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="agel" label="年龄下限" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="ageh" label="年龄上限" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="seqno" label="排序" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <el-dialog v-el-drag-dialog :close-on-click-modal="false" class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="adddialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="addtemp" label-position="right" label-width="130px">
          <el-form-item size="small" :label="'自增ID'">
            <el-input :disabled="true" v-model="addtemp.valid" placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'效验名称'" prop="validationname">
            <el-input v-model="addtemp.validationname"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'效验提示'" prop="varlidationtips">
            <el-input v-model="addtemp.varlidationtips"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="效验类型" prop="validationtype">
            <el-select v-model="addtemp.validationtype" clearable filterable>
              <el-option v-for="item in validationtypearr" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addtemp.validationtype=='0'" size="mini" label="项目" prop="itemcode">
            <el-select v-if="addtemp.validationtype=='0'" v-model="addtemp.itemcode" clearable filterable>
              <el-option v-for="item in itemarr" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" label="关系" prop="relation">
            <el-select v-model="addtemp.relation" clearable filterable>
              <el-option v-for="item in relationarr" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'关键字'" prop="keyword">
            <el-input v-model="addtemp.keyword"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'分组'" prop="group">
            <el-input v-model="addtemp.group"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'计算公式'" prop="expression">
            <el-input v-model="addtemp.expression"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="性别控制" prop="sex">
            <el-select v-model="addtemp.sex" clearable filterable>
              <el-option v-for="item in sexarr" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'年龄下限'" prop="agel">
            <el-input v-model.number="addtemp.agel"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'年龄上限'" prop="ageh">
            <el-input v-model.number="addtemp.ageh"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'排序'" prop="seqno">
            <el-input v-model.number="addtemp.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="adddialogFormVisible = false">取消</el-button>
          <el-button size="mini" :loading="saveLoading" type="primary" @click="createData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as dicdatavalidation from "@/api/dicdatavalidation";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/delRows.js";
import { tabHeader } from "@/utils/tool";
import { mapGetters } from "vuex";

export default {
  name: "dicdatavalidation",
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
      itemarr: [],
      addtemp: {
        valid: "",
        validationname: "",
        varlidationtips: "",
        validationtype: null,
        itemcode: "",
        relation: "",
        keyword: "",
        group: "",
        expression: "",
        sex: null,
        agel: null,
        ageh: null,
        seqno: 0,
      },
      dialogFormVisible: false,
      adddialogFormVisible: false,
      relationarr: [
        { key: "=", name: "等于" },
        { key: ">", name: "大于" },
        { key: ">=", name: "大于等于" },
        { key: "<", name: "小于" },
        { key: "<=", name: "小于等于" },
        { key: "LIKE", name: "包含" },
      ],
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      validationtypearr: [
        { key: 0, name: "项目" },
        { key: 1, name: "小结" },
        { key: 2, name: "建议" },
        { key: 3, name: "全部" },
      ],
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        validationname: [
          {
            required: true,
            message: "效验名称",
            trigger: "blur",
          },
        ],
        validationtype: [
          {
            required: true,
            message: "效验类型",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "性别控制",
            trigger: "blur",
          },
        ],
        varlidationtips: [
          {
            required: true,
            message: "效验提示",
            trigger: "blur",
          },
        ],
        keyword: [
          {
            required: true,
            message: "关键字",
            trigger: "blur",
          },
        ],
        relation: [
          {
            required: true,
            message: "关系",
            trigger: "blur",
          },
        ],
      },
      jobCallList: [],
      downloadLoading: false,
    };
  },
  created() {
    dicdatavalidation.detail().then((response) => {
      this.itemarr = response.result;
    });
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
      dicdatavalidation.getList(this.listQuery).then((response) => {
        console.log(response);
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
    addresetTemp() {
      this.addtemp = {
        valid: "",
        validationname: "",
        varlidationtips: "",
        validationtype: "",
        itemcode: "",
        relation: "",
        keyword: "",
        group: "",
        expression: "",
        sex: null,
        agel: null,
        ageh: null,
        seqno: 0,
      };
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
          dicdatavalidation.save(this.addtemp).then(() => {
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
      this.addtemp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.adddialogFormVisible = true;
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
          dicdatavalidation.update(tempData).then(() => {
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
      var _this = this;
      _this
        .$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          dicdatavalidation.del(rows.map((u) => u.valid)).then(() => {
            _this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
            _this.getList();
            if (callback != undefined) {
              callback();
            }
          });
        })
        .catch(() => {
          _this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
