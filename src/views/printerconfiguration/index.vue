<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button size="mini" type="primary" plain :loading="saveLoading" :disabled="isdisabledFn" @click="save">保存</el-button>
        <el-button size="mini" type="primary" plain :disabled="isdisabledFn" @click="clear">取消</el-button>
        <!-- <el-button size="mini" type="primary" plain @click="handlesetMD5">上传配置文件</el-button> -->
        <permission-btn moduleName="printerconfiguration" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container">
      <el-card class="box-card" style="margin: 0 auto; width: 600px">
        <h2>设置打印机</h2>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item size="small" :label="'默认打印机'">
                <el-select v-model="temp.defaultprinter" filterable :disabled="isdisabledFn" placeholder="请选择" style="width: 100%" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.key" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item size="small" :label="'条码打印机'" prop="barcodeprinter">
                <el-select v-model="temp.barcodeprinter" filterable :disabled="isdisabledFn" placeholder="请选择" style="width: 100%" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.key" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item size="small" :label="'申请单打印机'" prop="requisitionprinter">
                <el-select v-model="temp.requisitionprinter" :disabled="isdisabledFn" filterable placeholder="请选择" style="width: 100%" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.key" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item size="small" :label="'读卡器配置'" prop="idcarddev">
                <el-select v-model="temp.idcarddev" :disabled="isdisabledFn" filterable placeholder="请选择" style="width: 100%" clearable>
                  <el-option v-for="(item, index) in idcardItems" :key="index" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item size="small" :label="'执行地点'">
                <el-select v-model="temp.areacode" :disabled="isdisabledFn" filterable placeholder="请选择" style="width: 100%" clearable>
                  <el-option v-for="(item, index) in dictriagareaData" :key="index" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item size="small" :label="'默认诊室'">
                <el-select v-model="temp.roomcode" :disabled="isdisabledFn" filterable placeholder="请选择" style="width: 100%" clearable>
                  <el-option v-for="(item, index) in tediaItems" :key="index" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <!-- <CompoentsFileMD5 :isFlag="md5Flag" @setFun="setMdFlag"></CompoentsFileMD5> -->
  </div>
</template>

<script>
import CompoentsFileMD5 from "@/components/fileMD5/index.vue";
import * as Sys_ConfiguringPrinters from "@/api/Sys_ConfiguringPrinters";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";
import { LoadTriagArea, LoadTriagRoom } from "@/api/dictriag.js";
export default {
  name: "printerconfiguration",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
    CompoentsFileMD5,
  },

  directives: {
    waves,
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  data() {
    return {
      saveLoading: false,
      loddp: "",
      isdisabledFn: true,
      temp: {
        defaultprinter: "",
        barcodeprinter: "",
        requisitionprinter: "",
        idcarddev: "",
        areacode: "",
        roomcode: "",
      },
      murmur: "",
      options: [],
      idcardItems: [
        {
          code: "idcarddev",
          name: "华视",
        },
        {
          code: "idcarddev",
          name: "精伦",
        },
        {
          code: "idcarddev",
          name: "新中新",
        },
        {
          code: "idcarddev",
          name: "中控",
        },
        {
          code: "idcarddev",
          name: "因纳伟盛",
        },
      ],
      rules: {
        defaultprinter: [
          {
            required: true,
            message: "默认打印机不能为空",
            trigger: ["blur", "change"],
          },
        ],
      },
      dictriagareaData: [],
      tediaItems: [],

      // md5Flag: false, //上传配置文件开关
    };
  },
  mounted() {
    this.CreateOneFormPage();
    this.getList();
    this.handleLoadTriagArea();
    LoadTriagRoom({
      page: 1,
      limit: 100000,
      key: "",
    }).then((res) => {
      if (!res.data) {
        this.tediaItems = [];
        return;
      }
      this.tediaItems = res.data.filter((k) => k.status != 1);
    });
  },
  methods: {
    handleLoadTriagArea() {
      LoadTriagArea({
        page: 1,
        limit: 100000,
        key: "",
      }).then((res) => {
        if (!res.data) {
          this.dictriagareaData = [];
          return;
        }
        this.dictriagareaData = res.data;
      });
    },
    // setMdFlag(flg) {
    //   this.md5Flag = flg;
    // },
    // 打开配置dailog
    // handlesetMD5() {
    //   this.md5Flag = true;
    //   console.log(this.md5Flag);
    // },
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
    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnAdd":
          break;
        case "btnEdit":
          this.isdisabledFn = false;
        case "btnDel":
          break;
        case "btnRefresh":
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    CreateOneFormPage() {
      this.loddp = getLodop();
      if (this.loddp != undefined && this.loddp != null && this.loddp != "") {
        for (let index = 0; index < this.loddp.GET_PRINTER_COUNT(); index++) {
          var temp = {
            value: this.loddp.GET_PRINTER_NAME(index),
            key: this.loddp.GET_PRINTER_NAME(index),
          };
          this.options.push(temp);
        }
      }
    },
    getList() {
      var data = {
        id: localStorage.getItem("md5code"),
      };
      Sys_ConfiguringPrinters.getList(data).then((response) => {
        var keys = Object.keys(this.temp);
        response.result.forEach((d) => {
          keys.forEach((b) => {
            if (b == d.printtype) {
              this.temp[b] = d.printname;
            }
          });
        });
        console.log(response);
        console.log(this.temp);
      });
    },
    save() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          var Sys_ConfiguringPrinterItem = [];
          var keys = Object.keys(this.temp);
          keys.forEach((d) => {
            let item = {
              printtype: d,
              printname: this.temp[d],
            };

            Sys_ConfiguringPrinterItem.push(item);
          });
          var data = {
            code: localStorage.getItem("md5code"),
            Sys_ConfiguringPrinters: Sys_ConfiguringPrinterItem,
          };
          Sys_ConfiguringPrinters.addorupdate(data).then((response) => {
            if (response.code == 200) {
              this.getList();
              this.clear();
            } else {
              this.$message.error("保存失败");
            }
            this.saveLoading = false;
          });
        }
      });
    },
    clear() {
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.isdisabledFn = true;
    },
  },
};
</script>
