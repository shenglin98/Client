<template>
  <div class="details">
    <div class="subject">
      <!-- 基本信息 - 个人 -->
      <div class="customer_mess" v-if="category == 'Customer_register'">
        <div class="title">
          基本信息（个人）
          <el-button size="mini" type="primary" @click="handleCloseSonPage"
            >关闭</el-button
          >
        </div>
        <div class="cmconent">
          <el-row class="cmconent_row">
            <el-col :span="5">体检号：{{ pageObj.soureCode }}</el-col>
            <el-col :span="5">姓名：{{ pageObj.name }}</el-col>
            <el-col :span="4"
              >性别：{{
                pageObj.sex == 0
                  ? "未知"
                  : pageObj.sex == 1
                  ? "男"
                  : pageObj.sex == 2
                  ? "女"
                  : ""
              }}</el-col
            >
            <el-col :span="5">年龄：{{ pageObj.age }}</el-col>
            <el-col :span="5">门诊号：{{ pageObj.hiscode }}</el-col>
          </el-row>
          <el-row class="cmconent_row">
            <el-col :span="5">证件号：{{ pageObj.idcard }}</el-col>
            <el-col :span="5">登记日期：{{ pageObj.regdate }}</el-col>
            <el-col :span="5"
              >发票网址：<el-link
                type="primary"
                @click="handleJumpOpen(pageObj.inFileId)"
                >{{ pageObj.inFileId }}</el-link
              ></el-col
            >
          </el-row>
        </div>
      </div>
      <!-- 基本信息 - 单位 -->
      <div class="company_mess" v-else>
        <div class="title">
          基本信息（单位）<el-button
            size="mini"
            type="primary"
            @click="handleCloseSonPage"
            >关闭</el-button
          >
        </div>
        <div class="cmconent">
          <el-row class="cmconent_row">
            <el-col :span="4">结算编码：{{ pageObj.soureCode }}</el-col>
            <el-col :span="5">单位名称：{{ pageObj.companyname }}</el-col>
            <el-col :span="2">体检批次：{{ pageObj.batch }}</el-col>
            <el-col :span="4">结算人数：{{ pageObj.settlementcount }}</el-col>
            <el-col :span="9">体检时间段：{{ pageObj.checkdatespan }}</el-col>
          </el-row>
          <el-row class="cmconent_row">
            <el-col :span="5"
              >发票网址：<el-link
                type="primary"
                @click="handleJumpOpen(pageObj.inFileId)"
                >{{ pageObj.inFileId }}</el-link
              ></el-col
            >
          </el-row>
        </div>
      </div>
      <div class="invoicebox">
        <div
          class="invoice_item"
          v-for="(item, index) in pageObj.invoiceitems"
          :key="index"
        >
          <div class="iititle">票据信息（{{ item.invoicecode }}）</div>
          <div class="iimess">
            <el-row class="iimess_row">
              <el-col :span="5">原总金额：{{ item.totalprice }}</el-col>
              <el-col :span="5">支付总金额：{{ item.discountprice }}</el-col>
              <el-col :span="4">收费方式：{{ item.paymenttypeCN }}</el-col>
              <el-col :span="5">收费人：{{ item.chargename }}</el-col>
              <el-col :span="5">收费时间：{{ item.chargetime }}</el-col>
            </el-row>
          </div>
          <div class="iitable_box">
            <vxe-table
              class="iitable"
              ref="pageTable"
              height="auto"
              border="inner"
              :loading="loading"
              highlight-hover-row
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :data="item.invoicedetailitems"
              :checkbox-config="{ reserve: true, trigger: 'row' }"
              :sort-config="{ trigger: 'cell' }"
              :scroll-y="{ enabled: false }"
            >
              <vxe-table-column
                field="combinename"
                title="收费项目"
                min-width="250"
                sortable
              ></vxe-table-column>
              <vxe-table-column
                field="combinecode"
                title="收费项目编码"
                min-width="180"
                sortable
              ></vxe-table-column>
              <vxe-table-column
                field="deptname"
                title="所属科室"
                min-width="150"
                sortable
              ></vxe-table-column>
              <vxe-table-column
                field="price"
                title="原单价"
                min-width="150"
                sortable
              ></vxe-table-column>
              <vxe-table-column
                field="discountprice"
                title="折后价"
                min-width="180"
                sortable
              ></vxe-table-column>
              <vxe-table-column
                field="amount"
                title="数量"
                min-width="120"
                sortable
              ></vxe-table-column>
              <vxe-table-column
                field="chargetypeCN"
                title="发票类型"
                min-width="120"
                sortable
              ></vxe-table-column>
            </vxe-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { InvoiceBillDetail } from "@/api/invoicemanage.js";

export default {
  name: "",

  components: {},

  props: {
    category: {
      required: true,
      type: String,
    },
    code: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      loading: false,
      pageObj: {},
    };
  },

  mounted() {
    if (this.category && this.code) this.handleInvoiceBillDetail();
  },

  methods: {
    handleCloseSonPage() {
      this.$emit("close");
    },
    handleJumpOpen(url) {
      if (url) {
        window.open(url, "_blank");
      } else {
        this.$message.warning("未生成发票!");
      }
    },
    // 获取详情接口
    handleInvoiceBillDetail() {
      InvoiceBillDetail({
        category: this.category,
        code: this.code,
      }).then((res) => {
        if (!res.result) return;
        this.pageObj = res.result;
      });
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

  computed: {},
};
</script>
<style lang='scss' scoped>
.details {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .subject {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    .customer_mess,
    .company_mess {
      height: 130px;
      .title {
        height: 35px;
        background-color: #f6f7fc;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
      }
      .cmconent {
        padding-left: 10px;
        .cmconent_row {
          display: flex;
          align-items: center;
          height: 45px;
        }
      }
    }
    .invoicebox {
      height: calc(100% - 140px);
      overflow-y: auto;
      box-sizing: border-box;
      .invoice_item {
        height: 335px;
        margin-bottom: 20px;
        .iititle {
          height: 35px;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          padding-left: 10px;
        }
        .iimess {
          padding-left: 10px;
          height: 45px;
          .iimess_row {
            display: flex;
            align-items: center;
            height: 100%;
          }
        }
        .iitable_box {
          height: 250px;
          padding: 0 8px;
        }
      }
    }
  }
}
</style>