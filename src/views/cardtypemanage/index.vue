<template>
  <div class="cardtypemanage">
    <!-- 主页数据 -->
    <div class="subject" v-if="showPageStatus">
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
          moduleName="cardtypeManage"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <!-- 主体内容 -->
      <div class="bodymain">
        <EasyTable
          height="100%"
          class="cardtypetable"
          :loading="loading"
          :data="cardtypeData"
          :tableOptions="cardtypeOptions"
          :checkbox-config="{ rowClick: true }"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        />
      </div>
      <!-- 新增/编辑弹框 -->
      <el-dialog
        :title="cardTypeForm.id == '' ? '新增' : '编辑'"
        :close-on-click-modal="false"
        class="cardtype_dia"
        width="550px"
        :visible.sync="showCardType"
        @close="handleCloseShowCardType"
      >
        <el-form :model="cardTypeForm" ref="cardTypeForm" label-width="100px">
          <el-form-item size="small" label="体检卡：" prop="status">
            <el-select v-model="cardTypeForm.cardtype" clearable filterable>
              <el-option
                v-for="item in cardtypeItems"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="批次：">
            <el-input v-model="cardTypeForm.batch"></el-input>
          </el-form-item>
          <el-form-item size="small" label="说明：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              resize="none"
              v-model="cardTypeForm.remark"
              clearable
            ></el-input>
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
    <CardDetails :dataInfo="dataInfo" @close="showPageStatus = true" v-else />
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import { CardSave, CardLoad, CardDelete } from "@/api/cardtypemanage.js";
import { DicCardTypeLoad } from "@/api/diccardtype.js";
import CardDetails from "./components/cardDetails.vue";
export default {
  name: "cardtypemanage",

  components: { Sticky, permissionBtn, CardDetails },

  data() {
    return {
      searchName: "", // 搜索关键字
      loading: false,
      cardtypeData: [], // 表格数据
      cardtypeItems: [], // 新增下拉数据
      cardTypeForm: {
        id: "",
        cardtype: "",
        batch: "",
        remark: "",
      }, // 新增编辑表单数据
      showCardType: false,
      showPageStatus: true, // 控制显示主页/子页
      dataInfo: null,
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 主体表格配置
    cardtypeOptions() {
      return [
        {
          title: "体检卡",
          prop: "name",
          width: 150,
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
          title: "批次",
          prop: "batch",
          width: 200,
          omit: 1,
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
          title: "使用次数",
          prop: "usecount",
          width: 130,
          omit: 1,
        },
        {
          title: "有效期",
          prop: "effectivedate",
          width: 170,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          width: 130,
          omit: 1,
          enumType: [
            {
              value: 0,
              label: "初始",
            },
            {
              value: 1,
              label: "激活",
            },
            {
              value: 2,
              label: "发售",
            },
            {
              value: 3,
              label: "注销",
            },
          ],
        },
        {
          title: "创建日期",
          prop: "operatdate",
          width: 170,
          omit: 1,
        },
        {
          title: "创建人",
          prop: "operatorname",
          width: 130,
          omit: 1,
        },
        {
          title: "操作",
          prop: "name",
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <el-link
                  type="primary"
                  style="margin-right:20px"
                  class="name_box"
                  vOn:click_stop_prevent={() => this.handleCardJumpManage(data)}
                >
                  卡片管理
                </el-link>
                <el-link
                  type="primary"
                  class="name_box"
                  vOn:click_stop_prevent={() => this.handleDelCard(data)}
                >
                  删除
                </el-link>
              </div>
            );
          },
        },
      ];
    },
  },

  mounted() {
    this.handleCardTypeLoad(); // 主页列表数据回调
    this.handleDicCardTypeLoad(); // 获取新增编辑弹框下拉数据
  },

  methods: {
    // 主页列表数据回调
    handleCardTypeLoad() {
      this.loading = true;
      CardLoad({
        page: 1,
        limit: 10000,
        key: "",
        whereitems: [],
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
    // 体检卡管理列表数据卡片管理回调
    handleCardJumpManage(item) {
      if (!item) return;
      this.dataInfo = item;
      this.showPageStatus = false;
    },
    // 体检卡管理列表数据删除回调
    handleDelCard(item) {
      if (!item) return;
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          CardDelete([item.id]).then((res) => {
            this.$message.success(res.message);
            this.handleCardTypeLoad();
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
    // 体检卡管理列表数据编辑回调
    handleEditCardType(item) {
      if (!item) return;
      this.cardTypeForm = JSON.parse(JSON.stringify(item));
      this.showCardType = true;
    },
    // 关闭提交回调
    handleSubmitCardType() {
      // 不允许为空
      for (let key in this.cardTypeForm) {
        if (this.cardTypeForm.hasOwnProperty(key)) {
          if (["cardtype", "bacth"].includes(key)) {
            if (this.cardTypeForm[key].trim() === "") {
              this.$message.warning("请填写完整信息!");
              return;
            }
          }
        }
      }
      CardSave(this.cardTypeForm).then((res) => {
        this.$message.success(res.message);
        this.handleCardTypeLoad(); // 获取列表新数据
        this.handleCloseShowCardType(); // 关闭弹框
      });
    },
    // 获取体检卡列表数据回调
    handleDicCardTypeLoad() {
      DicCardTypeLoad({
        page: 1,
        limit: 10000,
        key: "",
      })
        .then((res) => {
          if (!res.data) {
            this.cardtypeItems = [];
            return;
          }
          this.cardtypeItems = res.data;
        })
        .catch(() => {});
    },
    // 关闭弹框回旋
    handleCloseShowCardType() {
      this.cardTypeForm = {
        id: "",
        cardtype: "",
        batch: "",
        remark: "",
      }; // 项目常见字典新增编辑表单
      this.showCardType = false;
    },
    // 重置新增编辑表单数据
    handleResetCardTypeForm() {
      this.cardTypeForm = {
        id: "",
        cardtype: "",
        batch: "",
        remark: "",
      }; // 项目常见字典新增编辑表单
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
          break;
        case "btnDel": // 删除
          break;
        case "btnRefresh": // 重置
          this.handleCardTypeLoad(); // 主页列表数据回调
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
.cardtypemanage {
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
        margin: 0 30px 0 10px;
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
    }
    .el-dialog__footer {
      padding: 10px;
      text-align: center;
    }
  }
}
</style>