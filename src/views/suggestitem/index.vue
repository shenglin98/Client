<template>
  <div class="suggestitem">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <el-input
          placeholder="请输入内容"
          v-model="searchNamePage"
          @clear="handleSearchName"
          @keyup.native.enter="handleSearchName"
          clearable
          size="small"
        >
        </el-input>
        <el-button
          icon="el-icon-search"
          size="small"
          plain
          class="sbtn"
          @click="handleSearchName"
          >搜索</el-button
        >
        <permission-btn
          class="btn_group"
          moduleName="customerResult"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <div class="bodymain">
        <el-row>
          <!-- 左边数据主列表 -->
          <el-col :span="8" class="itembox_l">
            <vxe-table
              ref="pageTable"
              height="auto"
              border="inner"
              :loading="loading"
              highlight-hover-row
              :data="suggestData"
              :sort-config="{ trigger: 'cell' }"
              :checkbox-config="{ reserve: true, trigger: 'row' }"
              @cell-click="handleChooseSuggest"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
            >
              <vxe-table-column
                field="recid"
                title="编码"
                width="120px"
                show-header-overflow
                show-overflow="title"
                show-footer-overflow
              ></vxe-table-column>
              <vxe-table-column
                field="name"
                title="推荐方案"
                min-width="200px"
                show-header-overflow
                show-overflow="title"
                show-footer-overflow
              ></vxe-table-column>
              <vxe-table-column
                field="sex"
                title="性别控制"
                width="110px"
                show-header-overflow
                show-overflow="title"
                show-footer-overflow
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
            </vxe-table>
          </el-col>
          <el-col :span="16" class="itembox_r">
            <!-- 推荐方案表单 -->
            <el-form
              ref="form"
              class="suggestform"
              :model="suggestForm"
              label-width="80px"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="推荐方案" size="mini">
                    <el-input v-model="suggestForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="性别" size="mini">
                    <el-select v-model="suggestForm.sex">
                      <el-option label="未知" :value="0"></el-option>
                      <el-option label="男" :value="1"></el-option>
                      <el-option label="女" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="启用" size="mini">
                    <el-select v-model="suggestForm.status">
                      <el-option label="启用" :value="0"></el-option>
                      <el-option label="停用" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- 推荐方案套餐+组合 -->
            <div class="contentbox">
              <!-- 套餐盒子 -->
              <div class="setmealbox">
                <div class="ctop_box">
                  <div class="ctitle">推荐套餐</div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleGetDicSetmealList"
                    >编 辑</el-button
                  >
                </div>
                <div class="cctable_box">
                  <vxe-table
                    ref="pageTable"
                    height="auto"
                    border="inner"
                    :loading="loading"
                    highlight-hover-row
                    :data="setmealData"
                    :sort-config="{ trigger: 'cell' }"
                    :checkbox-config="{ reserve: true, trigger: 'row' }"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                  >
                    <vxe-table-column
                      field="objectcode"
                      title="编码"
                      width="120px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    ></vxe-table-column>
                    <vxe-table-column
                      field="objectname"
                      title="套餐名称"
                      min-width="200px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    ></vxe-table-column>
                    <vxe-table-column
                      field="seqno"
                      title="顺序"
                      min-width="80px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.seqno"
                          size="mini"
                        ></el-input>
                      </template>
                    </vxe-table-column>
                  </vxe-table>
                </div>
              </div>
              <!-- 组合盒子 -->
              <div class="combinebox">
                <div class="ctop_box">
                  <div class="ctitle">推荐组合</div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleGetDicCombineList"
                    >编 辑</el-button
                  >
                </div>
                <div class="cctable_box">
                  <vxe-table
                    ref="pageTable"
                    height="auto"
                    border="inner"
                    :loading="loading"
                    highlight-hover-row
                    :data="combineData"
                    :sort-config="{ trigger: 'cell' }"
                    :checkbox-config="{ reserve: true, trigger: 'row' }"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                  >
                    <vxe-table-column
                      field="objectcode"
                      title="编码"
                      width="120px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    ></vxe-table-column>
                    <vxe-table-column
                      field="objectname"
                      title="组合名称"
                      min-width="200px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    ></vxe-table-column>
                    <vxe-table-column
                      field="seqno"
                      title="顺序"
                      min-width="80px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.seqno"
                          size="mini"
                        ></el-input>
                      </template>
                    </vxe-table-column>
                  </vxe-table>
                </div>
              </div>
            </div>
            <!-- 推荐说明 -->
            <div class="suggestremark">
              <div class="srtitle">推荐说明</div>
              <el-input
                type="textarea"
                class="explain"
                v-model="explain"
                resize="none"
                clearable
              ></el-input>
            </div>
            <!-- 推荐规则 -->
            <div class="suggestrule">
              <div class="ctop_box">
                <div class="ctitle">推荐规则</div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleAddReommendDetailItems"
                  >增 加</el-button
                >
              </div>
              <!-- 循环多个规则 -->
              <div
                class="suggestrule_item"
                v-for="(item, index) in recommenddetailitemsitems"
                :key="index"
              >
                <div class="sitop_box">
                  <div class="sitbtitle">规则 {{ index + 1 }}</div>
                  <div class="sitbtitle">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-plus"
                      @click="handleAddRecommendSon(index)"
                    ></el-button>
                    <!-- <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-minus"
                    ></el-button> -->
                  </div>
                  <div class="sitdel">
                    <el-link
                      type="primary"
                      @click="handleDelReommendDetailItems(index)"
                      >删 除</el-link
                    >
                  </div>
                </div>
                <div class="sitable_box">
                  <vxe-table
                    ref="pageTable"
                    height="auto"
                    border="inner"
                    :loading="loading"
                    highlight-hover-row
                    :data="item"
                    :sort-config="{ trigger: 'cell' }"
                    :checkbox-config="{ reserve: true, trigger: 'row' }"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                  >
                    <vxe-table-column
                      field="objecttype"
                      title="对象类型"
                      width="150px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.objecttype"
                          filterable
                          placeholder="请选择"
                          size="mini"
                        >
                          <el-option label="基本信息" :value="0"></el-option>
                          <el-option label="健康问卷" :value="1"></el-option>
                          <el-option label="检查结果" :value="2"></el-option>
                          <el-option label="疾病异常" :value="3"></el-option>
                          <el-option label="结果增量" :value="4"></el-option>
                        </el-select>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      field="objecttext"
                      title="对象"
                      width="150px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.objecttext"
                          size="mini"
                        ></el-input>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      field="judge"
                      title="判断"
                      width="150px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.judge"
                          filterable
                          size="mini"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item, index) in CalcRelation"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      field="objectvalue"
                      title="值"
                      min-width="170px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.objectvalue"
                          size="mini"
                        ></el-input>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      field="grouprelation"
                      title="分组"
                      width="150px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.grouprelation"
                          size="mini"
                        ></el-input>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      field="seqno"
                      title="操作"
                      min-width="60px"
                      show-header-overflow
                      show-overflow="title"
                      show-footer-overflow
                    >
                      <template slot-scope="scope">
                        <el-link
                          type="primary"
                          @click="handleDelRecommendSon(item, scope.row._XID)"
                          >删 除</el-link
                        >
                      </template>
                    </vxe-table-column>
                  </vxe-table>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 主体套餐弹框 -->
    <el-dialog
      class="page_dialog"
      title="套餐选择"
      :visible.sync="setMealdialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseSetMeal"
    >
      <div class="top_box">
        <el-input
          ref="searchInput"
          class="searchName"
          placeholder="请输入套餐名称"
          v-model="searchName"
          clearable
        >
        </el-input>
        <div class="btn_group">
          <el-button type="primary" @click="handleSubmitSetMeal"
            >确定</el-button
          >
          <el-button type="danger" @click="handleCloseSetMeal">取消</el-button>
        </div>
      </div>
      <div class="table_box">
        <vxe-table
          class="setMeal_table color_table"
          ref="setMeal"
          height="auto"
          border="inner"
          show-overflow
          :loading="loading"
          highlight-hover-row
          highlight-current-row
          :data="setmealitemsDataSS"
          :checkbox-config="{ reserve: true, trigger: 'row' }"
          :sort-config="{ trigger: 'cell' }"
          row-id="setmealcode"
          @checkbox-change="handleSelectSetMeal"
          @checkbox-all="handleSelectSetMealAll"
        >
          <vxe-table-column
            type="checkbox"
            width="45"
            :reserve-selection="true"
          ></vxe-table-column>
          <vxe-table-column
            field="setmealcode"
            title="套餐编码"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="setmealname"
            title="套餐名称"
            min-width="180px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="price"
            title="价格"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="companyprice"
            title="单位价格"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="性别"
            width="80px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          >
            <template v-slot="{ row }">
              <span>{{
                row.sex == 0 ? "未知" : row.sex == 1 ? "男" : "女"
              }}</span>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </el-dialog>
    <!-- 主体套餐弹框 -->
    <el-dialog
      class="page_dialog"
      title="套餐选择"
      :visible.sync="combinedialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseCombine"
    >
      <div class="top_box">
        <el-input
          ref="searchInput"
          class="searchName"
          placeholder="请输入套餐名称"
          v-model="searchName"
          clearable
        >
        </el-input>
        <div class="btn_group">
          <el-button type="primary" @click="handleSubmitCombine"
            >确定</el-button
          >
          <el-button type="danger" @click="handleCloseCombine">取消</el-button>
        </div>
      </div>
      <div class="table_box">
        <vxe-table
          class="setMeal_table color_table"
          ref="combine"
          height="auto"
          border="inner"
          show-overflow
          :loading="loading"
          highlight-hover-row
          highlight-current-row
          :data="combineitemsDataSS"
          :checkbox-config="{ reserve: true, trigger: 'row' }"
          :sort-config="{ trigger: 'cell' }"
          row-id="setmealcode"
          @checkbox-change="handleSelectCombine"
          @checkbox-all="handleSelectCombineAll"
        >
          <vxe-table-column
            type="checkbox"
            width="45"
            :reserve-selection="true"
          ></vxe-table-column>
          <vxe-table-column
            field="combinecode"
            title="组合编码"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="combinename"
            title="组合名称"
            min-width="180px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="deptname"
            title="科室"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="price"
            title="价格"
            width="100px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="性别"
            width="80px"
            show-header-overflow
            show-overflow="title"
            show-footer-overflow
          >
            <template v-slot="{ row }">
              <span>{{
                row.sex == 0 ? "未知" : row.sex == 1 ? "男" : "女"
              }}</span>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import { getDicSetmealList } from "@/api/setMealDialog.js";
import { getPublicConfig } from "@/api/dataanalysis.js";
import {
  DicRecommendLoad,
  DicRecommendDetail,
  DicRecommendSave,
} from "@/api/suggestitem.js";
export default {
  name: "suggestitem",

  components: { Sticky, permissionBtn },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    setmealitemsDataSS() {
      const search = this.searchName;
      if (search) {
        return this.setmealitems.filter((data) => {
          return Object.keys(data).some((key) => {
            if (key === "price") return;
            let containArr = [
              "setmealcode",
              "setmealname",
              "setmealpx",
              "setmealwb",
            ];
            // let containArr = ["combinename", "combinepy", "combinewb"];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.setmealitems;
    },
    combineitemsDataSS() {
      const search = this.searchName;
      if (search) {
        return this.combineitems.filter((data) => {
          return Object.keys(data).some((key) => {
            let containArr = [
              "combinecode",
              "combinename",
              "combinepy",
              "combinewb",
            ];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.combineitems;
    },
  },

  data() {
    return {
      searchNamePage: "", // 搜索关键字
      searchName: "", // 搜索关键字
      suggestData: [],
      loading: false,
      isSuggest: false,
      suggestForm: {
        name: "",
        sex: 0,
        status: 0,
      },
      CalcRelation: [],
      setmealData: [],
      combineData: [],
      explain: "",
      recommenddetailitemsitems: [[]],
      setmealitems: [],
      setmealitemsData: [],
      combineitems: [],
      combineitemsData: [],
      setMealdialogVisible: false,
      combinedialogVisible: false,
      selectSetMeal: [],
      selectCombine: [],
      suggestDetail: null,
    };
  },

  mounted() {
    this.handleGetPublicConfig(); // 计算符号
  },

  methods: {
    // 获取推荐套餐详情回调
    handleDicRecommendDetail(recid) {
      DicRecommendDetail({ recid }).then((res) => {
        if (!res.result) return;
        let data = res.result;
        this.suggestDetail = res.result;
        this.suggestForm.name = data.name;
        this.suggestForm.sex = data.sex;
        this.suggestForm.status = data.status;
        this.explain = data.explain;
        this.recommenddetailitemsitems = data.recommenddetailitemsitems;
        let setmeal = data.recommendcombineitems.filter(
          (k) => k.rectype === 0
        )[0];
        setmeal && (this.setmealData = setmeal.combineitems);
        let combine = data.recommendcombineitems.filter(
          (k) => k.rectype === 1
        )[0];
        combine && (this.combineData = combine.combineitems);
        console.log(setmeal);
        console.log(combine);
      });
    },
    // 获取推荐套餐列表回调
    handleDicRecommendLoad() {
      DicRecommendLoad({
        page: 1,
        limit: 100000,
        key: this.searchNamePage,
      }).then((res) => {
        this.suggestData = res.data;
      });
    },
    handleAddSuggestForm() {
      this.suggestForm = {
        name: "",
        sex: 0,
        status: 0,
      };
      this.explain = "";
      this.suggestData = [];
      this.setmealData = [];
      this.combineData = [];
      this.suggestDetail = null;
      this.recommenddetailitemsitems = [[]];
      this.handleDicRecommendLoad();
    },
    // 点击保存新增/编辑回调
    handleSaveSuggestForm() {
      let data = {
        recid: (this.suggestDetail && this.suggestDetail.recid) || "",
        code: (this.suggestDetail && this.suggestDetail.code) || "",
        name: this.suggestForm.name,
        sex: this.suggestForm.sex,
        explain: this.explain,
        status: this.suggestForm.status,
        recommenddetailitemsitems: this.recommenddetailitemsitems,
        recommendCombineItems: [...this.setmealData, ...this.combineData],
      };
      DicRecommendSave(data).then((res) => {
        this.$message.success(res.message);
        this.handleAddSuggestForm();
      });
    },
    // 点击新增规则
    handleAddReommendDetailItems() {
      this.recommenddetailitemsitems.push([]);
    },
    // 点击删除规则
    handleDelReommendDetailItems(index) {
      this.recommenddetailitemsitems.splice(index, 1);
    },
    // 点击新增规则子项
    handleAddRecommendSon(index) {
      this.recommenddetailitemsitems[index].push({
        detid: "",
        recid: "",
        groupid: "",
        objecttype: 0,
        objecttext: "",
        judge: "",
        objectvalue: "",
        grouprelation: "",
        relation: "",
        seqno: 0,
      });
    },
    // 点击删除规则子项
    handleDelRecommendSon(item, id) {
      let index = item.findIndex((k) => k._XID === id);
      item.splice(index, 1);
    },
    // 选中套餐回调
    handleSubmitSetMeal() {
      this.setmealData = this.selectSetMeal.map((k, i) => {
        return {
          comid: "",
          recid: "",
          rectype: 0,
          objectcode: k.setmealcode,
          objectname: k.setmealname,
          seqno: i + 1,
        };
      });
      this.handleCloseSetMeal();
    },
    // 选中组合回调
    handleSubmitCombine() {
      this.combineData = this.selectCombine.map((k, i) => {
        return {
          comid: "",
          recid: "",
          rectype: 1,
          objectcode: k.combinecode,
          objectname: k.combinename,
          seqno: i + 1,
        };
      });
      this.handleCloseCombine();
    },
    // 公共配置编码
    handleGetPublicConfig() {
      getPublicConfig({ cc: "CalcRelation" }).then((res) => {
        this.CalcRelation = res.result;
      });
    },
    // 点击行数据回调
    handleChooseSuggest({ row }) {
      console.log(row, "row");
      if (!row) return;
      this.handleDicRecommendDetail(row.recid);
    },
    handleSelectSetMealAll({ records }) {
      this.selectSetMeal = records;
    },
    handleSelectSetMeal({ records }) {
      this.selectSetMeal = records;
    },
    handleSelectCombineAll({ records }) {
      this.selectCombine = records;
    },
    handleSelectCombine({ records }) {
      this.selectCombine = records;
    },
    // 关闭套餐选择弹框回调
    handleCloseSetMeal() {
      this.selectSetMeal = [];
      this.setmealitems = [];
      this.setmealitemsData = [];
      this.$refs.setMeal.clearCheckboxRow();
      //   this.$refs.setMeal.setAllCheckboxRow(false);
      this.setMealdialogVisible = false;
    },
    // 关闭组合选择弹框回调
    handleCloseCombine() {
      this.selectCombine = [];
      this.combineitems = [];
      this.combineitemsData = [];
      this.$refs.combine.clearCheckboxRow();
      this.combinedialogVisible = false;
    },
    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.suggestForm.sex, gp: "1" }).then(
        (res) => {
          this.loading = false;
          if (!res.result) return;
          this.setMealdialogVisible = true;
          this.setmealitems = res.result.setmealitems;
          this.setmealitemsData = [...this.setmealitems];
          setTimeout(() => {
            this.$refs.searchInput.focus();
            //   默认选中第一行 this.setmealData
            let inCode = this.setmealData.map((k) => {
              return k.objectcode;
            });
            this.setmealitemsData.forEach((k) => {
              if (inCode.includes(k.setmealcode)) {
                this.$refs.setMeal.setCheckboxRow(k, true);
              }
            });
          }, 500);
        }
      );
    },
    // 获取表格数据回调
    handleGetDicCombineList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.suggestForm.sex, gp: "1" }).then(
        (res) => {
          this.loading = false;
          if (!res.result) return;
          this.combinedialogVisible = true;
          this.combineitems = res.result.combineitems;
          this.combineitemsData = [...this.combineitems];
          setTimeout(() => {
            this.$refs.searchInput.focus();
            //   默认选中第一行 this.combineData
            let inCode = this.combineData.map((k) => {
              return k.objectcode;
            });
            this.combineitemsData.forEach((k) => {
              if (inCode.includes(k.combinecode)) {
                this.$refs.combine.setCheckboxRow(k, true);
              }
            });
          }, 500);
        }
      );
    },
    // 搜索控件回调
    handleSearchName() {
      this.handleDicRecommendLoad();
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
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.handleAddSuggestForm();
          break;
        case "btnSave": // 新增
          this.handleSaveSuggestForm();
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
      stylejson.height = "32px";
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

  watch: {},
};
</script>
<style lang='scss' scoped>
.suggestitem {
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
    .search_box {
      display: flex;
      height: 40px;
      width: 100%;
      background-color: #f6f7fc;
      box-sizing: border-box;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      .sbtn {
        margin: 0 5px;
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
      .el-row {
        width: 100%;
        height: 100%;
        .itembox_l {
          height: 100%;
          box-sizing: border-box;
        }
        .itembox_r {
          height: 100%;
          box-sizing: border-box;
          padding-left: 5px;
          overflow-y: auto;
          /deep/.suggestform {
            .el-form-item {
              margin-bottom: 10px;
            }
          }
          .contentbox {
            height: 270px;
            display: flex;
            justify-content: space-between;
            .setmealbox,
            .combinebox {
              width: 49%;
              height: 100%;
              .ctop_box {
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .ctitle {
                  font-size: 18px;
                  font-weight: 600;
                }
              }
              .cctable_box {
                height: calc(100% - 30px);
              }
            }
          }
          .suggestremark {
            height: 160px;
            .srtitle {
              height: 28px;
              font-size: 18px;
              font-weight: 600;
            }
            .explain {
              height: calc(100% - 28px);
              /deep/.el-textarea__inner {
                height: 100%;
              }
            }
          }
          .suggestrule {
            margin-top: 5px;
            .ctop_box {
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .ctitle {
                font-size: 18px;
                font-weight: 600;
              }
            }
            .suggestrule_item {
              .sitop_box {
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border: 1px solid #dcdfe6;
                box-sizing: border-box;
                padding: 0 10px;
                border-radius: 4px 4px 0 0;
              }
              .sitable_box {
                min-height: 200px;
                max-height: 300px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang='scss'>
.el-message-box__wrapper {
  z-index: 9999 !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.color_table .row-high-color {
  background-color: #81d3f8;
  // background-color: #e6f7ff;
}
.zzXindex {
  z-index: 999999 !important;
}
.disable_row {
  position: relative;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    cursor: not-allowed;
    z-index: 66;
  }
}
.top_box {
  height: 35px;
  display: flex;
  .btn_group {
    display: flex;
    width: 150px;
  }
  .searchName {
    width: calc(100% - 150px);
    height: 100%;
    margin-right: 10px;
    .el-input__inner {
      height: 100%;
    }
  }
}
.table_box {
  margin-top: 12px;
  height: 450px;
  .vxe-table--header-wrapper {
    background-color: #d0ddeb !important;
  }
  .vxe-table .vxe-body--column.col--ellipsis {
    height: 30px;
  }
  .vxe-table .vxe-body--column:not(.col--ellipsis),
  .vxe-table .vxe-footer--column:not(.col--ellipsis),
  .vxe-table .vxe-header--column:not(.col--ellipsis) {
    padding: 5px 0;
    height: 30px;
  }
}
</style>
<style lang='scss' scoped>
@import "./css/index_qyzyy.scss";
</style>