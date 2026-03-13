<template>
  <div class="invoicemanage">
    <div class="subject" v-if="showPage">
      <div class="search_box">
        <el-form ref="form" :model="searchForm" label-width="80px">
          <el-form-item label="操作人">
            <el-select
              size="mini"
              v-model="searchForm.operatorcode"
              clearable
              @clear="handleInvoiceBillLoad"
              @change="handleInvoiceBillLoad"
            >
              <el-option
                v-for="item in operatorItems"
                size="mini"
                :key="item.id"
                :label="item.name"
                :value="item.account"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              size="mini"
              style="width: 300px"
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
            :tooltip-config="{
              showAll: true,
              contentMethod: showTooltipMethod,
            }"
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
              field="operatordate"
              title="结算时间"
              min-width="180"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="operatorcode"
              title="操作人编码"
              min-width="120"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="operatorname"
              title="操作人姓名"
              min-width="120"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="xjsf"
              title="现金收费金额"
              min-width="130"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="xjzf"
              title="现金作费金额"
              min-width="130"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="xjch"
              title="现金冲红金额"
              min-width="130"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="wxxxsf"
              title="微信线下收费金额"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="wxxxzf"
              title="微信线下作费金额"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="wxxxch"
              title="微信线下冲红金额"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="wxxSSF"
              title="微信线上收费金额"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="wxxSZF"
              title="微信线上作费金额"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="wxxACH"
              title="微信线上冲红金额"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="fpsfzs"
              title="发票收费张数"
              min-width="130"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="fpzfzs"
              title="发票作废张数"
              min-width="130"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="fpchzs"
              title="发票冲红张数"
              min-width="130"
              sortable
            ></vxe-table-column>
            <!-- <vxe-table-column
              field="fpsfzshd"
              title="发票收费张数号段"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="fpzfzshd"
              title="发票作废张数号段"
              min-width="165"
              sortable
            ></vxe-table-column>
            <vxe-table-column
              field="fpchzshd"
              title="发票冲红张数号段"
              min-width="165"
              sortable
            ></vxe-table-column> -->
            <vxe-table-column
              field="status"
              title="状态"
              min-width="150"
              sortable
            >
              <template slot-scope="scope">
                {{ scope.row.status == 0 ? "未日结" : "已日结" }}
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
  </div>
</template>
  <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import { InvoiceStaticsList } from "@/api/invoicemanage.js";
import { getAllUser } from "@/api/customermanage.js";
import { EverydayStatics } from "@/api/personalcharge.js";
import { printStaticsBase64 } from "@/api/printreport.js";

export default {
  name: "invoicemanage",

  components: { Sticky, permissionBtn },

  data() {
    return {
      searchForm: {
        operatorcode: "",
        operatordatestart: "",
        operatordateend: "",
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
      operatorItems: [],
      usernameOrId: "",
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  mounted() {
    getAllUser().then((res) => {
      this.operatorItems = res.data;
    });
    this.handleInvoiceBillLoad();
  },

  methods: {
    showTooltipMethod({ type, column, row, items, _columnIndex }) {
      if (column.title == "发票收费张数") {
        return column.title ? row.fpsfzshd : "";
      }
      if (column.title == "发票作废张数") {
        return column.title ? row.fpzfzshd : "";
      }
      if (column.title == "发票冲红张数") {
        return column.title ? row.fpchzshd : "";
      }
      return null;
    },
    // 日结打印
    handlePrintInvoice(item) {
      EverydayStatics({
        whereitems: [
          {
            key: "account",
            value: item.operatorcode,
          },
          {
            key: "staticdate",
            value: item.operatordate,
          },
        ],
      }).then((res) => {
        if (res.result) {
          let data = {
            repname: "收费员日报表",
            whereitems: [
              {
                key: "account",
                value: item.operatorcode,
              },
              {
                key: "startTime",
                value: item.operatordate,
              },
              {
                key: "endTime",
                value: item.operatordate,
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
      InvoiceStaticsList({
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
        this.searchForm.operatordatestart = date[0];
        this.searchForm.operatordateend = date[1];
      } else {
        this.searchForm.operatordatestart = "";
        this.searchForm.operatordateend = "";
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
        case "btnPrint": // 日结打印
          if (this.selectData.length == 0 || this.selectData.length > 1) {
            this.$message.warning("请选中单挑打印数据!");
            return;
          }
          this.handlePrintInvoice(this.selectData[0]);
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
}
</style>