<template>
  <div class="orderquery">
    <div class="head_box">
      <!-- 头部按钮 -->
      <div class="filter-container">
        <div class="filter-container-in">
          <permission-btn
            moduleName="personalregister"
            ref="personalregister"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          ></permission-btn>
        </div>
      </div>
      <div class="title">检索条件</div>
      <el-form
        class="search_form"
        ref="searchForm"
        :model="searchForm"
        label-width="80px"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item label="订单日期" size="mini">
              <el-date-picker
                style="width: 260px"
                v-model="dateOrientation"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="handleChangeDate"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button-group>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleSetDate('now')"
                >今天</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleSetDate('prev')"
                >前一天</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleSetDate('next')"
                >后一天</el-button
              >
            </el-button-group>
          </el-col>
          <el-col :span="5">
            <el-button-group>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="(searchForm.persontype = ''), handleGetOrderSearch()"
                >全部</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                @click="(searchForm.persontype = '0'), handleGetOrderSearch()"
                >个检</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                @click="(searchForm.persontype = '1'), handleGetOrderSearch()"
                >团检</el-button
              >
            </el-button-group>
          </el-col>
          <el-col :span="5">
            <el-button-group>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="(searchForm.ordertype = ''), handleGetOrderSearch()"
                >全部</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                @click="
                  (searchForm.ordertype = 'offline'), handleGetOrderSearch()
                "
                >线下</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                @click="
                  (searchForm.ordertype = 'online'), handleGetOrderSearch()
                "
                >线上</el-button
              >
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="体检号" size="mini" class="mbzero">
              <el-input
                v-model="searchForm.regid"
                @keyup.enter.native="handleGetOrderSearch"
                @clear="handleGetOrderSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="姓名" size="mini" class="mbzero">
              <el-input
                v-model="searchForm.name"
                @keyup.enter.native="handleGetOrderSearch"
                @clear="handleGetOrderSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系电话" size="mini" class="mbzero">
              <el-input
                v-model="searchForm.telephone"
                @keyup.enter.native="handleGetOrderSearch"
                @clear="handleGetOrderSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="身份证" size="mini" class="mbzero">
              <el-input
                v-model="searchForm.idcard"
                @keyup.enter.native="handleGetOrderSearch"
                @clear="handleGetOrderSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="团检名称" size="mini" class="mbzero">
              <el-select
                v-model="searchForm.companycode"
                @change="handleGetOrderSearch"
                clearable
              >
                <el-option
                  v-for="item in companyitems"
                  :key="item.code"
                  :label="`${item.code}　${item.name}`"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="subject">
      <div class="count_box">
        <div class="count_item">
          <div class="title bg1">全部</div>
          <div class="value_box">
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleAllScreen('')">总数</div>
              <div class="val_number">{{ total }}</div>
            </div>
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleAllScreen('1')">已检</div>
              <div class="val_number">{{ total1 }}</div>
            </div>
            <div class="value_item">
              <div class="val_title" @dblclick="handleAllScreen('0')">未检</div>
              <div class="val_number">{{ total0 }}</div>
            </div>
          </div>
          <!-- total -->
        </div>
        <div class="count_item">
          <div class="title bg2">个检</div>
          <div class="value_box">
            <div class="value_item bor">
              <div class="val_title" @dblclick="handlePersonalScreen('')">
                总数
              </div>
              <div class="val_number">{{ persontotal }}</div>
            </div>
            <div class="value_item bor">
              <div class="val_title" @dblclick="handlePersonalScreen('1')">
                已检
              </div>
              <div class="val_number">{{ persontotal1 }}</div>
            </div>
            <div class="value_item">
              <div class="val_title" @dblclick="handlePersonalScreen('0')">
                未检
              </div>
              <div class="val_number">{{ persontotal0 }}</div>
            </div>
          </div>
          <!-- total -->
        </div>
        <div class="count_item">
          <div class="title bg3">团检</div>
          <div class="value_box">
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleCompanyScreen('')">
                总数
              </div>
              <div class="val_number">{{ companytotal }}</div>
            </div>
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleCompanyScreen('1')">
                已检
              </div>
              <div class="val_number">{{ companytotal1 }}</div>
            </div>
            <div class="value_item">
              <div class="val_title" @dblclick="handleCompanyScreen('0')">
                未检
              </div>
              <div class="val_number">{{ companytotal0 }}</div>
            </div>
          </div>
          <!-- total -->
        </div>
        <div class="count_item">
          <div class="title bg4">线下</div>
          <div class="value_box">
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleOfflinScreen('')">
                总数
              </div>
              <div class="val_number">{{ offlintotal }}</div>
            </div>
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleOfflinScreen('1')">
                已检
              </div>
              <div class="val_number">{{ offlintotal1 }}</div>
            </div>
            <div class="value_item">
              <div class="val_title" @dblclick="handleOfflinScreen('0')">
                未检
              </div>
              <div class="val_number">{{ offlintotal0 }}</div>
            </div>
          </div>
          <!-- total -->
        </div>
        <div class="count_item">
          <div class="title bg5">线上</div>
          <div class="value_box">
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleOnlineScreen('')">
                总数
              </div>
              <div class="val_number">{{ onlinetotal }}</div>
            </div>
            <div class="value_item bor">
              <div class="val_title" @dblclick="handleOnlineScreen('1')">
                已检
              </div>
              <div class="val_number">{{ onlinetotal1 }}</div>
            </div>
            <div class="value_item">
              <div class="val_title" @dblclick="handleOnlineScreen('0')">
                未检
              </div>
              <div class="val_number">{{ onlinetotal0 }}</div>
            </div>
          </div>
          <!-- total -->
        </div>
      </div>
      <!-- 表格数据 -->
      <EasyTable
        :loading="loading"
        class="page_table"
        ref="pageTable"
        height="100%"
        :data="pageTableData"
        :tableOptions="pageTableOptions"
        :radio-config="{ fetch: true, rowClick: true }"
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
        :page-sizes="[100, 200, 300]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import permissionBtn from "@/components/PermissionBtn";
import { getOrderSearch, getOrderSearchList } from "@/api/orderquery.js";
// 引入页面接口
import { getPersonalDetail } from "@/api/personalregister.js";
import { mapGetters } from "vuex";

export default {
  name: "orderquery",

  components: { permissionBtn },

  data() {
    return {
      dateOrientation: [],
      searchForm: {
        name: "",
        regid: "",
        telephone: "",
        idcard: "",
        companycode: "",
        persontype: "",
        ordertype: "",
        startdate: "",
        enddate: "",
        orderstatus: "",
      }, // 检索表单
      loading: false,
      pageTableData: [], // 表格数据
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      total: 0, //	int	总数
      total0: 0, //	int	总数
      total1: 0, //	int	总数
      persontotal: 0, //	int	个人总数
      persontotal0: 0, //	int	个人总数
      persontotal1: 0, //	int	个人总数
      companytotal: 0, //	int	团检总数
      companytotal0: 0, //	int	团检总数
      companytotal1: 0, //	int	团检总数
      onlinetotal: 0, //	int	线上总数
      onlinetotal0: 0, //	int	线上总数
      onlinetotal1: 0, //	int	线上总数
      offlintotal: 0, //	int	线下总数
      offlintotal0: 0, //	int	线下总数
      offlintotal1: 0, //	int	线下总数
      companyitems: [],
      isClick: false,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    pageTableOptions() {
      return [
        {
          title: "体检状态",
          prop: "statuscn",
          width: 80,
          omit: 1,
        },
        {
          width: 25,
          render: (h, data) => {
            let src = "";
            switch (data.status) {
              case 0:
                src = require("@/assets/images/登记.png");
                break;
              case 1:
                src = require("@/assets/images/预约.png");
                break;
              case 2:
                src = require("@/assets/images/签到.png");
                break;
              case 3:
                src = require("@/assets/images/检查.png");
                break;
              case 4:
                src = require("@/assets/images/交表.png");
                break;
              case 5:
                src = require("@/assets/images/总检.png");
                break;
              case 6:
                src = require("@/assets/images/总检.png");
                break;
              case 7:
                src = require("@/assets/images/审核.png");
                break;
              default:
                break;
            }
            return (
              <img
                class="user-avatar"
                draggable={false}
                style="width:15px;height:15px;"
                src={src}
              />
            );
          },
        },
        {
          title: "姓名",
          width: 80,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleJumpPage(data)}
              >
                {data.name}
              </el-link>
            );
          },
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 60,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
          omit: 1,
        },
        {
          title: "年龄",
          prop: "age",
          width: 60,
          returnVal: (value, data) => {
            return `${value} ${data.ageunit}`;
          },
          omit: 1,
        },
        {
          title: "联系电话",
          prop: "telephone",
          width: 110,
          omit: 1,
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 170,
          omit: 1,
        },
        {
          title: "体检号",
          prop: "regid",
          width: 120,
          omit: 1,
        },
        {
          title: "团检名称",
          prop: "companyname",
          omit: 1,
        },
        {
          title: "批次",
          prop: "batch",
          width: 100,
          omit: 1,
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 150,
          omit: 1,
        },
        {
          title: "预约日期",
          prop: "checkdate",
          width: 150,
          omit: 1,
        },
      ];
    },
  },

  mounted() {
    this.handleGetRegisterDate(); // 设置默认日期
    this.handleGetDetail(); // 获取下拉数据
  },

  methods: {
    // 线上筛选模块双击
    handleOnlineScreen(val) {
      if (!this.isClick) return;
      this.searchForm.orderstatus = val;
      this.searchForm.persontype = "";
      this.searchForm.ordertype = "online";
      this.handleGetOrderSearchList();
    },
    // 线下筛选模块双击
    handleOfflinScreen(val) {
      if (!this.isClick) return;
      this.searchForm.orderstatus = val;
      this.searchForm.persontype = "";
      this.searchForm.ordertype = "offline";
      this.handleGetOrderSearchList();
    },
    // 团检筛选模块双击
    handleCompanyScreen(val) {
      if (!this.isClick) return;
      this.searchForm.orderstatus = val;
      this.searchForm.persontype = "1";
      this.searchForm.ordertype = "";
      this.handleGetOrderSearchList();
    },
    // 个检筛选模块双击
    handlePersonalScreen(val) {
      if (!this.isClick) return;
      this.searchForm.orderstatus = val;
      this.searchForm.persontype = "0";
      this.searchForm.ordertype = "";
      this.handleGetOrderSearchList();
    },
    // 全部筛选模块双击
    handleAllScreen(val) {
      if (!this.isClick) return;
      this.searchForm.orderstatus = val;
      this.searchForm.persontype = "";
      this.searchForm.ordertype = "";
      this.handleGetOrderSearchList();
    },
    // 获取主页表格数据 仅获取表格不改变筛选数据
    handleGetOrderSearchList() {
      if (this.searchForm.startdate == "" || this.searchForm.enddate == "") {
        this.$message.warning("时间条件不允许为空!");
        return false;
      }
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item]) {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      getOrderSearchList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        if (!res.data) {
          this.$message.warning("当前暂无数据!");
          this.pageTableData = [];
          return false;
        }
        this.count = res.count;
        this.pageTableData = res.data.customeritems;
      });
    },
    // 点击人员名称跳转
    handleJumpPage(data) {
      if (!data) return;
      this.$router.push({
        path: `/personalregister/${this.Hospitals}`,
        query: { regid: data.regid },
      });
    },
    // 获取列表数据
    handleGetOrderSearch() {
      if (this.searchForm.startdate == "" || this.searchForm.enddate == "") {
        this.$message.warning("时间条件不允许为空!");
        return false;
      }
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item]) {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      getOrderSearch({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      }).then((res) => {
        console.log(res);
        if (!res.data) {
          this.$message.warning("当前暂无数据!");
          this.$reload();
          return false;
        }
        this.isClick = true;
        this.count = res.count;
        this.total = res.data.total;
        this.total0 = res.data.total0;
        this.total1 = res.data.total1;
        this.persontotal = res.data.persontotal;
        this.persontotal0 = res.data.persontotal0;
        this.persontotal1 = res.data.persontotal1;
        this.companytotal = res.data.companytotal;
        this.companytotal0 = res.data.companytotal0;
        this.companytotal1 = res.data.companytotal1;
        this.onlinetotal = res.data.onlinetotal;
        this.onlinetotal0 = res.data.onlinetotal0;
        this.onlinetotal1 = res.data.onlinetotal1;
        this.offlintotal = res.data.offlintotal;
        this.offlintotal0 = res.data.offlinetotal0;
        this.offlintotal1 = res.data.offlinetotal1;
        this.pageTableData = res.data.customeritems;
      });
    },
    // 获取下拉数据
    handleGetDetail() {
      getPersonalDetail().then((res) => {
        let { companyitems } = res.result;
        this.companyitems = companyitems;
      });
    },
    // 日期组件改变回调
    handleChangeDate(value) {
      if (value) {
        this.dateOrientation = [value[0], value[1]];
        this.$set(this.searchForm, "startdate", value[0]);
        this.$set(this.searchForm, "enddate", value[1]);
      } else {
        this.dateOrientation = ["", ""];
        this.$set(this.searchForm, "startdate", "");
        this.$set(this.searchForm, "enddate", "");
      }
      this.handleGetOrderSearch();
    },
    // 设置日期按钮组回调
    handleSetDate(flag) {
      // 获取条件计算日期范围回调
      const end = new Date();
      const start = new Date();
      if (flag == "now") {
        this.$set(this.searchForm, "startdate", this.gettime(end));
        this.$set(this.searchForm, "enddate", this.gettime(end));
        this.dateOrientation = [this.gettime(end), this.gettime(end)];
      } else if (flag == "prev") {
        start.setTime(
          start.getTime() - 3600 * 1000 * 24 * +30 - 24 * 60 * 60 * 1000
        );
        end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
        this.$set(this.searchForm, "startdate", this.gettime(start));
        this.$set(this.searchForm, "enddate", this.gettime(end));
        this.dateOrientation = [this.gettime(start), this.gettime(end)];
      } else if (flag == "next") {
        start.setTime(
          start.getTime() - 3600 * 1000 * 24 * +30 + 24 * 60 * 60 * 1000
        );
        end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
        this.$set(this.searchForm, "startdate", this.gettime(start));
        this.$set(this.searchForm, "enddate", this.gettime(end));
        this.dateOrientation = [this.gettime(start), this.gettime(end)];
      }
      this.handleGetOrderSearch();
    },
    // 登记日期设置默认值回调
    handleGetRegisterDate() {
      // 获取条件计算日期范围回调
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * +30);
      this.searchDate = [this.gettime(start), this.gettime(end)];
      this.dateOrientation = [this.gettime(start), this.gettime(end)];
      this.searchForm.startdate = this.gettime(start);
      this.searchForm.enddate = this.gettime(end);
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
      this.handleGetOrderSearch();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleGetOrderSearch();
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      switch (domId) {
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnSearch": // 检索
          this.handleGetOrderSearch();
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