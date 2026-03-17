<template>
  <div class="personalcharge">
    <div class="subject">
      <!-- 收费搜索盒子 -->
      <div class="search_box">
        <div class="sb_title">检索条件</div>
        <div class="sb_content">
          <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
            <div class="content">
              <div
                class="content_item"
                v-for="item in checkupCodeArr"
                :key="item.code"
                @click="handleSelectCondition(item)"
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
              >{{ condition }}</el-button
            >
          </el-popover>
          <el-input
            size="mini"
            clearable
            ref="inputWorkFlage"
            @clear="handleInputWork"
            @keyup.enter.native="handleInputWork"
            v-model="checkupWork"
            placeholder="请输入检索关键字"
          ></el-input>
        </div>
      </div>
      <!-- 收费主体内容 -->
      <div class="content">
        <el-row class="content_box">
          <!-- 主体表格信息 -->
          <el-col class="content_l" :span="17">
            <div class="cl_message">
              <div class="clm_item">
                体检号：<span>{{ pageData.regid }}</span>
              </div>
              <div class="clm_item">
                姓名：<span>{{ pageData.name }}</span>
              </div>
              <div class="clm_item">
                性别：<span>{{
                  pageData.sex == 0
                    ? "未知"
                    : pageData.sex == 1
                    ? "男"
                    : pageData.sex == 2
                    ? "女"
                    : ""
                }}</span>
              </div>
              <div class="clm_item">
                体检类型：<span>{{ pageData.checktypename }}</span>
              </div>
              <div class="clm_item">
                团检名称：<span>{{ pageData.companyname }}</span>
              </div>
              <div class="clm_item">
                联系电话：<span>{{ pageData.telephone }}</span>
              </div>
            </div>
            <el-radio-group
              v-model="tableActive"
              size="mini"
              @change="handlePaymentInfoFindPay"
            >
              <el-radio-button label="0">未收费</el-radio-button>
              <el-radio-button label="1">已收费</el-radio-button>
              <el-radio-button label="2">已退费</el-radio-button>
            </el-radio-group>
            <div class="table_box">
              <el-table
                :data="pageData.combineitems"
                class="pagetable"
                height="100%"
                border
                style="width: 100%"
                :header-cell-style="handleReturnStyle"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  :selectable="checkSelectable"
                >
                </el-table-column>
                <el-table-column prop="chargeflag" label="检查状态">
                  <template slot-scope="scope">
                    <div>
                      <span v-show="scope.row.chargeflag == 0">未收费</span>
                      <span
                        v-show="scope.row.chargeflag == 1"
                        style="color: #409167"
                      >
                        已收费
                      </span>
                      <span
                        v-show="scope.row.chargeflag == 2"
                        style="color: #9da408"
                      >
                        申请退费
                      </span>
                      <span
                        v-show="scope.row.chargeflag == 3"
                        style="color: #d63737"
                      >
                        已退费
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="110">
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
                </el-table-column>
                <el-table-column
                  prop="setmealname"
                  label="体检套餐"
                  width="150"
                >
                </el-table-column>
                <el-table-column
                  prop="combinename"
                  label="体检组合"
                  width="150"
                >
                </el-table-column>
                <el-table-column prop="price" label="原价" width="110">
                </el-table-column>
                <el-table-column prop="discount" label="折扣" width="110">
                </el-table-column>
                <el-table-column prop="discountprice" label="应收" width="110">
                </el-table-column>
                <el-table-column prop="deptname" label="检查科室" width="150">
                </el-table-column>
                <el-table-column prop="addflag" label="加减" width="90">
                  <template slot-scope="scope">{{
                    scope.row.addflag == 1
                      ? "加"
                      : scope.row.dedflag == 1
                      ? "减"
                      : ""
                  }}</template>
                </el-table-column>
                <el-table-column
                  :prop="tableActive == 1 ? 'paymenttypeyes' : 'paymenttypeno'"
                  :label="tableActive == 1 ? '支付方式' : '退费方式'"
                  width="110"
                  v-if="tableActive != 0"
                >
                </el-table-column>
                <el-table-column
                  :prop="tableActive == 1 ? 'paytimeyes' : 'paytimeno'"
                  :label="tableActive == 1 ? '支付时间' : '退费时间'"
                  width="180"
                  v-if="tableActive != 0"
                >
                </el-table-column>
                <el-table-column
                  :prop="tableActive == 1 ? 'paynameyes' : 'paynameno'"
                  :label="tableActive == 1 ? '收费人' : '退费人'"
                  width="110"
                  v-if="tableActive != 0"
                >
                </el-table-column>

                <el-table-column
                  prop="operatorname"
                  label="开单医生"
                  width="110"
                >
                </el-table-column>
                <el-table-column
                  prop="operatordate"
                  label="开单时间"
                  width="150"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="bottom1">
              <div class="bottom1_item">
                项目数：{{
                  (pageData.combineitems && pageData.combineitems.length) || 0
                }}
              </div>
              <div class="bottom1_item">合计：{{ pageData.totalprice }}</div>
            </div>
            <div class="bottom2">
              <div class="b2_title">发票分类汇总：</div>
              <div
                class="b2tag_box"
                v-for="(item, index) in invoicepriceitems"
                :key="index"
              >
                <el-tag>{{ item.key }} {{ item.value }}</el-tag>
              </div>
            </div>
          </el-col>
          <!-- 主体收费信息 -->
          <el-col class="content_r" :span="7">
            <div class="chargemess_item">总金额：{{ pageData.totalprice }}</div>
            <div class="chargemess_item">优惠：{{ pageData.youhuiprice }}</div>
            <div class="chargemess_item">
              应收：{{ pageData.discountprice }}
            </div>
            <div
              class="chargemess_item_two"
              v-if="chargeStatus == 0 && tableActive == 0"
            >
              <div class="cit_item">实收：{{ cashprice }}</div>
              <div class="cit_item">
                找零：<span v-if="cashprice - pageData.discountprice > 0">{{
                  (cashprice - pageData.discountprice).toFixed(2)
                }}</span>
              </div>
            </div>
            <div class="chargemess_item_two" v-if="tableActive == 1">
              <div class="cit_item">票据代码：{{ pageData.billCode }}</div>
              <div class="cit_item">票据号码：{{ pageData.billNo }}</div>
            </div>
            <!-- 支付方式 -->
            <el-radio-group
              v-if="tableActive == 0"
              v-model="chargeStatus"
              @change="handleChangePay"
            >
              <el-radio :label="0">
                <div style="width: 60px">现金支付</div>
                <el-input
                  style="margin-left: 10px; width: 320px"
                  size="mini"
                  v-model="cashprice"
                  clearable
                  :disabled="chargeStatus != 0"
                >
                </el-input
              ></el-radio>
              <el-radio :label="1">
                <div style="width: 60px">微信支付</div>
                <el-input
                  style="margin-left: 10px; width: 110px"
                  size="mini"
                  v-model="electronprice1"
                  disabled
                  clearable
                >
                </el-input>
                <el-input
                  style="margin-left: 10px; width: 200px"
                  ref="wxpaymentcode"
                  size="mini"
                  v-model="wxpaymentcode"
                  :disabled="chargeStatus != 1 || payCodeStatus"
                  clearable
                  @keyup.enter.native="handleChargeOfWx"
                >
                </el-input>
                <!-- <el-button
                  style="margin-left: 10px"
                  type="primary"
                  size="mini"
                  icon="el-icon-refresh-right"
                  @click="handleChargeOfWx"
                  >重 试</el-button
                > -->
              </el-radio>
              <!-- <el-radio :label="2">
                <div style="width: 60px">支付宝</div>
                <el-input
                  style="margin-left: 10px; width: 320px"
                  size="mini"
                  v-model="electronprice2"
                  disabled
                  clearable
                >
                </el-input
              ></el-radio>
              <el-radio :label="3"
                ><div style="width: 60px">POS支付</div>
                <el-input
                  style="margin-left: 10px; width: 320px"
                  size="mini"
                  v-model="electronprice3"
                  disabled
                  clearable
                >
                </el-input
              ></el-radio>
              <el-radio :label="4"
                ><div style="width: 60px">团检记账</div>
                <el-input
                  style="margin-left: 10px; width: 320px"
                  size="mini"
                  v-model="electronprice4"
                  disabled
                  clearable
                >
                </el-input
              ></el-radio> -->
            </el-radio-group>
            <!-- 按钮组 -->
            <div class="btn_group">
              <el-button
                type="primary"
                size="mini"
                @click="handlePaymentInfoPay"
                >收 费</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePaymentInfoPayNo"
                >退 费</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePrintPaySingle('1、个人清单')"
                >打印清单</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePrintPaySingle('2、收费缴费单')"
                >打印缴费单</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePrintPayInvoice"
                >打印发票</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePrintGuideSingle"
                >打印指引单</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePrintDailySettlement"
                >日结打印</el-button
              >
              <el-button type="primary" size="mini" @click="handlePrintWorkload"
                >工作量统计</el-button
              >
              <el-button type="primary" size="mini">关 闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  PaymentInfoFindPay,
  PaymentInfoPay,
  EverydayStatics,
} from "@/api/personalcharge.js";
import { getToken } from "@/utils/auth";
import { printBase64 } from "@/api/printreport.js";
import { printStaticsBase64 } from "@/api/printreport.js";
import { getPersonalDetail } from "@/api/personalregister.js";
export default {
  name: "personalcharge",

  components: {},

  data() {
    return {
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "checkno", name: "档案号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "",
      tableActive: "0",
      tableData: [],
      chargeStatus: 1,
      pageData: {},
      cashprice: "",
      electronprice1: "",
      wxpaymentcode: "",
      electronprice2: "",
      electronprice3: "",
      electronprice4: "",
      selectData: [],
      invoicepriceitems: [],
      usernameOrId: "",
      checktype: "",
      timeId: "",
      paymentOrderCode: "",
      authCode: "",
      payCodeStatus: false,
    };
  },

  mounted() {
    this.usernameOrId = JSON.parse(localStorage.getItem("usernameOrId")) || "";
  },

  methods: {
    // 工作量统计
    handlePrintWorkload() {
      let data = {
        repname: "收费员工作量统计",
        whereitems: [
          {
            key: "accountTable",
            value: this.usernameOrId.usercode,
          },
          {
            key: "dateTable",
            value: new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 10)
              .replace("T", " "),
          },
          {
            key: "dateRange",
            value: new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 10)
              .replace("T", " "),
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
    },
    // 日结打印
    handlePrintDailySettlement() {
      EverydayStatics({
        whereitems: [
          {
            key: "account",
            value: "",
          },
          {
            key: "staticdate",
            value: "",
          },
        ],
      }).then((res) => {
        if (res.result) {
          let data = {
            repname: "收费员日报表",
            whereitems: [
              {
                key: "account",
                value: this.usernameOrId.usercode,
              },
              {
                key: "startTime",
                value: new Date(+new Date() + 8 * 3600 * 1000)
                  .toJSON()
                  .substr(0, 10)
                  .replace("T", " "),
              },
              {
                key: "endTime",
                value: new Date(+new Date() + 8 * 3600 * 1000)
                  .toJSON()
                  .substr(0, 10)
                  .replace("T", " "),
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
        } else {
          this.$message.warning("暂无打印信息!");
        }
      });
    },
    // 打印指引单
    handlePrintGuideSingle() {
      if (!this.pageData.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      let repname = "";
      if (this.checktype == 999 || this.checktype == 10118) {
        repname = "2、收费缴费单";
      } else {
        if (this.pageData.meccode == 1) {
          if (this.pageData.personalflag == 1) {
            repname = `1、团体指引单`;
          } else {
            repname = `1、指引单`;
          }
        } else if (this.pageData.meccode == 10003) {
          if (this.pageData.personalflag == 1) {
            repname = `1、水电团体指引单`;
          } else {
            repname = `1、水电指引单`;
          }
        } else if (this.pageData.meccode == 10004) {
          if (this.pageData.personalflag == 1) {
            repname = `1、国康团体指引单`;
          } else {
            repname = `1、国康指引单`;
          }
        } else {
          repname = `1、指引单`;
        }
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.pageData.regid],
        repname,
        printflag: 1,
        whereitems: [
          {
            key: "regid",
            value: this.pageData.regid,
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
    },
    // 打印发票
    handlePrintPayInvoice() {
      if (!this.pageData.regid) {
        this.$message.warning("请先查询人员!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.pageData.regid],
        repname: "1、打印发票",
        printflag: 1,
        whereitems: [],
      };
      printBase64(data).then((res) => {
        if (res.data && res.data.inFileId) {
          window.open(res.data.inFileId, "_blank");
        } else {
          this.$message.warning("未生成发票!");
        }
      });
    },
    // 打印缴费单
    handlePrintPaySingle(repname) {
      if (!this.pageData.regid) {
        this.$message.warning("请先查询人员!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.pageData.regid],
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
    },
    checkSelectable(row, index) {
      if (this.tableActive == 1 && row.refundstatus == 1) {
        return true;
      } else {
        return false;
      }
    },
    handlePrintGuideSingleAsync() {
      let that = this;
      that.$axios
        .get(
          `${location.origin}/api-pay/Payment/CheckPayStatus?cc=${this.paymentOrderCode}&ac=${this.authCode}`
        )
        .then((res) => {
          if (res.data.data) {
            that.paymentOrderCode = "";
            that.authCode = "";
            that.handlePaymentInfoFindPay();
            that.handlePrintGuideSingle();
          } else {
            that.handlePrintGuideSingleAsync();
          }
        })
        .catch((err) => {
          that.$message.warning(`${err},接口请求异常,请手动执行打印!`);
        });
    },
    // 点击按钮微信收费
    handleChargeOfWx() {
      let that = this;
      if (!this.pageData.regid) return;
      if (!this.wxpaymentcode) return;
      let data = {
        OrderCode: this.pageData.regid,
        PayAmount: +this.pageData.discountprice.toFixed(2),
        Token: getToken(),
        AuthCode: this.wxpaymentcode,
      };
      this.payCodeStatus = true;
      this.$axios
        .post(`${location.origin}/api-pay/Payment/WxMicropay`, data)
        .then((res) => {
          that.payCodeStatus = false;
          if (res.data.code != 200) {
            that.$message.warning(res.data.msg);
            that.$nextTick(() => {
              that.wxpaymentcode = "";
              that.$refs.wxpaymentcode.focus();
            });
            return;
          }
          that.$message.success(res.data.msg);
          that.paymentOrderCode = res.data.data.paymentOrderCode;
          that.authCode = res.data.data.authCode;
          if (that.paymentOrderCode) {
            that.handlePrintGuideSingleAsync();
          }
          // that.handlePrintGuideSingle();
          that.$nextTick(() => {
            that.wxpaymentcode = "";
            that.$refs.wxpaymentcode.focus();
          });
        })
        .catch((err) => {
          that.payCodeStatus = false;
          that.$nextTick(() => {
            that.wxpaymentcode = "";
            that.$refs.wxpaymentcode.focus();
          });
        });
    },
    // 点击退费按钮
    handlePaymentInfoPayNo() {
      let PayAmount = 0;
      for (let i = 0; i < this.selectData.length; i++) {
        PayAmount += this.selectData[i].discountprice;
      }
      let data = {
        OrderCode: this.pageData.regid,
        PayAmount: +PayAmount.toFixed(2),
        Token: getToken(),
        ChildCodes: this.selectData.map((k) => k.combinecode),
      };
      this.$axios
        .post(`${location.origin}/api-pay/Payment/Refund`, data)
        .then((res) => {
          if (res.data.code != 200) {
            this.$message.warning(res.data.msg);
            return;
          }
          this.$message.success(res.data.msg);
          this.handlePaymentInfoFindPay();
        });
    },
    // 表格选中数据回调
    handleSelectionChange(arr) {
      this.selectData = arr;
    },
    // 点击收费按钮
    handlePaymentInfoPay() {
      //   let str = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5e173bc64f0b0888&redirect_uri=${encodeURIComponent(
      //     local
      //   )}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;
      if (!this.pageData.regid) {
        this.$message.warning("请先查询数据!");
        return;
      }
      if (this.cashprice - this.pageData.discountprice < 0) {
        this.$message.warning("实收金额不能低于应收金额!");
        return;
      }
      PaymentInfoPay({
        OrderCode: this.pageData.regid,
        PayCategory: "CustomerRegister",
        PayType: "Offline",
        PayMentType: "Cash",
        PayAmount: +this.pageData.discountprice.toFixed(2),
        ReceivableAmount: this.cashprice,
      }).then((res) => {
        this.$message.success(res.message || res.msg);
        this.handlePaymentInfoFindPay();
        this.handlePrintGuideSingle();
      });
    },
    // 切换支付方式
    handleChangePay() {
      this.cashprice = "";
      this.electronprice1 = "";
      this.wxpaymentcode = "";
      this.electronprice2 = "";
      this.electronprice3 = "";
      this.electronprice4 = "";
      switch (this.chargeStatus) {
        case 0:
          this.cashprice = this.pageData.discountprice;
          break;
        case 1:
          this.electronprice1 = this.pageData.discountprice;
          this.$nextTick(() => {
            this.$refs.wxpaymentcode.focus();
          });
          break;
        case 2:
          this.electronprice2 = this.pageData.discountprice;
          break;
        case 3:
          this.electronprice3 = this.pageData.discountprice;
          break;
        case 4:
          this.electronprice4 = this.pageData.discountprice;
          break;
        default:
          break;
      }
    },
    // 获取页面信息
    handlePaymentInfoFindPay() {
      if (!this.checkupWork.trim()) return;
      PaymentInfoFindPay({
        OrderCode: this.checkupWork.trim(),
        PayCategory: "CustomerRegister",
        OrderStatus: this.tableActive,
      }).then((res) => {
        if (!res.result) return;
        this.pageData = res.result;
        this.checktype = res.result.checktypecode;
        // this.handleGetPersonalDetail(this.pageData.regid);
        this.invoicepriceitems = res.result.invoicepriceitems;
        if (this.chargeStatus == 1) {
          this.electronprice1 = this.pageData.discountprice;
          this.cashprice = "";
        } else {
          this.cashprice = this.pageData.discountprice;
          this.electronprice1 = "";
        }
        this.tableActive == 0 &&
          this.$nextTick(() => {
            this.$refs.wxpaymentcode.focus();
          });
      });
    },
    // // 获取个人登记明细/详情/新增回调
    // handleGetPersonalDetail(regid) {
    //   getPersonalDetail({
    //     regid,
    //   }).then((res) => {
    //     this.checktype = res.result.checktype;
    //   });
    // },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 搜索框回车回调
    handleInputWork() {
      clearInterval(this.timeId);
      this.handlePaymentInfoFindPay();
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
  },

  watch: {},

  computed: {},
};
</script>
<style lang='scss' scoped>
.personalcharge {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
  .subject {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    .search_box {
      height: 80px;
      .sb_title {
        font-size: 18px;
        font-weight: 600;
        height: 40px;
        background-color: #f6f7fc;
        padding-left: 15px;
        display: flex;
        align-items: center;
      }
      .sb_content {
        height: calc(100% - 40px);
        padding: 0 10px;
        display: flex;
        align-items: center;
        .el-input {
          width: 250px;
          margin-left: 10px;
        }
      }
    }
    .content {
      width: 100%;
      height: calc(100% - 80px);
      box-sizing: border-box;
      padding: 5px;
      .content_box {
        height: 100%;
        .content_l {
          height: 100%;
          box-sizing: border-box;
          padding-left: 5px;
          .cl_message {
            height: 30px;
            display: flex;
            align-items: center;
            .clm_item {
              margin-right: 20px;
              > span {
                font-weight: 600;
              }
            }
          }
          .el-radio-group {
            height: 30px;
          }
          .table_box {
            height: calc(100% - 160px);
            .pagetable {
              height: 100%;
            }
          }
          .bottom1,
          .bottom2 {
            height: 40px;
            display: flex;
            align-items: center;
            .bottom1_item {
              width: 200px;
            }
            .el-tag {
              margin-right: 30px;
            }
          }
        }
        .content_r {
          height: 100%;
          box-sizing: border-box;
          padding: 60px 0 0 5px;
          .chargemess_item,
          .chargemess_item_two {
            font-size: 16px;
            height: 38px;
            display: flex;
            align-items: center;
            .cit_item {
              flex: 1;
            }
          }
          /deep/.el-radio-group {
            display: flex;
            flex-direction: column;
            .el-radio {
              margin: 8px 0;
              display: flex;
              align-items: center;
              .el-radio__label {
                display: flex;
                align-items: center;
              }
            }
          }
          .btn_group {
            margin-top: 40px;
            text-align: center;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .el-button {
              width: 21%;
              margin: 0 12px 12px 0;
            }
          }
        }
      }
    }
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
</style>