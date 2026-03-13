<template>
  <div class="systemreport">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <div style="margin-right: 20px">
          <el-input
            size="mini"
            placeholder="输入关键字"
            v-model="searchTxt"
            clearable
            @keyup.enter.native="hadnleOnBtnClicked('btnSearch')"
          ></el-input>
          <el-button size="mini" @click="hadnleOnBtnClicked('btnSearch')">搜索</el-button>
        </div>
        <permission-btn
          class="btn_group"
          moduleName="customerResult"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <div class="mainbody">
        <div class="table_box">
          <EasyTable
            :loading="loading"
            class="page_table"
            height="100%"
            :data="pageList"
            :tableOptions="pageOptions"
            :radio-config="{
              rowClick: true,
            }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
        </div>
      </div>
      <!-- 编辑弹框 -->
      <el-dialog
        title="编 辑"
        :visible.sync="showEditDia"
        class="edit_dia"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="content">
          <el-form ref="form" :model="editForm" label-width="80px">
            <el-form-item size="mini" label="报表名称">
              <el-input v-model="editForm.repname" clearable></el-input>
            </el-form-item>
            <el-form-item size="mini" label="导出方式">
              <el-select
                style="width: 100%"
                v-model="editForm.xlsx"
                clearable
                placeholder="请选择"
              >
                <el-option label="" :value="''"></el-option>
                <el-option label="xlsx" :value="'xlsx'"></el-option>
                <el-option label="devxlsx" :value="'devxlsx'"></el-option>
                <el-option label="fastxlsx" :value="'fastxlsx'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="报表模板">
              <el-input v-model="editForm.reptemplate" clearable=""></el-input>
            </el-form-item>
            <el-form-item size="mini" label="体检中心">
              <el-select
                style="width: 100%"
                multiple
                v-model="editForm.meccode"
                clearable
              >
                <el-option
                  v-for="(item, index) in meccodeitems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="角色组">
              <el-select style="width: 100%" multiple v-model="editForm.roles" clearable>
                <el-option
                  v-for="(item, index) in rolesitems"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="序号">
              <el-input
                placeholder="请输入序号"
                type="number"
                v-model="editForm.seqno"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleEditClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitEdit"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import { getLoadSearchInfo } from "@/api/fullsearch.js";
import {
  SysReportDesignLoad,
  rolesLoadAll,
  SysReportDesignSave,
} from "@/api/systemreport.js";
export default {
  name: "systemreport",

  components: { Sticky, permissionBtn },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 体检记录表格配置
    pageOptions() {
      return [
        {
          title: "报表名称",
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleEditPageData(data)}
              >
                {data.repname}
              </el-link>
            );
          },
        },
        {
          title: "报告类型",
          prop: "repdesigntype",
          width: 120,
          omit: 1,
        },
        {
          title: "设计类型",
          prop: "repgroup",
          width: 120,
          omit: 1,
        },
        {
          title: "导出xlsx方式",
          prop: "xlsx",
          width: 150,
          omit: 1,
        },
        {
          title: "报告模板",
          prop: "reptemplate",
          width: 150,
          omit: 1,
        },
        {
          title: "体检中心",
          prop: "meccodecn",
          width: 230,
          omit: 1,
        },
        {
          title: "角色组",
          prop: "rolecn",
          width: 230,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seqno",
          width: 90,
          omit: 1,
        },
        {
          title: "操作",
          omit: 1,
          width: 90,
          render: (h, data) => {
            return (
              <el-button
                type="primary"
                size="mini"
                vOn:click_stop_prevent={() => this.handleEditPageData(data)}
              >
                编 辑
              </el-button>
            );
          },
        },
      ];
    },
  },

  data() {
    return {
      loading: false,
      pageList: [],
      showEditDia: false,
      editForm: {
        repname: "",
        xlsx: "",
        reptemplate: "",
        meccode: [],
        roles: [],
        seqno: 0,
      },
      meccodeitems: [],
      rolesitems: [],
      searchTxt: "", // 搜索字段
      allData: [], // 暂存数据
    };
  },

  mounted() {
    this.handleSysReportDesignLoad();
    this.handleGetLoadSearchInfo();
    this.handleRolesLoadAll();
  },

  methods: {
    // 搜索方法
    handleSearch() {
      // 模糊查询
      this.pageList = this.allData.filter((k) => {
        return Object.keys(k).some((key) => {
          // reptype === "1"
          if (key == "repname" && String(k["reptype"]) === "1") {
            return String(k[key])
              .toLowerCase()
              .includes(this.searchTxt.trim().toLowerCase());
          }
        });
      });
    },
    // 输出为字符串
    handleOutputString(obj) {
      if (!obj || obj.length == 0) {
        console.log("1111");
        return "";
      } else {
        console.log(obj.join("|"), "222");
        return obj.join("|");
      }
    },
    // 输出为数组
    handleOutputArr(obj) {
      if (obj == "") {
        return [];
      } else {
        return obj.split("|");
      }
    },
    // 点击确认提交
    handleSubmitEdit() {
      this.editForm.meccode = this.handleOutputString(this.editForm.meccode);
      this.editForm.roles = this.handleOutputString(this.editForm.roles);
      SysReportDesignSave(this.editForm).then((res) => {
        this.$message.success(res.message);
        this.handleEditClose();
        this.handleSysReportDesignLoad();
      });
    },
    // 编辑数据
    handleEditPageData(item) {
      if (!item) return;
      this.editForm.repname = item.repname;
      this.editForm.xlsx = item.xlsx;
      this.editForm.reptemplate = item.reptemplate;
      this.editForm.meccode = this.handleOutputArr(item.meccode);
      this.editForm.roles = this.handleOutputArr(item.roles);
      this.editForm.seqno = item.seqno;
      this.showEditDia = true;
    },
    // 关闭弹框
    handleEditClose() {
      this.editForm = {
        repname: "",
        xlsx: "",
        reptemplate: "",
        meccode: [],
        roles: [],
        seqno: 0,
      };
      this.showEditDia = false;
    },
    // 获取列表数据
    handleSysReportDesignLoad() {
      this.loading = true;
      SysReportDesignLoad({
        page: 1,
        limit: 100000,
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) return;
          this.pageList = res.data.filter((k) => k.reptype == "1");
          this.allData = res.data.filter((k) => k.reptype == "1");
          this.handleSearch(); //调用搜索逻辑达到页面保持不变
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 加载搜索条件返回合集回调
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { meccodeitems } = res.result;
        this.meccodeitems = meccodeitems; // 体检中心集合
      });
    },
    // 加载角色数据
    handleRolesLoadAll() {
      rolesLoadAll({ page: 1, limit: 100000 }).then((res) => {
        if (!res.data) return;
        this.rolesitems = res.data;
      });
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 检索
          if (!this.searchTxt) this.handleSysReportDesignLoad();
          this.handleSearch();
          break;
        case "btnFlushed": // 刷新
          this.searchTxt = "";
          this.handleSysReportDesignLoad();
          break;
        case "btnEdit": // 编辑
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
      let view = this.visitedViews.filter((k) => k.path === this.$route.path)[0];
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
};
</script>
<style lang="scss" scoped>
.systemreport {
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
    box-sizing: border-box;
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
    .mainbody {
      height: calc(100% - 40px);
      .table_box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 10px;
        .page_table {
          width: 100%;
          height: 100%;
        }
      }
    }
    .edit_dia {
      /deep/.el-dialog__header {
        padding: 10px;
      }
      /deep/.el-dialog__body {
        padding: 0 10px;
        .content {
        }
      }
      /deep/.el-dialog__footer {
        padding: 10px;
        text-align: center;
      }
    }
  }
}
</style>
