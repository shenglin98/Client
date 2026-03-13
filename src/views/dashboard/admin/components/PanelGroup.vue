<template>
  <el-row class="panel-group" :gutter="40">
    <div style="display: flex; align-items: center">
      <span style="margin-left: 40px; color: #797979"> 我的工作 </span>
    </div>
    <br />
    <div style="margin-left: 20px">
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div
          class="card-panel"
          @click="handleSetLineChartData('newVisitis')"
          style="background-color: #caf982"
        >
          <div class="card-panel-description">
            <count-to
              class="card-panel-num"
              :startVal="0"
              :endVal="102400"
              :duration="2600"
            ></count-to>
          </div>
        </div>
        <div class="card-panel-text">预约</div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div
          class="card-panel"
          @click="handleSetLineChartData('messages')"
          style="background-color: #80ffff"
        >
          <div class="card-panel-description">
            <count-to
              class="card-panel-num"
              :startVal="0"
              :endVal="81212"
              :duration="3000"
            ></count-to>
          </div>
        </div>
        <div class="card-panel-text">登记</div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div
          class="card-panel"
          @click="handleSetLineChartData('purchases')"
          style="background-color: #facd91"
        >
          <div class="card-panel-description">
            <count-to
              class="card-panel-num"
              :startVal="0"
              :endVal="9280"
              :duration="3200"
            ></count-to>
          </div>
        </div>
        <div class="card-panel-text">检查</div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div
          class="card-panel"
          @click="handleSetLineChartData('shoppings')"
          style="background-color: #c280ff"
        >
          <div class="card-panel-description">
            <count-to
              class="card-panel-num"
              :startVal="0"
              :endVal="13600"
              :duration="3600"
            ></count-to>
          </div>
        </div>
        <div class="card-panel-text">总检</div>
      </el-col>
    </div>
  </el-row>
</template>
<script>
import CountTo from "vue-count-to";
export default {
  data() {
    return {};
  },
  components: {
    CountTo,
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    text-align: center;
  }

  .card-panel-text {
    font-size: 20px;
  }

  .card-panel {
    height: 108px;
    font-size: 12px;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shoppingCard {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shoppingCard {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      text-align: center;
      line-height: 100px;
      font-weight: bold;

      .card-panel-text {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 40px;
      }
    }
  }
}
</style>