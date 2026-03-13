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
      <div v-for="(btn, index) of buttons" :key="index">
        <el-popover
          ref="popoverRefIdc"
          v-if="domIdArr.includes(btn.domId)"
          class="print_box"
          placement="bottom"
          trigger="click" 
        >
          <el-button
            type="primary"
            plain
            slot="reference"
            :size="size"
            v-bind:key="btn.Id"
            v-bind:data-remark="btn.remark"
            class="filter-item"
            ><i :class="`iconfont icon-${btn.icon}`"></i
            >{{ btn.name }}</el-button
          >
          <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">
            打印
          </div>
          <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
        </el-popover>
        <el-button
          type="primary"
          plain
          v-else
          :size="size"
          v-bind:key="btn.Id"
          v-bind:data-remark="btn.remark"
          class="filter-item"
          @click="hadnleOnBtnClicked(btn.domId)"
          ><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button
        >
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
        <div class="search_body">
          <div class="code_box">
            <div class="btn_group">
              <!-- <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                <div class="content">
                  <div class="content_item" v-for="item in checkupCodeArr" :key="item.code" @click="handleSelectCondition(item)">{{item.name}}</div>
                </div>
                <el-button plain type="primary" style="width:80px" size="mini" slot="reference">{{condition}}</el-button>
              </el-popover> -->
              <el-button
                plain
                type="primary"
                style="width: 80px"
                size="mini"
                slot="reference"
                >体检号</el-button
              >
              <el-button
                size="mini"
                class="total_btn"
                type="primary"
                icon="iconfont icon-jiandu"
                @click="handleTotalCheckOpen"
                >我的总检</el-button
              >
            </div>
            <el-input
              size="mini"
              :placeholder="`请输入${condition}`"
              v-model="checkupWork"
              clearable
              @keyup.enter.native="handleSearchTotalCheck"
            >
            </el-input>
          </div>
          <div class="form_box">
            <el-form
              ref="form"
              disabled
              :model="currentPeople"
              label-width="80px"
            >
              <el-row>
                <el-col :span="5">
                  <el-form-item size="mini" label="体检号">
                    <el-input v-model="currentPeople.regid"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="姓名">
                    <el-input v-model="currentPeople.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="性别">
                    <el-input v-model="currentPeople.sex"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="年龄">
                    <el-input v-model="currentPeople.age"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item size="mini" label="婚姻">
                    <el-input v-model="currentPeople.marriage"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item size="mini" label="体检类型">
                    <el-input v-model="currentPeople.checktype"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="联系电话">
                    <el-input v-model="currentPeople.telephone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item size="mini" label="团检名称">
                    <el-input v-model="currentPeople.company"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="团检批次">
                    <el-input v-model="currentPeople.batch"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="img_box">
              <div class="photo_box">
                <img
                  :src="avatarImg"
                  :draggable="false"
                  class="avatar"
                  alt="摄像头"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 主体内容 -->
      <div class="body_box">
        <!-- 主体操作内容结构 -->
        <div class="check_body">
          <div class="check_left">
            <!-- 当前标签页 -->
            <el-radio-group
              v-model="checkActive"
              @change="handleTabsChange"
              size="mini"
            >
              <el-radio-button label="describe">总检综述</el-radio-button>
              <el-radio-button label="contrast">历史对比</el-radio-button>
              <el-radio-button label="depart">科室检查</el-radio-button>
              <el-radio-button label="totalCheck">历史总检</el-radio-button>
              <el-radio-button label="archives">健康档案</el-radio-button>
            </el-radio-group>
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
                <div
                  v-for="(item, index) in conclusionitems"
                  :key="index"
                  class="dom1_item"
                  :label="item"
                >
                  <div class="item_top">
                    <div class="text">{{ item.combinename }}</div>
                    <div class="concl_text">结论词</div>
                  </div>
                  <div class="line"></div>
                  <div class="item_body">
                    <div class="conclusion">
                      <el-input
                        class="conc_text"
                        type="textarea"
                        resize="none"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        v-model="item.conclusion"
                      ></el-input>
                    </div>
                    <div class="words">
                      <!-- <div class="words_mask"></div> readonly :autosize="{ minRows: 1, maxRows: 8 }"-->
                      <el-input
                        class="conc_text"
                        type="textarea"
                        resize="none"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        v-model="item.conclusionwords"
                      ></el-input>
                    </div>
                    <div class="btn_group">
                      <!-- <el-link @click="handleSelectMoveToRight(item)">选中右移</el-link> -->
                      <el-link type="primary" @click="handleMoveToRight(item)">
                        <i class="el-icon-right"></i>
                      </el-link>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 历史对比 dom2 contrast   -->
              <div v-if="checkActive == 'contrast'" class="dom2">
                <EasyTable
                  class="contrast_table"
                  height="100%"
                  :data="contrastData"
                  :tableOptions="contrastOptions"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleContrastRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
                <el-input
                  class="contrast_text"
                  type="textarea"
                  :rows="12"
                  resize="none"
                  disabled
                  v-model="contrastResult"
                ></el-input>
              </div>
              <!-- 科室检查 dom3 depart -->
              <div v-if="checkActive == 'depart'" class="dom3">
                <EasyTable
                  class="depart_table"
                  height="100%"
                  :data="departData"
                  :tableOptions="departOptions"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleDepartRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
              </div>
              <!-- 历史总检 dom4 totalCheck -->
              <div v-if="checkActive == 'totalCheck'" class="dom4">
                <EasyTable
                  class="totalCheck_table"
                  height="100%"
                  :data="totalCheckData"
                  :tableOptions="totalCheckOptions"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleTotalCheckRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
              </div>
              <!-- 健康档案 dom5 archives -->
              <div v-if="checkActive == 'archives'" class="dom5">
                <EasyTable
                  class="archives_table"
                  height="100%"
                  :data="archivesData"
                  :tableOptions="archivesOptions"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleArchivesRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
              </div>
            </el-scrollbar>
            <!-- 职业性评价 -->
            <div class="occupation_head" v-if="isoccupation">职业性评价</div>
            <div class="occupation" v-if="isoccupation">
              <div class="check_group">
                <el-radio-group v-model="checkRadio">
                  <el-radio
                    v-for="(item, index) in occupationChecks"
                    :key="index"
                    :label="item.code"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
                <el-checkbox v-model="occupationSelects.selected">{{
                  occupationSelects.name
                }}</el-checkbox>
              </div>
            </div>
          </div>
          <div class="check_right">
            <!-- 当前页操作控件 -->
            <div
              :class="[checkActive == 'describe' ? '' : 'none', 'handle_box']"
            >
              <el-tabs v-model="activeName">
                <el-tab-pane label="健康建议" name="jkjy">健康建议</el-tab-pane>
                <el-tab-pane label="饮食建议" name="ysjy">饮食建议</el-tab-pane>
                <el-tab-pane label="运动建议" name="ydjy">运动建议</el-tab-pane>
                <el-tab-pane label="健康知识" name="jkzs">健康知识</el-tab-pane>
              </el-tabs>
              <div class="handle_btn_group">
                <div class="handle_btn" @click="handleAddConclusion">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="增加"
                    placement="top"
                  >
                    <i class="el-icon-plus"></i>
                  </el-tooltip>
                  <!-- <el-link type="primary">增加</el-link> -->
                </div>
                <div class="handle_btn" @click="handleDelWordItems">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <i class="el-icon-minus"></i>
                  </el-tooltip>
                  <!-- <el-link type="primary">删除</el-link> -->
                </div>
                <div class="handle_btn" @click="handleMoveTopping">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="置顶"
                    placement="top"
                  >
                    <i class="el-icon-top"></i>
                  </el-tooltip>
                  <!-- <el-link type="primary">上移</el-link> -->
                </div>
                <div class="handle_btn" @click="handleMoveTop">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="上移"
                    placement="top"
                  >
                    <i class="el-icon-upload2"></i>
                  </el-tooltip>
                  <!-- <el-link type="primary">上移</el-link> -->
                </div>
                <div class="handle_btn" @click="handleMoveBottom">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="下移"
                    placement="top"
                  >
                    <i class="el-icon-download"></i>
                  </el-tooltip>
                  <!-- <el-link type="primary">下移</el-link> -->
                </div>
                <div class="handle_btn" @click="handleWordMerge">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="合并"
                    placement="top"
                  >
                    <i class="el-icon-s-unfold"></i>
                  </el-tooltip>
                  <!-- <el-link type="primary">合并</el-link> -->
                </div>
              </div>
            </div>
            <!-- 主体内容结构 -->
            <el-scrollbar class="check_b">
              <!-- 总检综述 dom1 describe 健康建议   -->
              <el-checkbox-group
                v-if="checkActive == 'describe' && activeName == 'jkjy'"
                class="dom1 item_drag"
                v-model="checkAdvise1"
              >
                <draggable
                  v-model="worditems"
                  chosenClass="chosen"
                  forceFallback="true"
                  handle=".text_h_drag"
                  group="people"
                  animation="400"
                  @start="handleDragOnStart"
                  @end="handleDragOnEnd"
                >
                  <el-checkbox
                    v-for="(item, index) in worditems"
                    :key="index"
                    class="dom1_item"
                    :label="item"
                  >
                    <div class="item_top dom1_item_top">
                      <div class="text text_h_drag">
                        <!-- <el-input size="mini" v-model="item.wordname"></el-input> -->
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 1, maxRows: 8 }"
                          resize="none"
                          v-model="item.wordname"
                        ></el-input>
                      </div>
                    </div>
                    <div class="line"></div>
                    <div class="item_body">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        v-model="item.healthadvice"
                      ></el-input>
                    </div>
                  </el-checkbox>
                </draggable>
              </el-checkbox-group>
              <!-- 饮食建议文本域 ysjy -->
              <el-input
                v-if="activeName == 'ysjy' && worditems.length != 0"
                class="ysjy"
                type="textarea"
                resize="none"
                v-model="worditems[0].dietadvice"
              ></el-input>
              <!-- 运动建议文本域 ydjy -->
              <el-input
                v-if="activeName == 'ydjy' && worditems.length != 0"
                class="ydjy"
                type="textarea"
                resize="none"
                v-model="worditems[0].sportsadvice"
              ></el-input>
              <!-- 健康知识文本域 jkzs -->
              <el-input
                v-if="activeName == 'jkzs' && worditems.length != 0"
                class="jkzs"
                type="textarea"
                resize="none"
                v-model="worditems[0].healthknowledge"
              ></el-input>
              <!-- 历史对比 dom2 contrast   -->
              <div v-if="checkActive == 'contrast'" class="dom2">
                <EasyTable
                  class="verdict_table"
                  height="100%"
                  :data="verdictData"
                  :tableOptions="verdictOptions"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleVerdictDataRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
                <EasyTable
                  class="verdict_dt"
                  height="100%"
                  :data="verdictDtData"
                  :tableOptions="verdictDtOptions"
                  :radio-config="{ rowClick: true }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
              </div>
              <!-- 科室检查 dom3 depart -->
              <div v-if="checkActive == 'depart'" class="dom3">
                <EasyTable
                  class="departDt_table"
                  height="100%"
                  :data="departDtData"
                  :tableOptions="
                    departDtFlag === '3' ? departDtOptions1 : departDtOptions
                  "
                  :radio-config="{ rowClick: true }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
                <el-form class="departDt_form" label-width="80px">
                  <el-form-item size="mini" label="检查医生">
                    <el-input v-model="departDtName" disabled></el-input>
                  </el-form-item>
                  <el-form-item size="mini" label="检查时间">
                    <el-date-picker
                      v-model="departDtTime"
                      disabled
                      value-format="yyyy-MM-dd-HH-mm-ss"
                      type="datetime"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <!-- 历史总检 dom4 totalCheck -->
              <div v-if="checkActive == 'totalCheck'" class="dom4">
                <EasyTable
                  class="totalDt1_table"
                  height="100%"
                  :data="totalDt1Data"
                  :tableOptions="totalDt1Options"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleTotalDttaRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
                <EasyTable
                  class="totalDt2_table"
                  height="100%"
                  :data="totalDt2Data"
                  :tableOptions="totalDt2Options"
                  :radio-config="{ rowClick: true }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
              </div>
              <!-- 健康档案 dom5 archives -->
              <div v-if="checkActive == 'archives'" class="dom5">
                <EasyTable
                  class="archivesDt1_table"
                  height="100%"
                  :data="archivesDt1Data"
                  :tableOptions="archivesDt1Options"
                  :radio-config="{ rowClick: true }"
                  @row-click="handleAarchivesDtRow"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
                <EasyTable
                  class="archivesDt2_table"
                  height="100%"
                  :data="archivesDt2Data"
                  :tableOptions="archivesDt2Options"
                  :radio-config="{ rowClick: true }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
              </div>
            </el-scrollbar>
          </div>
        </div>

        <!-- 底部表单 -->
        <div class="check_form">
          <el-form
            ref="form"
            :disabled="currentPeople.updatestatus == 0"
            :model="currentPeople"
            label-width="80px"
          >
            <el-form-item size="mini" label="总检医生">
              <el-select v-model="currentPeople.doctorcode" clearable>
                <el-option
                  v-for="(item, index) in currentPeople.doctoritems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="总检时间">
              <el-date-picker
                v-model="currentPeople.inputdate"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item size="mini" label="录入者">
              <!-- <el-input v-model="currentPeople.operatorname"></el-input> -->
              <el-select v-model="currentPeople.operatorname" clearable>
                <el-option
                  v-for="(item, index) in currentPeople.doctoritems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="审核医生">
              <!-- <el-input v-model="currentPeople.checkname"></el-input> -->
              <el-select v-model="currentPeople.checkname" clearable>
                <el-option
                  v-for="(item, index) in currentPeople.doctoritems"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="审核时间">
              <el-date-picker
                v-model="currentPeople.checkdate"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item size="mini" label="状态">
              <el-input v-model="currentPeople.statuscn" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 总检弹框 -->
    <el-dialog
      class="total_dialog"
      :visible.sync="showTotalCheck"
      width="40%"
      @close="handleTotalCheckClose"
    >
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
          <el-date-picker
            v-model="triageTime"
            type="datetimerange"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <el-radio-group
          @change="handleGetDepartCheckList"
          v-model="dialogActive"
          size="mini"
        >
          <el-radio-button :label="0">待总检</el-radio-button>
          <el-radio-button :label="1">我总检</el-radio-button>
        </el-radio-group>
      </div>
      <div class="table_box">
        <EasyTable
          v-if="dialogActive == 0"
          class="wait_table"
          height="100%"
          :data="waitDataSearch"
          :tableOptions="waitOptions"
          :radio-config="{ rowClick: true }"
          @row-dblclick="handleCheckTotal"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        />
        <EasyTable
          v-if="dialogActive == 1"
          class="total_table"
          height="100%"
          :data="totalDataSearch"
          :tableOptions="totalOptions"
          :radio-config="{ rowClick: true }"
          @row-dblclick="handleCheckTotal"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        />
      </div>
      <div class="tips">
        记录数：{{
          dialogActive == 0 ? waitDataSearch.length : totalDataSearch.length
        }}
      </div>
      <div style="text-align: center; margin-top: 15px">
        <el-button size="mini" @click="handleTotalCheckClose">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 新增结论词弹框 -->
    <el-dialog
      class="conc_dialog"
      :visible.sync="showConclusion"
      width="60%"
      :show-close="false"
    >
      <!-- 按钮组 -->
      <div class="btn_group">
        <el-button
          v-if="concActive == 'Person'"
          size="mini"
          type="primary"
          @click="handleAddPersonRow"
          >新增</el-button
        >
        <el-button
          v-if="concActive == 'Person'"
          size="mini"
          type="danger"
          @click="handleSetDelPersonWord"
          >删除</el-button
        >
        <el-button
          v-if="concActive == 'Person'"
          size="mini"
          type="warning"
          @click="personalEdit = false"
          >编辑</el-button
        >
        <el-button size="mini" type="success" @click="handleAddConcConfirm"
          >确认</el-button
        >
        <el-button
          v-if="concActive == 'Person'"
          size="mini"
          type="primary"
          @click="handleSetSavePersonWord"
          >保存</el-button
        >
        <el-button size="mini" type="danger" @click="handleConclusionClose"
          >关闭</el-button
        >
      </div>
      <!-- 弹框主体 -->
      <el-row class="conc_body">
        <el-col class="conc_left" :span="7">
          <!-- 切换状态tabs -->
          <el-radio-group
            v-model="concActive"
            @change="handleChangeConcActive"
            size="mini"
          >
            <el-radio-button label="All">通用</el-radio-button>
            <el-radio-button label="Person">个人</el-radio-button>
          </el-radio-group>
          <!-- 结论词树形结构 -->
          <el-scrollbar class="conc_tree" style="height: calc(100% - 42px)">
            <el-tree
              class="onclusion_tree"
              :data="conclusionData"
              :props="conclusionProps"
              default-expand-all
              :filter-node-method="handleFilterNode"
              ref="conclusionTree"
              @node-click="handleNodeConclusion"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i
                    :class="[
                      data.isFile ? 'el-icon-folder' : 'el-icon-folder-opened',
                    ]"
                  ></i
                  >&nbsp;{{ node.label }}
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col class="conc_right" :span="17">
          <!-- 搜索输入框 -->
          <div class="conc_search_box">
            <div class="title">搜索</div>
            <el-input
              size="mini"
              v-model="concSearch"
              clearable
              placeholder="请输入搜索内容"
              @keyup.enter.native="handleGetConclusionsList"
              @clear="handleGetConclusionsList"
            ></el-input>
          </div>
          <!-- 结论词表格数据 -->
          <div class="conc_table_box">
            <EasyTable
              v-loadmore="handleTableLoad"
              ref="currentTable"
              v-if="concActive == 'All'"
              class="current_table"
              height="100%"
              :data="currentData"
              :tableOptions="currentOptions"
              :radio-config="{ rowClick: true }"
              @row-click="handleChooseAllConc"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :cell-style="{ padding: '0' }"
            />
            <EasyTable
              v-if="concActive == 'Person'"
              class="personal_table"
              height="100%"
              :data="personalData"
              :tableOptions="personalOptions"
              :radio-config="{ rowClick: true }"
              @row-click="handleChoosePsonConc"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :cell-style="{ padding: '0' }"
            />
          </div>
          <!-- 建议输入框文本域  -->
          <div class="conc_text_box">
            <el-tabs v-model="activeConc">
              <el-tab-pane label="健康建议" name="jkjy">健康建议</el-tab-pane>
              <el-tab-pane label="饮食建议" name="ysjy">饮食建议</el-tab-pane>
              <el-tab-pane label="运动建议" name="ydjy">运动建议</el-tab-pane>
              <el-tab-pane label="健康知识" name="jkzs">健康知识</el-tab-pane>
            </el-tabs>
            <el-input
              :disabled="personalEdit"
              v-if="activeConc == 'jkjy' && chooseConclusion"
              class="conc_text"
              type="textarea"
              resize="none"
              v-model="chooseConclusion.healthadvice"
            ></el-input>
            <el-input
              :disabled="personalEdit"
              v-if="activeConc == 'ysjy' && chooseConclusion"
              class="conc_text"
              type="textarea"
              resize="none"
              v-model="chooseConclusion.dietadvice"
            ></el-input>
            <el-input
              :disabled="personalEdit"
              v-if="activeConc == 'ydjy' && chooseConclusion"
              class="conc_text"
              type="textarea"
              resize="none"
              v-model="chooseConclusion.sportsadvice"
            ></el-input>
            <el-input
              :disabled="personalEdit"
              v-if="activeConc == 'jkzs' && chooseConclusion"
              class="conc_text"
              type="textarea"
              resize="none"
              v-model="chooseConclusion.healthknowledge"
            ></el-input>
            <!-- 固定显示假结构 -->
            <el-input
              :disabled="personalEdit"
              v-if="!chooseConclusion"
              class="conc_text"
              type="textarea"
              resize="none"
              v-model="itemLabel"
            ></el-input>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 新增结论词弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      class="track_dialog"
      title="回访设计"
      :visible.sync="showTrack"
      width="55%"
      @close="handleCloseTrack"
    >
      <EasyTable
        class="track_table"
        v-if="trackObj"
        height="100%"
        :data="trackObj.trackdetaiiItems"
        :tableOptions="trackOptions"
        :radio-config="{ rowClick: true }"
        @row-click="handleCheckTrack"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-class-name="handleTableRowClassName"
        :cell-style="{ padding: '0' }"
      />
      <div class="head">回访说明</div>
      <el-input
        v-if="trackObj"
        type="textarea"
        class="explain"
        resize="none"
        v-model="trackObj.explain"
      ></el-input>
      <div class="btn_group">
        <el-button size="mini" type="primary" @click="handleSubmitTrack"
          >确认</el-button
        >
        <el-button size="mini" type="danger" @click="handleCloseTrack"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <!-- 疾病集弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      class="illitems_dialog"
      title="异常提醒"
      :visible.sync="showIllitems"
      width="35%"
      @close="handleCloseIllitems"
    >
      <div class="head">异常提醒</div>
      <EasyTable
        class="track_table"
        height="100%"
        :data="illitems"
        :tableOptions="illitemsOptions"
        :radio-config="{ rowClick: true }"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-class-name="handleTableRowClassName"
        :cell-style="{ padding: '0' }"
      />
      <div class="btn_group">
        <el-button size="mini" type="primary" @click="handleSubmitTrackIllitems"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 检索组件 -->
    <SearchDialog
      v-if="showSearch"
      :showSearch="showSearch"
      @close="handleCloseSearch"
      @submit="handleSearchSubmit"
    />
    <!-- 预览弹框 -->
    <el-dialog
      title="预览"
      class="preview_box"
      :visible.sync="dialogVisible"
      width="850px"
      @close="handleCloseDialog"
    >
      <iframe
        ref="pdfCotainer"
        :src="pdfUrl"
        width="100%"
        style="height: calc(100vh - 147px)"
      ></iframe>
    </el-dialog>
    <!-- 取消审核原因弹框 -->
    <el-dialog
      title="取消原因"
      :visible.sync="showToExamine"
      width="45%"
      :close-on-click-modal="false"
      class="word_dia"
      @close="handleCancelToExamine"
    >
      <div class="word_dia_box">
        <div class="title">请输入操作原因</div>
        <el-input type="textarea" :rows="5" resize="none" v-model="reason">
        </el-input>
        <div class="tips">提醒：体检报告已打印,请及时收后体检报告。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelToExamine">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitToExamine"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import SearchDialog from "@/components/searchDialog";
import { jumpRouteLink } from "@/utils/jumpRouteLink.js"; // 跳转页面进入路由缓存
import { mapGetters } from "vuex";
import { printBase64 } from "@/api/printreport.js";

import draggable from "vuedraggable"; // 引入拖拽组件

import {
  getTotalCheck,
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
  setSaveTrack,
  getLoadTrack,
  setSaveIllitems,
  setCancelCheck,
  setGenerateAgain,
  setTotalCheckDelete,
} from "@/api/totalcheck.js"; // 引入接口文件
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
export default {
  name: "totalcheck",

  components: { Sticky, permissionBtn, SearchDialog, draggable },

  data() {
    return {
      itemLabel: "",
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字 1003700002 1000000019
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
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
      buttons: [],
      size: "mini",
      domIdArr: ["btnReport"],
      pdfUrl: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
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
          prop: "reslower",
          align: "center",
          width: 120,
          returnVal: (value, data) => {
            let result = data.resupper
              ? `${value} - ${data.resupper}`
              : `${value}`;
            return result;
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
  },
  mounted() {
    this.handleGetTotalCheck();
    this.handleGetToday();
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
  },

  methods: {
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
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
      this.dialogVisible = true;
      switch (domId) {
        case "btnReport": // 报告书
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "报告书") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.currentPeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
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
                if (url) this.dialogVisible = true;
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
    handleSearchSubmit(regid) {
      this.checkupWork = regid;
      this.handleGetTotalCheck();
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
    },
    // 科室检查数据行点击回调
    handleDepartRow(row) {
      if (!row) return false;
      this.departDtFlag = row.viewgroup;
      console.log(this.departDtFlag, "this.departDtFlag");
      this.departDtData = row.items;
      this.departDtTime = row.inputdate;
      this.departDtName = row.doctorname;
    },
    // 获取历史结果数据回调
    handleGetHistoryResult() {
      console.log(this.currentPeople);
      getHistoryResult({
        regid: this.currentPeople.regid,
        combinecode: this.currentPeople.combinecode,
      }).then((res) => {
        console.log(res);
      });
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
      this.checkupWork = row.regid;
      this.handleGetTotalCheck();
      this.waitData = []; // 待检号数据源
      this.totalData = []; // 总检号数据源
      this.showTotalCheck = false;
    },
    // 我的总检 - 列表表格数据回调
    handleGetDepartCheckList() {
      let whereitems = [
        {
          key: "status",
          value: this.dialogActive,
        },
      ];
      getDepartCheckList({
        page: 1,
        limit: 10000000,
        whereitems,
      }).then((res) => {
        if (!res.data) return false;
        this.waittotalData = res.data;
        this.waitData = this.waittotalData.filter((k) => k.checkflag == 0);
        this.totalData = this.waittotalData.filter((k) => k.checkflag == 1);
        console.log(this.waitData);
        console.log(this.totalData);
      });
    },
    // 体检总检审核接口回调
    handleGetCheck() {
      if (!this.currentPeople.regid) {
        this.$message.warning("请先提供审核人员信息!");
        return false;
      }
      getCheck({
        regid: this.currentPeople.regid,
      }).then((res) => {
        this.$message.success("审核成功!");
        this.checkupWork = this.currentPeople.regid;
        this.handleGetTotalCheck();
      });
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
      let idArr = this.checkAdvise1.map((item) => {
        return {
          cluid: item.cluid,
          wordname: item.wordname,
        };
      });
      idArr.forEach((item) => {
        this.worditems.forEach((k, i) => {
          if (item.cluid == k.cluid && item.wordname == k.wordname) {
            this.worditems.splice(i, 1);
          }
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
        // if (index == 0) {
        // } else {
        //   item.specialistadvice != "" &&
        //     (temp.specialistadvice = item.specialistadvice);
        //   item.healthadvice != "" && (temp.healthadvice = item.healthadvice);
        //   item.dietadvice != "" && (temp.dietadvice = item.dietadvice);
        //   item.sportsadvice != "" && (temp.sportsadvice = item.sportsadvice);
        //   item.healthknowledge != "" &&
        //     (temp.healthknowledge = item.healthknowledge);
        // }
      });
      temp.wordname = temp.wordname.substring(0, temp.wordname.length - 1);
      this.worditems.push(temp);
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
        if (
          this.checkAdvise1[0].uniqueid == k.uniqueid &&
          this.checkAdvise1[0].wordname == k.wordname
        ) {
          if (i == 0) {
            this.$message.warning("已移动到顶部!");
            return false;
          } else {
            this.worditems.splice(i, 1);
            this.worditems.unshift(this.checkAdvise1[0]);
          }
        }
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
        if (
          this.checkAdvise1[0].uniqueid == k.uniqueid &&
          this.checkAdvise1[0].wordname == k.wordname
        ) {
          if (i == 0) {
            this.$message.warning("已移动到顶部!");
            return false;
          } else {
            this.worditems.splice(i, 1);
            this.worditems.splice(i - 1, 0, this.checkAdvise1[0]);
          }
        }
      });
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
      let index = 0;
      this.worditems.forEach((k, i) => {
        if (
          this.checkAdvise1[0].uniqueid == k.uniqueid &&
          this.checkAdvise1[0].wordname == k.wordname
        ) {
          if (i == this.worditems.length - 1) {
            this.$message.warning("已移动到底部!");
            flag = false;
            return false;
          } else {
            index = i;
            flag = true;
            this.worditems.splice(i, 1);
          }
        }
      });
      flag && this.worditems.splice(index + 1, 0, this.checkAdvise1[0]);
    },
    // 删除结论词回调
    handleDelWordItems() {
      if (this.checkAdvise1.length == 0) {
        this.$message.warning("请先选择需要的删除数据!");
        return false;
      }
      let idArr = this.checkAdvise1.map((item) => {
        return {
          cluid: item.cluid,
          wordname: item.wordname,
        };
      });
      idArr.forEach((item) => {
        this.worditems.forEach((k, i) => {
          if (item.cluid == k.cluid && item.wordname == k.wordname) {
            this.worditems.splice(i, 1);
          }
        });
      });
      this.$message.success("删除成功!");
      this.checkAdvise1 = [];
    },
    // 保存
    handleSetTotalCheckSave() {
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
      let data = undefined;
      if (occupationitems.length == 0) {
        data = {
          regid: this.currentPeople.regid,
          doctorcode: this.currentPeople.doctorcode,
          doctorname: this.currentPeople.doctorname,
          worditems: this.worditems,
        };
      } else {
        data = {
          regid: this.currentPeople.regid,
          doctorcode: this.currentPeople.doctorcode,
          doctorname: this.currentPeople.doctorname,
          worditems: this.worditems,
          occupationitems: occupationitems.length > 0 ? occupationitems : [],
        };
      }
      setTotalCheckSave(data).then((res) => {
        this.$message.success(res.message);
        this.checkupWork = this.currentPeople.regid;
        this.handleGetTotalCheck();
      });
    },
    // 左侧小结集右移按钮事件回调
    handleMoveToRight(item) {
      getLoadAdvice(item).then((res) => {
        this.$message.success(res.message);
        this.worditems.push({
          ...res.result[0],
          index: this.worditemsIndex + 1,
        });
        ++this.worditemsIndex;
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
      this.handleGetTotalCheck();
    },
    // 获取总检结果回调
    handleGetTotalCheck() {
      let whereitems = [
        {
          key: this.conditionCode,
          value: this.checkupWork.trim(),
        },
      ];
      getTotalCheck({ whereitems }).then((res) => {
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
        this.currentPeople = data;
        this.currentPeople.sex =
          data.sex == 0 ? "未知" : data.sex == 1 ? "男" : "女";
        this.currentPeople.age = `${data.age}岁`;
        let marriage = data.marriageitem.filter((k) => k.selected)[0];
        let checktype = data.checktypeitems.filter((k) => k.selected)[0];
        let company = data.companyitems.filter((k) => k.selected)[0];
        let batch = data.batchitems.filter((k) => k.selected)[0];
        this.currentPeople.marriage = (marriage && marriage.name) || "未知";
        this.currentPeople.checktype = (checktype && checktype.name) || "";
        this.currentPeople.company = (company && company.name) || "";
        this.currentPeople.batch = (batch && batch.name) || "";
        this.conclusionitems = data.conclusionitems;
        // replace(/<br\/>/g, "\r\n"); 正则替换字符串
        this.worditems = data.worditems; // 右侧主体内容 结论词集
        this.isoccupation = data.isoccupation;
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
      this.checkActive = "describe";
    },
    // 结论词弹框确认按钮添加数据回调
    handleAddConcConfirm() {
      if (!this.chooseConclusion) {
        this.$message.warning("请先选择结论词数据!");
        return false;
      }
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
        };
      });
      this.worditems.push(...tempArr); // 移动到右侧结论词集
      // 拼接饮食建议-运动建议-健康知识到结论词数组第一条
      this.worditems[0].dietadvice += `\n${this.chooseConclusion.dietadvice}`;
      this.worditems[0].sportsadvice += `\n${this.chooseConclusion.sportsadvice}`;
      this.worditems[0].healthknowledge += `\n${this.chooseConclusion.healthknowledge}`;
      this.showConclusion = false;
      this.$message.success("操作成功!");
      console.log(this.chooseConclusion);
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
      console.log(this.personalData);
      console.log(this.personalData[this.personalData.length - 1]);
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
      this.personalData.push({
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
        // 滚动条置顶
        this.$refs.currentTable.$el.children[0].children[2].scrollTop = 0;
        if (this.concActive == "All") {
          this.count = data.length;
          this.tempData = data;
          // this.currentData = data;
          this.handleTableLoad();
        } else {
          this.personalData = data;
        }
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
    // 关闭总检弹框回调
    handleTotalCheckClose() {
      this.waitData = []; // 待检号数据源
      this.totalData = []; // 总检号数据源
      this.dialogActive = 0; // 总检号数据源
      this.showTotalCheck = false;
      this.handleGetToday();
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.key;
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
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          console.log(111);
          break;
        case "btnKeep": // 保存
          this.handleSetTotalCheckSave();
          break;
        case "btnToExamine": // 审核
          this.handleGetCheck();
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
        case "btnTrack": // 追踪
          this.handleShowTrack();
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
          if (!this.currentPeople && !this.currentPeople.regid) {
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
              message: "请选择人员再进行打印",
              type: "error",
            });
            return false;
          }
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "报告书") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.currentPeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
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
            }
          });
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
        vm.handleGetTotalCheck();
      }
    });
  },
  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>