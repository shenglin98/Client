<template>
  <div class="health_view">
    <!-- 头部信息盒子 -->
    <div class="head_box">
      <div class="head_bg">
        <div class="head">基本信息</div>
        <el-button
          type="primary"
          size="mini"
          plain
          icon="el-icon-close"
          @click="handleClosePage"
          >关 闭</el-button
        >
      </div>
      <div class="head_info">
        <div class="head_info_item">
          体检号：<span>{{ userInfo.regid }}</span>
        </div>
        <div class="head_info_item">
          姓名：<span>{{ userInfo.name }}</span>
        </div>
        <div class="head_info_item">
          年龄：<span>{{ userInfo.age }}岁</span>
        </div>
        <div class="head_info_item">
          民族：<span>{{ userInfo.nation || "暂无" }}</span>
        </div>
        <div class="head_info_item">
          联系电话：<span>{{ userInfo.telephone }}</span>
        </div>
        <div class="head_info_item">
          住址：<span>{{ userInfo.address }}</span>
        </div>
      </div>
    </div>
    <!-- 主体盒子 -->
    <div class="subject">
      <el-row>
        <el-col :span="7">
          <div class="subject_l">
            <div class="head_box_s">
              <div class="head">体检时间</div>
            </div>
            <div class="content">
              <div class="date_box">
                <el-tag
                  type="success"
                  size="medium"
                  v-for="(item, index) in checkListData"
                  :key="index"
                  >{{ item.regdate }}</el-tag
                >
              </div>
              <!-- 折叠表格-->
              <el-collapse v-model="activeNames">
                <el-collapse-item
                  :name="index"
                  v-for="(item, index) in checkListData"
                  :key="index"
                >
                  <template slot="title">
                    <span class="title_g">{{ item.regdate }}</span>
                    <span class="title_b">项目数：{{ item.combinecount }}</span>
                    <span class="title_r">费用(元)：{{ item.price }}</span>
                  </template>
                  <EasyTable
                    class="check_list"
                    height="100%"
                    :data="item.combineitems"
                    :tableOptions="checkListOptions"
                    :radio-config="{ rowClick: true }"
                    :border="false"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                    :row-style="{ height: '32px' }"
                    :cell-style="{ padding: '0' }"
                  />
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <div class="subject_r">
            <!-- 头部信息 -->
            <div class="subject_r_t">
              <el-row>
                <el-col :span="9">
                  <div class="subject_r_t_l">
                    <div class="jkqk">
                      <div class="head_box_s">
                        <div class="head">健康情况</div>
                      </div>
                      <div class="jkqk_content" v-if="healthySituation">
                        <div class="jkqk_item">
                          <div class="jkqk_item_head">
                            <img
                              src="./images/jwbs.png"
                              alt=""
                              draggable="false"
                            />
                            <div>既往病史</div>
                          </div>
                          <div class="jkqk_item_content">
                            {{ healthySituation.pastbs }}
                          </div>
                        </div>
                        <div class="jkqk_item">
                          <div class="jkqk_item_head">
                            <img
                              src="./images/jzbs.png"
                              alt=""
                              draggable="false"
                            />
                            <div>家族病史</div>
                          </div>
                          <div class="jkqk_item_content">
                            {{ healthySituation.familybs }}
                          </div>
                        </div>
                        <div class="jkqk_item">
                          <div class="jkqk_item_head">
                            <img
                              src="./images/shfs.png"
                              alt=""
                              draggable="false"
                            />
                            <div>生活方式</div>
                          </div>
                          <div class="jkqk_item_content">
                            {{ healthySituation.lifestyle }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="jbzd">
                      <div class="head_box_s">
                        <div class="head">疾病诊断</div>
                      </div>
                      <div class="jbzd_content">
                        <EasyTable
                          class="disease_table"
                          height="100%"
                          :data="diseaseData"
                          :tableOptions="diseaseOptions"
                          :radio-config="{ rowClick: true }"
                          :border="false"
                          :header-cell-style="handleReturnStyle"
                          :row-class-name="handleTableRowClassName"
                          :row-style="{ height: '32px' }"
                          :cell-style="{ padding: '0' }"
                        />
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="15">
                  <div class="subject_r_t_r">
                    <div class="head_box_s">
                      <div class="head">重要指标</div>
                    </div>
                    <div class="subject_r_t_r_content">
                      <EasyTable
                        class="indicator_table"
                        height="100%"
                        :data="indicatorData"
                        :tableOptions="indicatorOptions"
                        :radio-config="{ rowClick: true }"
                        :border="false"
                        :header-cell-style="handleReturnStyle"
                        :row-class-name="handleTableRowClassName"
                        :row-style="{ height: '32px' }"
                        :cell-style="{ padding: '0' }"
                      />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 底部图表盒子 -->
            <div class="subject_r_b">
              <div class="head_box_s">
                <div class="head">重要指标趋势</div>
              </div>
              <div
                class="subject_r_b_content"
                id="indicatorTrends"
                ref="indicatorTrends"
              >
                <div
                  class="chart_content"
                  :id="`chart${index}`"
                  v-for="(item, index) in chartList"
                  :key="index"
                ></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getPersonCheckList,
  getHealthInfo,
  getDiagnoseInfo,
  getImportantInfo,
} from "@/api/healthView.js";
export default {
  name: "",

  components: {},

  props: {
    userInfo: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      activeNames: 0, // 默认展开项
      checkListData: [], // 体检时间列表
      diseaseData: [], // 疾病诊断表格数据
      indicatorData: [], // 重要指标
      diseaseImg: require("./images/jbzd.png"),
      healthySituation: undefined, // 健康情况信息
      chartList: [], // 循环图表数组
    };
  },
  computed: {
    //   个人体检列表表格配置
    checkListOptions() {
      return [
        {
          title: "检查组合",
          prop: "combinename",
          omit: 1,
        },
        {
          title: "检查科室",
          prop: "deptname",
          omit: 1,
        },
      ];
    },
    // 疾病诊断表格配置
    diseaseOptions() {
      return [
        {
          title: "疾病诊断",
          prop: "wordname",
          omit: 1,
        },
        {
          title: "时间",
          omit: 1,
          //   returnVal: (value) => {
          //     return `<img src="./images/jwbs.png" alt="">${value}`;
          //   },
          render: (h, data) => {
            return (
              <div class="disease_time">
                <img src={this.diseaseImg} alt="" draggable="false" />
                <span>{data.inputdate}</span>
              </div>
            );
          },
        },
      ];
    },
    // 重要指标表格配置
    indicatorOptions() {
      return [
        {
          title: "指标",
          prop: "itemname",
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
          title: "参考值",
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
          title: "时间",
          prop: "resdate",
          width: 200,
          omit: 1,
        },
      ];
    },
  },

  mounted() {
    // 获取个人体检列表回调
    this.handleGetPersonCheckList();
    // 个人健康情况信息回调
    this.handleGetHealthInfo();
    // // 个人诊断信息回调
    this.handleGetDiagnoseInfo();
    // // 个人重要指标、指标趋势
    this.handleGetImportantInfo();
  },

  methods: {
    //   个人重要指标、指标趋势
    handleGetImportantInfo() {
      getImportantInfo({ checkno: this.userInfo.checkno }).then((res) => {
        this.indicatorData = res.result.resultitems;
        // 循环图表数据
        this.chartList = res.result.trenditems;
        if (this.chartList.length > 0) {
          this.$nextTick(() => {
            this.chartList.forEach((val, index) => {
              const myChart = this.$echarts.init(
                document.getElementById(`chart${index}`)
              );
              let colorArr = val.importantitems.map((k) => {
                return k.color;
              });
              let xAxisArr = [];
              let seriesArr = [];
              val.importantitems.forEach((k) => {
                if (k.valueitems.length > 0) {
                  seriesArr.push({
                    name: k.itemname,
                    type: "line",
                    stack: "Total",
                    data: k.valueitems.map((y) => {
                      return +y.yvalue;
                    }),
                  });
                }
                k.valueitems.forEach((x) => {
                  xAxisArr.push(x.xvalue);
                });
              });
              let option = {
                title: {
                  text: val.title,
                },
                tooltip: {
                  trigger: "axis",
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "3%",
                  containLabel: true,
                },
                color: colorArr,
                xAxis: {
                  type: "category",
                  boundaryGap: true,
                  data: xAxisArr,
                  axisTick: { alignWithLabel: true },
                  axisLine: { onZero: false },
                },
                yAxis: {
                  type: "value",
                },
                series: seriesArr,
              };
              myChart.setOption(option);
              window.addEventListener("resize", function () {
                myChart.resize();
              });
            });
          });
        }
      });
    },
    //   个人诊断信息回调
    handleGetDiagnoseInfo() {
      getDiagnoseInfo({ checkno: this.userInfo.checkno }).then((res) => {
        this.diseaseData = res.result;
      });
    },
    //   个人健康情况信息回调
    handleGetHealthInfo() {
      getHealthInfo({ checkno: this.userInfo.checkno }).then((res) => {
        this.healthySituation = res.result;
      });
    },
    // 获取个人体检列表回调
    handleGetPersonCheckList() {
      getPersonCheckList({ checkno: this.userInfo.checkno }).then((res) => {
        this.checkListData = res.result;
      });
    },
    // 关闭页面回调
    handleClosePage() {
      this.$emit("close", false);
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
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>