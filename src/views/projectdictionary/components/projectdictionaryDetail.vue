<template>
  <div class="flex-column">
    <div class="app-container flex-item flex-column">
      <div class="flex-item">
        <el-card class="box-card" style="height: 100%">
          <div style="text-align: right; margin-top: 10px">
            <el-button size="mini" type="warning" @click="btnclose"
              >关闭</el-button
            >
            <el-button
              size="mini"
              :loading="saveLoading"
              type="primary"
              @click="btnsaveorupdate"
              >保存</el-button
            >
          </div>
          <el-row :gutter="0">
            <el-form
              ref="dicitemdataForm"
              :model="temp"
              :rules="projectdictionaryRules"
              el="projectdictionary-tayps-form"
              label-width="120px"
            >
              <el-form-item>
                <el-tag type="info" style="font-weight: bold">基本信息</el-tag>
              </el-form-item>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="code" label="项目编码">
                    <el-input
                      size="small"
                      v-model="temp.code"
                      placeholder="系统自动生成"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="name" label="项目名称">
                    <el-input size="small" v-model="temp.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="encode" label="项目简称">
                    <el-input size="small" v-model="temp.encode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item size="small" prop="deptcode" label="科室名称">
                    <el-select v-model="temp.deptcode" style="width: 100%">
                      <el-option
                        v-for="(item, index) in deptItems"
                        :key="index"
                        :value="item.code"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item size="small" prop="sex" label="性别">
                    <el-select v-model="temp.sex" style="width: 100%">
                      <el-option
                        v-for="(item, index) in sexarr"
                        :key="index"
                        :value="item.key"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item size="small" prop="resulttype" label="结果类型">
                    <el-select v-model="temp.resulttype" style="width: 100%">
                      <el-option
                        v-for="(item, index) in resulttypearr"
                        :key="index"
                        :value="item.key"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="defaultresult" label="默认结果">
                    <el-input
                      size="small"
                      v-model="temp.defaultresult"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="normalmin" label="参考值下限">
                    <el-input size="small" v-model="temp.normalmin"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    size="small"
                    prop="normalmax"
                    label="参考值上限"
                  >
                    <el-input size="small" v-model="temp.normalmax"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="unit" label="单位">
                    <el-input size="small" v-model="temp.unit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="price" label="价格">
                    <el-input
                      size="small"
                      v-model="temp.price"
                      oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    size="small"
                    prop="contrastflag"
                    label="对比标志"
                  >
                    <el-select v-model="temp.contrastflag" style="width: 100%">
                      <el-option
                        v-for="(item, index) in contrastflagarr"
                        :key="index"
                        :value="item.key"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item size="small" prop="minmark" label="偏低提示">
                    <el-input size="small" v-model="temp.minmark"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="maxmark" label="偏高提示">
                    <el-input size="small" v-model="temp.maxmark"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="keytype" label="关键词输入方式">
                    <el-select v-model="temp.keytype" style="width: 100%">
                      <el-option
                        v-for="(item, index) in keytypearr"
                        :key="index"
                        :value="item.key"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="showtype" label="显示方式">
                    <el-select v-model="temp.showtype" style="width: 100%">
                      <el-option
                        v-for="(item, index) in showtypearr"
                        :key="index"
                        :value="item.key"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="maxrange" label="范围最大值">
                    <el-input
                      size="small"
                      v-model="temp.maxrange"
                      oninput="value=value.replace(/[^0-9.]/g,'')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="minrange" label="范围最小值">
                    <el-input
                      size="small"
                      v-model="temp.minrange"
                      oninput="value=value.replace(/[^0-9.]/g,'')"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="rejectword" label="排斥词">
                    <el-input size="small" v-model="temp.rejectword"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="seqno" label="排序">
                    <el-input
                      size="small"
                      v-model.number="temp.seqno"
                      oninput="value=value.replace(/[^\d]/g,'')"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- <el-col :span="10">
              <el-form :model="ruleForm" ref="ruleForm" :rules="projectdictionaryRules" label-width="50px">
                <el-form-item>
                  <el-tag type="info" style="font-weight: bold;">项目对照字典</el-tag>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain icon="el-icon-circle-plus-outline" size="small" @click="addRow(ruleForm.infiledList)"></el-button>
                  <el-table :data="ruleForm.infiledList" border fit highlight-current-row>
                    <el-table-column prop="itemcode" label="项目编码">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.itemcode" clearable disabled></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="contcode" label="系统对照码">
                      <template slot-scope="scope">
                        <el-form-item :rules="projectdictionaryRules.contcode" :prop="`infiledList.${scope.$index}.contcode`" class="tab-form">
                          <el-input v-model="scope.row.contcode" class="tool-inp" clearable placeholder="系统对照码"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="assistcode" label="辅助编码">
                      <template slot-scope="scope">
                        <el-form-item :rules="projectdictionaryRules.assistcode" :prop="`infiledList.${scope.$index}.assistcode`" class="tab-form">
                          <el-input v-model="scope.row.assistcode" clearable placeholder="辅助编码"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="对照说明">
                      <template slot-scope="scope">
                        <el-form-item :rules="projectdictionaryRules.remark" :prop="`infiledList.${scope.$index}.remark`" class="tab-form">
                          <el-input v-model="scope.row.remark" clearable placeholder="对照说明"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="status" label="启用状态">
                      <template slot-scope="scope">
                        <el-form-item :rules="projectdictionaryRules.status" :prop="`infiledList.${scope.$index}.status`" class="tab-form">
                          <el-select v-model="scope.row.status">
                            <el-option v-for="(item, index) in statusarr" :key="index" :value="item.key" :label="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="seqno" label="序号">
                      <template slot-scope="scope">
                        <el-form-item :rules="projectdictionaryRules.seqno" :prop="`infiledList.${scope.$index}.seqno`" class="tab-form">
                          <el-input v-model="scope.row.seqno" clearable placeholder="序号"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button plain type="danger" @click.native.prevent="
                        deleteRow(scope.$index, ruleForm.infiledList)
                      " size="small">
                          移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </el-col> -->
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { jump } from "@/utils/jumpRoute";
import * as projectdictionary from "@/api/projectdictionary";
export default {
  data() {
    return {
      value: [],
      saveLoading: false,
      temp: {
        code: "",
        name: "",
        encode: "",
        deptcode: "",
        deptname: "",
        sex: "",
        resulttype: "",
        defaultresult: "",
        normalmin: "",
        normalmax: "",
        unit: "",
        price: "",
        contrastflag: "",
        minmark: "",
        maxmark: "",
        keytype: 0,
        pycode: "",
        wbcode: "",
        showtype: null,
        seqno: 0,
        delflag: 0,
        minrange: 0,
        maxrange: 0,
        rejectword: "",
        contrastitems: [],
      },
      dialogStatus: "",
      deptItems: [],
      projectdictionaryRules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        // encode: [
        //   { required: true, message: "项目简称不能为空", trigger: "blur" },
        // ],
        deptcode: [
          { required: true, message: "科室不能为空", trigger: "blur" },
        ],
        // sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        // resulttype: [
        //   { required: true, message: "结果类型不能为空", trigger: "blur" },
        // ],
        // contrastflag: [
        //   { required: true, message: "对比标志不能为空", trigger: "blur" },
        // ],
        // keytype: [
        //   {
        //     required: true,
        //     message: "关键词输入方式不能为空",
        //     trigger: "blur",
        //   },
        // ],
        showtype: [
          {
            required: true,
            message: "显示方式不能为空",
            trigger: "blur",
          },
        ],
        seqno: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
        itemcode: [
          {
            required: true,
            message: "项目编码不能为空",
            trigger: "blur",
          },
        ],
        contcode: [
          {
            required: true,
            message: "系统对照码不能为空",
            trigger: "blur",
          },
        ],
        assistcode: [
          {
            required: true,
            message: "辅助编码不能为空",
            trigger: "blur",
          },
        ],
        // remark: [
        //   {
        //     required: true,
        //     message: "对照说明不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // status: [
        //   {
        //     required: true,
        //     message: "启用状态不能为空",
        //     trigger: "change",
        //   },
        // ],
        seqno: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
      },
      keytypearr: [
        { key: 0, name: "替换" },
        { key: 1, name: "累加", selected: true },
      ],
      showtypearr: [
        { key: 0, name: "多选框", selected: true },
        { key: 1, name: "输入框" },
      ],
      sexarr: [
        { key: 0, name: "未知", selected: true },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      resulttypearr: [
        { key: 0, name: "任意", selected: true },
        { key: 1, name: "数字" },
        { key: 2, name: "字符" },
      ],
      contrastflagarr: [
        { key: 0, name: "不需要", selected: true },
        { key: 1, name: "需要" },
      ],
      statusarr: [
        { key: 0, name: "启用", selected: true },
        { key: 1, name: "停用" },
      ],

      ruleForm: {
        infiledList: [],
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        appId: [
          { required: true, message: "必须选择一个应用", trigger: "change" },
        ],
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        hoscode: [
          { required: true, message: "机构编码不能为空", trigger: "blur" },
        ],
        deptcode: [
          { required: true, message: "科室编码不能为空", trigger: "blur" },
        ],
        typecode: [
          { required: true, message: "科室类型不能为空", trigger: "blur" },
        ],
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        diccode: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
        licensekey: [
          { required: true, message: "许可秘钥不能为空", trigger: "blur" },
        ],
        prefix: [
          { required: true, message: "号码前缀不能为空", trigger: "blur" },
        ],
        curno: [
          { required: true, message: "当前流水不能为空", trigger: "blur" },
        ],
        minno: [{ required: true, message: "最小号不能为空", trigger: "blur" }],
      },
    };
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
  },
  created() {
    this.temp.sex = this.sexarr.filter((item) => item.selected == true)[0].key;
    this.temp.keytype = this.keytypearr.filter(
      (item) => item.selected == true
    )[0].key;
    this.temp.resulttype = this.resulttypearr.filter(
      (item) => item.selected == true
    )[0].key;
    this.temp.contrastflag = this.contrastflagarr.filter(
      (item) => item.selected == true
    )[0].key;
    this.temp.status = this.statusarr.filter(
      (item) => item.selected == true
    )[0].key;
  },
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
    detailslist() {
      var code = {
        code: this.temp.code,
      };
      projectdictionary.detail(code).then((response) => {
        if (
          response.result.code != "" &&
          response.result.code != undefined &&
          response.result.code != null
        ) {
          this.temp = response.result;
          this.ruleForm.infiledList = response.result.contrastitems;
          this.deptItems = response.result.deptItems;
        } else {
          this.deptItems = response.result.deptItems;
        }
      });
    },
    //可追加的模块
    deleteRow(index, rows) {
      //删除改行
      rows.splice(index, 1);
    },
    btnclose() {
      jump(this, "/projectdictionary/index");
    },
    btnsaveorupdate() {
      console.log(this.ruleForm.infiledList);
      this.temp.contrastitems = null;
      this.temp.valueitems = null;
      console.log(this.temp);
      if (
        this.temp.code == "" ||
        this.temp.code == undefined ||
        this.temp.code == null
      ) {
        this.$refs["dicitemdataForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            projectdictionary.add(this.temp).then(() => {
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
              });
              this.saveLoading = false;
              jump(this, "/projectdictionary/index");
            });
          }
        });
      } else {
        this.$refs["dicitemdataForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            projectdictionary.update(this.temp).then(() => {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
              });
              this.saveLoading = false;
              jump(this, "/projectdictionary/index");
            });
          }
        });
      }
    },
    addRow(tableData, event) {
      tableData.push({
        conid: "",
        itemcode: "",
        contcode: "",
        assistcode: "",
        remark: "",
        status: this.statusarr.filter((item) => item.selected == true)[0].key,
        seqno: 0,
      });
    },
    resetTemp() {
      this.temp = {
        code: "",
        name: "",
        encode: "",
        deptcode: "",
        deptname: "",
        sex: "",
        resulttype: "",
        defaultresult: "",
        normalmin: "",
        normalmax: "",
        unit: "",
        price: "",
        contrastflag: "",
        minmark: "",
        maxmark: "",
        keytype: 0,
        pycode: "",
        wbcode: "",
        showtype: null,
        seqno: 0,
        delflag: 0,
        minrange: 0,
        maxrange: 0,
        rejectword: "",
        contrastitems: [],
      };
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
</style>