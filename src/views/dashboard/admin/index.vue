<template>
  <div class="dashboard-editor-container">
    <panel-group></panel-group>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col"
      style="margin-top: -40px;position: absolute;right: 20px;margin-top: -210px;">
      <div style="display: flex;align-items: center;font-size: 15px;">
        <img :src="news" alt="" style="width: 15px;" /><span style="color: #d9001b;">
          &nbsp; 新消息：</span><span style="color: #4b7902;">【外科】张医生发来表情 &nbsp;</span><img :src="Like" alt=""
          style="width: 15px;" />
      </div>
      <br>
      <div style="border:1px solid;width: 350px;height: 300px;">

        <div style="margin-top: 10px;text-align: center;">
          <span>消息提醒 <span
              style="background-color: #D9001B;border-radius: 60%;display:inline-block;width: 30px;color: #fff;">1</span></span>

        </div>
        <div style="margin-top: 20px;font-size: 10px;">
          <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
            <a href="#" style="display: flex;align-items: center;"><img :src="message" alt=""><span
                style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                15:23:21</span>
            </a>
          </div>
          <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
            <a href="#" style="display: flex;align-items: center;"><img :src="message" alt=""><span
                style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                15:23:21</span>
            </a>
          </div>
          <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
            <a href="#" style="display: flex;align-items: center;"><img :src="star" alt=""><span
                style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                15:23:21</span>
            </a>
          </div>
          <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
            <a href="#" style="display: flex;align-items: center;"><img :src="star" alt=""><span
                style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                15:23:21</span>
            </a>
          </div>
        </div>
      </div>
      <div style="border:1px solid;width: 350px;margin-top: 50px;height: 300px;">

        <div style="margin-top: 10px;text-align: center;">
          <span>消息提醒 <span
              style="background-color: #D9001B;border-radius: 60%;display:inline-block;width: 30px;color: #fff;">1</span></span>

        </div>
        <div style="margin-top: 20px;font-size: 10px;">
          <div style="margin-top: 20px;font-size: 10px;">
            <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
              <a href="#" style="display: flex;align-items: center;"><img :src="message" alt=""><span
                  style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                  15:23:21</span>
              </a>
            </div>
            <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
              <a href="#" style="display: flex;align-items: center;"><img :src="message" alt=""><span
                  style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                  15:23:21</span>
              </a>
            </div>
            <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
              <a href="#" style="display: flex;align-items: center;"><img :src="star" alt=""><span
                  style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                  15:23:21</span>
              </a>
            </div>
            <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 20px;">
              <a href="#" style="display: flex;align-items: center;"><img :src="star" alt=""><span
                  style="font-size: 13px;">&nbsp;&nbsp; 危急值：张三 男 K:10.5 2021-04-18
                  15:23:21</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <div style="color: #797979;margin-left: 20px;">常用功能</div>
    <el-row :gutter="20" style="margin-left: 50px;">

      <div style="margin-left: 100px;text-align: center;">
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl" style="width: 80px;height: 80px;" /></a>
          <div>体检预约</div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl1" style="width: 80px;height: 80px;" /></a>
          <div>体检登记</div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl2" style="width: 80px;height: 80px;" /></a>
          <div>标本采样</div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl3" style="width: 80px;height: 80px;" /></a>
          <div>团体预约</div>
        </el-col>
      </div>
    </el-row>
    <el-row :gutter="20" style="margin-left: 50px;">
      <div style="margin-left: 100px;text-align: center;">
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl4" style="width: 100px;height: 100px;" /></a>
          <div>体检签到</div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl5" style="width: 100px;height: 100px;" /></a>
          <div>智能分诊</div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl6" style="width: 100px;height: 100px;" /></a>
          <div>科室检查</div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
          <a href="#"> <img :src="imgUrl7" style="width: 100px;height: 100px;" /></a>
          <div>总检</div>
        </el-col>
      </div>
    </el-row>
    <el-row>
      <div
        style="background-color: #CAF982;height: 30px;width: 200px;border: 1px solid;display: flex;align-items: center;">
        <img :src="clock" style="left: 0px;" alt=""><span style="margin-left: 35px;"> 2021-04-25</span>
      </div>
      <div style="border: 1px solid;width: 200px;height: 150px;">
        <div style="margin-top: 20px;font-weight: bold;">&nbsp;&nbsp; 下周二下午健康知识大讲堂听课</div>
      </div>
    </el-row>
  </div>

</template>


<script>
  import PanelGroup from "./components/PanelGroup";

  export default {
    name: "dashboard-admin",
    data() {
      return {
        imgUrl: require("/img/1627286055(1).jpg"),
        imgUrl1: require("/img/1627286070(1).jpg"),
        imgUrl2: require("/img/1627286083(1).jpg"),
        imgUrl3: require("/img/1627286095(1).jpg"),
        imgUrl4: require("/img/1627286107(1).jpg"),
        imgUrl5: require("/img/1627286117(1).jpg"),
        imgUrl6: require("/img/1627286127(1).jpg"),
        imgUrl7: require("/img/1627286139.jpg"),
        news: require("/img/1627347705(1).jpg"),
        Like: require("/img/1627352251(1).jpg"),
        message: require("/img/1627353880(1).jpg"),
        star: require("/img/1627355091(1).jpg"),
        clock: require("/img/1627362395(1).jpg")
      };
    },
    components: {
      PanelGroup,
    },
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .card-panel-col {
    margin-bottom: 32px;
  }

  .auth-box {
    margin-top: 30px;
    background: #f5f5f5;

    .auth-col {
      border: 1px solid #c8c8c8;

      &.active {
        // background: #0dafff;
        overflow: hidden;
        position: relative;

        .recomment {
          display: inline-block;
          width: 150px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          background: #febd17;
          transform: rotate(-45deg);
          position: absolute;
          left: -45px;
          top: 10px;
          font-size: 14px;
          color: #fff;
          font-weight: normal;
          letter-spacing: 3px;
        }

        .auth-head {}
      }

      &:nth-child(2) {
        border-left: 0;
        border-right: 0;
      }

      &:nth-child(4) {
        border-left: 0;
      }

      // border-right:
      .auth-head {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        height: 135px;

        .subTitle {
          display: inline-block;
          font-weight: normal;
          padding-top: 10px;
        }
      }

      >div {
        height: 40px;
        padding: 10px 20px;
        box-sizing: border-box;
        text-align: center;

        .auth-icon {
          font-size: 18px;
          padding: 0 10px;

          .el-icon-success {
            color: #67c23a;
          }

          .el-icon-error {
            color: #f56c6c;
          }
        }
      }

      >div:nth-child(even) {
        background: #e5e5e5;
      }

      .auth-item:nth-child(even) {
        // background: #0dafff;
      }
    }
  }

  .dashboard-editor-container {
    padding: 20px;
    background-color: rgb(240, 242, 245);
    min-height: calc(100vh - 84px);

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }

    .component-item {
      min-height: 100px;
    }
  }

  .product {
    max-width: 350px;
    border: 1px solid #dfdfdf;
    padding: 0;
    border-radius: 8px;
    margin-bottom: 20px;
    background-color: white;

    .title {
      padding: 12px;
      text-align: center;
      background-color: #f4f4f4;
      border-radius: 8px 8px 0 0;
    }

    h2 {
      margin: 24px 0 12px;
    }

    .content {
      h2 {
        text-align: center;
        font-size: 30px;
      }

      .tips {
        padding: 0 35px 30px 30px;

        div {
          padding: 8px 0;
          font-size: 15px;

          .el-icon-check {
            width: 30px;
            font-size: 1.5em;
            color: #35affb;
            vertical-align: middle;
          }
        }

        .color-prime {
          color: #338ed6;
          font-weight: 650;

          .el-icon-check {
            color: gray;
          }
        }

        .color-enterprise {
          color: #f56c6c;
          font-weight: 800;

          .el-icon-check {
            color: #67c23a;
          }
        }
      }
    }
  }

  .action {
    text-align: center;
    padding-bottom: 24px;
    padding: 12px 18px;
    display: flex;
    background: #f4f4f4;

    .btn {
      flex: 1;
      margin: 6px;
      padding: 6px 12px;
      line-height: 26px;
      font-size: 16px;
      background: #fff;
      position: relative;
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      border-radius: 4px;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      font-weight: 700;
      text-decoration: none;
      border: 2px solid #4893ff;
      background-color: transparent;
      color: #4893ff;
      transition: all 0.3s;
    }

    a.btn.std {
      color: #0dafff;
      border-color: #0dafff;
    }

    a.btn.premier {
      color: #d67735;
      border-color: #ffa669;
    }
  }

  .standard .title {
    background: #eaeaea;
    color: #666;
  }

  .prime {
    margin: 0 auto;
  }

  .prime .title {
    background: linear-gradient(#338ed6, #4f6eab);
    color: #fff;
  }

  .enterprise {
    margin-left: auto;
    margin-right: 0;
  }

  .enterprise .title {
    background: linear-gradient(#807979, #484a4e);
    color: #fff;
  }
</style>