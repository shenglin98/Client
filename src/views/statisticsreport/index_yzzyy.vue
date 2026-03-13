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
                <el-col :span="5">
                  <el-tag effect="dark"> 登记日期 </el-tag>
                </el-col>
                <el-col :span="10">
                  <el-date-picker v-model="temp.startTime" size="mini" style="width: 95%" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="9">
                  <el-date-picker v-model="temp.endTime" size="mini" style="width: 95%" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-col>
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
                    <el-option v-for="item in companyitems" :key="item.code" :label="item.name" :value="item.code">
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
                  <el-select v-model="temp.groupcode" size="mini" filterable clearable style="width: 97.5%" placeholder="请选择">
                    <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code">
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
                    <el-option v-for="item in companydepartmentItems" :key="item.code" :label="item.name" :value="item.code">
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
          <el-col :span="17">
            <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 147px)"></iframe>
          </el-col>
        </el-row>
        <el-dialog class="dialog-mini" :close-on-click-modal="false" width="600px" :title="dialogStatus" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :model="temp" label-position="right" label-width="130px">
            <el-form-item size="mini" :label="'体检类型'">
              <el-select v-model="temp.checktype" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'检查科室'">
              <el-select v-model="temp.department" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option v-for="item in deptItems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'检查医生'">
              <el-select v-model="temp.doctor" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'体检套餐'">
              <el-select v-model="temp.setmealcode" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option v-for="item in setmealitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'体检组合'">
              <el-select v-model="temp.combinecode" filterable clearable style="width: 97.5%" placeholder="请选择">
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
              <el-select v-model="temp.receptioncode" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" :label="'任职情况'">
              <el-select v-model="temp.positionin" filterable clearable style="width: 97.5%" placeholder="请选择">
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
              <el-select v-model="temp.jobin" filterable clearable style="width: 97.5%" placeholder="请选择">
                <el-option label="在职" value="在职"></el-option>
                <el-option label="离休" value="离休"></el-option>
                <el-option label="退休" value="退休"></el-option>
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
import { ReportStatics } from "@/api/reportstatics";
import { printStaticsBase64 } from "@/api/printreport.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { getDicItemDetail } from "@/api/projectdictionary2.js";
import util from "@/utils/base64ToFile";
import { getAllUser } from "@/api/customermanage.js";
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
        companycode: "",
        batch: "",
        groupcode: "",
        checktype: "",
        department: "",
        doctor: "",
        setmealcode: "",
        combinecode: "",
        coststart: "",
        costend: "",
        receptioncode: "",
        positionin: "",
        jobin: "",
      },
      dialogStatus: "更多条件",
      searchnamedialogStatus: "保存搜索条件",
      searchtemplatedialogStatus: "调用模板",
      value: "",
      dialogFormVisible: false,
      defaultProps: {
        children: "reportitems",
        label: "code",
      },
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
      }
      console.log(response);
    });
  },
  mounted() {
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
    // 获取默认时间
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_StatisticsReport_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
        this.temp.startTime = this.gettime(start);
        this.temp.endTime = this.gettime(start);
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
          var tempdata = {
            key: d,
            value: temp[d],
          };
          whereitems.push(tempdata);
        });
        var data = {
          repname: this.repname,
          whereitems: whereitems,
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
    onBtnClicked: function (domId) {
      console.log(domId);
      switch (domId) {
        case "btnStatistics":
          this.handleStatistics();
          break;
        case "btnReset":
          this.resetemp();
          break;
        case "btnExcel":
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
              console.log(keys);
              keys.forEach((d) => {
                var tempdata = {
                  key: d,
                  value: temp[d],
                };
                whereitems.push(tempdata);
              });
              var data = {
                repname: this.repname,
                filetype: "devxlsx",
                outtype: "url",
                designtype: "dev",
                whereitems: whereitems,
              };
              this.showLoadPage = true;
              printStaticsBase64(data).then((res) => {
                if (
                  res.data != undefined &&
                  res.data != null &&
                  res.data != ""
                ) {
                  if (!res.data) return;
                  const link = document.createElement("a"); //创建下载a标签
                  link.href = res.data[0].fileurl;
                  link.style.display = "none"; //默认隐藏元素
                  document.body.appendChild(link); // body中添加元素
                  link.click(); // 执行点击事件
                  document.body.removeChild(link); //下载完成后移除元素
                  this.showLoadPage = false;
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
            console.log(keys);
            keys.forEach((d) => {
              var tempdata = {
                key: d,
                value: temp[d],
              };
              whereitems.push(tempdata);
            });
            var data = {
              repname: this.repname,
              whereitems: whereitems,
            };
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
      if (typeof blob != "string") {
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    },
    handleNodeClick(data) {
      if (data.reportitems && data.reportitems.length > 0) return;
      this.repname = data.code;
      this.statisticsData = data;
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
      var data = {
        companycode: val,
      };
      reportstatics.CompanyPrintOrderLoadSearchInfo(data).then((response) => {
        this.batchitems = response.result.batchitems;
      });
    },
    batchchange(val) {
      this.batchitems.forEach((d) => {
        if (d.code == val) {
          this.groupitems = d.groupitems;
          this.companydepartmentItems = d.departitems;
        }
      });
    },
    resetemp() {
      this.temp = {
        startTime: "",
        endTime: "",
        meccode: "",
        personalflag: "",
        companydepartment: "",
        companycode: "",
        batch: "",
        groupcode: "",
        checktype: "",
        department: "",
        doctor: "",
        setmealcode: "",
        combinecode: "",
        coststart: "",
        costend: "",
        receptioncode: "",
        positionin: "",
        jobin: "",
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
</style>