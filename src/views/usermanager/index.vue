<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- <el-button type="primary" style="width: 150px;height: 38px; margin: 5px;" @click="addhospitaluser">设为{{ mecName }}
        </el-button>

        <el-button type="primary" style="width: 150px;height: 38px; margin: 5px;" @click="cancelhospitaluser">
          取消{{ mecName }}</el-button> -->

        <el-input @keyup.enter.native="handleFilter" prefix-icon="el-icon-search" size="small" style="width: 200px; margin-bottom: 0" class="filter-item" :placeholder="'关键字'" v-model="listQuery.key">
        </el-input>

        <permission-btn moduleName="usermanager" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>

        <el-checkbox size="mini" style="margin-left: 15px" @change="tableKey = tableKey + 1" v-model="showDescription">Id/描述
        </el-checkbox>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <el-row :gutter="4" class="fh">
        <el-col :span="6" class="fh ls-border">
          <el-card shadow="never" class="body-small fh" style="overflow: auto">
            <div slot="header" class="clearfix">
              <el-button type="text" style="padding: 0 11px" @click="getAllUsers">全部用户>></el-button>
            </div>

            <el-tree :data="orgsTree" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-card>
        </el-col>
        <el-col :span="18" class="fh">
          <div class="bg-white fh">
            <el-table ref="mainTable" :key="tableKey" :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%" height="calc(100% - 52px)" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
              <el-table-column align="center" type="selection" width="55">
              </el-table-column>

              <el-table-column :label="'Id'" v-if="showDescription" min-width="120px">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="80px" :label="'账号'">
                <template slot-scope="scope">
                  <span class="link-type" @click="handleUpdate(scope.row)">{{
                    scope.row.account
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="80px" :label="'姓名'">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="80px" :label="'性别'">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : ""
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column width="120px" :label="'所属机构'">
                <template slot-scope="scope">
                  <span>{{ scope.row.organizations }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="120px" :label="'所属科室'">
                <template slot-scope="scope">
                  <span>{{ scope.row.deptname }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="120px" :label="'所属角色'" prop="roleName"></el-table-column>
              <el-table-column min-width="120px" :label="'工号'" prop="hisCode"></el-table-column>
              <el-table-column min-width="80px" :label="'类别'">
                <template slot-scope="scope">
                  <span>{{ scope.row.userType }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="150px" v-if="showDescription" :label="'描述'">
                <template slot-scope="scope">
                  <span style="color: red">{{ scope.row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column class-name="status-col" :label="'状态'" width="100">
                <template slot-scope="scope">
                  <span :class="scope.row.status | statusFilter">{{
                    statusOptions.find(
                      (u) => u.key == scope.row.status && scope.row.status != 2
                    ) &&
                    statusOptions.find(
                      (u) => u.key == scope.row.status && scope.row.status != 2
                    ).display_name
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                  <el-button v-if="scope.row.status == 0" size="mini" type="danger" @click="handleModifyStatus(scope.row, 1)">停用</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
          </div>
        </el-col>
      </el-row>
      <el-dialog class="dialog-mini" :close-on-click-modal="false" width="600px" v-el-drag-dialog :show-close="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'Id'" prop="id" v-show="dialogStatus == 'update'">
            <el-input v-model="temp.id" :disabled="true" size="small" placeholder="系统自动处理"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'账号'" prop="account">
            <el-input v-model="temp.account"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'姓名'" prop="name" :rules="[{ required: !temp.name, message: '姓名不能为空' }]">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'性别'" prop="sex">
            <el-select v-model="temp.sex">
              <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'密码'">
            <el-input v-model="temp.password" :placeholder="
                dialogStatus == 'update'
                  ? '如果为空则不修改密码'
                  : '如果为空则默认与账号相同'
              ">
            </el-input>
          </el-form-item>
          <el-form-item size="small" :label="'工号'">
            <el-input v-model="temp.hisCode"> </el-input>
          </el-form-item>
          <el-form-item size="small" :label="'类别'">
            <el-select class="filter-item" multiple v-model="temp.userType" @change="handleChangeUserType">
              <el-option v-for="(item, index) in userTypeitems" :key="index" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'状态'">
            <el-select class="filter-item" v-model="temp.status">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="correnteUser === 'System'" size="small" :label="'是否管理员'">
            <el-radio-group v-model="temp.isAdmin">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item size="small" :label="'折扣范围'" prop="discountProperty">
            <el-input v-model="discountProperty"> </el-input>
          </el-form-item>
          <el-form-item size="small" :label="''">
            <div class="div_tips" style="font-size: 12px">
              设置折扣范围：格式为【折扣1-折扣2，折扣1≠折扣2】，例如：0.7-1
            </div>
          </el-form-item>
          <el-form-item size="small" :label="'所属机构'" prop="selectOrgs">
            <treeselect v-if="dialogFormVisible" :options="orgsTree" :default-expand-level="3" :multiple="true" :flat="true" :open-on-click="true" :open-on-focus="true" :clear-on-select="true" v-model="selectOrgs">
            </treeselect>
          </el-form-item>
          <!-- prop="deptcodes" :rules="[{ required: true,trigger: 'change', message: '所属科室不能为空'}]" -->
          <el-form-item size="small" class="deptcodes_box" :label="'所属科室'">
            <el-select v-model="temp.deptcodes" multiple style="width: 100%" placeholder="请选择">
              <el-option v-for="item in dicdataitems" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary" @click="handleSelectDeptcodesAll">全选</el-button>
          </el-form-item>
          <el-form-item size="small" :label="'备注'">
            <el-input v-model="temp.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }">
            </el-input>
          </el-form-item>
          <el-form-item size="small" :label="'签名图片'">
            <!-- :on-success="handleAvatarSuccess" -->
            <el-upload class="avatar-uploader" action :auto-upload="false" :show-file-list="false" :on-change="handleOnPpload" accept=".jpg,.jpeg">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div v-if="imageUrl" class="del_btn">
                <i class="el-icon-delete" @click.stop="handleDelImageUrl"></i>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="handleCloseEditOrAdd">取消</el-button>
          <el-button size="mini" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog width="516px" :close-on-click-modal="false" class="dialog-mini body-small" v-el-drag-dialog :title="'分配角色'" :visible.sync="dialogRoleVisible">
        <el-form ref="rolesForm" size="small" v-if="dialogRoleVisible" label-position="left">
          <el-form-item>
            <select-roles :roles="selectRoles" :userNames="selectRoleNames" v-on:roles-change="rolesChange">
            </select-roles>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogRoleVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="acceRole">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listToTreeSelect } from "@/utils";
import * as accsssObjs from "@/api/accessObjs";
import * as users from "@/api/users";
import * as apiRoles from "@/api/roles";
import * as login from "@/api/login";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import SelectRoles from "@/components/SelectRoles";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/delRows.js";
import * as dictionary from "@/api/dictionary";
import { mapGetters } from "vuex";
import { getPublicConfig } from "@/api/dataanalysis.js";
export default {
  name: "UserManager",
  components: {
    Sticky,
    permissionBtn,
    Treeselect,
    SelectRoles,
    Pagination,
  },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    var validateSelectOrgs = (rule, value, callback) => {
      if (this.temp.organizationIds === "") {
        callback(new Error("所属机构不能为空"));
      } else {
        callback();
      }
    };
    var discountPropertyChange = (rule, value, callback) => {
      if (this.discountProperty && !this.discountProperty.includes("-")) {
        callback(new Error("折扣范围格式不匹配"));
      } else if (
        typeof +this.discountProperty.split("-")[0] != "number" ||
        +this.discountProperty.split("-")[0] < 0 ||
        +this.discountProperty.split("-")[0] > 1
      ) {
        callback(new Error("折扣格式错误,请参考下面提示"));
      } else if (
        typeof +this.discountProperty.split("-")[1] != "number" ||
        +this.discountProperty.split("-")[1] < 0 ||
        +this.discountProperty.split("-")[1] > 1
      ) {
        callback(new Error("折扣格式错误,请参考下面提示"));
      } else {
        callback();
      }
    };
    return {
      correnteUser: "",
      imageUrl: "",
      defaultProps: {
        // tree配置项
        children: "children",
        label: "label",
      },
      mecName: "体检中心",
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: [],
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        orgId: "",
        parentId: "",
        key: undefined,
        tableName: "Dic_department",
      },
      apps: [],
      statusOptions: [
        {
          key: 1,
          display_name: "停用",
        },
        {
          key: 0,
          display_name: "正常",
        },
      ],
      dicdata: [],
      dicdataitems: [],
      showDescription: false,
      orgs: [], // 用户可访问到的组织列表
      orgsTree: [], // 用户可访问到的所有机构组成的树
      selectRoles: [], // 用户分配的角色
      selectRoleNames: "",
      discountProperty: "",
      temp: {
        id: undefined,
        description: "",
        organizations: "",
        organizationIds: "",
        account: "",
        name: "",
        password: "",
        hisCode: "",
        status: 0,
        deptcodes: "",
        sex: 1,
        userType: [],
        remark: "",
        isAdmin: false,
        imgBase64Str: "",
      },
      userTypeitems: [],
      sexarr: [
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogRoleVisible: false, // 分配角色对话框
      rules: {
        account: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        selectOrgs: [
          {
            validator: validateSelectOrgs,
            trigger: ["blur", "change"],
            required: true,
          },
        ],
        discountProperty: [
          {
            validator: discountPropertyChange,
            trigger: ["blur"],
            required: false,
          },
        ],
        // name: [
        //   {
        //     required: true,
        //     message: '姓名不能为空',
        //   },
        // ],
      },
      downloadLoading: false,
      propsdeptcodes: {
        label: "name",
        children: "children",
      },
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews", "account"]),

    selectOrgs: {
      get: function () {
        if (this.dialogStatus === "update") {
          if (this.temp.organizationIds == "") {
            return [];
          } else {
            return this.temp.organizationIds.split(",");
          }
        } else {
          return [];
        }
      },
      set: function (v) {
        var _this = this;
        _this.temp.organizationIds = (v.length > 0 && v.join(",")) || "";
        var organizations = _this.orgs
          .filter((val) => {
            return _this.temp.organizationIds.indexOf(val.id) >= 0;
          })
          .map((u) => u.label);
        this.temp.organizations = organizations.join(",");
      },
    },
  },
  filters: {
    statusFilter(status) {
      var res = "color-success";
      switch (status) {
        case 1:
          res = "color-danger";
          break;
        default:
          break;
      }
      return res;
    },
  },
  created() {
    this.getList();
  },
  mounted() {
    this.correnteUser = this.getCookie("username");
    var _this = this; // 记录vuecomponent
    login.getRegHospitals().then((response) => {
      _this.orgs = response.result.map(function (item) {
        return {
          id: item.id,
          label: item.name,
          parentId: item.parentId || null,
        };
      });
      var orgstmp = JSON.parse(JSON.stringify(_this.orgs));
      _this.orgsTree = listToTreeSelect(orgstmp);
    });
    dictionary
      .getList({
        page: 1,
        limit: 10000,
        orgId: "",
        parentId: "",
        key: "",
        tableName: "Dic_department",
      })
      .then((res) => {
        this.dicdataitems = res.data;
      });
    this.handleGetPublicConfig();
  },
  methods: {
    handleSelectDeptcodesAll() {
      this.temp.deptcodes = this.dicdataitems.map((item) => item.id);
    },
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    handleCloseEditOrAdd() {
      this.dialogFormVisible = false;
      this.imageUrl = "";
      this.discountProperty = "";
      this.temp = {
        id: undefined,
        description: "",
        organizations: "",
        organizationIds: "",
        account: "",
        name: "",
        password: "",
        hisCode: "",
        status: 0,
        deptcodes: "",
        sex: 1,
        userType: [],
        remark: "",
        isAdmin: false,
        imgBase64Str: "",
      };
    },
    handleDelImageUrl() {
      this.imageUrl = "";
      this.temp.imgBase64Str = "";
    },
    // 上传触发回调
    handleOnPpload(file, fileList) {
      const isLtType = file.raw.type.split("/")[0];
      const isLt10K = file.size / 1024 <= 10;
      if (isLtType !== "image") {
        this.$message.error("上传头像只能是图片格式!");
        return;
      }
      if (!isLt10K) {
        this.$message.error("上传头像图片大小不能超过 10KB!");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = () => {
        this.temp.imgBase64Str = reader.result.split(",")[1];
        this.imageUrl = reader.result;
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 获取类别选项列表回调
    handleGetPublicConfig() {
      getPublicConfig({ cc: "UserType" }).then((res) => {
        this.userTypeitems = res.result;
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
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },

    handleNodeClick(data) {
      this.multipleSelection = [];
      this.$refs.mainTable.clearSelection();
      this.listQuery.orgId = data.id;
      this.listQuery.parentId = data.parentId;
      this.mecName = data.label + "用户";

      this.list.forEach((element, sortIndex) => {
        if (
          element.meccodes.filter((item, index) => item == data.id).length > 0
        ) {
          var elementdata = {
            orgId: data.id,
            user: element,
            parentId: data.parentId,
          };
          this.multipleSelection.push(elementdata);
        }
      });
      this.multipleSelection.forEach((t) => {
        t.user.organizationIds.split(",").forEach((d) => {
          if (d == data.id) {
            this.$refs.mainTable.toggleRowSelection(t.user, true);
          }
        });
      });
      if (data) {
        this.listQuery.orgId = data.id;
        this.getList();
      }
    },
    //新增成为
    addhospitaluser() {
      let Sys_hospital_userlist = [];
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((d) => {
          var Sys_hospital_user = {
            hospitalcode: this.listQuery.parentId,
            meccode: this.listQuery.orgId,
            usercode: d.id,
          };
          Sys_hospital_userlist.push(Sys_hospital_user);
        });
        users.addhospitaluser(Sys_hospital_userlist).then((response) => {
          this.listQuery.orgId = "";
          this.getList();
        });
      }
      // this.getList();
    },
    //取消成为
    cancelhospitaluser() {
      let cancelSys_hospital_userlist = [];
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((d) => {
          var Sys_hospital_user = {
            hospitalcode: this.listQuery.parentId,
            meccode: this.listQuery.orgId,
            usercode: d.id,
          };
          cancelSys_hospital_userlist.push(Sys_hospital_user);
        });
        users
          .cancelhospitaluser(cancelSys_hospital_userlist)
          .then((response) => {
            if (response.code == 200) {
              this.listQuery.orgId = "";
              this.getList();
            }
          });
      }
    },
    getAllUsers() {
      this.listQuery.orgId = "";
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能删除删除一个",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        case "btnAccessRole":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.handleAccessRole(this.multipleSelection[0]);
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnRefresh": // 关闭当前页面
          this.getList();
          break;
        case "btnSynchro": // 用户同步
          users.UsersSync().then((res) => {
            this.$message.success(res.message);
            this.getList();
          });
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      users.getList(this.listQuery).then((response) => {
        var data = response.data.filter((d) => d.status != 2);
        this.total = response.count;
        dictionary
          .getList({
            page: 1,
            limit: 10000,
            orgId: "",
            parentId: "",
            key: "",
            tableName: "Dic_department",
          })
          .then((res) => {
            this.dicdata = res.data;
            this.dicdataitems = res.data;
            data.forEach((b) => {
              if (
                b.deptcodes != undefined &&
                b.deptcodes != null &&
                b.deptcodes != ""
              ) {
                b.deptname = "";
                b.deptcodes.split("|").forEach((x) => {
                  this.dicdata.forEach((d) => {
                    if (x == d.id) {
                      b.deptname += d.name + ",";
                    }
                  });
                });
                b.deptname = b.deptname.substr(0, b.deptname.length - 1);
              } else {
                b.deptname = "";
              }
            });
            this.list = data;
          });
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleModifyStatus(row, status) {
      // 模拟修改状态
      row.status = status;
      users.update(row).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
        });
      });

      this.$message({
        showClose: true,
        message: "操作成功",
        type: "success",
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        description: "",
        organizations: "",
        organizationIds: "",
        account: "",
        name: "",
        hisCode: "",
        password: "",
        status: 0,
        deptcodes: "",
        sex: 1,
        userType: [],
        remark: "",
        isAdmin: false,
        imgBase64Str: "",
      };
    },
    handleCreate() {
      // 弹出添加框
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      dictionary.getList(this.listQuery).then((res) => {
        this.dicdata = res.data;
      });
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
    handleChangeUserType(val) {
      if (!val) {
        this.temp.userType = [];
      }
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var depcodes = "";
          if (this.temp.deptcodes && this.temp.deptcodes.length > 0) {
            this.temp.deptcodes.forEach((d) => {
              depcodes += d + "|";
              this.temp.deptcodes = depcodes.substr(0, depcodes.length - 1);
            });
          } else {
            this.temp.deptcodes = "";
          }
          var encryptor = new this.$jsEncrypt(); // 创建加密对象实例
          //之前ssl生成的公钥，复制的时候要小心不要有空格
          encryptor.setPublicKey(window.pubKey); //设置公钥
          if (this.temp.password !== "") {
            this.temp.password = encryptor.encrypt(
              this.$Base64.encode(this.temp.password)
            ); // 对内容进行加密
          }
          if (this.discountProperty) {
            this.temp["propertyValues"] = [];
            this.temp.propertyValues.push(
              `DiscountProperty:${this.discountProperty}`
            );
          } else {
            this.temp["propertyValues"] = [];
            this.temp.propertyValues.push(`DiscountProperty:`);
          }
          if (this.temp.userType && this.temp.userType.length > 0) {
            this.temp.userType = this.temp.userType.join(",");
          } else {
            this.temp.userType = "";
          }
          // this.temp.password = this.$Base64.encode(this.temp.password);
          users
            .add(this.temp)
            .then((response) => {
              // this.temp.id = response.result;
              // this.list.unshift(this.temp);
              if (response.code == 200) {
                // this.dialogFormVisible = false;
                this.handleCloseEditOrAdd();
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                });
              }
            })
            .catch((err) => {
              this.temp.deptcodes = this.temp.deptcodes.split("|");
            });
        }
      });
    },
    handleGetUserImage(uid) {
      users.getUserImage({ id: uid }).then((res) => {
        if (!res.result) return;
        this.imageUrl = `data:image/jpeg;base64,${res.result}`;
        this.temp.imgBase64Str = res.result;
      });
    },
    handleGetUserPropertyValues(uid) {
      let ct = "DiscountProperty";
      users.getUserProperty({ id: uid, ct }).then((res) => {
        if (!res.result) return;
        let resDis = res.result.filter((k) => {
          return k.category === ct;
        })[0];
        resDis && (this.discountProperty = resDis.propertyvalue);
      });
    },
    handleUpdate(row) {
      // 弹出编辑框
      var deptcodes = [];
      var data = JSON.parse(JSON.stringify(row));
      if (row.deptcodes) {
        data.deptcodes.split("|").forEach((d) => {
          deptcodes.push(d);
        });
      }
      this.handleGetUserImage(row.id);
      this.handleGetUserPropertyValues(row.id);
      data.deptcodes = deptcodes;
      this.temp = Object.assign({}, data); // copy obj
      this.temp.userType &&
        (this.temp.userType = this.temp.userType.split(","));
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      dictionary.getList(this.listQuery).then((res) => {
        this.dicdata = res.data;
        // this.detailsdata = res.data;
      });
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var depcodes = "";
          let tempData = Object.assign({}, this.temp);
          console.log(tempData, "tempData");
          if (tempData.deptcodes && tempData.deptcodes.length > 0) {
            tempData.deptcodes.forEach((d) => {
              depcodes += d + "|";
            });
            tempData.deptcodes = depcodes.substr(0, depcodes.length - 1);
          } else {
            tempData.deptcodes = "";
          }
          var encryptor = new this.$jsEncrypt(); // 创建加密对象实例
          //之前ssl生成的公钥，复制的时候要小心不要有空格
          encryptor.setPublicKey(window.pubKey); //设置公钥
          if (tempData.password) {
            tempData.password = encryptor.encrypt(
              this.$Base64.encode(tempData.password)
            ); // 对内容进行加密
          }
          if (this.discountProperty) {
            tempData["propertyValues"] = [];
            tempData["propertyValues"].push(
              `DiscountProperty:${this.discountProperty}`
            );
          } else {
            tempData["propertyValues"] = [];
            tempData.propertyValues.push(`DiscountProperty:`);
          }
          if (tempData.userType && tempData.userType.length > 0) {
            tempData.userType = tempData.userType.join(",");
          } else {
            tempData.userType = "";
          }
          // tempData.password = this.$Base64.encode(tempData.password);
          users
            .update(tempData)
            .then(() => {
              // for (const v of this.list) {
              //   if (v.id === this.temp.id) {
              //     const index = this.list.indexOf(v);
              //     this.list.splice(index, 1, this.temp);
              //     break;
              //   }
              // }
              this.handleCloseEditOrAdd();
              this.getList();
              // this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
              });
            })
            .catch((err) => {
              this.temp.deptcodes = this.temp.deptcodes.split("|");
            });
        }
      });
    },
    handleDelete(row) {
      // 多行删除
      this.delrows(users, row);
      var _this = this;
      _this
        .$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          row[0].status = 2;
          users.update(row[0]).then(() => {
            _this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
            _this.getList();
          });
        })
        .catch(() => {
          _this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    handleAccessRole(row) {
      // 分配角色
      const _this = this;
      this.temp = Object.assign({}, row); // copy obj
      apiRoles.loadForUser(this.temp.id).then((response) => {
        _this.dialogRoleStatus = "update";
        _this.dialogRoleVisible = true;
        _this.selectRoles = response.result;
        _this.getRoleList();
        _this.$nextTick(() => {
          _this.$refs["rolesForm"].clearValidate();
        });
      });
    },

    // 获取角色
    getRoleList() {
      apiRoles.getList({}).then((response) => {
        this.selectRoleNames = [...response.result]
          .filter((x) => this.selectRoles.indexOf(x.id) > -1)
          .map((item) => item.name || item.account)
          .join(",");
      });
    },
    rolesChange(type, val) {
      if (type === "Texts") {
        this.selectRoleNames = val;
        return;
      }
      this.selectRoles = val;
    },
    acceRole() {
      accsssObjs
        .assign({
          type: "UserRole",
          firstId: this.temp.id,
          secIds: this.selectRoles,
        })
        .then(() => {
          this.getList();
          this.dialogRoleVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
          });
        });
    },
  },
};
</script>

<style lang="scss">
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card__header {
  padding: 12px 20px;
}

.body-small.dialog-mini .el-dialog__body .el-form {
  padding-right: 0px;
  padding-top: 0px;
}
.avatar-uploader .el-upload {
  width: 110px;
  height: 110px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .del_btn {
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 30px;
    bottom: 0;
    left: 0;
    z-index: 99;
    .el-icon-delete {
      font-size: 16px;
      color: #fff;
    }
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  position: relative;
}
.avatar-uploader-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
.deptcodes_box {
  .el-form-item__content {
    display: flex;
    align-items: center;
  }
}
</style>
