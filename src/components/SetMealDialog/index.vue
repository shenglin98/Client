<template>
  <div class="setmeal_dialog">
    <!-- 主体套餐弹框 -->
    <el-dialog
      class="page_dialog"
      title="套餐组合选择"
      :visible.sync="dialogVisible"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseSetMeal"
    >
      <div class="content">
        <div class="content_top">
          <div class="search_box">
            <el-input
              size="mini"
              placeholder="请输入套餐或组合名称"
              v-model="searchName"
              clearable
            >
            </el-input>
            <el-button size="mini" plain type="primary">搜 索</el-button>
          </div>
          <div class="total_box">
            <div class="total">
              <div class="title">总数（个）</div>
              <div class="value">{{ totalNumber }}</div>
            </div>
            <div class="total">
              <div class="title bgtwo">费用（元）</div>
              <div class="value">{{ totalPrice }}</div>
            </div>
          </div>
          <div class="btn_template">
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleSubmitSetMeal"
              >确 认</el-button
            >
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleSaveTemplate"
              >保存模板</el-button
            >
            <el-button size="mini" plain type="primary" @click="handleResetPage"
              >刷新</el-button
            >
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleEmptyChooseData"
              >清空</el-button
            >
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleCloseSetMeal"
              >关 闭</el-button
            >
          </div>
        </div>
        <div class="table_box">
          <!-- 套餐表格 -->
          <!-- <EasyTable class="setmeal_table" ref="setmealitems" :loading="loading" height="100%" :data="setmealitemsData" :tableOptions="setmealitemsOptions" :checkbox-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="handleTableRowColor" :cell-style="{ padding: '0' }" @selected-change="handleSelectSetMeal" :row-key="handleGetSetmealitemsKey" /> -->
          <vxe-table
            class="setmeal_table"
            ref="setmealitems"
            height="auto"
            border="inner"
            :loading="loading"
            highlight-hover-row
            :data="setmealitemsData"
            :checkbox-config="{ reserve: true }"
            :sort-config="{ trigger: 'cell' }"
            @checkbox-change="handleSelectSetMeal"
            row-id="setmealcode"
          >
            <vxe-table-column
              type="checkbox"
              width="45"
              :reserve-selection="true"
            ></vxe-table-column>
            <vxe-table-column
              field="setmealname"
              title="套餐名称"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="价格"
              width="80px"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
          </vxe-table>
          <vxe-table
            class="combination_table"
            ref="combinationOne"
            v-if="showTableFlag"
            height="auto"
            border="inner"
            show-overflow
            :loading="loading"
            highlight-hover-row
            :data="combinationOneData"
            :checkbox-config="{ reserve: true }"
            :row-class-name="handleReturnIsChecked"
            :sort-config="{ trigger: 'cell' }"
            row-id="combinecode"
            @checkbox-change="handleSelectcomOne"
          >
            <vxe-table-column
              type="checkbox"
              width="45"
              :reserve-selection="true"
            ></vxe-table-column>
            <vxe-table-column
              field="combinename"
              title="组合名称"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="价格"
              width="80px"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
          </vxe-table>
          <vxe-table
            class="combination_table"
            ref="combinationTwo"
            height="auto"
            border="inner"
            show-overflow
            :loading="loading"
            highlight-hover-row
            :data="combinationTwoData"
            :checkbox-config="{ reserve: true }"
            :row-class-name="handleReturnIsChecked"
            :sort-config="{ trigger: 'cell' }"
            row-id="combinecode"
            @checkbox-change="handleSelectcomTwo"
          >
            <vxe-table-column
              type="checkbox"
              width="45"
              :reserve-selection="true"
            ></vxe-table-column>
            <vxe-table-column
              field="combinename"
              title="组合名称"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="价格"
              width="80px"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
          </vxe-table>
          <vxe-table
            class="combination_table"
            ref="combinationThree"
            height="auto"
            border="inner"
            show-overflow
            :loading="loading"
            highlight-hover-row
            :data="combinationThreeData"
            :checkbox-config="{ reserve: true }"
            :row-class-name="handleReturnIsChecked"
            :sort-config="{ trigger: 'cell' }"
            row-id="combinecode"
            @checkbox-change="handleSelectcomThree"
          >
            <vxe-table-column
              type="checkbox"
              width="45"
              :reserve-selection="true"
            ></vxe-table-column>
            <vxe-table-column
              field="combinename"
              title="组合名称"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="价格"
              width="80px"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
          </vxe-table>
          <!-- 项目表格 -->
          <!-- <EasyTable class="combination_table" ref="combinationOne" :loading="loading" height="100%" :data="combinationOneData" :tableOptions="combinationOptions" :checkbox-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" @selected-change="handleSelectcomOne" :row-key="handleGetcombinationKey" />
          <EasyTable class="combination_table" ref="combinationTwo" :loading="loading" height="100%" :data="combinationTwoData" :tableOptions="combinationOptions" :checkbox-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" @selected-change="handleSelectcomTwo" :row-key="handleGetcombinationKey" />
          <EasyTable class="combination_table" ref="combinationThree" :loading="loading" height="100%" :data="combinationThreeData" :tableOptions="combinationOptions" :checkbox-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" @selected-change="handleSelectcomThree" :row-key="handleGetcombinationKey" /> -->
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button size="mini" plain type="primary" @click="handleSubmitSetMeal"
          >确 认</el-button
        >
        <el-button size="mini" plain type="primary" @click="handleCloseSetMeal"
          >关 闭</el-button
        >
      </span> -->
    </el-dialog>
    <!-- 保存模板弹框 -->
    <el-dialog
      class="temp_dialog"
      title="套餐模板维护"
      :visible.sync="showTemplate"
      width="45%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="content">
        <div class="update_temp">
          <div class="head">更新模板</div>
          <EasyTable
            class="template_table"
            ref="template_table"
            :loading="loading"
            height="100%"
            :data="templateData"
            :tableOptions="templateOptions"
            :radio-config="{ fetch: true, rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
            @checked-change="handleSelectTemplate"
          />
        </div>
        <div class="add_temp">
          <div class="head">新增模板</div>
          <div class="input_box">
            模板名称：<el-input v-model="tempName" size="mini" clearable>
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          plain
          type="primary"
          @click="handleSubmitTemplate"
          >确 认</el-button
        >
        <el-button size="mini" plain type="primary" @click="handleCloseTemplate"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDicSetmealList,
  getTemplateList,
  setTemplateAddorUpdate,
  setTemplateDelete,
} from "@/api/setMealDialog.js";
import { mapGetters } from "vuex";

export default {
  name: "",

  components: {},
  props: {
    groupTableData: {
      type: Array,
      required: true,
    },
    flag: {
      type: String,
    },
    sex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialogVisible: true, // 显示项目弹框
      searchName: "", // 检索名称
      loading: false, // 加载效果
      setmealitems: [], // 套餐表格数据 -- 源数据不改变
      combinationOne: [], // 项目表格1数据 -- 源数据不改变
      combinationTwo: [], // 项目表格2数据 -- 源数据不改变
      combinationThree: [], // 项目表格3数据 -- 源数据不改变
      chooseone: [], // 项目表格1数据 -- 选中操作数据
      choosetwo: [], // 项目表格1数据 -- 选中操作数据
      choosethree: [], // 项目表格1数据 -- 选中操作数据
      selectSetMeal: [], // 套餐选中数据
      showTemplate: false, // 控制显示模板
      templateData: [], // 模板列表数据
      tempName: "", // 新增模板名称
      selectTemplate: [], // 个人模板表格选中数据
      templateObj: {
        code: "",
        name: "",
        price: 0,
        companyprice: 0,
        sex: 0,
        status: 0,
        seqno: 0,
        combineitems: [],
      },
      showTableFlag: true, // 控制表格显示
    };
  },
  computed: {
    ...mapGetters(["name", "id"]),
    // 套餐表格配置
    setmealitemsOptions() {
      return [
        {
          type: "selection",
          width: 45,
          attrs: {
            "reserve-selection": true,
          },
        },
        {
          title: "套餐名称",
          omit: 1,
          prop: "setmealname",
        },
        {
          title: "价格",
          prop: "price",
          width: 80,
          omit: 1,
        },
      ];
    },
    // 项目表格配置
    combinationOptions() {
      return [
        {
          type: "selection",
          width: 45,
          attrs: {
            "reserve-selection": true,
          },
        },
        {
          title: "组合名称",
          omit: 1,
          prop: "combinename",
        },
        {
          title: "价格",
          prop: "price",
          width: 80,
          omit: 1,
        },
      ];
    },
    // 模板列表表格配置
    templateOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          title: "套餐模板",
          omit: 1,
          prop: "name",
        },
        {
          title: "价格",
          prop: "price",
          width: 80,
          omit: 1,
        },
        {
          title: "操作",
          width: 80,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() =>
                  this.handleSetTemplateDelete(data)
                }
              >
                删除
              </el-link>
            );
          },
        },
      ];
    },
    // 总选择组合个数
    totalNumber() {
      return [...this.chooseone, ...this.choosetwo, ...this.choosethree].length;
    },
    // 总选择金额
    totalPrice() {
      let price = 0;
      [...this.chooseone, ...this.choosetwo, ...this.choosethree].forEach(
        (item) => {
          price += item.price;
        }
      );
      return price.toFixed(2);
    },
    // 套餐表格搜索数据
    setmealitemsData() {
      const search = this.searchName;
      if (search) {
        return this.setmealitems.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.setmealitems;
    },
    // 组合表格搜索数据1
    combinationOneData() {
      const search = this.searchName;
      if (search) {
        return this.combinationOne.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.combinationOne;
    },
    // 组合表格搜索数据2
    combinationTwoData() {
      const search = this.searchName;
      if (search) {
        return this.combinationTwo.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.combinationTwo;
      // 组合表格搜索数据2
    },
    // 组合表格搜索数据3
    combinationThreeData() {
      const search = this.searchName;
      if (search) {
        return this.combinationThree.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.combinationThree;
    },
  },

  mounted() {
    // 项目加载获取表格数据
    this.handleGetDicSetmealList();
  },

  methods: {
    // 组合是否禁用回调
    handleReturnIsChecked({ row }) {
      // true--可以勾选  false--不允许勾选
      if (this.flag === "edit") {
        let editFlag = this.groupTableData.filter((k) => {
          return k.combinecode === row.combinecode && k.status >= 2;
        })[0];
        if (!editFlag) {
          return "";
        } else {
          return "disable_row";
        }
      } else {
        return "";
      }
    },
    // 项目刷新回调
    handleResetPage() {
      this.chooseone = [];
      this.choosetwo = [];
      this.choosethree = [];
      this.selectSetMeal = [];
      this.handleGetDicSetmealList();
      if (this.flag == "add") {
        // 清空前面回显
        this.$refs.setmealitems.clearCheckboxRow();
        this.$refs.combinationOne.clearCheckboxRow();
        this.$refs.combinationTwo.clearCheckboxRow();
        this.$refs.combinationThree.clearCheckboxRow();
      }
    },
    // 获取套餐 - 指定一个key标识这一行的数据
    handleGetSetmealitemsKey(row) {
      //id为row的data属性之一，必须唯一且与tableData中保持一致
      return row.setmealcode;
    },
    // 获取组合123 - 指定一个key标识这一行的数据
    handleGetcombinationKey(row) {
      //id为row的data属性之一，必须唯一且与tableData中保持一致
      return row.combinecode;
    },
    // 提交套餐选择弹框回调
    handleSubmitSetMeal() {
      // 套餐可选性
      let chooseObj = undefined;
      let data = [...this.chooseone, ...this.choosetwo, ...this.choosethree];
      if (
        this.selectSetMeal.length === 1 &&
        this.selectSetMeal[0].combineitems.length === data.length
      ) {
        chooseObj = this.selectSetMeal[0];
      }
      data = data.map((item) => {
        return {
          detid: "",
          regid: "",
          setmealcode: (chooseObj && chooseObj.setmealcode) || "",
          setmealname: (chooseObj && chooseObj.setmealname) || "",
          combinecode: item.combinecode,
          combinename: item.combinename,
          deptcode: item.deptcode,
          deptname: item.deptname,
          operatorname: this.name || "",
          operatordate: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 16)
            .replace("T", " "),
          price: item.price,
          discount: 1,
          discountprice: item.price,
        };
      });
      this.$emit("submit", data); // 发送数据父组件
    },
    // 关闭套餐选择弹框回调
    handleCloseSetMeal() {
      this.$emit("close", false);
    },
    // 模板删除回调
    handleSetTemplateDelete(item) {
      console.log("触发");
      this.$confirm("此操作将删除当前模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = [item.code];
          setTemplateDelete(codeItems).then((res) => {
            this.$message({
              message: res.message,
              type: "success",
              customClass: "zzXindex",
            });
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleGetTemplateList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 模板确认提交回调
    handleSubmitTemplate() {
      if (this.tempName != "" && this.selectTemplate.length != 0) {
        this.$message({
          message: "不能同时更新并新增!",
          type: "warning",
          customClass: "zzXindex",
        });
        return false;
      }
      //   新增
      if (this.tempName !== "") {
        this.templateObj.name = this.tempName;
        this.templateObj.combineitems = [
          ...this.chooseone,
          ...this.choosetwo,
          ...this.choosethree,
        ].map((k) => {
          return k.combinecode;
        });
        setTemplateAddorUpdate(this.templateObj).then((res) => {
          this.$message({
            message: res.message,
            type: "success",
            customClass: "zzXindex",
          });
          this.handleCloseTemplate();
        });
        return false;
      }
      //   更新
      if (this.selectTemplate.length === 1) {
        this.templateObj.code = this.selectTemplate[0].code;
        this.templateObj.name = this.selectTemplate[0].name;
        this.templateObj.combineitems = [
          ...this.chooseone,
          ...this.choosetwo,
          ...this.choosethree,
        ].map((k) => {
          return k.combinecode;
        });
        setTemplateAddorUpdate(this.templateObj).then((res) => {
          this.$message({
            message: res.message,
            type: "success",
            customClass: "zzXindex",
          });
          this.handleCloseTemplate();
        });
        return false;
      }
    },
    // 模板关闭回调
    handleCloseTemplate() {
      this.tempName = "";
      this.selectTemplate = [];
      this.showTemplate = false;
      //   this.handleGetDicSetmealList();
    },
    handleSelectTemplate(item) {
      this.selectTemplate = [];
      console.log(item, "item");
      console.log(this.selectTemplate);
      this.selectTemplate.push(item);
    },
    // 保存模板按钮回调
    handleSaveTemplate() {
      let flagLength = [
        ...this.chooseone,
        ...this.choosetwo,
        ...this.choosethree,
      ].length;
      if (flagLength === 0) {
        this.$message.warning("组合不能为空!");
        return false;
      }
      this.handleGetTemplateList();
      this.showTemplate = true;
    },
    // 获取个人模板表格数据
    handleGetTemplateList() {
      getTemplateList({
        page: 1,
        limit: 1000000,
        key: "",
      }).then((res) => {
        this.templateData = res.data;
      });
    },
    // 套餐选中数据回调
    handleSelectSetMeal({ records, reserves }) {
      if (reserves.length > 0) {
        this.selectSetMeal = [...records, ...reserves];
      } else {
        this.selectSetMeal = records;
      }
      // 清空前面回显
      this.$refs.combinationOne.clearCheckboxRow();
      this.$refs.combinationTwo.clearCheckboxRow();
      this.$refs.combinationThree.clearCheckboxRow();
      this.chooseone = [];
      this.choosetwo = [];
      this.choosethree = [];
      this.selectSetMeal.forEach((item) => {
        this.combinationOne.forEach((val) => {
          let itemcode = item.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 手动添加到选中项
            let index = this.chooseone.findIndex(
              (k) => k.combinecode == val.combinecode
            );
            index == -1 && this.chooseone.push(val);
            let indexDel = this.combinationOne.findIndex(
              (k) => k.combinecode == val.combinecode
            );
            if (indexDel > 1) {
              this.combinationOne.splice(indexDel, 1);
              this.combinationOne.unshift(val);
            }
            // 回显
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.combinationOne.setCheckboxRow([val], true);
              }, 100);
            });
          }
        });
        this.combinationTwo.forEach((val) => {
          let itemcode = item.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 手动添加到选中项
            let index = this.choosetwo.findIndex(
              (k) => k.combinecode == val.combinecode
            );
            index == -1 && this.choosetwo.push(val);
            let indexDel = this.combinationTwo.findIndex(
              (k) => k.combinecode == val.combinecode
            );
            if (indexDel > 1) {
              this.combinationTwo.splice(indexDel, 1);
              this.combinationTwo.unshift(val);
            }
            // 回显
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.combinationTwo.setCheckboxRow([val], true);
              }, 100);
            });
          }
        });
        this.combinationThree.forEach((val) => {
          let itemcode = item.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 手动添加到选中项
            let index = this.choosethree.findIndex(
              (k) => k.combinecode == val.combinecode
            );
            index == -1 && this.choosethree.push(val);
            let indexDel = this.combinationThree.findIndex(
              (k) => k.combinecode == val.combinecode
            );
            if (indexDel > 1) {
              this.combinationThree.splice(indexDel, 1);
              this.combinationThree.unshift(val);
            }
            // 回显
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.combinationThree.setCheckboxRow([val], true);
              }, 100);
            });
          }
        });
      });
    },
    // 组合选择数据回调1
    handleSelectcomOne({ records, reserves }) {
      let flag = true;
      if (reserves.length > 0) {
        this.chooseone = Object.assign([], [...records, ...this.chooseone]);
      } else {
        flag = false;
        this.chooseone = Object.assign([], records);
      }
      let map = new Map();
      for (let item of this.chooseone) {
        map.set(item.combinecode, item);
      }
      this.chooseone = [...map.values()];
      this.chooseone.forEach((item) => {
        this.combinationOne.forEach((k, i) => {
          if (item.combinecode == k.combinecode) {
            this.combinationOne.splice(i, 1);
          }
        });
      });
      if (!flag) {
        if (this.chooseone.length == 1) {
          this.combinationOne.unshift(...this.chooseone);
        } else if (this.chooseone.length > 1) {
          let start = this.chooseone.splice(this.chooseone.length - 1, 1);
          this.chooseone.unshift(...start);
          this.combinationOne.unshift(...this.chooseone);
        }
      } else {
        this.combinationOne.unshift(...this.chooseone);
      }
    },
    // 组合选择数据回调2
    handleSelectcomTwo({ records, reserves }) {
      let flag = true;
      if (reserves.length > 0) {
        this.choosetwo = Object.assign([], [...records, ...this.choosetwo]);
      } else {
        flag = false;
        this.choosetwo = Object.assign([], records);
      }
      let map = new Map();
      for (let item of this.choosetwo) {
        map.set(item.combinecode, item);
      }
      this.choosetwo = [...map.values()];
      this.choosetwo.forEach((item) => {
        this.combinationTwo.forEach((k, i) => {
          if (item.combinecode == k.combinecode) {
            this.combinationTwo.splice(i, 1);
          }
        });
      });
      if (!flag) {
        if (this.choosetwo.length == 1) {
          this.combinationTwo.unshift(...this.choosetwo);
        } else if (this.choosetwo.length > 1) {
          let start = this.choosetwo.splice(this.choosetwo.length - 1, 1);
          this.choosetwo.unshift(...start);
          this.combinationTwo.unshift(...this.choosetwo);
        }
      } else {
        this.combinationTwo.unshift(...this.choosetwo);
      }
    },
    // 组合选择数据回调3
    handleSelectcomThree({ records, reserves }) {
      let flag = true;
      if (reserves.length > 0) {
        this.choosethree = Object.assign([], [...records, ...this.choosethree]);
      } else {
        flag = false;
        this.choosethree = Object.assign([], records);
      }
      let map = new Map();
      for (let item of this.choosethree) {
        map.set(item.combinecode, item);
      }
      this.choosethree = [...map.values()];
      this.choosethree.forEach((item) => {
        this.combinationThree.forEach((k, i) => {
          if (item.combinecode == k.combinecode) {
            this.combinationThree.splice(i, 1);
          }
        });
      });
      if (!flag) {
        if (this.choosethree.length == 1) {
          this.combinationThree.unshift(...this.choosethree);
        } else if (this.choosethree.length > 1) {
          let start = this.choosethree.splice(this.choosethree.length - 1, 1);
          this.choosethree.unshift(...start);
          this.combinationThree.unshift(...this.choosethree);
        }
      } else {
        this.combinationThree.unshift(...this.choosethree);
      }
    },
    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.sex }).then((res) => {
        this.loading = false;
        this.setmealitems = res.result.setmealitems;
        this.combinationOne = res.result.combineitems[0].combineitems;
        this.combinationTwo = res.result.combineitems[1].combineitems;
        this.combinationThree = res.result.combineitems[2].combineitems;
        this.$nextTick(() => {
          if (this.groupTableData.length > 0) {
            this.$refs.combinationOne.clearCheckboxRow();
            this.$refs.combinationTwo.clearCheckboxRow();
            this.$refs.combinationThree.clearCheckboxRow();
            this.chooseone = [];
            this.choosetwo = [];
            this.choosethree = [];
            this.groupTableData.forEach((item, index) => {
              this.combinationOne.forEach((val) => {
                if (val.combinecode == item.combinecode) {
                  // 手动添加到选中项
                  let index = this.chooseone.findIndex(
                    (k) => k.combinecode == val.combinecode
                  );
                  index == -1 && this.chooseone.push(val);
                  let indexDel = this.combinationOne.findIndex(
                    (k) => k.combinecode == val.combinecode
                  );
                  if (indexDel > 1) {
                    this.combinationOne.splice(indexDel, 1);
                    this.combinationOne.unshift(val);
                  }
                  // 回显
                  this.$nextTick(() => {
                    this.$refs.combinationOne.setCheckboxRow(val, true);
                  });
                }
              });
              this.combinationTwo.forEach((val) => {
                if (val.combinecode == item.combinecode) {
                  // 手动添加到选中项
                  let index = this.choosetwo.findIndex(
                    (k) => k.combinecode == val.combinecode
                  );
                  index == -1 && this.choosetwo.push(val);
                  let indexDel = this.combinationTwo.findIndex(
                    (k) => k.combinecode == val.combinecode
                  );
                  if (indexDel > 1) {
                    this.combinationTwo.splice(indexDel, 1);
                    this.combinationTwo.unshift(val);
                  }
                  // 回显
                  this.$nextTick(() => {
                    this.$refs.combinationTwo.toggleCheckboxRow(val);
                  });
                }
              });
              this.combinationThree.forEach((val) => {
                if (val.combinecode == item.combinecode) {
                  // 手动添加到选中项
                  let index = this.choosethree.findIndex(
                    (k) => k.combinecode == val.combinecode
                  );
                  index == -1 && this.choosethree.push(val);
                  let indexDel = this.combinationThree.findIndex(
                    (k) => k.combinecode == val.combinecode
                  );
                  if (indexDel > 1) {
                    this.combinationThree.splice(indexDel, 1);
                    this.combinationThree.unshift(val);
                  }
                  // 回显
                  this.$nextTick(() => {
                    this.$refs.combinationThree.toggleCheckboxRow(val);
                  });
                }
              });
            });
          }
        });
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
    handleTableRowColor({ row, rowIndex }) {
      let rowBackground = {};
      if (row.setmealtyp == "Person") {
        rowBackground.background = "rgba(0, 255, 255, 0.5)";
        return rowBackground;
      }
    },
  },

  watch: {},
};
</script>
<style lang='scss'>
.el-message-box__wrapper {
  z-index: 9999 !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
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
</style>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>