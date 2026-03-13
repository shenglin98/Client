<template>
  <div class="diccardtype">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <el-input
          placeholder="请输入内容"
          v-model="searchName"
          @clear="handleSearchName"
          @keyup.native.enter="handleSearchName"
          clearable
          size="small"
        >
        </el-input>
        <el-button
          icon="el-icon-search"
          size="small"
          plain
          class="sbtn"
          @click="handleSearchName"
          >搜索</el-button
        >
        <permission-btn
          class="btn_group"
          moduleName="customerResult"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <!-- 主体内容树+字典 -->
      <div class="bodymain">
        <EasyTable
          height="100%"
          class="cardtypetable"
          :loading="loading"
          :data="cardtypeData"
          :tableOptions="cardtypeOptions"
          :checkbox-config="{ rowClick: true }"
          @selected-change="handleCardTypeData"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        />
      </div>
      <!-- 新增弹框 -->
      <el-dialog
        :title="cardTypeForm.code == '' ? '新增' : '编辑'"
        :close-on-click-modal="false"
        class="cardtype_dia"
        width="550px"
        :visible.sync="showCardType"
        @open="handleOpenShowCardType"
        @close="handleCloseShowCardType"
      >
        <el-form
          :model="cardTypeForm"
          :rules="cardTypeRules"
          ref="cardTypeForm"
          label-width="100px"
        >
          <el-form-item size="small" label="编码">
            <el-input
              disabled
              v-model="cardTypeForm.code"
              placeholder="系统自动生成"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="名称">
            <el-input v-model="cardTypeForm.name"></el-input>
          </el-form-item>
          <el-form-item size="small" label="卡类型" prop="status">
            <el-select v-model="cardTypeForm.cardtype" clearable filterable>
              <el-option label="现金卡" :value="0"></el-option>
              <el-option label="充值卡" :value="1"></el-option>
              <el-option label="打折卡" :value="2"></el-option>
              <el-option label="项目卡" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="销售金额">
            <el-input v-model="cardTypeForm.salesamount"></el-input>
          </el-form-item>
          <el-form-item size="small" label="卡值金额">
            <el-input v-model="cardTypeForm.valueamount"></el-input>
          </el-form-item>
          <el-form-item size="small" label="有效期" prop="effectivedate">
            <el-date-picker
              size="mini"
              v-model="cardTypeForm.effectivedate"
              type="date"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="isShowDiccardType !== 0"
            size="small"
            label="使用次数"
          >
            <el-input v-model="cardTypeForm.usecount"></el-input>
          </el-form-item>
          <el-form-item
            v-if="isShowDiccardType !== 0"
            size="small"
            label="允许找零"
          >
            <el-select v-model="cardTypeForm.changeflag" clearable filterable>
              <el-option label="不允许" :value="0"></el-option>
              <el-option label="允许" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowDiccardType !== 0"
            size="small"
            label="折扣"
          >
            <el-input v-model="cardTypeForm.discount"></el-input>
          </el-form-item>
          <el-form-item size="small" label="备注">
            <el-input v-model="cardTypeForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseShowCardType"
            >取 消</el-button
          >
          <el-button size="mini" type="primary" @click="handleSubmitCardType"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import {
  DicCardTypeLoad,
  DicCardTypeSave,
  DicCardTypeDelete,
} from "@/api/diccardtype.js";
export default {
  name: "diccardtype",

  components: { Sticky, permissionBtn },

  data() {
    return {
      searchName: "", // 搜索关键字
      cardtypeData: [], // 表格数据
      loading: false,
      showCardType: false,
      cardTypeForm: {
        code: "",
        name: "",
        cardtype: 0,
        salesamount: 0,
        valueamount: 0,
        effectivedate: "",
        usecount: 0,
        changeflag: 1,
        discount: 1,
        remark: "",
      },
      selectCardType: [],
      cardTypeRules: {
        effectivedate: [
          { required: true, message: "请选择有效期", trigger: "change" },
        ],
        usecount: [
          { required: true, message: "请填写使用次数", trigger: "blur" },
        ],
        changeflag: [
          { required: true, message: "请选择是否允许找零", trigger: "change" },
        ],
        discount: [{ required: true, message: "请填写折扣", trigger: "blur" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      }, // 新增编辑表单验证
      isShowDiccardType: null,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 主体表格配置
    cardtypeOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编码",
          prop: "code",
          width: 130,
          omit: 1,
        },
        {
          title: "名称",
          prop: "name",
          width: 130,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditCardType(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "卡类型",
          prop: "cardtype",
          width: 130,
          enumType: [
            {
              value: 0,
              label: "现金卡",
            },
            {
              value: 1,
              label: "充值卡",
            },
            {
              value: 2,
              label: "打折卡",
            },
            {
              value: 3,
              label: "项目卡",
            },
          ],
        },
        {
          title: "销售金额",
          prop: "salesamount",
          width: 130,
          omit: 1,
        },
        {
          title: "卡值金额",
          prop: "valueamount",
          width: 130,
          omit: 1,
        },
        {
          title: "有效期",
          prop: "effectivedate",
          width: 130,
          omit: 1,
        },
        {
          title: "使用次数",
          prop: "usecount",
          width: 130,
          omit: 1,
        },
        {
          title: "允许找零",
          prop: "changeflag",
          width: 130,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "不允许" : "允许";
          },
        },
        {
          title: "折扣",
          prop: "discount",
          width: 130,
          omit: 1,
        },
        {
          title: "备注",
          prop: "remark",
          omit: 1,
        },
      ];
    },
  },
  mounted() {
    this.handleDicCardTypeLoad();
    console.log(window.isShowDiccardType, "window.isShowDiccardType");
    this.isShowDiccardType = window.isShowDiccardType;
    console.log(this.isShowDiccardType, "this.isShowDiccardType");
  },

  methods: {
    // 体检卡列表数据字典编辑回调
    handleEditCardType(item) {
      item && (this.selectCardType = [item]);
      if (this.selectCardType.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.cardTypeForm = JSON.parse(JSON.stringify(this.selectCardType[0]));
        this.showCardType = true;
      }
    },
    // 体检卡字典删除数据回调
    handleDicCardTypeDelete() {
      if (this.selectCardType.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectCardType.map((item) => {
            return item.code;
          });
          DicCardTypeDelete(codes).then((res) => {
            this.$message.success(res.message);
            this.handleDicCardTypeLoad();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 获取体检卡列表数据回调
    handleDicCardTypeLoad() {
      this.loading = true;
      DicCardTypeLoad({
        page: 1,
        limit: 10000,
        key: "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.cardtypeData = [];
            return;
          }
          this.cardtypeData = res.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 关闭提交回调
    handleSubmitCardType() {
      this.$refs["cardTypeForm"].validate((valid) => {
        if (valid) {
          DicCardTypeSave(this.cardTypeForm).then((res) => {
            this.$message.success(res.message);
            this.handleDicCardTypeLoad(); // 获取列表新数据
            this.handleCloseShowCardType(); // 关闭弹框
          });
        }
      });
    },
    // 打开弹框回调
    handleOpenShowCardType() {
      this.$refs["cardTypeForm"] && this.$refs["cardTypeForm"].clearValidate();
    },
    // 关闭弹框回旋
    handleCloseShowCardType() {
      this.$refs["cardTypeForm"].clearValidate();
      this.cardTypeForm = {
        code: "",
        name: "",
        cardtype: 0,
        salesamount: 0,
        valueamount: 0,
        effectivedate: "",
        usecount: 0,
        changeflag: 1,
        discount: 1,
        remark: "",
      }; // 项目常见字典新增编辑表单
      this.showCardType = false;
    },
    // 充值表单数据
    handleResetCardTypeForm() {
      this.cardTypeForm = {
        code: "",
        name: "",
        cardtype: 0,
        salesamount: 0,
        valueamount: 0,
        effectivedate: "",
        usecount: 0,
        changeflag: 1,
        discount: 1,
        remark: "",
      }; // 项目常见字典新增编辑表单
    },
    // 勾选回调
    handleCardTypeData(arr) {
      this.selectCardType = arr;
    },
    // 搜索回调事件
    handleSearchName() {},
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.handleResetCardTypeForm();
          this.showCardType = true;
          break;
        case "btnEdit": // 编辑
          this.handleEditCardType();
          break;
        case "btnDel": // 删除
          this.handleDicCardTypeDelete();
          break;
        case "btnRefresh": // 重置
          this.handleDicCardTypeLoad();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
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
// @import url("./css/index.scss");
.diccardtype {
  padding: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    .search_box {
      display: flex;
      height: 40px;
      width: 100%;
      background-color: #f6f7fc;
      box-sizing: border-box;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      .sbtn {
        margin: 0 10px;
      }
      .el-input {
        width: 250px;
      }
    }
    .bodymain {
      width: 100%;
      height: calc(100% - 40px);
      box-sizing: border-box;
      padding: 5px;
      .cardtypetable {
        height: 100%;
      }
    }
  }
  .cardtype_dia {
    .el-dialog__header {
      padding: 10px;
    }
    .el-dialog__body {
      padding: 10px;
      .el-select {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
      }
    }
    .el-dialog__footer {
      padding: 10px;
      text-align: center;
    }
  }
}
</style>