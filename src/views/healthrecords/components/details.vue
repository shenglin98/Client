<template>
  <div class="details">
    <div class="head_box">
      <el-button-group>
        <el-button type="primary" size="mini" @click="handleCheckUserInfo"
          >个人信息</el-button
        >
        <el-button type="primary" size="mini" @click="handleCheckCheckData"
          >体检数据</el-button
        >
      </el-button-group>
      <el-button type="primary" size="mini" @click="handleClosePage">关闭</el-button>
    </div>
    <div class="userInfo" v-if="pageStatus === 'userInfo'">
      <div class="user_head">
        <div class="head_info">
          <div class="title">基本信息</div>
          <el-row class="mt">
            <el-col :span="5">
              <div class="head_info_item">
                体检号：<span>{{ userInfo.regid || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="head_info_item">
                姓名：<span>{{ userInfo.name || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="head_info_item">
                性别：<span>{{
                  userInfo.sex == 0 ? "未知" : userInfo.sex == 1 ? "男" : "女" || "暂无"
                }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="head_info_item">
                出生日期：<span>{{ userInfo.birthday || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="head_info_item">
                民族：<span>{{ userInfo.nation || "暂无" }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="mt">
            <el-col :span="5">
              <div class="head_info_item">
                身份证：<span>{{ userInfo.idcard || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="head_info_item">
                住址：<span>{{ userInfo.address || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="head_info_item">
                联系电话：<span>{{ userInfo.telephone || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="head_info_item">
                籍贯：<span>{{ userInfo.nativeplace || "暂无" }}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="head_info_item">
                职业：<span>{{ userInfo.occupation || "暂无" }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="img_box">
          <div class="photo_box">
            <img :src="avatarImg" :draggable="false" class="avatar" alt="摄像头" />
          </div>
        </div>
      </div>
      <div class="jkqk_content">
        <div class="jkqk_item">
          <div class="jkqk_item_head">
            <div>既往病史</div>
          </div>
          <div class="jkqk_item_content">
            {{ healthySituation.pastbs }}
          </div>
        </div>
        <div class="jkqk_item">
          <div class="jkqk_item_head">
            <div>家族病史</div>
          </div>
          <div class="jkqk_item_content">
            {{ healthySituation.familybs }}
          </div>
        </div>
      </div>
      <div class="table_box">
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
        <div class="zyzb">
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
      </div>
      <!-- 底部图表盒子 -->
      <div class="subject_r_b">
        <div class="head_box_s">
          <div class="head">重要指标趋势</div>
        </div>
        <div class="subject_r_b_content" id="indicatorTrends" ref="indicatorTrends">
          <div
            class="chart_content"
            :id="`chart${index}`"
            v-for="(item, index) in chartList"
            :key="index"
          ></div>
        </div>
      </div>
    </div>
    <div class="checkData" v-if="pageStatus === 'checkData'">
      <div class="head_info">
        <div class="head_info_item">
          体检号：<span>{{ userInfo.regid || "暂无" }}</span>
        </div>
        <div class="head_info_item">
          姓名：<span>{{ userInfo.name || "暂无" }}</span>
        </div>
        <div class="head_info_item">
          性别：<span>{{
            userInfo.sex == 0 ? "未知" : userInfo.sex == 1 ? "男" : "女" || "暂无"
          }}</span>
        </div>
        <div class="head_info_item">
          年龄：<span>{{ userInfo.age }}<span v-if="userInfo.age">岁</span></span>
        </div>
        <div class="head_info_item">
          民族：<span>{{ userInfo.nation || "暂无" }}</span>
        </div>
        <div class="head_info_item">
          联系电话：<span>{{ userInfo.telephone || "暂无" }}</span>
        </div>
        <div class="head_info_item">
          住址：<span>{{ userInfo.address || "暂无" }}</span>
        </div>
      </div>
      <div class="head">体检记录</div>
      <EasyTable
        row-id="regid"
        :loading="loading"
        class="condition_table_es"
        height="100%"
        :data="pageData"
        :tableOptions="conditionOptions"
        :checkbox-config="{ fetch: true, rowClick: true }"
        :border="false"
        :header-cell-style="handleReturnStyle"
        :row-class-name="handleTableRowClassName"
        :row-style="{ height: '32px' }"
        :cell-style="{ padding: '0' }"
      />
      <!-- 预览弹框 -->
      <el-dialog
        title="预览"
        class="preview_box"
        :visible.sync="showPreview"
        width="650px"
        top="5vh"
        @close="handleCloseDialog"
      >
        <iframe
          ref="pdfCotainer"
          :src="pdfUrl"
          width="100%"
          style="height: calc(100vh - 147px)"
        ></iframe>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
import {
  getPersonCheckList,
  getHealthInfo,
  getDiagnoseInfo,
  getImportantInfo,
} from "@/api/healthView.js";
import { getPersonalRegisterList } from "@/api/personalregister.js";
import { printBase64 } from "@/api/printreport.js";

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
      //   userInfo: {},
      healthySituation: {},
      chartList: [],
      pageData: [],
      loading: false,
      avatarImg: require("./images/lin.jpg"),
      pageStatus: "userInfo", // 个人信息-userInfo 体检数据-checkData
      diseaseData: [], // 疾病诊断表格数据
      indicatorData: [], // 重要指标
      pdfUrl: "",
      showPreview: false,
    };
  },

  mounted() {
    // 个人健康情况信息回调
    this.handleGetHealthInfo();
    // // 个人诊断信息回调
    this.handleGetDiagnoseInfo();
    // // 个人重要指标、指标趋势
    this.handleGetImportantInfo();
  },

  methods: {
    handleClosePage() {
      this.$emit("close");
    },
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.showPreview = false;
    },
    handlePreviewReport(item) {
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [item.regid],
        // repname: d.$children[0].$attrs["data-remark"],
        repname: "2、报告书",
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
        if (url) this.showPreview = true;
        this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      });
    },
    // 获取个人登记列表回调
    handleGetPersonalRegisterList() {
      this.loading = true;
      let whereitems = [];
      whereitems.push({
        key: "checkno",
        value: this.userInfo.checkno,
      });
      whereitems.push({
        key: "pageflag",
        value: "customerresult",
      });
      getPersonalRegisterList({
        page: 1,
        limit: 10000,
        whereitems,
      })
        .then((res) => {
          this.pageData = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.pageData = [];
          this.loading = false;
        });
    },
    handleCheckCheckData() {
      this.pageStatus = "checkData";
      this.handleGetPersonalRegisterList();
    },
    handleCheckUserInfo() {
      this.pageStatus = "userInfo";
      // 个人健康情况信息回调
      this.handleGetHealthInfo();
      // // 个人诊断信息回调
      this.handleGetDiagnoseInfo();
      // // 个人重要指标、指标趋势
      this.handleGetImportantInfo();
    },
    //   个人重要指标、指标趋势
    handleGetImportantInfo() {
      getImportantInfo({ checkno: this.userInfo.checkno }).then((res) => {
        this.indicatorData = res.result.resultitems || [];
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
    //   个人健康情况信息回调
    handleGetHealthInfo() {
      getHealthInfo({ checkno: this.userInfo.checkno }).then((res) => {
        this.healthySituation = res.result;
      });
    },
    //   个人诊断信息回调
    handleGetDiagnoseInfo() {
      getDiagnoseInfo({ checkno: this.userInfo.checkno }).then((res) => {
        this.diseaseData = res.result;
      });
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.userInfo.fileid }).then((res) => {
        this.avatarImg = res.result.fileUrl;
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
  },

  watch: {},

  computed: {
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
    conditionOptions() {
      return [
        {
          width: 25,
          render: (h, data) => {
            let src = "";
            switch (data.status) {
              case 0:
                src = require("@/assets/images/登记.png");
                break;
              case 1:
                src = require("@/assets/images/预约.png");
                break;
              case 2:
                src = require("@/assets/images/签到.png");
                break;
              case 3:
                src = require("@/assets/images/检查.png");
                break;
              case 4:
                src = require("@/assets/images/交表.png");
                break;
              case 5:
                src = require("@/assets/images/总检.png");
                break;
              case 6:
                src = require("@/assets/images/总检.png");
                break;
              case 7:
                src = require("@/assets/images/审核.png");
                break;
              default:
                break;
            }
            return (
              <img
                class="user-avatar"
                draggable={false}
                style="width:15px;height:15px;"
                src={src}
              />
            );
          },
        },
        {
          title: "姓名",
          width: 100,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handlePreviewReport(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "性别",
          width: 80,
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          width: 80,
          prop: "age",
          returnVal: (value, data) => {
            return `${value} ${data.ageunit}`;
          },
        },
        {
          title: "体检号",
          width: 120,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handlePreviewReport(data)}
              >
                {data.regid}
              </el-link>
            );
          },
        },
        {
          title: "身份证",
          prop: "idcard",
          width: 120,
          omit: 1,
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 120,
          omit: 1,
        },
        {
          title: "收费",
          prop: "price",
          width: 120,
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 120,
          omit: 1,
        },
        {
          title: "登记日期",
          prop: "regdate",
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          width: 100,
          enumType: [
            {
              value: 0,
              label: "已登记",
            },
            {
              value: 1,
              label: "已预约",
            },
            {
              value: 2,
              label: "已签到",
            },
            {
              value: 3,
              label: "体检中",
            },
            {
              value: 4,
              label: "已交表",
            },
            {
              value: 5,
              label: "可总检",
            },
            {
              value: 6,
              label: "已总检",
            },
            {
              value: 7,
              label: "已审核",
            },
          ],
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
            let result = data.resupper ? `${value} - ${data.resupper}` : `${value}`;
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
};
</script>
<style lang="scss" scoped>
.details {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .head_box {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 6px;
    padding: 0 10px;
  }
  .userInfo {
    margin-top: 5px;
    width: 100%;
    height: calc(100% - 45px);
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;
    .user_head {
      height: 100px;
      //   align-items: center;
      display: flex;
      .head_info {
        flex: 1;
        padding: 0 15px;
        .title {
          font-size: 18px;
          font-weight: 600;
        }
        .mt {
          margin-top: 10px;
        }
        .head_info_item {
          > span {
            color: #605d5d;
          }
        }
      }
    }
    .img_box {
      padding: 5px;
      box-sizing: border-box;
      // 照片
      .photo_box {
        width: 100px;
        .avatar {
          width: 100px;
          height: 115px;
          border: 1px solid #ebeef5;
        }
      }
    }
    .jkqk_content {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .jkqk_item {
        // border-bottom: 1px solid #e2e3e4;
        // min-height: 33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 5px 10px;
        .jkqk_item_head {
          display: flex;
          align-items: center;
          > img {
            width: 20px;
            height: 20px;
          }
          > div {
            font-style: 16px;
            font-weight: 600;
            margin-left: 8px;
          }
        }
        .jkqk_item_content {
          font-size: 14px;
        }
      }
    }
    .table_box {
      height: 300px;
      width: 100%;
      box-sizing: border-box;
      margin-top: 0;
      display: flex;
      .jbzd {
        width: 40%;
        height: 100%;
        .head {
          font-size: 18px;
          font-weight: 600;
        }
        .jbzd_content {
          height: calc(100% - 30px);
          .disease_table {
            height: 100%;
          }
        }
      }
      .zyzb {
        margin-left: 10px;
        width: calc(60% - 10px);
        height: 100%;
        .head {
          font-size: 18px;
          font-weight: 600;
        }
        .subject_r_t_r_content {
          height: calc(100% - 30px);
          .indicator_table {
            height: 100%;
          }
        }
      }
    }
    .subject_r_b {
      margin-top: 10px;
      width: 100%;
      height: 300px;
      border-radius: 6px;
      overflow: hidden;
      background-color: #fff;
      .subject_r_b_content {
        width: 100%;
        height: calc(100% - 40px);
        padding: 10px;
        display: flex;
        overflow-x: auto;
        .chart_content {
          flex-shrink: 0;
          width: 280px !important;
          margin-right: 20px;
          height: 100%;
        }
      }
    }
  }
  .checkData {
    margin-top: 5px;
    width: 100%;
    height: calc(100% - 45px);
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;
    .head_info {
      height: 30px;
      display: flex;
      align-items: center;
      .head_info_item {
        margin-right: 18px;
      }
    }
    .head {
      font-size: 18px;
      font-weight: 600;
    }
    .condition_table_es {
      height: calc(100% - 100px);
    }
  }
}
</style>
