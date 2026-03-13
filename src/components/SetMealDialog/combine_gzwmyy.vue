<template>
  <div class="setmeal_dialog">
    <!-- 主体套餐弹框 -->
    <el-dialog
      class="page_dialog"
      title="组合选择"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseCombine"
    >
      <div class="top_box">
        <el-input
          ref="searchInput"
          class="searchName"
          placeholder="请输入套餐名称"
          v-model="searchName"
          clearable
          @keydown.down.native="handleSearchKeyDown"
          @keydown.up.native="handleSearchKeyUp"
          @keydown.enter.native="handleSubmitCombine"
        >
        </el-input>
        <div class="btn_group">
          <el-button type="primary" @click="handleSubmitCombine"
            >确定</el-button
          >
          <el-button type="danger" @click="handleCloseCombine">取消</el-button>
        </div>
      </div>
      <div class="table_box">
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
          <vxe-table-column
            type="seq"
            title="行号"
            width="60"
          ></vxe-table-column>
          <vxe-table-column
            field="combinecode"
            title="组合编码"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="combinename"
            title="组合名称"
            min-width="180px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="deptname"
            title="科室"
            width="100px"
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
            field="sex"
            title="性别"
            width="80px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          >
            <template v-slot="{ row }">
              <span>{{
                row.sex == 0 ? "未知" : row.sex == 1 ? "男" : "女"
              }}</span>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </el-dialog>
  </div>
</template>
  <script>
import {
  getDicSetmealList,
  getTemplateList,
  setTemplateAddorUpdate,
  setTemplateDelete,
} from "@/api/setMealDialog.js";
import { mapGetters } from "vuex";

export default {
  name: "",

  components: {},
  props: {
    groupTableData: {
      type: Array,
      required: true,
    },
    flag: {
      type: String,
    },
    sex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      combineitems: [],
      combineitemsData: [],
      dialogVisible: true, // 显示项目弹框
      searchName: "",
    };
  },
  computed: {
    ...mapGetters(["name", "id"]),
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

  created() {},

  mounted() {
    // 项目加载获取表格数据
    this.handleGetDicSetmealList();
  },

  methods: {
    // 输入框键盘向下选中项
    handleSearchKeyDown() {
      let current = this.$refs.combine.getCurrentRecord();
      if (!current) return;
      let index = this.combineitemsData.findIndex(
        (k) => k.combinecode === current.combinecode
      );
      if (index === -1) return;
      //   选中下一行
      if (index == this.combineitemsData.length - 1) {
        this.$refs.combine.setCurrentRow(this.combineitemsData[0]);
      } else {
        this.$refs.combine.setCurrentRow(this.combineitemsData[index + 1]);
      }
      setTimeout(() => {
        if (index == this.combineitemsData.length - 1) {
          let container = this.$refs.combine.$el.querySelector(
            ".vxe-table--body-wrapper"
          );
          container.scrollTop = 0;
        } else {
          this.$refs.combine.scrollTo(0, 30 * index + 3);
        }
        // this.$refs.setmealitemsData.$el.querySelector('.vxe-table--body-wrapper').scrollTo(0, posY)
      }, 500);
    },
    // 输入框键盘向上选中项
    handleSearchKeyUp() {
      let current = this.$refs.combine.getCurrentRecord();
      if (!current) return;
      let index = this.combineitemsData.findIndex(
        (k) => k.combinecode === current.combinecode
      );
      if (index === -1) return;
      //   选中下一行
      if (index == 0) {
        this.$refs.combine.setCurrentRow(
          this.combineitemsData[this.combineitemsData.length - 1]
        );
      } else {
        this.$refs.combine.setCurrentRow(this.combineitemsData[index - 1]);
      }
      setTimeout(() => {
        if (index == 0) {
          let container = this.$refs.combine.$el.querySelector(
            ".vxe-table--body-wrapper"
          );
          container.scrollTop = container.scrollHeight;
        } else {
          this.$refs.combine.scrollTo(0, 30 * index - 90);
        }
        // this.$refs.setmealitemsData.$el.querySelector('.vxe-table--body-wrapper').scrollTo(0, posY)
      }, 500);
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
          price: item.originalprice || item.price || 0,
          discount: item.discount || 1,
          discountprice: item.discountprice || item.price || 0,
          deptseqno: item.deptseqno || 0,
        },
      ];
      this.$emit("submit", [data, "combine"]); // 发送数据父组件
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
    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.sex, gp: "1" }).then((res) => {
        this.loading = false;
        if (!res.result) return;
        let data = [];
        if (this.groupTableData.length > 0) {
          this.groupTableData.forEach((val, index) => {
            res.result.combineitems.forEach((k, i) => {
              if (val.combinecode === k.combinecode) {
                res.result.combineitems.splice(i, 1);
              }
            });
          });
        }
        data = res.result.combineitems;
        this.combineitems = data;
        this.combineitemsData = [...this.combineitems];
        setTimeout(() => {
          this.$refs.searchInput.focus();
          //   默认选中第一行
          this.$refs.combine.setCurrentRow(this.combineitems[0]);
        }, 500);
      });
    },
    // 关闭套餐选择弹框回调
    handleCloseCombine() {
      this.$emit("close", "combine");
    },
  },
};
</script>
<style lang='scss'>
.el-message-box__wrapper {
  z-index: 9999 !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.color_table .row-high-color {
  background-color: #81d3f8;
  // background-color: #e6f7ff;
}
.zzXindex {
  z-index: 999999 !important;
}
.disable_row {
  position: relative;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    cursor: not-allowed;
    z-index: 66;
  }
}
.top_box {
  height: 35px;
  display: flex;
  .btn_group {
    display: flex;
    width: 150px;
  }
  .searchName {
    width: calc(100% - 150px);
    height: 100%;
    margin-right: 10px;
    .el-input__inner {
      height: 100%;
    }
  }
}
.table_box {
  margin-top: 12px;
  height: 450px;
  .vxe-table--header-wrapper {
    background-color: #d0ddeb !important;
  }
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
</style>
  <style lang='scss' scoped>
@import "./css/index_qyzyy.scss";
</style>