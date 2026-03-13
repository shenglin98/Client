<template>
  <div class="customer_critical">
    <div class="filter-container">
      <permission-btn class="btn_group" moduleName="CustomerCritical" size="mini" v-on:btn-event="handleOnBtnClicked"></permission-btn>
    </div>
    <div class="pagebox">
      <el-card class="box-card head_box">
        <!-- 头部标题 -->
        <div class="head_title">
          <div class="head_logo"></div>
          <p>检索条件</p>
        </div>
        <!-- 头部表单 -->
        <div class="head_content">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" height="30">
            <el-form-item label="体检日期">
              <el-date-picker @change="handleChangeDate" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="体检类型">
              <el-select size="mini" v-model="searchForm.checktype" @change="handleSearch" filterable clearable placeholder="请选择">
                <el-option v-for="(item, index) in checkType" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跟踪状态">
              <el-select size="mini" v-model="searchForm.confirmflag" @change="handleSearch" filterable clearable placeholder="请选择">
                <el-option v-for="(item, index) in confirmItem" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位">
              <el-select size="mini" filterable clearable v-model="searchForm.companycode" @change="handleSearch" placeholder="请选择">
                <el-option v-for="item in companyItem" :key="item.companycode" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预警等级">
              <el-select size="mini" v-model="searchForm.level" @change="handleSearch" clearable filterable placeholder="请选择">
                <el-option v-for="(item, index) in levelItem" :key="index" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="体检号">
              <el-input size="mini" v-model="searchForm.regid" clearable @change="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input size="mini" v-model="searchForm.name" clearable @change="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="项目类型">
              <el-input size="mini" v-model="searchForm.templatename" clearable @focus="handleTemplateShow" @clear="handleTemplateClear"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <!-- 内容 -->
      <el-card class="box-card content_box">
        <!-- 内容标题 -->
        <div class="head_title">
          <div class="head_logo"></div>
          <p>预警值列表</p>
        </div>
        <!-- 内容表单 -->
        <div class="content_team_form">
          <div class="page_table">
            <vxe-table ref="pageTable" height="auto" border="inner" highlight-hover-row :data="list" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleSelect" @checkbox-all="handleSelectAll" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="regid">
              <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
              <vxe-table-column field="level" title="等级" width="60px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span v-if="scope.row.level == 0">一般</span>
                  <span style="color: red" v-else-if="scope.row.level == 1">急</span>
                  <span style="color: brown" v-else-if="scope.row.level == 2">紧急</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="regid" title="体检号" width="120px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template v-slot="{ row }"><el-link type="primary" @click="handleCheckCritical(row.regid)">{{row.regid}}</el-link></template>
              </vxe-table-column>
              <vxe-table-column field="name" title="姓名" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="sex" title="性别" width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template v-slot="{ row }">
                  <span>{{
                row.sex == 0 ? "未知" : row.sex == 1 ? "男" : "女"
              }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="年龄" width="120" show-header-overflow show-overflow="title" show-footer-overflow>
                <template v-slot="{ row }">
                  <span>{{row.age}} {{ row.ageunit }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="idcard" title="身份证号" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="telephone" title="手机号" width="110px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="companyname" title="单位" min-width="160px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="combinename" title="项目" min-width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="itemname" title="项目" min-width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column sortable field="result" title="结果" width="80px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="expression" title="参考范围" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="reportdate" title="时间" width="160px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="confirmflag" title="状态" width="90px" show-header-overflow show-overflow="title" show-footer-overflow>
                <template slot-scope="scope">
                  <span>{{ scope.row.confirmflag == 1 ? "已追踪" : "未追踪" }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="operatorname" title="追踪人" width="90px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column field="confirmremark" title="备注" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
              <vxe-table-column title="操作" width="100px">
                <template slot-scope="scope">
                  <el-link type="primary" @click="handleTrackShow(scope.row)">查看</el-link>
                  <el-link style="margin-left:10px;" :v-if="scope.row.confirmflag != 1" type="primary" @click="handleTrackShow(scope.row)">编辑</el-link>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[50, 100, 300, 500,1000,5000]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 预警值项目模板 -->
    <el-dialog title="预警值项目模板" :close-on-click-modal="false" width="800px" @close="template.show = false" :visible.sync="template.show">
      <div class="template">
        <div class="template_header">
          <div class="template_header_left">
            <el-input size="mini" prefix-icon="el-icon-search" v-model="template.name" clearable placeholder="请输入模板名称" @change="handleTemplateSearch"></el-input>
          </div>
          <div class="template_header_right">
            <el-button size="mini" plain type="success" @click="handleTemplateClicked('btnAdd')"><i :class="`iconfont icon-xinzeng`"></i>添加</el-button>
            <el-button size="mini" plain type="primary" @click="handleTemplateClicked('btnEdit')"><i :class="`iconfont icon-bianji-copy`"></i>编辑</el-button>
            <el-button size="mini" plain type="info" @click="handleTemplateClicked('btnDel')"><i :class="`iconfont icon-shanchu`"></i>删除</el-button>
          </div>
        </div>
        <div class="template_body">
          <vxe-table ref="templateTable" height="450px" border="inner" highlight-hover-row :data="template.list" :sort-config="{ trigger: 'cell' }" @checkbox-change="handleTemplateSelect" @checkbox-all="handleTemplateSelectAll" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="id">
            <vxe-table-column type="checkbox" width="40px" :reserve-selection="true"></vxe-table-column>
            <vxe-table-column field="name" title="模板名称" width="120px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="itemnames" title="模板项目" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="seqno" title="排序号" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column title="操作" width="120px">
              <template slot-scope="scope">
                <el-link type="success" @click="handleTemplateSelected(scope.row)">选择</el-link>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="template_footer">
          <el-pagination @size-change="handleTemplateSizeChange" @current-change="handleTemplateCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 50]" :page-size="template.limit" layout="total, sizes, prev, pager, next, jumper" :total="template.count">
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 预警值项目模板新增编辑弹框 -->
    <el-dialog title="预警值项目模板" :close-on-click-modal="false" width="550px" @close="handleTemplateEditClose" :visible.sync="template.showEdit">
      <el-form :model="template.form" :rules="template.rules" ref="templateForm" label-width="120px">
        <el-form-item size="small" label="ID">
          <el-input disabled v-model="template.form.id"></el-input>
        </el-form-item>
        <el-form-item size="small" label="名称" prop="name">
          <el-input v-model="template.form.name"></el-input>
        </el-form-item>
        <el-form-item size="small" label="项目" prop="itemcodes">
          <el-select v-model="template.form.itemcodes" multiple filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in template.dicItemData" :key="item.code" :label="item.name" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="排序">
          <el-input v-model.number="template.form.seqno"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleTemplateEditClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleTemplateSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 预警值追踪日志 -->
    <el-dialog title="预警值追踪日志" style="z-index: 100 !important;" :close-on-click-modal="false" width="800px" @close="track.show = false" :visible.sync="track.show">
      <div class="template">
        <div class="template_body" style="margin-top: 0">
          <vxe-table ref="trackTable" height="450px" border="inner" highlight-hover-row :data="track.list" :sort-config="{ trigger: 'cell' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" row-id="id" keep-source :edit-config="{trigger: 'manual', mode: 'row'}">
            <vxe-table-column field="id" title="序号" width="80px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="remark" title="内容" :edit-render="{name: 'input', attrs: {type: 'text'}}" min-width="180px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="operatordate" title="时间" :edit-render="{
              name: '$input',
              props: {
                type: 'datetime',
                placeholder: '请选择日期',
                format: 'yyyy-MM-dd HH:mm:ss' // 控制显示格式
              }
            }" width="150px" show-header-overflow show-overflow="title" show-footer-overflow>
            </vxe-table-column>
            <vxe-table-column field="operatorname" title="追踪人" width="100px" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column title="操作" width="160">
              <template v-slot="{ row }">
                <template v-if="$refs.trackTable.isActiveByRow(row)">
                  <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                  <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
                </template>
                <template v-else>
                  <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="template_footer">
          <el-pagination @size-change="handleTrackSizeChange" @current-change="handleTrackCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 50]" :page-size="track.limit" layout="total, sizes, prev, pager, next, jumper" :total="track.count">
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 预警值追踪日志新增编辑弹框 -->
    <el-dialog title="预警值追踪" :close-on-click-modal="false" width="550px" @close="handleTrackEditClose" :visible.sync="track.showEdit">
      <el-form :model="track.form" :rules="track.rules" ref="trackForm" label-width="120px">
        <el-form-item size="small" label="备注" prop="remark">
          <el-input type="textarea" :rows="5" placeholder="请输入备注" v-model="track.form.remark"></el-input>
        </el-form-item>
        <el-form-item size="small" label="是否需要随访" prop="followupflag">
          <el-checkbox v-model="track.form.followupflag" :true-label="1" :false-label="0"></el-checkbox>
        </el-form-item>
        <el-form-item size="small" label="随访时间" prop="followupdate" v-if="track.form.followupflag">
          <el-date-picker v-model="track.form.followupdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleTrackEditClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleTrackSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 发送短信弹框 -->
    <el-dialog title="短信发送" :visible.sync="sendSmsShow" width="40%" class="sms_dia" :show-close="false" :close-on-click-modal="false">
      <div class="sms_dia_content">
        <div class="smsname">
          <div class="smstitle">短信模板：</div>
          <el-select size="mini" v-model="tempname" filterable clearable @change="handleChangeTempname">
            <el-option v-for="(item, index) in noticetemplateData" :key="index" :label="item.tempname" :value="item.tempid"></el-option>
          </el-select>
        </div>
        <div class="smscontent">
          <div class="smscontenttitle">模板内容：</div>
          <el-input class="conc_text" type="textarea" resize="none" v-model="tempcontent"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handlesendSmsClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="handlesendSmsSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预警值新弹框 -->
    <el-dialog title="" :visible.sync="showCritical" width="70%" class="critical_dia" :show-close="false" :close-on-click-modal="false">
      <div class="cd_content">
        <div class="cd_mess_title">基本信息</div>
        <div class="cd_mess_body">
          <el-row>
            <el-col :span="5">体检号：{{register.regid}}</el-col>
            <el-col :span="5">姓名：{{register.name}}</el-col>
            <el-col :span="4">性别：{{register.sex == 0 ? "未知" : register.sex == 1 ? "男" : "女"}}</el-col>
            <el-col :span="4">年龄：{{register.age}}{{ register.ageunit }}</el-col>
            <el-col :span="6">身份证：{{register.idcard}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">手机号：{{register.telephone}}</el-col>
            <el-col :span="5">单位：{{register.companyname}}</el-col>
            <el-col :span="8">登记时间：{{register.regdate}}</el-col>
            <el-col :span="6">检查时间：{{register.checkdate}}</el-col>
          </el-row>
        </div>
        <div class="cd_record_title">
          追踪、短信记录
          <div class="crt_select">当前选中项目:{{selectProjectSS}}</div>
        </div>
        <div class="cd_record_body">
          <el-row class="cd_record_body_top">
            <el-col :span="6" class="cd_df">
              <div class="cd_df_title">追踪时间： </div><el-date-picker size="mini" v-model="personCritical.reportdate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd hh:mm:ss">
              </el-date-picker>
            </el-col>
            <el-col :span="2" style="padding-left: 8px;"><el-button size="mini" type="primary" plain @click="handleButchTrack">追 踪</el-button></el-col>
            <el-col :span="2"><el-button size="mini" type="primary" plain @click="handleSendSMSForCustomerCritical">短信发送</el-button></el-col>

            <el-col :span="2"><el-button size="mini" type="primary" plain @click="handleSendSMSAndTrack">发短信并追踪</el-button></el-col>
            <el-col :span="3"><el-button size="mini" type="primary" plain @click="handleShowTempcategroy">设置为短信模板</el-button></el-col>
            <el-col :span="2"><el-button size="mini" type="primary" plain @click="handleSmsFill">短信填充</el-button></el-col>
            <el-col :span="5" class="cd_df">
              <div class="cd_df_title">短信模板：</div> <el-select size="mini" v-model="smsName" filterable clearable placeholder="请选择" @change="handleChangeTempnameDia">
                <el-option v-for="(item, index) in noticetemplateDia" :key="index" :label="item.tempname" :value="item.tempid"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" style="text-align: center;"><el-button size="mini" type="primary" plain @click="handleReLoadSmS">刷新</el-button></el-col>
          </el-row>
          <div class="cd_record_body_bottom">
            <div class="cdrbb_l"><el-input type="textarea" placeholder="请输入内容" resize="none" v-model="personCritical.confirmremark"></el-input></div>
            <div class="cdrbb_r"><el-input type="textarea" placeholder="请输入内容" resize="none" v-model="personCritical.smsContent"></el-input></div>
          </div>
        </div>
        <div class="cd_project_title">
          预警值项目
          <el-radio-group v-model="level" size="mini" @change="handleGetProjectList">
            <el-radio-button :label="''">全部</el-radio-button>
            <el-radio-button :label="2">紧急</el-radio-button>
            <el-radio-button :label="1">急</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="confirmflag" size="mini" @change="handleGetProjectList">
            <el-radio-button :label="''">全部</el-radio-button>
            <el-radio-button :label="0">未追踪</el-radio-button>
            <el-radio-button :label="1">已追踪</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="smsStatus" size="mini" @change="handleGetProjectList">
            <el-radio-button :label="''">全部</el-radio-button>
            <el-radio-button :label="0">未发短信</el-radio-button>
            <el-radio-button :label="1">已发短信</el-radio-button>
          </el-radio-group>
        </div>
        <div class="cd_project_body">
          <vxe-table class="project_table" ref="projectTable" height="100%" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="projectList" :checkbox-config="{ reserve: true,  }" auto-resize :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" @checkbox-change="handleSelectProject" @checkbox-all="handleSelectProjectAll" @cell-click="handleCheckPersonCriticalItem">
            <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
            <vxe-table-column field="regid" title="科室" min-width="105"></vxe-table-column>
            <vxe-table-column field="combinename" title="组合名称" min-width="200"></vxe-table-column>
            <vxe-table-column field="itemname" title="项目名称" min-width="150"></vxe-table-column>
            <vxe-table-column field="level" title="等级" min-width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.level == 0">一般</span>
                <span style="color: red" v-else-if="scope.row.level == 1">急</span>
                <span style="color: brown" v-else-if="scope.row.level == 2">紧急</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="result" title="结果" min-width="100"></vxe-table-column>
            <vxe-table-column field="expression" title="参考范围" min-width="100"></vxe-table-column>
            <vxe-table-column field="confirmflag" title="追踪状态" min-width="100">
              <template slot-scope="scope">
                <span style="color: red" v-if="scope.row.confirmflag == 1">已追踪</span>
                <span style="color: brown" v-if="scope.row.confirmflag == 0">未追踪</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="operatorname" title="追踪人" min-width="100"></vxe-table-column>
            <vxe-table-column field="reportdate" title="追踪时间" min-width="180"></vxe-table-column>
            <vxe-table-column field="smsStatus" title="短信状态" min-width="100">

              <template slot-scope="scope">
                <span style="color: red" v-if="scope.row.smsStatus == 1">已发送</span>
                <span style="color: brown" v-if="scope.row.smsStatus == 0">未发送</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseCritical">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 折扣 -->
    <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="填写模板名称" :visible.sync="showTempcategroy" @close="handleCloseTempcategroy">
      <div class="discount_box">
        <el-input size="mini" placeholder="请输入模板名称" max="100" min="1" v-model="tempcategroyDia" clearable>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer history_table_footer">
        <el-button size="mini" type="primary" @click="handleConfirmTempcategroy">确 认</el-button>
        <el-button size="mini" @click="handleCloseTempcategroy">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import permissionBtn from "@/components/PermissionBtn";
import { getPublicConfig } from "@/api/dataanalysis.js";
import { getList as getCompanyList } from "@/api/company_archives.js";
import {
  getList,
  getTemplateList,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getTrackList,
  addTrack,
  butchTrack,
  butchUpdate,
  PersonCriticals,
  PersonCriticalItem,
  SendSMSForCustomerCritical,
  SaveSimple,
} from "@/api/customer_critical.js";
import { getDicItemList } from "@/api/projectdictionary2.js";
import { formatDate } from "@/utils/tool.js";
import { DicNoticetemplateLoad, SendSMS } from "@/api/noticetemplate.js";
export default {
  name: "customercritical",
  components: { permissionBtn },
  data() {
    return {
      loading: false,
      page: 1, // 当前页码
      limit: 1000, // 每页显示多少条数据
      searchForm: {
        regid: "",
        name: "",
        companycode: "",
        checktype: "",
        level: "",
        confirmflag: "0",
        startdate: "",
        enddate: "",
        templatename: "",
        itemcodes: "",
      },
      list: [],
      count: 0,
      conditionDate: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
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
            text: "最近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }, // 日期选择器配置
      checkType: [],
      confirmItem: [
        {
          code: "0",
          name: "未追踪",
        },
        {
          code: "1",
          name: "已追踪",
        },
      ],
      companyItem: [],
      levelItem: [
        {
          code: "0",
          name: "一般",
        },
        {
          code: "1",
          name: "急",
        },
        {
          code: "2",
          name: "紧急",
        },
      ],
      selectArr: [],
      template: {
        show: false,
        page: 1,
        limit: 10,
        name: "",
        list: [],
        count: 0,
        form: {
          id: null,
          name: "",
          itemcodes: [],
          seqno: 0,
        },
        rules: {
          name: [{ required: true, message: "请填写名称", trigger: "blur" }],
          itemcodes: [
            { required: true, message: "请选择项目", trigger: "change" },
          ],
        },
        selectArr: [],
        showEdit: false,
        dicItemData: [],
      },
      track: {
        show: false,
        page: 1,
        limit: 10,
        query: {
          regid: "",
          combinecode: "",
          itemcode: "",
        },
        list: [],
        count: 0,
        showEdit: false,
        form: {
          selectedList: [],
          // regid: "",
          // combinecode: "",
          // itemcode: "",
          remark: "",
          followupflag: 0,
          followupdate: null,
        },
        rules: {
          remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        },
      },
      sendSmsShow: false,
      noticetemplateData: [],
      tempname: "",
      tempcontent: "",
      tempcategroy: "",
      showCritical: false,
      register: {},
      projectList: [],
      selectProject: [],
      noticetemplateDia: [],
      personCritical: {
        confirmremark: "",
        reportdate: "",
        smsCategory: "",
        smsContent: "",
      },
      smsName: "",
      level: "",
      confirmflag: "",
      smsStatus: "",
      isSendSmsAndTrack: false,
      showTempcategroy: false,
      tempcategroyDia: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    selectProjectSS() {
      let arr = this.selectProject.map((k) => {
        return k.combinename;
      });
      return arr.join("、");
    },
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
    this.searchForm.startdate = formatDate(start, "yyyy-MM-dd");
    this.searchForm.enddate = formatDate(end, "yyyy-MM-dd");
    this.conditionDate = [this.searchForm.startdate, this.searchForm.enddate];

    this.handleGetCheckType();
    this.handleGetCompanyItem();
    // this.handleGetCustomerCriticalList();
  },
  methods: {
    // 弹框关闭
    handleCloseCritical() {
      this.register = {};
      this.personCritical = {
        confirmremark: "",
        reportdate: "",
        smsCategory: "",
        smsContent: "",
      };
      this.projectList = [];
      this.selectProject = [];
      this.noticetemplateDia = [];
      this.smsName = "";
      this.level = "";
      this.confirmflag = "";
      this.smsStatus = "";
      this.isSendSmsAndTrack = false;
      this.showTempcategroy = false;
      this.tempcategroyDia = "";
      this.showCritical = false;
    },
    // 短信填充恢复
    handleReLoadSmS() {
      if (!this.smsName) {
        this.$message.warning("短信名称不可为空!");
        return;
      }
      let flag = this.noticetemplateDia.filter((k) => {
        return k.tempname == this.smsName;
      })[0];
      if (flag) {
        this.personCritical.smsContent = flag.content;
      }
    },
    // 短信填充回调
    handleSmsFill() {
      if (!this.personCritical.smsContent) {
        this.$message.warning("短信内容不可为空!");
        return;
      }
      if (this.selectProject.length == 0) {
        this.$message.warning("请先勾选表格数据再替换!");
        return;
      }
      let sex =
        this.register.sex == 0 ? "" : this.register.sex == 1 ? "先生" : "女士";
      let args = [
        this.register.name,
        this.selectProject[0].itemname,
        this.selectProject[0].result,
        this.selectProject[0].expression,
        sex,
        this.selectProject[0].combinename,
      ];
      this.personCritical.smsContent = this.stringFormat(
        this.personCritical.smsContent,
        args
      );
    },
    stringFormat(format, args) {
      // 获取参数
      // const args = Array.prototype.slice.call(arguments, 1);

      return format.replace(
        /{(\d+)(:[^}]+)?}/g,
        function (match, number, formatSpecifier) {
          // 提取参数索引
          const index = parseInt(number, 10);

          // 检查参数是否存在
          if (typeof args[index] === "undefined") {
            return match;
          }

          let value = args[index];

          // 处理格式化选项
          if (formatSpecifier) {
            // 移除冒号
            formatSpecifier = formatSpecifier.substring(1);

            // 处理不同的格式化选项
            switch (formatSpecifier) {
              case "C": // 货币格式
                value = new Intl.NumberFormat("zh-CN", {
                  style: "currency",
                  currency: "CNY",
                }).format(value);
                break;
              case "D": // 十进制整数格式
                value = parseInt(value).toString();
                break;
              case "F": // 固定点格式
                value = parseFloat(value).toFixed(2);
                break;
              case "N": // 数字格式（千位分隔符）
                value = new Intl.NumberFormat("zh-CN").format(value);
                break;
              // 可以添加更多格式化选项...
              default:
                // 如果是不认识的格式化选项，保持原样
                break;
            }
          }

          return value;
        }
      );
    },

    // 设置短信模板名称弹框提交
    handleConfirmTempcategroy() {
      if (!this.tempcategroyDia) {
        this.$message.warning("短信名称不可为空!");
        return;
      }
      SaveSimple({
        tempname: this.tempcategroyDia,
        content: this.personCritical.smsContent,
        smsinfotype: 1,
      }).then((res) => {
        if (!res.result) {
          this.$message.warning("保存有误!");
          this.handleCloseTempcategroy();
          return;
        }
        this.$message.success(res.message);
        DicNoticetemplateLoad({
          page: 1,
          limit: 100000,
          key: "",
        }).then((data) => {
          this.noticetemplateDia = data.data;
          let flag = this.noticetemplateDia.filter((k) => {
            return res.result.tempid == k.tempid;
          })[0];
          if (flag) {
            this.personCritical.smsContent = flag.content;
            this.personCritical.smsCategory = flag.tempcategroy;
            this.smsName = flag.tempname;
          }
          this.handleCloseTempcategroy();
        });
      });
    },
    // 设置短信模板名称弹框关闭
    handleCloseTempcategroy() {
      this.showTempcategroy = false;
      this.tempcategroyDia = "";
    },
    // 设置短信模板名称弹框关闭
    handleShowTempcategroy() {
      if (!this.personCritical.smsContent) {
        this.$message.warning("短信内容不可为空!");
        return;
      }
      this.showTempcategroy = true;
    },
    // 弹框发送短信并追踪
    handleSendSMSAndTrack() {
      if (!this.personCritical.smsContent) {
        this.$message.warning("短信内容不可为空!");
        return;
      }
      if (this.selectProject.length == 0) {
        this.$message.warning("请先勾选表格数据再发送!");
        return;
      }
      SendSMSForCustomerCritical({
        tempcategroy: this.personCritical.smsCategory,
        content: this.personCritical.smsContent,
        criticals: this.selectProject,
      }).then((res) => {
        this.$message.success(
          `发送成功${res.result.success}人，发送失败${
            res.result.fail
          }人，共计发送${res.result.success + res.result.fail}人`
        );
        butchTrack({
          remark: this.personCritical.confirmremark,
          followupflag: 1,
          followupdate: this.personCritical.reportdate,
          selectedList: this.selectProject.map((k) => {
            return {
              regid: k.regid,
              itemcode: k.itemcode,
              combinecode: k.combinecode,
            };
          }),
        }).then((res) => {
          this.$message.success(res.message);
          this.selectProject = [];
          this.handleGetProjectList();
        });
      });
    },
    // 弹框发送短信
    handleSendSMSForCustomerCritical() {
      if (!this.personCritical.smsContent) {
        this.$message.warning("短信内容不可为空!");
        return;
      }
      if (this.selectProject.length == 0) {
        this.$message.warning("请先勾选表格数据再发送!");
        return;
      }
      SendSMSForCustomerCritical({
        tempcategroy: this.personCritical.smsCategory,
        content: this.personCritical.smsContent,
        criticals: this.selectProject,
      }).then((res) => {
        this.$message.success(
          `发送成功${res.result.success}人，发送失败${
            res.result.fail
          }人，共计发送${res.result.success + res.result.fail}人`
        );
        this.selectProject = [];
        this.handleGetProjectList();
      });
    },
    // 弹框追踪回调
    handleButchTrack() {
      if (this.selectProject.length == 0) {
        this.$message.warning("请先勾选表格数据再追踪!");
        return;
      }
      butchTrack({
        remark: this.personCritical.confirmremark,
        followupflag: 1,
        followupdate: this.personCritical.reportdate,
        selectedList: this.selectProject.map((k) => {
          return {
            regid: k.regid,
            itemcode: k.itemcode,
            combinecode: k.combinecode,
          };
        }),
      }).then((res) => {
        this.$message.success(res.message);
        this.selectProject = [];
        this.handleGetProjectList();
      });
    },
    // 改变短信名称回调
    handleChangeTempnameDia(val) {
      let flag = this.noticetemplateDia.filter((k) => k.tempid == val)[0];
      if (flag) {
        this.personCritical.smsContent = flag.content;
        this.personCritical.smsCategory = flag.tempcategroy;
        this.smsName = flag.tempname;
      } else {
        this.personCritical.smsContent = "";
        this.personCritical.smsCategory = "";
        this.smsName = "";
      }
    },
    handleCheckPersonCriticalItem({ row, columnIndex }) {
      if (columnIndex == 0) return;
      PersonCriticalItem({
        regid: row.regid,
        combinecode: row.combinecode,
        itemcode: row.itemcode,
      }).then((res) => {
        this.personCritical = res.data;
      });
    },
    handleGetProjectList() {
      PersonCriticals({
        regid: this.register.regid || "",
        level: this.level,
        confirmflag: this.confirmflag,
        smsStatus: this.smsStatus,
      }).then((res) => {
        if (!res.data) return;
        this.projectList = res.data.criticalItems;
      });
    },
    handleCheckCritical(regid) {
      PersonCriticals({
        regid,
        level: "",
        confirmflag: "",
        smsStatus: "",
      }).then(async (res) => {
        if (!res.data) return;
        this.register = res.data.register;
        this.projectList = res.data.criticalItems;
        await DicNoticetemplateLoad({
          page: 1,
          limit: 100000,
          key: "",
        }).then((res) => {
          this.noticetemplateDia = res.data;
        });
        this.showCritical = true;
      });
    },
    // 勾选人员回调
    handleSelectProject({ records }) {
      this.selectProject = records;
    },
    // 勾选人员回调-全选
    handleSelectProjectAll({ records }) {
      this.selectProject = records;
    },
    //0717 zzg编辑追踪
    editRowEvent(row) {
      this.$refs.trackTable.setActiveRow(row);
    },
    saveRowEvent(row) {
      this.$refs.trackTable.clearActived().then(() => {
        let updateItem = {};
        updateItem.id = row.id;
        updateItem.regid = row.regid;
        updateItem.combinecode = row.combinecode;
        updateItem.itemcode = row.itemcode;
        updateItem.remark = row.remark;
        updateItem.operatordate = row.operatordate;
        butchUpdate(updateItem).then((res) => {
          if (res.result)
            this.$XModal.message({ message: "保存成功！", status: "success" });
          else this.$XModal.message({ message: res.message, status: "error" });
        });

        // this.loading = true;
        // setTimeout(() => {
        //   // this.loading = false;
        //   this.$XModal.message({ message: "保存成功！", status: "success" });
        // }, 300);
      });
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.trackTable;
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },

    // 发送短信按钮弹框-提交
    handlesendSmsSubmit() {
      if (!this.tempname) {
        this.$message.warning("请先选中短信名称内容!");
        return;
      }
      if (!this.tempcontent) {
        this.$message.warning("短信内容不可为空!");
        return;
      }
      SendSMSForCustomerCritical({
        tempcategroy: this.tempcategroy,
        content: this.tempcontent,
        criticals: this.selectArr,
        // regiditems: this.selectArr.map((k) => k.regid),
      }).then((res) => {
        this.$message.success(
          `发送成功${res.result.success}人，发送失败${
            res.result.fail
          }人，共计发送${res.result.success + res.result.fail}人`
        );
        // 只发短信
        if (!this.isSendSmsAndTrack) {
          this.selectArr = [];
          this.handlesendSmsClose();
          this.handleSearch();
        } else {
          // 短信并追踪
          this.isSendSmsAndTrack = false;
          this.handlesendSmsClose();
          this.handleTrackEditShow();
        }
      });
    },
    // 发送短信按钮弹框-关闭
    handlesendSmsClose() {
      this.sendSmsShow = false;
      this.noticetemplateData = [];
      this.tempname = "";
      this.tempcontent = "";
    },
    // 发送短信按钮弹框
    handleSendSmsShow() {
      console.log(this.selectArr);
      if (this.selectArr.length == 0) {
        this.$message.warning("请先选中发送短信对象!");
        return;
      }
      DicNoticetemplateLoad({
        page: 1,
        limit: 100000,
        key: "",
      }).then((res) => {
        if (!res.data) {
          this.noticetemplateData = [];
          this.$message.warning("暂无短信模板数据!");
          return;
        }
        this.noticetemplateData = res.data;
        this.sendSmsShow = true;
      });
    },
    // 改变短信名称回调
    handleChangeTempname(val) {
      let flag = this.noticetemplateData.filter((k) => k.tempid == val)[0];
      if (flag) {
        this.tempcontent = flag.content;
        this.tempcategroy = flag.tempcategroy;
      } else {
        this.tempcontent = "";
        this.tempcategroy = "";
      }
    },
    // 公共配置编码
    handleGetCheckType() {
      getPublicConfig({ cc: "CheckType" }).then((res) => {
        this.checkType = res.result;
      });
    },
    // 单位列表
    handleGetCompanyItem() {
      getCompanyList().then((res) => {
        this.companyItem = res.data;
      });
    },
    handleGetCustomerCriticalList() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] != "") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      getList({
        page: this.page,
        limit: this.limit,
        whereitems,
      })
        .then((res) => {
          this.count = res.count;
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.page = 1;
          this.count = 0;
          this.list = [];
          this.loading = false;
        });
    },
    handleChangeDate() {
      if (this.conditionDate && this.conditionDate.length > 0) {
        this.searchForm.startdate = this.conditionDate[0];
        this.searchForm.enddate = this.conditionDate[1];
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
      this.handleSearch();
    },
    handleSearch() {
      this.page = 1;
      this.list = [];
      this.handleGetCustomerCriticalList();
    },
    handleOnBtnClicked(domId) {
      switch (domId) {
        case "btnSearch": // 查询
          this.handleSearch();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnExport1": // 导出
          this.downloadExcel();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnTrack": // 追踪
          this.handleTrackEditShow();
          break;
        case "btnSendSms": // 短信发送
          this.handleSendSmsShow();
          break;
        case "btnSendSmsAndTrack": // 短信发送
          this.isSendSmsAndTrack = true;
          this.handleSendSmsShow();
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
    // 列表下载
    downloadExcel() {
      if (this.selectArr.length == 0) {
        this.$message.warning("请选择需要导出的信息!");
        return false;
      }
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = this.selectArr.map((k) => {
            return {
              ...k,
              level: this.levelItem.find((t) => t.code == k.level)?.name ?? "",
              cause: k.expression ? `${k.result}【${k.expression}】` : k.result,
              confirmflag: k.confirmflag == 1 ? "已追踪" : "未追踪",
              sexcn: k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女",
              agecn: `${k.age} ${k.ageunit}`,
            };
          });
          this.export2Excel();
        })
        .catch(() => {});
    },
    // 数据写入excel
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = [
          "等级",
          "体检号",
          "姓名",
          "性别",
          "年龄",
          "身份证号",
          "手机号",
          "单位",
          "项目",
          "项目",
          "结果",
          "参考范围",
          "时间",
          "状态",
          "追踪人",
          "备注",
        ]; // 导出的表头名信息
        const filterVal = [
          "level",
          "regid",
          "name",
          "sexcn",
          "agecn",
          "idcard",
          "telephone",
          "companyname",
          "combinename",
          "itemname",
          "result",
          "expression",
          "reportdate",
          "confirmflag",
          "operatorname",
          "confirmremark",
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
    handleSelect({ records }) {
      console.log(records);
      this.selectArr = records;
    },
    handleSelectAll({ records }) {
      this.selectArr = records;
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let styleJson = {};
      // styleJson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      styleJson.color = "#000";
      styleJson["font-weight"] = "bold";
      styleJson.background = "#d0ddeb";
      return styleJson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.limit = val;
      this.handleSearch();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.page = val;
      this.handleGetCustomerCriticalList();
    },
    handleTemplateShow() {
      let whereitems = [];
      if (this.template.name != "") {
        whereitems.push({
          key: "name",
          value: this.template.name,
        });
      }
      getTemplateList({
        page: this.template.page,
        limit: this.template.limit,
        whereitems,
      })
        .then((res) => {
          this.template.count = res.count;
          this.template.list = res.data;
          if (!this.template.show) {
            this.template.show = true;
            this.handleGetDicItemList();
          }
        })
        .catch((err) => {
          this.template.page = 1;
          this.template.count = 0;
          this.template.list = [];
        });
    },
    handleTemplateClear() {
      this.searchForm.templatename = "";
      this.searchForm.itemcodes = "";
      this.template.show = false;
      this.handleGetCustomerCriticalList();
    },
    handleTemplateSearch() {
      this.template.page = 1;
      this.template.list = [];
      this.handleTemplateShow();
    },
    handleTemplateSelect({ records }) {
      this.template.selectArr = records;
    },
    handleTemplateSelectAll({ records }) {
      this.template.selectArr = records;
    },
    handleTemplateSizeChange(val) {
      this.template.limit = val;
      this.handleTemplateShow();
    },
    handleTemplateCurrentChange(val) {
      this.template.page = val;
      this.handleTemplateShow();
    },
    handleTemplateClicked(domId) {
      switch (domId) {
        case "btnAdd":
          this.template.showEdit = true;
          break;
        case "btnEdit":
          this.handleTemplateEdit();
          break;
        case "btnDel":
          this.handleTemplateDel();
          break;
        default:
          break;
      }
    },
    // 获取项目字典列表数据回调
    handleGetDicItemList() {
      getDicItemList({
        page: 1,
        limit: 10000,
      })
        .then((res) => {
          this.template.dicItemData = res.data;
        })
        .catch((err) => {
          this.template.dicItemData = [];
        });
    },
    handleTemplateEdit(item) {
      item && (this.template.selectArr = [item]);
      if (this.template.selectArr.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.template.showEdit = true;
        this.template.form = JSON.parse(
          JSON.stringify(this.template.selectArr[0])
        );
      }
    },
    handleTemplateDel() {
      if (this.template.selectArr.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.template.selectArr.map((k) => {
            return k.id;
          });
          deleteTemplate(ids).then((res) => {
            this.$message.success(res.message);
            this.handleTemplateShow(); // 获取列表新数据
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    handleTemplateEditClose() {
      this.$refs["templateForm"].clearValidate();
      this.$refs["templateTable"].clearCheckboxRow();
      this.template.form = {
        id: null,
        name: "",
        itemcodes: [],
        seqno: 0,
      };
      this.template.showEdit = false;
    },
    handleTemplateSubmit() {
      this.$refs["templateForm"].validate((valid) => {
        if (valid) {
          this.template.form.itemcodes = this.template.form.itemcodes.join(",");
          if (this.template.form.id) {
            updateTemplate(this.template.form).then((res) => {
              this.$message.success(res.message);
              this.handleTemplateShow(); // 获取列表新数据
              this.handleTemplateEditClose(); // 关闭弹窗
            });
          } else {
            addTemplate(this.template.form).then((res) => {
              this.$message.success(res.message);
              this.handleTemplateShow(); // 获取列表新数据
              this.handleTemplateEditClose(); // 关闭弹窗
            });
          }
        }
      });
    },
    handleTemplateSelected(row) {
      this.searchForm.templatename = row.name;
      this.searchForm.itemcodes = row.itemcodes.join(",");
      this.template.show = false;
      this.handleGetCustomerCriticalList();
    },
    handleTrackShow(row) {
      this.track.query = {
        regid: row.regid,
        combinecode: row.combinecode,
        itemcode: row.itemcode,
      };
      let whereitems = [];
      Object.keys(this.track.query).forEach((k) => {
        if (this.track.query[k] != "") {
          whereitems.push({
            key: k,
            value: this.track.query[k],
          });
        }
      });
      getTrackList({
        page: this.track.page,
        limit: this.track.limit,
        whereitems,
      })
        .then((res) => {
          this.track.count = res.count;
          this.track.list = res.data;
          if (!this.track.show) {
            this.track.show = true;
          }
        })
        .catch((err) => {
          this.track.page = 1;
          this.track.count = 0;
          this.track.list = [];
        });
    },
    handleTrackSizeChange(val) {
      this.track.limit = val;
      this.handleTrackShow();
    },
    handleTrackCurrentChange(val) {
      this.track.page = val;
      this.handleTrackShow();
    },
    handleTrackEditShow(item) {
      //  else if (
      //   this.searchForm.templatename.length == 0 &&
      //   this.selectArr.length !== 1
      // ) {
      //   this.$message.warning("请勾选1条数据进行追踪!");
      //   return false;
      // }
      // console.log(item, "item");
      item && (this.selectArr = [item]);
      if (
        this.searchForm.templatename.length > 0 &&
        this.selectArr.length <= 0
      ) {
        this.$message.warning("请最少勾选1条数据进行追踪!");
        return false;
      } else {
        this.track.form = {
          selectedList: this.selectArr.map((item) => {
            return {
              regid: item.regid,
              combinecode: item.combinecode,
              itemcode: item.itemcode,
            };
          }),
          remark: "",
          followupflag: 0,
          followupdate: null,
        };
        this.track.showEdit = true;
      }
    },
    handleTrackEditClose() {
      this.$refs["trackForm"].clearValidate();
      this.track.form = {
        selectedList: [],
        // regid: "",
        // combinecode: "",
        // itemcode: "",
        remark: "",
        followupflag: 0,
        followupdate: null,
      };
      this.track.showEdit = false;
    },
    handleTrackSubmit() {
      this.$refs["trackForm"].validate((valid) => {
        if (valid) {
          butchTrack(this.track.form).then((res) => {
            this.$message.success(res.message);
            this.handleGetCustomerCriticalList(); // 获取列表新数据
            this.handleTrackEditClose(); // 关闭弹窗
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
/deep/ .el-dialog__wrapper {
  z-index: 1000 !important;
}
/deep/ .v-modal {
  z-index: 1000 !important;
}
</style>
