<template>
  <el-dialog class="search_dialog" :close-on-click-modal="false" :visible.sync="showDialog" width="60%" top="5%"
    :show-close="false">
    <!-- 头部按钮组 -->
    <div class="btn_group">
      <el-button type="primary" plain size="mini" @click="handleSearch">查询</el-button>
      <el-button type="primary" plain size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" v-if="pageFlag == 'totalcheck'" plain size="mini"
        @click="handleAllReturn">全部返回</el-button>
      <el-button type="primary" plain size="mini" @click="handleDialogClose">关闭</el-button>
    </div>
    <!-- 筛选条件表单 -->
    <div class="search_form">
      <div class="head">检索条件</div>
      <el-form ref="form" class="form_box" :model="searchForm" label-width="80px">
        <!-- <el-row>
          <el-col :span="6">
            <el-form-item size="mini" label="体检号">
              <el-input
                v-model="searchForm.regid"
                @keyup.native.enter="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="mini" label="性别">
              <el-select
                size="mini"
                @change="handleSearch"
                v-model="searchForm.sex"
                placeholder=""
              >
                <el-option label="未知" :value="0"></el-option>
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
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
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="5">
            <el-form-item size="mini" label="姓名">
              <el-input v-model="searchForm.name" @keyup.native.enter="handleSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item size="mini" label="联系电话">
              <el-input v-model="searchForm.telephone" @keyup.native.enter="handleSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item size="mini" label="身份证">
              <el-input v-model="searchForm.idcard" @keyup.native.enter="handleSearch"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item size="mini" label="年龄" class="df_form">
              <el-input
                v-model="searchForm.startage"
                @keyup.native.enter="handleSearch"
              ></el-input>
              <span class="df_form_sp">-</span>
              <el-input
                v-model="searchForm.endage"
                @keyup.native.enter="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="5">
            <el-form-item size="mini" class="check_select" label="体检类型">
              <el-select @change="handleSearch" v-model="searchForm.checktype" clearable placeholder="">
                <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name"
                  :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="check_select" size="mini" label="初/复检">
              <el-select size="mini" @change="handleSearch" v-model="searchForm.setmealcode" clearable filterable
                placeholder="">
                <!-- <el-option
                  v-for="item in packageItems"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option> -->
                <el-option label="全部" value="0"></el-option>
                <el-option label="初检" value="1"></el-option>
                <el-option label="复检" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item class="check_select" size="mini" label="团检名称">
              <el-select filterable clearable @change="handleSelectComany" v-model="searchForm.companycode"
                placeholder="">
                <el-option v-for="item in companyitems" :key="item.code" :label="`${item.code} ${item.name}`"
                  :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="check_select" size="mini" label="团检批次">
              <el-select @change="handleSelectBatch" style="width: 100%" v-model="searchForm.batch" placeholder="">
                <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="check_select" size="mini" label="团检分组">
              <el-select @change="handleCheckGroup" style="width: 100%" v-model="searchForm.groupcode" placeholder="">
                <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 当前人员队列信息 -->
    <el-button-group style="margin-right:20% ;">
      <el-button size="mini" type="primary" plain @click="(searchForm.persontype = ''), handleSearch()">全部</el-button>
      <el-button size="mini" type="primary" plain @click="(searchForm.persontype = '0'), handleSearch()">个检</el-button>
      <el-button size="mini" type="primary" plain @click="(searchForm.persontype = '1'), handleSearch()">团检</el-button>
    </el-button-group>
    <el-button-group>
      <el-button size="mini" type="primary" plain @click=" (searchForm.status = ''), handleSearch()">全部</el-button>
      <el-button size="mini" type="primary" plain @click="  (searchForm.status = '0'), handleSearch()">未预约</el-button>
      <el-button size="mini" type="primary" plain @click="   (searchForm.status = '1'), handleSearch()">已预约</el-button>
      <el-button size="mini" type="primary" plain @click="  (searchForm.status = '2'), handleSearch()">已签到</el-button>
      <el-button size="mini" type="primary" plain @click=" (searchForm.status = '5'), handleSearch()">已交表</el-button>
      <el-button size="mini" type="primary" plain @click=" (searchForm.status = '7'), handleSearch()">已总检</el-button>
    </el-button-group>

    <!-- 主体表格数据 -->
    <EasyTable class="page_table" height="100%" :data="pageData" :tableOptions="pageOptions"
      :radio-config="{ rowClick: true }" @row-dblclick="handleCheckPerson" :border="false"
      :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }"
      :cell-style="{ padding: '0' }" />
    <el-pagination :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[100, 200, 300, 500, 1000]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="count">
    </el-pagination>
    <!-- 三个框 -->
    <div style="padding-bottom:20px"></div>
    <el-row class="row">
      <el-col :span="5">
        <span class="title">疾病或异常</span>
        <div class="textBox">{{ conclusionObj.healthadvice || '暂无数据' }}</div>
      </el-col>
      <el-col :span="5">
        <span class="title">总检结论</span>
        <div class="textBox">{{ conclusionObj.conclusion || '暂无数据' }}</div>
      </el-col>
      <el-col :span="5">
        <span class="title">职业危害</span>
        <div class="textBox">{{ conclusionObj.evaluatename  || '暂无数据'}}</div>
      </el-col>
      <el-col :span="8">
        <span class="title">复查项目</span>
        <el-table :data="ReviewData" style="width: 100% ;height:200px ;overflow:auto;"
         :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }"
          :row-class-name="handleTableRowClassName" 
          @selection-change='handleReviewSelect'
          :header-cell-style="handleReturnStyle">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column prop="combinename" label="复查项目">
          </el-table-column>
          <el-table-column prop="remark" label="复查项目及要求">
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12" :offset="9"> 
            <el-button type="primary" @click="checkInFun">复查登记</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import {
  getPersonalDetail,
  getBatchOrGroup,
  getPageList,
  GetReviewGet,
  GetCause
} from "@/api/searchDialog.js";
import { getAllUser } from "@/api/customermanage.js";
import * as setdictionary from "@/api/setdictionary";
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
      conclusionObj: {
        conclusion: '',
        evaluatename: '',
        healthadvice: ''
      },
      ReviewData: [], //  复查项目数据
      showDialog: false, // 是否显示弹框
      ReviewselectData:[], // 复查项目选中的数据
      regid:'', // 双击保存regid
      packageItems: [],
      operatorItems: [],
      searchForm: {
        conditionDate: [],
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
        startage: "",
        endage: "",
        startprice: "",
        endprice: "",
        operatorcode: "",
      }, // 搜索表单对象
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
    };
  },
  computed: {
    // 主页表格配置
    pageOptions() {
      return [
        {
          title: "操作",
          width: 150,
          render: (h, data) => {
            return (
              <div style="display:flex">
                <el-link
                  type="primary"
                  size="mini"
                  class="name_box"
                  vOn: click_stop_prevent={() => this.handleCopy(data, "all")}
                >
                  复制登记
                </el-link>
                <el-link
                  style="margin-left: 10px;"
                  type="primary"
                  size="mini"
                  class="name_box"
                  vOn: click_stop_prevent={() =>
                    this.handleCopy(data, "projectDia")
                  }
                >
                  复制项目
                </el-link>
              </div>
            );
          },
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
      ];
    },
  },

  mounted() {
    this.showDialog = this.showSearch; // 是否显示弹框
    this.handleGetDetail(); // 页面加载获取单位信息
    this.handleGetPastHalfYear();
    this.handleGetPackage();
    getAllUser().then((res) => {
      this.operatorItems = res.data;
    });
  },

  methods: {
    //  复查项目选中的数据 回调
    handleReviewSelect(arr){
      this.ReviewselectData = arr
      // console.log(arr);
    },
    // 复查登记按钮回调
    checkInFun(){
      this.showDialog = false; // 关闭当前搜索框ReviewData
      // console.log('复查登记按钮回调');
      this.$emit('checkIn',this.ReviewselectData,this.regid,true)
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
    // 双击表格数据行选定数据
    handleCheckPerson(row) {
      console.log(row, '双击');
      this.regid = row.regid;
      GetReviewGet({ regid: row.regid }).then(res => {
        console.log(res, '获取复查');
        this.ReviewData = res.result
      })
      GetCause({ regid: row.regid }).then(res => {
        console.log(res, '获取结论');
        this.conclusionObj = {
          conclusion: res.conclusion ,
          evaluatename: res.evaluatename ,
          healthadvice: res.healthadvice 
        }

      })
    },
    // 双击表格数据行选定数据
    handleCopy(row, flag) {
      this.$emit("copy", { regid: row.regid, flag });
      // this.$emit("copy", row.regid);
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
        .catch((err) => { });
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
      console.log(val);
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
    // 搜索按钮回调
    handleSearch() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] != "" && k != "conditionDate") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      getPageList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
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
        startage: "",
        endage: "",
        startprice: "",
        endprice: "",
        operatorcode: "",
      };
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
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    // 赋默认值无法切换回调
    handleSelectChange() {
      this.$forceUpdate();
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>