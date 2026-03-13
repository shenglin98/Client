<template>
  <div class="report_search">
    <!-- 头部操作控件 -->
    <!-- <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="fullsearch" ref="reportsearch" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
    </sticky> -->
    <div class="filter-container">
      <div v-for="(btn, index) of buttons" :key="index">
        <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId)" class="print_box" placement="bottom" trigger="click">
          <el-button type="primary" plain slot="reference" :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
          <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">
            打印
          </div>
          <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
        </el-popover>
        <el-button v-else type="primary" :ref="btn.domId" plain :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="subject">
      <el-row class="bg_white">
        <!-- 左侧查询条件 -->
        <el-col class="form_box" :span="6">
          <div class="head">
            <div class="logo"></div>
            检索条件
          </div>
          <el-form ref="form" :model="searchForm">
            <el-form-item class="checkup_date" size="mini">
              <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                <div class="content">
                  <div class="content_item" v-for="item in checkupDateArr" :key="item.code" @click="handleSelectConditionDate(item)">
                    {{ item.name }}
                  </div>
                </div>
                <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ dateName }}</el-button>
              </el-popover>
              <el-date-picker @change="handleChangeDate" clearable size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">体检中心</div>
              <el-select v-model="searchForm.meccode" clearable @change="handleSearchPageTable">
                <el-option v-for="(item, index) in meccodeitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="btn_group" size="mini">
              <div class="group_item">
                <el-radio-group v-model="searchForm.normaltype" size="small" @change="handleSearchPageTable">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="1">异常</el-radio-button>
                  <el-radio-button label="0">正常</el-radio-button>
                </el-radio-group>
                <!-- <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="(searchForm.normaltype = ''), handleSearchPageTable()"
                  >全部</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.normaltype = '1'), handleSearchPageTable()
                  "
                  >异常</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.normaltype = '0'), handleSearchPageTable()
                  "
                  >正常</el-button
                > -->
              </div>
              <div class="group_item">
                <el-radio-group v-model="searchForm.persontype" size="small" @change="handleSearchPageTable">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="0">个检</el-radio-button>
                  <el-radio-button label="1">团检</el-radio-button>
                </el-radio-group>
                <!-- <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="(searchForm.persontype = ''), handleSearchPageTable()"
                  >全部</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.persontype = '0'), handleSearchPageTable()
                  "
                  >个检</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.persontype = '1'), handleSearchPageTable()
                  "
                  >团检</el-button> -->
              </div>
              <div class="group_item">
                <el-radio-group v-model="searchForm.reportprintflag" size="small" @change="handleSearchPageTable">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="0">未打印</el-radio-button>
                  <el-radio-button label="1">已打印</el-radio-button>
                </el-radio-group>
                <!-- <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.reportprintflag = ''), handleSearchPageTable()
                  "
                  >全部</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.reportprintflag = '0'), handleSearchPageTable()
                  "
                  >未打印</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.reportprintflag = '1'), handleSearchPageTable()
                  "
                  >已打印</el-button
                > -->
              </div>
              <div class="group_item vbh">
                <el-radio-group v-model="searchForm.bindingflag" size="small" @change="handleSearchPageTable">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="0">未装订</el-radio-button>
                  <el-radio-button label="1">已装订</el-radio-button>
                </el-radio-group>
                <!-- <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.bindingflag = ''), handleSearchPageTable()
                  "
                  >全部</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.bindingflag = '0'), handleSearchPageTable()
                  "
                  >未装订</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.bindingflag = '1'), handleSearchPageTable()
                  "
                  >已装订</el-button
                > -->
              </div>
              <div class="group_item vbh">
                <el-radio-group v-model="searchForm.provideflag" size="small" @change="handleSearchPageTable">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="0">未发布</el-radio-button>
                  <el-radio-button label="1">已发布</el-radio-button>
                </el-radio-group>
                <!-- <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.provideflag = ''), handleSearchPageTable()
                  "
                  >全部</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.provideflag = '0'), handleSearchPageTable()
                  "
                  >未发布</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="
                    (searchForm.provideflag = '1'), handleSearchPageTable()
                  "
                  >已发布</el-button
                > -->
              </div>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">体检号</div>
              <el-input v-model="pageRegid" @clear="handleSearchPageStatic" clearable @keyup.native.enter="handleSearchPageStatic"></el-input>
              <!-- <el-input
                v-model="searchForm.regid"
                @clear="handleSearchPageTable"
                clearable
                @keyup.native.enter="handleSearchPageTable"
              ></el-input> -->
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">姓名</div>
              <el-input v-model="searchForm.name" @clear="handleSearchPageTable" clearable @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">身份证</div>
              <el-input v-model="searchForm.idcard" @clear="handleSearchPageTable" clearable @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">HIS标识</div>
              <el-input v-model="searchForm.hiscode" @clear="handleSearchPageTable" clearable @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">电话</div>
              <el-input v-model="searchForm.telephone" @clear="handleSearchPageTable" clearable @keyup.native.enter="handleSearchPageTable"></el-input>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">团检名称</div>
              <el-select v-model="searchForm.companycode" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in companyitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">批次</div>
              <el-select v-model="searchForm.batch" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">团检分组</div>
              <el-select v-model="searchForm.groupcode" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">状态</div>
              <el-select v-model="searchForm.status" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in statusitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">报告模板</div>
              <el-select v-model="searchForm.reporttype" clearable filterable @change="handleChangeCompany">
                <el-option v-for="(item, index) in reporttypeitems" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右侧表格展示数据 -->
        <el-col class="table_box" :span="18">
          <div class="head">
            <div class="logo"></div>
            数据列表
          </div>
          <!-- <EasyTable
            row-id="regid"
            ref="pageTable"
            class="page_table"
            height="100%"
            :data="pageData"
            :tableOptions="pageOptions"
            :checkbox-config="{ rowClick: true, fetchVal: true }"
            @selected-change="handleSelectPeople"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          /> -->
          <div class="page_table">
            <vxe-table ref="pageTable" height="auto" border="inner" highlight-hover-row :data="pageData" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="regid">
              <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
              <vxe-table-column field="provideflag" title="发布状态" width="120px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.provideflag == 0 ? "未发放" : "已发放"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="normaltype" title="报告状态" width="120px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span>{{ scope.row.normaltype == 1 ? "异常" : "正常" }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="statusname" title="体检状态" min-width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <div>
                    <span v-show="scope.row.status == 0">已登记</span>
                    <span v-show="scope.row.status == 1">已预约</span>
                    <span v-show="scope.row.status == 2">已签到</span>
                    <span v-show="scope.row.status == 3">体检中</span>
                    <span v-show="scope.row.status == 4">已交表</span>
                    <span v-show="scope.row.status == 5">可总检</span>
                    <span v-show="scope.row.status == 6">已总检</span>
                    <span style="color: red" v-show="scope.row.status == 7">
                      已审核
                    </span>
                  </div>
                </template>
              </vxe-table-column>
              <vxe-table-column field="providedate" title="发布日期" width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="regid" title="体检号" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="checkno" title="档案号" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="name" title="姓名" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="sex" title="性别" width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="年龄" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="telephone" title="手机号" width="150px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="idcard" title="身份证号" min-width="200px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="regdate" title="登记日期" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="companyname" title="单位" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column title="操作" min-width="150px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <el-link v-for="(item, index) in scope.row.operateitems" :key="index" style="margin-right: 8px" :type="
                      index == 0
                        ? 'primary'
                        : index == 1
                        ? 'warning'
                        : 'success'
                    " @click="handleJumpPage(scope.row, item)">
                    {{ item.name }}
                  </el-link>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5000, 10000, 30000, 50000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <!-- 扫描操作弹框 -->
    <el-dialog class="scan_box" :show-close="false" :visible.sync="dialogVisible" width="60%" @close="handleCloseDialog">
      <!-- 头部按钮组 -->
      <div class="btn_group">
        <el-button size="mini" type="primary" @click="handleGetBatchHandleDialog('Handle')">确认</el-button>
        <el-button size="mini" type="danger" @click="handleGetBatchHandleDialog('Cancle')">取消操作</el-button>
        <!-- <el-button size="mini" type="warning">清空</el-button>
        <el-button size="mini" type="success">导出</el-button> -->
        <el-button size="mini" type="danger" @click="handleCloseDialog">关闭</el-button>
      </div>
      <!-- 中间操作控件 -->
      <div class="btn_input">
        <div class="head">操作类型</div>
        <div class="btn_input_box">
          <div class="btn">
            <el-button size="mini" type="warning" @click="BatchHandleFlag = 'Binding'">装订</el-button>
            <el-button size="mini" type="primary" @click="BatchHandleFlag = 'Provide'">发布</el-button>
          </div>
          <div class="checkno">
            <el-button type="primary" style="width: 80px" size="mini">档案号</el-button>
            <el-input size="mini" clearable @clear="handleInputWork" @keyup.enter.native="handleInputWork" v-model="searchForm.checkno" placeholder="请输入档案号"></el-input>
          </div>
        </div>
      </div>
      <!-- 表格数据列表 -->
      <EasyTable row-id="checkno" ref="dialogTable" class="dialog_table" height="calc(100vh - 400px)" :data="dialogData" :tableOptions="dialogOptions" :checkbox-config="{ rowClick: true, fetchVal: true }" @selected-change="handleSelectDialog" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import {
  getLoadSearchInfo,
  getBatch,
  getPageList,
  getExportFile,
  getBatchHandle,
} from "@/api/reportsearch.js";
import { printBase64 } from "@/api/printreport.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import { mapGetters } from "vuex";
import * as userlogin from "@/api/login";
import { printStaticsBase64 } from "@/api/printreport.js";

export default {
  name: "reportsearch",
  props: {
    size: {
      type: String,
      default: "mini",
    },
  },
  components: { Sticky, permissionBtn },
  data() {
    return {
      dateName: "打印日期",
      dateCode: "printdate",
      checkupDateArr: [
        { code: "printdate", name: "打印日期" },
        { code: "providedate", name: "发布时间" },
      ],
      searchForm: {
        regid: "",
        idcard: "",
        hiscode: "",
        name: "",
        meccode: "",
        status: "",
        persontype: "",
        companycode: "",
        groupcode: "",
        batch: "",
        telephone: "",
        reporttype: "",
        reportprintflag: "",
        bindingflag: "",
        provideflag: "",
        normaltype: "",
      }, // 检索条件表单
      pageRegid: "",
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字
      conditionDate: "", //检索体检日期
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
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
      pageData: [], // 主页表格列表人员数据
      dialogData: [], // 主页弹框表格列表人员数据
      meccodeitems: [], // 体检中心集合
      companyitems: [], // 公司集合
      batchitems: [], // 批次集合
      groupitems: [], // 组合集合
      statusitems: [], // 状态集合
      reporttypeitems: [], // 报告类型集合
      selectArr: [], // 表格选中人员
      selectDialogArr: [], // 表格选中人员
      loddp: "",
      BatchHandleFlag: "", // 当前为装订还是发布
      buttons: [],
      domIdArr: [
        "btnGuide",
        "btnPaySingle",
        "btnLabel",
        "btnBarCode",
        "btnReport",
      ],
      dialogVisible: false, // 扫描弹框
      currentPage: 1,
      pageSize: 50000,
      count: 0,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    // 主页表格列表人员数据
    pageOptions() {
      return [
        {
          type: "selection",
          width: 45,
          align: "center",
        },
        {
          title: "体检号",
          prop: "regid",
          width: 120,
          align: "center",
          omit: 1,
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 120,
          align: "center",
          omit: 1,
        },
        {
          title: "姓名",
          prop: "name",
          width: 85,
          align: "center",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 85,
          align: "center",
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          width: 85,
          omit: 1,
          align: "center",
          returnVal: (value) => {
            return `${value}  岁`;
          },
        },
        {
          title: "手机号",
          omit: 1,
          width: 150,
          prop: "telephone",
          align: "center",
        },
        {
          title: "身份证号",
          omit: 1,
          prop: "idcard",
          align: "center",
        },
        {
          title: "登记日期",
          omit: 1,
          prop: "regdate",
          align: "center",
          width: 120,
        },
        {
          title: "团检",
          omit: 1,
          prop: "companyname",
          width: 180,
          align: "center",
        },
        {
          title: "状态",
          width: 85,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>已登记</span>
                <span v-show={data.status == 1}>已预约</span>
                <span v-show={data.status == 2}>已签到</span>
                <span v-show={data.status == 3}>体检中</span>
                <span v-show={data.status == 4}>已交表</span>
                <span v-show={data.status == 5}>可总检</span>
                <span v-show={data.status == 6}>已总检</span>
                <span style="color: red" v-show={data.status == 7}>
                  已审核
                </span>
              </div>
            );
          },
        },
        {
          title: "操作",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div style="width:100%;display: flex;justify-content: space-around;">
                {data.operateitems.map((item, index) => {
                  let style =
                    index == 0 ? "primary" : index == 1 ? "warning" : "success";
                  return (
                    <el-link
                      type={style}
                      vOn:click_stop_prevent={() =>
                        this.handleJumpPage(data, item)
                      }
                    >
                      {item.name}
                    </el-link>
                  );
                })}
              </div>
            );
          },
        },
      ];
    },
    dialogOptions() {
      return [
        {
          type: "selection",
          width: 45,
          align: "center",
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 120,
          align: "center",
          omit: 1,
        },
        {
          title: "姓名",
          prop: "name",
          width: 85,
          align: "center",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 85,
          align: "center",
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          width: 85,
          omit: 1,
          align: "center",
          returnVal: (value) => {
            return `${value}  岁`;
          },
        },
        {
          title: "手机号",
          omit: 1,
          width: 150,
          prop: "telephone",
          align: "center",
        },
        {
          title: "身份证号",
          omit: 1,
          prop: "idcard",
          align: "center",
        },
        {
          title: "团检",
          omit: 1,
          prop: "companyname",
          width: 180,
          align: "center",
        },
        {
          title: "状态",
          prop: "statusname",
          width: 85,
          omit: 1,
          align: "center",
        },
        {
          title: "操作",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div style="width:100%;display: flex;justify-content: space-around;">
                {data.operateitems.map((item, index) => {
                  let style =
                    index == 0 ? "primary" : index == 1 ? "warning" : "success";
                  return (
                    <el-link
                      type={style}
                      vOn:click_stop_prevent={() =>
                        this.handleJumpPage(data, item)
                      }
                    >
                      {item.name}
                    </el-link>
                  );
                })}
              </div>
            );
          },
        },
      ];
    },
  },
  mounted() {
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    this.handleGetPrintDate();
  },

  methods: {
    async handlePrintReport() {
      let d = this.$refs.btnPrint[0];
      if (d.$el.innerText == "打印") {
        let indexP = d.$attrs["data-remark"].split("、")[0] + "、";
        let repname = "";
        for (let i = 0; i < this.selectArr.length; i++) {
          let item = this.selectArr[i];
          if (
            item.meccode == 0 &&
            item.companytype.toLowerCase().indexOf("vip") > -1
          ) {
            if (item.checktype == "1") {
              repname = `${indexP}报告书`;
            } else if (item.checktype == "2") {
              repname = `${indexP}入职报告书`;
            } else {
              repname = `${indexP}团体报告书`;
            }
          } else if (item.meccode == 1) {
            repname = `${indexP}高干报告书`;
          } else if (item.meccode == 3) {
            repname = `${indexP}番禺报告书`;
          } else {
            if (item.personalflag == 1) {
              repname = `${indexP}团体报告书`;
            } else {
              if (item.checktype == 2) {
                repname = `${indexP}入职报告书`;
              } else {
                repname = d.$attrs["data-remark"];
              }
            }
          }
          await this.handlePrintReportAsync(item, repname);
        }
      }
    },
    handlePrintReportAsync(item, repname) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            repname,
            designtype: repname.includes("F") ? "fast" : "dev",
            printflag: 1,
            whereitems: [],
          };
          console.log("222");
          printBase64(data).then((res) => {
            console.log("333");
            this.pageData.forEach((k, index) => {
              if (item.regid === k.regid) {
                k.reportprintflag = 1;
                k.reportprintdate = new Date(+new Date() + 8 * 3600 * 1000)
                  .toJSON()
                  .substr(0, 19)
                  .replace("T", " ");
              }
            });
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
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.dateName = val.name;
      this.dateCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 通过Regid检索当前页面数据回调
    handleSearchPageStatic() {
      // this.selectArr = [];
      // this.$refs.pageTable.clearCheckboxRow();
      if (!this.pageRegid.trim()) {
        this.pageRegid = "";
        return;
      }
      let index = this.pageData.findIndex((k) => {
        return k.regid === this.pageRegid.trim();
      });
      if (index > -1) {
        let temp = this.pageData.splice(index, 1);
        if (!temp[0]) return;
        this.pageData.unshift(temp[0]);
        this.$refs.pageTable.setCheckboxRow(temp[0], true);
        this.selectArr.push(temp[0]);
      }
      this.pageRegid = "";
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
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_ReportSearch_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.conditionDate = [this.gettime(start), this.gettime(end)];
        // this.searchForm.startdate = this.gettime(start);
        // this.searchForm.enddate = this.gettime(end);
        // this.handleSearchPageTable();
        //   页面加载 加载搜索条件集
        this.handleGetLoadSearchInfo();
      });
    },
    gettime(data) {
      let value =
        data.getFullYear() +
        "-" +
        this.checkTime(data.getMonth() + 1) +
        "-" +
        this.checkTime(data.getDate());
      return value;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleSearchPageTable();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleSearchPageTable();
    },
    // 预览窗口关闭
    handleCloseDialog() {
      this.BatchHandleFlag = "";
      this.selectDialogArr = [];
      this.dialogData = [];
      this.dialogVisible = false;
    },
    // 批量装订、发放更新回调
    handleGetBatchHandle(value) {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行操作",
          type: "error",
        });
        return false;
      }
      let regiditems = [];
      let checknoitems = [];
      let tispName = [];
      if (this.BatchHandleFlag == "Provide" && value) {
        for (let i = 0; i < this.selectArr.length; i++) {
          if (this.selectArr[i].provideflag != 0) {
            regiditems.push(this.selectArr[i].regid);
            checknoitems.push(this.selectArr[i].checkno);
          } else {
            tispName.push(this.selectArr[i].name);
          }
        }
        tispName.length > 0 &&
          this.$message.warning(
            `${tispName.join(",")} 等体检人的报告书已经取消交接,已为你跳过!`
          );
        if (regiditems.length == 0) {
          return;
        }
      } else if (this.BatchHandleFlag == "Provide") {
        for (let i = 0; i < this.selectArr.length; i++) {
          if (this.selectArr[i].provideflag == 0) {
            regiditems.push(this.selectArr[i].regid);
            checknoitems.push(this.selectArr[i].checkno);
          } else {
            tispName.push(this.selectArr[i].name);
          }
        }
        tispName.length > 0 &&
          this.$message.warning(
            `${tispName.join(",")} 等体检人的报告书已经交接,已为你跳过!`
          );
        if (regiditems.length == 0) {
          return;
        }
      } else {
        regiditems = this.selectArr.map((k) => {
          return k.regid;
        });
        checknoitems = this.selectArr.map((k) => {
          return k.checkno;
        });
      }
      let data = {
        regiditems,
        checknoitems,
        handletype: this.BatchHandleFlag,
        updatetype: value || "Handle",
      };
      if ((this.BatchHandleFlag = "Normal")) {
        let regidnormaltypeitems = this.selectArr.map((k) => {
          return {
            regid: k.regid,
            normaltype: k.normaltype,
          };
        });
        data["regidnormaltypeitems"] = regidnormaltypeitems;
      }
      getBatchHandle(data).then((res) => {
        this.$message.success(res.message);
        this.BatchHandleFlag = "";
        this.selectArr = [];
        this.handleSearchPageTable();
      });
      // 弹框判断-发布
      // if (this.BatchHandleFlag == "Provide" && !value) {
      //   let nextFlag = false;
      //   for (let i = 0; i < this.selectArr.length; i++) {
      //     const item = this.selectArr[i];
      //     if (item.reportprintcount >= 2 && item.meccode == 3) {
      //     }
      //   }
      // } else {
      //   getBatchHandle(data).then((res) => {
      //     this.$message.success(res.message);
      //     this.BatchHandleFlag = "";
      //     this.selectArr = [];
      //     this.handleSearchPageTable();
      //   });
      // }
    },
    // 按钮点击页面跳转回调
    handleJumpPage(data, item) {
      if (!item) return false;
      if (item.code == "CustomerRegister") {
        jumpRouteLink(this, "personalregister");
        this.$router.push({
          path: `/personalregister/${this.Hospitals}`,
          query: { regid: data.regid },
        });
      } else if (item.code == "DepartCheck") {
        jumpRouteLink(this, "customerResult");
        this.$router.push({
          path: `/customerResult/${this.Hospitals}`,
          query: { regid: data.regid },
        });
      } else if (item.code == "TotalCheck") {
        jumpRouteLink(this, "totalcheck");
        this.$router.push({
          path: `/totalcheck/${this.Hospitals}`,
          query: { regid: data.regid },
        });
      }
    },
    // 批量装订、发放更新回调
    handleGetBatchHandleDialog(updatetype) {
      if (this.BatchHandleFlag == "") {
        this.$message({
          showClose: true,
          message: "请选择装订/发布操作",
          type: "error",
        });
        return false;
      }
      if (this.selectDialogArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行操作",
          type: "error",
        });
        return false;
      }
      let regiditems = [];
      this.dialogData.forEach((k) => {
        if (this.selectDialogArr.includes(k.checkno)) {
          regiditems.push(k.regid);
        }
      });
      getBatchHandle({
        regiditems,
        checknoitems: this.selectDialogArr,
        handletype: this.BatchHandleFlag,
        updatetype: updatetype,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleCloseDialog();
      });
    },
    // 文件导出回调
    handleGetExportFile() {
      let regidsin = this.selectArr.map((k) => {
        return k.regid;
      });
      let data = {
        repname: "报告管理数据导出模板",
        filetype: "devxlsx",
        outtype: "url",
        designtype: "dev",
        whereitems: [
          {
            key: "regidsin",
            valueList: regidsin,
          },
        ],
      };
      printStaticsBase64(data).then((res) => {
        if (res.data != undefined && res.data != null && res.data != "") {
          if (!res.data) return;
          const link = document.createElement("a"); //创建下载a标签
          link.href = res.data[0].fileurl;
          link.style.display = "none"; //默认隐藏元素
          document.body.appendChild(link); // body中添加元素
          link.click(); // 执行点击事件
          document.body.removeChild(link); //下载完成后移除元素
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error",
          });
        }
      });
      // let whereitems = [];
      // Object.keys(this.searchForm).forEach((item) => {
      //   if (this.searchForm[item] && item != "batch") {
      //     whereitems.push({
      //       key: item,
      //       value: this.searchForm[item],
      //     });
      //   }
      // });
      // getExportFile({
      //   apicontrol: "ReportSearch",
      //   apimethod: "Load",
      //   whereitems,
      // }).then((res) => {
      //   window.open(res.result);
      // });
    },
    // 打印指引单
    handlePrintGuide() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      this.$refs.reportsearch.$children.forEach((d) => {
        if (d.$el.innerText == "指引单") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$attrs["data-remark"],
            whereitems: [],
          };
          this.$axios.post("/api-proxy/PrintReport/", data).then((res) => {
            this.loddp = getLodop();
            console.log(res);
            this.loddp.NewPage();
            this.loddp.SET_PRINTER_INDEX(
              res.data.data[0].printname == ""
                ? loddp.GET_PRINTER_NAME(-1)
                : res.data.data[0].printname
            );
            this.loddp.ADD_PRINT_PDF(
              0,
              0,
              "100%",
              "100%",
              encodeURI(res.data.data[0].fileurl)
            );
            this.loddp.PRINT();
          });
        }
      });
    },
    // 打印标签单
    handlePrintLabel() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出标签",
          type: "error",
        });
        return false;
      }
    },
    // 人员列表选中数据回调
    handleSelectPeople({ records }) {
      console.log(records);
      this.selectArr = records;
    },
    handleSelectPeopleAll({ records }) {
      this.selectArr = records;
    },
    // 人员列表选中数据回调
    handleSelectDialog(arr) {
      console.log(arr);
      this.selectDialogArr = arr;
    },
    // 主页列表数据搜索
    handleSearchPageTable() {
      this.handleGetPageList();
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
    // 列表表格数据查询回调
    handleGetPageList() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item]) {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      if (this.conditionDate && this.conditionDate.length > 0) {
        switch (this.dateCode) {
          case "printdate":
            whereitems.push({
              key: "startdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "enddate",
              value: this.conditionDate[1],
            });
            break;
          case "providedate":
            whereitems.push({
              key: "startprovidedate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "endprovidedate",
              value: this.conditionDate[1],
            });
            break;
          default:
            break;
        }
      }
      getPageList({
        page: 1,
        limit: 1000000,
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        if (!res.data) {
          this.count = 0;
          this.pageData = [];
          return;
        }
        // if (res.data.length == 1) {
        //   this.$refs.pageTable.setCheckboxRow(res.data, true);
        //   this.selectArr = res.data;
        // }
        this.count = res.count;
        this.pageData = res.data;
      });
      this.searchForm.regid = "";
    },
    // 单位下拉列表改变值触发回调
    handleChangeCompany() {
      this.handleGetBatch();
    },
    handleChangeCompany(data) {
      if (data) {
        this.handleGetBatch();
      } else {
        this.searchForm.batch = "";
        this.handleSearchPageTable();
      }
    },
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { meccodeitems, companyitems, statusitems, reporttypeitems } =
          res.result;
        this.meccodeitems = meccodeitems; // 体检中心集合
        this.companyitems = companyitems; // 公司集合
        this.statusitems = statusitems; // 状态集合
        this.reporttypeitems = reporttypeitems; // 报告类型集合
        // 数据回填
        let meccode = meccodeitems.filter((k) => k.selected)[0];
        meccode && (this.searchForm.meccode = meccode.code);
        let company = companyitems.filter((k) => k.selected)[0];
        company && (this.searchForm.company = company.code);
        let status = statusitems.filter((k) => k.selected)[0];
        status && (this.searchForm.status = status.code);
        let reporttype = reporttypeitems.filter((k) => k.selected)[0];
        reporttype && (this.searchForm.reporttype = reporttype.code);
        this.$nextTick(() => {
          // 获取当前体检中心
          userlogin.GetMyOrgs().then((response) => {
            if (response.result.meccode) {
              this.searchForm.meccode = response.result.meccode;
              //this.handleSearchPageTable();
            }
          });
        });
      });
    },
    // 选择单位请求批次号回调
    handleGetBatch() {
      getBatch({ companycode: this.searchForm.companycode }).then((res) => {
        console.log(res.result);
        this.searchForm.batch = ""; // 重置批次号
        let { batchitems } = res.result;
        this.batchitems = batchitems;
        let selectIndex = batchitems.findIndex((k) => k.selected);
        console.log(selectIndex);
        if (selectIndex > -1) {
          this.searchForm.batch = batchitems[selectIndex].code;
          this.groupitems = batchitems[selectIndex].groupitems;
          let group = batchitems[selectIndex].groupitems.filter(
            (k) => k.selected
          )[0];
          group && (this.searchForm.groupcode = group.code);
        }
      });
      this.handleSearchPageTable();
    },
    // 收入检索身份证/条件号等回调
    handleInputWork() {},
    // 点击检索条件筛选全部回调
    handleChangeDate(arr) {
      if (arr) {
        this.conditionDate = arr;
      } else {
        this.conditionDate = [];
      }

      this.handleSearchPageTable();
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.key;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询主页列表数据
          this.handleSearchPageTable();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnPrint": // 打印
          console.log(this.$refs);
          this.handlePrintReport();
          return;
          this.selectArr.forEach((value) => {
            let data = {
              fingercode: localStorage.getItem("md5code"),
              codes: [value.regid],
              repname: "1、报告书",
              printflag: 1,
              whereitems: [],
            };
            printBase64(data).then((res) => {
              this.selectArr.forEach((item) => {
                this.pageData.forEach((k, index) => {
                  if (item === k.regid) {
                    console.log(k.name);
                    k.reportprintflag = 1;
                    k.reportprintdate = new Date(+new Date() + 8 * 3600 * 1000)
                      .toJSON()
                      .substr(0, 19)
                      .replace("T", " ");
                  }
                });
              });
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
          break;
        case "btnGuide": // 指引单
          this.handlePrintGuide();
          break;
        case "btnLabel": // 标签
          this.$reload();
          break;
        case "btnExport1": // 导出
          if (this.selectArr.length == 0) {
            this.$message({
              showClose: true,
              message: "请选择人员再进行操作",
              type: "error",
            });
            return false;
          }
          this.handleGetExportFile();
          break;
        case "btnBinDing": // 装订
          this.BatchHandleFlag = "Binding";
          this.handleGetBatchHandle();
          break;
        case "btnRelease": // 发布
          this.BatchHandleFlag = "Provide";
          this.handleGetBatchHandle();
          break;
        case "btnReleaseCancle": // 取消发布
          this.BatchHandleFlag = "Provide";
          this.handleGetBatchHandle("Cancle");
          break;
        case "btnNormal": // 异常
          this.BatchHandleFlag = "Normal";
          this.handleGetBatchHandle();
          break;
        case "btnNormalCancle": // 异常
          this.BatchHandleFlag = "Normal";
          this.handleGetBatchHandle("Cancle");
          break;
        case "btnScan": // 扫描操作
          if (this.pageData.length == 0) {
            this.$message({
              showClose: true,
              message: "请加载列表数据",
              type: "error",
            });
            return false;
          }
          this.dialogVisible = true;
          this.dialogData = this.pageData;
          break;
        default:
          break;
      }
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>