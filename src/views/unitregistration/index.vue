<template>
  <div class="unitregistration">
    <!-- 头部操作控件 -->
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 下拉框组 -->
        <div class="select_group">
          <!-- 选择公司 -->
          单位名称&nbsp;&nbsp;
          <el-select style="width: 300px" size="mini" v-model="company" clearable filterable remote reserve-keyword :remote-method="handleRemoteMethod" :loading="selectLoading" @clear="handleRemoteMethod" @change="handleChangeCompany">
            <el-option v-for="item in companyArr" :key="item.companycode" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode">
            </el-option>
          </el-select>
          <!-- 单位名称&nbsp;&nbsp;<el-select style="width:300px" filterable clearable size="mini" v-model="company" @change="handleChangeCompany" placeholder="请选择公司">
            <el-option v-for="(item,index) in companyArr" :key="index" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode">
            </el-option>
          </el-select> -->
          <!-- 选择批次号 -->
          批次&nbsp;&nbsp;
          <el-select size="mini" v-model="batchCode" @change="handleChangeBatch" placeholder="请选择批次号">
            <el-option v-for="(item, index) in batchCodeArr" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <!-- 按钮组 -->
        <div class="button_group">
          <el-upload style="margin-right: 10px" class="upload-demo" :disabled="authenStatus == 0 ? true : false" name="files" action="" accept=".rar,.zip" :show-file-list="false" :auto-upload="false" :on-change="handleChangeUploadPicture" :file-list="fileList">
            <el-button type="primary" plain size="mini" @click="hadnleIsCompanyPicture" icon="el-icon-picture-outline-round">导入照片</el-button>
          </el-upload>
          <el-upload class="upload-demo" :disabled="authenStatus == 0 ? true : false" name="files" action="" accept=".xls,.xlsx" :show-file-list="false" :auto-upload="false" :on-change="(file, fileList) => handleChangeUpload(file, fileList, '')" :file-list="fileList">
            <el-button type="primary" plain size="mini" @click="hadnleIscompany" icon="iconfont icon-fenxiang">导入</el-button>
          </el-upload>
          <el-upload style="margin-left: 10px;" class="upload-demo" :disabled="authenStatus == 0 ? true : false" name="files" action="" accept=".xls,.xlsx" :show-file-list="false" :auto-upload="false" :on-change="(file, fileList) => handleChangeUpload(file, fileList, 'age')" :file-list="fileList">
            <el-button type="primary" plain size="mini" @click="hadnleIscompany" icon="iconfont icon-fenxiang">年龄导入</el-button>
          </el-upload>
          <!-- <div class="btn_group">
            <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="handleSubmit">保存</el-button>
            <el-button type="warning" size="mini" icon="iconfont icon-shuaxin" @click="handleReload">重置</el-button>
            <el-button type="success" size="mini" icon="el-icon-s-order">单位打单</el-button>
            <el-button type="success" size="mini" icon="el-icon-download">下载模板</el-button>
          </div> -->
          <!-- <permission-btn
            moduleName="unitregistration"
            ref="popoverRefIdc"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          ></permission-btn> -->
          <div class="filter-container">
            <div v-for="(btn, index) of buttons" :key="index">
              <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId)" class="print_box" placement="bottom" trigger="click">
                <el-button type="primary" plain slot="reference" size="mini" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
                <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">打印</div>
                <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
                <div class="print_item" @click="handleExport(btn.domId)">导出Excel</div>
              </el-popover>
              <el-button type="primary" plain v-else size="mini" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" :loading="loading" class="filter-item" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </sticky>
    <!-- 主体数据结构 670px -->
    <div class="app-container">
      <div class="bg-white">
        <el-card class="box-card group_info">
          <div class="head">
            <div class="title">
              <div class="logo"></div>
              分组信息
            </div>
          </div>
          <EasyTable class="group_table" ref="multipleTable" height="100%" row-id="groupid" :data="groupTableData" :tableOptions="tableOptions" :radio-config="{ fetch: true, rowClick: true }" @row-click="handleChecked" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </el-card>
        <!-- 人员导入和明细 -->
        <el-card class="box-card import_detailed">
          <!-- 人员导入 -->
          <div class="import">
            <!-- 头部组件 -->
            <div class="head_box">
              <div class="head">
                <div class="text title">
                  <div class="logo"></div>
                  导入信息
                </div>
                <div class="message" v-if="importTableData.length > 0">
                  未分组人员列表 {{ importTableData.length }} 人
                </div>
                <div class="btn_gropu">
                  <el-button type="primary" size="mini" @click="handleSaveForNoGroups">保存到单位</el-button>
                  <el-button type="primary" size="mini" @click="handleRetrieval">按分组检索</el-button>
                  <el-button type="primary" size="mini" @click="handleSurplus">剩余人员</el-button>
                </div>
              </div>
            </div>
            <!-- 表格数据 -->
            <!-- <EasyTable height="100%" class="bottom_table" @selected-change="handleChangeImport" :data="importTableData" :tableOptions="importOptions" :checkbox-config="{ rowClick: true}" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" /> -->
            <vxe-table ref="importTableData" height="auto" border="inner" show-overflow :loading="loading" highlight-hover-row :data="importTableData" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleChangeImport" @checkbox-all="handleChangeImportAll">
              <vxe-table-column type="checkbox" width="45"></vxe-table-column>
              <vxe-table-column field="name" title="姓名" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="sex" title="性别" width="90px" show-overflow sortable :filters="[
                  { label: '未知', value: 0 },
                  { label: '男', value: 1 },
                  { label: '女', value: 2 },
                ]" :filter-multiple="false">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="年龄" width="90px" show-overflow sortable :filters="[{ data: '' }]" :filter-method="filterAgeMethod">
                <template v-slot:filter="{ $panel, column }">
                  <el-input size="mini" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)">
                  </el-input>
                  <!-- <input
                    type="type"
                    v-for="(option, index) in column.filters"
                    :key="index"
                    v-model="option.data"
                    @input="$panel.changeOption($event, !!option.data, option)"
                  /> -->
                </template>
              </vxe-table-column>
              <vxe-table-column field="groupname" title="分组名称" sortable width="150px" show-overflow :filters="groupNameItems" :filter-multiple="false"></vxe-table-column>
              <vxe-table-column field="combines" title="分组标识" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="marriage" title="婚否" width="80px" show-overflow :filters="marriageItems" :filter-multiple="false"></vxe-table-column>
              <vxe-table-column field="department" title="部门" sortable width="100px" show-overflow :filters="departmentItems" :filter-multiple="false"></vxe-table-column>
              <vxe-table-column field="occupation" title="职务" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="idtype" title="证件类型" width="110px" show-overflow></vxe-table-column>
              <vxe-table-column field="idcard" title="身份证" width="200px" show-overflow></vxe-table-column>
              <vxe-table-column field="birthday" title="出生日期" width="200px" show-overflow></vxe-table-column>
              <vxe-table-column field="telephone" title="电话" width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="seqno" title="序号" width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="jobno" title="员工工号" width="150px" show-overflow></vxe-table-column>
            </vxe-table>
          </div>
          <!-- 中间穿梭按钮组 -->
          <div class="shuttle_btn">
            <el-button type="primary" size="mini" icon="el-icon-arrow-right" @click="handleGoRight"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-d-arrow-right" @click="handleGoRightAll"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="handleGoLeft"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-d-arrow-left" @click="handleGoLeftAll"></el-button>
          </div>
          <!-- 人员明细 -->
          <div class="detailed">
            <!-- 头部组件 -->
            <div class="head_box">
              <div class="head">
                <div class="text title">
                  <div class="logo"></div>
                  人员信息
                </div>
                <div class="message" v-if="chooseGroup">
                  分组【{{ chooseGroup.groupname }}】 人员列表
                  {{ chooseGroup.customeritems.length }}
                  人
                </div>
                <el-button type="primary" class="reset_btn" size="mini" @click="handleResetGroup">刷新</el-button>
              </div>
              <div class="btn_gropu"></div>
            </div>
            <!-- 表格数据 -->
            <!-- <EasyTable height="100%" class="bottom_table" @selected-change="handleChangeDetailed" :data="chooseGroup&&chooseGroup.customeritems" :tableOptions="detailedOptions" :checkbox-config="{rowClick: true}" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" /> -->
            <vxe-table height="auto" border="inner" show-overflow :loading="loading" highlight-hover-row :data="chooseGroup && chooseGroup.customeritems.filter((k) => !k.regid)" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleChangeDetailed" @checkbox-all="handleChangeDetailedAll" :row-class-name="rowClassName">
              <vxe-table-column type="checkbox" width="45"></vxe-table-column>
              <vxe-table-column field="name" title="姓名" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="sex" title="性别" width="80px" show-overflow>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="年龄" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="groupname" title="分组名称" width="150px" show-overflow>
                <template slot-scope="scope">
                  <span>{{ chooseGroup.groupname }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="combines" title="分组标识" width="80px" show-overflow>
                <template slot-scope="scope">
                  <span>{{ chooseGroup.groupmark }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="marriage" title="婚否" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="department" title="部门" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="occupation" title="职务" width="80px" show-overflow></vxe-table-column>
              <vxe-table-column field="idcard" title="身份证" width="200px" show-overflow></vxe-table-column>
              <vxe-table-column field="checkdate" title="预约日期" width="160px" show-overflow></vxe-table-column>
              <vxe-table-column field="birthday" title="出生日期" width="200px" show-overflow></vxe-table-column>
              <vxe-table-column field="telephone" title="手机号" width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="regid" title="体检号" width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="seqno" title="序号" width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="jobno" title="员工工号" width="150px" show-overflow></vxe-table-column>
            </vxe-table>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 套餐明细弹框 -->
    <el-dialog class="dialog-mini detailed_dialog" width="45%" top="10%" :close-on-click-modal="false" :visible.sync="showDetailed" @close="handleCloseDialog">
      <!-- 标题和按钮 -->
      <div class="head_box">
        <div class="title">套餐明细</div>
        <el-button type="warning" size="small" @click="handleCloseDialog">关闭</el-button>
      </div>
      <!-- 表格数据 -->
      <!-- 表格数据 -->
      <EasyTable class="detailed_table" height="500px" row-id="groupid" :data="detailedDialogData" :tableOptions="detailedDialogOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
    </el-dialog>
    <!-- 重复数据弹框 -->
    <el-dialog title="操作重复数据" class="repeatDialog" :visible.sync="showRepeat" :close-on-click-modal="false" width="50%" :show-close="false" v-if="uploadData">
      <vxe-table height="auto" border="inner" show-overflow :loading="loading" highlight-hover-row :data="uploadData.repeatitems" :sort-config="{ trigger: 'cell' }">
        <vxe-table-column field="name" title="姓名" width="80px" show-overflow></vxe-table-column>
        <vxe-table-column field="sex" title="性别" width="80px" show-overflow>
          <template slot-scope="scope">
            <span>{{
              scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="age" title="年龄" width="80px" show-overflow></vxe-table-column>
        <vxe-table-column field="combines" title="分组标识" width="80px" show-overflow></vxe-table-column>
        <vxe-table-column field="marriage" title="婚否" width="80px" show-overflow></vxe-table-column>
        <vxe-table-column field="department" title="部门" width="80px" show-overflow></vxe-table-column>
        <vxe-table-column field="occupation" title="职务" width="80px" show-overflow></vxe-table-column>
        <vxe-table-column field="idcard" title="身份证" width="200px" show-overflow></vxe-table-column>
        <vxe-table-column field="birthday" title="出生日期" width="200px" show-overflow></vxe-table-column>
        <vxe-table-column field="telephone" title="电话" width="150px" show-overflow></vxe-table-column>
        <vxe-table-column field="seqno" title="序号" width="150px" show-overflow></vxe-table-column>
      </vxe-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleRepeatCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleRepeatConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览弹框 -->
    <el-dialog title="预览" class="preview_box" :visible.sync="showPreview" width="850px" @close="handleClosePreview">
      <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 147px)"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import * as company_archives from "@/api/company_archives";
import { printStaticsBase64 } from "@/api/printreport.js";

import {
  getCompanyList,
  getRegisterList,
  getDetailedList,
  getFilesUpload,
  getCustomerData,
  setCompanySubmit,
  getDownLoad,
  setFilesDelete,
  getCheckExportRepeat,
  setUploadByZip,
  getCustomerDataAlias,
  getCustomerAgeDataAlias,
  saveForNoGroups,
  CombineAndChooseList,
  SameDataRegister,
} from "@/api/unitregistration.js";
import { getSysConfigInfo } from "@/api/sysconfig";

import { printBase64 } from "@/api/printreport.js";
import { mapGetters } from "vuex";

export default {
  name: "unitregistration",

  components: { Sticky, permissionBtn },

  data() {
    return {
      selectLoading: false,
      authenStatus: 1, //是否允许文件上传  0否 1是
      regid: "",
      fileList: [], // 文件上传列表
      fileObj: undefined, // 文件上传对象
      showDetailed: false, // 显示套餐明细弹出层
      company: "", // 公司
      companyArr: [], // 公司下拉数据
      batchCode: "", // 批次号
      batchCodeArr: [], // 批次号下拉数据
      groupTableData: [], // 分组信息表格数据
      importTableData: [], // 导入信息表格数据
      detailedTableData: [], // 人员明细表格数据
      detailedDialogData: [], // 套餐明细表格数据
      chooseGroup: undefined, // 当前选中分组
      importSeleceData: [], // 导入数据 当前选中
      detailedSeleceData: [], // 人员信息数据 当前选中
      retrievalData: [], // 分组检索人员列表
      surplusData: [], // 剩余人员列表
      tempArr: [], // 导入数据源
      loading: false,
      uploadData: undefined, // 文件导入数据
      showRepeat: false, // 暂时重复数据弹框
      combineList: [],
      domIdArr: ["btnPersonnelList"],
      buttons: [],
      showPreview: false,
      pdfUrl: "",
      tempSuffix: "xls",
      groupNameItems: [],
      marriageItems: [],
      departmentItems: [],
      hospitalsFlag: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 主体套餐表格配置
    tableOptions() {
      return [
        {
          title: "分组名称",
          prop: "groupname",
          width: 350,
          omit: 1,
        },
        {
          title: "分组标识",
          prop: "groupmark",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          omit: 1,
          returnVal: (value) =>
            value == 0 ? "未知" : value == 1 ? "男" : "女",
        },
        {
          title: "年龄范围",
          prop: "minage",
          omit: 1,
          returnVal: (value, row) => `${row.minage} - ${row.maxage}`,
        },
        {
          title: "婚否",
          prop: "marriage",
          omit: 1,
        },
        {
          title: "实际人数",
          prop: "realtotal",
          omit: 1,
        },
        {
          title: "预约人数",
          prop: "grouptotal",
          omit: 1,
        },
        {
          title: "所属部门",
          prop: "department",
          omit: 1,
        },
        {
          title: "原价",
          prop: "originalprice",
          omit: 1,
        },
        {
          title: "折扣",
          prop: "discount",
          omit: 1,
        },
        {
          title: "折后价格",
          prop: "discountprice",
          omit: 1,
        },
        {
          title: "分组编号",
          prop: "groupcode",
          omit: 1,
        },
        {
          title: "套餐详情",
          render: (h, data) => {
            return (
              <el-button
                type="primary"
                size="mini"
                plain
                vOn:click_stop_prevent={() =>
                  this.handleSeeDetailed(data.groupid)
                }
              >
                体检组合
              </el-button>
            );
          },
        },
      ];
    },
    // 导入信息表格配置
    importOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "姓名",
          prop: "name",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value, row) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
          omit: 1,
        },
        {
          title: "年龄",
          prop: "age",
          omit: 1,
        },
        {
          title: "分组标识",
          prop: "combines",
          omit: 1,
        },
        {
          title: "婚否",
          prop: "marriage",
          omit: 1,
        },
        {
          title: "部门",
          prop: "department",
          omit: 1,
        },
        {
          title: "职务",
          prop: "occupation",
          omit: 1,
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 180,
          omit: 1,
        },
        {
          title: "出生日期",
          prop: "birthday",
          width: 110,
          omit: 1,
        },
        {
          title: "手机号",
          prop: "telephone",
          width: 110,
          omit: 1,
        },
      ];
    },
    // 人员明细表格配置
    detailedOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "姓名",
          prop: "name",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value, row) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
          omit: 1,
        },
        {
          title: "年龄",
          prop: "age",
          omit: 1,
        },
        {
          title: "婚否",
          prop: "marriage",
          omit: 1,
        },
        {
          title: "部门",
          prop: "department",
          omit: 1,
        },
        {
          title: "职务",
          prop: "occupation",
          omit: 1,
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 180,
          omit: 1,
        },
        {
          title: "出生日期",
          prop: "birthday",
          width: 110,
          omit: 1,
        },
        {
          title: "手机号",
          prop: "telephone",
          width: 110,
          omit: 1,
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 110,
          omit: 1,
        },
      ];
    },
    // 套餐明细表格配置
    detailedDialogOptions() {
      return [
        {
          title: "组合编码",
          prop: "combinecode",
          width: 100,
        },
        {
          title: "组合名称",
          prop: "combinename",
          width: 250,
          omit: 1,
        },
        {
          title: "价格",
          prop: "originalprice",
          omit: 1,
        },
        {
          title: "折扣",
          prop: "discount",
          omit: 1,
        },
        {
          title: "折后金额",
          prop: "discountprice",
          omit: 1,
        },
      ];
    },
  },
  async mounted() {
    let jump = await getSysConfigInfo({
      cc: "Sys_Module_Jump",
    });
    this.hospitalsFlag = (jump && jump.result) || "index";
    console.log(this.hospitalsFlag, "hospitalsFlag");
    //   页面加载获取单位列表信息
    this.handleGetCompanyList();
    getSysConfigInfo({
      cc: "Sys_Download_Template",
    }).then((res) => {
      if (!res.result) return;
      this.tempSuffix = res.result;
    });
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
  },

  methods: {
    handleSameDataRegister() {
      if (!this.company) {
        this.$message.error("请先选择单位信息!");
        this.authenStatus = 0;
        return false;
      }
      SameDataRegister({
        companycode: this.company,
        batch: this.batchCode,
      }).then((res) => {
        this.$message.success(res.message || res.msg);
      });
    },
    rowClassName({ row }) {
      // if (this.hospitalsFlag == "index_gyey" && row.regid) {
      //   return "hidden-row";
      // }
      return "";
    },
    filterAgeMethod({ option, row }) {
      if (!option.data.trim().includes("-")) {
        this.$message.warning("请输入正确的年龄范围格式! 例: 1-2 ");
        return row.age;
      }
      let min = option.data.trim().split("-")[0];
      let max = option.data.trim().split("-")[1];
      return row.age >= Number(min) && row.age <= Number(max);
    },
    handleRemoveRepeat(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.value, item);
      }
      return [...map.values()];
    },
    // 保存到单位回调
    handleSaveForNoGroups() {
      if (this.importTableData.length == 0) {
        this.$message.warning("请先导入信息!");
        return false;
      }
      let findObj = this.companyArr.filter(
        (k) => k.companycode == this.company
      )[0];
      saveForNoGroups({
        regid: this.regid,
        companycode: this.company,
        companyname: findObj.companyname,
        batch: this.batchCode,
        groupitems: this.groupTableData,
        customeritems: this.importTableData,
      }).then((res) => {
        this.$message.success(
          `保存成功! ${
            this.importTableData.length > 0
              ? "成功导入人数 " + this.importTableData.length
              : ""
          }`
        );
        this.importTableData = [];
        this.handleGetRegisterList();
      });
    },
    // 数据重复弹框取消回调
    handleRepeatCancel() {
      setFilesDelete([this.fileObj.id]).then((res) => {
        this.$message.success(res.message);
      });
      this.showRepeat = false;
    },
    // 数据重复弹框确认回调
    handleRepeatConfirm() {
      this.showRepeat = false;
      if (this.uploadData.customeritems.length === 0) return;
      let tempArr = JSON.parse(JSON.stringify(this.uploadData.customeritems));
      let spliceArr = tempArr.splice(0, 5);
      let findObj = this.companyArr.filter(
        (k) => k.companycode == this.company
      )[0];
      getCheckExportRepeat({
        regid: this.regid,
        companycode: this.company,
        companyname: findObj.companyname,
        batch: this.batchCode,
        groupitems: [{ customeritems: spliceArr }],
      })
        .then((res) => {
          if (res.result === null) return;
          if (res.result) {
            this.$confirm("文档部分人员已导入", "系统提示", {
              confirmButtonText: "继续导入",
              cancelButtonText: "取消",
              showClose: false,
              type: "warning",
            })
              .then(() => {
                this.importTableData = this.uploadData.customeritems.map(
                  (value) => {
                    return {
                      regid: value.regid || "",
                      regdate: value.regdate || "",
                      checkno: value.checkno || "",
                      healthcard: value.healthcard || "",
                      name: value.name || "",
                      sex: value.sex,
                      seqno: value.seqno || "",
                      age: +value.age || 0,
                      birthday: value.birthday || "",
                      marriage: value.marriage || "",
                      nation: value.nation || "",
                      nativeplace: value.nativeplace || "",
                      occupation: value.occupation || "",
                      telephone: value.telephone || "",
                      email: value.email || "",
                      combines: value.combines || "",
                      address: value.address || "",
                      idcard: value.idcard || "",
                      hiscode: value.hiscode || "",
                      department: value.department || "",
                      level: value.level || 0,
                      companycode: value.companycode || "",
                      companyname: value.companyname || "",
                      batch: value.batch || "",
                      groupcode: value.groupcode || "",
                      groupname: value.groupname || "",
                      checkdate: value.checkdate || "",
                      reporttake: value.reporttake || "",
                      personalflag: value.personalflag || 0,
                      updatestatus: value.updatestatus || 1,
                      quota: value.quota,
                      idtype: value.idtype || "",
                      department2: value.department2 || "",
                      department3: value.department3 || "",
                      department4: value.department4 || "",
                      medicalhistory: value.medicalhistory || "",
                      remark: value.remark || "",
                      combinecodeitems: value.combinecodeitems || "",
                      worktypename: value.worktypename || "",
                      workyear: value.workyear || "",
                      harmwordname: value.harmwordname || "",
                      laborservicesflag: value.laborservicesflag || "",
                    };
                  }
                );
                this.tempArr = Object.assign([], this.importTableData);
                const xTable = this.$refs.importTableData;
                const groupnamecolumn = xTable.getColumnByField("groupname");
                const marriagecolumn = xTable.getColumnByField("marriage");
                const departmentcolumn = xTable.getColumnByField("department");
                this.groupNameItems = this.importTableData.map((k) => {
                  return {
                    label: k.groupname,
                    value: k.groupname,
                  };
                });
                this.groupNameItems = this.handleRemoveRepeat(
                  this.groupNameItems
                );
                this.marriageItems = this.importTableData.map((k) => {
                  return {
                    label: k.marriage,
                    value: k.marriage,
                  };
                });
                this.marriageItems = this.handleRemoveRepeat(
                  this.marriageItems
                );
                this.departmentItems = this.importTableData.map((k) => {
                  return {
                    label: k.department,
                    value: k.department,
                  };
                });
                this.departmentItems = this.handleRemoveRepeat(
                  this.departmentItems
                );
                xTable.setFilter(groupnamecolumn, this.groupNameItems);
                xTable.setFilter(marriagecolumn, this.marriageItems);
                xTable.setFilter(departmentcolumn, this.departmentItems);
                this.$message.success(res.message);
                this.loading = false;
              })
              .catch(() => {
                this.handleRepeatCancel();
              });
          } else {
            this.importTableData = this.uploadData.customeritems.map(
              (value) => {
                return {
                  regid: value.regid || "",
                  regdate: value.regdate || "",
                  checkno: value.checkno || "",
                  healthcard: value.healthcard || "",
                  name: value.name || "",
                  sex: value.sex,
                  seqno: value.seqno || "",
                  age: +value.age || 0,
                  birthday: value.birthday || "",
                  marriage: value.marriage || "",
                  nation: value.nation || "",
                  nativeplace: value.nativeplace || "",
                  occupation: value.occupation || "",
                  telephone: value.telephone || "",
                  email: value.email || "",
                  combines: value.combines || "",
                  address: value.address || "",
                  idcard: value.idcard || "",
                  hiscode: value.hiscode || "",
                  department: value.department || "",
                  level: value.level || 0,
                  companycode: value.companycode || "",
                  companyname: value.companyname || "",
                  batch: value.batch || "",
                  groupcode: value.groupcode || "",
                  groupname: value.groupname || "",
                  checkdate: value.checkdate || "",
                  reporttake: value.reporttake || "",
                  personalflag: value.personalflag || 0,
                  updatestatus: value.updatestatus || 1,
                  quota: value.quota,
                  idtype: value.idtype || "",
                  department2: value.department2 || "",
                  department3: value.department3 || "",
                  department4: value.department4 || "",
                  medicalhistory: value.medicalhistory || "",
                  remark: value.remark || "",
                  combinecodeitems: value.combinecodeitems || "",
                  worktypename: value.worktypename || "",
                  workyear: value.workyear || "",
                  harmwordname: value.harmwordname || "",
                  laborservicesflag: value.laborservicesflag || "",
                };
              }
            );
            this.tempArr = Object.assign([], this.importTableData);
            const xTable = this.$refs.importTableData;
            const groupnamecolumn = xTable.getColumnByField("groupname");
            const marriagecolumn = xTable.getColumnByField("marriage");
            const departmentcolumn = xTable.getColumnByField("department");
            this.groupNameItems = this.importTableData.map((k) => {
              return {
                label: k.groupname,
                value: k.groupname,
              };
            });
            this.groupNameItems = this.handleRemoveRepeat(this.groupNameItems);
            this.marriageItems = this.importTableData.map((k) => {
              return {
                label: k.marriage,
                value: k.marriage,
              };
            });
            this.marriageItems = this.handleRemoveRepeat(this.marriageItems);
            this.departmentItems = this.importTableData.map((k) => {
              return {
                label: k.department,
                value: k.department,
              };
            });
            this.departmentItems = this.handleRemoveRepeat(
              this.departmentItems
            );
            xTable.setFilter(groupnamecolumn, this.groupNameItems);
            xTable.setFilter(marriagecolumn, this.marriageItems);
            xTable.setFilter(departmentcolumn, this.departmentItems);
            this.$message.success(res.message);
            this.loading = false;
          }
        })
        .catch(() => {
          this.handleRepeatCancel();
        });
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
    // 预览窗口关闭
    handleClosePreview() {
      this.pdfUrl = "";
      this.showPreview = false;
    },
    handleExport() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "人员清单") {
          if (!this.company) {
            this.$message({
              showClose: true,
              message: "请选择选中单位再进行导出人员清单!",
              type: "error",
            });
            return false;
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [],
            repname: d.$children[0].$attrs["data-remark"],
            filetype: "xlsx",
            outtype: "url",
            xlsstartrowindex: 2,
            whereitems: [
              {
                key: "companycode",
                value: this.company,
              },
            ],
          };
          printStaticsBase64(data).then((res) => {
            let url = res.data[0].fileurl;
            const a = document.createElement("a");
            a.href = url;
            a.download = d.$children[0].$attrs["data-remark"]; // 下载文件的名字
            document.body.appendChild(a);
            a.click();
          });
        }
      });
    },
    // 文件打印预览
    handlePreview(domId) {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (!this.company) {
        this.$message({
          showClose: true,
          message: "请选择选中单位再进行导出人员清单!",
          type: "error",
        });
        return false;
      }
      this.showPreview = true;
      switch (domId) {
        case "btnPersonnelList": // 报告书
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "人员清单") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [
                  {
                    key: "companycode",
                    value: this.company,
                  },
                ],
              };
              printStaticsBase64(data).then((res) => {
                let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                let raw = window.atob(code);
                let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                  uInt8Array[i] = raw.charCodeAt(i);
                }
                let url = window.URL.createObjectURL(
                  new Blob([uInt8Array], { type: "application/pdf" })
                );
                if (url) this.showPreview = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        default:
          break;
      }
    },
    handleRemoteMethod(val) {
      console.log(val);
      this.selectLoading = true;
      setTimeout(() => {
        this.selectLoading = false;
        company_archives
          .CompanyRegisterLoad({
            page: 1,
            limit: 100000,
            key: val,
          })
          .then((res) => {
            this.companyArr = res.data;
          });
      }, 200);
    },
    // 点击保存数据回调
    handleSubmit() {
      this.loading = true;
      let findObj = this.companyArr.filter(
        (k) => k.companycode == this.company
      )[0];
      let tempCount = [];
      this.groupTableData.forEach((k) => {
        k.customeritems.forEach((item) => {
          item.seqno = +item.seqno;
        });
        k.customeritems &&
          tempCount.push(
            ...k.customeritems.filter((item) => {
              return !item.regid;
            })
          );
      });
      setCompanySubmit({
        regid: this.regid,
        companycode: this.company,
        companyname: findObj.companyname,
        batch: this.batchCode,
        groupitems: this.groupTableData,
      })
        .then((res) => {
          this.$message.success(
            `保存成功! ${
              tempCount.length > 0 ? "成功导入人数 " + tempCount.length : ""
            }`
          );
          this.loading = false;
          this.handleGetRegisterList();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 点击分组检索回调
    handleRetrieval() {
      if (this.importTableData.length == 0) {
        this.$message.warning("请先导入信息!");
        return false;
      }
      this.importTableData = Object.assign([], this.tempArr);
      let groupmark = this.chooseGroup.groupmark; // 分组标识
      let sex =
        this.chooseGroup.sex == 0
          ? ""
          : this.chooseGroup.sex == 1
          ? "男"
          : "女"; // 性别 未知不进入判断
      let ageMin = this.chooseGroup.minage; //年龄范围小
      let ageMax = this.chooseGroup.maxage; //年龄范围大
      let marriage = this.chooseGroup.marriage; //婚否
      // 性别/标识筛选
      let search = this.importTableData.filter((k) => {
        return this.chooseGroup.groupname === k.groupname;
        // if (groupmark) {
        //   // 分组标识
        //   return groupmark == k.combines;
        // } else if (sex && ageMax > 0 && marriage) {
        //   // 性别 年龄范围 婚否
        //   let isSex = k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女";
        //   return (
        //     sex === isSex &&
        //     ageMin <= +k.age &&
        //     ageMax >= +k.age &&
        //     marriage === k.marriage
        //   );
        // } else if (sex && ageMax > 0) {
        //   // 性别 年龄范围
        //   let isSex = k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女";
        //   return sex === isSex && ageMin <= +k.age && ageMax >= +k.age;
        // } else if (sex && marriage) {
        //   // 性别  婚否
        //   let isSex = k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女";
        //   return sex === isSex && marriage === k.marriage;
        // } else if (ageMax > 0 && marriage) {
        //   // 年龄范围 婚否
        //   return (
        //     ageMin <= +k.age && ageMax >= +k.age && marriage === k.marriage
        //   );
        // } else if (sex) {
        //   // 性别
        //   let isSex = k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女";
        //   return sex === isSex;
        // } else if (ageMax > 0) {
        //   // 年龄范围
        //   return ageMin <= +k.age && ageMax >= +k.age;
        // } else if (marriage > 0) {
        //   // 婚否
        //   return marriage === k.marriage;
        // }
        //  源判断
        // let isSex = k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女";
        // return (
        //     k.combines == sex ||
        //     (isSex == sex &&
        //       (!groupmark ||
        //         (groupmark && (k.combines == groupmark || isSex == groupmark))))
        //   );
        // return flag && flag == k.groupname;
      });
      // $index
      let delIndex = search.map((item) => {
        return item.$index;
      });
      this.importTableData.forEach((item, index) => {
        if (delIndex.includes(item.$index)) {
          this.importTableData.splice(index, 1, undefined);
        }
      });
      this.surplusData = this.importTableData.filter((k) => k);
      this.importTableData = search;
    },
    // 剩余人员回调
    handleSurplus() {
      this.importTableData = Object.assign([], this.tempArr);
      // this.importTableData = this.surplusData;
    },
    // 勾选导入数据复选框回调
    handleChangeImport(rows) {
      this.importSeleceData = rows;
    },
    handleChangeImport({ records }) {
      this.importSeleceData = records;
    },
    // 勾选导入数据复选框回调
    handleChangeImportAll({ records }) {
      this.importSeleceData = records;
    },
    // 勾选人员明细数据复选框回调
    handleChangeDetailed(rows) {
      this.detailedSeleceData = rows;
    },

    handleChangeDetailed({ records }) {
      this.detailedSeleceData = records;
    },
    // 勾选人员明细数据复选框回调
    handleChangeDetailedAll({ records }) {
      this.detailedSeleceData = records;
    },
    // 点击穿梭选中数据到右边回调
    handleGoRight() {
      if (this.importSeleceData.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选数据!",
          type: "warning",
        });
        return false;
      }
      let delArr = [];
      // name  idcard
      this.importSeleceData.forEach((item, index) => {
        let flag = this.chooseGroup.customeritems.findIndex(
          (k) => k.name == item.name && k.idcard == item.idcard
        );
        if (flag > -1) {
          this.$message.warning("已为你跳过重复人员!");
        } else if (
          item.sex != this.chooseGroup.sex &&
          this.chooseGroup.sex != 0
        ) {
          this.$message.warning(`${item.name}性别与当前分组不符!`);
        } else {
          this.chooseGroup.customeritems.push(item);
          // let index = this.groupTableData.findIndex(
          //   (k) => k.regid == this.chooseGroup.regid
          // );
          // index > -1 && this.groupTableData[index].customeritems.push(item);
          delArr.push(item);
        }
      });
      delArr.forEach((k) => {
        this.importTableData.forEach((item, index) => {
          if (k.name == item.name && k.idcard == item.idcard) {
            this.importTableData.splice(index, 1);
          }
        });
      });
      delArr.forEach((k) => {
        this.tempArr.forEach((item, index) => {
          if (k.name == item.name && k.idcard == item.idcard) {
            this.tempArr.splice(index, 1);
          }
        });
      });
      console.log(this.tempArr.length);
      // this.chooseGroup.customeritems.push(...this.importSeleceData);
      // let delArr = this.importSeleceData.map((item) => {
      //   return item.name;
      // });
      // delArr.forEach((k) => {
      //   this.importTableData.forEach((item, index) => {
      //     if (k === item.name) {
      //       this.importTableData.splice(index, 1);
      //     }
      //   });
      // });
      // this.importTableData = this.importTableData.filter((k) => k);
      // this.tempArr = Object.assign([], this.importTableData);
    },
    // 点击穿梭所有数据到右边回调
    handleGoRightAll() {
      if (this.importTableData.length == 0) {
        this.$message({
          showClose: true,
          message: "请先导入模板数据!",
          type: "warning",
        });
        return false;
      }
      this.importSeleceData = this.importTableData;
      this.handleGoRight();
      return false;
      let res = this.importTableData.splice(0, this.importTableData.length);
      this.chooseGroup.customeritems.push(...res);
      res.forEach((item) => {
        this.tempArr.forEach((k, i) => {
          if (item.name == k.name && item.idcard == k.idcard) {
            this.tempArr.splice(i, 1);
          }
        });
      });
      // this.tempArr = [];
    },
    // 点击穿梭选中数据到左边回调
    handleGoLeft() {
      if (this.detailedSeleceData.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选数据!",
          type: "warning",
        });
        return false;
      }
      let flag = false; // 判断是否含有不可编辑数据
      let noDel = this.detailedSeleceData.filter((k) => k.updatestatus == 0);
      let delArr = this.detailedSeleceData.filter((k) => k.updatestatus != 0);
      if (noDel.length > 0) {
        this.$message({
          showClose: true,
          message: "已为你跳过不可编辑数据!",
          type: "warning",
        });
      }
      if (delArr.length > 0) {
        this.importTableData.push(...delArr);
        this.tempArr.push(...delArr);
        // this.tempArr = Object.assign([], this.importTableData);
        let delname = delArr.map((item) => {
          return item.name;
        });
        this.chooseGroup.customeritems.forEach((item, index) => {
          if (delname.includes(item.name) && item.updatestatus != 0) {
            this.chooseGroup.customeritems.splice(index, 1, undefined);
          }
        });
      }
      this.chooseGroup.customeritems = this.chooseGroup.customeritems.filter(
        (k) => k
      );
    },
    // 点击穿梭所有数据到左边回调
    handleGoLeftAll() {
      let editArr = this.chooseGroup.customeritems.filter(
        (k) => k.updatestatus == 1
      );
      let noEditArr = this.chooseGroup.customeritems.filter(
        (k) => k.updatestatus == 0
      );
      this.importTableData.push(...editArr);
      this.chooseGroup.customeritems = noEditArr;
      this.tempArr.push(...editArr);
      // this.tempArr = Object.assign([], this.importTableData);
    },
    // 文件上传前触发钩子
    hadnleIsCompanyPicture() {
      if (!this.company) {
        this.$message.error("请先选择单位信息!");
        this.authenStatus = 0;
        return false;
      }
    },
    // 文件上传前触发钩子
    hadnleIscompany() {
      if (!this.company) {
        this.$message.error("请先选择单位信息!");
        this.authenStatus = 0;
        return false;
      }
    },
    // 照片批量导入上传
    handleChangeUploadPicture(file, fileList) {
      let flag = file.name.split(".");
      if (!["zip", "rar"].includes(flag[flag.length - 1])) {
        this.$message.warning("请上传压缩包格式!");
        return;
      }
      let data = new FormData();
      data.append("files", file.raw);
      getFilesUpload(data).then((res) => {
        setUploadByZip({
          companycode: this.company,
          batch: this.batchCode,
          fileid: res.result[0].id,
        }).then((returnData) => {
          this.$message.success(returnData.message);
        });
      });
    },
    // 文件导入上传
    handleChangeUpload(file, fileList, fileType) {
      this.loading = true;
      let data = new FormData();
      data.append("files", file.raw);
      getFilesUpload(data).then((res) => {
        this.fileObj = res.result[0];
        if (this.fileObj) {
          getCustomerDataAlias({
            fileId: this.fileObj.id,
            fileType: fileType,
          })
            .then((res) => {
              console.log(res, "-------");
              this.uploadData = JSON.parse(JSON.stringify(res.result));
              if (!res.result) return;
              if (this.uploadData.nameerroritems.length > 0) {
                this.$confirm(
                  `${this.uploadData.nameerroritems.join(
                    ","
                  )}非法姓名/年龄是否确认导入`,
                  "系统提示",
                  {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    showClose: false,
                    type: "warning",
                    customClass: "detectionBox",
                  }
                )
                  .then(() => {
                    if (this.uploadData.repeatitems.length > 0) {
                      this.showRepeat = true;
                      this.loading = false;
                    } else {
                      this.loading = false;
                      let tempArr = JSON.parse(
                        JSON.stringify(this.uploadData.customeritems)
                      );
                      let spliceArr = tempArr.splice(0, 5);
                      let findObj = this.companyArr.filter(
                        (k) => k.companycode == this.company
                      )[0];
                      getCheckExportRepeat({
                        regid: this.regid,
                        companycode: this.company,
                        companyname: findObj.companyname,
                        batch: this.batchCode,
                        groupitems: [{ customeritems: spliceArr }],
                      })
                        .then((res) => {
                          if (res.result === null) return;
                          if (res.result) {
                            this.$confirm("文档部分人员已导入", "系统提示", {
                              confirmButtonText: "继续导入",
                              cancelButtonText: "取消",
                              showClose: false,
                              type: "warning",
                            })
                              .then(() => {
                                this.importTableData =
                                  this.uploadData.customeritems.map((value) => {
                                    return {
                                      regid: value.regid || "",
                                      regdate: value.regdate || "",
                                      checkno: value.checkno || "",
                                      healthcard: value.healthcard || "",
                                      name: value.name || "",
                                      sex: value.sex,
                                      seqno: value.seqno || "",
                                      age: +value.age || 0,
                                      birthday: value.birthday || "",
                                      marriage: value.marriage || "",
                                      nation: value.nation || "",
                                      nativeplace: value.nativeplace || "",
                                      occupation: value.occupation || "",
                                      telephone: value.telephone || "",
                                      email: value.email || "",
                                      combines: value.combines || "",
                                      address: value.address || "",
                                      idcard: value.idcard || "",
                                      hiscode: value.hiscode || "",
                                      department: value.department || "",
                                      level: value.level || 0,
                                      companycode: value.companycode || "",
                                      companyname: value.companyname || "",
                                      batch: value.batch || "",
                                      groupcode: value.groupcode || "",
                                      groupname: value.groupname || "",
                                      checkdate: value.checkdate || "",
                                      reporttake: value.reporttake || "",
                                      personalflag: value.personalflag || 0,
                                      updatestatus: value.updatestatus || 1,
                                      jobno: value.jobno || "",
                                      studentnumber: value.studentnumber || "",
                                      jobin: value.jobin || "",
                                      positionin: value.positionin || "",
                                      medicalcertify:
                                        value.medicalcertify || "",
                                      quota: value.quota,
                                      idtype: value.idtype || "",
                                      department2: value.department2 || "",
                                      department3: value.department3 || "",
                                      department4: value.department4 || "",
                                      medicalhistory:
                                        value.medicalhistory || "",
                                      remark: value.remark || "",
                                      combinecodeitems:
                                        value.combinecodeitems || "",
                                      worktypename: value.worktypename || "",
                                      workyear: value.workyear || "",
                                      harmwordname: value.harmwordname || "",
                                      laborservicesflag:
                                        value.laborservicesflag || "",
                                    };
                                  });
                                this.tempArr = Object.assign(
                                  [],
                                  this.importTableData
                                );
                                const xTable = this.$refs.importTableData;
                                const groupnamecolumn =
                                  xTable.getColumnByField("groupname");
                                const marriagecolumn =
                                  xTable.getColumnByField("marriage");
                                const departmentcolumn =
                                  xTable.getColumnByField("department");
                                this.groupNameItems = this.importTableData.map(
                                  (k) => {
                                    return {
                                      label: k.groupname,
                                      value: k.groupname,
                                    };
                                  }
                                );
                                this.groupNameItems = this.handleRemoveRepeat(
                                  this.groupNameItems
                                );
                                this.marriageItems = this.importTableData.map(
                                  (k) => {
                                    return {
                                      label: k.marriage,
                                      value: k.marriage,
                                    };
                                  }
                                );
                                this.marriageItems = this.handleRemoveRepeat(
                                  this.marriageItems
                                );
                                this.departmentItems = this.importTableData.map(
                                  (k) => {
                                    return {
                                      label: k.department,
                                      value: k.department,
                                    };
                                  }
                                );
                                this.departmentItems = this.handleRemoveRepeat(
                                  this.departmentItems
                                );
                                xTable.setFilter(
                                  groupnamecolumn,
                                  this.groupNameItems
                                );
                                xTable.setFilter(
                                  marriagecolumn,
                                  this.marriageItems
                                );
                                xTable.setFilter(
                                  departmentcolumn,
                                  this.departmentItems
                                );
                                this.$message.success(res.message);
                                this.loading = false;
                              })
                              .catch(() => {
                                this.handleRepeatCancel();
                              });
                          } else {
                            this.importTableData =
                              this.uploadData.customeritems.map((value) => {
                                return {
                                  regid: value.regid || "",
                                  regdate: value.regdate || "",
                                  checkno: value.checkno || "",
                                  healthcard: value.healthcard || "",
                                  name: value.name || "",
                                  sex: value.sex,
                                  seqno: value.seqno || "",
                                  age: +value.age || 0,
                                  birthday: value.birthday || "",
                                  marriage: value.marriage || "",
                                  nation: value.nation || "",
                                  nativeplace: value.nativeplace || "",
                                  occupation: value.occupation || "",
                                  telephone: value.telephone || "",
                                  email: value.email || "",
                                  combines: value.combines || "",
                                  address: value.address || "",
                                  idcard: value.idcard || "",
                                  hiscode: value.hiscode || "",
                                  department: value.department || "",
                                  level: value.level || 0,
                                  companycode: value.companycode || "",
                                  companyname: value.companyname || "",
                                  batch: value.batch || "",
                                  groupcode: value.groupcode || "",
                                  groupname: value.groupname || "",
                                  checkdate: value.checkdate || "",
                                  reporttake: value.reporttake || "",
                                  personalflag: value.personalflag || 0,
                                  updatestatus: value.updatestatus || 1,
                                  jobno: value.jobno || "",
                                  studentnumber: value.studentnumber || "",
                                  jobin: value.jobin || "",
                                  positionin: value.positionin || "",
                                  medicalcertify: value.medicalcertify || "",
                                  quota: value.quota,
                                  idtype: value.idtype || "",
                                  department2: value.department2 || "",
                                  department3: value.department3 || "",
                                  department4: value.department4 || "",
                                  medicalhistory: value.medicalhistory || "",
                                  remark: value.remark || "",
                                  combinecodeitems:
                                    value.combinecodeitems || "",
                                  worktypename: value.worktypename || "",
                                  workyear: value.workyear || "",
                                  harmwordname: value.harmwordname || "",
                                  laborservicesflag:
                                    value.laborservicesflag || "",
                                };
                              });
                            this.tempArr = Object.assign(
                              [],
                              this.importTableData
                            );
                            const xTable = this.$refs.importTableData;
                            const groupnamecolumn =
                              xTable.getColumnByField("groupname");
                            const marriagecolumn =
                              xTable.getColumnByField("marriage");
                            const departmentcolumn =
                              xTable.getColumnByField("department");
                            this.groupNameItems = this.importTableData.map(
                              (k) => {
                                return {
                                  label: k.groupname,
                                  value: k.groupname,
                                };
                              }
                            );
                            this.groupNameItems = this.handleRemoveRepeat(
                              this.groupNameItems
                            );
                            this.marriageItems = this.importTableData.map(
                              (k) => {
                                return {
                                  label: k.marriage,
                                  value: k.marriage,
                                };
                              }
                            );
                            this.marriageItems = this.handleRemoveRepeat(
                              this.marriageItems
                            );
                            this.departmentItems = this.importTableData.map(
                              (k) => {
                                return {
                                  label: k.department,
                                  value: k.department,
                                };
                              }
                            );
                            this.departmentItems = this.handleRemoveRepeat(
                              this.departmentItems
                            );
                            xTable.setFilter(
                              groupnamecolumn,
                              this.groupNameItems
                            );
                            xTable.setFilter(
                              marriagecolumn,
                              this.marriageItems
                            );
                            xTable.setFilter(
                              departmentcolumn,
                              this.departmentItems
                            );
                            this.$message.success(res.message);
                            this.loading = false;
                          }
                        })
                        .catch(() => {
                          this.handleRepeatCancel();
                        });
                    }
                  })
                  .catch(() => {
                    this.loading = false;
                    this.handleRepeatCancel();
                  });
              } else {
                if (this.uploadData.repeatitems.length > 0) {
                  this.showRepeat = true;
                  this.loading = false;
                } else {
                  this.loading = false;
                  let tempArr = JSON.parse(
                    JSON.stringify(this.uploadData.customeritems)
                  );
                  let spliceArr = tempArr.splice(0, 5);
                  let findObj = this.companyArr.filter(
                    (k) => k.companycode == this.company
                  )[0];
                  getCheckExportRepeat({
                    regid: this.regid,
                    companycode: this.company,
                    companyname: findObj.companyname,
                    batch: this.batchCode,
                    groupitems: [{ customeritems: spliceArr }],
                  })
                    .then((res) => {
                      if (res.result === null) return;
                      if (res.result) {
                        this.$confirm("文档部分人员已导入", "系统提示", {
                          confirmButtonText: "继续导入",
                          cancelButtonText: "取消",
                          showClose: false,
                          type: "warning",
                        })
                          .then(() => {
                            this.importTableData =
                              this.uploadData.customeritems.map((value) => {
                                return {
                                  regid: value.regid || "",
                                  regdate: value.regdate || "",
                                  checkno: value.checkno || "",
                                  healthcard: value.healthcard || "",
                                  name: value.name || "",
                                  sex: value.sex,
                                  seqno: value.seqno || "",
                                  age: +value.age || 0,
                                  birthday: value.birthday || "",
                                  marriage: value.marriage || "",
                                  nation: value.nation || "",
                                  nativeplace: value.nativeplace || "",
                                  occupation: value.occupation || "",
                                  telephone: value.telephone || "",
                                  email: value.email || "",
                                  combines: value.combines || "",
                                  address: value.address || "",
                                  idcard: value.idcard || "",
                                  hiscode: value.hiscode || "",
                                  department: value.department || "",
                                  level: value.level || 0,
                                  companycode: value.companycode || "",
                                  companyname: value.companyname || "",
                                  batch: value.batch || "",
                                  groupcode: value.groupcode || "",
                                  groupname: value.groupname || "",
                                  checkdate: value.checkdate || "",
                                  reporttake: value.reporttake || "",
                                  personalflag: value.personalflag || 0,
                                  updatestatus: value.updatestatus || 1,
                                  jobno: value.jobno || "",
                                  studentnumber: value.studentnumber || "",
                                  jobin: value.jobin || "",
                                  positionin: value.positionin || "",
                                  medicalcertify: value.medicalcertify || "",
                                  quota: value.quota,
                                  idtype: value.idtype || "",
                                  department2: value.department2 || "",
                                  department3: value.department3 || "",
                                  department4: value.department4 || "",
                                  medicalhistory: value.medicalhistory || "",
                                  remark: value.remark || "",
                                  combinecodeitems:
                                    value.combinecodeitems || "",
                                  worktypename: value.worktypename || "",
                                  workyear: value.workyear || "",
                                  harmwordname: value.harmwordname || "",
                                  laborservicesflag:
                                    value.laborservicesflag || "",
                                };
                              });
                            this.tempArr = Object.assign(
                              [],
                              this.importTableData
                            );
                            const xTable = this.$refs.importTableData;
                            const groupnamecolumn =
                              xTable.getColumnByField("groupname");
                            const marriagecolumn =
                              xTable.getColumnByField("marriage");
                            const departmentcolumn =
                              xTable.getColumnByField("department");
                            this.groupNameItems = this.importTableData.map(
                              (k) => {
                                return {
                                  label: k.groupname,
                                  value: k.groupname,
                                };
                              }
                            );
                            this.groupNameItems = this.handleRemoveRepeat(
                              this.groupNameItems
                            );
                            this.marriageItems = this.importTableData.map(
                              (k) => {
                                return {
                                  label: k.marriage,
                                  value: k.marriage,
                                };
                              }
                            );
                            this.marriageItems = this.handleRemoveRepeat(
                              this.marriageItems
                            );
                            this.departmentItems = this.importTableData.map(
                              (k) => {
                                return {
                                  label: k.department,
                                  value: k.department,
                                };
                              }
                            );
                            this.departmentItems = this.handleRemoveRepeat(
                              this.departmentItems
                            );
                            xTable.setFilter(
                              groupnamecolumn,
                              this.groupNameItems
                            );
                            xTable.setFilter(
                              marriagecolumn,
                              this.marriageItems
                            );
                            xTable.setFilter(
                              departmentcolumn,
                              this.departmentItems
                            );
                            this.$message.success(res.message);
                            this.loading = false;
                          })
                          .catch(() => {
                            this.handleRepeatCancel();
                          });
                      } else {
                        this.importTableData =
                          this.uploadData.customeritems.map((value) => {
                            return {
                              regid: value.regid || "",
                              regdate: value.regdate || "",
                              checkno: value.checkno || "",
                              healthcard: value.healthcard || "",
                              name: value.name || "",
                              sex: value.sex,
                              seqno: value.seqno || "",
                              age: +value.age || 0,
                              birthday: value.birthday || "",
                              marriage: value.marriage || "",
                              nation: value.nation || "",
                              nativeplace: value.nativeplace || "",
                              occupation: value.occupation || "",
                              telephone: value.telephone || "",
                              email: value.email || "",
                              combines: value.combines || "",
                              address: value.address || "",
                              idcard: value.idcard || "",
                              hiscode: value.hiscode || "",
                              department: value.department || "",
                              level: value.level || 0,
                              companycode: value.companycode || "",
                              companyname: value.companyname || "",
                              batch: value.batch || "",
                              groupcode: value.groupcode || "",
                              groupname: value.groupname || "",
                              checkdate: value.checkdate || "",
                              reporttake: value.reporttake || "",
                              personalflag: value.personalflag || 0,
                              updatestatus: value.updatestatus || 1,
                              jobno: value.jobno || "",
                              studentnumber: value.studentnumber || "",
                              jobin: value.jobin || "",
                              positionin: value.positionin || "",
                              medicalcertify: value.medicalcertify || "",
                              quota: value.quota,
                              idtype: value.idtype || "",
                              department2: value.department2 || "",
                              department3: value.department3 || "",
                              department4: value.department4 || "",
                              medicalhistory: value.medicalhistory || "",
                              remark: value.remark || "",
                              combinecodeitems: value.combinecodeitems || "",
                              worktypename: value.worktypename || "",
                              workyear: value.workyear || "",
                              harmwordname: value.harmwordname || "",
                              laborservicesflag: value.laborservicesflag || "",
                            };
                          });
                        this.tempArr = Object.assign([], this.importTableData);
                        const xTable = this.$refs.importTableData;
                        const groupnamecolumn =
                          xTable.getColumnByField("groupname");
                        const marriagecolumn =
                          xTable.getColumnByField("marriage");
                        const departmentcolumn =
                          xTable.getColumnByField("department");
                        this.groupNameItems = this.importTableData.map((k) => {
                          return {
                            label: k.groupname,
                            value: k.groupname,
                          };
                        });
                        this.groupNameItems = this.handleRemoveRepeat(
                          this.groupNameItems
                        );
                        this.marriageItems = this.importTableData.map((k) => {
                          return {
                            label: k.marriage,
                            value: k.marriage,
                          };
                        });
                        this.marriageItems = this.handleRemoveRepeat(
                          this.marriageItems
                        );
                        this.departmentItems = this.importTableData.map((k) => {
                          return {
                            label: k.department,
                            value: k.department,
                          };
                        });
                        this.departmentItems = this.handleRemoveRepeat(
                          this.departmentItems
                        );
                        xTable.setFilter(groupnamecolumn, this.groupNameItems);
                        xTable.setFilter(marriagecolumn, this.marriageItems);
                        xTable.setFilter(
                          departmentcolumn,
                          this.departmentItems
                        );
                        this.$message.success(res.message);
                        this.loading = false;
                      }
                    })
                    .catch(() => {
                      this.handleRepeatCancel();
                    });
                }
              }
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
    // 显示套餐明细弹出层关闭回调
    handleCloseDialog() {
      this.detailedDialogData = [];
      this.showDetailed = false;
    },
    // 刷新人员数据
    handleResetGroup() {
      if (!this.chooseGroup) {
        this.$message.warning("请先选择需要刷新的分组数据!");
        return false;
      }
      getRegisterList({
        companycode: this.company,
        batch: this.batchCode,
        groupcode: this.chooseGroup.groupcode,
      }).then((res) => {
        res.result.groupitems[0] &&
          (this.chooseGroup = res.result.groupitems[0]);
        let index = this.groupTableData.findIndex(
          (k) => k.regid == this.chooseGroup.regid
        );
        index > -1 && (this.groupTableData[index] = res.result.groupitems[0]);
      });
    },
    //  分组信息表格数据行点击回调
    handleChecked(row) {
      this.chooseGroup = row;
      this.handleSurplus();
      // console.log(row, "row");
      // getRegisterList({
      //   companycode: this.company,
      //   batch: this.batchCode,
      //   groupcode: row.groupcode,
      // }).then((res) => {
      //   res.result.groupitems[0] &&
      //     (this.chooseGroup = res.result.groupitems[0]);
      // let index = this.groupTableData.findIndex(
      //   (k) => k.regid == this.chooseGroup.regid
      // );
      // index > -1 && (this.groupTableData[index] = res.result.groupitems[0]);
      // });
    },
    // 分组信息表格套餐明细点击回调
    handleSeeDetailed(groupid) {
      CombineAndChooseList({ groupid }).then((res) => {
        this.detailedDialogData = res.result;
        this.showDetailed = true;
      });
    },
    // 切换公司单位下拉列表触发回调
    handleChangeCompany() {
      // 重置批次号
      this.batchCode = "";
      this.groupTableData = [];
      this.importTableData = [];
      this.chooseGroup = undefined;

      if (!this.company) return false;
      this.handleGetRegisterList();
    },
    // 切换批次号下拉列表触发回调
    handleChangeBatch() {
      this.handleGetRegisterList();
    },
    // 获取单位列表回调
    handleGetCompanyList() {
      company_archives.CompanyRegisterLoad().then((res) => {
        this.companyArr = res.data;
      });
    },
    // 获取单位登记列表回调
    handleGetRegisterList() {
      getRegisterList({
        companycode: this.company,
        batch: this.batchCode,
      })
        .then((res) => {
          console.log(res.result);
          this.batchCodeArr = res.result.batchitems;
          let selectId = res.result.batchitems.findIndex((k) => k.selected);
          if (selectId > -1) {
            this.batchCode = res.result.batchitems[selectId].code;
          }
          this.groupTableData = res.result.groupitems;
          this.chooseGroup = res.result.groupitems[0];
          this.regid = res.result.groupitems[0].regid;
          this.detailedTableData = res.result.groupitems[0].customeritems;
        })
        .catch((err) => {
          this.groupTableData = [];
          this.chooseGroup = undefined;
        });
    },
    // 点击重置回调
    handleReload() {
      console.log("重置");
      this.company = ""; // 公司
      this.batchCode = ""; // 批次号
      this.batchCodeArr = []; // 批次号下拉数据
      this.groupTableData = []; // 分组信息表格数据
      this.importTableData = []; // 导入信息表格数据
      this.detailedTableData = []; // 人员明细表格数据
      this.detailedDialogData = []; // 套餐明细表格数据
    },
    // 点击下载模板
    handleDownloadTemp() {
      let filename = `TempBatchRegister.${this.tempSuffix}`;
      getDownLoad({ filename }).then((res) => {
        // window.open(res.result.fileurl);
        const link = document.createElement("a"); //创建下载a标签
        link.href = res.result.fileurl;
        link.style.display = "none"; //默认隐藏元素
        document.body.appendChild(link); // body中添加元素
        link.click(); // 执行点击事件
        document.body.removeChild(link); //下载完成后移除元素
      });
    },
    handleDownloadTempDB() {
      let filename = `TempBatchRegister.${this.tempSuffix}`;
      getDownLoad({ filename }).then((res) => {
        // window.open(res.result.fileurl);
        const link = document.createElement("a"); //创建下载a标签
        link.href = res.result.fileurl;
        link.style.display = "none"; //默认隐藏元素
        document.body.appendChild(link); // body中添加元素
        link.click(); // 执行点击事件
        document.body.removeChild(link); //下载完成后移除元素
      });
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
    // 打印指引单
    handlePrintGuide() {
      if (this.detailedSeleceData.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单!",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$el.innerText == "指引单") {
          let flagArr = this.detailedSeleceData.filter((k) => k.regid == "");
          if (flagArr.length > 0) {
            this.$message({
              showClose: true,
              message: "请选择保存人员数据再进行导出指引单!",
              type: "error",
            });
            return false;
          }
          let codes = this.detailedSeleceData.map((k) => {
            return k.regid;
          });
          this.detailedSeleceData.forEach((k) => {
            let data = {
              fingercode: localStorage.getItem("md5code"),
              codes: [k.regid],
              repname: d.$children[0].$attrs["data-remark"],
              printflag: 1,
              whereitems: [],
            };
            printBase64(data).then((res) => {
              k.checktype == 7 && this.handlePrintGuideSingleAdult();
              this.lodop = getLodop();
              let printname = ``;
              if (res.data[0].printname == "") {
                printname = this.lodop.GET_PRINTER_NAME(-1);
              } else {
                printname = res.data[0].printname;
              }
              let printObj = new LodopPrinter(null, printname);
              let fileList = res.data.map((k) => {
                return k.base64String;
              });
              printObj.printBase64PdfReport(this.lodop, fileList);
            });
          });
        }
      });
    },
    // 打印单位人员清单
    handlePrintPersonnelList() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      // if (this.detailedSeleceData.length == 0) {
      //   this.$message({
      //     showClose: true,
      //     message: "请选择人员再进行导出人员清单!",
      //     type: "error",
      //   });
      //   return false;
      // }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$el.innerText == "人员清单") {
          let flagArr = this.detailedSeleceData.filter((k) => k.regid == "");
          if (!this.company) {
            this.$message({
              showClose: true,
              message: "请选择选中单位再进行导出人员清单!",
              type: "error",
            });
            return false;
          }
          let codes = this.detailedSeleceData.map((k) => {
            return k.regid;
          });
          // codes.forEach((k) => {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [],
            repname: d.$children[0].$attrs["data-remark"],
            printflag: 1,
            whereitems: [
              {
                key: "companycode",
                value: this.company,
              },
            ],
          };
          printStaticsBase64(data).then((res) => {
            this.lodop = getLodop();
            let printname = ``;
            if (res.data[0].printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = res.data[0].printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = res.data.map((k) => {
              return k.base64String;
            });
            printObj.printBase64PdfReport(this.lodop, fileList);
          });
          // });
        }
      });
    },
    // 打印申请单 - 不需要选择
    handlePrintApplyAuto() {
      if (this.detailedSeleceData.length == 0) {
        this.$message({
          showClose: true,
          message: "请先选择需要打印申请单人员!",
          type: "error",
        });
        return false;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$el.innerText == "申请单") {
          let tempArr = this.combineList.map((k) => {
            if (k.billprint === 0) {
              return {
                code: k.deptcode,
                name: k.deptname,
                children: [],
              };
            }
          });
          tempArr = tempArr.filter((k) => k);
          console.log(tempArr, "tempArr");
          if (tempArr.length === 0) return false;
          let map = new Map();
          for (let item of tempArr) {
            map.set(item.code, item);
          }
          let printArrTemp = [...map.values()];
          let printArr = [];
          printArrTemp.forEach((k, i) => {
            this.combineList.forEach((item, index) => {
              if (k.code === item.deptcode && item.billprint === 0) {
                printArr.push(item.combinecode);
              }
            });
          });
          console.log(printArr, "printArr");
          if (printArr.length > 0) {
            let flagArr = this.detailedSeleceData.filter((k) => k.regid == "");
            if (flagArr.length > 0) {
              this.$message({
                showClose: true,
                message: "请选择保存人员数据再进行导出人员清单!",
                type: "error",
              });
              return false;
            }
            let codes = this.detailedSeleceData.map((k) => {
              return k.regid;
            });
            codes.forEach((k) => {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [k],
                repname: d.$children[0].$attrs["data-remark"],
                printflag: 1,
                whereitems: [
                  {
                    key: "regid",
                    value: k,
                  },
                  {
                    key: "combinecodesin",
                    valueList: printArr,
                  },
                ],
              };
              printBase64(data).then((res) => {
                this.lodop = getLodop();
                let printname = ``;
                if (res.data[0].printname == "") {
                  printname = this.lodop.GET_PRINTER_NAME(-1);
                } else {
                  printname = res.data[0].printname;
                }
                let printObj = new LodopPrinter(null, printname);
                let fileList = res.data.map((k) => {
                  return k.base64String;
                });
                printObj.printBase64PdfReport(this.lodop, fileList);
              });
            });
          }
        }
      });
    },
    // 头部按钮组点击回调
    hadnleOnBtnClicked(domId) {
      switch (domId) {
        case "btnPreserve":
          this.handleSubmit();
          break;
        case "btnSynchro":
          this.handleSameDataRegister();
          break;
        case "btnReset":
          this.$reload();
          // this.handleReload();
          break;
        case "btnIntimidate":
          if (!this.company) {
            this.$message.warning("请选择单位信息!");
            return false;
          }
          this.$router.push({
            path: "/printorder/index",
            query: { companycode: this.company, batch: this.batchCode },
          });
          break;
        case "btnDownload":
          this.handleDownloadTemp();
          // this.handleDownloadTempDB();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnGuide": // 指引单
          this.handlePrintGuide();
          break;
        case "btnPersonnelList": // 单位人员清单
          this.handlePrintPersonnelList();
          break;
        case "btnApply": // 单位人员清单
          if (!this.chooseGroup) {
            this.$message.warning("请先选中分组信息!");
            return;
          }
          CombineAndChooseList({ groupid: this.chooseGroup.groupid }).then(
            (res) => {
              if (!res.result) {
                this.$message.warning("暂无申请单打印!");
                return;
              }
              this.combineList = res.result;
              this.handlePrintApplyAuto();
            }
          );
          break;
        default:
          break;
      }
    },
  },

  watch: {
    //   数据监听 有数据就放开上传
    company(newVal, oldVal) {
      if (newVal) {
        this.authenStatus = 1;
      }
    },
  },
};
</script>
<style lang="scss">
.el-message-box__wrapper {
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.el-message-box.detectionBox {
  width: 800px;
  .el-message-box__content {
    height: 500px;
    width: 100%;
    .el-message-box__container {
      height: 100%;
      width: 100%;
      overflow-y: auto;
    }
  }
  .el-message-box__btns {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
@import "./css/index.scss";
/deep/.vxe-table {
  .hidden-row {
    display: none !important;
  }
}
</style>
