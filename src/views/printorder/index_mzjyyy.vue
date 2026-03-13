<template>
  <div class="print_order">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn
          moduleName="printorder"
          ref="printorder"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <!-- 查询条件表单盒子 -->
    <el-card class="box-card search_box">
      <div class="head">
        <div class="logo"></div>
        查询条件
      </div>
      <!-- <Search ref="search" searchBtnType="success" :searchOptions="searchOptions" :search="handleSearch" align="left" labelShow arrayParams class="search_form" /> -->
      <el-form
        ref="form"
        class="search_form"
        :model="searchForm"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item size="mini" label="单位名称">
              <el-select
                style="width: 100%"
                v-model="searchForm.companycode"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="handleRemoteMethod"
                :loading="selectLoading"
                @clear="handleRemoteMethod"
                @change="handleChangeCompany"
              >
                <el-option
                  v-for="item in companyArr"
                  :key="item.companycode"
                  :label="`${item.companycode}　${item.companyname}`"
                  :value="item.companycode"
                >
                </el-option>
              </el-select>
              <!-- <el-select clearable style="width:100%" filterable v-model="searchForm.companycode" @change="handleChangeCompany" placeholder="请选择单位">
                  <el-option v-for="(item,index) in companyArr" :key="index" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode"></el-option>
                </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="批次">
              <el-select
                v-model="searchForm.batch"
                clearable
                placeholder="请选择批次"
                @change="handleChangeBatch"
              >
                <el-option
                  v-for="(item, index) in batchitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="分组">
              <el-select
                filterable
                v-model="searchForm.groupcode"
                clearable
                placeholder="请选择分组"
                @change="handleChangeGroup"
              >
                <el-option
                  v-for="(item, index) in groupitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="性别">
              <el-select
                v-model="searchForm.sex"
                clearable
                placeholder="请选择性别"
                @change="handleGetPrintOrderList"
              >
                <el-option
                  v-for="(item, index) in sexitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="婚姻状况">
              <el-select
                v-model="searchForm.marriage"
                clearable
                placeholder="请选择婚姻"
                @change="handleGetPrintOrderList"
              >
                <el-option
                  v-for="(item, index) in marriageitem"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="name_post" label-width="50px">
            <el-form-item size="mini" label="姓名">
              <el-input
                v-model="searchForm.name"
                @keyup.native.enter="handleGetPrintOrderList"
              ></el-input>
            </el-form-item>
            <el-form-item size="mini" label="职务" label-width="50px">
              <el-input
                v-model="searchForm.occupation"
                @keyup.native.enter="handleGetPrintOrderList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="体检号">
              <el-input
                v-model="searchForm.regid"
                @keyup.native.enter="handleGetPrintOrderList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="部门">
              <el-select
                v-model="searchForm.departcode"
                filterable
                clearable
                placeholder="请选择部门"
                @change="handleGetPrintOrderList"
              >
                <el-option
                  v-for="(item, index) in departitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="状态">
              <el-select
                v-model="searchForm.status"
                clearable
                placeholder="请选择状态"
                @change="handleGetPrintOrderList"
              >
                <el-option
                  v-for="(item, index) in statusitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="">
              <el-button type="primary" plain @click="handleGetPrintOrderList"
                >搜 索</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- tableList 盒子 -->
    <div class="table_box">
      <!-- 左侧人员列表盒子 -->
      <el-card class="box-card table_left">
        <!-- 头部操作盒子 -->
        <div class="head_box">
          <div class="title">
            <div class="logo"></div>
            人员列表
          </div>
          <div class="count_box">
            <div class="count_item">
              <div class="count_title bg1">总人数</div>
              <div class="count_num">{{ checktotal }}</div>
            </div>
            <div class="count_item">
              <div class="count_title bg2">未总检</div>
              <div class="count_num">{{ checkingtotal }}</div>
            </div>
            <div class="count_item">
              <div class="count_title bg3">已总检</div>
              <div class="count_num">{{ checkedtotal }}</div>
            </div>
          </div>
          <el-radio-group @change="handleChangePrintFlag" v-model="printflag">
            <el-radio :label="2">全部</el-radio>
            <el-radio :label="0">未打印指引单</el-radio>
            <el-radio :label="1">已打印指引单</el-radio>
          </el-radio-group>
        </div>
        <!-- 人员表格数据 -->
        <EasyTable
          class="staff_table"
          :loading="loading"
          height="100%"
          :data="staffTableData"
          ref="staffTable"
          :tableOptions="staffTableOption"
          @row-click="handleChoosePeople"
          :checkbox-config="{ fetch: true, rowClick: true }"
          @selection-change="handleSelectStaff"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0' }"
        />
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 500, 1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
        <!-- <div class="staff_table">
            <vxe-table height="auto" border="inner" :loading="loading" show-overflow highlight-hover-row :sort-config="{trigger: 'cell'}" :data="staffTableData" @checkbox-change="handleSelectRow" @checkbox-all="handleSelectAll" @cell-click="handleRowClick">
              <vxe-table-column type="checkbox" width="45"></vxe-table-column>
              <vxe-table-column field="checkno" title="档案号" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="name" title="姓名" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="sex" title="性别" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="age" title="年龄" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="checktypename" title="体检类型" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="groupname" title="分组" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="telephone" title="电话" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="email" title="邮箱" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="marriage" title="婚姻" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="department" title="部门" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="occupation" title="职务" width="120px" show-overflow></vxe-table-column>
              <vxe-table-column field="regdate" title="登记日期" width="180px" show-overflow></vxe-table-column>
            </vxe-table>
          </div> -->
      </el-card>
      <!-- 右侧项目列表盒子 -->
      <el-card class="box-card table_right">
        <!-- 头部操作盒子 -->
        <div class="head_box">
          <div class="title">
            <div class="logo"></div>
            项目列表
          </div>
          <el-tag size="small">包含{{ projectTableData.length }}个项目</el-tag>
        </div>
        <!-- 项目列表数据 -->
        <EasyTable
          class="project_table"
          :loading="loading"
          height="100%"
          :data="projectTableData"
          ref="projectTable"
          :tableOptions="projectTableOption"
          :checkbox-config="{ fetch: true, rowClick: true }"
          @selection-change="handleSelectProject"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0' }"
        />
      </el-card>
    </div>
    <!-- 打印弹框 -->
    <el-dialog
      title="打印"
      :visible.sync="showPrintDialog"
      class="printDialog"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <span>
        <div class="all_box">
          <el-checkbox v-model="checkAllFlag" @change="handleCheckAllFlag"
            >全选</el-checkbox
          >
        </div>
        <el-checkbox v-model="gidanceFlag">指引单</el-checkbox>
        <el-checkbox v-model="healthCertFlag">健康证检查表</el-checkbox>
        <!-- <el-checkbox v-model="applyFlag">申请单</el-checkbox> -->
        <el-checkbox v-model="driverLicenseFlag">驾驶证检查表</el-checkbox>
        <el-checkbox v-model="singleAdult">体格检查表</el-checkbox>
        <el-checkbox v-model="singleChildren">儿童体格检查表</el-checkbox>
        <el-checkbox v-model="censorShip">送检单</el-checkbox>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClosePrintDia">取 消</el-button>
        <el-button size="mini" type="primary" @click="handlePrintDiaConfirm"
          >打 印</el-button
        >
      </span>
    </el-dialog>
    <!-- 体检项目 -->
    <SetMealDialog
      v-if="showProject"
      :flag="'printorder'"
      :groupTableData="groupTableData"
      @submit="handleSubmitProject"
      @close="showProject = false"
    />
  </div>
</template>
  <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
// 引入页面接口
import { getSetMeal } from "@/api/personalregister.js";
import { printBase64 } from "@/api/printreport.js";

import SetMealDialog from "@/components/SetMealDialog/index.vue"; // 新项目弹框

import {
  getCompanyList,
  getPrintOrderList,
  getSearchParams,
  setProjectList,
  setPrintOrderDel,
  setPrintOrderDetail,
} from "@/api/printorder.js";
import * as company_archives from "@/api/company_archives";
import { mapGetters } from "vuex";
import { printStaticsBase64 } from "@/api/printreport.js";
export default {
  name: "printorder",

  components: {
    Sticky,
    permissionBtn,
    SetMealDialog,
  },

  data() {
    return {
      checkAllFlag: false, // 全选打印开关
      gidanceFlag: false, // 指引单开关
      healthCertFlag: false, // 健康证开关
      applyFlag: false, // 申请单开关
      driverLicenseFlag: false, // 驾驶证开关
      singleAdult: false, // 体格检查表开关
      singleChildren: false, // 儿童体格检查表开关
      censorShip: false, // 送检单开关
      showPrintDialog: false,
      searchForm: {}, //查询条件表单
      searchForm: {
        companycode: "",
        batch: "",
        groupcode: "",
        departcode: "",
        sex: "0",
        marriage: "",
        status: "",
        name: "",
        occupation: "",
        regid: "",
        printflag: "",
      }, //查询条件表单
      staffTableData: [], // 人员列表表格数据
      projectTableData: [], // 项目列表表格数据
      groupTableData: [],
      checktotal: 0, // 总人数
      checkingtotal: 0, // 检查中人数
      checkedtotal: 0, // 已检查人数
      loading: false, // 表格加载数据效果
      companyArr: [], // 公司下拉数据
      companycode: "", // 选中公司编号
      batchcode: "", // 选中批次编号
      batchitems: [], // 批次号下拉合集数据
      marriageitem: [], // 婚姻状态下拉合集数据
      sexitems: [], // 性别下拉合集数据
      sexitems: [
        {
          code: "0",
          name: "未知",
        },
        {
          code: "1",
          name: "男",
        },
        {
          code: "2",
          name: "女",
        },
      ], // 性别下拉合集数据
      statusitems: [], // 当前状态下拉合集数据
      departitems: [], // 部门下拉合集数据
      groupitems: [], // 分组下拉合集数据
      printflag: 2, // 2全部 0未打印 1已打印
      whereitems: [], // 条件集
      choosePeople: undefined, // 当前选中对象
      chooseStaffList: [], // 当前选中操作多人复选
      showProject: false, // 添加项目弹框
      setmealitems: [], // 主体套餐表格数据
      setmealitems1: [],
      setmealitems2: [],
      setmealitems3: [],
      combineitems: [], // 预约编码合集
      combineone: [], // 预约编码合集套餐渲染数据1
      combinetwo: [], // 预约编码合集套餐渲染数据2
      combinethree: [], // 预约编码合集套餐渲染数据3
      loadingProject: false, // 项目表格加载数据效果
      chooseone: [], // 预约编码合集选中数据1
      choosetwo: [], // 预约编码合集选中数据2
      choosethree: [], // 预约编码合集选中数据3
      totalPrice: 0, // 总金额
      setmealRadio: "", // 单选选中数据code
      updatetype: 0, // 当前项目信息 0:新增(加)，1：删除(减)
      currentPage: 1,
      pageSize: 100,
      count: 0,
      timer: "",
      selectLoading: false,
      meccode: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    // 搜索组件配置
    searchOptions() {
      return [
        {
          label: "单位名称",
          prop: "companycode",
          type: "select",
          attrs: {
            clearable: "clearable",
            filterable: true,
          },
          options: {
            params: {
              label: "companyname",
              value: "companycode",
            },
            data: this.companyArr,
          },
          value: this.companycode,
          onChange: (value) => {
            this.companycode = value;
            this.handleChangeCompany();
          },
        },
        {
          label: "批次",
          prop: "batch",
          type: "select",
          value: this.batchcode,
          options: {
            params: {
              label: "name",
              value: "code",
            },
            data: this.batchitems,
          },
        },
        {
          label: "分组",
          prop: "groupcode",
          type: "select",
          options: {
            params: {
              label: "name",
              value: "code",
            },
            data: this.groupitems,
          },
        },
        {
          label: "性别",
          prop: "sex",
          type: "select",
          options: {
            params: {
              label: "name",
              value: "code",
            },
            data: this.sexitems,
          },
        },
        {
          label: "婚姻状况",
          prop: "marriage",
          type: "select",
          options: {
            params: {
              label: "name",
              value: "code",
            },
            data: this.marriageitem,
          },
        },
        {
          label: "姓名",
          prop: "name",
          type: "text",
        },
        {
          label: "职务",
          prop: "occupation",
          type: "text",
          handler: ["keyup.13", "blur"],
        },
        {
          label: "档案号",
          prop: "checkno",
          type: "text",
        },
        {
          label: "部门",
          prop: "departcode",
          type: "select",
          options: {
            params: {
              label: "name",
              value: "code",
            },
            data: this.departitems,
          },
        },
        {
          label: "状态",
          prop: "status",
          type: "select",
          options: {
            params: {
              label: "name",
              value: "code",
            },
            data: this.statusitems,
          },
        },
      ];
    },
    // 人员列表表格配置
    staffTableOption() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "体检号",
          prop: "regid",
          width: 170,
          omit: 1,
        },
        {
          title: "姓名",
          prop: "name",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          omit: 1,

          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 120,
          omit: 1,
        },
        {
          title: "分组",
          prop: "groupname",
          width: 140,
          omit: 1,
        },
        {
          title: "登记人",
          prop: "operatorname",
          width: 110,
          omit: 1,
        },
        {
          title: "电话",
          prop: "telephone",
          width: 110,
          omit: 1,
        },
        {
          title: "邮箱",
          omit: 1,
          prop: "email",
        },
        {
          title: "婚姻",
          omit: 1,
          prop: "marriage",
        },
        {
          title: "部门",
          prop: "department",
          width: 140,
          omit: 1,
        },
        {
          title: "职务",
          omit: 1,
          prop: "occupation",
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 110,
          omit: 1,
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 160,
          omit: 1,
        },
      ];
    },
    // 项目列表表格配置
    projectTableOption() {
      return [
        {
          title: "组合编码",
          prop: "combinecode",
        },
        {
          title: "体检项目",
          prop: "combinename",
          width: 150,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          returnVal: (value) => {
            return value == 0 ? "登记" : value == 1 ? "弃检" : "完成";
          },
        },
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "加项",
          width: 60,
          render: (h, data) => {
            // let checked = data.addflag == 1 ? true : false;
            return (
              <el-checkbox
                v-model={data.addflag}
                disabled
                true-label={1}
                false-label={0}
              ></el-checkbox>
            );
          },
        },
        {
          title: "减项",
          width: 60,
          render: (h, data) => {
            // let checked = data.dedflag == 1 ? true : false;
            return (
              <el-checkbox
                v-model={data.dedflag}
                disabled
                true-label={1}
                false-label={0}
              ></el-checkbox>
            );
          },
        },
      ];
    },
    // 主体套餐表格配置
    tableOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          title: "名称",
          prop: "setmealname",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
    // 预约编码合集套餐表格配置1
    tableOptionsOne() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
    // 预约编码合集套餐表格配置2
    tableOptionsTwo() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
    // 预约编码合集套餐表格配置3
    tableOptionsThree() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
  },

  mounted() {
    // 页面加载请求单位数据
    this.handleGetCompanyList();
  },

  methods: {
    // 打印弹框点击打印操作
    async handlePrintDiaConfirm() {
      // this.chooseStaffList
      for (let i = 0; i < this.chooseStaffList.length; i++) {
        if (this.gidanceFlag) {
          await this.handleDiaPrintGidance(this.chooseStaffList[i]); // 打印指引单
          this.chooseStaffList[i].billprintcombines.length > 0 &&
            (await this.handleDiaPrintApply(this.chooseStaffList[i])); // 打印申请单
          this.chooseStaffList[i].giveordercombines.length > 0 &&
            (await this.handleDiaPrintCensorShip(this.chooseStaffList[i])); // 打印送检单
        }
        this.healthCertFlag &&
          (await this.handleDiaPrintHealthCert(this.chooseStaffList[i])); // 打印健康证
        // this.applyFlag &&
        //   (await this.handleDiaPrintApply(this.chooseStaffList[i])); // 打印申请单
        this.driverLicenseFlag &&
          (await this.handleDiaPrintDriverLicense(this.chooseStaffList[i])); // 打印驾驶证
        this.singleAdult &&
          (await this.handleDiaPrintSingleAdult(this.chooseStaffList[i])); // 打印体格检查表
        this.singleChildren &&
          (await this.handleDiaPrintSingleChildren(this.chooseStaffList[i])); // 打印儿童体格检查表
        this.censorShip &&
          (await this.handleDiaPrintCensorShip(this.chooseStaffList[i])); // 打印送检单
      }
      this.handleClosePrintDia();
    },
    // 点击勾选全部打印
    handleCheckAllFlag(value) {
      this.gidanceFlag = value; // 指引单开关
      this.healthCertFlag = value; // 健康证开关
      this.applyFlag = value; // 申请单开关
      this.driverLicenseFlag = value; // 驾驶证开关
      this.singleAdult = value; // 体格检查表开关
      this.singleChildren = value; // 儿童体格检查表开关
      this.censorShip = value; // 送检单开关
    },
    // 弹框打印指引单
    handleDiaPrintGidance(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、梅州指引单",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 弹框打印健康证
    handleDiaPrintHealthCert(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、健康检查表",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 弹框打印申请单
    handleDiaPrintApply(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、单位申请单",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 弹框打印驾驶证
    handleDiaPrintDriverLicense(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、驾驶检查表",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
              {
                key: "checkno",
                value: item.checkno,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 弹框打印体格检查表
    handleDiaPrintSingleAdult(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、体格检查表",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 弹框打印儿童体格检查表
    handleDiaPrintSingleChildren(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、儿童体格检查表",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 弹框打印送检单
    handleDiaPrintCensorShip(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: "1、送检单",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 关闭打印弹框
    handleClosePrintDia() {
      this.checkAllFlag = false; // 全选打印开关
      this.gidanceFlag = false; // 指引单开关
      this.healthCertFlag = false; // 健康证开关
      this.applyFlag = false; // 申请单开关
      this.driverLicenseFlag = false; // 驾驶证开关
      this.singleAdult = false; // 体格检查表开关
      this.singleChildren = false; // 儿童体格检查表开关
      this.censorShip = false; // 送检单开关
      this.showPrintDialog = false;
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
    handleRemoteMethod(val) {
      console.log(val);
      this.selectLoading = true;
      setTimeout(() => {
        this.selectLoading = false;
        company_archives
          .getList({
            page: 1,
            limit: 100000,
            key: val,
          })
          .then((res) => {
            this.companyArr = res.data;
          });
      }, 200);
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleGetPrintOrderList();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleGetPrintOrderList();
    },
    // 加减项目
    handleSubmitProject(data) {
      console.log(data, "data");
      console.log(this.updatetype, "updatetype");
      console.log(this.chooseStaffList, "updatetype");
      let regiditems = this.chooseStaffList.map((k) => {
        return k.regid;
      });
      let combineitems = data.map((k) => {
        return {
          combinecode: k.combinecode,
          combinename: k.combinename,
          price: k.price,
          deptcode: k.deptcode,
        };
      });
      setProjectList({
        regiditems,
        updatetype: this.updatetype,
        combineitems,
      }).then((res) => {
        this.$message.success(res.message);
        this.showProject = false;
        if (this.choosePeople) {
          this.handleSetPrintOrderDetail();
        }
      });
    },
    // 获取项目详情
    handleSetPrintOrderDetail() {
      if (!this.choosePeople) return false;
      setPrintOrderDetail({ regid: this.choosePeople.regid }).then((res) => {
        this.projectTableData = res.result;
      });
    },
    // 单击选中行事件回调
    handleRowClick({ row, triggerCheckbox }) {
      if (!triggerCheckbox) {
        this.choosePeople = Object.assign({}, row);
        this.handleSetPrintOrderDetail();
      }
    },
    // 复选框全选事件回调
    handleSelectAll({ records }) {
      console.log(records);
    },
    // 复选框勾选事件回调 @checkbox-change="handleSelectRow" 与 cell-click冲突
    handleSelectRow({ records, row }) {
      this.chooseStaffList = Object.assign([], records);
    },
    // 保存项目修改加减回调
    handleSetProjectList() {
      // 组装接口数据
      let regiditems = this.chooseStaffList.map((k) => {
        return k.regid;
      });
      let combineitems = [
        ...this.chooseone,
        ...this.choosetwo,
        ...this.choosethree,
      ];
      console.log(regiditems);
      console.log(combineitems);
      setProjectList({
        regiditems: regiditems,
        updatetype: this.updatetype,
        combineitems: combineitems,
      }).then((res) => {
        console.log(res);
        this.$message.success("更新数据成功!");
      });
    },
    // 点击添加项目回调
    handleProjectList() {
      if (this.chooseStaffList.length == 0) {
        let type = this.updatetype == 0 ? "加" : "减";
        this.$message.warning(`请勾选需要${type}项的人员信息!`);
        return false;
      }
      this.showProject = true; // 添加项目弹框
      this.loadingProject = true; // 关闭加载效果
    },
    // 获取弹框表格数据
    handleGetProjectLists() {
      getSetMeal().then((res) => {
        let { setmealitems, combineitems } = res.result;
        this.setmealitems = setmealitems;
        this.combineone = combineitems[0].combineitems;
        this.combinetwo = combineitems[1].combineitems;
        this.combinethree = combineitems[2].combineitems;
        this.loadingProject = false; // 关闭加载效果

        // 套餐组合数据处理
        let arr = this.setmealitems;
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        for (let i = 0; i < arr.length; i++) {
          if (i <= arr.length / 3) {
            arr1.push(arr[i]);
          } else if (i > arr.length / 3 && i <= (arr.length / 3) * 2) {
            arr2.push(arr[i]);
          } else {
            arr3.push(arr[i]);
          }
        }
        this.setmealitems1 = arr1;
        this.setmealitems2 = arr2;
        this.setmealitems3 = arr3;
      });
    },
    // 点击保存套餐项目回调
    handleSubmitMedicalItems() {
      this.handleSetProjectList(); // 调用保存项目接口
      this.showProject = false; // 关闭弹框
      this.handleResetProject(); // 重置弹框数据
    },
    // 点击关闭套餐项目弹框按钮回调
    handleCloseMedicalItems() {
      this.showProject = false; // 关闭弹框
      this.handleResetProject(); // 重置弹框数据
    },
    // 计算总金额回调
    handleGettotalPrice() {
      this.totalPrice = 0;
      this.chooseone.forEach((item) => {
        this.totalPrice += item.price;
      });
      this.choosetwo.forEach((item) => {
        this.totalPrice += item.price;
      });
      this.choosethree.forEach((item) => {
        this.totalPrice += item.price;
      });
    },
    // 单选
    handleChecked(row) {
      if (row) {
        this.setmealRadio = row.setmealcode;
      }
      // 清空前面回显
      this.$refs.combineone.$refs.easyTable.clearSelection();
      this.$refs.combinetwo.$refs.easyTable.clearSelection();
      this.$refs.combinethree.$refs.easyTable.clearSelection();
      // 连贯多选回显
      this.combineone.forEach((val) => {
        let itemcode = row.combineitems.findIndex(
          (k) => k.combinecode == val.combinecode
        );
        if (itemcode > -1) {
          // 回显
          this.$nextTick(() => {
            this.$refs.combineone.$refs.easyTable.toggleRowSelection(val, true);
          });
        }
      });
      this.combinetwo.forEach((val) => {
        let itemcode = row.combineitems.findIndex(
          (k) => k.combinecode == val.combinecode
        );
        if (itemcode > -1) {
          // 回显
          this.$nextTick(() => {
            this.$refs.combinetwo.$refs.easyTable.toggleRowSelection(val, true);
          });
        }
      });
      this.combinethree.forEach((val) => {
        let itemcode = row.combineitems.findIndex(
          (k) => k.combinecode == val.combinecode
        );
        if (itemcode > -1) {
          // 回显
          this.$nextTick(() => {
            this.$refs.combinethree.$refs.easyTable.toggleRowSelection(
              val,
              true
            );
          });
        }
      });
    },
    // 复选框回调one
    handleCheckedOne(val) {
      this.chooseone = val;
    },
    // 复选框回调two
    handleCheckedTwo(val) {
      this.choosetwo = val;
    },
    // 复选框回调three
    handleCheckedThree(val) {
      this.choosethree = val;
    },
    // 项目列表重置绑定数据回调
    handleResetProject() {
      this.setmealitems = []; // 主体套餐表格数据
      this.combineitems = []; // 预约编码合集
      this.combineone = []; // 预约编码合集套餐渲染数据1
      this.combinetwo = []; // 预约编码合集套餐渲染数据2
      this.combinethree = []; // 预约编码合集套餐渲染数据3
      this.loadingProject = false; // 项目表格加载数据效果
      this.chooseone = []; // 预约编码合集选中数据1
      this.choosetwo = []; // 预约编码合集选中数据2
      this.choosethree = []; // 预约编码合集选中数据3
      this.totalPrice = 0; // 总金额
      this.setmealRadio = ""; // 单选选中数据code
      this.updatetype = 0; // 单选选中数据code
    },
    // 打印标志改变触发回调
    handleChangePrintFlag(value) {
      this.handleGetPrintOrderList();
    },
    // 懒加载方法回调
    handleloadMore() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.staffTableData.length >= this.count) return false;
        this.currentPage++;
        this.handleGetPrintOrderList();
      });
    },
    // 获取列表数据回调
    handleGetPrintOrderList() {
      // 处理printflag打印状态参数
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] != "" && this.searchForm[k] != "0") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      if (this.searchForm.status == "0") {
        whereitems.push({
          key: "status",
          value: this.searchForm.status,
        });
      }
      whereitems.push({
        key: "printflag",
        value: this.printflag == 2 ? "" : String(this.printflag),
      });
      getPrintOrderList({
        whereitems,
        page: this.currentPage,
        limit: this.pageSize,
      })
        .then((res) => {
          this.checktotal = res.data.checktotal;
          this.checkingtotal = res.data.checkingtotal;
          this.checkedtotal = res.data.checkedtotal;
          this.count = res.count;
          this.staffTableData = res.data.customeritems;
          this.loading = false;
        })
        .catch((err) => {
          this.checktotal = 0;
          this.checkingtotal = 0;
          this.checkedtotal = 0;
          this.count = 0;
          this.staffTableData = [];
          this.loading = false;
        });
    },
    // 切换公司单位下拉列表触发回调
    handleChangeCompany(data) {
      if (data) {
        this.searchForm.batch = "";
        this.staffTableData = [];
        this.projectTableData = [];
        this.handleGetSearchParams();
      } else {
        this.$reload();
      }
      // 请求搜索条件集数据]
    },
    handleChangeBatch(data) {
      if (data) {
        let flag = this.batchitems.filter((k) => {
          return k.code === data;
        })[0];
        if (flag) {
          this.meccode = flag.meccode;
        }
        this.searchForm.groupcode = "";
        this.staffTableData = [];
        this.projectTableData = [];
        this.handleGetPrintOrderList();
      } else {
        this.meccode = "";
        this.searchForm.groupcode = "";
        this.staffTableData = [];
        this.projectTableData = [];
      }
      // 请求搜索条件集数据]
    },
    handleChangeGroup(data) {
      this.staffTableData = [];
      this.projectTableData = [];
      this.handleGetPrintOrderList();
      // 请求搜索条件集数据]
    },
    // 获取单位列表回调
    handleGetCompanyList() {
      getCompanyList().then((res) => {
        this.companyArr = res.data;
      });
    },
    // 搜索组件条件改变回调
    handleSearch(params) {
      this.whereitems = params;
      this.handleGetPrintOrderList(); // 获取页面数据
    },
    // 搜索组件条件集数据回调
    handleGetSearchParams() {
      getSearchParams({ companycode: this.searchForm.companycode }).then(
        (res) => {
          this.searchForm.batchcode = ""; // 重置批次号
          let { batchitems, marriageitem, sexitems, statusitems } = res.result;
          this.marriageitem = marriageitem;
          this.sexitems = sexitems;
          this.statusitems = statusitems;
          this.batchitems = batchitems;
          let selectIndex = batchitems.findIndex((k) => k.selected);
          if (selectIndex > -1) {
            this.searchForm.batch = batchitems[selectIndex].code;
            this.meccode = batchitems[selectIndex].meccode;
            this.departitems = batchitems[selectIndex].departitems;
            this.groupitems = batchitems[selectIndex].groupitems;
          }
          // 请求单位打单列表数据
          this.handleGetPrintOrderList();
        }
      );
    },
    // 人员列表选中对象单选数据回调
    handleChoosePeople(row) {
      this.choosePeople = Object.assign({}, row);
      this.handleSetPrintOrderDetail();
    },
    // 人员列表选中多选数据回调
    handleSelectStaff(rows) {
      this.chooseStaffList = Object.assign([], rows);
    },
    // 项目列表选中数据回调
    handleSelectProject(rows) {
      console.log(row);
    },
    // 删除列表人员
    handleDelPeople() {
      // 不能为空
      if (this.chooseStaffList.length == 0) {
        this.$message.warning(`请勾选需要删除的人员信息!`);
        return false;
      }
      // 确认删除框
      this.$confirm("此操作将删除该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.chooseStaffList.map((k) => {
            return k.regid;
          });
          // return;
          setPrintOrderDel(ids).then((res) => {
            this.projectTableData = [];
            this.handleGetPrintOrderList(); //重置页面
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
          });
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
    // 重置页面
    handleResetPage() {
      console.log(this.$refs.search);
      console.log(this.$refs.search.handleReset());
      // 页面加载请求单位数据
      this.handleGetCompanyList();
      this.checktotal = 0;
      this.checkingtotal = 0;
      this.checkedtotal = 0;
      this.staffTableData = [];
    },
    // 打印条码
    handlePrintBarCode() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印条码单人员!");
        return false;
      }
      this.$refs.printorder.$children.forEach(async (d) => {
        if (d.$el.innerText == "打印条码单") {
          // this.chooseStaffList.forEach((k) => {});
          for (let i = 0; i < this.chooseStaffList.length; i++) {
            await this.handlePrintBarCodeApi(
              this.chooseStaffList[i],
              d.$attrs["data-remark"]
            );
          }
        }
      });
    },
    handlePrintBarCodeApi(k, repname) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [k.regid],
            repname,
            // repname: d.$attrs["data-remark"],
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: k.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 打印健康检查表
    handleHealthCertificate() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印健康检查表人员!");
        return false;
      }
      this.$refs.printorder.$children.forEach((d) => {
        if (d.$el.innerText == "打印健康证") {
          this.chooseStaffList.forEach((k) => {
            let data = {
              fingercode: localStorage.getItem("md5code"),
              codes: [k.regid],
              repname: d.$attrs["data-remark"],
              printflag: 1,
              whereitems: [
                {
                  key: "regid",
                  value: k.regid,
                },
              ],
            };
            printBase64(data).then((res) => {
              this.lodop = getLodop();
              let printname = ``;
              if (res.data[0].printname == "") {
                printname = this.lodop.GET_PRINTER_NAME(-1);
              } else {
                printname = res.data[0].printname;
              }
              let printObj = new LodopPrinter(null, printname);
              let fileList = res.data.map((k) => {
                return k.base64String;
              });
              printObj.printBase64PdfReport(this.lodop, fileList);
            });
          });
        }
      });
    },
    // 打印指引单
    handlePrintGuidance() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印指引单人员!");
        return false;
      }
      this.$refs.printorder.$children.forEach(async (d) => {
        if (d.$el.innerText == "打印指引单") {
          for (let i = 0; i < this.chooseStaffList.length; i++) {
            let indexP = d.$attrs["data-remark"].split("、")[0] + "、";
            let repname = `${indexP}梅州指引单`;
            // if (this.meccode == 1) {
            //   if (this.chooseStaffList[i].personalflag == 1) {
            //     repname = `${indexP}团体指引单`;
            //   } else {
            //     repname = `${indexP}指引单`;
            //   }
            // } else if (this.meccode == 10003) {
            //   if (this.chooseStaffList[i].personalflag == 1) {
            //     repname = `${indexP}水电团体指引单`;
            //   } else {
            //     repname = `${indexP}水电指引单`;
            //   }
            // } else if (this.meccode == 10004) {
            //   if (this.chooseStaffList[i].personalflag == 1) {
            //     repname = `${indexP}国康团体指引单`;
            //   } else {
            //     repname = `${indexP}国康指引单`;
            //   }
            // }
            await this.handlePrintGuidanceApi(this.chooseStaffList[i], repname);
          }
        }
      });
    },
    handlePrintGuidanceApi(k, repname) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [k.regid],
            repname,
            // repname: d.$attrs["data-remark"],
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: k.regid,
              },
            ],
          };
          printBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
            return resolve("ok");
          });
        } catch (err) {
          console.log(err);
          return reject(err);
        }
      });
    },
    // 打印指引单模板
    handlePrintGuidanceTemp() {
      if (this.searchForm.companycode == "") {
        this.$message.warning("请先选择需要打印指引单模板单位!");
        return false;
      }
      if (this.searchForm.batch == "") {
        this.$message.warning("请先选择需要打印指引单模板批次!");
        return false;
      }
      if (this.searchForm.groupcode == "") {
        this.$message.warning("请先选择需要打印指引单模板分组!");
        return false;
      }
      console.log(this.meccode, "meccode");
      this.$refs.printorder.$children.forEach((d) => {
        if (d.$el.innerText == "指引单模板") {
          let indexP = d.$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          if (this.meccode == 1) {
            repname = `${indexP}团体指引单模板`;
          } else if (this.meccode == 10003) {
            repname = `${indexP}水电团体指引单模板`;
          } else if (this.meccode == 10004) {
            repname = `${indexP}国康团体指引单模板`;
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            repname: repname,
            printflag: 1,
            whereitems: [
              {
                key: "companycode",
                value: this.searchForm.companycode,
              },
              {
                key: "batch",
                value: this.searchForm.batch,
              },
              {
                key: "groupcode",
                value: this.searchForm.groupcode,
              },
            ],
          };
          printStaticsBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
          });
        }
      });
    },
    // 打印申请单
    handlePrintApply() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印申请单人员!");
        return false;
      }
      this.$refs.printorder.$children.forEach((d) => {
        if (d.$el.innerText == "打印申请单") {
          this.chooseStaffList.forEach((k) => {
            let data = {
              fingercode: localStorage.getItem("md5code"),
              codes: [k.regid],
              repname: d.$attrs["data-remark"],
              printflag: 1,
              whereitems: [
                {
                  key: "regid",
                  value: k.regid,
                },
              ],
            };
            printBase64(data).then((res) => {
              this.lodop = getLodop();
              let printname = ``;
              if (res.data[0].printname == "") {
                printname = this.lodop.GET_PRINTER_NAME(-1);
              } else {
                printname = res.data[0].printname;
              }
              let printObj = new LodopPrinter(null, printname);
              let fileList = res.data.map((k) => {
                return k.base64String;
              });
              printObj.printBase64PdfReport(this.lodop, fileList);
            });
          });
        }
      });
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnPlus": // 加项目
          this.updatetype = 0;
          this.handleProjectList();
          break;
        case "btnReduce": // 减项目
          this.updatetype = 1;
          this.handleProjectList();
          break;
        case "btnReset": // 重置页面
          this.$reload();
          break;
        case "btnDel": // 删除人员
          this.handleDelPeople();
          break;
        case "btnBarCode": // 打印条码
          this.handlePrintBarCode();
          break;
        case "btnGuidance": // 打印指引单
          this.handlePrintGuidance();
          break;
        case "btnGuidanceTemp": // 打印指引单模板
          this.handlePrintGuidanceTemp();
          break;
        case "btnApply": // 打印申请单
          this.handlePrintApply();
          break;
        case "btnHealthCertificate": // 打印健康证
          this.handleHealthCertificate();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnPrintDia": // 打印按钮打开弹框
          if (this.chooseStaffList.length == 0) {
            this.$message.warning("请先勾选需打印人员数据!");
            return;
          }
          this.showPrintDialog = true;
          break;
        default:
          break;
      }
    },
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      // beforeRouteENnter不能通过this访问组件实例，但是可以通过 vm 访问组件实例
      if (to.query.companycode) {
        console.log(to.query.companycode);
        vm.searchForm.companycode = to.query.companycode;
        vm.searchForm.batch = to.query.batch;
        vm.handleChangeCompany(vm.searchForm.companycode);
        // vm.handleGetPrintOrderList();
      }
    });
  },
  watch: {
    chooseone() {
      this.handleGettotalPrice();
    },
    choosetwo() {
      this.handleGettotalPrice();
    },
    choosethree() {
      this.handleGettotalPrice();
    },
  },
};
</script>
  <style lang='scss' scoped>
@import "./css/index.scss";
</style>