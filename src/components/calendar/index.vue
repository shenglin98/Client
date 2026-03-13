<template>
  <div class="calendar">
    <el-drawer :show-close="false" :visible.sync="drawer" :wrapperClosable="false" :close-on-press-escape="false" direction="rtl" size="85%">
      <div :class="[showFormBox===true?'calendar-in':'calendar-ins']">
        <div class="calendar-in-iofn">
          <!-- 头部标题与按钮组 -->
          <div class="head_box">
            <div class="title">{{title}}</div>
            <div class="btn_group">
              <el-button type="primary" size="mini" plain icon="el-icon-check" @click="handleSubmitPage">确定</el-button>
              <el-button type="primary" size="mini" plain icon="el-icon-circle-close" @click="handleClosePage">关闭</el-button>
            </div>
          </div>
          <!-- 表单分配条件 -->
          <!-- <div class="form_box" v-if="showFormBox && pageflag">
            <div class="people">
              <div class="total">体检人数&nbsp;&nbsp;&nbsp;&nbsp;100人</div>
              <div class="man">男性&nbsp;&nbsp;&nbsp;&nbsp;65人</div>
              <div class="woman">女性&nbsp;&nbsp;&nbsp;&nbsp;35人</div>
            </div>
            <div class="mode mt">
              <div class="label">排期方式&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div class="radio_group">
                <el-radio-group v-model="mode">
                  <el-radio :label="3">日期平均分配</el-radio>
                  <el-radio :label="6">固定星期分配</el-radio>
                  <el-radio :label="9">自选日期分配</el-radio>
                </el-radio-group>
              </div>
              <div class="radio_control">
                <div class="days">
                  <div class="days_title">间隔天数&nbsp;&nbsp;</div>
                  <el-input size="mini" v-model="days" clearable></el-input>
                </div>
                <div class="weeks">
                  <el-checkbox-group v-model="weekCheck">
                    <el-checkbox label="周一"></el-checkbox>
                    <el-checkbox label="周二"></el-checkbox>
                    <el-checkbox label="周三"></el-checkbox>
                    <el-checkbox label="周四"></el-checkbox>
                    <el-checkbox label="周五"></el-checkbox>
                    <el-checkbox label="周六"></el-checkbox>
                    <el-checkbox label="周日"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div class="params">
              <div class="label">排期参数&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div class="date_box">
                <div class="start_date">
                  <div class="date_title">开始时间&nbsp;&nbsp;</div>
                  <el-date-picker size="mini" v-model="startTime" type="date" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="end_date">
                  <div class="date_title">结束时间&nbsp;&nbsp;</div>
                  <el-date-picker size="mini" v-model="endTime" type="date" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="assign">
                  <div class="assign_title">每天分配人数&nbsp;&nbsp;</div>
                  <el-input size="mini" clearable v-model="assignPersonnel"></el-input>
                </div>
              </div>
            </div>
            <div class="appointment-label">
              <span>预约日期&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span style="color: #606266;font-size: 12px;">
                选择【自选日期分配】方式,下方的日历可以多选,其他的方式只能查看
              </span>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 日历列表渲染 -->
      <div class="calendar_box">
        <!-- <div class="head">预约日历</div> -->
        <div class="weeks_box">
          <div class="mon">一</div>
          <div class="tue">二</div>
          <div class="wed">三</div>
          <div class="thu">四</div>
          <div class="fri">五</div>
          <div class="sat">六</div>
          <div class="sun">日</div>
        </div>
        <!-- 日历内容列表 -->
        <div class="calendar_list" :class="[showFormBox?'calendar_a':'calendar_m']">
          <!-- 空值占位符 -->
          <div class="empty_box" v-if="sortIndex > 0">
            <div class="calendar_item empty" v-for="item in sortIndex - 1" :key="item"></div>
          </div>
          <div class="calendar_item" v-for="(item,index) in calendarList" :key="index">
            <div class="item_head">{{item.title}}</div>
            <div :class="['item_content',{'item_content_select':activeIndex === `${index}_${i}`}]" v-for="(value,i) in item.contentitems" :key="value+i" @click="handleChooseTimeSlot(value,`${index}_${i}`,item)">
              <div class="content_item">{{value.contentkey}}</div>
              <div class="content_code">{{value.contentvalue}}</div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
// 引入日历接口数据
import { getTimeStatic } from "@/api/calendar.js";
export default {
  name: "",

  components: {},

  props: {
    makeFlag: {
      type: String,
      require: true,
    },
    makeNumber: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      title: "", // 抽屉标题
      drawer: false, // 抽屉显示控制
      pageflag: false,
      mode: "", // 排期方式
      days: "", // 间隔天数
      weekCheck: [], // 周几多选选中
      startTime: "", // 排期参数开始时间
      endTime: "", // 排期参数结束时间
      assignPersonnel: "", // 排期参数每天分配人员
      calendarList: [], // 日历列表渲染数据对象
      sortIndex: 0, // 日历列表第一天数据是星期几 起始渲染地点
      showFormBox: false, // 是否显示表单盒子
      activeIndex: "",
      chooseObj: undefined, // 选中数据回调
    };
  },

  mounted() {
    if (this.makeFlag == "auto") {
      // this.title = "体检预约-自动预约";
      this.title = "";
      this.showFormBox = true;
    } else {
      this.title = "体检预约-日历选择";
      this.showFormBox = false;
    }
    this.drawer = true; // 打开抽屉
    // 页面加载获取预约时间列表数据
    this.handleGetTimeStatic();
  },

  methods: {
    // 点击选择时间段
    handleChooseTimeSlot(value, index, item) {
      // 预约人数不能大于余号
      if (this.makeNumber > value.companycount + value.personcount) {
        this.$message.warning("当前时间段预约余号不足!");
        return false;
      }
      this.activeIndex = index;
      this.chooseObj = {
        selectdate: item.title,
        timeid: value.timeid,
      };
    },
    // 获取预约时间列表回调
    handleGetTimeStatic() {
      getTimeStatic().then((res) => {
        this.calendarList = res.result.dateitems;
        this.sortIndex = res.result.sortindex;
      });
    },
    // 抽屉提交回调
    handleSubmitPage() {
      console.log(this.chooseObj);
      if (!this.chooseObj) {
        this.$message.warning("请选择体检预约时间段!");
        return false;
      }
      this.$emit("submit", this.chooseObj); // 关闭子组件
    },
    // 抽屉关闭回调
    handleClosePage() {
      this.$emit("close", false); // 关闭子组件
    },
  },

  watch: {},

  computed: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>