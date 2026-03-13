<template>
  <div class="dicillness">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="searchName"
          @clear="handleSearchName"
          @keyup.native.enter="handleSearchName"
          clearable
          size="small"
        >
        </el-input>
        <div class="search_box_btn">
          <el-button
            class="sbtn"
            type="primary"
            size="small"
            plain
            v-if="!wordDisable"
            @click="handleSave"
            >保存</el-button
          >
          <permission-btn
            class="btn_group"
            moduleName="customerResult"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          ></permission-btn>
        </div>
      </div>
      <!-- 主体内容树+字典 -->
      <div class="bodymain">
        <!-- 左边树结构 -->
        <div class="main_l">
          <!-- 头部操作按钮 -->
          <div class="btn_l_group">
            <el-button type="primary" size="small" plain @click="handleAddType"
              >添加分类</el-button
            >
            <el-button type="primary" size="small" plain @click="handleEditType"
              >修改分类</el-button
            >
            <el-button type="primary" size="small" plain @click="handleDelType"
              >删除分类</el-button
            >
          </div>
          <!-- 树内容盒子 -->
          <div class="tree_box">
            <el-tree
              ref="tree"
              :data="typetree"
              highlight-current
              node-key="code"
              :default-expanded-keys="defaultChecked"
              :default-checked-keys="defaultChecked"
              :filter-node-method="filterNode"
              :props="defaultProps"
              @node-click="handleNodeClick"
            >
              <span
                class="custom-tree-node"
                :ref="`treeItem_${data.code}`"
                slot-scope="{ node, data }"
              >
                <span>
                  <i
                    :class="[
                      data.level == 0
                        ? 'el-icon-folder-opened'
                        : 'el-icon-folder',
                    ]"
                    :style="data.level == 0 ? 'color:#faa755' : 'color:#1d953f'"
                  ></i>
                  <span
                    :style="
                      data.level == 0 && data.status == 1 ? 'color:red' : ''
                    "
                  >
                    {{ node.label }}
                  </span>
                </span>
              </span>
            </el-tree>
          </div>
          <!-- 添加/编辑分类 -->
          <el-dialog
            :close-on-click-modal="false"
            width="516px"
            class="dialog-mini body-small"
            title="添加"
            :visible.sync="dialogFormVisible"
            :show-close="false"
          >
            <el-form
              ref="dataForm"
              :model="typeForm"
              size="small"
              v-if="dialogFormVisible"
              label-position="right"
              label-width="100px"
            >
              <el-form-item size="small" :label="'分类编码'" prop="typeid">
                <el-input
                  v-model="typeForm.code"
                  :disabled="true"
                  size="small"
                  placeholder="系统自动处理"
                ></el-input>
              </el-form-item>
              <el-form-item size="small" :label="'分类名称'" prop="typename">
                <el-input
                  v-model="typeForm.name"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item size="small" :label="'排序'" prop="seqno">
                <el-input
                  v-model="typeForm.seqno"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleCloseTypeForm"
                >取消</el-button
              >
              <el-button
                type="primary"
                plain
                size="mini"
                :loading="saveLoading"
                @click="handleSubmitTypeForm"
                >确认</el-button
              >
            </div>
          </el-dialog>
        </div>
        <!-- 左边主体内容结构 -->
        <div class="main_r">
          <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="handleClickTabs"
          >
            <el-tab-pane label="详细信息" name="details">
              <el-form
                :model="wordForm"
                :rules="wordRules"
                :disabled="wordDisable"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="疾病编码">
                      <el-input
                        disabled
                        placeholder="系统自动生成"
                        v-model="wordForm.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="疾病名称" prop="name">
                      <el-input clearable v-model="wordForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="性别">
                      <el-select clearable filterable v-model="wordForm.sex">
                        <el-option label="未知" :value="0"></el-option>
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="启用状态">
                      <el-select clearable filterable v-model="wordForm.status">
                        <el-option label="启用" :value="0"></el-option>
                        <el-option label="停用" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="排序">
                      <el-input clearable v-model="wordForm.seqno"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!-- 健康建议等...切换 -->
              <el-tabs v-model="suggest" @tab-click="handleClickTabsSuggest">
                <el-tab-pane label="健康建议" name="healthadvice">
                  <div class="suggest_box">
                    <el-input
                      type="textarea"
                      resize="none"
                      class="conc_text"
                      :disabled="wordDisable"
                      v-model="wordForm.healthadvice"
                    ></el-input>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="饮食建议" name="dietadvice">
                  <div class="suggest_box">
                    <el-input
                      type="textarea"
                      resize="none"
                      class="conc_text"
                      :disabled="wordDisable"
                      v-model="wordForm.dietadvice"
                    ></el-input>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="运动建议" name="sportsadvice">
                  <div class="suggest_box">
                    <el-input
                      type="textarea"
                      resize="none"
                      class="conc_text"
                      :disabled="wordDisable"
                      v-model="wordForm.sportsadvice"
                    ></el-input>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="健康知识" name="healthknowledge">
                  <div class="suggest_box">
                    <el-input
                      type="textarea"
                      resize="none"
                      class="conc_text"
                      :disabled="wordDisable"
                      v-model="wordForm.healthknowledge"
                    ></el-input>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="结论推导" name="second">
              <el-button
                type="primary"
                plain
                size="mini"
                style="margin-bottom: 10px"
                icon="el-icon-circle-plus"
                :disabled="wordDisable"
                @click="handleAddWordItemsRow"
              ></el-button>
              <div class="second_table_box">
                <!-- <EasyTable
                  height="100%"
                  class="second_table"
                  :data="wordForm.worditems"
                  :tableOptions="worditemsOptions"
                  :checkbox-config="{ rowClick: false }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                /> -->
                <el-table
                  height="100%"
                  class="second_table"
                  :data="wordForm.worditems"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                >
                  <el-table-column prop="wordcode" label="结论词">
                    <template slot-scope="scope">
                      <ClMuchSelect
                        key="1"
                        v-model="scope.row.wordcode"
                        :options="worderItemsDataSS"
                        ref="ClMuchSelect"
                        size="mini"
                        :selfL="true"
                        optionLabel="wordname"
                        optionValue="wordcode"
                        :disabled="wordDisable"
                        :optionDisabledL="wordcodeItems"
                        @change="
                          handleChangeWord(scope.row, scope.row.wordcode)
                        "
                      >
                        <template #option="{ data }">
                          <span>{{
                            `${data.wordcode}　${data.wordname}`
                          }}</span>
                        </template>
                      </ClMuchSelect>
                    </template>
                    <!-- <template slot-scope="scope">
                      <vxe-pulldown ref="xDown2" style="width: 100%">
                        <template v-slot>
                          <vxe-input
                            style="width: 100%"
                            v-model="scope.row.wordcode"
                            @focus="handleFocusEvent2"
                            @keyup.native="handleKeyupEvent2"
                            size="mini"
                          ></vxe-input>
                        </template>
                        <template v-slot:dropdown>
                          <vxe-list
                            height="200"
                            class="my-dropdown2"
                            :data="worderItemsDataSS"
                            auto-resize
                          >
                            <template v-slot="{ items }">
                              <div
                                class="list-item2"
                                v-for="item in items"
                                :key="item.wordcode"
                                @click="handleChangeWord(item, item.wordcode)"
                              >
                                <span>{{
                                  `${item.wordcode}　${item.wordname}`
                                }}</span>
                              </div>
                            </template>
                          </vxe-list>
                        </template>
                      </vxe-pulldown>
                    </template> -->
                    <!-- <template slot-scope="scope">
                      <el-select
                        clearable
                        filterable
                        v-model="scope.row.wordcode"
                        :disabled="wordDisable"
                        @change="
                          handleChangeWord(scope.row, scope.row.wordcode)
                        "
                        size="mini"
                      >
                        <el-option
                          v-for="(item, index) in worderItemsData"
                          :key="index"
                          :label="`${item.wordcode}　${item.wordname}`"
                          :value="item.wordcode"
                          :disabled="wordcodeItems.includes(item.wordcode)"
                        ></el-option>
                      </el-select>
                    </template> -->
                  </el-table-column>
                  <el-table-column
                    prop="relation"
                    height="30px"
                    width="260px"
                    label="关系"
                  >
                    <template slot-scope="scope">
                      <el-select
                        class="filter-item"
                        size="mini"
                        filterable
                        clearable
                        style="
                          width: 100%;
                          height: 30px;
                          margin-top: -20px;
                          margin-left: -15px;
                        "
                        :disabled="wordDisable"
                        v-model="scope.row.relation"
                      >
                        <el-option
                          v-for="(item, key) in relationitemslist"
                          :key="key"
                          :label="item.name"
                          :value="item.code"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="keyword"
                    width="260px"
                    height="30px"
                    label="关键字"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.keyword"
                        style="
                          height: 30px;
                          margin-top: -20px;
                          margin-left: -15px;
                        "
                        size="mini"
                        :disabled="wordDisable"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="group"
                    height="30px"
                    width="100"
                    label="分组"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.group"
                        style="
                          height: 30px;
                          margin-top: -20px;
                          margin-left: -15px;
                        "
                        size="mini"
                        :disabled="wordDisable"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="seqno" label="排序">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.seqno"
                        :disabled="wordDisable"
                        size="mini"
                      ></el-input></template
                  ></el-table-column>
                  <el-table-column type="index" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        :disabled="wordDisable"
                        size="mini"
                        @click="handleDelRow(scope.$index)"
                        >删 除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <!-- @row-click="handleCheckTriagArea" -->
              </div>
            </el-tab-pane>
            <el-tab-pane label="疾病大类" name="disease">
              <div class="disease_table_box" v-if="chooseType">
                <EasyTable
                  height="100%"
                  class="disease_table"
                  :data="chooseType.childs"
                  :tableOptions="childsOptions"
                  @row-click="handleCheckChooseType"
                  :checkbox-config="{ rowClick: false }"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                />
                <!-- @row-click="handleCheckTriagArea" -->
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import {
  Load,
  AddOrUpdate,
  Delete,
  WordList,
  IllnessDetail,
} from "@/api/dicillness.js";
import { mapGetters } from "vuex";
import {
  getDicItemDetailItem,
  UsedWordList,
  NoUsedWordList,
} from "@/api/conclusions";

import ClMuchSelect from "./components/index.vue";

export default {
  name: "",

  components: { Sticky, permissionBtn, ClMuchSelect },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    childsOptions() {
      return [
        {
          title: "疾病编码",
          prop: "code",
          width: 130,
          omit: 1,
        },
        {
          title: "疾病名称",
          prop: "name",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 130,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
      ];
    },
  },

  data() {
    return {
      rangeNumber: 100,
      chooseCode: "",
      searchName: "",
      typetree: [], // 树数据源
      defaultChecked: [], // 默认选中数据
      currentNodeId: 0,
      defaultProps: {
        // tree配置项
        children: "childs",
        label: "name",
      }, // 树数据字段配置
      dialogFormVisible: false, // 添加分类弹框控制
      saveLoading: false,
      typeForm: {
        code: "",
        name: "",
        level: 0,
        seqno: 0,
      },
      chooseType: null, // 当前选中的分类
      activeName: "details", // details  second
      wordForm: {
        code: "",
        name: "",
        parentcode: "",
        level: 1,
        sex: 0,
        status: 0,
        seqno: 0,
        healthadvice: "",
        dietadvice: "",
        sportsadvice: "",
        healthknowledge: "",
        relation: "",
        keyword: "",
        group: "",
        delflag: 0,
        worditems: [],
      },
      wordDisable: true,
      wordRules: {
        name: [{ required: true, message: "请输入疾病名称", trigger: "blur" }],
      },
      suggest: "healthadvice",
      worderItemsData: [],
      wordcodeItems: [],
      relationitemslist: [],
    };
  },

  mounted() {
    this.handleGetPageList();
  },

  methods: {
    handleDelRow(index) {
      this.wordForm.worditems.splice(index, 1);
    },
    handleUsedWordList(code) {
      NoUsedWordList({ code }).then((res) => {
        if (!res.result) return;
        this.worderItemsData = JSON.parse(JSON.stringify(res.result));
        this.worderItemsDataSS = JSON.parse(JSON.stringify(res.result));
        this.wordcodeItems = this.wordForm.worditems.map((k) => k.wordcode);
      });
    },
    handleGetWordList() {
      WordList().then((res) => {
        this.worderItemsData = JSON.parse(JSON.stringify(res.result));
        this.worderItemsDataSS = JSON.parse(JSON.stringify(res.result));
      });
    },
    handleFocusEvent2() {
      this.$refs.xDown2.showPanel();
    },
    handleKeyupEvent2() {
      const value2 = this.combineChargeForm.code;
      if (value2) {
        this.worderItemsDataSS = this.worderItemsData.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(value2.toLowerCase()) > -1
            );
          });
        });
      } else {
        this.worderItemsDataSS = this.worderItemsData;
      }
      this.$refs.xDown2.showPanel();
      // this.combineCodeItemsSS = value2
      //   ? this.combineCodeItems.filter(
      //       (item) => item.label.indexOf(value2) > -1
      //     )
      //   : this.combineCodeItems;
    },
    // 点击保存回调
    handleSave() {
      if (!this.wordForm.name.trim()) {
        this.$message.warning("疾病名称不允许为空!");
        return;
      }
      AddOrUpdate(this.wordForm).then(async (res) => {
        this.$message.success(res.message);
        this.chooseType = null;
        this.wordDisable = true;
        this.handleResetWordForm();
        this.handleGetPageList();
      });
    },
    // 重置表单对象
    handleResetWordForm() {
      this.wordForm = {
        code: "",
        name: "",
        parentcode: "",
        level: 1,
        sex: 0,
        status: 0,
        seqno: 0,
        healthadvice: "",
        dietadvice: "",
        sportsadvice: "",
        healthknowledge: "",
        delflag: 0,
        relation: "",
        keyword: "",
        group: "",
        worditems: [],
      };
    },
    // 切换结论词回调
    handleChangeWord(item, value) {
      if (!value) {
        item.wordname = "";
      } else {
        let index = this.worderItemsData.findIndex((k) => {
          return k.code === value;
        });
        index > -1 && (item.wordname = this.worderItemsData[index].name);
      }
      this.wordcodeItems = this.wordForm.worditems.map((k) => k.wordcode);
    },
    // 点击新增结论推导行
    handleAddWordItemsRow() {
      this.wordForm.worditems.push({
        code: "",
        wordcode: "",
        wordname: "",
        relation: "",
        keyword: "",
        group: "",
        seqno: 0,
      });
    },
    // 健康等建议tabs切换回调
    handleClickTabsSuggest(tab, event) {
      console.log(tab, event);
    },
    // tabs切换回调
    handleClickTabs(tab, event) {
      console.log(tab, event);
    },
    // 获取分类列表数据
    handleGetPageList() {
      let temp = this.searchName;
      Load({
        page: 1,
        limit: 10000,
      }).then((res) => {
        console.log(res.data);
        if (!res.data) {
          this.typetree = [];
          return;
        }
        this.searchName = "";
        this.typetree = res.data;
        // 页面加载默认选中第一个
        this.$nextTick(() => {
          this.searchName = temp;
          if (this.chooseCode) {
            this.defaultChecked.push(this.chooseCode);
            this.$refs[`treeItem_${this.chooseCode}`].click();
          }
        });
      });
    },
    // 点击疾病大类表格回调
    handleCheckChooseType(row) {
      this.wordForm = JSON.parse(JSON.stringify(row));
    },
    // 点击树选中数据分类回调
    async handleNodeClick(data) {
      console.log(data);
      if (!data) return;
      this.wordDisable = true; // 解除表单限制
      // 当前选中的是分类
      if (data && data.level == 0) {
        this.chooseType = data;
        this.handleUsedWordList();
        this.wordForm.worditems = [];
        this.$forceUpdate();
      } else if (data && data.level == 1) {
        this.wordForm = data;
        this.handleUsedWordList(data.code);
        IllnessDetail({ code: data.code }).then((res) => {
          if (!res.result) return;
          let tempData = res.result;
          this.relationitemslist = tempData.relationitemslist;
          this.wordForm.worditems = tempData.illnesswords;
          this.$forceUpdate();
        });
      }
      this.chooseCode = data.code;
    },
    // 添加编辑分类弹框提交回调
    handleSubmitTypeForm() {
      if (!this.typeForm.name.trim()) {
        this.$message.warning("分组名称/序号不允许为空!");
        return;
      }
      let reg = /^\+?[0-9][0-9]*$/;
      if (!reg.test(this.typeForm.seqno)) {
        this.$message.warning("序号必须为数字!");
        return;
      }
      AddOrUpdate(this.typeForm).then((res) => {
        this.$message.success(res.message);
        this.chooseType = null;
        this.handleGetPageList();
        this.handleCloseTypeForm();
      });
    },
    // 添加编辑分类弹框关闭回调
    handleCloseTypeForm() {
      this.dialogFormVisible = false;
      this.handleResetTypeForm();
    },
    // 重置添加编辑分类表单
    handleResetTypeForm() {
      this.typeForm = {
        code: "",
        name: "",
        level: 0,
        seqno: 0,
      };
    },
    // 点击删除分类回调
    handleDelWordForm() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete([this.wordForm.code]).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.chooseType = null;
            this.handleGetPageList();
            this.handleResetWordForm();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击删除分类回调
    handleDelType() {
      if (!this.chooseType) {
        this.$message.warning("请先选中需要删除的分类!");
        return;
      }
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete([this.chooseType.code]).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.chooseType = null;
            this.handleGetPageList();
            this.handleResetTypeForm();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击编辑分类回调
    handleEditType() {
      if (!this.chooseType) {
        this.$message.warning("请先选中需要编辑的分类!");
        return;
      }
      this.typeForm = {
        code: this.chooseType.code,
        name: this.chooseType.name,
        level: this.chooseType.level,
        seqno: this.chooseType.seqno,
      };
      this.dialogFormVisible = true;
    },
    // 点击添加分类回调
    handleAddType() {
      this.handleResetTypeForm();
      this.dialogFormVisible = true;
    },
    // 筛选输入框回调
    handleSearchName() {},
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          if (!this.chooseType) {
            this.$message.warning("请先选中需要父级分类!");
            return;
          }
          this.handleResetWordForm(); // 解除表单限制
          this.wordForm.parentcode = this.chooseType.code;
          this.wordDisable = false; // 解除表单限制
          break;
        case "btnEdit": // 编辑
          if (!this.wordForm.code) {
            this.$message.warning("请先选中需要编辑的疾病信息!");
            return;
          }
          this.wordDisable = false; // 解除表单限制
          break;
        case "btnDel": // 删除
          if (!this.wordForm.code) {
            this.$message.warning("请先选中需要删除的疾病信息!");
            return;
          }
          this.handleDelWordForm(); // 解除表单限制
          break;
        case "btnRefresh": // 重置
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 树筛选方法回调
    filterNode(value, data) {
      if (!value) return true;
      let nowval = data[this.defaultProps.label].toUpperCase();
      return nowval.indexOf(value.toUpperCase()) !== -1;
      // return data.label.indexOf(value) !== -1;
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
  },

  watch: {
    searchName(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
<style lang='scss' scoped>
// @import url("./css/index.scss");
.dicillness {
  padding: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    .el-table__body tr.current-row > td {
      background-color: #5586d1 !important;
      color: #fff;
    }
    .search_box {
      display: flex;
      height: 40px;
      width: 100%;
      background-color: #f6f7fc;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      .search_box_btn {
        display: flex;
        .sbtn {
          margin: 0 10px;
        }
      }
      .el-input {
        width: 250px;
      }
    }
    .bodymain {
      width: 100%;
      height: calc(100% - 40px);
      box-sizing: border-box;
      padding: 5px;
      display: flex;
      .main_l {
        width: 330px;
        height: 100%;
        border-right: 3px solid #efefef;
        .btn_l_group {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
        }
        .tree_box {
          box-sizing: border-box;
          height: calc(100% - 40px);
          overflow-y: auto;
        }
      }
      .main_r {
        height: 100%;
        margin-left: 10px;
        width: calc(100% - 350px);
        .el-tabs {
          height: 100%;
          .suggest_box {
            height: 500px;
            .conc_text {
              height: 100%;
            }
            /deep/.el-textarea__inner {
              height: 100%;
            }
          }
          .disease_table_box {
            height: 500px;
            .disease_table {
              height: 100%;
            }
          }
          .second_table_box {
            height: 500px;
            .second_table {
              height: 100%;
            }
            .el-select {
              width: 100%;
            }
            .el-input {
              width: 100%;
            }
            .el-input__inner {
              border: 0;
              background-color: transparent;
            }
          }
        }
      }
    }
  }
}
</style>