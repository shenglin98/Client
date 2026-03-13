<template>
  <div class="print_order">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="printorder" ref="printorder" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
    </sticky>
    <!-- 查询条件表单盒子 -->
    <el-card class="box-card search_box">
      <div class="head">
        <div class="logo"></div>
        查询条件
        <div class="date_box" style="margin-left: 20px">
          <el-popover ref="popoverReftest" placement="bottom-start" trigger="click">
            <div class="content">
              <div class="content_item" v-for="item in checkupDateArr" :key="item" @click="handleSelectConditionDate(item)">
                {{ item }}
              </div>
            </div>
            <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ conditionDateText }}</el-button>
          </el-popover>
          <!--<div class="date_title">日期范围</div> -->
          <el-date-picker @change="handleGetPrintOrderList" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </div>
      <!-- <Search ref="search" searchBtnType="success" :searchOptions="searchOptions" :search="handleSearch" align="left" labelShow arrayParams class="search_form" /> -->
      <el-form ref="form" class="search_form" :model="searchForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item size="mini" label="单位名称">
              <el-select style="width: 100%" v-model="searchForm.companycode" clearable filterable remote reserve-keyword :remote-method="handleRemoteMethod" :loading="selectLoading" @clear="handleRemoteMethod" @change="handleChangeCompany">
                <el-option v-for="item in companyArr" :key="item.companycode" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode">
                </el-option>
              </el-select>
              <!-- <el-select clearable style="width:100%" filterable v-model="searchForm.companycode" @change="handleChangeCompany" placeholder="请选择单位">
                <el-option v-for="(item,index) in companyArr" :key="index" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="批次">
              <el-select v-model="searchForm.batch" clearable placeholder="请选择批次" @change="handleChangeBatch">
                <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="分组">
              <el-select v-model="searchForm.groupcode" clearable placeholder="请选择分组" @change="handleChangeGroup">
                <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="性别">
              <el-select v-model="searchForm.sex" clearable placeholder="请选择性别" @change="handleGetPrintOrderList">
                <el-option v-for="(item, index) in sexitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="mini" label="婚姻状况">
              <el-select v-model="searchForm.marriage" clearable placeholder="请选择婚姻" @change="handleGetPrintOrderList">
                <el-option v-for="(item, index) in marriageitem" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="name_post" label-width="50px">
            <el-form-item size="mini" label="姓名">
              <el-input v-model="searchForm.name" @keyup.native.enter="handleGetPrintOrderList"></el-input>
            </el-form-item>
            <el-form-item size="mini" label="职务" label-width="50px">
              <el-input v-model="searchForm.occupation" @keyup.native.enter="handleGetPrintOrderList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="体检号">
              <el-input v-model="searchForm.regid" @keyup.native.enter="handleGetPrintOrderList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="部门">
              <el-select v-model="searchForm.departcode" clearable placeholder="请选择部门" @change="handleGetPrintOrderList">
                <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="二级部门">
              <el-select v-model="searchForm.deparment2" clearable placeholder="请选择部门" @change="handleGetPrintOrderList">
                <el-option v-for="(item, index) in departitem2s" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="状态">
              <el-select v-model="searchForm.status" clearable placeholder="请选择状态" @change="handleGetPrintOrderList">
                <el-option label="未检" value="0,1,2"></el-option>
                <el-option label="已检" value="3,4,5"></el-option>
                <el-option label="已总检" value="6,7"></el-option>
                <!-- <el-option
                  v-for="(item, index) in statusitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="任职情况">
              <el-input v-model="searchForm.positionin" @keyup.native.enter="handleGetPrintOrderList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="冻结状态">
              <el-select v-model="searchForm.freeze" clearable placeholder="请选择状态" @change="handleGetPrintOrderList">
                <el-option label="正常" :value="0"></el-option>
                <el-option label="冻结" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item size="mini" label="">
              <el-button type="primary" plain @click="handleGetPrintOrderList">搜 索</el-button>
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
          <!-- 广二序号筛选 -->
          <div class="screen_box">
            <el-input size="mini" placeholder="请输入序号" v-model="screenmin" clearable>
            </el-input>
            <span>-</span>
            <el-input size="mini" placeholder="请输入序号" v-model="screenmax" clearable>
            </el-input>
            <el-button size="mini" type="primary" style="margin-left: 8px" @click="handleScreenOrder">筛选</el-button>
          </div>
          <!-- 惠州打印标志按钮 -->
          <el-button size="mini" type="primary" style="margin-left: 15px" @click="handleAllowPrintGuide" v-if="hospitalsFlag == 'index_hzdlyy'">允许打结算后指引单</el-button>
        </div>
        <!-- 人员表格数据 -->
        <EasyTable class="staff_table" :loading="loading" row-key="regid" height="100%" :data="staffTableData" ref="staffTable" :tableOptions="staffTableOption" @row-click="handleChoosePeople" :checkbox-config="{ fetch: true, rowClick: true }" @selection-change="handleSelectStaff" :border="false" :header-cell-style="handleReturnStyle" :row-style="handleTableRowClassRed" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <div class="fenye">
          <div class="selecttips">
            已勾选人数：{{ this.chooseStaffList.length }}
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500, 1000, 2000, 5000, 10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
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
        <EasyTable class="project_table" :loading="loading" height="100%" :data="projectTableData" ref="projectTable" :tableOptions="projectTableOption" :checkbox-config="{ fetch: true, rowClick: true }" @selection-change="handleSelectProject" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
      </el-card>
    </div>
    <!-- 体检项目 -->
    <SetMealDialog v-if="showProject" :flag="'printorder'" :groupTableData="groupTableData" @submit="handleSubmitProject" @close="showProject = false" />
    <el-dialog class="printBarCodeDia" title="打印条码" :visible.sync="showBarCode" :close-on-click-modal="false" :show-close="false" width="40%">
      <div class="contnet">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="barCodeOptions" @change="handleCheckedBarCodeOptions">
          <el-checkbox v-for="(item, index) in barCodeItem" :label="item.key" :key="index">{{ item.value }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="
            (showBarCode = false), (barCodeOptions = []), (barCodeItem = [])
          ">取 消</el-button>
        <el-button size="mini" type="primary" @click="handlePrintBarCode">打 印</el-button>
      </span>
    </el-dialog>
    <!-- 打印申请单 -->
    <el-dialog title="打印申请单" :visible.sync="showApplyPrint" width="50%">
      <el-tree ref="casetree" :data="applyPrintTree" :props="applyPrintProps" :check-strictly="false" :check-on-click-node="true" show-checkbox default-expand-all @check="handleCheckChangeApplyPrint" node-key="code">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelApplyPrint">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitApplyPrint">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量修改分组 -->
    <el-dialog title="批量修改分组" :visible.sync="showEditGroup" width="38%" :show-close="false" :close-on-click-modal="false">
      <div>
        将当前选中人员分组修改为：
        <el-select v-model="editGroup" clearable placeholder="请选择分组">
          <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="(editGroup = ''), (showEditGroup = false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleEditGroupConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
// 引入页面接口
import { getSetMeal } from "@/api/personalregister.js";
import { printBase64, printStaticsBase64 } from "@/api/printreport.js";

// import SetMealDialog from "@/components/SetMealDialog/index.vue"; // 新项目弹框
import SetMealDialog from "@/components/SetMealDialog/index_gyey_youhua.vue"; // 新项目弹框

import {
  getCompanyList,
  getPrintOrderList,
  getSearchParams,
  setProjectList,
  setPrintOrderDel,
  setPrintOrderDetail,
  setPrintOrderFreeze,
  setPrintOrderNoFreeze,
  AllowPrintGuide,
  UpdateGroup,
} from "@/api/printorder.js";
import * as company_archives from "@/api/company_archives";
import { mapGetters } from "vuex";
import { getSysConfigInfo } from "@/api/sysconfig";
import { sleep } from "@/utils/sleep.js";
export default {
  name: "printorder",

  components: {
    Sticky,
    permissionBtn,
    SetMealDialog,
  },

  data() {
    return {
      screenmin: "",
      screenmax: "",
      hospitalsFlag: "",
      applyPrintTree: [], // 打印申请单选择科室数据树
      showApplyPrint: false, // 打印申请单选择科室数据树
      choosePrintArr: [], // 打印申请单选择科室编码
      applyPrintProps: {
        label: "name",
        children: "children",
      },
      checkAll: false,
      isIndeterminate: true,
      barCodeOptions: [],
      barCodeItem: [],
      showBarCode: false,
      searchForm: {}, //查询条件表单
      searchForm: {
        companycode: "",
        batch: "",
        groupcode: "",
        departcode: "",
        deparment2: "",
        sex: "0",
        marriage: "",
        status: "",
        name: "",
        occupation: "",
        regid: "",
        printflag: "",
        freeze: "",
        positionin: "",
      }, //查询条件表单
      staffTableData: [], // 人员列表表格数据
      staffTableDataCopy: [], // 人员列表表格数据 - 副本
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
      departitem2s: [], // 部门下拉合集数据
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
      checkupDateArr: ["登记时间", "体检时间", "预约时间"], // 检索条件身份证等数组
      conditionDateText: "预约时间",
      conditionDate: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }, // 日期选择器配置
      showEditGroup: false,
      editGroup: "",
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
          attrs: {
            "reserve-selection": true,
          },
        },
        {
          title: "序号",
          prop: "seqno",
          width: 110,
          omit: 1,
          sortable: true,
        },
        {
          title: "体检号",
          prop: "regid",
          width: 110,
          omit: 1,
          sortable: true,
        },
        {
          title: "姓名",
          prop: "name",
          omit: 1,
          sortable: true,
        },
        {
          title: "性别",
          prop: "sex",
          omit: 1,
          sortable: true,

          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          omit: 1,
          sortable: true,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 120,
          omit: 1,
          sortable: true,
        },
        {
          title: "分组",
          prop: "groupname",
          width: 140,
          omit: 1,
          sortable: true,
        },
        {
          title: "登记人",
          prop: "operatorname",
          width: 110,
          omit: 1,
          sortable: true,
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
          sortable: true,
        },
        {
          title: "部门",
          prop: "department",
          width: 140,
          omit: 1,
          sortable: true,
        },
        {
          title: "职务",
          omit: 1,
          prop: "occupation",
          sortable: true,
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 110,
          omit: 1,
          sortable: true,
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 160,
          omit: 1,
          sortable: true,
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

  async mounted() {
    let jump = await getSysConfigInfo({
      cc: "Sys_Module_Jump",
    });
    this.hospitalsFlag = (jump && jump.result) || "index";
    console.log(this.hospitalsFlag, "this.hospitalsFlag");
    // sleep(3000);
    // 页面加载请求单位数据
    this.handleGetCompanyList();
  },

  methods: {
    // 批量修改分组确认回调
    handleEditGroupConfirm() {
      if (!this.editGroup) {
        this.$message.warning("请选中目标分组");
        return;
      }
      UpdateGroup({
        regids: this.chooseStaffList.map((k) => k.regid),
        companycode: this.searchForm.companycode,
        batch: this.searchForm.batch,
        groupcode: this.editGroup,
      }).then((res) => {
        this.editGroup = "";
        this.chooseStaffList = [];
        this.showEditGroup = false;
        this.handleGetPrintOrderList();
      });
    },
    // 批量修改分组弹框
    handleEditGroupDia() {
      if (!this.searchForm.companycode) {
        this.$message.warning("请先选择单位");
        return;
      }
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请选中需修改分组的人员!");
        return;
      }
      this.showEditGroup = true;
    },
    // 筛选序号范围
    handleScreenOrder() {
      if (!this.screenmax || !this.screenmin) {
        this.$message.warning("需要输入条件!");
        this.staffTableData = JSON.parse(
          JSON.stringify(this.staffTableDataCopy)
        );
        return;
      }
      if (!this.isNumber(+this.screenmax) || !this.isNumber(+this.screenmin)) {
        this.$message.warning("请输入数字类型!");
        return;
      }
      this.staffTableData = this.staffTableDataCopy.filter((k) => {
        return +this.screenmin <= +k.seqno && +k.seqno <= +this.screenmax;
      });
    },
    isNumber(value) {
      return /^[1-9]\d*$/.test(value);
    },
    // 允许打印结算后指引单
    handleAllowPrintGuide() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先勾选需操作人员!");
        return;
      }
      let regidItems = this.chooseStaffList.map((k) => {
        return k.regid;
      });
      AllowPrintGuide(regidItems).then((res) => {
        this.$message.success(res.message);
        this.handleGetPrintOrderList();
      });
    },
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.conditionDateText = val;
      this.$refs.popoverReftest.doClose(); // 关闭弹出层popover
    },
    // 申请单打印 弹框提交回调
    async handleSubmitApplyPrint() {
      if (this.choosePrintArr.length === 0) {
        this.$message.warning("请勾选需要打印的组合!");
        return false;
      }
      let close = 0;
      for (let index = 0; index < this.chooseStaffList.length; index++) {
        close++;
        let billprintcombines = this.chooseStaffList[index].billprintcombines;
        let printArr = [];
        // 组装循环打印数据
        for (let i = 0; i < this.applyPrintTree.length; i++) {
          let data = {
            code: this.applyPrintTree[i].code,
            name: this.applyPrintTree[i].name,
            combinecodesin: [],
          };
          for (let j = 0; j < this.applyPrintTree[i].children.length; j++) {
            let index = this.choosePrintArr.findIndex((val) => {
              return (
                val === this.applyPrintTree[i].children[j].code &&
                billprintcombines.includes(val)
              );
            });
            index > -1 &&
              data.combinecodesin.push(this.applyPrintTree[i].children[j].code);
            // index > -1 &&
            //   data.combinecodesin.push(this.applyPrintTree[i].children[j].code);
            if (j == this.applyPrintTree[i].children.length - 1) {
              printArr.push(data);
            }
          }
        }
        printArr = printArr.filter((k) => {
          return k.combinecodesin.length > 0;
        });
        console.log(printArr, "printArr");
        for (let i = 0; i < printArr.length; i++) {
          let repname = "";
          this.chooseStaffList[index].meccode == 1
            ? (repname = "高干申请单A4")
            : (repname = "申请单");
          if (this.chooseStaffList[index].meccode == 1) {
            repname = `1、${repname}`;
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [this.chooseStaffList[index].regid],
            repname,
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: this.chooseStaffList[index].regid,
              },
              {
                key: "combinecodesin",
                valueList: printArr[i].combinecodesin,
              },
            ],
          };
          await printBase64(data).then((res) => {
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
            this.$message({
              type: "success",
              duration: 500,
              message: "操作成功!",
            });
            if (close == this.chooseStaffList.length) {
              this.handleCancelApplyPrint();
            }
          });
        }
      }
    },
    // 申请单打印 弹框取消回调
    handleCancelApplyPrint() {
      this.applyPrintTree = []; // 打印申请单选择科室数据树
      this.showApplyPrint = false; // 打印申请单选择科室数据树
      this.choosePrintArr = []; // 打印申请单选择科室编码
    },
    // 申请单打印树形结构勾选回调
    handleCheckChangeApplyPrint(data, value) {
      if (value.checkedNodes.length == 0) {
        this.choosePrintArr = [];
        return false;
      }
      this.choosePrintArr = [];
      value.checkedNodes.forEach((k) => {
        if (k.code) {
          this.choosePrintArr.push(k.code);
        }
      });
    },
    // 打印申请单 - 勾选
    handlePrintApplyCheck() {
      // this.$refs.popoverRefIdc.forEach((k) => {
      //   k.doClose(); // 关闭弹出层popover
      // });
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印申请单人员!");
        return false;
      }
      let tempArr = [];
      for (let i = 0; i < this.chooseStaffList.length; i++) {
        let tempdata = this.chooseStaffList[i];
        tempdata.billprintdepts &&
          tempArr.push(
            ...tempdata.billprintdepts.map((k) => {
              return {
                code: k.deptcode,
                name: k.deptname,
                children: [],
              };
            })
          );
      }
      tempArr = tempArr.filter((k) => k);
      if (tempArr.length === 0) {
        this.$message.warning("无申请单打印!");
        return false;
      }
      let map = new Map();
      for (let item of tempArr) {
        map.set(item.code, item);
      }
      this.applyPrintTree = [...map.values()];

      this.applyPrintTree.forEach((k, i) => {
        for (let i = 0; i < this.chooseStaffList.length; i++) {
          let tempdata = this.chooseStaffList[i];
          if (tempdata.billprintdepts) {
            for (let j = 0; j < tempdata.billprintdepts.length; j++) {
              if (k.code === tempdata.billprintdepts[j].deptcode) {
                k.children.push(
                  ...tempdata.billprintdepts[j].combines.map((item) => {
                    return {
                      code: item.key,
                      name: item.value,
                    };
                  })
                );
              }
            }
          }
        }
      });
      this.applyPrintTree = this.applyPrintTree.filter((k) => {
        return k.children.length > 0;
      });
      for (let i = 0; i < this.applyPrintTree.length; i++) {
        let map = new Map();
        for (let item of this.applyPrintTree[i].children) {
          map.set(item.code, item);
        }
        this.applyPrintTree[i].children = [...map.values()];
      }
      this.showApplyPrint = true;
    },
    // 解冻人员数据
    handleFreezeThawPeople() {
      let regidItems = this.chooseStaffList.map((k) => {
        return k.regid;
      });
      setPrintOrderNoFreeze(regidItems).then((res) => {
        this.$message.success(res.message);
        this.handleGetPrintOrderList();
      });
    },
    // 冻结人员数据
    handleFreezePeople() {
      let regidItems = this.chooseStaffList.map((k) => {
        return k.regid;
      });
      setPrintOrderFreeze(regidItems).then((res) => {
        this.$message.success(res.message);
        this.handleGetPrintOrderList();
      });
    },
    handleCheckedBarCodeOptions(value) {
      this.barCodeOptions = value;
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.barCodeItem.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.barCodeItem.length;
    },
    handleCheckAllChange(value) {
      this.barCodeOptions = value
        ? this.barCodeItem.map((k) => {
            return k.key;
          })
        : [];
      console.log(this.barCodeOptions);
      this.isIndeterminate = false;
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
      }).then(async (res) => {
        this.$message.success(res.message);
        this.showProject = false;
        await this.handleGetPrintOrderList();
        if (this.choosePeople) {
          await this.handleSetPrintOrderDetail();
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
      console.log(this.searchForm);
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] !== "" && this.searchForm[k] !== "0") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      if (this.conditionDate && this.conditionDate.length > 0) {
        switch (this.conditionDateText) {
          case "登记时间":
            whereitems.push({
              key: "startdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "enddate",
              value: this.conditionDate[1],
            });
            break;
          case "体检时间":
            whereitems.push({
              key: "startcheckdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "endcheckdate",
              value: this.conditionDate[1],
            });
            break;
          case "预约时间":
            whereitems.push({
              key: "startregisterdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "endregisterdate",
              value: this.conditionDate[1],
            });
            break;
          default:
            break;
        }
      }
      // if (this.searchForm.status == "0") {
      //   whereitems.push({
      //     key: "status",
      //     value: this.searchForm.status,
      //   });
      // }
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
          this.staffTableDataCopy = res.data.customeritems;
          this.loading = false;
          this.$nextTick(() => {
            this.$refs.staffTable.$refs.easyTable.clearSelection();
          });
        })
        .catch((err) => {
          this.checktotal = 0;
          this.checkingtotal = 0;
          this.checkedtotal = 0;
          this.count = 0;
          this.staffTableData = [];
          this.staffTableDataCopy = [];
          this.loading = false;
          this.$nextTick(() => {
            this.$refs.staffTable.$refs.easyTable.clearSelection();
          });
        });
    },
    // 切换公司单位下拉列表触发回调
    handleChangeCompany(data) {
      if (data) {
        this.searchForm.batch = "";
        this.staffTableData = [];
        this.staffTableDataCopy = [];
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
          this.groupitems = flag.groupitems;
        }
        this.searchForm.groupcode = "";
        this.staffTableData = [];
        this.staffTableDataCopy = [];
        this.projectTableData = [];
        this.handleGetPrintOrderList();
      } else {
        this.meccode = "";
        this.searchForm.groupcode = "";
        this.staffTableData = [];
        this.staffTableDataCopy = [];
        this.projectTableData = [];
        this.groupitems = [];
      }
      // 请求搜索条件集数据]
    },
    handleChangeGroup(value) {
      this.staffTableData = [];
      this.staffTableDataCopy = [];
      this.projectTableData = [];
      if (value != "") {
        let flag = this.groupitems.filter((k) => {
          return value === k.code;
        })[0];
        if (flag) {
          this.departitems = flag.departitems;
          this.departitem2s = flag.departitem2s;
        }
      } else {
        let flag = this.batchitems.filter((k) => {
          return this.searchForm.batch === k.code;
        })[0];
        this.departitems = flag.departitems;
        this.departitem2s = flag.departitem2s;
      }
      this.handleGetPrintOrderList();
      // 请求搜索条件集数据]
    },
    // 获取单位列表回调
    handleGetCompanyList() {
      company_archives.CompanyRegisterLoad().then((res) => {
        this.companyArr = res.data;
      });
      // getCompanyList().then((res) => {
      //   this.companyArr = res.data;
      // });
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
            this.groupitems = batchitems[selectIndex].groupitems;
            this.departitems = batchitems[selectIndex].departitems;
            this.departitem2s = batchitems[selectIndex].departitem2s;
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
    handleTableRowClassRed({ row, rowIndex }) {
      let stylejson = {};
      if (row.freeze == 1) {
        stylejson.color = "red !important";
        return stylejson;
      }
      return "";
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
      this.staffTableDataCopy = [];
    },
    // 打印条码
    handlePrintBarCode() {
      this.$refs.printorder.$children.forEach(async (d) => {
        if (d.$el.innerText == "打印条码单") {
          let close = 0;
          for (let i = 0; i < this.chooseStaffList.length; i++) {
            for (
              let j = 0;
              j < this.chooseStaffList[i].barcodecombines.length;
              j++
            ) {
              let index = this.barCodeOptions.findIndex((k) => {
                return k === this.chooseStaffList[i].barcodecombines[j].key;
              });
              if (index > -1) {
                let data = {
                  fingercode: localStorage.getItem("md5code"),
                  codes: [],
                  repname: d.$attrs["data-remark"],
                  printflag: 1,
                  whereitems: [
                    {
                      key: "regid",
                      value: this.chooseStaffList[i].regid,
                    },
                    {
                      key: "combinecode",
                      value: this.chooseStaffList[i].barcodecombines[j].key,
                    },
                  ],
                };
                await printStaticsBase64(data).then((res) => {
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
                  sleep(100); // 休眠100毫秒
                  close + 1;
                });
              }
            }
          }
          if (close == this.chooseStaffList.length - 1) {
            this.showBarCode = false;
            this.barCodeOptions = [];
            this.barCodeItem = [];
          }
          // this.chooseStaffList.forEach((k) => {
          //   let data = {
          //     fingercode: localStorage.getItem("md5code"),
          //     codes: [k.regid],
          //     repname: d.$attrs["data-remark"],
          //     printflag: 1,
          //     whereitems: [
          //       {
          //         key: "regid",
          //         value: k.regid,
          //       },
          //     ],
          //   };
          //   printBase64(data).then((res) => {
          //     this.lodop = getLodop();
          //     let printname = ``;
          //     if (res.data[0].printname == "") {
          //       printname = this.lodop.GET_PRINTER_NAME(-1);
          //     } else {
          //       printname = res.data[0].printname;
          //     }
          //     let printObj = new LodopPrinter(null, printname);
          //     let fileList = res.data.map((k) => {
          //       return k.base64String;
          //     });
          //     printObj.printBase64PdfReport(this.lodop, fileList);
          //   });
          // });
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
              codes: ["1561516"],
              repname: d.$attrs["data-remark"],
              printflag: 1,
              whereitems: [],
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
    // 一键打单回调
    async handlePrintOnekey() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印人员!");
        return false;
      }
      this.chooseStaffList = this.chooseStaffList.sort(function (a, b) {
        return a.seqno - b.seqno;
      });
      let tempcount = 0;
      let tempArr = [];
      for (let i = 0; i < this.chooseStaffList.length; i++) {
        tempcount = i;
        if (this.chooseStaffList[i].freeze == 1) {
          tempArr.push(this.chooseStaffList[i].name);
          continue;
        }
        await this.handlePrintOneKeyAs(this.chooseStaffList[i]);
        for (
          let j = 0;
          j < this.chooseStaffList[i].billprintdepts.length;
          j++
        ) {
          await this.handlePrintOneKeySq(
            this.chooseStaffList[i],
            this.chooseStaffList[i].billprintdepts[j]
          );
        }
      }
    },
    // 一键打单 - 申请单
    handlePrintOneKeySq(item, itemSon) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [],
            repname: item.meccode == 1 ? "科室申请单" : "科室申请单A5",
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: item.regid,
              },
              {
                key: "deptcode",
                value: itemSon.deptcode,
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
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 一键打单 - 指引单
    handlePrintOneKeyAs(item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname: item.meccode == 1 ? "1、高干团体指引单" : "1、团体指引单",
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
    // 打印指引单
    handlePrintGuidance() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印指引单人员!");
        return false;
      }
      this.$confirm(
        `当前执行打印指引单人员人数为 ${this.chooseStaffList.length} 是否进行打印`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        }
      )
        .then(() => {
          this.$refs.printorder.$children.forEach(async (d) => {
            if (d.$el.innerText == "打印指引单") {
              this.chooseStaffList = this.chooseStaffList.sort(function (a, b) {
                return a.seqno - b.seqno;
              });
              let tempcount = 0;
              let tempArr = [];
              let repname = "";
              for (let i = 0; i < this.chooseStaffList.length; i++) {
                tempcount = i;
                if (this.chooseStaffList[i].freeze == 1) {
                  tempArr.push(this.chooseStaffList[i].name);
                  continue;
                }
                if (this.chooseStaffList[i].meccode == "0") {
                  repname = "1、团体指引单";
                } else if (this.chooseStaffList[i].meccode == "1") {
                  repname = "1、高干团体指引单";
                } else if (this.chooseStaffList[i].meccode == "3") {
                  repname = "1、番禺团体指引单";
                } else {
                  repname = d.$attrs["data-remark"];
                }
                let data = {
                  fingercode: localStorage.getItem("md5code"),
                  codes: [this.chooseStaffList[i].regid],
                  repname,
                  printflag: 1,
                  whereitems: [
                    {
                      key: "regid",
                      value: this.chooseStaffList[i].regid,
                    },
                  ],
                };
                await printBase64(data).then((res) => {
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
              if (
                tempcount == this.chooseStaffList.length - 1 &&
                tempArr.length > 0
              ) {
                this.$message.warning(
                  `${tempArr.join("，")} 数据已冻结,已为您跳过!`
                );
              }
              // this.chooseStaffList.forEach((k) => {
              //   let data = {
              //     fingercode: localStorage.getItem("md5code"),
              //     codes: [k.regid],
              //     repname: d.$attrs["data-remark"],
              //     printflag: 1,
              //     whereitems: [
              //       {
              //         key: "regid",
              //         value: k.regid,
              //       },
              //     ],
              //   };
              //   printBase64(data).then((res) => {
              //     this.lodop = getLodop();
              //     let printname = ``;
              //     if (res.data[0].printname == "") {
              //       printname = this.lodop.GET_PRINTER_NAME(-1);
              //     } else {
              //       printname = res.data[0].printname;
              //     }
              //     let printObj = new LodopPrinter(null, printname);
              //     let fileList = res.data.map((k) => {
              //       return k.base64String;
              //     });
              //     printObj.printBase64PdfReport(this.lodop, fileList);
              //   });
              // });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
          let data = {
            fingercode: localStorage.getItem("md5code"),
            repname: d.$attrs["data-remark"],
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
    // 打印申请单-循环科室编码
    handlePrintApplyBatch() {
      if (this.chooseStaffList.length == 0) {
        this.$message.warning("请先选择需要打印申请单人员!");
        return false;
      }
      this.$refs.printorder.$children.forEach(async (d) => {
        if (d.$el.innerText == "打印申请单") {
          for (let i = 0; i < this.chooseStaffList.length; i++) {
            for (
              let j = 0;
              j < this.chooseStaffList[i].batchprintdepts.length;
              j++
            ) {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.chooseStaffList[i].regid],
                repname:
                  this.chooseStaffList[i].meccode == 1
                    ? "1、科室申请单"
                    : "1、科室申请单A5",
                // repname: d.$attrs["data-remark"],
                printflag: 1,
                whereitems: [
                  {
                    key: "deptcode",
                    value: this.chooseStaffList[i].batchprintdepts[j].deptcode,
                  },
                ],
              };
              await printBase64(data).then((res) => {
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
          }
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
        case "btnFreeze": // 冻结人员
          if (this.chooseStaffList.length == 0) {
            this.$message.warning("请先选择需要操作人员!");
            return false;
          }
          this.handleFreezePeople();
          break;
        case "btnFreezeThaw": // 解冻人员
          if (this.chooseStaffList.length == 0) {
            this.$message.warning("请先选择需要操作人员!");
            return false;
          }
          this.handleFreezeThawPeople();
          break;
        case "btnPlus": // 加项目
          this.updatetype = 0;
          this.handleProjectList();
          break;
        case "btnReduce": // 减项目
          this.updatetype = 1;
          this.handleProjectList();
          break;
        case "btnEditGroup": // 批量修改分组
          this.handleEditGroupDia();
          break;
        case "btnReset": // 重置页面
          this.$reload();
          break;
        case "btnDel": // 删除人员
          this.handleDelPeople();
          break;
        case "btnBarCode": // 打印条码
          if (this.chooseStaffList.length == 0) {
            this.$message.warning("请先选择需要打印条码单人员!");
            return false;
          }
          let tempArr = [];
          this.chooseStaffList.forEach((k) => {
            tempArr.push(...k.barcodecombines);
          });
          let map = new Map();
          for (let item of tempArr) {
            map.set(item.key, item);
          }
          this.barCodeItem = [...map.values()];
          if (this.barCodeItem.length == 0) {
            this.$message.warning("暂无条码打印");
            return false;
          }
          this.showBarCode = true;
          // this.handlePrintBarCode();
          break;
        case "btnGuidance": // 打印指引单
          this.handlePrintGuidance();
          break;
        case "btnOnekey": // 一键打单
          this.handlePrintOnekey();
          break;
        case "btnGuidanceTemp": // 打印指引单模板
          this.handlePrintGuidanceTemp();
          break;
        case "btnApply": // 打印申请单
          this.handlePrintApplyBatch();
          // this.handlePrintApply();
          break;
        case "btnApplyCheck": // 打印申请单
          this.handlePrintApplyCheck();
          break;
        case "btnHealthCertificate": // 打印健康证
          this.handleHealthCertificate();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnLabel": // 标签
          if (this.chooseStaffList.length == 0) {
            this.$message.warning("请先选择需要打印申请单人员!");
            return false;
          }
          this.$refs.printorder.$children.forEach(async (d) => {
            if (d.$el.innerText == "标签打印") {
              this.chooseStaffList = this.chooseStaffList.sort(function (a, b) {
                return a.seqno - b.seqno;
              });
              for (let i = 0; i < this.chooseStaffList.length; i++) {
                let data = {
                  fingercode: localStorage.getItem("md5code"),
                  codes: [this.chooseStaffList[i].regid],
                  repname: d.$attrs["data-remark"],
                  printflag: 1,
                  whereitems: [
                    {
                      key: "regid",
                      value: this.chooseStaffList[i].regid,
                    },
                  ],
                };
                await printBase64(data).then((res) => {
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
            }
          });
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
<style lang="scss" scoped>
@import "./css/index.scss";
.screen_box {
  display: flex;
  align-items: center;
  margin-left: 8px;
  .el-input {
    width: 100px;
  }
  > span {
    margin: 0 8px;
  }
}
.el-popover {
  .content {
    .content_item {
      height: 20px;
      margin-bottom: 3px;
      padding: 0 10px;
      cursor: pointer;
    }
    .content_item:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }
  }
  .print_item {
    margin-bottom: 3px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .print_item:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
.staff_table {
  .warning_red {
    color: red !important;
  }
}
</style>
