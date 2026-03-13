<template>
  <div class="triagguidecall">
    <!-- 分诊弹框 -->
    <div class="triage_ejectbox">
      <!-- 标题与隐藏 -->
      <div class="title_btn">
        <div class="tb_title">排队详情</div>
        <!-- <div class="tb_btn">
          <img src="./images/yincang.png" alt="" draggable="false" />
          <div>隐藏</div>
        </div> -->
      </div>
      <!-- 头部按钮组 -->
      <div class="top_btn">
        <el-button class="bgc1" size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagCall">
          <img src="./images/jh.png" alt="" draggable="false" />
          <div>叫号</div>
        </el-button>
        <!-- <el-button size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagComplete">完成</el-button> -->
        <el-button class="bgc2" size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagSkip">
          <img src="./images/gh.png" alt="" draggable="false" />
          <div>过号</div>
        </el-button>
        <el-button class="bgc3" size="small" type="primary" v-if="changeType == 1" @click="handleTriagChangeType(0)">
          <img src="./images/zt.png" alt="" draggable="false" />
          <div>恢复</div>
        </el-button>
        <el-button class="bgc3" size="small" type="primary" v-if="changeType == 0" @click="handleTriagChangeType(1)">
          <img src="./images/zt.png" alt="" draggable="false" />
          <div>暂停</div>
        </el-button>
        <el-button class="bgc4" size="small" type="primary" v-if="triagData.roomstatus == 0" @click="handleTriagClose">
          <img src="./images/tz.png" alt="" draggable="false" />
          <div>停诊</div>
        </el-button>
        <el-button class="bgc4" size="small" type="primary" v-if="triagData.roomstatus == 1" @click="handleTriagOpen">
          <img src="./images/tz.png" alt="" draggable="false" />
          <div>开诊</div>
        </el-button>
        <el-button class="bgc5" size="small" type="primary" @click="handleCloseTriag">
          <img src="./images/gb.png" alt="" draggable="false" />
          <div>关闭</div>
        </el-button>
      </div>
      <div class="top_btn1">
        <div class="sex_box" style="display: flex; align-items: center;">
          <div class="sex_box_title">性别：</div>
          <el-select style="width: 100px;" v-model="isShowSex" @change="handleTriagSex" size="mini" placeholder="请选择">
            <el-option label="未限制" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </div>
        <el-input placeholder="请输入体检号" :class="[!!currentTriag.queueno?'bg_c':'']" :disabled="!!currentTriag.queueno" style="width: 200px;" size="mini" v-model="regidCheck" clearable @keyup.native.enter="handleRegidCheck">
        </el-input>

        <!-- <el-button size="small" type="primary" @click="handleTriagSex(1)" v-if="isShowSex == 0">未限制性别</el-button>
                <el-button size="small" type="primary" @click="handleTriagSex(0)" v-if="isShowSex == 1">已限制性别</el-button> -->
      </div>
      <div class="current_message">
        <div class="cm_message">
          <div class="cmtitle">当前叫号：</div>
          <!-- {{ currentTriag.checkitem }} -->
          <div class="cmcbox">
            <div class="cmcbox_item">{{ currentTriag.queueno }}</div>
            <div class="cmcbox_item" v-if="currentTriag.name">{{ currentTriag.name }}({{ currentTriag.callnumber + 1 }})</div>
            <div class="cmcbox_item">
              {{ currentTriag.sex == 0 ? "未知" : currentTriag.sex == 1 ? "男" : currentTriag.sex == 2 ? "女" : "" }}
            </div>
          </div>
        </div>
        <!-- <el-card class="box-card">
          <div class="cmtitle">当前叫号：</div>
          {{ currentTriag.checkitem }}
          <div class="cmcbox">
            <div class="cmcbox_item">{{ currentTriag.queueno }}</div>
            <div class="cmcbox_item" v-if="currentTriag.name">{{ currentTriag.name }}({{ currentTriag.callnumber + 1 }})</div>
            <div class="cmcbox_item">
              {{ currentTriag.sex == 0 ? "未知" : currentTriag.sex == 1 ? "男" : currentTriag.sex == 2 ? "女" : "" }}
            </div>
          </div>
        </el-card> -->
        <el-button size="small" type="primary" :disabled="triagData.roomstatus == 1" @click="handleTriagComplete">完成</el-button>
      </div>
      <div class="eject_table_box">
        <div class="tab_top">
          <el-radio-group fill="#339CED" v-model="ejectStatus" size="mini">
            <el-radio-button label="待检"></el-radio-button>
            <el-radio-button label="已检"></el-radio-button>
            <el-radio-button label="过号"></el-radio-button>
          </el-radio-group>
          <div class="tab_top_tt">记录数：{{ ejectStatus == "待检" ? queuePaiDuiList.length : ejectStatus == "已检" ? completeList.length : guohaoList.length }}</div>
        </div>
        <!-- 人员表格 -->
        <div class="ejecttable_box">
          <vxe-table ref="ejecttable" border="default" stripe class="ejecttable" round height="395px" :loading="ejectLoading" highlight-hover-row :data="ejectStatus == '待检' ? queuePaiDuiList : ejectStatus == '已检' ? completeList : guohaoList" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
            <vxe-table-column field="queueno" title="排队号" show-header-overflow show-overflow="title" width="70px" show-footer-overflow>
              <template slot-scope="scope">
                <el-badge v-if="scope.row.status == 2" value="过" class="item">
                  <span>{{ scope.row.queueno }}</span>
                </el-badge>
                <span v-else>{{ scope.row.queueno }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="姓名" show-header-overflow show-overflow="title" width="90px" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="sex" title="性别" show-header-overflow show-overflow="title" width="60px" show-footer-overflow>
              <template slot-scope="scope">
                <span>{{ scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女" }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="regid" title="体检号" show-header-overflow min-width="140px" show-overflow="title" show-footer-overflow></vxe-table-column>
            <!-- <vxe-table-column v-if="ejectStatus == '过号'" field="name" title="操作" show-header-overflow show-overflow="title" width="60px" show-footer-overflow>
              <template slot-scope="scope">
                <el-link v-if="ejectStatus == '过号'" type="primary" @click="handleTriagRestore(scope.row)">恢复</el-link>
                <el-link type="primary" @click="handleTriagCall(scope.row)">叫号</el-link>
              </template>
            </vxe-table-column> -->
          </vxe-table>
        </div>
        <div class="tab_btm">
          <div class="tab_btm_tt">诊室：{{ triagData.roomname || "暂无" }}</div>
          <div class="tab_btm_tt">用户：{{ triagData.doctorname || triagData.doctorcode }}</div>
          <el-button type="primary" size="mini" @click="handleShowDepart">诊室</el-button>
        </div>
      </div>
    </div>
    <!-- 点击配置科室弹框 -->
    <el-dialog title="" class="tedepart_dia" :visible.sync="showDepart" width="50%" :show-close="false" :close-on-click-modal="false">
      <span class="tedepart_dia_content">
        <div class="tetop">
          <div>检索</div>
          <el-input placeholder="请输入内容" size="mini" v-model="tetopRetrieval" @keyup.enter.native="handleLoadRoomList" clearable> </el-input>
        </div>
        <!-- 人员表格 -->
        <div class="tediatable_box">
          <vxe-table ref="tediatable" class="tediatable" height="490px" :loading="ejectLoading" highlight-hover-row :data="tediaTableData" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName">
            <vxe-table-column field="code" title="诊室编码" show-header-overflow show-overflow="title" width="100px" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="name" title="诊室名称" show-header-overflow show-overflow="title" show-footer-overflow>
              <template slot-scope="scope">
                <el-link type="primary" :disabled="scope.row.doctorcode != null" @click="handleChooseTediaTableData(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </vxe-table-column>
            <vxe-table-column field="roomno" title="房间号" show-header-overflow width="100px" show-overflow="title" show-footer-overflow> </vxe-table-column>
            <vxe-table-column field="doctorname" title="诊室医生" show-header-overflow width="150px" show-overflow="title" show-footer-overflow> </vxe-table-column>
            <vxe-table-column field="areaname" title="区域名称" show-header-overflow width="150px" show-overflow="title" show-footer-overflow> </vxe-table-column>
            <vxe-table-column field="queuename" title="队列名称" show-header-overflow width="150px" show-overflow="title" show-footer-overflow> </vxe-table-column>
          </vxe-table>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showDepart = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 点击完成弹出提示弹框 - 分诊 -->
    <el-dialog title="" class="tefinish_dia" :visible.sync="showFinish" width="34%" :show-close="false" :close-on-click-modal="false">
      <span>
        <div class="tetop_userinfo">
          <div class="tetop_item">姓名：{{ currentTriag.name }}</div>
          <div class="tetop_item">性别：{{ currentTriag.sex == 0 ? "未知" : currentTriag.sex == 1 ? "男" : currentTriag.sex == 2 ? "女" : "" }}</div>
          <div class="tetop_item">体检号：{{ currentTriag.regid }}</div>
        </div>
        <div class="dtmessage">
          <div class="dtm_item">
            <div class="sgb">导诊信息</div>
          </div>
          <div class="dtm_item" v-for="item in finishTriag" :key="item">
            <div class="sgb">{{ item }}</div>
          </div>
          <!-- <div class="dtm_item">
            <div>检查科室：</div>
            <div class="sgb">{{ finishTriag.roomname }}</div>
          </div>
          <div class="dtm_item">
            <div>检查项目：</div>
            <div class="sgb">{{ finishTriag.combineneme }}</div>
          </div>
          <div class="dtm_item">
            <div>队列人数：</div>
            <div class="sgb">{{ finishTriag.queuecount }}人</div>
          </div>
          <div class="dtm_item">
            <div>预计等待：</div>
            <div class="sgb">{{ finishTriag.waittime }}分钟</div>
          </div> -->
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleNextShowFinish">呼叫下一位</el-button>
        <el-button size="mini" @click="handleCloseShowFinish">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import {
  TriagDetail,
  LoadTriagRoom,
  TriagSave,
  TriagOpen,
  TriagClose,
  TriagCall,
  TriagSkip,
  TriagComplete,
  TriagRestore,
  WorkPage,
  CallNoRoom,
  TriagCompleteNotQueue,
  TriagDelete,
  ChangeRoomStopStatus,
} from "@/api/triag.js";
export default {
  name: "triagguidecall",

  components: {},

  data() {
    return {
      currentTriag: {},
      queuePaiDuiList: [], // 待检
      completeList: [], // 已检
      guohaoList: [], // 过号
      ejectStatus: "待检",
      ejectLoading: false,
      ejectData: [],
      triagData: {},
      finishTriag: {},
      showFinish: false,
      showDepart: false,
      tetopRetrieval: "",
      tediaTableData: [],
      userInfo: null,
      isShowSex: 0,
      regidCheck: "",
      changeType: 0,
    };
  },

  computed: {
    ...mapState({
      socketObj: (state) => state.user.socketObj,
    }),
    ...mapGetters(["visitedViews"]),
  },

  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || null;
    if (!this.triagData.roomname) {
      this.handleTriagDetailNew();
    }
  },

  methods: {
    handleTriagChangeType(status) {
      if (!this.triagData.roomcode) {
        this.$message.warning("请先配置科室");
        return;
      }
      this.changeType = status;
      ChangeRoomStopStatus({
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
        changeType: status,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
      });
    },
    handleTriagSex(sex) {
      if (!this.triagData.roomcode) {
        this.$message.warning("请先配置科室");
        return;
      }
      //   this.isShowSex = sex;
      TriagSave({
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
        roomstatus: this.triagData.roomstatus,
        roomsex: sex,
        // roomsex: sex == 1 ? this.userInfo.sex : 0,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "已选择",
        });
        this.handleTriagDetail();
      });
    },
    handleCloseTriag() {
      let temp =
        this.ejectStatus == "待检"
          ? "queuePaiDuiList"
          : this.ejectStatus == "已检"
          ? "completeList"
          : "guohaoList";
      if (this[temp] && this[temp].length > 0) {
        this.$message.warning("当前列表存在人员暂无法关闭!");
        return;
      }
      TriagDelete({
        roomcode: this.triagData.roomcode,
      }).then((res) => {
        this.$message.success(res.message);
        this.triagData = {};
        this.handleClosePage();
      });
      return;
      if (this.triagData.roomstatus == 0) {
        this.$confirm(`${this.triagData.roomname}诊室 是否停诊？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showClose: false,
          closeOnClickModal: false,
        })
          .then(() => {
            TriagClose({
              roomcode: this.triagData.roomcode,
              queuecode: this.triagData.queuecode,
            }).then((res) => {
              this.$message.success(res.message);
              this.triagData = {};
              this.showTriageDia = false;
            });
          })
          .catch(() => {
            this.triagData = {};
            this.showTriageDia = false;
          });
      } else {
        this.triagData = {};
        this.showTriageDia = false;
        // this.handleClosePage();
      }
      this.currentTriag = {};
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
    // 发送和接收消息
    handdleMsg(msg) {
      let that = this;
      console.log(that.$global.ws);
      if (that.$global.ws && that.$global.ws.readyState == 1) {
        console.log("发送信息", msg);
        that.$global.ws.send(msg);
      }
      that.$global.ws.onmessage = function (msg) {
        console.log("收到服务器内容", msg);
        if (msg.data != "连接成功" && JSON.parse(msg.data)) {
          const data = JSON.parse(msg.data);
          console.log("收到data", data);
          if (data.isLoginOut) {
            that
              .$confirm("此账号已在别处登录!", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                type: "warning",
              })
              .then(() => {
                that.$store.dispatch("LogOut").then(() => {
                  localStorage.removeItem("userId");
                  location.reload(); // 为了重新实例化vue-router对象 避免bug
                  // socketService.close();
                });
              })
              .catch(() => {});
          } else if (
            data.Fingercode &&
            data.Fingercode == localStorage.getItem("md5code")
          ) {
            console.log(that.chooseProjectArr, "666");
            if (data.ItemList && data.ItemList.length > 0) {
              for (let i = 0; i < that.chooseProjectArr.length; i++) {
                let index = data.ItemList.findIndex(
                  (k) => k.itemcode === that.chooseProjectArr[i].itemcode
                );
                if (index > -1) {
                  that.chooseProjectArr[i].result = data.ItemList[index].result;
                  that.chooseProjectArr[i].describe =
                    data.ItemList[index].describe;
                }
              }
              for (let i = 0; i < that.chooseDepart.items.length; i++) {
                let index = data.ItemList.findIndex(
                  (k) => k.itemcode === that.chooseDepart.items[i].itemcode
                );
                if (index > -1) {
                  that.chooseDepart.items[i].result =
                    data.ItemList[index].result;
                  that.chooseDepart.items[i].describe =
                    data.ItemList[index].describe;
                }
              }
              that.handleGetConclusionDetail();
            }
          } else if (data.businessType == "Customer_triag_queueRoom") {
            that.queuePaiDuiList = data.RoomPaiDuiList.map((k) => {
              return {
                ...k,
                id: k.Id,
              };
            });
            that.completeList = data.CompleteList.map((k) => {
              return {
                ...k,
                id: k.Id,
              };
            });
            that.guohaoList = data.GuohaoList.map((k) => {
              return {
                ...k,
                id: k.Id,
              };
            });
          }
        }
      };
    },
    jsonSf(data) {
      return JSON.stringify(data);
    },
    handleNextShowFinish() {
      this.currentTriag = {};
      this.handleTriagCall();
      this.handleCloseShowFinish();
    },
    handleCloseShowFinish() {
      this.currentTriag = {};
      this.finishTriag = {};
      this.showFinish = false;
    },
    // 点击恢复回调
    handleTriagRestore(row) {
      if (row && row.id) {
        TriagRestore({
          id: row.id || "",
        }).then((res) => {
          WorkPage({
            roomcode: row.roomcode,
            queuecode: row.queuecode,
          }).then((res) => {
            this.$message.success(res.message);
          });
        });
      } else {
        this.$message.warning("当前人员暂无ID");
      }
    },
    // 输入体检号回车触发
    handleRegidCheck() {
      if (!this.regidCheck.trim()) {
        this.$message.warning("输入体检号不可为空!");
        return;
      }
      if (!this.triagData.roomcode) {
        this.$message.warning("当前暂无科室数据");
        return;
      }
      CallNoRoom({
        regid: this.regidCheck.trim(),
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
      })
        .then((res) => {
          if (!res.result) return;
          this.currentTriag = res.result;
          this.$message.success(res.message);
        })
        .finally(() => {
          this.regidCheck = "";
        });
    },
    // 点击叫号回调
    handleTriagCall(row) {
      if (row && row.id) {
        TriagCall({
          id: row.id || "",
          roomcode: row.roomcode,
          queuecode: row.queuecode,
        }).then((res) => {
          if (!res.result) return;
          this.currentTriag = res.result;
          this.$message.success(res.message);
        });
      } else {
        TriagCall({
          id: this.currentTriag.id || "",
          roomcode: this.triagData.roomcode,
          queuecode: this.triagData.queuecode,
        }).then((res) => {
          if (!res.result) {
            this.currentTriag = {};
            return;
          }
          this.currentTriag = res.result;
          this.$message.success(res.message);
        });
      }
    },
    // 点击过号(跳号)回调
    handleTriagSkip() {
      if (!this.currentTriag.id) {
        this.$message.warning("当前暂无需要过号人员!");
        return;
      }
      TriagSkip({
        id: this.currentTriag.id,
      }).then((res) => {
        this.$message.success(res.message);
        this.currentTriag = {};
        this.handleTriagDetail();
      });
    },
    // 点击完成回调
    handleTriagComplete() {
      // this.showFinish = true;
      if (!this.currentTriag.id) {
        TriagCompleteNotQueue({
          regid: this.currentTriag.regid,
          roomcode: this.triagData.roomcode,
          queuecode: this.triagData.queuecode,
          combinecode: this.currentTriag.combinecode,
        }).then((res) => {
          if (!res.result) return;
          this.finishTriag = res.result;
          this.showFinish = true;
        });
      } else {
        TriagComplete({ id: this.currentTriag.id }).then((res) => {
          if (!res.result) return;
          this.finishTriag = res.result;
          this.showFinish = true;
        });
      }
    },
    // 点击打开导诊弹框
    handleOpenTriagDia() {
      TriagDetail().then((res) => {
        res.result && (this.triagData = res.result);
        this.showTriageDia = true;

        // this.handdleMsg(
        //   this.jsonSf({
        //     action: "join",
        //     nick: this.userInfo.usercode,
        //     roomno: "Customer_triag_queueRoom",
        //   })
        // );
      });
    },
    // 点击开诊回调
    handleTriagOpen() {
      if (!this.triagData.roomcode) {
        this.$message.warning("当前暂无科室数据");
        return;
      }
      if (!this.triagData.isSave) {
        TriagSave({
          roomcode: this.triagData.roomcode,
          queuecode: this.triagData.queuecode,
          roomstatus: 1,
          roomsex: this.isShowSex,
        }).then((res) => {
          TriagOpen({
            roomcode: this.triagData.roomcode,
            queuecode: this.triagData.queuecode,
          }).then((res) => {
            this.$message.success(res.message);
            this.handleTriagDetail();
          });
        });
      } else {
        TriagOpen({
          roomcode: this.triagData.roomcode,
          queuecode: this.triagData.queuecode,
        }).then((res) => {
          this.$message.success(res.message);
          this.handleTriagDetail();
        });
      }
    },
    // 点击停诊回调
    handleTriagClose() {
      if (!this.triagData.roomcode) {
        this.$message.warning("当前暂无科室数据");
        return;
      }
      TriagClose({
        roomcode: this.triagData.roomcode,
        queuecode: this.triagData.queuecode,
      }).then((res) => {
        this.$message.success(res.message);
        this.handleTriagDetail();
      });
    },
    // 获取医生当天诊室-新
    handleTriagDetailNew() {
      TriagDetail().then((res) => {
        if (!res.result) return;
        this.triagData = res.result;
        this.currentTriag = res.result.roomChecking || {};
        // roomstatus 0- 开诊 1-开停
        if (this.triagData.roomstatus == 0) {
          TriagOpen({
            roomcode: this.triagData.roomcode,
            queuecode: this.triagData.queuecode,
          }).then((res) => {
            this.$message.success(res.message);
          });
        }
        console.log(this.triagData);
      });
    },
    // 获取医生当天诊室
    handleTriagDetail() {
      TriagDetail().then((res) => {
        if (!res.result) return;
        this.triagData = res.result;
        // roomstatus 0- 开诊 1-开停
        console.log(this.triagData);
      });
    },
    // 获取科室列表配置数据
    handleShowDepart() {
      LoadTriagRoom({
        page: 1,
        limit: 100000,
        key: this.tetopRetrieval.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.tediaTableData = [];
            return;
          }
          this.tediaTableData = res.data.filter((t) => t.status == 0);
          this.showDepart = true;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取诊室字典数据列表回调
    handleLoadRoomList() {
      this.loading = true;
      LoadTriagRoom({
        page: 1,
        limit: 100000,
        key: this.tetopRetrieval.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.tediaTableData = [];
            return;
          }
          this.tediaTableData = res.data.filter((t) => t.status == 0);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /* 点击选中当前科室 */
    handleChooseTediaTableData(row) {
      this.$confirm(`当前选择的科室为【${row.name}】, 是否确认?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          TriagSave({
            roomcode: row.code,
            queuecode: row.queuecode,
            roomstatus: 1,
            roomsex: row.sexcontrol,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "已选择",
            });
            this.showDepart = false;
            this.handleTriagDetail();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#fff";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#2392D7";
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

  watch: {
    socketObj: {
      handler(newVal, oldVal) {
        console.log(newVal, "newVal");
        let that = this;
        let data = newVal;
        if (data.isLoginOut) {
          that
            .$confirm("此账号已在别处登录!", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: "warning",
            })
            .then(() => {
              that.$store.dispatch("LogOut").then(() => {
                localStorage.removeItem("userId");
                location.reload(); // 为了重新实例化vue-router对象 避免bug
                // socketService.close();
              });
            })
            .catch(() => {});
        } else if (
          data.Fingercode &&
          data.Fingercode == localStorage.getItem("md5code")
        ) {
          if (data.ItemList && data.ItemList.length > 0) {
            for (let i = 0; i < that.chooseProjectArr.length; i++) {
              let index = data.ItemList.findIndex(
                (k) => k.itemcode === that.chooseProjectArr[i].itemcode
              );
              if (index > -1) {
                that.chooseProjectArr[i].result = data.ItemList[index].result;
                that.chooseProjectArr[i].describe =
                  data.ItemList[index].describe;
              }
            }
            for (let i = 0; i < that.chooseDepart.items.length; i++) {
              let index = data.ItemList.findIndex(
                (k) => k.itemcode === that.chooseDepart.items[i].itemcode
              );
              if (index > -1) {
                that.chooseDepart.items[i].result = data.ItemList[index].result;
                that.chooseDepart.items[i].describe =
                  data.ItemList[index].describe;
              }
            }
            that.handleGetConclusionDetail();
          }
        } else if (data.businessType == "Customer_triag_queueRoom") {
          that.queuePaiDuiList = data.RoomPaiDuiList.map((k) => {
            return {
              ...k,
              id: k.Id,
            };
          });
          that.completeList = data.CompleteList.map((k) => {
            return {
              ...k,
              id: k.Id,
            };
          });
          that.guohaoList = data.GuohaoList.map((k) => {
            return {
              ...k,
              id: k.Id,
            };
          });
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.triagguidecall {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
  .triage_ejectbox {
    position: absolute;
    top: 7%;
    left: 50%;
    transform: translateX(-50%);
    width: 429px;
    height: 780px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #ebebeb;
    // width: 470px;
    // height: 650px;
    // background-color: #fff;
    z-index: 1006;
    // box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    // border-radius: 5px;
    box-sizing: border-box;
    padding: 12px 12px 5px 12px;
    .title_btn {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tb_title {
        font-weight: 500;
        font-size: 20px;
        color: #000000;
      }
      .tb_btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        img {
          width: 18px;
          height: 18px;
          margin-right: 5px;
        }
        font-weight: 500;
        font-size: 18px;
        color: #000000;
      }
    }
    .top_btn {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      .el-button {
        width: 68px;
        height: 65px;
        border-radius: 10px;
        font-size: 18px;
        border: 0 none;
        img {
          margin-bottom: 5px;
        }
      }
      .bgc1 {
        background-color: #0fc6a8;
      }
      .bgc2 {
        background-color: #339ced;
      }
      .bgc3 {
        background-color: #f57268;
      }
      .bgc4 {
        background-color: #b976f9;
      }
      .bgc5 {
        background-color: #ff3232;
      }
    }
    .top_btn1 {
      width: 100%;
      height: 34px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .bg_c {
        /deep/.el-input__inner {
          background-color: #f5f7fa !important;
          border-color: #e4e7ed !important;
        }
      }
    }
    .current_message {
      margin: 5px 0 10px 0;
      width: 100%;
      height: 90px;
      display: flex;
      .cm_message {
        height: 90px;
        background: #efefef;
        border-radius: 10px;
        flex: 1;
        padding: 10px;
        .cmtitle {
          font-weight: 500;
          font-size: 18px;
          color: #000000;
        }
        .cmcbox {
          box-sizing: border-box;
          display: flex;
          justify-content: space-around;
          color: #000;
          font-weight: 600;
          font-size: 24px;
        }
      }
      /deep/.el-card {
        border-color: #b3d8ff;
        background: #ecf5ff;
        flex: 1;
        height: 100%;
        .el-card__body {
          padding: 10px;
          height: 100%;
          .cmcbox {
            box-sizing: border-box;
            display: flex;
            justify-content: space-around;
            color: #000;
            font-weight: 600;
            font-size: 24px;
          }
        }
      }
      .el-button {
        margin-left: 5px;
        font-size: 20px;
        width: 77px;
        height: 90px;
        background: #339ced;
        border-radius: 10px;
        border: 0 none;
      }
    }
    .eject_table_box {
      width: 100%;
      height: 470px;
      .tab_top {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .tab_btm {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
      }
      .ejecttable_box {
        width: 100%;
        height: 400px;
        // border-radius: 10px;
        // overflow: hidden;
        /*vxe-table 自定义行高 */
        /deep/.vxe-table .vxe-body--column.col--ellipsis {
          height: 50px;
        }
        /deep/.vxe-table .vxe-body--column:not(.col--ellipsis),
        /deep/.vxe-table .vxe-footer--column:not(.col--ellipsis),
        /deep/.vxe-table .vxe-header--column:not(.col--ellipsis) {
          padding: 5px 0;
          height: 50px;
        }
        /deep/.vxe-cell {
          height: 100%;
          display: flex;
          align-items: center;
        }
        /deep/.vxe-table .vxe-table--header-wrapper {
          border-radius: 10px 10px 0 0;
        }
        /deep/.vxe-table .vxe-table--body-wrapper {
          border-radius: 0 0 10px 10px;
        }
        /deep/.vxe-table--render-default .vxe-body--row.row--stripe {
          background-color: #f3fcff !important; /* 自定义颜色 */
        }
        /deep/ .vxe-table .vxe-header--row .vxe-header--column:last-child {
          background-color: red;
        }
      }
    }
  }
  .tedepart_dia {
    /deep/.el-dialog__body {
      padding: 12px;
      .tedepart_dia_content {
        height: 535px;
        .tetop {
          display: flex;
          margin-bottom: 5px;
          height: 30px;
          > div {
            width: 60px;
            margin-right: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .el-input {
            flex: 1;
          }
        }
        .tediatable_box {
          height: 500px;
          // .tediatable {
          //   height: 100%;
          // }
        }
        .tetop_userinfo {
          display: flex;
          height: 50px;
          background-color: #ecf5ff;
          justify-content: center;
          align-items: center;
        }
      }
    }
    /deep/.el-dialog__footer {
      padding: 0 12px 12px 12px;
      text-align: center;
    }
  }
  .tefinish_dia {
    /deep/.el-dialog__header {
      display: none;
    }
    /deep/.el-dialog__body {
      padding: 0px;
      .tetop_userinfo {
        display: flex;
        height: 50px;
        background-color: #ecf5ff;
        justify-content: space-around;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
      }
      .dtmessage {
        box-sizing: border-box;
        padding: 14px;
        .dtm_item {
          display: flex;
          font-size: 18px;
          .sgb {
            font-weight: 600;
          }
        }
      }
    }
    /deep/.el-dialog__footer {
      padding: 0 12px 12px 12px;
      text-align: center;
    }
  }
}
</style>
