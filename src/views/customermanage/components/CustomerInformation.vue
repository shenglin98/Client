<template>
  <div class="customer_information">
    <div class="basic_information_box">
      <div class="header">
        <div class="header_title">
          <div class="logo"></div>
          基本信息
        </div>
        <div class="close">
          <el-button
            type="primary"
            plain
            size="small"
            icon="el-icon-close"
            @click="send"
            >关闭</el-button
          >
        </div>
      </div>
      <div class="information_details">
        <div class="details_list">
          <div class="lable">客户名称：</div>
          {{ customersales.companyname }}
        </div>
        <div class="details_list">
          <div class="lable">简称：</div>
          {{ customersales.shortname }}
        </div>
        <div class="details_list">
          <div class="lable">跟进人：</div>
          {{ customersales.followupname }}
        </div>
        <div class="details_list">
          <div class="lable">下次跟进时间：</div>
          {{ customersales.operatordate }}
        </div>
      </div>
    </div>
    <div class="tab" v-if="status == 1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="客户全景" name="first">
          <div class="user_management">
            <div class="basic_information">
              <div class="header">
                <div class="header_title">
                  <div class="logo"></div>
                  基本资料
                </div>
              </div>
              <div class="user_msg">
                <div class="msg_list">
                  <div class="lable">单位ID：</div>
                  {{ customersales.sasid }}
                </div>
                <div class="msg_list">
                  <div class="lable">客户名称：</div>
                  {{ customersales.companyname }}
                </div>
                <div class="msg_list">
                  <div class="lable">客户类型：</div>
                  {{ customersales.typename }}
                </div>
                <div class="msg_list">
                  <div class="lable">客户简称：</div>
                  {{ customersales.shortname }}
                </div>
                <div class="msg_list">
                  <div class="lable">父单位：</div>
                  {{ customersales.companyhname }}
                </div>
                <div class="msg_list">
                  <div class="lable">联系人：</div>
                  {{ customersales.contacts }}
                </div>
                <div class="msg_list">
                  <div class="lable">联系电话：</div>
                  {{ customersales.telephone }}
                </div>
                <div class="msg_list">
                  <div class="lable">传真：</div>
                  {{ customersales.faxnumber }}
                </div>
                <div class="msg_list">
                  <div class="lable">邮箱：</div>
                  {{ customersales.email }}
                </div>
                <div class="msg_list">
                  <div class="lable">邮编：</div>
                  {{ customersales.postalcode }}
                </div>
                <div class="msg_list">
                  <div class="lable">单位地址：</div>
                  {{ customersales.address }}
                </div>
              </div>
              <div class="contact_box">
                <div class="contact">
                  <div class="contact_header">
                    <div class="contact_header_title">联系人</div>
                    <div class="add_contact" @click="addContact">
                      <i class="el-icon-plus"></i>增加
                    </div>
                  </div>
                  <el-table
                    :data="customercontacts"
                    style="width: 100%"
                    height="130"
                  >
                    <el-table-column prop="personname" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="telephone" label="电话" width="180">
                    </el-table-column>
                    <el-table-column prop="department" label="部门" width="180">
                    </el-table-column>
                    <el-table-column prop="post" label="职务">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="contact_box">
                <div class="contact">
                  <div class="contact_header">
                    <div class="contact_header_title">跟进人</div>
                    <div class="add_contact" @click="addFollowUp">
                      <i class="el-icon-plus"></i>增加
                    </div>
                  </div>
                  <el-table
                    :data="customerfollowers"
                    style="width: 100%"
                    height="130"
                  >
                    <el-table-column prop="personname" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="telephone" label="电话" width="180">
                    </el-table-column>
                    <el-table-column prop="department" label="部门" width="180">
                    </el-table-column>
                    <el-table-column prop="post" label="职务">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <div class="dynamic">
              <div class="header">
                <div class="header_title">
                  <div class="logo"></div>
                  跟进动态
                </div>
                <div class="follow_box">
                  <el-checkbox v-model="checked">只看跟进</el-checkbox>
                  <div class="add_contact" @click="writeFollowUp">
                    <i class="el-icon-plus"></i>写跟进
                  </div>
                </div>
              </div>
              <div class="dynamic_box">
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in salesfollowups"
                    :key="index"
                    :timestamp="item.followupdate"
                    placement="top"
                  >
                    <el-card>
                      <div class="timeline_head">
                        <div class="head_left">
                          <el-avatar :size="30" :src="circleUrl"></el-avatar>
                          <span class="name">{{ item.contacts }}</span>
                        </div>
                        <div class="head_right">{{ item.contacts }}</div>
                      </div>
                      <div class="content">{{ item.content }}</div>
                      <div class="follow_time">
                        写跟进时间：{{ item.followupdate }}
                      </div>
                      <div class="customer">
                        <div class="customer_name">
                          来自客户：<span>{{ customersales.companyname }}</span>
                        </div>
                        <div>评论（0）</div>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </div>
          <el-dialog
            title="联系人"
            :visible.sync="dialogVisible"
            width="25%"
            :before-close="handleClose"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <div>
              <el-form
                :label-position="labelPosition"
                label-width="60px"
                :model="formLabelAlign"
              >
                <el-form-item label="姓名">
                  <el-input
                    v-model="formLabelAlign.personname"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input
                    v-model="formLabelAlign.telephone"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input
                    v-model="formLabelAlign.email"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="部门">
                  <el-input
                    v-model="formLabelAlign.department"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="职位">
                  <el-input
                    v-model="formLabelAlign.post"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer center">
              <el-button
                @click="(dialogVisible = false), handleResetFormLabelAlign()"
                >取 消</el-button
              >
              <el-button type="primary" @click="handleAddStakeholder"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <el-dialog
            title="跟进人"
            :visible.sync="dialogVisibleOne"
            width="25%"
            :before-close="handleClose"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <div>
              <el-form
                :label-position="labelPosition"
                label-width="80px"
                :model="formLabelAlign"
              >
                <el-form-item label="姓名">
                  <el-input
                    v-model="formLabelAlign.personname"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input
                    v-model="formLabelAlign.telephone"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select
                    size="mini"
                    v-model="formLabelAlign.type"
                    placeholder="请选择"
                    disabled
                  >
                    <el-option
                      size="mini"
                      label="客户联系人"
                      :value="0"
                    ></el-option>
                    <el-option
                      size="mini"
                      label="跟进人"
                      :value="1"
                    ></el-option>
                    <el-option
                      size="mini"
                      label="协助人"
                      :value="2"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="更新日期">
                  <el-date-picker
                    v-model="formLabelAlign.operatordate"
                    size="mini"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer center">
              <el-button
                @click="(dialogVisibleOne = false), handleResetFormLabelAlign()"
                >取 消</el-button
              >
              <el-button type="primary" @click="handleAddStakeholderOne"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <el-dialog
            title="写跟进"
            :visible.sync="dialogVisibletwo"
            width="50%"
            :before-close="handleClose"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <div>
              <el-form
                :label-position="labelPosition"
                label-width="100px"
                :model="followups"
              >
                <div class="item_box">
                  <el-form-item label="跟进方式">
                    <el-select
                      size="mini"
                      v-model="followups.followuptype"
                      placeholder="请选择"
                    >
                      <el-option
                        size="mini"
                        v-for="item in followuptypeItems"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟进时间">
                    <el-date-picker
                      v-model="followups.followupdate"
                      size="mini"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
                <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入内容"
                  v-model="followups.content"
                >
                </el-input>
                <div class="item_box">
                  <el-form-item label="联系人">
                    <el-select
                      size="mini"
                      v-model="followups.contactscode"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in optionsFollowPeople"
                        size="mini"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟进状态">
                    <el-select
                      size="mini"
                      v-model="followups.followupstatus"
                      placeholder="请选择"
                    >
                      <el-option
                        size="mini"
                        v-for="item in followupstatusItems"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="item_box">
                  <el-form-item label="跟进人">
                    <el-select
                      size="mini"
                      v-model="followups.followupcode"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in optionsCreatePeople"
                        size="mini"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="下次跟进时间">
                    <el-date-picker
                      v-model="followups.nextdate"
                      size="mini"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer center">
              <el-button
                @click="(dialogVisibletwo = false), handleResetFollowups()"
                >取 消</el-button
              >
              <el-button type="primary" @click="handleAddFollowups"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="附言" name="second">
          <div>
            <div class="header">
              <div class="header_title">
                <div class="logo"></div>
                附言
              </div>
            </div>
            <div class="postscript_box">
              <el-form
                ref="postscriptForm"
                :model="postscriptForm"
                label-width="120px"
                size="small"
              >
                <div class="postscript_box_left">
                  <el-form-item label="开始时间:">
                    <el-date-picker
                      v-model="postscriptForm.startdate"
                      type="date"
                      placeholder="开始时间:"
                      value-format="yyyy-MM-dd"
                      range-separator="-"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间:">
                    <el-date-picker
                      v-model="postscriptForm.enddate"
                      type="date"
                      placeholder="结束时间:"
                      value-format="yyyy-MM-dd"
                      range-separator="-"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="套餐标准:">
                    <el-select
                      v-model="postscriptForm.setmealstandard"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in setMeal"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="体检费用:">
                    <el-select
                      v-model="postscriptForm.paymentmethod"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in paymentmethodSelect"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="超出费用:">
                    <el-select
                      v-model="postscriptForm.excessmethod"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in excessmethodSelect"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="报告领取:">
                    <el-select
                      v-model="postscriptForm.reporttake"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in reporttakeSelect"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="单位联系人:">
                    <el-input
                      v-model="postscriptForm.companycontacts"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话:">
                    <el-input
                      v-model="postscriptForm.companytelephone"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="本科联系人:">
                    <el-input v-model="postscriptForm.contacts"></el-input>
                  </el-form-item>
                  <el-form-item label="操作人:">
                    <el-input v-model="postscriptForm.operatorname"></el-input>
                  </el-form-item>
                  <el-form-item label="操作时间:">
                    <el-date-picker
                      v-model="postscriptForm.operatordate"
                      type="datetime"
                      placeholder="选择日期时间"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="postscript_box_right">
                  <div class="combo_title">套餐说明:</div>
                  <el-input
                    type="textarea"
                    :rows="9"
                    placeholder="请输入内容"
                    v-model="postscriptForm.setmealexplain"
                  >
                  </el-input>
                  <div class="combo_title">备注:</div>
                  <el-input
                    type="textarea"
                    :rows="9"
                    placeholder="请输入内容"
                    v-model="postscriptForm.remark"
                  >
                  </el-input>
                  <div class="foot_operation">
                    <el-button
                      type="primary"
                      size="small"
                      @click="savePostscript()"
                      >保存</el-button
                    >
                    <el-button type="primary" size="small">打印</el-button>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="任务" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="报价单" name="fourth">
          <div class="quotation">
            <div class="add">
              <el-button @click="add" type="primary" size="small"
                >添加</el-button
              >
            </div>
            <div class="quotation_table">
              <el-table
                :data="tableDataOne"
                border
                style="width: 100%"
                :header-cell-style="{ background: '#CFDEEB' }"
              >
                <el-table-column
                  prop="quotename"
                  label="报价单名称"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="operatorname"
                  label="报价接收人"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="operatordate" label="报价日期">
                </el-table-column>
                <el-table-column prop="operatorname" label="报价人">
                </el-table-column>
                <el-table-column prop="remark" label="备注"> </el-table-column>
                <el-table-column prop="address" label="操作">
                  <template slot-scope="scope">
                    <!-- <span v-if="scope.row.delflag == 0">正常</span> -->
                    <el-link type="primary" style="margin-right: 15px"
                      >打印</el-link
                    >
                    <el-link
                      type="primary"
                      @click="handleQuoteDelete(scope.row.queid)"
                      >删除</el-link
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="合同" name="five">定时任务补偿</el-tab-pane>
        <el-tab-pane label="附件" name="six">定时任务补偿</el-tab-pane>
        <el-tab-pane label="操作日志" name="seven">定时任务补偿</el-tab-pane>
      </el-tabs>
      <div class="intention_select">
        状态
        <div class="select">
          <el-select size="mini" v-model="value" placeholder="请选择">
            <el-option
              size="mini"
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!-- 报价单添加界面 -->
    <add-quotation
      v-if="status == 2"
      :sasid="sasid"
      @save="savesingle"
    ></add-quotation>
  </div>
</template>
<script>
import AddQuotation from "./AddQuotation/AddQuotation.vue";
import {
  getDetailView,
  addStakeholder,
  addFollowup,
  getAllUser,
  getPublicConfig,
  quoteLoad,
  quoteDelete,
  postscriptDetail,
  postscriptAdd,
  postscriptUpdate,
} from "@/api/customermanage.js";
export default {
  components: {
    AddQuotation,
  },
  props: {
    sasid: {
      require: true,
      type: String,
    },
  },
  data() {
    return {
      textarea: "",
      activeName: "first",
      tableData: [
        {
          date: "张工",
          name: "",
          iphon: "13487592209",
          address: "",
        },
        {
          date: "林工",
          name: "",
          iphon: "17829501955",
          address: "",
        },
        {
          date: "陈工",
          name: "",
          iphon: "13495810488",
          address: "",
        },
        {
          date: "李工",
          name: "",
          iphon: "17852401922",
          address: "",
        },
      ],
      tableDataOne: [
        {
          name: "2022年体检报价单",
          plple: "张科长",
          data: "2022-01-18",
          offer: "李医生",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "意向",
        },
      ],
      optionsone: [
        {
          value: "选项1",
          label: "负责人",
        },
      ],
      optionstwo: [
        {
          value: "选项1",
          label: "电话",
        },
      ],
      optionsthree: [
        {
          value: "选项1",
          label: "张三",
        },
      ],
      optionsfour: [
        {
          value: "选项1",
          label: "李生",
        },
      ],
      optionsfive: [
        {
          value: "选项1",
          label: "有需求跟进",
        },
      ],
      optionsFollowPeople: [],
      optionsCreatePeople: [],
      value: "",
      value1: "",
      checked: true, //选中态
      dialogVisible: false,
      dialogVisibleOne: false,
      dialogVisibletwo: false,
      labelPosition: "right",
      formLabelAlign: {
        personname: "",
        telephone: "",
        email: "",
        department: "",
        post: "",
        type: 0,
        operatordate: "",
      },
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      status: "1", //状态
      customersales: {},
      customercontacts: [],
      customerfollowers: [],
      salesfollowups: [],
      followuptypeItems: [],
      followupstatusItems: [],
      followups: {
        followuptype: "",
        followupdate: "",
        content: "",
        contactscode: "",
        contacts: "",
        followupstatus: "",
        followupcode: "",
        nextdate: "",
        followupname: "",
      },
      postscriptForm: {
        startdate: "", //开始时间
        enddate: "", //结束时间
        setmealstandard: "", //套餐标准(既定、自选)
        paymentmethod: "", //体检费用(记账、自费)
        excessmethod: "", //超额支付(记账、自费)
        reporttake: "", //报告领取(统一领取、自取)
        companycontacts: "", //单位联系人
        companytelephone: "", //联系电话
        contacts: "", //本科联系人
        operatorcode: "", //操作人编码
        operatorname: "", //操作人姓名
        operatordate: "", //操作时间
        setmealexplain: "", //套餐说明
        remark: "", //备注
        pptid: "",
        sasid: "",
      }, //附言
      setMeal: [
        {
          label: "既定",
          value: "既定",
        },
        {
          label: "自选",
          value: "自选",
        },
      ], //套餐
      paymentmethodSelect: [
        {
          label: "记账",
          value: "记账",
        },
        {
          label: "自费",
          value: "自费",
        },
      ], //体检费用
      excessmethodSelect: [
        {
          label: "记账",
          value: "记账",
        },
        {
          label: "自费",
          value: "自费",
        },
      ], //超出费用
      reporttakeSelect: [
        {
          label: "统一领取",
          value: "统一领取",
        },
        {
          label: "自取",
          value: "自取",
        },
      ], //报告领取
      count: "", //当他等于0调用新增附言的接口,否则就是修改附言
    };
  },
  mounted() {
    this.handleGetDetailView();
  },
  methods: {
    // 报价单列表删除回调
    handleQuoteDelete(queid) {
      quoteDelete({ queid }).then((res) => {
        this.$message.success(res.message);
        this.handleQuoteLoad();
      });
    },
    // 报价单列表
    handleQuoteLoad() {
      quoteLoad({
        page: 1,
        limit: 10000,
        key: "",
      }).then((res) => {
        this.tableDataOne = res.data;
      });
    },
    handleAddFollowups() {
      this.followups.sasid = this.sasid;
      let flag = this.optionsFollowPeople.filter((k) => {
        return k.code === this.followups.contactscode;
      })[0];
      flag && (this.followups.contacts = flag.name);
      let index = this.optionsFollowPeople.filter((k) => {
        return k.code === this.followups.followupcode;
      })[0];
      index && (this.followups.followupname = index.name);
      addFollowup(this.followups).then((res) => {
        this.$message.success(res.message);
        this.dialogVisibletwo = false;
        this.handleResetFollowups();
        this.handleGetDetailView();
      });
    },
    handleAddStakeholderOne() {
      this.formLabelAlign.sasid = this.sasid;
      this.formLabelAlign.type = 1;
      addStakeholder(this.formLabelAlign).then((res) => {
        this.$message.success(res.message);
        this.dialogVisibleOne = false;
        this.handleResetFormLabelAlign();
        this.handleGetDetailView();
      });
    },
    handleAddStakeholder() {
      this.formLabelAlign.sasid = this.sasid;
      this.formLabelAlign.type = 0;
      addStakeholder(this.formLabelAlign).then((res) => {
        this.$message.success(res.message);
        this.dialogVisible = false;
        this.handleResetFormLabelAlign();
        this.handleGetDetailView();
      });
    },
    handleResetFollowups() {
      this.followups = {
        followuptype: "",
        followupdate: "",
        content: "",
        contacts: "",
        followupstatus: "",
        followupcode: "",
        nextdate: "",
      };
    },
    handleResetFormLabelAlign() {
      this.formLabelAlign = {
        personname: "",
        telephone: "",
        email: "",
        department: "",
        post: "",
        type: 0,
        operatordate: "",
      };
    },
    handleGetDetailView() {
      getDetailView({ sasid: this.sasid }).then((res) => {
        console.log(res.result);
        this.customersales = res.result.customer_sales;
        this.customercontacts = res.result.customer_contacts;
        this.customerfollowers = res.result.customer_followers;
        this.salesfollowups = res.result.customer_sales_followups;
      });
    },
    handleClick(tab, event) {
      switch (this.activeName) {
        case "first": // 客户全景
          this.handleGetDetailView();
          break;
        case "fourth": // 报价单
          this.handleQuoteLoad();
          break;
        case "second": // 附言
          this.getPostscriptDetail();
          break;
        default:
          break;
      }
    },
    // 弹窗
    handleClose(done) {
      done();
    },
    send() {
      this.$emit("close");
    },
    // 新增联系人
    addContact() {
      this.dialogVisible = true;
    },
    addFollowUp() {
      this.dialogVisibleOne = true;
      this.formLabelAlign.type = 1;
    },
    writeFollowUp() {
      this.dialogVisibletwo = true;
      getAllUser().then((res) => {
        this.optionsFollowPeople = res.data;
        this.optionsCreatePeople = res.data;
      });
      // 跟进方式
      getPublicConfig({ cc: "SalesFollowUpType" }).then((res) => {
        this.followuptypeItems = res.result;
      });
      // 跟进状态
      getPublicConfig({ cc: "SalesFollowUpStatus" }).then((res) => {
        this.followupstatusItems = res.result;
      });
    },
    add() {
      this.status = "2";
    },
    savesingle() {
      this.status = "1";
      this.handleQuoteLoad();
    },
    // 保存附言
    savePostscript() {
      // 当他等于0调用新增附言的接口,否则就是修改附言
      if (this.count == 0) {
        this.addPostscript();
      } else {
        this.updatePostscript();
      }
    },
    // 附言详情
    getPostscriptDetail() {
      var data = {
        sasid: this.sasid,
      };
      postscriptDetail(data).then((res) => {
        this.count = res.count;
        if (res.data) {
          this.postscriptForm = res.data;
        }
        console.log(this.postscriptForm);
      });
    },
    // 新增附言
    addPostscript() {
      var data = {
        pptid: "",
        sasid: this.sasid,
        startdate: this.postscriptForm.startdate,
        enddate: this.postscriptForm.enddate,
        setmealstandard: this.postscriptForm.setmealstandard,
        paymentmethod: this.postscriptForm.paymentmethod,
        excessmethod: this.postscriptForm.excessmethod,
        reporttake: this.postscriptForm.reporttake,
        companycontacts: this.postscriptForm.companycontacts,
        companytelephone: this.postscriptForm.companytelephone,
        contacts: this.postscriptForm.contacts,
        setmealexplain: this.postscriptForm.setmealexplain,
        remark: this.postscriptForm.remark,
        operatordate: this.postscriptForm.operatordate,
        operatorcode: "",
        operatorname: this.postscriptForm.operatorname,
      };
      postscriptAdd(data).then((res) => {
        console.log(res);
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getPostscriptDetail();
      });
    },
    // 修改附言
    updatePostscript() {
      var data = {
        pptid: this.postscriptForm.pptid,
        sasid: this.sasid,
        startdate: this.postscriptForm.startdate,
        enddate: this.postscriptForm.enddate,
        setmealstandard: this.postscriptForm.setmealstandard,
        paymentmethod: this.postscriptForm.paymentmethod,
        excessmethod: this.postscriptForm.excessmethod,
        reporttake: this.postscriptForm.reporttake,
        companycontacts: this.postscriptForm.companycontacts,
        companytelephone: this.postscriptForm.companytelephone,
        contacts: this.postscriptForm.contacts,
        setmealexplain: this.postscriptForm.setmealexplain,
        remark: this.postscriptForm.remark,
        operatordate: this.postscriptForm.operatordate,
        operatorcode: "",
        operatorname: this.postscriptForm.operatorname,
      };
      postscriptUpdate(data).then((res) => {
        console.log(res);
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getPostscriptDetail();
      });
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./css/CustomerInformation.scss";
</style>