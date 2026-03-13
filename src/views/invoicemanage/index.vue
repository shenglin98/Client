<template>
  <div class="invoicemanage">
    <div class="subject" v-if="showPage">
      <div class="search_box">
        <el-form ref="form" :model="searchForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input
              size="mini"
              style="width: 110px"
              v-model="searchForm.name"
              @keyup.enter.native="handleInvoiceBillLoad"
            ></el-input>
          </el-form-item>
          <el-form-item label="门诊号">
            <el-input
              size="mini"
              style="width: 110px"
              v-model="searchForm.hiscode"
              @keyup.enter.native="handleInvoiceBillLoad"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证">
            <el-input
              size="mini"
              style="width: 200px"
              v-model="searchForm.idcard"
              @keyup.enter.native="handleInvoiceBillLoad"
            ></el-input>
          </el-form-item>
          <el-form-item label="来源">
            <el-select
              size="mini"
              style="width: 80px"
              v-model="searchForm.soureCategory"
              @change="handleInvoiceBillLoad"
            >
              <el-option label="个人" value="Customer_register"></el-option>
              <el-option label="单位" value="Company_register"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源编码">
            <el-input
              size="mini"
              style="width: 140px"
              v-model="searchForm.soureCode"
              @keyup.enter.native="handleInvoiceBillLoad"
            ></el-input>
          </el-form-item>
          <el-form-item label="开票日期">
            <el-date-picker
              size="mini"
              style="width: 250px"
              v-model="searchdate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleChangeSearchdate"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <!-- 按钮组 -->
        <permission-btn
          class="btn_group"
          moduleName="customerResult"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <!-- 主体表格 -->
      <div class="page_table_box">
        <div class="table_box">
          <vxe-table
            class="pagetable"
            ref="pageTable"
            height="auto"
            border="inner"
            :loading="loading"
            highlight-hover-row
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :data="pagetableData"
            :checkbox-config="{ reserve: true, trigger: 'row' }"
            :sort-config="{ trigger: 'cell' }"
            :scroll-y="{ enabled: false }"
            @checkbox-change="handleSelectData"
            @checkbox-all="handleSelectDataAll"
          >
            <vxe-table-column
              type="checkbox"
              width="45"
              :reserve-selection="true"
            ></vxe-table-column>
            <vxe-table-column
              field="name"
              title="开票人"
              min-width="115"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="soureCategoryCN"
              title="来源"
              min-width="115"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="soureCode"
              title="来源编码"
              min-width="140"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="billNo"
              title="发票代码"
              min-width="140"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="companyName"
              title="发票抬头"
              min-width="180"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="taxNumber"
              title="税务号"
              min-width="140"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="billCreatetime"
              title="生成时间"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="invoiceCount"
              title="单据数量"
              min-width="100"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="invoiceMoney"
              title="开票金额"
              min-width="120"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="billRandom"
              title="发票检验码"
              show-overflow
              min-width="140"
            ></vxe-table-column>
            <vxe-table-column
              field="remark"
              title="备注"
              show-overflow="tooltip"
              min-width="250"
            ></vxe-table-column>
            <vxe-table-column
              field="name"
              title="操作"
              min-width="150"
              sortable
            >
              <template slot-scope="scope">
                <el-link
                  type="success"
                  style="margin-right: 10px"
                  @click.stop="handleCheckDetails(scope.row)"
                  >详情</el-link
                >
                <el-link
                  v-if="scope.row.billNo"
                  type="primary"
                  @click.stop="handlePrintPayInvoice(scope.row.inFileId)"
                  >打印发票</el-link
                >
                <el-link
                  type="warning"
                  v-else
                  :disabled="notGenerate"
                  @click.stop="handleGeneBill(scope.row)"
                  >生成发票</el-link
                >
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <el-pagination
          :pager-count="5"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 500, 1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>
    <Details
      v-else
      :category="category"
      :code="code"
      @close="handleCloseDetails"
    />
    <el-dialog
      title="修改发票抬头"
      :visible.sync="showEditInvoiceTitle"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      class="dia_invoicetitle"
    >
      <div class="invoicetitle_content">
        <el-form
          ref="editintiForm"
          :model="editintiForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item size="mini" label="单位名称：" prop="CompanyName">
            <el-select
              v-model="editintiForm.CompanyName"
              style="width: 100%"
              clearable
              filterable
              allow-create
              @change="handleChangeCompanyName"
            >
              <el-option
                v-for="item in companyNameItems"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" label="税号：" prop="TaxNumber">
            <el-input v-model="editintiForm.TaxNumber" clearable></el-input>
          </el-form-item>
          <el-form-item size="mini" label="电话：">
            <el-input v-model="editintiForm.TelePhone" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleResetEditintiForm"
          >取 消</el-button
        >
        <el-button
          size="mini"
          :loading="loadEditbtn"
          type="primary"
          @click="handleSaveInvoiceTitle"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import {
  InvoiceBillLoad,
  UpdateInvoiceTitle,
  LoadInvoiceRise,
  GeneBill,
} from "@/api/invoicemanage.js";
// 添加编辑子组件
import Details from "./components/details.vue";
export default {
  name: "invoicemanage",

  components: { Sticky, permissionBtn, Details },

  data() {
    return {
      searchForm: {
        soureCategory: "Customer_register",
        soureCode: "",
        startcreatetime: "",
        endcreatetime: "",
        name: "",
        hiscode: "",
        idcard: "",
      },
      searchdate: [],
      pagetableData: [],
      selectData: [],
      loading: false,
      showPage: true,
      category: "",
      code: "",
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      showEditInvoiceTitle: false,
      editintiForm: {
        InvoiceBillCode: "",
        CompanyName: "",
        TaxNumber: "",
        TelePhone: "",
      },
      rules: {
        CompanyName: [
          { required: true, message: "请选择单位名称", trigger: "change" },
        ],
        TaxNumber: [{ required: true, message: "请填写税号", trigger: "blur" }],
      },
      companyNameItems: [],
      notGenerate: false,
      loadEditbtn: false,
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  mounted() {
    this.handleInvoiceBillLoad();
  },

  methods: {
    // 生成发票
    handleGeneBill(row) {
      if (!row) return;
      this.notGenerate = true;
      this.$message.success(`正在处理中!`);
      GeneBill({ invoiceBillCode: row.invoiceBillCode })
        .then((res) => {
          this.$message.success(res.message);
          this.handleInvoiceBillLoad();
          this.notGenerate = false;
        })
        .catch((err) => {
          this.notGenerate = false;
        });
    },
    // 改变选中抬头回调
    handleChangeCompanyName(val) {
      if (val) {
        let index = this.companyNameItems.findIndex((k) => k.id === val);
        if (index > -1) {
          this.editintiForm.CompanyName =
            this.companyNameItems[index].companyName;
          this.editintiForm.TaxNumber = this.companyNameItems[index].taxNumber;
          this.editintiForm.TelePhone = this.companyNameItems[index].telephone;
        }
      }
    },
    // 点击保存编辑发票抬头
    handleSaveInvoiceTitle() {
      this.$refs["editintiForm"].validate((valid) => {
        if (valid) {
          this.loadEditbtn = true;
          UpdateInvoiceTitle(this.editintiForm)
            .then((res) => {
              this.loadEditbtn = false;
              this.$message.success(res.message);
              this.handleResetEditintiForm();
              this.handleInvoiceBillLoad();
            })
            .catch((err) => {
              this.loadEditbtn = false;
            });
        }
      });
    },
    // 获取单位下拉数据
    handleLoadInvoiceRise() {
      LoadInvoiceRise().then((res) => {
        if (!res.data) return;
        this.companyNameItems = res.data;
      });
    },
    // 清空编辑抬头表单
    handleResetEditintiForm() {
      this.editintiForm = {
        InvoiceBillCode: "",
        CompanyName: "",
        TaxNumber: "",
        TelePhone: "",
      };
      this.$refs["editintiForm"].resetFields();
      this.showEditInvoiceTitle = false;
    },
    // 修改发票抬头回调
    handleUpdateInvoiceTitle(item) {
      if (!item) return;
      this.editintiForm.InvoiceBillCode = item.invoiceBillCode;
      LoadInvoiceRise()
        .then((res) => {
          // if (!res.data) return;
          this.companyNameItems = res.data || [];
          this.showEditInvoiceTitle = true;
        })
        .catch((err) => {
          this.showEditInvoiceTitle = true;
        });
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleInvoiceBillLoad();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleInvoiceBillLoad();
    },
    // 关闭详情
    handleCloseDetails() {
      this.category = "";
      this.code = "";
      this.showPage = true;
    },
    // 查看详情
    handleCheckDetails(row) {
      if (!row) return;
      this.category = row.soureCategory;
      this.code = row.soureCode;
      this.selectData = [];
      this.showPage = false;
    },
    // 打印发票
    handlePrintPayInvoice(url) {
      if (url) {
        window.open(url, "_blank");
      } else {
        this.$message.warning("未生成发票!");
      }
    },
    // 获取列表数据
    handleInvoiceBillLoad() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] != "") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      InvoiceBillLoad({
        whereitems,
        page: this.currentPage,
        limit: this.pageSize,
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.count = 0;
            this.pagetableData = [];
            return;
          }
          this.count = res.count;
          this.pagetableData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 切换时间
    handleChangeSearchdate(date) {
      if (date) {
        this.searchForm.startcreatetime = date[0];
        this.searchForm.endcreatetime = date[1];
      } else {
        this.searchForm.startcreatetime = "";
        this.searchForm.endcreatetime = "";
      }
      this.handleInvoiceBillLoad();
    },
    // 勾选人员回调
    handleSelectData({ records }) {
      this.selectData = records;
    },
    // 勾选人员回调-全选
    handleSelectDataAll({ records }) {
      this.selectData = records;
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 搜索
          this.handleInvoiceBillLoad();
          break;
        case "btnRefresh": // 刷新
          this.handleInvoiceBillLoad();
          break;
        case "btnCheck": // 查看
          if (this.selectData.length != 1) {
            this.$message.warning("请先选中一条数据进行查看!");
            return;
          }
          this.handleCheckDetails(this.selectData[0]);
          break;
        case "btnEditCompanyName": // 修改发票抬头
          if (this.selectData.length != 1) {
            this.$message.warning("请先选中一条数据进行编辑!");
            return;
          }
          this.handleUpdateInvoiceTitle(this.selectData[0]);
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
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
.invoicemanage {
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
      height: 50px;
      background-color: #f6f7fc;
      box-sizing: border-box;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-form {
        display: flex;
        .el-form-item {
          margin: 0;
        }
      }
    }
    .page_table_box {
      height: calc(100% - 60px);
      .table_box {
        height: calc(100% - 40px);
      }
      .el-pagination {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .dia_invoicetitle {
    /deep/.el-dialog__header {
      padding: 10px;
    }
    /deep/.el-dialog__body {
      padding: 0 10px;
      .invoicetitle_content {
      }
    }
    /deep/.el-dialog__footer {
      text-align: center;
      padding: 10px;
    }
  }
}
</style>