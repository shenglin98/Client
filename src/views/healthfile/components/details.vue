<template>
  <div class="details">
    <div class="head_box">
      <!-- <el-button-group>
        <el-button type="primary" size="mini" @click="handleCheckUserInfo"
          >个人信息</el-button
        >
        <el-button type="primary" size="mini" @click="handleCheckCheckData"
          >体检数据</el-button
        >
      </el-button-group> -->
      <el-button type="primary" size="mini" @click="handleClosePage">关闭</el-button>
    </div>
    <div class="userInfo" v-if="pageStatus === 'userInfo'">
      <div class="user_head">
        <div class="head_info">
          <el-row>
            <el-col class="title" :span="2">基本信息</el-col>
            <el-col class="count" :span="5"
              >共{{ userInfo.res.count }}条记录,当前体检号: {{ userInfo.regid }}</el-col
            >
          </el-row>
          <el-row class="mt">
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                姓名：<span>{{ userInfo.name || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                性别：<span>{{
                  userInfo.sex == 0 ? "未知" : userInfo.sex == 1 ? "男" : "女" || "暂无"
                }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                体检号：<span>{{ userInfo.regid || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                体检次数：<span>{{ userInfo.admiss_times || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                身份证号：<span>{{ userInfo.idcard || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                单位：<span>{{ userInfo.companyname || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                登记时间：<span>{{ userInfo.regdate || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                检查时间：<span>{{ userInfo.checkdate || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="colCals">
              <div class="head_info_item">
                总检时间：<span>{{ userInfo.totalcheckinputdate || "暂无" }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="table_box">
        <div class="jbzd">
          <div class="jbzd_content">
            <el-tabs
              v-model="tabsValue"
              size="mini"
              type="border-card"
              @tab-click="handleTabsClick"
              style="height: 100%"
            >
              <el-tab-pane label="体检记录" name="体检记录">
                <EasyTable
                  class="disease_table"
                  height="calc(100vh - 390px)"
                  :data="userInfo.res.data"
                  :tableOptions="Options"
                  :radio-config="{ rowClick: true }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  @row-click="handleRowClick"
                  :row-class-name="handleTableRowClassName"
                  :row-style="{ height: '32px' }"
                  :cell-style="{ padding: '0' }"
                />
              </el-tab-pane>
              <el-tab-pane label="问卷" name="问卷">
                <!-- 问卷 -->
                <div class="centent">
                  <div class="card" v-if="showMyInput">
                    <!-- 标题 -->
                    <!-- <div class="title_head">
                      <div class="logo"></div>
                      <h3>健康问卷</h3>
                    </div> -->
                    <!-- 内容 -->
                    <div class="life_habit">
                      <!-- 问卷题目 -->
                      <!-- 一级标题questionnairelist -->
                      <div
                        class="Questionnaire"
                        v-for="(item, index) in questionnairelist"
                        :key="index"
                      >
                        <div class="life_habit_title">
                          <h3>{{ item.itemname }}</h3>
                        </div>
                        <div class="life_habit_content">
                          <!-- 二级标题questionnaireitems -->
                          <div
                            class="basic_information"
                            v-for="item in item.questionnaireitems"
                            :key="item.itemcode"
                          >
                            <div class="two_topic">
                              <span>{{ item.itemname }}</span>
                              <!-- 二级选项optionitems -->
                              <div
                                class="two_options"
                                v-for="(value, index) in item.optionitems"
                                :key="index"
                              >
                                <span v-if="value.inputtype === -1">
                                  <template
                                    v-for="(val, index) in value.content
                                      .split('|X|')
                                      .filter((v) => v)"
                                  >
                                    <myInput
                                      v-if="showMyInput"
                                      :suffix="val"
                                      :disabled="item.editstatus == 1"
                                      :count="
                                        value.content.split('|X|').filter((v) => v).length
                                      "
                                      :value.sync="value.remark"
                                      :index="index"
                                      :key="val"
                                    />
                                  </template>
                                </span>
                                <el-radio-group
                                  v-model="item.selectvalue"
                                  :disabled="item.editstatus == 1"
                                >
                                  <el-radio
                                    v-if="[0, 3].indexOf(value.inputtype) !== -1"
                                    :label="value.selectvalue"
                                    style="margin-right: 5px"
                                  >
                                    <span v-if="value.content.indexOf('|X|') !== -1">
                                      <template
                                        v-for="(val, index) in value.content.split(',')"
                                      >
                                        <myInput
                                          :content="val"
                                          :disabled="val.editstatus == 1"
                                          :draggable="
                                            value.selectvalue != item.selectvalue
                                          "
                                          :count="value.content.split(',').length"
                                          :value.sync="value.remark"
                                          :index="index"
                                          :key="val"
                                        />
                                      </template>
                                    </span>
                                    <span v-else>
                                      {{ value.content }}
                                      <el-input
                                        v-if="[1, 3, 4].indexOf(value.inputtype) !== -1"
                                        size="mini"
                                        :disabled="value.content != item.selectvalue"
                                        v-model="value.remark"
                                        :placeholder="value.content"
                                        style="width: 160px"
                                      ></el-input>
                                    </span>
                                  </el-radio>
                                </el-radio-group>
                                <el-checkbox
                                  v-if="[2, 4].indexOf(value.inputtype) !== -1"
                                  v-model="value.flag"
                                  :label="value.content"
                                  :true-label="1"
                                  :false-label="0"
                                  >{{ value.content }}</el-checkbox
                                >
                              </div>
                              <el-input
                                v-if="[1, 3, 4].indexOf(item.inputtype) !== -1"
                                size="mini"
                                :disabled="item.editstatus == 1"
                                v-model="item.remark"
                                placeholder="请输入"
                                style="width: 160px"
                              ></el-input>
                            </div>
                            <!-- 三级标题questionnaireitems -->
                            <div
                              class="three_topic"
                              v-for="item in item.questionnaireitems"
                              :key="item.itemcode"
                            >
                              <span v-if="item.itemname.indexOf('|X|') !== -1">
                                <template
                                  v-for="(val, index) in item.itemname.split(',')"
                                >
                                  <myInput
                                    :content="val"
                                    :count="item.itemname.split(',').length"
                                    :value.sync="item.remark"
                                    :index="index"
                                    :key="val"
                                  />
                                </template>
                              </span>
                              <span v-else>
                                {{ item.itemname }}
                              </span>
                              <!-- 三级选项optionitems -->
                              <div class="three_content">
                                <div
                                  class="three_options"
                                  v-for="(item, index) in item.optionitems"
                                  :key="index"
                                >
                                  <span v-if="[-1].indexOf(item.inputtype) !== -1">
                                    <span v-if="item.content.indexOf('|X|') !== -1">
                                      <template
                                        v-for="(val, index) in item.content.split(',')"
                                      >
                                        <myInput
                                          :content="val"
                                          :count="item.content.split(',').length"
                                          :value.sync="item.remark"
                                          :index="index"
                                          :key="val"
                                        />
                                      </template>
                                    </span>
                                  </span>
                                  <el-radio
                                    v-model="sexradio"
                                    v-if="[0, 3].indexOf(item.inputtype) !== -1"
                                    :label="item.content"
                                    style="margin-right: 5px"
                                  >
                                    <span v-if="item.content.indexOf('|X|') !== -1">
                                      <template
                                        v-for="(val, index) in item.content.split(',')"
                                      >
                                        <myInput
                                          :content="val"
                                          :count="item.content.split(',').length"
                                          :value.sync="item.remark"
                                          :index="index"
                                          :key="val"
                                        />
                                      </template>
                                    </span>
                                    <span v-else>
                                      {{ item.content }}
                                    </span>
                                  </el-radio>
                                  <el-checkbox
                                    :label="item.hoyname"
                                    v-if="[2, 4].indexOf(item.inputtype) !== -1"
                                    v-model="item.flag"
                                    :true-label="1"
                                    :false-label="0"
                                  >
                                    <span v-if="item.content.indexOf('|X|') !== -1">
                                      <template
                                        v-for="(val, index) in item.content.split(',')"
                                      >
                                        <myInput
                                          :content="val"
                                          :disabled="item.flag == 0 ? true : false"
                                          :count="item.content.split(',').length"
                                          :value.sync="item.remark"
                                          :index="index"
                                          :key="val"
                                        />
                                      </template>
                                    </span>
                                    <span v-else>
                                      {{ item.content }}
                                    </span>
                                  </el-checkbox>
                                  <el-input
                                    v-if="[1].indexOf(item.inputtype) !== -1"
                                    size="mini"
                                    v-model="item.remark"
                                    style="width: 160px"
                                  ></el-input>
                                  <el-input
                                    v-if="[3, 4].indexOf(item.inputtype) !== -1"
                                    :disabled="item.flag == 0"
                                    size="mini"
                                    v-model="item.remark"
                                    style="width: 160px"
                                  ></el-input>
                                </div>
                              </div>
                              <!-- </el-checkbox-group> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="体检报告" name="体检报告">
                <el-row style="height: 100%">
                  <el-col
                    :span="11"
                    class="combinename_textBox"
                    style="margin-right: 50px"
                  >
                    <div class="head">
                      <div class="logo"></div>
                      <div class="head_text">总检综述</div>
                    </div>
                    <el-input
                      class="combinename_text"
                      type="textarea"
                      resize="none"
                      readonly
                      :autosize="true"
                      v-model="conclusiontext"
                    ></el-input>
                  </el-col>
                  <el-col :span="12" class="combinename_textBox">
                    <div class="head">
                      <div class="logo"></div>
                      <div class="head_text">健康建议</div>
                    </div>
                    <el-input
                      class="combinename_text"
                      type="textarea"
                      resize="none"
                      :autosize="true"
                      readonly
                      v-model="healthadvice"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="就诊记录" name="就诊记录">
                <EasyTable
                  class="disease_table"
                  height="calc(100vh - 390px)"
                  :data="AttendanceRecords"
                  :tableOptions="AttendanceRecordsOptions"
                  :radio-config="{ rowClick: true }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :row-style="{ height: '32px' }"
                  :cell-style="{ padding: '0' }"
                />
              </el-tab-pane>
              <el-tab-pane label="回访记录" name="回访记录">
                <div class="detali_content">
                  <div class="dc_box" v-if="transferitem">
                    <div class="title">
                      <span class="title_s">转诊</span>
                      <span class="operatorname"
                        >转诊医生：{{ transferitem.transfername }}</span
                      >
                    </div>
                    <div class="content_items">
                      <el-tag
                        v-for="(item, index) in transferitem.conclusionitems"
                        :key="index"
                        type="warning"
                        style="margin-right: 10px; cursor: pointer"
                        >{{ item.conclusion }}</el-tag
                      >
                    </div>
                    <div class="conclusion">
                      <div class="conclusion_title">转诊说明：</div>
                      <el-input
                        type="textarea"
                        resize="none"
                        readonly
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="transferitem.transferdes"
                      ></el-input>
                    </div>
                  </div>
                  <div style="margin-top: 15px" class="dc_box" v-if="followitem">
                    <div class="title">
                      <span class="title_s">复查</span>
                      <span class="operatorname"
                        >复查医生：{{ followitem.followname }}</span
                      >
                    </div>
                    <div class="content_items">
                      <el-tag
                        v-for="(item, index) in followitem.conclusionitems"
                        :key="index"
                        type="warning"
                        style="margin-right: 10px; cursor: pointer"
                        >{{ item.conclusion }}</el-tag
                      >
                    </div>
                    <div class="conclusion">
                      <div class="conclusion_title">复查说明：</div>
                      <el-input
                        type="textarea"
                        resize="none"
                        readonly
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="followitem.followdes"
                      ></el-input>
                    </div>
                  </div>
                  <div style="margin-top: 15px" class="dc_box" v-if="bcakitem">
                    <div class="title">
                      <span class="title_s">回访</span>
                      <span class="operatorname">回访医生：{{ bcakitem.backname }}</span>
                    </div>
                    <div class="conclusion">
                      <div class="conclusion_title">回访说明：</div>
                      <el-input
                        type="textarea"
                        readonly
                        resize="none"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="bcakitem.backdes"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="备注" name="备注">
                <el-row>
                  <el-col :span="22">
                    <el-input
                      class="combinename_text"
                      type="textarea"
                      resize="none"
                      :autosize="true"
                      placeholder="请输入内容"
                      v-model="healthremark"
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button size="mini" type="primary" @click="saveHealthRemark"
                      >保 存</el-button
                    >
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- 预览弹框 -->
    <el-dialog
      title="预览"
      class="preview_box"
      :visible.sync="showPreview"
      width="650px"
      top="5vh"
      @close="handleCloseDialog"
    >
      <iframe
        ref="pdfCotainer"
        :src="pdfUrl"
        width="100%"
        style="height: calc(100vh - 147px)"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script>
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
import {
  getTotalCheck,
  LoadTransferDetail,
  GetHealthRemark,
  SaveHealthRemark,
  VisitRecord,
} from "@/api/totalcheck.js"; // 引入接口文件
import { questionnaire } from "@/api/surveyinformation.js";
import myInput from "./input";
import { printBase64 } from "@/api/printreport.js";
export default {
  name: "",

  components: {
    myInput,
  },

  props: {
    userInfo: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      pageStatus: "userInfo", // 个人信息-userInfo
      tabsValue: "体检记录", // 体检记录 问卷 体检报告 就诊记录 回访记录 备注
      showMyInput: true,
      questionnairelist: [], // 问卷
      sexradio: [],
      conclusiontext: "", // 综述文字
      healthadvice: "", // 结论词 - 健康建议文本域
      healthremark: "", // 备注
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      transferitem: {}, // 转诊
      followitem: {},
      bcakitem: {},
      pdfUrl: "",
      showPreview: false,
      AttendanceRecords: [], // 就诊记录数据
    };
  },

  mounted() {},

  methods: {
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.showPreview = false;
    },
    handlePreviewReport(item) {
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [item.regid],
        // repname: d.$children[0].$attrs["data-remark"],
        repname: "2、报告书",
        whereitems: [],
      };
      printBase64(data).then((res) => {
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
        this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      });
    },
    // 体检记录表 点击行回调
    handleRowClick(row) {
      console.log(row, 123);
      this.$emit("set", row);
    },
    // 就诊记录回调
    handleAttendanceRecords() {
      VisitRecord({ idcard: this.userInfo.idcard }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.AttendanceRecords = res.result;
        }
      });
    },
    handleTabsClick() {
      console.log(this.tabsValue);
      switch (this.tabsValue) {
        case "问卷":
          this.handleQuestionnaire();
          break;
        case "体检报告":
          this.handleTotalCheck();
          break;
        case "就诊记录":
          this.handleAttendanceRecords();
          break;
        case "回访记录":
          this.handleCheckDetails();
          break;

        case "备注":
          this.handleremerk();
          break;

        default:
          break;
      }
    },
    // 保存备注
    saveHealthRemark() {
      SaveHealthRemark({
        regid: this.userInfo.regid,
        healthremark: this.healthremark,
      }).then((res) => {
        res.code == 200 &&
          (this.$message({
            type: "success",
            message: "保存成功",
          }),
          this.handleremerk());
      });
    },
    // 备注获取
    handleremerk() {
      GetHealthRemark({ regid: this.userInfo.regid }).then((res) => {
        console.log(res);
        this.healthremark = res.result.healthremark;
      });
    },
    //  回访记录
    handleCheckDetails() {
      LoadTransferDetail({ regid: this.userInfo.regid }).then((res) => {
        console.log(res);
        if (!!res.data) {
          this.transferitem = res.data.transferitem;
          this.followitem = res.data.followitem;
          this.bcakitem = res.data.bcakitem;
        }
      });
    },
    // 获取总检综述
    handleTotalCheck() {
      getTotalCheck({
        whereitems: [{ key: "regid", value: this.userInfo.regid }],
      }).then((res) => {
        console.log(res);
        this.conclusiontext = res.result.conclusiontext; // 总检综述
        this.healthadvice = res.result.healthadvice; // 健康建议
      });
    },
    handleClosePage() {
      this.$emit("close");
    },
    // 问卷
    handleQuestionnaire() {
      let data = {
        regid: this.userInfo.regid,
        titlecode: "1006",
      };
      questionnaire(data).then((res) => {
        this.questionnairelist = res.result;
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
  },

  watch: {},

  computed: {
    Options() {
      return [
        {
          title: "姓名",
          width: 100,
          omit: 1,
          prop: "name",
        },
        {
          title: "性别",
          width: 80,
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          width: 80,
          prop: "age",
        },
        {
          title: "体检号",
          width: 150,
          omit: 1,
          prop: "regid",
        },
        {
          title: "身份证",
          width: 150,
          omit: 1,
          prop: "idcard",
        },
        {
          title: "报告书",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handlePreviewReport(data)}
              >
                预览
              </el-link>
            );
          },
          width: 100,
          omit: 1,
        },
        {
          title: "体检套餐",
          width: 200,
          omit: 1,
          prop: "setmealname",
        },
        {
          title: "体检费用",
          prop: "discountprice",
          width: 120,
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 150,
          omit: 1,
        },
        {
          title: "体检单位",
          prop: "companyname",
          width: 150,
          omit: 1,
        },
        {
          title: "体检次数",
          prop: "admiss_times",
          width: 100,
          omit: 1,
        },
        {
          title: "登记时间",
          prop: "regdate",
          width: 150,
          omit: 1,
        },
        {
          title: "体检时间",
          prop: "checkdate",
          width: 200,
          omit: 1,
        },
        {
          title: "总检时间",
          prop: "totalcheckinputdate",
          width: 200,
          omit: 1,
        },
      ];
    },
    // 就诊记录
    AttendanceRecordsOptions() {
      return [
        {
          title: "序号",
          prop: "id",
          width: 60,
          omit: 1,
        },
        {
          title: "姓名",
          width: 90,
          omit: 1,
          prop: "name",
        },
        {
          title: "年龄",
          width: 60,
          prop: "age",
        },
        {
          title: "身份证",
          width: 150,
          omit: 1,
          prop: "idcard",
        },
        {
          title: "科室",
          width: 150,
          omit: 1,
          prop: "departname",
        },
        {
          title: "医生",
          prop: "doctor",
          width: 100,
          omit: 1,
        },
        {
          title: "诊断",
          prop: "diagnose",
          width: 210,
          omit: 1,
        },
        {
          title: "出院日期",
          prop: "disDate",
          width: 180,
          omit: 1,
        },
        {
          title: "出院时间",
          prop: "disTime",
          width: 180,
          omit: 1,
        },
        {
          title: "登记号",
          prop: "healthcard",
          width: 150,
          omit: 1,
        },
        {
          title: "住院号",
          prop: "inpatientNo",
          width: 150,
          omit: 1,
        },
        {
          title: "登记类型",
          prop: "registerType",
          width: 180,
          omit: 1,
        },
        {
          title: "就诊日期",
          prop: "visitDate",
          width: 180,
          omit: 1,
        },
        {
          title: "就诊时间",
          prop: "vistTime",
          width: 180,
          omit: 1,
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/wenjuan.scss";
.details {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .dc_box {
    .title {
      width: 100%;
      background-color: #e5f1f9;
      padding: 0 0 0 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title_s {
        color: #000;
        font-weight: 600;
        font-size: 20px;
      }
      .operatorname {
        width: 220px;
        font-weight: 600;
      }
    }
  }
  .combinename_textBox {
    box-sizing: border-box;
    overflow: auto;
    border-radius: 6px;
    border: 1px solid #dcdfe6;
    .head {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      background-color: #f6f7fc;
      padding-left: 12px;
      border-radius: 5px 5px 0 0;
      line-height: 38px;
      .logo {
        width: 7px;
        height: 20px;
        background-color: #5c7ceb;
        border-radius: 3.5px;
        margin-right: 5px;
      }
    }
  }
  .combinename_text {
    height: 100%;
    /deep/.el-textarea__inner {
      height: 500px !important;
      background-color: #fff;
      border: 0 none;
      outline: none;
      padding: 0 0 0 5px;
      font-size: 18px !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .head_box {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: end;
    background-color: #fff;
    border-radius: 6px;
    padding: 0 10px;
  }
  .userInfo {
    margin-top: 5px;
    width: 100%;
    height: calc(100% - 45px);
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;
    .user_head {
      display: flex;
      .head_info {
        flex: 1;
        padding: 0 15px;
        .title {
          font-size: 18px;
          font-weight: 600;
        }
        .mt {
          margin-top: 10px;
        }
        .head_info_item {
          > span {
            color: #605d5d;
          }
        }
        .colCals {
          margin-bottom: 20px !important;
        }
      }
      .count {
        color: red;
        font-size: 13px;
        line-height: 35px;
        font-weight: bold;
      }
    }
    .img_box {
      padding: 5px;
      box-sizing: border-box;
      // 照片
      .photo_box {
        width: 100px;
        .avatar {
          width: 100px;
          height: 115px;
          border: 1px solid #ebeef5;
        }
      }
    }
    .jkqk_content {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .jkqk_item {
        // border-bottom: 1px solid #e2e3e4;
        // min-height: 33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 5px 10px;
        .jkqk_item_head {
          display: flex;
          align-items: center;
          > img {
            width: 20px;
            height: 20px;
          }
          > div {
            font-style: 16px;
            font-weight: 600;
            margin-left: 8px;
          }
        }
        .jkqk_item_content {
          font-size: 14px;
        }
      }
    }
    .table_box {
      height: calc(100% - 135px);
      width: 100%;
      box-sizing: border-box;
      margin-top: 0;
      display: flex;
      .jbzd {
        width: 100%;
        height: 100%;

        .head {
          font-size: 18px;
          font-weight: 600;
        }
        .jbzd_content {
          height: 100%;
          .disease_table {
            height: 100%;
          }
        }
      }
      .zyzb {
        margin-left: 10px;
        width: calc(60% - 10px);
        height: 100%;
        .head {
          font-size: 18px;
          font-weight: 600;
        }
        .subject_r_t_r_content {
          height: calc(100% - 30px);
          .indicator_table {
            height: 100%;
          }
        }
      }
    }
    .subject_r_b {
      margin-top: 10px;
      width: 100%;
      height: 300px;
      border-radius: 6px;
      overflow: hidden;
      background-color: #fff;
      .subject_r_b_content {
        width: 100%;
        height: calc(100% - 40px);
        padding: 10px;
        display: flex;
        overflow-x: auto;
        .chart_content {
          flex-shrink: 0;
          width: 280px !important;
          margin-right: 20px;
          height: 100%;
        }
      }
    }
  }
}
</style>
