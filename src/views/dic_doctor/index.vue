<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>
        <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <permission-btn moduleName="dic_doctor" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container ">
      <div class="bg-white">
        <el-table ref="mainTable" :key="tableKey" :header-cell-style="tabHeader" :data="list.data" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column align="center" prop="name" label="医生名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{
                scope.row.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sex" label="性别" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="hiscode" label="工号" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="deptcode" label="科室编码" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="pycode" label="拼音码" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="wbcode" label="五笔码" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="seqno" label="排序" show-overflow-tooltip></el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>

      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px">
          <el-form-item size="small" :label="'医生名称'" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'性别'" prop="sex">
            <el-select v-model="temp.sex">
              <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'工号'" prop="hiscode">
            <el-input v-model="temp.hiscode"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'所属科室'" prop="deptcode">
            <el-select v-model="temp.deptcode">
              <el-option v-for="(item, index) in list.dic_department" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'排序'" prop="seqno">
            <el-input v-model="temp.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="adddialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="addtemp" label-position="right" label-width="130px">
          <el-form-item size="small" :label="'医生名称'" prop="name">
            <el-input v-model="addtemp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'性别'" prop="sex">
            <el-select v-model="addtemp.sex">
              <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'工号'" prop="hiscode">
            <el-input v-model="addtemp.hiscode"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'所属科室'" prop="deptcode">
            <el-select v-model="addtemp.deptcode">
              <el-option v-for="(item, index) in list.dic_department" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'排序'" prop="seqno">
            <el-input v-model="addtemp.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="adddialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as dic_doctor from "@/api/dic_doctor";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/companydelRows.js";
import { tabHeader } from "@/utils/tool";
export default {
  name: "dic_doctor",
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
  data() {
    return {
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
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "dic_doctor",
      },
      addtemp: {
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "dic_doctor",
      },
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
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
            message: "医生名称",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "性别",
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
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      dic_doctor.getList(this.listQuery).then((response) => {
        this.list = response.data;
        console.log(this.list);
        this.list.data.forEach((d) => {
          this.list.dic_department.forEach((b) => {
            if (d.deptcode == b.id) {
              d.deptcode = b.name;
            }
          });
          this.list.data.forEach((d) => {
            d.sex =
              d.sex == 1 ? "男" : d.sex == 2 ? "女" : d.sex == 0 ? "未知" : "";
          });
        });
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
        TableName: "dic_doctor",
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
        TableName: "dic_doctor",
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
          dic_doctor.add(this.addtemp).then(() => {
            this.adddialogFormVisible = false;
            this.getList();
            this.addresetTemp();
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
      console.log(row);
      this.temp = Object.assign({}, row); // copy obj
      this.list.dic_department.forEach((d) => {
        if (d.name == this.temp.deptcode) {
          this.temp.deptcode = d.id;
        }
      });
      this.temp.sex =
        this.temp.sex == "男"
          ? 1
          : this.temp.sex == "女"
          ? 2
          : this.temp.sex == "未知"
          ? 0
          : "";
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
          dic_doctor.update(tempData).then(() => {
            for (const v of this.list.data) {
              if (v.id === this.temp.id) {
                const index = this.list.data.indexOf(v);
                this.list.data.splice(index, 1, this.temp);
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
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行删除
      this.delrows(dic_doctor, rows);
    },
  },
};
</script>
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
