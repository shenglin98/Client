<template>
  <div class="setmeal_dialog">
    <!-- 主体套餐弹框 -->
    <el-dialog class="page_dialog" title="组合选择" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleCloseCombine">
      <div class="top_box">
        <el-input ref="searchInput" class="searchName" placeholder="请输入套餐名称" v-model="searchName" clearable @keydown.down.native="handleSearchKeyDown" @keydown.up.native="handleSearchKeyUp" @keydown.enter.native="loading ==false && handleSubmitCombine()">
        </el-input>
        <div class="btn_group">
          <!-- <el-button type="primary" :loading="loading" @click="handleSubmitCombine">确定</el-button> -->
          <el-button type="danger" @click="handleCloseCombine">关闭</el-button>
          <el-button type="success" @click="handleSaveTemplate">保存模板</el-button>
        </div>
      </div>
      <div class="table_box">
        <vxe-table class="combine_table color_table" ref="combine" height="100%" border="inner" show-overflow :loading="loading" highlight-hover-row highlight-current-row :data="combineitemsData" :checkbox-config="{ reserve: true }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" :keyboard-config="{ isArrow: true }" @keydown="handleCombineTableKeyDown" @cell-dblclick="handleSubmitCombine" row-id="setmealcode">
          <vxe-table-column type="seq" title="行号" width="60"></vxe-table-column>
          <vxe-table-column field="combinecode" title="组合编码" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="combinename" title="组合名称" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="deptname" title="科室" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="price" title="价格" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
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
    <!-- 保存模板弹框 -->
    <el-dialog class="temp_dialog" title="套餐模板维护" :visible.sync="showTemplate" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div class="content">
        <div class="update_temp">
          <div class="temp_box">
            <div class="head">更新模板</div>
            <EasyTable class="template_table" ref="template_table" :loading="loading" height="100%" :data="templateData" :tableOptions="templateOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" @checked-change="handleSelectTemplate" />
          </div>
          <div class="temp_box_com">
            <div class="head">项目组合</div>
            <EasyTable class="template_table" ref="template_table" :loading="loading" height="100%" :data="templateDataSon" :tableOptions="templateSonOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" @checked-change="handleSelectTemplate" />
          </div>
        </div>
        <div class="add_temp">
          <div class="head">新增模板</div>
          <div class="input_box">
            模板名称：<el-input v-model="tempName" size="mini" clearable>
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" plain type="primary" @click="handleSubmitTemplate">确 认</el-button>
        <el-button size="mini" plain type="primary" @click="handleCloseTemplate">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  <script>
import {
  getDicSetmealList,
  getTemplateList,
  setTemplateAddorUpdate,
  setTemplateDelete,
  LoadSimpleCombines,
} from "@/api/setMealDialog.js";
import { getComboDetails } from "@/api/setdictionary";
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
    CmbineOnlyloading: {
      type: Boolean,
    },
  },
  data() {
    return {
      loading: false,
      currentCheckData: [],
      combineitems: [],
      combineitemsData: [],
      dialogVisible: true, // 显示项目弹框
      searchName: "",
      showTemplate: false, // 控制显示模板
      templateData: [], // 模板列表数据
      tempName: "", // 新增模板名称
      selectTemplate: [], // 个人模板表格选中数据
      templateObj: {
        code: "",
        name: "",
        price: 0,
        companyprice: 0,
        sex: 0,
        status: 0,
        seqno: 0,
        combineitems: [],
      },
      templateDataSon: [],
    };
  },
  computed: {
    ...mapGetters(["name", "id"]),
    // 模板列表表格配置
    templateOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          title: "套餐模板",
          omit: 1,
          prop: "name",
        },
        {
          title: "价格",
          prop: "price",
          width: 80,
          omit: 1,
        },
        {
          title: "操作",
          width: 80,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() =>
                  this.handleSetTemplateDelete(data)
                }
              >
                删除
              </el-link>
            );
          },
        },
      ];
    },
    templateSonOptions() {
      return [
        {
          title: "组合名称",
          omit: 1,
          prop: "combinename",
        },
        {
          title: "科室",
          prop: "deptname",
          width: 80,
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
          width: 80,
          omit: 1,
        },
      ];
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

  created() {},

  mounted() {
    this.loading = this.CmbineOnlyloading;
    this.currentCheckData = this.groupTableData;
    console.log(this.groupTableData);
    console.log(this.flag);
    console.log(this.loading);
    // 项目加载获取表格数据
    this.handleGetDicSetmealList();
  },

  methods: {
    // 模板删除回调
    handleSetTemplateDelete(item) {
      this.$confirm("此操作将删除当前模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = [item.code];
          setTemplateDelete(codeItems).then((res) => {
            this.$message({
              message: res.message,
              type: "success",
              customClass: "zzXindex",
            });
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleGetTemplateList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleGetComboDetails() {
      let code = this.selectTemplate[0].code;
      getComboDetails({ code }).then((res) => {
        if (!res.result) return;
        this.templateDataSon = res.result.combineitems;
      });
    },
    // 保存模板按钮回调
    handleSaveTemplate() {
      if (this.currentCheckData.length === 0) {
        this.$message.warning("组合不能为空!");
        return false;
      }
      this.handleGetTemplateList();
      this.showTemplate = true;
    },
    // 获取个人模板表格数据
    handleGetTemplateList() {
      getTemplateList({
        page: 1,
        limit: 1000000,
        key: "",
      }).then((res) => {
        this.templateData = res.data;
      });
    },
    // 模板确认提交回调
    handleSubmitTemplate() {
      if (this.tempName != "" && this.selectTemplate.length != 0) {
        this.$message({
          message: "不能同时更新并新增!",
          type: "warning",
          customClass: "zzXindex",
        });
        return false;
      }
      //   新增
      if (this.tempName !== "") {
        this.templateObj.name = this.tempName;
        this.templateObj.combineitems = this.currentCheckData.map((k) => {
          return k.combinecode;
        });
        setTemplateAddorUpdate(this.templateObj).then((res) => {
          this.$message({
            message: res.message,
            type: "success",
            customClass: "zzXindex",
          });
          this.handleCloseTemplate();
        });
        return false;
      }
      //   更新
      if (this.selectTemplate.length === 1) {
        this.templateObj.code = this.selectTemplate[0].code;
        this.templateObj.name = this.selectTemplate[0].name;
        this.templateObj.combineitems = this.currentCheckData.map((k) => {
          return k.combinecode;
        });
        setTemplateAddorUpdate(this.templateObj).then((res) => {
          this.$message({
            message: res.message,
            type: "success",
            customClass: "zzXindex",
          });
          this.handleCloseTemplate();
        });
        return false;
      }
    },
    // 模板关闭回调
    handleCloseTemplate() {
      this.tempName = "";
      this.selectTemplate = [];
      this.templateDataSon = [];
      this.showTemplate = false;
      //   this.handleGetDicSetmealList();
    },
    handleSelectTemplate(item) {
      this.selectTemplate = [];
      this.selectTemplate.push(item);
      this.handleGetComboDetails();
    },
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
      this.loading == false && this.handleSubmitCombine();
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
          discountflag: item.discountflag,
          discountprice: item.discountprice || item.price || 0,
          deptseqno: item.deptseqno || 0,
          qty: 1,
          settlementtype: item.settlementtype != 0 ? 1 : 0,
        },
      ];
      this.flag == "edit" && (this.loading = true);
      this.$emit("submit", [data, "combine"]); // 发送数据父组件
      this.currentCheckData.push(...data);
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
      this.$refs.searchInput.focus();
      setTimeout(() => {
        // 滚动到顶部
        this.$refs.combine.$refs.tableBody.$el.scrollTop = 0;
      }, 100);
    },
    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      LoadSimpleCombines({ sex: this.sex, keyword: "" }).then((res) => {
        this.loading = false;
        if (!res.result) {
          this.$message.warning("暂无组合数据!");
          return;
        }
        let temp = res.result;
        let data = [
          ...temp[0].combineitems,
          ...temp[1].combineitems,
          ...temp[2].combineitems,
        ];
        if (this.groupTableData.length > 0) {
          this.groupTableData.forEach((val, index) => {
            data.forEach((k, i) => {
              if (val.combinecode === k.combinecode) {
                console.log(i);
                data.splice(i, 1);
              }
            });
          });
        }
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
      this.currentCheckData = [];
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
    handleTableRowColor({ row, rowIndex }) {
      let rowBackground = {};
      if (row.setmealtyp == "Person") {
        rowBackground.background = "rgba(0, 255, 255, 0.5)";
        return rowBackground;
      }
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
  width: 100%;
  .btn_group {
    display: flex;
    width: 22% !important;
  }
  .searchName {
    width: 77% !important;
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
.update_temp {
  display: flex;
  .temp_box {
    width: 48%;
  }
  .temp_box_com {
    width: 48%;
    margin-left: 12px;
  }
}
</style>
  <style lang='scss' scoped>
@import "./css/index_qyzyy.scss";
</style>