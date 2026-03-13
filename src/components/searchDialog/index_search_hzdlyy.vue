<template>
  <div>
    <el-dialog
      class="search_dialog"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="85%"
      top="2%"
      :show-close="false"
    >
      <!-- 内层遮罩层 -->
      <div class="mask" v-show="show_assignment"></div>
      <!-- 头部按钮组 -->
      <div class="btn_group">
        <el-button type="primary" plain size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="primary" plain size="mini" @click="handleReset"
          >重置</el-button
        >
        <!-- <el-button
          type="primary"
          v-if="pageFlag == 'totalcheck'"
          plain
          size="mini"
          @click="handleAllReturn"
          >全部返回</el-button
        > -->
        <el-button type="primary" plain size="mini" @click="handleDialogClose"
          >关闭</el-button
        >
      </div>
      <!-- 筛选条件表单 -->
      <div class="search_form">
        <div class="head">检索条件</div>
        <el-form
          ref="form"
          class="form_box"
          :model="searchForm"
          label-width="80px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" label="体检号">
                <el-input
                  v-model="searchForm.regid"
                  @keyup.native.enter="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" class="check_date" label="登记日期">
                <el-date-picker
                  @change="handleChangeDate"
                  size="mini"
                  v-model="searchForm.conditionDate"
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
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="状态">
                <el-select
                  size="mini"
                  @change="handleSearch"
                  v-model="searchForm.status"
                  placeholder=""
                >
                  <el-option
                    v-for="item in statusArr"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item size="mini" label="姓名">
                <el-input
                  v-model="searchForm.name"
                  @keyup.native.enter="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="体检套餐">
                <el-select
                  size="mini"
                  @change="handleSearch"
                  v-model="searchForm.setmealcode"
                  clearable
                  filterable
                  placeholder=""
                >
                  <el-option
                    v-for="item in packageItems"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
            <el-form-item size="mini" label="HIS标识">
              <el-input
                v-model="searchForm.hiscode"
                @keyup.native.enter="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col> -->
            <el-col :span="8">
              <el-form-item size="mini" label="联系电话">
                <el-input
                  v-model="searchForm.telephone"
                  @keyup.native.enter="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="身份证">
                <el-input
                  v-model="searchForm.idcard"
                  @keyup.native.enter="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" class="check_select" label="体检类型">
                <el-select
                  @change="handleSearch"
                  v-model="searchForm.checktype"
                  clearable
                  placeholder=""
                >
                  <el-option
                    v-for="item in checktypeitems"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="团检名称">
                <el-select
                  filterable
                  clearable
                  @change="handleSelectComany"
                  v-model="searchForm.companycode"
                  placeholder=""
                >
                  <el-option
                    v-for="item in companyitems"
                    :key="item.code"
                    :label="`${item.code} ${item.name}`"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="团检批次">
                <el-select
                  @change="handleSelectBatch"
                  style="width: 100%"
                  v-model="searchForm.batch"
                  placeholder=""
                >
                  <el-option
                    v-for="item in batchitems"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="团检分组">
                <el-select
                  @change="handleCheckGroup"
                  style="width: 100%"
                  v-model="searchForm.groupcode"
                  placeholder=""
                >
                  <el-option
                    v-for="item in groupitems"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" class="check_date" label="体检日期">
                <el-date-picker
                  @change="handleChangeCheckDate"
                  size="mini"
                  v-model="searchForm.checkDate"
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
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" class="check_date" label="分配日期">
                <el-date-picker
                  @change="handleChangeInspectionDate"
                  size="mini"
                  v-model="searchForm.inspectionDate"
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
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item size="mini" label="类型">
                <el-button-group>
                  <el-button size="mini" type="primary" plain @click="(searchForm.persontype = ''), handleSearch()">全部</el-button>
                  <el-button size="mini" type="primary" plain @click="(searchForm.persontype = '0'), handleSearch()">个检</el-button>
                  <el-button size="mini" type="primary" plain @click="(searchForm.persontype = '1'), handleSearch()">团检</el-button>
                </el-button-group>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="分配医生">
                <el-select
                  @change="handleSearch"
                  style="width: 100%"
                  clearable
                  v-model="searchForm.inspectioncode"
                  placeholder=""
                >
                  <el-option
                    v-for="item in inspectionItems"
                    :key="item.account"
                    :label="item.name"
                    :value="item.account"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="体检状态">
                <el-select
                  class="check_select"
                  style="width: 100%"
                  v-model="searchForm.status"
                  clearable
                  @change="handleSearch"
                >
                  <el-option
                    v-for="(item, index) in statusitems"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item class="check_select" size="mini" label="分配状态">
                <el-select
                  @change="handleSearch"
                  style="width: 100%"
                  v-model="searchForm.orderstatus"
                  placeholder=""
                >
                  <el-option label="全部" :value="''"></el-option>
                  <el-option label="未分配" :value="'0'"></el-option>
                  <el-option label="已分配" :value="'1'"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <!-- <el-row>
            <el-col :span="8">
              <el-form-item size="mini" class="check_date" label="体检日期">
                <el-date-picker @change="handleChangeCheckDate" size="mini" v-model="searchForm.checkDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </div>
      <!-- 当前人员队列信息 -->
      <!-- <div class="queue_box">
        <div class="queue_item">
          <div class="title bg1">总数</div>
          <div class="value">{{ total }}</div>
        </div>
        <div class="queue_item">
          <div class="title bg2">个检</div>
          <div class="value">{{ persontotal }}</div>
        </div>
        <div class="queue_item">
          <div class="title bg3">团检</div>
          <div class="value">{{ companytotal }}</div>
        </div>
        <div class="queue_item">
          <div class="title bg4">未完成</div>
          <div class="value">{{ handletotal }}</div>
        </div>
        <div class="queue_item">
          <div class="title bg5">完成</div>
          <div class="value">{{ completetotal }}</div>
        </div>
      </div> -->
      <div class="tableBtnBoxClas">
        <el-button-group>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="(searchForm.orderstatus = ''), handleSearch()"
            >全部</el-button
          >
          <el-button
            size="mini"
            type="primary"
            plain
            @click="(searchForm.orderstatus = '0'), handleSearch()"
            >未分配</el-button
          >
          <el-button
            size="mini"
            type="primary"
            plain
            @click="(searchForm.orderstatus = '1'), handleSearch()"
            >已分配</el-button
          >
        </el-button-group>
        <div class="text">
          <div>未分配：{{ this.handletotal }}</div>
          <div>已分配：{{ this.completetotal }}</div>
        </div>
        <el-button-group>
          <el-button size="mini" type="primary" plain @click="handleAssignment"
            >批量分配</el-button
          >
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleCancelAssignment()"
            >取消分配</el-button
          >
        </el-button-group>
      </div>
      <!-- 主体表格数据 -->
      <!-- @row-dblclick="handleCheckPerson" -->
      <EasyTable
        class="page_table"
        height="100%"
        :data="pageData"
        :tableOptions="pageOptions"
        :radio-config="{ rowClick: true }"
        @selection-change="handleSelectIntment"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-style="handleTableRowClassName"
        :cell-style="{ padding: '0' }"
      />
      <!-- :row-class-name="handleTableRowClassName"  { height: '32px' }-->
      <el-pagination
        :small="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 500, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog
      class="search_dialog paading"
      :close-on-click-modal="false"
      :visible.sync="show_assignment"
      width="43%"
      top="11%"
      :show-close="false"
    >
      <!-- 头部 -->
      <div class="topBox">
        <div class="assignmentBox">
          <div class="await">
            <div class="title purple">待分配</div>
            <div class="data">
              {{ hiddenAssignmentAwait }}
            </div>
          </div>
          <div class="already">
            <div class="title skyblue">已分配</div>
            <div class="data">
              {{ hiddenAssignmentAlready }}
            </div>
          </div>
        </div>
        <div class="btnBox">
          <button @click="(plantype = '1'), subDown()">平均分配</button>
        </div>
        <div class="btnBox">
          <button @click="subDown()" style="margin-right: 10px">
            手动分配
          </button>
          <button @click="(show_assignment = false), shutDown()">关闭</button>
        </div>
      </div>
      <!--  -->
      <div class="content">
        <div
          :class="[
            index == 2 || index == 5 ? 'itemBox ' : 'itemBox marginRight',
          ]"
          v-for="(item, index) in doctorData"
          :key="index"
        >
          <div class="imgbox">
            <!-- <el-image style=" width: 45px; height: 50px;" :src="require('@/assets/dialogImg/man.jpg')">
            </el-image> -->
            <div class="name">
              {{ item.name }}
            </div>
            <div class="checkbox">
              <el-checkbox
                class="inputCheckBox"
                @change="checkboxFun(item)"
                v-model="doctorDataChecked"
                size="medium"
                :label="item.account"
                >&#x3000;</el-checkbox
              >
            </div>
          </div>
          <div class="hidden_content">
            <div class="hidden_total_combine">
              <div class="box">
                <span class="title">已</span
                ><span class="numberClas">{{ item.plancount }}</span>
              </div>
              <div class="box" style="border-left: none">
                <span class="title purple">合</span
                ><span class="numberClas">{{
                  item.plancount + item.number
                }}</span>
              </div>
            </div>
            <div class="hidden_assignment">
              <div class="assignment_btn">预分配</div>
              <div class="controlBox">
                <div
                  class="decreaseBtn"
                  @click.self="DecreaseNumber($event, item, index)"
                >
                  -
                </div>
                <el-input
                  v-model="item.number"
                  style="text-align: center"
                  size="small"
                ></el-input>
                <div
                  class="AddBtn"
                  @click.self="AddNumber($event, item, index)"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPersonalDetail,
  getBatchOrGroup,
  getPageList,
  getDoctorPlan,
  getSave,
  getChangePlan,
  getLoad,
  CancelPlan,
} from "@/api/searchDialog.js";
import { getLoadSearchInfo } from "@/api/fullsearch.js";
import * as setdictionary from "@/api/setdictionary";
import { getAllUser } from "@/api/customermanage.js";
export default {
  name: "",

  components: {},
  props: {
    showSearch: {
      type: Boolean,
      require: true,
    },
    pageFlag: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      hiddenAssignmentAwait: 0, // 已分配/待分配 number
      hiddenAssignmentAlready: 0, // 已分配/待分配 number
      doctorhidden_input: "", // 内层dialog弹框 医生预分配输入框
      imgData: ["@/assets/dialogImg/man.jpg", "@/assets/dialogImg/girl.jpg"], //医生头像
      doctorData: [], // 分配弹框数据
      doctorDataChecked: [], // 选中的医生
      SelectdoctorData: [], // 需要保存时取用的医生数据
      show_assignment: false, // 内层弹框
      showDialog: false, // 是否显示弹框
      packageItems: [],
      searchForm: {
        conditionDate: [],
        checkDate: [],
        inspectionDate: [],
        regid: "",
        setmealcode: "",
        name: "",
        hiscode: "",
        telephone: "",
        idcard: "",
        checktype: "",
        companycode: "",
        startdate: "",
        enddate: "",
        batch: "",
        groupcode: "",
        status: "",
        persontype: "",
        startcheckdate: "",
        endcheckdate: "",
        startinspectiondate: "",
        endinspectiondate: "",
        inspectioncode: "",
        orderstatus: "",
        status: "",
      }, // 搜索表单对象
      statusitems: [],
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
      companyitems: [], // 团检名称 // 单位选择
      batchitems: [], // 团检名称 // 批次选择
      groupitems: [], // 团检名称 // 分组选择
      checktypeitems: [], // 检查类型
      statusArr: [
        {
          code: "",
          name: "全部",
        },
        {
          code: 0,
          name: "已登记",
        },
        {
          code: 1,
          name: "已预约",
        },
        {
          code: 2,
          name: "已签到",
        },
        {
          code: 3,
          name: "体检中",
        },
        {
          code: 4,
          name: "已交表",
        },
        {
          code: 5,
          name: "可总检",
        },
        {
          code: 6,
          name: "已总检",
        },
        {
          code: 7,
          name: "已审核",
        },
      ], // 筛选状态数组
      pageData: [], // 主页表格列表数据
      total: 0, // 总数
      persontotal: 0, // 个人总数
      companytotal: 0, // 团检总数
      handletotal: 0, // 未完成总数
      completetotal: 0, // 已完成总数
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      chooseList: [], // 表格勾选项
      tableData: [], // 存表格数据
      plantype: 0, // 0 手动分配  1 自动分配
      inspectionItems: [],
    };
  },
  computed: {
    // 主页表格配置
    pageOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          align: "center",
          returnVal: (value, data) => {
            return `${value}${data.ageunit}`;
          },
        },
        {
          title: "体检号",
          prop: "regid",
          width: 120,
        },

        {
          title: "登记日期",
          prop: "regdate",
          width: 120,
        },
        {
          title: "预约日期",
          prop: "checkdate",
          width: 180,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 150,
        },
        {
          title: "联系电话",
          prop: "telephone",
          width: 120,
        },
        {
          title: "团检名称",
          prop: "companyname",
          width: 180,
          omit: 1,
        },
        {
          title: "批次",
          prop: "batch",
        },
        {
          title: "分配医生",
          width: 150,
          render: (h, data) => {
            return (
              <el-select
                vOn:change={(e) => {
                  this.handleChangeInspectioncode(data);
                }}
                style="width: 100%"
                size="mini"
                v-model={data.inspectioncode}
              >
                {this.inspectionItems.map((item) => (
                  <el-option
                    key={item.account}
                    label={item.name}
                    value={item.account}
                  ></el-option>
                ))}
              </el-select>
            );
          },
        },
        {
          title: "操作",
          width: 150,
          render: (h, data) => {
            return (
              <el-button
                type="primary"
                size="mini"
                vOn:click_stop_prevent={(e) => {
                  this.handleCancelAssignment(data);
                }}
              >
                取消分配
              </el-button>
            );
          },
        },
      ];
    },
  },
  watch: {
    doctorDataChecked: function (newval, oldval) {
      console.log(newval);
      this.SelectdoctorData = newval;
    },
  },
  async mounted() {
    let res = await getAllUser();
    this.inspectionItems = res.data.filter((k) => {
      return (
        k.userType.split(",").includes("总检医生") ||
        k.userType.split(",").includes("主审医生")
      );
    });
    this.showDialog = this.showSearch; // 是否显示弹框
    this.handleGetDetail(); // 页面加载获取单位信息
    this.handleGetPastHalfYear();
    this.handleGetPackage();
    this.handleGetLoadSearchInfo();
  },

  methods: {
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { statusitems } = res.result;
        this.statusitems = statusitems; // 状态集合
        // 数据回填
        let status = statusitems.filter((k) => k.selected)[0];
        status && (this.searchForm.status = status.code);
      });
    },
    handleChangeInspectioncode(item) {
      if (!item) return;
      getChangePlan({
        regid: item.regid,
        inspectioncode: item.inspectioncode,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleSearch();
      });
    },
    // 内层dialog弹框 确定回调
    subDown() {
      console.log(this.chooseList, "确定按钮回调");
      const chooseList = this.chooseList.map((k) => k.regid);
      let arr = [];
      if (this.plantype == 1) {
        arr = this.doctorData.filter((k) => {
          return this.SelectdoctorData.includes(k.account);
        });
        arr = arr.map((k) => {
          return { inspectioncode: k.account, qty: k.number };
        });
      } else {
        this.doctorData.forEach((item) => {
          if (item.number >= 1)
            arr.push({ inspectioncode: item.account, qty: item.number });
        });
      }
      // 调取接口后 清空表格数据
      getSave({
        regiditems: chooseList,
        plantype: this.plantype,
        doctoritems: arr,
      }).then((res) => {
        console.log(res, "分配保存按钮");
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "分配成功",
          });
          this.show_assignment = false;
          this.SelectdoctorData = [];
          this.doctorDataChecked = [];
          this.chooseList = [];
          this.plantype = "0";
          this.handleSearch();
        }
      });
    },
    // 内层dialog弹框 关闭回调
    shutDown() {
      // 清空选择医生
      this.SelectdoctorData = [];
      this.$emit("close", false);
    },
    // 减
    DecreaseNumber(event, item, index) {
      // console.log(item);

      const result = this.SelectdoctorData.some(
        (k) => k == this.doctorData[index].account
      );
      // console.log(result);
      if (result) {
        if (this.doctorData[index].number >= 1) {
          let Number = this.doctorData[index].number - 1;
          this.doctorData[index].number = Number;
          console.log(this.doctorData[index].number);
        } else {
          this.$message({
            type: "info",
            message: "不能再减了",
          });
        }
      } else {
        this.$message.info("请勾选当前医生");
      }
    },
    // 加
    AddNumber(event, item, index) {
      // console.log(this.SelectdoctorData, this.doctorData[index]);
      const result = this.SelectdoctorData.some(
        (k) => k == this.doctorData[index].account
      );
      if (result) {
        const NoNumber = this.doctorData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.number,
          0
        );
        if (NoNumber >= this.chooseList.length) {
          this.$message({
            type: "info",
            message: "不能再加了",
          });
          return;
        }
        let Number = this.doctorData[index].number + 1;
        // this.doctorData[index] = { ...this.doctorData[index], number: Number };
        this.$set(this.doctorData, index, {
          ...this.doctorData[index],
          number: Number,
        });
      } else {
        this.$message.info("请勾选当前医生");
      }
    },
    // 选中的医生
    checkboxFun() {
      // console.log(this.SelectdoctorData);
    },
    // 组件取消
    handleCloseSearch(Boolean) {
      console.log("组件取消", Boolean);
    },
    // 总检分配
    handleAssignment() {
      console.log("总检分配");
      // 获取今年一月份的年月日
      const january = new Date();
      january.setMonth(0);
      const yearJanuary = january.getFullYear();
      const monthJanuary = (january.getMonth() + 1).toString().padStart(2, "0");
      const dayJanuary = january.getDate().toString().padStart(2, "0");
      const formattedJanuary = `${yearJanuary}-${monthJanuary}-${dayJanuary} 00:00:00`;
      // 获取今年最后一个月份的年月日
      const december = new Date();
      december.setMonth(11);
      const yearDecember = december.getFullYear();
      const monthDecember = (december.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const dayDecember = new Date(yearDecember, december.getMonth() + 1, 0)
        .getDate()
        .toString()
        .padStart(2, "0");
      const formattedDecember = `${yearDecember}-${monthDecember}-${dayDecember} 00:00:00`;
      // console.log(formattedJanuary);
      // console.log(formattedDecember);
      // {
      //           startdate: formattedJanuary,
      //           enddate: formattedDecember,
      //         },
      if (this.chooseList.length) {
        let result = this.chooseList.some((item) => !item.inspectioncode);
        console.log(result);
        if (result) {
          this.show_assignment = true;
          this.hiddenAssignmentAwait = this.chooseList.length;
          getDoctorPlan({
            page: 1,
            limit: 10000,
            key: "",
            id: "",
            code: "",
            type: 0,
            tableName: "",
            businesstype: "",
            whereitems: [],
          }).then((res) => {
            console.log(res, "医生总检任务列表!!!!!!!!!!!");
            this.doctorData = res.data.customeritems;
            this.doctorData.forEach((item) => (item.number = 0));
          });
        } else {
          this.$message("勾选项中存在已分配人员");
        }
      } else {
        this.$message("最少勾选一项");
      }
    },
    // 取消分配
    handleCancelAssignment(item) {
      let regiditems = [];
      item
        ? (regiditems = [item.regid])
        : (regiditems = this.chooseList.map((k) => k.regid));
      if (regiditems.length == 0) {
        this.$message.warning("请先勾选需取消分配人员!");
        return;
      }
      CancelPlan(regiditems).then((res) => {
        this.$message.success(res.message);
        this.handleSearch();
      });
      // if (this.chooseList.length) {
      //   let result = this.chooseList.some(
      //     (item) => item.inspectioncode == "null"
      //   );
      //   if (result) {
      //     this.show_assignment = true;
      //   } else {
      //     this.$message("勾选项中存在未分配人员");
      //   }
      // } else {
      //   this.$message("最少勾选一项");
      // }
    },
    handleSelectsetMael(val) {
      console.log(val);
    },
    handleGetPackage() {
      setdictionary
        .getList({
          key: "",
          id: "",
          tableName: "Dic_setmeal",
        })
        .then((response) => {
          this.packageItems = response.data;
        });
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleSearch();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleSearch();
    },
    // 表格勾选项回调
    handleSelectIntment(row) {
      if (row && row.length > 0) {
        console.log(row, "表格勾选项");
        this.chooseList = row;
      }
    },
    // 点击分配或未分配回调
    siftAssignmentFun(num) {
      if (num) {
        let result = [];
        this.tableData.forEach((item) => {
          if (item.inspectioncode == "null") {
            result.push(item);
          }
        });
        console.log("未分配", result);
        this.pageData = result;
      } else {
        let result = [];
        this.tableData.forEach((item) => {
          if (item.inspectioncode != "null") {
            result.push(item);
          }
        });
        console.log("已分配", result);
        this.pageData = result;
      }
    },
    // 双击表格数据行选定数据
    handleCheckPerson(row) {
      console.log(row);
      this.$emit("submit", row.regid);
      this.handleDialogClose();
    },
    // 双击表格数据行选定数据
    handleCopy(row) {
      console.log(row);
      this.$emit("copy", row.regid);
      this.handleDialogClose();
    },
    handleAllReturn() {
      this.$emit("submit", this.pageData);
      this.handleDialogClose();
    },
    // 新增获取个人登记明细/详情/新增回调
    handleGetDetail() {
      getPersonalDetail().then((res) => {
        let { checktypeitems, companyitems } = res.result;
        this.checktypeitems = checktypeitems;
        this.companyitems = companyitems;
        // 检查类型列表 / 回显值
        this.checktypeitems = checktypeitems;
        // this.searchForm.checktype =
        //   (checktypeitems.filter((k) => k.selected)[0] &&
        //     checktypeitems.filter((k) => k.selected)[0].code) ||
        //   "";
        // 下拉单位列表 /  回显值
        this.companyitems = companyitems;
        let company = company && companyitems.filter((k) => k.selected)[0];
        if (company) {
          this.searchForm.companycode = company.code;
        }
      });
    },
    // 获取团检批次和分组回调
    hadnleGetBatchOrGroup() {
      getBatchOrGroup({
        companycode: this.searchForm.companycode,
      })
        .then((res) => {
          let { batchitems } = res.result;
          this.batchitems = batchitems;
          let batch = batchitems.filter((k) => k.selected)[0] || batchitems[0];
          batch && (this.searchForm.batch = batch.code);
          this.groupitems = batch.groupitems;
          this.handleSearch();
        })
        .catch((err) => {});
    },
    // 下拉改变单位选择值回调
    handleSelectComany(val) {
      this.hadnleGetBatchOrGroup();
    },
    // 下拉选中批次号触发回调
    handleSelectBatch(val) {
      let data = this.batchitems.filter((k) => k.code == val)[0];
      if (data) {
        this.groupitems = Object.assign([], data.groupitems);
        this.handleSearch();
      }
    },
    // 分组下拉选中回调
    handleCheckGroup(value) {
      this.handleSearch();
    },
    // 日期组件回调
    handleChangeDate(val) {
      if (val) {
        this.searchForm.startdate = val[0];
        this.searchForm.enddate = val[1];
        this.searchForm.conditionDate = [val[0], val[1]];
        this.handleSearch();
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
    },
    // 日期组件回调
    handleChangeCheckDate(val) {
      if (val) {
        this.searchForm.startcheckdate = val[0];
        this.searchForm.endcheckdate = val[1];
        this.searchForm.checkDate = [val[0], val[1]];
        this.handleSearch();
      } else {
        this.searchForm.startcheckdate = "";
        this.searchForm.endcheckdate = "";
      }
    },
    // 日期组件回调
    handleChangeInspectionDate(val) {
      if (val) {
        this.searchForm.startinspectiondate = val[0];
        this.searchForm.endinspectiondate = val[1];
        this.searchForm.inspectionDate = [val[0], val[1]];
        this.handleSearch();
      } else {
        this.searchForm.startinspectiondate = "";
        this.searchForm.endinspectiondate = "";
      }
    },
    // 搜索按钮回调
    handleSearch() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (
          this.searchForm[k] != "" &&
          k != "conditionDate" &&
          k != "checkDate" &&
          k != "inspectionDate"
        ) {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      getLoad({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        console.log(res);
        if (res.data) {
          let {
            total,
            persontotal,
            companytotal,
            handletotal,
            completetotal,
            customeritems,
          } = res.data;
          this.count = res.count;
          this.total = total;
          this.persontotal = persontotal;
          this.companytotal = companytotal;
          this.handletotal = handletotal;
          this.completetotal = completetotal;
          this.pageData = customeritems;
          this.tableData = customeritems;
        } else {
          this.count = 0;
          this.total = 0;
          this.persontotal = 0;
          this.companytotal = 0;
          this.handletotal = 0;
          this.completetotal = 0;
          this.pageData = [];
        }
      });
    },
    // 弹框关闭回调
    handleDialogClose() {
      this.showDialog = false;
      this.$emit("close", false);
    },
    // 获取时间区间
    handleGetPastHalfYear() {
      let day2 = new Date();
      day2.setTime(day2.getTime());
      let today =
        day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
      // 先获取当前时间
      let curDate = new Date().getTime();
      // 将半年的时间单位换算成毫秒
      let halfYear = (365 / 2) * 24 * 3600 * 1000;
      let pastResult = curDate - halfYear; // 半年前的时间（毫秒单位）
      // 日期函数，定义起点为半年前
      let pastDate = new Date(pastResult),
        pastYear = pastDate.getFullYear(),
        pastMonth = pastDate.getMonth() + 1,
        pastDay = pastDate.getDate();
      let half = pastYear + "-" + pastMonth + "-" + pastDay;
      let jinnian = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      let sanninaqian = new Date(
        +new Date() + 8 * 3600 * 1000 - 86400 * 1000 * 365 * 3
      )
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.searchForm.conditionDate = [sanninaqian, jinnian];
      this.searchForm.startdate = sanninaqian;
      this.searchForm.enddate = jinnian;
      // this.searchForm.conditionDate = [today, today];
      // this.searchForm.startdate = today;
      // this.searchForm.enddate = today;
    },
    // 重置页面搜索条件
    handleReset() {
      this.searchForm = {
        conditionDate: [],
        checkDate: [],
        inspectionDate: [],
        regid: "",
        setmealcode: "",
        name: "",
        hiscode: "",
        telephone: "",
        idcard: "",
        checktype: "",
        companycode: "",
        startdate: "",
        enddate: "",
        batch: "",
        groupcode: "",
        status: "",
        persontype: "",
        startcheckdate: "",
        endcheckdate: "",
        inspectioncode: "",
        orderstatus: "",
      }; // 搜索表单对象
      this.total = 0;
      this.persontotal = 0;
      this.companytotal = 0;
      this.handletotal = 0;
      this.completetotal = 0;
      this.pageData = [];
      this.handleGetDetail(); // 页面加载获取单位信息
      this.handleGetPastHalfYear();
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
      let styleJson = {};
      styleJson.height = "32px";
      if (row.inspectioncode) {
        styleJson.color = "red";
      }
      return styleJson;
    },
    // 赋默认值无法切换回调
    handleSelectChange() {
      this.$forceUpdate();
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>