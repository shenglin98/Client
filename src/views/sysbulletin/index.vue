<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input
          @keyup.enter.native="handleFilter"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 200px; margin-bottom: 0"
          class="filter-item"
          :placeholder="'关键字'"
          v-model="listQuery.key"
        >
        </el-input>

        <permission-btn
          moduleName="sysbulletinmanager"
          size="mini"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <div class="bg-white fh">
        <el-table
          ref="mainTable"
          :key="tableKey"
          :data="list"
          v-loading="listLoading"
          fit
          highlight-current-row
          style="width: 100%"
          height="calc(100% - 52px)"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          :border="false"
          :header-cell-style="handleReturnStyle"
          :row-class-name="handleTableRowClassName"
          :cell-style="{ padding: '0' }"
        >
          <el-table-column align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column :label="'公告编码'" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.bulletincode }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'公告标题'" min-width="120px">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">
                {{ scope.row.bulletincaption }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="'公告类型'" min-width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.bulletincategory}}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column :label="'公告说明'" min-width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.bulletinexplain}}</span>
            </template>
          </el-table-column> -->
          <el-table-column :label="'开始时间'" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.starttime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'结束时间'" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.deadline }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'创建时间'" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createtime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'是否全部可看'" min-width="120px">
            <template slot-scope="scope">
              <span>{{
                scope.row.isall == true
                  ? "是"
                  : scope.row.isall == false
                  ? "否"
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="'是否有效'" min-width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.delflag}}</span>
            </template>
          </el-table-column> -->
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="handleCurrentChange"
        />
      </div>

      <el-dialog
        width="1000px"
        :close-on-click-modal="false"
        v-el-drag-dialog
        class="dialog-mini"
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="temp"
          label-position="right"
          label-width="100px"
        >
          <el-form-item
            size="small"
            :label="'公告编码'"
            prop="bulletincode"
            v-show="dialogStatus == 'update'"
          >
            <el-input
              v-model="temp.bulletincode"
              :disabled="true"
              placeholder="系统自动处理"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item size="small" :label="'公告类型'" prop="bulletincategory">
            <el-input v-model="temp.bulletincategory"></el-input>
          </el-form-item> -->
          <el-form-item size="small" :label="'公告标题'" prop="bulletincaption">
            <el-input v-model="temp.bulletincaption"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'公告类型'">
            <el-select
              style="width: 100%"
              size="mini"
              v-model="temp.bulletincategory"
              filterable
            >
              <el-option
                v-for="item in bulletincategoryItems"
                :key="item.unioncode"
                :label="item.name"
                :value="item.unioncode"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item size="small" :label="'公告说明'" prop="bulletinexplain">
            <el-input type="textarea" v-model="temp.bulletinexplain"></el-input>
          </el-form-item> -->
          <el-form-item
            size="small"
            class="bulletinexplain"
            :label="'公告说明'"
            prop="bulletinexplain"
          >
            <vue-tinymce
              class="tinymce"
              v-model="temp.bulletinexplain"
              :setting="setting"
            />
          </el-form-item>
          <el-form-item size="small" :label="'开始时间'" prop="date">
            <el-date-picker
              v-model="temp.date"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="temp.bulletincategory == 'ActivityBulletin'"
            size="small"
            :label="'活动人数'"
          >
            <el-input v-model="temp.personcount"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'是否全部可看'" prop="isall">
            <el-radio-group v-model="temp.isall">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            size="small"
            :label="'可看权限集'"
            v-if="temp.isall == false"
            prop="codeitems"
          >
            <el-checkbox-group v-model="temp.codeitems">
              <el-checkbox
                v-for="item in checkList"
                :key="item.code"
                :label="item.code"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="dialogFormVisible = false"
            >取消</el-button
          >
          <el-button
            size="small"
            :loading="saveLoading"
            v-if="dialogStatus == 'create'"
            type="primary"
            @click="createData"
            >确认</el-button
          >
          <el-button
            size="small"
            :loading="saveLoading"
            v-else
            type="primary"
            @click="updateData"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as sysbulletin from "@/api/sysbulletin";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import { mapGetters } from "vuex";
import { getPublicConfig } from "@/api/customermanage.js";
export default {
  name: "sysbulletin",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
  },
  directives: {
    waves,
    elDragDialog,
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  data() {
    return {
      defaultProps: {
        // tree配置项
        children: "children",
        label: "label",
      },
      saveLoading: false,
      checkList: [],
      date: [],
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        key: undefined,
      },
      rules: {
        bulletincaption: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        bulletinexplain: [
          { required: true, message: "公告说明不能为空", trigger: "blur" },
        ],
        date: [
          {
            required: true,
            message: "开始时间结束时间不能为空",
            trigger: "change",
          },
        ],
        isall: [
          {
            required: true,
            message: "必须选择是否可看",
            trigger: "change",
          },
        ],
        codeitems: [
          {
            required: true,
            message: "必须选择可看权限集",
            trigger: "change",
          },
        ],
      },
      temp: {
        bulletincode: "",
        bulletincategory: "",
        bulletincaption: "",
        bulletinexplain: "",
        starttime: "",
        deadline: "",
        codeitems: [],
        isall: true,
        date: [],
        personcount: 0,
        bulletincategory: "SystemBulletin",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      setting: {
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN", //本地化设置
        language_url:
          "https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js", //使用language_url会相对灵活
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars emoticons",
        height: "100%",
        setup: function (editor) {
          editor.on("change", function (e) {
            console.log("change event", e);
          });
        },
      }, // 富文本配置器
    };
  },
  created() {
    this.getList();
    getPublicConfig({ cc: "BulletinType" }).then((res) => {
      if (!res.result) return;
      this.bulletincategoryItems = res.result;
    });
  },
  methods: {
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

    changeTitle(val) {
      // 自动调整对话框标题
      this.accessTitle = val;
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked: function (domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
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
          if (this.multipleSelection.length < 1) {
            this.$message({
              showClose: true,
              message: "至少删除一个",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      sysbulletin.getList(this.listQuery).then((response) => {
        console.log(response);
        this.total = response.count;
        this.list = response.data;
        this.listLoading = false;
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        bulletincode: "",
        bulletincategory: "",
        bulletincaption: "",
        bulletinexplain: "",
        starttime: "",
        deadline: "",
        codeitems: [],
        isall: true,
        date: "",
        personcount: 0,
        bulletincategory: "SystemBulletin",
      };
    },
    handleCreate() {
      // 弹出添加框
      this.resetTemp();
      sysbulletin.detail().then((response) => {
        console.log(response);
        this.checkList = response.result.seeitems;
        response.result.seeitems.forEach((d) => {
          if (d.selected == true) {
            this.temp.codeitems.push(d.code);
          }
        });
      });
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          this.temp.starttime =
            this.temp.date[0].getFullYear() +
            "-" +
            (this.temp.date[0].getMonth() + 1) +
            "-" +
            this.temp.date[0].getDate();
          this.temp.deadline =
            this.temp.date[1].getFullYear() +
            "-" +
            (this.temp.date[1].getMonth() + 1) +
            "-" +
            this.temp.date[1].getDate();
          sysbulletin.save(this.temp).then((response) => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
            this.saveLoading = false;
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp.codeitems = [];
      this.temp.date = [];
      console.log(row);
      var data = {
        bulletincode: row.bulletincode,
      };
      this.temp.bulletincaption = row.bulletincaption;
      this.temp.bulletincode = row.bulletincode;
      this.temp.bulletinexplain = row.bulletinexplain;
      this.temp.createtime = row.createtime;
      this.temp.createuser = row.createuser;
      this.temp.deadline = row.deadline;
      this.temp.delflag = row.delflag;
      this.temp.isall = row.isall;
      this.temp.personcount = row.personcount;
      this.temp.bulletincategory = row.bulletincategory;
      this.temp.starttime = row.starttime;
      this.temp.date.push(this.temp.starttime);
      this.temp.date.push(this.temp.deadline);
      sysbulletin.detail(data).then((response) => {
        this.checkList = response.result.seeitems;
        response.result.seeitems.forEach((d) => {
          if (d.selected) {
            this.temp.codeitems.push(d.code);
          }
        });
      });
      console.log(this.temp);
      // 弹出编辑框
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
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
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          sysbulletin.save(tempData).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
            });
          });
        }
      });
    },
    handleDelete(rows) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 多行删除
          sysbulletin.del(rows.map((u) => u.bulletincode)).then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
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
  },
};
</script>

<style lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

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
.bulletinexplain {
  height: 300px;
  .el-form-item__content {
    height: 100%;
  }
  .tinymce {
    height: 100%;
  }
}
.user-dialog {
  .el-dialog {
    .el-icon-close {
      padding-top: 10px;
    }
    .el-dialog__body {
      height: calc(100% - 35px - 40px);
    }
    .el-dialog__headerbtn {
      top: 0;
    }
  }
}
</style>
