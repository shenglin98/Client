<template>
  <div class="authorize">
    <div class="head_box">
      <el-button
        type="primary"
        size="mini"
        plain
        icon="el-icon-plus"
        @click="handleAddData"
        >新 增</el-button
      >
      <!-- <el-button type="primary" size="mini" plain icon="el-icon-edit-outline"
        >编 辑</el-button
      > -->
      <el-button
        type="primary"
        size="mini"
        plain
        icon="el-icon-close"
        @click="handleClosePage"
        >关 闭</el-button
      >
    </div>
    <!-- 主体表格 -->
    <div class="content_box">
      <EasyTable
        class="page_table"
        :loading="loading"
        height="100%"
        :data="pageData"
        :tableOptions="pageDataOptions"
        :checkbox-config="{ fetch: true, rowClick: true }"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-class-name="handleTableRowClassName"
        :row-style="handleTableRowColor"
        :cell-style="{ padding: '0' }"
        @selected-change="handleCheckData"
        row-key="id"
      />
    </div>
    <!-- 新增编辑弹框 -->
    <el-dialog
      :title="statusPage === 'add' ? '新增' : '编辑'"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      class="page_dia"
    >
      <el-form :model="form">
        <el-form-item label="主建" label-width="100px" size="mini">
          <el-input
            v-model="form.id"
            disabled
            placeholder="系统自动生成"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构编码" label-width="100px" size="mini">
          <el-input v-model="form.hospitalCode"></el-input>
        </el-form-item>
        <el-form-item label="机构名称" label-width="100px" size="mini">
          <el-input v-model="form.hospitalName"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" label-width="100px" size="mini">
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" label-width="100px" size="mini">
          <el-date-picker
            v-model="form.deadTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后修改日期" label-width="100px" size="mini">
          <el-date-picker
            :disabled="statusPage === 'edit'"
            v-model="form.lastTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提醒天数" label-width="100px" size="mini">
          <el-input v-model="form.warnDay"></el-input>
        </el-form-item>
        <el-form-item label="提醒内容" label-width="100px" size="mini">
          <el-input v-model="form.warnContent"></el-input>
        </el-form-item>
        <el-form-item label="授权码" label-width="100px" size="mini">
          <el-input
            type="textarea"
            resize="none"
            :rows="5"
            v-model="form.licenseContent"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="
            (dialogFormVisible = false), (statusPage = ''), handleResetFrom()
          "
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="handleConfirmSave"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { sysExpireList, sysExpireSave } from "@/api/authorize.js";
export default {
  name: "authorize",

  components: {},

  data() {
    return {
      pageData: [],
      loading: false,
      form: {
        id: 0,
        hospitalName: "",
        hospitalCode: "",
        createTime: "",
        deadTime: "",
        warnDay: 0,
        warnContent: "",
        lastTime: "",
        licenseContent: "",
      },
      dialogFormVisible: false,
      statusPage: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    pageDataOptions() {
      return [
        {
          title: "ID",
          omit: 1,
          prop: "id",
          width: 80,
        },
        {
          title: "机构编码",
          prop: "hospitalCode",
          width: 110,
          omit: 1,
        },
        {
          title: "机构名称",
          width: 130,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditData(data)}
              >
                {data.hospitalName}
              </el-link>
            );
          },
        },
        {
          title: "使用时间",
          prop: "createTime",
          width: 150,
          omit: 1,
        },
        {
          title: "截止日期",
          prop: "deadTime",
          width: 150,
          omit: 1,
        },
        {
          title: "最后修改日期",
          prop: "lastTime",
          width: 170,
          omit: 1,
        },
        {
          title: "提醒天数",
          prop: "warnDay",
          width: 100,
          omit: 1,
        },
        {
          title: "提醒内容",
          prop: "warnContent",
          omit: 1,
        },
      ];
    },
  },
  mounted() {
    this.handleSysExpireList();
  },

  methods: {
    // 新增编辑保存回调
    handleConfirmSave() {
      sysExpireSave(this.form).then((res) => {
        this.$message.success(res.message);
        this.handleSysExpireList();
        this.dialogFormVisible = false;
        this.handleResetFrom();
      });
    },
    // 数据编辑点击回调
    handleEditData(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.statusPage = "edit";
      this.dialogFormVisible = true;
    },
    // 列表接口获取
    handleSysExpireList() {
      this.loading = true;
      sysExpireList({
        page: 1,
        limit: 1000000,
        whereitems: [],
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) return;
          this.pageData = res.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 重置列表
    handleResetFrom() {
      this.form = {
        id: 0,
        hospitalName: "",
        hospitalCode: "",
        createTime: "",
        deadTime: "",
        warnDay: 0,
        warnContent: "",
        lastTime: "",
        licenseContent: "",
      };
    },
    // 新增按钮新增数据回调
    handleAddData() {
      this.statusPage = "add";
      this.dialogFormVisible = true;
    },
    // 勾选列表数据回调
    handleCheckData() {},
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
    handleTableRowColor({ row, rowIndex }) {
      let rowBackground = {};
      if (row.setmealtyp == "Person") {
        rowBackground.background = "rgba(0, 255, 255, 0.5)";
        return rowBackground;
      }
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
.authorize {
  width: 100%;
  height: calc(100vh - 80px);
  padding: 10px;
  box-sizing: border-box;
  .head_box {
    width: 100%;
    height: 38px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: #fff;
    padding: 0px 10px;
  }
  .content_box {
    width: 100%;
    height: calc(100% - 50px);
    background-color: #fff;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    box-sizing: border-box;
    .page_table {
      height: 100%;
    }
  }
  /deep/.page_dia {
    .el-dialog__header {
      padding: 10px;
    }
    .el-dialog__body {
      padding: 10px;
      .el-form {
        .el-form-item {
          .el-date-editor {
            width: 100%;
          }
        }
      }
    }
    .el-dialog__footer {
      padding: 10px;
      text-align: center;
    }
  }
}
</style>