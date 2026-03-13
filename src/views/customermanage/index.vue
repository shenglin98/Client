<template>
  <div class="customer_manage">
    <div class="customer_manage_box" v-if="showMessage">
      <!-- 头部操作控件 -->
      <sticky class="btn_group" :className="'sub-navbar'">
        <div class="filter-container">
          <permission-btn
            moduleName="customerResult"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          >
          </permission-btn>
        </div>
      </sticky>
      <!-- 主体内容 -->
      <div class="subject">
        <el-row class="condition_box">
          <el-col :span="6">
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                @click="(isMy = 0), handleGetCustomerSalesList()"
                >全部客户</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="(isMy = 1), handleGetCustomerSalesList()"
                >我的客户</el-button
              >
            </el-button-group>
          </el-col>
          <el-col :span="6" class="c_status">
            <div class="title">状态</div>
            <el-select
              size="mini"
              v-model="status"
              @change="handleGetCustomerSalesList"
              placeholder="请选择"
            >
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="有效" :value="0"></el-option>
              <el-option label="无效" :value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" class="c_search">
            <div class="title">搜索</div>
            <el-input
              placeholder="请输入内容"
              v-model="search"
              size="mini"
              clearable
              @keyup.enter.native="handleGetCustomerSalesList"
              @clear="handleGetCustomerSalesList"
            >
            </el-input>
          </el-col>
        </el-row>
        <!-- 主页表格 -->
        <div class="page_table">
          <vxe-table
            height="auto"
            border="inner"
            show-overflow
            :loading="loading"
            highlight-hover-row
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :data="pageData"
            :sort-config="{ trigger: 'cell' }"
            row-id="sasid"
            :checkbox-config="{ reserve: true }"
            @checkbox-change="handleSelectSetMeal"
            @checkbox-all="handleSelectAll"
          >
            <!-- <vxe-table-column type="checkbox" width="45"></vxe-table-column> -->
            <vxe-table-column
              field="companyname"
              title="客户名称"
              width="250px"
              show-overflow
            >
              <template slot-scope="scope">
                <el-link type="primary" @click="jumpMsg(scope.row.sasid)">{{
                  scope.row.companyname
                }}</el-link>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="shortname"
              title="客户简称"
              width="150px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="companyhname"
              title="上级单位"
              width="150px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="status"
              title="状态"
              width="100px"
              show-overflow
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">有效</span>
                <span v-if="scope.row.status == 1">无效</span>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="followupname"
              title="跟进人"
              width="150px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="operatordate"
              title="跟进时间"
              width="180px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="typename"
              title="单位类型"
              width="150px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="contacts"
              title="联系人"
              width="150px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="telephone"
              title="联系电话"
              width="180px"
              show-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="name"
              min-width="100px"
              title="操作"
              show-overflow
            >
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  @click="handleDelCustomer(scope.row.sasid)"
                  >删除</el-link
                >
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <!-- 弹窗 -->
        <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose"
          :close-on-click-modal="false"
          :show-close="false"
        >
          <div class="dialog_box">
            <div class="dialog_hear">
              <div class="dialog_title">客户信息</div>
              <!-- <div class="dialog_title">状态：跟进中</div> -->
            </div>
            <div class="dialog_content">
              <el-form ref="form" :model="form" label-width="80px">
                <div class="ipt_one">
                  <el-form-item label="客户名称">
                    <el-input size="mini" v-model="form.companyname"></el-input
                    ><i
                      @click="searchCustomerName"
                      class="el-icon-search search_icon"
                    ></i>
                  </el-form-item>
                  <el-form-item label="客户简称" class="negative_left">
                    <el-input size="mini" v-model="form.shortname"></el-input>
                  </el-form-item>
                  <el-form-item label="客户类型">
                    <el-select
                      size="mini"
                      v-model="form.typecode"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in optionsCustomerType"
                        size="mini"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="ipt_one">
                  <el-form-item label="上级单位">
                    <el-input
                      size="mini"
                      v-model="form.companyhname"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="联系人">
                    <el-input size="mini" v-model="form.contacts"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话">
                    <el-input size="mini" v-model="form.telephone"></el-input>
                  </el-form-item>
                </div>
                <div class="ipt_one">
                  <el-form-item label="邮箱">
                    <el-input size="mini" v-model="form.email"></el-input>
                  </el-form-item>
                  <el-form-item label="传真">
                    <el-input size="mini" v-model="form.faxnumber"></el-input>
                  </el-form-item>
                  <el-form-item label="邮编">
                    <el-input size="mini" v-model="form.postalcode"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="单位地址">
                  <el-input size="mini" v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input size="mini" v-model="form.remark"></el-input>
                </el-form-item>
                <div class="ipt_one">
                  <el-form-item label="跟进人">
                    <el-select
                      size="mini"
                      v-model="form.followupcode"
                      placeholder="请选择"
                      clearable
                      @change="handleChangeFollowupcode"
                    >
                      <el-option
                        v-for="item in optionsFollowPeople"
                        size="mini"
                        :key="item.id"
                        :label="item.name"
                        :value="item.account"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="创建人">
                    <el-select
                      size="mini"
                      v-model="form.operatorcode"
                      placeholder="请选择"
                      clearable
                      :disabled="isCheck"
                    >
                      <el-option
                        v-for="item in optionsCreatePeople"
                        size="mini"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <el-date-picker
                      size="mini"
                      v-model="form.operatordate"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :disabled="isCheck"
                    >
                    </el-date-picker>
                  </el-form-item> -->
                </div>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer operation">
              <el-button size="mini" @click="handleCloseAddList"
                >取 消</el-button
              >
              <el-button size="mini" type="primary" @click="handleSaveAdd"
                >保 存</el-button
              >
            </span>
          </div>
        </el-dialog>
        <!-- 客户名称弹框 -->
        <el-dialog
          title=""
          :visible.sync="showDialog"
          class="customer_name"
          width="45%"
          top="20%"
          :before-close="handleClose"
          :close-on-click-modal="false"
          :show-close="false"
        >
          <div class="bg-white" style="height: 380px">
            <el-table
              ref="mainTable"
              height="380px"
              :data="customerList"
              stripe
              fit
              :row-style="{ height: '32px' }"
              :cell-style="{ padding: '0px' }"
              :header-cell-style="{
                background: '#b6cfee',
                fontWeight: 600,
                color: '#18253a',
                height: '40px',
              }"
              highlight-current-row
              style="width: 100%"
              @row-click="handleCheckCustomer"
            >
              <el-table-column
                align="left"
                prop="companycode"
                width="85px"
                label="单位编码"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="companyname"
                width="230px"
                label="单位名称"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="left"
                prop="companyhname"
                width="230px"
                label="上级单位"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="shortname"
                width="150px"
                label="单位简称"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="typename"
                width="150px"
                label="单位类型"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="contacts"
                label="联系人"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="telephone"
                label="联系电话"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="faxnumber"
                label="传真号码"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="email"
                label="邮箱"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="address"
                label="地址"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="postalcode"
                label="邮编"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="remark"
                label="备注"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="pycode"
                label="拼音码"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="wbcode"
                label="五笔码"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="seqno"
                label="排序"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="left"
                prop="healthcard"
                label="门诊卡号"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer operation">
            <el-button size="mini" @click="showDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 记录数 -->
        <div class="record">记录数：{{ pageData.length }}</div>
      </div>
    </div>
    <transition name="fade" mode="in-out">
      <CustomerInformation :sasid="sasid" v-if="!showMessage" @close="test" />
    </transition>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import CustomerInformation from "./components/CustomerInformation";
import * as company_archives from "@/api/company_archives";
import {
  getCustomerSalesList,
  getAllUser,
  getPublicConfig,
  setCustomerSalesAdd,
  setCustomerSalesDel,
} from "@/api/customermanage.js";
export default {
  name: "customerbarcode",

  components: { Sticky, permissionBtn, CustomerInformation },

  data() {
    return {
      isCheck: false,
      sasid: "",
      customerList: [],
      showDialog: false,
      status: -1, // 检索状态
      search: "", // 检索关键字
      isMy: 0, // 检索人员状态
      loading: false, // 加载特效
      pageData: [], // 列表表格数据
      dialogVisible: false, //弹窗
      form: {
        companyname: "", //客户名称
        shortname: "", //客户简称
        typecode: "",
        companyhname: "", //上级单位
        contacts: "", //联系人
        telephone: "", //联系电话
        email: "", //邮箱
        faxnumber: "", //传真
        postalcode: "", //邮编
        address: "", //单位地址
        remark: "", //备注
        followupcode: "", //跟进人
        operatorcode: "", //操作人
        operatordate: "", // 创建时间
      },
      // 客户类型
      optionsCustomerType: [],
      // 跟进人
      optionsFollowPeople: [],
      // 创建人
      optionsCreatePeople: [],
      valueCreatePeople: "",
      showMessage: true, //控制组件显示
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mounted() {
    this.handleGetCustomerSalesList();
  },

  methods: {
    handleChangeFollowupcode(value) {
      if (!value) {
        this.form.followupname = "";
        return;
      } else {
        let index = this.optionsFollowPeople.filter(
          (k) => k.account === value
        )[0];
        this.form.followupname = index.name;
      }
    },
    handleCheckCustomer(row) {
      this.form.companyname = row.companyname || ""; //客户名称
      this.form.shortname = row.shortname || ""; //客户简称
      this.form.typecode = row.typecode || "";
      this.form.companyhname = row.companyhname || ""; //上级单位
      this.form.contacts = row.contacts || ""; //联系人
      this.form.telephone = row.telephone || ""; //联系电话
      this.form.email = row.email || ""; //邮箱
      this.form.faxnumber = row.faxnumber || ""; //传真
      this.form.postalcode = row.postalcode || ""; //邮编
      this.form.address = row.address || ""; //单位地址
      this.form.remark = row.remark || ""; //备注
      this.form.followupcode = row.followupcode || ""; //跟进人
      this.form.operatorcode = row.operatorcode || ""; //操作人
      this.form.operatordate = row.operatordate || ""; //创建时间
      this.isCheck = true;
      this.showDialog = false;
    },
    // 删除客户列表数据
    handleDelCustomer(delId) {
      if (!delId) return;
      setCustomerSalesDel({ sasid: delId }).then((res) => {
        this.$message.success(res.message);
        this.handleGetCustomerSalesList();
      });
    },
    handleSelectAll({ records }) {
      this.selectList = records;
    },
    handleSelectSetMeal({ records, checked, row }) {
      this.selectList = records;
    },
    // 保存新增
    handleSaveAdd() {
      setCustomerSalesAdd(this.form).then((res) => {
        this.$message.success(res.message);
        this.handleGetCustomerSalesList();
        this.handleCloseAddList();
      });
    },
    // 获取列表数据
    handleGetCustomerSalesList() {
      getCustomerSalesList({
        key: this.search,
        status: this.status,
        isMy: this.isMy,
      }).then((res) => {
        this.pageData = res.data.customer_saless;
      });
    },
    // 关闭当前新增弹框
    handleCloseAddList() {
      this.handleResetForm();
      this.dialogVisible = false;
    },
    // 重置新增表单
    handleResetForm() {
      this.form = {
        companyname: "", //客户名称
        shortname: "", //客户简称
        typecode: "",
        companyhname: "", //上级单位
        contacts: "", //联系人
        telephone: "", //联系电话
        email: "", //邮箱
        faxnumber: "", //传真
        postalcode: "", //邮编
        address: "", //单位地址
        remark: "", //备注
        followupcode: "", //跟进人
        operatorcode: "", //操作人
        operatordate: "", // 创建时间
      };
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
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogVisible = true;
          getAllUser().then((res) => {
            this.optionsFollowPeople = res.data;
            this.optionsCreatePeople = res.data;
          });
          getPublicConfig({ cc: "ComplanyType" }).then((res) => {
            this.optionsCustomerType = res.result;
          });
          this.form.operatordate = new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnReset": // 刷新
          this.$reload();
          break;
        case "btnPrint": // 删除
          console.log("删除");
          break;
        case "btnExport1": // 导出
          console.log("导出");
          break;
        default:
          break;
      }
    },
    // 关闭新增弹窗
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    // 搜索客户姓名
    searchCustomerName() {
      this.showDialog = true;
      company_archives
        .getList({ page: 1, limit: 100000, key: "" })
        .then((response) => {
          this.customerList = response.data;
        });
    },
    // 跳转到客户详请
    jumpMsg(val) {
      this.showMessage = false;
      this.sasid = val;
    },
    test() {
      this.showMessage = true;
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>