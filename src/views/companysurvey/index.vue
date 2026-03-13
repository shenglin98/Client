<template>
  <div class="company_survey">
    <!-- 头部操作控件 -->
    <div class="head_box">
      <el-radio-group v-model="messageStatus" size="small">
        <el-radio-button :label="0">基本信息</el-radio-button>
        <el-radio-button :label="1">其他信息</el-radio-button>
      </el-radio-group>
      <sticky class="btn_group" :className="'sub-navbar'">
        <div class="filter-container">
          <permission-btn moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked">
          </permission-btn>
        </div>
      </sticky>
    </div>
    <div class="content">
      <!-- 中间主体内容 -->
      <div class="subject mt2">
        <!-- 头部筛选条件 -->
        <div class="search_top">
          <el-radio-group v-model="status" @change="handleGetSurveyTotalLoad" size="small">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">体检中</el-radio-button>
            <el-radio-button label="0">未开始</el-radio-button>
            <el-radio-button label="2">已完成</el-radio-button>
          </el-radio-group>
          <div class="input_box">
            <el-select size="mini" @change="handleChangeCompany" placeholder="请选择单位" v-model="company" clearable filterable>
              <el-option v-for="item,i in companyitems" :key="item.code + i" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
            </el-select>

          </div>
        </div>
        <!-- 主体内容盒子 -->
        <div class="details_box">
          <div class="details_item" v-for="item in surveyTotal" :key="item.regid" @click="viewTheDetailFun(item)">
            <!-- 头部标题 -->
            <div class="title_box">
              <div class="b_title">{{ item.companyname }}</div>
              <div class="s_title">{{ item.batch }}</div>
              <el-tag size="small">{{ item.statuscn }}</el-tag>
            </div>
            <!-- 时间范围 -->
            <div class="time_box mt3">
              <div class="start_time">开始 {{ item.startdate }}</div>
              <div class="line">-</div>
              <div class="end_time">结束 {{ item.enddate }}</div>
            </div>
            <!-- 数据盒子 -->
            <div class="data_box">
              <div class="data_item">
                <div class="num bg1">{{ item.total }}</div>
                <div class="text">总数</div>
              </div>
              <div class="data_item">
                <div class="num bg2">{{ item.checkedtotal }}</div>
                <div class="text">已检</div>
              </div>
              <div class="data_item">
                <div class="num bg3">{{ item.unchecktotal }}</div>
                <div class="text">未检</div>
              </div>
              <div class="data_item">
                <div class="num bg4">{{ item.settlementtotal }}</div>
                <div class="text">已结</div>
              </div>
              <div class="data_item">
                <div class="num bg5">{{ item.unsettlementtotal }}</div>
                <div class="text">未结</div>
              </div>
            </div>
          </div>
          <!-- <el-checkbox border :label="0">
            <div class="title_box">
              <div class="b_title">广发银行</div>
              <div class="s_title">2109</div>
            </div>
            <div class="time_box mt1">
              <div class="start_time">开始 2021-09-02</div>
              <div class="line">-</div>
              <div class="end_time">结束 2021-09-03</div>
            </div>
            <div class="data_box">
              <div class="data_item">
                <div class="num bg1">20000</div>
                <div class="text">总数</div>
              </div>
              <div class="data_item">
                <div class="num bg2">500</div>
                <div class="text">已检</div>
              </div>
              <div class="data_item">
                <div class="num bg3">580</div>
                <div class="text">未检</div>
              </div>
              <div class="data_item">
                <div class="num bg4">1378</div>
                <div class="text">已结</div>
              </div>
              <div class="data_item">
                <div class="num bg5">26</div>
                <div class="text">未结</div>
              </div>
            </div>
          </el-checkbox> -->
        </div>
        <!-- DetailDialog -->
        <el-dialog title="查看明细" class="DetailDialogClas" :visible.sync="DetailDialogVisible" top="10vh" width="60%" :destroy-on-close="true">
          <el-row style="display:flex;  justify-content: flex-end;">
            <el-button type="primary" size="mini">通知</el-button>
            <el-button type="primary" size="mini" @click="DetailDialogVisible = false">关闭</el-button>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-button-group>
                <el-button size="mini" :type="!detailItem.status ? 'primary' : '' " @click="setDetailStatusFun(' ')">全部</el-button>
                <el-button size="mini" :type="detailItem.status == 1 ? 'primary' : '' " @click="setDetailStatusFun(1)">未检</el-button>
                <el-button size="mini" :type="detailItem.status == 2 ? 'primary' : '' " @click="setDetailStatusFun(2)">检中</el-button>
                <el-button size="mini" :type="detailItem.status == 3 ? 'primary' : '' " @click="setDetailStatusFun(3)">完成</el-button>
                <el-button size="mini" :type="detailItem.status == 4 ? 'primary' : '' " @click="setDetailStatusFun(4)">已结</el-button>
                <el-button size="mini" :type="detailItem.status == 5 ? 'primary' : '' " @click="setDetailStatusFun(5)">未结</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="6">
              <el-form :inline="true" :model="detailItem" class="demo-form-inline" style="width: 100%;">
                <el-form-item label="姓名:">
                  <el-input v-model="detailItem.name" placeholder="请输入检索内容" clearable size="mini" @keyup.enter.native="DialogDetailserach"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-table v-loading="detailTableloading" height="600" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="detailTableData" :header-cell-style="handleReturnStyle">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="regid" label="体检号"></el-table-column>
            <el-table-column prop="name" label="名字"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="telephone" label="手机号"></el-table-column>
            <el-table-column prop="idcard" label="身份证"></el-table-column>
            <el-table-column prop="companyname" label="团检"></el-table-column>
            <el-table-column prop="batch" label="批次"></el-table-column>
            <el-table-column prop="statuscn" label="状态"></el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <!-- 底部盒子 -->
      <div class="footer mt2">
        <div class="title">近期排检</div>
        <div class="inspect">
          <div class="inspect_item" v-for="(item, index) in personTotal" :key="index + 'k'">
            <div class="item_head">
              <div class="i_title">{{ item.title }}</div>
              <div class="i_sex">
                <span>男</span>
                <span>女</span>
              </div>
            </div>
            <div class="item_item_box">
              <div class="item_item" v-for="(i, k) in item.groupitems" :key="i.companycode+k">
                <div class="i_title">{{ i.companyname }}</div>
                <div class="i_sex">
                  <span class="bgd">{{ i.mantotal }}</span>
                  <span class="bgs">{{ i.womantotal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- 检索组件 -->
    <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" />
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import SearchDialog from "@/components/searchDialog";
import {
  getSurveyTotalLoad,
  getPersonTotalLoad,
  getCompanyList,
  CustomerRegisterLoad,
} from "@/api/companysurvey.js";
import { mapGetters } from "vuex";

export default {
  name: "companysurvey",

  components: { Sticky, permissionBtn, SearchDialog },

  data() {
    return {
      showSearch: false, // 显示检索组件
      messageStatus: 0, // 头部信息页状态
      status: "", // 当前筛选状态 全部：“”,未开始：“0”，体检中：“1”，已完成：“2”
      inputName: "", // 当前筛选状态
      checkDetails: [], // 当前勾选详情
      companyitems: [], // 单位数据列表
      company: "", // 选中公司code
      surveyTotal: [], // 团检概况统计列表数据
      personTotal: [], // 近期团检人数统计列表数据
      DetailDialogVisible: false, // 查看明细弹框的dialog开关
      detailTableData: [], //明细表格数据
      detailTableloading: true, // 明细表格加载开关
      detailItem: {
        batch: "",
        companycode: "",
        status: "",
        name: "", // 明细搜索字段
        page: 1,
        limit: 20,
      },
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  mounted() {
    // 页面加载获取数据
    this.handleGetCompanyList();
    this.handleGetSurveyTotalLoad();
    this.handleGetPersonTotalLoad();
  },

  methods: {
    // 点击健康档案行数据回调
    viewTheDetailFun(item) {
      this.detailItem.batch = item.batch; // 保留当前数据,后续请求不同状态需要
      this.detailItem.companycode = item.companycode;
      this.detailItem.status = "";
      this.detailItem.name = "";
      this.DetailDialogVisible = true;
      this.getViewDataFun(this.detailItem);
    },
    // 获取体检人员明细
    getViewDataFun(item) {
      console.log(item);
      let whereitems = [
        {
          key: "batch",
          value: item.batch,
        },
        {
          key: "companycode",
          value: item.companycode,
        },
        {
          key: "status", // 明细表格状态  全部:不传  未检:1 检中:2 完成:3 已结:4 未结:5
          value: item.status,
        },
        {
          key: "name",
          value: item.name,
        },
      ];
      CustomerRegisterLoad({
        page: this.detailItem.page,
        limit: this.detailItem.limit,
        whereitems,
      }).then((res) => {
        this.detailTableloading = true;
        if (res.code == 200) {
          this.detailTableData = res.result;
          this.detailTableloading = false;
        }
      });
    },
    // 点击明细弹框 按钮组回调
    setDetailStatusFun(val) {
      this.detailItem.status = val;
      this.getViewDataFun(this.detailItem);
    },
    // 明细弹框 搜索回调
    DialogDetailserach() {
      this.getViewDataFun(this.detailItem);
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
    // 获取近期团检人数统计列表回调
    handleGetPersonTotalLoad() {
      let whereitems = [];
      getPersonTotalLoad({
        whereitems,
        page: 1,
        limit: 100000,
      }).then((res) => {
        this.personTotal = res.result;
      });
    },
    // 获取团检概况统计列表回调
    handleGetSurveyTotalLoad() {
      let whereitems = [
        {
          key: "companycode",
          value: this.company,
        },
        {
          key: "status",
          value: this.status,
        },
      ];
      getSurveyTotalLoad({
        whereitems,
        page: 1,
        limit: 100000,
      }).then((res) => {
        this.surveyTotal = res.result;
        console.log(this.surveyTotal);
      });
    },
    // 改变选择单位回调
    handleChangeCompany() {
      this.handleGetSurveyTotalLoad();
    },
    // 获取公司集合列表
    handleGetCompanyList() {
      getCompanyList().then((res) => {
        this.companyitems = res.result.companyitems;
        let company = res.result.companyitems.filter((k) => k.selected)[0];
        company && (this.company = company.code);
      });
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
    },
    // 检索组件提交回调
    handleSearchSubmit(regid) {
      console.log(regid);
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 查询
          this.handleShowSearch();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
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