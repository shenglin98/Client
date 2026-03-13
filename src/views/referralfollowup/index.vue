<template>
  <div class="referralfollowup">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
      <!-- 主体表格+搜索组件 -->
      <div class="mainbody">
        <div class="tops_box">
          <el-radio-group v-model="condition.status" size="small" @change="handleLoadTransfer">
            <el-radio-button :label="''">全部</el-radio-button>
            <el-radio-button :label="0">转诊</el-radio-button>
            <el-radio-button :label="1">复查</el-radio-button>
            <el-radio-button :label="''">回访</el-radio-button>
          </el-radio-group>
          <div class="tops_box_item">
            <div class="tbi_title">审核日期:</div>
            <el-date-picker @change="handleChangeExamineDate" @clear="handleLoadTransfer" size="mini" v-model="examineDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="tops_box_item">
            <div class="tbi_title">体检号:</div>
            <el-input size="mini" clearable ref="checkupWorkInput" @clear="handleLoadTransfer" v-model="condition.regid" placeholder="请输入体检号" @keyup.native.enter="handleLoadTransfer"></el-input>
          </div>
          <div class="tops_box_item">
            <div class="tbi_title">姓名:</div>
            <el-input size="mini" clearable ref="checkupWorkInput" @clear="handleLoadTransfer" v-model="condition.name" placeholder="请输入姓名" @keyup.native.enter="handleLoadTransfer"></el-input>
          </div>
        </div>
        <div class="page_table">
          <vxe-table ref="projectData" height="100%" border="inner" :loading="loading" highlight-hover-row :data="pageList" :checkbox-config="{ trigger: 'row' }" @checkbox-change="handlePageList" @checkbox-all="handlePageListAll" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
            <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
            <vxe-table-column field="name" title="姓名" show-header-overflow width="140px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="sex" title="性别" show-header-overflow width="80px" show-overflow="title" show-footer-overflow>
              <template slot-scope="scope">
                <span>{{
                  scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
                }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="age" title="年龄" show-header-overflow width="80px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="regid" title="体检号" show-header-overflow width="120px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="idcard" title="身份证" show-header-overflow width="200px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="telephone" title="联系电话" show-header-overflow width="120px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="companyname" title="单位" show-header-overflow width="120px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="conclusion" title="异常结果" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="conclusion" title="操作" show-header-overflow show-overflow="title" show-footer-overflow>
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleCheckDetails(scope.row)">详情</el-button>
              </template>
            </vxe-table-column>
            <vxe-table-column field="" title="状态" show-header-overflow width="120px" show-overflow="title" show-footer-overflow>
              <template slot-scope="scope">
                <span :class="scope.row.transferrecordstatus == 1 ? 'redcolor' : ''">{{ scope.row.transferstatus == 1 ? "转诊" : "" }}</span>
                <span v-if="
                    scope.row.transferstatus == 1 && scope.row.followstatus == 1
                  ">/</span>
                <span :class="scope.row.followrrecordstatus == 1 ? 'redcolor' : ''">{{ scope.row.followstatus == 1 ? "复查" : "" }}</span>
                <span v-if="
                    (scope.row.transferstatus == 1 ||
                      scope.row.followstatus == 1) &&
                    scope.row.backstatus == 1
                  ">/</span>
                <span :class="scope.row.backrecordstatus == 1 ? 'redcolor' : ''">{{ scope.row.backstatus == 1 ? "回访" : "" }}</span>
                <span v-if="
                    (scope.row.transferstatus == 1 ||
                      scope.row.followstatus == 1 ||scope.row.backstatus == 1) &&
                    scope.row.overstatus  == 1
                  ">/</span>
                <span :class="scope.row.overstatus == 1 ? 'redcolor' : ''">{{ scope.row.overstatus  == 1 ? "结案" : "" }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="remake" title="说明" show-header-overflow width="120px" show-overflow="title" show-footer-overflow></vxe-table-column>
          </vxe-table>
        </div>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 1000, 5000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
        </el-pagination>
        <!-- 详情复查/转诊弹框 -->
        <el-dialog title="复查/转诊/回访" :visible.sync="showDetailBox" width="65%" class="detali_dia" :show-close="false" :close-on-click-modal="false">
          <div class="detali_content">
            <div class="dc_timebox">
              <div class="dc_timebox_title">随访提醒：</div>
              <el-date-picker v-model="testtime" type="daterange" align="right" size="mini" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div class="dc_box" v-if="transferitem">
              <div class="title">
                <span class="title_s">转诊</span>
                <span class="operatorname">转诊医生：{{ transferitem.transfername }}</span>
              </div>
              <div class="content_items">
                <el-tag v-for="(item, index) in transferitem.conclusionitems" :key="index" type="warning" style="margin-right: 10px; cursor: pointer" @click="handleGetCombineDetail(item)">{{ item.conclusion }}</el-tag>
              </div>
              <div class="conclusion">
                <div class="conclusion_title">转诊说明：</div>
                <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" v-model="transferitem.transferdes"></el-input>
              </div>
            </div>
            <div style="margin-top: 15px" class="dc_box" v-if="followitem">
              <div class="title">
                <span class="title_s">复查</span>
                <span class="operatorname">复查医生：{{ followitem.followname }}</span>
              </div>
              <div class="content_items">
                <el-tag v-for="(item, index) in followitem.conclusionitems" :key="index" type="warning" style="margin-right: 10px; cursor: pointer" @click="handleGetCombineDetail(item)">{{ item.conclusion }}</el-tag>
              </div>
              <div class="conclusion">
                <div class="conclusion_title">复查说明：</div>
                <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" v-model="followitem.followdes"></el-input>
              </div>
            </div>
            <div style="margin-top: 15px" class="dc_box" v-if="bcakitem">
              <div class="title">
                <span class="title_s">回访</span>
                <span class="operatorname">回访医生：{{ bcakitem.backname }}</span>
              </div>
              <div class="content_items">
                <el-button size="mini" type="primary" plain @click="handleGetCombineDetailAll">结果详情</el-button>
              </div>
              <div class="conclusion">
                <div class="conclusion_title">回访说明：</div>
                <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" v-model="bcakitem.backdes"></el-input>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="
                (handletype = 'Over'),
                  (updatetype = 'Handle'),
                  handleTransferHandle()
              ">结案</el-button>
            <el-button size="mini" type="primary" @click="
                (handletype = 'Transfer'),
                  (updatetype = 'Handle'),
                  handleTransferHandle()
              ">已转诊</el-button>
            <el-button size="mini" plain type="primary" @click="
                (handletype = 'Transfer'),
                  (updatetype = 'Cancle'),
                  handleTransferHandle()
              ">取消转诊</el-button>
            <el-button size="mini" type="primary" @click="
                (handletype = 'Follow'),
                  (updatetype = 'Handle'),
                  handleTransferHandle()
              ">已复查</el-button>
            <el-button size="mini" plain type="primary" @click="
                (handletype = 'Follow'),
                  (updatetype = 'Cancle'),
                  handleTransferHandle()
              ">取消复查</el-button>
            <el-button size="mini" type="primary" @click="
                (handletype = 'Treatment'),
                  (updatetype = 'Handle'),
                  handleTransferHandle()
              ">已带诊</el-button>
            <el-button size="mini" plain type="primary" @click="
                (handletype = 'Treatment'),
                  (updatetype = 'Cancle'),
                  handleTransferHandle()
              ">取消带诊</el-button>
            <el-button size="mini" type="primary" @click="
                (handletype = 'Back'),
                  (updatetype = 'Handle'),
                  handleTransferHandle()
              ">已回访</el-button>
            <el-button size="mini" plain type="primary" @click="
                (handletype = 'Back'),
                  (updatetype = 'Cancle'),
                  handleTransferHandle()
              ">取消回访</el-button>
            <el-button size="mini" @click="handleCloseDetailBox">关 闭</el-button>
          </span>
        </el-dialog>
        <!-- 查看组合详情数据弹框 -->
        <el-dialog title="检查结果" class="comb_dialog" :visible.sync="dialogVisible" width="50%">
          <div class="comb_d_content">
            <div v-if="chooseDepart" class="chooseDepart">
              <!-- dom 1 -->
              <div class="project_dom1" v-if="chooseDepart.viewgroup == '1'">
                <EasyTable :loading="loading" height="100%" class="table_dom1" :data="chooseDepart.items" :tableOptions="checkoutdom1Options" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
              </div>
              <!-- dom 2 -->
              <div v-if="chooseDepart.viewgroup == '2'" class="project_dom2">
                <EasyTable :loading="loading" height="100%" class="table_100" :data="chooseDepart.items" :tableOptions="checkoutOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
              </div>
              <div v-if="chooseDepart.viewgroup == '3'" class="project_dom3">
                <!-- dom 3 -->
                <EasyTable :loading="loading" class="project_dom3_table" height="100%" :data="chooseDepart.items" :tableOptions="doMainOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
              </div>
            </div>
            <div class="summary_content">
              <div class="summary_btn">
                <div class="fruit_btn">
                  <el-button-group class="nowrap">
                    <el-button size="mini" plain type="primary" @click="(fruit = 'conclusion'), handleFruitChange()">小结</el-button>
                    <el-button size="mini" plain type="primary" @click="(fruit = 'specialistadvice'), handleFruitChange()">专家建议</el-button>
                  </el-button-group>
                  <el-link class="nowrap" type="primary" style="font-size: 14px" @click="handleShowImageInfoFlag">图像信息</el-link>
                </div>
                <div class="entry_btn"></div>
              </div>
              <div class="summary-box" v-if="!imageInfoFlag">
                <!-- 富文本 -->
                <div class="tinymce_box">
                  <el-input class="conc_text" :rows="5" type="textarea" resize="none" v-if="fruit == 'conclusion'" disabled v-model="conclusion"></el-input>
                  <el-input class="conc_text" :rows="5" type="textarea" resize="none" v-if="fruit == 'specialistadvice'" disabled v-model="specialistadvice"></el-input>
                  <div class="mask"></div>
                </div>
                <!-- 表格结论词 -->
                <div class="summary_entry">
                  <EasyTable :loading="loading" class="entry_table" height="100%" :data="entryData" :tableOptions="entryOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                </div>
              </div>
              <!-- 文件上传列表 -->
              <div class="summary-box" v-else>
                <el-image v-for="(item, index) in fileList" :key="index" style="width: 100%; height: 100%" :src="item.url" :preview-src-list="previewImageList" title="点击查看大图预览"></el-image>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- 人员转诊信息 -->
    <el-dialog title="人员转诊信息" :visible.sync="showStaff" width="75%" :show-close="false" :close-on-click-modal="false" class="dialog_staff">
      <div class="staff_table">
        <vxe-table ref="projectData" height="100%" border="inner" :loading="loading" highlight-hover-row :data="staffData" :checkbox-config="{ trigger: 'row' }" auto-resize :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
          <vxe-table-column field="name" title="姓名" show-header-overflow width="140px" show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="sex" title="性别" show-header-overflow width="100px" show-overflow="title" show-footer-overflow>
            <template slot-scope="scope">
              <span>{{
                scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
              }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="age" title="年龄" show-header-overflow width="100px" show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="checkdate" title="门诊检查时间" show-header-overflow width="180px" show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="deptnamehis" title="门诊检查科室" show-header-overflow width="180px" show-overflow="title" show-footer-overflow></vxe-table-column>
          <vxe-table-column field="conclusion" title="门诊检查结论" show-header-overflow min-width="220px" show-overflow="title" show-footer-overflow></vxe-table-column>
        </vxe-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="showStaff = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹框 -->
    <el-dialog title="人员添加" :visible.sync="showAddPeople" width="40%" :show-close="false" :close-on-click-modal="false" class="dia_add">
      <div class="dia_add_content">
        <el-form ref="form" :model="addForm" label-width="80px">
          <el-form-item size="mini" label="姓名">
            <el-input v-model="addForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item size="mini" label="性别">
            <el-select style="width: 100%" v-model="addForm.sex">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" label="年龄">
            <el-input v-model="addForm.age" clearable></el-input>
          </el-form-item>
          <el-form-item size="mini" label="身份证">
            <el-input v-model="addForm.idcard" clearable></el-input>
          </el-form-item>
          <el-form-item size="mini" label="手机号">
            <el-input v-model="addForm.telephone" clearable></el-input>
          </el-form-item>
          <el-form-item size="mini" label="转诊/复查">
            <el-checkbox v-model="addForm.transferstatus" :false-label="0" :true-label="1">已转诊</el-checkbox>
            <el-checkbox v-model="addForm.followstatus" :false-label="0" :true-label="1">已复查</el-checkbox>
          </el-form-item>
          <el-form-item size="mini" label="转诊说明">
            <el-input v-model="addForm.transferdes" clearable></el-input>
          </el-form-item>
          <el-form-item size="mini" label="复查说明">
            <el-input v-model="addForm.followdes" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClosePeople">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看组合详情数据弹框 -->
    <el-dialog title="检查结果" class="comb_dialog_all" :visible.sync="dialogVisibleAll" width="70%">
      <div class="comb_d_content">
        <!-- 组合数据 -->
        <EasyTable :loading="loading" class="comb_table" height="100%" :data="combData" :tableOptions="combOptions" :radio-config="{
            rowClick: true,
          }" @row-click="handleChooseComb" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        <!-- 项目内容 -->
        <div v-if="chooseDepart" class="chooseDepart">
          <!-- dom 1 -->
          <div class="project_dom1" v-if="chooseDepart.viewgroup == '1'">
            <EasyTable :loading="loading" height="100%" class="table_dom1" :data="chooseDepart.items" :tableOptions="checkoutdom1Options" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <!-- dom 2 -->
          <div v-if="chooseDepart.viewgroup == '2'" class="project_dom2">
            <EasyTable :loading="loading" height="100%" class="table_100" :data="chooseDepart.items" :tableOptions="checkoutOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <div v-if="chooseDepart.viewgroup == '3'" class="project_dom3">
            <!-- dom 3 -->
            <EasyTable :loading="loading" class="project_dom3_table" height="100%" :data="chooseDepart.items" :tableOptions="doMainOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          </div>
          <div class="conclusion_box">
            <el-input class="conc_text" :rows="5" type="textarea" resize="none" v-if="fruit == 'conclusion'" disabled v-model="conclusion"></el-input>
            <div class="conc_input">
              <el-form ref="form" :model="chooseDepart" label-width="80px">
                <el-form-item size="mini" label="检查医生">
                  <el-input v-model="chooseDepart.doctorname" disabled></el-input>
                </el-form-item>
                <el-form-item size="mini" label="检查时间">
                  <el-input v-model="chooseDepart.checkdate" disabled></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogVisibleAll = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import {
  LoadTransfer,
  LoadTransferDetail,
  TransferHandle,
  SendHis,
  getCombineDetail,
  AddTransfer,
  setPrintOrderDetail,
} from "@/api/totalcheck.js";
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
import { getSysConfigInfo } from "@/api/sysconfig";
import { trickle } from "nprogress";

export default {
  name: "referralfollowup",

  components: { Sticky, permissionBtn },

  data() {
    return {
      condition: {
        regid: "",
        name: "",
        startdate: "",
        enddate: "",
        status: "",
      },
      examineDate: [],
      regid: "",
      sname: "",
      selectList: [],
      pageList: [],
      loading: false,
      currentPage: 1,
      pageSize: 100,
      count: 0,
      excelData: [],
      followitem: null, // 复查
      transferitem: null, // 转诊
      bcakitem: null, // 转诊
      showDetailBox: false,
      chooseRegid: "",
      handletype: "",
      updatetype: "",
      dialogVisible: false,
      chooseDepart: undefined, // 当前选中的科室
      imageInfoFlag: false, // 显示图像照片信息
      entryData: [],
      fruit: "conclusion", // 选择小结/专科建议
      fileList: [],
      previewImageList: [], // 图片预览路径
      conclusion: "",
      choosePeople: null,
      showStaff: false,
      staffData: [],
      addForm: {
        name: "",
        sex: 0,
        age: "",
        idcard: "",
        telephone: "",
        transferstatus: 0,
        followstatus: 0,
        transferdes: "",
        followdes: "",
      },
      showAddPeople: false,
      dialogVisibleAll: false,
      specialistadvice: "",
      dietadviceText: "",
      sportsadviceText: "",
      healthknowledgeText: "",
      combData: [], // 体检组合表格数据
      testtime: "",
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
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 词条小结表格配置
    entryOptions() {
      return [
        {
          title: "序",
          align: "center",
          type: "index",
          width: 40,
        },
        {
          title: "结论词",
          prop: "wordname",
        },
      ];
    },
    checkoutdom1Options() {
      return [
        {
          title: "项目",
          prop: "itemname",
          width: 140,
          omit: 1,
        },
        {
          title: "结果",
          align: "center",
          width: 250,
          render: (h, data) => {
            return (
              <div style="display: flex;">
                <span v-show={data.mustflag == 1} style="color: red">
                  *
                </span>
                <el-input
                  type={data.resuletype == 1 ? "number" : "text"}
                  size="mini"
                  readonly
                  v-model={data.result}
                  placeholder={
                    data.resuletype == 1 ? "请输入数值" : "请输入任意值"
                  }
                  clearable
                ></el-input>
              </div>
            );
          },
        },
        {
          title: "提示",
          prop: "tips",
          align: "center",
          width: 140,
        },
        {
          title: "单位",
          prop: "unit",
          align: "center",
          width: 140,
        },
        {
          title: "参考值",
          prop: "reslower",
          align: "center",
          returnVal: (value, data) => {
            let result = data.resupper
              ? `${value} - ${data.resupper}`
              : `${value}`;
            return result;
          },
        },
        {
          title: "历史",
          prop: "lastresult",
          align: "center",
          width: 140,
        },
        {
          title: "项目编码",
          prop: "itemcode",
          width: 140,
          omit: 1,
        },
      ];
    },
    // 体检组合表格配置
    combOptions() {
      return [
        {
          title: "科室",
          prop: "deptname",
          omit: 1,
        },
        {
          title: "组合",
          prop: "combinename",
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          omit: 1,
          returnVal: (val) => {
            return val == 0 ? "登记" : val == 1 ? "弃检" : "完成";
          },
        },
      ];
    },
    // 功能类表格配置
    doMainOptions() {
      return [
        {
          title: "项目",
          prop: "itemname",
          width: 150,
          align: "center",
        },
        {
          title: "结果",
          render: (h, data) => {
            return (
              <div style="display: flex;">
                <span v-show={data.mustflag == 1} style="color: red">
                  *
                </span>
                <el-input
                  class="conc_text"
                  type="textarea"
                  readonly
                  resize="none"
                  v-model={data.result}
                ></el-input>
              </div>
            );
          },
        },
      ];
    },
    checkoutOptions() {
      return [
        {
          title: "项目",
          prop: "itemname",
          width: 200,
          omit: 1,
        },
        {
          title: "结果",
          align: "center",
          width: 240,
          render: (h, data) => {
            return (
              <div style="display: flex;">
                <span v-show={data.mustflag == 1} style="color: red">
                  *
                </span>
                <el-input
                  type="text"
                  size="mini"
                  readonly
                  class={
                    data.healthstatus == -1
                      ? "text_lower"
                      : data.healthstatus == 1
                      ? "text_upper"
                      : ""
                  }
                  v-model={data.result}
                ></el-input>
              </div>
            );
          },
        },
        {
          title: "单位",
          prop: "unit",
          align: "center",
          width: 120,
        },
        {
          title: "提示",
          prop: "tips",
          align: "center",
          width: 120,
        },
        {
          title: "参考范围",
          // prop: "reslower",
          align: "center",
          width: 120,
          render: (h, data) => {
            if (data.resexp !== "") {
              console.log("进来渲染了吗");
              return <div domPropsInnerHTML={data.resexp}></div>;
            } else {
              return (
                <div>
                  {data.resupper
                    ? `${data.reslower} - ${data.resupper}`
                    : `${data.reslower}`}
                </div>
              );
            }
          },
        },
        {
          title: "检测方法",
          prop: "method",
          align: "center",
        },
        {
          title: "项目编码",
          prop: "itemcode",
          align: "center",
          width: 120,
        },
      ];
    },
  },

  mounted() {
    this.handleGetPrintDate();
  },

  methods: {
    handleConfirmAdd() {
      AddTransfer(this.addForm).then((res) => {
        this.$message.success(res.messgae);
        this.handleClosePeople();
        this.handleLoadTransfer();
      });
    },
    handleAddShow() {
      this.handleResetAddForm();
      this.showAddPeople = true;
    },
    handleClosePeople() {
      this.handleResetAddForm();
      this.showAddPeople = false;
    },
    handleResetAddForm() {
      this.addForm = {
        name: "",
        sex: 0,
        age: "",
        idcard: "",
        telephone: "",
        transferstatus: 0,
        followstatus: 0,
        transferdes: "",
        followdes: "",
      };
    },
    // 发送人员转诊信息给his
    handleSendHis() {
      if (this.selectList.length == 0 || this.selectList.length > 1) {
        this.$message.warning("请勾选人员或仅勾选一人!");
        return;
      }
      SendHis({ regid: this.selectList[0].regid }).then((res) => {
        if (!res.data) {
          this.$message.warning("查询不到数据!");
          return;
        }
        this.showStaff = true;
        this.staffData = res.data;
      });
    },
    // 获取组合结论信息
    handleGetCombineDetailAll() {
      setPrintOrderDetail({
        regid: this.choosePeople.regid,
        frompage: "TotalCheck",
      }).then((res) => {
        if (!res.result) return;
        this.combData = res.result;
        this.handleChooseComb(this.combData[0]);
        this.dialogVisibleAll = true;
      });
    },
    // 双击组合查看信息
    handleChooseComb(row) {
      getCombineDetail({
        regid: this.choosePeople.regid,
        checkno: this.choosePeople.checkno,
        combinecode: row.combinecode,
      }).then((res) => {
        if (!res.result) return;
        let data = res.result;
        this.commonData = []; // 重置右侧常用结果表格
        this.chooseDepart = JSON.parse(JSON.stringify(data));
        if (this.chooseDepart.viewgroup == 2) {
          this.chooseDepart.items = this.chooseDepart.items.filter((k) => {
            return k.isshow;
          });
        }
        this.entryData = this.chooseDepart.worditems;
        this.fileList = [];
        this.imageInfoFlag = false;
        this.conclusion = this.chooseDepart.conclusion;
        this.specialistadvice = this.chooseDepart.specialistadvice;
        // 图片回显
        if (data.imageitems.length > 0) {
          data.imageitems.forEach((k, i) => {
            this.fileList.push({
              fileid: k.fileid,
              imgname: k.imgname,
              updated: false,
              url: "",
            });
            getFiles({ Id: k.fileid }).then((res) => {
              this.fileList[i].url = res.result.fileUrl;
              this.previewImageList.push(res.result.fileUrl);
            });
          });
        }
      });
    },
    // 获取组合结论信息
    handleGetCombineDetail(item) {
      if (item && !item.combinecode) {
        this.$message.warning("暂无项目编码!");
        return;
      }
      getCombineDetail({
        regid: this.choosePeople.regid,
        checkno: this.choosePeople.checkno,
        combinecode: item.combinecode,
      }).then((res) => {
        if (!res.result) return;
        let data = res.result;
        this.commonData = []; // 重置右侧常用结果表格
        this.chooseDepart = JSON.parse(JSON.stringify(data));
        if (this.chooseDepart.viewgroup == 2) {
          this.chooseDepart.items = this.chooseDepart.items.filter((k) => {
            return k.isshow;
          });
        }
        this.entryData = this.chooseDepart.worditems;
        this.fileList = [];
        this.imageInfoFlag = false;
        this.conclusion = this.chooseDepart.conclusion;
        this.specialistadvice = this.chooseDepart.specialistadvice;
        // 图片回显
        if (data.imageitems.length > 0) {
          data.imageitems.forEach((k, i) => {
            this.fileList.push({
              fileid: k.fileid,
              imgname: k.imgname,
              updated: false,
              url: "",
            });
            getFiles({ Id: k.fileid }).then((res) => {
              this.fileList[i].url = res.result.fileUrl;
              this.previewImageList.push(res.result.fileUrl);
            });
          });
        }
        this.dialogVisible = true;
      });
    },
    // 点击图像信息
    handleShowImageInfoFlag() {
      this.imageInfoFlag = true;
    },
    // 小结/专科建议切换回调
    handleFruitChange() {
      this.imageInfoFlag = false;
    },
    // 处理转诊，取消转诊，复查，取消复查
    handleTransferHandle() {
      let data = {
        regid: this.chooseRegid,
        handletype: this.handletype,
        updatetype: this.updatetype,
        remark:
          this.handletype == "Transfer"
            ? this.transferitem.transferdes
            : this.handletype == "Follow"
            ? this.followitem.followdes
            : this.handletype == "Back"
            ? this.bcakitem.backdes
            : "",
      };
      TransferHandle(data).then((res) => {
        this.$message.success(res.messgae);
        this.handleCloseDetailBox();
        this.handleLoadTransfer();
      });
    },
    handleCloseDetailBox() {
      this.followitem = null;
      this.transferitem = null;
      this.bcakitem = null;
      this.handletype = "";
      this.updatetype = "";
      this.chooseRegid = "";
      this.showDetailBox = false;
      this.choosePeople = null;
    },
    handleCheckDetails(item) {
      if (!item) return;
      this.choosePeople = item;
      LoadTransferDetail({ regid: item.regid }).then((res) => {
        if (!res.data) return;
        this.chooseRegid = item.regid;
        // conclusionitems
        this.followitem = res.data.followitem;
        this.transferitem = res.data.transferitem;
        this.bcakitem = res.data.bcakitem;
        this.showDetailBox = true;
      });
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
    handleLoadTransfer() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.condition).forEach((item) => {
        if (this.condition[item] !== "") {
          whereitems.push({
            key: item,
            value: this.condition[item],
          });
        }
      });
      LoadTransfer({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.loading = false;
          if (res.data) {
            this.count = res.count;
            this.pageList = res.data;
          } else {
            this.count = 0;
            this.pageList = [];
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleLoadTransfer();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleLoadTransfer();
    },
    handleGetPrintDate() {
      getSysConfigInfo({ cc: "Sys_FullSearch_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        this.examineDate = [this.gettime(start), this.gettime(end)];
        this.condition.startdate = this.gettime(start);
        this.condition.enddate = this.gettime(end);
        this.handleLoadTransfer();
      });
    },
    handlePageList({ records }) {
      this.selectList = records;
    },
    handlePageListAll({ records }) {
      this.selectList = records;
    },
    handleChangeExamineDate(arr) {
      if (arr) {
        this.examineDate = arr;
        this.condition.startdate = arr[0];
        this.condition.enddate = arr[1];
      } else {
        this.examineDate = [];
        this.condition.startdate = "";
        this.condition.enddate = "";
      }
      this.handleLoadTransfer();
    },
    // 列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let whereitems = [];
          Object.keys(this.condition).forEach((item) => {
            if (this.condition[item] !== "") {
              whereitems.push({
                key: item,
                value: this.condition[item],
              });
            }
          });
          LoadTransfer({
            page: 1,
            limit: 100000,
            whereitems,
          }).then((res) => {
            this.loading = false;
            if (res.data) {
              this.excelData = res.data.map((k) => {
                return {
                  ...k,
                  sexcn: k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女",
                  tfmerge: `${k.transferstatus == 1 ? "转诊" : ""}${
                    k.followstatus == 1 ? "/复查" : ""
                  }${k.backstatus == 1 ? "/回访" : ""}${
                    k.overstatus == 1 ? "/结案" : ""
                  }`,
                };
              });
              this.export2Excel();
            }
          });
        })
        .catch(() => {});
    },
    // 数据写入excel
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = [
          "姓名",
          "性别",
          "年龄",
          "体检号",
          "身份证",
          "联系电话",
          "单位",
          "异常结果",
          "状态",
          "说明",
        ]; // 导出的表头名信息
        const filterVal = [
          "name",
          "sexcn",
          "age",
          "regid",
          "idcard",
          "telephone",
          "companyname",
          "conclusion",
          "tfmerge",
          "remake",
        ]; // 导出的表头字段名，需要导出表格字段名
        const list = this.excelData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导出数据"); // 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      switch (domId) {
        case "btnAdd": // 新增
          this.handleAddShow();
          break;
        case "btnRefresh": // 重置
          this.handleLoadTransfer();
          break;
        case "btnExport1": // 导出
          this.downloadExcel();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnStaffReferral": // 关闭当前页面
          this.handleSendHis();
          break;
        default:
          break;
      }
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
<style lang='scss' scoped>
.referralfollowup {
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
      box-sizing: border-box;
      padding: 8px;
      .tops_box {
        height: 40px;
        display: flex;
        align-items: center;
        .tops_box_item {
          display: flex;
          .tbi_title {
            width: 85px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-right: 8px;
          }
          .el-date-editor {
            width: 250px;
          }
          .el-input {
            width: 150px;
          }
        }
      }
      .page_table {
        margin-top: 8px;
        height: calc(100% - 100px);
      }
      .el-pagination {
        margin-top: 8px;
        text-align: center;
      }
    }
  }
}
.redcolor {
  color: red !important;
}
.dialog_staff {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 0 10px;
    .staff_table {
      height: 600px;
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
.detali_dia {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 0 10px;
    .detali_content {
      .dc_timebox {
        width: 100%;
        height: 35px;
        display: flex;
        margin-bottom: 8px;
        align-items: center;
      }
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
      .conclusion {
        margin-top: 8px;
        .conclusion_title {
          font-size: 16px;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
.dia_add {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 0 10px;
    .dia_add_content {
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
.comb_dialog {
  /deep/.el-dialog__header,
  /deep/.el-dialog__body,
  /deep/.el-dialog__footer {
    padding: 4px;
  }
  /deep/.el-dialog__body {
    .comb_d_content {
      // display: flex;
      // flex-direction: column;
      .div_mess {
        display: flex;
        .div_mess_item {
          margin-right: 10px;
          font-size: 16px;
          color: #000;
        }
      }
      .chooseDepart {
        height: 500px;
        width: 100%;
        .table_100 {
          height: 100%;
        }
        // /deep/.el-scrollbar .el-scrollbar__wrap {
        //     overflow-x: hidden;
        // }
        // /deep/.el-scrollbar .el-scrollbar__view {
        //     height: 100%;
        // }
        // max-height: 200px;
        .el-empty {
          height: 50px;
          padding: 0;
          .el-empty__image {
            width: 50px;
            height: 50px;
          }
        }
        // padding: 12px;
        box-sizing: border-box;
        // height: calc(100% - 35px);
        // border: 1px solid #dcdfe6;
        border-radius: 5px;
        // background-color: #ebeef5;
        // .project_dom1 div:first-child {
        //     margin-top: 0;
        // }
        .project_dom1 {
          height: 100%;
          // height: calc(100% - 120px);
          display: flex;
          flex-wrap: wrap;
          .table_dom1 {
            width: 100%;
            height: 100%;
          }
          .box_item,
          .box_input {
            margin: 4px 0 0 8px;
            .el-input {
              width: 100%;
            }
          }
          .box_item {
            width: 100%;
          }
          .box_input {
            width: 48%;
          }
          .project_item {
            width: 100%;
            display: flex;
            .title {
              width: 100px;
              text-align: right;
            }
            .el-checkbox-group {
              flex: 1;
              display: flex;
              flex-wrap: wrap;
            }
            .el-checkbox {
              width: 27%;
              margin-left: 0;
              display: flex;
            }
            .el-checkbox__label {
              // width:300px;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .project_input {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .title {
              min-width: 100px;
              max-width: 150px;
              text-align: right;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .input_box {
              display: flex;
              align-items: center;
              width: 100%;
              /deep/.el-input {
                flex: 1;
              }
            }
          }
        }
        .project_dom2 {
          .el-input__inner {
            // border: 0 none;
            // background-color: transparent;
          }
          .text_lower .el-input__inner {
            color: #0000ff !important;
            // font-size: 30px;
          }
          .text_upper .el-input__inner {
            color: red !important;
            // font-size: 30px;
          }
        }
        .project_dom2,
        .project_dom3 {
          height: 100%;
          //height: calc(100% - 120px);
        }
        .project_dom3 {
          .project_dom3_table {
            height: 100%;
          }
          .el-table__body {
            height: 100%;
            .cell {
              height: 100%;
              > div {
                height: 100%;
              }
              .conc_text {
                height: 100%;
                .el-textarea__inner {
                  height: 100%;
                  // border: 0 none;
                  // background-color: transparent;
                }
              }
            }
          }
        }
      }
      .summary_content {
        padding: 10px 10px 0 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 200px;
        .nowrap {
          display: flex;
          flex-wrap: nowrap;
          /deep/.el-link--inner {
            white-space: nowrap;
          }
        }
        // margin-bottom: 20px;
        .summary_btn {
          display: flex;
        }
        .el-button-group {
          height: 28px;
        }
        .fruit_btn {
          margin-bottom: 8px;
          flex: 2;
          display: flex;
          // flex-direction: column;
          .el-button-group {
            margin-right: 10px;
          }
          .el-radio-group {
            height: 28px;
            margin: 0 10px 0 0;
            .el-radio-button {
              height: 100%;
              .el-radio-button__inner {
                height: 100%;
              }
            }
          }
          .el-link {
            margin: 0 10px 0 0;
          }
        }
        .entry_btn {
          width: 200px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          .el-button {
            height: 28px;
          }
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          .el-button {
            height: 28px;
          }
        }
        .summary-box {
          display: flex;
          flex-wrap: wrap;
          height: calc(100% - 38px);
          .el-image {
            width: 98px !important;
            height: 98px !important;
            border-radius: 5px;
            margin: 0 10px 10px 0;
          }
          .tinymce_box {
            position: relative;
            flex: 3;
            background-color: #fff;
            .conc_text {
              // min-height: 100px;
              height: 100%;
              .el-textarea__inner {
                height: 100%;
              }
            }
            position: relative;
            .mask {
              width: 100%;
              height: 100%;
              position: absolute;
              background-color: rgba(0, 0, 0, 0);
              z-index: 999;
              cursor: not-allowed;
              top: 0;
              left: 0;
            }
          }
          .summary_entry {
            width: 200px;
            margin-left: 10px;
            // flex: 2;
            display: flex;
            .entry_btn {
              display: flex;
              flex-wrap: nowrap;
              justify-content: center;
              margin-bottom: 8px;
              .el-button {
                margin-right: 5px;
              }
            }
            .entry_table {
              width: 100%;
              height: 100%;
            }
          }
          .photo_wall {
            width: 100%;
            overflow-y: auto;
            .el-upload-list__item {
              width: 100px;
              height: 100px;
              > div {
                width: 100%;
                height: 100%;
                position: relative;
                .removeimg {
                  width: 100%;
                  height: 34%;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  background-color: rgba(0, 0, 0, 0.4);
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;
                }
              }
            }
            .el-upload {
              width: 100px;
              height: 100px;
              position: relative;
              .el-icon-plus {
                position: absolute;
                top: 35%;
                left: 35%;
              }
            }
          }
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    text-align: center;
  }
}
.comb_dialog_all {
  /deep/.el-dialog__footer {
    text-align: center;
  }
  .comb_d_content {
    height: 500px;
    display: flex;
    .project_dom1,
    .project_dom2,
    .project_dom3 {
      height: 68%;
      .table_dom1,
      .table_100,
      .project_dom3_table {
        height: 100%;
      }
    }
    .conclusion_box {
      height: 32%;
      .conc_text {
        margin-top: 4px;
      }
      .conc_input {
        .el-form {
          display: flex;
          .el-form-item {
            margin: 8px 0 0 0;
          }
        }
      }
    }
    .comb_table {
      width: 30%;
      height: 500px;
    }
    .chooseDepart {
      width: 68% !important;
      margin-left: 10px;
    }
  }
}
</style>