<template>
  <div class="customercollect">
    <div class="filter-container">
      <permission-btn class="btn_group" moduleName="CustomerCritical" size="mini" v-on:btn-event="handleOnBtnClicked"></permission-btn>
    </div>
    <div class="subject">
      <div class="search_box">
        <div class="search_box_item">
          <div class="search_box_item_title">收藏时间：</div>
          <el-date-picker size="mini" v-model="dataArr" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions" @change="handleChangeDate">
          </el-date-picker>
        </div>
        <div class="search_box_item">
          <div class="search_box_item_title">体检号：</div>
          <el-input placeholder="请输入体检号" v-model="searchForm.regid" @keyup.native.enter="handleSearchPageTable" @clear="handleSearchPageTable" size="mini" clearable>
          </el-input>
        </div>
        <div class="search_box_item">
          <div class="search_box_item_title">姓名：</div>
          <el-input placeholder="请输入姓名" v-model="searchForm.name" @keyup.native.enter="handleSearchPageTable" @clear="handleSearchPageTable" size="mini" clearable>
          </el-input>
        </div>
      </div>
      <div class="page_box">
        <div class="table_box">
          <vxe-table class="people_table" ref="peopleTable" height="auto" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="pageData" :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll">
            <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
            <vxe-table-column field="regid" title="体检号" min-width="90" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="name" title="姓名" min-width="80" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="sex" title="性别" min-width="70" show-header-overflow show-overflow="title" show-footer-overflow>
              <template slot-scope="scope">
                <span>{{
                      scope.row.sex == 0
                        ? "未知"
                        : scope.row.sex == 1
                        ? "男"
                        : "女"
                    }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="age" title="年龄" min-width="70" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="telephone" title="手机号" width="150px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="companyname" title="单位名称" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="groupname" title="分组套餐" width="150px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="operatordate" title="收藏时间" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="remark" title="备注内容" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
          </vxe-table>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 1000, 5000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import permissionBtn from "@/components/PermissionBtn";
import {
  CustomerCollectLoad,
  CustomerCollectDelete,
} from "@/api/customercollect.js";
export default {
  name: "customercollect",
  components: { permissionBtn },

  data() {
    return {
      dataArr: [],
      searchForm: {
        regid: "",
        name: "",
        startdate: "",
        enddate: "",
      },
      pickerOptions: {
        // 禁用所有秒选项（0-59秒均不可选）
        disabledSeconds: () => Array.from({ length: 60 }, (_, i) => i),
        // 设置时间选择器的显示格式（可选，确保不显示秒）
        timeFormat: "HH:mm",
      },
      loading: false,
      pageData: [],
      selectPeople: [],
      currentPage: 1,
      pageSize: 100,
      count: 0,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mounted() {},

  methods: {
    // 主体表格查询数据回调
    handleSearchPageTable() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item]) {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      CustomerCollectLoad({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          if (res.data) {
            this.count = res.count;
            this.pageData = res.data;
          } else {
            this.count = 0;
            this.pageData = [];
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 删除收藏数据回调
    handleDelete() {
      if (this.selectPeople.length == 0) {
        this.$message.warning("请勾选需要删除的数据!");
        return;
      }
      if (this.selectPeople.length > 1) {
        this.$message.warning("请勾选一条数据进行删除!");
        return;
      }
      this.$confirm("此操作将删除当前数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          CustomerCollectDelete({ id: this.selectPeople[0].id }).then((res) => {
            this.$message.success(res.message || res.msg);
            this.handleSearchPageTable();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(arr) {
      if (arr) {
        this.searchForm.startdate = arr[0];
        this.searchForm.enddate = arr[1];
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
      this.handleSearchPageTable();
    },
    // 勾选人员回调
    handleSelectPeople({ records, reserves }) {
      if (reserves.length > 0) {
        this.selectPeople = Object.assign([], [...records, ...reserves]);
      } else {
        this.selectPeople = Object.assign([], records);
      }
    },
    // 勾选人员回调-全选
    handleSelectPeopleAll({ records, reserves }) {
      if (reserves.length > 0) {
        this.selectPeople = Object.assign([], [...records, ...reserves]);
      } else {
        this.selectPeople = Object.assign([], records);
      }
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleSearchPageTable();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleSearchPageTable();
    },
    handleOnBtnClicked(domId) {
      switch (domId) {
        case "btnSearch": // 查询
          this.handleSearchPageTable();
          break;
        case "btnDelete": // 删除
          this.handleDelete();
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
.customercollect {
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
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
  .subject {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 45px);
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    .search_box {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      box-sizing: border-box;
      .search_box_item {
        display: flex;
        align-items: center;
        margin-right: 10px;
        .search_box_item_title {
          width: 90px;
          margin-right: 5px;
        }
      }
    }
    .page_box {
      width: 100%;
      height: calc(100% - 40px);
      box-sizing: border-box;
      padding: 5px;
      .table_box {
        width: 100%;
        height: calc(100% - 40px);
        box-sizing: border-box;
      }
      .el-pagination {
        margin-top: 8px;
        text-align: center;
      }
    }
  }
}
</style>