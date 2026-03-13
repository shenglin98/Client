<template>
  <div class="project">
    <!-- 体检项目 -->
    <el-dialog class="dialog-mini" width="75%" height="60%" top="4%" :close-on-click-modal="false" title="添加项目" :visible.sync="show" @close="handleCloseMedicalItems">
      <!-- 搜索组件 -->
      <el-card class="box-card ">
        <div class="search_head">
          <div class="search_box">
            <el-input size="mini" placeholder="套餐名称" v-model="keyword"></el-input>
            <el-button size="mini" type="primary" @click="handleAddProject">搜索</el-button>
          </div>
          <div class="price_box" v-if="totalPrice>0">
            已选项目费用合计{{ totalPrice }}元
          </div>
        </div>
        <div class="table_body">
          <!-- 套餐合集 -->
          <!-- <el-table border :data="setmealitems" height="450px" v-loading="listLoading" @row-click="hadnleGetCurrentRow">
            <el-table-column align="center" width="45">
              <template slot-scope="scope">
                <el-radio :label="scope.row.setmealcode" v-model="setmealRadio" @change.native="getCurrentRow(scope.row)"><span></span></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="setmealname" label="项目名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="85" show-overflow-tooltip>
            </el-table-column>
          </el-table> -->
          <EasyTable :loading="loading" height="100%" row-id="setmealcode" ref="setmealTable" :data="setmealitems" :tableOptions="tableOptions" :radio-config="{selectedVal:setmealRadio,fetch: true, rowClick: true}" @checked-change="handleChecked" />
          <!-- 右边关联表格 -->
          <EasyTable :loading="loading" height="100%" :data="combineone" ref="combineone" :tableOptions="tableOptionsOne" :checkbox-config="{fetch: true, rowClick: true}" @selection-change="handleCheckedOne" />
          <EasyTable :loading="loading" height="100%" :data="combinetwo" ref="combinetwo" :tableOptions="tableOptionsTwo" :checkbox-config="{fetch: true, rowClick: true}" @selection-change="handleCheckedTwo" />
          <EasyTable :loading="loading" height="100%" :data="combinethree" ref="combinethree" :tableOptions="tableOptionsThree" :checkbox-config="{fetch: true, rowClick: true}" @selection-change="handleCheckedThree" />
        </div>
      </el-card>
      <!-- 头部按钮 -->
      <div class="head_box project_btn clearance_top">
        <div class="btn_group">
          <el-button type="primary" size="mini" @click="handleSubmitMedicalItems">确认</el-button>
          <el-button type="warning" size="mini" @click="handleCloseMedicalItems">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入页面接口
import { getSetMeal } from "@/api/personalregister.js";
export default {
  name: "",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    groupTableData: {
      type: Array,
      required: true,
    },
    choosePeople: {
      type: Object,
    },
    personalForm: {
      type: Object,
    },
    pageState: {
      type: String,
    },
  },
  components: {},
  computed: {
    // 主体套餐表格配置
    tableOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          title: "套餐名称",
          prop: "setmealname",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
    // 预约编码合集套餐表格配置1
    tableOptionsOne() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
    // 预约编码合集套餐表格配置2
    tableOptionsTwo() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
    // 预约编码合集套餐表格配置3
    tableOptionsThree() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 55,
        },
      ];
    },
  },
  data() {
    return {
      chooseGroup: undefined, // 当前选中对象
      setmealitems: [], // 主体套餐表格数据
      combineitems: [], // 预约编码合集
      combineone: [], // 预约编码合集套餐渲染数据1
      combinetwo: [], // 预约编码合集套餐渲染数据2
      combinethree: [], // 预约编码合集套餐渲染数据3
      loading: true, // 加载效果
      setmealRadio: "", // 单选选中数据code
      chooseone: [], // 预约编码合集选中数据1
      choosetwo: [], // 预约编码合集选中数据2
      choosethree: [], // 预约编码合集选中数据3
      totalPrice: 0, // 总金额
      keyword: "", // 搜索关键字
    };
  },

  mounted() {
    let data = JSON.parse(localStorage.getItem("groupTableData")) || [];
    // 页面加载调用表格数据
    this.combineitems = data;
    // this.combineitems = this.groupTableData;
    this.handleAddProject();
  },

  methods: {
    // 监听源套餐变化
    handleMonitorData() {
      this.$nextTick(() => {
        let data = [...this.chooseone, ...this.choosetwo, ...this.choosethree];
        let dataIds = data.map((k) => {
          return k.combinecode;
        });
        let chooseIds =
          this.chooseGroup &&
          this.chooseGroup.combineitems.map((k) => {
            return k.combinecode;
          });
        let flag = true;
        dataIds.forEach((k) => {
          if (chooseIds && !chooseIds.includes(k)) {
            flag = false;
          }
        });
        chooseIds &&
          chooseIds.forEach((k) => {
            if (dataIds && !dataIds.includes(k)) {
              flag = false;
            }
          });
        if (!flag) {
          this.setmealRadio = ""; // 取消套餐选中
        } else {
          console.log(data, "data");
          console.log(chooseIds, "chooseIds");
          this.setmealRadio = this.chooseGroup && this.chooseGroup.setmealcode; // 套餐选中
        }
      });
    },
    // 计算总金额回调
    handleGettotalPrice() {
      this.totalPrice = 0;
      this.chooseone.forEach((item) => {
        this.totalPrice += item.price;
      });
      this.choosetwo.forEach((item) => {
        this.totalPrice += item.price;
      });
      this.choosethree.forEach((item) => {
        this.totalPrice += item.price;
      });
    },
    // 单选
    handleChecked(row) {
      console.log(row);
      if (row) {
        this.setmealRadio = row.setmealcode;
        this.chooseGroup = Object.assign({}, row);
        console.log(this.chooseGroup, " this.chooseGroup");
        // 清空前面回显
        this.$refs.combineone.$refs.easyTable.clearSelection();
        this.$refs.combinetwo.$refs.easyTable.clearSelection();
        this.$refs.combinethree.$refs.easyTable.clearSelection();
        // 连贯多选回显
        this.combineone.forEach((val) => {
          let itemcode = row.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 回显
            this.$nextTick(() => {
              this.$refs.combineone.$refs.easyTable.toggleRowSelection(
                val,
                true
              );
            });
          }
        });
        this.combinetwo.forEach((val) => {
          let itemcode = row.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 回显
            this.$nextTick(() => {
              this.$refs.combinetwo.$refs.easyTable.toggleRowSelection(
                val,
                true
              );
            });
          }
        });
        this.combinethree.forEach((val) => {
          let itemcode = row.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 回显
            this.$nextTick(() => {
              this.$refs.combinethree.$refs.easyTable.toggleRowSelection(
                val,
                true
              );
            });
          }
        });
      }
    },
    // 点击体检项目-添加项目回调
    handleAddProject() {
      // 清空前面回显
      this.$nextTick(() => {
        this.$refs.combineone.$refs.easyTable.clearSelection();
        this.$refs.combinetwo.$refs.easyTable.clearSelection();
        this.$refs.combinethree.$refs.easyTable.clearSelection();
      });
      let sex = 0;
      if (this.pageState == "add") {
        sex = this.personalForm.sex;
      } else {
        sex = this.choosePeople ? this.choosePeople.sex : 0;
      }
      getSetMeal({ sex, keyword: this.keyword }).then((res) => {
        let { setmealitems, combineitems } = res.result;
        this.setmealitems = setmealitems;
        if (combineitems.length != 0) {
          this.combineone = combineitems[0].combineitems;
          this.combinetwo = combineitems[1].combineitems;
          this.combinethree = combineitems[2].combineitems;
        }
        console.log(this.combineitems.length);
        // 有数据才回显
        // if (this.combineitems.length > 0) {
        let data = undefined;
        let dataIds = [];
        let combIds = [];
        let flag = true;
        if (this.combineitems[0] && this.combineitems[0].setmealcode) {
          data = this.setmealitems.filter(
            (k) => k.setmealcode == this.combineitems[0].setmealcode
          )[0];
        }
        combIds = this.combineitems.map((k) => {
          return k.combinecode;
        });
        if (data) {
          dataIds = data.combineitems.map((k) => {
            return k.combinecode;
          });
        }
        combIds.forEach((k) => {
          if (!dataIds.includes(k)) {
            flag = false;
          }
        });

        if (flag) {
          this.combineitems[0] &&
            (this.setmealRadio = this.combineitems[0].setmealcode); // 单选回显
        }
        // 连贯多选回显
        this.combineone.forEach((val) => {
          let itemcode = this.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 回显
            this.$nextTick(() => {
              this.$refs.combineone.$refs.easyTable.toggleRowSelection(
                val,
                true
              );
            });
          }
        });
        this.combinetwo.forEach((val) => {
          let itemcode = this.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 回显
            this.$nextTick(() => {
              this.$refs.combinetwo.$refs.easyTable.toggleRowSelection(
                val,
                true
              );
            });
          }
        });
        this.combinethree.forEach((val) => {
          let itemcode = this.combineitems.findIndex(
            (k) => k.combinecode == val.combinecode
          );
          if (itemcode > -1) {
            // 回显
            this.$nextTick(() => {
              this.$refs.combinethree.$refs.easyTable.toggleRowSelection(
                val,
                true
              );
            });
          }
        });
        this.handleGettotalPrice();
        // }
        this.loading = false; // 关闭加载效果
      });
    },
    // 复选框回调one
    handleCheckedOne(val) {
      this.chooseone = val;
    },
    // 复选框回调two
    handleCheckedTwo(val) {
      this.choosetwo = val;
    },
    // 复选框回调three
    handleCheckedThree(val) {
      this.choosethree = val;
    },
    // 点击保存套餐项目回调
    handleSubmitMedicalItems() {
      // 套餐可选性
      let chooseObj = undefined;
      if (this.setmealRadio) {
        chooseObj = this.setmealitems.filter(
          (k) => k.setmealcode == this.setmealRadio
        )[0];
      }
      console.log(chooseObj);
      let data = [...this.chooseone, ...this.choosetwo, ...this.choosethree];
      let editArr = [];
      let causeArr = [];
      // 编辑
      if (this.groupTableData.length > 0) {
        let groupIds = this.groupTableData.map((k) => {
          return k.combinecode;
        });
        let dataIds = data.map((k) => {
          return k.combinecode;
        });
        this.groupTableData.forEach((k) => {
          if (dataIds.includes(k.combinecode)) {
            editArr.push(k);
          }
        });
        data.forEach((item) => {
          if (!groupIds.includes(item.combinecode)) {
            causeArr.push({
              detid: "",
              regid: "",
              setmealcode: (chooseObj && chooseObj.setmealcode) || "",
              setmealname: (chooseObj && chooseObj.setmealname) || "",
              combinecode: item.combinecode,
              combinename: item.combinename,
              deptcode: item.deptcode,
              price: item.price,
              discount: 1,
              discountprice: item.price,
            });
          }
        });
        // // 编辑数据
        // this.groupTableData.forEach((k) => {
        //   data.forEach((item) => {
        //     if (k.combinecode == item.combinecode) {
        //       editArr.push(k);
        //     }
        //   });
        // });
        // let ids = editArr.map((k) => k.combinecode);
        // console.log(ids, "ids");
        // // 源数据
        // data.forEach((item) => {
        //   if (ids.includes(item.combinecode)) {
        //     return;
        //   } else {
        //     causeArr.push({
        //       detid: "",
        //       regid: "",
        //       setmealcode: (chooseObj && chooseObj.setmealcode) || "",
        //       setmealname: (chooseObj && chooseObj.setmealname) || "",
        //       combinecode: item.combinecode,
        //       combinename: item.combinename,
        //       deptcode: item.deptcode,
        //       price: item.price,
        //       discount: 1,
        //       discountprice: item.price,
        //     });
        //   }
        // });
        data = [...editArr, ...causeArr];
      } else {
        data = data.map((item) => {
          return {
            detid: "",
            regid: "",
            setmealcode: (chooseObj && chooseObj.setmealcode) || "",
            setmealname: (chooseObj && chooseObj.setmealname) || "",
            combinecode: item.combinecode,
            combinename: item.combinename,
            deptcode: item.deptcode,
            price: item.price,
            discount: 1,
            discountprice: item.price,
          };
        });
      }
      console.log(editArr);
      console.log(causeArr);
      this.$emit("submit", data); // 发送数据父组件
    },
    // 点击关闭套餐项目弹框按钮回调
    handleCloseMedicalItems() {
      this.totalPrice = 0;
      this.$emit("close", false);
    },
  },

  watch: {
    chooseone: {
      handler() {
        this.handleGettotalPrice();
        this.handleMonitorData();
      },
      deep: true,
      immediate: true,
    },
    choosetwo: {
      handler() {
        this.handleGettotalPrice();
        this.handleMonitorData();
      },
      deep: true,
      immediate: true,
    },
    choosethree: {
      handler() {
        this.handleGettotalPrice();
        this.handleMonitorData();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./css/project.scss";
</style>