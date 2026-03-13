<template>
  <div class="addoredit">
    <!-- 头部筛选盒子 -->
    <div class="head_box">
      <div class="title_box">
        <div class="title">团检信息</div>
        <div class="btn_group">
          <el-popover ref="popoverRefIdcA" class="print_box" placement="bottom" trigger="click" style="margin-right: 10px">
            <el-button type="primary" size="mini" slot="reference" plain v-if="hospitalsFlag != 'index_hsrmyy'">单位结算表</el-button>
            <div class="print_item" @click="handleCompanySettlementPrint('unit')">
              打印
            </div>
            <div class="print_item" @click="handleGetExportPdf('unit')">
              导出
            </div>
            <div class="print_item" @click="handleGetExportExcel('unit')">
              导出Excel
            </div>
          </el-popover>
          <el-popover ref="popoverRefIdcB" class="print_box" placement="bottom" trigger="click">
            <el-button type="primary" size="mini" slot="reference" plain>项目明细表</el-button>
            <div class="print_item" @click="handleCompanySettlementPrint('item')">
              打印
            </div>
            <div class="print_item" @click="handleGetExportPdf('item')">
              导出
            </div>
            <div class="print_item" @click="handleGetExportExcel('item')">
              导出Excel
            </div>
          </el-popover>
          <el-button style="margin-left: 10px" type="primary" size="mini" icon="el-icon-search" plain :disabled="pageFlag == 'edit'" @click="handleSearchPage">查询</el-button>
          <el-button type="primary" size="mini" icon="el-icon-close" plain @click="handleClosePage">关闭</el-button>
        </div>
      </div>
      <el-form ref="form" class="search_form" :model="searchForm" label-width="80px">
        <el-form-item size="mini" label="单位名称">
          <el-select :disabled="pageFlag == 'edit'" clearable filterable style="width: 300px" v-model="company" @change="handleSelectCompany">
            <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="批次">
          <el-select :disabled="pageFlag == 'edit'" v-model="batch" clearable filterable @change="handleChangeBatch">
            <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="团检分组">
          <el-select :disabled="pageFlag == 'edit'" v-model="group" @change="handleChangeGroup" clearable filterable>
            <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="部门">
          <el-select :disabled="pageFlag == 'edit'" v-model="department" @change="handleChangeDepartment" clearable filterable>
            <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="金额">
          <el-input placeholder="请输入金额" v-model="searchPrice" clearable :disabled="pageFlag == 'edit'">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 主体内容 -->
    <div class="subject">
      <!-- 主体左侧表格 -->
      <div class="s_left">
        <div class="title">基本信息</div>
        <el-radio-group v-model="status" size="mini">
          <el-radio-button :disabled="pageFlag == 'edit'" :label="0">未结算</el-radio-button>
          <el-radio-button :disabled="pageFlag == 'add'" :label="1">已结算</el-radio-button>
        </el-radio-group>
        <div class="mask" v-if="pageFlag == 'edit'"></div>
        <EasyTable height="100%" :data="staffData" class="staff_table" :tableOptions="staffOptions" :checkbox-config="{ fetch: true, rowClick: true }" @selected-change="handleSelectStaff" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        <div class="total_box">总人数：{{ staffData.length || 0 }}</div>
      </div>
      <!-- 主体右侧操作盒子 -->
      <div class="s_right">
        <div class="title">结算选择</div>
        <!-- 结算方式 -->
        <div class="mode_box">
          <div class="mode_title">结算方式</div>
          <el-radio-group :disabled="pageFlag == 'edit'" @change="handleChangeSettleMode" v-model="settleMode">
            <el-radio :label="0">登记结算</el-radio>
            <el-radio :label="1">检查中结算</el-radio>
            <el-radio :label="2">总检结算</el-radio>
            <el-radio :label="3">全部结算</el-radio>
          </el-radio-group>
        </div>
        <!-- 结算列表 -->
        <EasyTable height="calc(100vh - 540px)" :data="settleModeData" class="staff_table" :tableOptions="settleModeOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        <!-- 结算信息 -->
        <div class="mode_message">
          <div class="message_itme">
            <div class="m_title">结算人数</div>
            <div class="m_value">{{ personnelTotal }}人</div>
          </div>
          <div class="message_itme">
            <div class="m_title">费用合计</div>
            <div class="m_value">{{ Math.floor(settotal * 100) / 100 }}元</div>
          </div>
          <!-- <div class="message_itme">
            <div class="m_title">折扣</div>
            <div class="m_value">
              <el-input size="mini" v-model="discount" @keyup.native="handleInputChange" clearable :disabled="pageFlag == 'edit'"></el-input>
            </div>
          </div> -->
          <div class="message_itme">
            <div class="m_title">折后费用</div>
            <div class="m_value">
              {{ Math.floor(setdiscounttotal * 100) / 100 }}元
            </div>
          </div>
          <div class="message_itme">
            <div class="m_title">实际费用</div>
            <div class="m_value">
              <el-input size="mini" v-model="setactualtotal" clearable :disabled="pageFlag == 'edit'" @keyup.native.enter="handleCalcCombinePrice('', setactualtotal)"></el-input>
            </div>
          </div>
          <div class="message_itme">
            <div class="m_title">收费编码</div>
            <div class="m_value">{{ hiscode }}</div>
          </div>
        </div>
        <!-- 结算说明 -->
        <div class="mode_explain">
          <div class="e_title">结算说明</div>
          <el-input class="explain" :disabled="chargeflag == 1 || pageFlag == 'edit'" type="textarea" resize="none" v-model="explain"></el-input>
        </div>
        <!-- 操作按钮 -->
        <div class="page_btn">
          <el-button size="mini" type="primary" @click="handleSetSettlementCreate()" :disabled="chargeflag == 1 || pageFlag == 'edit'">结算</el-button>
          <el-button size="mini" type="primary" :disabled="admisstimes > 0" @click="handleSetSettlementSend()">发送</el-button>
          <!-- :disabled="chargeflag == 1 || pageFlag == 'add'" -->
          <el-button size="mini" type="primary" @click="handleCancelSettlement">取消结算</el-button>
          <el-button :disabled="chargeflag == 1" size="mini" type="primary" @click="handleSettlementSplit">结算拆分</el-button>
        </div>
        <!-- 费用拆分弹框 -->
        <el-drawer :close-on-press-escape="false" :show-close="false" :wrapperClosable="false" :visible.sync="showSplit" direction="btt">
          <div class="split_content">
            <!-- 头部按钮 -->
            <div class="top_btn">
              <el-button size="mini" type="primary" @click="handleSplitClose">关 闭</el-button>
              <el-button size="mini" type="primary" @click="handleSplitAdd">增 加</el-button>
            </div>
            <!-- 主体 -->
            <el-row class="content">
              <el-col :span="12" class="split_table_box">
                <div class="table_title">
                  <div class="text">费用汇总:</div>
                  <div class="totalprice_t">总金额:{{ splittotalprice }}</div>
                  <div class="leftprice_t">剩余金额:{{ splitleftprice }}</div>
                </div>
                <EasyTable height="100%" :data="splitData" class="split_table" :tableOptions="splitOptions" :checkbox-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
              </el-col>
              <el-col :span="12" class="split_box">
                <el-card :class="
                    chooseItem && chooseItem.customId == item.customId
                      ? 'choose_bg'
                      : ''
                  " class="box-card split_item" v-for="(item, index) in splitItemData" :key="index">
                  <!-- 遮罩层 -->
                  <div class="item_mask" v-if="!(chooseItem && chooseItem.customId == item.customId)"></div>
                  <!-- 头部信息 -->
                  <div class="item_top">
                    <div class="item_title">开票信息【{{ index + 1 }}】</div>
                    <div class="item_btn">
                      <el-link type="primary" @click="handleSplitSave">保存</el-link>
                      <el-link type="primary" @click="chooseItem = item">编辑</el-link>
                      <el-link type="primary">删除</el-link>
                      <el-link type="primary" @click="handleSetSettlementSend()">发送</el-link>
                    </div>
                  </div>
                  <!-- 表单信息 -->
                  <el-form label-position="right" label-width="100px" class="item_form">
                    <el-form-item label="企业名称">
                      <el-select style="width: 100%" size="mini" clearable filterable v-model="item.invoicecode" @change="handleChangeInvoice(item.invoicecode, item)">
                        <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select>
                      <!-- <el-input
                        size="mini"
                        v-model="item.invoicename"
                      ></el-input> -->
                    </el-form-item>
                    <el-form-item label="纳税识别号">
                      <el-input size="mini" v-model="item.invoicetaxid"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                      <el-input size="mini" v-model="item.invoiceaddress"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                      <el-input size="mini" v-model="item.invoicephone"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行">
                      <el-input size="mini" v-model="item.invoicebank"></el-input>
                    </el-form-item>
                    <el-form-item label="账号">
                      <el-input size="mini" v-model="item.invoiceaccountnumber"></el-input>
                    </el-form-item>
                    <el-form-item label="开票金额">
                      <el-input size="mini" v-model="item.settotal"></el-input>
                    </el-form-item>
                  </el-form>
                  <div class="item_b_box">
                    <div class="item_b_box_t">
                      <div class="text">费用明细:</div>
                      <div class="splitItemtotalprice">
                        小计总和：{{
                          splitItemtotalprice(item.splitdetailitems)
                        }}
                      </div>
                    </div>
                    <!-- <el-table
                      :border="false"
                      :header-cell-style="handleReturnStyle"
                      :row-class-name="handleTableRowClassName"
                      :row-style="{ height: '32px' }"
                      :cell-style="{ padding: '0' }"
                      :data="item.splitdetailitems"
                      class="split_item_table"
                      style="width: 100%"
                      height="100%"
                    >
                      <el-table-column
                        prop="deptname"
                        label="科室"
                      ></el-table-column>
                      <el-table-column
                        prop="combinename"
                        label="组合"
                        width="120"
                      ></el-table-column>
                      <el-table-column label="数量" width="150">
                        <template slot-scope="scope">
                          <el-input-number
                            size="mini"
                            v-model="scope.row.amount"
                            :min="0"
                          ></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="discountprice"
                        label="价格"
                        width="120"
                      ></el-table-column>
                      <el-table-column label="折扣" width="150">
                        <template slot-scope="scope">
                          <el-input-number
                            size="mini"
                            v-model="scope.row.discount"
                            :precision="1"
                            :step="0.1"
                            :min="0"
                            :max="1"
                          ></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="discountprice"
                        label="折扣价格"
                      ></el-table-column>
                      <el-table-column
                        prop="totalprice"
                        label="小计"
                      ></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-link
                            type="primary"
                            @click="handleDelSplitItem(scope.row)"
                          >
                            删 除
                          </el-link>
                        </template>
                      </el-table-column>
                    </el-table> -->
                    <EasyTable height="100%" :data="item.splitdetailitems" class="split_item_table" :tableOptions="splitItemOptions" :checkbox-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getCompanyList,
  getBatchList,
  getUnSettlement,
  setSettlementCreate,
  setCreateByCharge,
  setSettlementSend,
  setSettlDetail,
  setSettlCancel,
  getCalcPayMoney,
  CalcPayMoneyByCharge,
  CompanySettlementDetail,
  CompanySettlementSave,
} from "@/api/companysettlement.js";
import { CalcCombinePrice, CalcChargePrice } from "@/api/company_register.js";
import { printStaticsBase64 } from "@/api/printreport.js";

export default {
  name: "",

  components: {},

  props: {
    // 当前页面状态
    addOrEdit: {
      type: String,
      require: true,
    },
    // 当前页面详情id
    pSetid: {
      type: String,
    },
  },

  data() {
    return {
      admisstimes: 0,
      pageFlag: "add", // 当前页面状态
      discount: 1, // 当前折扣 默认1
      searchForm: {}, // 筛选表单对象
      status: 0, // 当前操作状态 0未结算  1已结算
      staffTempData: [], // 人员列表数据存储
      staffData: [], // 人员列表数据
      settleMode: 0, // 结算方式(0-登记结算 1-实检结算 2-总检结算)
      settleModePson: [], // 结算列表人员数据
      settleModeData: [], // 结算列表数据
      companyitems: [], // 公司列表数据
      company: "", // 选中公司单位
      companyname: "",
      batchitems: [], // 批次列表数据
      batch: "", // 选中批次号
      groupitems: [], // 分组列表数据
      group: "", // 选中分组
      departitems: [],
      department: "",
      setdiscounttotal: "", // 折后费用
      hiscode: "", // 收费编码
      setactualtotal: "", // 实收费用
      explain: "", // 结算说明
      setid: "", // 当前编辑数据流水号id
      selectSettlement: [], // 当前选中结算数据
      personnelTotal: 0, // 当前选中结算数据人数
      settotal: 0, // 当前选中结算数据价钱
      showSplit: false, // 费用拆分弹框显示
      splitData: [], // 费用拆分主体表格数据
      splitItemData: [],
      chooseItem: undefined,
      chargeflag: "",
      hospitalsFlag: "",
      tempNum: 0,
      searchPrice: "",
    };
  },
  computed: {
    staffDataSS() {
      const search = this.searchPrice;
      if (search) {
        return this.staffData.filter((data) => {
          return Object.keys(data).some((key) => {
            let containArr = ["discountprice"];
            if (containArr.includes(key)) {
              return data[key] >= +this.searchPrice;
              // return (
              //   String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
              //   -1
              // );
            }
          });
        });
      }
      return this.staffData;
    },
    // 单位拆分项小计
    splitItemtotalprice() {
      return (data) => {
        let price = 0;
        for (let i = 0; i < data.length; i++) {
          price += +data[i].amount * +data[i].price * +data[i].discount;
        }
        return +price.toFixed(2);
      };
    },
    // 单位拆分总价
    splittotalprice() {
      let price = 0;
      for (let i = 0; i < this.splitData.length; i++) {
        price += +this.splitData[i].price * +this.splitData[i].amount;
      }
      return +price.toFixed(2);
    },
    // 单位拆分剩余金额总价
    splitleftprice() {
      let price = 0;
      for (let i = 0; i < this.splitData.length; i++) {
        price += +this.splitData[i].leftprice;
      }
      return +price.toFixed(2);
    },
    // 当前总价
    totalPrice() {
      if (this.settleModeData.length == 0) {
        return 0;
      } else {
        let total = 0;
        this.settleModeData.forEach((k) => {
          total += k.amount * k.discountprice;
        });
        return total;
      }
    },
    // 打折后总价
    discountTotal() {
      let result = +this.totalPrice * +this.discount;
      this.setactualtotal = Math.floor(result * 100) / 100;
      return this.totalPrice * +this.discount;
    },
    //   人员列表表格配置
    staffOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "体检号",
          prop: "regid",
          width: 110,
          omit: 1,
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
        },
        {
          title: "分组",
          prop: "groupname",
        },
        {
          title: "状态",
          prop: "statusname",
        },
      ];
    },
    // 结算表格配置
    settleModeOptions() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "收费名称",
          prop: "combinename",
          width: 120,
          omit: 1,
        },
        {
          title: "数量",
          render: (h, data) => {
            return (
              <input
                type="number"
                size="mini"
                class="discount_input "
                v-model={data.amount}
                vOn:focus={(e) => {
                  e.stopPropagation();
                }}
                onkeyup={(e) => {
                  if (!e) return;
                  switch (e.keyCode) {
                    case 13: // 键盘回车
                      this.handleCalcCombinePrice();
                      break;
                    default:
                      break;
                  }
                }}
              />
            );
          },
        },
        {
          title: "价格",
          prop: "price",
        },
        {
          title: "折扣",
          prop: "discount",
        },
        {
          title: "折扣价格",
          prop: "discountprice",
        },
        {
          title: "小计",
          prop: "totalamount",
        },
        {
          title: "规格",
          prop: "spec",
        },
      ];
    },
    // 费用拆分表格配置
    splitOptions() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "组合",
          prop: "combinename",
          width: 120,
          omit: 1,
        },
        {
          title: "数量",
          prop: "amount",
        },
        {
          title: "价格",
          prop: "price",
        },
        {
          title: "折扣",
          prop: "discount",
        },
        {
          title: "折扣价格",
          prop: "discountprice",
        },
        {
          title: "小计",
          prop: "totalprice",
        },
        {
          title: "剩余数量",
          prop: "leftamount",
          returnVal: (value, data) => {
            return +data.leftamount.toFixed(2);
          },
        },
        {
          title: "剩余金额",
          prop: "leftprice",
          returnVal: (value, data) => {
            data.leftprice = +data.leftamount * +data.discountprice;
            return +data.leftprice.toFixed(2);
          },
        },
        {
          title: "操作",
          width: 100,
          render: (h, data) => {
            return (
              <div style="display:flex;justify-content: space-between;">
                <el-link
                  type="primary"
                  vOn:click_stop_prevent={() => this.handleChooseSplit(data)}
                >
                  选 择
                </el-link>
                <el-link
                  type="primary"
                  vOn:click_stop_prevent={() => this.handleChooseSplitAll(data)}
                >
                  全 选
                </el-link>
              </div>
            );
          },
        },
      ];
    },
    // 费用拆分明细表格配置
    splitItemOptions() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "组合",
          prop: "combinename",
          width: 120,
          omit: 1,
        },
        {
          title: "数量",
          width: 150,
          render: (h, data) => {
            return (
              <el-input-number
                size="mini"
                class="amountinput"
                v-model={data.amount}
                min={0}
                vOn:change={(currentValue, oldValue) => {
                  let index = this.splitData.findIndex((k) => {
                    return data.combinecode == k.combinecode;
                  });
                  if (
                    index != -1 &&
                    currentValue > oldValue &&
                    this.splitData[index].leftamount <= 0
                  ) {
                    this.$message.warning("超出可操作最大值!");
                    this.$nextTick(() => {
                      data.amount = oldValue;
                    });
                    return false;
                  }
                  this.handleLeftAmount(data);
                }}
              ></el-input-number>
            );
          },
        },
        {
          title: "价格",
          prop: "price",
          // returnVal: (value, data) => {
          //   return +data.price.toFixed(2);
          // },
        },
        {
          title: "折扣",
          width: 150,
          render: (h, data) => {
            return (
              <el-input-number
                size="mini"
                v-model={data.discount}
                precision={2}
                step={0.01}
                min={0}
                max={1}
                vOn:change={(e) => {
                  this.handleLeftAmount(data);
                }}
              ></el-input-number>
            );
          },
        },
        {
          title: "折扣价格",
          prop: "discountprice",
          returnVal: (value, data) => {
            data.discountprice = +data.price * +data.discount;
            return +data.discountprice.toFixed(2);
          },
        },
        {
          title: "小计",
          prop: "totalprice",
          returnVal: (value, data) => {
            data.totalprice = +data.amount * +data.price * +data.discount;
            return +data.totalprice.toFixed(2);
          },
        },
        {
          title: "操作",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() =>
                  this.handleDelSplitItem(data.$index, data)
                }
              >
                删 除
              </el-link>
            );
          },
        },
      ];
    },
  },
  mounted() {
    this.pageFlag = this.addOrEdit;
    this.hospitalsFlag = this.Hospitals;
    // 页面渲染加载数据
    this.handleGetCompanyList();
    if (this.pSetid != "") {
      this.setid = this.pSetid;
      this.status = 1;
      this.handleSetSettlDetail();
    } else {
      this.status = 0;
      this.searchPrice = 36;
    }
  },

  methods: {
    handleChangeInvoice(code, item) {
      if (code) {
        let flag = this.companyitems.filter((k) => k.code === code)[0];
        flag && (item.invoicename = flag.name);
      } else {
        item.invoicename = "";
      }
    },
    // 计算当前项目金额信息等
    handleCalcCombinePrice(code, settotal) {
      let data = this.settleModeData.map((k) => {
        return {
          combinecode: k.combinecode,
          discount: +k.discount || 0,
          discountprice: +k.discountprice || 0,
          qty: +k.amount || 0,
          isupdatediscountprice: false,
          settotal: settotal ? +settotal : 0,
          sourcecategory: "companysettlement",
          count: +this.personnelTotal,
          spec: k.spec,
          price: k.price,
        };
      });
      if (code) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].combinecode === code) {
            data[i].isupdatediscountprice = true;
          }
        }
      }
      CalcChargePrice(data).then((res) => {
        if (!res.result) return;
        for (let i = 0; i < res.result.combineitems.length; i++) {
          let index = this.settleModeData.findIndex(
            (k) =>
              k.combinecode === res.result.combineitems[i].combinecode &&
              k.spec === res.result.combineitems[i].spec
          );
          if (index > -1) {
            this.settleModeData[index].amount = res.result.combineitems[i].qty;
            this.settleModeData[index].discount =
              res.result.combineitems[i].discount;
            this.settleModeData[index].discountprice =
              res.result.combineitems[i].discountprice;
            this.settleModeData[index].totalamount =
              res.result.combineitems[i].discounttotal;
          }
        }
        /* this.settotal = res.result.totalprice; */
        this.setdiscounttotal = res.result.totaldiscountprice;
      });
    },
    // 回车跳转下一个结果
    handleJumpNextInput(item) {
      if (!item) return;
      let dom = document.querySelector(`.enterInput_${item.$index + 1}`);
      if (!dom) return;
      // 是否禁用 $(dom).is(":disabled")
      dom.focus();
    },
    // 键盘↓键跳转结果回调
    handleDiscountLower(e, item) {
      this.$nextTick(() => {
        if (item.$index === this.settleModeData.length - 1) return;
        let pDom = document.querySelector(`.enterInput_${item.$index + 1}`);
        if (!pDom) return;
        pDom.focus();
      });
    },
    // 键盘↑键跳转结果回调
    handleDiscountUpper(e, item) {
      this.$nextTick(() => {
        if (item.$index === 0) return;
        let pDom = document.querySelector(`.enterInput_${item.$index - 1}`);
        if (!pDom) return;
        pDom.focus();
      });
    },
    handleChangeDepartment(value) {
      if (value) {
        this.staffData = this.staffTempData.filter(
          (k) => k.department === value
        );
      } else {
        this.staffData = this.staffTempData;
      }
    },
    handleChangeBatch(value) {
      this.groupitems = [];
      this.group = "";
      if (value) {
        let flag = this.batchitems.filter((k) => k.code === value)[0];
        flag && (this.groupitems = flag.groupitems);
      }
      this.handleSearchPage();
    },
    handleChangeGroup(value) {
      this.departitems = [];
      this.department = "";
      if (value) {
        let flag = this.groupitems.filter((k) => k.code === value)[0];
        flag && (this.departitems = flag.departitems);
      }
      this.handleSearchPage();
    },
    // 点击保存结算拆分回调
    handleSplitSave() {
      for (let i = 0; i < this.splitItemData.length; i++) {
        CompanySettlementSave(this.splitItemData[i]).then((res) => {
          if (i == this.splitItemData.length - 1) {
            this.$message.success(res.message);
            this.handleSettlementSplit();
          }
        });
      }
      return;
    },
    // 获取剩余数量回调
    handleLeftAmount(data) {
      let num = 0;
      let index = this.splitData.findIndex((k) => {
        return data.combinecode == k.combinecode;
      });
      this.splitItemData.forEach((item) => {
        item.splitdetailitems.forEach((k) => {
          if (data.combinecode == k.combinecode) {
            num += +k.amount * +k.discount;
          }
        });
      });
      index != -1 &&
        (this.splitData[index].leftamount =
          +this.splitData[index].amount - +num);
    },
    // 获取剩余金额回调
    handleLeftPrice(num) {
      return num - 1;
    },
    // 结算拆分新增项回调
    handleSplitAdd() {
      let data = {
        splitid: "",
        setid: this.setid,
        companycode: this.company,
        companyname: this.companyname,
        batch: this.batch,
        remark: this.explain,
        invoicename: "",
        invoicetaxid: "",
        invoiceaddress: "",
        invoicephone: "",
        invoicebank: "",
        invoiceaccountnumber: "",
        settotal: 0,
        customId: Date.parse(new Date()),
        splitdetailitems: [],
      };
      this.splitItemData.push(data);
    },
    // 结算拆分明细删除项回调
    handleDelSplitItem(index, item) {
      this.chooseItem.splitdetailitems.splice(index, 1);
      this.handleLeftAmount(item); // 调用计算剩余数量
    },
    // 结算拆分选中项回调-全选
    handleChooseSplitAll(item) {
      if (!item) return;
      if (!this.chooseItem) {
        this.$message.warning("请先编辑选中需操作数据!");
        return;
      }
      if (+item.leftamount < 1) {
        this.$message.warning("当前项目数量不满足!");
        return;
      }
      let flag = this.chooseItem.splitdetailitems.filter((k) => {
        return k.combinecode == item.combinecode;
      })[0];
      if (flag) {
        this.$message.warning("不可重复选中数据!");
        return;
      }
      let tempItem = JSON.parse(JSON.stringify(item));
      /* tempItem.amount = 1; */
      this.chooseItem.splitdetailitems.push(tempItem);
      this.handleLeftAmount(item); // 调用计算剩余数量
    },
    // 结算拆分选中项回调
    handleChooseSplit(item) {
      if (!item) return;
      if (!this.chooseItem) {
        this.$message.warning("请先编辑选中需操作数据!");
        return;
      }
      if (+item.leftamount < 1) {
        this.$message.warning("当前项目数量不满足!");
        return;
      }
      let flag = this.chooseItem.splitdetailitems.filter((k) => {
        return k.combinecode == item.combinecode;
      })[0];
      if (flag) {
        this.$message.warning("不可重复选中数据!");
        return;
      }
      let tempItem = JSON.parse(JSON.stringify(item));
      tempItem.amount = 1;
      this.chooseItem.splitdetailitems.push(tempItem);
      this.handleLeftAmount(item); // 调用计算剩余数量
    },
    // 结算拆分关闭回调
    handleSplitClose() {
      this.splitData = []; // 费用拆分主体表格数据
      this.splitItemData = [];
      this.chooseItem = undefined;
      this.showSplit = false;
    },
    // 结算拆分点击回调
    handleSettlementSplit() {
      if (!this.setid) {
        this.$message.warning("请先结算当前单位!");
        return;
      }
      CompanySettlementDetail({ setid: this.setid }).then((res) => {
        this.splitData = res.result.settlementdetailitems;
        this.splitItemData = res.result.splitLoads.map((k, index) => {
          return {
            ...k,
            customId: `${k.splitid}${index}`,
          };
        });
        this.splitItemData.forEach((item) => {
          item.splitdetailitems = item.splitdetailitems.map((k) => {
            return {
              ...k,
              totalprice: k.price,
            };
          });
        });
        this.showSplit = true;
      });
    },
    // 单位结算表打印
    handleCompanySettlementPrint(flag) {
      this.$refs.popoverRefIdcA.doClose();
      this.$refs.popoverRefIdcB.doClose();
      if (this.company === "") {
        this.$message.warning("请先选中单位再进行打印!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: flag == "unit" ? "单位结算统计" : "项目明细表",
        printflag: 1,
        whereitems: [
          {
            key: "companycode",
            value: this.company,
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
    // 导出为PDF
    handleGetExportPdf(flag) {
      this.$refs.popoverRefIdcA.doClose();
      this.$refs.popoverRefIdcB.doClose();
      if (this.company === "") {
        this.$message.warning("请先选中单位再进行导出!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: flag == "unit" ? "单位结算统计" : "项目明细表",
        printflag: 1,
        whereitems: [
          {
            key: "companycode",
            value: this.company,
          },
        ],
      };
      printStaticsBase64(data).then((res) => {
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
        const a = document.createElement("a");
        a.href = url;
        a.download = flag == "unit" ? "单位结算统计" : "项目明细表"; // 下载文件的名字
        // a.download = res.data[0].printname; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
    },
    // 导出为Excel
    handleGetExportExcel(flag) {
      this.$refs.popoverRefIdcA.doClose();
      this.$refs.popoverRefIdcB.doClose();
      if (this.company === "") {
        this.$message.warning("请先选中单位再进行导出!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: flag == "unit" ? "单位结算统计" : "项目明细表",
        printflag: 1,
        filetype: "xlsx",
        outtype: "url",
        whereitems: [
          {
            key: "companycode",
            value: this.company,
          },
        ],
      };
      printStaticsBase64(data).then((res) => {
        let url = res.data[0].fileurl;
        const a = document.createElement("a");
        a.href = url;
        a.download = flag == "unit" ? "单位结算统计" : "项目明细表"; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
    },
    // 勾选登记人计算结算金额回调
    handleGetCalcPayMoney() {
      let regiditems = this.selectSettlement.map((k) => {
        return k.regid;
      });
      CalcPayMoneyByCharge(regiditems).then((res) => {
        this.settleModeData = res.result.detailites;
        this.personnelTotal = res.result.settlementitem.personnelTotal;
        this.settotal = res.result.settlementitem.settotal;
        this.setdiscounttotal = +this.settotal * +this.discount;
        this.setactualtotal = +this.settotal * +this.discount;
      });
    },
    // 新增发送回调
    handleSetSettlementSend() {
      if (!this.setid) {
        this.$message.warning("请先结算数据!");
        return;
      }
      setSettlementSend({
        setid: this.setid,
      }).then((res) => {
        this.$message.success(res.message); // 提示
        this.handleReset(); // 重置页面
        this.setid = res.result;
        this.pageFlag = "edit";
        this.handleSetSettlDetail();
      });
    },
    // 新增结算回调
    handleSetSettlementCreate() {
      console.log(this.settleMode);
      if (this.settleMode === "") {
        this.$message.warning("请选择结算方式!");
        return false;
      }
      if (this.selectSettlement.length == 0) {
        this.$message.warning("请添加结算人员!");
        return false;
      }
      let settlementitem = {
        companyregid: this.selectSettlement[0].companyregid,
        companycode: this.selectSettlement[0].companycode,
        companyname: this.selectSettlement[0].companyname,
        batch: this.selectSettlement[0].batch,
        settlementtype: this.settleMode,
        personnelTotal: this.selectSettlement.length,
        settotal: +this.settotal,
        setdiscount: this.discount,
        setdiscounttotal: this.setdiscounttotal,
        setactualtotal: +this.setactualtotal,
        explain: this.explain,
        exceedpriceList: this.settleModeData,
      };
      setCreateByCharge({
        businesstype: "Save",
        settlementitem,
        customeritems: this.selectSettlement,
      }).then((res) => {
        this.$message.success(res.message); // 提示
        this.handleReset(); // 重置页面
        this.setid = res.result;
        this.pageFlag = "edit";
        this.handleSetSettlDetail();
      });
    },
    // 取消结算回调
    handleCancelSettlement() {
      this.$confirm("确定取消此结算?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setSettlCancel({ setid: this.setid }).then((res) => {
            this.$message.success(res.message); // 提示
            this.handleReset(); // 重置页面
            this.handleGetCompanyList();
            this.status = 0;
            this.pageFlag = "add";
          });
        })
        .catch(() => {});
    },
    // 重置页面数据
    handleReset() {
      this.staffData = [];
      this.settleModePson = [];
      this.settleModeData = [];
      this.settleMode = 0;
      this.company = "";
      this.setid = "";
      this.batch = "";
      this.group = "";
      this.explain = "";
      this.personnelTotal = 0;
      this.settotal = 0;
      this.discount = 1;
      this.setdiscounttotal = 0;
      this.hiscode = "";
      this.setactualtotal = 0;
    },
    // 获取详情回调
    handleSetSettlDetail() {
      setSettlDetail({ setid: this.setid }).then((res) => {
        let { settlementitem, customeritems, detailites } = res.result;
        this.staffData = customeritems;
        this.staffTempData = JSON.parse(JSON.stringify(customeritems));
        customeritems.forEach((k) => {
          this.settleModePson.push(k.regid);
        });
        this.settleModeData = detailites;
        this.settleMode = settlementitem.settlementtype;
        this.company = settlementitem.companycode;
        this.companyname = settlementitem.companyname;
        this.batch = settlementitem.batch;
        this.group = settlementitem.group || "";
        this.explain = settlementitem.explain;
        this.personnelTotal = settlementitem.personnelTotal;
        this.setactualtotal = settlementitem.setactualtotal;
        this.setdiscounttotal = settlementitem.setdiscounttotal;
        this.hiscode = settlementitem.hiscode;
        this.settotal = settlementitem.settotal;
        this.discount = settlementitem.setdiscount;
        this.chargeflag = settlementitem.chargeflag;
        this.admisstimes = settlementitem.admiss_times;
      });
    },
    // 结算方式切换改变回调
    handleChangeSettleMode() {
      if (this.settleMode === 2) {
        this.staffData = this.staffTempData.filter((k) => {
          return k.status >= 6;
        });
        this.settleModePson = [];
        this.settleModeData = [];
      } else if (this.settleMode === 0) {
        this.staffData = this.staffTempData.filter((k) => {
          return k.status < 6;
        });
      } else if (this.settleMode === 1) {
        this.staffData = this.staffTempData.filter((k) => {
          return k.status >= 3 && k.status <= 5;
        });
      } else {
        this.staffData = this.staffTempData;
      }
    },
    // 输入框打折改变回调
    handleInputChange() {
      // console.log(this.discount);
      let reg = /^[0-9]+.?[0-9]*$/;
      if (!reg.test(+this.discount)) {
        this.$message.warning("折扣输入必须为数值，例: 0 ~ 1 !");
        this.discount = 1;
        return false;
      }
      if (+this.discount < 0 || +this.discount > 1) {
        this.$message.warning("折扣不能低于一折或高于10折!");
        this.discount = 1;
        return false;
      }
      this.setdiscounttotal = (+this.discount * +this.settotal).toFixed(2);
      this.setactualtotal = (+this.discount * +this.settotal).toFixed(2);

      //输入框值改变
      // this.discount = this.discount.replace(/[^\d]/g, "");
    },
    // 点击搜索人员列表信息
    handleSearchPage() {
      getUnSettlement({
        companycode: this.company,
        batch: this.batch,
        groupcode: this.group,
      }).then((res) => {
        if (res.result) {
          // res.result.forEach((item) => {
          //   item.combineitems = item.combineitems.map((k) => {
          //     return {
          //       ...k,
          //       amount: 1,
          //     };
          //   });
          // });
          this.staffData = res.result;
          this.staffTempData = JSON.parse(JSON.stringify(res.result));
          // this.staffTempData = res.result;
        } else {
          this.staffData = [];
          this.staffTempData = [];
        }
      });
    },
    // 公司选中获取数据回调
    handleSelectCompany(data) {
      this.staffData = [];
      if (!data) {
        this.batch = "";
        this.group = "";
        this.companyname = "";
        return false;
      } else {
        let flag = this.companyitems.filter((k) => {
          return k.code == data;
        })[0];
        flag && (this.companyname = data.name);
        getBatchList({ companycode: this.company }).then((res) => {
          this.batchitems = res.result.batchitems;
          let batch = this.batchitems.filter((k) => k.selected)[0];
          if (batch) {
            this.batch = batch.code;
            this.groupitems = batch.groupitems;
            let group = this.groupitems.filter((k) => k.selected)[0];
            group && (this.group = group.code);
          }
          this.handleSearchPage();
        });
      }
    },
    // 获取公司列表信息回调
    handleGetCompanyList() {
      getCompanyList().then((res) => {
        this.companyitems = res.result.companyitems;
        let company = this.companyitems.filter((k) => k.selected)[0];
        company && (this.company = company.code);
      });
    },
    // 当前页面关闭回调
    handleClosePage() {
      this.handleReset(); // 重置页面
      this.$emit("close", false);
    },
    //  人员列表选中数据回调
    handleSelectStaff(row) {
      console.log(row);
      if (row.length == 0) {
        this.settleModeData = []; // 当前选中结算数据
        this.personnelTotal = 0; // 当前选中结算数据人数
        this.settotal = 0; // 当前选中结算数据价钱
        return false;
      }
      this.selectSettlement = row;
      this.handleGetCalcPayMoney();
      /** 
      let flag = this.settleModePson.findIndex((k) => k == row.regid);
      if (flag === -1) {
        this.settleModePson.push(row.regid);
        if (this.settleModePson.length == 1) {
          this.settleModeData.push(...row.combineitems);
        } else {
          row.combineitems.forEach((item, index) => {
            let isExist = this.settleModeData.findIndex(
              (k) => k.combinecode == item.combinecode
            );
            if (isExist === -1) {
              this.settleModeData.push(item);
            } else {
              this.settleModeData[isExist].amount =
                this.settleModeData[isExist].amount + 1;
            }
          });
        }

        console.log(this.settleModeData);
      }
      */
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
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/addOrEdit.scss";
/deep/.discount_input {
  width: 100%;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #c7c6c6;
  outline: none;
  background-color: #fff;
  font-weight: 600 !important;
}
/deep/.discount_input:focus {
  border: 1px solid #0076c8;
}
</style>