<template>
  <div class="addoredit">
    <!-- 头部筛选盒子 -->
    <div class="head_box">
      <div class="title_box">
        <div class="title">团检信息</div>
        <div class="btn_group">
          <el-button type="primary" size="mini" plain @click="handleResetPage">重置</el-button>
          <el-button type="primary" size="mini" plain @click="handleUnSettlementCustomers">结算</el-button>
          <!-- :disabled="pageFlag == 'edit'" -->
          <el-button type="primary" size="mini" plain @click="handleShowUnitDia">发送</el-button>
          <!-- <el-button
            type="primary"
            size="mini"
            plain
            @click="handleCompanySettlementCreate"
            >发送</el-button
          > -->
          <el-button type="primary" size="mini" plain @click="handleCompanySettlementCreateSave">保存</el-button>
          <el-button type="primary" size="mini" plain @click="handleClickExport">导出</el-button>
          <el-button type="primary" size="mini" plain @click="handleClickPrint">打印</el-button>
          <el-button type="primary" size="mini" plain @click="handleClosePage">关闭</el-button>
        </div>
      </div>
      <el-form ref="form" class="search_form" :model="searchForm" label-width="80px">
        <el-form-item size="mini" label="单位名称">
          <el-select clearable style="width: 300px" v-model="searchForm.companycode" filterable @change="handleSelectCompany" :disabled="pageFlag == 'edit'">
            <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="批次">
          <el-select v-model="searchForm.batch" @change="handleChangeBatch" :disabled="pageFlag == 'edit'">
            <el-option v-for="(item, index) in batchitems" :key="index" filterable :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="团检分组">
          <el-select v-model="searchForm.groupcode" multiple filterable collapse-tags @change="handleChangeGroupcode" :disabled="pageFlag == 'edit'">
            <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="部门">
          <el-select v-model="searchForm.department" multiple filterable collapse-tags :disabled="pageFlag == 'edit'">
            <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="二级部门">
          <el-select v-model="searchForm.department2" multiple filterable collapse-tags :disabled="pageFlag == 'edit'">
            <el-option v-for="(item, index) in departitem2s" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="加项">
          <el-select v-model="itemtypeValue" filterable clearable @change="handleChangeItemType">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="折扣">
          <el-input placeholder="请输入内容" v-model="discountAll" clearable @blur="handleChangeAllDiscountAll" @keyup.enter.native="handleChangeAllDiscountAll" @clear="handleChangeAllDiscountAll">
          </el-input>
        </el-form-item>
        <el-form-item size="mini" label="加减折扣">
          <el-input placeholder="请输入内容" v-model="discount" clearable @blur="handleChangeAllDiscount" @keyup.enter.native="handleChangeAllDiscount" @clear="handleChangeAllDiscount">
          </el-input>
        </el-form-item>

        <el-form-item size="mini" label="结算方式">
          <el-select v-model="searchForm.settlementtype" :disabled="pageFlag == 'edit'">
            <el-option label="分组结算" value="Group"></el-option>
            <el-option label="已检结算" value="CombineChecked"></el-option>
            <el-option label="已检结算（不含已缴费）" value="CombineCheckedAndNotPay"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 主体数据表格 -->
      <div class="page_table_box">
        <EasyTable height="100%" :data="tableData" class="page_table" :tableOptions="tableOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
      </div>
      <!-- 价格展示 -->
      <div class="price_box">
        <div class="prcie_itme">
          <div class="price_title">应收费用(元)：</div>
          <div class="prcie_content">{{ receivableTotal }}</div>
        </div>
        <div class="prcie_itme">
          <div class="price_title">实际费用(元)：</div>
          <div class="prcie_content">{{ realityTotal }}</div>
        </div>
        <div class="prcie_itme">
          <div class="price_title">优惠费用(元)：</div>
          <div class="prcie_content">
            {{ (receivableTotal - realityTotal).toFixed(2) }}
          </div>
        </div>
      </div>
      <!-- 单位名称弹框 -->
      <el-dialog class="dialog-mini discount_dialog" width="50%" top="20%" :close-on-click-modal="false" title="单位名称" :visible.sync="showUnitDia" @close="handleCloseUnitDia">
        <div class="discount_box">
          <div class="dbox_input">
            <div class="dbi_title">单位名称：</div>
            <el-input style="width: 80%" placeholder="请输入单位名称" size="mini" max="100" min="1" v-model="unitname" clearable>
            </el-input>
          </div>
          <div class="dbox_input">
            <div class="dbi_title">信用代码：</div>
            <el-input style="width: 80%" placeholder="请输入信用代码" size="mini" max="100" min="1" v-model="certnocode" clearable>
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmUnitname">确 认</el-button>
          <el-button size="mini" @click="handleCloseUnitDia">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getBatchList,
  UnSettlementCustomers,
  CompanySettlementCreate,
  setSettlDetail,
} from "@/api/companysettlement.js";
import { getCompanyList } from "@/api/appointment.js";
import { printStaticsBase64 } from "@/api/printreport.js";
import * as users from "@/api/users";
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
      discountProperty: [],
      pageFlag: "add", // 当前页面状态
      searchForm: {
        companycode: "",
        batch: "",
        groupcode: [],
        department: [],
        department2: [],
        settlementtype: "Group",
      }, // 筛选表单对象
      groupname: [],
      companyname: "",
      companyitems: [], // 公司列表数据
      taxnumber: "",
      batchitems: [], // 批次列表数据
      groupitems: [], // 分组列表数据
      tableData: [],
      tableDataCopy: [],
      setid: "",
      tempVariable: "", // 临时储存变量
      receivablePrice: "", // 应收费用
      realityPrice: "", // 实际费用
      settlementitemObj: {},
      showUnitDia: false,
      unitname: "", // 单位名称
      certnocode: "", // 单位名称
      discount: 1,
      discountAll: 1,
      departitems: [],
      departitem2s: [],
      itemtypeValue: 0,
    };
  },

  computed: {
    // 应收费用
    receivableTotal() {
      let priceAdd = 0;
      let priceCut = 0;
      this.tableData.forEach((k) => {
        if (k.itemtype != 2) {
          priceAdd += k.price * k.amount;
        } else if (k.itemtype == 2) {
          priceCut += k.price * k.amount;
        }
      });
      this.receivablePrice = +(priceAdd - priceCut).toFixed(2);
      console.log(+(priceAdd - priceCut));
      console.log(+(priceAdd - priceCut).toFixed(2));
      return +(priceAdd - priceCut).toFixed(2);
    },
    // 实际费用
    realityTotal() {
      let priceAdd = 0;
      let priceCut = 0;
      this.tableData.forEach((k) => {
        if (k.itemtype != 2) {
          priceAdd += k.discountprice * k.amount;
        } else if (k.itemtype == 2) {
          priceCut += k.discountprice * k.amount;
        }
      });
      this.realityPrice = +(priceAdd - priceCut).toFixed(2);
      return +(priceAdd - priceCut).toFixed(2);
    },
    // 优惠费用
    discountFeesTotal() {},
    //   主页主体表格配置
    tableOptions() {
      return [
        {
          title: "组合名称",
          prop: "combinename",
          width: 180,
          omit: 1,
        },
        {
          title: "收费名称",
          prop: "chargename",
          width: 220,
          omit: 1,
        },
        {
          title: "单价",
          prop: "price",
          width: 160,
          omit: 1,
        },
        {
          title: "折扣",
          width: 160,
          render: (h, data) => {
            return (
              <input
                type="text"
                class={`discount_input enterInput0_${data.$index}`}
                v-model={data.discount}
                vOn:focus={(e) => {
                  if (!e) return;
                  this.tempVariable = data.discount;
                  e.stopPropagation();
                  e.currentTarget && e.currentTarget.select();
                }}
                vOn:blur={(e) => this.handleChangeDiscount(data)}
                onkeyup={(e) => {
                  if (!e) return;
                  switch (e.keyCode) {
                    case 13: // 键盘回车
                      this.handleChangeDiscount(data);
                      this.handleJumpNextInput(data, 0);
                      break;
                    case 37: // 键盘 ← 键盘
                      this.handleDiscountLeft(e, data, 0);
                      break;
                    case 38: // 键盘 ↑ 键盘
                      this.handleDiscountUpper(e, data, 0);
                      break;
                    case 39: // 键盘 → 键盘
                      this.handleDiscountRight(e, data, 0);
                      break;
                    case 40: // 键盘 ↓ 键盘
                      this.handleDiscountLower(e, data, 0);
                      break;
                    default:
                      break;
                  }
                }}
              ></input>
            );
          },
        },
        {
          title: "折后价",
          width: 160,
          render: (h, data) => {
            return (
              <input
                type="text"
                class={`discount_input enterInput1_${data.$index}`}
                v-model={data.discountprice}
                vOn:focus={(e) => {
                  if (!e) return;
                  this.tempVariable = data.discountprice;
                  e.stopPropagation();
                  e.currentTarget && e.currentTarget.select();
                }}
                vOn:blur={(e) => this.handleChangeDiscountPrice(data)}
                onkeyup={(e) => {
                  if (!e) return;
                  switch (e.keyCode) {
                    case 13: // 键盘回车
                      this.handleChangeDiscountPrice(data);
                      this.handleJumpNextInput(data, 1);
                      break;
                    case 37: // 键盘 ← 键盘
                      this.handleDiscountLeft(e, data, 1);
                      break;
                    case 38: // 键盘 ↑ 键盘
                      this.handleDiscountUpper(e, data, 1);
                      break;
                    case 39: // 键盘 → 键盘
                      this.handleDiscountRight(e, data, 1);
                      break;
                    case 40: // 键盘 ↓ 键盘
                      this.handleDiscountLower(e, data, 1);
                      break;
                    default:
                      break;
                  }
                }}
              ></input>
            );
          },
        },
        {
          title: "人次",
          width: 160,
          render: (h, data) => {
            return (
              <input
                type="text"
                class={`discount_input enterInput2_${data.$index}`}
                v-model={data.amount}
                vOn:focus={(e) => {
                  if (!e) return;
                  this.tempVariable = data.amount;
                  e.stopPropagation();
                  e.currentTarget && e.currentTarget.select();
                }}
                vOn:blur={(e) => this.handleChangeAmount(data)}
                onkeyup={(e) => {
                  if (!e) return;
                  switch (e.keyCode) {
                    case 13: // 键盘回车
                      this.handleChangeAmount(data);
                      this.handleJumpNextInput(data, 2);
                      break;
                    case 37: // 键盘 ← 键盘
                      this.handleDiscountLeft(e, data, 2);
                      break;
                    case 38: // 键盘 ↑ 键盘
                      this.handleDiscountUpper(e, data, 2);
                      break;
                    case 39: // 键盘 → 键盘
                      this.handleDiscountRight(e, data, 2);
                      break;
                    case 40: // 键盘 ↓ 键盘
                      this.handleDiscountLower(e, data, 2);
                      break;
                    default:
                      break;
                  }
                }}
              ></input>
            );
          },
        },
        {
          title: "项目类型",
          prop: "itemtype",
          returnVal: (value) => {
            return value == 0 ? "" : value == 1 ? "加项" : "减项";
          },
        },
      ];
    },
  },

  mounted() {
    this.pageFlag = this.addOrEdit;
    this.handleGetCompanyList();
    this.handleGetUserPropertyValues();
    if (this.pSetid != "") {
      this.setid = this.pSetid;
      this.status = 1;
      this.handleSetSettlDetail();
    } else {
      this.status = 0;
    }
  },

  methods: {
    handleChangeItemType(value) {
      if (value == 1) {
        this.tableData = this.tableDataCopy.filter(
          (item) => item.itemtype == 1
        );
      } else if (value == 2) {
        this.tableData = this.tableDataCopy.filter(
          (item) => item.itemtype == 2
        );
      } else {
        this.tableData = this.tableDataCopy;
      }
    },
    // 回车跳转下一个结果
    handleJumpNextInput(item, num) {
      if (!item) return;
      let dom = document.querySelector(`.enterInput${num}_${item.$index + 1}`);
      if (!dom) return;
      // 是否禁用 $(dom).is(":disabled")
      dom.focus();
    },
    // 键盘↓键跳转结果回调
    handleDiscountLower(e, item, num) {
      this.$nextTick(() => {
        if (item.$index === this.tableData.length - 1) return;
        let pDom = document.querySelector(
          `.enterInput${num}_${item.$index + 1}`
        );
        if (!pDom) return;
        pDom.focus();
      });
    },
    // 键盘↑键跳转结果回调
    handleDiscountUpper(e, item, num) {
      this.$nextTick(() => {
        if (item.$index === 0) return;
        let pDom = document.querySelector(
          `.enterInput${num}_${item.$index - 1}`
        );
        if (!pDom) return;
        pDom.focus();
      });
    },
    // 键盘←键跳转结果回调
    handleDiscountLeft(e, item, num) {
      this.$nextTick(() => {
        if (num === 0) return;
        let pDom = document.querySelector(
          `.enterInput${num - 1}_${item.$index}`
        );
        if (!pDom) return;
        pDom.focus();
      });
    },
    // 键盘→键跳转结果回调
    handleDiscountRight(e, item, num) {
      this.$nextTick(() => {
        if (num === 2) return;
        let pDom = document.querySelector(
          `.enterInput${num + 1}_${item.$index}`
        );
        if (!pDom) return;
        pDom.focus();
      });
    },
    handleGetUserPropertyValues() {
      let id = JSON.parse(localStorage.getItem("userId"));
      let ct = "DiscountProperty";
      users.getUserProperty({ id, ct }).then((res) => {
        console.log(res);
        if (!res.result) return;
        let resDis = res.result.filter((k) => {
          return k.category === ct;
        })[0];
        resDis && (this.discountProperty = resDis.propertyvalue.split("-"));
      });
    },
    handleChangeDepartment(value) {
      if (!value) return;
      let tempArr = [];
      value.forEach((k) => {
        let tempObj = this.departitems.filter((item) => {
          return k == item.code;
        })[0];
        tempObj && tempArr.push(tempObj.name);
      });
      this.departitems = tempArr;
    },
    handleChangeGroupcode(value) {
      if (!value) return;
      let tempArr = [];
      value.forEach((k) => {
        let tempObj = this.groupitems.filter((item) => {
          return k == item.code;
        })[0];
        tempObj && tempArr.push(tempObj.name);
      });
      this.groupname = tempArr;
    },
    // 全局折扣修改
    handleChangeAllDiscountAll() {
      if (this.tableData.length == 0) {
        this.$message.warning("请先查询结算数据!");
        return;
      }
      if (this.discountAll == "") {
        this.$message.warning("折扣不能为空!");
        this.discountAll = 1;
        return;
      }
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        row.discount = 1;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+this.discountAll < min || +this.discountAll > max) {
          this.$message.warning("超出当前用户打折范围!");
          this.discountAll = 1;
          return false;
        }
      }
      let reg = /^[0-9]+.?[0-9]*/;
      let min = 0;
      let max = 1;
      if (+this.discountAll < min || +this.discountAll > max) {
        this.$message.warning("请输入正确打折范围!参考范围 0~1");
        this.discountAll = 1;
        return false;
      }
      if (!reg.test(+this.discountAll)) {
        this.$message.warning("请输入正确打折范围!参考范围 0~1");
        this.discountAll = 1;
        return false;
      }
      this.tableData.forEach((k) => {
        // k.discountflag == 0
        if (k.itemtype == 0) {
          k.discount = +this.discountAll;
          k.discountprice = +(+k.price * +this.discountAll).toFixed(2);
        }
      });
      // data.discountprice = +(+data.price * +this.discount).toFixed(2);
    },
    // 全局折扣修改
    handleChangeAllDiscount() {
      if (this.tableData.length == 0) {
        this.$message.warning("请先查询结算数据!");
        return;
      }
      if (this.discount == "") {
        this.$message.warning("折扣不能为空!");
        this.discount = 1;
        return;
      }
      let reg = /^[0-9]+.?[0-9]*/;
      let min = 0;
      let max = 1;
      if (+this.discount < min || +this.discount > max) {
        this.$message.warning("请输入正确打折范围!参考范围 0~1");
        this.discount = 1;
        return false;
      }
      if (!reg.test(+this.discount)) {
        this.$message.warning("请输入正确打折范围!参考范围 0~1");
        this.discount = 1;
        return false;
      }
      this.tableData.forEach((k) => {
        if (k.itemtype != 0) {
          k.discount = +this.discount;
          k.discountprice = +(+k.price * +this.discount).toFixed(2);
        }
      });
      // data.discountprice = +(+data.price * +this.discount).toFixed(2);
    },
    // 填写完单位名称确认回调
    handleConfirmUnitname() {
      if (!this.unitname) {
        this.$message.warning("提交的单位名称不能为空!");
        return;
      }
      this.handleCompanySettlementCreate(); // 调用发送接口
    },
    // 点击发送调用弹框展示
    handleShowUnitDia() {
      this.unitname = this.companyname;
      this.certnocode = this.taxnumber;
      this.showUnitDia = true;
    },
    // 关闭发送填写单位弹框
    handleCloseUnitDia() {
      this.showUnitDia = false;
      this.unitname = ""; // 单位名称
      this.certnocode = ""; // 单位名称
    },
    // 切换批次回调
    handleChangeBatch(val) {
      if (val) {
        let flag = this.batchitems.filter((k) => {
          return k.code == val;
        })[0];
        if (!flag) return;
        console.log(flag, "flag");
        this.groupitems = flag.groupitems;
        this.departitems = flag.departitems;
        this.departitem2s = flag.departitem2s;
      } else {
        this.groupitems = [];
        this.departitems = [];
        this.departitem2s = [];
      }
    },
    // 点击导出回调
    handleClickExport() {
      if (!this.setid) {
        this.$message.warning("请先发送/保存再进行打印!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: "单位结算表",
        filetype: "devxlsx",
        outtype: "url",
        xlsstartrowindex: 3,
        printflag: 1,
        whereitems: [
          {
            key: "companycode",
            value: this.settlementitemObj.companycode,
          },
          {
            key: "batch",
            value: this.settlementitemObj.batch,
          },
          {
            key: "setid",
            value: this.settlementitemObj.setid,
          },
        ],
      };
      printStaticsBase64(data).then((res) => {
        /* let code = res.data[0].base64String.replace(/[\n\r]/g, "");
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
        a.download = `单位结算统计`; // 下载文件的名字
        // a.download = res.data[0].printname; // 下载文件的名字
        document.body.appendChild(a);
        a.click();  */

        let url = res.data[0].fileurl;
        const a = document.createElement("a");
        a.href = url;
        a.download = "单位结算统计"; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
    },
    // 点击打印回调
    handleClickPrint() {
      if (!this.setid) {
        this.$message.warning("请先发送/保存再进行打印!");
        return;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: "单位结算表",
        printflag: 1,
        whereitems: [
          {
            key: "companycode",
            value: this.settlementitemObj.companycode,
          },
          {
            key: "batch",
            value: this.settlementitemObj.batch,
          },
          {
            key: "setid",
            value: this.settlementitemObj.setid,
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
    // 点击保存费用回调
    handleCompanySettlementCreateSave() {
      if (this.tableData == 0) return;
      let settlementitem = {
        setid: this.setid || "",
        companyregid: this.tableData[0].companyregid || "",
        companycode: this.searchForm.companycode,
        companyname: this.companyname || "",
        batch: this.searchForm.batch,
        settlementtype: 0,
        personnelTotal: this.tableData[0].personnelTotal,
        settotal: this.receivablePrice || 0,
        setdiscount:
          +(+this.receivablePrice - +this.realityPrice).toFixed(2) || 0,
        setdiscounttotal:
          +(+this.receivablePrice - +this.realityPrice).toFixed(2) || 0,
        setactualtotal: this.realityPrice || 0,
        explain: "",
        paymenttype: 0,
        invoiceNo: "",
        chargeflag: 0,
      };
      let customeritems = [
        {
          regid: "",
          sex: 0,
          age: 0,
          ageunit: "",
          companycode: this.searchForm.companycode,
          companyname: this.companyname || "",
          batch: this.searchForm.batch,
          groupcode: "",
          groupname: "",
          statusname: "",
          combineitems: this.tableData.map((k) => {
            return {
              detid: "",
              setmealcode: "",
              setmealname: "",
              combinecode: k.combinecode,
              combinename: k.combinename,
              deptcode: k.deptcode,
              deptname: k.deptname,
              price: k.price,
              discount: k.discount,
              discountprice: k.discountprice,
              chargeflag: 0,
              status: 0,
              balanceflag: 0,
              balancecode: "",
              settlementtype: 0,
              amount: k.amount,
              chargename: k.chargename,
              itemtype: k.itemtype,
            };
          }),
        },
      ];
      let data = {
        settlementitem,
        customeritems,
        businesstype: "Save",
      };
      CompanySettlementCreate(data).then((res) => {
        this.$message.success(res.message);
        this.setid = res.result;
        this.pageFlag = "edit";
        this.handleSetSettlDetail();
      });
    },
    // 点击发送费用回调
    handleCompanySettlementCreate() {
      if (this.tableData == 0) return;
      let settlementitem = {
        setid: this.setid || "",
        companyregid: this.tableData[0].companyregid || "",
        companycode: this.searchForm.companycode,
        companyname: this.unitname || this.companyname || "",
        certno: this.certnocode || "",
        batch: this.searchForm.batch,
        settlementtype: 0,
        personnelTotal: this.tableData[0].personnelTotal,
        settotal: this.receivablePrice || 0,
        setdiscount:
          +(+this.receivablePrice - +this.realityPrice).toFixed(2) || 0,
        setdiscounttotal:
          +(+this.receivablePrice - +this.realityPrice).toFixed(2) || 0,
        setactualtotal: this.realityPrice || 0,
        explain: "",
        paymenttype: 0,
        invoiceNo: "",
        chargeflag: 0,
      };
      let customeritems = [
        {
          regid: "",
          sex: 0,
          age: 0,
          ageunit: "",
          companycode: this.searchForm.companycode,
          companyname: this.unitname || this.companyname || "",
          certno: this.certnocode || "",
          batch: this.searchForm.batch,
          groupcode: "",
          groupname: "",
          statusname: "",
          combineitems: this.tableData.map((k) => {
            return {
              detid: "",
              setmealcode: "",
              setmealname: "",
              combinecode: k.combinecode,
              combinename: k.combinename,
              deptcode: k.deptcode,
              deptname: k.deptname,
              price: k.price,
              discount: k.discount,
              discountprice: k.discountprice,
              chargeflag: 0,
              status: 0,
              balanceflag: 0,
              balancecode: "",
              settlementtype: 0,
              amount: k.amount,
              chargename: k.chargename,
              itemtype: k.itemtype,
            };
          }),
        },
      ];
      let data = {
        settlementitem,
        customeritems,
      };
      CompanySettlementCreate(data).then((res) => {
        this.$message.success(res.message);
        this.setid = res.result;
        this.pageFlag = "edit";
        this.handleSetSettlDetail();
      });
      this.handleCloseUnitDia();
    },
    // 获取详情回调
    handleSetSettlDetail() {
      setSettlDetail({ setid: this.setid }).then((res) => {
        let { settlementitem, customeritems, detailites } = res.result;
        this.settlementitemObj = settlementitem;
        this.tableData = detailites;
        this.tableDataCopy = JSON.parse(JSON.stringify(detailites));
        this.searchForm.companycode = settlementitem.companycode;
        this.companyname = settlementitem.companyname;
        this.certnocode = settlementitem.certno;
        this.searchForm.batch = settlementitem.batch;
        this.searchForm.groupcode = settlementitem.group || "";
      });
    },
    // 人数改变回调
    handleChangeAmount(data) {
      if (!data) return;
      let reg = /^[0-9]+.?[0-9]*/;
      let min = 0;
      if (+data.amount < min) {
        this.$message.warning("请输入正确人数!参考范围 > 0");
        data.amount = this.tempVariable;
        return false;
      }
      if (!(+data.amount % 1 === 0)) {
        this.$message.warning("请输入整数");
        data.amount = this.tempVariable;
        return false;
      }
      if (!reg.test(+data.amount)) {
        this.$message.warning("请输入正确人数!参考范围 > 0");
        data.amount = this.tempVariable;
        return false;
      }
    },
    // 折后价改变回调
    handleChangeDiscountPrice(data) {
      if (!data) return;
      let reg = /^[0-9]+.?[0-9]*/;
      let min = 0;
      if (+data.discountprice > +data.price) {
        this.$message.warning("折后价不能大于单价!");
        data.discountprice = this.tempVariable;
        return false;
      }
      if (+data.discountprice < min) {
        this.$message.warning("请输入正确价格范围!参考范围 > 0");
        data.discountprice = this.tempVariable;
        return false;
      }
      if (!reg.test(+data.discountprice)) {
        this.$message.warning("请输入正确价格范围!参考范围 > 0");
        data.discountprice = this.tempVariable;
        return false;
      }
    },
    // 折扣改变回调
    handleChangeDiscount(data) {
      if (!data) return;
      let reg = /^[0-9]+.?[0-9]*/;
      let min = 0;
      let max = 1;
      if (+data.discount < min || +data.discount > max) {
        this.$message.warning("请输入正确打折范围!参考范围 0~1");
        data.discount = this.tempVariable;
        return false;
      }
      if (!reg.test(+data.discount)) {
        this.$message.warning("请输入正确打折范围!参考范围 0~1");
        data.discount = this.tempVariable;
        return false;
      }
      data.discountprice = +(+data.price * +data.discount).toFixed(2);
    },
    // 获取单位结算项目信息
    handleUnSettlementCustomers() {
      if (this.searchForm.companycode == "") {
        this.$message.warning("请先选择单位!");
        return;
      }
      if (this.searchForm.batch == "") {
        this.$message.warning("请先选择批次!");
        return;
      }
      let data = {
        companycode: this.searchForm.companycode,
        batch: this.searchForm.batch,
        settlementtype: this.searchForm.settlementtype,
      };
      if (this.searchForm.groupcode.length > 0) {
        data.groupcode = this.searchForm.groupcode.join(",");
      }
      if (this.searchForm.department.length > 0) {
        data.department = this.searchForm.department.join(",");
      }
      if (this.searchForm.department2.length > 0) {
        data.department2 = this.searchForm.department2.join(",");
      }
      UnSettlementCustomers(data).then((res) => {
        if (!res.result) {
          this.tableData = [];
          this.tableDataCopy = [];
        } else {
          this.tableData = res.result;
          this.tableDataCopy = JSON.parse(JSON.stringify(res.result));
        }
      });
    },
    handleResetPage() {
      this.searchForm = {
        companycode: "",
        batch: "",
        groupcode: [],
        department: [],
        department2: [],
      }; // 筛选表单对象
      this.tableData = [];
      this.tableDataCopy = [];
      this.tempVariable = [];
    },
    // 获取公司列表信息回调
    handleGetCompanyList() {
      getCompanyList().then((res) => {
        this.companyitems = res.data.map((k) => {
          return {
            ...k,
            code: k.companycode,
            name: k.companyname,
          };
        });
        let company = this.companyitems.filter((k) => k.selected)[0];
        company && (this.searchForm.companycode = company.code);
      });
    },
    // 公司选中获取数据回调
    handleSelectCompany(data) {
      if (!data) {
        this.companyname = "";
        this.taxnumber = "";
        this.searchForm.batch = "";
        this.searchForm.groupcode = [];
        this.searchForm.department = [];
        this.searchForm.department2 = [];
        return false;
      } else {
        let company = this.companyitems.filter((k) => {
          return k.code === this.searchForm.companycode;
        })[0];
        company && (this.companyname = company.name);
        company && (this.taxnumber = company.taxnumber);
        getBatchList({ companycode: this.searchForm.companycode }).then(
          (res) => {
            this.batchitems = res.result.batchitems;
            let batch = this.batchitems.filter((k) => k.selected)[0];
            if (batch) {
              this.searchForm.batch = batch.code;
              this.groupitems = batch.groupitems;
              this.departitems = batch.departitems;
              this.departitem2s = batch.departitem2s;
              let group = this.groupitems.filter((k) => k.selected)[0];
              group && this.searchForm.groupcode.push(group.code);
            }
          }
        );
      }
    },
    // 当前页面关闭回调
    handleClosePage() {
      this.$emit("close", false);
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
<style lang="scss" scoped>
@import "./css/addOrEdit_gyey.scss";
</style>
