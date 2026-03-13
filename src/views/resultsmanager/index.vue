<template>
  <div class="full_search">
    <!-- 头部操作控件 -->
    <!-- <sticky :className="'sub-navbar'">
          <div class="filter-container">
            <permission-btn moduleName="fullsearch" ref="fullsearch" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
            <el-popover class="print_box" placement="bottom" trigger="click">
              <el-button class="print_btn" size="mini" slot="reference" type="primary">打印预览</el-button>
              <div class="print_item" v-for="(item,index) in printArr" :key="index">{{item.name}}</div>
            </el-popover>
          </div>
        </sticky> -->
    <div class="filter-container">
      <div v-for="(btn, index) of buttons" :key="index">
        <el-popover
          ref="popoverRefIdc"
          v-if="domIdArr.includes(btn.domId)"
          class="print_box"
          placement="bottom"
          trigger="click"
        >
          <el-button
            type="primary"
            plain
            slot="reference"
            :size="size"
            v-bind:key="btn.Id"
            v-bind:data-remark="btn.remark"
            class="filter-item"
            ><i :class="`iconfont icon-${btn.icon}`"></i
            >{{ btn.name }}</el-button
          >
          <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">
            打印
          </div>
          <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
          <div
            class="print_item"
            v-if="btn.name == '报告书'"
            @click="handleSelectPrint(btn.domId)"
          >
            选页打印
          </div>
        </el-popover>
        <el-button
          type="primary"
          plain
          v-else
          :size="size"
          v-bind:key="btn.Id"
          v-bind:data-remark="btn.remark"
          class="filter-item"
          @click="hadnleOnBtnClicked(btn.domId)"
          ><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button
        >
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="subject">
      <el-row class="bg_white">
        <!-- 左侧查询条件 -->
        <el-col class="form_box" :span="5">
          <div class="head">
            <div class="logo"></div>
            检索条件
          </div>
          <el-form ref="form" :model="searchForm">
            <el-form-item class="checkup_code" size="mini">
              <el-button
                plain
                type="primary"
                style="min-width: 80px"
                size="mini"
                >体检号</el-button
              >
              <el-input
                size="mini"
                clearable
                ref="checkupWorkInput"
                @clear="handleSearchPageTable"
                v-model="searchForm.regid"
                placeholder="请输入体检号"
                @keyup.native.enter="handleEnterRegid"
              ></el-input>
            </el-form-item>
            <el-form-item class="checkup_date" size="mini">
              <el-popover
                ref="popoverRef"
                placement="bottom-start"
                trigger="click"
              >
                <div class="content">
                  <div
                    class="content_item"
                    v-for="item in checkupDateArr"
                    :key="item.code"
                    @click="handleSelectConditionDate(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <el-button
                  type="primary"
                  plain
                  style="width: 80px"
                  size="mini"
                  slot="reference"
                  >{{ dateName }}</el-button
                >
              </el-popover>
              <el-date-picker
                @change="handleChangeDate"
                @clear="handleSearchPageTable"
                size="mini"
                v-model="conditionDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <!-- <el-button plain type="primary" size="mini">登记日期</el-button>
                <el-date-picker
                  @change="handleChangeDate"
                  @clear="handleSearchPageTable"
                  size="mini"
                  v-model="conditionDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                >
                </el-date-picker> -->
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">体检中心</div>
              <el-select
                v-model="searchForm.meccode"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option
                  v-for="(item, index) in meccodeitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">数据来源</div>
              <el-select
                v-model="dataSources"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option label="旧体检系统" :value="1"></el-option>
                <el-option label="新体检系统" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">体检性质</div>
              <el-select
                v-model="searchForm.persontype"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option label="全部" :value="''"></el-option>
                <el-option label="个检" :value="'0'"></el-option>
                <el-option label="团检" :value="'1'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">小结结果状态</div>
              <el-select
                v-model="searchForm.conclusionstatus"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="未完成" :value="0"></el-option>
                <el-option label="已完成" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item class="btn_group" size="mini">
                <el-button
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
                  @click="(searchForm.persontype = '0'), handleSearchPageTable()"
                  >个检</el-button
                >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                  @click="(searchForm.persontype = '1'), handleSearchPageTable()"
                  >团检</el-button
                >
              </el-form-item> -->
            <el-form-item class="input" size="mini">
              <div class="form_label">姓名</div>
              <el-input
                v-model="searchForm.name"
                clearable
                @clear="handleSearchPageTable"
                @keyup.native.enter="handleSearchPageTable"
              ></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">身份证</div>
              <el-input
                v-model="searchForm.idcard"
                clearable
                @clear="handleSearchPageTable"
                @keyup.native.enter="handleSearchPageTable"
              ></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">HIS标识</div>
              <el-input
                v-model="searchForm.hiscode"
                clearable
                @clear="handleSearchPageTable"
                @keyup.native.enter="handleSearchPageTable"
              ></el-input>
            </el-form-item>
            <el-form-item class="input" size="mini">
              <div class="form_label">电话</div>
              <el-input
                v-model="searchForm.telephone"
                clearable
                @clear="handleSearchPageTable"
                @keyup.native.enter="handleSearchPageTable"
              ></el-input>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">体检类型</div>
              <el-select
                v-model="searchForm.checktype"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option
                  v-for="(item, index) in checktypeitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">团检名称</div>
              <el-select
                v-model="searchForm.companycode"
                clearable
                filterable
                @change="handleChangeCompany"
              >
                <el-option
                  v-for="(item, index) in companyitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">批次</div>
              <el-select
                v-model="searchForm.batch"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option
                  v-for="(item, index) in batchitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">团检分组</div>
              <el-select
                v-model="searchForm.groupcode"
                clearable
                filterable
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
            <el-form-item class="select" size="mini">
              <div class="form_label">部门</div>
              <el-select
                v-model="searchForm.departcode"
                clearable
                filterable
                @change="handleSearchPageTable"
              >
                <el-option
                  v-for="(item, index) in departitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">打印状态</div>
              <el-select
                v-model="searchForm.reportprintflag"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option label="全部" :value="''"></el-option>
                <el-option label="未打印" :value="'0'"></el-option>
                <el-option label="已打印" :value="'1'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">状态</div>
              <el-select
                v-model="searchForm.status"
                clearable
                @change="handleSearchPageTable"
              >
                <el-option
                  v-for="(item, index) in statusitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="select" size="mini">
              <div class="form_label">报告模板</div>
              <el-select
                v-model="reporttype"
                clearable
                @change="handleSearchReporttype"
              >
                <el-option
                  v-for="(item, index) in reporttypeitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右侧表格展示数据 -->
        <el-col class="table_box" :span="19">
          <!-- <div class="head">
            <div class="logo"></div>
            报表预览
          </div> -->
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
          <el-row>
            <el-col class="tb_tbbox" :span="16">
              <div class="page_table">
                <vxe-table
                  ref="pageTable"
                  height="auto"
                  border="inner"
                  :loading="loading"
                  highlight-hover-row
                  :data="pageData"
                  :sort-config="{ trigger: 'cell' }"
                  @checkbox-change="handleSelectPeople"
                  @checkbox-all="handleSelectPeopleAll"
                  @cell-click="handleChoosePeople"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  row-id="regid"
                >
                  <vxe-table-column
                    type="checkbox"
                    width="40px"
                    :reserve-selection="true"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="statusname"
                    title="状态"
                    min-width="90px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  >
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
                  <vxe-table-column
                    field="regid"
                    title="体检号"
                    width="120px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="name"
                    title="姓名"
                    width="90px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="sex"
                    title="性别"
                    width="90px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  >
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
                  <vxe-table-column
                    field="age"
                    title="年龄"
                    width="90px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="setmealname"
                    title="套餐"
                    width="110px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="groupname"
                    title="分组名"
                    min-width="180px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="companyname"
                    title="单位"
                    min-width="180px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                </vxe-table>
              </div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[100, 200, 300, 1000, 5000, 10000, 50000]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count"
              >
              </el-pagination>
            </el-col>
            <el-col class="tb_tbbox_xm" :span="8">
              <vxe-table
                ref="pageTable"
                height="auto"
                border="inner"
                :loading="loading"
                highlight-hover-row
                :data="combineitems"
                :sort-config="{ trigger: 'cell' }"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                row-id="regid"
              >
                <vxe-table-column
                  field="detid"
                  title="医嘱ID"
                  width="110px"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="combinename"
                  title="项目"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="status"
                  title="状态"
                  width="90px"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                >
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.status == 0 ? "未完成" : "已完成"
                    }}</span>
                  </template>
                </vxe-table-column>
              </vxe-table></el-col
            >
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 预览弹框 -->
    <el-dialog
      title="预览"
      class="preview_box"
      :visible.sync="dialogVisible"
      width="700px"
      @close="handleCloseDialog"
    >
      <iframe
        ref="pdfCotainer"
        :src="pdfUrl"
        width="100%"
        style="height: calc(100vh - 147px)"
      ></iframe>
    </el-dialog>
    <el-dialog
      title="选页打印"
      :visible.sync="showSelectPrint"
      width="40%"
      class="selectPrint_dia"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="input_box">
        打印页码：<el-input v-model="selectPrintStart" clearable size="mini">
        </el-input
        >　-　<el-input v-model="selectPrintEnt" clearable size="mini">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="
            (showSelectPrint = false),
              (selectPrintStart = ''),
              (selectPrintEnt = '')
          "
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="handleSelectPrintDia"
          >打 印</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
    <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { printBase64 } from "@/api/printreport.js";
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import {
  getLoadSearchInfo,
  getBatch,
  getPageList,
  getExportFile,
  ReportExport,
  DownloadHead,
  DepartResultSearchLoad,
} from "@/api/fullsearch.js";
import {
  setDepartCheckGetResult,
  setDepartCheckDeleteLis,
} from "@/api/customerresult.js"; // 引入页面接口
// 引入页面接口
import { getPersonalDetail } from "@/api/personalregister.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { mapGetters } from "vuex";

export default {
  name: "resultsmanager",

  components: { Sticky, permissionBtn },
  props: {
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      checkupDateArr: [
        { code: "regdate", name: "登记时间" },
        { code: "checkdate", name: "体检时间" },
        { code: "inputdate", name: "总检时间" },
        { code: "totalcheckdate", name: "审核时间" },
      ],
      dateCode: "regdate",
      dateName: "登记时间",
      chooseArr: [],
      selectPrintStart: "",
      selectPrintEnt: "",
      showSelectPrint: false,
      searchForm: {
        regid: "",
        idcard: "",
        hiscode: "",
        name: "",
        startdate: "",
        enddate: "",
        meccode: "",
        status: "",
        persontype: "",
        companycode: "",
        checktype: "",
        groupcode: "",
        batch: "",
        telephone: "",
        reporttype: "",
        reportprintflag: "",
        conclusionstatus: -1,
      }, // 检索条件表单
      condition: "档案号", //检索体检条件
      conditionCode: "checkno",
      checkupWork: "", // 检索关键字
      conditionDate: "", //检索体检日期
      loading: false,
      checkupCodeArr: [
        { code: "checkno", name: "档案号" },
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
      meccodeitems: [], // 体检中心集合
      companyitems: [], // 公司集合
      batchitems: [], // 批次集合
      departitems: [], // 批次集合
      downloadList: [], // 图片下载合集
      groupitems: [], // 组合集合
      statusitems: [], // 状态集合
      reporttypeitems: [], // 报告类型集合
      selectArr: [], // 表格选中人员
      loddp: "",
      printArr: [
        {
          name: "指引单",
          flag: "btnGuide",
        },
        {
          name: "缴费单",
          flag: "btnPaySingle",
        },
        {
          name: "标签单",
          flag: "btnLabel",
        },
        {
          name: "条码单",
          flag: "btnBarCode",
        },
        {
          name: "报告书",
          flag: "btnReport",
        },
        {
          name: "体格检查表",
          flag: "btnPhysique",
        },
      ], // 打印预览列表
      buttons: [],
      domIdArr: [
        "btnGuide",
        "btnPaySingle",
        "btnLabel",
        "btnBarCode",
        "btnReport",
        "btnPhysique",
      ],
      dialogVisible: false, // 预览弹框显示
      pdfUrl: "",
      dataSources: "",
      currentPage: 1,
      pageSize: 100,
      count: 0,
      checktypeitems: [],
      isEnterRegid: false,
      meccodes: "", //meccode(院区标识）判断为1，报告书报表调用‘高干报告书’模版
      reporttype: "",
      chooseReport: null,
      combineitems: [],
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
    //   页面加载 加载搜索条件集
    this.handleGetLoadSearchInfo();
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    getPersonalDetail().then((res) => {
      if (!res.result) return;
      this.checktypeitems = res.result.checktypeitems;
    });
    this.handleGetPrintDate();
    this.handleFocuscheckupWorkInput();
  },

  methods: {
    async handleDelAll() {
      if (this.selectArr.length == 0) {
        this.$message.warning("请先勾选人员");
        return;
      }
      await setDepartCheckDeleteLis(this.selectArr).then((res) => {
        this.$message.success(res.message);
        this.combineitems = [];
        this.handleSearchPageTable();
      });
    },
    async handleRetrieveAll() {
      if (this.selectArr.length == 0) {
        this.$message.warning("请先勾选人员");
        return;
      }
      for (let i = 0; i < this.selectArr.length; i++) {
        await setDepartCheckGetResult({
          regid: this.selectArr[i],
        }).then((res) => {
          if (i == this.selectArr.length - 1) {
            this.$message.success(res.message);
            this.combineitems = [];
          }
        });
      }
    },
    handleChoosePeople({ row }) {
      if (!row) return;
      getPersonalDetail({ regid: row.regid }).then((res) => {
        if (!res.result) return;
        if (res.result.combineitems.length > 0) {
          this.combineitems = res.result.combineitems.filter(
            (k) => k.viewgroup == 2
          );
        } else {
          this.combineitems = [];
        }
      });
    },
    handleSearchReporttype(value) {
      if (value) {
        let flag = this.reporttypeitems.filter((k) => k.code == value)[0];
        flag && (this.chooseReport = flag);
      } else {
        this.chooseReport = null;
      }
    },
    handleChangeGroup(value) {
      if (value != "") {
        let flag = this.groupitems.filter((k) => {
          return value === k.code;
        })[0];
        flag && (this.departitems = flag.departitems);
      } else {
        let flag = this.batchitems.filter((k) => {
          return this.searchForm.batch === k.code;
        })[0];
        flag && (this.departitems = flag.departitems);
      }
      this.handleSearchPageTable();
    },
    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.checkupWorkInput.focus();
      });
    },
    handleEnterRegid() {
      this.isEnterRegid = true;
      this.handleSearchPageTable();
    },
    // 下载照片压缩包
    handleDownloadHead() {
      console.log(this.downloadList, "this.downloadList");
      if (this.downloadList.length == 0) {
        this.$message.warning("请勾选需要导出照片人员!");
        return;
      }
      /**
       * 文件id|姓名|体检号
       * [文件id|姓名|体检号,文件id|姓名|体检号,文件id|姓名|体检号]
       * fileid|name|regid
       *  */
      let dlList = [];
      let messageStr = "";
      this.downloadList.forEach((k) => {
        if (k.fileid) {
          dlList.push(`${k.fileid}|${k.name}|${k.regid}`);
        } else {
          messageStr += `${k.name}，`;
        }
      });
      if (dlList.length == 0) return;
      if (messageStr != "") {
        this.$message.warning(`${messageStr}暂无照片!`);
      }
      DownloadHead(dlList).then((res) => {
        console.log(res);
        const link = document.createElement("a"); //创建下载a标签
        link.href = res.result;
        link.style.display = "none"; // 默认隐藏元素
        document.body.appendChild(link); // body中添加元素
        link.click(); // 执行点击事件
        document.body.removeChild(link); //下载完成后移除元素
      });
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
      getSysConfigInfo({ cc: "Sys_FullSearch_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.conditionDate = [this.gettime(start), this.gettime(end)];
        // this.handleSearchPageTable();
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
      this.pdfUrl = "";
      this.dialogVisible = false;
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
    // 文件打印预览
    handlePreview(domId) {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行预览",
          type: "error",
        });
        return false;
      }
      this.dialogVisible = true;
      switch (domId) {
        case "btnGuide": // 指引单
          this.$refs.popoverRefIdc.forEach((d) => {
            console.log(9889);
            if (d.$children[0].$el.innerText == "指引单") {
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              if (this.downloadList[0].meccode == 1) {
                if (this.downloadList[0].personalflag == 1) {
                  repname = `${indexP}团体指引单`;
                } else {
                  repname = `${indexP}指引单`;
                }
              } else if (this.downloadList[0].meccode == 10003) {
                if (this.downloadList[0].personalflag == 1) {
                  repname = `${indexP}水电团体指引单`;
                } else {
                  repname = `${indexP}水电指引单`;
                }
              } else if (this.downloadList[0].meccode == 10004) {
                if (this.downloadList[0].personalflag == 1) {
                  repname = `${indexP}国康团体指引单`;
                } else {
                  repname = `${indexP}国康指引单`;
                }
              } else if (this.downloadList[0].meccode == 10005) {
                if (this.downloadList[0].personalflag == 1) {
                  repname = `${indexP}第一健康团体指引单`;
                } else {
                  repname = `${indexP}第一健康指引单`;
                }
              } else if (this.downloadList[0].meccode == 10006) {
                if (this.downloadList[0].personalflag == 1) {
                  repname = `${indexP}广州第一健康团体指引单`;
                } else {
                  repname = `${indexP}广州第一健康指引单`;
                }
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname,
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnPaySingle": // 缴费单
          console.log(2);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "缴费单") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnLabel": // 标签
          console.log(4);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "标签") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnBarCode": // 条码
          console.log(5);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "条码") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnReport": // 报告书
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "报告书") {
              // if (!this.chooseReport) {
              //   this.$message.warning("请先选中需打印的报告书模板!");
              //   return;
              // }
              this.downloadList.forEach((printItem) => {
                let indexP =
                  d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
                let repname = "";
                if (printItem.meccode == 1) {
                  repname = `${indexP}F报告书`;
                } else if (printItem.meccode == 10003) {
                  repname = `${indexP}F水电报告书`;
                } else if (printItem.meccode == 10004) {
                  repname = `${indexP}F国康报告书`;
                } else if (printItem.meccode == 10005) {
                  repname = `${indexP}F第一健康报告书`;
                } else if (printItem.meccode == 10006) {
                  repname = `${indexP}F广州第一健康报告书`;
                } else {
                  repname = d.$children[0].$attrs["data-remark"];
                }
                let data = {
                  fingercode: localStorage.getItem("md5code"),
                  codes: [printItem.regid],
                  repname: this.chooseReport ? this.chooseReport.name : repname,
                  fileid: printItem.reportfileid,
                  designtype: this.chooseReport
                    ? this.chooseReport.unioncode
                    : repname.includes("F")
                    ? "fast"
                    : "dev",
                  // repname: d.$children[0].$attrs["data-remark"],
                  printflag: 1,
                  whereitems: [],
                };
                printBase64(data).then((res) => {
                  if (!res.data) return;
                  let url = "";
                  if (res.data[0].fileurl) {
                    url = res.data[0].fileurl;
                  } else {
                    let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                    let raw = window.atob(code);
                    let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                    let uInt8Array = new Uint8Array(rawLength);
                    for (let i = 0; i < rawLength; ++i) {
                      uInt8Array[i] = raw.charCodeAt(i);
                    }
                    url = window.URL.createObjectURL(
                      new Blob([uInt8Array], { type: "application/pdf" })
                    );
                  }
                  if (url) this.dialogVisible = true;
                  this.pdfUrl =
                    "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
                });
              });
            }
          });
          break;
        case "btnPhysique": // 体格检查表
          console.log(7);
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "体格检查表") {
              let index = this.pageData.findIndex((k) => {
                return k.regid == this.chooseArr[0];
              });
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              if (index != -1 && this.pageData[index].meccode == 1) {
                repname = `${indexP}高干体格检查表`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: this.selectArr,
                repname,
                whereitems: [],
              };
              printBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        default:
          break;
      }
    },
    // 报告书选页打印
    handleSelectPrint() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行打印",
          type: "error",
        });
        return false;
      }
      if (this.selectArr.length > 1) {
        this.$message({
          showClose: true,
          message: "只支持单个人员",
          type: "error",
        });
        return false;
      }
      this.showSelectPrint = true;
      return;
    },
    // 选页打印
    handleSelectPrintDia() {
      if (!this.selectPrintStart || !this.selectPrintEnt) {
        this.$message.warning("请先填写需打印页!");
        return;
      }
      if (+this.selectPrintStart >= +this.selectPrintEnt) {
        this.$message.warning("起始页不能大于终止页!");
        return;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "报告书") {
          let repname = "";
          if (this.downloadList[this.downloadList.length - 1].meccode == 1) {
            repname = `${indexP}F报告书`;
          } else if (
            this.downloadList[this.downloadList.length - 1].meccode == 10003
          ) {
            repname = `${indexP}F水电报告书`;
          } else if (
            this.downloadList[this.downloadList.length - 1].meccode == 10004
          ) {
            repname = `${indexP}F国康报告书`;
          } else if (
            this.downloadList[this.downloadList.length - 1].meccode == 10005
          ) {
            repname = `${indexP}F第一健康报告书`;
          } else if (
            this.downloadList[this.downloadList.length - 1].meccode == 10006
          ) {
            repname = `${indexP}F广州第一健康报告书`;
          } else {
            repname = d.$children[0].$attrs["data-remark"];
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            fileid:
              this.downloadList[this.downloadList.length - 1].reportfileid,
            repname: this.chooseReport ? this.chooseReport.name : repname,
            designtype: this.chooseReport
              ? this.chooseReport.unioncode
              : repname.includes("F")
              ? "fast"
              : "dev",
            printflag: 1,
            whereitems: [],
          };
          printBase64(data).then((res) => {
            if (!res.data) return;
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            this.lodop.SET_PRINT_MODE(
              "PRINT_START_PAGE",
              +this.selectPrintStart
            ); // 设置从第2页开始打印;
            this.lodop.SET_PRINT_MODE("PRINT_END_PAGE", +this.selectPrintEnt); // 设置从第3页结束打印;
            if (res.data[0].fileurl) {
              printObj.printPdfReport(this.lodop, [
                encodeURI(res.data[0].fileurl),
              ]);
            } else {
              let fileList = res.data.map((k) => {
                return k.base64String;
              });
              printObj.printBase64PdfReport(this.lodop, fileList);
            }

            this.showSelectPrint = false;
            this.selectPrintStart = "";
            this.selectPrintEnt = "";
          });
        }
      });
    },
    // 文件导出回调
    handleGetExportFile() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item] && item != "batch") {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      getExportFile({
        apicontrol: "FullSearch",
        apimethod: "Load",
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        // window.open(res.result);
        const link = document.createElement("a"); //创建下载a标签
        link.href = res.result;
        link.style.display = "none"; //默认隐藏元素
        document.body.appendChild(link); // body中添加元素
        link.click(); // 执行点击事件
        document.body.removeChild(link); //下载完成后移除元素
      });
    },
    // 导出为PDF
    async handleGetExportPdf() {
      if (this.selectArr.length == 0) return false;
      for (let i = 0; i < this.downloadList.length; i++) {
        await this.handleExportPdf(this.downloadList[i]);
      }
    },
    handleExportPdf(k) {
      return new Promise((resolve, reject) => {
        try {
          let repname = "";
          if (k.meccode == 1) {
            repname = `1、F报告书`;
          } else if (k.meccode == 10003) {
            repname = `1、F水电报告书`;
          } else if (k.meccode == 10004) {
            repname = `1、F国康报告书`;
          } else if (k.meccode == 10005) {
            repname = `1、F第一健康报告书`;
          } else if (k.meccode == 10006) {
            repname = `1、F广州第一健康报告书`;
          } else {
            repname = `1、报告书`;
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [k.regid],
            fileid: k.reportfileid,
            repname,
            repname: this.chooseReport ? this.chooseReport.name : repname,
            designtype: this.chooseReport
              ? this.chooseReport.unioncode
              : repname.includes("F")
              ? "fast"
              : "dev",
            // repname: `1、F报告书`,
            printflag: 1,
            whereitems: [],
          };
          printBase64(data).then((res) => {
            if (!res.data) return;
            let url = "";
            if (res.data[0].fileurl) {
              url = res.data[0].fileurl;
            } else {
              let code = res.data[0].base64String.replace(/[\n\r]/g, "");
              let raw = window.atob(code);
              let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
              let uInt8Array = new Uint8Array(rawLength);
              for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
              }
              url = window.URL.createObjectURL(
                new Blob([uInt8Array], { type: "application/pdf" })
              );
            }
            const a = document.createElement("a");
            a.href = url;
            a.download = `${k.name}-${k.regid}`; // 下载文件的名字
            // a.download = res.data[0].printname; // 下载文件的名字
            document.body.appendChild(a);
            a.click();
            return resolve("ok");
          });
        } catch (err) {
          return reject(err);
        }
      });
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
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "指引单") {
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          if (this.downloadList[0].meccode == 1) {
            if (this.downloadList[0].personalflag == 1) {
              repname = `${indexP}团体指引单`;
            } else {
              repname = `${indexP}指引单`;
            }
          } else if (this.downloadList[0].meccode == 10003) {
            if (this.downloadList[0].personalflag == 1) {
              repname = `${indexP}水电团体指引单`;
            } else {
              repname = `${indexP}水电指引单`;
            }
          } else if (this.downloadList[0].meccode == 10004) {
            if (this.downloadList[0].personalflag == 1) {
              repname = `${indexP}国康团体指引单`;
            } else {
              repname = `${indexP}国康指引单`;
            }
          } else if (this.downloadList[0].meccode == 10005) {
            if (this.downloadList[0].personalflag == 1) {
              repname = `${indexP}第一健康团体指引单`;
            } else {
              repname = `${indexP}第一健康指引单`;
            }
          } else if (this.downloadList[0].meccode == 10006) {
            if (this.downloadList[0].personalflag == 1) {
              repname = `${indexP}广州第一健康团体指引单`;
            } else {
              repname = `${indexP}广州第一健康指引单`;
            }
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname,
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
        }
      });
    },
    // 打印缴费单
    handlePaySingle() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出缴费单",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        console.log(10);
        if (d.$children[0].$el.innerText == "缴费单") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
          };
          // console.log(data);
          // return
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
      this.$refs.popoverRefIdc.forEach((d) => {
        console.log(11);
        if (d.$children[0].$el.innerText == "标签") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
          };
          // console.log(data);
          // return
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
        }
      });
    },
    // 打印条码
    handlePrintBarCode() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出标签",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "条码") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [],
          };
          // console.log(data);
          // return
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
        }
      });
    },
    handleSelectPeopleAll({ records }) {
      this.downloadList = JSON.parse(JSON.stringify(records));
      let arr = records.map((k) => {
        return k.regid;
      });
      this.chooseArr = arr;
      this.selectArr = arr;
    },
    // 人员列表选中数据回调
    handleSelectPeople({ records }) {
      let arr = records.map((k) => {
        return k.regid;
      });
      this.downloadList = JSON.parse(JSON.stringify(records));
      this.chooseArr = arr;
      this.selectArr = arr;
    },
    // 主页列表数据搜索
    handleSearchPageTable() {
      this.handleGetPageList();
    },
    // 列表表格数据查询回调
    handleGetPageList() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item] !== "") {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      if (this.conditionDate && this.conditionDate.length > 0) {
        switch (this.dateCode) {
          case "regdate":
            whereitems.push({
              key: "startdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "enddate",
              value: this.conditionDate[1],
            });
            break;
          case "checkdate":
            whereitems.push({
              key: "startcheckdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "endcheckdate",
              value: this.conditionDate[1],
            });
            break;
          case "inputdate":
            whereitems.push({
              key: "startinputdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "endinputdate",
              value: this.conditionDate[1],
            });
            break;
          case "totalcheckdate":
            whereitems.push({
              key: "starttotalcheckdate",
              value: this.conditionDate[0],
            });
            whereitems.push({
              key: "endtotalcheckdate",
              value: this.conditionDate[1],
            });
            break;
          default:
            break;
        }
      }
      DepartResultSearchLoad({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          // console.log(res.data[0].meccode,'111');
          // meccode(院区标识）判断为1，报告书报表调用‘高干报告书’模版
          if (res.data) {
            this.meccodes = res.data[0].meccode;
            this.count = res.count;
            this.pageData = res.data;
          } else {
            this.count = 0;
            this.pageData = [];
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      this.searchForm.regid = "";
    },
    // 单位下拉列表改变值触发回调
    handleChangeCompany() {
      this.handleGetBatch();
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
          this.departitems = batchitems[selectIndex].departitems;
          let group = batchitems[selectIndex].groupitems.filter(
            (k) => k.selected
          )[0];
          group && (this.searchForm.groupcode = group.code);
        }
        this.handleSearchPageTable();
      });
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
    // 收入检索身份证/条件号等回调
    handleInputWork() {},
    // 点击检索条件筛选全部回调
    handleChangeDate(arr) {
      if (arr) {
        this.conditionDate = arr;
      } else {
        this.conditionDate = [];
      }
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.key;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.dateName = val.name;
      this.dateCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    handlePrintReport() {
      this.$refs.popoverRefIdc.forEach(async (d) => {
        if (d.$children[0].$el.innerText == "报告书") {
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          // this.downloadList.forEach((printItem) => {
          let repname = "";
          for (let i = 0; i < this.downloadList.length; i++) {
            if (this.downloadList[i].meccode == 1) {
              repname = `${indexP}F报告书`;
            } else if (this.downloadList[i].meccode == 10003) {
              repname = `${indexP}F水电报告书`;
            } else if (this.downloadList[i].meccode == 10004) {
              repname = `${indexP}F国康报告书`;
            } else if (this.downloadList[i].meccode == 10005) {
              repname = `${indexP}F第一健康报告书`;
            } else if (this.downloadList[i].meccode == 10006) {
              repname = `${indexP}F广州第一健康报告书`;
            } else {
              repname = d.$children[0].$attrs["data-remark"];
            }
            await this.handlePrintReportAsync(
              repname,
              this.chooseReport,
              this.downloadList[i]
            );
          }
        }
      });
    },
    // 弹框打印申请单
    handlePrintReportAsync(repname, repObj, item) {
      return new Promise((resolve, reject) => {
        try {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [item.regid],
            fileid: item.reportfileid,
            repname: repObj ? repObj.name : repname,
            filetype: "pdf",
            outtype: "url",
            // repname: d.$children[0].$attrs["data-remark"],
            designtype: repObj
              ? repObj.unioncode
              : repname.includes("F")
              ? "fast"
              : "dev",
            printflag: 1,
            whereitems: [],
          };
          let timeId = "";
          clearTimeout(timeId);
          timeId = setTimeout(() => {
            printBase64(data).then((res) => {
              if (!res.data) return;
              this.selectArr.forEach((item) => {
                this.pageData.forEach((k, index) => {
                  if (item === k.regid) {
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
              if (res.data[0].fileurl) {
                printObj.printPdfReport(this.lodop, [
                  encodeURI(res.data[0].fileurl),
                ]);
              } else {
                let fileList = res.data.map((k) => {
                  return k.base64String;
                });
                printObj.printBase64PdfReport(this.lodop, fileList);
              }
              return resolve("ok");
            });
          }, 1000);
        } catch (err) {
          return reject(err);
        }
      });
    },
    handlePrintPhysique() {
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "体格检查表") {
          let index = this.pageData.findIndex((k) => {
            return k.regid == this.chooseArr[0];
          });
          let indexP =
            d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          if (index != -1 && this.pageData[index].meccode == 1) {
            repname = `${indexP}高干体格检查表`;
          } else {
            repname = d.$children[0].$attrs["data-remark"];
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: this.selectArr,
            repname,
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
        }
      });
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询主页列表数据
          this.handleSearchPageTable();
          break;
        case "btnRetrieveAll": // 重置
          this.handleRetrieveAll();
          break;
        case "btnDelAll": // 重置
          this.handleDelAll();
          break;
        case "btnRefresh": // 重置
          this.handleSearchPageTable();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnGuide": // 指引单
          this.handlePrintGuide();
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          break;
        case "btnPaySingle": // 缴费单
          this.handlePaySingle();
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          break;
        case "btnLabel": // 标签
          this.handlePrintLabel();
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          break;
        case "btnBarCode": // 条码
          this.handlePrintBarCode();
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          break;
        case "btnExport1": // 导出
          this.handleGetExportFile();
          break;
        case "btnExportPdf": // 导出PDF
          this.handleGetExportPdf();
          break;
        case "btnDownloadHead": // 导出照片
          this.handleDownloadHead();
          break;
        case "btnReport": // 导出报告书
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          let flag = this.pageData.filter((k) => {
            return k.regid == this.chooseArr[0];
          })[0];
          if (!flag) return;
          // if (!this.chooseReport) {
          //   this.$message.warning("请先选中需打印的报告书模板!");
          //   return;
          // }
          this.handlePrintReport();
          break;

        case "btnPhysique": // 打印体格检查表
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          let flag1 = this.pageData.filter((k) => {
            return k.regid == this.chooseArr[0];
          })[0];
          if (!flag1) return;
          if (flag1.status >= 6) {
            this.handlePrintPhysique();
          } else {
            this.$confirm("该用户还未总检, 是否继续打印?", "提示", {
              confirmButtonText: "打印",
              cancelButtonText: "不打印",
              type: "warning",
            })
              .then(() => {
                this.handlePrintPhysique();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消打印",
                });
              });
          }

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