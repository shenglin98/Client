<template>
  <div class="flex-column">
    <div class="app-container flex-item flex-column">
      <div class="flex-item">
        <el-card class="box-card" style="height: 100%;">
          <div style="text-align: right; margin-top: 10px">
            <el-button size="mini" type="primary" plain @click="dialogitem">添加组合</el-button>
            <el-button size="mini" type="primary" plain :loading="saveLoading" @click="btnsaveorupdate">保存</el-button>
            <el-button size="mini" type="primary" plain @click="btnclose">关闭</el-button>
          </div>
          <el-row :gutter="0">
            <el-row>
              <el-col :span="15">
                <el-form ref="diccombinedataForm" class="diccombinedata_form" :model="temp" :rules="setdictionaryRules" el="setdictionary-tayps-form" label-width="120px">
                  <el-form-item>
                    <el-tag type="info" style="font-weight: bold;">基本信息</el-tag>
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="code" label="套餐编码">
                        <el-input size="small" v-model="temp.code" placeholder="系统自动生成" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="name" label="套餐名称">
                        <el-input size="small" v-model="temp.name"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="price" label="套餐价格">
                        <el-input size="small" v-model.number="temp.price" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="companyprice" label="单位价格">
                        <el-input size="small" v-model.number="temp.companyprice" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="sex" label="性别">
                        <el-select filterable size="small" v-model="temp.sex" style="width:100%">
                          <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="status" label="启用状态">
                        <el-select filterable size="small" v-model="temp.status" style="width:100%">
                          <el-option v-for="(item, index) in statusarr" :key="index" :value="item.key" :label="item.name"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="seqno" label="排序">
                        <el-input size="small" v-model.number="temp.seqno" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="10" style="margin-left: -5%;">
                <el-form :model="ruleForm" ref="ruleForm" :rules="setdictionaryRules" label-width="120px">
                  <el-form-item>
                    <el-tag type="info" style="font-weight: bold;">已包含{{ sum }}个组合</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <el-table height="calc(100vh - 285px)" ref="childatamainTable" :key="tableKey" :data="newComboFrom" v-loading="listLoading" fit highlight-current-row style="width:100%; border:1px solid #f0f0f0; color:#000;" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                      <el-table-column prop="code" label="组合编码" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="name" label="组合名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                      </el-table-column>
                      <!-- <el-table-column prop="sex" label="性别" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span> {{   scope.row.sex==0?"全部":scope.row.sex==1?"男":scope.row.sex==2?"女":"" }}</span>
                        </template>
                      </el-table-column> -->
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-row>
        </el-card>

        <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="1000px" title="添加组合" :visible.sync="addDialog">
          <div class="filter-container" style="white-space: nowrap; overflow-x: auto">
            <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
            </el-input>

            <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <br />
          <el-row>
            <el-col :span="11">
              <el-tag type="info" style="font-weight: bold;">组合信息</el-tag>
              <br />
              <br />
              <el-table height="350px" ref="partmainTable" :key="tableKey" :data="tablelist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="parthandleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column prop="code" label="组合编码" placeholder="系统自动生成" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="组合名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.sex == 0
                          ? "未知"
                          : scope.row.sex == 1
                          ? "男"
                          : scope.row.sex == 2
                          ? "女"
                          : ""
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="2">
              <div style="text-align: center;margin-top: 100px;">
                <el-button size="mini" @click="ascsort" type="primary">↑</el-button>
                <br />
                <br />
                <br />
                <el-button size="mini" @click="dessort" type="primary">↓</el-button>
              </div>
            </el-col>
            <el-col :span="11">
              <el-tag type="info" style="font-weight: bold;">已包含{{ sum }}个组合</el-tag>
              <br />
              <br />
              <el-table height="350px" ref="chilmainTable" @row-click="rowClick" :default-sort="{ prop: 'seqno', order: 'ascending' }" :key="tableKey" :data="newComboFrom" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="chilhandleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
                <el-table-column prop="code" label="组合编码" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="组合名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.sex == 0
                          ? "未知"
                          : scope.row.sex == 1
                          ? "男"
                          : scope.row.sex == 2
                          ? "女"
                          : ""
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { jump } from "@/utils/jumpRoute";
import * as setdictionary from "@/api/setdictionary";
import * as projectdictionary from "@/api/projectdictionary";
import waves from "@/directive/waves"; // 水波纹指令
import { setFilesUpload } from "@/api/company_register.js";
import { addChangeCombo,getComboDetails } from '@/api/setdictionary';
export default {
  directives: {
    waves,
  },
  data() {
    return {
      sum:0,
      fileList: [], // bodyForm.annex
      fileUrl: "", //文件预览路径
      fileName: "", //文件预览路径
      value: [],
      listQuery: {
        // 查询条件
        key: undefined,
      },
      temp: {
        code: "",
        name: "",
        price: 0,
        companyprice: 0,
        sex: 0,
        status: 0,
        seqno: 0,
        combineitems: [],
      },
      saveLoading: false,
      count: 0,
      listLoading: false,
      tablelist: [],
      addDialog: false,
      dialogStatus: "",
      deptItems: [],
      tableKey: 0,
      selectrow: {},
      multipleSelection: [],
      newComboFrom:[],
      multipletemp: [],
      comprice: 0,
      crowdItems: [
        { name: "全年龄段" },
        { name: "少年儿童（12岁及以下）" },
        { name: "青少年（13-20岁）" },
        { name: "青年（21-30岁）" },
        { name: "中青年（21-40岁）" },
        { name: "中年（31-50岁）" },
        { name: "中老年（41-50岁）" },
        { name: "老年（61岁以上）" },
      ],
      CommonlyusedItems: [
        { name: "检后复查" },
        { name: "多发病" },
        { name: "常规" },
        { name: "常规体检" },
        { name: "常见病" },
        { name: "肿瘤筛查" },
        { name: "自由组合" },
        { name: "已婚女性" },
        { name: "男性" },
        { name: "自由选项" },
      ],
      PracticetypeItems: [{ name: "高端商务" }],
      setdictionaryRules: {
        name: [
          { required: true, message: "套餐名称不能为空", trigger: "blur" },
        ],
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      guideprintarr: [
        { key: 0, name: "打印" },
        { key: 1, name: "不打印" },
      ],
      collectflagarr: [
        { key: 0, name: "不采集" },
        { key: 1, name: "采集" },
      ],
      resulttypearr: [
        { key: "01", name: "基础检查" },
        { key: "02", name: "常规检验" },
        { key: "03", name: "细菌检验" },
        { key: "04", name: "功能检查" },
      ],
      viewgrouparr: [
        { key: "1", name: "基础类" },
        { key: "2", name: "检验类" },
        { key: "3", name: "功能类" },
      ],
      resultinputarr: [
        { key: 0, name: "手工输入" },
        { key: 1, name: "接口获取" },
      ],
      statusarr: [
        { key: 0, name: "启用" },
        { key: 1, name: "停用" },
      ],
      ruleForm: {
        infiledList: [],
      },
      dialogPvVisible: false,
      pvData: [],
    };
  },
  props:{
    code:{
      type:String,
    }
  },
  filters: {
    statusFilter(disable) {
      const statusMap = {
        false: "color-success",
        true: "color-danger",
      };
      return statusMap[disable];
    },
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
  },
  mounted() {
    this.init();
    console.log('父组件传递的code',this.code);
    this.handleGetComboDetails()
  },
  created() {},
  methods: {
    init() {
      const id = this.$route.params && this.$route.params.id;
      if (id == undefined || id == "" || id == null) {
        this.dialogStatus = "create";
      } else {
        this.dialogStatus = "update";
      }

      this.temp.code = id;
      this.detailslist(id);
    },
    ascsort() {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const element = this.multipleSelection[index];
        if (
          element.code == this.selectrow.code &&
          this.multipleSelection[index - 1] != undefined
        ) {
          var temp = this.multipleSelection[index - 1];
          this.multipleSelection[index - 1] = element;
          this.multipleSelection[index] = temp;
        }
      }
      this.multipleSelection = Object.assign([], this.multipleSelection);
    },
    
    dessort() {
      var ind = 0;
      this.multipleSelection.forEach((element, index) => {
        if (
          element.code == this.selectrow.code &&
          this.multipleSelection[index + 1] != undefined
        ) {
          ind = index;
        }
      });
      if (
        this.selectrow.code == this.multipleSelection[ind].code &&
        this.multipleSelection[ind + 1] != undefined
      ) {
        var nowtemp = this.multipleSelection[ind];
        var temp = this.multipleSelection[ind + 1];
        this.multipleSelection[ind] = temp;
        this.multipleSelection[ind + 1] = nowtemp;
      }

      this.multipleSelection = Object.assign([], this.multipleSelection);
    },
    detailslist() {
      var code = {
        code: this.temp.code,
      };
      setdictionary.dicsetmealload(code).then((response) => {
        if (
          response.result != null &&
          response.result != undefined &&
          response.result != ""
        ) {
          this.temp = response.result;
        }
        this.temp.price = 0;
        this.temp.combineitems.forEach((d) => {
          var multtemp = {
            code: d.combinecode,
            name: d.combinename,
            deptname: d.deptname,
            price: d.price,
            sex: d.sex,
          };
          this.temp.price += d.price;
          this.multipleSelection.push(multtemp);
        });
        this.count = this.newComboFrom.length;
        if (this.temp.picture) {
          this.fileUrl = this.temp.picture;
          this.fileName = this.temp.picture;
        }
        if (this.temp.crowd && this.temp.crowd.length > 0) {
          this.temp.crowd = this.temp.crowd.split("|");
        }
        if (this.temp.practicetype && this.temp.practicetype.length > 0) {
          this.temp.practicetype = this.temp.practicetype.split("|");
        }
        if (this.temp.commonlyused && this.temp.commonlyused.length > 0) {
          this.temp.commonlyused = this.temp.commonlyused.split("|");
        }
      });
    },
    handleFilter() {
      this.$refs.partmainTable.clearSelection();
      if (
        this.listQuery.key != "" &&
        this.listQuery.key != undefined &&
        this.listQuery.key != null
      ) {
        var reg = new RegExp(this.listQuery.key);
        projectdictionary.diccombineload("").then((response) => {
          this.tablelist = response.data;
          this.multipleSelection.forEach((b) => {
            this.tablelist.forEach((d) => {
              if (d.code == b.code) {
                this.tablelist.splice(this.tablelist.indexOf(d), 1);
              }
            });
          });
          if (
            this.tablelist.filter((item, index) => item.code.match(reg))
              .length > 0
          ) {
            this.tablelist = Object.assign(
              [],
              this.tablelist.filter((item, index) => item.code.match(reg))
            );
          }
          if (
            this.tablelist.filter((item, index) => item.name.match(reg))
              .length > 0
          ) {
            this.tablelist = Object.assign(
              [],
              this.tablelist.filter((item, index) => item.name.match(reg))
            );
          }
          if (
            this.tablelist.filter((item, index) => item.pycode.match(reg))
              .length > 0
          ) {
            this.tablelist = Object.assign(
              [],
              this.tablelist.filter((item, index) => item.pycode.match(reg))
            );
          }
          if (
            this.tablelist.filter((item, index) => item.wbcode.match(reg))
              .length > 0
          ) {
            this.tablelist = Object.assign(
              [],
              this.tablelist.filter((item, index) => item.wbcode.match(reg))
            );
          }
          if (
            this.tablelist.filter((item, index) => item.deptname.match(reg))
              .length > 0
          ) {
            this.tablelist = Object.assign(
              [],
              this.tablelist.filter((item, index) => item.deptname.match(reg))
            );
          }
        });
      } else {
        this.listLoading = true;
        projectdictionary.diccombineload("").then((response) => {
          this.tablelist = response.data;
          this.multipleSelection.forEach((b) => {
            this.tablelist.forEach((d) => {
              if (d.code == b.code) {
                this.tablelist.splice(this.tablelist.indexOf(d), 1);
              }
            });
          });
          this.listLoading = false;
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
    rowClick(row) {
      this.selectrow = row;
    },
    dialogitem() {
      this.listLoading = true;
      projectdictionary.diccombineload(this.listQuery).then((response) => {
        this.addDialog = true;
        this.tablelist = response.data;
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach((b) => {
            this.tablelist.forEach((d) => {
              if (d.code == b.code) {
                this.tablelist.splice(this.tablelist.indexOf(d), 1);
                // this.$nextTick(() => {
                //   this.$refs.partmainTable.toggleRowSelection(d, true);
                // });
              }
            });
          });
        }
        this.listLoading = false;
      });
    },
    parthandleSelectionChange(val) {
      val.forEach((d) => {
        this.tablelist.forEach((b) => {
          if (d.code == b.code) {
            this.tablelist.splice(this.tablelist.indexOf(b), 1);
            this.newComboFrom.push(b);
            // this.temp.price += b.price;
          }
        });
      });
      this.sum = this.newComboFrom.length;
      this.temp.itemtotal = this.sum;
    },
    chilhandleSelectionChange(val) {
      console.log(val);
      val.forEach((d) => {
        this.newComboFrom.forEach((b) => {
          if (d.code == b.code) {
            this.newComboFrom.splice(this.newComboFrom.indexOf(b), 1);
            this.tablelist.push(b);
            // this.temp.price -= b.price;
          }
        });
      });
      this.sum = this.newComboFrom.length;
    },
    // 保存
    btnsaveorupdate() {
      let data = this.temp
      let codes = this.newComboFrom.map((i) => {
          return i.code;
      });
      // 传入参数
      let a = {
          code: data.code,
          name: data.name,
          price: data.price,
          companyprice: data.companyprice,
          sex: data.sex,
          status: data.status,
          seqno: data.seqno,
          combineitems: codes
      }
      addChangeCombo( a ).then(res =>{
        console.log(res);
          // 请求成功处理
          if (res.code ==200) {
            this.$message({
              showClose: true,
              message: "保存成功",
              type: "success",
            });
          }
      })
    },
    // 获取个人套餐组合详情
    handleGetComboDetails(){
      if (this.code !== '') {
        getComboDetails({ code: this.code }).then(res =>{
          this.sum = res.result.combineitems.length
          // 表单渲染
          this.temp = res.result;
          // 套餐表格渲染
          this.newComboFrom = res.result.combineitems.map(k=>{
            return {
              code: k.combinecode,
              name: k.combinename,
              deptname: k.deptname,
              price: k.price
            }
          })
        })
      }
    },
    // 关闭子组件
    btnclose() {
        // 向父组件传参
        this.$emit("close",false);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.dialog-mini .el-select {
  width: 100%;
}
.tab-form .el-form-item__error {
  position: relative;
  left: -20px;
  line-height: 1 !important;
}
.diccombinedata_form {
  .el-form-item {
    margin-bottom: 10px;
    .el-select {
      width: 100%;
    }
  }
}
</style>
