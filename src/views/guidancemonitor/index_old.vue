<template>
  <div class="guidancemonitor">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <div class="input_box">
          <div class="input_box_title">体检中心：</div>
          <el-select
            size="mini"
            v-model="meccode"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in meccodeItems"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="btn_box">
          <el-button size="mini" type="primary" plain @click="handleTriagStatic"
            >刷 新</el-button
          >
          <el-button size="mini" type="primary" plain @click="handleClosePage"
            >关 闭</el-button
          >
        </div>
      </div>
      <div class="mainbody">
        <el-row class="mainbody_box">
          <el-col :span="3" class="tree_box">
            <el-tree
              ref="pageTree"
              class="pageTree"
              :data="treeData"
              node-key="id"
              :props="defaultProps"
              :default-expand-all="true"
              :default-checked-keys="defaultChecked"
              @node-click="handleNodeClick"
            >
              <span
                class="custom-tree-node"
                :ref="`treeItem_${data.id}`"
                slot-scope="{ node, data }"
              >
                <i class="el-icon-menu"></i> {{ node.label }}
              </span>
            </el-tree>
          </el-col>
          <el-col :span="21" class="content">
            <div
              class="content_item"
              v-for="(item, index) in pageData"
              :key="index"
            >
              <div v-if="item.roomitems.length > 0">
                <div class="content_item_title">{{ item.areaname }}</div>
                <div class="content_item_box">
                  <el-card
                    class="box-card"
                    v-for="(value, ind) in item.roomitems"
                    :key="ind"
                  >
                    <div class="bc_top">
                      <div class="bctop_item">
                        {{ value.roomitem.roomname }}
                      </div>
                      <div class="bctop_item">
                        {{ value.roomitem.roomdoctorname }}
                      </div>
                      <div class="bctop_item bgg">
                        {{ value.roomitem.roomstatuscn }}
                      </div>
                    </div>
                    <div class="bc_center">
                      <div class="bcc_item">
                        <div class="bcci_l bgg">排队</div>
                        <div class="bcci_r">{{ value.paiduiCount }}</div>
                      </div>
                      <div class="bcc_item">
                        <div class="bcci_l">已检</div>
                        <div class="bcci_r">{{ value.completeCount }}</div>
                      </div>
                      <div class="bcc_item nom">
                        <div class="bcci_l">时长</div>
                        <div class="bcci_r">{{ value.waittime }}分/人</div>
                      </div>
                    </div>
                    <div class="bc_check">
                      <div class="bcc_title">
                        检查：{{ value.checkingitem.regid == "" ? "" : 1 }}
                      </div>
                      <div class="bcc_content">
                        <div class="bcc_box">
                          <div class="bccc_name">
                            {{ value.checkingitem.name }}
                          </div>
                          <div class="bccc_sex">
                            {{ value.checkingitem.sex }}
                          </div>
                          <div class="bccc_regid">
                            {{ value.checkingitem.regid }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="bc_check">
                      <div class="bcc_title">排队：{{ value.paiduiCount }}</div>
                      <div class="bcc_content">
                        <div
                          class="bcc_box"
                          v-for="(itemsss, indexsss) in value.paiduiitems"
                          :key="indexsss"
                          :class="indexsss > 0 ? 'mt1' : ''"
                        >
                          <div class="bccc_name">{{ itemsss.name }}</div>
                          <div class="bccc_sex">{{ itemsss.sex }}</div>
                          <div class="bccc_regid">{{ itemsss.regid }}</div>
                        </div>
                      </div>
                    </div>
                  </el-card>
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
import { TriagStatic } from "@/api/triag.js";
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
    };
  },

  async mounted() {
    await this.handleGetMeccode();
    await this.handleLoadTriagArea();
  },

  methods: {
    // 区域管理字典列表回调
    handleLoadTriagArea() {
      LoadTriagArea({
        page: 1,
        limit: 100000,
        key: "",
      })
        .then((res) => {
          if (!res.data) {
            this.treeData = [
              {
                code: "",
                name: "全部",
              },
            ];
          }
          this.treeData.push(...res.data);
          this.handleTriagStatic();
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
      this.handleTriagStatic();
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
        }
        .content {
          box-sizing: border-box;
          padding-left: 8px;
          height: 100%;
          overflow-y: auto;
          .content_item {
            margin-top: 12px;
            .content_item_title {
              font-size: 16px;
              font-weight: 600;
            }
            .content_item_box {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              .box-card {
                width: 24.6%;
                margin-top: 12px;
                padding: 8px;
                background-color: #e2f5fd;
                margin-right: 0.4%;
                .el-card__body {
                  padding: 0;
                }
                .bc_top {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-weight: 600;
                  background-color: #81d3f8;
                  border-radius: 4px;
                  .bctop_item {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  .bgg {
                    background-color: #caf982;
                    border-radius: 4px;
                  }
                }
                .bc_center {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin: 10px 0;
                  .bcc_item {
                    height: 30px;
                    flex: 1;
                    display: flex;
                    border: 1px solid #ccc;
                    margin-right: 4px;
                    font-size: 14px;
                    font-weight: 600;
                    .bcci_l {
                      flex: 1;
                      border-right: 1px solid #ccc;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background-color: #81d3f8;
                    }
                    .bcci_r {
                      flex: 1;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background-color: #fff;
                    }
                    .bgg {
                      background-color: #caf982;
                    }
                  }
                  .nom {
                    margin-right: 0;
                  }
                }
                .bc_check {
                  display: flex;
                  margin-bottom: 10px;
                  .bcc_title {
                    font-weight: 600;
                    margin-right: 12px;
                    width: 30%;
                  }
                  .bcc_content {
                    width: 70%;
                    .mt1 {
                      margin-top: 10px;
                    }
                    .bcc_box {
                      display: flex;
                      justify-content: space-between;
                      .bccc_name,
                      .bccc_sex {
                        margin-right: 12px;
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