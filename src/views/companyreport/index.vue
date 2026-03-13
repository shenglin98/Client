<template>
  <div class="company_report">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn
          moduleName="personalregister"
          ref="personalregister"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="subject">
      <div class="bg">
        <!-- 检索条件 -->
        <div class="search_box">
          <div class="head">检索条件</div>
          <el-row class="search_form">
            <el-form ref="form" :model="searchForm" label-width="80px">
              <el-col :span="6">
                <el-form-item size="mini" label="体检中心">
                  <el-select v-model="searchForm.region">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="mini" label="团检名称">
                  <el-select v-model="searchForm.region">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item size="mini" label="批次">
                  <el-select v-model="searchForm.region">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item size="mini" label="团检分组">
                  <el-select v-model="searchForm.region">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item size="mini" label="状态">
                  <el-select v-model="searchForm.region">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!-- 主体 -->
        <div class="table_list">
          <div class="head">团检预约</div>
          <EasyTable
            height="100%"
            class="table"
            :data="tableData"
            :tableOptions="tableOptions"
            :radio-config="{ rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :cell-style="{ padding: '0' }"
          />
        </div>
      </div>
    </div>
    <!-- 预览弹出层 -->
    <el-dialog
      title="提示"
      class="report"
      :visible.sync="dialogVisible"
      top="20px"
      :close-on-click-modal="false"
      :show-close="false"
      width="65%"
    >
      <div class="btn_group">
        <el-button type="primary" size="mini" plain>打印</el-button>
        <el-button type="primary" size="mini" plain>导出</el-button>
        <el-button type="primary" size="mini" plain @click="handleCloseDialog"
          >关闭</el-button
        >
      </div>
      <div class="content">
        <el-menu default-active="2" class="el-menu" background-color="#e6f1fa">
          <el-menu-item index="1">
            <span slot="title">封面</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">基本信息</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span slot="title">人员分组</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span slot="title">体检组合</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span slot="title">人员分布</span>
          </el-menu-item>
          <el-menu-item index="6">
            <span slot="title">异常情况</span>
          </el-menu-item>
          <el-menu-item index="7">
            <span slot="title">健康建议</span>
          </el-menu-item>
          <el-menu-item index="8">
            <span slot="title">健康知识</span>
          </el-menu-item>
        </el-menu>
        <iframe
          ref="pdfCotainer"
          :src="pdfUrl"
          width="100%"
          style="height: calc(100vh - 147px)"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";

export default {
  name: "companyreport",

  components: { Sticky, permissionBtn },

  data() {
    return {
      searchForm: {},
      tableData: [
        {
          name: "2024年工商银行入职",
          bacth: 1,
          makeTime: "2021-03-25",
          number: 100,
          startTime: "2024-05-11",
          endTime: "2025-05-11",
          receive: "刘医生",
          contacts: "刘经理",
          phone: "",
          email: "",
        },
      ],
      dialogVisible: false,
      pdfUrl: "",
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    tableOptions() {
      return [
        {
          title: "团体名称",
          prop: "name",
          width: 180,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => {
                  this.handleSeeReport();
                }}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "批次",
          prop: "bacth",
          omit: 1,
        },
        {
          title: "预约时间",
          prop: "makeTime",
          width: 120,
          omit: 1,
        },
        {
          title: "体检人数",
          prop: "number",
          width: 100,
          omit: 1,
        },
        {
          title: "开始时间",
          prop: "startTime",
          width: 120,
          omit: 1,
        },
        {
          title: "结束时间",
          prop: "endTime",
          width: 120,
          omit: 1,
        },
        {
          title: "接待人",
          prop: "receive",
          omit: 1,
        },
        {
          title: "联系人",
          prop: "contacts",
          omit: 1,
        },
        {
          title: "联系电话",
          prop: "phone",
          width: 150,
          omit: 1,
        },
        {
          title: "邮箱",
          prop: "email",
          omit: 1,
        },
      ];
    },
  },

  mounted() {},

  methods: {
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
    // 关闭预览弹框
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
    },
    // 查看报表
    handleSeeReport() {
      this.pdfUrl =
        "/pdfjs/web/viewer.html?file=" +
        encodeURIComponent(
          "http://101.200.229.181:8092/Temp/CompanyReport1.pdf"
        );
      this.dialogVisible = true;
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          console.log(111);
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>