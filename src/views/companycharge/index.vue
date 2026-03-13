<template>
  <div class="personalcharge">
    <div class="subject">
      <!-- 收费搜索盒子 companycharge-->
      <div class="search_box">
        <div class="sb_title">团检结算</div>
        <!-- <div class="sb_title">检索条件</div> -->
        <div class="sb_content">
          <el-radio-group v-model="companyFlag" @change="handleGetCompanyitems">
            <el-radio label="团检预缴">团检预缴</el-radio>
            <el-radio label="团检结算">团检结算</el-radio>
          </el-radio-group>
          <div class="sbctitle">单位选择：</div>
          <el-select
            v-model="company"
            clearable
            filterable
            size="mini"
            @change="handlePaymentInfoFindPay"
          >
            <el-option
              v-for="(item, index) in companyitems"
              :key="item.code + index"
              :label="`${item.setid}　${item.name}`"
              :value="item.code"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="mini">检索</el-button>
        </div>
      </div>
      <!-- 收费主体内容 -->
      <div class="content">
        <el-row class="content_box">
          <!-- 主体表格信息 -->
          <el-col class="content_l" :span="17">
            <div class="cl_message">
              <div class="clm_item">
                结算ID：<span>{{ pageData.setid }}</span>
              </div>
              <div class="clm_item">
                结算单位名称：<span>{{ pageData.companyname }}</span>
              </div>
              <div class="clm_item">
                单位编码：<span>{{ pageData.companycode }}</span>
              </div>
              <div class="clm_item">
                结算批次：<span>{{ pageData.batch }}</span>
              </div>
              <div class="clm_item">
                结算人数：<span>{{ pageData.personnelTotal }}</span>
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
            <div class="chargemess_item_two" v-show="chargeStatus == 0">
              <div class="cit_item">实收：{{ cashprice }}</div>
              <div class="cit_item">
                找零：<span v-if="cashprice - pageData.discountprice > 0">{{
                  (cashprice - pageData.discountprice).toFixed(2)
                }}</span>
              </div>
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
                  :disabled="chargeStatus != 1"
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
              ></el-radio> -->
              <el-radio :label="3"
                ><div style="width: 60px">POS支付</div>
                <el-input
                  style="margin-left: 10px; width: 320px"
                  size="mini"
                  v-model="electronprice3"
                  :disabled="chargeStatus != 3"
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
                  :disabled="chargeStatus != 4"
                  clearable
                >
                </el-input
              ></el-radio>
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
                @click="handlePrintPayInvoice"
                >打印发票</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handlePaymentInfoPayNo"
                >退 费</el-button
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
import { PaymentInfoFindPay, PaymentInfoPay } from "@/api/personalcharge.js";
import { getToken } from "@/utils/auth";
import { printBase64 } from "@/api/printreport.js";
import * as company_archives from "@/api/company_archives";
import { getPageList } from "@/api/companysettlement.js";
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
      chargeStatus: 0,
      pageData: {},
      cashprice: "",
      electronprice1: "",
      wxpaymentcode: "",
      electronprice2: "",
      electronprice3: "",
      electronprice4: "",
      selectData: [],
      invoicepriceitems: [],
      companyitems: [],
      company: "",
      companyFlag: "团检结算",
      paymentOrderCode: "",
      authCode: "",
    };
  },

  mounted() {
    this.handleGetCompanyitems();
  },

  methods: {
    handleGetCompanyitems() {
      if (this.companyFlag == "团检预缴") {
        company_archives
          .getList({
            page: 1,
            limit: 100000,
            key: "",
          })
          .then((res) => {
            if (!res.data) {
              this.companyitems = [];
              return;
            }
            this.companyitems = res.data.map((k) => {
              return {
                ...k,
                code: k.companycode,
                name: k.companyname,
              };
            });
          });
      } else {
        let today = new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " ");
        let currentDate = new Date();
        // 获取当前年份
        let currentYear = currentDate.getFullYear();
        // 获取当前月份（注意：返回结果是从0开始计算的，所以需要加1）
        let currentMonth = currentDate.getMonth() + 1;
        // 获取当前日期
        let currentDay = currentDate.getDate();
        //获取当前年月日
        let nowYearDate = new Date(currentYear, currentMonth - 1, currentDay);
        // 获取当前日期的前一年
        let lastYearDate = new Date(
          currentYear - 1,
          currentMonth - 1,
          currentDay
        );
        let whereitems = [
          {
            key: "startdate",
            value: lastYearDate,
          },
          {
            key: "enddate",
            value: today,
          },
        ];
        getPageList({
          page: 1,
          limit: 10000,
          whereitems,
        }).then((res) => {
          if (!res.data) {
            this.companyitems = [];
            return;
          }
          this.companyitems = res.data.map((k) => {
            return {
              ...k,
              code: k.setid,
              name: k.companyname,
            };
          });
        });
      }
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
        // this.lodop = getLodop();
        // let printname = ``;
        // if (res.data[0].printname == "") {
        //   printname = this.lodop.GET_PRINTER_NAME(-1);
        // } else {
        //   printname = res.data[0].printname;
        // }
        // let printObj = new LodopPrinter(null, printname);
        // let fileList = res.data.map((k) => {
        //   return k.base64String;
        // });
        // printObj.printBase64PdfReport(this.lodop, fileList);
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
            // that.handlePrintGuideSingle();
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
      if (!this.company) return;
      if (!this.wxpaymentcode) return;
      let data = {
        OrderCode: this.company,
        PayAmount: +this.pageData.discountprice.toFixed(2),
        Token: getToken(),
        AuthCode: this.wxpaymentcode,
        PaySourceCategory: "CompanyRegister",
      };
      this.$axios
        .post(`${location.origin}/api-pay/Payment/WxMicropay`, data)
        .then((res) => {
          if (res.data.code != 200) {
            that.$message.warning(res.data.msg);
            that.$nextTick(() => {
              that.wxpaymentcode = "";
              that.$refs.wxpaymentcode.focus();
            });
            return;
          }
          that.$message.success(res.data.msg);
          that.handlePaymentInfoFindPay();

          // that.paymentOrderCode = res.data.data.paymentOrderCode;
          // that.authCode = res.data.data.authCode;
          // if (that.paymentOrderCode) {
          //   that.handlePrintGuideSingleAsync();
          // }
          that.$nextTick(() => {
            that.wxpaymentcode = "";
            that.$refs.wxpaymentcode.focus();
          });
        })
        .catch((err) => {
          this.$nextTick(() => {
            this.wxpaymentcode = "";
            this.$refs.wxpaymentcode.focus();
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
        OrderCode: this.company,
        PayAmount: +PayAmount.toFixed(2),
        Token: getToken(),
        ChildCodes: this.selectData.map((k) => k.combinecode),
        PaySourceCategory: "CompanyRegister",
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
      if (!this.company) {
        this.$message.warning("请先查询数据!");
        return;
      }
      let ReceivableAmount = 0;
      let PayMentType = "Cash";
      switch (this.chargeStatus) {
        case 0:
          ReceivableAmount = this.cashprice;
          PayMentType = "Cash";
          break;
        case 3:
          ReceivableAmount = this.electronprice3;
          PayMentType = "Union";
          break;
        case 4:
          ReceivableAmount = this.electronprice4;
          PayMentType = "UnitAccount";
          break;
        default:
          break;
      }
      if (ReceivableAmount - this.pageData.discountprice < 0) {
        this.$message.warning("实收金额不能低于应收金额!");
        return;
      }
      PaymentInfoPay({
        OrderCode: this.company,
        PayCategory: "CompanyRegister",
        PayType: "Offline",
        PayMentType,
        PayAmount: +this.pageData.discountprice.toFixed(2),
        ReceivableAmount,
      }).then((res) => {
        this.$message.success(res.message || res.msg);
        this.handlePaymentInfoFindPay();
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
      if (!this.company.trim()) return;
      PaymentInfoFindPay({
        OrderCode: this.company,
        PayCategory: "CompanyRegister",
        OrderStatus: this.tableActive,
      }).then((res) => {
        if (!res.result) return;
        this.pageData = res.result;
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
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 搜索框回车回调
    handleInputWork() {
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
        .sbctitle {
          margin-left: 100px;
        }
        .el-select {
          width: 300px;
          margin: 0 10px;
        }
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