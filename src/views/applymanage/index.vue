<template>
  <div class="applymanage">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
      <div class="mainbody">
        <div class="search_head">
          <!-- 内容标题 -->
          <div class="head_title">
            <div class="head_logo"></div>
            <p>查询条件</p>
          </div>
          <el-form ref="form" :model="searchForm" label-width="80px">
            <el-row class="mb10">
              <el-col :span="8">
                <el-form-item size="mini" label="登记时间">
                  <div class="date_ss">
                    <el-date-picker v-model="searchForm.startTime" size="mini" type="date" placeholder="开始日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <div class="date_ss_icon">-</div>
                    <el-date-picker v-model="searchForm.endTime" size="mini" type="date" placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="mini" label="体检号">
                  <el-input placeholder="请输入体检号" v-model="searchForm.regid" clearable @keyup.enter.native.stop="handleGetPageList">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item size="mini" label="体检类型">
                  <el-select v-model="searchForm.checktype" placeholder="" clearable filterable @change="handleGetPageList">
                    <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" label="单位">
                  <el-select clearable filterable style="width: 100%" v-model="searchForm.companycode" @change="handleSelectCompany">
                    <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="mini" label="批次">
                  <el-select v-model="searchForm.batch" clearable filterable @change="handleGetPageList">
                    <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select> </el-form-item></el-col>
              <el-col :span="5">
                <el-form-item size="mini" label="团检分组">
                  <el-select v-model="searchForm.groupcode" @change="handleChangeGroup" clearable filterable>
                    <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item size="mini" label="部门">
                  <el-select v-model="searchForm.department" clearable filterable @change="handleGetPageList">
                    <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="content">
          <el-row class="content_box">
            <el-col :span="7" class="content_box_l">
              <!-- 内容标题 -->
              <div class="head_title">
                <div class="head_logo"></div>
                <p>人员列表</p>
              </div>
              <div class="content_box_l_table">
                <vxe-table ref="vxetable1" class="disease_table" height="auto" border="inner" auto-resize highlight-hover-row highlight-current-row :data="pageData" :checkbox-config="{ highlight: true }" @cell-click="handleChooseRowCell" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" @checkbox-change="handleitemlistCombine" @checkbox-all="handleitemlistCombineAll">
                  <vxe-table-column type="checkbox" width="40"></vxe-table-column>
                  <vxe-table-column field="regid" title="体检号" show-header-overflow show-overflow="title" width="120px" show-footer-overflow sortable></vxe-table-column>
                  <vxe-table-column field="name" title="姓名" show-header-overflow show-overflow="title" width="120px" show-footer-overflow sortable></vxe-table-column>
                  <vxe-table-column field="sex" title="性别" show-header-overflow show-overflow="title" width="120px" show-footer-overflow sortable>
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
                  <vxe-table-column field="age" title="年龄" min-width="100px" show-header-overflow show-overflow="title" show-footer-overflow sortable></vxe-table-column>
                </vxe-table>
              </div>
            </el-col>
            <el-col :span="12" class="content_box_r">
              <!-- 内容标题 -->
              <div class="head_title">
                <div class="head_logo"></div>
                <p>申请项目</p>
              </div>
              <el-radio-group v-model="status" @change="handleChangeStatus">
                <el-radio label="">全部</el-radio>
                <el-radio :label="1">已发送</el-radio>
                <el-radio :label="0">未发送</el-radio>
              </el-radio-group>
              <div class="content_box_r_table">
                <vxe-table ref="projectData" class="disease_table" height="auto" border="inner" auto-resize highlight-hover-row highlight-current-row :data="combineitemsData" :checkbox-config="{ trigger: 'default' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassNameCB" @checkbox-change="handleChooseCombine" @checkbox-all="handleChooseCombineAll" @cell-click="handleGetApplyProcess">
                  <vxe-table-column type="checkbox" width="40"></vxe-table-column>
                  <vxe-table-column field="status" title="申请状态" show-header-overflow show-overflow="title" width="100px" show-footer-overflow>
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 0" style="color: blue">未发送</span>
                      <span v-if="scope.row.status == 1">已发送</span>
                      <span v-if="scope.row.status == 2">已检查</span>
                      <span v-if="scope.row.status == 3">已登记</span>
                      <span v-if="scope.row.status == 4">已报告</span>
                      <span v-if="scope.row.status == 5">已撤销</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="regid" title="体检号" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="name" title="姓名" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="viewgroupcn" title="分类" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="chargeflag" title="缴费状态" show-header-overflow show-overflow="title" width="100px" show-footer-overflow>
                    <template slot-scope="scope">
                      <span v-show="scope.row.chargeflag == 0">未收费</span>
                      <span v-show="scope.row.chargeflag == 1" style="color: #409167">
                        已收费
                      </span>
                      <span v-show="scope.row.chargeflag == 2" style="color: #9da408">
                        申请退费
                      </span>
                      <span v-show="scope.row.chargeflag == 3" style="color: #d63737">
                        已退费
                      </span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="applyno" title="申请号" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="detid" title="医嘱号" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="combinename" title="项目" show-header-overflow show-overflow="title" width="180px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="combinecode" title="项目编码" show-header-overflow show-overflow="title" width="120px" show-footer-overflow></vxe-table-column>
                  <!-- <vxe-table-column
                    field="status"
                    title="申请时间"
                    show-header-overflow
                    show-overflow="title"
                    width="180px"
                    show-footer-overflow
                  ></vxe-table-column> -->
                  <vxe-table-column field="deptname" title="科室" show-header-overflow show-overflow="title" width="120px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="deptcode" title="科室编码" show-header-overflow show-overflow="title" width="120px" show-footer-overflow></vxe-table-column>
                  <!-- <vxe-table-column
                    field="status"
                    title="报告单号"
                    show-header-overflow
                    show-overflow="title"
                    width="120px"
                    show-footer-overflow
                  ></vxe-table-column> -->
                </vxe-table>
              </div>
            </el-col>
            <el-col :span="5" class="content_box_r">
              <!-- 内容标题 -->
              <div class="head_title">
                <div class="head_logo"></div>
                <p>流程记录</p>
              </div>
              <div class="content_box_r_tableone">
                <vxe-table ref="projectData" class="disease_tableone" height="auto" border="inner" auto-resize highlight-hover-row highlight-current-row :data="applyProcessData" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassNameCB">
                  <vxe-table-column field="statusname" title="状态" show-header-overflow show-overflow="title" min-width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="operatorname" title="操作人" show-header-overflow show-overflow="title" min-width="100px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="operatdate" title="操作时间" show-header-overflow show-overflow="title" min-width="150px" show-footer-overflow></vxe-table-column>
                  <vxe-table-column field="detid" title="医嘱号" show-header-overflow show-overflow="title" min-width="120px" show-footer-overflow></vxe-table-column>
                </vxe-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import { getPersonalDetail } from "@/api/personalregister.js";
import { getBatchList } from "@/api/companysettlement.js";
import { getPageList } from "@/api/fullsearch.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import {
  getAPPLYLoad,
  setSendApply,
  setCancelApply,
  setResetSendApply,
  APPLYLoadList,
  SendApply,
  CancelApply,
  ResetSendApply,
  ApplyProcess,
} from "@/api/applymanage.js";
export default {
  name: "applymanage",

  components: { Sticky, permissionBtn },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  data() {
    return {
      searchForm: {
        startTime: "",
        endTime: "",
        regid: "",
        checktype: "",
        companycode: "",
        batch: "",
        groupcode: "",
        department: "",
      },
      companyitems: [], // 单位列表
      checktypeitems: [], // 检查类型
      batchitems: [],
      groupitems: [],
      departitems: [],
      pageData: [],
      status: "",
      combineitemsData: [],
      combineitemsDataCopy: [],
      selectRow: [],
      selectCombine: [],
      applyProcessData: [],
    };
  },

  mounted() {
    this.handleGetDetail();
    this.handleGetPrintDate();
  },

  methods: {
    // 获取流程记录
    handleGetApplyProcess({ row }) {
      if (!row) return;
      if (!row.detid) {
        this.applyProcessData = [];
        this.$message.warning("当前人员医嘱号为空!");
        return;
      }

      ApplyProcess({
        detid: row.detid,
      }).then((res) => {
        if (!res.result) {
          this.applyProcessData = [];
        } else {
          this.applyProcessData = res.result;
        }
      });
    },
    // 勾选事件监听
    // { selection }
    handleitemlistCombine({ row, selection }) {
      this.selectRow = selection;
      this.handleChooseRowCell({ row });
    },
    // 全选/全消回调
    handleitemlistCombineAll({ selection }) {
      this.selectRow = selection;
      if (this.selectRow.length == 0) {
        this.combineitemsData = [];
        this.combineitemsDataCopy = [];
        return;
      }
      this.handleGetAPPLYLoad();
    },
    // 重新发送申请回调
    handleSetResetSendApply() {
      // let tempArr = this.selectCombine.filter((k) => k.status === 1);
      // if (tempArr.length == 0) {
      //   this.$message.warning("已跳过不符合发送申请数据!");
      //   return;
      // }
      let msg = "";
      let promises = this.reduceData(this.selectCombine).map((k) => {
        setResetSendApply({
          regid: k.regid,
          detidList: k.items,
        }).then((res) => {
          msg = res.message;
          console.log("重发了吗");
        });
      });
      console.log(promises, "promises");
      Promise.all(promises).then(() => {
        this.selectCombine = [];
        this.$message.success(msg);
        this.handleGetAPPLYLoad();
      });
    },
    // 取消发送申请回调
    handleSetCancelApply() {
      // let tempArr = this.selectCombine.filter((k) => k.status === 1);
      // if (tempArr.length == 0) {
      //   this.$message.warning("已跳过不符合发送申请数据!");
      //   return;
      // }
      let msg = "";
      let promises = this.reduceData(this.selectCombine).map((k) => {
        setCancelApply({
          regid: k.regid,
          detidList: k.items,
        }).then((res) => {
          console.log(res.message);
        });
      });
      Promise.all(promises).then(() => {
        this.selectCombine = [];
        this.$message.success(msg);
        this.handleGetAPPLYLoad();
      });
    },
    // 发送申请回调
    handleSetSendApply() {
      // let tempArr = this.selectCombine.filter((k) => k.status === 0);
      // if (tempArr.length == 0) {
      //   this.$message.warning("已跳过不符合发送申请数据!");
      //   return;
      // }
      let msg = "";
      let promises = this.reduceData(this.selectCombine).map((k) => {
        return setSendApply({
          regid: k.regid,
          detidList: k.items,
        }).then((res) => {
          msg = res.message;
        });
      });
      Promise.all(promises).then(() => {
        this.selectCombine = [];
        this.$message.success(msg);
        this.handleGetAPPLYLoad();
      });
    },
    reduceData(data) {
      const result = data.reduce((acc, obj) => {
        const regid = obj.regid;
        const exists = acc.find((group) => group.regid === regid);
        if (!exists) {
          acc.push({ regid, items: [obj.detid] });
        } else {
          exists.items.push(obj.detid);
        }
        return acc;
      }, []);
      return result;
    },
    // 勾选人员明细数据复选框回调
    handleChooseCombine({ records }) {
      this.selectCombine = records;
    },
    // 勾选人员明细数据复选框回调
    handleChooseCombineAll({ records }) {
      this.selectCombine = records;
    },
    handleChangeStatus(status) {
      if (status === "") {
        this.combineitemsData = JSON.parse(
          JSON.stringify(this.combineitemsDataCopy)
        );
      } else if (status == 0) {
        this.combineitemsData = this.combineitemsDataCopy.filter((k) => {
          return k.status === 0;
        });
      } else if (status == 1) {
        this.combineitemsData = this.combineitemsDataCopy.filter((k) => {
          return k.status === 1;
        });
      }
    },
    // 勾选人员获取申请单列表
    handleGetAPPLYLoad() {
      if (this.selectRow.length == 0) {
        this.$message.warning("请先选中人员!");
        return;
      }
      APPLYLoadList(this.selectRow.map((k) => k.regid)).then((res) => {
        if (res.data) {
          this.combineitemsData = res.data;
          this.combineitemsDataCopy = JSON.parse(JSON.stringify(res.data));
          this.handleChangeStatus(this.status);
        } else {
          this.combineitemsData = [];
          this.combineitemsDataCopy = [];
        }
        if (this.selectRow.length == 0) {
          this.combineitemsData = [];
        }
      });
    },
    // 人员列表选中回调-单元格
    handleChooseRowCell({ row }) {
      this.$refs.vxetable1.toggleCheckboxRow(row);
      const selectedRows = this.$refs.vxetable1.getCheckboxRecords();
      const isRowChecked = selectedRows.some(
        (selectedRow) => selectedRow.regid === row.regid
      );
      // 已勾选数据中是否有当前数据
      if (isRowChecked) {
        this.selectRow.push(row);
        this.handleGetAPPLYLoad();
      } else {
        let resultIndex = this.selectRow.findIndex((k) => k.regid == row.regid);
        resultIndex > -1 && this.selectRow.splice(resultIndex, 1);
        this.selectRow.length >= 1 && this.handleGetAPPLYLoad();
      }
      if (this.selectRow.length == 0) {
        this.combineitemsData = [];
        this.combineitemsDataCopy = [];
      }
    },
    // // 人员列表选中回调
    // handleChooseRow({ row }) {
    //   this.selectRow = row;
    //   console.log(this.selectRow, "单选事件");
    // },
    // 列表表格数据查询回调
    handleGetPageList() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((item) => {
        if (this.searchForm[item] && item != "startTime" && item != "endTime") {
          whereitems.push({
            key: item,
            value: this.searchForm[item],
          });
        }
      });
      if (this.searchForm.startTime && this.searchForm.endTime) {
        whereitems.push({
          key: "startdate",
          value: this.searchForm.startTime,
        });
        whereitems.push({
          key: "enddate",
          value: this.searchForm.endTime,
        });
      }
      if (whereitems.length == 0) {
        this.$message.warning("必须提供查询条件!");
        return;
      }
      getPageList({
        page: 1,
        limit: 100000,
        whereitems,
      })
        .then((res) => {
          if (res.data) {
            this.pageData = res.data;
          } else {
            this.pageData = [];
          }
        })
        .catch(() => {
          this.loading = false;
        });
      this.searchForm.regid = "";
      this.combineitemsData = [];
      this.selectRow = [];
    },
    handleChangeGroup(value) {
      this.departitems = [];
      this.searchForm.department = "";
      if (value) {
        let flag = this.groupitems.filter((k) => k.code === value)[0];
        flag && (this.departitems = flag.departitems);
      }
      this.handleGetPageList();
    },
    // 公司选中获取数据回调
    handleSelectCompany(data) {
      this.searchForm.batch = "";
      this.searchForm.groupcode = "";
      this.searchForm.department = "";
      this.batchitems = [];
      this.groupitems = [];
      this.departitems = [];
      if (!data) {
        return false;
      } else {
        getBatchList({ companycode: this.searchForm.companycode }).then(
          (res) => {
            this.batchitems = res.result.batchitems;
            let batch = this.batchitems.filter((k) => k.selected)[0];
            if (batch) {
              this.searchForm.batch = batch.code;
              this.groupitems = batch.groupitems;
              //   let group = this.groupitems.filter((k) => k.selected)[0];
              //   group && (this.searchForm.groupcode = group.code);
            }
            this.handleGetPageList();
          }
        );
      }
    },
    // 新增获取个人登记明细/详情/新增回调
    handleGetDetail() {
      getPersonalDetail().then((res) => {
        let { checktypeitems, companyitems } = res.result;
        this.checktypeitems = checktypeitems;
        this.companyitems = companyitems;
      });
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 搜索
          this.handleGetPageList();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnSendApply": // 发送申请
          this.handleSetSendApply();
          break;
        case "btnCancelApply": // 取消申请
          this.handleSetCancelApply();
          break;
        case "btnAgainApply": // 重发申请
          this.handleSetResetSendApply();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_FullSearch_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.searchForm.startTime = this.gettime(start);
        this.searchForm.endTime = this.gettime(end);
        // this.handleSearchPageTable();
      });
    },
    gettime(data) {
      let value =
        data.getFullYear() +
        "-" +
        this.checkTime(data.getMonth() + 1) +
        "-" +
        this.checkTime(data.getDate());
      return value;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
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
      stylejson.height = "32px";
      return stylejson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassNameCB({ row, rowIndex }) {
      if (row.status == 1) {
        return "row-red";
      }
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
<style lang="scss" scoped>
.applymanage {
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .mytable-style .vxe-body--row.row-red {
    background-color: red;
    color: #fff;
  }
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
      box-sizing: border-box;
      padding: 5px;
      .search_head {
        height: 120px;
        .mb10 {
          margin-bottom: 10px;
        }
        .date_ss {
          display: flex;
          .date_ss_icon {
            margin: 0 5px;
          }
        }
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .content {
        height: calc(100% - 120px);
        .content_box {
          height: 100%;
          .content_box_l {
            height: 100%;
            box-sizing: border-box;
            padding-right: 5px;
            .content_box_l_table {
              height: calc(100% - 44px);
            }
          }
          .content_box_r {
            height: 100%;
            padding-right: 5px;
            .content_box_r_table {
              height: calc(100% - 71px);
            }
            .content_box_r_tableone {
              height: calc(100% - 44px);
              .disease_tableone {
                height: 100%;
              }
            }
          }
        }
      }
      // 头部标题
      .head_title {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        background-color: #f6f7fc;
        height: 38px;
        padding-left: 10px;
        margin-bottom: 5px;
      }
      .head_logo {
        width: 7px;
        height: 18px;
        background-color: #2a85ea;
        border-radius: 3.5px;
        margin-right: 5px;
      }
      .head_title p {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
