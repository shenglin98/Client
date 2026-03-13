<template>
  <div class="dic_index">
    <!-- 模块主体 -->
    <div class="subject">
      <!-- 主体数据 -->
      <div class="content">
        <!-- 搜索盒子 -->
        <div class="search_box">
          <el-tag type="success">333个</el-tag>
          <el-input placeholder="请输入内容" v-model="searchName" @clear="handleSearch" @keyup.native.enter="handleSearch" clearable size="small"> </el-input>
          <el-button icon="el-icon-search" size="small" plain @click="handleSearch">搜索</el-button>
          <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="handleOnBtnClicked"></permission-btn>
        </div>
        <!-- 子组件引入位置 -->
        <div class="child_components">
          <div class="dic_item_value">
            <EasyTable height="100%" key="Dic_item_value" class="dicItemValue_data" :loading="loading" :data="dicItemData" :tableOptions="dicItemOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleLoadMore" @row-click="handleCheckDicItem" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            <EasyTable height="100%" key="dicItemValueSon" ref="dicItemValueSon" class="dicItemValue_son" :loading="loadingSon" :data="dicItemSon" :tableOptions="dicItemSonOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectItemSon" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- 预警值字典新增编辑弹框 -->
    <el-dialog title="预警值字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleClose" :visible.sync="showDicCritical">
      <el-form :model="dicCriticalForm" :rules="dicCriticalRules" ref="dicCriticalForm" label-width="120px">
        <el-form-item size="small" label="编码">
          <el-input disabled v-model="dicCriticalForm.code"></el-input>
        </el-form-item>
        <el-form-item v-if="chooseDicItem" size="small" label="项目名称">
          <el-input disabled v-model="chooseDicItem.name"></el-input>
        </el-form-item>
        <el-form-item size="small" label="关系" prop="relation">
          <el-select v-model="dicCriticalForm.relation" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in calcRelation" :key="index" :label="item.name" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="关键字" prop="keyword">
          <el-input v-model="dicCriticalForm.keyword"></el-input>
        </el-form-item>
        <el-form-item size="small" label="分组" prop="group">
          <el-input v-model="dicCriticalForm.group"></el-input>
        </el-form-item>
        <el-form-item size="small" label="性别" prop="sex">
          <el-select v-model="dicCriticalForm.sex" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in sexItem" :key="index" :label="item.name" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="年龄下限" prop="agel">
          <el-input v-model.number="dicCriticalForm.agel"></el-input>
        </el-form-item>
        <el-form-item size="small" label="年龄上限" prop="ageh">
          <el-input v-model.number="dicCriticalForm.ageh"></el-input>
        </el-form-item>
        <el-form-item size="small" label="预警值级别" prop="criticallevel">
          <el-select v-model="dicCriticalForm.criticallevel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in levelItem" :key="index" :label="item.name" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="结论" prop="conclusion">
          <el-input v-model="dicCriticalForm.conclusion"></el-input>
        </el-form-item>
        <el-form-item size="small" label="参考范围表达式" prop="expression">
          <el-input v-model="dicCriticalForm.expression"></el-input>
        </el-form-item>
        <el-form-item size="small" label="排序">
          <el-input v-model.number="dicCriticalForm.seqno"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import permissionBtn from "@/components/PermissionBtn";
import { getPublicConfig } from "@/api/dataanalysis.js";
import { getDicItemList } from "@/api/projectdictionary2.js";
import { getList, createOrUpdate, del } from "@/api/dic_critical.js";
export default {
  name: "dic_critical",
  components: { permissionBtn },
  data() {
    return {
      calcRelation: [], // 关系下拉框
      searchName: "", // 筛选名称
      sumData: 0,
      loading: false, // 加载效果
      loadingSon: false, // 子表加载效果
      dicItemData: [], // 列表渲染数据
      count: 0, // 数据总数
      currentPage: 1, // 当前页码
      pageSize: 50, // 每页显示多少条数据
      chooseDicItem: undefined, // 字典选中行数据
      dicItemSon: [], // 子表字典表格数据
      selectItemSon: [], //字典子表选中数据
      showDicCritical: false, //字典新增编辑弹框
      dicCriticalForm: {
        code: "",
        itemcode: "",
        relation: "",
        keyword: "",
        group: "",
        sex: 0,
        agel: null,
        ageh: null,
        criticallevel: 0,
        conclusion: "",
        expression: "",
        seqno: 0,
      }, // 字典新增编辑表单
      dicCriticalRules: {
        relation: [{ required: true, message: "请填写关系", trigger: "blur" }],
        keyword: [{ required: true, message: "请填写关键字", trigger: "blur" }],
      }, // 字典新增编辑表单验证
      sexItem: [
        {
          code: 0,
          name: "未知",
        },
        {
          code: 1,
          name: "男",
        },
        {
          code: 2,
          name: "女",
        },
      ], // 性别
      levelItem: [
        {
          code: 0,
          name: "一般",
        },
        {
          code: 1,
          name: "急",
        },
        {
          code: 2,
          name: "紧急",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 字典表格配置
    dicItemOptions() {
      return [
        {
          title: "项目编码",
          prop: "code",
          width: 150,
        },
        {
          title: "项目名称",
          prop: "name",
          omit: 1,
        },
      ];
    },
    // 字典子表表格配置
    dicItemSonOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "关系",
          prop: "relation",
          omit: 1,
          returnVal: (value) => {
            return this.calcRelation.find((item) => item.code === value).name;
          },
        },
        {
          title: "关键字",
          prop: "keyword",
          omit: 1,
        },
        {
          title: "分组",
          prop: "group",
        },
        {
          title: "性别",
          prop: "sex",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄下限",
          prop: "agel",
        },
        {
          title: "年龄上限",
          prop: "ageh",
        },
        {
          title: "预警值级别",
          prop: "criticallevel",
          returnVal: (value) => {
            return value == 0 ? "一般" : value == 1 ? "急" : "紧急";
          },
        },
        {
          title: "结论",
          prop: "conclusion",
        },
        {
          title: "参考范围表达式",
          prop: "expression",
        },
        {
          title: "排序",
          prop: "seqno",
        },
      ];
    },
  },
  mounted() {
    this.handleGetCalcRelation();
    this.handleGetDicItemList();
  },
  methods: {
    // 公共配置编码
    handleGetCalcRelation() {
      getPublicConfig({ cc: "CalcRelation" }).then((res) => {
        this.calcRelation = res.result;
      });
    },
    // 获取项目字典列表数据回调
    handleGetDicItemList() {
      this.loading = true;
      getDicItemList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
      })
        .then((res) => {
          this.count = res.count;
          this.dicItemData.push(...res.data);
          this.loading = false;
          this.sumData = res.count;
        })
        .catch((err) => {
          this.currentPage = 1;
          this.count = 0;
          this.dicItemData = [];
          this.loading = false;
        });
    },
    // 筛选搜索回调
    handleSearch() {
      this.currentPage = 1;
      this.dicItemData = [];
      this.handleGetDicItemList();
    },
    // 按钮组点击回调
    handleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          if (!this.chooseDicItem) {
            this.$message.warning("请选择项目添加预警值!");
            return false;
          }
          this.showDicCritical = true;
          break;
        case "btnEdit": // 编辑
          this.handleEdit();
          break;
        case "btnDel": // 删除
          this.handleDel();
          break;
        case "btnRefresh": // 重置
          // this.currentPage = 1;
          this.dicItemSon = [];
          this.handleGetDicItemChildDetail();
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
      let styleJson = {};
      // styleJson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      styleJson.color = "#000";
      styleJson["font-weight"] = "bold";
      styleJson.background = "#d0ddeb";
      return styleJson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    // 懒加载方法回调
    handleLoadMore() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.dicItemData.length >= this.count) return false;
        this.currentPage++;
        this.handleGetDicItemList();
      }, 400);
    },
    // 字典列表点击行回调
    handleCheckDicItem(row) {
      this.chooseDicItem = row;
      this.handleGetDicItemChildDetail();
    },
    // 子表列表
    handleGetDicItemChildDetail() {
      if (!this.chooseDicItem) return false;
      this.loadingSon = true;
      getList({
        code: this.chooseDicItem.code,
      }).then((res) => {
        this.dicItemSon = res.result;
        this.loadingSon = false;
      });
    },
    // 项目常见结果子表选中数据回调
    handleSelectItemSon(val) {
      this.selectItemSon = val;
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
    handleEdit(item) {
      item && (this.selectItemSon = [item]);
      if (this.selectItemSon.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.showDicCritical = true;
        this.dicCriticalForm = JSON.parse(
          JSON.stringify(this.selectItemSon[0])
        );
      }
    },
    handleDel() {
      if (this.selectItemSon.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = this.selectItemSon.map((k) => {
            return k.code;
          });
          del(codeItems).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicItemChildDetail(); // 获取列表新数据
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    handleClose() {
      this.$refs["dicCriticalForm"].clearValidate();
      this.$refs["dicItemValueSon"].$refs.easyTable.clearSelection();
      this.dicCriticalForm = {
        code: "",
        itemcode: "",
        relation: "",
        keyword: "",
        group: "",
        sex: 0,
        agel: null,
        ageh: null,
        criticallevel: null,
        conclusion: "",
        expression: "",
        seqno: 0,
      };
      this.showDicCritical = false;
    },
    handleSubmit() {
      this.$refs["dicCriticalForm"].validate((valid) => {
        if (valid) {
          this.dicCriticalForm.itemcode = this.chooseDicItem.code;
          createOrUpdate(this.dicCriticalForm).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicItemChildDetail(); // 获取列表新数据
            this.handleClose(); // 关闭弹框
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dic_index {
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    overflow: hidden;
    /deep/.is-current {
      background-color: #5586d1 !important;
    }
    .content {
      width: 100%;
      .search_box {
        height: 50px;
        background-color: #f6f7fc;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px;
        justify-content: flex-end;
        /deep/.el-tag {
          height: 32px;
          display: flex;
          align-items: center;
        }
        /deep/.el-select,
        /deep/.el-input {
          width: 200px !important;
        }
        .btn_group {
          margin-left: 50px;
          display: flex;
          flex-wrap: nowrap;
        }
      }
      // 子组件盒子
      .child_components {
        height: calc(100% - 50px);
        padding: 10px;
        box-sizing: border-box;
        /deep/.el-table {
          .cell {
            .el-link.name_box {
              width: 220px;
              display: flex;
              align-items: center;
              .el-link--inner {
                width: 220px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        .dic_item_value {
          display: flex;
          height: 100%;
          .dicItemValue_data {
            width: 30%;
          }
          .dicItemValue_son {
            width: 70%;
          }
        }
      }
    }
  }
  // 项目常见字典新增编辑弹框
  .dicitemvalue_dia {
    /deep/.el-dialog__header,
    /deep/.el-dialog__body,
    /deep/.el-dialog__footer {
      padding: 15px;
    }
    /deep/.el-dialog__footer {
      .dialog-footer {
        text-align: center;
      }
    }
    /deep/.el-dialog__body {
      .el-form {
        width: 95%;
        .el-form-item {
          .el-select {
            width: 100%;
          }
        }
        .sfbm {
          .el-dropdown {
            width: 100%;
          }
        }
      }
    }
  }
  // 淡入淡出效果
  .fade-enter {
    opacity: 0;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-enter-active {
    transition: opacity 0.2s;
  }
  .fade-leave-active {
    opacity: 0;
    transition: opacity 0.2s;
  }
}

.my-dropdown2 {
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
}

.active {
  color: #409eff;
  background-color: #f5f7fa;
}

.list-item2:hover {
  background-color: #f5f7fa;
}
</style>
