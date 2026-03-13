 <template>
  <div class="qualitycontrol">
    <div class="head_box">
      <!-- 头部按钮组 -->
      <div class="btn_group">
        <el-radio-group v-model="pageFlag" size="small">
          <el-radio-button label="bbyc">标本异常</el-radio-button>
          <el-radio-button label="bgzl">报告质量</el-radio-button>
          <el-radio-button label="jagl">积案管理</el-radio-button>
          <el-radio-button label="zyyc">重要异常</el-radio-button>
          <el-radio-button label="qtyx">群体阳性</el-radio-button>
        </el-radio-group>
        <permission-btn
          moduleName="personalregister"
          ref="personalregister"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <!-- 筛选表单条件 -->
      <div class="time_box">
        <div class="time_item">
          <div class="time_title">登记时间</div>
          <el-date-picker
            v-model="triageTime"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleChangeTriageTime"
          >
          </el-date-picker>
        </div>
        <div class="time_item">
          <div class="time_title">体检号</div>
          <el-input
            placeholder="请输入体检号"
            size="mini"
            v-model="searchForm.regid"
            @keyup.enter.native="handleGetCustomerQcProcessList"
            @clear="handleGetCustomerQcProcessList"
            clearable
          >
          </el-input>
        </div>
        <div class="time_item">
          <div class="time_title">姓名</div>
          <el-input
            placeholder="请输入姓名"
            size="mini"
            v-model="searchForm.name"
            @keyup.enter.native="handleGetCustomerQcProcessList"
            @clear="handleGetCustomerQcProcessList"
            clearable
          >
          </el-input>
        </div>
      </div>
    </div>
    <!-- 页面主体 -->
    <div class="subject">
      <el-row>
        <el-col :span="14" class="subject_l">
          <el-radio-group v-model="tableFlag" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="wtz">未通知</el-radio-button>
            <el-radio-button label="ytz">已通知</el-radio-button>
          </el-radio-group>
          <div class="page_table">
            <vxe-table
              height="auto"
              border="inner"
              show-overflow
              :loading="loading"
              highlight-hover-row
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              @cell-click="handlePersonnelCheck"
              :data="personnelListData"
              :sort-config="{ trigger: 'cell' }"
            >
              <vxe-table-column
                type="seq"
                title="序"
                width="50px"
                show-overflow
              ></vxe-table-column>
              <vxe-table-column
                field="regdate"
                title="体检时间"
                width="160px"
                show-overflow
              ></vxe-table-column>
              <vxe-table-column
                field="regid"
                width="110px"
                title="体检号"
                show-overflow
              >
              </vxe-table-column>
              <vxe-table-column
                field="name"
                width="110px"
                title="姓名"
                show-overflow
              >
              </vxe-table-column>
              <vxe-table-column
                field="sex"
                width="110px"
                title="性别"
                show-overflow
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                field="companyname"
                width="100px"
                title="团检名称"
                show-overflow
              ></vxe-table-column>
              <vxe-table-column
                field="telephone"
                title="电话"
                width="150px"
                show-overflow
              ></vxe-table-column>
              <vxe-table-column
                field="status"
                title="状态"
                width="100px"
                show-overflow
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0" style="color: #ca353a"
                    >未通知</span
                  >
                  <span v-if="scope.row.status == 1" style="color: #004ba8"
                    >已通知</span
                  >
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </el-col>
        <el-col :span="10" class="subject_r">
          <div class="subject_r_t">
            <!-- 头部标题 -->
            <div class="head_title">
              <div class="head_logo"></div>
              <!-- <div class="head-logo"></div> -->
              <p>基本信息</p>
            </div>
            <el-form ref="form" disabled :model="userInfo" label-width="80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item size="mini" label="体检号">
                    <el-input v-model="userInfo.regid" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item size="mini" label="姓名">
                    <el-input v-model="userInfo.name" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item size="mini" label="年龄">
                    <el-input v-model="userInfo.age" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item size="mini" label="婚姻">
                    <el-input v-model="userInfo.marriage" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item size="mini" label="性别">
                    <el-input v-model="userInfo.sexCN" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item size="mini" label="体检时间">
                    <el-input v-model="userInfo.regdate" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="subject_r_b">
            <!-- 头部标题 -->
            <div class="head_title">
              <div class="head_logo"></div>
              <!-- <div class="head-logo"></div> -->
              <p>处理记录</p>
            </div>
            <div class="subject_r_b_box">
              <div class="time_item">
                <div class="time_title">通知对象</div>
                <el-radio-group v-model="userInfo.noticeobject">
                  <el-radio label="体检者本人">体检者本人</el-radio>
                  <el-radio label="体检者家属">体检者家属</el-radio>
                </el-radio-group>
              </div>
              <div class="time_item">
                <div class="time_title">通知电话</div>
                <el-input size="mini" v-model="userInfo.noticetel" clearable>
                </el-input>
              </div>
              <div class="time_item">
                <div class="time_title">异常项目</div>
                <el-input size="mini" v-model="userInfo.tagcontent" clearable>
                </el-input>
              </div>
              <div class="time_item">
                <div class="time_textarea">处理说明</div>
                <el-input
                  type="textarea"
                  :rows="4"
                  resize="none"
                  v-model="userInfo.explain"
                  clearable
                >
                </el-input>
              </div>
              <div class="time_item">
                <div class="time_title">处理结果</div>
                <el-radio-group v-model="userInfo.status">
                  <el-radio :label="0">已通知</el-radio>
                  <el-radio :label="1">继续通知</el-radio>
                </el-radio-group>
              </div>
              <div class="time_item">
                <el-row>
                  <el-col :span="12">
                    <div class="time_title">操作人</div>
                    <el-input
                      size="mini"
                      disabled
                      v-model="userInfo.operatorname"
                      clearable
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="12">
                    <div class="time_title">操作时间</div>
                    <el-date-picker
                      disabled
                      v-model="userInfo.operatdate"
                      size="mini"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                  </el-col>
                </el-row>
              </div>
              <div class="time_item time_btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleSetCustomerQcProcessSave"
                  >保 存</el-button
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
 <script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import {
  getCustomerQcProcessList,
  setCustomerQcProcessSave,
} from "@/api/qualitycontrol.js";
export default {
  name: "qualitycontrol",

  components: { Sticky, permissionBtn },
  data() {
    return {
      pageFlag: "bbyc",
      searchForm: {
        regid: "",
        name: "",
        startdate: "",
        enddate: "",
      },
      triageTime: [],
      tableFlag: "all",
      loading: false,
      personnelListData: [],
      userInfo: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        orgId: "",
        parentId: "",
        key: undefined,
        tableName: "Dic_department",
      },
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mounted() {
    // 获取检索时间条件默认日期范围
    this.handleGetSearchTime();
  },
  methods: {
    // 质控列表人员修改保存
    handleSetCustomerQcProcessSave() {
      setCustomerQcProcessSave({
        qcid: this.userInfo.qcid,
        noticeobject: this.userInfo.noticeobject,
        noticetel: this.userInfo.noticetel,
        tagcontent: this.userInfo.tagcontent,
        explain: this.userInfo.explain,
        status: this.userInfo.status,
      })
        .then((res) => {
          this.$message.success(res.message);
          this.handleGetCustomerQcProcessList();
        })
        .catch((err) => {
          this.$message.warning(err.message);
        });
    },
    // 获取质控人员列表数据
    handleGetCustomerQcProcessList() {
      let whereitems = [];
      Object.keys(this.searchForm).forEach((k) => {
        if (this.searchForm[k] != "") {
          whereitems.push({
            key: k,
            value: this.searchForm[k],
          });
        }
      });
      getCustomerQcProcessList({
        page: 1,
        limit: 1000000,
        whereitems,
      })
        .then((res) => {
          this.personnelListData = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.personnelListData = [];
          this.loading = false;
        });
    },
    // 用户列表选中数据行回调
    handlePersonnelCheck({ row }) {
      this.userInfo = JSON.parse(JSON.stringify(row));
      this.userInfo.sexCN =
        this.userInfo.sex == 0 ? "未知" : this.userInfo.sex == 1 ? "男" : "女";
    },
    // 获取检索时间条件更改回调
    handleChangeTriageTime(value) {
      if (value) {
        this.triageTime = [value[0], value[1]];
        this.searchForm.startdate = value[0];
        this.searchForm.enddate = value[1];
      } else {
        this.searchForm.startdate = "";
        this.searchForm.enddate = "";
      }
      this.handleGetCustomerQcProcessList();
    },
    // 获取检索时间条件默认日期范围
    handleGetSearchTime() {
      let prevMonth = new Date(+new Date() - 3600 * 1000 * 24 * 30)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      let today = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.triageTime = [prevMonth, today];
      this.searchForm.startdate = prevMonth;
      this.searchForm.enddate = today;
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
        case "btnSearch": // 检索
          this.handleGetCustomerQcProcessList();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
  },
  watch: {},
};
</script>
 
 <style lang='scss' scoped>
@import "./css/index.scss";
</style>