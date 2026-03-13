<template>
  <div class="applymanage">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <div class="search_input">
          <el-input placeholder="请输入检索内容" v-model="searchName" size="mini" clearable>
          </el-input>
        </div>
        <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
      <div class="mainbody">
        <el-table :data="SocketDataSS" height="100%" class="pagetable" @selection-change="handleSelect" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName" :header-cell-style="handleReturnStyle" :header-row-style="handleReturnStyle">
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="clientUniqueId" label="唯一标识" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address" label="昵称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="account" label="用户账号"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="roomNo" label="房间号"> </el-table-column>
          <el-table-column prop="requstCount" label="请求次数">
          </el-table-column>
          <el-table-column prop="connectTime" label="连接时间">
          </el-table-column>
          <el-table-column prop="lastTime" label="最后请求时间">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="params">
              <el-button size="mini" type="primary" @click="handleBtnShutDown(params.row)">断开</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
// api/SysStationletter/LoadWebSockets
import { LoadWebSockets, CloseWebSockets } from "../../api/socket";
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
export default {
  name: "SocketIndex",
  components: { Sticky, permissionBtn },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 套餐表格搜索数据
    SocketDataSS() {
      const search = this.searchName;
      if (search) {
        return this.SocketData.filter((data) => {
          return Object.keys(data).some((key) => {
            let containArr = ["account", "name"];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.SocketData;
    },
  },
  data() {
    return {
      SocketData: [], //表格数据
      selectDelete: [], //选中的删除数据
      buttons: [],
      searchName: "",
    };
  },

  mounted() {
    this.getLoadWebSockets();
  },

  methods: {
    // 选择回调
    handleSelect(row) {
      this.selectDelete = row.map((u) => u.clientUniqueId);
    },
    // 获取数据
    getLoadWebSockets() {
      LoadWebSockets({ tempcategroy: "" }).then((res) => {
        this.SocketData = res.result;
      });
    },
    // 操作 关闭回调
    handleBtnShutDown(row) {
      // row有值就是单个删除,没值就是批量
      let arr = [];
      // if (row?.clientUniqueId) arr = [row.clientUniqueId];
      if (row?.clientUniqueId) arr = [row.userId];
      else arr = this.selectDelete;
      CloseWebSockets(arr).then((res) => {
        console.log("关闭", res);
        if (res.code == 200) {
          this.$message({
            type: "success",
            duration: 1000,
            message: res.message,
          });
        }
      });
    },
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter(
        (k) => k.path === this.$route.path
      )[0];
      if (view) {
        // 设置删除vuex中tabs值
        if (view.path.split("/")[1]) {
          this.$store.commit("handlerSetTabRemove", view.path.split("/")[1]);
        }
        this.$store.dispatch("delVisitedViews", view).then((views) => {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        });
      }
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnDel": // 删除
          this.handleBtnShutDown();
          break;
        case "btnReset": // 删除
          this.getLoadWebSockets();
          break;

        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#d0ddeb";
      stylejson.height = "32px";
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
.applymanage {
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .mytable-style .vxe-body--row.row-red {
    background-color: red;
    color: #fff;
  }
  .subject {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    .search_box {
      display: flex;
      height: 40px;
      width: 100%;
      background-color: #f6f7fc;
      box-sizing: border-box;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      .search_input {
        margin-right: 12px;
      }
      .sbtn {
        margin: 0 10px;
      }
      .el-input {
        width: 250px;
      }
    }
    .mainbody {
      height: calc(100% - 60px);
      box-sizing: border-box;
      padding: 5px;
      .pagetable {
        height: 100%;
      }
    }
  }
}
</style>