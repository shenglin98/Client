<template>
  <div>
    <div class="main">
      <div class="head">
        <!-- 切换按钮 -->
        <div class="switchbtn">
          <el-radio-group
            v-model="pageSwitch"
            @change="handleRadioButton"
            size="small"
          >
            <el-radio-button
              v-for="(item, index) in typelist"
              :key="index"
              :label="item.titlecode"
              @change="handleRadioButtonGet(item)"
              >{{ item.titlename }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <!-- 功能按钮 -->
        <div class="btn_group">
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-success"
            @click="handleSavePage"
            >保存</el-button
          >
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-delete"
            @click="handleDeteleQuestion"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-close"
            @click="handleClosePage"
            >关闭</el-button
          >
        </div>
        <!-- 功能按钮 -->
        <!-- <sticky :className="'sub-navbar'">
          <div class="filter-container">
            <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="handleOnBtnClicked" index='1'></permission-btn>
          </div>
        </sticky> -->
      </div>

      <!-- 测试问卷 -->
      <div
        class="centent"
        v-for="item in typelist"
        :key="item.titlecode"
        v-show="pageSwitch == item.titlecode ? true : false"
      >
        <!-- 病史采集 -->
        <div v-if="item.titletype == 'MedicalHistory' ? true : false">
          <div class="card" v-for="item in medicalHistory" :key="item.syscode">
            <!-- 标题 -->
            <div class="title_head">
              <div class="logo"></div>
              <span>{{ item.sysname }}</span>
            </div>
            <!-- 内容 -->
            <div class="c_content">
              <div
                class="content_item content_items"
                :class="[
                  val.inputtype == 3 || val.inputtype == 4
                    ? 'content_input'
                    : '',
                ]"
                v-for="val in item.historyitems"
                :key="val.hoycode"
              >
                <el-checkbox
                  :label="val.hoyname"
                  v-if="[0, 2, 3, 4].indexOf(val.inputtype) !== -1"
                  v-model="val.flag"
                  :true-label="1"
                  :false-label="0"
                >
                  <span>{{ val.hoyname }}</span>
                  <el-input
                    v-model="val.remark"
                    :disabled="val.flag == 0"
                    v-if="[3, 4].indexOf(val.inputtype) !== -1"
                    placeholder="请输入内容"
                    size="mini"
                    clearable
                  ></el-input>
                </el-checkbox>
                <div class="" v-if="val.inputtype === 1">
                  {{ val.hoyname }}
                  <el-input
                    size="mini"
                    v-model="val.remark"
                    :disabled="val.editstatus == 1"
                    style="width: 150px"
                    clearable
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 问卷 -->
        <div v-if="item.titletype == 'Questionnaire' ? true : false">
          <div class="card" v-if="showMyInput">
            <!-- 标题 -->
            <div class="title_head">
              <div class="logo"></div>
              <h3>{{ item.titlename }}</h3>
            </div>
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
                          <!-- v-html="value.content.replaceAll('|X|',`1`)" -->
                          <!-- {{ value.content}} -->
                          <!-- 渲染出来的input的值 拼接存到remake的哦 格式  就是这种 2020|x|01 会不会很麻烦
                           -->
                          <!-- <span v-for="(day,index) in value.content" :key="index">{{day+'c'}}</span> -->
                          <template
                            v-for="(val, index) in value.content
                              .split('|X|')
                              .filter((v) => v)"
                          >
                            <myInput
                              v-if="showMyInput"
                              :suffix="val"
                              :disabled="val.editstatus == 1"
                              :count="
                                value.content.split('|X|').filter((v) => v)
                                  .length
                              "
                              :value.sync="value.remark"
                              :index="index"
                              :key="val"
                            />
                          </template>
                          <!--  -->
                          <!-- <input type="text" :ref="'input'" :data-sortIndex="index" :data-remark="value.remark" :key="index" @input="handleTest" />  -->
                          <!-- <template v-for="(val,index) in value.content.split('|X|').filter(v => v )">
                            <el-input size="mini" :ref="val" v-model="obj[index]" :key="index">
                              <template slot="append">{{val}}</template>
                            </el-input>
                          </template> -->
                          <!-- {{value.content.split('|X|').filter(v => v ).map( v => `<span>${v}</span>`)}} -->
                        </span>
                        <!-- <el-radio v-model="value.flag" v-if="[0,3].indexOf(value.inputtype) !== -1" :label="value.content" style="margin-right: 5px;">{{ value.content }}</el-radio> -->
                        <el-radio-group v-model="item.selectvalue">
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
                        <!-- <el-input v-if="[1,3,4].indexOf(value.inputtype) !== -1" size="mini" v-model="value.remark" :placeholder="value.content" style="width: 160px;"></el-input> -->
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
                        <!-- <el-checkbox-group v-model="checkList"> -->
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
                          <!-- <el-checkbox v-if="[2,4].indexOf(item.inputtype) !== -1" :label="item.content">{{ item.content }}</el-checkbox> -->
                          <!-- el-input item.content  -->
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
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import myInput from "./input";
import {
  questionnaireTitleList,
  medicalHistory,
  questionnaire,
  SaveMedicalHistory,
  SaveQuestionnaire,
  DeteleQuestion,
} from "@/api/surveyinformation.js";
export default {
  name: "",
  components: {
    Sticky,
    permissionBtn,
    myInput,
  },
  // watch: {
  //   questionnairelist: {
  //     handler(newVal) {
  //       console.log("--------");
  //       console.log(newVal);
  //     },
  //     deep: true,
  //   },
  // },
  data() {
    return {
      pageSwitch: "", //页面切换key
      checkList: [],
      checkList1: [], // 个人病史选择
      checkList2: [], // 家族病史选择
      physicalsymptoms: [], // 身体症状选择
      inputValue1: "",
      typelist: [], // 类型列表
      medicalHistory: [], // 病史
      questionnairelist: [], // 问卷
      sexradio: [],
      titletype: "", // 标题类型
      showMyInput: true,
    };
  },
  props: {
    regid: {
      type: String,
      require: true,
    },
  },
  mounted() {
    console.log(this.regid, "regid");
    // 类型列表
    this.handleQuestionnaireTitleList();
    // 病史
    this.handleMedicalHistory();
    // 健康问卷
    // this.handleQuestionnaire();
  },
  methods: {
    // 关闭按钮回调
    handleClosePage() {
      this.$emit("close");
    },
    // 保存按钮回调
    handleSavePage() {
      if (this.pageSwitch == "") {
        // 病史采集
        // 病史
        this.handleSaveMedicalHistory();
      } else {
        this.handleSaveQuestionnaire();
      }
    },
    // 病史采集或问卷调查保存回调
    handleDeteleQuestion() {
      DeteleQuestion({
        regid: this.regid,
        titletype: this.titletype,
        titlecode: this.pageSwitch,
      }).then((res) => {
        this.showMyInput = false;
        this.$nextTick(function () {
          this.showMyInput = true;
        });
        this.$message.success(res.message);
        if (this.pageSwitch == "") {
          // 病史采集
          this.handleMedicalHistory();
        } else {
          // 问卷调查
          this.handleQuestionnaire();
        }
      });
    },
    // 问卷调查保存回调
    handleSaveQuestionnaire() {
      SaveQuestionnaire({
        regid: this.regid,
        questionnaireitems: this.questionnairelist,
      }).then((res) => {
        this.$message.success(res.message);
      });
    },
    // 病史采集保存回调
    handleSaveMedicalHistory() {
      //   return;
      SaveMedicalHistory({
        regid: this.regid,
        bodysystemitems: this.medicalHistory,
      }).then((res) => {
        this.$message.success(res.message);
      });
    },
    // 获取值
    handleRadioButtonGet(item) {
      console.log(item, "item");
    },
    // 头部切换按钮
    handleRadioButton(key) {
      let flag = this.typelist.filter((k) => k.titlecode == key)[0];
      flag && (this.titletype = flag.titletype);
      this.pageSwitch = key;
      if (key == "") {
        // 病史采集
        this.handleMedicalHistory();
      } else {
        // 问卷调查
        this.handleQuestionnaire();
      }
    },
    // 病史采集
    handleChangeCheckBox(key) {
      console.log(key);
    },
    // 身体症状
    handleBodyCheckBox(key) {
      console.log(key);
    },
    // 类型列表
    handleQuestionnaireTitleList() {
      questionnaireTitleList().then((res) => {
        this.typelist = res.result;
        this.pageSwitch = res.result[0].titlecode;
        this.titletype = res.result[0].titletype;
      });
    },
    // 病史
    handleMedicalHistory() {
      let data = {
        regid: this.regid,
      };
      medicalHistory(data).then((res) => {
        this.medicalHistory = res.result;
        console.log(this.medicalHistory, "this.medicalHistory");
      });
    },
    // 问卷
    handleQuestionnaire() {
      let data = {
        regid: this.regid,
        titlecode: this.pageSwitch,
      };
      questionnaire(data).then((res) => {
        console.log("健康问卷", res.result);
        this.questionnairelist = res.result;
      });
    },
    // 功能按钮
    handleOnBtnClicked(domId) {
      switch (domId) {
        case "btnAdd": // 新增
          break;
        case "btnSave": // 保存
          if (this.pageSwitch == "") {
            // 病史采集
            // 病史
            this.handleSaveMedicalHistory();
          } else {
            this.handleSaveQuestionnaire();
          }
          break;
        case "btnDel": // 删除
          break;
        case "btnClose": // 关闭
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