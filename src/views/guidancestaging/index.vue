<template>
  <div class="guidancestaging">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <permission-btn class="btn_group" moduleName="guidancestaging" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
      <div class="mainbody">
        <!-- 头部个人信息/检索 -->
        <el-row class="top_info">
          <el-col :span="6" class="search_input">
            <div class="content_l">
              <div class="head">
                <div class="logo"></div>
                检索条件
              </div>
            </div>
            <el-radio-group v-model="conditionCode">
              <el-radio label="regid">体检号</el-radio>
              <el-radio label="name">姓名</el-radio>
              <el-radio label="hiscode">门诊卡</el-radio>
            </el-radio-group>
            <el-input size="mini" ref="checkupWorkInput" clearable @keyup.enter.native="handleInputWork" v-model="checkupWork" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="18" class="mess_info">
            <el-form ref="form" disabled :model="personalForm" label-width="85px">
              <el-row>
                <el-col :span="4">
                  <el-form-item size="mini" label="体检号" class="personalFormName">
                    <el-input disabled v-model="personalForm.regid"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="姓名" class="personalFormName">
                    <el-input v-model="personalForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="性别">
                    <el-input v-model="personalForm.sexs"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" class="age" label-width="80px" label="年龄">
                    <el-input type="text" class="age_num" v-model="personalForm.age"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="mini" label="收费状态">
                    <el-input v-model="personalForm.chargeflagcn"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item size="mini" label="联系电话">
                    <el-input v-model="personalForm.telephone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="费用" label-width="80px">
                    <el-input v-model="personalForm.price"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item size="mini" label="身份证">
                    <el-input v-model="personalForm.idcard"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="mini" label="身份">
                    <el-input v-model="personalForm.levelcn"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item class="group_inspection" size="mini" label="团检名称" label-width="80px">
                    <el-input v-model="personalForm.companyname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item class="group_inspection" size="mini" label="分诊" label-width="80px">
                    <el-input v-model="personalForm.currentRoom"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <!-- 主体表格内容 -->
        <div class="page_table_box">
          <EasyTable :loading="loading" height="100%" class="page_table" :data="pageData" :tableOptions="pageDataOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="gc_Style" />
        </div>
      </div>
      <!-- 客户历史体检记录弹框 -->
      <el-dialog class="dialog-mini history_pson" width="55%" height="100%" top="10%" :close-on-click-modal="false" title="历史体检信息" :visible.sync="historyShow" @close="handleCloseHistory">
        <div class="table_box">
          <EasyTable class="table_item" height="100%" row-id="groupid" :data="historySelectData" :tableOptions="historySelectOptions" :radio-config="{ fetch: true, rowClick: true }" @row-dblclick="handleHistoryCheck" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseHistory">关 闭</el-button>
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
  TriagTriagDetail,
  TriagPaidui,
  TriagResetPaidui,
  TriagCancelPaidui,
  TriagComplete,
  TriagCompleteNotQueue,
  TriagRestore,
} from "@/api/triag.js";
import { getPersonalRegisterList } from "@/api/personalregister.js";
export default {
  name: "guidancestaging",

  components: { Sticky, permissionBtn },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 历史信息表格配置
    historySelectOptions() {
      return [
        {
          title: "体检号",
          prop: "regid",
          align: "center",
          width: 110,
        },
        {
          title: "档案号",
          prop: "checkno",
          align: "center",
          width: 110,
        },
        {
          title: "姓名",
          prop: "name",
          align: "center",
        },
        {
          title: "性别",
          prop: "sex",
          align: "center",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          align: "center",
          returnVal: (value) => {
            return `${value}岁`;
          },
        },
        {
          title: "电话",
          prop: "telephone",
          width: 110,
        },
        {
          title: "身份证号",
          prop: "idcard",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "团检",
          prop: "companyname",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "登记时间",
          prop: "regdate",
          align: "center",
          width: 180,
          omit: 1,
        },
      ];
    },
    pageDataOptions() {
      return [
        // {
        //   title: "检查项目",
        //   prop: "combinename",
        //   width: 160,
        //   omit: 1,
        // },
        {
          title: "分诊队列",
          prop: "queuename",
          width: 160,
          omit: 1,
        },
        {
          title: "状态",
          prop: "statusCN",
          width: 110,
          omit: 1,
        },
        {
          title: "提示",
          prop: "warnMsg",
          omit: 1,
        },
        {
          title: "排队号",
          prop: "queueno",
          width: 130,
          omit: 1,
        },
        {
          title: "诊室",
          prop: "roomname",
          width: 130,
          omit: 1,
        },
        {
          title: "排队",
          width: 170,
          render: (h, data) => {
            return (
              <div style="display:flex;align-items: center;">
                <el-button
                  size="mini"
                  type="primary"
                  style="margin-right:8px"
                  v-show={data.paiduiStatus == 0}
                  vOn:click_stop_prevent={() => {
                    this.handleTriagPaidui(data, false);
                  }}
                >
                  排队
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  v-show={data.paiduiStatus == 0}
                  vOn:click_stop_prevent={() => {
                    this.handleTriagPaidui(data, true);
                  }}
                >
                  VIP排队
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-show={data.paiduiStatus == 1}
                  vOn:click_stop_prevent={() => {
                    this.handleTriagResetPaidui(data);
                  }}
                >
                  重排
                </el-button>
              </div>
            );
          },
        },
        {
          title: "过号",
          width: 120,
          render: (h, data) => {
            return (
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  v-show={data.skipStatus == 0}
                  vOn:click_stop_prevent={() => {
                    this.handleTriagRestore(data);
                  }}
                >
                  恢复
                </el-button>
              </div>
            );
          },
        },
        {
          title: "取消",
          width: 120,
          render: (h, data) => {
            return (
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  v-show={data.cancelStatus == 0}
                  vOn:click_stop_prevent={() => {
                    this.handleTriagCancelPaidui(data);
                  }}
                >
                  取消排队
                </el-button>
              </div>
            );
          },
        },
        {
          title: "完成",
          width: 120,
          render: (h, data) => {
            return (
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  v-show={data.status == 3}
                  vOn:click_stop_prevent={() => {
                    this.$confirm(
                      `该检查${data.queuename}已完成,是否取消?`,
                      "提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }
                    )
                      .then(() => {
                        this.handleTriagCancelPaidui(data);
                      })
                      .catch(() => {
                        this.$message({
                          type: "info",
                          message: "已取消操作",
                        });
                      });
                  }}
                >
                  取消
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-show={data.completeStatus == 0}
                  vOn:click_stop_prevent={() => {
                    this.handleTriagComplete(data);
                  }}
                >
                  完成
                </el-button>
              </div>
            );
          },
        },
        // {
        //   title: "分诊时间",
        //   prop: "triagdate",
        //   omit: 1,
        // },
        // {
        //   title: "已等待(分)",
        //   prop: "waittime",
        //   width: 100,
        //   omit: 1,
        // },
        // {
        //   title: "等待人数",
        //   prop: "queuecount",
        //   width: 100,
        //   omit: 1,
        // },
        // {
        //   title: "预计(分)",
        //   prop: "lefttiem",
        //   width: 100,
        //   omit: 1,
        // },
        // {
        //   title: "操作",
        //   width: 150,
        //   render: (h, data) => {
        //     return (
        //       <div style="display:flex;justify-content: space-between;">
        //         <el-button
        //           size="mini"
        //           type="primary"
        //           disabled={!data.allowpaidui}
        //           vOn:click_stop_prevent={() => {
        //             this.handleTriagPaidui(data);
        //           }}
        //         >
        //           排队
        //         </el-button>
        //         <el-button
        //           size="mini"
        //           type="primary"
        //           disabled={!data.allowcancel}
        //           vOn:click_stop_prevent={() => {
        //             this.handleTriagCancelPaidui(data);
        //           }}
        //         >
        //           取消
        //         </el-button>
        //       </div>
        //     );
        //   },
        // },
      ];
    },
  },

  data() {
    return {
      conditionCode: "regid",
      checkupWork: "",
      personalForm: {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 0,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
      }, // 个人信息
      loading: false,
      pageData: [],
      historyShow: false, // 客户历史体检记录弹框显示
      historySelectData: [], // 客户历史体检记录数据
    };
  },

  mounted() {},

  methods: {
    // 点击完成回调
    handleTriagComplete(row) {
      if (!row) return;
      if (row.id) {
        TriagComplete({ id: row.id }).then((res) => {
          this.$message.success("操作成功!");
          this.handleTriagTriagDetail(this.personalForm.regid);
        });
      } else {
        TriagCompleteNotQueue({
          regid: this.personalForm.regid,
          queuecode: row.queuecode,
          combinecode: row.combinecode,
        }).then((res) => {
          this.$message.success("操作成功!");
          this.handleTriagTriagDetail(this.personalForm.regid);
        });
      }
    },
    // 点击恢复回调-过号
    handleTriagRestore(row) {
      if (!row) return;
      TriagRestore({ id: row.id }).then((res) => {
        this.$message.success("操作成功!");
        this.handleTriagTriagDetail(this.personalForm.regid);
      });
    },
    // 点击排队回调
    handleTriagPaidui(row, flag = false) {
      if (!row) return;
      TriagPaidui({
        regid: this.personalForm.regid,
        queuecode: row.queuecode,
        combinecode: row.combinecode,
        vip: flag,
      }).then((res) => {
        this.$message.success("操作成功!");
        this.handleTriagTriagDetail(this.personalForm.regid);
      });
    },
    // 点击重新排队回调
    handleTriagResetPaidui(row) {
      if (!row) return;
      TriagResetPaidui({
        regid: this.personalForm.regid,
        id: row.id,
      }).then((res) => {
        this.$message.success("操作成功!");
        this.handleTriagTriagDetail(this.personalForm.regid);
      });
    },
    // 点击取消排队回调
    handleTriagCancelPaidui(row) {
      if (!row) return;
      TriagCancelPaidui({ id: row.id }).then((res) => {
        this.$message.success("操作成功!");
        this.handleTriagTriagDetail(this.personalForm.regid);
      });
    },
    // 获取页面主要信息
    handleTriagTriagDetail(value) {
      if (!value && !this.checkupWork.trim()) {
        this.$message.warning("请先输入体检号!");
        return;
      }
      TriagTriagDetail({ regid: value || this.checkupWork.trim() }).then(
        (res) => {
          if (!res.result) return;
          let data = res.result;
          this.personalForm = data;
          this.personalForm.sexs =
            data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
          this.personalForm.levelcn =
            data.level == 0 ? "普通" : data.level == 1 ? "VIP" : "保密";
          this.pageData = res.result.triagitems;
          this.checkupWork = "";
        }
      );
    },
    // 历史人员双击回调
    handleHistoryCheck(row) {
      if (!row) return false;
      this.conditionCode = "regid";
      this.checkupWork = row.regid;
      this.handleTriagTriagDetail(); // 查询信息
      this.handleCloseHistory(); // 关闭弹框
    },
    // 历史信息表格选中人员关闭
    handleCloseHistory() {
      this.historyShow = false;
      this.historySelectData = [];
    },
    // 搜索框回车回调
    handleInputWork() {
      if (!this.checkupWork) {
        this.$message.warning("请输入查找信息!");
        return false;
      }
      if (this.conditionCode === "regid") {
        // 获取页面主要信息
        this.handleTriagTriagDetail();
      } else {
        getPersonalRegisterList({
          page: 1,
          limit: 10000,
          whereitems: [
            {
              key: this.conditionCode,
              value: this.checkupWork,
            },
            {
              key: "pageflag",
              value: "customerresult",
            },
          ],
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            this.historySelectData = res.data;
            this.historyShow = true;
            this.checkupWork = "";
          }
        });
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
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.healthstatus == 1) {
        // stylejson.background = "#e0838f"; // 背景颜色
        // 也可以修改文字颜色
        stylejson.color = "red !important";
        return stylejson;
      } else if (row.healthstatus == -1) {
        stylejson.color = "#0000ff !important";
        return stylejson;
      }
      return "";
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.height = "32px";
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
    // 表格斑马纹颜色调整-主体
    gc_Style({ row, column, rowIndex, columnIndex }) {
      if (row.status == 3) {
        return "background:	#ccc;";
      } else {
        return "";
      }
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 搜索
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
.guidancestaging {
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
      padding: 8px;
      box-sizing: border-box;
      .top_info {
        height: 120px;
        .search_input {
          height: 100%;
          .content_l {
            width: 100%;
            background-color: #f6f7fc;
            border-radius: 5px;
            .head {
              font-weight: 600;
              font-size: 18px;
              padding: 4px;
              display: flex;
              align-items: center;
              margin-left: 5px;
              .logo {
                width: 5px;
                height: 16px;
                background-color: #2b7cd8;
                border-radius: 2px;
                margin-right: 5px;
              }
            }
          }
          .el-radio-group {
            margin: 18px 0;
          }
        }
        .mess_info {
          height: 100%;
          .el-form {
            .el-form-item {
              margin-bottom: 11px;
            }
          }
        }
      }
      .page_table_box {
        height: calc(100% - 120px);
        .page_table {
          height: 100%;
          .greyclass {
            background-color: #565656 !important;
          }
        }
      }
    }
  }
  .history_pson {
    .table_item {
      height: 400px;
    }
  }
}
</style>