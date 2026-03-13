<template>
  <div class="index">
    <!-- <a href="zyhtest://" ref="aaaa">打开网易云</a> -->
    <!-- 主体内容 -->
    <!-- <input type="file" @change="handleFileUpload" /> -->
    <el-row class="content">
      <!-- 左侧功能盒子 -->
      <el-col :span="15">
        <div class="content_box">
          <!-- 我的工作计数模块 -->
          <div class="head word_t_box">
            <div class="head_word">我的工作</div>
            <el-button type="primary" size="mini" round @click="handleGetMyWorkModule">配置</el-button>
          </div>
          <div class="my_job_box">
            <div class="my_job fixed_job" v-if="workStatic">
              <div class="my_job_item">
                <img src="./img/预约.png" :draggable="false" alt="" />
                <div class="text">
                  <countTo class="subscribe" :startVal="0" :endVal="workStatic.yuyuecount" :duration="2000" />
                  <div class="text">预约</div>
                </div>
              </div>
              <div class="my_job_item">
                <img src="./img/登记.png" :draggable="false" alt="" />
                <div class="text">
                  <countTo class="subscribe" :startVal="0" :endVal="workStatic.dengjicount" :duration="2000" />
                  <div class="text">登记</div>
                </div>
              </div>
              <div class="my_job_item">
                <img src="./img/检查.png" :draggable="false" alt="" />
                <div class="text">
                  <countTo class="subscribe" :startVal="0" :endVal="workStatic.checkcount" :duration="2000" />
                  <div class="text">检查</div>
                </div>
              </div>
              <div class="my_job_item">
                <img src="./img/总检.png" :draggable="false" alt="" />
                <div class="text">
                  <countTo class="subscribe" :startVal="0" :endVal="workStatic.checkedcount" :duration="2000" />
                  <div class="text">总检</div>
                </div>
              </div>
            </div>
            <div class="my_job job_mb" v-if="workStatic">
              <div class="my_job_item" v-for="(item, index) in workModuleitems" :key="index">
                <img :src="workModuleIcon[item.code]" :draggable="false" alt="" />
                <div class="text">
                  <countTo class="subscribe" :startVal="0" :endVal="item.name" :duration="2000" />
                  <div class="text">{{ workModuleText[item.code] }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 常用功能模块 -->
          <div class="head mt">
            <div class="incommonuse">常用功能</div>
            <el-button type="primary" size="mini" round @click="handleGetInCommonUse">配置</el-button>
          </div>
          <div class="common_use">
            <div v-for="(item, index) in incommonuseRender" :key="index" class="common_item" @click="handleJump(item.moduleurl)">
              <img :src="'data:image/jpeg;base64,' + item.fullimagebase64" alt="" />
              <div class="common_text">{{ item.modulename }}</div>
            </div>
          </div>
          <!-- 我的便签模块 -->
          <div class="head note_head mt">
            我的便签
            <!-- <el-link
              slot="reference"
              type="primary"
              @click="dialogVisible = true"
              >新增便签</el-link
            > -->
            <el-button type="primary" size="mini" round @click="dialogVisible = true">新增便签</el-button>
            <!-- 新增便签弹框 -->
            <el-dialog title="新增便签" @close="handleCloseNote" :visible.sync="dialogVisible" width="50%">
              <el-form ref="form" :model="form" label-width="80px">
                <div class="head_time">
                  <el-form-item label="提醒时间">
                    <el-col :span="12">
                      <el-date-picker v-model="addNote.Remindertime" type="date" style="width: 100%" placeholder="选择日期" value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-col>
                    <el-col :span="12">
                      <el-time-picker v-model="addNote.time" style="width: 100%" placeholder="任意时间点" value-format="HH:mm" format="HH:mm"></el-time-picker>
                    </el-col>
                  </el-form-item>
                </div>
                <div class="head_worktitle">
                  <el-form-item label="工作标题">
                    <el-input v-model="addNote.worktitle" placeholder="填写标题"></el-input>
                  </el-form-item>
                </div>
                <div class="head_workcontent">
                  <el-form-item label="工作内容">
                    <el-input v-model="addNote.workcontent" type="textarea" placeholder="填写内容" :rows="10"></el-input>
                  </el-form-item>
                </div>
                <div class="head_button">
                  <el-button type="primary" plain size="mini" @click="handlePreservation()">保存</el-button>
                  <el-button type="primary" plain size="mini" @click="handleCancel()">取消</el-button>
                </div>
              </el-form>
            </el-dialog>
          </div>
          <!-- 便签列表 -->
          <div class="my_note">
            <div class="note_item" v-for="(item, index) in noteItem" :key="index">
              <div class="title">
                <span>{{ item.starttime }}</span>
                <i class="el-icon-close" @click="handleNoteDelete(item.notecode)"></i>
              </div>
              <div class="note_body1">
                <div class="body_title">{{ item.notecaption }}</div>
                <div class="body_content">{{ item.noteexplain }}</div>
              </div>
              <div class="details">
                <a href="#" @click="handleUnfold(index)">详情>></a>
              </div>
            </div>
          </div>
          <!-- 便签详情弹框 -->
          <el-dialog title="便签详情" :visible.sync="dialogUnfold" width="40%">
            <div class="note_dialog">
              <div class="note_dialog_time">
                {{ noteUnfold.createtime }}
              </div>
              <div class="note_dialog_title">
                {{ noteUnfold.notecaption }}
              </div>
              <div class="note_dialog_content">
                {{ noteUnfold.noteexplain }}
              </div>
            </div>
          </el-dialog>
        </div>
      </el-col>

      <!-- 右侧消息盒子 -->
      <el-col :span="9">
        <!-- <div style="margin-top: 16px;"></div> -->
        <div class="message_box">
          <!-- 即时通讯消息提醒 -->
          <!-- <div class="report_tips">
            <img class="img_icon" src="./img/微信.png" alt="">
            <div class="text">新消息：</div>
            <div class="text_content">【外科】张医生发来表情</div>
            <img class="img_content" src="./img/赞.png" alt="">
          </div> -->
          <!-- 消息提醒模块 -->
          <div class="list_head">
            <el-badge :value="criticalListCount" @click.native="handleGetCriticalList('Interface')" :max="99" class="badge">
              医院危急值
            </el-badge>
            <el-badge :value="appointmentCount" @click.native="handleGetAppointmentLoad(true)" :max="99" class="badge">
              预约
            </el-badge>
            <el-badge :value="criticalListCount1" @click.native="handleGetCriticalList('System')" :max="99" class="badge">
              科室危急值
            </el-badge>
            <div>
              <!--  <el-button
                type="primary"
                size="mini"
                @click="handleGetCriticalList"
                >危急值汇总表</el-button
              > -->
              <el-link type="primary" @click="handleMoreCritical">查看更多</el-link>
            </div>
          </div>
          <el-dialog title="提示" :visible.sync="notification" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="dialog_main">
              <!-- 基本条件 -->
              <div class="card">
                <!-- 标题 -->
                <div class="dialog_head">
                  <div class="dialoghead_title">
                    <div class="logo"></div>
                    <h4>基本条件</h4>
                  </div>
                </div>
                <div class="msg_basic msg_content">
                  <el-form :model="personalDetails" class="demo-form-inline" disabled>
                    <el-row :gutter="10">
                      <el-col :span="6">
                        <el-form-item label="体检号">
                          <el-input v-model="personalDetails.regid" placeholder="体检号" size="mini"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="姓名">
                          <el-input v-model="personalDetails.name" placeholder="姓名" size="mini"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="性别">
                          <el-select v-model="personalDetails.sex" placeholder="性别" size="mini">
                            <el-option label="未知" :value="0"></el-option>
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="年龄">
                          <el-input v-model="personalDetails.age" placeholder="年龄" size="mini"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item label="联系电话">
                          <el-input v-model="personalDetails.telephone" size="mini"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="身份证">
                          <el-input v-model="personalDetails.idcard" size="mini"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="体检日期">
                          <el-input v-model="personalDetails.regdate" size="mini"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item label="团检名称">
                          <el-select v-model="personalDetails.company" placeholder="团检名称" style="width: 100%" size="mini">
                            <el-option :label="personalDetails.company" :value="personalDetails.company"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="团检批次">
                          <el-select v-model="personalDetails.batch" placeholder="团检批次" style="width: 100%" size="mini">
                            <el-option :label="personalDetails.batch" :value="personalDetails.batch"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="团检分组">
                          <el-select v-model="personalDetails.group" placeholder="团检分组" style="width: 100%" size="mini">
                            <el-option :label="personalDetails.group" :value="personalDetails.group"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>

              <!-- 团检信息 -->
              <!-- <div class="card">
                <div class="dialog_head">
                  <div class="dialoghead_title">
                    <div class="logo"></div>
                    <h4>团检信息</h4>
                  </div>
                </div>
                <div class="msg_group msg_content">
                  <el-form
                    :model="personalDetails"
                    class="demo-form-inline"
                    disabled
                  >
                    <el-form-item label="团检名称" style="width: 40%">
                      <el-select
                        v-model="personalDetails.company"
                        placeholder="团检名称"
                        style="width: 100%"
                        size="mini"
                      >
                        <el-option
                          :label="personalDetails.company"
                          :value="personalDetails.company"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="团检批次" style="width: 25%">
                      <el-select
                        v-model="personalDetails.batch"
                        placeholder="团检批次"
                        style="width: 100%"
                        size="mini"
                      >
                        <el-option
                          :label="personalDetails.batch"
                          :value="personalDetails.batch"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="团检分组" style="width: 35%">
                      <el-select
                        v-model="personalDetails.group"
                        placeholder="团检分组"
                        style="width: 100%"
                        size="mini"
                      >
                        <el-option
                          :label="personalDetails.group"
                          :value="personalDetails.group"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </div> -->

              <!-- 异常信息 -->
              <div class="card">
                <!-- 标题 -->
                <div class="dialog_head">
                  <div class="dialoghead_title">
                    <div class="logo"></div>
                    <h4>异常信息</h4>
                  </div>
                </div>
                <div class="msg_abnormal msg_content" style="padding: 0">
                  <EasyTable :loading="loading" height="100%" style="height: 200px" class="table_100" :data="criticalListdia" :tableOptions="criticalListOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                </div>
              </div>
              <!-- 异常备注 -->
              <div class="card">
                <!-- 标题 -->
                <div class="dialog_head">
                  <div class="dialoghead_title">
                    <div class="logo"></div>
                    <h4>异常备注</h4>
                  </div>
                </div>
                <div class="msg_abnormal msg_content">
                  <el-input type="textarea" :rows="4" resize="none" placeholder="请输入内容" v-model="msgAbnormal"></el-input>
                </div>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" plain @click="handleJumpPage">检查结果</el-button>
              <el-button type="primary" plain @click="showFlowPath = true">流程追踪</el-button>
              <el-button type="primary" plain @click="handleNotificaTion">关 闭</el-button>
            </span>
          </el-dialog>
          <!-- 签到流程 -->
          <FlowPath class="secondary_dialog" v-if="showFlowPath && chooseCritical" :regid="chooseCritical.regid" @close="showFlowPath = false" />
          <div class="message_tips masstt">
            <div class="message_item" :class="[(index + 1) % 2 == 0 ? 'bg_tow' : '']" v-for="(item, index) in criticalList" :key="index" @click="handleNotification(item)">
              <el-badge value="new" />
              <div class="text">
                {{
                  item.criticaltypename +
                  " " +
                  item.name +
                  "　" +
                  `${item.sex == 0 ? "未知" : item.sex == 1 ? "男" : "女"}` +
                  "　" +
                  item.wordname
                }}
              </div>
              <div class="time">{{ item.checkdate }}</div>
            </div>
          </div>
          <!-- 通知提醒模块 -->
          <div class="list_head" style="margin: 15px 0 10px 0">
            <el-badge :value="bulletinList.length" :max="99" class="badge">
              通知提醒
            </el-badge>
            <el-link type="primary">查看更多</el-link>
          </div>
          <div class="message_tips masstb">
            <div class="message_item" v-for="(item, index) in bulletinList" :key="index" @click="handleBulletinDetails(item)">
              <el-link class="text" type="primary">{{
                item.bulletincaption
              }}</el-link>
              <div class="time">{{ item.createtime }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 体检预约总列表弹框 -->
    <el-dialog title="预约人员名单" :visible.sync="showAppointment" width="70%" :show-close="false" :close-on-click-modal="false">
      <div>
        <div style="
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
          ">
          <div>
            <span style="margin-right: 12px">时间范围:</span>
            <el-date-picker v-model="AppointmentData" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" size="mini" @change="handleChangeAppointment">
            </el-date-picker>
          </div>
          <div class="btn">
            <el-button size="mini" type="primary" @click="handlePrintAppointment">打印</el-button>
            <el-button size="mini" type="primary" @click="downloadExcel('预约')">导出</el-button>
          </div>
        </div>
        <EasyTable :loading="loading" height="100%" class="table_100" style="height: 400px" :data="AppointmentTotal" :tableOptions="AppointmentOptionsTotal" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="(showAppointment = false), (AppointmentData = [])">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 危急值汇总列表弹框 -->
    <el-dialog title="危急值汇总列表弹框" :visible.sync="showCriticalList" width="70%" :show-close="false" :close-on-click-modal="false">
      <div>
        <div style="
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
          ">
          <div>
            <span style="margin-right: 12px">时间范围:</span>
            <el-date-picker v-model="criticalData" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" size="mini" @change="handleChangeCriticalData">
            </el-date-picker>
          </div>
          <div class="btn">
            <el-button size="mini" type="primary" @click="handlePrintCriticalList">打印</el-button>
            <el-button size="mini" type="primary" @click="downloadExcel('危急值')">导出</el-button>
          </div>
        </div>
        <EasyTable :loading="loading" height="100%" class="table_100" style="height: 400px" :data="criticalListTotal" :tableOptions="criticalListOptionsTotal" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="(showCriticalList = false), (criticalData = [])">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 新增便签数据弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" @close="handleCloseNote" class="dialogNote">
      <el-form :model="noteForm" :rules="noteRules" ref="noteForm" label-width="100px">
        <el-form-item size="mini" label="提醒时间" prop="date">
          <el-date-picker v-model="noteForm.date" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item size="mini" label="工作标题" prop="title">
          <el-input v-model="noteForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item size="mini" label="工作内容" prop="content">
          <el-input type="textarea" v-model="noteForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseNote">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSaveNote">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 通知提醒详情 -->
    <el-dialog title="提示详情" :visible.sync="showBulletin" class="bulletin" width="60%" top="10%" @close="handleCloseBulletin">
      <span v-if="chooseBulletin">
        <div class="bulletinexplain" v-html="chooseBulletin.bulletinexplain"></div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain size="mini" @click="handleCloseBulletin">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 配置我的工作模块 -->
    <el-dialog title="我的工作" :visible.sync="showMyWord" width="45%" :close-on-click-modal="false" class="word_dia" @close="handleCancelMyWorkModule">
      <div class="word_dia_box">
        <el-checkbox v-for="item in wordItems" :key="item.code" v-model="item.selected">{{ item.name }}</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelMyWorkModule">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitMyWorkModule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 常用功能 -->

    <el-dialog title="配置模块" class="project_dia" :close-on-click-modal="false" width="1000px" :show-close="false" :visible.sync="showIncommonuse">
      <!-- 主体表格 -->
      <el-row class="project_content">
        <div class="search_box">
          <el-input size="mini" placeholder="请输入套餐或组合名称" v-model="searchName" clearable>
          </el-input>
        </div>
        <el-col :span="11">
          <EasyTable height="100%" class="project_data" :loading="loading" :data="incommonuseDataSS" :tableOptions="incommonuseOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleOptionIncommonuse" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        </el-col>
        <el-col :span="3" class="btn_group">
          <el-button type="primary" size="small" icon="el-icon-top" @click="handleMoveTop"></el-button>
          <el-button type="primary" size="small" icon="el-icon-bottom" @click="handleMoveBottom"></el-button>
          <el-button type="primary" size="small" icon="el-icon-right" @click="handleMoveRight"></el-button>
          <el-button type="primary" size="small" icon="el-icon-back" @click="handleMoveLeft"></el-button>
        </el-col>
        <el-col :span="10">
          <EasyTable height="100%" class="add_project_data" :data="incommonuseAddData" :tableOptions="addIncommonuseOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleConfirmIncommonuse" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelIncommonuse">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitIncommonuse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import countTo from "vue-count-to"; // 引入计数组件
import FlowPath from "@/components/flowPath"; // 签到流程组件
import {
  getWorkStatic,
  getMessageList,
  getNoteList,
  setNoteAdd,
  setNoteDelete,
  setNoteDetail,
  getSysBulletin,
  getCriticalvalueList,
  getDetails,
  getGetModules,
  getMyWorkModule,
  setMyWorkModuleSave,
  getMyModules,
  saveMyModules,
  getCriticalList,
  AppointmentLoad,
} from "@/api/dashboard.js";
import { printStaticsBase64 } from "@/api/printreport.js";
import { getCustomerResultCriticalList } from "@/api/customerresult.js"; // 引入页面接口
import { getToken } from "@/utils/auth";
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import JSEncrypt from "jsencrypt";
import { getDicSetmealList } from "@/api/setMealDialog.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import {
  initWebSocket,
  sendWebsocket,
  closeWebsocket,
} from "@/utils/webSocket.js";
export default {
  name: "",

  components: {
    countTo,
    FlowPath,
  },

  data() {
    return {
      criticalTHeader: [
        "姓名",
        "性别",
        "年龄",
        "电话号码",
        "身份证",
        "单位",
        "组合",
        "项目",
        "结果",
        "上限",
        "下限",
        "提示",
      ],
      criticalFilterVal: [
        "name",
        "sexcn",
        "age",
        "telephone",
        "idcard",
        "companyname",
        "combinename",
        "itemname",
        "result",
        "res_upper",
        "res_lower",
        "tips",
      ],
      AppointmentTHeader: [
        "姓名",
        "性别",
        "年龄",
        "电话号码",
        "身份证",
        "单位",
        "预约日期",
      ],
      AppointmentFilterVal: [
        "name",
        "sexcn",
        "age",
        "telephone",
        "idcard",
        "companyname",
        "checkdate",
      ],
      showAppointment: false,
      AppointmentData: [],
      AppointmentTotal: [],
      criticalData: [],
      showCriticalList: false,
      criticalListTotal: [],
      criticalListdia: [],
      msgBasic: {
        id: "",
        name: "",
        sex: "",
        age: "",
        date: "",
        idcard: "",
        type: "",
        phoneNum: "",
        address: "",
        HISlogo: "",
      }, // 基本条件
      msgGroup: {
        name: "",
        batch: "",
        group: "",
      }, // 团检信息
      msgAbnormal: "", // 异常信息
      dialogVisible: false,
      dialogUnfold: false,

      noteUnfold: {},
      addNote: {
        time: "",
        Remindertime: "",
        // 开始时间
        Remindertime1: "",
        // 结束时间
        Remindertime2: "",
        // 工作标题
        worktitle: "",
        // 工作内容
        workcontent: "",
      },

      // 功能列表数组
      content: [
        {
          url: require("@/assets/img/1627286055(1).jpg"),
          name: "体检预约",
        },
        {
          url: require("@/assets/img/1627286070(1).jpg"),
          name: "体检登记",
        },
        {
          url: require("@/assets/img/1627286083(1).jpg"),
          name: "标本采样",
        },
        {
          url: require("@/assets/img/1627286095(1).jpg"),
          name: "团体预约",
        },
        {
          url: require("@/assets/img/1627286107(1).jpg"),
          name: "体检签到",
        },
        {
          url: require("@/assets/img/1627286117(1).jpg"),
          name: "智能分诊",
        },
        {
          url: require("@/assets/img/1627286127(1).jpg"),
          name: "科室检查",
        },
        {
          url: require("@/assets/img/1627286139.jpg"),
          name: "总检",
        },
      ],
      // 新增便签数据弹框
      dialogFormVisible: false,
      noteForm: {
        date: [],
        title: "",
        content: "",
      }, // 标签表单对象
      noteRules: {
        date: [
          {
            required: true,
            message: "请选择提醒时间",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入工作标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入工作内容",
            trigger: "blur",
          },
        ],
      }, // 严重新增便签表单对象
      workStatic: undefined, //我的工作
      form: {},
      noteItem: {},
      nodeDelete: [],
      bulletinList: [], // 通知提醒列表数据
      chooseBulletin: undefined, //选中查看对象
      showBulletin: false,
      notification: false, // 消息通知，查看更多
      personalDetails: {},
      marriageList: [],
      checktypeList: [],
      companyList: [],
      showFlowPath: false, // 控制显示登记流程
      criticalList: [], //消息通知列表
      appointmentCount: 0,
      criticalListCount: 0,
      criticalListCount1: 0,
      chooseCritical: undefined, //选中人员信息
      cCurrentPage: 1,
      cpageSize: 20,
      powerModules: [], // 当前用户可访问权限模块
      showMyWord: false, // 显示我的工作模块
      wordItems: [], // 我的工作弹框渲染数组
      workModuleitems: [],
      workModuleIcon: {
        SignInWork: require("./img/SignInWork.png"),
        CheckWork: require("./img/CheckWork.png"),
        SignOutWork: require("./img/SignOutWork.png"),
        PersonCheckWork: require("./img/PersonCheckWork.png"),
        PersonTotalCheckWork: require("./img/PersonTotalCheckWork.png"),
        PersonReportWork: require("./img/PersonReportWork.png"),
      },
      workModuleText: {
        SignInWork: "签到",
        CheckWork: "检查中",
        SignOutWork: "交表",
        PersonCheckWork: "检查工作量",
        PersonTotalCheckWork: "总检工作量",
        PersonReportWork: "报告工作量",
      },
      loading: false, // 常用功能配置表格加载特效
      showIncommonuse: false, // 常用功能配置弹框
      incommonuseRender: [], //常用功能配置列表渲染-不修改
      incommonuseData: [], // 常用功能配置列表
      incommonuseAddData: [], // 常用功能配置选中列表
      selectProject: [], // 左边选中列表
      selectDicitems: [], // 右边选中列表
      searchName: "",
      sourcecategory: "",
      isHospital: "index",
      hospitalsFlag: "",
      joinSum: 1,
    };
  },
  computed: {
    AppointmentOptionsTotal() {
      return [
        {
          type: "index",
          title: "序号",
          width: 55,
        },
        {
          title: "姓名",
          prop: "name",
          width: 110,
          omit: 1,
        },
        {
          title: "性别",
          width: 65,
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          width: 65,
          prop: "age",
          omit: 1,
        },
        {
          title: "电话号码",
          width: 110,
          prop: "telephone",
          omit: 1,
        },
        {
          title: "身份证",
          width: 170,
          prop: "idcard",
          omit: 1,
        },
        {
          title: "单位",
          width: 150,
          prop: "companyname",
          omit: 1,
        },
        {
          title: "预约日期",
          prop: "checkdate",
          omit: 1,
        },
      ];
    },
    criticalListOptionsTotal() {
      return [
        {
          title: "姓名",
          prop: "name",
          width: 110,
          omit: 1,
        },
        {
          title: "性别",
          width: 65,
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          width: 65,
          prop: "age",
          omit: 1,
        },
        {
          title: "电话号码",
          width: 110,
          prop: "telephone",
          omit: 1,
        },
        {
          title: "身份证",
          width: 170,
          prop: "idcard",
          omit: 1,
        },
        {
          title: "单位",
          width: 150,
          prop: "companyname",
          omit: 1,
        },
        {
          title: "组合",
          width: 100,
          prop: "combinename",
          omit: 1,
        },
        {
          title: "项目",
          prop: "itemname",
          width: 180,
          omit: 1,
        },
        {
          title: "结果",
          align: "center",
          width: 200,
          render: (h, data) => {
            return <span style="color:red">{data.result}</span>;
          },
        },
        {
          title: "上限",
          prop: "res_upper",
          width: 180,
          omit: 1,
        },
        {
          title: "下限",
          prop: "res_lower",
          width: 180,
          omit: 1,
        },
        {
          title: "提示",
          align: "center",
          width: 120,
          render: (h, data) => {
            return <span style="color:red">{data.tips}</span>;
          },
        },
        // {
        //   title: "上下限",
        //   // prop: "reslower",
        //   align: "center",
        //   width: 120,
        //   render: (h, data) => {
        //     if (data.res_exp !== "") {
        //       return <div domPropsInnerHTML={data.res_exp}></div>;
        //     } else {
        //       return (
        //         <div>
        //           {data.res_upper
        //             ? `${data.res_lower} - ${data.res_upper}`
        //             : `${data.res_lower}`}
        //         </div>
        //       );
        //     }
        //   },
        // },
      ];
    },
    criticalListOptions() {
      return [
        {
          title: "组合名称",
          prop: "combinename",
          width: 110,
          omit: 1,
        },
        {
          title: "项目",
          prop: "itemname",
          width: 180,
          omit: 1,
        },
        {
          title: "结果",
          align: "center",
          render: (h, data) => {
            return <span style="color:red">{data.result}</span>;
          },
        },
        {
          title: "提示",
          align: "center",
          width: 120,
          render: (h, data) => {
            return <span style="color:red">{data.tips}</span>;
          },
        },
        {
          title: "参考范围",
          // prop: "reslower",
          align: "center",
          width: 120,
          render: (h, data) => {
            if (data.res_exp !== "") {
              return <div domPropsInnerHTML={data.res_exp}></div>;
            } else {
              return (
                <div>
                  {data.res_upper
                    ? `${data.res_lower} - ${data.res_upper}`
                    : `${data.res_lower}`}
                </div>
              );
            }
          },
        },
      ];
    },
    // 套餐表格搜索数据
    incommonuseDataSS() {
      const search = this.searchName;
      if (search) {
        return this.incommonuseData.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.incommonuseData;
    },
    incommonuseOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "模块编码",
          prop: "modulecode",
          width: 150,
          omit: 1,
        },
        {
          title: "模块名称",
          prop: "modulename",
          width: 100,
          omit: 1,
        },
        {
          title: "模块路径",
          prop: "moduleurl",
          omit: 1,
        },
      ];
    },
    addIncommonuseOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "模块编码",
          prop: "modulecode",
          width: 150,
          omit: 1,
        },
        {
          title: "模块名称",
          prop: "modulename",
          width: 100,
          omit: 1,
        },
        {
          title: "模块路径",
          prop: "moduleurl",
          omit: 1,
        },
      ];
    },
  },
  async mounted() {
    let isGetLocal = await getSysConfigInfo({
      cc: "Sys_IsGetLocalHostInfo",
    });
    let md5code = localStorage.getItem("md5code") || "";
    if (isGetLocal.result == 1) {
      let url = `http://127.0.0.1:53536/home/get?id=${md5code}`;
      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.macAddress) {
            localStorage.setItem("md5code", res.data.macAddress);
          }
        })
        .catch((err) => {
          // this.$message.warning(err);
        });
    } else if (isGetLocal.result == 2) {
    } else {
      !md5code && this.handlegetFingerprintMd5Code();
    }
    this.localSocket(md5code);
    // this.$refs.aaaa.click();
    // var encryptor = new this.$jsEncrypt(); // 创建加密对象实例
    // //之前ssl生成的公钥，复制的时候要小心不要有空格
    // encryptor.setPublicKey(window.pubKey); //设置公钥
    // var rsaPassWord = encryptor.encrypt("123456"); // 对内容进行加密
    // console.log(rsaPassWord, "     ---------rsaPassWord");
    // var decrypt = new JSEncrypt(); //创建解密对象实例
    // //之前ssl生成的秘钥
    // var priKey = window.priKey;
    // decrypt.setPrivateKey(priKey); //设置秘钥
    // var uncrypted = decrypt.decrypt(rsaPassWord); //解密之前拿公钥加密的内容
    // console.log("解密后:", uncrypted);
    if (getToken()) {
      getGetModules({ token: getToken() }).then((res) => {
        if (!res.result) return;
        this.powerModules = res.result.map((k) => {
          return k.url;
        });
      });
    }
    // 页面加载获取数据
    // this.handleGetMessageList();
    this.handleGetWorkStatic();
    this.handleGetNoteList();
    this.handleGetSysBulletin();
    this.handleGetCriticalvalueList();
    this.handleIncommonuseRender();
    this.handleGetDicSetmealList();
    this.handleGetAppointmentLoad();
    this.$nextTick(() => {
      this.isHospital = this.Hospitals;
    });
  },
  methods: {
    async localSocket(md5code) {
      let that = this;
      if ("WebSocket" in window) {
        that.ws2 = new WebSocket(`ws://127.0.0.1:57575/`);
        that.$global2.setWs(that.ws2);
        that.ws2.onopen = function () {
          that.handdleMsg(
            that.jsonSf({
              BusinessType: "GetIpAndMac",
              Data: md5code,
            })
          );
        };
        //that.onopen(); 这个地方未定义是会报错，所以我写成了  that.ws.onopen = function() {console.log('开始连接')};

        that.ws2.onclose = function () {
          // 关闭 websocket
          console.log("连接已关闭...");
          setTimeout(() => {
            that.joinSum++;
            that.joinSum < 100 && that.localSocket(md5code);
          }, 2000);
        };
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
    jsonSf(data) {
      return JSON.stringify(data);
    },
    // 发送和接收消息
    handdleMsg(msg) {
      let that = this;
      console.log(that.$global2.ws2);
      if (that.$global2.ws2 && that.$global2.ws2.readyState == 1) {
        console.log("发送信息", msg);
        that.$global2.ws2.send(msg);
      }
      that.$global2.ws2.onmessage = function (msg) {
        console.log("收到本地接口", JSON.parse(msg.data));
        if (msg.data != "连接成功" && JSON.parse(msg.data)) {
          const data = JSON.parse(msg.data);
          if (data.businessType == "GetIpAndMac") {
            if (data.result.mac) {
              localStorage.setItem("md5code", data.result.mac);
            }
          }
        }
      };
    },
    async handlegetFingerprintMd5Code() {
      let options = { excludes: {} };
      Fingerprint2.get(options, function (components) {
        const values = components.filter((t) => {
          return t.key == "canvas" ? t.value : "";
        })[0].value;
        // 指纹
        let Fingercode = Fingerprint2.x64hash128(values.join(""), 31);
        //写入cookied
        localStorage.setItem("md5code", Fingercode);
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0]; // 获取第一个被选择的文件对象

      if (file && file instanceof File) {
        this.readTextFromFile(file); // 调用自定义的读取文本内容的函数
      } else {
        console.log("未选择有效的文件");
      }
    },

    readTextFromFile(file) {
      const reader = new FileReader();

      reader.onload = () => {
        const textContent = reader.result; // 读取到的文本内容

        // 在此处进行相关操作，比如将textContent显示在页面上或者发送给服务器等
        console.log(textContent);
      };

      reader.readAsText(file); // 开始读取文件内容
    },
    // 获取表格数据回调
    handleGetDicSetmealList() {
      getDicSetmealList({ tp: "", sex: this.sex }).then((res) => {
        if (!res.result) return;
        let setmealAndCombine = res.result;
        localStorage.setItem(
          "setmealAndCombine",
          JSON.stringify(setmealAndCombine)
        );
      });
    },
    // 列表下载
    downloadExcel(flag) {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let name = "";
          if (flag == "危急值") {
            name = "危急值表";
            this.excelData = this.criticalListTotal;
            this.export2Excel(
              this.criticalTHeader,
              this.criticalFilterVal,
              name
            );
          } else {
            name = "体检预约表";
            this.excelData = this.AppointmentTotal;
            this.export2Excel(
              this.AppointmentTHeader,
              this.AppointmentFilterVal,
              name
            );
          }
          // this.export2Excel();
        })
        .catch(() => {});
    },
    // 数据写入excel
    export2Excel(head, filter, name) {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = head; // 导出的表头名信息
        const filterVal = filter; // 导出的表头字段名，需要导出表格字段名
        const list = this.excelData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, name); // 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 体检预约列表导出PDF
    handlePrintAppointment() {
      let data = {
        repname: "预约人员名单",
        whereitems: [
          {
            key: "startTime",
            value: this.AppointmentData[0],
          },
          {
            key: "endTime",
            value: this.AppointmentData[1],
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
    },
    // 危急值列表导出PDF
    handlePrintCriticalList() {
      let data = {
        repname: "高危体检结果警示表",
        whereitems: [
          {
            key: "startTime",
            value: this.criticalData[0],
          },
          {
            key: "endTime",
            value: this.criticalData[1],
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
    },
    handleChangeCriticalData(value) {
      if (value) {
        this.criticalData = value;
      } else {
        this.criticalData = [];
      }
      let whereitems = [];
      if (this.criticalData.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.criticalData[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.criticalData[1],
        });
      }
      whereitems.push({
        key: "sourcecategory",
        value: this.sourcecategory,
      });
      getCriticalList({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        if (!res.data) {
          this.criticalListTotal = [];
        } else {
          this.criticalListTotal = res.data.map((k) => {
            return {
              ...k,
              sexcn: k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女",
            };
          });
        }
        this.showCriticalList = true;
      });
    },
    handleChangeAppointment(value) {
      if (value) {
        this.AppointmentData = value;
      } else {
        this.AppointmentData = [];
      }
      let whereitems = [];
      if (this.AppointmentData.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.AppointmentData[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.AppointmentData[1],
        });
      }
      whereitems.push({
        key: "timetype",
        value: 4,
      });
      whereitems.push({
        key: "status",
        value: 1,
      });
      AppointmentLoad({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        if (!res.data) {
          this.AppointmentTotal = [];
          return;
        }
        this.appointmentCount = res.count;
        this.AppointmentTotal = res.data;
      });
    },
    // 体检预约列表
    handleGetAppointmentLoad(flag) {
      let time = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      let strat = `${time} 00:00:00`;
      let end = `${time} 23:59:59`;
      this.AppointmentData = [strat, end];
      let whereitems = [];
      whereitems.push({
        key: "timetype",
        value: 4,
      });
      whereitems.push({
        key: "status",
        value: 1,
      });
      whereitems.push({
        key: "startdate",
        value: strat,
      });
      whereitems.push({
        key: "enddate",
        value: end,
      });
      AppointmentLoad({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        if (!res.data) {
          this.AppointmentTotal = [];
          return;
        }
        this.appointmentCount = res.count;
        this.AppointmentTotal = res.data;
        flag && (this.showAppointment = true);
      });
    },
    // 危急值汇总表
    handleGetCriticalList(sourcecategory) {
      this.sourcecategory = sourcecategory;
      let time = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      let strat = `${time} 00:00:00`;
      let end = `${time} 23:59:59`;
      this.criticalData = [strat, end];
      let whereitems = [];
      if (this.criticalData.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.criticalData[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.criticalData[1],
        });
      }
      whereitems.push({
        key: "sourcecategory",
        value: this.sourcecategory,
      });
      getCriticalList({
        page: 1,
        limit: 100000,
        whereitems,
      }).then((res) => {
        // if (!res.data) return false;
        if (!res.data) {
          this.criticalListTotal = [];
        } else {
          this.criticalListTotal = res.data.map((k) => {
            return {
              ...k,
              sexcn: k.sex == 0 ? "未知" : k.sex == 1 ? "男" : "女",
            };
          });
        }

        this.showCriticalList = true;
      });
    },
    // 获取常用功能列表 镇封两人
    handleIncommonuseRender() {
      this.loading = true;
      getMyModules()
        .then((res) => {
          if (!res.result) return;
          this.incommonuseRender = res.result.mainfuncitems;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 常用功能配置提交回调
    handleSubmitIncommonuse() {
      let mainfuncitems = this.incommonuseAddData.map((k) => {
        return {
          modulecode: k.modulecode,
          modulename: k.modulename,
          moduleurl: k.moduleurl,
          imageurl: k.imageurl,
        };
      });
      saveMyModules(mainfuncitems)
        .then((res) => {
          this.$message.success(res.message);
          this.handleCancelIncommonuse();
        })
        .catch(() => {
          this.$message.success("操作失败!请联系管理员");
          this.handleCancelIncommonuse();
        });
    },
    // 常用功能配置取消回调
    handleCancelIncommonuse() {
      this.showIncommonuse = false;
      this.incommonuseData = []; // 常用功能配置列表
      this.incommonuseAddData = []; // 常用功能配置选中列表
      this.selectProject = []; // 左边选中列表
      this.selectDicitems = []; // 右边选中列表
      this.handleIncommonuseRender();
    },
    // 常用功能备选列表勾选回调
    handleOptionIncommonuse(arr) {
      this.selectProject = arr;
    },
    // 常用功能选中列表勾选回调
    handleConfirmIncommonuse(arr) {
      this.selectDicitems = arr;
    },
    // 项目数据上移回调
    handleMoveTop() {
      if (this.selectDicitems.length !== 1) {
        this.$message.warning("请勾选一个模块进行移动!");
        return false;
      }
      let index = this.incommonuseAddData.findIndex(
        (k) => k.modulecode == this.selectDicitems[0].modulecode
      );
      if (index == 0) {
        this.$message.warning("当前数据已移动到最顶部!");
        return false;
      }
      this.incommonuseAddData.splice(index, 1);
      this.incommonuseAddData.splice(index - 1, 0, this.selectDicitems[0]);
    },
    // 项目数据下移回调
    handleMoveBottom() {
      if (this.selectDicitems.length !== 1) {
        this.$message.warning("请勾选一个模块进行移动!");
        return false;
      }
      let index = this.incommonuseAddData.findIndex(
        (k) => k.modulecode == this.selectDicitems[0].modulecode
      );
      if (index == this.incommonuseAddData.length - 1) {
        this.$message.warning("当前数据已移动到最底部!");
        return false;
      }
      this.incommonuseAddData.splice(index, 1);
      this.incommonuseAddData.splice(index + 1, 0, this.selectDicitems[0]);
    },
    // 项目数据右移回调
    handleMoveRight() {
      if (this.selectProject.length == 0) {
        this.$message.warning("请选择要添加的模块!");
        return false;
      }
      let inctLen = this.selectProject.length;
      let incAddLen = this.incommonuseAddData.length;
      if (incAddLen > 8 || inctLen + incAddLen > 8) {
        this.$message.warning("最大支持添加8个常用模块!");
        return false;
      }
      //遍历获得多选选中的index值 -- 删除选中数据
      this.selectProject.forEach((value, index) => {
        //遍历多选框获取的数据
        this.incommonuseData.forEach((v, i) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.modulecode == v.modulecode) {
            this.incommonuseData.splice(i, 1);
          }
        });
      });
      this.incommonuseAddData.push(...this.selectProject); //  移动选中数据
      this.selectProject = []; // 重置勾选数组
    },
    // 项目数据左移回调
    handleMoveLeft() {
      if (this.selectDicitems.length == 0) {
        this.$message.warning("请选择要取消的模块!");
        return false;
      }
      //遍历获得多选选中的index值 -- 删除选中数据
      this.selectDicitems.forEach((value, index) => {
        //遍历多选框获取的数据
        this.incommonuseAddData.forEach((v, i) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.modulecode == v.modulecode) {
            this.incommonuseAddData.splice(i, 1);
          }
        });
      });
      this.incommonuseData.push(...this.selectDicitems); //  移动选中数据
      this.selectDicitems = []; // 重置勾选数组
    },
    // 点击常用功能配置回调
    handleGetInCommonUse() {
      this.loading = true;
      getMyModules()
        .then((res) => {
          if (!res.result) return;
          this.incommonuseData = res.result.leftfuncitems;
          this.incommonuseAddData = res.result.mainfuncitems;
          this.loading = false;
          this.showIncommonuse = true;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取我的工作回调
    handleGetWorkStatic() {
      getWorkStatic().then((res) => {
        this.workStatic = res.result;
        if (res.result.workModuleitems.length != 0) {
          this.workModuleitems = res.result.workModuleitems.map((k) => {
            return {
              code: k.code,
              name: +k.name,
              selected: k.selected,
            };
          });
        }
      });
    },
    // 我的工作模块配置提交
    handleSubmitMyWorkModule() {
      let tempArr = [];
      this.wordItems.forEach((k) => {
        if (k.selected) {
          tempArr.push(k.code);
        }
      });
      setMyWorkModuleSave(tempArr).then((res) => {
        if (res.result) {
          this.$message.success(res.message);
          this.handleGetWorkStatic();
          this.handleCancelMyWorkModule();
        } else {
          this.$message.warning("操作失败!请联系管理员");
          this.handleCancelMyWorkModule();
        }
      });
    },
    // 我的工作模块配置取消
    handleCancelMyWorkModule() {
      this.showMyWord = false; // 显示我的工作模块
      this.wordItems = []; // 我的工作弹框渲染数组
    },
    // 获取我的工作模块配置弹框数据
    handleGetMyWorkModule() {
      getMyWorkModule().then((res) => {
        if (!res.result) return false;
        this.wordItems = res.result;
        this.showMyWord = true;
      });
    },
    // 页面跳转
    handleJumpPage() {
      this.$router.push({
        path: `/customerResult/${this.Hospitals}`,
        query: { regid: this.chooseCritical.regid },
      });
      this.notification = false;
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
    // 消息提醒个人详情
    handleGetDetails() {
      // 1000006197
      // 1000036345
      getDetails({ regid: this.chooseCritical.regid }).then((res) => {
        this.personalDetails = res.result;

        // marriageitem
        this.marriageList = res.result.marriageitem;
        for (const i in this.marriageList) {
          if (this.marriageList[i].selected == true) {
            this.personalDetails.marriage = this.marriageList[i].name;
          }
        }

        // checktypeitems
        this.checktypeList = res.result.checktypeitems;
        for (const i in this.checktypeList) {
          if (this.checktypeList[i].selected == true) {
            this.personalDetails.checktype = this.checktypeList[i].name;
          }
        }
        // companyitems
        this.companyList = res.result.companyitems;
        for (const i in this.companyList) {
          if (this.companyList[i].selected == true) {
            this.personalDetails.company = this.companyList[i].name;
          }
        }

        // batchitems
        this.batchList = res.result.batchitems;
        for (const i in this.batchList) {
          if (this.batchList[i].selected == true) {
            this.personalDetails.batch = this.batchList[i].name;
          }
        }
        // groupitems
        this.groupList = res.result.groupitems;
        for (const i in this.groupList) {
          if (this.groupList[i].selected == true) {
            this.personalDetails.group = this.groupList[i].name;
          }
        }
        this.notification = true;
      });
    },
    handleNotificaTion() {
      let data = {
        msgBasic: this.msgBasic,
        msgGroup: this.msgGroup,
        msgAbnormal: this.msgAbnormal,
      };
      this.notification = false;
      this.criticalListdia = [];
    },
    handleNotification(item) {
      this.chooseCritical = item;
      this.handleGetDetails();
      getCustomerResultCriticalList({
        regid: item.regid,
      }).then((res) => {
        if (!res.result) return;
        this.criticalListdia = res.result;
      });
    },
    handleGetCriticalvalueList() {
      let data = {
        whereitems: [],
        page: this.cCurrentPage,
        limit: 100000,
      };
      getCriticalvalueList(data).then((res) => {
        if (!res.data) return;
        this.criticalListCount = res.count;
        this.criticalListCount1 = res.count1;
        this.criticalList.push(...res.data);
      });
    },
    handleMoreCritical() {
      if (this.criticalList.length >= this.criticalListCount) {
        this.$message.warning("暂无更多数据!");
        return false;
      }
      this.cCurrentPage++;
      this.handleGetCriticalvalueList();
    },
    // 关闭通知详情回调
    handleCloseBulletin() {
      this.chooseBulletin = undefined;
      this.showBulletin = false;
    },
    // 查看通知详情回调
    handleBulletinDetails(item) {
      this.chooseBulletin = item;
      this.chooseBulletin && (this.showBulletin = true);
    },
    // 通知提醒数据列表回调
    handleGetSysBulletin() {
      getSysBulletin({
        page: 1,
        limit: 100000000,
        key: "",
      }).then((res) => {
        if (res.data) {
          this.bulletinList = res.data;
        } else {
          this.bulletinList = [];
        }
      });
    },
    // 便签删除
    handleNoteDelete(id) {
      this.$confirm("确认删除此便签？")
        .then((_) => {
          this.nodeDelete.push(id);
          setNoteDelete(this.nodeDelete).then((res) => {
            this.$message.success(res.message);
            this.nodeDelete = [];
            this.handleGetNoteList();
            done();
          });
        })
        .catch((_) => {});
    },
    // 打开便签详情
    handleUnfold(index) {
      this.dialogUnfold = true;
      this.noteUnfold = this.noteItem[index];
    },
    // 新增便签
    handlePreservation() {
      let startTime = this.addNote.time;
      let start = this.addNote.Remindertime + " " + startTime;
      this.addNote.Remindertime1 = start;
      this.addNote.Remindertime2 = start;
      setNoteAdd({
        notecategory: "",
        notecaption: this.addNote.worktitle,
        noteexplain: this.addNote.workcontent,
        starttime: this.addNote.Remindertime1,
        deadline: this.addNote.Remindertime2,
      }).then((res) => {
        this.handleGetNoteList();
        this.dialogVisible = false;
      });
    },
    // 新增便签取消按钮
    handleCancel() {
      this.dialogVisible = false;
      this.handleResetNoteForm();
    },
    handleJump(value) {
      value.split("/")[1] && jumpRouteLink(this, value.split("/")[1]);
      if (this.powerModules.includes(value)) {
        this.$router.push({
          path: value,
        });
      } else {
        this.$message.warning("当前暂无权限访问此模块,请联系管理员!");
        return false;
      }
    },

    handleSaveNote() {
      this.$refs["noteForm"].validate((valid) => {
        if (valid) {
          let data = {
            notecode: "",
            notecategory: "",
            notecaption: this.noteForm.title,
            noteexplain: this.noteForm.content,
            starttime: this.noteForm.date[0],
            deadline: this.noteForm.date[1],
          };
          setNoteAdd(data).then((res) => {
            this.$message.success("更新成功!");
            this.handleResetNoteForm();
            this.dialogFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 点击新增便签回调
    handleAddNote() {
      this.dialogFormVisible = true;
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
    // 点击关闭便签回调
    handleCloseNote() {
      this.handleResetNoteForm();
      // this.$refs["noteForm"].resetFields();
      this.dialogFormVisible = false;
    },
    // 重置便签表单对象
    handleResetNoteForm() {
      this.noteForm = {
        date: [],
        title: "",
        content: "",
      }; // 标签表单对象
      this.addNote = {
        // 开始时间
        Remindertime1: "",
        // 结束时间
        Remindertime2: "",
        // 工作标题
        worktitle: "",
        // 工作内容
        workcontent: "",
      };
    },
    // 获取便签列表数据回调
    handleGetNoteList() {
      getNoteList({
        page: 1,
        limit: 100000,
        key: "",
      }).then((res) => {
        this.noteItem = res.data;
      });
    },
    // 获取消息列表数据回调
    handleGetMessageList() {
      getMessageList({
        page: 1,
        limit: 100000,
        key: "",
      }).then((res) => {});
    },
  },

  watch: {},
};
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
</style>
