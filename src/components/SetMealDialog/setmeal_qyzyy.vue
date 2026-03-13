<template>
  <div class="setmeal_dialog">
    <!-- 主体套餐弹框 -->
    <el-dialog class="page_dialog" title="套餐选择" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleCloseSetMeal">
      <div class="top_box">
        <el-input ref="searchInput" class="searchName" placeholder="请输入套餐名称" v-model="searchName" clearable @keydown.down.native="handleSearchKeyDown" @keydown.up.native="handleSearchKeyUp" @keydown.enter.native="handleSubmitSetMeal">
        </el-input>
        <div class="btn_group">
          <el-button type="primary" @click="handleSubmitSetMeal">确定</el-button>
          <el-button type="danger" @click="handleCloseSetMeal">取消</el-button>
        </div>
      </div>
      <div class="table_box">
        <vxe-table class="setMeal_table color_table" ref="setMeal" height="auto" border="inner" show-overflow :loading="loading" highlight-hover-row highlight-current-row :data="setmealitemsData" :checkbox-config="{ reserve: true }" :sort-config="{ trigger: 'cell' }" @keydown="handleSetMealTableKeyDown" @cell-dblclick="handleSubmitSetMeal" row-id="setmealcode">
          <!-- 开启键盘移动 :keyboard-config="{ isArrow: true }" -->
          <vxe-table-column type="seq" title="行号" width="60"></vxe-table-column>
          <vxe-table-column field="setmealcode" title="套餐编码" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="setmealname" title="套餐名称" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="price" title="价格" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="companyprice" title="单位价格" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="sex" title="性别" width="80px" show-header-overflow show-overflow="title" show-footer-overflow>
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
      setmealitems: [],
      setmealitemsData: [],
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
        let filterData = this.setmealitems.filter((data) => {
          return Object.keys(data).some((key) => {
            let returnArr = [
              "price",
              "sex",
              "companyprice",
              "combineitems",
              "setmealtyp",
            ];
            let containArr = ["setmealname", "setmealpx", "setmealwb"];
            let equalArr = ["setmealcode", "settype"];
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
          this.setmealitemsData = filterData;
          //   默认选中第一行
          this.$refs.setMeal.setCurrentRow(filterData[0]);
        } else {
          this.setmealitemsData = [];
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
      let current = this.$refs.setMeal.getCurrentRecord();
      if (!current) return;
      let index = this.setmealitemsData.findIndex(
        (k) => k.setmealcode === current.setmealcode
      );
      if (index === -1) return;
      //   选中下一行
      if (index == this.setmealitemsData.length - 1) {
        this.$refs.setMeal.setCurrentRow(this.setmealitemsData[0]);
      } else {
        this.$refs.setMeal.setCurrentRow(this.setmealitemsData[index + 1]);
      }
      setTimeout(() => {
        if (index == this.setmealitemsData.length - 1) {
          let container = this.$refs.setMeal.$el.querySelector(
            ".vxe-table--body-wrapper"
          );
          container.scrollTop = 0;
        } else {
          this.$refs.setMeal.scrollTo(0, 30 * index + 3);
        }
        // this.$refs.setmealitemsData.$el.querySelector('.vxe-table--body-wrapper').scrollTo(0, posY)
      }, 500);
    },
    // 输入框键盘向上选中项
    handleSearchKeyUp() {
      let current = this.$refs.setMeal.getCurrentRecord();
      if (!current) return;
      let index = this.setmealitemsData.findIndex(
        (k) => k.setmealcode === current.setmealcode
      );
      if (index === -1) return;
      //   选中下一行
      if (index == 0) {
        this.$refs.setMeal.setCurrentRow(
          this.setmealitemsData[this.setmealitemsData.length - 1]
        );
      } else {
        this.$refs.setMeal.setCurrentRow(this.setmealitemsData[index - 1]);
      }
      setTimeout(() => {
        if (index == 0) {
          let container = this.$refs.setMeal.$el.querySelector(
            ".vxe-table--body-wrapper"
          );
          container.scrollTop = container.scrollHeight;
        } else {
          this.$refs.setMeal.scrollTo(0, 30 * index - 90);
        }
        // this.$refs.setmealitemsData.$el.querySelector('.vxe-table--body-wrapper').scrollTo(0, posY)
      }, 500);
    },
    // 表格键盘触发事件
    handleSetMealTableKeyDown({ $event }) {
      if ($event.keyCode !== 13) return;
      this.handleSubmitSetMeal();
    },
    // 点击确认选中回调
    handleSubmitSetMeal() {
      if (!this.$refs.setMeal.getCurrentRecord()) {
        this.$message.warning("请先选中套餐再进行保存!");
        return false;
      }
      let chooseMeal = this.$refs.setMeal.getCurrentRecord();
      if (chooseMeal.combineitems.length === 0) {
        this.$message.warning("该套餐暂无组合!");
        return false;
      }
      let data = chooseMeal.combineitems.map((item) => {
        return {
          detid: "",
          regid: "",
          setmealcode: chooseMeal.setmealcode,
          setmealname: chooseMeal.setmealname,
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
          discountflag: item.discountflag,
          // discount: item.discount != null ? item.discount : 1,
          discountprice: item.discountprice || item.price || 0,
          deptseqno: item.deptseqno || 0,
          qty: 1,
          parts: item.parts || "",
        };
      });
      console.log(data, "data");
      this.$emit("submit", [data, "setmeal"]); // 发送数据父组件
      this.handleCloseSetMeal();
    },
    // 关闭套餐选择弹框回调
    handleCloseSetMeal() {
      this.$emit("close", "setmeal");
    },
    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.sex, gp: "1" }).then((res) => {
        this.loading = false;
        if (!res.result) return;
        this.setmealitems = res.result.setmealitems;
        this.setmealitemsData = [...this.setmealitems];
        setTimeout(() => {
          this.$refs.searchInput.focus();
          //   默认选中第一行
          this.$refs.setMeal.setCurrentRow(this.setmealitems[0]);
        }, 500);
      });
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