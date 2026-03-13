<template>
  <!-- 收费明细弹出层 -->
  <el-dialog class="dialog-mini flow_path" width="70%" top="4%" :close-on-click-modal="false" title="登记流程" :visible.sync="showDialog" @close="handleCloseDialog">
    <!-- 基本信息 -->
    <div class="message">
      <div class="message-title">
        <div class="heads">
          <div class="heads-in"></div>
          <div>基本信息</div>
        </div>
        <div style="flex: 1"></div>
        <div class="">
          <el-button plain type="primary" icon="el-icon-close" size="mini" @click="handleCloseDialog">关闭</el-button>
        </div>
      </div>
      <div class="message_form">
        <el-form ref="flowPath" :model="flowPathObj" disabled v-if="flowPathObj" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item size="mini" label="档案号">
                <el-input v-model="flowPathObj.checkno"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="mini" label="姓名">
                <el-input v-model="flowPathObj.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="mini" label="性别">
                <el-input v-model="flowPathObj.sex"></el-input>
                <!-- <el-select v-model="flowPathObj.sex">
                  <el-option v-for="item in sexarr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="mini" label-width="50px" class="age" label="年龄">
                <el-input v-model="flowPathObj.age"></el-input>
                <!-- <el-input type="number" class="age_num" v-model.number="flowPathObj.age" :min="1" :max="150"></el-input>
                <el-select v-model="flowPathObj.ageunit" placeholder="" style="width:100px;"  class="agearr">
                  <el-option v-for="item in agearr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item size="mini" class="company" label="团检名称">
                <el-input v-model="flowPathObj.company"></el-input>
                <!-- <el-select v-model="flowPathObj.companyitems">
                  <el-option v-for="item in companyitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="mini" label="批次">
                <el-input v-model="flowPathObj.batch"></el-input>
                <!-- <el-select v-model="flowPathObj.batchitems">
                  <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="mini" label="团检分组">
                <el-input v-model="flowPathObj.group"></el-input>
                <!-- <el-select v-model="flowPathObj.groupitems">
                  <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 步骤条 -->
    <div class="steps">
      <div class="message-title">
        <div class="headss">
          <div class="heads-in"></div>
          <div>追踪信息</div>
        </div>
        <div style="flex: 1"></div>
      </div>
      <div class="steps_box">
        <el-steps direction="vertical" :active="1" :space="4">
          <el-step :title="item.processname" status="process" v-for="(item, index) in trackitems" :key="index">
            <template slot="description">
              <div class="content">
                <el-row :class="item.content ? 'content-in' : 'content-in'">
                  <el-col :span="5">
                    <div class="content_time">{{ item.processdate }}</div>
                  </el-col>
                  <el-col :span="5">
                    <div class="content_name">{{ item.explain }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="content_name">{{ item.operatorcode }}</div>
                  </el-col>
                  <el-col :span="5">
                    <div class="content_locale">{{ item.locale }}</div>
                  </el-col>
                  <el-col :span="5">
                    <div class="content_locale">IP：{{ item.ipAddress }}</div>
                  </el-col>
                </el-row>
                <el-row class="project" v-if="item.content">
                  <div>
                    {{ item.content }}
                  </div>
                </el-row>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getTrackDetail } from "@/api/flowPath.js"; // 引入接口文件
export default {
  name: "",

  components: {},
  props: {
    regid: {
      type: String,
      require: true,
    }, // 查询接口id
  },
  data() {
    return {
      showDialog: false, // 控制显示弹框
      flowPathObj: undefined, // 显示页面对象
      sexarr: [
        { code: 0, name: "未知" },
        { code: 1, name: "男" },
        { code: 2, name: "女" },
      ], // 性别选择
      agearr: [
        { code: "岁", name: "岁" },
        { code: "月", name: "月" },
        { code: "天", name: "天" },
      ], // 年龄单位
      companyitems: [], //  单位选择
      batchitems: [], //  批次选择
      groupitems: [], //  分组选择
      trackitems: [], // 步骤条数组
    };
  },

  mounted() {
    if (this.regid) {
      console.log(this.regid);
      this.handleGetTrackDetail(); // 页面加载请求数据
      this.showDialog = true; // 页面加载开启弹框
    }
  },

  methods: {
    //   获取页面渲染接口数据回调
    handleGetTrackDetail() {
      getTrackDetail({
        regid: this.regid,
      }).then((res) => {
        let data = res.result;
        this.flowPathObj = data;
        this.trackitems = data.trackitems;
        // 年龄单位列表 / 回显值
        this.flowPathObj.sex =
          this.flowPathObj.sex == 0
            ? "未知"
            : this.flowPathObj.sex == 1
            ? "男"
            : "女";
        this.flowPathObj.age = `${this.flowPathObj.age}岁`;
        let company = this.flowPathObj.companyitems.filter(
          (k) => k.selected
        )[0];
        company && (this.flowPathObj.company = company.name);
        let batch = this.flowPathObj.batchitems.filter((k) => k.selected)[0];
        batch && (this.flowPathObj.batch = batch.name);
        let group = this.flowPathObj.groupitems.filter((k) => k.selected)[0];
        group && (this.flowPathObj.group = group.name);
      });
    },
    //   关闭弹框回调
    handleCloseDialog() {
      this.showDialog = false;
      this.$emit("close", false);
    },
  },

  watch: {},

  computed: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>