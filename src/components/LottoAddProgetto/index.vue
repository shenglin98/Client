<template>
  <div class="lottoAddProgetto">
    <el-dialog
      title="批量添加"
      class="page_dia"
      :visible.sync="dialogVisible"
      width="72%"
      :close-on-click-modal="false"
      @close="handleClosePage"
    >
      <div class="content">
        <div class="message_content">
          <el-form ref="form" :model="searchForm" label-width="40px">
            <el-row>
              <el-col :span="10">
                <el-form-item size="mini" label="名称">
                  <el-select
                    filterable
                    style="width: 100%"
                    clearable
                    @change="handleSelectComany"
                    v-model="searchForm.companycode"
                    placeholder=""
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
              <el-col :span="6">
                <el-form-item size="mini" label="批次">
                  <el-select
                    @change="handleSelectBatch"
                    style="width: 100%"
                    v-model="searchForm.batch"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in batchitems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="mini" label="分组">
                  <el-select
                    style="width: 100%"
                    v-model="searchForm.groupcode"
                    placeholder=""
                    clearable
                    @change="handleGetPersonList"
                  >
                    <el-option
                      v-for="item in groupitems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <el-button type="primary" size="mini" @click="handleGetPersonList"
            >搜 索</el-button
          > -->
          <!-- 体检项目 -->
        </div>
        <div class="table_box">
          <el-row>
            <el-col :span="4" class="people_box">
              <div class="table_title">人员列表</div>
              <div class="table_content">
                <vxe-table
                  ref="pageTable"
                  height="auto"
                  border="inner"
                  :loading="loading"
                  highlight-hover-row
                  :data="pageTableData"
                  :sort-config="{ trigger: 'cell' }"
                  @checkbox-change="handleSelectPeople"
                  @checkbox-all="handleSelectPeopleAll"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  row-id="regid"
                >
                  <vxe-table-column
                    type="checkbox"
                    width="40px"
                    :reserve-selection="true"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="name"
                    title="姓名"
                    width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                </vxe-table>
              </div>
            </el-col>
            <el-col :span="8" class="people_box">
              <div class="table_title">
                <el-input
                  ref="searchInput"
                  class="searchName"
                  size="mini"
                  placeholder="请输入组合名称"
                  v-model="searchName"
                  clearable
                >
                </el-input>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleSubmitCombine"
                  >确定</el-button
                >
              </div>
              <div class="table_content">
                <vxe-table
                  class="combine_table color_table"
                  ref="combine"
                  height="auto"
                  border="inner"
                  show-overflow
                  :loading="loading"
                  highlight-hover-row
                  highlight-current-row
                  :data="combineitemsData"
                  :checkbox-config="{ reserve: true }"
                  :sort-config="{ trigger: 'cell' }"
                  :keyboard-config="{ isArrow: true }"
                  @keydown="handleCombineTableKeyDown"
                  @cell-dblclick="handleSubmitCombine"
                  row-id="setmealcode"
                >
                  <!-- <vxe-table-column
                    field="combinecode"
                    title="组合编码"
                    width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column> -->
                  <vxe-table-column
                    field="combinename"
                    title="组合名称"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="price"
                    title="价格"
                    width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                </vxe-table>
              </div>
            </el-col>
            <el-col :span="11" class="select_box">
              <div class="table_title">已选项目</div>
              <div class="table_content">
                <vxe-table
                  ref="pageTable"
                  height="auto"
                  border="inner"
                  :loading="loading"
                  highlight-hover-row
                  :data="selectedTableData"
                  :sort-config="{ trigger: 'cell' }"
                  @checkbox-change="handleSelectPeople"
                  @checkbox-all="handleSelectPeopleAll"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                >
                  <vxe-table-column
                    field="combinecode"
                    title=""
                    width="50px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  >
                    <template v-slot="{ row }">
                      <i
                        class="el-icon-delete-solid"
                        style="cursor: pointer; color: #409eff"
                        @click="handleDelSelectedTableData(row)"
                      ></i>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="combinename"
                    title="组合名称"
                    min-width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="price"
                    title="价格"
                    width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="discount"
                    title="折扣"
                    width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  >
                    <template v-slot="{ row }">
                      <input
                        type="text"
                        :class="`discount_input discount_dia_${row.$index}`"
                        :max="1"
                        :min="0"
                        :disabled="row.discountflag === 1"
                        v-model.lazy="row.discount"
                        @focus="handleDiscountFocus"
                        @keyup.enter="handleDiscountLower(row, row.$index)"
                        @keyup.down="handleDiscountLower(row, row.$index)"
                        @keyup.up="handleDiscountUpper(row, row.$index)"
                        @change="handleChangeDiscount(row)"
                      />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="discountprice"
                    title="折后价"
                    width="100px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  >
                    <template v-slot="{ row }">
                      <span>{{ +row.discount * +row.price || 0 }}</span>
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </div>
              <div class="btn_group_bom">
                <el-button type="primary" size="mini" @click="handleSetDiscount"
                  >折 扣</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleAddLottoProgetto"
                  >确认添加</el-button
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!-- 折扣 -->
    <el-dialog
      class="dialog-mini discount_dialog"
      width="20%"
      top="20%"
      :close-on-click-modal="false"
      title="项目折扣"
      :visible.sync="showDiscount"
      @close="handleCloseDiscount"
    >
      <div class="discount_box">
        <el-input
          size="mini"
          placeholder="请输入折扣"
          max="100"
          min="1"
          v-model="discountValue"
          clearable
        >
        </el-input>
        <!-- <div>%</div> -->
      </div>
      <span slot="footer" class="dialog-footer history_table_footer">
        <el-button size="mini" type="primary" @click="handleConfirmDiscount"
          >确 认</el-button
        >
        <el-button size="mini" @click="handleCloseDiscount">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPersonalDetail,
  getBatchOrGroup,
  addCombine,
} from "@/api/personalregister.js";
import { getPrintOrderList } from "@/api/printorder.js";
import { getDicSetmealList } from "@/api/setMealDialog.js";
import * as users from "@/api/users";

export default {
  name: "",

  components: {},

  data() {
    return {
      dialogVisible: true,
      searchForm: {
        companycode: "",
        batch: "",
        groupcode: "",
      },
      showDiscount: false,
      discountValue: 1,
      companyitems: [],
      batchitems: [],
      groupitems: [],
      pageTableData: [],
      loading: false,
      selectPerson: [],
      searchName: "",
      combineitems: [],
      combineitemsData: [],
      selectedTableData: [],
      discountProperty: [],
    };
  },

  mounted() {
    this.handleGetDetail();
    // 项目加载获取表格数据
    this.handleGetDicSetmealList();
    this.handleGetUserPropertyValues();
  },

  methods: {
    handleAddLottoProgetto() {
      if (this.selectPerson.length == 0) {
        this.$message.warning("请先勾选需新增项目人员!");
        return false;
      }
      if (this.selectedTableData.length == 0) {
        this.$message.warning("请先勾选需新增项目!");
        return false;
      }
      let data = {
        personalflag: 1,
        regiditems: this.selectPerson,
        combineitems: this.selectedTableData,
      };
      addCombine(data).then((res) => {
        this.$message.success("操作成功!");
        this.$emit("submit"); // 发送数据父组件
      });
    },
    handleClosePage() {
      this.$emit("submit"); // 发送数据父组件
    },
    // 设置项目折扣弹框回调
    handleSetDiscount() {
      if (this.selectedTableData.length == 0) {
        this.$message.warning("请先添加体检项目!");
        return false;
      }
      this.discountValue = 1;
      // this.discountValue = this.groupTableData[0].discount * 100;
      this.showDiscount = true;
    },
    // 打折弹框确认回调
    handleConfirmDiscount() {
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        this.discountValue = 1;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+this.discountValue < min || +this.discountValue > max) {
          this.$message.warning("超出当前用户打折范围!");
          this.discountValue = 1;
          return false;
        }
      }
      this.selectedTableData.forEach((k) => {
        if (k.discountflag === 0) {
          k.discount = +this.discountValue;
        }
      });
      this.$message.success("操作成功!");
      this.handleCloseDiscount();
    },
    // 折扣弹框关闭回调
    handleCloseDiscount() {
      this.showDiscount = false;
    },
    handleDelSelectedTableData(row) {
      row.discount = 1;
      this.combineitems.push(row);
      this.combineitemsData.push(row);
      this.selectedTableData.forEach((k, i) => {
        if (k.combinecode === row.combinecode) {
          this.selectedTableData.splice(i, 1);
        }
      });
      //   重新组装建名
      this.selectedTableData = this.selectedTableData.map((k, i) => {
        return {
          ...k,
          $index: i,
        };
      });
    },
    handleGetUserPropertyValues() {
      let id = JSON.parse(localStorage.getItem("userId"));
      let ct = "DiscountProperty";
      users.getUserProperty({ id, ct }).then((res) => {
        if (!res.result) return;
        let resDis = res.result.filter((k) => {
          return k.category === ct;
        })[0];
        resDis && (this.discountProperty = resDis.propertyvalue.split("-"));
      });
    },
    handleChangeDiscount(row) {
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        row.discount = 1;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+row.discount < min || +row.discount > max) {
          this.$message.warning("超出当前用户打折范围!");
          row.discount = 1;
          return false;
        }
      }
      row.discountprice = +row.price * +row.discount;
    },
    // 单项打折键盘↓键回调
    handleDiscountLower(data, index) {
      this.$nextTick(() => {
        if (index === this.selectedTableData.length - 1) return;
        let add = 1;
        let pDom = document.querySelector(`.discount_dia_${index + add}`);
        if (!pDom) return;
        if ($(pDom).is(":disabled")) {
          for (let i = 0; i < this.selectedTableData.length; i++) {
            pDom = document.querySelector(`.discount_dia_${index + add}`);
            if ($(pDom).is(":disabled")) {
              ++add;
              continue;
            } else {
              if (!pDom) return;
              pDom.focus();
              break;
            }
          }
        } else {
          pDom.focus();
        }
      });
    },
    // 单项打折键盘↑键回调
    handleDiscountUpper(data, index) {
      this.$nextTick(() => {
        if (index === 0) return;
        let add = 1;
        let pDom = document.querySelector(`.discount_dia_${index - add}`);
        if (!pDom) return;
        if ($(pDom).is(":disabled")) {
          for (let i = add; i < this.selectedTableData.length; i++) {
            pDom = document.querySelector(`.discount_dia_${index - add}`);
            if ($(pDom).is(":disabled")) {
              ++add;
              continue;
            } else {
              if (!pDom) return;
              pDom.focus();
              break;
            }
          }
        } else {
          pDom.focus();
        }
      });
    },
    // 表格键盘触发事件
    handleCombineTableKeyDown({ $event }) {
      if ($event.keyCode !== 13) return;
      this.handleSubmitCombine();
    },
    // 点击确认选中回调
    handleSubmitCombine() {
      if (!this.$refs.combine.getCurrentRecord()) {
        this.$message.warning("请先选中组合再进行保存!");
        return false;
      }
      let item = this.$refs.combine.getCurrentRecord();
      let data = [
        {
          detid: "",
          regid: "",
          setmealcode: "",
          setmealname: "",
          combinecode: item.combinecode,
          combinename: item.combinename,
          deptcode: item.deptcode,
          deptname: item.deptname,
          operatorname: this.name,
          operatordate: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 16)
            .replace("T", " "),
          price: item.price || 0,
          discount: item.discount || 1,
          discountprice: item.discountprice || item.price || 0,
          deptseqno: item.deptseqno || 0,
          discountflag: item.discountflag,
        },
      ];
      this.selectedTableData.push(...data);
      this.selectedTableData = this.selectedTableData.map((k, i) => {
        return {
          ...k,
          $index: i,
        };
      });
      //   this.$emit("submit", [data, "combine"]); // 发送数据父组件
      this.searchName = "";
      this.combineitems.forEach((k, i) => {
        if (k.combinecode === item.combinecode) {
          this.combineitems.splice(i, 1);
        }
      });
      this.combineitemsData.forEach((k, i) => {
        if (k.combinecode === item.combinecode) {
          this.combineitemsData.splice(i, 1);
        }
      });
      // 选中第一行
      this.combineitems.length > 0 &&
        this.$refs.combine.setCurrentRow(this.combineitems[0]);
      // this.$refs.combine.scrollTo(0, 30);
      setTimeout(() => {
        // 滚动到顶部
        this.$refs.combine.$refs.tableBody.$el.scrollTop = 0;
      }, 100);
    },
    handleSelectPeople({ records }) {
      let arr = records.map((k) => {
        return k.regid;
      });
      this.selectPerson = arr;
    },
    handleSelectPeopleAll({ records }) {
      let arr = records.map((k) => {
        return k.regid;
      });
      this.selectPerson = arr;
    },
    // 获取列表数据回调
    handleGetPersonList() {
      // 处理printflag打印状态参数
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
      getPrintOrderList({
        whereitems,
        page: 1,
        limit: 100000,
      })
        .then((res) => {
          this.pageTableData = res.data.customeritems;
          this.loading = false;
        })
        .catch((err) => {
          this.pageTableData = [];
          this.loading = false;
        });
    },
    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.sex, gp: "1" }).then((res) => {
        this.loading = false;
        if (!res.result) return;
        let data = res.result.combineitems;
        this.combineitems = data;
        this.combineitemsData = [...this.combineitems];
        setTimeout(() => {
          this.$refs.searchInput.focus();
          //   默认选中第一行
          this.$refs.combine.setCurrentRow(this.combineitems[0]);
        }, 500);
      });
    },
    // 下拉改变单位选择值回调
    handleSelectComany(val) {
      if (!val) {
        this.searchForm.batch = "";
        this.searchForm.groupcode = "";
        return false;
      }
      let data = this.companyitems.filter((k) => k.code == val)[0];
      if (data) this.searchForm.companyname = data.name;
      this.hadnleGetBatchOrGroup();
    },
    // 下拉选中批次号触发回调
    handleSelectBatch(val) {
      let data = this.batchitems.filter((k) => k.code == val)[0];
      if (data) {
        this.groupitems = Object.assign([], data.groupitems);
      }
    },
    handleDiscountFocus(e) {
      if (!e) return;
      e.currentTarget && e.currentTarget.select();
    },
    // 获取团检批次和分组回调
    hadnleGetBatchOrGroup() {
      getBatchOrGroup({
        companycode: this.searchForm.companycode,
      })
        .then((res) => {
          let { batchitems, groupitems } = res.result;
          this.batchitems = batchitems;
          let batch = batchitems.filter((k) => k.selected)[0] || batchitems[0];
          batch && (this.searchForm.batch = batch.code);
          this.groupitems = batch.groupitems;
          this.handleGetPersonList();
        })
        .catch((err) => {});
    },
    // 新增获取个人登记明细/详情/新增回调
    handleGetDetail() {
      getPersonalDetail().then((res) => {
        let { companyitems } = res.result;
        this.companyitems = companyitems;
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

  watch: {
    searchName: {
      handler: function (n, o) {
        let filterData = this.combineitems.filter((data) => {
          return Object.keys(data).some((key) => {
            let returnArr = ["price", "deptseqno", "discountflag", "viewgroup"];
            let containArr = ["combinename", "combinepy", "combinewb"];
            let equalArr = ["combinecode"];
            if (returnArr.includes(key)) return;
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(n.toLowerCase()) > -1
              );
            }
            if (equalArr.includes(key)) {
              return (
                String(data[key]).toLowerCase() ===
                this.searchName.toLowerCase()
              );
            }
          });
        });
        if (filterData && filterData.length) {
          this.combineitemsData = filterData;
          //   默认选中第一行
          this.$refs.combine.setCurrentRow(filterData[0]);
        } else {
          this.combineitemsData = [];
        }
      },
      immediate: true,
    },
  },

  computed: {},
};
</script>
<style lang='scss' scoped>
// @import url("./css/index.scss");
.lottoAddProgetto {
  .page_dia {
    /deep/.el-dialog__header,
    /deep/.el-dialog__body {
      padding: 8px;
    }
    /deep/.el-dialog__body {
      .message_content {
        width: 68%;
        height: 34px;
        display: flex;
        align-items: center;
        .el-row {
          display: flex;
          justify-content: space-between;
          .el-form-item {
            margin-bottom: 0px;
          }
        }
      }
      .table_box {
        margin: 0;
        height: 600px;
        .el-row {
          height: 100%;
          display: flex;
          justify-content: space-between;
          .discount_input {
            width: 100%;
            height: 28px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            outline: none;
            background-color: #fff;
          }
          .discount_input:focus {
            border: 1px solid #0076c8;
          }
          .people_box {
            .table_title {
              height: 35px;
              font-size: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .table_content {
              height: calc(100% - 35px);
            }
          }
          .select_box {
            .table_title {
              height: 35px;
              font-size: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .table_content {
              height: calc(100% - 72px);
            }
            .btn_group_bom {
              margin-top: 5px;
              height: 32px;
              text-align: center;
            }
          }
          .el-col {
            height: 100%;
          }
          /*vxe-table 自定义行高 */
          .vxe-table .vxe-body--column.col--ellipsis {
            height: 36px;
          }
          .vxe-table .vxe-body--column:not(.col--ellipsis),
          .vxe-table .vxe-footer--column:not(.col--ellipsis),
          .vxe-table .vxe-header--column:not(.col--ellipsis) {
            padding: 5px 0;
            height: 36px;
          }
          /*修改表头背景色*/
          .vxe-table--header-wrapper,
          .vxe-header--row,
          .vxe-table--header {
            background-color: #d0ddeb;
            padding: 0px 0;
          }
          /*调整表格行高*/
          .vxe-table .vxe-body--column:not(.col--ellipsis),
          .vxe-table .vxe-footer--column:not(.col--ellipsis),
          .vxe-table .vxe-header--column:not(.col--ellipsis) {
            padding: 0px 0;
          }
          /*vxe-table 自定义行高 */
          .vxe-table .vxe-body--column.col--ellipsis {
            height: 30px;
          }
          .vxe-table .vxe-body--column:not(.col--ellipsis),
          .vxe-table .vxe-footer--column:not(.col--ellipsis),
          .vxe-table .vxe-header--column:not(.col--ellipsis) {
            padding: 5px 0;
            height: 30px;
          }
        }
      }
    }
  }
}
</style>