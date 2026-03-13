<template>
  <div class="total_check">
    <!-- 头部操作控件 -->
    <!-- <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn
          moduleName="personalregister"
          ref="personalregister"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
    </sticky> -->
    <div class="filter-container">
      <el-input style="width: 200px" size="mini" placeholder="请输入体检号" v-model="checkupWork" clearable v-show="!showTopAnm" @keyup.enter.native="handleSearchTotalCheck">
      </el-input>
      <div v-for="(btn, index) of buttons" :key="index">
        <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId)" class="print_box" placement="bottom" trigger="click">
          <el-button type="primary" plain slot="reference" :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
          <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">打印</div>
          <div class="print_item" v-if="btn.name == '报告书'" @click="handleSelectPrint(btn.domId)">
            选页打印
          </div>
          <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
        </el-popover>
        <el-button type="primary" plain v-else :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="subject">
      <!-- 搜索盒子 -->
      <div class="search_box">
        <!-- <div class="s_title">
          <div class="line"></div>
          <div class="text">检索条件</div>
        </div> -->
        <el-row class="search_body" :class="showTopAnm ? 'search_body_y' : 'search_body_n'" v-show="showTopAnm">
          <el-col :span="4" class="code_box">
            <div class="box">
              <div class="btn_group">
                <!-- <el-popover
                ref="popoverRef"
                placement="bottom-start"
                trigger="click"
              >
                <div class="content">
                  <div
                    class="content_item"
                    v-for="item in checkupCodeArr"
                    :key="item.code"
                    @click="handleSelectCondition(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <el-button
                  plain
                  type="primary"
                  style="width: 80px"
                  size="mini"
                  slot="reference"
                  >{{ condition }}</el-button
                >
              </el-popover> -->
                <!-- <el-button
                plain
                type="primary"
                style="width: 80px"
                size="mini"
                slot="reference"
                >体检号</el-button
              > -->
                <el-button size="mini" class="total_btn" type="primary" icon="iconfont icon-jiandu" @click="handleTotalCheckOpen">我的总检</el-button>
                <el-button size="mini" class="total_btn" type="primary" icon="iconfont icon-jiandu" @click="handleTotalAssignmentOpen">分配</el-button>
              </div>
              <el-input size="mini" ref="checkupWorkInput" :placeholder="`请输入${condition}`" v-model="checkupWork" clearable @keyup.enter.native="handleSearchTotalCheck">
              </el-input>
            </div>
            <el-radio-group v-model="conditionCode">
              <el-radio v-for="item in checkupCodeArr" :key="item.code" :label="item.code" @change="condition = item.name">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="20" class="form_box">
            <el-form ref="form" :model="currentPeople" label-width="80px">
              <el-row>
                <el-col :span="5">
                  <el-form-item size="mini" class="regid_item" label="体检号">
                    <el-input disabled v-model="currentPeople.regid"></el-input>
                    <el-checkbox :true-label="1" :false-label="0" :disabled="disabledIsused" v-model="currentPeople.isused" @change="handleChangeIsused"></el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="姓名">
                    <el-input disabled v-model="currentPeople.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="性别">
                    <el-input disabled v-model="currentPeople.sex"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="年龄">
                    <el-input disabled v-model="currentPeople.agecn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="婚姻">
                    <el-input disabled v-model="currentPeople.marriage"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item size="mini" label="联系电话">
                    <el-input disabled v-model="currentPeople.telephone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="身份证">
                    <el-input disabled v-model="currentPeople.idcard"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="体检类型">
                    <el-input disabled v-model="currentPeople.checktypeCN"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="团检名称">
                    <el-input disabled v-model="currentPeople.company"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="费用">
                    <el-input disabled v-model="currentPeople.price"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item size="mini" label="标准金额">
                    <el-input disabled v-model="currentPeople.quota"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="收费状态">
                    <el-input disabled v-model="currentPeople.chargeflagcn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="打印状态">
                    <el-input disabled v-model="currentPeople.reportprintcn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="打印时间">
                    <el-input disabled v-model="currentPeople.reportprintdate"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="解读状态">
                    <el-input disabled v-model="currentPeople.readstatusCN"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="img_box">
              <div class="photo_box">
                <img :src="avatarImg" :draggable="false" class="avatar" alt="摄像头" />
              </div>
            </div>
          </el-col>
        </el-row>
        <div title="点击隐藏/显示" class="btnToggleTop" v-if="showTopAnm == true" @click="showTopAnm = !showTopAnm">
          <i class="el-icon-arrow-up"></i>
        </div>
        <div title="点击隐藏/显示" class="btnToggleTop" v-if="showTopAnm == false" @click="showTopAnm = !showTopAnm">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <!-- 主体内容 -->
      <el-row class="content_box" :class="showTopAnm ? 'content_box_h_y' : 'content_box_h_n'">
        <div class="personnel_box" :class="showLeftAnm ? '' : 'personnel_box_n'">
          <div class="show_box" v-show="showLeftAnm">
            <div class="pers_table_box">
              <div class="title">
                <div class="text">体检记录</div>
                <el-tag size="small">{{ persData.length }}</el-tag>
              </div>
              <EasyTable :loading="loading" class="pers_table" ref="persTable" height="100%" :data="persData" @row-click="handleChoosePers" :tableOptions="persOptions" :radio-config="{
                  rowClick: true,
                }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            </div>
            <div class="comb_table_box">
              <div class="title mtb">
                <div class="text">体检组合</div>
                <el-tag size="small">{{ combData.length }}</el-tag>
              </div>
              <EasyTable :loading="loading" class="comb_table" height="100%" :data="combData" :tableOptions="combOptions" :radio-config="{
                  rowClick: true,
                }" @row-click="handleChooseComb" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            </div>
          </div>
          <div class="btnToggleLeft" title="点击隐藏/显示" v-if="showLeftAnm == true" @click="showLeftAnm = !showLeftAnm">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="btnToggleLeft" title="点击隐藏/显示" v-if="showLeftAnm == false" @click="showLeftAnm = !showLeftAnm">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="important_box" :class="showLeftAnm ? '' : 'important_box_n'">
          <div class="body_box">
            <!-- 主体操作内容结构 -->
            <div class="check_body">
              <div class="check_left">
                <div class="radio_box">
                  <!-- 当前标签页 -->
                  <el-radio-group v-model="checkActive" @change="handleTabsChange" size="mini">
                    <el-radio-button label="describe">总检综述</el-radio-button>
                    <el-radio-button label="contrast">历史对比</el-radio-button>
                    <el-radio-button label="depart">科室检查</el-radio-button>
                    <el-radio-button label="totalCheck">历史总检</el-radio-button>
                    <el-radio-button label="archives">健康档案</el-radio-button>
                  </el-radio-group>
                  <el-button type="primary" class="overview" size="mini" plain :disabled="pageStatus" @click="handleResetOverView">生成综述</el-button>
                </div>
                <!-- 当前页操作控件 -->
                <!-- <div class="handle_box"> -->
                <!-- <div class="handle_title">{{ checkText }}</div> -->
                <!-- <div class="handle_btn" v-if="checkActive == 'describe'" @click="handleMoveToRight">
                <i class="el-icon-right"></i>
                <el-link type="primary">右移</el-link>
              </div> -->
                <!-- </div> -->
                <!-- 主体内容结构 -->
                <el-scrollbar class="check_b">
                  <!-- 总检综述 dom1 describe   -->
                  <div v-if="checkActive == 'describe'" class="dom1">
                    <el-input class="combinename_text" type="textarea" resize="none" :disabled="pageStatus" :autosize="true" v-model="conclusiontext"></el-input>
                    <!-- <div
                      v-for="(item, index) in conclusionitems"
                      :key="index"
                      class="dom1_item"
                      :label="item"
                    > -->
                    <!-- <div class="item_top">
                        <el-input
                          class="combinename_text"
                          type="textarea"
                          resize="none"
                          :autosize="true"
                          v-model="item.combinename"
                        ></el-input>
                        <div class="del_btn">
                          <i
                            class="el-icon-circle-close"
                            @click="handleDelOverView(item)"
                          ></i>
                        </div>
                      </div>
                      <div class="line"></div> -->
                    <!-- :autosize="{ minRows: 1, maxRows: 8 }" -->
                    <!-- <div class="item_body">
                        <div class="conclusion">
                          <el-input
                            class="conc_text"
                            type="textarea"
                            resize="none"
                            :autosize="true"
                            v-model="item.conclusion"
                          ></el-input>
                        </div> -->
                    <!-- <div class="words">
                          <div class="words_mask"></div> readonly :autosize="{ minRows: 1, maxRows: 8 }"
                          <el-input
                            class="conc_text"
                            type="textarea"
                            resize="none"
                            disabled
                            :autosize="{ minRows: 1, maxRows: 8 }"
                            v-model="item.conclusionwords"
                          ></el-input>
                        </div> -->
                    <!-- <div class="btn_group">
                          <el-link @click="handleSelectMoveToRight(item)">选中右移</el-link>
                          <el-link
                            type="primary"
                            @click="handleMoveToRight(item)"
                          >
                            <i class="el-icon-right"></i>
                          </el-link>
                        </div> -->
                    <!-- </div> -->
                    <!-- </div> -->
                  </div>
                  <!-- 历史对比 dom2 contrast   -->
                  <div v-if="checkActive == 'contrast'" class="dom2">
                    <EasyTable class="contrast_table" height="100%" :data="contrastData" :tableOptions="contrastOptions" :radio-config="{ rowClick: true }" @row-click="handleContrastRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <el-input class="contrast_text" type="textarea" :rows="12" resize="none" disabled v-model="contrastResult"></el-input>
                  </div>
                  <!-- 科室检查 dom3 depart -->
                  <div v-if="checkActive == 'depart'" class="dom3">
                    <EasyTable class="depart_table" height="100%" :data="departData" :tableOptions="departOptions" :radio-config="{ rowClick: true }" @row-click="handleDepartRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                  <!-- 历史总检 dom4 totalCheck -->
                  <div v-if="checkActive == 'totalCheck'" class="dom4">
                    <EasyTable class="totalCheck_table" height="100%" :data="totalCheckData" :tableOptions="totalCheckOptions" :radio-config="{ rowClick: true }" @row-click="handleTotalCheckRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                  <!-- 健康档案 dom5 archives -->
                  <div v-if="checkActive == 'archives'" class="dom5">
                    <EasyTable class="archives_table" height="100%" :data="archivesData" :tableOptions="archivesOptions" :radio-config="{ rowClick: true }" @row-click="handleArchivesRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                </el-scrollbar>
                <!-- 职业性评价 -->
                <div class="occupation_head" v-if="isoccupation">职业性评价</div>
                <div class="occupation" v-if="isoccupation">
                  <div class="check_group">
                    <el-radio-group v-model="checkRadio">
                      <el-radio v-for="(item, index) in occupationChecks" :key="index" :label="item.code">{{ item.name }}</el-radio>
                    </el-radio-group>
                    <el-checkbox v-model="occupationSelects.selected">{{
                      occupationSelects.name
                    }}</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="check_right">
                <!-- 当前页操作控件 -->
                <div :class="[checkActive == 'describe' ? '' : 'none', 'handle_box']">
                  <el-tabs v-model="activeName">
                    <el-tab-pane label="健康建议" name="jkjy">健康建议</el-tab-pane>
                    <el-tab-pane label="饮食建议" name="ysjy">饮食建议</el-tab-pane>
                    <el-tab-pane label="运动建议" name="ydjy">运动建议</el-tab-pane>
                    <el-tab-pane label="健康知识" name="jkzs">健康知识</el-tab-pane>
                    <el-tab-pane label="体检结论" name="tjjl">体检结论</el-tab-pane>
                  </el-tabs>
                  <div class="handle_btn_group">
                    <div class="handle_btn" @click="pageStatus != true && handleFollowUpReferral()">
                      <el-tooltip class="item" effect="dark" content="复查/转诊" placement="top">
                        <i class="el-icon-guide"></i>
                      </el-tooltip>
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleMoveConclusion()">
                      <el-tooltip class="item" effect="dark" content="调整" placement="top">
                        <i class="el-icon-rank"></i>
                      </el-tooltip>
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleAddConclusion()">
                      <el-tooltip class="item" effect="dark" content="增加" placement="top">
                        <i class="el-icon-plus"></i>
                      </el-tooltip>
                      <!-- <el-link type="primary">增加</el-link> -->
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleDelWordItems()">
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="el-icon-minus"></i>
                      </el-tooltip>
                      <!-- <el-link type="primary">删除</el-link> -->
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleMoveTopping()">
                      <el-tooltip class="item" effect="dark" content="置顶" placement="top">
                        <i class="el-icon-top"></i>
                      </el-tooltip>
                      <!-- <el-link type="primary">上移</el-link> -->
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleMoveTop()">
                      <el-tooltip class="item" effect="dark" content="上移" placement="top">
                        <i class="el-icon-upload2"></i>
                      </el-tooltip>
                      <!-- <el-link type="primary">上移</el-link> -->
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleMoveBottom()">
                      <el-tooltip class="item" effect="dark" content="下移" placement="top">
                        <i class="el-icon-download"></i>
                      </el-tooltip>
                      <!-- <el-link type="primary">下移</el-link> -->
                    </div>
                    <div class="handle_btn" @click="pageStatus != true && handleWordMerge()">
                      <el-tooltip class="item" effect="dark" content="合并" placement="top">
                        <i class="el-icon-s-unfold"></i>
                      </el-tooltip>
                      <!-- <el-link type="primary">合并</el-link> -->
                    </div>
                  </div>
                </div>
                <!-- 主体内容结构 -->
                <el-scrollbar class="check_b">
                  <!-- 总检综述 dom1 describe 健康建议   -->
                  <div v-for="(item, index) in worditems" :key="index">
                    <!-- <div
                      class="check_b_title"
                      v-if="item.wordname.length > 0 && activeName == 'jkjy'"
                    >
                      <el-tag
                        type="danger"
                        v-if="checkActive == 'describe' && item.level == 0"
                        >普通</el-tag
                      >
                      <el-tag
                        type="danger"
                        v-if="checkActive == 'describe' && item.level == 1"
                        >进一步治疗</el-tag
                      >
                      <el-tag
                        type="danger"
                        v-if="checkActive == 'describe' && item.level == 2"
                        >立马治疗</el-tag
                      >
                    </div> -->
                    <el-checkbox-group v-if="
                        item.wordname.length > 0 &&
                        checkActive == 'describe' &&
                        activeName == 'jkjy'
                      " class="dom1 item_drag" :disabled="pageStatus" v-model="checkAdvise1">
                      <draggable v-model="item.wordname" chosenClass="chosen" :disabled="true" forceFallback="true" handle=".text_h_drag" :group="index" animation="400" @start="handleDragOnStart" @end="handleDragOnEnd">
                        <el-checkbox v-for="(val, ind) in item.wordname" :key="ind" class="dom1_item" :label="val">
                          <div class="dra_b">
                            <div class="dra_t">{{ ind + 1 }}、</div>
                            <div class="dra_cont">
                              <div class="item_top dom1_item_top">
                                <div class="text text_h_drag" style="width: 62%">
                                  <!-- <el-input size="mini" v-model="item.wordname"></el-input> -->
                                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 8 }" resize="none" :disabled="pageStatus" v-model="val.wordname"></el-input>
                                </div>
                                <div class="text_h_check" style="width: 50%">
                                  <!-- class="text_h_check_box" -->
                                  <el-row>
                                    <el-col :span="6" class="checkFlex">
                                      <vxe-checkbox v-model="val.illnessstatus" :checked-value="1" :unchecked-value="0" size="small">重大异常</vxe-checkbox>
                                    </el-col>
                                    <el-col :span="4" class="checkFlex">
                                      <vxe-checkbox v-model="val.transferstatus" :checked-value="1" :unchecked-value="0" size="small">转诊</vxe-checkbox>
                                    </el-col>
                                    <el-col :span="5" class="checkFlex">
                                      <vxe-checkbox v-model="val.followstatus" :checked-value="1" :unchecked-value="0" size="small">复查</vxe-checkbox>
                                    </el-col>
                                    <el-col :span="7" class="departmentClas checkFlex">
                                      <div>
                                        科室:
                                        <el-select size="mini" v-model="val.transferdeptcode" style="width: 100%" @change="handleTrasnferdept(val)" clearable>
                                          <el-option v-for="(item, index) in DepartmentList" :key="index" :label="item.name" :value="item.code"></el-option>
                                        </el-select>
                                      </div>
                                      <!-- <el-form inline v-model="currentPeople">
                                        <el-form-item label="科室">
                                          <el-select
                                            size="mini"
                                            v-model="val.transferdeptcode"
                                            style="width: 100%"
                                            @change="handleTrasnferdept(val)"
                                            clearable
                                          >
                                            <el-option
                                              v-for="(
                                                item, index
                                              ) in DepartmentList"
                                              :key="index"
                                              :label="item.name"
                                              :value="item.code"
                                            ></el-option>
                                          </el-select>
                                        </el-form-item>
                                      </el-form> -->
                                    </el-col>
                                    <!-- <el-checkbox
                                    class="text_h_check_box"
                                    v-model="val.transferstatus"
                                    >转诊</el-checkbox
                                  >
                                  <el-checkbox
                                    class="text_h_check_box"
                                    v-model="val.followstatus"
                                  >
                                    复查</el-checkbox
                                  > -->
                                  </el-row>
                                </div>
                              </div>
                              <div class="line"></div>
                              <div class="item_body">
                                <el-input type="textarea" :autosize="true" resize="none" :disabled="pageStatus" v-model="val.healthadvice"></el-input>
                              </div>
                            </div>
                          </div>
                        </el-checkbox>
                      </draggable>
                    </el-checkbox-group>
                  </div>
                  <!-- 饮食建议文本域 ysjy -->
                  <el-input v-if="activeName == 'ysjy'" class="ysjy" type="textarea" resize="none" :disabled="pageStatus" v-model="dietadviceText"></el-input>
                  <!-- 运动建议文本域 ydjy -->
                  <el-input v-if="activeName == 'ydjy'" class="ydjy" type="textarea" resize="none" :disabled="pageStatus" v-model="sportsadviceText"></el-input>
                  <!-- 健康知识文本域 jkzs -->
                  <el-input v-if="activeName == 'jkzs'" class="jkzs" type="textarea" resize="none" :disabled="pageStatus" v-model="healthknowledgeText"></el-input>
                  <el-input v-if="activeName == 'tjjl'" class="tjjl" type="textarea" resize="none" :disabled="pageStatus" v-model="totalconclusion"></el-input>
                  <!-- 历史对比 dom2 contrast   -->
                  <div v-if="checkActive == 'contrast'" class="dom2">
                    <EasyTable class="verdict_table" height="100%" :data="verdictData" :tableOptions="verdictOptions" :radio-config="{ rowClick: true }" @row-click="handleVerdictDataRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <EasyTable class="verdict_dt" height="100%" :data="verdictDtData" :tableOptions="verdictDtOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                  <!-- 科室检查 dom3 depart -->
                  <div v-if="checkActive == 'depart'" class="dom3">
                    <EasyTable class="departDt_table" height="100%" :data="departDtData" :row-style="rowstyle" :tableOptions="
                        departDtFlag === '3' ? departDtOptions1 : departDtOptions
                      " :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <el-form class="departDt_form" label-width="80px">
                      <el-form-item size="mini" label="检查医生">
                        <el-input v-model="departDtName" disabled></el-input>
                      </el-form-item>
                      <el-form-item size="mini" label="检查时间">
                        <el-date-picker v-model="departDtTime" disabled value-format="yyyy-MM-dd-HH-mm-ss" type="datetime">
                        </el-date-picker>
                      </el-form-item>
                    </el-form>
                  </div>
                  <!-- 历史总检 dom4 totalCheck -->
                  <div v-if="checkActive == 'totalCheck'" class="dom4">
                    <EasyTable class="totalDt1_table" height="100%" :data="totalDt1Data" :tableOptions="totalDt1Options" :radio-config="{ rowClick: true }" @row-click="handleTotalDttaRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <EasyTable class="totalDt2_table" height="100%" :data="totalDt2Data" :tableOptions="totalDt2Options" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                  <!-- 健康档案 dom5 archives -->
                  <div v-if="checkActive == 'archives'" class="dom5">
                    <EasyTable class="archivesDt1_table" height="100%" :data="archivesDt1Data" :tableOptions="archivesDt1Options" :radio-config="{ rowClick: true }" @row-click="handleAarchivesDtRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <EasyTable class="archivesDt2_table" height="100%" :data="archivesDt2Data" :tableOptions="archivesDt2Options" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                  </div>
                </el-scrollbar>
              </div>
            </div>

            <!-- 底部表单 -->
            <div class="check_form">
              <el-form ref="form" :disabled="pageStatus || currentPeople.updatestatus == 0" :model="currentPeople" label-width="80px">
                <el-form-item size="mini" label="总检医生">
                  <el-select v-model="currentPeople.doctorcode" clearable>
                    <el-option v-for="(item, index) in currentPeople.doctoritems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="mini" label="总检时间">
                  <el-date-picker v-model="currentPeople.inputdate" value-format="yyyy-MM-dd hh:mm:ss" type="datetime">
                  </el-date-picker>
                </el-form-item>
                <el-form-item size="mini" label="录入者">
                  <!-- <el-input v-model="currentPeople.operatorname"></el-input> -->
                  <el-select v-model="currentPeople.operatorname" clearable>
                    <el-option v-for="(item, index) in currentPeople.doctoritems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="mini" label="审核医生">
                  <!-- <el-input v-model="currentPeople.checkname"></el-input> -->
                  <el-select v-model="currentPeople.checkcode" clearable @change="handleChangeCheckCode">
                    <el-option v-for="(item, index) in currentPeople.doctoritems" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="mini" label="审核时间">
                  <el-date-picker v-model="currentPeople.checkdate" value-format="yyyy-MM-dd hh:mm:ss" type="datetime">
                  </el-date-picker>
                </el-form-item>
                <el-form-item size="mini" label="状态">
                  <el-input v-model="currentPeople.statuscn" disabled></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <!-- 复查/转诊 -->
    <el-dialog title="复查/转诊" :visible.sync="showFollowUpReferral" width="1000px" class="dia_followUpReferral" :show-close="false" :close-on-click-modal="false">
      <div class="dfur_content" v-if="worditems && worditems[0]">
        <div class="dfur_citem" v-for="val in worditems[0].wordname" :key="val.uniqueid">
          <div class="dfur_title">{{ val.wordname }}</div>
          <div class="control_box">
            <vxe-checkbox v-model="val.followstatus" class="text_h_check_box" :checked-value="1" :unchecked-value="0" size="small">复查</vxe-checkbox>
            <el-date-picker style="width: 180px; margin: 0 10px" :disabled="val.transferstatus == 0" v-model="val.followdate" type="date" placeholder="选择日期" size="mini" value-format="yyyy-MM-dd">
            </el-date-picker>
            <vxe-checkbox v-model="val.transferstatus" class="text_h_check_box" :checked-value="1" :unchecked-value="0" size="small">转诊</vxe-checkbox>
            <el-input style="width: 500px; margin: 0 10px" :disabled="val.followstatus == 0" placeholder="请输入内容" v-model="val.transferdes" clearable type="textarea" resize="none" size="mini" :autosize="{ minRows: 1, maxRows: 5 }">
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showFollowUpReferral = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 总检弹框 -->
    <el-dialog class="total_dialog" :visible.sync="showTotalCheck" width="40%" @close="handleTotalCheckClose">
      <div class="head_box">
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
          <el-date-picker v-model="triageTime" type="datetimerange" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="handleChangeTriageTime" @clear="handleChangeTriageTime">
          </el-date-picker>
        </div>
        <el-radio-group @change="handleGetDepartCheckList" v-model="dialogActive" size="mini">
          <el-radio-button :label="0">待总检</el-radio-button>
          <el-radio-button :label="1">我总检</el-radio-button>
        </el-radio-group>
      </div>
      <div class="table_box">
        <EasyTable v-if="dialogActive == 0" class="wait_table" height="100%" :data="waitData" :tableOptions="waitOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCheckTotal" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <EasyTable v-if="dialogActive == 1" class="total_table" height="100%" :data="totalData" :tableOptions="totalOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCheckTotal" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      </div>
      <div class="tips">
        记录数：{{ dialogActive == 0 ? waitData.length : totalData.length }}
      </div>
      <div style="text-align: center; margin-top: 15px">
        <el-button size="mini" @click="handleTotalCheckClose">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 分配弹框 -->
    <el-dialog class="total_dialog" :visible.sync="showAssignmentCheck" width="40%" @close="handleTotalCheckClose">
      <div class="head_box">
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
          <el-date-picker v-model="triageTime" type="datetimerange" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="handleChangeTriageTime" @clear="handleChangeTriageTime">
          </el-date-picker>
        </div>
        <el-radio-group @change="handleGetMyPlanList" v-model="assignmentFlag" size="mini">
          <el-radio-button :label="2">我的任务</el-radio-button>
          <el-radio-button :label="0">可总检</el-radio-button>
          <el-radio-button :label="1">已总检</el-radio-button>
        </el-radio-group>
      </div>
      <div class="table_box">
        <EasyTable v-if="assignmentFlag == 2" class="wait_table" height="100%" :data="myTaskData" :tableOptions="myTaskOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCheckTotal" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <EasyTable v-if="assignmentFlag == 0" class="wait_table" height="100%" :data="waitData" :tableOptions="waitOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCheckTotal" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <EasyTable v-if="assignmentFlag == 1" class="total_table" height="100%" :data="totalData" :tableOptions="totalOptions" :radio-config="{ rowClick: true }" @row-dblclick="handleCheckTotal" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      </div>
      <div class="tips">
        记录数：{{
          assignmentFlag == 0
            ? waitData.length
            : assignmentFlag == 2
            ? myTaskData.length
            : totalData.length
        }}
      </div>
      <div style="text-align: center; margin-top: 15px">
        <el-button size="mini" @click="handleTotalCheckClose">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查询占用人 -->
    <el-dialog :visible.sync="showOccupyDialog">
      <el-form :inline="true" :model="Occupyform" class="demo-form-inline">
        <el-form-item label="登记id">
          <el-input v-model="Occupyform.regid" size="mini" placeholder="输入登记id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onOccupysearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="OccupyData" :row-style="rowstyle" :border="false" width="800px" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
        <el-table-column property="regid" label="登记id" width="150"></el-table-column>
        <el-table-column property="aacount" label="账号" width="200"></el-table-column>
        <el-table-column property="name" label="占用人" width="200"></el-table-column>
        <el-table-column property="freeminute" label="释放时间"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="params">
            <el-button size="mini" type="primary" @click="handleUnlockOccupancy(params.row)">
              解除占用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 新增结论词弹框 -->
    <el-dialog class="conc_dialog" :visible.sync="showConclusion" width="60%" :show-close="false">
      <!-- 按钮组 -->
      <div class="btn_group">
        <el-button v-if="concActive == 'Person'" size="mini" type="primary" @click="handleAddPersonRow">新增</el-button>
        <el-button v-if="concActive == 'Person'" size="mini" type="danger" @click="handleSetDelPersonWord">删除</el-button>
        <el-button v-if="concActive == 'Person'" size="mini" type="warning" @click="personalEdit = false">编辑</el-button>
        <el-button size="mini" type="success" @click="handleAddConcConfirm">确认</el-button>
        <el-button v-if="concActive == 'Person'" size="mini" type="primary" @click="handleSetSavePersonWord">保存</el-button>
        <el-button size="mini" type="danger" @click="handleConclusionClose">关闭</el-button>
      </div>
      <!-- 弹框主体 -->
      <el-row class="conc_body">
        <el-col class="conc_left" :span="7">
          <!-- 切换状态tabs -->
          <el-radio-group v-model="concActive" @change="handleChangeConcActive" size="mini">
            <el-radio-button label="All">通用</el-radio-button>
            <el-radio-button label="Person">个人</el-radio-button>
          </el-radio-group>
          <!-- 结论词树形结构 -->
          <el-scrollbar class="conc_tree" style="height: calc(100% - 42px)">
            <el-tree class="onclusion_tree" :data="conclusionData" :props="conclusionProps" default-expand-all :filter-node-method="handleFilterNode" ref="conclusionTree" @node-click="handleNodeConclusion">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i :class="[data.isFile ? 'el-icon-folder' : 'el-icon-folder-opened']"></i>&nbsp;{{ node.label }}
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col class="conc_right" :span="17">
          <!-- 搜索输入框 -->
          <div class="conc_search_box">
            <div class="title">搜索</div>
            <el-input size="mini" v-model="concSearch" clearable placeholder="请输入搜索内容" @keyup.enter.native="handleGetConclusionsList" @clear="handleGetConclusionsList"></el-input>
          </div>
          <!-- 结论词表格数据 -->
          <div class="conc_table_box">
            <EasyTable v-loadmore="handleTableLoad" ref="currentTable" v-if="concActive == 'All'" class="current_table" height="100%" :data="currentData" :tableOptions="currentOptions" :radio-config="{ rowClick: true }" @row-click="handleChooseAllConc" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            <EasyTable v-if="concActive == 'Person'" class="personal_table" ref="currentTable" height="100%" :data="personalData" :tableOptions="personalOptions" :radio-config="{ rowClick: true }" @row-click="handleChoosePsonConc" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <!-- 建议输入框文本域  -->
          <div class="conc_text_box">
            <el-tabs v-model="activeConc">
              <el-tab-pane label="健康建议" name="jkjy">健康建议</el-tab-pane>
              <el-tab-pane label="饮食建议" name="ysjy">饮食建议</el-tab-pane>
              <el-tab-pane label="运动建议" name="ydjy">运动建议</el-tab-pane>
              <el-tab-pane label="健康知识" name="jkzs">健康知识</el-tab-pane>
            </el-tabs>
            <el-input :disabled="personalEdit" v-if="activeConc == 'jkjy' && chooseConclusion" class="conc_text" type="textarea" resize="none" v-model="chooseConclusion.healthadvice"></el-input>
            <el-input :disabled="personalEdit" v-if="activeConc == 'ysjy' && chooseConclusion" class="conc_text" type="textarea" resize="none" v-model="chooseConclusion.dietadvice"></el-input>
            <el-input :disabled="personalEdit" v-if="activeConc == 'ydjy' && chooseConclusion" class="conc_text" type="textarea" resize="none" v-model="chooseConclusion.sportsadvice"></el-input>
            <el-input :disabled="personalEdit" v-if="activeConc == 'jkzs' && chooseConclusion" class="conc_text" type="textarea" resize="none" v-model="chooseConclusion.healthknowledge"></el-input>
            <!-- 固定显示假结构 -->
            <el-input :disabled="personalEdit" v-if="!chooseConclusion" class="conc_text" type="textarea" resize="none" v-model="itemLabel"></el-input>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 新增结论词弹框 -->
    <el-dialog :close-on-click-modal="false" class="track_dialog" title="回访设计" :visible.sync="showTrack" width="55%" @close="handleCloseTrack">
      <EasyTable class="track_table" v-if="trackObj" height="100%" :data="trackObj.trackdetaiiItems" :tableOptions="trackOptions" :radio-config="{ rowClick: true }" @row-click="handleCheckTrack" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      <div class="head">回访说明</div>
      <el-input v-if="trackObj" type="textarea" class="explain" resize="none" v-model="trackObj.explain"></el-input>
      <div class="btn_group">
        <el-button size="mini" type="primary" @click="handleSubmitTrack">确认</el-button>
        <el-button size="mini" type="danger" @click="handleCloseTrack">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 疾病集弹框 -->
    <el-dialog :close-on-click-modal="false" class="illitems_dialog" title="异常提醒" :visible.sync="showIllitems" width="35%" @close="handleCloseIllitems">
      <div class="head">异常提醒</div>
      <EasyTable class="track_table" height="100%" :data="illitems" :tableOptions="illitemsOptions" :radio-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
      <div class="btn_group">
        <el-button size="mini" type="primary" @click="handleSubmitTrackIllitems">确认</el-button>
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
    <!-- 检索组件 -->
    <SearchDialog v-if="showSearch" :showSearch="showSearch" :pageFlag="pageFlag" @close="handleCloseSearch" @submit="handleSearchSubmit" />
    <!-- 职业病检索组件 -->
    <SearchDialogzyb v-if="OccupationashowSearch" :showSearch="OccupationashowSearch" :pageFlag="pageFlag" @close="handleCloseSearch" @submit="handleSearchSubmit" />
    <!-- 取消审核原因弹框 -->
    <el-dialog title="取消原因" :visible.sync="showToExamine" width="45%" :close-on-click-modal="false" class="word_dia" @close="handleCancelToExamine">
      <div class="word_dia_box">
        <div class="title">请输入操作原因</div>
        <el-input type="textarea" :rows="5" resize="none" v-model="reason"> </el-input>
        <div class="tips">提醒：体检报告已打印,请及时收后体检报告。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelToExamine">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitToExamine">确 定</el-button>
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
    <!-- 预览弹框 -->
    <el-dialog title="预览" class="preview_box" :visible.sync="showPreview" width="850px" @close="handleCloseDialog">
      <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 147px)"></iframe>
    </el-dialog>
    <!-- 健康建议拖拽弹框 -->
    <el-dialog title="" class="summaryDia" top="1vh" :visible.sync="showMoveConclusion" width="1000px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" @open="handleOpenMoveConclusion">
      <div class="handle_btn_group">
        <div class="handle_btn_title">健康建议调整</div>
        <div class="handle_btn_group_box">
          <div class="handle_btn" @click="handleDelWordItems">
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <i class="el-icon-minus"></i>
            </el-tooltip>
            <!-- <el-link type="primary">删除</el-link> -->
          </div>
          <div class="handle_btn" @click="handleMoveTopping">
            <el-tooltip class="item" effect="dark" content="置顶" placement="top">
              <i class="el-icon-top"></i>
            </el-tooltip>
            <!-- <el-link type="primary">上移</el-link> -->
          </div>
          <div class="handle_btn" @click="handleMoveTop">
            <el-tooltip class="item" effect="dark" content="上移" placement="top">
              <i class="el-icon-upload2"></i>
            </el-tooltip>
            <!-- <el-link type="primary">上移</el-link> -->
          </div>
          <div class="handle_btn" @click="handleMoveBottom">
            <el-tooltip class="item" effect="dark" content="下移" placement="top">
              <i class="el-icon-download"></i>
            </el-tooltip>
            <!-- <el-link type="primary">下移</el-link> -->
          </div>
          <div class="handle_btn" @click="handleWordMerge">
            <el-tooltip class="item" effect="dark" content="合并" placement="top">
              <i class="el-icon-s-unfold"></i>
            </el-tooltip>
            <!-- <el-link type="primary">合并</el-link> -->
          </div>
        </div>
      </div>
      <el-tree v-if="worditems[0] && showTree" :data="worditems[0].wordname" class="droptree" :props="dragProps" show-checkbox node-key="uniqueid" default-expand-all draggable ref="droptree" :allow-drop="allowDrop" :expand-on-click-node="false" @check-change="handleSelectMoveTree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="dtitle">{{ data.wordname }}</span>
          <span class="dcontent">{{ data.healthadvice }}</span>
        </span>
      </el-tree>

      <!-- <EasyTable
        :loading="loading"
        v-if="worditems[0]"
        height="100%"
        class="table_100 move_conclusion_t"
        style="height: 820px"
        :data="worditems[0].wordname"
        :tableOptions="moveConclusionOptions"
        @selected-change="handleSelectMoveDia"
        :checkbox-config="{ fetch: true, rowClick: true }"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-class-name="handleTableRowClassName"
        :row-style="{ height: '40px' }"
        :cell-style="{ padding: '0px' }"
        row-key="uniqueid"
      /> -->
      <span slot="footer" class="dialog-footer" style="text">
        <el-button type="primary" size="mini" @click="showMoveConclusion = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选页打印" :visible.sync="showSelectPrint" width="40%" class="selectPrint_dia" :close-on-click-modal="false" :show-close="false">
      <div class="input_box">
        打印页码：<el-input v-model="selectPrintStart" clearable size="mini"> </el-input>　-　<el-input v-model="selectPrintEnt" clearable size="mini"> </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="
            (showSelectPrint = false), (selectPrintStart = ''), (selectPrintEnt = '')
          ">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSelectPrintDia">打 印</el-button>
      </span>
    </el-dialog>
    <!-- 授权弹框 -->
    <el-dialog title="" :visible.sync="showAuthorize" width="50%" :show-close="false" :close-on-click-modal="false" class="authorize_dia">
      <div class="authorize_dia_box">
        <iframe ref="iframe" :src="oauthurl" width="100%" height="100%" frameborder="0">
        </iframe>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseAuthorize">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 卒中风险评估结果 -->
    <el-dialog title="提示" :visible.sync="showDangerType" class="dangertype_dia" width="45%" :show-close="false" :close-on-click-modal="false">
      <div style="display: flex; align-items: center">
        <div class="dtd_title" style="margin-right: 8px">卒中风险评估结果：</div>
        <el-radio-group v-model="dangertype">
          <el-radio label="低危">低危</el-radio>
          <el-radio label="中危">中危</el-radio>
          <el-radio label="高危">高危</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" @click="handleDangerTypeClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleDangerType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import SearchDialogzyb from "@/components/searchDialog/index_search_hzdlyy";
import SearchDialog from "@/components/searchDialog";
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import { mapGetters } from "vuex";
import { printBase64, ReportBook } from "@/api/printreport.js";

import draggable from "vuedraggable"; // 引入拖拽组件

import {
  getTotalCheck,
  getTotalCheckQyzyy,
  setTotalCheckSave,
  getLoadFiles,
  getConclusionsList,
  setSavePersonWord,
  setDelPersonWord,
  getCheck,
  getDepartCheckList,
  getHistoryResult,
  getAllCheck,
  getPersonArchives,
  getCompare,
  getLoadAdvice,
  getLoadAdviceQyzyy,
  setSaveTrack,
  getLoadTrack,
  setSaveIllitems,
  setCancelCheck,
  setGenerateAgain,
  setTotalCheckDelete,
  getRegisterInfo,
  setPrintOrderDetail,
  getCombineDetail,
  setChangeTotalShowFlag,
  getPersonalSimpleDetail,
  CheckItemIsComplete,
  changeUsedRegid,
  UsedRegidList,
  FreeRegid,
  TotalCheckRead,
  DepartmentDetail,
  CheckAuthorize,
  StartAuthorize,
  SendSMS,
} from "@/api/totalcheck.js"; // 引入接口文件
import * as userlogin from "@/api/login";
import { getFiles, getMyPlan } from "@/api/customerresult.js"; // 引入页面接口
import { getPersonalRegisterList } from "@/api/personalregister.js";
export default {
  name: "totalcheck",

  components: {
    Sticky,
    permissionBtn,
    SearchDialog,
    draggable,
    SearchDialogzyb,
  },

  data() {
    return {
      disabledIsused: true,
      selectPrintStart: "",
      selectPrintEnt: "",
      showSelectPrint: false,
      showFollowUpReferral: false,
      myTaskData: [], // 分配 我的任务 数据
      assignmentFlag: 2, // 默认显示第一个,我的任务
      showAssignmentCheck: false, //分配弹框是否显示
      pageStatus: true,
      showTopAnm: true,
      showLeftAnm: true,
      pageStatus: false,
      isloading: false,
      pageFlag: "totalcheck",
      worditems1: [],
      worditems2: [],
      ordinary: "ordinary", // 普通
      further: "further", // 进一步
      immediately: "immediately", // 立马
      itemLabel: "",
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字 1003700002 1000000019
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "name", name: "姓名" },
        { code: "hiscode", name: "门诊卡" },
      ], // 检索条件身份证等数组
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
      fruit: "conclusion", // 选择小结/专科建议
      fileList: [],
      previewImageList: [], // 图片预览路径
      tinymceFlag1: 1,
      tinymceFlag2: 1,
      checkActive: "describe", // 左侧当前选中标签页 describe  contrast  depart  totalCheck  archives
      checkText: "综述", // 综述 历史对比 科室检查 历史总检 健康档案
      activeName: "jkjy", // 右侧当前选中标签页
      showTotalCheck: false, // 控制显示总检弹框
      dialogActive: 0, // 弹框表格状态 0 1
      waitData: [], // 待检号数据源
      totalData: [], // 总检号数据源
      waittotalData: [], // 数据源总
      checkAdvise1: [], // 健康建议勾选列表
      contrastData: [], // 历史对比表格数据
      contrastResult: "", // 历史文本域数据数据
      verdictData: [], // 历史对比右侧结论词表格
      verdictDtData: [], // 历史对比右侧结论词详情表格
      departData: [], //科室检查表格数据
      departDtData: [], //科室检查详情表格数据
      departDtTime: "", //科室检查详情表单 检查时间
      departDtName: "", //科室检查详情表单 检查医生
      totalCheckData: [], // 历史总检表格数据
      totalDt1Data: [], // 历史总检右侧结论词表格
      totalDt2Data: [], // 历史总检右侧结论词详情表格
      archivesData: [], // 健康档案表格数据
      archivesDt1Data: [], // 健康档案右侧结论词表格
      archivesDt2Data: [], // 健康档案右侧结论词详情表格
      conclusiontext: "", // 综述文字
      showConclusion: false, // 显示新增结论词弹框
      concActive: "All", // 结论词弹框当前状态  通用 - All 个人 - Person
      conclusionData: [], // 结论词树形结构数据
      conclusionProps: {
        children: "children",
        label: "typename",
      }, // 结论词树形渲染字段
      concSearch: "", //  结论词弹框搜索关键字
      currentData: [], // 结论词 通用 表格渲染数据
      tempData: [], // 结论词 通用 表格渲染数据分页备份表格
      personalData: [], // 结论词 个人 表格渲染数据
      activeConc: "jkjy", // 结论词 - 健康建议tabs
      healthadvice: "", // 结论词 - 健康建议文本域
      dietadvice: "", // 结论词 - 饮食建议文本域
      sportsadvice: "", // 结论词 - 运动建议文本域
      healthknowledge: "", // 结论词 - 健康知识文本域
      currentPeople: {}, // 当前查询数据返回人员
      conclusionitems: [], // 左侧主体内容 小结集
      worditems: [], // 右侧主体内容 结论词集
      chooseFiles: undefined, // 当前选中文件夹
      chooseConclusion: undefined, // 当前选中结论词数据
      personalEdit: true, // 结论词 个人 表格 是否可编辑
      count: 0, // 表格数据长度
      pageIndex: 0, // 表格数据懒加载优化页码
      pageSize: 100, // 表格数据懒加载优化页面数据条数
      showSearch: false, // 显示检索组件
      showTrack: false, // 显示追踪弹框
      trackData: [], // 追踪弹框主体表格数据
      trackObj: undefined, // 追踪弹框主体表格数据
      isoccupation: false, // 是否职业病
      occupationChecks: [], // 职业病单选数据集
      occupationSelects: [], // 职业病复选选数据集
      checkRadio: "", // 选中的单选数据
      illitems: [], // 疾病集合
      showIllitems: false, // 显示疾病集弹框
      departDtFlag: "",
      worditemsIndex: 0,
      showToExamine: false,
      reason: "",
      drag: false, // 拖拽状态
      avatarImg: require("./images/lin.jpg"),
      triageTime: [],
      persData: [], // 体检记录表格数据
      combData: [], // 体检组合表格数据
      loading: false,
      choosePers: undefined,
      chooseComb: undefined,
      showPreview: false,
      dialogVisible: false,
      chooseDepart: undefined, // 当前选中的科室
      imageInfoFlag: false, // 显示图像照片信息
      entryData: [],
      conclusion: "",
      specialistadvice: "",
      dietadviceText: "",
      sportsadviceText: "",
      healthknowledgeText: "",
      totalconclusion: "",
      buttons: [],
      size: "mini",
      domIdArr: ["btnReport"],
      pdfUrl: "",
      historySelectData: [], // 客户历史体检记录数据
      historyShow: false, // 客户历史体检记录弹框显示

      test: false,
      showMoveConclusion: false, // 健康建议位置调整移动
      dragProps: {
        children: [],
        label: "wordname",
      },
      showTree: true,
      OccupationashowSearch: false, // 职业病显示检索组件
      loginUserInfo: null,
      showOccupyDialog: false, // 查询占用人dialog开关
      OccupyData: [], // 占用人数据
      Occupyform: { regid: "" }, // 查询占用人搜索集
      DepartmentList: [], // 科室数据
      showAuthorize: false,
      authorizeTimeId: "",
      oauthurl: "",
      showDangerType: false,
      dangertype: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
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
            if (data.resexp && data.resexp !== "") {
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
      ];
    },
    // 体检记录表格配置
    persOptions() {
      return [
        {
          title: "体检号",
          prop: "regid",
          width: 120,
          omit: 1,
        },
        {
          title: "姓名",
          prop: "name",
          width: 80,
          omit: 1,
        },
        {
          title: "状态",
          width: 100,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>已登记</span>
                <span v-show={data.status == 1}>已预约</span>
                <span v-show={data.status == 2}>已签到</span>
                <span v-show={data.status == 3}>体检中</span>
                <span v-show={data.status == 4}>已交表</span>
                <span v-show={data.status == 5}>可总检</span>
                <span v-show={data.status == 6}>已总检</span>
                <span style="color: red" v-show={data.status == 7}>
                  已审核
                </span>
              </div>
            );
          },
          // enumType: [
          //   {
          //     value: 0,
          //     label: "已登记",
          //   },
          //   {
          //     value: 1,
          //     label: "已预约",
          //   },
          //   {
          //     value: 2,
          //     label: "已签到",
          //   },
          //   {
          //     value: 3,
          //     label: "体检中",
          //   },
          //   {
          //     value: 4,
          //     label: "已交表",
          //   },
          //   {
          //     value: 5,
          //     label: "可总检",
          //   },
          //   {
          //     value: 6,
          //     label: "已总检",
          //   },
          //   {
          //     value: 7,
          //     label: "已审核",
          //   },
          // ],
        },
        {
          title: "性别",
          prop: "sex",
          width: 50,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          width: 50,
          omit: 1,
        },
        {
          title: "身份证号",
          prop: "idcard",
          width: 180,
          omit: 1,
        },
        {
          title: "开单日期",
          prop: "regdate",
          width: 150,
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
          render: (h, data) => {
            return (
              <div>
                {/* <span style="color: red" v-show={data.status == 0}>未完成</span> */}
                <span v-show={data.status == 0}>登记</span>
                <span style="color: #e6a23c;" v-show={data.status == 1}>
                  弃检
                </span>
                <span style="color: #409eff;" v-show={data.status == 2}>
                  完成
                </span>
                <span style="color: red;" v-show={data.status == 3}>
                  审核
                </span>
                <span style="color: #4b0082;" v-show={data.status == 4}>
                  缓检
                </span>
              </div>
            );
          },
        },
      ];
    },
    waitDataSearch() {
      const search = this.triageTime;
      // 进入筛选
      if (search && search.length == 2) {
        return this.waitData.filter((data) => {
          if (data.regdate) {
            let condition1 = new Date(search[0]).getTime();
            let condition2 = new Date(search[1]).getTime();
            let returnData = new Date(data.regdate).getTime();
            return condition1 <= returnData && returnData <= condition2;
          }
        });
      }
      return this.waitData;
    },
    totalDataSearch() {
      const search = this.triageTime;
      // 进入筛选
      if (search && search.length == 2) {
        return this.totalData.filter((data) => {
          if (data.regdate) {
            let condition1 = new Date(search[0]).getTime();
            let condition2 = new Date(search[1]).getTime();
            let returnData = new Date(data.regdate).getTime();
            return condition1 <= returnData && returnData <= condition2;
          }
        });
      }
      return this.totalData;
    },
    //   待检号表格配置
    waitOptions() {
      return [
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "类型",
          prop: "personalflag",
          returnVal: (value) => {
            return value == 0 ? "个人" : "单位";
          },
        },
        {
          title: "体检号",
          prop: "regid",
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 150,
        },
      ];
    },
    //   总检号表格配置
    totalOptions() {
      return [
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "类型",
          prop: "personalflag",
          returnVal: (value) => {
            return value == 0 ? "个人" : "单位";
          },
        },
        {
          title: "体检号",
          prop: "regid",
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 150,
        },
      ];
    },
    // 历史对比表格配置
    contrastOptions() {
      return [
        {
          title: "体检时间",
          prop: "checkdate",
        },
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "体检套餐",
          prop: "setmealname",
        },
        {
          width: 80,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                disabled={this.pageStatus}
                vOn:click_stop_prevent={() => this.handleContrast(data)}
              >
                比较
              </el-link>
            );
          },
        },
      ];
    },
    // 历史对比右侧结论词表格配置
    verdictOptions() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "体检组合",
          prop: "combinename",
        },
        {
          title: "检查医生",
          prop: "doctorname",
        },
      ];
    },
    // 历史对比右侧结论词详情表格配置
    verdictDtOptions() {
      return [
        {
          title: "检查项目",
          prop: "itemname",
          width: 180,
        },
        {
          title: "结果",
          prop: "result",
        },
      ];
    },
    // 科室检查表格配置
    departOptions() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "体检组合",
          prop: "combinename",
        },
        {
          title: "检查医生",
          prop: "doctorname",
        },
      ];
    },
    // 科室检查详情表格配置
    departDtOptions() {
      return [
        {
          title: "检查项目",
          prop: "itemname",
          width: 180,
        },
        {
          title: "结果",
          prop: "result",
        },
        {
          title: "单位",
          prop: "unit",
        },
        {
          title: "提示",
          prop: "tips",
        },
        {
          title: "参考范围",
          // prop: "reslower",
          align: "center",
          width: 120,
          render: (h, data) => {
            if (data.resexp && data.resexp !== "") {
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
        },
      ];
    },
    departDtOptions1() {
      return [
        {
          title: "检查项目",
          prop: "itemname",
          width: 180,
        },
        {
          title: "结果",
          prop: "result",
        },
      ];
    },
    // 历史总检表格配置
    totalCheckOptions() {
      return [
        {
          title: "档案号",
          prop: "checkno",
        },
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
        },
        {
          title: "体检时间",
          prop: "inputdate",
        },
      ];
    },
    // 历史总检右侧结论词表格配置
    totalDt1Options() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "体检组合",
          prop: "combinename",
        },
        {
          title: "检查医生",
          prop: "doctorname",
        },
      ];
    },
    // 历史总检右侧结论词详情表格配置
    totalDt2Options() {
      return [
        {
          title: "检查项目",
          prop: "itemname",
          width: 180,
        },
        {
          title: "结果",
          prop: "result",
        },
      ];
    },
    // 健康档案表格配置
    archivesOptions() {
      return [
        {
          title: "档案号",
          prop: "checkno",
        },
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
        },
        {
          title: "体检时间",
          prop: "inputdate",
        },
      ];
    },
    // 健康档案右侧结论词表格配置
    archivesDt1Options() {
      return [
        {
          title: "科室",
          prop: "deptname",
        },
        {
          title: "体检组合",
          prop: "combinename",
        },
        {
          title: "检查医生",
          prop: "doctorname",
        },
      ];
    },
    // 健康档案右侧结论词详情表格配置
    archivesDt2Options() {
      return [
        {
          title: "检查项目",
          prop: "itemname",
          width: 180,
        },
        {
          title: "结果",
          prop: "result",
        },
      ];
    },
    // 结论词 通用 表格渲染数据
    currentOptions() {
      return [
        {
          title: "分类",
          prop: "typename",
          width: 100,
          align: "center",
        },
        {
          title: "结论词",
          prop: "name",
          align: "center",
          width: 200,
          omit: 1,
        },
        {
          title: "ICD名称",
          prop: "icdname",
          align: "center",
        },
        {
          title: "疾病",
          prop: "flag",
          width: 80,
          align: "center",

          render: (h, data) => {
            let checked = data.flag == 1 ? true : false;
            return <el-checkbox checked={checked} disabled></el-checkbox>;
          },
        },
      ];
    },
    // 结论词 个人 表格渲染数据
    personalOptions() {
      return [
        {
          title: "分类",
          width: 100,
          prop: "typename",
          align: "center",
        },
        {
          title: "结论词",
          align: "center",
          render: (h, data) => {
            return (
              <el-input
                v-model={data.name}
                disabled={this.personalEdit}
                size="mini"
              ></el-input>
            );
          },
        },
        {
          title: "疾病",
          width: 80,
          align: "center",
          render: (h, data) => {
            let checked = data.flag == 1 ? true : false;
            return (
              <el-checkbox
                checked={data.flag == 1 ? true : false}
                disabled={this.personalEdit}
                v-model={data.flag}
              ></el-checkbox>
            );
          },
        },
      ];
    },
    // 追踪弹框表格配置
    trackOptions() {
      return [
        {
          title: "分类",
          prop: "typename",
        },
        {
          title: "结论词",
          prop: "wordname",
          width: 200,
          omit: 1,
        },
        {
          title: "ICD名称",
          prop: "icdname",
          width: 200,
          omit: 1,
        },
        {
          title: "疾病",
          prop: "flag",
          render: (h, data) => {
            return (
              <el-select size="mini" v-model={data.flag}>
                <el-option label="是" value={1}></el-option>
                <el-option label="否" value={0}></el-option>
              </el-select>
            );
          },
        },
        {
          title: "回访",
          prop: "trackflag",
          render: (h, data) => {
            return (
              <el-select size="mini" v-model={data.trackflag}>
                <el-option label="是" value={1}></el-option>
                <el-option label="否" value={0}></el-option>
              </el-select>
            );
          },
        },
        {
          title: "回访日期",
          prop: "reminddate",
          width: 130,
        },
      ];
    },
    // 疾病集表格弹框配置
    illitemsOptions() {
      return [
        {
          title: "分类",
          prop: "typename",
        },
        {
          title: "异常结果",
          prop: "wordname",
        },
        {
          title: "科室",
          prop: "deptname",
        },
      ];
    },
    //   分配 我的任务表格配置
    myTaskOptions() {
      return [
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "类型",
          prop: "personalflag",
          returnVal: (value) => {
            return value == 0 ? "个人" : "单位";
          },
        },
        {
          title: "体检号",
          prop: "regid",
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 150,
        },
      ];
    },
  },
  activated() {
    this.tinymceFlag1++;
    this.tinymceFlag2++;
    this.handleFocuscheckupWorkInput();
  },
  mounted() {
    // this.handleGetTotalCheck();
    this.handleGetToday();
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    this.handleFocuscheckupWorkInput();
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    // window.onbeforeunload = function (e) {
    //   var e = window.event || e;
    //   e.returnValue = "确定离开当前页面吗？";
    // };
    // 监听滚动条的位置
    this.$refs.persTable.$refs.easyTable.bodyWrapper.addEventListener(
      "scroll",
      (res) => {
        this.scrollTop = res.target.scrollTop;
      },
      false
    );
    userlogin.GetMyOrgs().then((response) => {
      if (!response.result) return;
      this.loginUserInfo = response.result;
    });
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },
  methods: {
    padZero(month) {
      return month.toString().padStart(2, "0");
    },
    /* 短息发送功能 */
    handleSendSMS() {
      if (!this.currentPeople.regid) {
        this.$message.warning("请先查询人员信息!");
        return;
      }
      let today = new Date();
      let year = today.getFullYear();
      let month = this.padZero(today.getMonth() + 1); // 月份是从0开始的，所以需要加1
      let day = this.padZero(today.getDate());
      let HH = this.padZero(today.getHours());
      let customercode = `telephone${this.currentPeople.telephone}categoryRegisterReportCompletetime${year}${month}${day}`;
      // let customercode = `telephone${
      //   this.currentPeople.telephone
      // }categoryRegisterReportCompletetime${new Date(
      //   +new Date() + 8 * 3600 * 1000
      // )
      //   .toJSON()
      //   .substr(0, 13)
      //   .replace("T", "")
      //   .replaceAll("-", "")}`;
      SendSMS({
        regid: this.currentPeople.regid,
        category: "RegisterReportComplete",
        customercode: this.$md5(customercode),
      }).then((res) => {
        this.$message.success(res.message || res.msg);
      });
    },
    /* 360全景接口跳转 */
    handleJumpPanorama() {
      if (!this.currentPeople.regid) {
        this.$message.warning("请先查询人员信息!");
        return;
      }
      if (!this.currentPeople.url360) {
        this.$message.warning("当前人员跳转链接异常!");
        return false;
      }
      window.open(this.currentPeople.url360);
    },
    // 职业病检索组件显示回调
    handleOccupationalShowSearch() {
      this.OccupationashowSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearchFp(value) {
      this.OccupationashowSearch = value;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
      this.OccupationashowSearch = value;
    },
    // 关闭授权弹框
    handleCloseAuthorize() {
      clearInterval(this.authorizeTimeId);
      this.showAuthorize = false;
      this.oauthurl = "";
    },
    // 开启定时器请求接口
    handleCheckAuthorize() {
      CheckAuthorize()
        .then((res) => {
          if (res.result) {
            this.$message.success("授权完成!");
            clearInterval(this.authorizeTimeId);
            this.showAuthorize = false;
          }
        })
        .catch((err) => {
          this.$message.warning("接口请求出错!");
          clearInterval(this.authorizeTimeId);
        });
    },
    // 科室选择回调
    handleTrasnferdept(val) {
      const result = this.DepartmentList.find(
        (k) => k.code == val.transferdeptcode
      );
      val.transferdeptname = result.name;
    },
    handleTotalCheckRead() {
      if (this.currentPeople && !this.currentPeople.regid) {
        this.$message.warning("请先选中人员!");
        return;
      }
      TotalCheckRead({ regid: this.currentPeople.regid }).then((res) => {
        this.$message.success(res.message);
        this.checkupWork = this.currentPeople.regid;
        this.handleGetTotalCheck();
        this.handlegetPersonalSimpleDetail();
      });
    },
    // 查询占用人回调
    onOccupysearch() {
      const result = this.OccupyData.find(
        (k) => k.regid == this.Occupyform.regid
      );
      !!result && (this.OccupyData = result);
    },
    // 解除占用人回调
    handleUnlockOccupancy(row) {
      FreeRegid({ regid: row.regid }).then((res) => {
        if (res.code == 200) {
          this.handleSearchOccupy();
          this.$message.success("操作成功");
        }
      });
    },
    // 获取占用人回调
    handleSearchOccupy() {
      UsedRegidList().then((res) => {
        this.OccupyData = res.result;
      });
    },
    beforeunloadFn(event) {
      // ...
      let e = window.event || event;
      this.handleChangeIsusedLeave();
      return;
    },
    // 改变当前占用状态
    handleChangeIsusedLeave() {
      if (!localStorage.getItem("ChangeUsedRegid")) return;
      let data = {
        regid: localStorage.getItem("ChangeUsedRegid"),
        used: 0,
      };
      changeUsedRegid(data).then((res) => {
        this.$message.success(res.message);
      });
    },
    // 改变当前占用状态
    handleChangeIsused(value) {
      let data = {
        regid: this.currentPeople.regid,
        used: value || this.currentPeople.isused,
      };
      changeUsedRegid(data).then((res) => {
        this.$message.success(res.message);
      });
    },
    // 选页打印
    handleSelectPrintDia() {
      if (!this.selectPrintStart || !this.selectPrintEnt) {
        this.$message.warning("请先填写需打印页!");
        return;
      }
      if (+this.selectPrintStart >= +this.selectPrintEnt) {
        this.$message.warning("起始页不能大于终止页!");
        return;
      }
      this.$refs.popoverRefIdc.forEach((d) => {
        if (d.$children[0].$el.innerText == "报告书") {
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [this.currentPeople.regid],
            repname: d.$children[0].$attrs["data-remark"],
            designtype: d.$children[0].$attrs["data-remark"].includes("F")
              ? "fast"
              : "dev",
            printflag: 1,
            whereitems: [],
          };
          ReportBook(data).then((res) => {
            this.currentPeople.reportprintcn = "已打印";
            this.currentPeople.reportprintdate = new Date(
              +new Date() + 8 * 3600 * 1000
            )
              .toJSON()
              .substr(0, 19)
              .replace("T", " ");
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
            this.lodop.SET_PRINT_MODE(
              "PRINT_START_PAGE",
              +this.selectPrintStart
            ); // 设置从第2页开始打印;
            this.lodop.SET_PRINT_MODE("PRINT_END_PAGE", +this.selectPrintEnt); // 设置从第3页结束打印;
            printObj.printBase64PdfReport(this.lodop, fileList);
            this.showSelectPrint = false;
            this.selectPrintStart = "";
            this.selectPrintEnt = "";
          });
        }
      });
    },
    // 报告书选页打印
    handleSelectPrint() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.currentPeople && !this.currentPeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行打印",
          type: "error",
        });
        return false;
      }
      this.showSelectPrint = true;
      return;
    },
    handleFollowUpReferral() {
      this.showFollowUpReferral = true;
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label !== "") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    // 调整弹框数据勾选
    handleSelectMoveTree(item, check) {
      this.checkAdvise1 = this.$refs.droptree.getCheckedNodes();
    },
    // 打开移动健康建议弹框
    handleOpenMoveConclusion() {
      // this.handleLoadingSortable();
    },
    // 健康建议移动调整
    handleMoveConclusion() {
      if (this.worditems[0].wordname.length == 0) return;
      this.showMoveConclusion = true;
    },
    // 初始化健康建议弹框拖拽
    handleLoadingSortable() {
      this.$nextTick(() => {
        let _this = this;
        let tbody = document.querySelector(
          ".summaryDia .move_conclusion_t .el-table__body-wrapper tbody"
        );
        Sortable.create(tbody, {
          // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
          group: {
            name: "words",
            pull: true,
            put: true,
          },
          ghostClass: "sortable-ghost",
          // dragClass: "sortable-ghost",
          // chosenClass: "sortable-ghost",
          animation: 500, // ms, number 单位：ms，定义排序动画的时间
          // 拖拽移动的时候
          onMove: function (/**Event*/ evt, /**Event*/ originalEvent) {
            // Example: https://jsbin.com/nawahef/edit?js,output
            evt.dragged; // dragged HTMLElement
            evt.draggedRect; // DOMRect {left, top, right, bottom}
            evt.related; // HTMLElement on which have guided
            evt.relatedRect; // DOMRect
            evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
            originalEvent.clientY; // mouse position
            // return false; — for cancel
            // return -1; — insert before target
            // return 1; — insert after target
          },
          onAdd: function (evt) {
            // 拖拽时候添加有新的节点的时候发生该事件
            // console.log("onAdd.foo:", [evt.item, evt.from]);
          },
          onUpdate: function (evt) {
            // 拖拽更新节点位置发生该事件
            // console.log("onUpdate.foo:", [evt.item, evt.from]);
          },
          onRemove: function (evt) {
            // 删除拖拽节点的时候促发该事件
            // console.log("onRemove.foo:", [evt.item, evt.from]);
          },
          onStart: function (evt) {
            // 开始拖拽出发该函数
            // console.log("onStart.foo:", [evt.item, evt.from]);
          },
          onSort: function (evt) {
            // 发生排序发生该事件
            // console.log("onUpdate.foo:", [evt.item, evt.from]);
          },
          onEnd({ newIndex, oldIndex }) {
            // 结束拖拽
            let currRow = _this.worditems[0].wordname.splice(oldIndex, 1)[0];
            _this.worditems[0].wordname.splice(newIndex, 0, currRow);
          },
        });
      });
    },
    // 历史项目表格选中数据回调
    handlegetPersonalSimpleDetail() {
      if (this.currentPeople && !this.currentPeople.regid) {
        this.$message({
          showClose: true,
          message: "暂无更新体检人员",
          type: "error",
        });
        return false;
      }
      getPersonalSimpleDetail({
        regid: this.currentPeople.regid,
      }).then((res) => {
        if (!res.result) return;
        let index = this.persData.findIndex((k) => {
          return k.regid === res.result.regid;
        });
        console.log(index);
        if (index < 0) return;
        this.$set(this.persData, index, res.result);
      });
    },
    // 生成综述回调
    handleResetOverView() {
      if (this.currentPeople && !this.currentPeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再生成综述!",
          type: "error",
        });
        return false;
      }
      this.checkupWork = this.currentPeople.regid;
      setGenerateAgain({ regid: this.checkupWork, tp: "summary" }).then(
        (res) => {
          this.$message.success(res.message);
          this.handleGetTotalCheck();
        }
      );
    },
    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.checkupWorkInput.focus();
      });
    },
    // 删除总检综述
    handleDelOverView(item) {
      if (!item) return;
      let data = {
        regid: item.regid,
        combinecode: item.combinecode,
        totalshowflag: 1,
      };
      let delArr = `${item.conclusionwordcodes}\n${item.cluid}`.split("\n");
      // 删除综述对应数据
      let index = this.conclusionitems.findIndex((k) => k.cluid === item.cluid);
      index != -1 && this.conclusionitems.splice(index, 1);
      // 删除健康建议对应数据
      this.worditems.forEach((value) => {
        value.wordname.forEach((k, i) => {
          if (delArr.includes(k.wordcode)) {
            value.wordname.splice(i, 1);
          }
        });
      });
      setChangeTotalShowFlag(data)
        .then((res) => {
          this.$message.success(res.message);
        })
        .catch(() => {
          this.$message.warning("操作失败!");
        });
    },
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.showPreview = false;
    },
    // 文件打印预览
    handlePreview(domId) {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (this.currentPeople && !this.currentPeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行预览",
          type: "error",
        });
        return false;
      }
      this.showPreview = true;
      switch (domId) {
        case "btnReport": // 报告书
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "报告书") {
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              if (this.currentPeople.meccode == 1) {
                if (this.currentPeople.checktype == 10104) {
                  repname = `${indexP}F报告书招工入职`;
                } else if (this.currentPeople.checktype == 925) {
                  repname = `${indexP}F报告书教师体检`;
                } else if (this.currentPeople.checktype == 7) {
                  repname = `${indexP}F报告书招工入学`;
                } else if (this.currentPeople.checktype == 6) {
                  repname = `${indexP}F报告书健康证`;
                } else {
                  repname = `${indexP}F报告书`;
                }
              } else if (this.currentPeople.meccode == 10003) {
                repname = `${indexP}F水电报告书`;
              } else if (this.currentPeople.meccode == 10004) {
                repname = `${indexP}F国康报告书`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.currentPeople.regid],
                fileid: this.currentPeople.reportfileid,
                repname,
                designtype:
                  repname.split("、")[1].substr(0, 1) === "F" ? "fast" : "dev",
                whereitems: [],
              };
              ReportBook(data).then((res) => {
                let url = "";
                if (this.currentPeople.reportfileid) {
                  url = res.data[0].fileurl;
                } else {
                  let code = res.data[0].base64String.replace(/[\n\r]/g, "");
                  let raw = window.atob(code);
                  let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
                  let uInt8Array = new Uint8Array(rawLength);
                  for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                  }
                  url = window.URL.createObjectURL(
                    new Blob([uInt8Array], { type: "application/pdf" })
                  );
                }
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
    // 点击图像信息
    handleShowImageInfoFlag() {
      this.imageInfoFlag = true;
    },
    // 小结/专科建议切换回调
    handleFruitChange() {
      this.imageInfoFlag = false;
    },
    // 获取组合结论信息
    handleGetCombineDetail() {
      if (!this.chooseComb) return;
      if (!this.choosePers) return;
      getCombineDetail({
        regid: this.chooseComb.regid,
        checkno: this.choosePers.checkno,
        combinecode: this.chooseComb.combinecode,
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
    // 双击组合查看信息
    handleChooseComb(row) {
      this.chooseComb = row;
      this.chooseComb && this.handleGetCombineDetail();
    },
    // 获取个人组合明细
    handleSetPrintOrderDetail() {
      setPrintOrderDetail({
        regid: this.choosePers.regid,
        frompage: "TotalCheck",
      }).then((res) => {
        if (!res.result) return;
        this.combData = res.result;
      });
    },
    // 人员点击选中信息
    handleChoosePers(row) {
      this.choosePers = row;
      if (this.choosePers) {
        this.checkupWork = row.regid;
        this.handleGetTotalCheck();
        this.handleSetPrintOrderDetail();
      }
    },
    handleChangeCheckCode(value) {
      console.log(value);
      if (value) {
        let flag = this.currentPeople.doctoritems.filter((k) => {
          return k.code === value;
        })[0];
        if (!flag) return;
        this.currentPeople.checkname = flag.name;
      } else {
        this.currentPeople.checkname = "";
      }
    },
    // 获取体检人员信息
    handleGetRegisterInfo() {
      let data = {};
      if (this.currentPeople.idcard) {
        data.idcard = this.currentPeople.idcard;
      } else {
        data.checkno = this.currentPeople.checkno;
      }
      getRegisterInfo(data).then((res) => {
        if (!res.result) return;
        this.isloading = false;
        this.persData = res.result;
        this.choosePers = this.persData[0];
        this.handleSetPrintOrderDetail();
      });
    },
    // 获取今天日期
    handleGetToday() {
      let today = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.triageTime = [`${today} 00:00:00`, `${today} 23:59:59`];
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.currentPeople.fileid }).then((res) => {
        this.avatarImg = res.result.fileUrl;
      });
    },
    //开始拖拽事件
    handleDragOnStart() {
      this.drag = true;
    },
    //拖拽结束事件
    handleDragOnEnd() {
      this.drag = false;
    },
    // 取消审核弹框提交
    handleSubmitToExamine() {
      if (!this.reason) {
        this.$message.warning("请填写取消原因!");
        return false;
      }
      setCancelCheck({
        regid: this.currentPeople.regid,
        reason: this.reason,
      }).then((res) => {
        this.$message.success("取消审核成功!");
        this.checkupWork = this.currentPeople.regid;
        this.handleCancelToExamine();
        this.handleGetTotalCheck();
        this.handlegetPersonalSimpleDetail();
      });
    },
    // 取消审核弹框关闭
    handleCancelToExamine() {
      this.reason = "";
      this.showToExamine = false;
    },
    // 关闭当前页面回调
    handleClosePage() {
      this.handleChangeIsusedLeave();
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
    // 重新生成总检回调
    handleSetGenerateAgain() {
      if (this.currentPeople) {
        this.checkupWork = this.currentPeople.regid;
      }
      if (this.checkupWork === "") {
        this.$message.warning("请先输入用户体检号");
        return false;
      }
      setGenerateAgain({ regid: this.checkupWork }).then((res) => {
        this.$message.success(res.message);
        this.handleGetTotalCheck();
      });
    },
    // 疾病集弹框确定回调
    handleSubmitTrackIllitems() {
      setSaveIllitems(this.illitems).then((res) => {
        this.$message.success(res.message);
        this.handleCloseIllitems();
      });
    },
    // 疾病集弹框关闭回调
    handleCloseIllitems() {
      this.illitems = [];
      this.showIllitems = false;
    },
    // 追踪表格提交保存数据回调
    handleSubmitTrack() {
      setSaveTrack(this.trackObj).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.message);
          this.handleCloseTrack();
        }
      });
    },
    // 追踪表格数据行选中
    handleCheckTrack(row) {},
    // 显示追踪信息弹框回调
    handleShowTrack() {
      if (!this.currentPeople.regid) {
        this.$message.warning("请先输入追踪人员档案号!");
        return false;
      }
      getLoadTrack({ regid: this.currentPeople.regid }).then((res) => {
        if (!res.data) {
          this.$message.warning("暂无追踪数据!");
          return false;
        }
        this.trackObj = res.data[0];
        this.trackObj = res.data;
        this.showTrack = true;
      });
    },
    // 关闭追踪弹框信息回调
    handleCloseTrack() {
      this.showTrack = false;
      this.trackObj = undefined;
    },
    // 检索组件提交回调
    handleSearchSubmit(value) {
      if (typeof value == "string") {
        this.checkupWork = value;
        this.handleGetTotalCheck();
      } else {
        this.persData = value;
      }
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 职业病检索组件显示回调
    handleOccupationalShowSearch() {
      this.OccupationashowSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
      this.OccupationashowSearch = value;
    },
    // 科室检查数据行点击回调
    handleDepartRow(row) {
      if (!row) return false;
      this.departDtFlag = row.viewgroup;
      this.departDtData = row.items;
      this.departDtTime = row.inputdate;
      this.departDtName = row.doctorname;
    },
    // 获取历史结果数据回调
    handleGetHistoryResult() {
      getHistoryResult({
        regid: this.currentPeople.regid,
        combinecode: this.currentPeople.combinecode,
      }).then((res) => {
        console.log(res);
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
    // 获取所有检查数据回调
    handlegetAllCheck(value) {
      let regid = value || this.currentPeople.regid;
      console.log(regid, "regid");
      getAllCheck({
        regid,
      }).then((res) => {
        switch (this.checkActive) {
          case "contrast": // 历史对比
            this.verdictData = res.result;
            break;
          case "depart": // 新增
            this.departData = res.result;
            break;
          case "totalCheck": // 历史总检
            this.totalDt1Data = res.result;
            break;
          case "archives": // 健康档案
            this.archivesDt1Data = res.result;
            break;
          default:
            break;
        }
        this.verdictData = res.result;
        console.log(res.result);
      });
    },

    // 获取所有健康档案回调
    handlegetgetPersonArchives() {
      console.log(this.currentPeople);
      getPersonArchives({
        regid: this.currentPeople.regid,
        idcard: this.currentPeople.idcard,
        hiscode: this.currentPeople.hiscode,
        checkno: this.currentPeople.checkno,
      }).then((res) => {
        /*
        checkActive:
        contrast -- 历史对比  contrastData
        totalCheck -- 历史总检  totalCheckData
        archives -- 健康档案 archivesData
        */
        switch (this.checkActive) {
          case "contrast": // 历史对比
            this.contrastData = res.result;
            break;
          case "totalCheck": // 历史总检
            this.totalCheckData = res.result;
            break;
          case "archives": // 健康档案
            this.archivesData = res.result;
            break;
          default:
            break;
        }
      });
    },
    // 历史对比详情点击查看包含项目
    handleVerdictDataRow(row) {
      this.verdictDtData = row.items;
    },
    // 历史总检详情点击查看包含项目
    handleTotalDttaRow(row) {
      this.totalDt2Data = row.items;
    },
    // 健康档案详情点击查看包含项目
    handleAarchivesDtRow(row) {
      this.archivesDt2Data = row.items;
    },
    // 点击历史比单行数据回调
    handleContrastRow(row) {
      this.contrastResult = "";
      this.verdictDtData = [];
      this.handlegetAllCheck(row.regid);
    },
    // 点击历史总检行数据回调
    handleTotalCheckRow(row) {
      this.totalDt2Data = [];
      this.handlegetAllCheck(row.regid);
    },
    // 点击健康档案行数据回调
    handleArchivesRow(row) {
      this.archivesDt2Data = [];
      this.handlegetAllCheck(row.regid);
    },
    // 点击对比按钮请求回调
    handleContrast(data) {
      this.contrastResult = "";
      getCompare({
        regid: this.currentPeople.regid,
        oldregid: data.regid,
      }).then((res) => {
        res.result.forEach((item, index) => {
          this.contrastResult += `${(index > 0 ? "\r\n" : "", item)}`;
        });
      });
    },
    // 我的总检当前选中数据
    handleCheckTotal(row) {
      this.condition = "体检号";
      this.conditionCode = "regid";
      this.checkupWork = row.regid;
      this.isloading = true;
      this.handleGetTotalCheck();
      this.waitData = []; // 待检号数据源
      this.totalData = []; // 总检号数据源
      this.myTaskData = []; // 我的任务数据源
      this.combData = [];
      this.showTotalCheck = false;
      this.showAssignmentCheck = false;
    },
    // 我的总检任务列表
    handleGetMyPlanList() {
      // console.log('我的任务');
      let whereitems = [];
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
      if (this.assignmentFlag != 2) {
        this.dialogActive = this.assignmentFlag;
        // console.log('我进来了,获取了别的数据,第一次');
        this.handleGetDepartCheckList();
      } else {
        // getMyPlan({
        //   page: 1,
        //   limit: 10000000,
        //   key: "",
        //   id: "",
        //   code: "",
        //   type: 0,
        //   tableName: "",
        //   businesstype: "",
        //   whereitems,
        // }).then(res=>{
        //   console.log(res,'获取我的任务,我也进来了');
        //   if(res.code == 200 && this.assignmentFlag == 2){
        //  this.myTaskData = res.data.customeritems
        //  console.log(this.myTaskData,'获取到数据,赋值后的');
        //   } else if(res.code == 200 && this.assignmentFlag == 0){
        //   }else{
        //   }
        // })
      }
    },
    // 我的总检 - 列表表格数据回调
    handleGetDepartCheckList() {
      let whereitems = [
        {
          key: "status",
          value: this.dialogActive,
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
      getDepartCheckList({
        page: 1,
        limit: 10000000,
        whereitems,
      }).then((res) => {
        if (!res.data) return false;
        if (this.dialogActive == 0) {
          this.waitData = res.data;
        } else {
          this.totalData = res.data;
        }
      });
    },
    // 体检总检审核接口回调-卒中风险评估结果-关闭
    handleDangerTypeClose() {
      this.dangertype = "";
      this.showDangerType = false;
    },
    // 体检总检审核接口回调-卒中风险评估结果
    handleDangerType() {
      if (!this.dangertype) {
        this.$message.warning("请先选择风险程度!");
        return;
      }
      getCheck({
        regid: this.currentPeople.regid,
        checkcode: this.currentPeople.checkcode,
        checkname: this.currentPeople.checkname,
        checkdate: this.currentPeople.checkdate,
        dangertype: this.dangertype,
      })
        .then((res) => {
          this.$message.success("审核成功!");
          this.checkupWork = this.currentPeople.regid;
          this.dangertype = "";
          this.showDangerType = false;
          this.handleGetTotalCheck();
          this.handlegetPersonalSimpleDetail();
        })
        .catch((err) => {
          this.dangertype = "";
          this.showDangerType = false;
        });
    },
    // 体检总检审核接口回调
    handleGetCheck() {
      if (!this.currentPeople.regid) {
        this.$message.warning("请先提供审核人员信息!");
        return false;
      }
      let flag = true;
      this.combData.forEach((item) => {
        if (item.status != "2") {
          flag = false;
        }
      });
      if (!flag) {
        this.$confirm("有组合未完成是否提交审核?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (this.currentPeople.age >= 40) {
              this.showDangerType = true;
            } else {
              getCheck({
                regid: this.currentPeople.regid,
                checkcode: this.currentPeople.checkcode,
                checkname: this.currentPeople.checkname,
                checkdate: this.currentPeople.checkdate,
              }).then((res) => {
                this.$message.success("审核成功!");
                this.checkupWork = this.currentPeople.regid;
                this.handleGetTotalCheck();
                this.handlegetPersonalSimpleDetail();
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        if (this.currentPeople.age >= 40) {
          this.showDangerType = true;
        } else {
          getCheck({
            regid: this.currentPeople.regid,
            checkcode: this.currentPeople.checkcode,
            checkname: this.currentPeople.checkname,
            checkdate: this.currentPeople.checkdate,
          }).then((res) => {
            this.$message.success("审核成功!");
            this.checkupWork = this.currentPeople.regid;
            this.handleGetTotalCheck();
            this.handlegetPersonalSimpleDetail();
          });
        }
      }

      //
    },
    // 结论词弹框表格数据懒加载递增回调
    handleTableLoad() {
      if (this.currentData.length > this.count) {
        this.$message.warning("已经加载完了哦!");
        return false;
      }
      // console.log(this.count);
      // return;
      this.pageIndex++;
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.currentData.push(...this.tempData.slice(start, end));
    },
    // 结论词合并
    handleWordMerge() {
      if (this.checkAdvise1.length == 0) {
        this.$message.warning("请先选择需要合并的数据!");
        return false;
      }
      if (this.checkAdvise1.length == 1) {
        this.$message.warning("合并数据不能小于两条!");
        return false;
      }
      let repeatArr = [];
      let findex = 0;
      this.checkAdvise1.forEach((item) => {
        this.worditems.forEach((k, i) => {
          k.wordname.forEach((val, index) => {
            if (
              item.uniqueid == val.uniqueid &&
              item.wordname == val.wordname
            ) {
              repeatArr.unshift({
                level: k.level,
                wordname: [val],
              });
              findex = i;
            }
          });
        });
      });
      if (!repeatArr.every((item) => item.level === repeatArr[0].level)) {
        this.$message.warning("不同分组数据不能进行合并!");
        return false;
      }
      let idArr = this.checkAdvise1.map((item) => {
        return {
          uniqueid: item.uniqueid,
          wordname: item.wordname,
        };
      });
      idArr.forEach((item) => {
        this.worditems.forEach((k, i) => {
          k.wordname.forEach((val, index) => {
            // item.cluid == val.cluid &&
            if (
              item.uniqueid == val.uniqueid &&
              item.wordname == val.wordname
            ) {
              k.wordname.splice(index, 1);
            }
          });
        });
      });
      // 循环合并数据
      let temp = {
        regid: this.checkAdvise1[0].regid,
        cluid: this.checkAdvise1[0].cluid,
        combinecode: this.checkAdvise1[0].combinecode,
        combinename: this.checkAdvise1[0].combinename,
        wordname: "",
        healthadvice: this.checkAdvise1[0].healthadvice,
        specialistadvice: this.checkAdvise1[0].specialistadvice,
        dietadvice: this.checkAdvise1[0].dietadvice,
        sportsadvice: this.checkAdvise1[0].sportsadvice,
        healthknowledge: this.checkAdvise1[0].healthknowledge,
      };
      this.checkAdvise1.forEach((item, index) => {
        temp.wordname += `${item.wordname}；`;
      });
      temp.wordname = temp.wordname.substring(0, temp.wordname.length - 1);
      this.worditems[findex].wordname.unshift(temp);
      this.$message.success("合并成功!");
      this.checkAdvise1 = [];
    },
    // 结论词列表置顶回调
    handleMoveTopping() {
      if (this.checkAdvise1.length == 0) {
        this.$message.warning("请先选择需要移动的数据!");
        return false;
      } else if (this.checkAdvise1.length > 1) {
        this.$message.warning("移动数据不能大于1条!");
        return false;
      }
      this.worditems.forEach((k, i) => {
        k.wordname.forEach((item, index) => {
          if (
            this.checkAdvise1[0].uniqueid == item.uniqueid &&
            this.checkAdvise1[0].wordname == item.wordname
          ) {
            if (index == 0) {
              this.$message.warning("已移动到顶部!");
              return false;
            } else {
              k.wordname.splice(index, 1);
              k.wordname.unshift(this.checkAdvise1[0]);
            }
          }
        });
      });
    },
    // 结论词列表上移回调
    handleMoveTop() {
      if (this.checkAdvise1.length == 0) {
        this.$message.warning("请先选择需要移动的数据!");
        return false;
      } else if (this.checkAdvise1.length > 1) {
        this.$message.warning("移动数据不能大于1条!");
        return false;
      }
      this.worditems.forEach((k, i) => {
        k.wordname.forEach((item, index) => {
          if (
            this.checkAdvise1[0].uniqueid == item.uniqueid &&
            this.checkAdvise1[0].wordname == item.wordname
          ) {
            if (index == 0) {
              this.$message.warning("已移动到顶部!");
              return false;
            } else {
              k.wordname.splice(index, 1);
              k.wordname.splice(index - 1, 0, this.checkAdvise1[0]);
            }
          }
        });
      });
    },
    handleChangeTriageTime(value) {
      if (value) {
        this.triageTime = [value[0], value[1]];
        console.log(value, "我在这", this.assignmentFlag);
        if (this.assignmentFlag == 2) {
          this.handleGetMyPlanList();
          console.log(this.assignmentFlag, "我在这!!!");
        } else {
          this.handleGetDepartCheckList();
        }
      } else {
        this.triageTime = [];
      }
    },
    // 结论词列表下移回调
    handleMoveBottom() {
      if (this.checkAdvise1.length == 0) {
        this.$message.warning("请先选择需要移动的数据!");
        return false;
      } else if (this.checkAdvise1.length > 1) {
        this.$message.warning("移动数据不能大于1条!");
        return false;
      }
      let flag = false;
      let ifindex = 0;
      let index = 0;
      this.worditems.forEach((k, i) => {
        k.wordname.forEach((item, ind) => {
          if (
            this.checkAdvise1[0].uniqueid == item.uniqueid &&
            this.checkAdvise1[0].wordname == item.wordname
          ) {
            if (ind == k.wordname.length - 1) {
              this.$message.warning("已移动到底部!");
              flag = false;
              return false;
            } else {
              ifindex = i;
              index = ind;
              flag = true;
              k.wordname.splice(ind, 1);
            }
          }
        });
      });
      flag &&
        this.worditems[ifindex].wordname.splice(
          index + 1,
          0,
          this.checkAdvise1[0]
        );
    },
    // 删除结论词回调
    handleDelWordItems() {
      if (this.checkAdvise1.length == 0) {
        this.$message.warning("请先选择需要的删除数据!");
        return false;
      }
      let delNameArr = this.checkAdvise1.map((item) => item.wordname);
      this.$confirm(
        `此操作将删除【${delNameArr.join("、")}】等建议, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let idArr = this.checkAdvise1.map((item) => {
            return {
              uniqueid: item.uniqueid,
              wordname: item.wordname,
            };
          });
          idArr.forEach((item) => {
            this.worditems.forEach((k, i) => {
              k.wordname.forEach((val, index) => {
                // item.cluid == val.cluid &&
                if (
                  item.uniqueid == val.uniqueid &&
                  item.wordname == val.wordname
                ) {
                  k.wordname.splice(index, 1);
                }
              });
            });
          });
          this.$message.success("删除成功!");
          this.checkAdvise1 = [];
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 保存
    handleSetTotalCheckSave() {
      this.checkAdvise1 = [];
      this.occupationChecks.forEach((k) => {
        if (k.code == this.checkRadio) {
          k.selected = true;
        } else {
          k.selected = false;
        }
      });
      let occupationitems = [];
      if (this.occupationChecks.length > 0) {
        occupationitems = [...this.occupationChecks, this.occupationSelects];
      }
      let worditems = [];
      this.worditems.forEach((k) => {
        k.wordname.forEach((item) => {
          worditems.push({
            cluid: k.cluid,
            combinecode: k.combinecode,
            combinename: k.combinename,
            level: k.level,
            regid: k.regid,
            ...item,
          });
        });
      });
      let data = undefined;
      if (occupationitems.length == 0) {
        data = {
          regid: this.currentPeople.regid,
          doctorcode: this.currentPeople.doctorcode,
          doctorname: this.currentPeople.doctorname,
          inputdate: this.currentPeople.inputdate,
          conclusiontext: this.conclusiontext,
          totalconclusion: this.totalconclusion,
          worditems,
          conclusionSummaryItems: this.conclusionitems.map((k) => {
            return {
              cluid: k.cluid,
              conclusion: k.conclusion,
            };
          }),
        };
      } else {
        data = {
          regid: this.currentPeople.regid,
          doctorcode: this.currentPeople.doctorcode,
          doctorname: this.currentPeople.doctorname,
          inputdate: this.currentPeople.inputdate,
          conclusiontext: this.conclusiontext,
          totalconclusion: this.totalconclusion,
          worditems,
          conclusionSummaryItems: this.conclusionitems.map((k) => {
            return {
              cluid: k.cluid,
              conclusion: k.conclusion,
            };
          }),
          occupationitems: occupationitems.length > 0 ? occupationitems : [],
        };
      }
      setTotalCheckSave(data).then((res) => {
        this.$message.success(res.message);
        this.checkupWork = this.currentPeople.regid;
        this.handleGetTotalCheck();
        this.handlegetPersonalSimpleDetail();
      });
    },
    // 左侧小结集右移按钮事件回调
    handleMoveToRight(item) {
      getLoadAdviceQyzyy(item).then((res) => {
        this.$message.success(res.message);
        if (!res.result) return;
        res.result.forEach((v) => {
          let index = this.worditems.findIndex((k) => k.level == v.level);
          if (index == -1) {
            // 没找到
            if (v.level > k.level) {
              this.worditems.unshift(v);
            } else {
              this.worditems.push(v);
            }
          } else {
            this.worditems[index].wordname.push(...v.wordname);
          }
        });
        // this.worditems.push({
        //   ...res.result[0],
        //   index: this.worditemsIndex + 1,
        // });
        // ++this.worditemsIndex;
      });
      // console.log(this.worditems);
    },
    // 左侧小结集选中右移按钮事件回调
    handleSelectMoveToRight(item) {
      if (item.conclusion.indexOf(window.getSelection().toString())) {
        this.$message.warning("请选中复制文字!");
        return false;
      }
      getLoadAdvice({ conclusion: window.getSelection().toString() }).then(
        (res) => {
          this.$message.success(res.message);
          this.worditems.push(...res.result);
        }
      );
    },
    // 档案号回车事件请求页面数据回调
    handleSearchTotalCheck() {
      if (!this.checkupWork) return;
      this.isloading = true;
      if (this.conditionCode === "regid") {
        this.handleGetTotalCheck();
        this.combData = [];
      } else {
        getPersonalRegisterList({
          page: 1,
          limit: 10000,
          whereitems: [
            {
              key: this.conditionCode,
              value: this.checkupWork.trim(),
            },
            {
              key: "pageflag",
              value: "customerresult",
            },
          ],
        })
          .then((res) => {
            if (res.data && res.data.length > 0) {
              // this.historySelectData = res.data;
              this.checkupWork = res.data[0].regid;
              this.condition = "体检号";
              this.conditionCode = "regid";
              this.handleGetTotalCheck();
              this.combData = [];
              // this.historyShow = true;
            }
          })
          .catch(() => {
            this.checkupWork = "";
            this.condition = "体检号";
            this.conditionCode = "regid";
          });
        // 只需要获取其中一部分数据即可, code随便一个
        DepartmentDetail({ code: "10003" }).then((res) => {
          console.log("111111");
          this.DepartmentList = res.result.deptitems;
        });
      }
    },
    // 历史人员双击回调
    handleHistoryCheck(row) {
      if (!row) return false;
      this.condition = "体检号";
      this.conditionCode = "regid";
      this.checkupWork = row.regid;
      this.handleGetTotalCheck(); // 查询信息
      this.handleCloseHistory(); // 关闭弹框
    },
    // 历史信息表格选中人员关闭
    handleCloseHistory() {
      this.historyShow = false;
      this.historySelectData = [];
    },
    // 获取总检结果回调
    async handleGetTotalCheck() {
      let checkRes = await CheckItemIsComplete({
        whereitems: [{ key: "regid", value: this.checkupWork.trim() }],
      });
      if (!checkRes.result.iscomplete) {
        this.$confirm(`${checkRes.result.message}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "checkRes-model",
        })
          .then(() => {
            this.handleGetTotalCheckSource();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
            this.checkupWork = "";
            this.condition = "体检号";
            this.conditionCode = "regid";
            this.checkActive = "describe";
          });
        return;
      }
      this.handleGetTotalCheckSource();
    },
    // 获取总检结果回调 - 源
    handleGetTotalCheckSource() {
      let whereitems = [
        {
          key: this.conditionCode,
          value: this.checkupWork.trim(),
        },
      ];
      getTotalCheckQyzyy({ whereitems }).then((res) => {
        let data = res.result;
        if (!data) return false;
        if (data.remindflag === 1) {
          this.$confirm(data.remindcontent, "系统提示", {
            cancelButtonText: "关闭",
            showConfirmButton: false,
            closeOnClickModal: false,
            type: "warning",
          }).then(() => {});
        }
        this.activeName = "jkjy";
        this.currentPeople = data;
        this.conclusiontext = data.conclusiontext;
        this.totalconclusion = data.totalconclusion;
        // this.pageStatus = true;
        this.disabledIsused = false;
        if (data.status < 3) {
          this.currentPeople.priceStatusCN = "未缴费";
        } else {
          this.currentPeople.priceStatusCN = "已缴费";
        }
        this.currentPeople.sex =
          data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
        this.currentPeople.agecn = `${data.age}岁`;
        let marriage = data.marriageitem.filter((k) => k.selected)[0];
        let checktype = data.checktypeitems.filter((k) => k.selected)[0];
        let company = data.companyitems.filter((k) => k.selected)[0];
        let batch = data.batchitems.filter((k) => k.selected)[0];
        let doctor = data.doctoritems.filter((k) => k.selected)[0];
        this.currentPeople.marriage = (marriage && marriage.name) || "未知";
        this.currentPeople.checktype = (checktype && checktype.code) || "";
        this.currentPeople.checktypeCN = (checktype && checktype.name) || "";
        this.currentPeople.readstatusCN =
          data.readstatus == 0 ? "未解读" : "已解读";
        // this.currentPeople.checkname = (doctor && doctor.name) || "";
        this.currentPeople.company = (company && company.name) || "";
        this.currentPeople.batch = (batch && batch.name) || "";
        this.conclusionitems = data.conclusionitems;
        // replace(/<br\/>/g, "\r\n"); 正则替换字符串
        if (data.worditems.length > 0) {
          data.worditems[0].wordname = data.worditems[0].wordname;
          this.worditems = data.worditems; // 右侧主体内容 结论词集
          data.worditems.forEach((v) => {
            v.wordname.forEach((item) => {
              item.dietadvice != "" &&
                (this.dietadviceText += `${item.dietadvice}\r\n`);
              item.sportsadvice != "" &&
                (this.sportsadviceText += `${item.sportsadvice}\r\n`);
              item.healthknowledge != "" &&
                (this.healthknowledgeText += `${item.healthknowledge}\r\n`);
            });
          });
          let tempWordItems = this.worditems.map((k) => {
            return {
              ...k,
              wordname: [],
            };
          });
          this.worditems.forEach((k) => {
            tempWordItems[0].wordname.push(...k.wordname);
          });
          this.worditems = tempWordItems;
          console.log(this.worditems, "this.worditems");
        } else {
          this.worditems = []; // 右侧主体内容 结论词集
        }
        this.isoccupation = data.isoccupation;
        if (this.isloading) {
          this.handleGetRegisterInfo();
        }
        if (data.occupationitems) {
          this.occupationSelects =
            data.occupationitems[data.occupationitems.length - 1];
          data.occupationitems.splice(data.occupationitems.length - 1, 1);
          this.occupationChecks = data.occupationitems;
          let index = this.occupationChecks.findIndex((k) => k.selected);
          index != -1 && (this.checkRadio = this.occupationChecks[index].code);
        }
        if (this.currentPeople.fileid) {
          this.handleGetFiles();
        } else {
          this.avatarImg = require("./images/lin.jpg");
        }
        this.illitems = data.illitems;
        if (this.illitems.length > 0) this.showIllitems = true;
      });
      this.checkupWork = "";
      this.condition = "体检号";
      this.conditionCode = "regid";
      this.checkActive = "describe";
    },
    // 结论词弹框确认按钮添加数据回调
    handleAddConcConfirm() {
      // return;
      if (!this.chooseConclusion) {
        let tempArr = {
          regid: "",
          cluid: "",
          uniqueid: Date.parse(new Date()),
          combinecode: "",
          combinename: "",
          wordname: "",
          healthadvice: "",
          specialistadvice: "",
          dietadvice: "",
          sportsadvice: "",
          healthknowledge: "",
          transferstatus: 0,
          followstatus: 0,
          illnessstatus: 0,
        };
        if (this.worditems.length == 0) {
          let data = {
            cluid: "",
            combinecode: "",
            combinename: "",
            level: 0,
            regid: "",
            wordname: [tempArr],
          };
          this.worditems.unshift(data);
        } else {
          if (this.checkAdvise1.length != 1) {
            if (Object.prototype.toString.call(tempArr) === "[object Object]") {
              this.worditems[0].wordname.unshift(tempArr);
            } else {
              this.worditems[0].wordname.unshift(...tempArr);
            }
          } else {
            let index = this.worditems[0].wordname.findIndex(
              (k) => k.uniqueid == this.checkAdvise1[0].uniqueid
            );
            if (index > -1) {
              if (
                Object.prototype.toString.call(tempArr) === "[object Object]"
              ) {
                this.worditems[0].wordname.splice(index + 1, 0, tempArr);
              } else {
                this.worditems[0].wordname.splice(index + 1, 0, ...tempArr);
              }
            }
          }
        }
        this.chooseConclusion = undefined;
        this.showConclusion = false;
        this.$message.success("操作成功!");
      } else {
        let flag = true;
        let tempArr = [this.chooseConclusion].map((item) => {
          return {
            regid: "",
            cluid: "",
            combinecode: "",
            combinename: "",
            wordname: item.name,
            healthadvice: item.healthadvice,
            specialistadvice: item.specialistadvice,
            dietadvice: item.dietadvice,
            sportsadvice: item.sportsadvice,
            healthknowledge: item.healthknowledge,
            uniqueid: Date.parse(new Date()),
            transferstatus: 0,
            followstatus: 0,
            illnessstatus: 0,
          };
        });
        if (this.worditems.length == 0) {
          let data = {
            cluid: "",
            combinecode: "",
            combinename: "",
            level: 0,
            regid: "",
            wordname: tempArr,
          };
          this.worditems.unshift(data);
        } else {
          for (let i = 0; i < this.worditems[0].wordname.length; i++) {
            if (
              this.worditems[0].wordname[i].wordname.trim() ===
              tempArr[0].wordname.trim()
            ) {
              flag = false;
              break;
            }
          }
          if (flag) {
            if (this.checkAdvise1.length != 1) {
              if (
                Object.prototype.toString.call(tempArr) === "[object Object]"
              ) {
                this.worditems[0].wordname.unshift(tempArr);
              } else {
                this.worditems[0].wordname.unshift(...tempArr);
              }
            } else {
              let index = this.worditems[0].wordname.findIndex(
                (k) => k.uniqueid == this.checkAdvise1[0].uniqueid
              );
              if (index > -1) {
                if (
                  Object.prototype.toString.call(tempArr) === "[object Object]"
                ) {
                  this.worditems[0].wordname.splice(index + 1, 0, tempArr);
                } else {
                  this.worditems[0].wordname.splice(index + 1, 0, ...tempArr);
                }
              }
            }
          }
        }
        if (flag == false) {
          this.$message.warning("不可添加相同结论词!");
          return;
        }
        // 拼接饮食建议-运动建议-健康知识到结论词数组第一条
        this.dietadviceText += `${this.chooseConclusion.dietadvice}\r\n`;
        this.sportsadviceText += `${this.chooseConclusion.sportsadvice}\r\n`;
        this.healthknowledgeText += `${this.chooseConclusion.healthknowledge}\r\n`;
        this.chooseConclusion = undefined;
        this.showConclusion = false;
        this.$message.success("操作成功!");
        let tempWordItems = this.worditems.map((k) => {
          return {
            ...k,
            wordname: [],
          };
        });
        this.worditems.forEach((k) => {
          tempWordItems[0].wordname.push(...k.wordname);
        });
        this.worditems = tempWordItems;
        console.log(this.worditems);
      }
    },
    // 结论词个人字典删除回调
    handleSetDelPersonWord() {
      if (!this.chooseConclusion) {
        this.$message.warning("请先选择需删除的结论词数据!");
        return false;
      }
      setDelPersonWord([this.chooseConclusion.code]).then((res) => {
        this.chooseConclusion = undefined;
        this.$message.success("操作成功!");
        this.handleGetConclusionsList();
      });
    },
    // 结论词字典保存回调
    handleSetSavePersonWord() {
      if (this.personalData.length == 0) {
        this.$message.warning("请先新增数据,再保存!");
        return false;
      }
      let flag = 0;
      this.personalData.forEach((item) => {
        item.flag = +item.flag;
        setSavePersonWord(item).then((res) => {
          flag = flag + 1;
          console.log(flag);
          if (flag == this.personalData.length) {
            this.$message.success("保存个人数据成功!");
            this.handleGetConclusionsList();
          }
        });
      });
    },
    // 结论词弹框新增按钮新增个人字典数据
    handleAddPersonRow() {
      console.log(this.chooseFiles);
      if (!this.chooseFiles) {
        this.$message.warning("请先选择所属科室!");
        return false;
      }
      if (
        this.personalData.length > 0 &&
        this.personalData[this.personalData.length - 1].code == ""
      ) {
        this.$message.warning("请先保存新增数据!");
        return false;
      }
      this.personalData.unshift({
        code: "",
        name: "",
        typeid: this.chooseFiles.typeid,
        typename: this.chooseFiles.typename,
        icdcode: "",
        icdname: "",
        sex: 0,
        flag: 0,
        healthadvice: "",
        healthknowledge: "",
        dietadvice: "",
        sportsadvice: "",
        seqno: 0,
      });
      // this.chooseFiles = undefined; // 当前选中文件夹
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
    // 结论词通用列表数据选择
    handleChooseAllConc(row) {
      this.chooseConclusion = row;
      this.personalEdit = false;
      console.log(row, "row");
    },
    // 结论词个人列表数据选择
    handleChoosePsonConc(row) {
      this.chooseConclusion = row;
      console.log(row, "row");
    },
    // 结论词弹框文件夹树形数据回调
    handleGetLoadFiles() {
      getLoadFiles({ tp: this.concActive }).then((res) => {
        this.conclusionData = res.result;
      });
    },
    // 获取结论词列表表格数据回调
    handleGetConclusionsList() {
      getConclusionsList({
        typeid: (this.chooseFiles && this.chooseFiles.typeid) || "",
        tp: this.concActive,
        keyWord: this.concSearch,
      }).then((res) => {
        this.pageIndex = 0;
        this.pageSize = 100;
        this.currentData = [];
        let data = res.result;
        // personalData currentData

        if (this.concActive == "All") {
          this.count = data.length;
          this.tempData = data;
          // this.currentData = data;
          this.handleTableLoad();
        } else {
          this.personalData = data;
        }
        // 滚动条置顶
        this.$nextTick(() => {
          this.$refs.currentTable.$el.children[0].children[2].scrollTop = 0;
        });
      });
    },
    // 结论词树形结构回调
    handleNodeConclusion(data) {
      this.chooseFiles = JSON.parse(JSON.stringify(data));
      this.chooseConclusion = undefined;
      this.handleGetConclusionsList(); // 结论词列表
    },
    // 筛选树形结构回调
    handleFilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 结论词切换回调 通用 个人
    handleChangeConcActive() {
      this.personalEdit = true;
      this.chooseFiles = undefined; // 清除当前选中结论词
      this.chooseConclusion = undefined; // 清除当前选中结论词
      this.handleGetLoadFiles(); // 结论词文件夹列表
      // this.handleGetConclusionsList(); // 结论词列表
    },
    // 新增结论词弹出层回调
    handleAddConclusion() {
      this.showConclusion = true;
      this.handleGetLoadFiles(); // 结论词文件夹列表
      // this.handleGetConclusionsList(); // 结论词列表
    },
    // 关闭结论词弹出层回调
    handleConclusionClose() {
      this.pageIndex = 0;
      this.pageSize = 100;
      this.currentData = [];
      this.showConclusion = false;
      this.concActive = "All"; // 结论词弹框当前状态  通用 - All 个人 - Person
      this.chooseFiles = undefined; // 当前选中文件夹
      this.chooseConclusion = undefined; // 当前选中结论词数据
      this.personalEdit = true; // 结论词 个人 表格 是否可编辑
    },
    // 左侧主体内容标签页切换回调
    handleTabsChange() {
      //  describe  contrast  depart  totalCheck  archives
      // 综述 历史对比 科室检查 历史总检 健康档案
      // console.log(this.checkActive);
      if (this.checkActive != "describe") {
        this.isoccupation = false;
      } else {
        this.isoccupation = this.currentPeople.isoccupation;
      }
      switch (this.checkActive) {
        case "describe": // 新增
          this.checkText = "综述";
          break;
        case "contrast": // 新增
          this.checkText = "历史对比";
          this.handlegetgetPersonArchives();
          break;
        case "depart": // 新增
          this.checkText = "科室检查";
          this.handlegetAllCheck();
          break;
        case "totalCheck": // 新增
          this.checkText = "历史总检";
          this.handlegetgetPersonArchives();
          break;
        case "archives": // 新增
          this.checkText = "健康档案";
          this.handlegetgetPersonArchives();
          break;
        default:
          break;
      }
    },
    // 打开总检弹框回调
    handleTotalCheckOpen() {
      this.showTotalCheck = true;
      this.handleGetDepartCheckList();
    },
    // 打开分配弹框回调
    handleTotalAssignmentOpen() {
      this.showAssignmentCheck = true;
      this.handleGetMyPlanList();
    },
    // 分配
    handleTotalassignment() {
      console.log("分配");
    },
    // 关闭总检弹框回调
    handleTotalCheckClose() {
      this.waitData = []; // 待检号数据源
      this.totalData = []; // 总检号数据源
      this.dialogActive = 0; // 总检号数据源
      this.myTaskData = []; // 我的任务数据源
      this.showTotalCheck = false;
      this.handleGetToday();

      this.showAssignmentCheck = false; // 关闭分配弹框
      this.assignmentFlag = 0; // 分配页默认 我的任务按钮常亮
    },

    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 删除总检回调
    handleSetTotalCheckDelete() {
      if (!this.currentPeople) {
        this.$message.warning("请选择删除总检数据!");
        return false;
      }
      this.$confirm("此操作将删除当前总检, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setTotalCheckDelete({ regid: this.currentPeople.regid }).then(
            (res) => {
              this.$message.success(res.message);
              this.checkupWork = this.currentPeople.regid;
              this.handleGetTotalCheck();
              this.handlegetPersonalSimpleDetail();
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 按钮组点击回调
    async hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          console.log(111);
          break;
        case "btnPanorama": // 360全景
          this.handleJumpPanorama();
          break;
        case "btnSendSMS": // 发送短信
          this.handleSendSMS();
          break;
        case "btnEdit": // 新增
          // if (!this.currentPeople.regid) {
          //   this.$message.warning("请先提供人员信息!");
          //   return false;
          // }
          // if (this.currentPeople.status < 7) {
          //   this.pageStatus = false; // 关闭禁用
          // }
          break;
        case "btnOccupationalDisease": // 职业病检索
          this.handleOccupationalShowSearch();
          break;
        case "btnKeep": // 保存
          let res = await CheckAuthorize();
          if (res.result) {
            this.handleSetTotalCheckSave();
          } else {
            StartAuthorize({ om: "WeChatMini" }).then((res) => {
              this.oauthurl = res.result.oauthurl;
              this.showAuthorize = true;
              this.authorizeTimeId = setInterval(() => {
                this.handleCheckAuthorize();
              }, 1500);
            });
          }
          return;
          if (!this.currentPeople.regid) {
            this.$message.warning("请先查询人员信息!");
            return;
          }
          let checkRes = await CheckItemIsComplete({
            whereitems: [
              { key: "regid", value: this.currentPeople.regid.trim() },
            ],
          });
          if (!checkRes.result.iscomplete) {
            this.$confirm(`${checkRes.result.message}`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.handleSetTotalCheckSave();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消操作",
                });
              });
          }
          break;
        case "btnToExamine": // 审核
          this.handleGetCheck();
          return;
          if (!this.currentPeople.regid) {
            this.$message.warning("请先查询人员信息!");
            return;
          }
          let checkResD = await CheckItemIsComplete({
            whereitems: [
              { key: "regid", value: this.currentPeople.regid.trim() },
            ],
          });
          if (!checkResD.result.iscomplete) {
            this.$confirm(`${checkResD.result.message}`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.handleGetCheck();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消操作",
                });
              });
          }
          break;
        case "btnToExamineCancel": // 取消审核
          if (!this.currentPeople.regid) {
            this.$message.warning("请先提供取消审核人员信息!");
            return false;
          }
          if (this.currentPeople.status != 7) {
            this.$message.warning("当前人员状态不允许取消审核!");
            return false;
          }
          this.showToExamine = true;
          break;
        case "btnSearch": // 检索
          this.handleShowSearch();
          break;
        case "btnOccupationalDisease": // 职业病检索
          let authStrategy = this.loginUserInfo.authStrategy.toLowerCase();
          let userType = this.loginUserInfo.userType.split(",");
          if (
            authStrategy != "system" &&
            authStrategy != "admin" &&
            !userType.includes("总检分配")
          ) {
            this.$message.warning("当前人员暂无权限!");
            return;
          }
          this.handleOccupationalShowSearch();
          break;
        case "btnTrack": // 追踪
          this.handleShowTrack();
          break;
        case "btnCheckRead": // 解读
          this.handleTotalCheckRead();
          break;
        case "btnReGenerate": // 重新生成
          this.handleSetGenerateAgain();
          break;
        case "btnDelete": // 删除总检
          this.handleSetTotalCheckDelete();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnInspectCheck": // 跳转检查录入
          if (this.currentPeople && this.currentPeople.regid) {
            jumpRouteLink(this, "customerResult");
            this.$router.push({
              path: `/customerResult/${this.Hospitals}`,
              query: { regid: this.currentPeople.regid },
            });
          } else {
            this.$message.warning("请先选择人员数据!");
            return false;
          }
          break;
        case "btnReport": // 导出报告书
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          if (this.currentPeople && !this.currentPeople.regid) {
            this.$message({
              showClose: true,
              message: "请选择人员再进行预览",
              type: "error",
            });
            return false;
          }
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "报告书") {
              let indexP =
                d.$children[0].$attrs["data-remark"].split("、")[0] + "、";
              let repname = "";
              if (this.currentPeople.meccode == 1) {
                if (this.currentPeople.checktype == 10104) {
                  repname = `${indexP}F报告书招工入职`;
                } else if (this.currentPeople.checktype == 925) {
                  repname = `${indexP}F报告书教师体检`;
                } else if (this.currentPeople.checktype == 7) {
                  repname = `${indexP}F报告书招工入学`;
                } else if (this.currentPeople.checktype == 6) {
                  repname = `${indexP}F报告书健康证`;
                } else {
                  repname = `${indexP}F报告书`;
                }
              } else if (this.currentPeople.meccode == 10003) {
                repname = `${indexP}F水电报告书`;
              } else if (this.currentPeople.meccode == 10004) {
                repname = `${indexP}F国康报告书`;
              } else {
                repname = d.$children[0].$attrs["data-remark"];
              }
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.currentPeople.regid],
                fileid: this.currentPeople.reportfileid,
                designtype:
                  repname.split("、")[1].substr(0, 1) === "F" ? "fast" : "dev",
                repname,
                printflag: 1,
                whereitems: [],
              };
              ReportBook(data).then((res) => {
                this.currentPeople.reportprintcn = "已打印";
                this.currentPeople.reportprintdate = new Date(
                  +new Date() + 8 * 3600 * 1000
                )
                  .toJSON()
                  .substr(0, 10)
                  .replace("T", " ");
                this.lodop = getLodop();
                let printname = ``;
                if (res.data[0].printname == "") {
                  printname = this.lodop.GET_PRINTER_NAME(-1);
                } else {
                  printname = res.data[0].printname;
                }
                let printObj = new LodopPrinter(null, printname);
                if (res.data[0].fileurl) {
                  printObj.printPdfReport(this.lodop, [
                    encodeURI(res.data[0].fileurl),
                  ]);
                } else {
                  let fileList = res.data.map((k) => {
                    return k.base64String;
                  });
                  printObj.printBase64PdfReport(this.lodop, fileList);
                }
              });
            }
          });
          break;
        case "btnSearchOccupy": // 查询占用人
          this.showOccupyDialog = true; // dialog开关
          this.handleSearchOccupy();
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
        vm.isloading = true;
        vm.handleGetTotalCheck();
      }
    });
  },
  watch: {
    condition: {
      $route(to, from) {
        if (!to.path.includes("totalcheck")) {
          this.handleChangeIsusedLeave();
        }
      },
      handler() {
        this.handleFocuscheckupWorkInput();
      },
      deep: true,
    },
    showAssignmentCheck: function (newval, oldval) {
      if (newval == true) {
        console.log(newval);
        this.assignmentFlag = 2;
        this.handleGetMyPlanList();
      } else {
        this.assignmentFlag = 0;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "./css/index.scss";
@import "./css/index_gyey.scss";
.dom1_item_top {
  .text_h_check {
    display: flex;
    .text_h_check_box {
      margin: 0 5px 0 0 !important;
      width: 45%;
      display: flex;
      align-items: center;
      /deep/.el-checkbox__input {
        position: static !important;
        margin-right: 5px;
      }
    }
    .checkFlex {
      display: flex;
      align-items: center;
    }
  }
}
.droptree {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  /deep/.el-tree-node__content:hover {
    background-color: transparent !important;
  }
  /deep/.is-current {
    .el-tree-node__content {
      background-color: transparent !important;
    }
  }
  /deep/.el-tree-node__content {
    background-color: transparent !important;
    height: 100% !important;
    width: 100%;
    .el-tree-node__expand-icon {
      height: 100% !important;
    }
    .custom-tree-node {
      height: 100% !important;
      width: 94% !important;
      display: flex;
      align-items: center;
      .dtitle {
        width: 30%;
        overflow-x: auto;
        white-space: nowrap;
      }
      .dcontent {
        width: 70%;
        overflow-x: auto;
        white-space: nowrap;
      }
      /*滚动条样式*/
      .dtitle::-webkit-scrollbar,
      .dcontent::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        background-color: rgba(240, 240, 240, 1);
      }
      /*定义滚动条轨道 内阴影+圆角*/
      .dtitle::-webkit-scrollbar-track,
      .dcontent::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
        border-radius: 10px;
        background-color: rgba(240, 240, 240, 0.5);
      }
      /*定义滑块 内阴影+圆角*/
      .dtitle::-webkit-scrollbar-thumb,
      .dcontent::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 0px gray;
        background-color: gray;
      }
    }
  }
  /deep/.el-tree-node {
    height: 40px;
    display: flex;
    align-items: center;
    border: 1px solid #ebeef5;
    border-bottom: 0 none;
    width: 100%;
  }
}
.droptree:last-child {
  border-bottom: 1px solid #ebeef5;
}
.dia_followUpReferral {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 0 10px;
    .dfur_content {
      height: 350px;
      overflow-y: auto;
      .dfur_citem {
        margin-top: 10px;
        .dfur_title {
          font-size: 14px;
          font-weight: 600;
        }
        .control_box {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
</style>
<style lang="scss">
.el-message-box.checkRes-model {
  // min-width: 600px !important;
  width: fit-content;
  max-width: 60% !important;
}
</style>
