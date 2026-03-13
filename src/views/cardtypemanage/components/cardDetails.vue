<template>
  <div class="cardDetails">
    <!-- 头部按钮组+搜索框 -->
    <div class="search_box">
      <div class="search_group">
        <el-input
          placeholder="请输入关键字搜索"
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
      </div>
      <div class="regist_box">
        <div class="registtt">登记卡号：</div>
        <el-input
          placeholder="请输入登记卡号"
          v-model="searchCard"
          @clear="handleSearchCard"
          @keyup.native.enter="handleSearchCard"
          clearable
          size="small"
        >
        </el-input>
        <el-button
          type="primary"
          size="small"
          class="sbtn ml20"
          @click="handleShowBatchRegist"
          >批量登记</el-button
        >
        <el-button type="primary" size="small" @click="handleShowFreeChoice"
          >自由选择</el-button
        >
        <el-upload
          style="margin-left: 8px"
          class="upload-demo"
          name="files"
          action=""
          accept=".xls,.xlsx"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleChangeUpload"
          :file-list="fileList"
        >
          <el-button type="primary" size="mini" icon="iconfont icon-fenxiang"
            >导入</el-button
          >
        </el-upload>
        <el-button
          style="margin-left: 10px"
          type="primary"
          size="small"
          @click="handleEditEffectivedate"
          >修改有效期</el-button
        >
      </div>
      <div class="btn_box">
        <el-button type="primary" size="small" @click="handleSetStatus(2)"
          >激 活</el-button
        >
        <el-button type="primary" size="small" @click="handleSetStatus(3)"
          >注 销</el-button
        >
        <el-button type="primary" size="small" @click="handleClosePage"
          >关 闭</el-button
        >
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="bodymain">
      <EasyTable
        height="100%"
        class="pagetable"
        ref="pagetable"
        :loading="loading"
        :data="pageData"
        :tableOptions="pageOptions"
        :checkbox-config="{ rowClick: true }"
        @selected-change="handleSelectPageData"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-class-name="handleTableRowClassName"
        :cell-style="{ padding: '0' }"
      />
    </div>
    <!-- 新增/编辑弹框 -->
    <el-dialog
      title="批量登记"
      top="23%"
      :close-on-click-modal="false"
      class="cardtype_dia"
      width="550px"
      :visible.sync="showBatchRegist"
      @close="handleCloseBatchRegist"
    >
      <el-form :model="batchRegistForm" label-width="100px">
        <el-form-item size="small" label="开始卡号：">
          <el-input v-model="batchRegistForm.startId" clearable=""></el-input>
        </el-form-item>
        <el-form-item size="small" label="结束卡号：">
          <el-input v-model="batchRegistForm.endId" clearable=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseBatchRegist">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitBatchRegist"
          >登 记</el-button
        >
      </div>
    </el-dialog>
    <!-- 自由选择弹框 -->
    <el-dialog
      title="自由选择"
      top="23%"
      :close-on-click-modal="false"
      class="cardtype_dia"
      width="550px"
      :visible.sync="showFreeChoice"
      :show-close="false"
      @close="handleCloseFreeChoice"
    >
      <el-form :model="freeChoiceForm" label-width="100px">
        <el-form-item size="small" label="开始卡号：">
          <el-input v-model="freeChoiceForm.startId" clearable=""></el-input>
        </el-form-item>
        <el-form-item size="small" label="结束卡号：">
          <el-input v-model="freeChoiceForm.endId" clearable=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseFreeChoice">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitFreeChoice"
          >选 择</el-button
        >
      </div>
    </el-dialog>
    <!-- 导入卡号弹框 -->
    <el-dialog
      title="导入"
      :visible.sync="showImport"
      width="60%"
      :show-close="false"
      class="import_dia"
      :close-on-click-modal="false"
    >
      <div class="import_content">
        <div class="message_box">提示信息：{{ showmsg || "暂无" }}</div>
        <div class="ic_table">
          <EasyTable
            height="100%"
            class="importdatatable"
            :loading="loading"
            :data="customercarditems"
            :tableOptions="customercarditemsOptions"
            :checkbox-config="{ rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :cell-style="{ padding: '0' }"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseImport">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirmImport"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 批量修改有效期 -->
    <el-dialog
      title="修改有效期"
      :visible.sync="showUpdateEffective"
      width="30%"
      class="effective_dia"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <span class="edia_content">
        <el-date-picker
          v-model="updateEffective"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="(updateEffective = ''), (showUpdateEffective = false)"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="handleConfirmUpdateEffective"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  CustomerCardDetailLoad,
  BatchCreate,
  SetStatus,
  ExportCustomerCardData,
  ImportCreate,
  SeePassWord,
  UpdateEffectivedate,
} from "@/api/cardtypemanage.js";
import { getFilesUpload } from "@/api/unitregistration.js";
export default {
  name: "cardDetails",

  components: {},

  props: {
    dataInfo: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      showUpdateEffective: false,
      updateEffective: "",
      fileList: [], // 文件上传列表
      fileObj: undefined, // 文件上传对象
      customercarditems: [],
      showImport: false,
      showmsg: "",
      searchName: "",
      searchCard: "",
      pageData: [],
      selectData: [],
      loading: false,
      showBatchRegist: false,
      showFreeChoice: false,
      batchRegistForm: {
        cardId: "",
        cardpre: "",
        startId: null,
        endId: null,
      },
      freeChoiceForm: {
        startId: null,
        endId: null,
      },
    };
  },
  computed: {
    // 主体表格配置
    pageOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "卡号",
          prop: "cardno",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => {}}
              >
                {data.cardno}
              </el-link>
            );
          },
        },
        {
          title: "卡类别",
          prop: "name",
          width: 150,
          omit: 1,
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
          title: "剩余金额",
          prop: "remainingamount",
          width: 130,
          omit: 1,
        },
        {
          title: "次数限制",
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
          title: "操作",
          width: 120,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                style="margin-right:20px"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleShowCardPassword(data)}
              >
                查看密码
              </el-link>
            );
          },
        },
        {
          title: "购买人",
          prop: "customer",
          width: 120,
          omit: 1,
        },
        {
          title: "购买日期",
          prop: "purchasedate",
          width: 170,
          omit: 1,
        },
        // {
        //   title: "已使用",
        //   prop: "operatdate",
        //   width: 170,
        //   omit: 1,
        // },
        {
          title: "激活人",
          prop: "checkname",
          width: 130,
          omit: 1,
        },
        {
          title: "激活日期",
          prop: "checkdate",
          width: 130,
          omit: 1,
        },
      ];
    },
    customercarditemsOptions() {
      return [
        {
          title: "序号",
          prop: "seqno",
          width: 110,
          omit: 1,
        },
        {
          title: "类型",
          prop: "cardtype",
          width: 150,
          omit: 1,
        },
        {
          title: "卡号",
          prop: "cardno",
          omit: 1,
        },
        {
          title: "密码",
          prop: "cardpassword",
          width: 150,
          omit: 1,
        },
        {
          title: "价值",
          prop: "valueamount",
          width: 150,
          omit: 1,
        },
      ];
    },
  },

  mounted() {
    if (!this.dataInfo) {
      this.$message.warning("请传入查询参数!");
      this.$emit("close", true);
      return;
    }
    this.handleCustomerCardDetailLoad();
  },

  methods: {
    // 提交修改有效期
    handleConfirmUpdateEffective() {
      if (!this.updateEffective) {
        this.$message.warning("请先选中需要修改的时间!");
        return;
      }
      UpdateEffectivedate({
        ids: this.selectData.map((k) => k.id),
        effectivedate: this.updateEffective,
      }).then((res) => {
        this.$message.success(res.message);
        this.updateEffective = "";
        this.showUpdateEffective = false;
        this.handleCustomerCardDetailLoad();
      });
    },
    // 修改有效期
    handleEditEffectivedate() {
      if (this.selectData.length == 0) {
        this.$message.warning("请先勾选需要修改的数据!");
        return;
      }
      this.showUpdateEffective = true;
    },
    // 点击查看密码
    handleShowCardPassword(item) {
      if (!item) return;
      SeePassWord({ id: item.id }).then((res) => {
        if (res.result) {
          this.$confirm(
            `当前卡号：${item.cardno}　密码为：${res.result}`,
            "提示",
            {
              confirmButtonText: "确定",
              showClose: false,
              showCancelButton: false,
              closeOnClickModal: false,
              type: "warning",
            }
          )
            .then(() => {})
            .catch(() => {});
        }
      });
    },
    // 导入弹框保存
    handleConfirmImport() {
      if (this.customercarditems.length == 0) return;
      ImportCreate(
        this.customercarditems.map((k) => {
          return {
            ...k,
            cardId: this.dataInfo.id,
          };
        })
      ).then((res) => {
        this.$message.success(res.message);
        this.handleCloseImport();
        this.handleCustomerCardDetailLoad(); // 主页列表数据回调
      });
    },
    // 导入弹框关闭
    handleCloseImport() {
      this.customercarditems = [];
      this.showmsg = "";
      this.showImport = false;
    },
    // 文件导入上传
    handleChangeUpload(file, fileList) {
      this.loading = true;
      let data = new FormData();
      data.append("files", file.raw);
      getFilesUpload(data)
        .then((res) => {
          this.fileObj = res.result[0];
          if (this.fileObj) {
            ExportCustomerCardData({ fileId: this.fileObj.id }).then((res) => {
              this.loading = false;
              this.customercarditems = res.result.customercarditems;
              this.showmsg = res.result.showmsg;
              this.showImport = true;
            });
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 关闭当前页面
    handleClosePage() {
      this.$emit("close", true);
    },
    // 自由选择选中回调
    handleSubmitFreeChoice() {
      let reg = /^\+?[1-9][0-9]*$/;
      if (
        !reg.test(this.freeChoiceForm.startId) ||
        !reg.test(this.freeChoiceForm.endId)
      ) {
        this.$message.warning("开始卡号/结束卡号必须为数字!");
        return;
      }
      if (+this.freeChoiceForm.startId > +this.freeChoiceForm.endId) {
        this.$message.warning("开始卡号必须小于结束卡号!");
        return;
      }
      let start = this.pageData.findIndex((k) => {
        return this.freeChoiceForm.startId == k.cardno;
      });
      let end = this.pageData.findIndex((k) => {
        return this.freeChoiceForm.endId == k.cardno;
      });
      if (start < 0 || end < 0) {
        this.$message.warning("开始卡号/结束卡号查询不到!");
        return;
      }
      let startIndex = +this.freeChoiceForm.startId;
      let endIndex = +this.freeChoiceForm.endId;
      this.$nextTick(() => {
        for (let i = 0; i < this.pageData.length; i++) {
          if (
            +this.pageData[i].cardno >= startIndex &&
            +this.pageData[i].cardno <= endIndex
          ) {
            this.$refs.pagetable.$refs.easyTable.toggleRowSelection(
              this.pageData[i],
              true
            );
          }
        }
        this.handleCloseFreeChoice();
      });
    },
    // 点击自由选择回调
    handleShowFreeChoice() {
      // 清空前面回显
      this.$refs.pagetable.$refs.easyTable.clearSelection();
      this.freeChoiceForm = {
        startId: null,
        endId: null,
      };
      this.showFreeChoice = true;
    },
    // 自由选择关闭回调
    handleCloseFreeChoice() {
      this.freeChoiceForm = {
        startId: null,
        endId: null,
      };
      this.showFreeChoice = false;
    },
    // 勾选数据回调
    handleSelectPageData(arr) {
      this.selectData = arr;
    },
    // 激活/注销回调
    handleSetStatus(status) {
      if (this.selectData.length == 0) {
        this.$message.warning("请先勾选需操作数据!");
        return;
      }
      let ids = this.selectData.map((k) => {
        return k.id;
      });
      SetStatus({
        ids,
        status,
      }).then((res) => {
        this.$message.success(res.message);
        this.selectData = [];
        this.handleCustomerCardDetailLoad();
      });
    },
    //  点击批量登记回调
    handleShowBatchRegist() {
      this.handleResetBatchRegistForm();
      this.showBatchRegist = true;
    },
    // 批量新增弹框关闭回调
    handleCloseBatchRegist() {
      this.batchRegistForm = {
        cardId: "",
        cardpre: "",
        startId: null,
        endId: null,
      };
      this.showBatchRegist = false;
    },
    // 重置批量登记表单
    handleResetBatchRegistForm() {
      this.batchRegistForm = {
        cardId: "",
        cardpre: "",
        startId: null,
        endId: null,
      };
    },
    // 批量新增弹框确认回调
    handleSubmitBatchRegist() {
      let reg = /^\+?[1-9][0-9]*$/;
      if (
        !reg.test(this.batchRegistForm.startId) ||
        !reg.test(this.batchRegistForm.endId)
      ) {
        this.$message.warning("开始卡号/结束卡号必须为数字!");
        return;
      }
      if (
        this.batchRegistForm.startId.length != this.batchRegistForm.endId.length
      ) {
        this.$message.warning("开始卡号/结束卡号长度必须保持一致!");
        return;
      }
      this.$confirm(
        `体检卡从[${this.batchRegistForm.startId}]至[${this.batchRegistForm.endId}] 批量登记,是否确定?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.batchRegistForm.cardId = this.dataInfo.id;
          BatchCreate(this.batchRegistForm).then((res) => {
            this.$message.success(res.message);
            this.handleCloseBatchRegist();
            this.handleCustomerCardDetailLoad();
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
    // 消费卡明细列表接口
    handleCustomerCardDetailLoad() {
      CustomerCardDetailLoad({
        page: 1,
        limit: 10000,
        key: "",
        whereitems: [
          {
            key: "cardId",
            value: this.dataInfo.id,
          },
        ],
      })
        .then((res) => {
          if (!res.data) {
            this.pageData = [];
            return;
          }
          this.pageData = res.data;
        })
        .catch(() => {});
    },
    // 登记卡号回调事件
    handleSearchCard() {
      let reg = /^\+?[1-9][0-9]*$/;
      if (!reg.test(this.searchCard)) {
        this.$message.warning("登记卡号必须为数字!");
        return;
      }
      BatchCreate({
        cardId: this.dataInfo.id,
        cardpre: "",
        startId: this.searchCard,
        endId: this.searchCard,
      }).then((res) => {
        this.$message.success(res.message);
        this.searchCard = "";
        this.handleCustomerCardDetailLoad();
      });
    },
    // 搜索回调事件
    handleSearchName() {},
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
// @import url("./css/cardDetails.scss");
.cardDetails {
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
    justify-content: space-between;
    padding: 0 6%;
    .ml20 {
      margin-left: 20px !important;
    }
    > div {
      display: flex;
    }
    .regist_box {
      display: flex;
      align-items: center;
    }
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
    .pagetable {
      height: 100%;
    }
  }
}
.import_dia {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 10px;
    .import_content {
      .ic_table {
        height: 450px;
        .importdatatable {
          height: 100%;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
.effective_dia {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 10px;
    .edia_content {
      width: 100%;
      .el-date-editor {
        width: 100%;
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
</style>
<style lang='scss'>
.el-message-box__wrapper {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>