<template>
  <div class="customer_result">
    <!-- 分诊弹框 -->
    <div class="triage_ejectbox" v-drag v-if="showTriageDia">
      <!-- 头部按钮组 -->
      <div class="top_btn">
        <el-button size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagCall">叫号</el-button>
        <el-button size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagComplete">完成</el-button>
        <el-button size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagSkip">过号</el-button>
        <el-button size="small" type="primary" v-if="triagData.roomstatus == 0" @click="handleTriagClose">停诊</el-button>
        <el-button size="small" type="primary" v-if="triagData.roomstatus == 1" @click="handleTriagOpen">开诊</el-button>
        <el-button size="small" type="primary" @click="handleCloseTriag">关闭</el-button>
      </div>
      <div class="top_btn1">
        <el-button size="small" type="primary" @click="handleTriagSex(1)" v-if="isShowSex == 0">未限制性别</el-button>
        <el-button size="small" type="primary" @click="handleTriagSex(0)" v-if="isShowSex == 1">已限制性别</el-button>
      </div>
      <div class="current_message">
        <el-card class="box-card">
          <div class="cmtitle">当前叫号：</div>
          <!-- {{ currentTriag.checkitem }} -->
          <div class="cmcbox">
            <div class="cmcbox_item">{{ currentTriag.queueno }}</div>
            <div class="cmcbox_item">{{ currentTriag.name }}</div>
            <div class="cmcbox_item">
              {{
                currentTriag.sex == 0
                  ? "未知"
                  : currentTriag.sex == 1
                  ? "男"
                  : currentTriag.sex == 2
                  ? "女"
                  : ""
              }}
            </div>
          </div>
        </el-card>
      </div>
      <div class="eject_table_box">
        <div class="tab_top">
          <el-radio-group v-model="ejectStatus" size="mini">
            <el-radio-button label="待检"></el-radio-button>
            <el-radio-button label="已检"></el-radio-button>
            <el-radio-button label="过号"></el-radio-button>
          </el-radio-group>
          <div class="tab_top_tt">
            记录数：{{
              ejectStatus == "待检"
                ? queuePaiDuiList.length
                : ejectStatus == "已检"
                ? completeList.length
                : guohaoList.length
            }}
          </div>
        </div>
        <!-- 人员表格 -->
        <div class="ejecttable_box">
          <vxe-table ref="ejecttable" class="ejecttable" height="auto" :loading="ejectLoading" highlight-hover-row :data="
              ejectStatus == '待检'
                ? queuePaiDuiList
                : ejectStatus == '已检'
                ? completeList
                : guohaoList
            " :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-config="{ height: 50 }">
            <vxe-table-column field="queueno" title="排队号" show-header-overflow show-overflow="title" width="70px" show-footer-overflow>
              <template slot-scope="scope">
                <el-badge v-if="scope.row.status == 2" value="过" class="item">
                  <span>{{ scope.row.queueno }}</span>
                </el-badge>
                <span v-else>{{ scope.row.queueno }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="姓名" show-header-overflow show-overflow="title" width="90px" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="sex" title="性别" show-header-overflow show-overflow="title" width="80px" show-footer-overflow>
              <template slot-scope="scope">
                <span>{{
                  scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
                }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="regid" title="体检号" show-header-overflow min-width="170px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column v-if="ejectStatus == '待检'" field="name" title="操作" show-header-overflow show-overflow="title" width="60px" show-footer-overflow>
              <template slot-scope="scope">
                <el-link type="primary" @click="handleTriagCall(scope.row)">叫号</el-link>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="tab_btm">
          <div class="tab_btm_tt">诊室：{{ triagData.roomname || "暂无" }}</div>
          <div class="tab_btm_tt">
            用户：{{ triagData.doctorname || triagData.doctorcode }}
          </div>
          <el-link type="danger" @click="handleShowDepart">配置</el-link>
        </div>
      </div>
    </div>
    <!-- 点击配置科室弹框 -->
    <el-dialog title="" class="tedepart_dia" :visible.sync="showDepart" width="40%" :show-close="false" :close-on-click-modal="false">
      <span>
        <div class="tetop">
          <div>检索</div>
          <el-input placeholder="请输入内容" size="mini" v-model="tetopRetrieval" @keyup.enter.native="handleLoadRoomList" clearable>
          </el-input>
        </div>
        <!-- 人员表格 -->
        <div class="tediatable_box">
          <vxe-table ref="tediatable" class="tediatable" height="auto" :loading="ejectLoading" highlight-hover-row :data="tediaTableData" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
            <vxe-table-column field="code" title="诊室编码" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="name" title="诊室名称" show-header-overflow show-overflow="title" show-footer-overflow>
              <template slot-scope="scope">
                <el-link type="primary" @click="handleChooseTediaTableData(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </vxe-table-column>
            <vxe-table-column field="areaname" title="区域名称" show-header-overflow width="150px" show-overflow="title" show-footer-overflow>
            </vxe-table-column>
            <vxe-table-column field="queuename" title="队列名称" show-header-overflow width="150px" show-overflow="title" show-footer-overflow>
            </vxe-table-column>
          </vxe-table>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showDepart = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 点击完成弹出提示弹框 - 分诊 -->
    <el-dialog title="" class="tefinish_dia" :visible.sync="showFinish" width="34%" :show-close="false" :close-on-click-modal="false">
      <span>
        <div class="tetop_userinfo">
          <div class="tetop_item">姓名：{{ currentTriag.name }}</div>
          <div class="tetop_item">
            性别：{{
              currentTriag.sex == 0
                ? "未知"
                : currentTriag.sex == 1
                ? "男"
                : currentTriag.sex == 2
                ? "女"
                : ""
            }}
          </div>
          <div class="tetop_item">体检号：{{ currentTriag.regid }}</div>
        </div>
        <div class="dtmessage">
          <div class="dtm_item">
            <div class="sgb">导诊信息</div>
          </div>
          <div class="dtm_item">
            <div>检查科室：</div>
            <div class="sgb">{{ finishTriag.roomname }}</div>
          </div>
          <div class="dtm_item">
            <div>检查项目：</div>
            <div class="sgb">{{ finishTriag.combineneme }}</div>
          </div>
          <div class="dtm_item">
            <div>队列人数：</div>
            <div class="sgb">{{ finishTriag.queuecount }}人</div>
          </div>
          <div class="dtm_item">
            <div>预计等待：</div>
            <div class="sgb">{{ finishTriag.waittime }}分钟</div>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleNextShowFinish">呼叫下一位</el-button>
        <el-button size="mini" @click="handleCloseShowFinish">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 头部操作控件 -->
    <!-- <sticky :className="'sub-navbar'">

    </sticky> -->
    <div class="pageReg" v-if="!showQuestionnaire">
      <!-- <div class="filter-container">
        <div class="filter-container-in">
          <permission-btn
            moduleName="customerResult"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          ></permission-btn>
        </div>
      </div> -->
      <div class="filter-container">
        <div v-for="(btn, index) of buttons" :key="index">
          <el-button type="primary" plain size="mini" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" :ref="btn.domId" class="filter-item" :loading="saveLoading" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
        </div>
        <el-upload class="upload-demo" name="files" action="" accept=".xls,.xlsx" :show-file-list="false" :auto-upload="false" :on-change="handleChangeUpload" :file-list="fileListEay">
          <el-button type="primary" plain size="mini">视力结果导入</el-button>
        </el-upload>
      </div>
      <div class="messagebasic">
        <!-- 检索条件 -->
        <div class="content_l">
          <div class="head">
            <div class="logo"></div>
            检索条件
          </div>
          <div class="checkup_code">
            <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
              <div class="content">
                <div class="content_item" v-for="item in checkupCodeArr" :key="item.code" @click="handleSelectCondition(item)">
                  {{ item.name }}
                </div>
              </div>
              <el-button type="primary" plain style="padding: 7px 4px; margin-right: 5px" size="mini" slot="reference">{{ condition }}</el-button>
            </el-popover>
            <el-input size="mini" ref="checkupWorkInput" clearable @keyup.enter.native="handleInputWork" v-model="checkupWork" placeholder="请输入内容"></el-input>
            <el-button type="primary" plain style="padding: 7px 4px; margin-left: 5px" size="mini" @click="handleTriageOpen">分诊</el-button>
          </div>
        </div>
        <!-- 基本信息 -->
        <div class="content_r">
          <div class="content_r-in">
            <el-form ref="form" :model="personalForm" label-width="70px">
              <el-row>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="体检号" class="font16">
                    <el-input disabled v-model="personalForm.regid"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="姓名" class="font16 personalFormName">
                    <el-input disabled v-model="personalForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="性别">
                    <el-input disabled v-model="personalForm.sexs"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" class="age" label-width="80px" label="年龄">
                    <el-input disabled type="text" class="age_num" v-model="personalForm.agecn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="收费状态">
                    <el-input disabled v-model="personalForm.chargeflagcn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="婚姻">
                    <el-input disabled v-model="personalForm.marriage"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="体检类型">
                    <el-input disabled v-model="personalForm.checktype"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="联系电话">
                    <el-input disabled v-model="personalForm.telephone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item class="group_inspection" size="mini" label="团检名称" label-width="80px">
                    <el-input disabled v-model="personalForm.company"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="总检状态">
                    <el-input v-model="personalForm.statuscn" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="核对护士">
                    <el-input v-model="personalForm.confirmdoctorname" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="打印状态">
                    <el-input v-model="personalForm.reportprintflagCN" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="5" style="margin-right: 15px; height: 35px">
                <el-form-item size="mini" label="团检批次">
                  <el-input v-model="personalForm.batch"></el-input>
                </el-form-item>
              </el-col> -->
              </el-row>
              <el-row>
                <el-col :span="4" style=" height: 35px">
                  <el-form-item size="mini" label="档案号">
                    <el-input v-model="personalForm.checkno" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style=" height: 35px">
                  <el-form-item class="remark_box" size="mini" label="备注">
                    <el-input v-model="personalForm.departcheckremark" :disabled="summaryForm.conclusionstatus == 1"></el-input>
                    <el-button size="mini" type="primary" @click="handleAlterFields">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- <div class="img_box">
          <div class="photo_box">
            <img :src="avatarImg" :draggable="false" class="avatar" alt="摄像头" />
          </div>
        </div> -->
        </div>
      </div>
      <div class="subject">
        <!-- <div class="bg_white">

      </div> -->
        <!-- 左侧主体内容 -->
        <div class="subject_left">
          <div class="department content_right">
            <el-empty class="department_empty" v-if="departitems.length == 0"></el-empty>
            <div v-if="departitems.length > 0">
              <el-tree ref="rightsTree" style="overflow-x: hidden" :data="departitems" node-key="id" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="true" :default-checked-keys="defaultChecked" @node-click="handlethrottle">
                <span class="custom-tree-node" @dblclick.stop="handleDblClick(node)" style="
                    display: flex;
                    justify-content: center;
                    align-content: center;
                  " :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                  <img v-if="!data.detid" :src="srcFolder" :draggable="false" class="rightstreeimg" />
                  <img v-if="
                      data.isconclusion &&
                      data.conclusionstatus == 0 &&
                      data.exceptresultcount == 0
                    " :src="substatus0" :draggable="false" class="rightstreeimg" />
                  <img v-if="data.isconclusion && data.conclusionstatus == 1" :src="substatus1" :draggable="false" class="rightstreeimg" />
                  <img v-if="data.exceptresultcount > 0" :src="substatus1" :draggable="false" class="rightstreeimg" />
                  <img v-if="!data.isconclusion && data.conclusionstatus == 0" :src="substatus2" :draggable="false" class="rightstreeimg" />
                  <span :class="[
                      data.isconclusion
                        ? data.conclusionstatus == 0
                          ? 'is_blue'
                          : data.conclusionstatus == 1
                          ? 'is_red'
                          : ''
                        : '',
                      data.conclusionstatus == -1 ? 'is_purple' : '',
                      data.combineitems ? 'is_black' : '',
                    ]">{{ node.label }}</span>
                  <span style="color:red" v-if="data.exceptresultcount > 0">*</span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
        <!-- 右侧主体内容 -->
        <div class="subject_right" v-if="!isListenShow">
          <!-- 检查结果及常见结果 -->
          <!-- 左侧检查结果 -->
          <div class="inspect_result">
            <!-- 检查结果 -->
            <!-- <div
              class="head"
              style="
                background-color: #f6f7fc;
                margin: 0 10px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
              "
            >
              <div class="head-l"></div>
              <div style="font-size: 16px; font-weight: 600; color: #000">
                检查结果
              </div>
            </div> -->
            <div class="project" :style="configHeight[0]?`height:${configHeight[0]}%`:''">
                       
              <!-- 项目盒子 -->
              <div class="project_box">
                <!-- 空状态 -->
                <el-empty v-if="!chooseDepart" description="暂无数据"></el-empty>
                <div v-if="chooseDepart" class="chooseDepart">
                  <!-- dom 1 -->
                  <div class="project_dom1" v-if="chooseDepart.viewgroup == '1'">
                    <EasyTable :loading="loading" height="100%" class="table_dom1" :data="chooseDepart.items" :tableOptions="checkoutdom1Options" :radio-config="{ rowClick: true }" :row-style="rowstyle" @row-dblclick="handleCheckEcharts" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <!-- <div
                      :class="[item.allowinput ? 'box_input' : 'box_item']"
                      v-for="(item, index) in chooseDepart.items"
                      :key="index"
                    >
                      <div class="project_item" v-if="!item.allowinput">
                        <div class="title">
                          <span v-if="item.mustflag == 1" style="color: red"
                            >*</span
                          >{{ item.itemname }}：
                        </div>
                        <el-checkbox-group
                          v-model="checkList"
                          @change="handleCheckbox(item)"
                        >
                          <el-checkbox
                            v-for="(item, index) in item.itemvalueitems"
                            :key="index"
                            :label="item.vueid"
                            >{{ item.conclusion }}</el-checkbox
                          >
                        </el-checkbox-group>
                      </div>
                      <div class="project_input" v-if="item.allowinput">
                        <div class="input_box">
                          <div class="title">
                            <span v-if="item.mustflag == 1" style="color: red"
                              >*</span
                            >
                            {{ item.itemname }}
                          </div>
                          <span>：</span>
                          <el-input
                            :type="item.resuletype == 1 ? 'number' : 'text'"
                            size="mini"
                            @keyup.enter.native="handleInputdom1(item)"
                            @blur="handleInputdom1(item)"
                            v-model="item.result"
                            @focus="handleFocusProject(item)"
                            :placeholder="
                              item.resuletype == 1
                                ? '请输入数值'
                                : '请输入任意值'
                            "
                            clearable
                            @clear="handleInputdom1(item)"
                          ></el-input>
                        </div>
                      </div>
                    </div> -->
                  </div>
                  <!-- dom 2 -->
                  <div v-if="chooseDepart.viewgroup == '2'" class="project_dom2">
                    <EasyTable :loading="loading" height="100%" class="table_100" :data="chooseDepart.items" :tableOptions="checkoutOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" @row-dblclick="handleCheckEcharts" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                  <div v-if="chooseDepart.viewgroup == '3' && chooseDepart.viewgroupto2 == 1" class="project_dom2">
                    <EasyTable :loading="loading" height="100%" class="table_100" :data="chooseDepart.items" :tableOptions="checkoutOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" @row-dblclick="handleCheckEcharts" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                  <div v-if="chooseDepart.viewgroup == '3' && chooseDepart.viewgroupto2 == 0" class="project_dom3">
                    <!-- dom 3 -->
                    <EasyTable :loading="loading" class="project_dom3_table" height="100%" :data="chooseDepart.items" :tableOptions="doMainOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                  </div>
                </div>
              </div>
            </div>
            <!-- 小结 -->
            <div class="summary" :style="configHeight[1]?`height:${configHeight[1]}%`:''">
              <!-- 遮罩层 -->
              <div class="mask" v-if="!chooseDepart || personalForm.confirmdoctorcode"></div>
              <!-- 小结内容 富文本 -->
              <div class="summary_content" style="height:calc(100% - 90px)">
                <div class="summary_btn">
                  <div class="fruit_btn">
                    <!-- <el-radio-group class="nowrap" @change="handleFruitChange" v-model="fruit" size="small" fill="#2a85ea">
                      <el-radio-button label="conclusion">小结</el-radio-button>
                      <el-radio-button label="specialistadvice">专科建议</el-radio-button>
                    </el-radio-group> -->
                    <el-button-group class="nowrap">
                      <el-button size="mini" plain type="primary" @click="(fruit = 'conclusion'), handleFruitChange()">小结</el-button>
                      <el-button size="mini" plain type="primary" @click="
                          (fruit = 'specialistadvice'), handleFruitChange()
                        ">专家建议</el-button>
                    </el-button-group>
                    <el-link class="nowrap" type="primary" v-if="fruit == 'specialistadvice'" @click="handleAddSpecialis">新增建议</el-link>
                    <el-link class="nowrap" type="primary" style="font-size: 14px" @click="handleShowImageInfoFlag">图像信息</el-link>
                    <el-link class="nowrap" type="primary" @click="handleRecommendOpen">智能推荐</el-link>
                    <el-button-group class="nowrap">
                      <el-button size="mini" plain type="primary" @click="handleGetDefaultConclusion">默认小结</el-button>
                      <el-button size="mini" plain type="primary" @click="handleGetGenerateConclusion">生成小结</el-button>
                    </el-button-group>
                    <el-button type="primary" size="mini" @click="handleImageTextPrint">打印报告</el-button>
                  </div>
                  <div class="entry_btn" style="width:400px">
                    <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="handleAddConclusion">增加</el-button>
                    <el-button type="primary" plain size="mini" icon="el-icon-delete" @click="handleDelConclusion">删除</el-button>
                  </div>
                </div>
                <div class="summary-box" v-if="!imageInfoFlag">
                  <!-- 富文本 -->
                  <div class="tinymce_box" style="z-index: 20;">
                    <!-- <vue-tinymce
                      v-if="fruit == 'conclusion'"
                      :key="tinymceFlag1"
                      v-model="conclusion"
                      :setting="setting"
                    />
                    <vue-tinymce
                      v-if="fruit == 'specialistadvice'"
                      :key="tinymceFlag2"
                      v-model="specialistadvice"
                      :setting="setting"
                    /> -->
                    <el-input class="conc_text" :disabled="!chooseDepart || personalForm.confirmdoctorcode != null" :rows="5" type="textarea" resize="none" v-if="fruit == 'conclusion'" v-model="conclusion"></el-input>
                    <el-input class="conc_text" :disabled="!chooseDepart || personalForm.confirmdoctorcode != null" :rows="5" type="textarea" resize="none" v-if="fruit == 'specialistadvice'" v-model="specialistadvice"></el-input>
                  </div>
                  <!-- 表格结论词 -->
                  <div class="summary_entry" style="width:400px">
                    <EasyTable :loading="loading" class="entry_table" height="100%" :data="entryData" :tableOptions="entryOptions" :radio-config="{ rowClick: true }" @row-click="handleChooseEntry" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                  </div>
                </div>
                <!-- 文件上传列表 -->
                <div class="summary-box" v-else>
                  <el-upload class="photo_wall" name="files" action list-type="picture-card" accept=".jpg,.jpeg,.png,.pdf" :file-list="fileList" :auto-upload="false" :on-change="handleOnPpload">
                    <i class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{ file }" @mouseenter="showremoveid = file.url" @mouseleave="showremoveid = ''">
                      <el-image style="width: 100%; height: 100%" :src="file.url" :preview-src-list="previewImageList" title="点击查看大图预览"></el-image>
                      <div v-if="showremoveid == file.url" class="removeimg">
                        <i @click="handleRemove(file)" class="el-icon-delete"></i>
                      </div>
                    </div>
                  </el-upload>
                  <!-- <el-dialog :visible.sync="dialogVisible">
                    <el-image
                      width="100%"
                      :src="dialogImageUrl"
                      :preview-src-list="previewImageList"
                      title="点击查看大图预览"
                    ></el-image>
                  </el-dialog> -->
                </div>
              </div>
              <!-- 小结内容 表单信息 -->
              <div class="summary_form" style="height: 90px;">
                <el-form ref="form" :model="summaryForm" label-width="80px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item class="doctorcode_box" size="mini" label="检查医生">
                        <el-select :disabled="showBigMask || summaryForm.conclusionstatus == 1" v-model="summaryForm.doctorcode" clearable filterable allow-create @change="handleChangeDoctor">
                          <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                        <el-checkbox :disabled="showBigMask" v-model="lockDoctorcode" :true-label="1" :false-label="0" @change="handleLockDoctorcode">锁定</el-checkbox>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item size="mini" label="录入时间">
                        <el-date-picker :disabled="showBigMask || summaryForm.conclusionstatus == 1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="录入时间" v-model="summaryForm.inputdate" style="width: 100%"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item size="mini" label="录入者">
                        <el-input v-model="summaryForm.operatorname" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item size="mini" label="审核医生">
                        <el-input v-model="summaryForm.checkname" disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item size="mini" label="审核时间">
                        <el-date-picker :disabled="showBigMask || summaryForm.conclusionstatus == 1" type="datetime" placeholder="审核时间" v-model="summaryForm.checkdate" style="width: 100%"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item size="mini" label="状态">
                        <el-input v-model="summaryForm.statusName" disabled></el-input>

                        <!-- <el-select disabled v-model="summaryForm.conclusionstatus" @change="handleChangeDoctor">
                          <el-option :label="'已登记'" :value="-1"></el-option>
                          <el-option :label="'已保存'" :value="0"></el-option>
                          <el-option :label="'已审核'" :value="1"></el-option>
                        </el-select> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </div>
          <!-- 右侧选项表格 -->
          <div class="common_result">
            <!-- <div class="mask_big" v-if="showBigMask"></div> -->
            <div class="table_box_c">
              <el-radio-group size="mini" :disabled="showTableDisabled" v-model="showTableFlag" @change="handleTablesChange" style="padding: 10px">
                <el-radio-button label="commonResult">常见结果</el-radio-button>
                <el-radio-button label="historyResult">历史结果</el-radio-button>
                <el-radio-button label="allInspections">所有检查</el-radio-button>
                <el-radio-button label="healthRecords">健康档案</el-radio-button>
              </el-radio-group>
              <!-- 表格展示数据 -->
              <div class="table_box">
                <!-- 常见结果 -->
                <!-- 常见结果 -->
                <el-input v-if="showTableFlag == 'commonResult'" placeholder="请输入关键字" style="margin-bottom: 6px" size="mini" v-model="searchCommon" clearable>
                </el-input>
                <EasyTable v-if="showTableFlag == 'commonResult'" :loading="loading" class="common_table" height="100%" table-layout="auto" :data="commonDataSS" :tableOptions="commonOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCommonDbclick" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                <!-- 历史结果 historyData -->
                <div class="history_box" v-if="showTableFlag == 'historyResult'">
                  <div v-for="(item, index) in historyData" :key="index">
                    <div class="history_head">
                      <div class="history_time">
                        检查时间:{{ item.checkdate }}
                      </div>
                      <div class="history_value">{{ item.combinename }}</div>
                    </div>
                    <EasyTable :loading="loading" class="history_table" height="100%" :data="item.items" :tableOptions="historyOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                  </div>
                </div>
                <!-- 所有检查 -->
                <EasyTable v-if="showTableFlag == 'allInspections'" :loading="loading" class="allInspect_table" height="100%" :data="allInspectData" :tableOptions="allInspectOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleAllInspectDbclick" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                <!-- 所有检查详情弹框 -->
                <el-dialog :visible.sync="showDbSpect" width="30%" class="dbSpect_dialog" @close="handleCloseDbSpect">
                  <EasyTable class="dbSpect_table" height="200px" :data="dbSpectData" :tableOptions="dbSpectOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                  <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="handleCloseDbSpect">取 消</el-button>
                  </span>
                </el-dialog>
                <!-- 健康档案 -->
                <EasyTable v-if="showTableFlag == 'healthRecords'" :loading="loading" class="healthRecords_table" height="100%" :data="healthRecordsData" :tableOptions="healthRecordsOptions" :radio-config="{ rowClick: true }" @row-click="handleClickHealthRecords" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                <EasyTable v-if="showTableFlag == 'healthRecords'" :loading="loading" class="healthDt_table" height="100%" :data="healthDtData" :tableOptions="healthDtOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleAllInspectDbclick" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
              </div>
            </div>
          </div>
          <!-- 富文本框 -->
          <!-- <vue-tinymce v-model="content" :setting="setting" /> -->
        </div>
        <!-- 右侧主体内容-听力测试 -->
        <div class="subject_right_listening" v-else>
          <el-radio-group v-model="resultFlag" size="small" @input="handleChangeResultFlag">
            <el-radio-button label="当次结果">当次结果</el-radio-button>
            <el-radio-button v-for="item,index in listenHistory" :key="index" :label="item.regid">历史结果({{item.checkdate}})</el-radio-button>
          </el-radio-group>
          <div class="small_title">
            <el-link :type="nowdata=='实测数据'?'primary':''" @click="handleMeasured">实测数据</el-link>
            <el-link :type="nowdata=='校正数据'?'primary':''" @click="handleCorrection">校正数据</el-link>
          </div>
          <div class="listening_box" v-show="nowdata=='实测数据'">
            <el-row class="listening_box_top">
              <el-col :span="10" class="listening_top_left">
                <el-row class="ear_box">
                  <el-col :span="12" class="right_ear">
                    <div class="ear_title et_red">右</div>
                    <el-row class="ear_title_small">
                      <el-col :span="3" class="ets_tm">1</el-col>
                      <el-col :span="5">气导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                      <el-col :span="3">无应答</el-col>
                      <el-col :span="4">骨导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                      <el-col :span="3">无应答</el-col>
                    </el-row>
                    <el-row class="ear_title_item" v-for="item,index in listenItems" :key="index">
                      <el-col :span="3" :class="['500','1K','2K','3K','4K','6K'].includes(item.frequency)?'ets_red':''">{{item.frequency}}</el-col>
                      <el-col :span="5"><el-input v-model="item.rightAirValue" :disabled="resultFlag!='当次结果'" size="mini" clearable @blur="handleBlurCalcListenAvg('right')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.rightAirMask" :disabled="!item.rightAirValue || resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateRightEarChart"></el-checkbox></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.rightAirResponseStatus" :disabled="resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleRightAirResponseCheck(item.rightAirResponseStatus,item)"></el-checkbox></el-col>
                      <el-col :span="4"><el-input v-model="item.rightBoneValue" :disabled="resultFlag!='当次结果'" size="mini" clearable @blur="handleBlurCalcListenAvg('right')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.rightBoneMask" :disabled="!item.rightBoneValue || resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateRightEarChart"></el-checkbox></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.rightBoneResponseStatus" :disabled="resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateRightEarChart"></el-checkbox></el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12" class="left_ear">
                    <div class="ear_title et_blue">左</div>
                    <el-row class="ear_title_small">
                      <el-col :span="3" class="ets_tm">1</el-col>
                      <el-col :span="5">气导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                      <el-col :span="3">无应答</el-col>
                      <el-col :span="4">骨导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                      <el-col :span="3">无应答</el-col>
                    </el-row>
                    <el-row class="ear_title_item" v-for="item,index in listenItems" :key="index">
                      <el-col :span="3" :class="['500','1K','2K','3K','4K','6K'].includes(item.frequency)?'ets_red':''">{{item.frequency}}</el-col>
                      <el-col :span="5"><el-input v-model="item.leftAirValue" :disabled="resultFlag!='当次结果'" size="mini" clearable @blur="handleBlurCalcListenAvg('left')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.leftAirMask" :disabled="!item.leftAirValue  || resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateLeftEarChart"></el-checkbox></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.leftAirResponseStatus" :disabled="resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateLeftEarChart"></el-checkbox></el-col>
                      <el-col :span="4"><el-input v-model="item.leftBoneValue" :disabled="resultFlag!='当次结果'" size="mini" clearable @blur="handleBlurCalcListenAvg('left')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.leftBoneMask" :disabled="!item.leftBoneValue  || resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateLeftEarChart"></el-checkbox></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.leftBoneResponseStatus" :disabled="resultFlag!='当次结果'" :true-label="1" :false-label="0" @change="handleCreateLeftEarChart"></el-checkbox></el-col>
                    </el-row>

                  </el-col>
                </el-row>
                <div class="total_ear">
                  <div class="te_title">
                    <div></div>
                    <div>气导</div>
                    <div>骨导</div>
                  </div>
                  <div class="te_item" v-for="item,index in listenAvgItems" :key="index">
                    <div class="tei_title" :class="index==1||index==2?'tei_red':index==3||index==4?'tei_blue':''">{{item.name}}</div>
                    <div class="tei_box">
                      <el-input :class="index==0 && item.airAvg >= 40?'elc_red':[2,4].includes(index) && item.airAvg >= 26?'elc_red':''" disabled v-model="item.airAvg" size="mini" clearable>
                      </el-input>
                      <el-checkbox v-model="item.airAvgSelect" :true-label="1" :false-label="0" :disabled="!item.airAvg || resultFlag!='当次结果'" @change="handleGenerateConclusion"></el-checkbox>
                    </div>
                    <div class="tei_box">
                      <el-input :class="index==0 && item.boneAvg >= 40?'elc_red':[2,4].includes(index) && item.boneAvg >= 26?'elc_red':''" v-model="item.boneAvg" disabled size="mini" clearable>
                      </el-input>
                      <el-checkbox v-model="item.boneAvgSelect" :true-label="1" :false-label="0" :disabled="!item.boneAvg || resultFlag!='当次结果'" @change="handleGenerateConclusion"></el-checkbox>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="14" class="listening_top_right">
                <div class="right_chart_box" v-if="showChartBox">
                  <div class="rcb_title">右</div>
                  <div id="rightEarChart" ref="rightEarChart" class="rightEarChart"></div>
                  <div class="explanation">
                    <div class="ex_box">
                      <div class="exb_title txt_red">气导(AC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/rightAir1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/rightAir2.png')" alt="" draggable="none">
                      </div>
                    </div>
                    <div class="ex_box">
                      <div class="exb_title txt_red">骨导(BC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/rightBone1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/rightBone2.png')" alt="" draggable="none">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="left_chart_box" v-if="showChartBox">
                  <div class="rcb_title_blue">左</div>
                  <div id="leftEarChart" ref="leftEarChart" class="leftEarChart"></div>
                  <div class="explanation">
                    <div class="ex_box">
                      <div class="exb_title txt_blue">气导(AC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/leftAir1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/leftAir2.png')" alt="" draggable="none">
                      </div>
                    </div>
                    <div class="ex_box">
                      <div class="exb_title txt_blue">骨导(BC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/leftBone1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/leftBone2.png')" alt="" draggable="none">
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="listening_box_bottom">
              <el-row class="lbb_top">
                <el-col :span="12" class="mr5"><el-tag size="medium" style="width:100px;text-align: center;">小结</el-tag></el-col>
                <el-col :span="6" class="mr5"><el-tag size="medium" style="width:100px;text-align: center;">结论字典</el-tag></el-col>
                <el-col :span="6"> <el-button type="primary" plain size="mini" icon="el-icon-plus" :disabled="resultFlag!='当次结果'" @click="handleAddConclusion">增加</el-button>
                  <el-button type="primary" plain size="mini" icon="el-icon-delete" :disabled="resultFlag!='当次结果'" @click="handleDelConclusion">删除</el-button></el-col>
              </el-row>
              <el-row class="lbb_bottom">
                <el-col :span="12" class="lbb_conclusion mr5">
                  <el-input type="textarea" resize="none" v-model="conclusion" :disabled="resultFlag!='当次结果'"></el-input>
                </el-col>
                <el-col :span="6" class="lbb_common mr5">
                  <EasyTable :loading="loading" class="common_table" height="100%" table-layout="auto" :data="commonDataSS" :tableOptions="commonOptions" :radio-config="{ rowClick: true }" @row-dblclick="resultFlag=='当次结果' && handleCommonConclusion()" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                </el-col>
                <el-col :span="6" class="lbb_entry">
                  <EasyTable :loading="loading" class="entry_table" height="100%" :data="entryData" :tableOptions="entryOptions" :radio-config="{ rowClick: true }" @row-click="handleChooseEntry" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                </el-col>
              </el-row>
            </div>
            <div class="summary_form" style="height: 90px;">
              <el-form ref="form" :model="summaryForm" label-width="80px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item class="doctorcode_box" size="mini" label="检查医生">
                      <el-select :disabled="showBigMask || summaryForm.conclusionstatus == 1" v-model="summaryForm.doctorcode" clearable filterable allow-create @change="handleChangeDoctor">
                        <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                      <el-checkbox :disabled="showBigMask" v-model="lockDoctorcode" :true-label="1" :false-label="0" @change="handleLockDoctorcode">锁定</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="录入时间">
                      <el-date-picker :disabled="showBigMask || summaryForm.conclusionstatus == 1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="录入时间" v-model="summaryForm.inputdate" style="width: 100%"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="录入者">
                      <el-input v-model="summaryForm.operatorname" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="mini" label="审核医生">
                      <el-input v-model="summaryForm.checkname" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="审核时间">
                      <el-date-picker :disabled="showBigMask || summaryForm.conclusionstatus == 1" type="datetime" placeholder="审核时间" v-model="summaryForm.checkdate" style="width: 100%"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="状态">
                      <el-input v-model="summaryForm.statusName" disabled></el-input>

                      <!-- <el-select disabled v-model="summaryForm.conclusionstatus" @change="handleChangeDoctor">
                          <el-option :label="'已登记'" :value="-1"></el-option>
                          <el-option :label="'已保存'" :value="0"></el-option>
                          <el-option :label="'已审核'" :value="1"></el-option>
                        </el-select> -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="listening_box" v-show="nowdata=='校正数据'">
            <el-row class="listening_box_top">
              <el-col :span="7" class="listening_top_left">
                <el-row class="ear_box">
                  <el-col :span="12" class="right_ear">
                    <div class="ear_title et_red">右</div>
                    <el-row class="ear_title_small">
                      <el-col :span="4" class="ets_tm">1</el-col>
                      <el-col :span="7">气导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                      <el-col :span="7">骨导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                    </el-row>
                    <el-row class="ear_title_item" v-for="item,index in listenItemsCorrect" :key="index">
                      <el-col :span="4" :class="['500','1K','2K','3K','4K','6K'].includes(item.frequency)?'ets_red':''">{{item.frequency}}</el-col>
                      <el-col :span="7"><el-input v-model="item.correctRightAirValue" disabled size="mini" clearable @blur="handleBlurCalcListenAvg('right')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.rightAirMask" disabled :true-label="1" :false-label="0" @change="handleCreateRightEarChart"></el-checkbox></el-col>
                      <el-col :span="7"><el-input v-model="item.correctRightBoneValue" disabled size="mini" clearable @blur="handleBlurCalcListenAvg('right')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.rightBoneMask" disabled :true-label="1" :false-label="0" @change="handleCreateRightEarChart"></el-checkbox></el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12" class="left_ear">
                    <div class="ear_title et_blue">左</div>
                    <el-row class="ear_title_small">
                      <el-col :span="4" class="ets_tm">1</el-col>
                      <el-col :span="7">气导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                      <el-col :span="7">骨导</el-col>
                      <el-col :span="3">掩蔽</el-col>
                    </el-row>
                    <el-row class="ear_title_item" v-for="item,index in listenItemsCorrect" :key="index">
                      <el-col :span="4" :class="['500','1K','2K','3K','4K','6K'].includes(item.frequency)?'ets_red':''">{{item.frequency}}</el-col>
                      <el-col :span="7"><el-input v-model="item.correctLeftAirValue" disabled size="mini" clearable @blur="handleBlurCalcListenAvg('left')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.leftAirMask" disabled :true-label="1" :false-label="0" @change="handleCreateLeftEarChart"></el-checkbox></el-col>
                      <el-col :span="7"><el-input v-model="item.correctLeftBoneValue" disabled size="mini" clearable @blur="handleBlurCalcListenAvg('left')">
                        </el-input></el-col>
                      <el-col :span="3"><el-checkbox v-model="item.leftBoneMask" disabled :true-label="1" :false-label="0" @change="handleCreateLeftEarChart"></el-checkbox></el-col>
                    </el-row>

                  </el-col>
                </el-row>
                <div class="total_ear">
                  <div class="te_title">
                    <div></div>
                    <div>气导</div>
                    <div>骨导</div>
                  </div>
                  <div class="te_item" v-for="item,index in listenAvgItems" :key="index">
                    <div class="tei_title" :class="index==1||index==2?'tei_red':index==3||index==4?'tei_blue':''">{{item.name}}</div>
                    <div class="tei_box">
                      <el-input :class="index==0 && item.airAvg >= 40?'elc_red':[2,4].includes(index) && item.airAvg >= 26?'elc_red':''" disabled v-model="item.airAvg" size="mini" clearable>
                      </el-input>
                      <el-checkbox v-model="item.airAvgSelect" :true-label="1" :false-label="0" disabled @change="handleGenerateConclusion"></el-checkbox>
                    </div>
                    <div class="tei_box"> <el-input :class="index==0 && item.boneAvg >= 40?'elc_red':[2,4].includes(index) && item.boneAvg >= 26?'elc_red':''" v-model="item.boneAvg" size="mini" disabled clearable>
                      </el-input>
                      <el-checkbox v-model="item.boneAvgSelect" :true-label="1" :false-label="0" disabled @change="handleGenerateConclusion"></el-checkbox>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="17" class="listening_top_right">
                <div class="right_chart_box" v-if="showChartBox">
                  <div class="rcb_title">右</div>
                  <div id="correctRightEarChart" ref="correctRightEarChart" class="rightEarChart"></div>
                  <div class="explanation">
                    <div class="ex_box">
                      <div class="exb_title txt_red">气导(AC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/rightAir1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/rightAir2.png')" alt="" draggable="none">
                      </div>
                    </div>
                    <div class="ex_box">
                      <div class="exb_title txt_red">骨导(BC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/rightBone1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/rightBone2.png')" alt="" draggable="none">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="left_chart_box" v-if="showChartBox">
                  <div class="rcb_title_blue">左</div>
                  <div id="correctLeftEarChart" ref="correctLeftEarChart" class="leftEarChart"></div>
                  <div class="explanation">
                    <div class="ex_box">
                      <div class="exb_title txt_blue">气导(AC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/leftAir1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/leftAir2.png')" alt="" draggable="none">
                      </div>
                    </div>
                    <div class="ex_box">
                      <div class="exb_title txt_blue">骨导(BC)</div>
                      <div class="exb_item">
                        <div class="exb_txt">未掩</div>
                        <img :src="require('@/assets/leftBone1.png')" alt="" draggable="none">
                      </div>
                      <div class="exb_item">
                        <div class="exb_txt">掩蔽</div>
                        <img :src="require('@/assets/leftBone2.png')" alt="" draggable="none">
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="listening_box_bottom">
              <el-row class="lbb_top">
                <el-col :span="12" class="mr5"><el-tag size="medium" style="width:100px;text-align: center;">小结</el-tag></el-col>
                <el-col :span="6" class="mr5"><el-tag size="medium" style="width:100px;text-align: center;">结论字典</el-tag></el-col>
                <el-col :span="6"> <el-button type="primary" plain size="mini" disabled icon="el-icon-plus" @click="handleAddConclusion">增加</el-button>
                  <el-button type="primary" plain size="mini" icon="el-icon-delete" disabled @click="handleDelConclusion">删除</el-button></el-col>
              </el-row>
              <el-row class="lbb_bottom">
                <el-col :span="12" class="lbb_conclusion mr5">
                  <el-input type="textarea" disabled resize="none" v-model="conclusion"></el-input>
                </el-col>
                <el-col :span="6" class="lbb_common mr5">
                  <EasyTable :loading="loading" class="common_table" height="100%" table-layout="auto" :data="commonDataSS" :tableOptions="commonOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                </el-col>
                <el-col :span="6" class="lbb_entry">
                  <EasyTable :loading="loading" class="entry_table" height="100%" :data="entryData" :tableOptions="entryOptions" :radio-config="{ rowClick: true }" @row-click="handleChooseEntry" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                </el-col>
              </el-row>
            </div>
            <div class="summary_form" style="height: 90px;">
              <el-form ref="form" :model="summaryForm" label-width="80px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item class="doctorcode_box" size="mini" label="检查医生">
                      <el-select :disabled="showBigMask || summaryForm.conclusionstatus == 1" v-model="summaryForm.doctorcode" clearable filterable allow-create @change="handleChangeDoctor">
                        <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                      <el-checkbox :disabled="showBigMask" v-model="lockDoctorcode" :true-label="1" :false-label="0" @change="handleLockDoctorcode">锁定</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="录入时间">
                      <el-date-picker :disabled="showBigMask || summaryForm.conclusionstatus == 1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="录入时间" v-model="summaryForm.inputdate" style="width: 100%"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="录入者">
                      <el-input v-model="summaryForm.operatorname" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="mini" label="审核医生">
                      <el-input v-model="summaryForm.checkname" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="审核时间">
                      <el-date-picker :disabled="showBigMask || summaryForm.conclusionstatus == 1" type="datetime" placeholder="审核时间" v-model="summaryForm.checkdate" style="width: 100%"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="mini" label="状态">
                      <el-input v-model="summaryForm.statusName" disabled></el-input>

                      <!-- <el-select disabled v-model="summaryForm.conclusionstatus" @change="handleChangeDoctor">
                          <el-option :label="'已登记'" :value="-1"></el-option>
                          <el-option :label="'已保存'" :value="0"></el-option>
                          <el-option :label="'已审核'" :value="1"></el-option>
                        </el-select> -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 结论词弹出层 -->
      <el-dialog title="用户选择" :close-on-click-modal="false" class="conclusion" :visible.sync="showConclusion" width="50%" @close="handleConclusionCancel">
        <!-- 内容区域 -->
        <el-row class="conclusion_content">
          <!-- 左侧树形结构 -->
          <el-col :span="9" class="tree_box">
            <div class="search_box">
              <div class="search_title">检索：</div>
              <el-input size="mini" clearable placeholder="输入关键字进行过滤" v-model="conclusionSearch">
              </el-input>
            </div>
            <el-scrollbar style="height: calc(100% - 38px)">
              <el-tree class="onclusion_tree" :data="conclusionData" :props="conclusionProps" :default-checked-keys="clusionCheck" :filter-node-method="handleFilterNode" ref="conclusionTree" @node-click="handleNodeConclusion">
                <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                  <span>
                    <i :class="[
                        data.isFile
                          ? 'el-icon-folder'
                          : 'el-icon-folder-opened',
                      ]"></i>&nbsp;{{ node.label }}
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </el-col>
          <el-col :span="15" class="concl_form">
            <el-form ref="form" :model="conclusionForm" label-width="80px">
              <el-form-item size="mini" label="结论名称">
                <el-input v-model="conclusionForm.name"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="ICD编码">
                <el-input :disabled="isCustomize" v-model="conclusionForm.icdcode"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="小结">
                <el-input :disabled="isCustomize" v-model="conclusionForm.name"></el-input>
              </el-form-item>
              <el-form-item class="conclEditor_box" size="mini" label="健康建议">
                <!-- <quill-editor class="concl_editor" v-model="conclusionForm.healthadvice" ref="conclEditor" :options="editorOption" /> -->
                <el-input class="conclEditor_input" type="textarea" resize="none" v-model="conclusionForm.healthadvice"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 脚部按钮组 -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain size="mini" @click="handleConclusionSubmit">确 定</el-button>
          <el-button type="primary" plain size="mini" @click="handleConclusionCancel">关 闭</el-button>
          <el-button type="primary" plain size="mini" @click="handleAddCustomizeConclusion">新增自定义结论词</el-button>
          <el-button type="primary" plain size="mini" @click="handleCustomizeConclusionCancel">保存自定义结论词</el-button>
        </div>
      </el-dialog>
      <!-- 新增专科建议弹出层 -->
      <el-dialog :show-close="false" :close-on-click-modal="false" class="specialis" :visible.sync="showSpecialis" width="40%" @close="handleSpecialisCancel">
        <!-- 按钮组 -->
        <div class="btn_group">
          <el-button size="mini" type="primary" @click="handlePlusSpecialis">新增</el-button>
          <el-button size="mini" type="danger" @click="handleDelSpecialis">删除</el-button>
          <el-button size="mini" type="warning" @click="handleEditSpecialis">编辑</el-button>
          <el-button size="mini" type="success" @click="handleConfirmSpecialis">确认</el-button>
          <!-- <el-button size="mini" type="primary" @click="handleSubmitSpecialis">保存</el-button> -->
          <el-button size="mini" type="danger" @click="handleSpecialisCancel">关闭</el-button>
        </div>
        <EasyTable class="specialis_table" height="100%" :data="specialisData" :tableOptions="specialisOptions" :radio-config="{ rowClick: true }" @row-click="handleChooseSpecialis" />
        <!-- 建议输入框文本域 -->
        <!-- <el-input v-if="chooseSpecialis" class="spec_text" :disabled="editSpecialis" type="textarea" resize="none" v-model="chooseSpecialis.healthadvice"></el-input>
      <el-input v-if="!chooseSpecialis" class="spec_text" disabled type="textarea" resize="none" v-model="chooseSpecialis"></el-input> -->
      </el-dialog>
      <!-- 新增专科建议弹出层 新增/编辑二次弹框 -->
      <el-dialog class="AddOrEdit" :show-close="true" :close-on-click-modal="false" :visible.sync="showAddOrEdit" top="14%" width="30%" @close="handleAddOrEditClose">
        <el-form ref="form" label-width="80px">
          <el-form-item size="mini" label="关键字">
            <el-input v-model="dKeyword"></el-input>
          </el-form-item>
          <el-form-item class="proposal" size="mini" label="建议">
            <el-input class="spec_text" type="textarea" resize="none" v-model="dProposal"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleAddOrEditClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitAddOrEdit">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 推荐弹出层 -->
      <el-dialog :show-close="false" :close-on-click-modal="false" class="recommend" :visible.sync="showRecommend" width="50%" @close="handleRecommendCancel">
        <!-- 按钮组 -->
        <div class="btn_group">
          <div class="title">智能推荐</div>
          <div>
            <el-button size="mini" type="primary" @click="handleAddSummary">添加小结</el-button>
            <el-button size="mini" type="success" @click="handleAddProposal">添加建议</el-button>
            <el-button size="mini" type="danger" @click="handleRecommendCancel">关闭</el-button>
          </div>
        </div>
        <EasyTable class="recommend_table" height="100%" :data="recommendData" :tableOptions="recommendOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleChooseRecommend" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
      </el-dialog>
      <!-- 结果对比数据弹出层 -->
      <el-dialog :close-on-click-modal="false" class="echarts_dialog" :visible.sync="showEcharts" width="50%" @opened="handleShowEchartsOpened" @close="handleEchartsCancel">
        <div id="myChart" ref="myChart" class="myChart"></div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleEchartsCancel">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 分诊选中人员弹框 -->
      <el-dialog :close-on-click-modal="false" class="triage_dialog" :visible.sync="showTriage" width="50%" @close="handleTriageCancel">
        <div class="personnel">
          <div class="personnel_btn">
            <div class="time_box">
              <div class="time_title">登记时间:</div>
              <!-- <el-date-picker
                v-model="triageTime"
                size="mini"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker> -->
              <el-date-picker v-model="triageTime" type="datetimerange" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <el-radio-group @change="personnelBtn" v-model="radios" size="mini" fill="#2a85ea">
              <el-radio-button label="0">待检</el-radio-button>
              <el-radio-button label="1">已检</el-radio-button>
              <el-radio-button label="2">未检</el-radio-button>
            </el-radio-group>
          </div>
          <div class="personnel_Table">
            <!-- <EasyTable
              height="100%"
              class="personnel_con_table"
              :loading="loading"
              :data="personnelList"
              :tableOptions="personnelOptions"
              :radio-config="{ rowClick: true }"
              @row-dblclick="handlePersonnelCheck"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :row-style="{ height: '32px' }"
              :cell-style="{ padding: '0' }" 
            />-->
            <vxe-table height="auto" class="personnel_con_table" border="inner" show-overflow :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" @cell-dblclick="handlePersonnelCheck" :data="personnelListData" :sort-config="{ trigger: 'cell' }">
              <vxe-table-column field="regid" title="体检号" min-width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="name" title="姓名" min-width="110px" show-overflow></vxe-table-column>
              <vxe-table-column field="sex" min-width="110px" title="性别" show-overflow>
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
              <vxe-table-column field="personalflag" min-width="100px" title="类型" show-overflow>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.personalflag == 0 ? "个人" : "单位"
                  }}</span>
                </template></vxe-table-column>
              <vxe-table-column field="regdate" title="登记日期" min-width="150px" show-overflow></vxe-table-column>
            </vxe-table>
          </div>
          <div class="text">记录数:{{ personnelListData.length }}</div>
        </div>
      </el-dialog>
      <!-- 客户历史体检记录弹框 -->
      <el-dialog class="dialog-mini history_pson" width="55%" height="100%" top="10%" :close-on-click-modal="false" title="历史体检信息" :visible.sync="historyShow" @close="handleCloseHistory">
        <div class="table_box">
          <EasyTable class="table_item" height="100%" row-id="groupid" :data="historySelectData" :tableOptions="historySelectOptions" :radio-config="{ fetch: true, rowClick: true }" @row-dblclick="handleHistoryCheck" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseHistory">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 取消审核原因弹框 -->
      <el-dialog title="取消原因" :visible.sync="showToExamine" width="45%" :close-on-click-modal="false" class="word_dia" @close="handleCancelToExamine">
        <div class="word_dia_box">
          <div class="title">请输入操作原因</div>
          <el-input type="textarea" :rows="5" resize="none" v-model="reason">
          </el-input>
          <!-- <div class="tips">提醒：体检报告已打印,请及时收后体检报告。</div> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCancelToExamine">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitToExamine">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 保存小结提示弹框 -->
      <el-dialog title="小结" class="summaryDia" :visible.sync="showSummaryDia" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" @opened="handleOpened" @closed="handleClosed">
        <span v-if="conclusion" v-html="conclusion"></span>
        <span slot="footer" class="dialog-footer" style="text">
          <el-button type="primary" size="mini" @click="handleConfirmConclusion">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 危急值弹框 -->
      <el-dialog title="危急值提醒" class="summaryDia" :visible.sync="showCriticalList" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <EasyTable :loading="loading" height="100%" class="table_100" style="height: 380px" :data="criticalList" :tableOptions="criticalListOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <span slot="footer" class="dialog-footer" style="text">
          <el-button type="primary" size="mini" @click="showCriticalList = false">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 病史弹框 -->
      <el-dialog title="病史" :visible.sync="showMedicalhistory" width="45%" :show-close="false" :close-on-click-modal="false" calss="medicalhistory_dia">
        <span>
          <el-input :rows="7" type="textarea" resize="none" v-model="medicalhistory"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="(medicalhistory = ''), (showMedicalhistory = false)">关 闭</el-button>
          <el-button size="mini" type="primary" @click="handleUpdateMedicalHistoryInfo">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 常见结果弹出动态渲染 -->
      <el-dialog title="录入结果模板" class="splitFlag_dialog" :visible.sync="splitFlag" width="50%" :close-on-click-modal="false" :show-close="false">
        <div class="splitFlag_content">
          <div class="splitFlag_item" v-for="item,index in splits" :key="index">
            <div v-if="item.lableType == 0">{{ item.content }}</div>
            <el-input style="width: 150px;" v-if="item.lableType == 1" v-model="item.content" size="mini" placeholder="请输入内容"></el-input>
            <el-select ref="mySelect" :popper-append-to-body="false" popper-class="my-select-dropdown" @visible-change="onVisibleChange" style="width: 150px;" v-if="item.lableType == 2" v-model="item.content" size="mini" placeholder="请选择">
              <el-option v-for="value,ind in item.selectList" :key="ind" :label="value" :value="value">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirmSplits">确 定</el-button>
          <el-button plain @click="splitFlag = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 核对确弹框 -->
      <el-dialog title="核对确认-勾选项目附带报告图片" :visible.sync="showVerifyAndConfirm" class="verify_dia" width="60%" :close-on-click-modal="false" :show-close="false">
        <div class="verify_content">
          <div class="vc_l">
            <div class="vc_l_all" style="height: 30px;">
              <el-checkbox :false-label="0" :true-label="1" v-model="notreportAll" @change="handleNotreportAll">全选</el-checkbox>
            </div>
            <div class="vc_l_box" style="height: calc(100% - 30px);">
              <div class="vc_l_checkboxgroup">
                <el-checkbox v-for="item,index in verifyItems" :key="index" :false-label="0" :true-label="1" v-model="item.notreport"></el-checkbox>
              </div>
              <div class="vc_l_checkname">
                <div :class="[verifyActive == item.sourcecode+index?'vcl_bg':'']" v-for="item,index in verifyItems" :key="index" @click="handleCheckVerifyImg(item,index)">{{item.sourcecode}} {{item.sourcecodeName}}</div>
              </div>
            </div>
          </div>
          <div class="vc_r">
            <el-image style="width: 120px; height: 120px" :src="verifyChoose" :preview-src-list="verifySrcList">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleVerifyAndClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleVerifyAndSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 检索组件 -->
      <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" />
    </div>
    <Questionnaire :regid="this.personalForm.regid" v-if="showQuestionnaire" @close="handleCloseQuestionnaire" />
    <!-- 导诊弹框 -->
    <Guidance v-if="showGuidance" @hide="handleHide" @close="handleCloseGuidance" />
    <div class="wait_box" v-if="showSmallGuidance" @dblclick="handleAgainShow">
      <div class="wait_box_no" v-if="waitLength == 0">
        <div>无人</div>
        <div>等候</div>
      </div>
      <div class="wait_box_yes" v-else>
        <div>等候人数</div>
        <div>{{waitLength}}</div>
      </div>
    </div>
    <!-- 查看预警 -->
    <customer-critical-dialog :show.sync="showCriticalDialog" :regid="personalForm.regid" v-if="showCriticalDialog"></customer-critical-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapState, mapGetters } from "vuex";
import elDragDialog from "@/directive/el-dragDialog";
import CustomerCriticalDialog from "@/components/CustomerCritical";
import Guidance from "@/components/guidance";

import {
  getDepartCheck,
  getPersonnelList,
  getDicConclusion,
  getHistoryResult,
  getAllCheck,
  getPersonArchives,
  getConclusionDetail,
  getDefaultConclusion,
  getGenerateConclusion,
  getSubmitPage,
  getSubmitPageListenSave,
  getCheckPage,
  getGiveUpCheck,
  getCombineDetail,
  getAddSpecialis,
  setSubmitSpecialis,
  setDelSpecialis,
  getRecommend,
  getResultCompare,
  setDepartDelete,
  getFiles,
  getCancelCheckPage,
  setFilesUpload,
  ImportCheckEyeData,
  ImportEyeDataSave,
  setUploadPdfToImage,
  setFilesDelete,
  setDepartCheckGiveUp,
  setDepartCheckGiveUpCancel,
  setDepartCheckGetResult,
  getCustomerResultCriticalList,
  SplitContent,
  UpdatVerification,
  AlterFields,
  CombineImage,
  ListenCombineDetail,
  CalcListenAvg,
  CalcCorrectValue,
  ListenHistoryResult,
  GetResultFlag,
} from "@/api/customerresult.js"; // 引入页面接口
import { LoadTriagRoom } from "@/api/dictriag.js";
import {
  TriagDetail,
  TriagSave,
  TriagOpen,
  TriagClose,
  TriagCall,
  TriagSkip,
  TriagComplete,
} from "@/api/triag.js";
import { getPersonalRegisterList } from "@/api/personalregister.js";
import SearchDialog from "@/components/searchDialog";
import Questionnaire from "@/components/surveyinformation"; // 调查问卷
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import { getSysConfigInfo } from "@/api/sysconfig";
import { printStaticsBase64 } from "@/api/printreport.js";
import {
  initWebSocket,
  sendWebsocket,
  closeWebsocket,
} from "@/utils/webSocket.js";
import socketService from "@/utils/socketService.js";
import rightAir1 from "@/assets/rightAir1.png";
import rightAir2 from "@/assets/rightAir2.png";
import rightBone1 from "@/assets/rightBone1.png";
import rightBone2 from "@/assets/rightBone2.png";
import leftAir1 from "@/assets/leftAir1.png";
import leftAir2 from "@/assets/leftAir2.png";
import leftBone1 from "@/assets/leftBone1.png";
import leftBone2 from "@/assets/leftBone2.png";
import sssr from "@/assets/sss.png";
export default {
  name: "customerResult",
  components: {
    Sticky,
    permissionBtn,
    SearchDialog,
    Questionnaire,
    CustomerCriticalDialog,
    Guidance,
  },
  data() {
    return {
      searchCommon: "",
      abnormalTips: [],
      userInfo: null,
      currentPeople: null,
      showBigMask: true, //是否显示大遮罩
      radios: "0",
      isShowPage: true, // 控制页面重置
      editorOption: {
        theme: "snow", // 默认主题
        placeholder: "", // 默认输入内容
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            // ["blockquote", "code-block"], //引用，代码块
            // [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: "ordered" }, { list: "bullet" }], //列表
            // [{ script: "sub" }, { script: "super" }], // 上下标
            // [{ indent: "-1" }, { indent: "+1" }], // 缩进
            // [{ direction: "rtl" }], // 文本方向
            // [{ size: ["small", false, "large", "huge"] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            // [{ font: [] }], //字体
            [{ align: [] }], //对齐方式
            ["clean"], //清除字体样式
            // ["image", "video"], //上传图片、上传视频
          ],
        },
      },
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字 1000000080
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "name", name: "姓名" },
        { code: "checkno", name: "档案号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        // { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
      content: "",
      setting: {
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN", //本地化设置
        language_url:
          "https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js", //使用language_url会相对灵活
        // toolbar:
        //   "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar: " ",
        toolbar_drawer: "sliding",
        // quickbars_selection_toolbar:
        //   "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        quickbars_selection_toolbar: "bold forecolor backcolor",
        quickbars_insert_toolbar: false,
        plugins: "quickbars",
        // plugins: "link image media table lists fullscreen quickbars emoticons",
        height: "100%",
        setup: function (editor) {
          editor.on("focus", function (e) {});
        },
      }, // 富文本配置器
      doMainSetting: {
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN", //本地化设置
        language_url:
          "https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js", //使用language_url会相对灵活
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars emoticons",
        height: "100%",
        setup: function (editor) {
          editor.on("focus", function () {});
          editor.on("blur", function () {});
        },
      }, // 表格中富文本配置器
      departitems: [], // 树形结构数据
      defaultProps: {
        children: "combineitems",
        label: "deptname",
      },
      showremoveid: "", // 显示预览删除按钮
      defaultChecked: [], // 默认选中
      defaultCheckedCode: "", // 默认选中的code
      personalForm: {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 0,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
        confirmdoctorname: "",
        departcheckremark: "",
      }, // 个人信息
      sexarr: [
        { code: 0, name: "未知" },
        { code: 1, name: "男" },
        { code: 2, name: "女" },
      ], // 性别选择
      marriagearr: [
        { code: "未知", name: "未知" },
        { code: "未婚", name: "未婚" },
        { code: "已婚", name: "已婚" },
        { code: "离异", name: "离异" },
      ], // 婚姻状态
      agearr: [
        { code: "岁", name: "岁" },
        { code: "月", name: "月" },
        { code: "天", name: "天" },
      ], // 年龄单位
      companyitems: [], // 团检名称 // 单位选择
      batchitems: [], // 团检名称 // 批次选择
      avatarImg: require("./images/lin.jpg"),
      checktypeitems: [], //检查类型列表
      loading: false, // 表格加载效果
      historySelectData: [], // 客户历史体检记录数据
      historyShow: false, // 客户历史体检记录弹框显示
      checkList: [],
      projectText: "",
      commonData: [], // 常见结果
      historyData: [], //历史结果
      allInspectData: [], // 所有检查
      dbSpectData: [], // 所有检查详情表格数据
      showDbSpect: false, //显示所有检查详情数据
      healthRecordsData: [], // 健康档案
      healthDtData: [], // 健康详情数据
      showTableFlag: "commonResult", // 显示表格信息-- commonResult historyResult allInspections  healthRecords
      showTableDisabled: true, // 显示表格按钮组是否可点击
      summaryForm: {}, // 小结信息表单
      entryData: [], // 词条表格数据
      chooseEntry: undefined, // 词条表格数据
      fruit: "conclusion", // 选择小结/专科建议
      personnelList: [], //人员列表
      personnelStatus: "0", // 客户人员排队列表状态
      chooseDepart: undefined, // 当前选中的科室
      checkoutData: [], // 检验类表格数据
      doMainData: [], // 功能类表格数据
      doctoritems: [], // 医生列表集
      chooseProject: "", // 当前改变的项目编码
      chooseProjectArr: [], // 当前改变的项目组
      chooseInputItem: undefined, // 当前选中的输入框对象
      summaryObj: undefined, // 请求小结成功返回对象
      conclusion: "", // 小结 - 小结
      specialistadvice: "", // 小结 - 专科建议
      showConclusion: false, // 控制显示结论词弹框
      conclusionSearch: "",
      conclusionData: [],
      critiitems: [],
      conclusionProps: {
        children: "children",
        label: "label",
      },
      clusionCheck: [],
      showTwoInput: "",

      conclusionForm: {}, // 结论词弹框表单对象
      chooseClusion: undefined, // 当前选中结论词对象
      timeID: "", // 定时器id
      timeIDInput: "", // 定时器id
      showSpecialis: false, // 新增专科建议展示弹框回调
      showAddOrEdit: false, // 新增专科建议展示弹框回调
      specialisData: [], // 新增专科建议表格数据
      chooseSpecialis: undefined, // 当前选中专科建议项
      editSpecialis: true, // 限制文本域输入
      dKeyword: "", // 新增/编辑弹出层关键字
      dProposal: "", // 新增/编辑弹出层建议
      specialisFlag: "add", // 新增编辑标识
      showRecommend: false, // 推荐弹框显示控制
      recommendData: [], // 推荐弹框表格列表数据
      recommendSelect: [], // 推荐弹框表格选中数据
      showEcharts: false, // 控制显示Echarts弹框
      echartDate: [], // 控制Echarts x轴日期
      echartNumber: [], // 控制Echarts y轴数据
      showSearch: false, // 显示检索组件
      chooseCombine: undefined, // 当前选中科室对象
      isDel: false, // 是否删除
      showTriage: false, // 显示分诊弹框
      imageInfoFlag: false, // 显示图像照片信息
      dialogImageUrl: "",
      dialogVisible: false,
      showQuestionnaire: false, // 调查问卷显示
      fileList: [],
      fileListEay: [],
      previewImageList: [], // 图片预览路径
      tinymceFlag1: 1,
      tinymceFlag2: 1,
      timeEditorId: "",
      srcFolder: require("./images/folder.png"),
      substatus0: require("./images/substatus0.png"),
      substatus1: require("./images/substatus1.png"),
      substatus2: require("./images/substatus2.png"),
      showToExamine: false, // 取消审核弹框
      reason: "", // 取消审核原因
      triageTime: [], //登记时间筛选
      loadingObj: "", // 加载对象
      isDialog: "",
      currentUser: "",
      saveLoading: false,
      buttons: [],
      showSummaryDia: false,
      showCriticalList: false, //危急值弹框
      criticalList: [], // 危急值数据
      showTriageDia: false,
      userInfo: null,
      currentTriag: {},
      queuePaiDuiList: [], // 待检
      completeList: [], // 已检
      guohaoList: [], // 过号
      ejectStatus: "待检",
      ejectLoading: false,
      ejectData: [],
      triagData: {},
      finishTriag: {},
      showFinish: false,
      showDepart: false,
      tetopRetrieval: "",
      tediaTableData: [],
      isShowSex: 0,
      medicalhistory: "",
      showMedicalhistory: false,
      splitFlag: false,
      isSyncConclusion: false,
      splitsRow: "",
      splits: [],
      showCriticalDialog: false,
      isCustomize: false,
      configHeight: "",
      timeIDDetail: "",
      showVerifyAndConfirm: false,
      verifyItems: [],
      notreportAll: 0,
      verifyActive: "",
      verifyChoose: "",
      verifySrcList: [],
      lockDoctorcode: 0,
      showGuidance: false,
      showSmallGuidance: false,
      waitLength: 0,
      isListenShow: false,
      resultFlag: "当次结果",
      nowdata: "实测数据",
      inputtest: "",
      checkedtest: false,
      listenItems: [],
      listenItemsCorrect: [],
      listenAvgItems: [],
      listenAvgItemsName: [
        "双耳高频平均听阈",
        "右耳语频平均听阈",
        "加权右耳语频平均听阈",
        "左耳语频平均听阈",
        "加权左耳语频平均听阈",
      ],
      listenHistory: [],
      chartsXArr: [],
      showChartBox: true,
    };
  },
  directives: {
    elDragDialog,
    drag: {
      // 指令的定义
      bind: function (el) {
        let oDiv = el; // 获取当前元素
        oDiv.onmousedown = (e) => {
          // 算出鼠标相对元素的位置
          let disX = e.clientX - oDiv.offsetLeft;
          let disY = e.clientY - oDiv.offsetTop;

          document.onmousemove = (e) => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;

            if (left <= 0) {
              left = 0;
            } else if (
              left >=
              document.documentElement.clientWidth - oDiv.clientWidth
            ) {
              //document.documentElement.clientWidth 屏幕的可视宽度
              left = document.documentElement.clientWidth - oDiv.clientWidth;
            }
            if (top <= 0) {
              top = 0;
            } else if (
              top >=
              document.documentElement.clientHeight - oDiv.clientHeight
            ) {
              // document.documentElement.clientHeight 屏幕的可视高度
              top = document.documentElement.clientHeight - oDiv.clientHeight;
            }

            oDiv.style.left = left + "px";
            oDiv.style.top = top + "px";
          };

          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews", "name"]),
    ...mapState({
      socketObj: (state) => state.user.socketObj,
    }),
    // 小结关键字检索
    commonDataSS() {
      const search = this.searchCommon;
      if (search) {
        return this.commonData.filter((data) => {
          return Object.keys(data).some((key) => {
            // let containArr = ["combinename", "combinepy", "combinewb"];
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.commonData;
    },
    personnelListData() {
      const search = this.triageTime;
      // 进入筛选
      if (search && search.length == 2) {
        return this.personnelList.filter((data) => {
          if (data.regdate) {
            let condition1 = new Date(search[0]).getTime();
            let condition2 = new Date(search[1]).getTime();
            let returnData = new Date(data.regdate).getTime();
            return condition1 <= returnData && returnData <= condition2;
          }
        });
      }
      return this.personnelList;
    },

    // 历史信息表格配置
    historySelectOptions() {
      return [
        {
          title: "体检号",
          prop: "regid",
          align: "center",
          width: 110,
        },
        {
          title: "档案号",
          prop: "checkno",
          align: "center",
          width: 110,
        },
        {
          title: "姓名",
          prop: "name",
          align: "center",
        },
        {
          title: "性别",
          prop: "sex",
          align: "center",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          align: "center",
          returnVal: (value) => {
            return `${value}岁`;
          },
        },
        {
          title: "电话",
          prop: "telephone",
          width: 110,
        },
        {
          title: "身份证号",
          prop: "idcard",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "团检",
          prop: "companyname",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "登记时间",
          prop: "regdate",
          align: "center",
          width: 180,
          omit: 1,
        },
      ];
    },
    // 常见结果表格配置
    commonOptions() {
      return [
        {
          title: "小结",
          prop: "conclusion",
        },
        // {
        //   title: "结果描述",
        //   align: "center",
        //   prop: "itemvalue",
        // },
      ];
    },
    //历史结果表格配置
    historyOptions() {
      return [
        {
          title: "检查项目",
          align: "center",
          render: (h, data) => {
            return (
              <div>
                <strong v-show={data.itemname == "小结"}>
                  {data.itemname}
                </strong>
                <span v-show={data.itemname != "小结"}>{data.itemname}</span>
              </div>
            );
          },
        },
        {
          title: "结果",
          render: (h, data) => {
            data.itemname == "小结";
            return (
              <div>
                <span
                  v-show={data.itemname == "小结"}
                  domPropsInnerHTML={data.result}
                ></span>
                <span v-show={data.itemname != "小结"}>{data.result}</span>
              </div>
            );
          },
        },
      ];
    },
    //所有检查表格配置
    allInspectOptions() {
      return [
        {
          title: "体检组合",
          align: "center",
          prop: "combinename",
        },
        {
          title: "小结",
          render: (h, data) => {
            return <div domPropsInnerHTML={data.conclusion}></div>;
          },
        },
        {
          title: "检查医生",
          align: "center",
          prop: "doctorname",
        },
      ];
    },
    //健康档案表格配置
    healthRecordsOptions() {
      return [
        {
          title: "体检号",
          align: "center",
          prop: "regid",
          omit: 1,
        },
        {
          title: "姓名",
          align: "center",
          prop: "name",
        },
        {
          title: "体检时间",
          align: "center",
          prop: "checkdate",
        },
      ];
    },
    //健康档案详情表格配置
    healthDtOptions() {
      return [
        {
          title: "体检组合",
          align: "center",
          prop: "combinename",
        },
        {
          title: "小结",
          render: (h, data) => {
            return <div domPropsInnerHTML={data.conclusion}></div>;
          },
        },
        {
          title: "检查医生",
          align: "center",
          prop: "doctorname",
        },
      ];
    },
    // 词条小结表格配置
    entryOptions() {
      return [
        {
          title: "序",
          align: "center",
          prop: "seqno",
          // type: "index",
          width: 40,
          returnVal: (value, data) => {
            return this.chooseDepart.viewgroup == 2 ? value : data.$index + 1;
          },
        },
        {
          title: "结论词",
          prop: "wordname",
          // omit: 1,
        },
      ];
    },
    // 人员队列表格配置
    personnelOptions() {
      return [
        {
          title: "体检号",
          align: "center",
          prop: "regid",
        },
        {
          title: "姓名",
          align: "center",
          prop: "name",
        },
        {
          title: "性别",
          align: "center",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "类型",
          align: "center",
          prop: "personalflag",
          returnVal: (value) => {
            return value == 0 ? "个人" : "单位";
          },
        },
        {
          title: "登记时间",
          align: "center",
          prop: "regdate",
          width: 150,
        },
      ];
    },
    // 检验类表格配置
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
            if (data.itemcode === this.showTwoInput) {
              let resultS = data.result.split("/");
              let input1 = resultS[0] || "";
              let input2 = resultS[1] || "";
              return (
                <div style="display: flex;align-items: center;">
                  <span v-show={data.mustflag == 1} style="color: red">
                    *
                  </span>
                  <input
                    type="text"
                    disabled={
                      this.showBigMask ||
                      this.personalForm.confirmdoctorcode != null
                    }
                    class={`focusinginput_${data.itemcode} discount_input enterInput_${data.$index}`}
                    onkeyup={(e) => {
                      if (!e) return;
                      if (!input1 || !input2) return;
                      data.result = `${input1}/${input2}`;
                      switch (e.keyCode) {
                        case 13: // 键盘回车
                          this.handleInputdom1(data);
                          this.handleJumpNextInput(data);
                          break;
                        case 38: // 键盘 ↑ 键盘
                          this.handleDiscountUpper(e, data);
                          break;
                        case 40: // 键盘 ↓ 键盘
                          this.handleDiscountLower(e, data);
                          break;
                        default:
                          break;
                      }
                    }}
                    vOn:blur={() => {
                      if (!input1 || !input2) return;
                      data.result = `${input1}/${input2}`;
                      this.handleInputdom1(data);
                    }}
                    v-model={input1}
                    vOn:focus={(e) => {
                      e.stopPropagation();
                      this.chooseDepart.conclusionstatus == -1 &&
                        e.currentTarget.select();
                      if (
                        this.chooseInputItem &&
                        this.chooseInputItem.itemcode == data.itemcode
                      )
                        return;
                      this.handleFocusProject(data);
                    }}
                    placeholder={
                      data.resuletype == 1 ? "请输入数值" : "请输入任意值"
                    }
                    clearable
                    vOn:clear={() => {
                      data.itemvalueitems = [];
                      this.handleInputdom1(data);
                    }}
                  />
                  <span style="font-size:18px;font-weight:600;margin:0 8px 0 8px;">
                    /
                  </span>
                  <input
                    type="text"
                    disabled={
                      this.showBigMask ||
                      this.personalForm.confirmdoctorcode != null
                    }
                    class={`focusinginput_${data.itemcode} discount_input enterInput_${data.$index}`}
                    onkeyup={(e) => {
                      if (!e) return;
                      if (!input1 || !input2) return;
                      data.result = `${input1}/${input2}`;
                      switch (e.keyCode) {
                        case 13: // 键盘回车
                          this.handleInputdom1(data);
                          this.handleJumpNextInput(data);
                          break;
                        case 38: // 键盘 ↑ 键盘
                          this.handleDiscountUpper(e, data);
                          break;
                        case 40: // 键盘 ↓ 键盘
                          this.handleDiscountLower(e, data);
                          break;
                        default:
                          break;
                      }
                    }}
                    vOn:blur={() => {
                      if (!input1 || !input2) return;
                      data.result = `${input1}/${input2}`;
                      this.handleInputdom1(data);
                    }}
                    v-model={input2}
                    vOn:focus={(e) => {
                      e.stopPropagation();
                      this.chooseDepart.conclusionstatus == -1 &&
                        e.currentTarget.select();
                      if (
                        this.chooseInputItem &&
                        this.chooseInputItem.itemcode == data.itemcode
                      )
                        return;
                      this.handleFocusProject(data);
                    }}
                    placeholder={
                      data.resuletype == 1 ? "请输入数值" : "请输入任意值"
                    }
                    clearable
                    vOn:clear={() => {
                      data.itemvalueitems = [];
                      this.handleInputdom1(data);
                    }}
                  />
                </div>
              );
            } else {
              return (
                <div style="display: flex;">
                  <span v-show={data.mustflag == 1} style="color: red">
                    *
                  </span>
                  <input
                    type="text"
                    disabled={
                      this.showBigMask ||
                      this.personalForm.confirmdoctorcode != null
                    }
                    class={`focusinginput_${data.itemcode} discount_input enterInput_${data.$index}`}
                    onkeyup={(e) => {
                      if (!e) return;
                      switch (e.keyCode) {
                        case 13: // 键盘回车
                          this.handleInputdom1(data);
                          this.handleJumpNextInput(data);
                          break;
                        case 38: // 键盘 ↑ 键盘
                          this.handleDiscountUpper(e, data);
                          break;
                        case 40: // 键盘 ↓ 键盘
                          this.handleDiscountLower(e, data);
                          break;
                        default:
                          break;
                      }
                    }}
                    vOn:blur={() => this.handleInputdom1(data)}
                    v-model={data.result}
                    vOn:focus={(e) => {
                      e.stopPropagation();
                      this.chooseDepart.conclusionstatus == -1 &&
                        e.currentTarget.select();
                      this.handleFocusProject(data);
                    }}
                    placeholder={
                      data.resuletype == 1 ? "请输入数值" : "请输入任意值"
                    }
                    clearable
                    vOn:clear={() => {
                      data.itemvalueitems = [];
                      this.handleInputdom1(data);
                    }}
                  />
                </div>
              );
            }
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
          align: "center",
          width: 180,
          /* returnVal: (value, data) => {
            let result = data.resupper
              ? `${data.reslower} - ${data.resupper}`
              : `${data.reslower}`;
            return result;
          }, */
          render: (h, data) => {
            if (data.resexp !== "") {
              return <div domPropsInnerHTML={data.resexp || ""}></div>;
            } else {
              return (
                <div>
                  <span
                    v-show={data.resupper && data.reslower}
                  >{`${data.reslower} - ${data.resupper}`}</span>
                  <span v-show={data.resupper && !data.reslower}>
                    {data.resupper}
                  </span>
                  <span v-show={data.reslower && !data.resupper}>
                    {data.reslower}
                  </span>
                </div>
              );
            }
          },
        },
        {
          title: "历史",
          prop: "lastresult",
          align: "center",
          width: 140,
        },
        {
          title: "危急值标志",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.resflag}
                false-label={0}
                true-label={2}
                disabled
                /* disabled={!data.result || this.personalForm.confirmdoctorcode != null} */
                vOn:change={(e) => {
                  let index = this.chooseProjectArr.findIndex(
                    (k) => k.itemcode === data.itemcode
                  );
                  if (index !== -1) {
                    this.chooseProjectArr.splice(index, 1, data);
                  }
                }}
              ></el-checkbox>
            );
          },
        },
        {
          title: "弃检标志",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.abaflag}
                false-label={0}
                true-label={1}
                disabled={this.personalForm.confirmdoctorcode != null}
                vOn:change={(e) => {
                  let index = this.chooseProjectArr.findIndex(
                    (k) => k.itemcode === data.itemcode
                  );
                  if (index !== -1) {
                    this.chooseProjectArr.splice(index, 1, data);
                  }
                }}
              ></el-checkbox>
            );
          },
        },
        {
          title: "项目编码",
          prop: "itemcode",
          width: 140,
          omit: 1,
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
                <input
                  type="text"
                  size="mini"
                  class={
                    data.healthstatus == -1
                      ? "text_lower"
                      : data.healthstatus == 1
                      ? "text_upper"
                      : ""
                  }
                  class={`focusinginput_${data.itemcode} discount_input enterInput_${data.$index}`}
                  disabled={
                    this.showBigMask ||
                    this.personalForm.confirmdoctorcode != null
                  }
                  v-model={data.result}
                  vOn:focus={(e) => {
                    e.stopPropagation();
                    this.chooseDepart.conclusionstatus == -1 &&
                      e.currentTarget.select();
                    this.handleCheckoutFocus(data);
                  }}
                  vOn:blur={() => this.handleCheckoutBlur(data)}
                  vOn:input={() => (
                    clearTimeout(this.timeIDInput),
                    (this.timeIDInput = setTimeout(() => {
                      this.handleCheckoutBlur(data);
                    }, 500))
                  )}
                  vOn:clear={() => {
                    data.itemvalueitems = [];
                  }}
                  onkeyup={(e) => {
                    if (!e) return;
                    switch (e.keyCode) {
                      case 13: // 键盘回车
                        this.handleInputdom1(data);
                        this.handleJumpNextInput(data);
                        break;
                      case 38: // 键盘 ↑ 键盘
                        this.handleDiscountUpper(e, data);
                        break;
                      case 40: // 键盘 ↓ 键盘
                        this.handleDiscountLower(e, data);
                        break;
                      default:
                        break;
                    }
                  }}
                />
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
          width: 180,
          render: (h, data) => {
            if (data.resexp !== "") {
              return <div domPropsInnerHTML={data.resexp || ""}></div>;
            } else {
              return (
                <div>
                  <span
                    v-show={data.resupper && data.reslower}
                  >{`${data.reslower} - ${data.resupper}`}</span>
                  <span v-show={data.resupper && !data.reslower}>
                    {data.resupper}
                  </span>
                  <span v-show={data.reslower && !data.resupper}>
                    {data.reslower}
                  </span>
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
        {
          title: "危急值标志",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.resflag}
                false-label={0}
                true-label={2}
                disabled
                /* disabled={!data.result || this.personalForm.confirmdoctorcode != null} */
                vOn:change={(e) => {
                  let index = this.chooseProjectArr.findIndex(
                    (k) => k.itemcode === data.itemcode
                  );
                  if (index !== -1) {
                    this.chooseProjectArr.splice(index, 1, data);
                  }
                }}
              ></el-checkbox>
            );
          },
        },
        {
          title: "弃检标志",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.abaflag}
                false-label={0}
                true-label={1}
                disabled={this.personalForm.confirmdoctorcode != null}
                vOn:change={(e) => {
                  let index = this.chooseProjectArr.findIndex(
                    (k) => k.itemcode === data.itemcode
                  );
                  if (index !== -1) {
                    this.chooseProjectArr.splice(index, 1, data);
                  }
                }}
              ></el-checkbox>
            );
          },
        },
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
          width: 180,
          render: (h, data) => {
            if (data.resexp !== "") {
              return <div domPropsInnerHTML={data.resexp || ""}></div>;
            } else {
              return (
                <div>
                  <span
                    v-show={data.resupper && data.reslower}
                  >{`${data.reslower} - ${data.resupper}`}</span>
                  <span v-show={data.resupper && !data.reslower}>
                    {data.resupper}
                  </span>
                  <span v-show={data.reslower && !data.resupper}>
                    {data.reslower}
                  </span>
                </div>
              );
            }
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
                  class={`focusinginput_${data.itemcode} conc_text enterInput_${data.$index}`}
                  type="textarea"
                  resize="none"
                  disabled={
                    this.showBigMask ||
                    this.personalForm.confirmdoctorcode != null
                  }
                  vOn:focus={(e) => {
                    this.chooseDepart.conclusionstatus == -1 &&
                      e.currentTarget.select();
                    this.handleOnEditorFocus(data);
                  }}
                  vOn:blur={() => this.handleOnEditorInput(data)}
                  vOn:input={() => {
                    data.describe = data.result;
                    this.chooseInputItem.describe = data.result;
                    let index = this.chooseProjectArr.findIndex(
                      (k) => k.itemcode === data.itemcode
                    );
                    index != -1 &&
                      (this.chooseProjectArr[index].describe = data.result);
                  }}
                  nativeOnkeyup={(e) => {
                    return;
                    if (!e) return;
                    switch (e.keyCode) {
                      case 38: // 键盘 ↑ 键盘
                        this.handleDiscountUpper(e, data);
                        break;
                      case 40: // 键盘 ↓ 键盘
                        this.handleDiscountLower(e, data);
                        break;
                      default:
                        break;
                    }
                  }}
                  v-model={data.result}
                ></el-input>
              </div>
            );
          },
        },
        {
          title: "危急值标志",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.resflag}
                false-label={0}
                true-label={2}
                disabled
                /* disabled={!data.result || this.personalForm.confirmdoctorcode != null} */
                vOn:change={(e) => {
                  let index = this.chooseProjectArr.findIndex(
                    (k) => k.itemcode === data.itemcode
                  );
                  if (index !== -1) {
                    this.chooseProjectArr.splice(index, 1, data);
                  }
                }}
              ></el-checkbox>
            );
          },
        },
        {
          title: "弃检标志",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-checkbox
                v-model={data.abaflag}
                false-label={0}
                true-label={1}
                disabled={this.personalForm.confirmdoctorcode != null}
                vOn:change={(e) => {
                  let index = this.chooseProjectArr.findIndex(
                    (k) => k.itemcode === data.itemcode
                  );
                  if (index !== -1) {
                    this.chooseProjectArr.splice(index, 1, data);
                  }
                }}
              ></el-checkbox>
            );
          },
        },
      ];
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    // 新增专科建议表格配置
    specialisOptions() {
      return [
        {
          title: "关键字",
          // prop: "name",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => {
                  this.specialisFlag = "edit";
                  this.chooseSpecialis = data;
                  this.dKeyword = data.name; // 新增/编辑弹出层关键字
                  this.dProposal = data.healthadvice; // 新增/编辑弹出层建议
                  this.showAddOrEdit = true;
                }}
              >
                {data.name}
              </el-link>
            );
          },
          //   return ( handleEditSpecialis
          //     <el-input
          //       class="s_input"
          //       clearable
          //       size="mini"
          //       type="text"
          //       disabled={this.editSpecialis}
          //       v-model={data.name}
          //     ></el-input>
          //   );
          // },
        },
      ];
    },
    // 推荐弹框表格配置
    recommendOptions() {
      return [
        {
          type: "selection",
          width: 50,
        },
        {
          title: "小结",
          prop: "conclusion",
          omit: 3,
        },
        {
          title: "专科建议",
          prop: "specialistadvice",
          omit: 3,
        },
        {
          title: "检查人",
          prop: "doctorname",
          width: 115,
        },
        {
          title: "审核人",
          prop: "checkname",
          width: 115,
        },
      ];
    },
    // 所有检查详情表格配置
    dbSpectOptions() {
      return [
        {
          title: "检查项目",
          render: (h, data) => {
            data.itemname == "小结";
            return (
              <div>
                <strong v-show={data.itemname == "小结"}>
                  {data.itemname}
                </strong>
                <span v-show={data.itemname != "小结"}>{data.itemname}</span>
              </div>
            );
          },
        },
        {
          title: "结果",
          render: (h, data) => {
            return (
              <div>
                <span
                  v-show={data.itemname == "小结"}
                  domPropsInnerHTML={data.result}
                ></span>
                <span v-show={data.itemname != "小结"}>{data.result}</span>
              </div>
            );
          },
        },
        {
          title: "检查医生",
          prop: "doctorname",
        },
      ];
    },
  },

  created() {},
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || null;
    this.currentUser = this.name;
    // 页面加载获取客户排队列表
    // this.handleGetPersonnelList();
    // 加载获取登记信息叫号数据
    // this.handleGetDepartCheck();
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    this.handleGetToday();
    // 读取页面配置
    getSysConfigInfo({ cc: "Sys_CancelAudit_CancelReason" }).then((res) => {
      this.isDialog = res.result;
    });
    getSysConfigInfo({ cc: "Sys_ItemBP_Showtype" }).then((res) => {
      this.showTwoInput = res.result;
    });
    getSysConfigInfo({ cc: "Sys_ResultAndSummary_Height" }).then((res) => {
      if (!res.result) return;
      if (res.result.split("_").length >= 2) {
        this.configHeight = res.result.split("_");
      }
    });
    getSysConfigInfo({
      cc: "Sys_DepartCheck_CombineResultNotNormalShowTip",
    }).then((res) => {
      if (!res.result) return;
      this.abnormalTips = res.result.split("|");
    });
    this.handleFocuscheckupWorkInput();
    window.addEventListener("resize", this.chartResize);
  },
  activated() {
    this.tinymceFlag1++;
    this.tinymceFlag2++;
    this.handleFocuscheckupWorkInput();
  },
  // 组件销毁时确保移除监听
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("resize", this.chartResize);
  },
  methods: {
    // 右耳气导无应答勾选
    handleRightAirResponseCheck(flag, item) {
      if (flag) {
        item.rightAirTemp = item.rightAirValue;
        item.rightAirValue = "无应答";
        this.handleCreateRightEarChart();
      } else {
        item.rightAirValue = item.rightAirTemp;
        item.rightAirTemp = "";
        this.handleCreateRightEarChart();
      }
    },
    chartResize() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        let dom1 = document.querySelector("#correctLeftEarChart") || "";
        let dom2 = document.querySelector("#correctRightEarChart") || "";
        let dom3 = document.querySelector("#leftEarChart") || "";
        let dom4 = document.querySelector("#rightEarChart") || "";
        let myChart1 = "";
        dom1 && (myChart1 = this.$echarts.init(dom1));
        let myChart2 = "";
        dom2 && (myChart2 = this.$echarts.init(dom2));
        let myChart3 = "";
        dom3 && (myChart3 = this.$echarts.init(dom3));
        let myChart4 = "";
        dom4 && (myChart4 = this.$echarts.init(dom4));
        if (myChart1) {
          myChart1.resize();
        }
        if (myChart2) {
          myChart2.resize();
        }
        if (myChart3) {
          myChart3.resize();
        }
        if (myChart4) {
          myChart4.resize();
        }
      });
    },
    // 听力历史数据点击回调
    handleChangeResultFlag(value) {
      this.nowdata = "实测数据";
      if (value == "当次结果") {
        ListenCombineDetail({
          regid: this.personalForm.regid,
          combinecode: this.chooseCombine.combinecode,
        }).then((res) => {
          let data = res.result;
          this.commonData = []; // 重置右侧常用结果表格
          this.chooseDepart = JSON.parse(JSON.stringify(data));
          this.commonData = JSON.parse(JSON.stringify(data.itemvalueitems));
          this.listenItems = data.listenItems.map((k) => {
            return {
              ...k,
              rightAirTemp: "",
              rightBoneTemp: "",
              leftAirTemp: "",
              leftBoneTemp: "",
            };
          });
          this.chartsXArr = data.listenItems.map((k) => {
            return k.frequency;
          });
          this.chartsXArr.unshift("");
          this.chartsXArr.push("");
          this.listenAvgItems = data.listenAvgItems.map((k, i) => {
            return {
              ...k,
              name: this.listenAvgItemsName[i],
            };
          });
          if (data.medicalhistoryitem) {
            this.medicalhistory = data.medicalhistoryitem.medicalhistorydes;
            this.showMedicalhistory = true;
          }
          this.summaryForm = JSON.parse(JSON.stringify(data));
          this.summaryForm.statusName =
            this.summaryForm.conclusionstatus == -1
              ? "已登记"
              : this.summaryForm.conclusionstatus == 0
              ? "已保存"
              : "已审核";
          this.doctoritems = JSON.parse(JSON.stringify(data.doctoritems)); // 读取页面配置

          getSysConfigInfo({ cc: "Sys_doctorcode" }).then((res) => {
            if (!res.result) return;
            let tempSum = res.result.split("|");
            tempSum.forEach((item, index) => {
              if (item.split(",")[0] == value.deptcode) {
                let tempCode = item.split(",")[1];
                let index = this.doctoritems.filter(
                  (k) => k.code == tempCode
                )[0];
                if (index) {
                  this.summaryForm.doctorcode = index.code;
                  this.summaryForm.doctorname = index.name;
                }
              }
            });
            /* let index = this.doctoritems.filter((k) => k.code == res.result)[0];
            if (index) {
              this.summaryForm.doctorcode = index.code;
              this.summaryForm.doctorname = index.name;
            } */
          });
          let doctorItems =
            JSON.parse(localStorage.getItem("lockDoctorItems")) || [];
          if (doctorItems.length > 0) {
            let doctor = doctorItems.filter(
              (k) => k.code === data.combinecode
            )[0];
            if (doctor) {
              this.summaryForm.doctorcode = doctor.doctorcode;
              let index = this.doctoritems.filter(
                (k) => k.code == doctor.doctorcode
              )[0];
              if (index) {
                this.summaryForm.doctorname = index.name;
              }
              this.lockDoctorcode = 1;
            } else {
              this.lockDoctorcode = 0;
            }
          }
          this.chooseInputItem = undefined; // 重置选中项目数组
          this.showTableDisabled = false;
          this.showTableFlag = "commonResult";
          this.summaryObj = undefined; // 重置请求小结成功返回对象
          this.entryData = this.chooseDepart.worditems;
          this.checkList = []; // 重置选中项目复选框
          this.fileList = [];
          this.imageInfoFlag = false;
          this.conclusion = this.chooseDepart.conclusion;
          this.specialistadvice = this.chooseDepart.specialistadvice;
          if (this.chooseCombine.isconclusion) {
            this.showBigMask = true;
          } else {
            this.showBigMask = false;
          }
          this.showChartBox = false;
          this.$nextTick(() => {
            this.showChartBox = true;
            setTimeout(() => {
              this.handleCreateRightEarChart();
              this.handleCreateLeftEarChart();
            }, 100);
          });
        });
      } else {
        ListenCombineDetail({
          regid: value,
          combinecode: this.chooseCombine.combinecode,
        }).then((res) => {
          let data = res.result;
          this.commonData = []; // 重置右侧常用结果表格
          this.chooseDepart = JSON.parse(JSON.stringify(data));
          this.commonData = JSON.parse(JSON.stringify(data.itemvalueitems));
          this.listenItems = data.listenItems.map((k) => {
            return {
              ...k,
              rightAirTemp: "",
              rightBoneTemp: "",
              leftAirTemp: "",
              leftBoneTemp: "",
            };
          });
          this.chartsXArr = data.listenItems.map((k) => {
            return k.frequency;
          });
          this.chartsXArr.unshift("");
          this.chartsXArr.push("");
          this.listenAvgItems = data.listenAvgItems.map((k, i) => {
            return {
              ...k,
              name: this.listenAvgItemsName[i],
            };
          });
          if (data.medicalhistoryitem) {
            this.medicalhistory = data.medicalhistoryitem.medicalhistorydes;
            this.showMedicalhistory = true;
          }
          this.summaryForm = JSON.parse(JSON.stringify(data));
          this.summaryForm.statusName =
            this.summaryForm.conclusionstatus == -1
              ? "已登记"
              : this.summaryForm.conclusionstatus == 0
              ? "已保存"
              : "已审核";
          this.doctoritems = JSON.parse(JSON.stringify(data.doctoritems)); // 读取页面配置

          getSysConfigInfo({ cc: "Sys_doctorcode" }).then((res) => {
            if (!res.result) return;
            let tempSum = res.result.split("|");
            tempSum.forEach((item, index) => {
              if (item.split(",")[0] == value.deptcode) {
                let tempCode = item.split(",")[1];
                let index = this.doctoritems.filter(
                  (k) => k.code == tempCode
                )[0];
                if (index) {
                  this.summaryForm.doctorcode = index.code;
                  this.summaryForm.doctorname = index.name;
                }
              }
            });
            /* let index = this.doctoritems.filter((k) => k.code == res.result)[0];
            if (index) {
              this.summaryForm.doctorcode = index.code;
              this.summaryForm.doctorname = index.name;
            } */
          });
          let doctorItems =
            JSON.parse(localStorage.getItem("lockDoctorItems")) || [];
          if (doctorItems.length > 0) {
            let doctor = doctorItems.filter(
              (k) => k.code === data.combinecode
            )[0];
            if (doctor) {
              this.summaryForm.doctorcode = doctor.doctorcode;
              let index = this.doctoritems.filter(
                (k) => k.code == doctor.doctorcode
              )[0];
              if (index) {
                this.summaryForm.doctorname = index.name;
              }
              this.lockDoctorcode = 1;
            } else {
              this.lockDoctorcode = 0;
            }
          }
          this.chooseInputItem = undefined; // 重置选中项目数组
          this.showTableDisabled = false;
          this.showTableFlag = "commonResult";
          this.summaryObj = undefined; // 重置请求小结成功返回对象
          this.entryData = this.chooseDepart.worditems;
          this.checkList = []; // 重置选中项目复选框
          this.fileList = [];
          this.imageInfoFlag = false;
          this.conclusion = this.chooseDepart.conclusion;
          this.specialistadvice = this.chooseDepart.specialistadvice;
          if (this.chooseCombine.isconclusion) {
            this.showBigMask = true;
          } else {
            this.showBigMask = false;
          }
          this.$nextTick(() => {
            this.handleCreateRightEarChart();
            this.handleCreateLeftEarChart();
          });
        });
      }
    },
    // 实测数据点击回调
    handleMeasured() {
      this.nowdata = "实测数据";
      this.listenItemsCorrect = [];
      this.chartResize();
    },
    // 校正数据点击回调
    handleCorrection() {
      this.nowdata = "校正数据";
      CalcCorrectValue({
        age: this.personalForm.age,
        sex: this.personalForm.sex,
        isCorrect: true,
        listenItems: this.listenItems,
      }).then((res) => {
        if (!res.result) return;
        this.listenItemsCorrect = res.result;
        CalcListenAvg({
          age: this.personalForm.age,
          sex: this.personalForm.sex,
          isCorrect: true,
          listenItems: this.listenItemsCorrect,
        }).then((res) => {
          if (!res.result) return;
          for (let i = 0; i < res.result.length; i++) {
            for (let j = 0; j < this.listenAvgItems.length; j++) {
              if (this.listenAvgItems[j].categoray == res.result[i].categoray) {
                this.listenAvgItems[j].airAvg = res.result[i].airAvg;
                this.listenAvgItems[j].boneAvg = res.result[i].boneAvg;
              }
            }
          }
          this.$nextTick(() => {
            this.chartResize();
            this.handleCreateRightEarChartCorrect();
            this.handleCreateLeftEarChartCorrect();
          });
        });
      });
    },
    // 听力图标绘制 - 左
    handleCreateLeftEarChartCorrect() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.querySelector("#correctLeftEarChart")
      );
      let tempArr1 = [""]; // 左耳气导 - 未掩
      let tempArr2 = [""]; // 左耳气导 - 掩屏
      let tempArr3 = [""]; // 左耳骨导 - 未掩
      let tempArr4 = [""]; // 左耳骨导 - 掩屏
      for (let i = 0; i < this.listenItemsCorrect.length; i++) {
        if (
          this.listenItemsCorrect[i].leftAirMask == 0 &&
          this.listenItemsCorrect[i].correctLeftAirValue != ""
        ) {
          // 左耳气导 - 未掩
          tempArr1.push(this.listenItemsCorrect[i].correctLeftAirValue);
        } else {
          tempArr1.push(null);
        }
        if (
          this.listenItemsCorrect[i].leftAirMask == 1 &&
          this.listenItemsCorrect[i].correctLeftAirValue != ""
        ) {
          // 左耳气导 - 掩屏
          tempArr2.push(this.listenItemsCorrect[i].correctLeftAirValue);
        } else {
          tempArr2.push(null);
        }
        if (
          this.listenItemsCorrect[i].leftBoneMask == 0 &&
          this.listenItemsCorrect[i].correctLeftBoneValue != ""
        ) {
          // 左耳骨导 - 未掩
          tempArr3.push(this.listenItemsCorrect[i].correctLeftBoneValue);
        } else {
          tempArr3.push(null);
        }
        if (
          this.listenItemsCorrect[i].leftBoneMask == 1 &&
          this.listenItemsCorrect[i].correctLeftBoneValue != ""
        ) {
          // 左耳骨导 - 掩屏
          tempArr4.push(this.listenItemsCorrect[i].correctLeftBoneValue);
        } else {
          tempArr4.push(null);
        }
      }
      let series = [];
      if (tempArr1.length > 0) {
        series.push({
          data: tempArr1,
          type: "line",
          symbol: `image://${leftAir1}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3 },
          itemStyle: { color: "#EE6666" },
        });
      }
      if (tempArr2.length > 0) {
        series.push({
          data: tempArr2,
          type: "line",
          symbol: `image://${leftAir2}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3 },
          itemStyle: { color: "#EE6666" },
        });
      }
      if (tempArr3.length > 0) {
        series.push({
          data: tempArr3,
          type: "line",
          symbol: `image://${leftBone1}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3, type: "dashed" },
          itemStyle: { color: "#EE6666" },
        });
      }
      if (tempArr4.length > 0) {
        series.push({
          data: tempArr4,
          type: "line",
          symbol: `image://${leftBone2}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3, type: "dashed" },
          itemStyle: { color: "#EE6666" },
        });
      }
      tempArr1.push("");
      tempArr2.push("");
      tempArr3.push("");
      tempArr4.push("");
      // 绘制图表
      myChart.setOption({
        // title: { text: "听力级(dB)", left: "center" },
        //  symbol: `image://${myIcon}`,
        xAxis: {
          type: "category",
          data: this.chartsXArr,
          boundaryGap: false, // 关键设置
          splitLine: {
            show: true, // 关键：设置为 true
          },
          name: "频率Hz", // X轴名称
          nameLocation: "end", // 名称位置，可选 'start', 'middle', 'end'
          position: "bottom",
          offset: 0, // 保持默认偏移
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#333",
              width: 1,
            },
            onZero: false, // 设置为false避免与Y轴零值对齐问题
          },
          nameGap: 15,
        },
        yAxis: {
          type: "value",
          min: -10, // 最小值
          max: 120, // 最大值
          interval: 10, // 刻度间隔
          inverse: true, // 设置为true，Y轴反向
          name: "听力级(dB)", // X轴名称
          nameLocation: "start", // 名称位置，可选 'start', 'middle', 'end'
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          // 也可以设置名称与坐标轴之间的距离
          nameGap: 15,
        },
        series: series,
        /* series: [
          {
            data: ["10", "20", "60", "100", "65", "30"],
            type: "line",
            symbol: "emptyCircle",
            symbolSize: 16,
          },
        ], */
      });
    },
    // 听力图标绘制 - 右
    handleCreateRightEarChartCorrect() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.querySelector("#correctRightEarChart")
      );
      let tempArr1 = [""]; // 右耳气导 - 未掩
      let tempArr2 = [""]; // 右耳气导 - 掩屏
      let tempArr3 = [""]; // 右耳骨导 - 未掩
      let tempArr4 = [""]; // 右耳骨导 - 掩屏
      for (let i = 0; i < this.listenItemsCorrect.length; i++) {
        if (
          this.listenItemsCorrect[i].rightAirMask == 0 &&
          this.listenItemsCorrect[i].correctRightAirValue != ""
        ) {
          // 右耳气导 - 未掩
          tempArr1.push(this.listenItemsCorrect[i].correctRightAirValue);
        } else {
          tempArr1.push(null);
        }
        if (
          this.listenItemsCorrect[i].rightAirMask == 1 &&
          this.listenItemsCorrect[i].correctRightAirValue != ""
        ) {
          // 右耳气导 - 掩屏
          tempArr2.push(this.listenItemsCorrect[i].correctRightAirValue);
        } else {
          tempArr2.push(null);
        }
        if (
          this.listenItemsCorrect[i].rightBoneMask == 0 &&
          this.listenItemsCorrect[i].correctRightBoneValue != ""
        ) {
          // 右耳骨导 - 未掩
          tempArr3.push(this.listenItemsCorrect[i].correctRightBoneValue);
        } else {
          tempArr3.push(null);
        }
        if (
          this.listenItemsCorrect[i].rightBoneMask == 1 &&
          this.listenItemsCorrect[i].correctRightBoneValue != ""
        ) {
          // 右耳骨导 - 掩屏
          tempArr4.push(this.listenItemsCorrect[i].correctRightBoneValue);
        } else {
          tempArr4.push(null);
        }
      }
      let series = [];
      if (tempArr1.length > 0) {
        series.push({
          data: tempArr1,
          type: "line",
          symbol: `image://${rightAir1}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3 },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr2.length > 0) {
        series.push({
          data: tempArr2,
          type: "line",
          symbol: `image://${rightAir2}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3 },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr3.length > 0) {
        series.push({
          data: tempArr3,
          type: "line",
          symbol: `image://${rightBone1}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3, type: "dashed" },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr4.length > 0) {
        series.push({
          data: tempArr4,
          type: "line",
          symbol: `image://${rightBone2}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3, type: "dashed" },
          itemStyle: { color: "#5470C6" },
        });
      }
      tempArr1.push("");
      tempArr2.push("");
      tempArr3.push("");
      tempArr4.push("");
      // 绘制图表
      myChart.setOption({
        // title: { text: "听力级(dB)", left: "center" },
        //  symbol: `image://${myIcon}`,
        xAxis: {
          type: "category",
          data: this.chartsXArr,
          boundaryGap: false, // 关键设置
          splitLine: {
            show: true, // 关键：设置为 true
          },
          name: "频率Hz", // X轴名称
          nameLocation: "end", // 名称位置，可选 'start', 'middle', 'end'
          position: "bottom",
          offset: 0, // 保持默认偏移
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#333",
              width: 1,
            },
            onZero: false, // 设置为false避免与Y轴零值对齐问题
          },
          nameGap: 15,
        },
        yAxis: {
          type: "value",
          min: -10, // 最小值
          max: 120, // 最大值
          interval: 10, // 刻度间隔
          inverse: true, // 设置为true，Y轴反向
          name: "听力级(dB)", // X轴名称
          nameLocation: "start", // 名称位置，可选 'start', 'middle', 'end'
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          // 也可以设置名称与坐标轴之间的距离
          nameGap: 15,
        },
        series: series,
        /* series: [
          {
            data: ["10", "20", "60", "100", "65", "30"],
            type: "line",
            symbol: "emptyCircle",
            symbolSize: 16,
          },
        ], */
      });
    },
    // 结论词双击生成小结组装
    async handleCommonConclusion(row) {
      this.conclusion += `${row.conclusion};\r\n`;
    },
    // 勾选平均值模块生成小结组装
    handleGenerateConclusion(value) {
      let tempStr = "";
      for (let i = 0; i < this.listenAvgItems.length; i++) {
        if (
          this.listenAvgItems[i].airAvg &&
          this.listenAvgItems[i].airAvgSelect == 1
        ) {
          tempStr += `${this.listenAvgItems[i].name}气导 ${this.listenAvgItems[i].airAvg} dBHL;\r\n`;
        }
        if (
          this.listenAvgItems[i].boneAvg &&
          this.listenAvgItems[i].boneAvgSelect == 1
        ) {
          tempStr += `${this.listenAvgItems[i].name}骨导 ${this.listenAvgItems[i].boneAvg} dBHL;\r\n`;
        }
      }
      this.conclusion = tempStr;
    },
    // 填写听力值生成平均值回调
    handleBlurCalcListenAvg(flag) {
      CalcListenAvg({
        age: this.personalForm.age,
        sex: this.personalForm.sex,
        isCorrect: false,
        listenItems: this.listenItems,
      }).then((res) => {
        if (!res.result) return;
        for (let i = 0; i < res.result.length; i++) {
          for (let j = 0; j < this.listenAvgItems.length; j++) {
            if (this.listenAvgItems[j].categoray == res.result[i].categoray) {
              this.listenAvgItems[j].airAvg = res.result[i].airAvg;
              this.listenAvgItems[j].boneAvg = res.result[i].boneAvg;
            }
          }
        }
      });
      this.$nextTick(() => {
        flag == "right" && this.handleCreateRightEarChart();
        flag == "left" && this.handleCreateLeftEarChart();
      });
    },
    // 听力图标绘制 - 左
    handleCreateLeftEarChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector("#leftEarChart"));
      let tempArr1 = [""]; // 左耳气导 - 未掩
      let tempArr2 = [""]; // 左耳气导 - 掩屏
      let tempArr3 = [""]; // 左耳骨导 - 未掩
      let tempArr4 = [""]; // 左耳骨导 - 掩屏
      for (let i = 0; i < this.listenItems.length; i++) {
        if (
          this.listenItems[i].leftAirMask == 0 &&
          this.listenItems[i].leftAirValue != ""
        ) {
          // 左耳气导 - 未掩
          tempArr1.push(this.listenItems[i].leftAirValue);
        } else {
          tempArr1.push(null);
        }
        if (
          this.listenItems[i].leftAirMask == 1 &&
          this.listenItems[i].leftAirValue != ""
        ) {
          // 左耳气导 - 掩屏
          tempArr2.push(this.listenItems[i].leftAirValue);
        } else {
          tempArr2.push(null);
        }
        if (
          this.listenItems[i].leftBoneMask == 0 &&
          this.listenItems[i].leftBoneValue != ""
        ) {
          // 左耳骨导 - 未掩
          tempArr3.push(this.listenItems[i].leftBoneValue);
        } else {
          tempArr3.push(null);
        }
        if (
          this.listenItems[i].leftBoneMask == 1 &&
          this.listenItems[i].leftBoneValue != ""
        ) {
          // 左耳骨导 - 掩屏
          tempArr4.push(this.listenItems[i].leftBoneValue);
        } else {
          tempArr4.push(null);
        }
      }
      let series = [];
      if (tempArr1.length > 0) {
        series.push({
          data: tempArr1,
          type: "line",
          symbol: `image://${leftAir1}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3 },
          itemStyle: { color: "#EE6666" },
        });
      }
      if (tempArr2.length > 0) {
        series.push({
          data: tempArr2,
          type: "line",
          symbol: `image://${leftAir2}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3 },
          itemStyle: { color: "#EE6666" },
        });
      }
      if (tempArr3.length > 0) {
        series.push({
          data: tempArr3,
          type: "line",
          symbol: `image://${leftBone1}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3, type: "dashed" },
          itemStyle: { color: "#EE6666" },
        });
      }
      if (tempArr4.length > 0) {
        series.push({
          data: tempArr4,
          type: "line",
          symbol: `image://${leftBone2}`,
          symbolSize: 16,
          color: "#EE6666",
          connectNulls: true,
          lineStyle: { color: "#EE6666", width: 3, type: "dashed" },
          itemStyle: { color: "#EE6666" },
        });
      }
      tempArr1.push("");
      tempArr2.push("");
      tempArr3.push("");
      tempArr4.push("");
      // 绘制图表
      myChart.setOption({
        // title: { text: "听力级(dB)", left: "center" },
        //  symbol: `image://${myIcon}`,
        xAxis: {
          type: "category",
          data: this.chartsXArr,
          boundaryGap: false, // 关键设置
          splitLine: {
            show: true, // 关键：设置为 true
          },
          name: "频率Hz", // X轴名称
          nameLocation: "end", // 名称位置，可选 'start', 'middle', 'end'
          position: "bottom",
          offset: 0, // 保持默认偏移
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#333",
              width: 1,
            },
            onZero: false, // 设置为false避免与Y轴零值对齐问题
          },
          nameGap: 15,
        },
        yAxis: {
          type: "value",
          min: -10, // 最小值
          max: 120, // 最大值
          interval: 10, // 刻度间隔
          inverse: true, // 设置为true，Y轴反向
          name: "听力级(dB)", // X轴名称
          nameLocation: "start", // 名称位置，可选 'start', 'middle', 'end'
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          // 也可以设置名称与坐标轴之间的距离
          nameGap: 15,
        },
        series: series,
        /* series: [
          {
            data: ["10", "20", "60", "100", "65", "30"],
            type: "line",
            symbol: "emptyCircle",
            symbolSize: 16,
          },
        ], */
      });
    },
    // 听力图标绘制 - 右
    handleCreateRightEarChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.querySelector("#rightEarChart")
      );
      let tempArr1 = [""]; // 右耳气导 - 未掩
      let tempArr2 = [""]; // 右耳气导 - 掩蔽
      let tempArr3 = [""]; // 右耳骨导 - 未掩
      let tempArr4 = [""]; // 右耳骨导 - 掩蔽
      let tempArr5 = [""]; // 右耳气导 - 无应答
      let tempArr6 = [""]; // 右耳气导 - 无应答 + 掩蔽
      let tempArr7 = [""]; // 右耳骨导 - 无应答
      let tempArr8 = [""]; // 右耳骨导 - 无应答 + 掩蔽
      console.log(this.listenItems, "this.listenItems");
      for (let i = 0; i < this.listenItems.length; i++) {
        if (
          this.listenItems[i].rightAirMask == 0 &&
          this.listenItems[i].rightAirValue != ""
        ) {
          // 右耳气导 - 未掩
          tempArr1.push(this.listenItems[i].rightAirValue);
        } else {
          tempArr1.push(null);
        }
        if (
          this.listenItems[i].rightAirMask == 1 &&
          this.listenItems[i].rightAirValue != ""
        ) {
          // 右耳气导 - 掩屏
          tempArr2.push(this.listenItems[i].rightAirValue);
        } else {
          tempArr2.push(null);
        }
        if (
          this.listenItems[i].rightAirMask == 0 &&
          this.listenItems[i].rightAirValue == "无应答"
        ) {
          // 右耳气导 - 无应答
          tempArr5.push(this.listenItems[i].rightAirTemp);
        } else {
          tempArr5.push(null);
        }
        if (
          this.listenItems[i].rightAirMask == 1 &&
          this.listenItems[i].rightAirValue == "无应答"
        ) {
          // 右耳气导 - 无应答 + 掩蔽
          tempArr6.push(this.listenItems[i].rightBoneTemp);
        } else {
          tempArr6.push(null);
        }
        if (
          this.listenItems[i].rightBoneMask == 0 &&
          this.listenItems[i].rightBoneValue != ""
        ) {
          // 右耳骨导 - 未掩
          tempArr3.push(this.listenItems[i].rightBoneValue);
        } else {
          tempArr3.push(null);
        }
        if (
          this.listenItems[i].rightBoneMask == 1 &&
          this.listenItems[i].rightBoneValue != ""
        ) {
          // 右耳骨导 - 掩屏
          tempArr4.push(this.listenItems[i].rightBoneValue);
        } else {
          tempArr4.push(null);
        }
      }
      console.log(tempArr5, "tempArr5");
      let series = [];
      if (tempArr1.length > 0) {
        series.push({
          data: tempArr1,
          type: "line",
          symbol: `image://${rightAir1}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3 },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr2.length > 0) {
        series.push({
          data: tempArr2,
          type: "line",
          symbol: `image://${rightAir2}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3 },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr3.length > 0) {
        series.push({
          data: tempArr3,
          type: "line",
          symbol: `image://${rightBone1}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3, type: "dashed" },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr4.length > 0) {
        series.push({
          data: tempArr4,
          type: "line",
          symbol: `image://${rightBone2}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "#5470C6", width: 3, type: "dashed" },
          itemStyle: { color: "#5470C6" },
        });
      }
      if (tempArr5.length > 0) {
        series.push({
          data: tempArr5,
          type: "line",
          symbol: `image://${sssr}`,
          symbolSize: 16,
          color: "#5470C6",
          connectNulls: true,
          lineStyle: { color: "transparent", width: 0, type: "dashed" },
          itemStyle: { color: "#5470C6" },
        });
      }
      tempArr1.push("");
      tempArr2.push("");
      tempArr3.push("");
      tempArr4.push("");
      tempArr5.push("");
      // 绘制图表
      myChart.setOption({
        // title: { text: "听力级(dB)", left: "center" },
        //  symbol: `image://${myIcon}`,
        // 添加tooltip配置
        /* tooltip: {
          trigger: "item", // 触发方式，'item'表示数据项图形触发
          formatter: function (params) {
            // params包含当前数据点的信息
            // 获取x轴的值（频率）
            let xValue = params.name || "";
            // 获取y轴的值（听力级）
            let yValue = params.value || "";
            // 获取系列名称
            let seriesName = params.seriesName || "";
            // 自定义显示内容
            return `
          频率: ${xValue}Hz<br/>
          听力级: ${yValue}dB
        `;
          },
          backgroundColor: "rgba(255, 255, 255, 0.9)", // 背景色
          borderColor: "#ccc", // 边框颜色
          borderWidth: 1,
          textStyle: {
            color: "#333", // 文字颜色
            fontSize: 12,
          },
          padding: [8, 12], // 内边距
          extraCssText: "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);", // 添加阴影
        }, */
        xAxis: {
          type: "category",
          data: this.chartsXArr,
          boundaryGap: false, // 关键设置
          splitLine: {
            show: true, // 关键：设置为 true
          },
          name: "频率Hz", // X轴名称
          nameLocation: "end", // 名称位置，可选 'start', 'middle', 'end'
          position: "bottom",
          offset: 0, // 保持默认偏移
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#333",
              width: 1,
            },
            onZero: false, // 设置为false避免与Y轴零值对齐问题
          },
          nameGap: 15,
        },
        yAxis: {
          type: "value",
          min: -10, // 最小值
          max: 120, // 最大值
          interval: 10, // 刻度间隔
          inverse: true, // 设置为true，Y轴反向
          name: "听力级(dB)", // X轴名称
          nameLocation: "start", // 名称位置，可选 'start', 'middle', 'end'
          nameTextStyle: {
            // 名称的文本样式
            fontWeight: "bold",
            fontSize: 14,
          },
          // 也可以设置名称与坐标轴之间的距离
          nameGap: 15,
        },
        series: series,
        /* series: [
          {
            data: ["10", "20", "60", "100", "65", "30"],
            type: "line",
            symbol: "emptyCircle",
            symbolSize: 16,
          },
        ], */
      });
    },
    onVisibleChange() {
      this.$nextTick(() => {
        const dropdown = document.querySelector(".my-select-dropdown");
        // const dropdown = this.$refs.mySelect.$refs.popper;
        if (dropdown) {
          dropdown.style.zIndex = "9999";
        }
      });
    },
    // 弹窗打开时添加监听
    handleOpened() {
      document.addEventListener("keydown", this.handleKeydown);
    },
    // 弹窗关闭时移除监听
    handleClosed() {
      document.removeEventListener("keydown", this.handleKeydown);
    },
    // 键盘事件处理
    handleKeydown(e) {
      if (e.key === "Enter" || e.keyCode === 13) {
        this.handleGetDepartCheck();
        this.handleFocuscheckupWorkInput();
        this.showSummaryDia = false;
      }
    },
    handleCloseGuidance() {
      this.showGuidance = false; // 关闭叫号窗口
      this.showSmallGuidance = false; // 显示小浮窗
    },
    handleAgainShow() {
      this.showGuidance = true; // 关闭叫号窗口
      this.showSmallGuidance = false; // 显示小浮窗
    },
    handleHide(length) {
      this.showGuidance = false; // 关闭叫号窗口
      this.showSmallGuidance = true; // 显示小浮窗
      this.waitLength = length; // 显示小浮窗
    },
    handleNotreportAll(value) {
      console.log(value, "value");
      if (value == 0) {
        this.verifyItems.forEach((k) => {
          k.notreport = 0;
        });
      } else {
        this.verifyItems.forEach((k) => {
          k.notreport = 1;
        });
      }
    },
    handleLockDoctorcode(value) {
      let doctorItems =
        JSON.parse(localStorage.getItem("lockDoctorItems")) || [];
      if (value == 0) {
        if (doctorItems.length > 0) {
          let index = doctorItems.findIndex(
            (k) => k.code === this.chooseDepart.combinecode
          );
          if (index > -1) {
            doctorItems.splice(index, 1);
            localStorage.setItem(
              "lockDoctorItems",
              JSON.stringify(doctorItems)
            );
          }
        } else {
          localStorage.removeItem("lockDoctorItems");
        }
      } else {
        if (!this.summaryForm.doctorcode) {
          this.$message.warning("当前暂无检查医生 无法锁定");
          this.lockDoctorcode = 0;
          return;
        }
        if (doctorItems.length > 0) {
          let index = doctorItems.findIndex(
            (k) => k.code === this.chooseDepart.combinecode
          );
          if (index == -1) {
            doctorItems.push({
              code: this.chooseDepart.combinecode,
              doctorcode: this.summaryForm.doctorcode,
            });
            localStorage.setItem(
              "lockDoctorItems",
              JSON.stringify(doctorItems)
            );
          }
        } else {
          localStorage.setItem(
            "lockDoctorItems",
            JSON.stringify([
              {
                code: this.chooseDepart.combinecode,
                doctorcode: this.summaryForm.doctorcode,
              },
            ])
          );
        }
      }
    },
    // 核对确认-提交保存
    handleVerifyAndSubmit() {
      let notReportCombineImages = this.verifyItems.filter(
        (k) => k.notreport == 1
      );
      /* if (notReportCombineImages.length == 0) {
        this.$message.warning("请先选中需提交组合!");
        return;
      } */
      UpdatVerification({
        regid: this.personalForm.regid,
        status: 1,
        notReportCombineImages:
          notReportCombineImages.length > 0
            ? notReportCombineImages.map((k) => k.sourcecode).join(",")
            : "",
      }).then((res) => {
        this.checkupWork = this.personalForm.regid;
        this.$message.success(res.message);
        this.handleVerifyAndClose();
        this.handleGetDepartCheck();
      });
    },
    // 核对确认-查看图片
    handleCheckVerifyImg(item, index) {
      if (!item) return;
      if (this.verifyActive == item.sourcecode + index) return;
      this.verifyActive = item.sourcecode + index;
      getFiles({ Id: item.fileid }).then((res) => {
        this.verifyChoose = res.result.fileUrl;
        this.verifySrcList = [res.result.fileUrl];
      });
    },
    // 核对确认
    handleVerifyAndConfirm() {
      CombineImage({
        regid: this.personalForm.regid,
        viewGroup: "2,3",
      }).then((res) => {
        console.log(res);
        if (res.result && res.result.length > 0) {
          this.verifyItems = res.result;
          this.showVerifyAndConfirm = true;
        } else {
          UpdatVerification({
            regid: this.personalForm.regid,
            status: 1,
            notReportCombineImages: "",
          }).then((res) => {
            this.checkupWork = this.personalForm.regid;
            this.$message.success(res.message);
            this.handleGetDepartCheck();
          });
        }
      });
      return;
      this.$confirm(`是否需要附报告?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          CombineImage({
            regid: this.personalForm.regid,
            viewGroup: "2,3",
          }).then((res) => {
            console.log(res);
            if (res.result && res.result.length > 0) {
              this.verifyItems = res.result;
              this.showVerifyAndConfirm = true;
            } else {
              UpdatVerification({
                regid: this.personalForm.regid,
                status: 1,
                notReportCombineImages: "",
              }).then((res) => {
                this.checkupWork = this.personalForm.regid;
                this.$message.success(res.message);
                this.handleGetDepartCheck();
              });
            }
          });
        })
        .catch(() => {
          UpdatVerification({
            regid: this.personalForm.regid,
            status: 1,
            notReportCombineImages: "",
          }).then((res) => {
            this.checkupWork = this.personalForm.regid;
            this.$message.success(res.message);
            this.handleGetDepartCheck();
          });
        });
    },
    // 核对确认弹框关闭
    handleVerifyAndClose() {
      this.showVerifyAndConfirm = false;
      this.verifyItems = [];
      this.verifyActive = "";
      this.verifyChoose = "";
      this.verifySrcList = [];
    },
    // 备注保存
    handleAlterFields() {
      if (!this.personalForm.regid) {
        this.$message.warning("请先查询人员信息!");
        return false;
      }
      let data = [
        {
          key: "regid",
          value: this.personalForm.regid,
        },
        {
          key: "departcheckremark",
          value: this.personalForm.departcheckremark,
        },
      ];
      AlterFields(data).then((res) => {
        this.checkupWork = this.personalForm.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
      });
    },
    // 文件导入上传
    handleChangeUpload(file, fileList) {
      let data = new FormData();
      data.append("files", file.raw);
      setFilesUpload(data).then((res1) => {
        let fileObj = res1.result[0];
        if (fileObj) {
          const loading = this.$loading({
            lock: true,
            text: "正在检测文件中,请稍候",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.5)",
          });
          // 检查文件
          ImportCheckEyeData({ fileId: fileObj.id })
            .then((res2) => {
              loading.close();
              let isCheckEye = res2.result;
              if (isCheckEye && isCheckEye.length > 0) {
                this.$confirm(
                  isCheckEye.join(`,<br/>`),
                  "未查到下列人员登记信息",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    dangerouslyUseHTMLString: true,
                    customClass: "isCheckEye_tips",
                    type: "warning",
                  }
                )
                  .then(() => {
                    ImportEyeDataSave({ fileId: fileObj.id }).then((res) => {
                      this.$message.success(res.message || res.msg);
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消导入",
                    });
                  });
              } else {
                ImportEyeDataSave({ fileId: fileObj.id }).then((res) => {
                  this.$message.success(res.message || res.msg);
                });
              }
            })
            .catch((err) => {
              loading.close();
            });
        } else {
          this.$message.warning("文件导入有误!");
        }
      });
    },
    handleUpdateVerification(status) {
      if (
        (status == 0 && this.personalForm.status == 3) ||
        (status == 1 && this.personalForm.status == 5) ||
        this.personalForm.status >= 6
      ) {
        this.$message.warning("当前状态不允许操作!");
        return false;
      }
      /* let combineitems = [];
      for (let i = 0; i < this.departitems.length; i++) {
        combineitems.push(...this.departitems[i].combineitems);
      }
      combineitems = combineitems.map((k) => k.isconclusion);
      if (combineitems.includes(false)) {
        this.$message.warning("当前人包含未保存项目不允许操作!");
        return false;
      } */
      UpdatVerification({
        regid: this.personalForm.regid,
        status,
      }).then((res) => {
        this.checkupWork = this.personalForm.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
      });
    },
    handleUpdateMedicalHistoryInfo() {
      UpdateMedicalHistoryInfo({
        regid: this.chooseCombine.regid,
        combinecode: this.chooseCombine.combinecode,
        medicalhistorydes: this.medicalhistory,
      }).then((res) => {
        this.$message.success(res.message);
        this.medicalhistory = "";
        this.showMedicalhistory = false;
      });
    },
    handleTriagSex(sex) {
      if (!this.triagData.roomcode) {
        this.$messgae.warning("请先配置科室");
        return;
      }
      this.isShowSex = sex;
      TriagSave({
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
        roomstatus: this.triagData.roomstatus,
        roomsex: sex == 1 ? this.userInfo.sex : 0,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "已选择",
        });
        this.handleTriagDetail();
      });
    },
    handleCloseTriag() {
      if (this.triagData.roomstatus == 0) {
        this.$confirm(`${this.triagData.roomname}诊室 是否停诊？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showClose: false,
          closeOnClickModal: false,
        })
          .then(() => {
            TriagClose({
              roomcode: this.triagData.roomcode,
              queuecode: this.triagData.queuecode,
            }).then((res) => {
              this.$message.success(res.message);
              this.triagData = {};
              this.showTriageDia = false;
            });
          })
          .catch(() => {
            this.triagData = {};
            this.showTriageDia = false;
          });
      } else {
        this.triagData = {};
        this.showTriageDia = false;
      }
    },
    // 发送和接收消息
    handdleMsg(msg) {
      let that = this;
      if (that.$global.ws && that.$global.ws.readyState == 1) {
        that.$global.ws.send(msg);
      }
      that.$global.ws.onmessage = function (msg) {
        console.log("收到服务器内容", msg);
        if (msg.data != "连接成功" && JSON.parse(msg.data)) {
          const data = JSON.parse(msg.data);
          console.log("收到data", data);
          if (data.isLoginOut) {
            that
              .$confirm("此账号已在别处登录!", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                type: "warning",
              })
              .then(() => {
                that.$store.dispatch("LogOut").then(() => {
                  localStorage.removeItem("userId");
                  location.reload(); // 为了重新实例化vue-router对象 避免bug
                  // socketService.close();
                });
              })
              .catch(() => {});
          } else if (
            data.Fingercode &&
            data.Fingercode == localStorage.getItem("md5code")
          ) {
            if (data.ItemList && data.ItemList.length > 0) {
              for (let i = 0; i < that.chooseProjectArr.length; i++) {
                let index = data.ItemList.findIndex(
                  (k) => k.itemcode === that.chooseProjectArr[i].itemcode
                );
                if (index > -1) {
                  that.chooseProjectArr[i].result = data.ItemList[index].result;
                  that.chooseProjectArr[i].describe =
                    data.ItemList[index].describe;
                }
              }
              for (let i = 0; i < that.chooseDepart.items.length; i++) {
                let index = data.ItemList.findIndex(
                  (k) => k.itemcode === that.chooseDepart.items[i].itemcode
                );
                if (index > -1) {
                  that.chooseDepart.items[i].result =
                    data.ItemList[index].result;
                  that.chooseDepart.items[i].describe =
                    data.ItemList[index].describe;
                }
              }
              that.handleGetConclusionDetail();
            }
          } else if (data.businessType == "Customer_triag_queueRoom") {
            that.queuePaiDuiList = data.RoomPaiDuiList.map((k) => {
              return {
                ...k,
                id: k.Id,
              };
            });
            that.completeList = data.CompleteList.map((k) => {
              return {
                ...k,
                id: k.Id,
              };
            });
            that.guohaoList = data.GuohaoList.map((k) => {
              return {
                ...k,
                id: k.Id,
              };
            });
          }
        }
      };
    },
    jsonSf(data) {
      return JSON.stringify(data);
    },
    handleNextShowFinish() {
      this.handleTriagCall();
      this.handleCloseShowFinish();
    },
    handleCloseShowFinish() {
      this.finishTriag = {};
      this.showFinish = false;
    },
    // 点击叫号回调
    handleTriagCall(row) {
      if (row && row.id) {
        TriagCall({
          id: row.id || "",
          roomcode: row.roomcode,
          queuecode: row.queuecode,
        }).then((res) => {
          if (!res.result) return;
          this.currentTriag = res.result;
          this.$message.success(res.message);
        });
      } else {
        TriagCall({
          id: this.currentTriag.id || "",
          roomcode: this.triagData.roomcode,
          queuecode: this.triagData.queuecode,
        }).then((res) => {
          if (!res.result) {
            this.currentTriag = {};
            return;
          }
          this.currentTriag = res.result;
          this.$message.success(res.message);
        });
      }
    },
    // 点击过号(跳号)回调
    handleTriagSkip() {
      if (!this.currentTriag.id) {
        this.$message.warning("当前暂无需要过号人员!");
        return;
      }
      TriagSkip({
        id: this.currentTriag.id,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleTriagDetail();
      });
    },
    // 点击完成回调
    handleTriagComplete() {
      // this.showFinish = true;
      if (!this.currentTriag.id) {
        this.$message.warning("当前暂无人员!");
        return;
      }
      TriagComplete({ id: this.currentTriag.id }).then((res) => {
        if (!res.result) return;
        this.finishTriag = res.result;
        this.showFinish = true;
      });
    },
    // 点击打开导诊弹框
    handleOpenTriagDia() {
      TriagDetail().then((res) => {
        res.result && (this.triagData = res.result);
        this.showTriageDia = true;

        // this.handdleMsg(
        //   this.jsonSf({
        //     action: "join",
        //     nick: this.userInfo.usercode,
        //     roomno: "Customer_triag_queueRoom",
        //   })
        // );
      });
    },
    // 点击开诊回调
    handleTriagOpen() {
      if (!this.triagData.roomcode) {
        this.$message.warning("当前暂无科室数据");
        return;
      }
      TriagOpen({
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleTriagDetail();
      });
    },
    // 点击停诊回调
    handleTriagClose() {
      if (!this.triagData.roomcode) {
        this.$message.warning("当前暂无科室数据");
        return;
      }
      TriagClose({
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleTriagDetail();
      });
    },
    // 获取医生当天诊室
    handleTriagDetail() {
      TriagDetail().then((res) => {
        if (!res.result) return;
        this.triagData = res.result;
        // roomstatus 0- 开诊 1-开停
      });
    },
    // 获取科室列表配置数据
    handleShowDepart() {
      LoadTriagRoom({
        page: 1,
        limit: 100000,
        key: this.tetopRetrieval.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.tediaTableData = [];
            return;
          }
          this.tediaTableData = res.data;
          this.showDepart = true;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取诊室字典数据列表回调
    handleLoadRoomList() {
      this.loading = true;
      LoadTriagRoom({
        page: 1,
        limit: 100000,
        key: this.tetopRetrieval.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.tediaTableData = [];
            return;
          }
          this.tediaTableData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /* 点击选中当前科室 */
    handleChooseTediaTableData(row) {
      this.$confirm(`当前选择的科室为【${row.name}】, 是否确认?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          TriagSave({
            roomcode: row.code,
            queuecode: row.queuecode,
            roomstatus: 1,
            roomsex: row.sexcontrol,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "已选择",
            });
            this.showDepart = false;
            this.handleTriagDetail();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleImageTextPrint() {
      let data = {
        fingercode: localStorage.getItem("md5code"),
        repname: "1、图文报告单",
        printflag: 1,
        whereitems: [
          {
            key: "regid",
            value: this.chooseCombine.regid,
          },
          {
            key: "combinecode",
            value: this.chooseCombine.combinecode,
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
    // 回车跳转下一个结果
    handleJumpNextInput(item) {
      if (!item) return;
      let dom = document.querySelector(`.enterInput_${item.$index + 1}`);
      if (!dom) return;
      // 是否禁用 $(dom).is(":disabled")
      dom.focus();
    },
    // 键盘↓键跳转结果回调
    handleDiscountLower(e, item) {
      this.$nextTick(() => {
        if (item.$index === this.chooseDepart.items.length - 1) return;
        let pDom = document.querySelector(`.enterInput_${item.$index + 1}`);
        if (!pDom) return;
        if (this.chooseDepart.viewgroup == 3) {
          pDom.childNodes[0].focus();
        } else {
          pDom.focus();
        }
      });
    },
    // 键盘↑键跳转结果回调
    handleDiscountUpper(e, item) {
      this.$nextTick(() => {
        if (item.$index === 0) return;
        let pDom = document.querySelector(`.enterInput_${item.$index - 1}`);
        if (!pDom) return;
        if (this.chooseDepart.viewgroup == 3) {
          pDom.childNodes[0].focus();
        } else {
          pDom.focus();
        }
      });
    },
    // 小结确认按钮回调
    handleConfirmConclusion() {
      this.handleGetDepartCheck();
      this.handleFocuscheckupWorkInput();
      this.showSummaryDia = false;
    },
    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.checkupWorkInput.focus();
      });
    },
    // 刷新重新获取详情接口
    handleRefreshDetails() {
      if (!this.personalForm.regid) {
        this.$message.warning("暂无人员数据更新!");
        return false;
      }
      this.loadingObj = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.handleGetDepartCheck(this.personalForm.regid);
    },
    // 获取今天日期
    handleGetToday() {
      let today = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.triageTime = [`${today} 00:00:00`, `${today} 23:59:59`];
    },
    // 取消审核弹框提交
    handleSubmitToExamine() {
      if (!this.reason) {
        this.$message.warning("请填写取消原因!");
        return false;
      }
      let combineitems = [
        {
          deptcode: this.chooseDepart.deptcode,
          deptname: this.chooseDepart.deptname,
          combinecode: this.chooseDepart.combinecode,
          combinename: this.chooseDepart.combinename,
        },
      ];
      let data = {
        regid: this.personalForm.regid,
        checkno: this.personalForm.checkno,
        reason: this.reason,
        combineitems: combineitems,
      };
      getCancelCheckPage(data).then((res) => {
        this.checkupWork = res.result.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
        this.handleCancelToExamine();
      });
    },
    // 取消审核弹框关闭
    handleCancelToExamine() {
      this.reason = "";
      this.showToExamine = false;
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
    // 上传触发回调
    handleOnPpload(file, fileList) {
      let types = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      const isImage = types.includes(file.raw.type);
      if (!isImage) {
        this.$message.error(
          "只能上传图片文件/PDF文件，上传图片只能是 JPG、JPEG、PNG 格式!"
        );
        return false;
      }
      let data = new FormData();
      data.append("files", file.raw);
      setUploadPdfToImage(data).then((res) => {
        if (!res.result) return;
        res.result.length > 0 &&
          res.result.forEach((k) => {
            this.fileList.push({
              fileid: k.id,
              imgname: k.fileName,
              url: k.fileUrl,
              source: "",
              sourcefileurl: "",
              updated: true,
            });
            this.previewImageList.push(k.fileUrl);
          });
      });
      /* setFilesUpload(data).then((res) => {
        this.fileList.push({
          fileid: res.result[0].id,
          imgname: res.result[0].fileName,
          url: res.result[0].fileUrl,
          source: "",
          sourcefileurl: "",
          updated: true,
        });
        this.previewImageList.push(res.result[0].fileUrl);
      }); */
    },
    // 移除图片列表
    handleRemove(file, fileList) {
      // 删除文件
      this.fileList.forEach((k, i) => {
        if (k.fileid === file.fileid) {
          this.fileList.splice(i, 1);
        }
      });
      // 删除预览列表
      this.previewImageList.forEach((k, i) => {
        if (k === file.url) {
          this.previewImageList.splice(i, 1);
        }
      });
      // setFilesDelete([file.fileid]).then((res) => {
      //   this.$message.success(res.message);
      //   this.fileList.forEach((k, i) => {
      //     if (k.fileid === file.fileid) {
      //       this.fileList.splice(i, 1);
      //     }
      //   });
      // });
    },
    // 预览图片
    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      // this.previewImageList = this.fileList.map((k) => {
      //   return k.url;
      // });
      // this.dialogVisible = true;
    },
    // 显示调查问卷
    handleShowQuestionnaire() {
      if (!this.personalForm.regid) {
        this.$message.warning("请先查询人员信息!");
        return false;
      }
      this.showQuestionnaire = true;
    },
    // 关闭调查问卷
    handleCloseQuestionnaire() {
      this.showQuestionnaire = false;
    },
    // 点击图像信息
    handleShowImageInfoFlag() {
      this.imageInfoFlag = true;
    },
    // 分诊弹框弹出回调
    handleTriageOpen() {
      this.showTriage = true;
      this.handleGetPersonnelList();
    },
    // 分诊弹框关闭回调
    handleTriageCancel() {
      this.personnelList = [];
      this.radios = "0";
      this.personnelStatus = "0";
      this.showTriage = false;
      this.handleGetToday();
    },
    // 选择排队回调
    personnelBtn(val) {
      if (val === "0") {
        this.handleTabsPersonnelStatus("0");
      }
      if (val === "1") {
        this.handleTabsPersonnelStatus("1");
      }
      if (val === "2") {
        this.handleTabsPersonnelStatus("2");
      }
    },
    // 主页删除按钮删除科室检查结果数据
    handleDelDepart() {
      if (!this.chooseDepart) {
        this.$message.warning("请先选择需要删除的数据!");
        return false;
      }
      this.$confirm("此操作将删除当前结果, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setDepartDelete({
            regid: this.personalForm.regid,
            checkno: this.personalForm.checkno,
            combinecode: this.chooseDepart.combinecode,
          }).then((res) => {
            this.checkupWork = res.result.regid;
            this.$message.success(res.message);
            this.isDel = true;
            // this.$reload();
            this.handleGetDepartCheck();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // Echarts弹框打开结束回调
    handleShowEchartsOpened() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector("#myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "数 据 对 比", left: "center" },
        tooltip: {},
        xAxis: {
          data: this.echartDate,
        },
        yAxis: {},
        color: ["#5470c6"],
        series: [
          {
            name: "销量",
            type: "line",
            data: this.echartNumber,
          },
        ],
      });
    },
    // 检验类点击数据行查看Echarts
    handleCheckEcharts(row) {
      getResultCompare({
        regid: this.chooseDepart.regid,
        checkno: this.personalForm.checkno,
        combinecode: this.chooseDepart.combinecode,
        itemcode: row.itemcode,
      }).then((res) => {
        res.result.forEach((k) => {
          this.echartDate.push(k.checkdate);
          this.echartNumber.push(+k.result);
        });
        this.showEcharts = true;
      });
    },
    // 检验类点击数据行关闭Echarts
    handleEchartsCancel() {
      this.echartDate = [];
      this.echartNumber = [];
      this.showEcharts = false;
    },
    // 推荐弹框添加到专科建议
    handleAddProposal() {
      if (this.recommendSelect.length == 0) {
        this.$message.warning("请先勾选需要添加的专科建议!");
        return false;
      }
      let str = "";
      this.recommendSelect.forEach((k) => {
        str += `${k.specialistadvice}\r\n`;
        // if (this.specialistadvice == "") {
        //   this.specialistadvice += `${k.specialistadvice}\r\n`;
        // } else {
        //   this.specialistadvice += `\r\n${k.specialistadvice}`;
        // }
      });
      this.specialistadvice = str;
      this.handleRecommendCancel();
    },
    // 推荐弹框添加到小结
    handleAddSummary() {
      if (this.recommendSelect.length == 0) {
        this.$message.warning("请先勾选需要添加的小结!");
        return false;
      }
      let str = "";
      this.recommendSelect.forEach((k) => {
        str += `${k.conclusion}\r\n`;
        // if (this.conclusion == "") {
        //   this.conclusion += `${k.conclusion}\r\n`;
        // } else {
        //   this.conclusion += `\r\n${k.conclusion}`;
        // }
      });
      this.conclusion = str;
      this.handleRecommendCancel();
    },
    // 推荐弹框列表点击事件
    handleChooseRecommend(rows) {
      this.recommendSelect = rows;
    },
    // 推荐按钮点击回调
    handleRecommendOpen() {
      this.imageInfoFlag = false;
      let data = {
        regid: this.chooseDepart.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.chooseDepart.sex,
        deptcode: this.chooseDepart.deptcode,
        deptname: this.chooseDepart.deptname,
        viewgroup: this.chooseDepart.viewgroup,
        resulttype: this.chooseDepart.resulttype,
        checkflag: this.chooseDepart.checkflag,
        checkcode: this.chooseDepart.checkcode,
        checkname: this.chooseDepart.checkname,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion:
          (this.summaryObj && this.summaryObj.conclusion) ||
          this.conclusion ||
          "",
        specialistadvice:
          (this.summaryObj && this.summaryObj.specialistadvice) ||
          this.specialistadvice ||
          "",
        healthadvice: (this.summaryObj && this.summaryObj.healthadvice) || "",
        dietadvice: (this.summaryObj && this.summaryObj.dietadvice) || "",
        sportsadvice: (this.summaryObj && this.summaryObj.sportsadvice) || "",
        healthknowledge:
          (this.summaryObj && this.summaryObj.healthknowledge) || "",
        doctorcode: (this.summaryForm && this.summaryForm.doctorcode) || "",
        doctorname: (this.summaryForm && this.summaryForm.doctorname) || "",
        items: this.chooseProjectArr,
        worditems: this.entryData,
      };
      getRecommend(data).then((res) => {
        if (res.code == 200) {
          this.recommendData = res.result;
          this.showRecommend = true;
        }
      });
    },
    // 推荐弹框关闭回调
    handleRecommendCancel() {
      this.showRecommend = false; // 推荐弹框显示控制
      this.recommendData = []; // 推荐弹框表格列表数据
      this.recommendSelect = []; // 推荐弹框表格选中数据
    },
    // 新增/编辑弹框提交回调
    handleSubmitAddOrEdit() {
      if (!this.dKeyword) {
        this.$message.warning("请先填写关键字!");
        return false;
      }
      if (!this.dProposal) {
        this.$message.warning("请先填写建议!");
        return false;
      }
      let data = undefined;
      if (this.specialisFlag == "add") {
        data = {
          code: "",
          name: this.dKeyword,
          typeid: "commom",
          typename: "commom",
          icdcode: "",
          icdname: "",
          sex: 0,
          flag: 0,
          healthadvice: this.dProposal,
          healthknowledge: "",
          dietadvice: "",
          sportsadvice: "",
          seqno: "",
          advicetype: 1,
        };
      } else {
        this.chooseSpecialis.name = this.dKeyword;
        this.chooseSpecialis.healthadvice = this.dProposal;
        data = this.chooseSpecialis;
      }
      setSubmitSpecialis(data).then((res) => {
        this.$message.success(res.message);
        this.chooseSpecialis = undefined;
        this.handleGetAddSpecialis();
        this.handleAddOrEditClose();
      });
    },
    // 新增/编辑弹框关闭回调
    handleAddOrEditClose() {
      this.dKeyword = ""; // 新增/编辑弹出层关键字
      this.dProposal = ""; // 新增/编辑弹出层建议
      this.showAddOrEdit = false;
    },
    // 专科建议弹出层删除回调
    handleDelSpecialis() {
      if (!this.chooseSpecialis) {
        this.$message.warning("请先选择删除数据!");
        return false;
      }
      setDelSpecialis([this.chooseSpecialis.code]).then((res) => {
        this.$message.success(res.message);
        this.handleGetAddSpecialis();
      });
    },
    // 专科建议弹出层编辑回调
    handleEditSpecialis() {
      if (!this.chooseSpecialis) {
        this.$message.warning("请先选择需编辑数据!");
        return false;
      }
      this.specialisFlag = "edit";
      this.dKeyword = this.chooseSpecialis.name; // 新增/编辑弹出层关键字
      this.dProposal = this.chooseSpecialis.healthadvice; // 新增/编辑弹出层建议
      this.showAddOrEdit = true;
    },
    // 专科建议弹出层确认回调
    handleConfirmSpecialis() {
      if (!this.chooseSpecialis) {
        this.$message.warning("请先选择需添加专科建议!");
        return false;
      }
      // if (this.specialistadvice == "") {
      //   this.specialistadvice = `${this.chooseSpecialis.healthadvice}\r\n`;
      // } else {
      //   this.specialistadvice += `\r\n${this.chooseSpecialis.healthadvice}`;
      // }
      this.specialistadvice += `${this.chooseSpecialis.healthadvice}；`;
      this.handleSpecialisCancel();
    },
    // 专科建议弹出层保存回调
    handleSubmitSpecialis() {
      if (!this.chooseSpecialis) {
        this.$message.warning("请先新增/编辑数据!");
        return false;
      }
      setSubmitSpecialis(this.chooseSpecialis).then((res) => {
        this.$message.success(res.message);
        this.chooseSpecialis = undefined;
        this.handleGetAddSpecialis();
      });
    },
    // 专科建议新增按钮回调
    handlePlusSpecialis() {
      this.showAddOrEdit = true;
      this.specialisFlag = "add";
    },
    // 专科建议选中数据行回调
    handleChooseSpecialis(row) {
      this.chooseSpecialis = JSON.parse(JSON.stringify(row));
    },
    // 新增专科建议展示弹框回调
    handleAddSpecialis() {
      this.imageInfoFlag = false;
      this.showSpecialis = true;
      this.handleGetAddSpecialis();
    },
    // 专科建议表格列表数据回调
    handleGetAddSpecialis() {
      getAddSpecialis({
        tp: "Person",
        typeid: "",
        keyWord: "",
        advicetype: 1,
      }).then((res) => {
        this.specialisData = res.result;
      });
    },
    // 新增专科建议关闭弹框回调
    handleSpecialisCancel() {
      this.showSpecialis = false;
      this.chooseSpecialis = undefined;
      this.specialisFlag = "add"; // 新增编辑标识
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
    // 输入框值监听回调
    handleInputChange(item) {
      clearTimeout(this.timeID);
      this.timeID = setTimeout(() => {
        let tempArr = [];
        let index = 0;
        index = this.chooseProjectArr.findIndex(
          (k) => k.itemcode == item.itemcode
        );
        if (item.result == "") {
          tempArr = [];
        } else {
          item.itemvalueitems.map((k, i) => {
            if (item.result.split("；").includes(k.conclusion)) {
              tempArr.push(k);
            }
          });
        }
        if (index != -1) {
          this.chooseProjectArr[index].result = item.result;
          this.chooseProjectArr[index].itemvalueitems = tempArr;
        }
        this.handleGetDefaultConclusion();
      }, 400);
    },
    // 页面人员取消弃检回调
    handleGetGiveUpCheckCancel() {
      if (!this.chooseDepart) {
        this.$message.warning("请选择需要弃检的项目!");
        return false;
      }
      setDepartCheckGiveUpCancel({
        regid: this.personalForm.regid,
        checkno: this.personalForm.checkno,
        combinecode: this.chooseDepart.combinecode,
      }).then((res) => {
        this.checkupWork = res.result.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
        // this.$reload(); // 重置页面
      });
    },
    // 页面人员弃检回调
    handleGetGiveUpCheck() {
      if (!this.chooseDepart) {
        this.$message.warning("请选择需要弃检的项目!");
        return false;
      }
      setDepartCheckGiveUp({
        regid: this.personalForm.regid,
        checkno: this.personalForm.checkno,
        combinecode: this.chooseDepart.combinecode,
      }).then((res) => {
        this.checkupWork = res.result.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
        // this.$reload(); // 重置页面
      });
    },
    // 页面提取结果回调
    handleSetDepartCheckGetResultSingle() {
      if (!this.chooseDepart) {
        this.$message.warning("请选择需要提取结果的项目!");
        return false;
      }
      GetResultFlag({
        regid: this.personalForm.regid,
        combinecode: this.chooseDepart.combinecode,
      }).then((res) => {
        this.checkupWork = res.result.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
      });
    },
    // 页面提取结果回调
    handleSetDepartCheckGetResult() {
      if (!this.chooseDepart) {
        this.$message.warning("请选择需要提取结果的项目!");
        return false;
      }
      GetResultFlag({
        regid: this.personalForm.regid,
      }).then((res) => {
        this.checkupWork = res.result.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
      });
    },
    // 页面项目审核回调
    handleGetCheckPage() {
      if (!this.chooseDepart) {
        this.$message.warning("请选择需要审核的项目!");
        return false;
      }
      let combineitems = [
        {
          deptcode: this.chooseDepart.deptcode,
          deptname: this.chooseDepart.deptname,
          combinecode: this.chooseDepart.combinecode,
          combinename: this.chooseDepart.combinename,
        },
      ];
      let data = {
        regid: this.personalForm.regid,
        checkno: this.personalForm.checkno,
        combineitems: combineitems,
      };
      getCheckPage(data).then((res) => {
        this.checkupWork = res.result.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
        // this.$reload(); // 重置页面
      });
    },
    // 点击提交按钮提交保存科室检查 - 听力
    handleSubmitPageListenSave() {
      if (!this.chooseDepart || this.personalForm.confirmdoctorcode)
        return false;
      this.saveLoading = true;
      let imageitems = this.fileList.map((k) => {
        return {
          fileid: k.fileid,
          imgname: k.imgname,
          updated: k.updated,
          source: k.source || "",
          sourcefileurl: k.sourcefileurl || "",
          sourcecode: this.chooseDepart.combinecode,
        };
      });
      let data = {
        regid: this.chooseDepart.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.chooseDepart.sex,
        deptcode: this.chooseDepart.deptcode,
        deptname: this.chooseDepart.deptname,
        viewgroup: this.chooseDepart.viewgroup,
        resulttype: this.chooseDepart.resulttype,
        checkflag: this.chooseDepart.checkflag,
        inputdate: (this.summaryForm && this.summaryForm.inputdate) || "",
        checkcode: this.chooseDepart.checkcode,
        checkname: this.chooseDepart.checkname,
        critiitems: this.critiitems,
        handersubmit: 1,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion:
          this.conclusion ||
          (this.summaryObj && this.summaryObj.conclusion) ||
          "",
        specialistadvice:
          (this.summaryObj && this.summaryObj.specialistadvice) ||
          this.specialistadvice ||
          "",
        healthadvice: (this.summaryObj && this.summaryObj.healthadvice) || "",
        dietadvice: (this.summaryObj && this.summaryObj.dietadvice) || "",
        sportsadvice: (this.summaryObj && this.summaryObj.sportsadvice) || "",
        healthknowledge:
          (this.summaryObj && this.summaryObj.healthknowledge) || "",
        doctorcode: (this.summaryForm && this.summaryForm.doctorcode) || "",
        doctorname: (this.summaryForm && this.summaryForm.doctorname) || "",
        items: this.chooseProjectArr,
        worditems: this.entryData,
        imageitems,
        listenItems: this.listenItems,
        listenAvgItems: this.listenAvgItems,
      };
      getSubmitPageListenSave(data)
        .then((res) => {
          this.checkupWork = res.result.regid;
          this.$message.success(res.message);
          // this.handleGetDepartCheck();
          // this.handleFocuscheckupWorkInput();
          this.showSummaryDia = true;
          this.imageInfoFlag = false;
          this.saveLoading = false;
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    // 点击提交按钮提交保存科室检查
    handleSubmitPage() {
      if (!this.chooseDepart || this.personalForm.confirmdoctorcode)
        return false;
      this.saveLoading = true;
      let imageitems = this.fileList.map((k) => {
        return {
          fileid: k.fileid,
          imgname: k.imgname,
          updated: k.updated,
          source: k.source || "",
          sourcefileurl: k.sourcefileurl || "",
          sourcecode: this.chooseDepart.combinecode,
        };
      });
      let data = {
        regid: this.chooseDepart.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.chooseDepart.sex,
        deptcode: this.chooseDepart.deptcode,
        deptname: this.chooseDepart.deptname,
        viewgroup: this.chooseDepart.viewgroup,
        resulttype: this.chooseDepart.resulttype,
        checkflag: this.chooseDepart.checkflag,
        inputdate: (this.summaryForm && this.summaryForm.inputdate) || "",
        checkcode: this.chooseDepart.checkcode,
        checkname: this.chooseDepart.checkname,
        critiitems: this.critiitems,
        handersubmit: 1,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion:
          this.conclusion ||
          (this.summaryObj && this.summaryObj.conclusion) ||
          "",
        specialistadvice:
          (this.summaryObj && this.summaryObj.specialistadvice) ||
          this.specialistadvice ||
          "",
        healthadvice: (this.summaryObj && this.summaryObj.healthadvice) || "",
        dietadvice: (this.summaryObj && this.summaryObj.dietadvice) || "",
        sportsadvice: (this.summaryObj && this.summaryObj.sportsadvice) || "",
        healthknowledge:
          (this.summaryObj && this.summaryObj.healthknowledge) || "",
        doctorcode: (this.summaryForm && this.summaryForm.doctorcode) || "",
        doctorname: (this.summaryForm && this.summaryForm.doctorname) || "",
        items: this.chooseProjectArr,
        worditems: this.entryData,
        imageitems,
      };
      // return;
      getSubmitPage(data)
        .then((res) => {
          this.checkupWork = res.result.regid;
          this.$message.success(res.message);
          // this.handleGetDepartCheck();
          // this.handleFocuscheckupWorkInput();
          this.showSummaryDia = true;
          this.imageInfoFlag = false;
          this.saveLoading = false;
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    // 点击提交按钮提交保存科室检查
    handleSubmitPageAndReset() {
      if (!this.chooseDepart) return false;
      this.saveLoading = true;
      let imageitems = this.fileList.map((k) => {
        return {
          fileid: k.fileid,
          imgname: k.imgname,
          updated: k.updated,
          source: k.source || "",
          sourcefileurl: k.sourcefileurl || "",
          sourcecode: this.chooseDepart.combinecode,
        };
      });
      let data = {
        regid: this.chooseDepart.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.chooseDepart.sex,
        deptcode: this.chooseDepart.deptcode,
        deptname: this.chooseDepart.deptname,
        viewgroup: this.chooseDepart.viewgroup,
        resulttype: this.chooseDepart.resulttype,
        checkflag: this.chooseDepart.checkflag,
        inputdate: (this.summaryForm && this.summaryForm.inputdate) || "",
        checkcode: this.chooseDepart.checkcode,
        checkname: this.chooseDepart.checkname,
        critiitems: this.critiitems,
        handersubmit: 1,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion:
          this.conclusion ||
          (this.summaryObj && this.summaryObj.conclusion) ||
          "",
        specialistadvice:
          (this.summaryObj && this.summaryObj.specialistadvice) ||
          this.specialistadvice ||
          "",
        healthadvice: (this.summaryObj && this.summaryObj.healthadvice) || "",
        dietadvice: (this.summaryObj && this.summaryObj.dietadvice) || "",
        sportsadvice: (this.summaryObj && this.summaryObj.sportsadvice) || "",
        healthknowledge:
          (this.summaryObj && this.summaryObj.healthknowledge) || "",
        doctorcode: (this.summaryForm && this.summaryForm.doctorcode) || "",
        doctorname: (this.summaryForm && this.summaryForm.doctorname) || "",
        items: this.chooseProjectArr,
        worditems: this.entryData,
        imageitems,
      };
      // return;
      getSubmitPage(data)
        .then((res) => {
          this.$message.success(res.message);
          setTimeout(() => {
            this.$reload();
          }, 1000);
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    // 小结医生切换回调
    handleChangeDoctor(value) {
      let index = this.doctoritems.filter(
        (k) => k.code == this.summaryForm.doctorcode
      )[0];
      if (index) {
        this.summaryForm.doctorname = index.name;
      } else {
        this.summaryForm.doctorname = value;
      }
    },
    // 结论词确认提交回调
    handleConclusionSubmit() {
      if (!this.chooseClusion) {
        this.$message.warning("请先选择结论词!");
        return false;
      }
      let flag = this.entryData.findIndex(
        (k) => k.wordcode == this.chooseClusion.conid
      );
      if (flag == -1) {
        let data = {
          ...this.chooseClusion,
          wordcode: this.chooseClusion.conid,
          wordname: this.chooseClusion.name,
        };
        console.log(data, "data");
        this.entryData.push(JSON.parse(JSON.stringify(data)));
      } else {
        this.$message.warning("不可重复添加结论词!");
        return false;
      }
      this.conclusionSearch = "";
      this.conclusionData = [];
      this.conclusionForm = {};
      this.chooseClusion = undefined;
      this.showConclusion = false;
      this.isCustomize = false;
    },
    /* 点击新增自定义结论词 */
    handleAddCustomizeConclusion() {
      this.conclusionForm = {
        conid: "",
        criticalflag: null,
        dietadvice: "",
        flag: 0,
        guidecontent: null,
        guidefileid: null,
        guidetitle: null,
        healthadvice: "",
        healthknowledge: "",
        icdcode: "",
        icdname: "",
        incode: "",
        level: 1,
        name: "",
        namecolor: "",
        seqno: 0,
        sex: 0,
        sportsadvice: "",
        status: 0,
        trackday: null,
        trackflag: null,
        typeid: "",
      };
      this.isCustomize = true;
    },
    /* 点击保存自定义结论词 */
    handleCustomizeConclusionCancel() {
      let seqno = 1;
      if (this.entryData.length > 1) {
        seqno = +this.entryData[this.entryData.length - 1].seqno + 1;
      }
      let data = {
        ...this.conclusionForm,
        wordcode: "",
        wordname: this.conclusionForm.name,
        seqno,
      };
      console.log(data, "data");
      this.entryData.push(JSON.parse(JSON.stringify(data)));
      this.conclusionSearch = "";
      this.conclusionData = [];
      this.conclusionForm = {};
      this.chooseClusion = undefined;
      this.showConclusion = false;
      this.isCustomize = false;
    },
    // 结论词取消回调
    handleConclusionCancel() {
      this.conclusionSearch = "";
      this.conclusionData = [];
      this.conclusionForm = {};
      this.chooseClusion = undefined;
      this.showConclusion = false;
      this.isCustomize = false;
    },
    // 结论词树形结构回调
    handleNodeConclusion(data) {
      this.isCustomize = false;
      if (data && !data.isFile) {
        this.conclusionForm = {};
        this.chooseClusion = undefined;
        return false;
      }
      this.conclusionForm = data.word.word;
      this.chooseClusion = data.word.word;
    },
    // 筛选树形结构回调
    handleFilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取结论词数据回调
    handleGetDicConclusion() {
      getDicConclusion().then((res) => {
        if (!res.result) return;
        this.conclusionData = res.result;
        this.$nextTick(() => {
          this.clusionCheck.push(res.result[0].id);
          this.$refs[`treeItem_${res.result[0].id}`].click();
        });
        // this.departmentData = res.result;
      });
    },
    // 点击新增结论词回调
    handleAddConclusion() {
      this.imageInfoFlag = false;
      this.handleGetDicConclusion();
      this.showConclusion = true;
    },
    // 点击删除结论词回调
    handleDelConclusion() {
      this.imageInfoFlag = false;
      if (!this.chooseEntry) {
        this.$message.warning("请选择需删除结论词!");
        return false;
      }
      this.entryData.forEach((item, index) => {
        if (item.wordcode == this.chooseEntry.wordcode) {
          this.entryData.splice(index, 1);
          this.chooseEntry = undefined;
        }
      });
    },
    // 点击表格行选中结论词
    handleChooseEntry(row) {
      this.chooseEntry = row;
    },
    // 获取默认小结回调
    handleGetDefaultConclusion() {
      if (this.chooseCombine.conclusionstatus === 1) return;
      this.imageInfoFlag = false;
      let data = {
        regid: this.chooseDepart.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.chooseDepart.sex,
        viewgroup: this.chooseDepart.viewgroup,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion: this.conclusion,
        currentitemcode: this.chooseProject,
        items: this.chooseProjectArr,
      };
      getDefaultConclusion(data).then((res) => {
        this.summaryObj = res.result;
        this.conclusion = res.result.conclusion;
        this.specialistadvice = res.result.specialistadvice;
        if (res.result.worditems.length != 0) {
          res.result.worditems.forEach((item) => {
            let flag = this.entryData.findIndex(
              (k) => k.wordcode == item.wordcode
            );
            flag == -1 && this.entryData.push(JSON.parse(JSON.stringify(data)));
          });
        }
      });
    },
    // 获取生成小结回调
    handleGetGenerateConclusion() {
      if (this.chooseCombine.conclusionstatus === 1) return;
      this.imageInfoFlag = false;
      let data = {
        regid: this.personalForm.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.personalForm.sex,
        viewgroup: this.chooseDepart.viewgroup,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion: this.conclusion,
        currentitemcode: this.chooseProject,
        items: this.chooseProjectArr,
      };
      getGenerateConclusion(data).then((res) => {
        if (!res.result) return false;
        this.summaryObj = res.result;
        // this.conclusion = res.result.conclusion;
        // this.specialistadvice = res.result.specialistadvice;
        this.conclusion = res.result.conclusion;
        if (!res.result.worditems) {
          this.entryData = [];
        } else {
          this.entryData = res.result.worditems;
        }
        // this.specialistadvice = res.result.specialistadvice;
        // if (res.result.worditems.length != 0) {
        //   res.result.worditems.forEach((item) => {
        //     let flag = this.entryData.findIndex(
        //       (k) => k.wordcode == item.wordcode
        //     );
        //     flag == -1 && this.entryData.push(item);
        //   });
        // }
      });
    },
    // 小结/专科建议切换回调
    handleFruitChange() {
      this.imageInfoFlag = false;
      // 富文本光标定位
      // this.$nextTick(() => {
      //   let quill = undefined;
      //   let length = 0;
      //   this.fruit == "conclusion"
      //     ? (quill = this.$refs.conclusionEditor.quill)
      //     : (quill = this.$refs.specialistadviceEditor.quill);
      //   this.fruit == "conclusion"
      //     ? (length = this.conclusion.length)
      //     : (length = this.specialistadvice.length);
      //   quill.setSelection(length + 1);
      // });
    },
    handleConfirmSplits() {
      let str = "";
      for (let i = 0; i < this.splits.length; i++) {
        str += this.splits[i].content;
      }
      this.splitsRow.itemvalue = str;
      this.handleCommonDbclickApi(this.splitsRow);
      this.splitFlag = false;
    },
    // 常用结果表格双击回调
    handleCommonDbclick(row) {
      SplitContent({ c: row.itemvalue })
        .then(async (res) => {
          if (!res.result) return;
          let data = res.result;
          if (data.splitFlag) {
            let xjData = await SplitContent({ c: row.conclusion });
            xjData.result && (this.isSyncConclusion = xjData.result.splitFlag);
            this.splitFlag = data.splitFlag;
            this.splits = data.splits;
            this.splitsRow = JSON.parse(JSON.stringify(row));
          } else {
            this.handleCommonDbclickApi(row);
          }
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 常用结果表格双击回调
    handleCommonDbclickApi(row) {
      let item = JSON.parse(JSON.stringify(this.chooseInputItem));
      this.chooseProject = item.itemcode; // 当前改变的项目编码
      let flag = this.chooseProjectArr.findIndex(
        (k) => k.itemcode == item.itemcode
      );
      if (flag == -1) {
        let data = JSON.parse(JSON.stringify(item));
        data.itemvalueitems = [];
        this.chooseProjectArr.push(data); // 当前改变的项目编码
      }
      {
        /* this.chooseProjectArr.forEach((v, i) => { */
      }
      for (let i = 0; i < this.chooseProjectArr.length; i++) {
        let v = this.chooseProjectArr[i];
        if (v.itemcode == item.itemcode) {
          // let flagId = v.itemvalueitems.findIndex((k) => k.vueid == row.vueid);
          v.result ? v.result : (v.result = "");
          if (!v.result.includes(row.itemvalue)) {
            if (this.chooseDepart.viewgroup == 3) {
              // 基础类
              if (v.result === "") {
                v.result += row.itemvalue;
              } else {
                let tempArr = v.result.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                v.result = tempArr.join("；");
                v.result == ""
                  ? (v.result += row.itemvalue)
                  : (v.result += `；\r\n${row.itemvalue}`);
              }
              this.chooseInputItem.result = v.result;
              if (v.describe === "") {
                v.describe += row.conclusion;
              } else {
                let tempArr = v.describe.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                v.describe = tempArr.join("；");
                v.describe == ""
                  ? (v.describe += row.conclusion)
                  : (v.describe += `；\r\n${row.conclusion}`);
              }
              this.chooseInputItem.describe = v.describe;
              if (v.valueresult === "") {
                v.valueresult += row.conclusion;
              } else {
                let tempArr = v.valueresult.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                v.valueresult = tempArr.join("；");
                v.valueresult == ""
                  ? (v.valueresult += row.conclusion)
                  : (v.valueresult += `；\r\n${row.conclusion}`);
              }
              this.chooseInputItem.valueresult = v.valueresult;
              if (this.isSyncConclusion) {
                this.conclusion = v.result;
                v.valueresult = v.result;
              } else {
                if (
                  (this.conclusion.includes("未见明显异常") &&
                    !this.conclusion.includes("未见明显异常", 1)) ||
                  (this.conclusion.includes("所检项目未见异常") &&
                    !this.conclusion.includes("所检项目未见异常", 1))
                ) {
                  this.conclusion = row.conclusion;
                } else if (this.conclusion == "") {
                  this.conclusion += row.conclusion;
                } else {
                  this.conclusion += `；\r\n${row.conclusion}`;
                }
              }
              // this.conclusion = v.describe;
            } else {
              // 基础类
              if (v.result === "") {
                v.result += row.itemvalue;
              } else {
                let tempArr = v.result.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                v.result = tempArr.join("；");
                v.result == ""
                  ? (v.result += row.itemvalue)
                  : (v.result += `；${row.itemvalue}`);
              }
              if (v.valueresult === "") {
                v.valueresult += row.conclusion;
              } else {
                let tempArr = v.valueresult.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                v.valueresult = tempArr.join("；");
                v.valueresult == ""
                  ? (v.valueresult += row.conclusion)
                  : (v.valueresult += `；\r\n${row.conclusion}`);
              }
              this.chooseInputItem.valueresult = v.valueresult;
              if (this.chooseInputItem.result === "") {
                this.chooseInputItem.result += row.itemvalue;
                if (this.isSyncConclusion) {
                  this.conclusion = v.result;
                  v.valueresult = v.result;
                } else {
                  if (
                    (this.conclusion.includes("未见明显异常") &&
                      !this.conclusion.includes("未见明显异常", 1)) ||
                    (this.conclusion.includes("所检项目未见异常") &&
                      !this.conclusion.includes("所检项目未见异常", 1))
                  ) {
                    this.conclusion = row.conclusion;
                  } else if (this.conclusion == "") {
                    this.conclusion += row.conclusion;
                  } else {
                    this.conclusion += `；\r\n${row.conclusion}`;
                  }
                }
              } else {
                let tempArr = this.chooseInputItem.result.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                this.chooseInputItem.result = tempArr.join("；");
                this.chooseInputItem.result == ""
                  ? (this.chooseInputItem.result += row.itemvalue)
                  : (this.chooseInputItem.result += `；${row.itemvalue}`);
                if (this.isSyncConclusion) {
                  this.conclusion = v.result;
                  v.valueresult = v.result;
                } else {
                  if (
                    (this.conclusion.includes("未见明显异常") &&
                      !this.conclusion.includes("未见明显异常", 1)) ||
                    (this.conclusion.includes("所检项目未见异常") &&
                      !this.conclusion.includes("所检项目未见异常", 1))
                  ) {
                    this.conclusion = row.conclusion;
                  } else if (this.conclusion == "") {
                    this.conclusion += row.conclusion;
                  } else {
                    this.conclusion += `；\r\n${row.conclusion}`;
                  }
                }
              }
            }
          }
        }
      }
      {
        /* }); */
      }
      this.handleGetConclusionDetail();
    },
    // 所有检查双击表格回调
    handleAllInspectDbclick(row) {
      row.items.push({
        doctorname: (row.items[0] && row.items[0].doctorname) || "",
        itemname: "小结",
        result: row.conclusion,
      });
      this.dbSpectData = row.items;
      this.showDbSpect = true;
    },
    // 关闭所有检查详情回调
    handleCloseDbSpect() {
      this.dbSpectData = [];
      this.showDbSpect = false;
    },
    // 检查结果输入框聚焦事件
    handleFocusProject(item) {
      this.chooseInputItem = item; // 不用深拷贝为了改变页面值
      this.commonData = JSON.parse(JSON.stringify(item.itemvalueitems));
    },
    // 基础类输入框回车回调
    handleInputdom1(item) {
      this.chooseProject = item.itemcode; // 当前改变的项目编码
      let flag = this.chooseProjectArr.findIndex(
        (k) => k.itemcode == item.itemcode
      );
      if (flag == -1) {
        let data = JSON.parse(JSON.stringify(item));
        data.itemvalueitems = [];
        this.chooseProjectArr.push(data); // 当前改变的项目编码
      }
      this.chooseProjectArr.forEach((k, i) => {
        if (k.itemcode == item.itemcode) {
          k.result = item.result;
        }
      });
      this.handleGetConclusionDetail();
    },
    // 失焦点事件添加值
    handleCheckoutBlur(item) {
      this.chooseProject = item.itemcode; // 当前改变的项目编码
      let flag = this.chooseProjectArr.findIndex(
        (k) => k.itemcode == item.itemcode
      );
      if (flag == -1) {
        let data = JSON.parse(JSON.stringify(item));
        data.itemvalueitems = [];
        this.chooseProjectArr.push(data); // 当前改变的项目编码
      }
      // if (item.result && item.result.charAt(item.result.length - 1) != "；") {
      this.chooseProjectArr.forEach((k) => {
        if (k.itemcode == item.itemcode) {
          k.result = item.result;
          item.healthstatus;
        }
      });
      item.result = item.result;
      this.handleGetConclusionDetail();
      // }
    },
    // 基础类复选框选中回调
    handleCheckbox(item) {
      this.chooseProject = item.itemcode; // 当前改变的项目编码
      let flag = this.chooseProjectArr.findIndex(
        (k) => k.itemcode == item.itemcode
      );
      flag == -1 &&
        this.chooseProjectArr.push(JSON.parse(JSON.stringify(item))); // 当前改变的项目编码
      let flagData = this.chooseDepart.items.filter((k) => !k.allowinput);
      // 循环添加项目
      flagData.forEach((item, index) => {
        this.chooseProjectArr.forEach((v, i) => {
          if (v.itemcode == item.itemcode) {
            v.itemvalueitems = item.itemvalueitems.filter((itemson) => {
              return this.checkList.includes(itemson.vueid);
            });
          }
        });
      });
      // 循环遍历结果
      this.chooseProjectArr.forEach((item, index) => {
        if (!item.allowinput) {
          item.result = item.itemvalueitems.map((items) => {
            return items.conclusion;
          });
          item.result = item.result.join("；");
        }
      });
      this.handleGetConclusionDetail();
    },
    // 获取小结回调
    handleGetConclusionDetail() {
      if (this.chooseCombine.conclusionstatus === 1) return;
      let data = {
        regid: this.personalForm.regid,
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.personalForm.sex,
        viewgroup: this.chooseDepart.viewgroup,
        conclusion: this.conclusion,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        currentitemcode: this.chooseProject,
        items: this.chooseProjectArr,
      };
      getConclusionDetail(data).then((res) => {
        this.summaryObj = res.result;
        this.conclusion = res.result.conclusion;
        this.isSyncConclusion = false;
        //this.chooseDepart.viewgroup != 3 &&
        //  (this.conclusion = res.result.conclusion);
        this.specialistadvice = res.result.specialistadvice;
        // if (res.result.worditems.length != 0) {
        // res.result.worditems.forEach((item) => {
        //   let flag = this.entryData.findIndex(
        //     (k) => k.wordcode == item.wordcode
        //   );
        //   flag == -1 && this.entryData.push(JSON.parse(JSON.stringify(item)));
        // });
        // }
        this.entryData = res.result.worditems;
        this.critiitems = res.result.critiitems;
        res.result.critiitems &&
          res.result.critiitems.forEach((k) => {
            this.chooseDepart.items.forEach((item) => {
              if (k.itemcode == item.itemcode && k.criticalflag == 1) {
                item.resflag = 2;
              }
            });
            this.chooseProjectArr.forEach((item) => {
              if (k.itemcode == item.itemcode && k.criticalflag == 1) {
                item.resflag = 2;
              }
            });
          });
        res.result.resultitems &&
          res.result.resultitems.forEach((k) => {
            this.chooseDepart.items.forEach((item) => {
              if (k.itemcode == item.itemcode) {
                item.tips = k.tips;
                item.healthstatus = k.healthstatus;
                item.result = k.result;
              }
            });
            this.chooseProjectArr.forEach((item) => {
              if (k.itemcode == item.itemcode) {
                item.tips = k.tips;
                item.healthstatus = k.healthstatus;
                item.result = k.result;
              }
            });
          });
      });
    },
    // 右侧表格按钮组绑定事件改变回调
    handleTablesChange(value) {
      switch (value) {
        case "commonResult": // 常见结果
          break;
        case "historyResult": // 历史结果
          this.handleGetHistoryResult();
          break;
        case "allInspections": // 所有检查
          this.handlegetAllCheck();
          break;
        case "healthRecords": // 健康档案
          this.handlegetgetPersonArchives();
          break;
        default:
          break;
      }
    },
    // 获取历史结果数据回调
    handleGetHistoryResult() {
      getHistoryResult({
        regid: this.chooseDepart.regid,
        combinecode: this.chooseDepart.combinecode,
      }).then((res) => {
        this.historyData = res.result.map((k) => {
          k.checkdate = k.checkdate.split(" ")[0];
          k.items.push({
            itemname: "小结",
            result: k.conclusion.replace(/\n/g, "<br/>"),
          });
          return {
            ...k,
          };
        });
      });
    },
    // 获取所有检查数据回调
    handlegetAllCheck() {
      getAllCheck({
        regid: this.chooseDepart.regid,
      }).then((res) => {
        this.allInspectData = res.result.map((k) => {
          k.conclusion = k.conclusion.replace(/\n/g, "<br/>");
          return { ...k };
        });
      });
    },
    // 获取所有健康档案回调
    handlegetgetPersonArchives() {
      getPersonArchives({
        regid: this.personalForm.regid,
        idcard: this.personalForm.idcard,
        hiscode: this.personalForm.hiscode,
        checkno: this.personalForm.checkno,
      }).then((res) => {
        this.healthRecordsData = res.result;
      });
    },
    // 健康档案单行点击获取所有检查数据
    handleClickHealthRecords(row) {
      getAllCheck({
        regid: row.regid,
      }).then((res) => {
        this.healthDtData = res.result.map((k) => {
          k.conclusion = k.conclusion.replace(/\n/g, "<br/>");
          return { ...k };
        });
      });
    },
    // 检验类表格输入框聚焦事件
    handleCheckoutFocus(value) {
      this.chooseInputItem = value; // 不用深拷贝为了改变页面值
      this.commonData = JSON.parse(JSON.stringify(value.itemvalueitems));
    },
    // 表格富文本获得改变回调
    handleOnEditorInput(data) {
      /* if (
        this.conclusion == "" ||
        (this.conclusion.includes("未见明显异常") &&
          !this.conclusion.includes("未见明显异常", 1))
      ) {
        this.handleInputdom1(data);
      } */
      this.handleInputdom1(data);
    },
    // 表格富文本获得焦点回调
    handleOnEditorFocus(data) {
      this.chooseInputItem = data; // 不用深拷贝为了改变页面值
      this.commonData = JSON.parse(JSON.stringify(data.itemvalueitems));
    },
    // 表格富文本内容改变回调
    handleOnEditorChange($event) {
      //内容改变事件
      this.$emit("change", $event);
    },
    // 用户列表选中数据行回调
    handlePersonnelCheck({ row }) {
      this.checkupWork = row.regid;
      this.chooseInputItem = undefined; // 重置选中项目数组
      this.defaultChecked = []; // 重置选中项目数组
      this.conditionCode = "regid";
      this.condition = "体检号";
      this.showTableDisabled = false;
      this.showTableFlag = "commonResult";
      this.summaryObj = undefined; // 重置请求小结成功返回对象
      this.entryData = [];
      this.commonData = [];
      this.checkList = []; // 重置选中项目复选框
      this.chooseDepart = undefined;
      this.conclusion = "";
      this.handleGetDepartCheck();
      this.handleTriageCancel();
    },
    // 切换用户列表状态按钮回调
    handleTabsPersonnelStatus(val) {
      this.personnelStatus = val;
      this.handleGetPersonnelList();
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.personalForm.fileid }).then((res) => {
        this.avatarImg = res.result.fileUrl;
      });
    },
    // 获取客户排队列表回调
    handleGetPersonnelList() {
      this.loading = true;
      let whereitems = [
        {
          key: "status",
          value: this.personnelStatus,
        },
      ];
      getPersonnelList({ whereitems }).then((res) => {
        this.personnelList = res.data;
        this.loading = false;
      });
    },
    // 历史信息表格选中人员关闭
    handleCloseHistory() {
      this.historyShow = false;
      this.historySelectData = [];
    },
    // 输入检索身份证/条件号等回调
    handleInputWork() {
      if (!this.checkupWork) {
        this.$message.warning("请输入查找信息!");
        return false;
      }
      if (this.conditionCode === "regid") {
        // 加载获取登记信息叫号数据
        this.handleGetDepartCheck();
      } else {
        getPersonalRegisterList({
          page: 1,
          limit: 10000,
          whereitems: [
            {
              key: this.conditionCode,
              value: this.checkupWork,
            },
            {
              key: "pageflag",
              value: "customerresult",
            },
          ],
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            this.historySelectData = res.data;
            this.historyShow = true;
            this.checkupWork = "";
          }
        });
      }
    },
    // 历史人员双击回调
    handleHistoryCheck(row) {
      if (!row) return false;
      this.condition = "体检号";
      this.conditionCode = "regid";
      this.checkupWork = row.regid;
      this.handleGetDepartCheck(); // 查询信息
      this.handleCloseHistory(); // 关闭弹框
    },
    // 获取获取登记信息、叫号 回调
    handleGetDepartCheck(regid) {
      let whereitems = [
        {
          key: regid ? "regid" : this.conditionCode,
          value: regid ? regid : this.checkupWork.trim(),
        },
      ];
      getDepartCheck({ whereitems })
        .then(async (res) => {
          this.loadingObj && this.loadingObj.close(); // 关闭模态框
          if (!res.result) {
            this.$message.warning("未查询到人员信息!");
            this.$reload();
          } else {
            let data = res.result;
            if (
              this.chooseCombine &&
              this.chooseCombine.regid != res.result.regid
            ) {
              this.chooseCombine = undefined;
            }
            this.currentPeople = res.result;
            // 初始化
            // this.chooseDepart = undefined;
            if (data.remindflag === 1) {
              this.$confirm(data.remindcontent, "系统提示", {
                cancelButtonText: "关闭",
                showConfirmButton: false,
                closeOnClickModal: false,
                type: "warning",
              }).then(() => {});
            }
            this.personalForm = data;
            if (data.chargeflag == 0) {
              this.personalForm.priceStatusCN = "未收费";
            } else if (data.chargeflag == 1) {
              this.personalForm.priceStatusCN = "已收费";
            } else if (data.chargeflag == 2) {
              this.personalForm.priceStatusCN = "申请退费";
            } else if (data.chargeflag == 3) {
              this.personalForm.priceStatusCN = "已退费";
            }
            this.personalForm.reportprintflagCN =
              data.reportprintflag == 0 ? "未打印" : "已打印";
            this.departitems = data.departitems.filter((k) => {
              return k.combineitems.length > 0;
            });

            let nextClick = [];
            data.departitems.forEach((k) => {
              k.combineitems.length > 0 && nextClick.push(...k.combineitems);
            });
            if (data.departitems.length > 0) {
              let code = data.departitems[0].combineitems[0].id;
              if (this.chooseCombine && this.chooseCombine.id) {
                let flag = nextClick.filter(
                  (k) => k.id == this.chooseCombine.id
                )[0];
                flag && (code = flag.id);
              }
              this.$nextTick(() => {
                this.defaultChecked.push(code);
                // let code = data.departitems[0].combineitems[0].id;
                this.$refs[`treeItem_${code}`].click();
              });
            }

            /* if (this.chooseDepart) {
              let index = nextClick.findIndex(
                (k) => k.combinecode === this.chooseDepart.combinecode
              );
              {
              }
              if (nextClick.length > 0) {
                nextClick = nextClick.filter((k) => {
                  return !k.isconclusion;
                });
              }
              if (nextClick.length > 0) {
                this.$nextTick(() => {
                  this.defaultChecked.push(nextClick[0].id);
                  // click 选中指定子项
                  let code = nextClick[0].id;
                  this.$refs[`treeItem_${code}`].click();
                  this.isDel = false;
                });
              } else {
                this.$nextTick(() => {
                  this.defaultChecked.push(
                    data.departitems[0].combineitems[0].id
                  );
                  let code = data.departitems[0].combineitems[0].id;
                  this.$refs[`treeItem_${code}`].click();
                });
              }
            } else {
              this.$nextTick(() => {
                this.defaultChecked.push(
                  data.departitems[0].combineitems[0].id
                );
                let code = data.departitems[0].combineitems[0].id;
                this.$refs[`treeItem_${code}`].click();
              });
            } */
            this.personalForm.sexs =
              data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
            // 年龄单位列表 / 回显值
            this.agearr = data.ageunititems;
            this.personalForm.ageunit =
              data.ageunititems.filter((k) => k.selected)[0] &&
              data.ageunititems.filter((k) => k.selected)[0].code;
            this.personalForm.agecn = `${data.age}${this.personalForm.ageunit}`;

            // 下拉单位列表 /  回显值
            this.companyitems = data.companyitems;
            this.batchitems = data.batchitems;
            this.groupitems = data.groupitems;
            let marriage = data.marriageitem.filter((k) => k.selected)[0];
            this.personalForm.marriage = (marriage && marriage.name) || "";
            let checktype = data.checktypeitems.filter((k) => k.selected)[0];
            this.personalForm.checktype = checktype && checktype.name;
            let batch = data.batchitems.filter((k) => k.selected)[0];
            let company = data.companyitems.filter((k) => k.selected)[0];
            this.personalForm.company = (company && company.name) || "";
            this.personalForm.batch = (batch && batch.name) || "";
            this.$message.success("操作成功!");
            if (this.personalForm.fileid) {
              this.handleGetFiles();
            } else {
              this.avatarImg = require("./images/lin.jpg");
            }
            //if (res.result.heightweightstatus == 1) {
            {
              /* this.handdleMsg(
                this.jsonSf({
                  action: "join",
                  nick: this.userInfo.usercode,
                  roomno: "HeightWeightRoom",
                })
              ); */
            }
            {
              /* let socketdata = {
                regid: this.currentPeople.regid,
                name: this.currentPeople.name,
                sex: this.currentPeople.sex,
                heightcombinecode: this.currentPeople.heightcombinecode,
                doctorcode: this.userInfo.usercode,
                doctorname: this.userInfo.username,
                fingercode: localStorage.getItem("md5code"),
              };
              this.handdleMsg(
                this.jsonSf({
                  action: "send_to_room",
                  nick: this.userInfo.usercode,
                  roomno: "HeightWeightRoom",
                  msg: this.jsonSf(socketdata),
                })
              );
              this.handdleMsg(
                JSON.stringify({
                  action: "join",
                  nick: `${localStorage.getItem("md5code")},${
                    this.userInfo.usercode
                  }`,
                  roomno: "AllowSingleLogin",
                })
              ); */
            }
            //}
          }
        })
        .catch(() => {
          this.loadingObj && this.loadingObj.close(); // 关闭模态框
        });
      // 危急值接口
      getCustomerResultCriticalList({
        regid: regid ? regid : this.checkupWork.trim(),
      }).then((res) => {
        if (!res.result) return;
        this.criticalList = res.result;
        this.showCriticalList = true;
      }),
        (this.checkupWork = "");
    },
    handlethrottle(value) {
      clearTimeout(this.timeIDDetail);
      this.timeIDDetail = setTimeout(() => {
        this.handleNodeClick(value);
      }, 400);
    },
    // 双击事件处理
    handleDblClick(node) {
      // 手动切换节点展开状态
      if (node.expanded) {
        node.collapse();
      } else {
        node.expand();
      }
    },
    // 点击树形结构获取当前选中科室
    handleNodeClick(value) {
      if (value && value.combinecode && value.isListen) {
        this.isListenShow = value.isListen;
        this.chooseCombine = value;
        this.searchCommon = "";
        this.resultFlag = "当次结果";
        this.nowdata = "实测数据";
        ListenCombineDetail({
          regid: value.regid,
          combinecode: value.combinecode,
        }).then((res) => {
          let data = res.result;
          this.commonData = []; // 重置右侧常用结果表格
          this.chooseDepart = JSON.parse(JSON.stringify(data));
          this.commonData = JSON.parse(JSON.stringify(data.itemvalueitems));
          this.listenItems = data.listenItems.map((k) => {
            return {
              ...k,
              rightAirTemp: "",
              rightBoneTemp: "",
              leftAirTemp: "",
              leftBoneTemp: "",
            };
          });
          this.chartsXArr = data.listenItems.map((k) => {
            return k.frequency;
          });
          this.chartsXArr.unshift("");
          this.chartsXArr.push("");
          this.listenAvgItems = data.listenAvgItems.map((k, i) => {
            return {
              ...k,
              name: this.listenAvgItemsName[i],
            };
          });
          if (data.medicalhistoryitem) {
            this.medicalhistory = data.medicalhistoryitem.medicalhistorydes;
            this.showMedicalhistory = true;
          }
          this.summaryForm = JSON.parse(JSON.stringify(data));
          this.summaryForm.statusName =
            this.summaryForm.conclusionstatus == -1
              ? "已登记"
              : this.summaryForm.conclusionstatus == 0
              ? "已保存"
              : "已审核";
          this.doctoritems = JSON.parse(JSON.stringify(data.doctoritems)); // 读取页面配置

          getSysConfigInfo({ cc: "Sys_doctorcode" }).then((res) => {
            if (!res.result) return;
            let tempSum = res.result.split("|");
            tempSum.forEach((item, index) => {
              if (item.split(",")[0] == value.deptcode) {
                let tempCode = item.split(",")[1];
                let index = this.doctoritems.filter(
                  (k) => k.code == tempCode
                )[0];
                if (index) {
                  this.summaryForm.doctorcode = index.code;
                  this.summaryForm.doctorname = index.name;
                }
              }
            });
            /* let index = this.doctoritems.filter((k) => k.code == res.result)[0];
            if (index) {
              this.summaryForm.doctorcode = index.code;
              this.summaryForm.doctorname = index.name;
            } */
          });
          let doctorItems =
            JSON.parse(localStorage.getItem("lockDoctorItems")) || [];
          if (doctorItems.length > 0) {
            let doctor = doctorItems.filter(
              (k) => k.code === data.combinecode
            )[0];
            if (doctor) {
              this.summaryForm.doctorcode = doctor.doctorcode;
              let index = this.doctoritems.filter(
                (k) => k.code == doctor.doctorcode
              )[0];
              if (index) {
                this.summaryForm.doctorname = index.name;
              }
              this.lockDoctorcode = 1;
            } else {
              this.lockDoctorcode = 0;
            }
          }
          this.chooseInputItem = undefined; // 重置选中项目数组
          this.showTableDisabled = false;
          this.showTableFlag = "commonResult";
          this.summaryObj = undefined; // 重置请求小结成功返回对象
          this.entryData = this.chooseDepart.worditems;
          this.checkList = []; // 重置选中项目复选框
          this.fileList = [];
          this.imageInfoFlag = false;
          this.conclusion = this.chooseDepart.conclusion;
          this.specialistadvice = this.chooseDepart.specialistadvice;
          if (this.chooseCombine.isconclusion) {
            this.showBigMask = true;
          } else {
            this.showBigMask = false;
          }
          this.showChartBox = false;
          this.$nextTick(() => {
            this.showChartBox = true;
            setTimeout(() => {
              this.handleCreateRightEarChart();
              this.handleCreateLeftEarChart();
            }, 100);
          });
        });
        // 获取听力历史
        ListenHistoryResult({
          regid: value.regid,
          combinecode: value.combinecode,
        }).then((res) => {
          if (!res.result) return;
          this.listenHistory = res.result;
        });
        setTimeout(() => {
          this.$nextTick(() => {
            this.handleCreateRightEarChart();
            this.handleCreateLeftEarChart();
          });
        }, 100);
      } else if (value && value.combinecode) {
        this.isListenShow = false;
        this.chooseCombine = value;
        this.searchCommon = "";
        getCombineDetail({
          regid: value.regid,
          checkno: this.personalForm.checkno,
          combinecode: value.combinecode,
        }).then((res) => {
          let data = res.result;
          this.commonData = []; // 重置右侧常用结果表格
          this.chooseDepart = JSON.parse(JSON.stringify(data));
          /* if (
            this.abnormalTips.length > 0 &&
            this.chooseDepart.items.length > 0
          ) {
            for (let i = 0; i < this.chooseDepart.items.length; i++) {
              if (this.chooseDepart.items[i].healthstatus != 0) {
                this.$alert(`${this.chooseDepart.conclusion}`, "提示", {
                  confirmButtonText: "确 定",
                  callback: (action) => {},
                });
                break;
              }
            }
          } */
          if (this.chooseDepart.viewgroup == 2) {
            this.chooseDepart.items = this.chooseDepart.items.filter((k) => {
              return k.isshow;
            });
          }
          if (data.medicalhistoryitem) {
            this.medicalhistory = data.medicalhistoryitem.medicalhistorydes;
            this.showMedicalhistory = true;
          }
          if (data.heightweightstatus == 1) {
            this.chooseProjectArr = JSON.parse(
              JSON.stringify(this.chooseDepart.items)
            ); // 重置选中项目数组
            this.handdleMsg(
              this.jsonSf({
                action: "join",
                nick: localStorage.getItem("md5code"),
                // nick: this.userInfo.usercode,
                roomno: "HeightWeightRoom",
              })
            );
          } else {
            this.chooseProjectArr = []; // 重置选中项目数组
          }
          {
            /* this.handdleMsg(
            this.jsonSf({
              action: "send_to_room",
              nick: this.userInfo.usercode,
              roomno: "HeightWeightRoom",
              msg: this.jsonSf({ name: "大鸡何" }),
            })
          ); */
          }
          // }
          this.summaryForm = JSON.parse(JSON.stringify(data));
          this.summaryForm.statusName =
            this.summaryForm.conclusionstatus == -1
              ? "已登记"
              : this.summaryForm.conclusionstatus == 0
              ? "已保存"
              : "已审核";
          this.doctoritems = JSON.parse(JSON.stringify(data.doctoritems)); // 读取页面配置

          getSysConfigInfo({ cc: "Sys_doctorcode" }).then((res) => {
            if (!res.result) return;
            let tempSum = res.result.split("|");
            tempSum.forEach((item, index) => {
              if (item.split(",")[0] == value.deptcode) {
                let tempCode = item.split(",")[1];
                let index = this.doctoritems.filter(
                  (k) => k.code == tempCode
                )[0];
                if (index) {
                  this.summaryForm.doctorcode = index.code;
                  this.summaryForm.doctorname = index.name;
                }
              }
            });
            /* let index = this.doctoritems.filter((k) => k.code == res.result)[0];
            if (index) {
              this.summaryForm.doctorcode = index.code;
              this.summaryForm.doctorname = index.name;
            } */
          });
          let doctorItems =
            JSON.parse(localStorage.getItem("lockDoctorItems")) || [];
          if (doctorItems.length > 0) {
            let doctor = doctorItems.filter(
              (k) => k.code === data.combinecode
            )[0];
            if (doctor) {
              this.summaryForm.doctorcode = doctor.doctorcode;
              let index = this.doctoritems.filter(
                (k) => k.code == doctor.doctorcode
              )[0];
              if (index) {
                this.summaryForm.doctorname = index.name;
              }
              this.lockDoctorcode = 1;
            } else {
              this.lockDoctorcode = 0;
            }
          }
          /* let doctorcode =
            JSON.parse(localStorage.getItem("lockDoctorcode")) || "";
          if (doctorcode) {
            this.summaryForm.doctorcode = doctorcode;
            this.lockDoctorcode = 1;
          } */
          this.chooseProjectArr = data.items;
          {
            /* data.items.forEach((item) => {
            if (item.result != "") {
              this.chooseProjectArr.push(item);
            }
          }); */
          }
          this.chooseProjectArr.forEach((k, i) => {
            let tempArr = [];
            k.itemvalueitems.map((item, index) => {
              if (k.result && k.result.split("；").includes(item.conclusion)) {
                tempArr.push(item);
              }
            });
            k.itemvalueitems = tempArr;
          });
          this.chooseInputItem = undefined; // 重置选中项目数组
          this.showTableDisabled = false;
          this.showTableFlag = "commonResult";
          this.summaryObj = undefined; // 重置请求小结成功返回对象
          this.entryData = this.chooseDepart.worditems;
          this.checkList = []; // 重置选中项目复选框
          this.fileList = [];
          this.imageInfoFlag = false;

          // 回显复选框数据
          this.chooseDepart.items.forEach((item) => {
            item.itemvalueitems.forEach((k) => {
              k.selected && this.checkList.push(k.vueid);
            });
          });
          this.conclusion = this.chooseDepart.conclusion;
          this.specialistadvice = this.chooseDepart.specialistadvice;
          if (this.chooseCombine.isconclusion) {
            this.showBigMask = true;
          } else {
            this.showBigMask = false;
          }
          this.previewImageList = [];
          // 图片回显
          if (data.imageitems.length > 0) {
            data.imageitems.forEach((k, i) => {
              this.fileList.push({
                fileid: k.fileid,
                imgname: k.imgname,
                updated: false,
                source: k.source || "",
                sourcefileurl: k.sourcefileurl || "",
                url: "",
              });
              getFiles({ Id: k.fileid }).then((res) => {
                this.fileList[i].url = res.result.fileUrl;
                this.previewImageList.push(res.result.fileUrl);
              });
            });
          }
          // this.$nextTick(() => {
          setTimeout(() => {
            let tempArr = this.chooseDepart.items.filter((k) => {
              return !k.result || k.result == "/";
            });
            if (tempArr.length == 0) return;
            let pDom = document.querySelector(
              `.focusinginput_${tempArr[0].itemcode}`
            );
            if (!pDom) return;
            if (this.chooseDepart.viewgroup == 3) {
              pDom.childNodes[0].focus();
            } else {
              pDom.focus();
            }
          }, 400);
          // });
        });
      } else {
        this.chooseDepart = undefined; //重置选中对象
      }
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 检索组件提交回调
    handleSearchSubmit(regid) {
      this.checkupWork = regid;
      // 加载获取登记信息叫号数据
      this.handleGetDepartCheck();
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.conditionCode = "regid";
      this.condition = "体检号";
      this.showSearch = value;
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      switch (domId) {
        case "btnRefresh": // 刷新
          this.handleRefreshDetails();
          break;
        case "btnSearch": // 检索
          this.handleShowSearch();
          break;
        case "btnEdit": // 编辑
          /* if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          } */
          this.showBigMask = false;
          if (this.currentUser) {
            this.summaryForm.operatorname = this.currentUser;
          }
          break;
        case "btnKeep": // 保存
          /* if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          } */
          if (this.chooseDepart && this.chooseDepart.conclusionstatus > -1) {
            this.$confirm("已保存, 是否继续保存?", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                if (this.isListenShow) {
                  this.handleSubmitPageListenSave();
                } else {
                  this.handleSubmitPage();
                }
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else {
            if (this.isListenShow) {
              this.handleSubmitPageListenSave();
            } else {
              this.handleSubmitPage();
            }
          }
          break;
        case "btnGuidance": // 导诊弹框
          this.showGuidance = true;
          this.showSmallGuidance = false; // 显示小浮窗
          break;
        case "btnTriag": // 导诊弹框-旧
          this.showGuidance = true;
          return;
          this.handleOpenTriagDia();
          break;
        case "btnSaveAndReset": // 保存
          this.handleSubmitPageAndReset();
          break;
        case "btnToExamine": // 审核页面项目
          this.handleGetCheckPage();
          break;
        case "btnMedicalhistory": // 点击弹出病史按钮
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.showMedicalhistory = true;
          break;
        case "btnToExamineCancel": // 取消审核页面项目
          if (!this.chooseDepart) {
            this.$message.warning("请选择需取消审核的项目!");
            return false;
          }
          if (
            this.chooseCombine.isconclusion &&
            this.chooseCombine.conclusionstatus == 1
          ) {
            if (this.isDialog == 0) {
              let combineitems = [
                {
                  deptcode: this.chooseDepart.deptcode,
                  deptname: this.chooseDepart.deptname,
                  combinecode: this.chooseDepart.combinecode,
                  combinename: this.chooseDepart.combinename,
                },
              ];
              let data = {
                regid: this.personalForm.regid,
                checkno: this.personalForm.checkno,
                reason: "未弹窗",
                combineitems: combineitems,
              };
              getCancelCheckPage(data).then((res) => {
                this.checkupWork = res.result.regid;
                this.$message.success(res.message);
                this.handleGetDepartCheck();
              });
            } else {
              this.showToExamine = true;
            }
          } else {
            this.$message.warning("当前状态不允许取消审核!");
            return false;
          }
          break;
        case "btnGiveUp": // 弃检
          if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          }
          this.handleGetGiveUpCheck();
          break;
        case "btnGiveUpCancel": // 取消弃检
          if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          }
          this.handleGetGiveUpCheckCancel();
          break;
        case "btnResult": // 批量提取结果
          if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          }
          this.handleSetDepartCheckGetResult();
          break;
        case "btnResultSingle": // 提取结果
          /* if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          } */
          this.handleSetDepartCheckGetResultSingle();
          break;
        case "btnDel": // 删除
          if (this.personalForm.confirmdoctorcode != null) {
            this.$message.warning("已核对确认的不允许操作!");
            return false;
          }
          this.handleDelDepart();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnGeneral": // 体检总检
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          if (this.personalForm.status < 5) {
            this.$message.warning("当前体检号不能总检!");
            return false;
          }
          jumpRouteLink(this, "totalcheck");
          this.$router.push({
            path: `/totalcheck/${this.Hospitals}`,
            query: { regid: this.personalForm.regid },
          });
          break;
        case "btnQuestionnaire": // 调查问卷
          this.handleShowQuestionnaire();
          break;
        case "btnConfirmVerification": // 核对确认
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.handleVerifyAndConfirm();
          break;
        case "btnCancelVerification": // 取消确认
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          /* if (
            this.userInfo.usercode != "System" &&
            this.userInfo.usercode != this.personalForm.confirmdoctorcode
          ) {
            this.$message.warning("您不是核对确认的操作人!");
            return false;
          } */
          this.handleUpdateVerification(0);
          break;
        case "btnCriticalTrack": // 查看预警
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.showCriticalDialog = true;
          break;
        default:
          break;
      }
    },
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      // beforeRouteENnter不能通过this访问组件实例，但是可以通过 vm 访问组件实例
      if (to.query.regid) {
        vm.checkupWork = to.query.regid;
        vm.handleGetDepartCheck();
      }
    });
  },
  watch: {
    socketObj: {
      handler(newVal, oldVal) {
        let that = this;
        let data = newVal;
        if (data.isLoginOut) {
          that
            .$confirm("此账号已在别处登录!", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: "warning",
            })
            .then(() => {
              that.$store.dispatch("LogOut").then(() => {
                localStorage.removeItem("userId");
                location.reload(); // 为了重新实例化vue-router对象 避免bug
                // socketService.close();
              });
            })
            .catch(() => {});
        } else if (
          data.Fingercode &&
          data.Fingercode == localStorage.getItem("md5code")
        ) {
          if (data.ItemList && data.ItemList.length > 0) {
            for (let i = 0; i < that.chooseProjectArr.length; i++) {
              let index = data.ItemList.findIndex(
                (k) => k.itemcode === that.chooseProjectArr[i].itemcode
              );
              if (index > -1) {
                that.chooseProjectArr[i].result = data.ItemList[index].result;
                that.chooseProjectArr[i].describe =
                  data.ItemList[index].describe;
              }
            }
            for (let i = 0; i < that.chooseDepart.items.length; i++) {
              let index = data.ItemList.findIndex(
                (k) => k.itemcode === that.chooseDepart.items[i].itemcode
              );
              if (index > -1) {
                that.chooseDepart.items[i].result = data.ItemList[index].result;
                that.chooseDepart.items[i].describe =
                  data.ItemList[index].describe;
              }
            }
            that.handleGetConclusionDetail();
          }
        } else if (data.businessType == "Customer_triag_queueRoom") {
          that.queuePaiDuiList = data.RoomPaiDuiList.map((k) => {
            return {
              ...k,
              id: k.Id,
            };
          });
          that.waitLength = that.queuePaiDuiList.length; // 显示小浮窗
          that.completeList = data.CompleteList.map((k) => {
            return {
              ...k,
              id: k.Id,
            };
          });
          that.guohaoList = data.GuohaoList.map((k) => {
            return {
              ...k,
              id: k.Id,
            };
          });
        }
      },
      deep: true,
    },
    conclusionSearch(val) {
      this.$refs.conclusionTree.filter(val);
    },
    condition: {
      handler() {
        this.handleFocuscheckupWorkInput();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/table.scss";
@import "./css/index_gdgy.scss";
@import "./css/zh_CN.scss";
.remark_box {
  /deep/.el-form-item__content {
    display: flex;
    align-items: center;
    height: 30px;
    .el-button {
      margin-left: 5px;
    }
  }
}
.my-select-dropdown {
  z-index: 9999 !important;
}
</style>
<style lang="scss" >
.isCheckEye_tips {
  .el-message-box__message {
    height: 500px;
    overflow-y: auto;
  }
}
</style>
