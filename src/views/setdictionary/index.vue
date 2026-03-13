<template>
  <div class="setdictionary-wrap">
    <div class="setdictionary-box" v-if="!testShow">
      <div class="setdictionary-container flex-row">
        <div style="border-right: 1px solid #ccc">
          <div class="buttons-box filter-container" style="height: 42px">
            <el-button :icon="`iconfont icon-${btn.icon}`" :type="btn.class" size="mini" v-for="btn of setdictionaryBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
          </div>
          <el-card shadow="never" class="body-small setdictionary-menu-card">
            <el-tree :current-node-key="listQuery.TypeId" node-key="id" :highlight-current="true" @node-click="handleNodeClick" :data="setdictionaryTypes" :default-checked-keys="defaultChecked" :expand-on-click-node="false" default-expand-all :props="setdictionaryTypeProps">
              <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                <span><i class="el-icon-menu" style="margin-right: 10px"></i>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-card>
        </div>
        <el-main class="setdictionary-content flex-item">
          <sticky :className="'sub-navbar'">
            <div class="filter-container" style="white-space: nowrap; overflow-x: auto">
              <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
              </el-input>
              <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
              <el-button v-if="listQuery.tableName == 'Dic_setmeal'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleSameSetmealPrice">同步价格</el-button>
              <el-button :icon="`iconfont icon-${btn.icon}`" v-if="listQuery.tableName == 'Dic_setmeal'" type="primary" plain size="mini" v-for="btn of typesBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
              <el-button :loading="saveLoading" size="mini" v-if="listQuery.tableName == 'Dic_mec_setmeal'" type="success" @click="btnsave">保存</el-button>
              <el-button :icon="`iconfont icon-${btn.icon}`" v-if="listQuery.tableName == 'Dic_person_setmeal'" type="primary" plain size="mini" v-for="btn of typesBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
            </div>
          </sticky>
          <template v-if="listQuery.tableName == 'Dic_setmeal'">
            <div class="dic_setmeal_box" style="height: calc(100% - 52px);">
              <vxe-table class="people_table" ref="peopleTable" height="100%" border="inner" :key="tableKey" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="tablelist" v-loading="listLoading" :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll">
                <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
                <vxe-table-column field="code" title="套餐编码" min-width="105"></vxe-table-column>
                <vxe-table-column field="name" title="套餐名称" width="300">
                  <template slot-scope="scope">
                    <el-link :type="scope.row.status == 0 ? 'primary' : 'danger'" class="name_box" @click="handleUpdate(scope.row)">
                      {{ scope.row.name }}
                    </el-link>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="price" title="套餐价格" min-width="105"></vxe-table-column>
                <vxe-table-column field="companyprice" min-width="105" title="单位价格"></vxe-table-column>
                <vxe-table-column field="remark" min-width="105" title="说明"></vxe-table-column>
                <vxe-table-column field="sex" min-width="105" title="性别">
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.sex == 0
                          ? "未知"
                          : scope.row.sex == 1
                          ? "男"
                          : scope.row.sex == 2
                          ? "女"
                          : ""
                      }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="remark" min-width="105" title="说明"></vxe-table-column>
                <vxe-table-column field="status" min-width="105" title="微信标志">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.wechatflag == 0 ? "不启用" : "启用" }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="status" min-width="105" title="启用状态">
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.status == 0
                          ? "启用"
                          : scope.row.status == 1
                          ? "停用"
                          : scope.row.status == 2
                          ? "女"
                          : ""
                      }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="setname" min-width="105" title="套餐类型"></vxe-table-column>
                <vxe-table-column prop="checkType" min-width="105" label="体检类型">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.checkType == "0"
                        ? "通用"
                        : scope.row.checkType == "1"
                        ? "常规"
                        : "职业病"
                    }}</span>
                  </template>
                </vxe-table-column>
                <!-- <vxe-table-column label="拼音码" min-width="105" width="150px" prop="pycode">
                </vxe-table-column>
                <vxe-table-column label="五笔码" min-width="105" width="150px" prop="wbcode">
                </vxe-table-column> -->
                <vxe-table-column label="排序" min-width="105" prop="seqno"> </vxe-table-column>
              </vxe-table>
              <!-- <el-table
                height="calc(100% - 52px)"
                ref="mainTable"
                :key="tableKey"
                :data="tablelist"
                v-loading="listLoading"
                fit
                highlight-current-row
                style="width: 100%"
                @row-click="rowClick"
                @selection-change="handleSelectionChange"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              >
                <el-table-column
                  type="selection"
                  align="center"
                  width="55"
                ></el-table-column>
                <el-table-column label="套餐编码" prop="code"> </el-table-column>
                <el-table-column label="套餐名称" width="200px" prop="name">
                  <template slot-scope="scope">
                    <el-link
                      :type="scope.row.status == 0 ? 'primary' : 'danger'"
                      class="name_box"
                      @click="handleUpdate(scope.row)"
                    >
                      {{ scope.row.name }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="套餐价格" prop="price"> </el-table-column>
                <el-table-column label="单位价格" prop="companyprice">
                </el-table-column>
                <el-table-column label="性别" prop="sex">
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.sex == 0
                          ? "未知"
                          : scope.row.sex == 1
                          ? "男"
                          : scope.row.sex == 2
                          ? "女"
                          : ""
                      }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="说明" prop="remark"> </el-table-column>
                <el-table-column label="微信标志" prop="status">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.wechatflag == 0 ? "不启用" : "启用" }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="启用状态" prop="status">
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.status == 0
                          ? "启用"
                          : scope.row.status == 1
                          ? "停用"
                          : scope.row.status == 2
                          ? "女"
                          : ""
                      }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="套餐类型" width="150px" prop="setname">
                </el-table-column>
                <el-table-column prop="checkType" label="体检类型" width="150px">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.checkType == "0"
                        ? "通用"
                        : scope.row.checkType == "1"
                        ? "常规"
                        : "职业病"
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="拼音码" width="150px" prop="pycode">
                </el-table-column>
                <el-table-column label="五笔码" width="150px" prop="wbcode">
                </el-table-column>
                <el-table-column label="排序" prop="seqno"> </el-table-column>
              </el-table> -->
            </div>
          </template>
          <template v-if="listQuery.tableName == 'Dic_mec_setmeal'">
            <el-row :gutter="4" class="fh">
              <el-col :span="6" class="fh ls-border">
                <el-card shadow="never" class="body-small fh" style="overflow: auto">
                  <el-tree :data="orgsTree" :highlight-current="true" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="treehandleNodeClick"></el-tree>
                </el-card>
              </el-col>
              <el-col :span="18" class="fh">
                <el-row>
                  <el-col :span="12">
                    <div class="bg-white fh">
                      <el-table height="815px" ref="settable" :key="tableKey" :data="settablelist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="settablehandleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                        <el-table-column type="selection" align="center" v-if="
                            parentid == null ||
                            parentid == '' ||
                            parentid == undefined
                              ? ''
                              : (disabled = 'true')
                          " width="55"></el-table-column>
                        <el-table-column label="套餐编码" width="110px" prop="code">
                        </el-table-column>
                        <el-table-column label="套餐名称" prop="name">
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="bg-white fh">
                      <el-table height="815px" ref="chilsetTable" :key="tableKey" :data="setdatalist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="chilsethandleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                        <el-table-column type="selection" align="center" style="" width="55"></el-table-column>
                        <el-table-column label="套餐编码" width="110px" prop="code">
                        </el-table-column>
                        <el-table-column label="套餐名称" prop="name">
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <template v-if="listQuery.tableName == 'Dic_person_setmeal'">
            <el-table height="calc(100% - 52px)" ref="mainTable" :key="tableKey" :data="personalcombolist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
              <el-table-column type="selection" align="center" width="55"></el-table-column>
              <el-table-column label="套餐编码" prop="code"> </el-table-column>
              <el-table-column label="套餐名称" prop="name" width="200px">
              </el-table-column>
              <el-table-column label="套餐价格" prop="price"> </el-table-column>
              <el-table-column label="单位价格" prop="companyprice"></el-table-column>
              <el-table-column label="性别" prop="sex">
                <template slot-scope="scope">
                  <span>
                    {{
                      scope.row.sex == 0
                        ? "未知"
                        : scope.row.sex == 1
                        ? "男"
                        : scope.row.sex == 2
                        ? "女"
                        : ""
                    }}</span>
                </template>
              </el-table-column>
              <el-table-column label="启用状态" prop="status">
                <template slot-scope="scope">
                  <span>
                    {{
                      scope.row.status == 0
                        ? "启用"
                        : scope.row.status == 1
                        ? "停用"
                        : scope.row.status == 2
                        ? "女"
                        : ""
                    }}</span>
                </template>
              </el-table-column>
              <el-table-column label="拼音码" prop="pycode" width="150px"></el-table-column>
              <el-table-column label="五笔码" prop="wbcode" width="150px"></el-table-column>
              <el-table-column label="排序" prop="seqno"> </el-table-column>
            </el-table>
          </template>
        </el-main>
      </div>
    </div>
    <AddDicPersonSetmeal v-else @close="handleClose" :code="comboDetails" />
  </div>
</template>

<script>
import * as login from "@/api/login";
import Layout from "@/views/layout/Layout";
import { listToTreeSelect } from "@/utils";
import { mapActions, mapGetters } from "vuex";
import extend from "@/extensions/dicdelitemsRows.js";
import dicsetmealextend from "@/extensions/dicsetmealdelitemsRows.js";
import * as setdictionary from "@/api/setdictionary";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";

import {
  getComboList,
  getComboDetails,
  deleteCombo,
} from "@/api/setdictionary";
import AddDicPersonSetmeal from "./components/addDicPersonSetmeal.vue";
import IncomeVue from "../makepolicy/components/Income.vue";
export default {
  name: "setdictionary",
  components: { Sticky, Pagination, AddDicPersonSetmeal },
  mixins: [extend, dicsetmealextend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      defaultChecked: [], // 默认选中数据
      timeId: "", // 默认选中数据
      personalcombolist: [],
      comboDetails: "",
      // filpersonalcombolist:[],
      testShow: false,
      value: [],
      tabPosition: "left",
      saveLoading: false,
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        // 查询条件
        key: undefined,
        id: undefined,
        tableName: undefined,
      },
      tablelist: [],
      detailsdata: null,
      defaultProps: {
        // tree配置项
        children: "children",
        label: "label",
      },
      settablelist: [],
      temp: {
        id: "",
        name: "",
        hospitalcode: "",
        address: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        hiscode: "",
        typecode: "",
        interfacecode: "",
        meccode: "",
        location: "",
        seq: 0,
        sex: "",
        deptcode: "",
        diccode: "",
      },
      setdatalist: [],
      datalist: [],
      settemp: {
        code: "",
        meccode: "",
      },
      meccode: "",
      orgsTree: [], // 用户可访问到的所有机构组成的树
      orgs: [], // 用户可访问到的组织列表
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      resulttypearr: [
        { key: 0, name: "任意" },
        { key: 1, name: "数字" },
      ],
      contrastflagarr: [
        { key: 0, name: "不需要" },
        { key: 1, name: "需要" },
      ],
      statusarr: [
        { key: 0, name: "启用" },
        { key: 1, name: "停用" },
      ],
      dicitemdialogFormVisible: false,
      diccombinedialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      infiledList: [],
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
      downloadLoading: false,
      headerList: [],
      searchsetdictionary: "", // 分类搜索
      addTypesDialog: false,
      updateTypesDialog: false,
      setdictionaryTypes: [],
      searchsetdictionaryType: "",
      parentid: "",
      setdictionaryTypesInfo: {
        id: "",
        name: "",
        tableName: "",
        Seqno: "",
        type: 2,
      },
      upsetdictionaryTypesInfo: {},
      setdictionaryRules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        id: [{ required: true, message: "字典id不能为空", trigger: "blur" }],
        tablename: [
          { required: true, message: "表名不能为空", trigger: "blur" },
        ],
      },
      updatesetdictionaryRules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        id: [{ required: true, message: "字典id不能为空", trigger: "blur" }],
        tableName: [
          { required: true, message: "表名不能为空", trigger: "blur" },
        ],
      },
      setdictionaryTypeProps: {
        children: "children",
        label: "name",
      },
      typesListQuery: {
        key: "",
        type: 2,
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
    setdictionaryBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements
          .filter(
            (item) =>
              item.domId === "btnDelsetdictionary" ||
              item.domId === "btnAddsetdictionary"
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
              item.domId !== "btnDelsetdictionary" &&
              item.domId !== "btnAddsetdictionary"
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
    var addRouter = [
      {
        path: "/setdictionary",
        component: Layout,
        redirect: "noredirect",
        name: "setdictionary",
        meta: {
          title: "套餐字典",
        },
        children: [
          {
            path: "setdictionaryadd",
            component: () => import("@/views/setdictionary/setdictionaryadd"),
            name: "setdictionaryAdd",
            meta: {
              notauth: true,
              title: "添加套餐",
              noCache: true,
              icon: "star",
            },
          },
          {
            path: "setdictionaryedit/:id",
            component: () => import("@/views/setdictionary/setdictionaryedit"),
            name: "setdictionaryEdit",
            hidden: true,
            meta: {
              notauth: true,
              title: "编辑套餐",
              noCache: true,
              icon: "list",
            },
          },
        ],
      },
    ];
    this.$router.addRoutes(addRouter);
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      // beforeRouteENnter不能通过this访问组件实例，但是可以通过 vm 访问组件实例
      vm.getList();
    });
  },
  mounted() {
    this.loadsetdictionaryTypes();
  },
  methods: {
    // 同步价格回调
    handleSameSetmealPrice() {
      setdictionary.SameSetmealPrice().then((res) => {
        this.$message.success(res.message || res.msg);
        this.loadsetdictionaryTypes();
      });
    },
    // 勾选人员回调
    handleSelectPeople({ records }) {
      this.multipleSelection = records;
      if (records.length == 1) {
        this.comboDetails = records[0].code;
      } else if (records.length !== 1) {
        this.comboDetails = "";
      }
    },
    // 勾选人员回调-全选
    handleSelectPeopleAll({ records }) {
      this.multipleSelection = records;
      if (records.length == 1) {
        this.comboDetails = records[0].code;
      } else if (records.length !== 1) {
        this.comboDetails = "";
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
    // 获取个人套餐组合列表
    handleGetComboList() {
      let a = {
        page: 1,
        limit: 100000,
        key: this.listQuery.key,
      };
      getComboList(a).then((res) => {
        this.personalcombolist = res.data;
        console.log(this.personalcombolist);
        this.comboDetails = "";
      });
    },
    // 个人套餐组合删除
    handleDeleteCombo() {
      let codeItems = this.multipleSelection.map((i) => {
        return i.code;
      });
      deleteCombo(codeItems).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handleGetComboList();
          // this.$message({
          //   showClose: true,
          //   message: "删除成功",
          //   type: "success",
          // });
        }
      });
    },
    // 关闭添加、修改个人套餐组合页面
    handleClose(control) {
      this.testShow = control;
      this.handleGetComboList();
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length == 1) {
        this.comboDetails = val[0].code;
      } else if (val.length !== 1) {
        this.comboDetails = "";
      }
    },
    settablehandleSelectionChange(val) {
      // this.setdatalist = val;
      val.forEach((d) => {
        this.settablelist.forEach((b) => {
          if (b.code == d.code) {
            this.settablelist.splice(this.settablelist.indexOf(b), 1);
            this.setdatalist.push(b);
          }
        });
      });
    },
    chilsethandleSelectionChange(val) {
      val.forEach((d) => {
        this.setdatalist.forEach((b) => {
          if (b.code == d.code) {
            this.settablelist.push(b);
            this.setdatalist.splice(this.setdatalist.indexOf(b), 1);
          }
        });
      });
    },
    onBtnClicked: function (domId) {
      switch (domId) {
        // 添加
        case "btnAdd":
          // this.handleCreate();
          if (this.listQuery.tableName == "Dic_setmeal") {
            this.$router.push("/setdictionary/setdictionaryadd");
          }
          if (this.listQuery.tableName == "Dic_combine") {
            this.$router.push("/setdictionary/combineadd");
          }
          if (this.listQuery.tableName == "Dic_person_setmeal") {
            this.testShow = true;
            console.log(domId, "Dic_person_setmeal");
          }
          break;
        // 编辑
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          if (this.comboDetails !== "") {
            this.handleUpdate(this.multipleSelection[0]);
            if (this.listQuery.tableName == "Dic_person_setmeal") {
              console.log("Dic_person_setmeal编辑");
              this.testShow = true;
            }
          } else {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }

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
          // 删除
          this.handleDeleteCombo();
          console.log("Dic_person_setmeal删除");
          this.handleDelete(this.multipleSelection);
          break;
        case "btnAddsetdictionary":
          this.addTypesDialog = true;
          break;
        case "btnRefresh":
          this.getList();
          this.handleGetComboList();
          break;
        case "btnDelsetdictionary":
          this.handleDeletesetdictionary();
          break;
        case "btnChilAdd":
          this.handleDeletesetdictionary();
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
      setdictionary.getList(this.listQuery).then((response) => {
        this.tablelist = response.data;
        this.settablelist = this.tablelist;
        this.total = response.count;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();

      // Dic_person_setmeal个人套餐页搜索
      if (this.listQuery.tableName == "Dic_person_setmeal") {
        this.handleGetComboList();
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
        id: "",
        name: "",
        hospitalcode: "",
        address: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        hiscode: "",
        typecode: "",
        interfacecode: "",
        meccode: "",
        location: "",
        seq: 0,
        sex: "",
        deptcode: "",
        diccode: "",
      };
    },
    resetsetdictionaryTypesInfoTemp() {
      this.setdictionaryTypesInfo = {
        id: "",
        name: "",
        tableName: "",
        Seqno: "",
        type: 2,
      };
    },
    handleCreate() {
      // 弹出添加框
      this.dialogStatus = "create";

      if (this.temp.tableName == "Dic_item") {
        this.dicitemdialogFormVisible = true;
        // setdictionary.detail().then(() => {
        //   this.dicitemdialogFormVisible = true;
        // });
        // this.$nextTick(() => {
        //   this.$refs["dicitemdataForm"].clearValidate();
        // });
      }
      if (this.temp.tableName == "Dic_combine") {
        this.diccombinedialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["diccombinedataForm"].clearValidate();
        });
      }
    },
    //关闭弹框的事件
    close() {
      this.resetTemp();
    },
    createData() {
      // 保存提交

      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // setdictionary.add(this.temp).then(() => {
          //   this.dicitemdialogFormVisible = false;
          //   this.listQuery.tableName = this.temp.tableName;
          //   this.getList();
          //   this.resetTemp();
          //   this.$notify({
          //     title: "成功",
          //     message: "创建成功",
          //     type: "success",
          //     duration: 2000,
          //   });
          // });
        }
      });
    },
    handleUpdate(row) {
      if (this.listQuery.tableName == "Dic_setmeal") {
        this.$router.push({
          path: "/setdictionary/setdictionaryedit/" + row.code,
        });
      }
      // if (this.listQuery.tableName == "Dic_combine") {
      //   this.$router.push({
      //     path: "/setdictionary/combineedit/" + row.code,
      //   });
      // }
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // setdictionary.update(tempData).then(() => {
          //   this.getList();
          //   this.resetTemp();
          //   this.dicitemdialogFormVisible = false;
          //   this.$notify({
          //     title: "成功",
          //     message: "更新成功",
          //     type: "success",
          //     duration: 2000,
          //   });
          // });
        }
      });
    },
    handleDelete(rows) {
      if (this.listQuery.tableName == "Dic_setmeal") {
        // 多行删除
        this.dicsetmealdelrows(setdictionary, rows);
      }
      if (this.listQuery.tableName == "Dic_combine") {
        // 多行删除
        this.diccombinedelrows(setdictionary, rows);
      }
      // // 多行删除
      // this.delrows(setdictionary, rows, this.listQuery.tableName);
    },
    // 添加分类
    handleAddsetdictionary() {
      this.$refs["setdictionaryTypeForm"].validate((valid) => {
        if (valid) {
          // setdictionary.addType(this.setdictionaryTypesInfo).then(() => {
          //   this.$notify({
          //     title: "成功",
          //     message: "添加成功",
          //     type: "success",
          //     duration: 2000,
          //   });
          //   this.addTypesDialog = false;
          //   this.setdictionaryTypes.push(this.setdictionaryTypesInfo);
          //   this.setdictionaryTypesInfo = {};
          //   this.loadsetdictionaryTypes();
          // });
        }
      });
    },

    handleupdatesetdictionary() {
      this.$refs["upsetdictionaryTypeForm"].validate((valid) => {
        if (valid) {
          // setdictionary.updateType(this.upsetdictionaryTypesInfo).then(() => {
          //   this.$notify({
          //     title: "修改",
          //     message: "修改成功",
          //     type: "success",
          //     duration: 2000,
          //   });
          //   this.updateTypesDialog = false;
          //   this.setdictionaryTypes.push(this.upsetdictionaryTypesInfo);
          // });
          this.loadsetdictionaryTypes();
        }
      });
    },
    // 删除分类
    handleDeletesetdictionary() {
      if (!this.typesListQuery.TypeId) {
        this.$message({
          showClose: true,
          message: "请选择需要删除的分类",
          type: "error",
        });
        return;
      }
      const ids = [this.typesListQuery.TypeId];
      var data = {
        ids: ids,
        tableName: this.typesListQuery.tableName,
      };

      // setdictionary.delType(data).then(() => {
      //   this.$notify({
      //     title: "成功",
      //     message: "删除成功",
      //     type: "success",
      //     duration: 2000,
      //   });
      //   this.setdictionaryTypes = this.setdictionaryTypes.filter(
      //     (item) => item.id !== this.typesListQuery.TypeId
      //   );
      //   this.loadsetdictionaryTypes();
      // });
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
    // 搜索分类
    handleSearchsetdictionaryTypes() {
      this.loadsetdictionaryTypes();
    },
    // 获取分类列表
    loadsetdictionaryTypes() {
      setdictionary.loadType(this.typesListQuery).then((res) => {
        this.setdictionaryTypes = [...res.data];
        this.listQuery.tableName = res.data[0].tableName;
        clearTimeout(this.timeId);
        this.timeId = setTimeout(() => {
          if (this.setdictionaryTypes.length == 0) return;
          this.defaultChecked.push(this.setdictionaryTypes[0].id);
          let code = this.setdictionaryTypes[0].id;
          this.$refs[`treeItem_${code}`].click();
        }, 400);
        // this.getList();
      });
    },
    handleNodeClick(val) {
      this.listQuery.tableName = val.tableName;
      this.typesListQuery.TypeId = val.id;
      this.upsetdictionaryTypesInfo = val;
      if (this.listQuery.tableName == "Dic_setmeal") {
        this.getList();
      }
      if (this.listQuery.tableName == "Dic_mec_setmeal") {
        login.getRegHospitals().then((response) => {
          this.orgs = response.result.map(function (item) {
            return {
              id: item.id,
              label: item.name,
              parentId: item.parentId || null,
            };
          });
          var orgstmp = JSON.parse(JSON.stringify(this.orgs));
          this.settablelist = this.tablelist;
          this.orgsTree = listToTreeSelect(orgstmp);
        });
      }
      if (this.listQuery.tableName == "Dic_person_setmeal") {
        this.handleGetComboList();
      }
    },

    btnsave() {
      console.log(this.setdatalist);
      console.log(this.meccode);
      if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
      this.saveLoading = true;
      var arr = [];
      if (
        this.parentid == "" ||
        this.parentid == undefined ||
        this.parentid == null
      ) {
        this.$message({
          showClose: true,
          message: "请选择体检中心",
          type: "warning",
        });
      } else {
        this.setdatalist.forEach((d) => {
          arr.push(d.code);
        });
        var data = {
          meccode: this.meccode,
          setmealcodeItems: arr,
        };
        setdictionary.createmecsetmeal(data).then((response) => {
          this.setdatalist = [];
          var query = {
            key: this.meccode,
          };

          setdictionary.loadmecsetmeal(query).then((res) => {
            this.setdatalist = [];
            if (res.data.length == 0) {
              this.settablelist = Object.assign([], this.tablelist);
            } else {
              this.settablelist = Object.assign([], this.tablelist);
              res.data.forEach((d) => {
                this.settablelist.forEach((b) => {
                  if (d.setmealcode == b.code) {
                    var temp = {
                      code: d.setmealcode,
                      name: d.setmealname,
                    };
                    this.settablelist.splice(this.settablelist.indexOf(b), 1);
                    this.setdatalist.push(temp);
                  }
                });
              });
            }
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
            });
            this.saveLoading = false;
          });
        });
      }
    },
    treehandleNodeClick(data) {
      console.log(data);
      this.parentid = data.parentId;
      if (
        this.parentid == "" ||
        this.parentid == null ||
        this.parentid == undefined
      ) {
        this.settablelist = [];
        this.setdatalist = [];
      } else {
        // setdictionary.getList(this.listQuery).then((response) => {
        //   this.settablelist = response.data;
        // });
        this.meccode = data.id;
        var query = {
          key: data.id,
        };
        console.log(query);
        setdictionary.loadmecsetmeal(query).then((res) => {
          this.setdatalist = [];
          if (res.data.length == 0) {
            this.settablelist = Object.assign([], this.tablelist);
          } else {
            this.settablelist = Object.assign([], this.tablelist);
            res.data.forEach((d) => {
              this.settablelist.forEach((b) => {
                if (d.setmealcode == b.code) {
                  var temp = {
                    code: d.setmealcode,
                    name: d.setmealname,
                  };
                  this.settablelist.splice(this.settablelist.indexOf(b), 1);
                  this.setdatalist.push(temp);
                }
              });
            });
          }
        });
      }
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.dialog-mini .el-select {
  width: 100%;
}
.setdictionary-wrap {
  width: 100%;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 10px;
  .setdictionary-menu-card {
    height: calc(100% - 86px);
    overflow: auto;
    .el-card__body {
      height: auto;
    }
  }
}
.setdictionary-box {
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  .setdictionary-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    .setdictionary-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px !important;
    }
  }
  .buttons-box {
    padding: 10px 10px;
    background: #f5f5f5;
  }
  .setdictionary-content {
    height: 100%;
    padding: 0;
    .buttons-box {
      text-align: right;
    }
  }
}
</style>
