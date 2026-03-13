<template>
  <div v-loading="showLoadPage">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="statisticsreport" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <div class="bg-white fh" style="height: calc(100vh - 147px)">
        <el-row>
          <el-col :span="7">
            <div style="margin: 10px">
              <h3 style="
                  display: flex;
                  align-items: center;
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 15px;
                  background-color: #f6f7fc;
                  margin: -10px -10px 10px -10px;
                  padding-left: 12px;
                  border-radius: 5px 5px 0 0;
                  line-height: 38px;
                ">
                <div style="
                    width: 7px;
                    height: 20px;
                    background-color: #5c7ceb;
                    border-radius: 3.5px;
                    margin-right: 5px;
                  "></div>
                检索条件
              </h3>
              <el-row>
                <el-col :span="5" style="margin-bottom: 8px">
                  <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                    <div class="content">
                      <div class="content_item" v-for="item in checkupDateArr" :key="item.code" @click="handleSelectConditionDate(item)">
                        {{ item.name }}
                      </div>
                    </div>
                    <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ dateName }}</el-button>
                  </el-popover>
                  <!-- <el-tag effect="dark"> 登记日期 </el-tag> -->
                </el-col>
                <div v-if="
                    hospitalsFlag == 'index_hsrmyy' ||
                    hospitalsFlag == 'index_qyzyy'
                  ">
                  <el-col :span="10">
                    <el-date-picker v-model="temp.startTime" size="mini" style="width: 95%" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="9">
                    <el-date-picker v-model="temp.endTime" size="mini" style="width: 95%" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-col>
                </div>
                <div v-else>
                  <el-col :span="10">
                    <el-date-picker v-model="temp.startTime" size="mini" style="width: 95%" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="9">
                    <el-date-picker v-model="temp.endTime" size="mini" style="width: 95%" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-col>
                </div>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div style="height: 40px; line-height: 40px">体检中心</div>
                </el-col>
                <el-col :span="19">
                  <el-select v-model="temp.meccode" size="mini" filterable clearable style="width: 97.5%" placeholder="请选择">
                    <el-option v-for="item in meccodeitems" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div style="height: 40px; line-height: 40px">数据类型</div>
                </el-col>
                <el-col :span="19">
                  <el-select v-model="temp.personalflag" filterable size="mini" clearable style="width: 97.5%" placeholder="请选择">
                    <el-option v-for="item in personalflagitems" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <!-- <el-row style="margin-top: 15px;">
                <el-col :span="8" style="text-align: center;">
                  <el-button type="primary" plain>全部</el-button>
                </el-col>
                <el-col :span="8" style="text-align: center;">
                  <el-button type="primary" plain>个检</el-button>
                </el-col>
                <el-col :span="8" style="text-align: center;">
                  <el-button type="primary" plain>团检</el-button>
                </el-col>
              </el-row> -->
              <el-row>
                <el-col :span="5">
                  <div style="height: 40px; line-height: 40px">单位名称</div>
                </el-col>
                <el-col :span="19">
                  <el-select v-model="temp.companycode" size="mini" filterable clearable style="width: 97.5%" placeholder="请选择" @change="companychange">
                    <el-option v-for="item in companyitems" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div style="height: 40px; line-height: 40px">批次</div>
                </el-col>
                <el-col :span="19">
                  <el-select v-model="temp.batch" size="mini" filterable clearable style="width: 97.5%" placeholder="请选择" @change="batchchange">
                    <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div style="height: 40px; line-height: 40px">单位分组</div>
                </el-col>
                <el-col :span="19">
                  <el-select v-model="temp.groupcode" collapse-tags size="mini" filterable multiple clearable style="width: 97.5%" @change="groupchange" placeholder="请选择">
                    <el-option v-for="(item, index) in groupitems" :key="item.code + index" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div style="height: 40px; line-height: 40px">部门</div>
                </el-col>
                <el-col :span="19">
                  <el-select v-model="temp.companydepartment" size="mini" filterable clearable style="width: 97.5%" placeholder="请选择">
                    <el-option v-for="(item, index) in companydepartmentItems" :key="item.code + index" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" style="text-align: center">
                  <span class="link-type" @click="btnmoreconditions" plain>更多条件</span>
                </el-col>
                <el-col :span="8" style="text-align: center">
                  <span class="link-type" @click="savetemplate" plain>保存模板</span>
                </el-col>
                <el-col :span="8" style="text-align: center">
                  <span class="link-type" @click="calltemplate" plain>调用模板</span>
                </el-col>
              </el-row>
              <h3 style="
                  display: flex;
                  align-items: center;
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 15px;
                  background-color: #f6f7fc;
                  margin: 15px -10px 15px -10px;
                  padding-left: 12px;
                  border-radius: 5px;
                  line-height: 38px;
                ">
                <div style="
                    width: 7px;
                    height: 20px;
                    background-color: #5c7ceb;
                    border-radius: 3.5px;
                    margin-right: 5px;
                  "></div>
                报表类型
              </h3>
              <el-row style="margin-top: 15px" class="page_tree">
                <el-tree :data="reportitems" highlight-current :props="defaultProps" @node-click="handleNodeClick">
                  <span class="custom-tree-node" style="width: 100%" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }" @dblclick="handleStatistics">
                    <span>{{ data.sortindex || "" }}　{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-row>
            </div>
          </el-col>
          <el-col style="height: 100%" :span="17">
            <div class="table_box" style="height: 700px" v-if="statisticsData && statisticsData.xlsx == 'tablexlsx'">
              <vxe-table ref="projectData" height="100%" border="inner" highlight-hover-row :data="rowsitems" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
                <vxe-table-column v-for="(date, index) in columnitems" :key="index" :field="date.colunmcode" :title="date.colunmname" show-header-overflow min-width="140px" show-overflow="title" show-footer-overflow>
                </vxe-table-column>
                <!-- <el-table-column :label="date" v-for="(date, key) in columnitems" align="center">
                      listDate1[scope.$index][key]
      </el-table-column> -->
              </vxe-table>
              <div style="height: 50px; text-align: center; margin-top: 5px">
                共 {{ rowsitems.length }} 条数据
              </div>
            </div>
            <el-tabs v-else v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="统计报表" name="iframe">
                <iframe v-if="activeName == 'iframe'" ref="pdfCotainer" :src="pdfUrl" width="96%" style="height: calc(100vh - 237px); overflow-x: auto"></iframe>
              </el-tab-pane>
              <el-tab-pane label="数据浏览" name="tabledata"></el-tab-pane>
              <div class="" v-if="activeName == 'tabledata'" style="
                    height: 700px;
                    width: 96%;
                    overflow-x: auto;
                  ">
                <vxe-table ref="projectData" height="100%" border="inner" highlight-hover-row :data="rowsitemsLL" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
                  <vxe-table-column v-for="(date, index) in columnitemsLL" :key="index" :field="date.colunmcode" :title="date.colunmname" show-header-overflow min-width="140px" show-overflow="title" show-footer-overflow>
                  </vxe-table-column>
                </vxe-table>
              </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-dialog class="dialog-mini" :close-on-click-modal="false" width="600px" :title="dialogStatus" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :model="temp" label-position="right" label-width="130px">
            <el-form-item size="mini" :label="'体检类型'">
              <el-select v-model="temp.checktype" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'检查科室'">
              <el-select v-model="temp.department" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option v-for="item in deptItems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'检查医生'">
              <el-select v-model="temp.doctor" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'体检套餐'">
              <el-select v-model="temp.setmealcode" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option v-for="item in setmealitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'体检组合'">
              <el-select v-model="temp.combinecode" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option v-for="item in combineitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item size="mini" :label="'单位性质'">
              <el-select
                v-model="temp.personalflag"
                filterable
                clearable
                style="width: 97.5%"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in personalflagitems"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item size="mini" :label="'单位接待人'">
              <el-select v-model="temp.receptioncode" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'任职情况'">
              <el-select v-model="temp.positionin" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option label="省级" value="省级"></el-option>
                <el-option label="正市级" value="正市级"></el-option>
                <el-option label="副市级" value="副市级"></el-option>
                <el-option label="正厅级" value="正厅级"></el-option>
                <el-option label="副厅级" value="副厅级"></el-option>
                <el-option label="处级及以下" value="处级及以下"></el-option>
                <el-option label="高知" value="高知"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'在职情况'">
              <el-select v-model="temp.jobin" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option label="在职" value="在职"></el-option>
                <el-option label="离休" value="离休"></el-option>
                <el-option label="退休" value="退休"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'体检状态'">
              <el-select v-model="temp.status" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option label="未检" :value="0"></el-option>
                <el-option label="未总检" :value="1"></el-option>
                <el-option label="已总检" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'检查类别'">
              <el-select v-model="temp.viewgroup" filterable clearable style="width: 97.5%" placeholder="请选择" multiple>
                <el-option label="基础" :value="0"></el-option>
                <el-option label="检验" :value="1"></el-option>
                <el-option label="检查" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'费用范围'">
              <el-row>
                <el-col :span="11">
                  <el-input v-model.number="temp.coststart"></el-input>
                </el-col>
                <el-col :span="1" style="text-align: center; width: 25px">
                  <span>-</span>
                </el-col>
                <el-col :span="11">
                  <el-input v-model.number="temp.costend"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item size="mini" :label="'二级部门'">
              <el-select v-model="temp.deparment2" size="mini" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option v-for="(item, index) in departitem2s" :key="item.code + index" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
            <el-button size="mini" :loading="saveLoading" type="primary" @click="createData">确认</el-button>
          </div>
        </el-dialog>
        <el-dialog class="dialog-mini" :close-on-click-modal="false" width="600px" :title="searchnamedialogStatus" :visible.sync="searchdialogFormVisible">
          <el-form ref="searchdataForm" :model="temp" label-position="right" label-width="130px">
            <el-form-item size="mini" :label="'查找名称'">
              <el-input v-model="searchname"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button size="mini" @click="searchdialogFormVisible = false">取消</el-button>
            <el-button size="mini" :loading="saveLoading" type="primary" @click="saveData">确认</el-button>
          </div>
        </el-dialog>
        <el-dialog class="dialog-mini" :close-on-click-modal="false" width="600px" :title="searchtemplatedialogStatus" :visible.sync="searchtemplatedialogFormVisible">
          <el-table ref="mainTable" height="30vh" :key="tableKey" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column prop="searchcode" label="查找编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="searchname" label="查找名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" :label="'操作'" width="80" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="handleModifyStatus(scope.row)">启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div slot="footer">
            <el-button size="mini" @click="searchtemplatedialogFormVisible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="saveData">确认</el-button>
          </div> -->
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import * as reportstatics from "@/api/reportstatics";
import {
  ReportStatics,
  ReportTable,
  ExportReportData,
} from "@/api/reportstatics";
import { printStaticsBase64 } from "@/api/printreport.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { getDicItemDetail } from "@/api/projectdictionary2.js";
import util from "@/utils/base64ToFile";
import { getAllUser } from "@/api/customermanage.js";
import * as userlogin from "@/api/login";
import axios from "axios";
export default {
  name: "statisticsreport",
  directives: {},
  components: {
    Sticky,
    permissionBtn,
  },
  data() {
    return {
      checkupDateArr: [
        { code: "regdate", name: "登记日期" },
        { code: "inputdate", name: "结果时间" },
        { code: "checkdate", name: "审核时间" },
        { code: "checkdatetj", name: "体检日期" },
        { code: "paydate", name: "指引单日期" },
      ],
      dateCode: "regdate",
      dateName: "登记日期",
      rowsitems: [],
      columnitems: [],
      rowsitemsLL: [],
      columnitemsLL: [],
      statisticsData: null,
      deptItems: [],
      saveLoading: false,
      pdfUrl: "",
      searchname: "",
      repname: "",
      base64String: "",
      lodop: "",
      fileurl: "",
      fileexcelurl: "",
      searchdialogFormVisible: false,
      searchtemplatedialogFormVisible: false,
      checktypeitems: [],
      companydepartmentItems: [],
      departitem2s: [],
      combineitems: [],
      companyitems: [],
      listLoading: false,
      printname: "",
      tableKey: 0,
      list: [],
      departmentitems: [],
      doctoritems: [],
      meccodeitems: [],
      personalflagitems: [],
      reportitems: [],
      setmealitems: [],
      batchitems: [],
      groupitems: [],
      temp: {
        startTime: "",
        endTime: "",
        meccode: "",
        personalflag: "",
        companydepartment: "",
        deparment2: "",
        companycode: "",
        batch: "",
        groupcode: [],
        checktype: [],
        department: [],
        doctor: [],
        setmealcode: [],
        combinecode: [],
        coststart: "",
        costend: "",
        receptioncode: [],
        positionin: [],
        jobin: [],
        status: [],
        viewgroup: [],
      },
      tempExclude: [
        "checktype",
        "department",
        "doctor",
        "setmealcode",
        "combinecode",
        "receptioncode",
        "positionin",
        "jobin",
        "status",
        "viewgroup",
        "groupcode",
      ],
      dialogStatus: "更多条件",
      searchnamedialogStatus: "保存搜索条件",
      searchtemplatedialogStatus: "调用模板",
      value: "",
      dialogFormVisible: false,
      defaultProps: {
        children: "reportitems",
        label: "code",
      },
      excelData: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          let endDateVal = this.temp.endTime;
          // let endDateVal = this.temp.startTime;
          if (endDateVal) {
            return (
              time.getTime() >=
              new Date(endDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          let beginDateVal = this.temp.startTime;
          // let beginDateVal = this.temp.endTime;
          console.log(new Date(beginDateVal).getTime());
          if (beginDateVal) {
            return (
              time.getTime() <=
              new Date(beginDateVal).getTime() + 1 * 24 * 60 * 60 * 1000
            );
          }
        },
      },
      hospitalsFlag: "",
      activeName: "iframe",
      showLoadPage: false,
    };
  },
  filters: {},
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  created() {
    reportstatics.LoadSearchInfo().then((response) => {
      if (
        response.result != undefined &&
        response.result != null &&
        response.result != ""
      ) {
        this.checktypeitems = response.result.checktypeitems;
        this.combineitems = response.result.combineitems;
        this.companyitems = response.result.companyitems;
        this.departmentitems = response.result.departmentitems;
        // this.doctoritems = response.result.doctoritems;
        this.meccodeitems = response.result.meccodeitems;
        this.personalflagitems = response.result.personalflagitems;
        this.reportitems = response.result.reportitems;
        this.setmealitems = response.result.setmealitems;
        this.$nextTick(() => {
          // 获取当前体检中心
          userlogin.GetMyOrgs().then((response) => {
            if (response.result.meccode) {
              this.temp.meccode = response.result.meccode;
            }
          });
        });
      }
      console.log(response);
    });
  },
  async mounted() {
    let jump = await getSysConfigInfo({
      cc: "Sys_Module_Jump",
    });
    this.hospitalsFlag = (jump && jump.result) || "index";
    this.handleGetPrintDate();
    getDicItemDetail({ code: "" }).then((res) => {
      this.deptItems = res.result.deptItems;
    });
    getAllUser().then((res) => {
      console.log(res.data);
      this.doctoritems = res.data.map((k) => {
        return {
          ...k,
          code: k.account,
        };
      });
    });
  },
  methods: {
    handleClickDownload() {
      let temp = JSON.parse(JSON.stringify(this.temp));
      let startTime = new Date(temp.startTime);
      let endTime = new Date(temp.endTime);
      temp.startTime =
        startTime.getFullYear() +
        "-" +
        (startTime.getMonth() + 1) +
        "-" +
        startTime.getDate();
      temp.endTime =
        endTime.getFullYear() +
        "-" +
        (endTime.getMonth() + 1) +
        "-" +
        endTime.getDate();
      var keys = Object.keys(temp);
      var whereitems = [];
      keys.forEach((d) => {
        if (
          d != "startTime" &&
          d != "endTime" &&
          !this.tempExclude.includes(d)
        ) {
          var tempdata = {
            key: d,
            value: temp[d],
          };
          whereitems.push(tempdata);
        }
        if (this.tempExclude.includes(d)) {
          var tempdata = {
            key: d,
            valueList: temp[d],
          };
          whereitems.push(tempdata);
        }
      });
      switch (this.dateCode) {
        case "regdate":
          whereitems.push({
            key: "timetype",
            value: "登记日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "inputdate":
          whereitems.push({
            key: "startinputdate",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endinputdate",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "结果时间",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "checkdate":
          whereitems.push({
            key: "starttotalcheckdate",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endtotalcheckdate",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "审核时间",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "checkdatetj":
          whereitems.push({
            key: "startcheckdate",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endcheckdate",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "体检日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "paydate":
          whereitems.push({
            key: "paystartTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "payendTime",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "指引单日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        default:
          break;
      }
      var data = {
        repname: this.repname,
        whereitems,
        isExport: true,
      };

      ExportReportData(data).then((res) => {
        if (!res.data) return;
        let fileName = `${this.repname}-${new Date(
          +new Date() + 8 * 3600 * 1000
        )
          .toJSON()
          .substr(0, 19)
          .replace("T", " ")}`;
        this.base64ToExcel(res.data.base64String, fileName);
      });
    },
    handleClick() {
      if (this.activeName != "tabledata") return;
      let temp = JSON.parse(JSON.stringify(this.temp));
      let startTime = new Date(temp.startTime);
      let endTime = new Date(temp.endTime);
      temp.startTime =
        startTime.getFullYear() +
        "-" +
        (startTime.getMonth() + 1) +
        "-" +
        startTime.getDate();
      temp.endTime =
        endTime.getFullYear() +
        "-" +
        (endTime.getMonth() + 1) +
        "-" +
        endTime.getDate();
      var keys = Object.keys(temp);
      var whereitems = [];
      keys.forEach((d) => {
        if (
          d != "startTime" &&
          d != "endTime" &&
          !this.tempExclude.includes(d)
        ) {
          var tempdata = {
            key: d,
            value: temp[d],
          };
          whereitems.push(tempdata);
        }
        if (this.tempExclude.includes(d)) {
          var tempdata = {
            key: d,
            valueList: temp[d],
          };
          whereitems.push(tempdata);
        }
      });
      switch (this.dateCode) {
        case "regdate":
          whereitems.push({
            key: "timetype",
            value: "登记日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "inputdate":
          whereitems.push({
            key: "startinputdate",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endinputdate",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "结果时间",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "checkdate":
          whereitems.push({
            key: "starttotalcheckdate",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endtotalcheckdate",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "审核时间",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "checkdatetj":
          whereitems.push({
            key: "startcheckdate",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endcheckdate",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "体检日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        case "paydate":
          whereitems.push({
            key: "paystartTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "payendTime",
            value: this.temp.endTime,
          });
          whereitems.push({
            key: "timetype",
            value: "指引单日期",
          });
          whereitems.push({
            key: "startTime",
            value: this.temp.startTime,
          });
          whereitems.push({
            key: "endTime",
            value: this.temp.endTime,
          });
          break;
        default:
          break;
      }
      var data = {
        repname: this.repname,
        whereitems,
        isExport: false,
      };

      ExportReportData(data).then((res) => {
        if (!res.data) return;
        this.columnitemsLL = res.data.columnitems;
        this.rowsitemsLL = res.data.rowsitems;
      });
    },
    b64toBlob(b64Data) {
      const arr = b64Data.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[0]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    downloadBase64File(base64, file) {
      const blob = new Blob([base64], {
        type: "application/vnd.ms-excel,charset=utf-8",
      }); // File对象就是一种特殊的Blob，File 接口基于Blob
      const fileName = `${file}.xlsx`; // 文件名字
      // 注意，这是非IE下载
      const elink = document.createElement("a"); // 通过elink得到一个<a>标签（有点类似于ref）
      elink.download = fileName; // 规定被下载的超链接目标
      elink.style.display = "none"; // 设置样式（照抄就行了）
      elink.href = URL.createObjectURL(blob); // 为<a>标签绑定href属性
      document.body.appendChild(elink); // 创建一个<a>标签
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL对象
      document.body.removeChild(elink);
    },
    base64ToExcel(base64, fileName) {
      const sliceSize = 512;
      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const file = new File(byteArrays, "example.xlsx", {
        type: "application/vnd.ms-excel,charset=utf-8",
      });
      const aLink = document.createElement("a");
      aLink.href = URL.createObjectURL(file);
      aLink.setAttribute("download", `${fileName}.xlsx`);
      aLink.click();
      this.showLoadPage = false;
    },
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.dateName = val.name;
      this.dateCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    handleReportTableExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = this.rowsitems;
          this.showLoadPage = true;
          this.export2Excel();
        })
        .catch(() => {});
    },
    // 数据写入excel
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = this.columnitems.map((k) => k.colunmcode);
        const filterVal = this.columnitems.map((k) => k.colunmname);
        const list = this.excelData;
        const data = this.formatJson(filterVal, list);
        this.showLoadPage = false;
        export_json_to_excel(tHeader, data, "导出数据"); // 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    handleReportTable() {
      if (
        this.repname != undefined &&
        this.repname != null &&
        this.repname != ""
      ) {
        var temp = JSON.parse(JSON.stringify(this.temp));
        let startTime = new Date(temp.startTime);
        let endTime = new Date(temp.endTime);
        temp.startTime =
          startTime.getFullYear() +
          "-" +
          (startTime.getMonth() + 1) +
          "-" +
          startTime.getDate();
        temp.endTime =
          endTime.getFullYear() +
          "-" +
          (endTime.getMonth() + 1) +
          "-" +
          endTime.getDate();
        var keys = Object.keys(temp);
        var whereitems = [];
        keys.forEach((d) => {
          if (
            d != "startTime" &&
            d != "endTime" &&
            !this.tempExclude.includes(d)
          ) {
            var tempdata = {
              key: d,
              value: temp[d],
            };
            whereitems.push(tempdata);
          }
          if (this.tempExclude.includes(d)) {
            var tempdata = {
              key: d,
              valueList: temp[d],
            };
            whereitems.push(tempdata);
            whereitems.push(tempdata);
          }
        });
        switch (this.dateCode) {
          case "regdate":
            whereitems.push({
              key: "timetype",
              value: "登记日期",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "inputdate":
            whereitems.push({
              key: "startinputdate",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endinputdate",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "结果时间",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "checkdate":
            whereitems.push({
              key: "starttotalcheckdate",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endtotalcheckdate",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "审核时间",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "checkdatetj":
            whereitems.push({
              key: "startcheckdate",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endcheckdate",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "体检日期",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "paydate":
            whereitems.push({
              key: "paystartTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "payendTime",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "指引单日期",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          default:
            break;
        }
        var data = {
          repname: this.repname,
          whereitems: whereitems,
        };
        this.showLoadPage = true;
        ReportTable(data)
          .then((res) => {
            if (!res.result) return;
            this.columnitems = res.result.columnitems;
            this.rowsitems = res.result.rowsitems;
          })
          .finally(() => {
            this.showLoadPage = false;
          });
      } else {
        this.$message({
          showClose: true,
          message: "请选择报表类型",
          type: "warning",
        });
      }
    },
    handleData(data) {
      data.columnitems.forEach((v) => {
        v.colunmcode = encodeURIComponent(v.colunmcode);
      });
      data.rowsitems = data.rowsitems.map((v, k) => {
        const newData = {};
        Object.keys(v).forEach((key) => {
          newData[encodeURIComponent(key)] = v[key];
        });
        return newData;
      });
      return data;
    },
    // 获取默认时间
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_StatisticsReport_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
        if (
          this.hospitalsFlag == "index_hsrmyy" ||
          this.hospitalsFlag == "index_qyzyy"
        ) {
          this.temp.startTime = `${this.gettime(start)} 00:00:00`;
          this.temp.endTime = `${this.gettime(start)} 23:59:59`;
        } else {
          this.temp.startTime = this.gettime(start);
          this.temp.endTime = this.gettime(start);
        }
        // this.temp.endTime = this.gettime(end);
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
    handleStatistics() {
      if (
        this.repname != undefined &&
        this.repname != null &&
        this.repname != ""
      ) {
        var temp = JSON.parse(JSON.stringify(this.temp));
        let startTime = new Date(temp.startTime);
        let endTime = new Date(temp.endTime);
        temp.startTime =
          startTime.getFullYear() +
          "-" +
          (startTime.getMonth() + 1) +
          "-" +
          startTime.getDate();
        temp.endTime =
          endTime.getFullYear() +
          "-" +
          (endTime.getMonth() + 1) +
          "-" +
          endTime.getDate();
        var keys = Object.keys(temp);
        var whereitems = [];
        keys.forEach((d) => {
          if (
            d != "startTime" &&
            d != "endTime" &&
            !this.tempExclude.includes(d)
          ) {
            var tempdata = {
              key: d,
              value: temp[d],
            };
            whereitems.push(tempdata);
          }
          if (this.tempExclude.includes(d)) {
            var tempdata = {
              key: d,
              valueList: temp[d],
            };
            whereitems.push(tempdata);
          }
        });
        switch (this.dateCode) {
          case "regdate":
            whereitems.push({
              key: "timetype",
              value: "登记日期",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "inputdate":
            whereitems.push({
              key: "startinputdate",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endinputdate",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "结果时间",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "checkdate":
            whereitems.push({
              key: "starttotalcheckdate",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endtotalcheckdate",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "审核时间",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "checkdatetj":
            whereitems.push({
              key: "startcheckdate",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endcheckdate",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "体检日期",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          case "paydate":
            whereitems.push({
              key: "paystartTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "payendTime",
              value: this.temp.endTime,
            });
            whereitems.push({
              key: "timetype",
              value: "指引单日期",
            });
            whereitems.push({
              key: "startTime",
              value: this.temp.startTime,
            });
            whereitems.push({
              key: "endTime",
              value: this.temp.endTime,
            });
            break;
          default:
            break;
        }
        var data = {
          repname: this.repname,
          whereitems: whereitems,
          page: this.hospitalsFlag,
        };
        this.showLoadPage = true;
        printStaticsBase64(data)
          .then((res) => {
            if (res.data != undefined && res.data != null && res.data != "") {
              this.base64ToBlob("", res.data[0].base64String);
              this.base64String = res.data[0].base64String;
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error",
              });
            }
          })
          .finally(() => {
            this.showLoadPage = false;
          });
        // axios
        //   .post("/api-proxy/PrintReport/ReportStatics/", data)
        //   .then((res) => {

        //   });
      } else {
        this.$message({
          showClose: true,
          message: "请选择报表类型",
          type: "warning",
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
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    onBtnClicked: function (domId) {
      console.log(domId);
      switch (domId) {
        case "btnStatistics":
          if (this.statisticsData && this.statisticsData.xlsx == "tablexlsx") {
            this.handleReportTable();
          } else {
            this.handleStatistics();
          }
          break;
        case "btnReset":
          this.resetemp();
          break;
        case "btnExportData":
          this.handleClickDownload();
          break;
        case "btnExcel":
          if (this.statisticsData && this.statisticsData.xlsx == "tablexlsx") {
            this.handleReportTableExcel();
          } else {
            if (
              this.fileexcelurl != undefined &&
              this.fileexcelurl != null &&
              this.fileexcelurl != ""
            ) {
              if (
                this.repname != undefined &&
                this.repname != null &&
                this.repname != ""
              ) {
                var temp = JSON.parse(JSON.stringify(this.temp));
                let startTime = new Date(temp.startTime);
                let endTime = new Date(temp.endTime);
                temp.startTime =
                  startTime.getFullYear() +
                  "-" +
                  (startTime.getMonth() + 1) +
                  "-" +
                  startTime.getDate();
                temp.endTime =
                  endTime.getFullYear() +
                  "-" +
                  (endTime.getMonth() + 1) +
                  "-" +
                  endTime.getDate();
                var keys = Object.keys(temp);
                var whereitems = [];
                keys.forEach((d) => {
                  if (
                    d != "startTime" &&
                    d != "endTime" &&
                    !this.tempExclude.includes(d)
                  ) {
                    var tempdata = {
                      key: d,
                      value: temp[d],
                    };
                    whereitems.push(tempdata);
                  }
                  if (this.tempExclude.includes(d)) {
                    var tempdata = {
                      key: d,
                      valueList: temp[d],
                    };
                    whereitems.push(tempdata);
                  }
                });
                switch (this.dateCode) {
                  case "regdate":
                    whereitems.push({
                      key: "timetype",
                      value: "登记日期",
                    });
                    whereitems.push({
                      key: "startTime",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endTime",
                      value: this.temp.endTime,
                    });
                    break;
                  case "inputdate":
                    whereitems.push({
                      key: "startinputdate",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endinputdate",
                      value: this.temp.endTime,
                    });
                    whereitems.push({
                      key: "timetype",
                      value: "结果时间",
                    });
                    whereitems.push({
                      key: "startTime",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endTime",
                      value: this.temp.endTime,
                    });
                    break;
                  case "checkdate":
                    whereitems.push({
                      key: "starttotalcheckdate",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endtotalcheckdate",
                      value: this.temp.endTime,
                    });
                    whereitems.push({
                      key: "timetype",
                      value: "审核时间",
                    });
                    whereitems.push({
                      key: "startTime",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endTime",
                      value: this.temp.endTime,
                    });
                    break;
                  case "checkdatetj":
                    whereitems.push({
                      key: "startcheckdate",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endcheckdate",
                      value: this.temp.endTime,
                    });
                    whereitems.push({
                      key: "timetype",
                      value: "体检日期",
                    });
                    whereitems.push({
                      key: "startTime",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endTime",
                      value: this.temp.endTime,
                    });
                    break;
                  case "paydate":
                    whereitems.push({
                      key: "paystartTime",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "payendTime",
                      value: this.temp.endTime,
                    });
                    whereitems.push({
                      key: "timetype",
                      value: "指引单日期",
                    });
                    whereitems.push({
                      key: "startTime",
                      value: this.temp.startTime,
                    });
                    whereitems.push({
                      key: "endTime",
                      value: this.temp.endTime,
                    });
                    break;
                  default:
                    break;
                }
                var data = {
                  repname: this.repname,
                  filetype: this.statisticsData.xlsx,
                  outtype: "stream",
                  designtype:
                    this.statisticsData.xlsx == "fastxlsx" ? "fast" : "dev",
                  whereitems: whereitems,
                  page: this.hospitalsFlag,
                };
                this.showLoadPage = true;
                printStaticsBase64(data).then((res) => {
                  if (
                    res.data != undefined &&
                    res.data != null &&
                    res.data != ""
                  ) {
                    if (!res.data) return;
                    this.base64ToExcel(res.data[0].base64String, this.repname);
                    // const link = document.createElement("a"); //创建下载a标签
                    // link.href = res.data[0].fileurl;
                    // link.style.display = "none"; //默认隐藏元素
                    // document.body.appendChild(link); // body中添加元素
                    // link.click(); // 执行点击事件
                    // document.body.removeChild(link); //下载完成后移除元素
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "error",
                    });
                  }
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "请选择报表类型",
                  type: "warning",
                });
              }
            } else {
              this.$message({
                showClose: true,
                message: "请先进行统计",
                type: "warning",
              });
            }
          }
          break;
        case "btnPdf":
          if (
            this.fileurl != undefined &&
            this.fileurl != null &&
            this.fileurl != ""
          ) {
            console.log(this.fileurl);
            console.log(encodeURI(this.fileurl));
            this.lodop = getLodop();
            let printname = ``;
            if (this.printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = this.printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = [this.base64String];
            printObj.printBase64PdfReport(this.lodop, fileList);
            // var loddp = "";
            // loddp = getLodop();
            // loddp.NewPage();
            // loddp.SET_PRINTER_INDEX(
            //   this.printname == "" ? loddp.GET_PRINTER_NAME(-1) : this.printname
            // );
            // loddp.ADD_PRINT_PDF(0, 0, "100%", "100%", encodeURI(this.fileurl));
            // loddp.PRINT();
          } else {
            this.$message({
              showClose: true,
              message: "请先进行统计",
              type: "warning",
            });
          }
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnExportPdf": // 导出PDF
          if (
            this.repname != undefined &&
            this.repname != null &&
            this.repname != ""
          ) {
            var temp = JSON.parse(JSON.stringify(this.temp));
            let startTime = new Date(temp.startTime);
            let endTime = new Date(temp.endTime);
            temp.startTime =
              startTime.getFullYear() +
              "-" +
              (startTime.getMonth() + 1) +
              "-" +
              startTime.getDate();
            temp.endTime =
              endTime.getFullYear() +
              "-" +
              (endTime.getMonth() + 1) +
              "-" +
              endTime.getDate();
            var keys = Object.keys(temp);
            var whereitems = [];
            keys.forEach((d) => {
              if (
                d != "startTime" &&
                d != "endTime" &&
                !this.tempExclude.includes(d)
              ) {
                var tempdata = {
                  key: d,
                  value: temp[d],
                };
                whereitems.push(tempdata);
              }
              if (this.tempExclude.includes(d)) {
                var tempdata = {
                  key: d,
                  valueList: temp[d],
                };
                whereitems.push(tempdata);
              }
            });
            switch (this.dateCode) {
              case "regdate":
                whereitems.push({
                  key: "timetype",
                  value: "登记日期",
                });
                whereitems.push({
                  key: "startTime",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endTime",
                  value: this.temp.endTime,
                });
                break;
              case "inputdate":
                whereitems.push({
                  key: "startinputdate",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endinputdate",
                  value: this.temp.endTime,
                });
                whereitems.push({
                  key: "timetype",
                  value: "结果时间",
                });
                whereitems.push({
                  key: "startTime",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endTime",
                  value: this.temp.endTime,
                });
                break;
              case "checkdate":
                whereitems.push({
                  key: "starttotalcheckdate",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endtotalcheckdate",
                  value: this.temp.endTime,
                });
                whereitems.push({
                  key: "timetype",
                  value: "审核时间",
                });
                whereitems.push({
                  key: "startTime",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endTime",
                  value: this.temp.endTime,
                });
                break;
              case "checkdatetj":
                whereitems.push({
                  key: "startcheckdate",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endcheckdate",
                  value: this.temp.endTime,
                });
                whereitems.push({
                  key: "timetype",
                  value: "体检日期",
                });
                whereitems.push({
                  key: "startTime",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endTime",
                  value: this.temp.endTime,
                });
                break;
              case "paydate":
                whereitems.push({
                  key: "paystartTime",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "payendTime",
                  value: this.temp.endTime,
                });
                whereitems.push({
                  key: "timetype",
                  value: "指引单日期",
                });
                whereitems.push({
                  key: "startTime",
                  value: this.temp.startTime,
                });
                whereitems.push({
                  key: "endTime",
                  value: this.temp.endTime,
                });
                break;
              default:
                break;
            }
            var data = {
              repname: this.repname,
              whereitems: whereitems,
              page: this.hospitalsFlag,
            };
            this.showLoadPage = true;
            printStaticsBase64(data).then((res) => {
              if (res.data != undefined && res.data != null && res.data != "") {
                this.base64ToBlobDL("", res.data[0].base64String);
                // this.fileurl = res.data[0].fileurl;
                // this.fileexcelurl = res.data[0].fileexcelurl;
                // this.printname = res.data[0].printname;
                // this.pdfUrl =
                //   "/pdfjs/web/viewer.html?file=" +
                //   encodeURIComponent(res.data[0].fileurl);
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
            // axios
            //   .post("/api-proxy/PrintReport/ReportStatics/", data)
            //   .then((res) => {

            //   });
          } else {
            this.$message({
              showClose: true,
              message: "请选择报表类型",
              type: "warning",
            });
          }
          break;
        default:
          break;
      }
    },
    base64ToBlob(name, code) {
      //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
      code = code.replace(/[\n\r]/g, "");
      var raw = window.atob(code);
      let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      let url = window.URL.createObjectURL(
        new Blob([uInt8Array], { type: "application/pdf" })
      );
      this.fileurl = url;
      this.fileexcelurl = url;
      console.log(url, "url");
      this.printname = name;
      this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
    },
    // 文件流转换文件
    base64ToBlobDL(name, code) {
      //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
      code = code.replace(/[\n\r]/g, "");
      var raw = window.atob(code);
      let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      this.downloadExportFile(
        name,
        new Blob([uInt8Array], { type: "application/pdf" })
      ); //转成pdf类型
    },
    // 下载文件
    downloadExportFile(name, blob) {
      let downloadElement = document.createElement("a");
      let href = blob;
      if (typeof blob == "string") {
        downloadElement.target = "_blank";
      } else {
        href = window.URL.createObjectURL(blob); //创建下载的链接
      }
      downloadElement.href = href;
      downloadElement.download = name + "." + "pdf"; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //触发点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      this.showLoadPage = false;
      if (typeof blob != "string") {
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    },
    handleNodeClick(data) {
      if (data.reportitems && data.reportitems.length > 0) return;
      this.repname = data.code;
      this.statisticsData = data;
      this.pdfUrl = "";
      this.activeName = "iframe";
      console.log(this.statisticsData, "this.statisticsData");
    },
    btnmoreconditions() {
      this.dialogFormVisible = true;
      console.log(this.temp);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    companychange(val) {
      if (val) {
        var data = {
          companycode: val,
        };
        reportstatics.CompanyPrintOrderLoadSearchInfo(data).then((response) => {
          this.batchitems = response.result.batchitems;
          let flag = this.batchitems.filter((k) => k.selected)[0];
          flag && (this.temp.batch = flag.code);
          this.groupitems = flag.groupitems;
          this.companydepartmentItems = flag.departitems;
          this.departitem2s = flag.departitem2s;
        });
      } else {
        this.batchitems = [];
        this.groupitems = [];
        this.companydepartmentItems = [];
        this.departitem2s = [];
        this.temp.batch = "";
        this.temp.groupcode = [];
      }
    },
    batchchange(val) {
      let flag = this.batchitems.filter((k) => k.code === this.temp.batch)[0];
      if (flag) {
        this.groupitems = flag.groupitems;
        this.companydepartmentItems = flag.departitems;
        this.departitem2s = flag.departitem2s;
      } else {
        this.groupitems = [];
        this.companydepartmentItems = [];
        this.departitem2s = [];
      }
      // this.batchitems.forEach((d) => {
      //   if (d.code == val) {
      //     this.groupitems = d.groupitems;
      //     this.companydepartmentItems = d.departitems;
      //   } else {
      //     this.groupitems = [];
      //   }
      // });
    },
    groupchange(val) {
      let flag = this.groupitems.filter((k) =>
        this.temp.groupcode.includes(k.code)
      )[0];
      // let flag = this.groupitems.filter(
      //   (k) => k.code === this.temp.groupcode
      // )[0];
      if (flag) {
        this.companydepartmentItems = flag.departitems;
        this.departitem2s = flag.departitem2s;
      } else {
        let flag1 = this.batchitems.filter(
          (k) => k.code === this.temp.batch
        )[0];
        if (flag1) {
          this.companydepartmentItems = flag1.departitems;
          this.departitem2s = flag1.departitem2s;
        } else {
          this.companydepartmentItems = [];
          this.departitem2s = [];
        }
      }
    },
    resetemp() {
      this.temp = {
        startTime: "",
        endTime: "",
        meccode: "",
        personalflag: "",
        companydepartment: "",
        deparment2: "",
        companycode: "",
        batch: "",
        groupcode: [],
        checktype: [],
        department: [],
        doctor: [],
        setmealcode: [],
        combinecode: [],
        coststart: "",
        costend: "",
        receptioncode: [],
        positionin: [],
        jobin: [],
        status: [],
        viewgroup: [],
      };
    },
    savetemplate(val) {
      this.searchdialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["searchdataForm"].clearValidate();
      });
    },
    handleModifyStatus(row) {
      console.log(row);
      var data = {
        searchcode: row.searchcode,
      };
      reportstatics.SearchDetail(data).then((response) => {
        console.log(response);
        this.checktypeitems = response.result.checktypeitems;
        this.checktypeitems.forEach((d) => {
          if (d.selected == true) {
            this.temp.checktype = d.code;
          }
        });
        this.combineitems = response.result.combineitems;
        this.combineitems.forEach((d) => {
          if (d.selected == true) {
            this.temp.combinecode = d.code;
          }
        });
        this.departmentitems = response.result.departmentitems;
        this.departmentitems.forEach((d) => {
          if (d.selected == true) {
            this.temp.department = d.code;
          }
        });
        this.doctoritems = response.result.doctoritems;
        this.doctoritems.forEach((d) => {
          if (d.selected == true) {
            this.temp.doctor = d.code;
          }
        });
        this.personalflagitems = response.result.personalflagitems;
        this.personalflagitems.forEach((d) => {
          if (d.selected == true) {
            this.temp.personalflag = d.code;
          }
        });
        this.setmealitems = response.result.setmealitems;
        this.setmealitems.forEach((d) => {
          if (d.selected == true) {
            this.temp.setmealcode = d.code;
          }
        });
        this.searchtemplatedialogFormVisible = false;
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
      });
    },
    calltemplate() {
      this.searchtemplatedialogFormVisible = true;
      this.listLoading = true;
      reportstatics.SearchLoad().then((response) => {
        this.list = response.result;
        this.listLoading = false;
        console.log(response);
      });
    },
    saveData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          var data = {
            searchname: this.searchname,
            checktype: this.temp.checktype,
            department: this.temp.department,
            doctor: this.temp.doctor,
            setmeal: this.temp.setmealcode,
            combine: this.temp.combinecode,
            personalflag: this.temp.personalflag,
          };
          reportstatics.SaveMoreSearch(data).then(() => {
            this.searchdialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
            this.saveLoading = false;
          });
        }
      });
      this.searchdialogFormVisible = false;
    },
    createData() {
      this.dialogFormVisible = false;
      console.log(this.temp);
    },
  },
};
</script>
<style lang="scss" scoped>
.page_tree {
  height: calc(100vh - 565px);
  overflow: auto;
  .el-tree {
    // overflow-y: auto;
  }
}
.el-popover {
  .content {
    .content_item {
      height: 20px;
      margin-bottom: 3px;
      padding: 0 10px;
      cursor: pointer;
    }
    .content_item:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }
  }
  .print_item {
    margin-bottom: 3px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .print_item:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
</style>