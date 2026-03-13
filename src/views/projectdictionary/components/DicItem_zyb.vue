<template>
  <div class="dic_item">
    <div class="head_box">
      <el-tag size="medium">基本信息</el-tag>
      <div class="btn_group">
        <el-button type="warning" size="mini" @click="handleClosePage">关闭</el-button>
        <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
      </div>
    </div>
    <el-form ref="form" :rules="rules" class="page_form" :model="form" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="项目编码">
            <el-input disabled v-model="form.code" clearable placeholder="系统自动生成"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" prop="name" label="项目名称">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="项目简称">
            <el-input v-model="form.encode" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" prop="deptcode" label="科室名称">
            <el-select v-model="form.deptcode" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in deptItems" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="性别">
            <el-select v-model="form.sex" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in sexItem" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="结果类型">
            <el-select v-model="form.resulttype" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in resultTypeItem" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="默认结果">
            <el-input v-model="form.defaultresult" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="参考值下限">
            <el-input v-model="form.normalmin" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="参考值上限">
            <el-input v-model="form.normalmax" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="单位">
            <el-input v-model="form.unit" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="价格">
            <el-input v-model="form.price" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="对比标志">
            <el-select v-model="form.contrastflag" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in contrastFlagItem" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="偏低提示">
            <el-input v-model="form.minmark" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="偏高提示">
            <el-input v-model="form.maxmark" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="关键词输入方式">
            <el-select v-model="form.keytype" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in keyTypeItem" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" prop="showtype" label="显示方式">
            <el-select v-model="form.showtype" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in showTypeItem" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="范围最大值">
            <el-input v-model="form.maxrange" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="范围最小值">
            <el-input v-model="form.minrange" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="排斥词">
            <el-input v-model="form.rejectword" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="重要指标标志">
            <el-select v-model="form.importantflag" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in importantFlagItem" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" prop="seqno" label="排序">
            <el-input v-model.number="form.seqno" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="异常结果">
            <el-input v-model="form.anomalyresult" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="默认结果2">
            <el-input v-model="form.defaultresult2" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="获取小结标志">
            <el-select v-model="form.conclusionflag" clearable placeholder="请选择" style="width: 100%">
              <el-option label="不调用" :value="0"></el-option>
              <el-option label="调用" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="参考值下限1">
            <el-input v-model="form.normalmin1" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="参考值上限1">
            <el-input v-model="form.normalmax1" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="范围最小值1">
            <el-input v-model="form.minrange1" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="范围最大值1">
            <el-input v-model="form.maxrange1" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="职业病对照编码">
            <el-select v-model="form.occupationitemcode" clearable placeholder="请选择" style="width: 100%">
              <el-option v-for="item,index in occupationItems" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="职业病计量单位编码">
            <el-select v-model="form.unitcode" clearable placeholder="请选择" style="width: 100%" @change="handleUnitCode">
              <el-option v-for="item,index in unitItems" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="8">
          <el-form-item size="small" prop="seqno" label="进小结">
            <el-select
              v-model="form.summaryflag"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option label="是" :value="0"></el-option>
              <el-option label="否" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
  </div>
</template>
<script>
import {
  getDicItemDetail,
  setDicItemCreate,
  setDicItemUpdate,
  GetOccupationTreeList,
} from "@/api/projectdictionary2.js";
import { getPublicConfig } from "@/api/personalregister.js";

export default {
  name: "",

  props: {
    // "新增或编辑标志"
    dicItemId: {
      type: String,
      require: true,
    },
  },

  components: {},

  data() {
    return {
      form: {
        name: "",
        encode: "",
        deptcode: "",
        sex: 0,
        resulttype: 0,
        defaultresult: "",
        defaultresult2: "",
        normalmin: "",
        normalmax: "",
        unit: "",
        price: "",
        contrastflag: 0,
        importantflag: 0,
        conclusionflag: 0,
        minmark: "",
        maxmark: "",
        keytype: 1,
        rejectword: "",
        minrange: 0,
        maxrange: 0,
        showtype: "",
        seqno: 0,
        summaryflag: 0,
        anomalyresult: "",
        normalmin1: "",
        normalmax1: "",
        minrange1: "",
        maxrange1: "",
        occupationitemcode: "",
        unitcode: "",
      }, // 主体表单数据
      rules: {
        name: [{ required: true, message: "该内容不能为空", trigger: "blur" }],
        deptcode: [
          { required: true, message: "该内容不能为空", trigger: "change" },
        ],
        showtype: [
          { required: true, message: "该内容不能为空", trigger: "change" },
        ],
        seqno: [{ required: true, message: "该内容不能为空", trigger: "blur" }],
      },
      deptItems: [], // 科室渲染
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
      ],
      resultTypeItem: [
        {
          code: 0,
          name: "任意",
        },
        {
          code: 1,
          name: "数字",
        },
      ],
      contrastFlagItem: [
        {
          code: 0,
          name: "不需要",
        },
        {
          code: 1,
          name: "需要",
        },
      ],
      keyTypeItem: [
        {
          code: 0,
          name: "替换",
        },
        {
          code: 1,
          name: "累加",
        },
      ],
      showTypeItem: [
        {
          code: 0,
          name: "勾选框",
        },
        {
          code: 1,
          name: "文本框",
        },
      ],
      importantFlagItem: [
        {
          code: 0,
          name: "常规",
        },
        {
          code: 1,
          name: "重要",
        },
      ],
      occupationItems: [],
      unitItems: [],
    };
  },

  computed: {},

  mounted() {
    this.handleGetDicItemDetail();
    this.handleGetOccupationTreeList();
    getPublicConfig({ cc: "CalcUnit" }).then((res) => {
      if (!res.result) return;
      this.unitItems = res.result;
    });
  },

  methods: {
    handleUnitCode(value) {
      if (value) {
        let flag = this.unitItems.filter((k) => {
          return k.code === value;
        })[0];
        flag && (this.form.unit = flag.name);
      } else {
        this.form.unit = "";
      }
    },
    handleGetOccupationTreeList() {
      GetOccupationTreeList({ category: "HealthCheckItem" }).then((res) => {
        if (!res.result) return;
        this.occupationItems = res.result;
      });
    },
    // 提交
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.dicItemId == "") {
            setDicItemCreate(this.form).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.message);
                this.handleClosePage(); // 关闭回调
              }
            });
          } else {
            setDicItemUpdate(this.form).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.message);
                this.handleClosePage(); // 关闭回调
              }
            });
          }
        }
      });
    },
    // 关闭回调
    handleClosePage() {
      this.$refs["form"].resetFields();
      this.$emit("close");
    },
    // 获取项目字典详情回调
    handleGetDicItemDetail() {
      getDicItemDetail({ code: this.dicItemId }).then((res) => {
        console.log(res);
        if (this.dicItemId == "") {
          this.deptItems = res.result.deptItems;
        } else {
          this.form = res.result;
          // 1
          this.deptItems = res.result.deptItems;
        }
      });
    },
  },

  watch: {},
};
</script>
<style lang='scss' scoped>
.dic_item {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  padding: 30px;
  box-sizing: border-box;
  .head_box {
    display: flex;
    justify-content: space-between;
  }
  .page_form {
    margin-top: 50px;
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>