<template>
  <div>
    <div class="main">
      <div class="head">
        <!-- 功能按钮 -->
        <sticky>
          <div class="filter-container">
            <permission-btn
              moduleName="personalregister"
              ref="personalregister"
              size="mini"
              v-on:btn-event="handleOnBtnClicked"
              index="1"
            ></permission-btn>
          </div>
        </sticky>
      </div>
      <div class="content">
        <el-row :gutter="10">
          <!-- 基本条件 -->
          <el-col :span="4">
            <div class="card">
              <!-- 基本条件头部 -->
              <div class="content_head">
                <div class="head_title">
                  <div class="logo"></div>
                  <h4>基本条件</h4>
                </div>
              </div>
              <!-- 基本条件内容 -->
              <div class="content_left">
                <!-- 体检时间 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>体检时间</a>
                  </div>
                  <div class="time_content">
                    <el-date-picker
                      v-model="valueTime"
                      type="daterange"
                      size="mini"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </div>
                </div>
                <!-- 条件类型 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>条件类型</a>
                  </div>
                  <div class="type_content">
                    <el-select
                      v-model="checktype"
                      placeholder="请选择"
                      style="width: 100%"
                      size="mini"
                      @change="handleSelectOption"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="i in CheckType"
                        :key="i.code"
                        :label="i.name"
                        :value="i.code"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <!-- 性别 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>性别</a>
                  </div>
                  <div class="sex_content">
                    <el-select
                      v-model="inputSex"
                      placeholder="请选择"
                      style="width: 100%"
                      size="mini"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <!-- 年龄 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>年龄</a>
                    <!-- <i class="el-icon-plus"></i> -->
                  </div>
                  <div class="age_content">
                    <el-form
                      :model="ruleForm"
                      status-icon
                      :rules="rules"
                      ref="ruleForm"
                      label-width="100px"
                      class="demo-ruleForm"
                    >
                      <el-form-item prop="inputAgemin">
                        <el-input
                          v-model.number="ruleForm.inputAgemin"
                          autocomplete="off"
                          size="mini"
                        ></el-input>
                      </el-form-item>
                      <el-form-item><span>-</span></el-form-item>
                      <el-form-item prop="inputAgemax">
                        <el-input
                          v-model.number="ruleForm.inputAgemax"
                          autocomplete="off"
                          size="mini"
                        ></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <!-- 婚否 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>婚否</a>
                  </div>
                  <div class="marital_status">
                    <el-select
                      v-model="marriage"
                      placeholder="请选择"
                      style="width: 100%"
                      size="mini"
                    >
                      <el-option
                        v-for="item in Marriage"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                    <!-- <el-input type="input" v-model="marriage" :rows="1" :disabled="true"></el-input> -->
                  </div>
                </div>
                <!-- <el-dialog width="30%" title="婚否" :visible.sync="handleInputMarital">
                  <el-input type="input" v-model="marriage" placeholder="请输入婚姻状态"></el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" plain size="mini" @click="handleInputMarital = false">确 定</el-button>
                    <el-button type="primary" plain size="mini" @click="handleInputMarital = false">取 消</el-button>
                  </div>
                </el-dialog> -->
                <!-- 民族 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>民族</a>
                  </div>
                  <div class="ethnic_content">
                    <el-select
                      v-model="nation"
                      filterable
                      clearable
                      placeholder="请选择"
                      style="width: 100%"
                      size="mini"
                    >
                      <el-option
                        v-for="k in Nation"
                        :key="k.code"
                        :label="k.name"
                        :value="k.code"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <!-- 体检费用 -->
                <div class="left_item">
                  <div class="item_title">
                    <a>体检费用</a>
                  </div>
                  <div class="cost_content">
                    <!-- <el-input v-model="cost.inputCostmin" size="mini" placeholder="请输入内容"></el-input>
                    <span>-</span>
                    <el-input v-model="cost.inputCostmax" size="mini" placeholder="请输入内容"></el-input> -->

                    <el-form
                      :model="cost"
                      status-icon
                      :rules="rules2"
                      ref="cost"
                      label-width="100px"
                      class="demo-ruleForm"
                    >
                      <el-form-item prop="inputCostmin">
                        <el-input
                          v-model.number="cost.inputCostmin"
                          autocomplete="off"
                          size="mini"
                        ></el-input>
                      </el-form-item>
                      <el-form-item><span>-</span></el-form-item>
                      <el-form-item prop="inputCostmax">
                        <el-input
                          v-model.number="cost.inputCostmax"
                          autocomplete="off"
                          size="mini"
                        ></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <!-- 检查条件 -->
          <el-col :span="9">
            <div class="card">
              <!-- 检查条件头部 -->
              <div class="content_head">
                <div class="head_title">
                  <div class="logo"></div>
                  <h4>检查条件</h4>
                </div>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="handleAddCondition"
                  >增加</el-button
                >
              </div>
              <!-- 检查条件内容 -->
              <div class="content_center">
                <div
                  class="center_item"
                  v-for="ci in conditionTotal"
                  :key="ci.sortindex"
                >
                  <div class="center_head">
                    <span>条件</span>
                    <div class="head_btn">
                      <el-button
                        type="primary"
                        plain
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAddItem(ci)"
                      ></el-button>
                      <el-button
                        type="primary"
                        plain
                        icon="el-icon-close"
                        size="mini"
                        @click="handleDeleteCondition(ci)"
                      ></el-button>
                    </div>
                  </div>
                  <!-- 条件表格 -->
                  <div class="one">
                    <el-table
                      :data="ci.detailitems"
                      class="center_table"
                      height="210px"
                      :border="false"
                      :header-cell-style="handleReturnStyle"
                      :row-class-name="handleTableRowClassName"
                      :cell-style="{ padding: '0' }"
                      @cell-click="handleClick"
                    >
                      <el-table-column
                        prop="itemname"
                        label="项目"
                        width="90px"
                      >
                        <template slot-scope="scope">
                          <el-link
                            @click="handledialogCondition(scope.row, ci)"
                            >{{ scope.row.itemname }}</el-link
                          >
                        </template>
                      </el-table-column>

                      <el-table-column
                        prop="judgesymbol"
                        label="判断"
                        width="110px"
                      >
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.judgesymbol"
                            size="mini"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(item, index) in CalcRelation"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            >
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column prop="itemvalue" label="值">
                        <template slot-scope="scope">
                          <el-input
                            @focus="handleClassification(scope.row)"
                            size="mini"
                            type="input"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="scope.row.selectName"
                          ></el-input>
                        </template>
                      </el-table-column>

                      <el-table-column
                        prop="relation"
                        label="关系"
                        width="110px"
                      >
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.relation"
                            size="mini"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(item, index) in Relation"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            >
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label=" " width="60px">
                        <template slot-scope="scope">
                          <el-link
                            type="primary"
                            @click="handleDeleteProject(scope.row, ci)"
                            >删除</el-link
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>

                <!-- 病史弹窗 -->
                <el-dialog
                  title="病史"
                  :visible.sync="surveyinformation"
                  width="70%"
                >
                  <div class="dialog_main">
                    <div
                      class="dialog_card"
                      v-for="(i, index) in medicalHistory"
                      :key="index"
                    >
                      <div class="dialog_head">
                        <div class="logo"></div>
                        <h3>{{ i.sysname }}</h3>
                      </div>
                      <div class="dialog_content">
                        <div
                          class="content_item"
                          v-for="(item, index) in i.historyitems"
                          :key="index"
                        >
                          <el-checkbox-group
                            v-model="checkBoxKey"
                            @change="handlechangecheckbox"
                          >
                            <el-checkbox :label="item.hoycode">{{
                              item.hoyname
                            }}</el-checkbox>
                          </el-checkbox-group>
                          <!-- <span v-if="[-1].indexOf(item.inputtype) !== -1">{{item.hoyname}}</span>
                            <el-checkbox @change="handlechangecheckbox" v-if="[0,2,3,4].indexOf(item.inputtype) !== -1" :label="item.hoyname" v-model="item.remark" :true-label="1" :false-label="0">
                              <span>{{item.hoyname}}</span>
                              <el-input v-if="[3,4].indexOf(item.inputtype) !== -1" v-model="item.remark" size="mini" clearable></el-input>
                            </el-checkbox>
                            <el-input v-model="item.remark" v-if="[1].indexOf(item.inputtype) !== -1" placeholder="请输入内容" size="mini" style="width: 200px;" clearable></el-input> -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <Questionnaire :regid="''" :pageFlag="'dataAnalysis'" /> -->
                  <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="surveyinformation = false"
                      >取 消</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handlesavequestionnaire"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>

                <!-- 结论词弹窗 -->
                <el-dialog
                  title="结论词"
                  :visible.sync="concludingWord"
                  width="50%"
                >
                  <div class="concludingWord">
                    <!-- 搜索 -->
                    <div class="searchword_content">
                      <el-input
                        v-model="searchConCludingWord"
                        size="mini"
                        placeholder="请输入内容"
                      ></el-input>
                      <el-button
                        type="primary"
                        size="mini"
                        plain
                        @click="handleSearchWord"
                        >搜索</el-button
                      >
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="11">
                        <!-- 结论词左 -->
                        <div class="concluding_left">
                          <el-table
                            ref="multipleTable"
                            :data="conCludingWord1"
                            v-loading="loading"
                            style="width: 100%"
                            height="400px"
                            :header-cell-style="handleReturnStyle"
                            :row-class-name="handleTableRowClassName"
                            :cell-style="{ padding: '0' }"
                            @selection-change="handleLeftCheckedWord"
                          >
                            <el-table-column
                              type="selection"
                              width="45"
                            ></el-table-column>
                            <el-table-column
                              prop="typename"
                              label="分类"
                              width="80px"
                            ></el-table-column>
                            <el-table-column
                              prop="name"
                              label="结论词"
                            ></el-table-column>
                          </el-table>
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <div class="concludingWord_btn">
                          <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-arrow-right"
                            circle
                            @click="handleShiftLeftWord"
                          ></el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-arrow-left"
                            circle
                            @click="handleShiftRightWord"
                          ></el-button>
                        </div>
                      </el-col>
                      <el-col :span="11">
                        <!-- 结论词右 -->
                        <div class="concluding_right">
                          <el-table
                            :data="conCludingWord2"
                            style="width: 100%"
                            height="400px"
                            :header-cell-style="handleReturnStyle"
                            :row-class-name="handleTableRowClassName"
                            :cell-style="{ padding: '0' }"
                            @selection-change="handleRightCheckedWord"
                          >
                            <el-table-column
                              type="selection"
                              width="45"
                            ></el-table-column>
                            <el-table-column
                              prop="typename"
                              label="分类"
                              width="80px"
                            ></el-table-column>
                            <el-table-column
                              prop="name"
                              label="结论词"
                            ></el-table-column>
                          </el-table>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="concludingWord = false"
                      >取 消</el-button
                    >
                    <el-button size="mini" type="primary" @click="handelAddWord"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>

                <!-- 点击项目弹窗 -->
                <el-dialog
                  title="提示"
                  :visible.sync="dialogCondition"
                  width="50%"
                >
                  <el-table
                    :data="tableData"
                    style="width: 100%"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                    :cell-style="{ padding: '0' }"
                    @row-dblclick="handleDoubleClickProject"
                  >
                    <el-table-column
                      prop="itemname"
                      label="项目"
                    ></el-table-column>
                    <el-table-column
                      prop="itemcode"
                      label="代码"
                    ></el-table-column>
                    <el-table-column
                      prop="deptname"
                      label="科室"
                    ></el-table-column>
                  </el-table>
                  <!-- 搜索 -->
                  <div class="searchproject">
                    <div class="searchproject_content">
                      <el-input
                        v-model="searchproject"
                        size="mini"
                        placeholder="请输入内容"
                      ></el-input>
                      <el-button
                        type="primary"
                        size="mini"
                        plain
                        @click="handleSearchItemDictionary"
                        >搜索</el-button
                      >
                    </div>
                  </div>
                  <!-- 检查项目 -->
                  <el-table
                    :data="checkproject"
                    v-loading="searchLoading"
                    height="300px"
                    style="width: 100%"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                    :cell-style="{ padding: '0' }"
                    @row-dblclick="handleDoubleClickProject"
                    v-loadmore="handleloadMore"
                  >
                    <el-table-column prop="name" label="项目" width="180">
                      <!-- <template slot-scope="scope">
                        <span @dblclick="handleDoubleClickProject(scope.row)">{{scope.row.name}}</span>
                      </template> -->
                    </el-table-column>
                    <el-table-column
                      prop="code"
                      label="代码"
                      width="180"
                    ></el-table-column>
                    <el-table-column
                      prop="deptname"
                      label="科室"
                    ></el-table-column>
                  </el-table>
                  <span slot="footer" class="dialog-footer">
                    <el-button
                      type="primary"
                      plain
                      @click="handleDialogCondition"
                      >取 消</el-button
                    >
                    <el-button
                      type="primary"
                      plain
                      @click="handleDialogCondition"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </div>
            </div>
          </el-col>
          <!-- 输出数据 -->
          <el-col :span="11">
            <div class="card">
              <!-- 输出数据头部 -->
              <div class="content_head">
                <div class="head_title">
                  <div class="logo"></div>
                  <h4>输出数据</h4>
                </div>
              </div>
              <!-- 输出数据内容 -->
              <div class="content_right">
                <div class="right_item">
                  <div class="right_head">
                    <span>基本信息</span>
                  </div>
                  <div class="basic_Information">
                    <el-checkbox-group
                      v-model="checkList"
                      @change="handleCheckBox"
                    >
                      <el-checkbox label="姓名"></el-checkbox>
                      <el-checkbox label="性别"></el-checkbox>
                      <el-checkbox label="年龄"></el-checkbox>
                      <el-checkbox label="婚否"></el-checkbox>
                      <el-checkbox label="单位信息"></el-checkbox>
                      <el-checkbox label="体检类型"></el-checkbox>
                      <el-checkbox label="电话"></el-checkbox>
                      <el-checkbox label="住址"></el-checkbox>
                      <el-checkbox label="档案号"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
                <div
                  class="table_basic"
                  style="height: calc(100% - 160px); margin-top: 10px"
                >
                  <el-table
                    ref="dataStatics"
                    :data="dataStatics"
                    height="100%"
                    :border="false"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                    :row-style="{ height: '32px' }"
                    :cell-style="{ padding: '0' }"
                  >
                    <el-table-column prop="regid" label="体检号" width="110px">
                    </el-table-column>
                    <el-table-column
                      prop="regdate"
                      label="登记日期"
                      min-width="160px"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="姓名"
                      width="80px"
                      v-if="checkList.includes('姓名')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="sex"
                      label="性别"
                      width="80px"
                      v-if="checkList.includes('性别')"
                    >
                      <template slot-scope="scope">
                        <span>{{
                          scope.row.sex == 0
                            ? "未知"
                            : scope.row.sex == 1
                            ? "男"
                            : "女"
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="age"
                      label="年龄"
                      width="80px"
                      v-if="checkList.includes('年龄')"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.age }}岁</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="marriage"
                      label="婚否"
                      width="100px"
                      v-if="checkList.includes('婚否')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="companyname"
                      label="单位信息"
                      width="150px"
                      v-if="checkList.includes('单位信息')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="checktypename"
                      label="体检类型"
                      width="110px"
                      v-if="checkList.includes('体检类型')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="telephone"
                      label="电话"
                      width="120px"
                      v-if="checkList.includes('电话')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="住址"
                      width="180px"
                      v-if="checkList.includes('住址')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="checkno"
                      label="档案号"
                      width="110px"
                      v-if="checkList.includes('档案号')"
                    >
                    </el-table-column>
                  </el-table>
                </div>
                <!-- <div class="right_item">
                  <div class="right_head">
                    <span>检查数据</span>
                    <div class="head_btn">
                      <el-button
                        type="primary"
                        plain
                        icon="el-icon-plus"
                        size="mini"
                      ></el-button>
                      <el-button
                        type="primary"
                        plain
                        icon="el-icon-minus"
                        size="mini"
                      ></el-button>
                    </div>
                  </div>
                  <div class="check_data">
                    <el-table
                      :data="checkdata"
                      :border="false"
                      height="155px"
                      :header-cell-style="handleReturnStyle"
                      :row-class-name="handleTableRowClassName"
                      :cell-style="{ padding: '0' }"
                    >
                      <el-table-column
                        prop="department"
                        label="检查科室"
                      ></el-table-column>
                      <el-table-column
                        prop="project"
                        label="检查项目"
                      ></el-table-column>
                    </el-table>
                  </div>
                </div> -->
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import Questionnaire from "@/components/surveyinformation"; // 调查问卷
import { mapGetters } from "vuex";

import {
  getConclusionsList,
  getItemDictionaryList,
  getConCludingWordList,
  medicalHistory,
  dataStatics,
  getPublicConfig,
} from "@/api/dataanalysis.js";
export default {
  name: "dataanalysis",
  components: {
    Sticky,
    permissionBtn,
    Questionnaire,
  },
  data() {
    // 年龄
    var validateAge = (rule, value, callback) => {
      setTimeout(() => {
        if (value === "") {
          callback(new Error("请输入"));
        } else {
          if (this.ruleForm.inputAgemax !== "") {
            this.$refs.ruleForm.validateField("inputAgemax");
          }
          callback();
        }
      }, 200);
    };
    var validateAge2 = (rule, value, callback) => {
      setTimeout(() => {
        if (this.value === "") {
          callback(new Error("请再次输入"));
        } else if (value < this.ruleForm.inputAgemin) {
          callback(new Error("只能大于左侧最小值"));
        } else if (value == this.ruleForm.inputAgemin) {
          callback(new Error("只能大于左侧最小值"));
        } else {
          callback();
        }
      }, 200);
    };
    // 体检费用
    var validatePass = (rule, value, callback) => {
      setTimeout(() => {
        if (value === "") {
          callback(new Error("请输入"));
        } else {
          if (this.cost.inputCostmax !== "") {
            this.$refs.cost.validateField("inputCostmax");
          }
          callback();
        }
      }, 200);
    };
    var validatePass2 = (rule, value, callback) => {
      setTimeout(() => {
        if (value === "") {
          callback(new Error("请再次输入"));
        } else if (value < this.cost.inputCostmin) {
          callback(new Error("只能大于左侧最小值!"));
        } else if (value == this.cost.inputCostmin) {
          callback(new Error("只能大于左侧最小值"));
        } else {
          callback();
        }
      }, 200);
    };
    return {
      loading: true, // 结论词左loading
      questionnaire: [],
      checkBoxKey: [], // 病史多选数据
      showQuestionnaire: false, // 调查问卷显示
      dataStatics: [],

      tableData: [
        {
          itemtype: 1,
          itemcode: "",
          itemname: "病史",
          judgesymbol: "",
          itemvalue: "",
          relation: "",
          deptname: "全部",
        },
        {
          itemtype: 6,
          itemcode: "",
          itemname: "结论词",
          judgesymbol: "",
          itemvalue: "",
          relation: "",
          deptname: "全部",
        },
        {
          itemtype: 4,
          itemcode: "",
          itemname: "检查小结",
          judgesymbol: "",
          itemvalue: "",
          relation: "",
          deptname: "全部",
        },
      ],
      checkproject: [], // 体检项目
      checkList: [
        "姓名",
        "性别",
        "年龄",
        "婚否",
        "单位信息",
        "体检类型",
        "电话",
        "住址",
        "档案号",
      ],
      medicalHistoryitem: [],
      valueTime: "",
      inputTextArea: "",
      checktype: "", // 条件类型
      CheckType: [], // 条件类型列表
      // inputTypeArr: [
      //   {
      //     detailItems: [],
      //   },
      // ], // 条件类型列表
      // inputType2: "",
      inputSex: "", // 性别
      options: [
        {
          value: "0",
          label: "全部",
        },
        {
          value: "1",
          label: "男",
        },
        {
          value: "2",
          label: "女",
        },
      ], // 性别下拉框数据
      searchproject: "", // 搜索
      ruleForm: {
        inputAgemin: "",
        inputAgemax: "",
      }, // 年龄
      rules: {
        inputAgemin: [{ validator: validateAge, trigger: "blur" }],
        inputAgemax: [{ validator: validateAge2, trigger: "blur" }],
      }, // 年龄检查
      nation: "汉族", // 民族
      Nation: [], // 民族列表
      marriage: "已婚", // 婚否
      Marriage: [], // 婚否列表
      // selectEthnicArr: [
      //   {
      //     detailItems: [],
      //   },
      // ],
      cost: {
        inputCostmin: "",
        inputCostmax: "",
      }, // 体检费用
      rules2: {
        inputCostmin: [{ validator: validatePass, trigger: "blur" }],
        inputCostmax: [{ validator: validatePass2, trigger: "blur" }],
      }, // 体检费用检查
      CalcRelation: [], // 判断下拉框
      Relation: [
        {
          code: "AND",
          name: "并且",
        },
        {
          code: "OR",
          name: "或者",
        },
      ], // 关系下拉框
      checkdata: [
        {
          department: "监察科",
          project: "K",
        },
        {
          department: "监察科",
          project: "GKL",
        },
        {
          department: "内科",
          project: "心率",
        },
        {
          department: "内科",
          project: "心率",
        },
      ],
      conCludingWord1: [], // 结论词表格数据
      conCludingWord2: [], // 选中的结论词表格数据
      searchConCludingWord: "", // 结论词搜索
      dialogCondition: false, // 条件弹窗
      surveyinformation: false, // 病史弹窗
      concludingWord: false, // 结论词弹窗
      handleInputMarital: false, // 婚姻状态弹窗
      chooseRow: undefined,
      deleteChooseRow: undefined,
      checkedWord: [], // 选中结论词列表
      deleteWord: [], // 移除结论词列表
      str1: "",
      code1: "",
      medicalHistory: undefined,
      newTempArr: undefined,
      newTempStr: "",
      newTempCode: "",
      conditionTotal: [
        {
          sortindex: 1,
          // name: '条件1',
          detailitems: [
            {
              itemtype: 1,
              itemcode: "",
              itemname: "病史",
              judgesymbol: "",
              itemvalue: "",
              relation: "",
            },
            {
              itemtype: 6,
              itemcode: "",
              itemname: "结论词",
              judgesymbol: "",
              itemvalue: "",
              relation: "",
            },
          ], // 条件表格数据
        },
      ],
      newItemData: undefined,
      chooseList: undefined,
      publicConfig: undefined,
      itemDictionaryPage: 1,
      itemDictionarylimit: 50,
      itemDictionaryCount: 0,
      timer: "", // 防抖ID
      searchLoading: true, // 项目类型loading
    };
  },
  mounted() {
    this.handleMedicalHistory(); // 病史
    this.handleGetPublicConfig("CheckType"); // 检查类型
    this.handleGetPublicConfig("CalcRelation"); // 计算符号
    this.handleGetPublicConfig("Nation"); // 名族
    this.handleGetPublicConfig("Marriage"); // 婚否
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  watch: {
    dialogCondition(val) {
      console.log(val);
      if (val == false) {
        this.itemDictionaryPage = 1;
        this.checkproject = [];
      }
    },
  },
  methods: {
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
    // 添加条件
    handleAddCondition() {
      console.log(this.conditionTotal.length);
      let condition = {};
      if (this.conditionTotal.length <= 0) {
        condition = {
          sortindex: 1,
          detailitems: [],
        };
      } else if (this.conditionTotal.length > 0) {
        condition = {
          sortindex:
            this.conditionTotal[this.conditionTotal.length - 1].sortindex + 1,
          // name: '条件' + (this.conditionTotal[this.conditionTotal.length-1].sortindex +1),
          detailitems: [],
        };
      }
      this.conditionTotal.push(condition);
      console.log(this.conditionTotal);
    },
    // 删除条件
    handleDeleteCondition(id) {
      console.log(id, this.conditionTotal.indexOf(id));
      this.conditionTotal.splice(this.conditionTotal.indexOf(id), 1);
    },
    // 病史保存
    handlesavequestionnaire() {
      // name拼接
      this.newTempStr = "";
      this.newTempCode = "";
      for (let j = 0; j < this.newTempArr.length; j++) {
        this.newTempStr += this.newTempArr[j].hoyname + ",";
        this.newTempCode += this.newTempArr[j].hoycode + ",";
      }
      this.newTempStr = this.newTempStr.substring(
        0,
        this.newTempStr.length - 1
      );
      this.newTempCode = this.newTempCode.substring(
        0,
        this.newTempCode.length - 1
      );

      // code拼接
      // this.newTempCode = "";
      // for (let i = 0; i < this.newTempArr.length; i++) {
      //   this.newTempCode += this.newTempArr[i].hoycode + ",";
      // }
      // this.newTempCode = this.newTempCode.substring( 0, this.newTempCode.length - 1 );

      this.chooseRow.itemvalue = this.newTempCode;
      this.chooseRow.selectName = this.newTempStr;
      console.log(this.chooseRow);
      // this.$set(this.chooseRow, "itemvalue", this.newTempCode);

      this.surveyinformation = false;
    },
    // 病史勾选
    handlechangecheckbox(data) {
      let tempArr = [];
      this.medicalHistory.forEach((item) => {
        item.historyitems.forEach((k) => {
          data.forEach((item2) => {
            if (k.hoycode === item2) {
              tempArr.push({
                hoycode: k.hoycode,
                hoyname: k.hoyname,
              });
            }
          });
        });
      });
      this.newTempArr = tempArr;
      console.log(this.newTempArr);
    },
    // 病史
    handleMedicalHistory() {
      let data = {
        regid: 1000006197,
      };
      medicalHistory(data).then((res) => {
        // console.log(res);
        this.medicalHistory = res.result;
      });
    },
    // 结论词保存
    handelAddWord() {
      // name拼接
      this.str1 = "";
      this.code1 = "";
      for (let i = 0; i < this.conCludingWord2.length; i++) {
        this.str1 += this.conCludingWord2[i].name + ",";
        this.code1 += this.conCludingWord2[i].code + ",";
      }
      this.str1 = this.str1.substring(0, this.str1.length - 1);
      this.code1 = this.code1.substring(0, this.code1.length - 1);

      // code拼接
      // this.code1 = "";
      // for (let i = 0; i < this.conCludingWord2.length; i++) {
      //   this.code1 += this.conCludingWord2[i].code + ",";
      // }
      // this.code1 = this.code1.substring(0, this.code1.length - 1);
      console.log(this.chooseRow);
      this.chooseRow.itemvalue = this.code1;
      this.chooseRow.selectName = this.str1;
      // this.$set(this.chooseRow, "itemvalue", this.str1);
      this.concludingWord = false;
    },
    // 添加结论词btn
    handleShiftLeftWord() {
      this.conCludingWord2.push(...this.checkedWord);
      console.log("添加");
      // 添加后移除数据
      this.conCludingWord1.splice(
        this.conCludingWord1.indexOf(...this.checkedWord),
        this.checkedWord.length
      );
    },
    // 移除结论词btn
    handleShiftRightWord() {
      console.log("移除");
      this.conCludingWord1.push(...this.deleteWord);
      // 添加后删除数据
      this.conCludingWord2.splice(
        this.conCludingWord2.indexOf(...this.deleteWord),
        this.deleteWord.length
      );
    },
    // 搜索结论词
    handleSearchWord() {
      console.log("结论词搜索");
      this.loading = true;
      this.handleGetConCludingWordList();
    },
    // 左侧选中结论词
    handleLeftCheckedWord(row) {
      console.log(row, "结论词选中");
      this.checkedWord = row;
      // this.$refs.multipleTable.toggleRowSelection(row);
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
    // 右侧选中结论词
    handleRightCheckedWord(row) {
      console.log(row, "结论词选中");
      this.deleteWord = row;
    },
    handleClick(row, column) {
      // if (column.label === "项目") {
      //   this.handledialogCondition(row);
      // }
    },
    // 删除项目
    handleDeleteProject(key, data) {
      console.log(data);
      console.log(key);
      // this.deleteChooseRow = data.detailitems;
      data.detailitems.splice(data.detailitems.indexOf(key), 1);
    },
    // 添加项
    handleAddItem(data) {
      this.newItemData = data;
      let obj = {
        itemtype: 0,
        // itemcode: data.detailitems.length + 1,
        itemcode: "",
        itemname: "请选择",
        judgesymbol: "",
        itemvalue: "",
        relation: "",
      };
      data.detailitems.push(obj);
      console.log(data);
    },
    // 病史、结论词、检查小结
    handleClassification(data) {
      this.chooseRow = data;
      if (data.itemtype == 1) {
        // 病史
        if (data.itemvalue == "") {
          this.checkBoxKey = []; // 清空已选病史
        }
        this.surveyinformation = true;
        return;
      }
      if (data.itemtype == 6) {
        // 结论词
        if (data.itemvalue == "") {
          this.conCludingWord2 = []; // 清空已选结论词
        }
        this.concludingWord = true;
        this.handleGetConCludingWordList();
        return;
      } else {
        console.log(data, "填写");
      }
      // console.log(data, "病史、结论词、检查小结");
    },
    // 结论词列表
    handleGetConCludingWordList() {
      let data = {
        tp: "All",
        typeid: "",
        keyWord: this.searchConCludingWord,
      };
      getConCludingWordList(data).then((res) => {
        if (res.code == 200) {
          this.loading = false;
          this.conCludingWord1 = res.result;
        }
      });
    },
    // 双击更改项目
    handleDoubleClickProject(data) {
      console.log(data, "data");
      console.log(this.chooseList.detailitems.indexOf(this.chooseRow));
      if (
        data.itemname == "病史" ||
        data.itemname == "结论词" ||
        data.itemname == "检查小结"
      ) {
        this.newchoseRow = {
          itemtype: data.itemtype,
          itemcode: "",
          itemname: data.itemname,
          judgesymbol: "",
          itemvalue: "",
          relation: "",
        };
        console.log(this.newchoseRow, data.itemname, "病史,结论词,检查小结");
      } else {
        this.newchoseRow = {
          itemtype: 3,
          itemcode: data.code,
          itemname: data.name,
          judgesymbol: "",
          itemvalue: "",
          relation: "",
        };
        console.log(this.newchoseRow, data.itemname, "其他");
      }
      this.$set(
        this.chooseList.detailitems,
        this.chooseList.detailitems.indexOf(this.chooseRow),
        this.newchoseRow
      );
      this.handleDialogCondition();
    },
    // 关闭dialogCondition
    handleDialogCondition() {
      this.dialogCondition = false;
      // this.itemDictionaryPage = 1
      // this.checkproject = []
    },
    // 点击编辑条件
    handledialogCondition(key, data) {
      console.log(key, data);
      this.dialogCondition = true;
      this.chooseRow = key;
      this.chooseList = data;
      this.searchproject = ""; // 清空搜索key
      this.handleSearchItemDictionary();
      // this.itemDictionaryPage = 1 // 重置页码
      // this.checkproject = [] // 清空列表
      // this.handleGetItemDictionaryList(); // 加载项目类型列表
    },
    // 搜索项目类型列表
    handleSearchItemDictionary() {
      this.itemDictionaryPage = 1; // 重置页码
      this.checkproject = []; // 重置列表
      this.handleGetItemDictionaryList();
    },
    // 懒加载
    handleloadMore() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.checkproject.length >= this.itemDictionaryCount) return false;
        this.itemDictionaryPage++;
        this.handleGetItemDictionaryList();
      }, 200);
      console.log(this.timer, "懒加载");
    },
    // 项目类型列表
    handleGetItemDictionaryList() {
      this.searchLoading = true;
      let data = {
        page: this.itemDictionaryPage,
        limit: this.itemDictionarylimit,
        key: this.searchproject,
      };
      getItemDictionaryList(data).then((res) => {
        if (res.code == 200) {
          this.searchLoading = false;
          this.checkproject.push(...res.data);
          this.itemDictionaryCount = res.count;
        }
        console.log(res, data.page, this.checkproject.length);
      });
    },
    // 项目列表
    handleGetConclusionsList() {
      let data = {
        tp: "All",
        typeid: "",
        keyWord: "",
      };
      getConclusionsList(data).then((res) => {
        console.log(res);
      });
    },
    // 公共配置编码
    handleGetPublicConfig(cc) {
      getPublicConfig({ cc }).then((res) => {
        if (cc == "CheckType") {
          this.CheckType = res.result;
        } else if (cc == "CalcRelation") {
          this.CalcRelation = res.result;
        } else if (cc == "Nation") {
          this.Nation = res.result;
        } else if (cc == "Marriage") {
          this.Marriage = res.result;
        }
      });
    },
    // 保存分析
    handleDataStatics() {
      let age = "";
      let cost = "";
      // if (
      //   this.ruleForm.inputAgemin !== "" ||
      //   this.ruleForm.inputAgemax !== ""
      // ) {
      //   age = `${this.ruleForm.inputAgemin}-${this.ruleForm.inputAgemax}`;
      // } else {
      //   age = "";
      //   return console.log("年龄为空");
      // }
      // let cost = "";
      // if (this.cost.inputCostmin !== "" || this.cost.inputCostmax !== "") {
      //   cost = `${this.cost.inputCostmin}-${this.cost.inputCostmax}`;
      // } else {
      //   cost = "";
      //   return console.log("费用 为空");
      // }
      let arr = {
        startdate: this.valueTime[0],
        enddate: this.valueTime[1],
        checktype: this.checktype,
        age: age,
        marriage: this.marriage,
        nation: this.nation,
        cost: cost,
      };
      let whereitems = [];
      Object.keys(arr).forEach((k) => {
        whereitems.push({
          key: k,
          value: arr[k],
        });
      });

      let newArr = [];
      for (const index in this.conditionTotal) {
        let { detailitems, ...data1 } = this.conditionTotal[index];
        newArr.push(data1);
        newArr[index]["detailitems"] = [];
        for (const i in this.conditionTotal[index].detailitems) {
          let { selectName, ...data2 } =
            this.conditionTotal[index].detailitems[i];
          // data2.itemvalue = selectName;
          newArr[index]["detailitems"].push(data2);
        }
      }
      let otherwhereitems = newArr;
      // return false;
      let data = {
        whereitems,
        otherwhereitems,
      };
      dataStatics(data).then((res) => {
        if (!res.result) return;
        this.dataStatics = res.result;
        console.log(this.dataStatics);
      });
    },
    // 保存分析
    // handleSaveAnalyze() {
    //   this.handleDataStatics();
    // },
    // 条件类型
    handleSelectOption(data) {
      console.log(data);
    },
    // handleConditionTypeclick() {
    //   this.handleConditionType = false;
    //   this.checktype = this.checktype + "\n" + this.inputType2 + "\n";
    //   this.inputType2 = "";
    // },
    // 年龄
    // handleInputAgeclick() {
    //   this.handleInputAge = false;
    //   this.inputAge = this.inputAge + "\n" + this.inputAge2 + "\n";
    //   this.inputAge2 = "";
    // },
    // 基本信息
    handleCheckBox(key) {
      this.$nextTick(() => {
        //在数据加载完，重新渲染表格
        this.$refs["dataStatics"].doLayout();
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
    handleOnBtnClicked(domId) {
      switch (domId) {
        case "btnAnalyze": // 分析
          this.handleDataStatics();
          break;
        case "btnReset": // 重置
          break;
        case "btnPrint": // 打印
          break;
        case "btnExport": // 导出
          break;
        case "btnClose": // 关闭
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./css/index.scss";
</style>