<template>
  <div class="checkup_cockpit">
    <div class="bg">
      <div class="main_tjbox">
        <el-row>
          <el-col :span="7">
            <div class="grid-content bg-purple-dark">
              <!-- 主体左侧 -->
              <div class="main_left">
                <!-- 当日信息 -->
                <div class="td_message">
                  <!-- 一级标题 -->
                  <div class="level_one_title">
                    <span>当日信息</span>
                  </div>
                  <div class="td_message_content">
                    <!-- 当日业务 -->
                    <div class="td_business">
                      <!-- 二级标题 -->
                      <div class="level_two_title">
                        <div class="title_logo"></div>
                        <span>当日业务</span>
                      </div>
                      <div class="td_business_form">
                        <div class="td_business_content">
                          <div class="title_logo"></div>
                          <span>预约</span>
                          <span>{{ td_business.appointmentCount }}</span>
                        </div>

                        <div class="td_business_content">
                          <div class="title_logo"></div>
                          <span>签到</span>
                          <span>{{ td_business.signCount }}</span>
                        </div>

                        <div class="td_business_content">
                          <div class="title_logo"></div>
                          <span>检中</span>
                          <span>{{ td_business.physicalCount }}</span>
                        </div>

                        <div class="td_business_content">
                          <div class="title_logo"></div>
                          <span>交表</span>
                          <span>{{ td_business.deliveryCount }}</span>
                        </div>

                        <div class="td_business_content">
                          <div class="title_logo"></div>
                          <span>登记</span>
                          <span>{{ td_business.registerCount }}</span>
                        </div>
                      </div>

                      <div class="td_business_form">
                        <div class="td_business_total">
                          <div class="total_bg">
                            <span>总数</span>
                            <span>{{ td_business.sumCount }}</span>
                          </div>
                        </div>

                        <div class="td_business_total_right">
                          <div class="td_business_content">
                            <div class="title_logo"></div>
                            <span>个检</span>
                            <span>{{ td_business.personalCheckCount }}</span>
                          </div>

                          <div class="td_business_content">
                            <div class="title_logo"></div>
                            <span>团检</span>
                            <span>{{ td_business.companyCheckCount }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 当日收入 -->
                    <div class="td_income">
                      <!-- 二级标题 -->
                      <div class="level_two_title">
                        <div class="title_logo"></div>
                        <span>当日收入</span>
                      </div>

                      <div class="td_income_data">
                        <div class="td_income_data_content">
                          <el-avatar> 当日 </el-avatar>
                          <!-- <div class="data_content_img"></div> -->
                          <div class="data_content_text">
                            <span>当日收入</span>
                            <span>{{ td_income.ondayincomecount || 0 }}</span>
                          </div>
                        </div>
                        <div class="td_income_data_content">
                          <el-avatar> 线上 </el-avatar>
                          <div class="data_content_text">
                            <span>线上收入</span>
                            <span>{{ td_income.onlineincomecount || 0 }}</span>
                          </div>
                        </div>

                        <div class="td_income_data_content">
                          <el-avatar> 线下 </el-avatar>
                          <div class="data_content_text">
                            <span>线下收入</span>
                            <span>{{
                              td_income.offlinerevenuecount || 0
                            }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="td_income_form">
                        <div id="td_income_example"></div>
                      </div>
                    </div>

                    <!-- 当日团检 -->
                    <div class="td_groupcheck">
                      <!-- 二级标题 -->
                      <div class="level_two_title">
                        <div class="title_logo"></div>
                        <span>当日团检</span>
                      </div>
                      <div class="td_groupcheck_form">
                        <el-table
                          :data="tableData"
                          height="150"
                          style="width: 100%"
                          :cell-style="gc_Style"
                          :header-cell-style="tableHeaderCellStyle"
                        >
                          <el-table-column prop="companyname" label="团检名称">
                          </el-table-column>
                          <el-table-column
                            prop="count"
                            label="体检人数"
                            width="90px"
                          >
                          </el-table-column>
                          <el-table-column
                            prop="proportion"
                            label="占比"
                            width="60px"
                          >
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>

                    <!-- 本周团检 -->
                    <div class="tw_groupcheck">
                      <!-- 二级标题 -->
                      <div class="level_two_title">
                        <div class="title_logo"></div>
                        <span>本周团检</span>
                      </div>
                      <div class="tw_groupcheck_form">
                        <el-table
                          :data="twtableData"
                          height="100%"
                          style="width: 100%"
                          :cell-style="gc_Style"
                          :header-cell-style="tableHeaderCellStyle"
                        >
                          <el-table-column prop="companyname" label="团检名称">
                          </el-table-column>
                          <el-table-column
                            prop="count"
                            label="体检人数"
                            width="90px"
                          >
                          </el-table-column>
                          <el-table-column
                            prop="proportion"
                            label="占比"
                            width="60px"
                          >
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="17">
            <!-- 主体右侧 -->
            <div class="main_right">
              <el-row>
                <el-col :span="14">
                  <!-- 检查信息 -->
                  <div class="check_message">
                    <!-- 一级标题 -->
                    <div class="level_one_title">
                      <span>检查信息</span>
                    </div>
                    <div class="check_message_content">
                      <!-- 检查诊室 -->
                      <div class="check_cr">
                        <div class="level_two_title">
                          <div class="title_logo"></div>
                          <span>检查诊室</span>
                        </div>
                        <div class="check_cr_form">
                          <el-table
                            :data="check_consultation_room"
                            style="width: 100%"
                            height="300"
                            :cell-style="gc_Style"
                            :header-cell-style="tableHeaderCellStyle"
                          >
                            <el-table-column prop="deptname" label="诊室">
                            </el-table-column>
                            <el-table-column prop="queuecount" label="排队人数">
                            </el-table-column>
                            <el-table-column
                              prop="undetectedcount"
                              label="未检人数"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="completecount"
                              label="完成人数"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="percapitatimeconsuming"
                              label="人均耗时"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="hourscheckedcount"
                              label="小时可检人数"
                            >
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>

                      <!-- 体检TAT -->
                      <div class="ck_tat">
                        <div class="level_two_title">
                          <div class="title_logo"></div>
                          <span>体检TAT</span>
                        </div>
                        <div class="ck_tat_form">
                          <div id="ck_tat_example"></div>
                        </div>
                      </div>

                      <!-- 检查医生 -->
                      <div class="ck_doctor">
                        <div class="level_two_title">
                          <div class="title_logo"></div>
                          <span>检查医生</span>
                        </div>
                        <div class="ck_doctor_form">
                          <el-table
                            :data="tableDatas"
                            height="260"
                            :span-method="arraySpanMethod"
                            :cell-style="ck_DoctorStyle"
                            :header-cell-style="tableHeaderCellStyle"
                            style="width: 100%"
                          >
                            <el-table-column prop="deptname" label="科室">
                            </el-table-column>
                            <el-table-column prop="doctorname" label="医生">
                            </el-table-column>
                            <el-table-column prop="checkcount" label="检查人数">
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="10">
                  <!-- 提醒信息 -->
                  <div class="remind_message">
                    <!-- 一级标题 -->
                    <div class="level_one_title">
                      <span>提醒信息</span>
                    </div>
                    <div class="remind_message_content">
                      <!-- 危急值提醒 -->
                      <div class="risk_remind">
                        <!-- 二级标题 -->
                        <div class="level_two_title">
                          <div class="title_logo"></div>
                          <span>危急值提醒</span>
                        </div>
                        <div class="risk_remind_form">
                          <el-table
                            :data="risk_remind"
                            height="400"
                            style="width: 100%"
                            :cell-style="gc_Style"
                            :header-cell-style="tableHeaderCellStyle"
                            :row-style="{ height: '32px' }"
                          >
                            <el-table-column prop="name" label="姓名">
                            </el-table-column>
                            <el-table-column prop="companyname" label="团检">
                            </el-table-column>
                            <el-table-column prop="wordname" label="危急值">
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                      <!-- 体检TAT提醒 -->
                      <div class="tat_remind">
                        <!-- 二级标题 -->
                        <div class="level_two_title">
                          <div class="title_logo"></div>
                          <span>体检TAT提醒</span>
                        </div>
                        <div class="tat_remind_form">
                          <el-table
                            :data="tat_remind"
                            height="400"
                            style="width: 100%"
                            :cell-style="gc_Style"
                            :header-cell-style="tableHeaderCellStyle"
                            :row-style="{ height: '32px' }"
                          >
                            <el-table-column prop="name" label="姓名">
                            </el-table-column>
                            <el-table-column prop="companyname" label="团检">
                            </el-table-column>
                            <el-table-column prop="tat" label="TAT">
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <!-- 360监控 -->
                  <div class="monitor">
                    <!-- 二级标题 -->
                    <div class="level_two_title">
                      <div class="title_logo"></div>
                      <span>360监控</span>
                    </div>
                    <div class="monitor_img">
                      <img :src="monitorImg" />
                      <!-- <img src="images/monitor.png" > -->
                    </div>
                    <div style="height: 10px"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import {
  td_business,
  td_income,
  td_groupcheck,
  tw_groupcheck,
  risk_remind,
  check_cr,
  ck_tat,
  ck_doctor,
  tat_remind,
} from "@/api/checkupcockpit.js";
export default {
  name: "checkupcockpit",
  components: {},

  data() {
    return {
      monitorImg: require("./images/monitor.png"),
      // 当日业务
      td_business: {},
      // 当日收入
      td_income: {},
      dates: [],
      incomes: [],
      // 当日团检
      tableData: [],
      // 本周团检
      twtableData: [],
      // 检查诊室
      check_consultation_room: [],
      // 体检TAT
      tat_dates: [],
      tat_count: [],
      // 检查医生
      ck_doctor: [
        {
          deptname: "外科",
          doctorlist: [
            {
              doctorname: "陈医生",
              checkcount: 2,
            },
            {
              doctorname: "林医生",
              checkcount: 2,
            },
            {
              doctorname: "王医生",
              checkcount: 2,
            },
          ],
        },
        {
          deptname: "内科",
          doctorlist: [
            {
              doctorname: "陈医生",
              checkcount: 2,
            },
            {
              doctorname: "林医生",
              checkcount: 2,
            },
            {
              doctorname: "王医生",
              checkcount: 2,
            },
            {
              doctorname: "黄医生",
              checkcount: 2,
            },
          ],
        },
        {
          deptname: "B超",
          doctorlist: [
            {
              doctorname: "陈医生",
              checkcount: 2,
            },
          ],
        },
        {
          deptname: "一般检查",
          doctorlist: [
            {
              doctorname: "陈医生",
              checkcount: 2,
            },
          ],
        },
        {
          deptname: "妇科",
          doctorlist: [
            {
              doctorname: "陈医生",
              checkcount: 2,
            },
          ],
        },
        {
          deptname: "眼科",
          doctorlist: [
            {
              doctorname: "陈医生",
              checkcount: 2,
            },
          ],
        },
      ],

      // 危急值提醒
      risk_remind: [],
      // 体检TAT提醒
      tat_remind: [],
      tableDatas: [],
    };
  },

  mounted() {
    // 当日业务
    td_business().then((res) => {
      this.td_business = res.result;
    });
    // 当日收入
    td_income().then((res) => {
      this.td_income = res.result;
      // 获取日期
      this.dates = res.result.echartsitems.map(
        (echartsitem) => echartsitem.date
      );
      // 获取数据
      this.incomes = res.result.echartsitems.map(
        (echartsitem) => echartsitem.income
      );
      // echarts
      let myChart = echarts.init(document.getElementById("td_income_example"));
      let option = {
        color: ["#f44"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dates,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.incomes,
            type: "line",
            areaStyle: {},
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    });

    // 当日团检
    td_groupcheck().then((res) => {
      this.tableData = res.result;
    });

    // 本周团检
    tw_groupcheck().then((res) => {
      this.twtableData = res.result;
    });

    // 危急值提醒
    risk_remind().then((res) => {
      this.risk_remind = res.result;
    });

    // 检查诊室
    check_cr().then((res) => {
      this.check_consultation_room = res.result;
    });

    // 检查TAT
    ck_tat().then((res) => {
      // 获取日期
      this.tat_dates = res.result.map((i) => i.date);
      // 获取数据
      this.tat_count = res.result.map((i) => i.count);
      // echarts
      let myChart2 = echarts.init(document.getElementById("ck_tat_example"));
      let option2 = {
        color: ["#f44"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "9月20日",
            "9月21日",
            "9月22日",
            "9月23日",
            "9月24日",
            "9月25日",
            "9月26日",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.tat_count,
            type: "line",
            areaStyle: {},
          },
        ],
      };
      myChart2.setOption(option2);
      window.addEventListener("resize", function () {
        myChart2.resize();
      });
    });

    //检查医生
    ck_doctor().then((res) => {
      console.log(res, "检查医生");
      this.tableDatas = res.result;
      let arr = [];
      var k = 0;
      for (let i in this.tableDatas) {
        for (let j in this.tableDatas[i].doctorlist) {
          k++;
          arr.push({
            deptname: this.tableDatas[i].deptname,
            doctorname: this.tableDatas[i].doctorlist[j].doctorname,
            checkcount: this.tableDatas[i].doctorlist[j].checkcount,
            start: k,
            end: this.tableDatas[i].doctorlist.length,
          });
        }
      }
      this.tableDatas = arr;

      // console.log(arr.length/2-1);
    });

    // 检查TAT提醒
    tat_remind().then((res) => {
      this.tat_remind = res.result;
    });
  },

  methods: {
    // 表格样式
    gc_Style({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return "background:	#fff1cb;";
      } else {
        return "background:	#edf0f9;";
      }
    },
    tableHeaderCellStyle() {
      return { border: "none" };
    },
    // 检查医生样式
    ck_DoctorStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return "background:	#fff1cb;";
      } else {
        return "background:	#edf0f9;";
      }
    },
    // 检查医生合并
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % row.end === 0) {
          return {
            rowspan: row.end,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },

  watch: {},

  computed: {},
};
</script>
<style lang='scss' scoped>
@media screen and (max-width: 1980px) {
  .bg {
    // width: 1734px !important;
    height: 1474px !important;
  }
}

@media screen and (max-width: 1610px) {
  .bg {
    // width: 1334px !important;
    height: 1274px !important;
  }
}

@media screen and (max-width: 1310px) {
  .bg {
    // width: 934px !important;
    height: 1074px !important;
  }
}

@media screen and (max-width: 1010px) {
  .bg {
    // width: 934px !important;
    height: 874px !important;
  }
}

@media screen and (max-width: 940px) {
  .bg {
    // width: 934px !important;
    height: 674px !important;
  }
}
@import "./css/index.scss";
.tw_groupcheck_form {
  height: calc(100% - 40px) !important;
}
</style>
