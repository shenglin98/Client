<template>
  <div class="guidancemonitor">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <div class="input_box">
          <div class="input_box_title">体检中心：</div>
          <el-select size="mini" v-model="meccode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in meccodeItems" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="btn_box">
          <el-button size="mini" type="primary" @click="handleTriagQueueStatic">刷 新</el-button>
          <el-button size="mini" type="primary" @click="handleClosePage">关 闭</el-button>
        </div>
      </div>
      <div class="mainbody">
        <el-row class="mainbody_box">
          <el-col :span="3" class="tree_box">
            <div class="tree_box_title">楼层</div>
            <el-tree ref="pageTree" class="pageTree" :data="treeData" node-key="id" :props="defaultProps" :default-expand-all="true" :default-checked-keys="defaultChecked" @node-click="handleNodeClick" highlight-current>
              <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                {{ node.label }}
              </span>
            </el-tree>
          </el-col>
          <el-col :span="21" class="content">
            <div class="content_item" v-for="value,index in pageData" :key="index">
              <div class="content_item_title">{{value.areaname}}</div>
              <div class="content_item_box">
                <div class="content_item_box_item" v-for="item in value.queueitems" :key="item.queuecode">
                  <div class="cibi_head">
                    <div class="cibih_l">
                      <div class="cibih_logo"></div>
                      <div class="cibih_name">{{item.queuename}}</div>
                      <div class="cibih_signallight">
                        <img v-for="test,index in item.fullstatus" v-if="item.fullstatus == 1" :key="index" src="./images/green.png" draggable="false">
                        <img v-for="test,index in item.fullstatus" v-if="item.fullstatus == 2" :key="index" src="./images/yellow.png" draggable="false">
                        <img v-for="test,index in item.fullstatus" v-if="item.fullstatus == 3" :key="index" src="./images/red.png" draggable="false">
                      </div>
                      <img class="cibih_reset" src="./images/reset.png" draggable="false" @click="handleRefreshSingleItem(value.areacode,item.queuecode)">
                    </div>
                    <div class="cibih_r">
                      <div class="cibih_ren">最大人数</div>
                      <el-input-number v-model="item.personmin" size="small" :min="0" :max="100000" label="最大人数"></el-input-number>
                      <el-button size="mini" type="primary" @click="handleUpdateTriagQueuePersonmin(value.areacode,item.queuecode,item.personmin)">设 定</el-button>
                    </div>
                  </div>
                  <div class="cibi_content">
                    <div class="cibic_l">
                      <div class="cibic_l_head">
                        <div class="zs">诊室</div>
                        <div class="dq">当前<span>{{item.check1Count}}</span></div>
                        <div class="zb">准备<span>{{item.check0Count}}</span></div>
                      </div>
                      <div class="cibic_l_content">
                        <div class="cibic_l_item" v-for="itemcibic,index in item.roomitems" :key="index">
                          <div class="zs">{{ itemcibic.roomname }}</div>
                          <div class="dq">{{ itemcibic.checkingitem.queueno }} {{ itemcibic.checkingitem.name }}</div>
                          <div class="zb">
                            <div v-if="itemcibic.paiduiitems.length>0 && itemcibic.paiduiitems[0]">{{ itemcibic.paiduiitems[0].queueno }} {{ itemcibic.paiduiitems[0].name }}</div>
                            <div v-if="itemcibic.paiduiitems.length>0 && itemcibic.paiduiitems[1]">{{ itemcibic.paiduiitems[1].queueno }} {{ itemcibic.paiduiitems[1].name }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cibic_r">
                      <div class="cibic_r_head">
                        <div class="hz">候诊 <span>{{item.waitCount}}</span></div>
                        <div class="zw" v-if="item.seizeflag == 1">占位 <span>{{item.seizeWaitCount}}</span></div>
                      </div>
                      <div class="cibic_r_content">
                        <div class="cibic_r_item" v-for="itemdenghou,index in item.inqueueitems" :key="index">{{ itemdenghou.queueno }} {{ itemdenghou.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as dictionary from "@/api/dictionary";
import { LoadTriagArea } from "@/api/dictriag.js";
import {
  TriagStatic,
  TriagQueueStatic,
  UpdateTriagQueuePersonmin,
} from "@/api/triag.js";
import { getPublicConfig } from "@/api/personalregister.js";

export default {
  name: "",

  components: {},

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  data() {
    return {
      meccode: "",
      meccodeItems: [],
      treeData: [
        {
          code: "",
          name: "全部",
        },
      ], // 文档树渲染数据
      defaultProps: {
        children: "children",
        label: "name",
      }, // 文档树渲染配置
      defaultChecked: [0], // 默认选中数据
      areacode: "",
      pageData: [],
      test: 0,
    };
  },

  async mounted() {
    await this.handleGetMeccode();
    await this.handleLoadTriagArea();
  },

  methods: {
    // 设定最大人数
    handleUpdateTriagQueuePersonmin(areacode, queuecode, personmin) {
      UpdateTriagQueuePersonmin({
        queuecode,
        personmin,
      }).then((res) => {
        if (!res.result) {
          this.$message.warning("请求失败!");
          return;
        }
        this.handleRefreshSingleItem(areacode, queuecode);
      });
    },
    // 刷新单条数据
    handleRefreshSingleItem(areacode, queuecode) {
      if (!queuecode) return;
      TriagQueueStatic({
        datetime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " "),
        areacode: this.areacode,
        meccode: this.meccode,
        queuecode,
      }).then((res) => {
        if (!res.result) {
          this.$message.warning("请求失败!");
          return;
        }
        let index = this.pageData.findIndex((k) => k.areacode === areacode);
        if (index == -1) return;
        for (let i = 0; i < this.pageData[index].queueitems.length; i++) {
          if (this.pageData[index].queueitems[i].queuecode === queuecode) {
            this.pageData[index].queueitems[i] = res.result[0].queueitems[0];
            this.$message.success(res.message);
          }
        }
      });
    },
    // 区域管理字典列表回调
    handleLoadTriagArea() {
      getPublicConfig({ cc: "TriagArea" })
        .then((res) => {
          if (!res.result) {
            this.treeData = [
              {
                code: "",
                name: "全部",
              },
            ];
          }
          this.treeData.push(...res.result);
          this.handleTriagQueueStatic();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取体检中心数据
    handleGetMeccode() {
      dictionary
        .getList({
          key: "",
          id: "",
          tableName: "Dic_Medical_center",
        })
        .then((response) => {
          this.meccodeItems = response.data;
        });
    },
    handleTriagQueueStatic() {
      TriagQueueStatic({
        datetime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " "),
        areacode: this.areacode,
        meccode: this.meccode,
      }).then((res) => {
        if (res.result) {
          this.$message.success(res.message);
          this.pageData = res.result;
        } else {
          this.pageData = [];
        }
      });
    },
    handleTriagStatic() {
      console.log(1111);
      TriagStatic({
        datetime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " "),
        areacode: this.areacode,
        meccode: this.meccode,
      }).then((res) => {
        if (res.result) {
          this.pageData = res.result;
        } else {
          this.pageData = [];
        }
      });
    },
    // 点击树形结构获取当前选中字典
    handleNodeClick(data) {
      if (!data) return;
      this.areacode = data.code;
      this.handleTriagQueueStatic();
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
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.healthstatus == 1) {
        // stylejson.background = "#e0838f"; // 背景颜色
        // 也可以修改文字颜色
        stylejson.color = "red !important";
        return stylejson;
      } else if (row.healthstatus == -1) {
        stylejson.color = "#0000ff !important";
        return stylejson;
      }
      return "";
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.height = "32px";
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
.guidancemonitor {
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
    .search_box {
      display: flex;
      height: 40px;
      width: 100%;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      .input_box {
        display: flex;
        align-items: center;
        .input_box_title {
          font-size: 16px;
          font-weight: 600;
          margin-right: 8px;
        }
        .el-select {
          width: 300px;
        }
      }
    }
    .mainbody {
      height: calc(100% - 40px);
      padding: 8px;
      box-sizing: border-box;
      .mainbody_box {
        height: 100%;
        .is-current {
          background-color: #5586d1 !important;
        }
        .tree_box {
          height: 100%;
          overflow-y: auto;
          border: 1px solid #ebebeb;
          background-color: #fff;
          border-radius: 0px 0px 9px 9px;
          .tree_box_title {
            height: 35px;
            background: #0883b7;
            color: #fff;
            box-shadow: 1px 2px 2px 0px rgba(24, 52, 116, 0.35);
            border-radius: 9px 9px 0px 0px;
            font-weight: 600;
            display: flex;
            align-items: center;
            padding-left: 25px;
            box-sizing: border-box;
          }
          /deep/.el-tree {
            .is-current {
              background-color: #0883b7 !important;
              color: #fff !important;
              border-radius: 9px !important;
            }
            .el-tree-node {
              height: 35px;
              .el-tree-node__content {
                height: 100%;
              }
            }
          }
        }
        .content {
          box-sizing: border-box;
          padding-left: 8px;
          height: 100%;
          overflow-y: auto;
          .content_item {
            margin-bottom: 10px;
            background: #ffffff;
            box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.35);
            border-radius: 10px;
            box-sizing: border-box;
            padding: 10px;
            .content_item_title {
              font-weight: 600;
              font-size: 24px;
              color: #000000;
            }
            .content_item_box {
              width: 100%;
              margin-top: 8px;
              display: flex;
              flex-wrap: wrap;
              .content_item_box_item {
                width: 49%;
                height: 360px;
                background: #e8f8ff;
                box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.35);
                border-radius: 10px;
                margin: 0 1% 1% 0;
                box-sizing: border-box;
                padding: 10px;
                .cibi_head {
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  .cibih_l {
                    display: flex;
                    align-items: center;
                    .cibih_logo {
                      width: 9px;
                      height: 40px;
                      background: #0883b7;
                      border-radius: 5px;
                    }
                    .cibih_name {
                      font-weight: 600;
                      font-size: 24px;
                      color: #000000;
                      margin: 0 10px 0 25px;
                    }
                    .cibih_signallight {
                      width: 91px;
                      height: 31px;
                      background: #ffffff;
                      border-radius: 16px;
                      display: flex;
                      align-items: center;
                      img {
                        width: 23px;
                        height: 26px;
                        margin-left: 3px;
                      }
                    }
                    .cibih_reset {
                      width: 30px;
                      height: 30px;
                      cursor: pointer;
                      margin-left: 10px;
                    }
                  }
                  .cibih_r {
                    display: flex;
                    align-items: center;
                    .cibih_ren {
                      font-size: 20px;
                      color: #000000;
                    }
                    /deep/.el-input-number {
                      margin: 0 8px;
                      .el-input-number__decrease,
                      .el-input-number__increase {
                        background-color: #0883b7 !important;
                        color: #fff !important;
                      }
                    }
                  }
                }
                .cibi_content {
                  margin-top: 10px;
                  height: 290px;
                  display: flex;
                  .cibic_l {
                    width: 63%;
                    margin-right: 2%;
                    height: 100%;
                    background: #ffffff;
                    border-radius: 10px;
                    border: 1px solid #0f78a5;
                    overflow: hidden;
                    .cibic_l_head {
                      height: 45px;
                      background: #0883b7;
                      border-radius: 10px 10px 0px 0px;
                      color: #fff;
                      font-size: 18px;
                      display: flex;
                      align-items: center;
                      .zs {
                        width: 27%;
                        display: flex;
                        justify-content: center;
                      }
                      .dq {
                        width: 27%;
                        display: flex;
                        justify-content: center;
                        span {
                          width: 31px;
                          height: 26px;
                          background: #ffffff;
                          border-radius: 4px;
                          margin-left: 8px;
                          color: #0883b7;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }
                      }
                      .zb {
                        width: 46%;
                        display: flex;
                        justify-content: center;
                        span {
                          width: 31px;
                          height: 26px;
                          background: #ffffff;
                          border-radius: 4px;
                          margin-left: 8px;
                          color: #0883b7;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }
                      }
                    }
                    .cibic_l_content {
                      height: 245px;
                      overflow-y: auto;
                      .cibic_l_item {
                        height: 16.6%;
                        border-bottom: 1px solid #0f78a5;
                        display: flex;
                        .zs {
                          width: 27%;
                          height: 100%;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          border-right: 1px solid #0f78a5;
                        }
                        .dq {
                          width: 27%;
                          height: 100%;
                          display: flex;
                          justify-content: center;
                          align-items: center;

                          border-right: 1px solid #0f78a5;
                        }
                        .zb {
                          width: 46%;
                          height: 100%;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          div {
                            margin-right: 15px;
                          }
                        }
                      }
                    }
                  }
                  .cibic_r {
                    width: 35%;
                    height: 100%;
                    background: #fffbf5;
                    border-radius: 10px;
                    border: 1px solid #c1801c;
                    overflow: hidden;
                    .cibic_r_head {
                      height: 45px;
                      background: #ffdfae;
                      border-radius: 10px 10px 0px 0px;
                      border-bottom: 1px solid #c1801c;
                      font-size: 18px;
                      display: flex;
                      align-items: center;
                      .hz {
                        width: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        span {
                          color: #0883b7;
                          margin-left: 10px;
                        }
                      }
                      .zw {
                        width: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        span {
                          color: #ff1111;
                          margin-left: 10px;
                          text-decoration: underline;
                        }
                      }
                    }
                    .cibic_r_content {
                      height: 245px;
                      overflow-y: auto;
                      .cibic_r_item {
                        width: 50%;
                        height: 30px;
                        font-size: 18px;
                        display: inline-block !important;
                        text-align: center;
                        line-height: 30px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>