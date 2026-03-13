<template>
  <div class="customer_result">
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
          <el-button type="primary" plain size="mini" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" :ref="btn.domId" class="filter-item" :loading="saveLoading" :disabled="btn.domId != 'btnSearch' && !isalterdata" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
        </div>
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
            <el-input size="mini" clearable ref="checkupWorkInput" @keyup.enter.native="handlethrottleInputWork" v-model="checkupWork" placeholder="请输入内容"></el-input>
            <el-button type="primary" plain style="padding: 7px 4px; margin-left: 5px" size="mini" @click="handleTriageOpen">分诊</el-button>
          </div>
        </div>
        <!-- 基本信息 -->
        <div class="content_r">
          <div class="content_r-in" style="padding: 0">
            <el-form ref="form" disabled :model="personalForm" label-width="70px">
              <div>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="体检号" class="font16">
                    <el-input disabled v-model="personalForm.regid"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="姓名" class="font16">
                    <el-input v-model="personalForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="性别">
                    <el-input v-model="personalForm.sexs"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" class="age" label-width="80px" label="年龄">
                    <el-input type="text" class="age_num" v-model="personalForm.age"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="收费状态">
                    <el-input v-model="personalForm.chargeflagcn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="门诊号">
                    <el-input v-model="personalForm.hiscode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="婚姻">
                    <el-input v-model="personalForm.marriage"></el-input>
                  </el-form-item>
                </el-col>
              </div>
              <div>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="体检类型">
                    <el-input v-model="personalForm.checktype"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="联系电话">
                    <el-input v-model="personalForm.telephone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item class="group_inspection" size="mini" label="团检名称" label-width="80px">
                    <el-input v-model="personalForm.company"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="总检状态">
                    <el-input :class="[personalForm.status >= 6 ? 'is_red' : '']" v-model="personalForm.statuscn" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 35px">
                  <el-form-item size="mini" label="预约分组">
                    <el-input v-model="personalForm.groupname" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="5" style="margin-right: 15px; height: 35px">
                <el-form-item size="mini" label="团检批次">
                  <el-input v-model="personalForm.batch"></el-input>
                </el-form-item>
              </el-col> -->
              </div>
            </el-form>
          </div>
          <div class="img_box">
            <div class="photo_box">
              <img :src="avatarImg" :draggable="false" class="avatar" alt="摄像头" />
            </div>
          </div>
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
              <el-tree ref="rightsTree" style="overflow-x: hidden" :data="departitems" node-key="id" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="true" :default-checked-keys="defaultChecked" @node-click="handleNodeClick">
                <span class="custom-tree-node" @dblclick.stop="handleDblClick(node)" style="
                    display: flex;
                    justify-content: center;
                    align-content: center;
                  " :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                  <img v-if="!data.detid" :src="srcFolder" :draggable="false" class="rightstreeimg" />
                  <img v-if="data.isconclusion && data.conclusionstatus == 0" :src="substatus0" :draggable="false" class="rightstreeimg" />
                  <img v-if="data.isconclusion && data.conclusionstatus == 1" :src="substatus1" :draggable="false" class="rightstreeimg" />
                  <img v-if="!data.isconclusion && data.conclusionstatus == 0" :src="substatus2" :draggable="false" class="rightstreeimg" />
                  <span :class="[
                      data.isconclusion
                        ? data.conclusionstatus == 0
                          ? 'is_blue'
                          : data.conclusionstatus == 1
                          ? 'is_red'
                          : ''
                        : '',
                      data.combineitems ? 'is_black' : '',
                    ]">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
            <!-- <el-scrollbar v-else style="height: calc(100% - 36px);" ></el-scrollbar> -->
          </div>
          <!-- <div class="personnel">
          <div class="personnel_btn">
            <el-radio-group @change="personnelBtn" v-model="radios" size="small" fill="#2a85ea">
              <el-radio-button label="0">排队</el-radio-button>
              <el-radio-button label="1">已检</el-radio-button>
              <el-radio-button label="2">未检</el-radio-button>
            </el-radio-group>
          </div>
          <div class="personnel_Table">
            <EasyTable height="100%" class="personnel_con_table" :loading="loading" :data="personnelList" :tableOptions="personnelOptions" :radio-config="{ rowClick: true }" @row-click="handlePersonnelCheck" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          </div>
        </div> -->
        </div>
        <!-- 右侧主体内容 -->
        <div class="subject_right">
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
            <div class="project">
                       
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
                  <div v-if="chooseDepart.viewgroup == '3'" class="project_dom3">
                    <!-- dom 3 -->
                    <EasyTable :loading="loading" class="project_dom3_table" height="100%" :data="chooseDepart.items" :tableOptions="doMainOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                  </div>
                </div>
              </div>
            </div>
            <!-- 小结 -->
            <div class="summary">
              <!-- 遮罩层 -->
              <div class="mask" v-if="!chooseDepart"></div>
              <!-- 小结内容 富文本 -->
              <div class="summary_content">
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
                    <el-button type="primary" size="mini" @click="handleSubmitPageBtn" :loading="saveLoading" :disabled="!isalterdata">保存</el-button>
                  </div>
                  <div class="entry_btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-plus" :disabled="!isalterdata" @click="handleAddConclusion">增加</el-button>
                    <el-button type="primary" plain size="mini" icon="el-icon-delete" :disabled="!isalterdata" @click="handleDelConclusion">删除</el-button>
                  </div>
                </div>
                <div class="summary-box" v-if="!imageInfoFlag">
                  <!-- 富文本 -->
                  <div class="tinymce_box">
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
                    <el-input class="conc_text" :rows="5" type="textarea" resize="none" v-if="fruit == 'conclusion'" v-model="conclusion"></el-input>
                    <el-input class="conc_text" :rows="5" type="textarea" resize="none" v-if="fruit == 'specialistadvice'" v-model="healthadvice"></el-input>
                    <!-- <el-input
                      class="conc_text"
                      :rows="5"
                      type="textarea"
                      resize="none"
                      v-if="fruit == 'specialistadvice'"
                      v-model="specialistadvice"
                    ></el-input> -->
                  </div>
                  <!-- 表格结论词 -->
                  <div class="summary_entry">
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
              <div class="summary_form">
                <el-form ref="form" :model="summaryForm" label-width="80px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item size="mini" label="检查医生">
                        <el-select filterable allow-create :disabled="
                            summaryForm.conclusionstatus == 1 || !isalterdata
                          " v-model="summaryForm.doctorcode" @change="handleChangeDoctor">
                          <el-option v-for="item in doctoritems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item size="mini" label="检查时间">
                        <el-date-picker :disabled="summaryForm.conclusionstatus == 1" type="datetime" placeholder="检查时间" v-model="summaryForm.inputdate" style="width: 100%"></el-date-picker>
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
                        <el-date-picker :disabled="summaryForm.conclusionstatus == 1" type="datetime" placeholder="审核时间" v-model="summaryForm.checkdate" style="width: 100%"></el-date-picker>
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
            <div class="mask_big" v-if="showBigMask"></div>
            <el-radio-group size="mini" :disabled="showTableDisabled" v-model="showTableFlag" @change="handleTablesChange" style="padding: 10px">
              <el-radio-button label="commonResult">常见结果</el-radio-button>
              <el-radio-button label="historyResult">历史结果</el-radio-button>
              <el-radio-button label="allInspections">所有检查</el-radio-button>
              <el-radio-button label="healthRecords">健康档案</el-radio-button>
            </el-radio-group>
            <!-- 表格展示数据 -->
            <div class="table_box">
              <!-- 常见结果 -->
              <EasyTable v-if="
                  showTableFlag == 'commonResult' &&
                  chooseCombine &&
                  chooseCombine.viewgroup != 3
                " :loading="loading" class="common_table" height="100%" table-layout="auto" :data="commonData" :tableOptions="commonOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCommonDbclick" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
              <EasyTable v-else :loading="loading" class="common_table common_table_three" height="100%" table-layout="auto" :data="commonData" :tableOptions="commonOptionsThree" :radio-config="{ rowClick: true }" @row-dblclick="handleCommonDbclick" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
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
          <!-- 富文本框 -->
          <!-- <vue-tinymce v-model="content" :setting="setting" /> -->
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
                <el-input v-model="conclusionForm.icdcode"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="小结">
                <el-input v-model="conclusionForm.name"></el-input>
              </el-form-item>
              <el-form-item class="conclEditor_box" size="mini" label="健康建议">
                <quill-editor class="concl_editor" v-model="conclusionForm.healthadvice" ref="conclEditor" :options="editorOption" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 脚部按钮组 -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain size="mini" @click="handleConclusionSubmit">确 定</el-button>
          <el-button type="primary" plain size="mini" @click="handleConclusionCancel">取 消</el-button>
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
      <!-- 数据维护弹出层 -->
      <el-dialog :show-close="false" :close-on-click-modal="false" class="historyAllResult_dai" :visible.sync="showHistoryAllResult" width="65%" title="检验维护窗口(注：此功能将直接修改检验数据，谨慎！)" @close="handleHistoryAllResultCancel">
        <div class="har_content">
          <div class="har_condition">
            检验数据过滤天数设置<el-input style="width: 70px; margin: 0 5px" size="mini" v-model="harbdays"></el-input>天
          </div>
          <div class="har_tablebox">
            <vxe-table class="people_table" ref="peopleTable" height="auto" border="inner" :loading="loading" highlight-hover-row highlight-current-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="historyAllResult" :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }" @cell-click="handleChooseHistoryAll">
              <vxe-table-column field="regid" title="体检号" width="120" sortable></vxe-table-column>
              <vxe-table-column field="name" title="姓名" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="性别" width="120" sortable>
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
              <vxe-table-column field="age" title="年龄" width="120" sortable></vxe-table-column>
              <vxe-table-column field="combinecode" title="组合编码" width="120"></vxe-table-column>
              <vxe-table-column field="combinename" title="组合名称" width="120"></vxe-table-column>
              <!-- <vxe-table-column
                field="detid"
                title="医嘱ID"
                width="120"
              ></vxe-table-column> -->
              <vxe-table-column field="checkdate" title="报告时间" min-width="170"></vxe-table-column>
              <vxe-table-column field="hiscode" title="收费编码" width="120"></vxe-table-column>
            </vxe-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="harb_title">
            当前体检号：{{ this.personalForm.regid }}
          </div>
          <el-button size="mini" type="primary" @click="handleHistoryAllResultConfirm">确 定</el-button>
          <el-button size="mini" @click="handleHistoryAllResultCancel">退 出</el-button>
        </span>
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
              <el-date-picker v-model="triageTime" type="datetimerange" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChangeTriageTime">
              </el-date-picker>
            </div>
            <el-radio-group @change="personnelBtn" v-model="personnelStatus" size="mini" fill="#2a85ea">
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
            <vxe-table height="auto" class="personnel_con_table" border="inner" show-overflow :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" @cell-dblclick="handlePersonnelCheck" :data="personnelList" :sort-config="{ trigger: 'cell' }">
              <vxe-table-column field="regid" title="体检号" min-width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="name" title="姓名" min-width="110px" show-overflow></vxe-table-column>
              <vxe-table-column field="sex" min-width="90px" title="性别" show-overflow>
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
              <vxe-table-column field="age" title="年龄" min-width="110px" show-overflow>
                <template slot-scope="scope">
                  <span>{{ scope.row.age }}</span>
                </template>
              </vxe-table-column>
              <!-- <vxe-table-column
                field="personalflag"
                min-width="100px"
                title="类型"
                show-overflow
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.personalflag == 0 ? "个人" : "单位"
                  }}</span>
                </template></vxe-table-column
              > -->
              <vxe-table-column field="regdate" title="登记日期" min-width="150px" show-overflow></vxe-table-column>
              <vxe-table-column field="companycode" min-width="230px" title="单位信息" show-overflow>
                <template slot-scope="scope">
                  <span>{{ scope.row.companycode }}　{{
                      scope.row.companyname
                    }}</span>
                </template></vxe-table-column>
            </vxe-table>
          </div>
          <div class="text">记录数:{{ personnelList.length }}</div>
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
      <!-- 收藏弹框 -->
      <el-dialog class="dialog-mini discount_dialog" width="30%" top="20%" :close-on-click-modal="false" title="收藏人员" :visible.sync="showCollect" @close="handleCloseCollect">
        <div class="discount_box" style="display: flex;flex-direction: column; align-items: start;">
          <div class="datebox" style="margin-bottom: 10px;">上次收藏时间：{{ collectData && collectData.operatordate || "暂无" }}</div>
          <div class="collect_box" style="width:100%;display: flex;align-items: center;">
            <div class="collect_box_title" style="width:50px;margin-right: 5px;">备注:</div>
            <el-input type="textarea" autosize resize="none" placeholder="请输入收藏备注" v-model="collectRemark"></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmCollect">确 认</el-button>
          <el-button size="mini" @click="handleCloseCollect">取 消</el-button>
        </span>
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
      <!-- 弃检还原 -->
      <el-dialog title="弃检还原" class="giveUpRevert_dia" :visible.sync="showGiveUpRevert" :close-on-click-modal="false" @close="handleGiveUpRevertClose">
        <div>
          <EasyTable class="table_item" height="100%" :data="giveUpRevertData" :tableOptions="giveUpRevertOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handleGiveUpRevertConfirm">还 原</el-button>
          <el-button size="mini" @click="handleGiveUpRevertClose">关 闭</el-button>
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
      <!-- 检索组件 -->
      <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" />
    </div>
    <Questionnaire :regid="this.personalForm.regid" v-if="showQuestionnaire" @close="handleCloseQuestionnaire" />
    <!-- 拍照弹框 -->
    <el-dialog title="拍照" class="preview_box" :visible.sync="photographDialogFlag" width="70%" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" @close="handlephotographCloseDialog">
      <div class="box">
        <el-row>
          <el-col :span="6">
            <span>摄像头</span>
            <video id="btnVideoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
          </el-col>
          <el-col :span="6">
            已拍照
            <canvas id="btnCanvasCamera" class="canvas btnCanvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
          </el-col>
          <el-col :span="6">
            <span>预览图</span>
            <div style="width: 100%; height: 100%">
              <el-image style="width: 100%; height: 100%" :src="previewUrl">
                <div slot="error" class="image-slot" style="width: 100%; height: 100%">
                  <p style="">双击右侧数据预览图片</p>
                </div>
              </el-image>
            </div>
          </el-col>
          <el-col :span="6">
            <span>双击预览</span>
            <el-table height="425px" ref="serum" :key="'1'" :data="photographList" fit highlight-current-row style="width: 100%" @row-dblclick="btnListRowClick" @selection-change="handlePhotograpSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :cell-style="{ padding: '0' }">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="id" prop="fileid" width="60" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-button size="mini" type="danger" @click="handleDeletPhotograph">删除</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button @click="handleBtnDrawImage" icon="el-icon-camera" size="small">
          拍照
        </el-button>
        <el-button v-if="btnOs" @click="handleBtnGetCompetence" icon="el-icon-video-camera" size="small">
          打开摄像头
        </el-button>
        <el-button v-else @click="handleBtnStopNavigator" icon="el-icon-switch-button" size="small">
          关闭摄像头
        </el-button>
        <el-button @click="handleBtnResetCanvas" icon="el-icon-refresh" size="small">
          重置
        </el-button>
        <el-button @click="handleBtnOnComplete" size="small"> 完成 </el-button>
        <el-button @click="handleBtnClose" icon="el-icon-circle-close" size="small">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import _ from "lodash";
import { throttle } from "@/utils/throttle";
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
  setFilesDelete,
  setDepartCheckGiveUp,
  setDepartCheckGetResult,
  getGiveUpList,
  setDepartCheckGiveUpCancel,
  HistoryAllResultList,
  CopyHistoryResult,
  UpdateMedicalHistoryInfo,
  ArchivesImages,
  SaveArchivesImages,
  DeleteArchivesImages,
  ImportImage,
  setUploadPdfToImage,
  MedicalDetailStatusComplete,
} from "@/api/customerresult.js"; // 引入页面接口
import {
  CustomerCollectSave,
  CustomerCollectPersonDetail,
} from "@/api/customercollect.js";
import { getPersonalRegisterList } from "@/api/personalregister.js";
import SearchDialog from "@/components/searchDialog";
import Questionnaire from "@/components/surveyinformation"; // 调查问卷
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import { getSysConfigInfo } from "@/api/sysconfig";
import { printStaticsBase64 } from "@/api/printreport.js";
export default {
  name: "customerResult",
  components: { Sticky, permissionBtn, SearchDialog, Questionnaire },
  data() {
    return {
      isalterdata: true,
      medicalhistory: "",
      showMedicalhistory: false,
      giveUpRevertData: [],
      showBigMask: true, //是否显示大遮罩
      radios: "1",
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
          editor.on("focus", function (e) {
            console.log("触发");
          });
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
      personnelStatus: "1", // 客户人员排队列表状态
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
      conclusionProps: {
        children: "children",
        label: "label",
      },
      clusionCheck: [],
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
      showTwoInput: "",
      showGiveUpRevert: false,
      showHistoryAllResult: false,
      chooseHistoryAll: null,
      historyAllResult: [],
      harbdays: 180,
      photographDialogFlag: false, // 拍照弹框开关
      btnOs: false, //控制摄像头开关
      btnThisVideo: null, // 媒体对象
      btnThisContext: null, //画图对象
      btnThisCancas: null, // 当前相机对象
      btnImageUrl: "", // 图片路径
      videoWidth: 300, // 拍照尺寸宽
      videoHeight: 450, // 拍照尺寸高
      photographList: [], // 返回拍照列表数据
      previewUrl: "", // 预览url
      selectPerviewUrl: [], // 列表已选的照片数据
      photographFiles: [], // 服务器返回图片信息
      setmealRadio: "", // 用户regid
      healthadvice: "",
      timeIDDetail: "",
      timeIDInputWork: "",
      itemBpArr: [],
      showCollect: false,
      collectRemark: "",
      collectData: null,
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews", "name"]),
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
    giveUpRevertOptions() {
      return [
        {
          title: "序号",
          prop: "sortIndex",
          align: "center",
          width: 80,
          omit: 1,
        },
        {
          title: "项目名称",
          prop: "combinename",
          align: "center",
        },
      ];
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
          title: "结果描述",
          align: "center",
          prop: "itemvalue",
        },
        {
          title: "小结",
          align: "center",
          prop: "conclusion",
        },
      ];
    },
    // 常见结果表格配置
    commonOptionsThree() {
      return [
        {
          title: "小结",

          render: (h, data) => {
            return <div class="common_table_conclusion">{data.conclusion}</div>;
          },
        },
        {
          title: "结果描述",
          render: (h, data) => {
            return <div class="common_table_conclusion">{data.itemvalue}</div>;
          },
          attrs: {
            fixed: "right",
          },
        },
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
          type: "index",
          width: 40,
        },
        {
          title: "结论词",
          prop: "wordname",
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
              console.log(resultS, "resultS");
              return (
                <div style="display: flex;align-items: center;">
                  <span v-show={data.mustflag == 1} style="color: red">
                    *
                  </span>
                  <input
                    type="text"
                    disabled={this.showBigMask}
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
                    disabled={this.showBigMask}
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
                    disabled={this.showBigMask}
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
          prop: "reslower",
          align: "center",
          /* returnVal: (value, data) => {
            let result = data.resupper
              ? `${value} - ${data.resupper}`
              : `${value}`;
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
                  disabled={this.showBigMask}
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
          // returnVal: (value, data) => {
          //   let result = "";
          //   if (!data.resexp) {
          //     console.log("reslower-resupper进入");
          //     result = data.resupper
          //       ? `${value} - ${data.resupper}`
          //       : `${value}`;
          //   } else {
          //     console.log("resexp进入");
          //     result = data.resexp;
          //   }
          //   console.log(result, "result");
          //   return result;
          // },
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
                <textarea
                  type="textarea"
                  class={`focusinginput_${data.itemcode} conc_text`}
                  resize="none"
                  disabled={this.showBigMask}
                  vOn:focus={() => this.handleOnEditorFocus(data)}
                  vOn:blur={() => this.handleOnEditorInput(data)}
                  vOn:input={() => {
                    data.describe && (data.describe = data.result);
                    this.chooseInputItem.describe &&
                      (this.chooseInputItem = data);
                    let index = this.chooseProjectArr.findIndex(
                      (k) => k.itemcode === data.itemcode
                    );
                    if (index > -1) {
                      this.chooseProjectArr[index].describe = data.result;
                      this.chooseProjectArr[index].result = data.result;
                    }
                    /* this.chooseProjectArr[0] &&
                      (this.chooseProjectArr[0] = data); */
                  }}
                  v-model={data.result}
                ></textarea>
              </div>
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
    this.currentUser = this.name;
    // 页面加载获取客户排队列表
    // this.handleGetPersonnelList();
    // 加载获取登记信息叫号数据
    // this.handleGetDepartCheck();
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
    getSysConfigInfo({ cc: "Sys_Item_BP" }).then((res) => {
      res.result && (this.itemBpArr = res.result.split(","));
    });
    this.handleFocuscheckupWorkInput();
  },
  activated() {
    this.tinymceFlag1++;
    this.tinymceFlag2++;
    this.handleFocuscheckupWorkInput();
  },
  methods: {
    // 一键收藏回调
    hadnleOneClickReview() {
      MedicalDetailStatusComplete({
        regid: this.personalForm.regid,
      }).then((res) => {
        this.checkupWork = this.personalForm.regid;
        this.$message.success(res.message);
        this.handleGetDepartCheck();
      });
    },
    // 收藏保存回调
    handleConfirmCollect() {
      if (!this.collectRemark.trim()) {
        this.$message.warning("请填写备注");
        return;
      }
      CustomerCollectSave({
        regid: this.personalForm.regid,
        remark: this.collectRemark.trim(),
      }).then((res) => {
        this.$message.success("暂无数据");
        this.handleCloseCollect();
      });
    },
    // 打开收藏弹框
    hadnleShowCollect() {
      CustomerCollectPersonDetail({ regid: this.personalForm.regid })
        .then((res) => {
          console.log(res);
          if (!res.result) {
            this.$message.warning("暂无数据");
            return;
          }
          this.collectData = res.result;
          this.collectRemark = this.collectData.remark;
          this.showCollect = true;
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 关闭收藏弹框
    handleCloseCollect() {
      this.collectRemark = "";
      this.collectData = null;
      this.showCollect = false;
    },
    // 输入框值监听回调
    handlethrottleInputWork() {
      clearTimeout(this.timeIDInputWork);
      this.timeIDInputWork = setTimeout(() => {
        this.handleInputWork();
      }, 400);
    },
    // 输入框值监听回调
    handlethrottle() {
      clearTimeout(this.timeIDDetail);
      this.timeIDDetail = setTimeout(() => {
        this.handleNodeClickApi();
      }, 400);
    },
    // 删除照片回调
    handleDeletPhotograph() {
      if (this.selectPerviewUrl.length == 0) {
        this.$message.error("最少选择一个");
        return;
      }
      this.$confirm("此操作将删除当前照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = [];
          this.selectPerviewUrl.forEach((item) => {
            data.push({ regid: this.personalForm.regid, fileid: item.fileid });
          });
          data.length > 0 &&
            DeleteArchivesImages(data).then((res) => {
              this.$message.success("操作成功!");
              this.getphotographList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 保存照片回调
    handleSaveArchivesImages(base64) {
      // const blob = this.base64ToBlob(base64);
      // let data = new FormData();
      // data.append("files", blob);
      // 上传服务器-返回图片id
      ImportImage({ imagebaseStr: base64 }).then((res) => {
        console.log(res);
        this.photographFiles = res.result;
        SaveArchivesImages([
          { regid: this.personalForm.regid, fileid: res.result.id },
        ]).then((res) => {
          this.$message.success("上传成功!");
          this.getphotographList();
        });
      });
    },
    // 转换base64数据
    base64ToBlob(base64, type = "image/png") {
      const decodedData = window.atob(base64.split(",")[1]);
      const arrayBuffer = new ArrayBuffer(decodedData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < decodedData.length; i++) {
        uint8Array[i] = decodedData.charCodeAt(i);
      }
      return new Blob([uint8Array], { type });
    },
    // 获取照片列表数据
    getphotographList(fileid) {
      ArchivesImages({ regid: this.personalForm.regid, fileid }).then((res) => {
        res.code == 200 && (this.photographList = res.result);
      });
    },
    // 照片列表选择回调
    handlePhotograpSelectionChange(row) {
      this.selectPerviewUrl = row;
    },
    // 照片列表双击回调
    btnListRowClick(row) {
      // id获取文件回调
      getFiles({ Id: row.fileid }).then((res) => {
        this.previewUrl = res.result.fileUrl;
      });
    },
    // 拍照按钮回调 绘制图片
    handleBtnDrawImage() {
      // 点击，canvas画图
      this.btnThisContext.drawImage(
        this.btnThisVideo,
        0,
        0,
        this.videoWidth,
        this.videoHeight
      );
    },
    // 打开摄像头 调用摄像头权限
    handleBtnGetCompetence() {
      //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
      this.$nextTick(() => {
        const _this = this;
        this.btnOs = false; //切换成关闭摄像头
        this.btnThisCancas = document.getElementById("btnCanvasCamera");
        console.log(this.btnThisCancas, "this.btnThisCancas");
        this.btnThisContext = this.btnThisCancas.getContext("2d");
        this.btnThisVideo = document.getElementById("btnVideoCamera");
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.menavigatordiaDevices = {};
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            let getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia;
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
              );
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          audio: false,
          video: {
            width: _this.videoWidth,
            height: _this.videoHeight,
            transform: "scaleX(-1)",
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this.btnThisVideo) {
              _this.btnThisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.btnThisVideo.src = window.URL.createObjectURL(stream);
            }
            _this.btnThisVideo.onloadedmetadata = function (e) {
              _this.btnThisVideo.play();
            };
          })
          .catch((err) => {
            this.photographDialogFlag = false;
            this.$notify({
              title: "警告",
              message: "没有开启摄像头权限或浏览器版本不兼容.",
              type: "warning",
            });
          });
      });
    },
    //关闭摄像头按钮回调
    handleBtnStopNavigator() {
      if (this.btnThisVideo && this.btnThisVideo !== null) {
        this.btnThisVideo.srcObject.getTracks()[0].stop();
        this.btnOs = true; //切换成打开摄像头
      }
    },
    //清空画布
    handleBtnClearCanvas(id) {
      let c = document.getElementById(id);
      let cxt = c.getContext("2d");
      cxt.clearRect(0, 0, c.width, c.height);
    },
    //重置画布
    handleBtnResetCanvas() {
      this.btnImageUrl = "";
      this.previewUrl = "";
      this.handleBtnClearCanvas("btnCanvasCamera");
    },
    // 关闭拍照弹框回调
    handleBtnClose() {
      this.photographDialogFlag = false;
      this.btnImageUrl = "";
      this.handleBtnClearCanvas("btnCanvasCamera"); // 清空画布
    },
    // 完成拍照弹框
    handleBtnOnComplete() {
      this.btnImageUrl = this.btnThisCancas.toDataURL("image/png");
      this.btnImageUrl.split(",")[1]; // 获取base64数据
      this.handleSaveArchivesImages(this.btnImageUrl.split(",")[1]);
    },
    // 打开拍照dialog弹框回调ImportImage
    handlephotographOpenDialog() {
      this.photographDialogFlag = true;
      this.getphotographList(); // 获取照片列表数据
      this.handleBtnGetCompetence(); // 打开摄像头
    },
    // 关闭拍照dialog弹框回调
    handlephotographCloseDialog() {
      this.photographDialogFlag = false;
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
    // 判断是否血压超标提示
    handleSubmitCheckBloodPressure() {
      let itemcodes =
        this.chooseProjectArr && this.chooseProjectArr.map((k) => k.itemcode);
      if (
        itemcodes.filter((item) => this.itemBpArr.includes(item)).length > 0
      ) {
        // 合并的情况
        if (itemcodes.includes(this.itemBpArr[0])) {
          let flagXueya = this.chooseProjectArr.filter(
            (k) => k.itemcode == this.itemBpArr[0]
          )[0];
          if (
            flagXueya &&
            flagXueya.result &&
            flagXueya.result.includes("/") &&
            (+flagXueya.result.split("/")[0] > 220 ||
              +flagXueya.result.split("/")[1] > 120)
          ) {
            this.$confirm("血压值过高，是否继续？", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                this.handleSubmitPage();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else {
            this.handleSubmitPage();
          }
        } else {
          // 分开的情况
          let ssy = this.chooseProjectArr.filter(
            (k) => k.itemcode == this.itemBpArr[1]
          )[0];
          let szy = this.chooseProjectArr.filter(
            (k) => k.itemcode == this.itemBpArr[2]
          )[0];
          if (
            (ssy && ssy.result && +ssy.result > 220) ||
            (szy && szy.result && +szy.result > 120)
          ) {
            this.$confirm("血压值过高，是否继续？", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                this.handleSubmitPage();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else {
            this.handleSubmitPage();
          }
        }
      } else {
        this.handleSubmitPage();
      }
      console.log(itemcodes, "itemcodes");
    },
    handleSubmitPageBtn() {
      if (this.chooseDepart && this.chooseDepart.conclusionstatus > -1) {
        this.$confirm("已保存, 是否继续保存?", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
        })
          .then(() => {
            this.handleSubmitCheckBloodPressure();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.handleSubmitCheckBloodPressure();
      }
    },
    // 数据维护列表回调
    handleHistoryAllResultList() {
      HistoryAllResultList({
        regid: this.chooseDepart.regid,
        viewgroup: this.chooseDepart.viewgroup,
        days: +this.harbdays ? this.harbdays : 0,
      }).then((res) => {
        if (!res.result) {
          this.$message.warning("查询暂无数据!");
          return;
        }
        this.historyAllResult = res.result;
        this.showHistoryAllResult = true;
      });
    },
    // 点击行选中回调
    handleChooseHistoryAll({ row }) {
      this.chooseHistoryAll = row;
    },
    // 数据维护确认回调
    handleHistoryAllResultConfirm() {
      if (!this.chooseHistoryAll) {
        this.$message.warning("请先选中需要操作的数据!");
        return;
      }
      CopyHistoryResult({
        toregid: this.chooseDepart.regid,
        fromregid: this.chooseHistoryAll.regid,
        combinecode: this.chooseHistoryAll.combinecode,
      }).then((res) => {
        this.$message.warning(res.message);
        this.handleGetDepartCheck(this.personalForm.regid);
        this.handleHistoryAllResultCancel();
      });
    },
    // 数据维护退出回调
    handleHistoryAllResultCancel() {
      this.chooseHistoryAll = null;
      this.historyAllResult = [];
      this.harbdays = 180;
      this.showHistoryAllResult = false;
    },
    // 弃检还原还原按钮回调
    handleGiveUpRevertConfirm() {
      let flag = 0;
      for (let i = 0; i < this.giveUpRevertData.length; i++) {
        flag++;
        setDepartCheckGiveUpCancel({
          regid: this.personalForm.regid,
          checkno: this.personalForm.checkno,
          combinecode: this.giveUpRevertData[i].combinecode,
        }).then((res) => {
          if (flag == this.giveUpRevertData.length) {
            this.checkupWork = res.result.regid;
            this.handleGiveUpRevertClose();
            this.$message.success(res.message);
            this.handleGetDepartCheck();
          }
        });
      }
    },
    /* 获取弃检还原列表哦数据 */
    handleGiveUpRevert() {
      getGiveUpList({ regid: this.personalForm.regid }).then((res) => {
        if (!res.result) return;
        this.giveUpRevertData = res.result;
        this.showGiveUpRevert = true;
      });
    },
    handleGiveUpRevertClose() {
      this.giveUpRevertData = [];
      this.showGiveUpRevert = false;
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
        console.log(res);
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
      this.personnelStatus = "1";
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
        healthadvice:
          (this.summaryObj && this.summaryObj.healthadvice) ||
          this.healthadvice ||
          "",
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
    handleSetDepartCheckGetResult() {
      if (!this.chooseDepart) {
        this.$message.warning("请选择需要提取结果的项目!");
        return false;
      }
      this.saveLoading = true;
      setDepartCheckGetResult({
        regid: this.personalForm.regid,
        // combinecode: this.chooseDepart.combinecode,
      })
        .then((res) => {
          this.saveLoading = false;
          this.checkupWork = res.result.regid;
          this.$message.success(res.message);
          this.handleGetDepartCheck();
        })
        .catch((err) => {
          this.saveLoading = false;
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
    // 点击提交按钮提交保存科室检查
    handleSubmitPage() {
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
      if (this.chooseDepart.viewgroup == "3") {
        this.chooseProjectArr[0].describe = this.chooseProjectArr[0].result;
      }
      let usernameOrId = JSON.parse(localStorage.getItem("usernameOrId")) || "";
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
        operatorcode: (usernameOrId && usernameOrId.usercode) || "",
        operatorname: (usernameOrId && usernameOrId.username) || "",
        checkcode: this.chooseDepart.checkcode,
        checkname: this.chooseDepart.checkname,
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
        healthadvice:
          (this.summaryObj && this.summaryObj.healthadvice) ||
          this.healthadvice ||
          "",
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
          // this.$reload(); // 重置页面
          this.handleGetDepartCheck();
          this.saveLoading = false;
          this.handleFocuscheckupWorkInput();
          this.imageInfoFlag = false;
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
    },
    // 结论词取消回调
    handleConclusionCancel() {
      this.conclusionSearch = "";
      this.conclusionData = [];
      this.conclusionForm = {};
      this.chooseClusion = undefined;
      this.showConclusion = false;
    },
    // 结论词树形结构回调
    handleNodeConclusion(data) {
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
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.chooseDepart.sex,
        viewgroup: this.chooseDepart.viewgroup,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion: this.conclusion,
        currentitemcode: this.chooseProject,
        items: this.chooseProjectArr,
        regid: this.personalForm.regid,
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
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.personalForm.sex,
        viewgroup: this.chooseDepart.viewgroup,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        conclusion: this.conclusion,
        currentitemcode: this.chooseProject,
        items: this.chooseProjectArr,
        regid: this.personalForm.regid,
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
    // 常用结果表格双击回调
    handleCommonDbclick(row) {
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
      this.chooseProjectArr.forEach((v, i) => {
        console.log(v.itemcode == item.itemcode, "item.itemcode");
        if (v.itemcode == item.itemcode) {
          // let flagId = v.itemvalueitems.findIndex((k) => k.vueid == row.vueid);
          v.result ? v.result : (v.result = "");
          if (v.result !== row.itemvalue) {
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
              this.conclusion == ""
                ? (this.conclusion += row.conclusion)
                : (this.conclusion += `；\r\n${row.conclusion}`);
              // this.conclusion = v.describe;
              console.log(this.conclusion, "this.conclusion");
            } else {
              console.log(v.result, "v.result");
              console.log(v.result === "", "v.result === ''");
              // 基础类
              if (v.result === "") {
                v.result += row.itemvalue;
                this.$set(this.chooseInputItem, "result", v.result);
              } else {
                let tempArr = v.result.split("；");
                tempArr = tempArr.filter((k) => {
                  return k !== "";
                });
                tempArr.forEach((k, i) => {
                  if (k === v.defaultvalue || k === row.itemvalue) {
                    tempArr.splice(i, 1);
                  }
                });
                v.result = tempArr.join("；");
                v.result == ""
                  ? (v.result += row.itemvalue)
                  : (v.result += `；${row.itemvalue}`);
                this.$set(this.chooseInputItem, "result", v.result);
              }
              /* if (this.chooseInputItem.result === "") {
                this.chooseInputItem.result += row.itemvalue;
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
              } */
            }
          }
        }
      });
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
          // this.$set(this.chooseProjectArr[i], "result", item.result);
        }
      });
      // item.result = item.result;
      // console.log(item.result, "item.result");
      // console.log(this.chooseProjectArr, "this.chooseProjectArr");
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
        combinecode: this.chooseDepart.combinecode,
        combinename: this.chooseDepart.combinename,
        sex: this.personalForm.sex,
        viewgroup: this.chooseDepart.viewgroup,
        conclusion: this.conclusion,
        defaultconclusion: this.chooseDepart.defaultconclusion,
        currentitemcode: this.chooseProject,
        items: this.chooseProjectArr,
        regid: this.personalForm.regid,
      };
      getConclusionDetail(data).then((res) => {
        this.summaryObj = res.result;
        this.chooseDepart.viewgroup != 3 &&
          (this.conclusion = res.result.conclusion);
        this.specialistadvice = res.result.specialistadvice;
        this.healthadvice = res.result.healthadvice;
        // if (res.result.worditems.length != 0) {
        // res.result.worditems.forEach((item) => {
        //   let flag = this.entryData.findIndex(
        //     (k) => k.wordcode == item.wordcode
        //   );
        //   flag == -1 && this.entryData.push(JSON.parse(JSON.stringify(item)));
        // });
        // }
        this.entryData = res.result.worditems;
        res.result.resultitems &&
          res.result.resultitems.forEach((k) => {
            this.chooseDepart.items.forEach((item) => {
              if (k.itemcode == item.itemcode) {
                item.tips = k.tips;
                item.healthstatus = k.healthstatus;
              }
            });
            this.chooseProjectArr.forEach((item) => {
              if (k.itemcode == item.itemcode) {
                item.tips = k.tips;
                item.healthstatus = k.healthstatus;
              }
            });
          });
        // resultitems
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
      if (
        this.conclusion == "" ||
        (this.conclusion.includes("未见明显异常") &&
          !this.conclusion.includes("未见明显异常", 1))
      ) {
        this.handleInputdom1(data);
      }
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
      this.chooseProjectArr = [];
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
    handleChangeTriageTime(val) {
      if (!val) this.triageTime = [];
      this.handleGetPersonnelList();
    },
    // 获取客户排队列表回调
    handleGetPersonnelList() {
      this.loading = true;
      console.log(this.triageTime);
      let whereitems = [
        {
          key: "status",
          value: this.personnelStatus,
        },
      ];
      if (this.triageTime && this.triageTime.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.triageTime[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.triageTime[1],
        });
      }
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
      this.setmealRadio = row.regid;
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
        .then((res) => {
          this.loadingObj && this.loadingObj.close(); // 关闭模态框
          if (!res.result) {
            this.$message.warning("未查询到人员信息!");
            this.$reload();
          } else {
            let data = res.result;
            this.setmealRadio = data.regid; // 保存用户regid
            this.chooseDepart = undefined;
            this.chooseProjectArr = [];
            this.isalterdata = data.isalterdata;
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
            this.departitems = data.departitems.filter((k) => {
              return k.combineitems.length > 0;
            });
            if (this.chooseCombine && this.chooseCombine.regid == data.regid) {
              this.$nextTick(() => {
                this.defaultChecked.push(this.chooseCombine.id);
                // click 选中指定子项
                let code = this.chooseCombine.id;
                this.$refs[`treeItem_${code}`].click();
                this.isDel = false;
                // 勾选复选框
                // this.$refs.rightsTree.setCheckedKeys(this.defaultChecked);
              });
            } else {
              // 默认勾选第一科室第一个子项
              this.$nextTick(() => {
                // 添加第一个科室的第一个子项
                this.defaultChecked.push(
                  data.departitems[0].combineitems[0].id
                );
                // click 选中指定子项
                let code = data.departitems[0].combineitems[0].id;
                this.$refs[`treeItem_${code}`].click();
                // 勾选复选框
                // this.$refs.rightsTree.setCheckedKeys(this.defaultChecked);
              });
            }
            this.personalForm.sexs =
              data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
            this.personalForm.age = `${data.age}岁`;
            // 年龄单位列表 / 回显值
            this.agearr = data.ageunititems;
            this.personalForm.ageunit =
              data.ageunititems.filter((k) => k.selected)[0] &&
              data.ageunititems.filter((k) => k.selected)[0].code;
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
          }
        })
        .catch(() => {
          this.loadingObj && this.loadingObj.close(); // 关闭模态框
        });
      this.checkupWork = "";
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
      if (value && value.combinecode) {
        this.chooseCombine = value;
        this.handlethrottle();
      } else {
        this.chooseDepart = undefined; //重置选中对象
        this.chooseProjectArr = []; //重置选中对象
      }
    },
    // 点击树形结构获取当前选中科室 - 接口逻辑请求
    handleNodeClickApi() {
      getCombineDetail({
        regid: this.chooseCombine.regid,
        checkno: this.personalForm.checkno,
        combinecode: this.chooseCombine.combinecode,
      }).then((res) => {
        let data = res.result;
        this.commonData = []; // 重置右侧常用结果表格
        this.chooseDepart = JSON.parse(JSON.stringify(data));
        if (this.chooseDepart.viewgroup == 2) {
          this.chooseDepart.items = this.chooseDepart.items.filter((k) => {
            return k.isshow;
          });
        }
        /* 项目升序排序 */
        this.chooseDepart.items = this.chooseDepart.items.sort(function (a, b) {
          return a.resultseqno - b.resultseqno;
        });
        this.summaryForm = JSON.parse(JSON.stringify(data));
        this.summaryForm.statusName =
          this.summaryForm.conclusionstatus == -1
            ? "已登记"
            : this.summaryForm.conclusionstatus == 0
            ? "已保存"
            : "已审核";
        this.doctoritems = JSON.parse(JSON.stringify(data.doctoritems));
        this.chooseProjectArr = []; // 重置选中项目数组
        this.chooseProjectArr = this.chooseDepart.items;
        /*data.items.forEach((item) => {
            if (item.result != "") {
              this.chooseProjectArr.push(item);
            }
          });*/
        {
          /* this.chooseProjectArr.forEach((k, i) => {
            let tempArr = [];
            k.itemvalueitems.map((item, index) => {
              if (k.result && k.result.split("；").includes(item.conclusion)) {
                tempArr.push(item);
              }
            });
            k.itemvalueitems = [...k.itemvalueitems, ...tempArr];
          }); */
        }
        this.chooseInputItem = undefined; // 重置选中项目数组
        this.showTableDisabled = false;
        this.showTableFlag = "commonResult";
        this.summaryObj = undefined; // 重置请求小结成功返回对象
        this.entryData = this.chooseDepart.worditems;
        this.checkList = []; // 重置选中项目复选框
        this.fileList = [];
        this.imageInfoFlag = false;
        if (data.medicalhistoryitem) {
          this.medicalhistory = data.medicalhistoryitem.medicalhistorydes;
          this.showMedicalhistory = true;
        }

        // 回显复选框数据
        this.chooseDepart.items.forEach((item) => {
          item.itemvalueitems.forEach((k) => {
            k.selected && this.checkList.push(k.vueid);
          });
        });
        this.conclusion = this.chooseDepart.conclusion;
        this.specialistadvice = this.chooseDepart.specialistadvice;
        this.healthadvice = this.chooseDepart.healthadvice;
        if (this.chooseCombine.isconclusion) {
          this.showBigMask = true;
        } else {
          this.showBigMask = false;
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
        }
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
        setTimeout(() => {
          let tempArr = this.chooseDepart.items;
          if (tempArr.length == 0) return;
          let pDom = document.querySelector(
            `.focusinginput_${tempArr[0].itemcode}`
          );
          if (!pDom) return;
          if (pDom.value === "/") {
            this.handleSetPosition(pDom);
          } else {
            pDom.focus();
          }
        }, 100);
      });
    },
    // 发送和接收消息
    handdleMsg(msg) {
      let that = this;
      console.log(that.$global.ws);
      if (that.$global.ws && that.$global.ws.readyState == 1) {
        console.log("发送信息", msg);
        that.$global.ws.send(msg);
      }
      that.$global.ws.onmessage = function (msg) {
        console.log("检查录入socket", JSON.parse(msg.data));
        if (msg.data != "连接成功" && JSON.parse(msg.data)) {
          const data = JSON.parse(msg.data);
          if (
            data.Fingercode &&
            data.Fingercode == localStorage.getItem("md5code")
          ) {
            console.log(data, "socketdata");
            console.log(that.chooseProjectArr, "666");
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
          }
        }
      };
    },
    jsonSf(data) {
      return JSON.stringify(data);
    },
    // 聚焦光标至首位
    handleSetPosition(tobj) {
      let spos = 0;
      tobj.setSelectionRange(spos, spos);
      if (tobj.setSelectionRange) {
        //兼容火狐,谷歌
        setTimeout(function () {
          if (tobj.value == "0.0000") {
            tobj.setSelectionRange(spos, spos + 1);
          } else {
            tobj.setSelectionRange(spos, spos);
          }
          tobj.focus();
        }, 0);
      } else if (tobj.createTextRange) {
        //兼容IE
        var rng = tobj.createTextRange();
        rng.move("character", spos);
        rng.select();
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
      console.log(domId);
      switch (domId) {
        case "btnRefresh": // 刷新
          this.handleRefreshDetails();
          break;
        case "btnHistoryAllResult": // 数据维护
          if (!this.chooseDepart) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.handleHistoryAllResultList();
          break;
        case "btnSearch": // 检索
          this.handleShowSearch();
          break;
        case "btnCollect": // 收藏
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.hadnleShowCollect();
          break;
        case "btnOneClickReview":
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.hadnleOneClickReview();
          break;
        case "btnEdit": // 编辑
          if (this.personalForm.status > 6) {
            this.$message.warning("当前状态已审核不允许修改!");
            return;
          }
          this.showBigMask = false;
          if (this.currentUser) {
            this.summaryForm.operatorname = this.currentUser;
          }
          break;
        case "btnKeep": // 保存
          if (this.chooseDepart && this.chooseDepart.conclusionstatus > -1) {
            this.$confirm("已保存, 是否继续保存?", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                this.handleSubmitPage();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else {
            this.handleSubmitPage();
          }
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
          this.handleGetGiveUpCheck();
          break;
        case "btnResult": // 提取结果
          this.handleSetDepartCheckGetResult();
          break;
        case "btnGiveUpRevert": // 弃检还原
          if (!this.personalForm.regid) {
            this.$message.warning("请先查询人员信息!");
            return false;
          }
          this.handleGiveUpRevert();
          break;
        case "btnDel": // 删除
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
          jumpRouteLink(this, "totalcheck");
          this.$router.push({
            path: `/totalcheck/${this.Hospitals}`,
            query: { regid: this.personalForm.regid },
          });
          break;
        case "btnQuestionnaire": // 调查问卷
          this.handleShowQuestionnaire();
          break;
        case "btnPhotograph": //  拍照
          if (!!this.personalForm.regid) {
            this.handlephotographOpenDialog();
          } else {
            this.$message({
              showClose: true,
              message: "请选择人员再进行拍照",
              type: "error",
            });
          }
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
@import "./css/index_gyey.scss";
@import "./css/zh_CN.scss";
</style>
