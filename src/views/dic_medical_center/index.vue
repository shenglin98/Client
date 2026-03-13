<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px;" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
        </el-input>
        <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <permission-btn moduleName="dic_medical_center" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container ">
      <div class="bg-white">
        <el-table ref="mainTable" :key="tableKey" :header-cell-style="tabHeader" :data="list.data" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column align="left" prop="id" label="区域编码" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="name" label="区域名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{
                scope.row.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="hospitalcode" label="注册机构" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="address" label="机构地点" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="remark" label="说明" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="pycode" label="拼音码" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="wbcode" label="五笔码" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="seqno" label="排序" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>

      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px">
          <el-form-item size="small" :label="'科室名称'" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'注册机构'" prop="hospitalcode">
            <el-select v-model="temp.hospitalcode">
              <el-option v-for="(item, index) in list.sys_reg_hospital" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'机构地点'" prop="address">
            <el-input v-model="temp.address"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'说明'" prop="remark">
            <el-input v-model="temp.remark"></el-input>
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
          <el-form-item size="small" :label="'科室名称'" prop="name">
            <el-input v-model="addtemp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'注册机构'" prop="hospitalcode">
            <el-select v-model="addtemp.hospitalcode">
              <el-option v-for="(item, index) in list.sys_reg_hospital" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'机构地点'" prop="address">
            <el-input v-model="addtemp.address"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'说明'" prop="remark">
            <el-input v-model="addtemp.remark"></el-input>
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
import * as dic_medical_center from "@/api/dic_medical_center";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/companydelRows.js";
import { tabHeader } from "@/utils/tool";
export default {
  name: "dic_medical_center",
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
        TableName: "Dic_Medical_center",
      },
      addtemp: {
        id: "",
        name: "",
        licensekey: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Dic_Medical_center",
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
      dic_medical_center.getList(this.listQuery).then((response) => {
        this.list = response.data;
        console.log(this.list);
        this.list.data.forEach((d) => {
          this.list.sys_reg_hospital.forEach((b) => {
            if (d.hospitalcode == b.id) {
              d.hospitalcode = b.name;
            }
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
        TableName: "Dic_Medical_center",
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
        TableName: "Dic_Medical_center",
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
          dic_medical_center.add(this.addtemp).then(() => {
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
      this.list.sys_reg_hospital.forEach((d) => {
        if (d.name == this.temp.hospitalcode) {
          this.temp.hospitalcode = d.id;
        }
      });
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
          dic_medical_center.update(tempData).then(() => {
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
      this.delrows(dic_medical_center, rows);
    },
  },
};
</script>
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
