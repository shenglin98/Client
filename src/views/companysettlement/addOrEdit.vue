<template>
  <div class="addoredit">
    <!-- 头部筛选盒子 -->
    <div class="head_box">
      <div class="title_box">
        <div class="title">团检信息</div>
        <div class="btn_group">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            plain
            :disabled="pageFlag == 'edit'"
            @click="handleSearchPage"
            >查询</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-close"
            plain
            @click="handleClosePage"
            >关闭</el-button
          >
        </div>
      </div>
      <el-form
        ref="form"
        class="search_form"
        :model="searchForm"
        label-width="80px"
      >
        <el-form-item size="mini" label="单位名称">
          <el-select
            :disabled="pageFlag == 'edit'"
            clearable
            style="width: 300px"
            v-model="company"
            @change="handleSelectCompany"
          >
            <el-option
              v-for="(item, index) in companyitems"
              :key="index"
              :label="`${item.code}　${item.name}`"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="批次">
          <el-select :disabled="pageFlag == 'edit'" v-model="batch">
            <el-option
              v-for="(item, index) in batchitems"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="团检分组">
          <el-select :disabled="pageFlag == 'edit'" v-model="group">
            <el-option
              v-for="(item, index) in groupitems"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 主体内容 -->
    <div class="subject">
      <!-- 主体左侧表格 -->
      <div class="s_left">
        <div class="title">基本信息</div>
        <el-radio-group v-model="status" size="mini">
          <el-radio-button :disabled="pageFlag == 'edit'" :label="0"
            >未结算</el-radio-button
          >
          <el-radio-button :disabled="pageFlag == 'add'" :label="1"
            >已结算</el-radio-button
          >
        </el-radio-group>
        <div class="mask" v-if="pageFlag == 'edit'"></div>
        <EasyTable
          height="100%"
          :data="staffData"
          class="staff_table"
          :tableOptions="staffOptions"
          :checkbox-config="{ fetch: true, rowClick: true }"
          @selected-change="handleSelectStaff"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0' }"
        />
      </div>
      <!-- 主体右侧操作盒子 -->
      <div class="s_right">
        <div class="title">结算选择</div>
        <!-- 结算方式 -->
        <div class="mode_box">
          <div class="mode_title">结算方式</div>
          <el-radio-group
            :disabled="pageFlag == 'edit'"
            @change="handleChangeSettleMode"
            v-model="settleMode"
          >
            <el-radio :label="0">登记结算</el-radio>
            <el-radio :label="2">总检结算</el-radio>
          </el-radio-group>
        </div>
        <!-- 结算列表 -->
        <EasyTable
          height="calc(100vh - 540px)"
          :data="settleModeData"
          class="staff_table"
          :tableOptions="settleModeOptions"
          :radio-config="{ fetch: true, rowClick: true }"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0' }"
        />
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
          <div class="message_itme">
            <div class="m_title">折扣</div>
            <div class="m_value">
              <el-input
                size="mini"
                v-model="discount"
                @keyup.native="handleInputChange"
                clearable
                :disabled="pageFlag == 'edit'"
              ></el-input>
            </div>
          </div>
          <div class="message_itme">
            <div class="m_title">折后费用</div>
            <div class="m_value">
              {{ Math.floor(discountTotal * 100) / 100 }}元
            </div>
          </div>
          <div class="message_itme">
            <div class="m_title">实际费用</div>
            <div class="m_value">
              <el-input
                size="mini"
                v-model="setactualtotal"
                clearable
                :disabled="pageFlag == 'edit'"
              ></el-input>
            </div>
          </div>
        </div>
        <!-- 结算说明 -->
        <div class="mode_explain">
          <div class="e_title">结算说明</div>
          <el-input
            class="explain"
            :disabled="pageFlag == 'edit'"
            type="textarea"
            resize="none"
            v-model="explain"
          ></el-input>
        </div>
        <!-- 操作按钮 -->
        <div class="page_btn">
          <el-button
            size="mini"
            type="primary"
            :disabled="pageFlag == 'add'"
            plain
            @click="handleCancelSettlement"
            >取消</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleSetSettlementCreate"
            :disabled="pageFlag == 'edit'"
            >结算</el-button
          >
        </div>
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
  setSettlDetail,
  setSettlCancel,
  getCalcPayMoney,
} from "@/api/companysettlement.js";
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
      pageFlag: "add", // 当前页面状态
      discount: 1, // 当前折扣 默认1
      searchForm: {}, // 筛选表单对象
      status: 0, // 当前操作状态 0未结算  1已结算
      staffTempData: [], // 人员列表数据存储
      staffData: [], // 人员列表数据
      settleMode: "", // 结算方式(0-登记结算 1-实检结算 2-总检结算)
      settleModePson: [], // 结算列表人员数据
      settleModeData: [], // 结算列表数据
      companyitems: [], // 公司列表数据
      company: "", // 选中公司单位
      batchitems: [], // 批次列表数据
      batch: "", // 选中批次号
      groupitems: [], // 分组列表数据
      group: "", // 选中分组
      setactualtotal: "", // 实收费用
      explain: "", // 结算说明
      setid: "", // 当前编辑数据流水号id
      selectSettlement: [], // 当前选中结算数据
      personnelTotal: 0, // 当前选中结算数据人数
      settotal: 0, // 当前选中结算数据价钱
    };
  },
  computed: {
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
          // returnVal: (value) => {
          //   return `${value * 100} %`;
          // },
        },
        {
          title: "折扣价格",
          prop: "discountprice",
        },
        {
          title: "小计",
          prop: "totalamount",
        },
      ];
    },
  },
  mounted() {
    this.pageFlag = this.addOrEdit;
    // 页面渲染加载数据
    this.handleGetCompanyList();
    if (this.pSetid != "") {
      this.setid = this.pSetid;
      this.status = 1;
      this.handleSetSettlDetail();
    } else {
      this.status = 0;
    }
  },

  methods: {
    // 勾选登记人计算结算金额回调
    handleGetCalcPayMoney() {
      let regiditems = this.selectSettlement.map((k) => {
        return k.regid;
      });
      getCalcPayMoney(regiditems).then((res) => {
        this.settleModeData = res.result.detailites;
        this.personnelTotal = res.result.settlementitem.personnelTotal;
        this.settotal = res.result.settlementitem.settotal;
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
        settotal: this.totalPrice,
        setdiscount: this.discount,
        setdiscounttotal: this.discountTotal,
        setactualtotal: this.setactualtotal,
        explain: this.explain,
      };
      setSettlementCreate({
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
      this.settleMode = "";
      this.company = "";
      this.setid = "";
      this.batch = "";
      this.group = "";
      this.explain = "";
    },
    // 获取详情回调
    handleSetSettlDetail() {
      setSettlDetail({ setid: this.setid }).then((res) => {
        let { settlementitem, customeritems, detailites } = res.result;
        this.staffData = customeritems;
        customeritems.forEach((k) => {
          this.settleModePson.push(k.regid);
        });
        this.settleModeData = detailites;
        this.settleMode = settlementitem.settlementtype;
        this.company = settlementitem.companycode;
        this.batch = settlementitem.batch;
        this.group = settlementitem.group || "";
        this.explain = settlementitem.explain;
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
      } else {
        this.staffData = this.staffTempData;
      }
    },
    // 输入框打折改变回调
    handleInputChange() {
      console.log(this.discount);
      if (+this.discount < 0 || +this.discount > 1) {
        this.$message.warning("折扣不能低于一折或高于10折!");
        this.discount = 1;
        return false;
      }
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
          this.staffTempData = res.result;
        }
      });
    },
    // 公司选中获取数据回调
    handleSelectCompany(data) {
      this.staffData = [];
      if (!data) {
        this.batch = "";
        this.group = "";
        return false;
      } else {
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
</style>