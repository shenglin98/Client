<template>
  <div class="noticetemplate">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <el-input placeholder="请输入内容" v-model="searchName" @clear="handleSearchName" @keyup.native.enter="handleSearchName" clearable size="small">
        </el-input>
        <el-button icon="el-icon-search" size="small" plain class="sbtn" @click="handleSearchName">搜索</el-button>
        <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
      <!-- 主体内容树+字典 -->
      <div class="bodymain">
        <!-- 左侧tree选择当前字典 -->
        <div class="choose_tree">
          <el-tree ref="pageTree" class="pageTree" :data="treeData" node-key="id" :props="defaultProps" :default-expand-all="true" :default-checked-keys="defaultChecked" @node-click="handleNodeClick">
            <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
              <i class="el-icon-menu"></i> {{ node.label }}
            </span>
          </el-tree>
        </div>
        <!-- 右侧字典盒子 - 主体数据 -->
        <div class="content">
          <!-- 分诊队列字典 -->
          <div class="Dic_noticetemplate" v-if="pageFlag == 'Dic_noticetemplate'">
            <div class="dictriagqueue_box">
              <vxe-table class="dictriagqueue" ref="daleiTable" height="auto" border="inner" :loading="loading" highlight-hover-row highlight-current-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="noticetemplateData" :checkbox-config="{ reserve: true }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }" @cell-click="handleChooseNotice">
                <vxe-table-column field="tempid" title="通知ID" width="120"></vxe-table-column>
                <vxe-table-column field="tempname" title="通知名称" width="120"></vxe-table-column>
                <vxe-table-column field="tempcategroy" title="通知类型" width="120"></vxe-table-column>
                 <vxe-table-column field="smsinfotype" title="短信类型" width="120">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.smsinfotype == 0
                        ? "普通短信"
                        : scope.row.smsinfotype == 1
                        ? "预警值短信"
                        : ""
                    }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="personalflag" title="个人标志" width="120">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.personalflag == 0
                        ? "个人"
                        : scope.row.personalflag == 1
                        ? "单位"
                        : ""
                    }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="eventvalueCN" title="通知事件" width="120">
                </vxe-table-column>
                <vxe-table-column field="trigger" title="触发方式" width="120">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.trigger == 0
                        ? "手工发送"
                        : scope.row.trigger == 1
                        ? "执行触发"
                        : scope.row.trigger == 2
                        ? "定时发送"
                        : ""
                    }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="trigger" title="体检中心" width="150">
                  <template slot-scope="scope">
                    <span>{{meccodeItems.filter(k=>k.id == scope.row.meccode)[0]&&meccodeItems.filter(k=>k.id == scope.row.meccode)[0].name || ""}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="smsplatform" title="短信平台" width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.smsplatform == 0 ?"腾讯云":"ShowDoc"}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="templateid" title="模板ID" width="120"></vxe-table-column>
                <vxe-table-column field="signname" title="签名" width="120"></vxe-table-column>
                <vxe-table-column field="content" title="模板内容" min-width="300"></vxe-table-column>
                <vxe-table-column field="status" title="状态" width="120">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.status === 0 ? "未启用" : "启用"
                    }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="seqno" title="排序" width="120"></vxe-table-column>
              </vxe-table>
            </div>
            <div class="queue_details">
              <div class="dtopbtn">
                <el-button size="mini" type="primary" :disabled="isDicNoticeForm" @click="handleSaveDicNoticeForm">保 存</el-button>
              </div>
              <el-form ref="noticeForm" :model="noticeForm" :rules="rules" :disabled="isDicNoticeForm" label-width="80px">
                <el-form-item size="small" label="通知ID">
                  <el-input disabled placeholder="系统自增" v-model="noticeForm.tempid"></el-input>
                </el-form-item>
                <el-form-item size="small" label="通知名称">
                  <el-input v-model="noticeForm.tempname" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="通知类型" prop="tempcategroy">
                  <el-input v-model="noticeForm.tempcategroy" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="个人标志">
                  <el-select clearable filterable v-model="noticeForm.personalflag">
                    <el-option label="个人" :value="0"></el-option>
                    <el-option label="单位" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="通知事件">
                  <el-select clearable filterable v-model="noticeForm.eventvalue">
                    <el-option label="来检通知" :value="'0'"></el-option>
                    <el-option label="体检预约" :value="'1'"></el-option>
                    <el-option label="排队通知" :value="'2'"></el-option>
                    <el-option label="复查通知" :value="'3'"></el-option>
                    <el-option label="危急值提醒" :value="'4'"></el-option>
                    <el-option label="随访通知" :value="'5'"></el-option>
                    <el-option label="报告通知" :value="'6'"></el-option>
                    <el-option label="生日祝福" :value="'7'"></el-option>
                    <el-option label="节假日提醒" :value="'8'"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="触发方式">
                  <el-select clearable filterable v-model="noticeForm.trigger">
                    <el-option label="手工发送" :value="0"></el-option>
                    <el-option label="执行触发" :value="1"></el-option>
                    <el-option label="定时发送" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="体检中心">
                  <el-select v-model="noticeForm.meccode" clearable placeholder="请选择">
                    <el-option v-for="item in meccodeItems" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="短信平台">
                  <el-select v-model="noticeForm.smsplatform" clearable placeholder="请选择">
                    <el-option label="腾讯云" :value="0"></el-option>
                    <el-option label="ShowDoc" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="模板ID">
                  <el-input v-model="noticeForm.templateid" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="签名">
                  <el-input v-model="noticeForm.signname" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="模板内容">
                  <el-input type="textarea" :rows="3" v-model="noticeForm.content" resize="none" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="状态">
                  <el-select clearable filterable v-model="noticeForm.status">
                    <el-option label="未启用" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="排序">
                  <el-input v-model="noticeForm.seqno" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="短信类型">
                  <el-select clearable filterable v-model="noticeForm.smsinfotype">
                    <el-option label="普通短信" :value="0"></el-option>
                    <el-option label="预警值短信" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { getDictionaryDicLoad } from "@/api/projectdictionary2.js";
import { mapGetters } from "vuex";
import {
  DicNoticetemplateLoad,
  DicNoticetemplateSave,
  DicNoticetemplateSetStatus,
} from "@/api/noticetemplate.js";
export default {
  name: "noticetemplate",

  components: { Sticky, permissionBtn },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  data() {
    return {
      searchName: "", // 搜索关键字
      pageFlag: "Dic_noticetemplate", // 当前页面显示字典控制
      defaultProps: {
        children: "children",
        label: "label",
      }, // 文档树渲染配置
      defaultChecked: [1], // 默认选中数据
      treeData: [
        {
          label: "短信模板字典",
          name: "Dic_noticetemplate",
          id: 1,
        },
      ], // 文档树渲染数据
      loading: false,
      noticetemplateData: [],
      noticeForm: {
        tempid: "",
        tempname: "",
        personalflag: null,
        eventvalue: "0",
        trigger: 0,
        smsinfotype: "",
        templateid: "",
        content: "",
        tempcategroy: "",
        signname: "",
        meccode: "",
        smsplatform: 0,
        status: 1,
        seqno: 0,
      },
      rules: {
        tempcategroy: [
          { required: true, message: "请输入通知类型", trigger: "blur" },
        ],
      },
      isDicNoticeForm: true,
      chooseNotice: null,
      meccodeItems: [],
    };
  },

  mounted() {
    this.handleCheckNode();
    getDictionaryDicLoad({ tableName: "Dic_Medical_center" }).then((res) => {
      if (!res.data) return false;
      this.meccodeItems = res.data;
    });
  },

  methods: {
    // 保存通知模板表单删除
    handleDicNoticetemplateSetStatus() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DicNoticetemplateSetStatus({
            tempids: [this.chooseNotice.tempid],
            status: -1,
          }).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleDicNoticetemplateLoad();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 保存通知模板表单列表
    handleDicNoticetemplateLoad() {
      DicNoticetemplateLoad({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetDicNoticeForm();
            this.isDicNoticeForm = true; // 解除表单限制
            this.noticetemplateData = [];
            return;
          }
          this.noticetemplateData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 保存通知模板表单
    handleSaveDicNoticeForm() {
      this.$refs["noticeForm"].validate((valid) => {
        if (valid) {
          DicNoticetemplateSave(this.noticeForm).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDicNoticeForm();
            this.isDicNoticeForm = true; // 解除表单限制
            // this.chooseTriagQueue = null;
            this.handleDicNoticetemplateLoad();
          });
        }
      });
    },
    // 重置通知模板表单
    handleResetDicNoticeForm() {
      this.noticeForm = {
        tempid: "",
        tempname: "",
        personalflag: null,
        eventvalue: "0",
        trigger: 0,
        templateid: "",
        tempcategroy: "",
        signname: "",
        content: "",
        meccode: "",
        smsplatform: 0,
        smsinfotype: 0,
        status: 1,
        seqno: 0,
      };
      this.$refs["noticeForm"].resetFields();
    },
    // 通知模板字典点击行选中回调
    handleChooseNotice({ row }) {
      this.handleResetDicNoticeForm();
      this.isDicNoticeForm = true; // 解除表单限制
      this.chooseNotice = JSON.parse(JSON.stringify(row));
      this.noticeForm = JSON.parse(JSON.stringify(row));
    },
    // 筛选输入框回调
    handleSearchName() {
      switch (this.pageFlag) {
        case "Dic_noticetemplate":
          this.isDicNoticeForm = true; // 解除表单限制
          this.handleDicNoticetemplateLoad();
          break;
        default:
          break;
      }
    },
    // 树形结构选中储存回调
    handleCheckNode() {
      // 页面加载默认选中第一个
      this.$nextTick(() => {
        let currentNode = localStorage.getItem("currentKeyNodeDicNotice");
        let code = "";
        if (currentNode) {
          this.defaultChecked.push(currentNode);
          code = currentNode;
        } else {
          this.defaultChecked.push(this.treeData[0].id);
          code = this.treeData[0].id;
        }
        this.$refs[`treeItem_${code}`].click();
      });
    },
    // 点击树形结构获取当前选中字典
    handleNodeClick(data) {
      // console.log(data.name);
      this.pageFlag = data.name;
      // 储存当前点击树模块名称ID
      localStorage.setItem("currentKeyNodeDicNotice", data.id);
      switch (data.name) {
        case "Dic_noticetemplate":
          this.isDicNoticeForm = true; // 解除表单限制
          this.chooseNotice = null;
          this.handleDicNoticetemplateLoad();
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          switch (this.pageFlag) {
            case "Dic_noticetemplate":
              this.handleResetDicNoticeForm();
              this.isDicNoticeForm = false; // 解除表单限制
              break;
            default:
              break;
          }
          break;
        case "btnEdit": // 编辑
          switch (this.pageFlag) {
            case "Dic_noticetemplate": // 分诊队列字典
              if (!this.chooseNotice) {
                this.$message.warning("请先选中单条数据进行编辑!");
                return;
              }
              this.isDicNoticeForm = false; // 解除表单限制
              break;
            default:
              break;
          }
          break;
        case "btnDel": // 删除
          switch (this.pageFlag) {
            case "Dic_noticetemplate": // 分诊队列字典
              if (!this.chooseNotice) {
                this.$message.warning("请先选中单条数据进行删除!");
                return;
              }
              this.handleDicNoticetemplateSetStatus();
              break;
            default:
              break;
          }
          break;
        case "btnRefresh": // 重置
          switch (this.pageFlag) {
            case "Dic_noticetemplate": // 分诊队列字典
              this.handleResetDicNoticeForm();
              this.chooseNotice = null; // 解除表单限制
              this.isDicNoticeForm = true; // 解除表单限制
              this.handleDicNoticetemplateLoad();
              break;
            default:
              break;
          }
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
      stylejson.height = "32px";
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
  // 离开当前页面钩子-清空保存点击树id
  beforeRouteLeave(to, form, next) {
    localStorage.removeItem("currentKeyNodeDicNotice");
    next();
  },
  watch: {},
};
</script>
<style lang='scss' scoped>
.noticetemplate {
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
      display: flex;
      .choose_tree {
        width: 150px;
        height: 100%;
        box-sizing: border-box;
        border-right: 1px solid #eaeefb;
        .pageTree {
          .el-icon-caret-right {
            display: none;
          }
        }
      }
      .content {
        width: calc(100% - 150px);
        height: 100%;
        padding-left: 5px;
        box-sizing: border-box;
        .Dic_noticetemplate {
          width: 100%;
          height: 100%;
          display: flex;
          .dictriagqueue_box,
          .dictriagarea_box {
            width: 70%;
            height: 100%;
            .dictriagqueue,
            .dictriagarea {
              width: 100%;
              //   height: 100%;
              // /deep/.el-table {
              //   .current-row {
              //     background-color: #5586d1 !important;
              //   }
              //   .el-table__row--current {
              //     background-color: #5586d1 !important;
              //   }
              //   .el-table__row,
              //   .current-row {
              //     background-color: #5586d1 !important;
              //   }
              // }
            }
          }
          .queue_details,
          .area_details {
            width: 30%;
            height: 100%;
            .dtopbtn {
              height: 34px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              box-sizing: border-box;
              padding-right: 15px;
            }
            .el-form {
              margin-top: 5px;
              .el-form-item {
                margin-bottom: 10px;
                .el-select {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
/deep/.vxe-body--row.row--current {
  background-color: #5586d1 !important;
  color: #fff;
}

/deep/.el-tree {
  .is-current {
    .el-tree-node__content {
      background-color: #5586d1 !important;
      color: #fff;
    }
  }
}
.dictriagqueue,
.dictriagarea {
  /deep/.el-table {
    // .current-row {
    //   background-color: #5586d1 !important;
    // }
    // .el-table__row--current {
    //   background-color: #5586d1 !important;
    // }
    // 选中色
    .el-table__body tr.current-row > td {
      background-color: #5586d1 !important;
      color: #fff;
    }
  }
}
</style>