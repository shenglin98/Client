<template>
  <div class="dicpubdictionary-wrap">
    <div class="dicpubdictionary-box">
      <div class="dicpubdictionary-container flex-row">
        <div style="border-right: 1px solid #ccc">
          <div class="buttons-box filter-container">
            <el-button :icon="`iconfont icon-${btn.icon}`" :type="btn.class" size="mini"
              v-for="btn of dicpubdictionaryBtns" v-bind:key="btn.Id" class="filter-item"
              @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
            <div @keyup.13="handleSearchdicpubdictionaryTypes">
              <!-- <el-input placeholder="请输入内容" v-model="typesListQuery.key" size="mini" style="margin-top: 10px; width: 130px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleSearchdicpubdictionaryTypes">搜索</el-button> -->
            </div>
          </div>
          <el-card shadow="never" class="body-small dicpubdictionary-menu-card">
            <el-tree :current-node-key="listQuery.TypeId" ref="pageTree" node-key="id" :highlight-current="true"
              @node-click="handleNodeClick" :data="dicpubdictionaryTypes" :default-checked-keys="defaultChecked"
              :expand-on-click-node="false" default-expand-all :props="dicpubdictionaryTypeProps">
              <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                <span><i class="el-icon-menu" style="margin-right: 10px"></i>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-card>
        </div>
        <el-main class="dicpubdictionary-content flex-item">
          <sticky :className="'sub-navbar'">
            <div class="filter-container" style="white-space: nowrap; overflow-x: auto">
              <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px" class="filter-item"
                :placeholder="'名称'" v-model="listQuery.key">
              </el-input>
              <el-button class="filter-item" size="mini" v-waves icon="el-icon-search"
                @click="handleFilter">搜索</el-button>
              <el-button :icon="`iconfont icon-${btn.icon}`" type="primary" plain size="mini" v-for="btn of typesBtns"
                v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
            </div>
          </sticky>
          <el-table height="calc(100vh - 149px)" ref="mainTable" :key="tableKey" :data="detaillist"
            v-loading="listLoading" fit highlight-current-row style="width: 100%" @row-click="rowClick"
            @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column width="85" prop="id" label="编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="link-type" @click="handleUpdate(scope.row)">{{
                  scope.row.name
                }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="dicname" label="字典类型" show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column prop="typecode" label="对照码" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="wbcode" label="五笔码" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" label="说明" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column prop="checkType" label="体检类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.checkType" placeholder="请选择">
                  <el-option label="常规" value="0"></el-option>
                  <el-option label="职业病" value="1"></el-option>
                </el-select>
              </template>
            </el-table-column> -->
            <el-table-column prop="seqno" label="排序" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-main>
      </div>
      <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog"
        width="400px" title="公共字典" @close="close" :visible.sync="addTypesDialog">
        <el-form ref="dicpubdictionaryTypeForm" :model="dicpubdictionaryTypesInfo" :rules="dicpubdictionaryRules"
          el="dicpubdictionary-tayps-form" label-width="80px">
          <el-form-item prop="id" label="编号">
            <el-input size="small" v-model="dicpubdictionaryTypesInfo.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="名称">
            <el-input size="small" v-model="dicpubdictionaryTypesInfo.name"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="说明">
            <el-input size="small" v-model="dicpubdictionaryTypesInfo.remark"></el-input>
          </el-form-item>
          <el-form-item prop="seqno" label="排序">
            <el-input size="small" v-model="dicpubdictionaryTypesInfo.seqno"
              oninput="value=value.replace(/[^\d]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="关联编码">
            <el-input size="small" v-model="dicpubdictionaryTypesInfo.unioncode"></el-input>
          </el-form-item>
          <el-form-item prop="typecode" label="对照码">
            <el-input size="small" v-model="dicpubdictionaryTypesInfo.typecode"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin-top: 10px">
          <el-button size="small" type="cancel" :loading="saveLoading" @click="addTypesDialog = false">取消</el-button>
          <el-button size="small" type="primary" :loading="saveLoading" @click="handleAdddicpubdictionary">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog v-el-drag-dialog class="dialog-mini" :close-on-click-modal="false" width="500px"
        :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="close">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <el-form-item prop="id" label="编号">
            <el-input size="small" v-model="temp.id" placeholder="系统自动生成" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="dicname" label="公共字典名称">
            <el-input size="small" v-model="parentdata.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="名称">
            <el-input size="small" v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="说明">
            <el-input size="small" v-model="temp.remark"></el-input>
          </el-form-item>
          <el-form-item prop="seqno" label="排序">
            <el-input size="small" v-model="temp.seqno" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="关联编码">
            <el-input size="small" v-model="temp.unioncode"></el-input>
          </el-form-item>
          <el-form-item label="对照码">
            <el-input size="small" v-model="temp.typecode"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus == 'create'" :loading="saveLoading" type="primary"
            @click="createData">确认</el-button>
          <el-button size="mini" v-else type="primary" :loading="saveLoading" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import extend from "@/extensions/dicdelRows.js";
import * as dicpubdictionary from "@/api/dictionary";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  name: "dicpubdictionary",
  components: { Sticky, Pagination },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      timeId: "",
      defaultChecked: [], // 默认选中数据
      tabPosition: "left",
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      saveLoading: false,
      listQuery: {
        // 查询条件
        key: undefined,
        id: undefined,
        tableName: "Dic_pub_dictionary",
      },
      detailItem: [],
      tablelist: [],
      detailsdata: null,
      temp: {
        id: "",
        name: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        diccode: "",
        unioncode: "",
        typecode: "",
      },
      sexarr: [
        { key: "0", name: "未知" },
        { key: "1", name: "男" },
        { key: "2", name: "女" },
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        appId: [
          { required: true, message: "必须选择一个应用", trigger: "change" },
        ],
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        hoscode: [
          { required: true, message: "机构编码不能为空", trigger: "blur" },
        ],
        deptcode: [
          { required: true, message: "科室编码不能为空", trigger: "blur" },
        ],
        typecode: [
          { required: true, message: "科室类型不能为空", trigger: "blur" },
        ],
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        typecode: [
          { required: true, message: "对照码不能为空", trigger: "blur" },
        ],
        diccode: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
        licensekey: [
          { required: true, message: "许可秘钥不能为空", trigger: "blur" },
        ],
        prefix: [
          { required: true, message: "号码前缀不能为空", trigger: "blur" },
        ],
        curno: [
          { required: true, message: "当前流水不能为空", trigger: "blur" },
        ],
        minno: [{ required: true, message: "最小号不能为空", trigger: "blur" }],
      },
      detaillist: [],
      parentdata: {},
      dicid: "",
      downloadLoading: false,
      headerList: [],
      searchdicpubdictionary: "", // 分类搜索
      addTypesDialog: false,
      updateTypesDialog: false,
      dicpubdictionaryTypes: [],
      searchdicpubdictionaryType: "",
      dicpubdictionaryTypesInfo: {
        id: "",
        name: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        unioncode: "",
        typecode: "",
      },
      dicpubdictionaryRules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        typecode: [
          { required: true, message: "对照码不能为空", trigger: "blur" },
        ],
      },
      updatedicpubdictionaryRules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        id: [{ required: true, message: "字典id不能为空", trigger: "blur" }],
        tableName: [
          { required: true, message: "表名不能为空", trigger: "blur" },
        ],
        typecode: [
          { required: true, message: "对照码不能为空", trigger: "blur" },
        ],
      },
      dicpubdictionaryTypeProps: {
        children: "children",
        label: "name",
      },
      typesListQuery: {
        key: "",
        type: 0,
      },
    };
  },
  filters: {
    statusFilter(disable) {
      const statusMap = {
        false: "color-success",
        true: "color-danger",
      };
      return statusMap[disable];
    },
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["modulesTree", "iframeViews", "visitedViews"]),

    dicpubdictionaryBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements
          .filter(
            (item) =>
              item.domId === "btnDeldicpubdictionary" ||
              item.domId === "btnAdddicpubdictionary" ||
              item.domId === "btnUpdatedicpubdictionary"
          )
          .sort((a, b) => {
            return a.sort - b.sort;
          });
      return elements || [];
    },
    typesBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements
          .filter(
            (item) =>
              item.domId !== "btnDeldicpubdictionary" &&
              item.domId !== "btnAdddicpubdictionary" &&
              item.domId !== "btnUpdatedicpubdictionary"
          )
          .sort((a, b) => {
            return a.sort - b.sort;
          });
      return elements || [];
    },
    isShowOperation() {
      const route = this.$route;
      const elements = route.meta.elements || [];
      let flag = false;
      elements.forEach((item) => {
        if (item.domId === "btnEdit") {
          flag = true;
        }
      });
      return flag;
    },
  },
  created() {
    // this.loaddicpubdictionaryTypes();
  },
  mounted() {
    this.loaddicpubdictionaryTypes();
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      if (this.dicpubdictionaryTypes.length == 0) return;
      this.defaultChecked.push(this.dicpubdictionaryTypes[0].id);
      let code = this.dicpubdictionaryTypes[0].id;
      this.$refs[`treeItem_${code}`].click();
    }, 400);
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
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
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
        case "btnAdddicpubdictionary":
          this.addTypesDialog = true;
          this.resetdicpubdictionaryTypesInfoTemp();
          break;
        case "btnUpdatedicpubdictionary":
          if (
            this.dicpubdictionaryTypesInfo.id != undefined &&
            this.dicpubdictionaryTypesInfo.id != null &&
            this.dicpubdictionaryTypesInfo.id != ""
          ) {
            this.addTypesDialog = true;
          } else {
            this.$message({
              showClose: true,
              message: "请选择要编辑的公共字典",
              type: "error",
            });
          }
          break;
        case "btnRefresh":
          this.loaddicpubdictionaryTypes();
          break;
        case "btnDeldicpubdictionary":
          this.handleDeletedicpubdictionary();
          break;
        default:
          break;
      }
    },
    handleFilter() {
      this.loaddicpubdictionaryTypes();
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        diccode: "",
        unioncode: "",
        typecode: "",
      };
    },
    resetdicpubdictionaryTypesInfoTemp() {
      this.dicpubdictionaryTypesInfo = {
        id: "",
        name: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        unioncode: "",
        typecode: "",
      };
    },
    handleCreate() {
      // 弹出添加框
      this.dialogStatus = "create";

      if (
        this.parentdata.id == undefined ||
        this.parentdata.id == null ||
        this.parentdata.id == ""
      ) {
        this.$message({
          showClose: true,
          message: "请选择公共字典",
          type: "error",
        });
      } else {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      }
      // console.log(this.listQuery);
      // console.log(this.temp.tableName);
      // dicpubdictionary.detailsLoad(this.listQuery).then((res) => {
      //   this.detailsdata = res.data;
      //   console.log(this.detailsdata);
      // });
    },
    //关闭弹框的事件
    close() {
      this.resetTemp(); // 关闭窗口清空对应值
      this.resetdicpubdictionaryTypesInfoTemp();
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return;
          this.saveLoading = true;
          this.temp.tableName = "Dic_pub_dictionary_detail";
          this.temp.diccode = this.parentdata.id;
          console.log(this.temp);
          dicpubdictionary.add(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.listQuery.tableName = "Dic_pub_dictionary";
            dicpubdictionary.getList(this.listQuery).then((response) => {
              this.dicpubdictionaryTypes = response.data;
              this.dicpubdictionaryTypes.forEach((d) => {
                if (d.id == this.parentdata.id) {
                // if (d.id == this.parentdata.id && d.id != '10003') {
                  this.detaillist = d.detailItems;
                }
              });

            });
            this.resetTemp();
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
      // 弹出编辑框
      if (
        this.parentdata.id == undefined ||
        this.parentdata.id == null ||
        this.parentdata.id == ""
      ) {
        this.$message({
          showClose: true,
          message: "请选择公共字典",
          type: "error",
        });
      } else {
        this.temp = row;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      }
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return;
          this.saveLoading = true;
          this.temp.tableName = "Dic_pub_dictionary_detail";
          dicpubdictionary.update(this.temp).then(() => {
            this.resetTemp();
            this.dialogFormVisible = false;
            this.listQuery.tableName = "Dic_pub_dictionary";
            dicpubdictionary.getList(this.listQuery).then((response) => {
              this.dicpubdictionaryTypes = response.data;
              this.dicpubdictionaryTypes.forEach((d) => {
                if (d.id == this.parentdata.id) {
                  this.detaillist = d.detailItems;
                }
              });
            });
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
            });
            this.saveLoading = false;
          });
        }
      });
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
    handleDelete(rows) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (
            this.parentdata.id == undefined ||
            this.parentdata.id == null ||
            this.parentdata.id == ""
          ) {
            this.$message({
              showClose: true,
              message: "请选择公共字典",
              type: "error",
            });
          } else {
            // 多行删除
            var data = {
              id: rows.map((u) => u.id),
              TableName: "Dic_pub_dictionary_detail",
            };
            dicpubdictionary.del(data).then(() => {
              this.listQuery.tableName = "Dic_pub_dictionary";
              dicpubdictionary.getList(this.listQuery).then((response) => {
                this.dicpubdictionaryTypes = response.data;
                this.dicpubdictionaryTypes.forEach((d) => {
                  if (d.id == this.parentdata.id) {
                    this.detaillist = d.detailItems;
                  }
                });
              });
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
              });
            });
          }
        })
        .catch(() => {
          _this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 添加分类
    handleAdddicpubdictionary() {
      this.$refs["dicpubdictionaryTypeForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          if (
            this.dicpubdictionaryTypesInfo.id == undefined ||
            this.dicpubdictionaryTypesInfo.id == null ||
            this.dicpubdictionaryTypesInfo.id == ""
          ) {
            this.dicpubdictionaryTypesInfo.tableName = "Dic_pub_dictionary";
            console.log(this.dicpubdictionaryTypesInfo);
            dicpubdictionary
              .add(this.dicpubdictionaryTypesInfo)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                });
                this.addTypesDialog = false;
                this.resetdicpubdictionaryTypesInfoTemp();
                this.loaddicpubdictionaryTypes();
                this.$nextTick(() => {
                  this.$refs["dicpubdictionaryTypeForm"].clearValidate();
                });
                this.saveLoading = false;
              })
              .catch((err) => {
                this.saveLoading = false;
              });
          } else {
            this.dicpubdictionaryTypesInfo.tableName = "Dic_pub_dictionary";
            dicpubdictionary
              .update(this.dicpubdictionaryTypesInfo)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                });
                this.addTypesDialog = false;
                this.resetdicpubdictionaryTypesInfoTemp();
                this.loaddicpubdictionaryTypes();
                this.$nextTick(() => {
                  this.$refs["dicpubdictionaryTypeForm"].clearValidate();
                });
                this.saveLoading = false;
              })
              .catch((err) => {
                this.saveLoading = false;
              });
          }
        }
      });
    },
    handleupdatedicpubdictionary() {
      this.$refs["updicpubdictionaryTypeForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          dicpubdictionary
            .updateType(this.updicpubdictionaryTypesInfo)
            .then(() => {
              this.$notify({
                title: "修改",
                message: "修改成功",
                type: "success",
              });
              this.saveLoading = false;
              this.updateTypesDialog = false;
              this.dicpubdictionaryTypes.push(this.updicpubdictionaryTypesInfo);
              this.loaddicpubdictionaryTypes();
            });
        }
      });
    },
    // 删除分类
    handleDeletedicpubdictionary() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (
            this.dicpubdictionaryTypesInfo.id == undefined ||
            this.dicpubdictionaryTypesInfo.id == null ||
            this.dicpubdictionaryTypesInfo.id == ""
          ) {
            this.$message({
              showClose: true,
              message: "请选择需要删除的公共字典",
              type: "error",
            });
            return;
          } else {
            var data = {
              id: [this.dicpubdictionaryTypesInfo.id],
              TableName: "Dic_pub_dictionary",
            };
            dicpubdictionary.del(data).then(() => {
              this.resetdicpubdictionaryTypesInfoTemp();
              this.loaddicpubdictionaryTypes();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
              });
            });
          }
        })
        .catch(() => {
          _this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 搜索分类
    handleSearchdicpubdictionaryTypes() {
      this.loaddicpubdictionaryTypes();
    },
    // 获取分类列表
    loaddicpubdictionaryTypes() {
      this.listLoading = true;
      dicpubdictionary.getList(this.listQuery).then((response) => {
        console.log(response);
        this.dicpubdictionaryTypes = response.data;
        this.detaillist = this.dicpubdictionaryTypes[0].detailItems;
      });
      this.listLoading = false;
    },
    handleNodeClick(val) {
      console.log(val);
      this.parentdata = val;
      this.detaillist = val.detailItems;
      this.dicpubdictionaryTypesInfo = val;
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.dialog-mini .el-select {
  width: 100%;
}

.dicpubdictionary-wrap {
  width: 100%;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 10px;

  .dicpubdictionary-menu-card {
    border: 0 none;
    height: calc(100% - 86px);
    overflow: auto;

    .el-card__body {
      height: auto;
    }
  }
}

.dicpubdictionary-box {
  height: 100%;
  background: #fff;
  box-sizing: border-box;

  .dicpubdictionary-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    .dicpubdictionary-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px !important;
    }
  }

  .buttons-box {
    padding: 22px 10px;
    background: #f5f5f5;
  }

  .dicpubdictionary-content {
    height: 100%;
    padding: 0;

    .buttons-box {
      text-align: right;
    }
  }
}
</style>
