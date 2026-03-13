<template>
  <div class="importSend">
    <div class="bodymain">
      <div class="top_box">
        <div class="total">共{{ rowsitems.length }}条数据，已勾选{{ selectRegidArr.length }}条</div>
        <div class="btn_box">
          <el-upload class="upload-demo" name="files" action="" accept=".xls,.xlsx" :show-file-list="false" :auto-upload="false" :on-change="handleImport" :file-list="fileList">
            <el-button type="primary" size="mini" icon="iconfont icon-fenxiang">导入数据</el-button>
          </el-upload>
          <el-button size="mini" type="primary" @click="handleSendSMS">发送短信</el-button>
          <el-button size="mini" type="primary" @click="handleClosePage">关闭</el-button>
        </div>
      </div>
      <div class="content">
        <el-row class="content_box">
          <el-col :span="19" class="l_box">
            <vxe-table ref="projectData" height="100%" border="inner" highlight-hover-row :data="rowsitems" :checkbox-config="{ trigger: 'row' }" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll">
              <vxe-table-column type="checkbox" width="40px" :reserve-selection="true" v-if="rowsitems.length>0"></vxe-table-column>
              <vxe-table-column v-for="(date, index) in columnitems" :key="index" :field="date.colunmcode" :title="date.colunmname" show-header-overflow min-width="140px" show-overflow="title" show-footer-overflow>
              </vxe-table-column>
            </vxe-table>
          </el-col>
          <el-col :span="5" class="r_box">
            <div class="smstemplate">
              <div class="title">短信模板:</div>
              <el-select v-model="tempname" size="mini" clearable @change="handleChangeTempname">
                <el-option v-for="(item, index) in noticetemplateData" :key="index" :label="item.tempname" :value="item.tempid"></el-option>
              </el-select>
            </div>
            <div class="smscontent">
              <el-input class="conc_text" type="textarea" resize="none" disabled v-model="tempcontent"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  DicNoticetemplateLoad,
  SmsLoadByPhone,
  SendSMS,
  ImportSmsPerson,
} from "@/api/noticetemplate.js";
import { getFilesUpload } from "@/api/unitregistration.js";
export default {
  name: "",

  components: {},

  data() {
    return {
      tempname: "",
      tempcontent: "",
      tempcategroy: "",
      smscategroy: "",
      noticetemplateData: [],
      rowsitems: [],
      columnitems: [],
      fileList: [],
      selectData: [],
      selectRegidArr: [],
    };
  },

  mounted() {
    this.handleDicNoticetemplateLoad();
  },

  methods: {
    handleSelectPeopleAll({ records }) {
      //   this.selectData = JSON.parse(JSON.stringify(records));
      let arr = records.map((k) => {
        return k["体检号"];
      });
      this.selectRegidArr = arr;
      console.log(this.selectRegidArr, "this.selectRegidArr");
    },
    // 人员列表选中数据回调
    handleSelectPeople({ records }) {
      //   this.selectData = JSON.parse(JSON.stringify(records));
      let arr = records.map((k) => {
        return k["体检号"];
      });
      this.selectRegidArr = arr;
      console.log(this.selectRegidArr, "this.selectRegidArr");
    },
    // 导入数据
    handleImport(file, fileList) {
      let flag = file.name.split(".");
      let data = new FormData();
      data.append("files", file.raw);
      getFilesUpload(data).then((res) => {
        if (!res.result[0]) {
          this.$message.error("文件导入数据异常,请重试！");
          return;
        }
        ImportSmsPerson({ fileId: res.result[0].id }).then((res) => {
          if (!res.result) return;
          this.columnitems = res.result.columnitems;
          this.rowsitems = res.result.rowsitems;
        });
      });
    },
    // 发送短信
    handleSendSMS() {
      if (!this.tempname) {
        this.$message.warning("请先选中短信名称内容!");
        return;
      }
      if (this.selectRegidArr.length == 0) {
        this.$message.warning("请先选中需要发送短信的人员!");
        return;
      }
      SendSMS({
        tempcategroy: this.tempcategroy,
        regiditems: this.selectRegidArr,
      }).then((res) => {
        this.$message.success(
          `发送成功${res.result.success}人，发送失败${
            res.result.fail
          }人，共计发送${res.result.success + res.result.fail}人`
        );
        // this.$message.success(res.message);
        this.selectRegidArr = [];
        this.$refs.pageTablePeople.clearCheckboxRow();
      });
    },
    // 关闭页面
    handleClosePage() {
      this.$emit("close");
    },
    // 改变短信名称回调
    handleChangeTempname(val) {
      let flag = this.noticetemplateData.filter((k) => k.tempid == val)[0];
      if (flag) {
        this.tempcontent = flag.content;
        this.tempcategroy = flag.tempcategroy;
        this.smscategroy = flag.tempcategroy;
      } else {
        this.tempcontent = "";
        this.tempcategroy = "";
        this.smscategroy = "";
      }
    },
    // 保存通知模板表单列表
    handleDicNoticetemplateLoad() {
      DicNoticetemplateLoad({
        page: 1,
        limit: 100000,
        key: "",
      })
        .then((res) => {
          if (!res.data) {
            this.noticetemplateData = [];
            return;
          }
          this.noticetemplateData = res.data;
        })
        .catch((err) => {});
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#d0ddeb";
      stylejson.height = "32px";
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

  computed: {},
};
</script>
<style lang='scss' scoped>
.importSend {
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .bodymain {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    .top_box {
      height: 40px;
      align-items: center;
      display: flex;
      justify-content: space-between;
      .btn_box {
        display: flex;
        /deep/.upload-demo {
          margin-right: 10px;
        }
      }
    }
    .content {
      height: calc(100% - 40px);
      .content_box {
        height: 100%;
        .l_box {
          height: 100%;
        }
        .r_box {
          height: 100%;
          .smstemplate {
            display: flex;
            align-items: center;
            .title {
              margin-right: 8px;
              width: 90px;
            }
            /deep/.el-select {
              width: 100%;
            }
          }
          .smscontent {
            margin-top: 10px;
            height: 85%;
            .conc_text {
              height: 100%;

              /deep/.el-textarea__inner {
                background-color: #fff !important;
                height: 100% !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>