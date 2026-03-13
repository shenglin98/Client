<template>
  <div class="sys_app_version">
    <div class="filter-container">
      <permission-btn class="btn_group" moduleName="SysAppVersion" size="mini" v-on:btn-event="handleOnBtnClicked"></permission-btn>
    </div>
    <div class="pagebox">
      <el-card class="box-card head_box">
        <!-- 头部标题 -->
        <div class="head_title">
          <div class="head_logo"></div>
          <p>检索条件</p>
        </div>
        <!-- 头部表单 -->
        <div class="head_content">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" height="30">
            <el-form-item label="版本标题">
              <el-input size="mini" v-model="searchForm.name" clearable @change="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="版本类型">
              <el-select size="mini" v-model="searchForm.type" @change="handleSearch" filterable clearable placeholder="请选择">
                <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本号">
              <el-input size="mini" type="number" v-model="searchForm.version" clearable @change="handleSearch"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <!-- 内容 -->
      <el-card class="box-card content_box">
        <!-- 内容标题 -->
        <div class="head_title">
          <div class="head_logo"></div>
          <p>App版本管理</p>
        </div>
        <!-- 内容表单 -->
        <div class="content_team_form">
          <div class="page_table">
            <vxe-table ref="pageTable" height="auto" border="inner" highlight-hover-row :data="list" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleSelect" @checkbox-all="handleSelectAll" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="id">
              <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
              <vxe-table-column field="name" title="版本标题" min-width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="version" title="版本号" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="type" title="类型" width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span>{{ typeList.find((t) => t.code == scope.row.type).name }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="explain" title="版本说明" min-width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="status" title="状态" width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span>{{ statusList.find((t) => t.code == scope.row.status).name }}</span>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[50, 100, 300, 500]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 编辑 -->
    <edit-dialog :show.sync="showEdit" :typeList="typeList" :statusList="statusList" :item="editData" @change="handleChangeEdit" v-if="showEdit"></edit-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PermissionBtn from "@/components/PermissionBtn";
import EditDialog from "./components/edit";
import { getList, del } from "@/api/sys_app_version";
export default {
  name: "sys_app_version",
  components: { PermissionBtn, EditDialog },
  data() {
    return {
      loading: false,
      page: 1, // 当前页码
      limit: 50, // 每页显示多少条数据
      searchForm: {
        name: "",
        type: "",
        version: "",
      },
      list: [],
      count: 0,
      typeList: [
        {
          code: 1,
          name: "安卓",
        },
        {
          code: 2,
          name: "苹果",
        },
      ],
      statusList: [
        {
          code: 0,
          name: "停用",
        },
        {
          code: 1,
          name: "启用",
        },
      ],
      selectArr: [],
      showEdit: false,
      editData: null,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mounted() {
    this.handleGetList();
  },
  methods: {
    handleGetList() {
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
      getList({
        page: this.page,
        limit: this.limit,
        whereitems,
      })
        .then((res) => {
          this.count = res.count;
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.page = 1;
          this.count = 0;
          this.list = [];
          this.loading = false;
        });
    },
    handleSearch() {
      this.page = 1;
      this.list = [];
      this.handleGetList();
    },
    handleOnBtnClicked(domId) {
      switch (domId) {
        case "btnAdd": // 新增
          this.editData = null;
          this.showEdit = true;
          break;
        case "btnEdit": // 编辑
          this.handleEdit();
          break;
        case "btnDel": // 删除
          this.handleDel();
          break;
        case "btnReset": // 重置
          this.$reload();
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
    handleSelect({ records }) {
      console.log(records);
      this.selectArr = records;
    },
    handleSelectAll({ records }) {
      this.selectArr = records;
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let styleJson = {};
      // styleJson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      styleJson.color = "#000";
      styleJson["font-weight"] = "bold";
      styleJson.background = "#d0ddeb";
      return styleJson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.limit = val;
      this.handleSearch();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.page = val;
      this.handleGetList();
    },
    handleEdit(item) {
      item && (this.selectArr = [item]);
      if (this.selectArr.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.editData = JSON.parse(JSON.stringify(this.selectArr[0]));
        this.showEdit = true;
      }
    },
    handleDel() {
      if (this.selectArr.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.selectArr.map((k) => {
            return k.id;
          });
          del(ids).then((res) => {
            this.$message.success(res.message);
            this.handleGetList(); // 获取列表新数据
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
    handleChangeEdit() {
      this.editData = null;
      this.selectArr = [];
      this.$refs["pageTable"].clearCheckboxRow();
      this.handleGetList();
    },
  },
};
</script>

<style lang="scss" scoped>
.sys_app_version {
  height: 100%;
  box-sizing: border-box;

  .filter-container {
    display: flex;
    background-color: #f8f8f8;
    padding-right: 20px;
    height: 42px;
    align-items: center;
    justify-content: flex-end;

    > div {
      margin-left: 10px;
    }
  }

  .pagebox {
    padding: 0 10px;
    height: 100%;
    box-sizing: border-box;

    // 头部标题
    .head_title {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      background-color: #f6f7fc;
      height: 38px;
      margin: -20px -20px 0 -20px;
      padding-left: 10px;

      .head_logo {
        width: 7px;
        height: 18px;
        background-color: #2a85ea;
        border-radius: 3.5px;
        margin-right: 5px;
      }

      p {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        padding: 0;
      }
    }
    .head_box {
      height: 120px;
    }

    .content_box {
      height: calc(100% - 190px);
      margin-top: 15px;
      /deep/.el-card__body {
        height: 100%;
      }
      .head_title {
        height: 38px;
      }
      .content_team_form {
        margin: 10px 0 0 0px;
        height: calc(100% - 38px);
        .page_table {
          height: calc(100% - 30px);
        }
        /deep/.el-pagination {
          height: 30px;
        }
      }
    }
  }
}
</style>
