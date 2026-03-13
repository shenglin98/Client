<template>
  <div class="income">
    <!-- 体检进度 -->
    <div class="check_schedule mt2">
      <!-- 头部标题 -->
      <div class="head">
        <div class="title">体检进度</div>
      </div>
      <!-- 主体扇形图 -->
      <div class="check_body">
        <div class="chart_box">
          <div class="check_item total">
            <img :src="imgTotal" :draggable="false" alt="" />
            <div class="num_box">
              <!-- <countTo class="subscribe" :startVal='0' :endVal='480000' :duration="2000" /> -->
              <countTo
                class="subscribe"
                :startVal="0"
                :endVal="totalPeople"
                :duration="2000"
              />
              <div class="text">人数</div>
            </div>
          </div>
          <!-- 输入总额 -->
          <div class="check_item total total_price">
            <img :src="imgTotalS" :draggable="false" alt="" />
            <div class="num_box">
              <countTo
                class="subscribe"
                :startVal="0"
                :endVal="incomeamount"
                :duration="2000"
              />
              <div class="text">收入（元）</div>
            </div>
          </div>
          <!-- 收入概况信息（个人比率统计） -->
          <div class="check_item bg2 gender">
            <div class="inspect_top">
              <div class="percentage">
                <!-- <div class="p_top" v-if="personincreaserate != 0">
                  <div class="p_icon" v-if="personincreaserate > 0">↑</div>
                  <div class="p_icon" v-if="personincreaserate < 0">↓</div>
                  <div class="p_text" v-if="personincreaserate > 0">
                    {{ Math.abs(personincreaserate) }}%
                  </div>
                  <div class="p_text" v-if="personincreaserate < 0">
                    {{ Math.abs(personincreaserate) }}%
                  </div>
                </div> -->
                <div class="p_bom">个检 {{ personrate }}%</div>
              </div>
              <div
                id="businessChart"
                ref="businessChart"
                class="businessChart"
              ></div>
              <div class="percentage">
                <!-- <div class="p_top" v-if="companyincreaserate != 0">
                  <div class="p_icon" v-if="companyincreaserate > 0">↑</div>
                  <div class="p_icon" v-if="companyincreaserate < 0">↓</div>
                  <div class="p_text" v-if="companyincreaserate > 0">
                    {{ Math.abs(companyincreaserate) }}%
                  </div>
                  <div class="p_text" v-if="companyincreaserate < 0">
                    {{ Math.abs(companyincreaserate) }}%
                  </div>
                </div> -->
                <div class="p_bom">团检 {{ companyrate }}%</div>
              </div>
            </div>
            <div class="inspect_bottom">
              <div class="ib_l">
                <span class="text">个检</span>
                <countTo
                  class="ib_l_num"
                  :startVal="0"
                  :endVal="personincome"
                  :duration="2000"
                />
                <span class="text">元</span>
              </div>
              <div class="ib_r">
                <span class="text">团检</span>
                <countTo
                  class="ib_r_num"
                  :startVal="0"
                  :endVal="companyincome"
                  :duration="2000"
                />
                <span class="text">元</span>
              </div>
            </div>
          </div>
          <!-- 性别图表 -->
          <div class="check_item bg2 marriage">
            <div class="inspect_top">
              <div class="percentage">
                <!-- <div class="p_top" v-if="manrate != 0">
                  <div class="p_icon" v-if="manrate > 0">↑</div>
                  <div class="p_icon" v-if="manrate < 0">↓</div>
                  <div class="p_text" v-if="manrate > 0">
                    {{ Math.abs(manrate) }}%
                  </div>
                  <div class="p_text" v-if="manrate < 0">
                    {{ Math.abs(manrate) }}%
                  </div>
                </div> -->
                <div class="p_bom">男性 {{ manrate }}%</div>
              </div>
              <div id="genderChart" ref="genderChart" class="genderChart"></div>
              <div class="percentage">
                <!-- <div class="p_top" v-if="womanrate != 0">
                  <div class="p_icon" v-if="womanrate > 0">↑</div>
                  <div class="p_icon" v-if="womanrate < 0">↓</div>
                  <div class="p_text" v-if="womanrate > 0">
                    {{ Math.abs(womanrate) }}%
                  </div>
                  <div class="p_text" v-if="womanrate < 0">
                    {{ Math.abs(womanrate) }}%
                  </div>
                </div> -->
                <div class="p_bom">女性 {{ womanrate }}%</div>
              </div>
            </div>
            <div class="inspect_bottom">
              <div class="ib_l">
                <span class="text">男性</span>
                <countTo
                  class="ib_l_num"
                  :startVal="0"
                  :endVal="manincome"
                  :duration="2000"
                />
                <span class="text">元</span>
              </div>
              <div class="ib_r">
                <span class="text">女性</span>
                <countTo
                  class="ib_r_num"
                  :startVal="0"
                  :endVal="womanincome"
                  :duration="2000"
                />
                <span class="text">元</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 内容描述 -->
        <div class="content_text" v-if="content">
          <span v-html="content"></span>
        </div>
      </div>
    </div>
    <!-- 主体柱状图 -->
    <div class="columnar mt2">
      <!-- 年度对比 -->
      <div class="year_ratio">
        <!-- 头部标题 -->
        <div class="head">
          <div class="title">年度对比（单位：万元）</div>
        </div>
        <!-- 年度柱状图 -->
        <div id="yearChart" ref="yearChart" class="yearChart"></div>
      </div>
      <!-- 团检费用TOP10 -->
      <div class="age_spread">
        <!-- 头部标题 -->
        <div class="head">
          <div class="title">团检费用TOP10</div>
        </div>
        <!-- 年度柱状图 -->
        <div id="ageChart" ref="ageChart" class="ageChart"></div>
      </div>
    </div>
    <!-- 主体柱状图 -->
    <div class="columnar mt2">
      <!-- 月度对比 -->
      <div class="month_ratio">
        <!-- 头部标题 -->
        <div class="head">
          <div class="title">月度对比</div>
        </div>
        <!-- 月度柱状图 -->
        <div id="monthChart" ref="monthChart" class="monthChart"></div>
      </div>
      <!-- 检查分布 -->
      <div class="check_spread">
        <!-- 头部标题 -->
        <div class="head">
          <div class="title">费用占比</div>
        </div>
        <!-- 图标盒子 -->
        <div class="chart_box">
          <!-- 团检企业占比 -->
          <div class="group_check">
            <div class="c_title">科室检查分布</div>
            <div class="chart_bg">
              <!-- 团检企业占比饼状图 -->
              <div
                id="groupCheckChart"
                ref="groupCheckChart"
                class="groupCheckChart"
              ></div>
            </div>
          </div>
          <!-- 体检类型分布 -->
          <div class="type_check">
            <div class="c_title">体检费用分布</div>
            <div class="chart_bg">
              <!-- 体检类型分布饼状图 -->
              <div
                id="typeCheckChart"
                ref="typeCheckChart"
                class="typeCheckChart"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from "vue-count-to"; // 引入计数组件
import {
  getInfoForPerson,
  getInfoForIncome,
  getInfoForPersonRate,
  getInfoForSexRate,
  getInfoForYearCompare,
  getInfoForMonthCompare,
  getInfoForCompanyCostSort,
  getInfoForDepartRate,
  getInfoForCostRange,
} from "@/api/makepolicy.js";
export default {
  name: "",

  components: { countTo },

  props: {
    searchDate: {
      type: Array,
      require: true,
    },
  },

  data() {
    return {
      // searchDate: ["2021-01-01", "2021-12-31"],
      imgTotal: require("../images/total_p.png"),
      imgTotalS: require("../images/total_s.png"),
      isInterface: false, // 是否允许请求接口
      businessOption: {
        title: {
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "检查",
            type: "pie",
            // radius: "85%",
            radius: ["0%", "85%"],
            color: ["#30adc6", "#efc30f"],
            data: [
              { value: 700, name: "团检" },
              { value: 300, name: "个检" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      }, // 企业个人图表
      genderOption: {
        title: {
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "检查",
            type: "pie",
            // radius: "85%",
            radius: ["0%", "85%"],
            color: ["#efc30f", "#85b827"],
            data: [
              { value: 300, name: "女性" },
              { value: 700, name: "男性" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      }, // 性别图表
      yearOption: {
        title: {
          // text: "年度体检人数",
          // x: "center",
          // y: "20px",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["个检", "团检"],
          // x: "center", //可设定图例在左、右、居中
          // y: "bottom", //可设定图例在上、下、居中
          orient: "horizontal",
          left: "center",
          top: "bottom",
          // padding: [0, 0, -10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        color: ["#30adc6", "#efc30f"],
        series: [
          {
            name: "个检",
            type: "bar",
            stack: "Ad",
            barWidth: 50, //柱图宽度
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "团检",
            type: "bar",
            stack: "Ad",
            barWidth: 50, //柱图宽度
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      }, // 年度对比
      ageOption: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          data: ["人数", "金额"],
          // x: "center", //可设定图例在左、右、居中
          orient: "horizontal",
          left: "center",
          top: 20,
          // padding: [0, 0, -10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLabel: { show: false }, //显示x轴的数值
        },
        yAxis: {
          type: "category",
          data: [
            "广州市城市规划局",
            "海事航空",
            "广州市城市规划局",
            "海事航空",
            "广州市城市规划局",
            "海事航空",
            "广州市城市规划局",
          ],
        },
        series: [
          {
            name: "人数",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [320, 302, 301, 334, 390, 330, 320],
          },
          {
            name: "金额",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
        ],
      }, // 团检费用TOP10
      monthOption: {
        title: {
          // text: "月度体检人数对比",
          // x: "center",
          // y: "20px",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["个检", "团检"],
          // x: "center", //可设定图例在左、右、居中
          // y: "bottom", //可设定图例在上、下、居中
          orient: "horizontal",
          left: "center",
          top: "bottom",
          // padding: [0, 0, -10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [
            "2017年一月",
            "2018年一月",
            "2019年一月",
            "2020年一月",
            "2021年一月",
          ],
          axisLabel: {
            interval: 0,
            rotate: 40,
          },
        },
        yAxis: {
          type: "value",
        },
        color: ["#85b827", "#d33e23"],
        series: [
          {
            name: "个检",
            type: "bar",
            barWidth: 25, //柱图宽度
            data: [],
          },
          {
            name: "团检",
            type: "bar",
            barWidth: 25, //柱图宽度
            data: [],
          },
        ],
      }, // 月度对比
      groupCheckOption: {
        title: {},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "占比",
            type: "pie",
            radius: "50%",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            data: [
              { value: 1048, name: "私营企业" },
              { value: 735, name: "其他" },
              { value: 580, name: "国有企业" },
              { value: 484, name: "国家行政机关" },
              { value: 300, name: "外资企业" },
              { value: 300, name: "合资企业" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}({d}%)",
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      }, // 团检企业占比
      typeCheckOption: {
        title: {
          text: "体检人次(%)",
          x: "left",
          y: "20px",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [
            "2017年一月",
            "2018年一月",
            "2019年一月",
            "2020年一月",
            "2021年一月",
          ],
          axisLabel: {
            interval: 0,
            rotate: 40,
          },
        },
        yAxis: {
          type: "value",
        },
        color: ["#efc30f"],
        series: [
          {
            name: "人数",
            type: "bar",
            barWidth: 25, //柱图宽度
            data: [],
          },
        ],
      }, // 体检类型分布
      totalPeople: 0, // 总数
      content: "", // 内容描述
      incomeamount: 0, // 收入总额
      personincome: 0, // 个人收入（单位万元，数据不需要处理）
      companyincome: 0, // 公司收入（单位万元，数据不需要处理）
      personrate: 0, // 个人比率（百分比，需要加%）
      companyrate: 0, // 公司比率（百分比，需要加%）
      personincreaserate: 0, // 个人增长率
      companyincreaserate: 0, // 公司增长率
      manincome: 0, // 男性收入（单位万元，数据不需要处理）
      womanincome: 0, // 女性收入（单位万元，数据不需要处理）
      manrate: 0, // 男性比率（百分比，需要加%）
      womanrate: 0, // 女性比率（百分比，需要加%）
      manincreaserate: 0, // 男性增长率（百分比，需要加%）
      womanincreaserate: 0, // 女性增长率（百分比，需要加%）
      year: [],
      inspect: {}, // 检查图表数据对象
      group: true,
      groupUp: "", // 团检↑
      groupDown: "", // 团检↓
      personal: true,
      personalUp: "", // 个检↑
      personalDown: "", // 个检↓
      man: true,
      manUp: "", // 男性↑
      manDown: "", // 男性↓
      woman: true,
      womanUp: "", // 女性↑
      womanDown: "", // 女性↓
      married: true,
      marriedUp: "", // 已婚↑
      marriedDown: "", // 已婚↓
      single: true,
      singleUp: "", // 未婚↑
      singleDown: "", // 未婚↓
    };
  },

  mounted() {
    // 页面加载获取收入概况信息回调
    this.handleGetInfoForPerson();
  },

  methods: {
    // 收入概况信息（人数统计）
    handleGetInfoForPerson() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForPerson({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.isInterface = true;
        this.totalPeople = res.result.count;
        this.content = res.result.content;
        if (this.content) {
          let increaserate = `&nbsp;&nbsp;<div class="content_red" style="color: #F34C1F;font-size: 26px;">${res.result.increaserate}%</div>`;
          let estimatecount = `&nbsp;&nbsp;<div class="content_blue" style="color: #2A87E6;font-size: 26px;">${res.result.estimatecount}</div>`;
          this.content = this.content.replace("@increaserate", increaserate);
          this.content = this.content.replace("@estimatetotal", estimatecount);
        }
      });
    },
    // 收入概况信息（收入统计）
    handleGetInfoForIncome() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForIncome({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.incomeamount = res.result.incomeamount;
      });
    },
    // 收入概况信息（个人比率统计）
    handleGetInfoForPersonRate() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForPersonRate({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.personincome = res.result.personincome;
        this.companyincome = res.result.companyincome;
        this.personrate = res.result.personrate;
        this.companyrate = res.result.companyrate;
        this.personincreaserate = res.result.personincreaserate;
        this.companyincreaserate = res.result.companyincreaserate;
        this.businessOption.series[0].data[0].value = res.result.companyincome;
        this.businessOption.series[0].data[0].name = "团检";
        this.businessOption.series[0].data[1].value = res.result.personincome;
        this.businessOption.series[0].data[1].name = "个检";
        let genderChart = this.$echarts.init(this.$refs.businessChart); // 性别图表
        genderChart.setOption(this.businessOption);
        window.addEventListener("resize", function () {
          genderChart.resize();
        });
      });
    },
    // 收入概况信息（性别统计）
    handleGetInfoForSexRate() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForSexRate({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.manincome = res.result.manincome;
        this.womanincome = res.result.womanincome;
        this.manrate = res.result.manrate;
        this.womanrate = res.result.womanrate;
        this.manincreaserate = res.result.manincreaserate;
        this.womanincreaserate = res.result.womanincreaserate;
        this.genderOption.series[0].data[0].value = res.result.womanincome;
        this.genderOption.series[0].data[0].name = "女性";
        this.genderOption.series[0].data[1].value = res.result.manincome;
        this.genderOption.series[0].data[1].name = "男性";
        let genderChart = this.$echarts.init(this.$refs.genderChart); // 性别图表
        genderChart.setOption(this.genderOption);
        window.addEventListener("resize", function () {
          genderChart.resize();
        });
      });
    },
    // 年度对比回调
    handlegetInfoForYearCompare() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForYearCompare({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.yearOption.xAxis[0].data = res.result.map((k) => {
          return k.yearcontent;
        });
        this.yearOption.series[0].data = res.result.map((k) => {
          return k.companyincome;
        });
        this.yearOption.series[1].data = res.result.map((k) => {
          return k.personincome;
        });
        let yearChart = this.$echarts.init(this.$refs.yearChart); // 性别图表
        yearChart.setOption(this.yearOption);
        window.addEventListener("resize", function () {
          yearChart.resize();
        });
      });
    },
    // 月度对比
    handlegetInfoForMonthCompare() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForMonthCompare({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.monthOption.xAxis.data = res.result.map((k) => {
          return k.monthcontent;
        });
        this.monthOption.series[0].data = res.result.map((k) => {
          return k.personincome;
        });
        this.monthOption.series[1].data = res.result.map((k) => {
          return k.companyincome;
        });
        let monthChart = this.$echarts.init(this.$refs.monthChart); // 月度对比 monthcontent
        monthChart.setOption(this.monthOption);
        window.addEventListener("resize", function () {
          monthChart.resize();
        });
      });
    },
    // 团检费用排行
    handleGetInfoForCompanyCostSort() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForCompanyCostSort({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.ageOption.yAxis.data = res.result.map((k) => {
          return k.companyname;
        });
        this.ageOption.series[0].data = res.result.map((k) => {
          return k.persontotal;
        });
        this.ageOption.series[1].data = res.result.map((k) => {
          return k.incometotal;
        });
        let ageChart = this.$echarts.init(this.$refs.ageChart); // 人群年龄分布
        ageChart.setOption(this.ageOption);
        ageChart.resize();
        window.addEventListener("resize", function () {
          ageChart.resize();
        });
      });
    },
    // 费用占比（科室比率）
    handleGetInfoForDepartRate() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForDepartRate({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.groupCheckOption.series[0].data = res.result.map((k) => {
          return {
            value: k.departincome,
            name: k.departname,
          };
        });
        let groupCheckChart = this.$echarts.init(this.$refs.groupCheckChart); // 团检企业占比
        groupCheckChart.setOption(this.groupCheckOption);
        window.addEventListener("resize", function () {
          groupCheckChart.resize();
          typeCheckChart.resize();
        });
      });
    },
    // 费用占比（费用分布）
    handleGetInfoForCostRange() {
      let whereitems = [
        {
          key: "startdate",
          value: this.searchDate[0],
        },
        {
          key: "enddate",
          value: this.searchDate[1],
        },
      ];
      getInfoForCostRange({ whereitems }).then((res) => {
        if (!res.result) return false;
        this.typeCheckOption.xAxis.data = res.result.map((k) => {
          return k.costname;
        });
        this.typeCheckOption.series[0].data = res.result.map((k) => {
          return k.costcount;
        });
        let typeCheckChart = this.$echarts.init(this.$refs.typeCheckChart); // 体检类型分布
        // 赋值图标配置
        typeCheckChart.setOption(this.typeCheckOption);
        // 监听窗口变化重新渲染echarts图标
        window.addEventListener("resize", function () {
          typeCheckChart.resize();
        });
      });
    },
  },

  watch: {
    // 监听第一次接口请求成功
    isInterface: {
      handler() {
        this.handleGetInfoForIncome();
        this.handleGetInfoForPersonRate();
        this.handleGetInfoForSexRate();
        this.handlegetInfoForYearCompare();
        this.handlegetInfoForMonthCompare();
        this.handleGetInfoForCompanyCostSort();
        this.handleGetInfoForDepartRate();
        this.handleGetInfoForCostRange();
      },
      deep: true,
    },
  },

  computed: {},
};
</script>
<style lang='scss' scoped>
@import "../css/index.scss";
@import "../css/Income.scss";
</style>