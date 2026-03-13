<template>
  <div class="triagcall">
    <!-- 头部信息 -->
    <div class="top_box">
      <div class="logo_box">
        <img
          class="logo_img"
          src="./images/logo.png"
          draggable="false"
          alt=""
        />
        <div class="logo_title">禾创科技</div>
      </div>
      <div class="dept_box">保健科 B 超</div>
      <div class="time_box">
        <div class="tb_date">2024-1-22</div>
        <div class="tb_week">星期一</div>
        <div class="tb_time">15:31</div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="mainbody">
      <el-row class="mainbody_box">
        <el-col :span="18" class="mainbody_l">
          <div class="page_table">
            <div class="pt_top">
              <div class="location">地点</div>
              <div class="currentcheck">当前检查</div>
              <div class="surgery">诊室等候</div>
            </div>
            <div class="data_content">
              <div
                class="data_item"
                v-for="(item, index) in roomitems"
                :key="index"
                :class="(index + 1) % 2 != 0 ? 'bgc_tow' : ''"
              >
                <div class="location">{{ item.roomname }}</div>
                <div class="currentcheck">
                  {{ item.checkingitem.queueno }} {{ item.checkingitem.name }}
                </div>
                <div class="surgery">
                  <div
                    class="surgery_item"
                    v-for="item in item.paiduiitems"
                    :key="item.queueno"
                  >
                    {{ item.queueno }} {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="mainbody_r">
          <div class="stuff_box">
            <div class="sb_top">过号人员</div>
            <div class="sss_content">
              <div
                class="sssc_item"
                v-for="(item, index) in skipitems"
                :key="index"
                :class="(index + 1) % 2 != 0 ? 'sss_tow' : ''"
              >
                {{ item.queueno }}　{{ item.name }}
              </div>
            </div>
          </div>
          <div class="tips_box">
            <div class="tb_top">温馨提示</div>
            <div class="sss_content">
              <div class="tips1">1.检查B超前可适量饮水,检查时需空腹及憋求</div>
              <div class="tips2">
                2.过号需重叫的客户请与咨询台工作人员联系。
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 底部 -->
      <div class="bottom_footer">过号(请与前台联系)：{{ triagcalltext }}</div>
    </div>
  </div>
</template>
<script>
import { TriagBigScreen } from "@/api/triag.js";
export default {
  name: "triagcall",

  components: {},

  data() {
    return {
      roomitems: [],
      skipitems: [],
      triagcalltext: "",
    };
  },

  mounted() {
    this.handleTriagBigScreen();
  },

  methods: {
    // 获取当前页面数据
    handleTriagBigScreen() {
      TriagBigScreen({
        datetime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " "),
      }).then((res) => {
        if (!res.result) return;
        this.roomitems = res.result.roomitems;
        this.skipitems = res.result.skipitems;
        if (res.result.skipitems.length > 0) {
          this.triagcalltext = res.result.skipitems
            .map((k) => {
              return `${k.queueno}-${k.name}`;
            })
            .join("，");
        }
      });
    },
  },

  watch: {},

  computed: {},
};
</script>
<style lang='scss' scoped>
.triagcall {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  .top_box {
    height: 8%;
    box-sizing: border-box;
    padding: 0 2rem 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo_box {
      display: flex;
      align-items: center;
      width: 40%;
      .logo_img {
        width: 3rem;
        height: 3rem;
        margin-right: 0.7rem;
      }
      .logo_title {
        color: #29218f;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
    .dept_box {
      width: 20%;
      height: 4rem;
      background: linear-gradient(to bottom, #54a2cf, #2078a8);
      border-radius: 0 0 2rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.7rem;
      margin-top: -0.6rem;
    }
    .time_box {
      width: 40%;
      display: flex;
      justify-content: flex-end;
      .tb_date {
        margin-right: 2rem;
        font-size: 1.5rem;
        color: #000;
      }
      .tb_week {
        margin-right: 2rem;
        font-size: 1.5rem;
        color: #000;
      }
      .tb_time {
        width: 7rem;
        background-image: url("./images/time.png");
        background-size: 100% 100%;
        font-weight: 600;
        color: #fff;
        display: flex;
        font-size: 1.5rem;
        align-items: center;
        padding-left: 2.5rem;
        box-sizing: border-box;
      }
    }
  }
  .mainbody {
    height: calc(100% - 8%);
    box-sizing: border-box;
    background-image: url("./images/mainbody.png");
    background-size: 100% 100%;
    padding: 1rem 1rem 0 1rem;
    position: relative;
    .mainbody_box {
      height: calc(100% - 10%);
      .mainbody_l {
        height: 100%;
        padding-right: 1rem;
        .page_table {
          width: 100%;
          height: 100%;
          background-color: #fff;
          border-radius: 2rem 2rem 0 0;
        }
        .pt_top {
          height: 5rem;
          display: flex;
          font-size: 1.5rem;
          .location {
            width: 15%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .currentcheck {
            width: 35%;
            background: linear-gradient(to bottom, #54a2cf, #2078a8);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .surgery {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .data_content {
          height: calc(100% - 5rem);
          box-sizing: border-box;
          border: 1px solid #4595c4;
          background-color: #06649c;
          .data_item {
            display: flex;
            border-bottom: 1px solid #4595c4;
            box-sizing: border-box;
            height: 10%;
            font-size: 1.5rem;
            background-color: #1376b0;
            .location {
              width: 15%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ffec50;
            }
            .currentcheck {
              width: 35%;
              display: flex;
              justify-content: center;
              align-items: center;
              border-left: 1px solid #4595c4;
              border-right: 1px solid #4595c4;
              color: #ff9018;
            }
            .surgery {
              width: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ffec50;
              .surgery_item {
                margin-right: 1rem;
              }
            }
          }
          .bgc_tow {
            background-color: #06649c !important;
          }
        }
      }
      .mainbody_r {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .stuff_box {
          width: 100%;
          height: 49%;
          .sb_top {
            background-color: #fff;
            border-radius: 2rem 2rem 0 0;
            height: 5rem;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .sss_content {
            box-sizing: border-box;
            border: 1px solid #4595c4;
            height: calc(100% - 5rem);
            .sssc_item {
              height: 25%;
              box-sizing: border-box;
              border-bottom: 1px solid #4595c4;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              font-size: 1.5rem;
              background-color: #1376b0;
            }
          }
          .sss_tow {
            background-color: #06649c !important;
          }
        }
        .tips_box {
          width: 100%;
          height: 49%;
          .tb_top {
            background-color: #fff;
            border-radius: 2rem 2rem 0 0;
            height: 5rem;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .sss_content {
            box-sizing: border-box;
            border: 1px solid #4595c4;
            height: calc(100% - 5rem);
            padding: 1rem;
            background-color: #06649c;
            .tips1,
            .tips2 {
              font-size: 1.5rem;
              color: #fff;
              font-weight: 600;
            }
            .tips2 {
              margin-top: 1rem;
            }
          }
        }
      }
    }
    .bottom_footer {
      width: 100%;
      height: 8%;
      background-image: url("./images/bottom.png");
      background-size: 100% 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      font-weight: 600;
      color: #fff;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>