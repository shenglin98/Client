<template>
  <div class="subject">
    <div class="searchpar">
      <label class="lable">体检日期：</label>
      <el-date-picker
        ref="datePicker"
        @change="searchInfo()"
        v-model="value2"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
      <div class="btn" @click="pickTime(1)">最近三个月</div>
      <div class="btn" @click="pickTime(2)">最近半年</div>
      <div class="btn" @click="pickTime(3)">最近一年</div>
      <div class="btn search" @click="searchInfo">查询</div>
    </div>
    <div class="page_table">
      <vxe-table
        height="500px"
        border="inner"
        show-overflow
        :loading="loading"
        highlight-hover-row
        :data="pageData"
        :sort-config="{ trigger: 'cell' }"
        row-id="sasid"
        :checkbox-config="{ reserve: true }"
      >
        <vxe-table-column
          field="regid"
          title="体检号"
          width="150px"
          show-overflow
        ></vxe-table-column>
        <!-- <vxe-table-column type="checkbox" width="45"></vxe-table-column> -->
        <vxe-table-column
          field="name"
          title="姓名"
          width="250px"
          show-overflow
        ></vxe-table-column>

        <vxe-table-column
          field="age"
          title="年龄"
          width="150px"
          show-overflow
        ></vxe-table-column>

        <vxe-table-column
          field="checkdate"
          title="体检时间"
          width="150px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="telephone"
          title="手机号"
          width="180px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="idcard"
          title="身份证"
          width="150px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="companyname"
          title="团检"
          width="150px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="statusname"
          title="状态"
          width="180px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="name"
          min-width="100px"
          title="操作"
          show-overflow
        >
          <template slot-scope="scope">
            <el-link type="primary" @click="handlePreview(scope.row.regid)"
              >预览</el-link
            >
            <label> | </label>
            <el-link
              type="primary"
              @click="
                handleGetExportPdf(scope.row.regid, scope.row.name, scope.row)
              "
              >下载</el-link
            >
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <!-- 预览弹框 -->
    <el-dialog
      title="预览"
      class="preview_box"
      :visible.sync="dialogVisible"
      width="700px"
      @close="handleCloseDialog"
    >
      <iframe
        ref="pdfCotainer"
        :src="pdfUrl"
        width="100%"
        style="height: calc(100vh - 347px)"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script>
import * as report from "@/api/report";
import { printBase64 } from "@/api/printreport.js";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      pdfUrl: "",
      value2: [],
      pageData: [],
      loading: false,
      dialogVisible: false,
    };
  },
  created() {
    this.searchInfo();
  },
  methods: {
    // 选择时间
    pickTime(select) {
      const end = new Date();
      const start = new Date();
      switch (select) {
        case 1:
          // 3月
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          this.value2 = [start, end];
          break;
        case 2:
          // 半年
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
          this.value2 = [start, end];
          break;
        case 3:
          // 一年
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
          this.value2 = [start, end];
          break;
      }
      this.searchInfo();
    },
    // 搜索
    searchInfo() {
      let that = this;
      this.loading = true;
      let info = JSON.parse(localStorage.getItem("personInfo"));
      report
        .gealthCheckForWeb({
          businesstype: "CustomerReportList",
          whereitems: [
            { key: "startdate", value: that.value2[0] },
            { key: "enddate", value: that.value2[1] },
            { key: "idcard", value: info.idcard },
          ],
        })
        .then((res) => {
          this.pageData = res.result;
          this.loading = false;
        });
    },
    // 预览pdf
    handlePreview(code) {
      let repname = "";
      if (item.meccode == 1) {
        repname = `1、F报告书`;
      } else if (item.meccode == 10003) {
        repname = `1、F水电报告书`;
      } else if (item.meccode == 10004) {
        repname = `1、F国康报告书`;
      } else {
        repname = `1、F报告书`;
      }
      // 报告书
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [code],
        // repname: d.$children[0].$attrs["data-remark"],
        designtype:
          repname.split("、")[1].substr(0, 1) === "F" ? "fast" : "dev",
        repname,
        whereitems: [],
      };
      printBase64(data).then((res) => {
        let code = res.data[0].base64String.replace(/[\n\r]/g, "");
        let raw = window.atob(code);
        let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        let url = window.URL.createObjectURL(
          new Blob([uInt8Array], { type: "application/pdf" })
        );
        if (url) this.dialogVisible = true;
        this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      });
    },
    handleCloseDialog() {},
    // 下载Pdf
    handleGetExportPdf(code, name, item) {
      if (code.length == 0) return false;
      let codeName = code;
      let repname = "";
      if (item.meccode == 1) {
        repname = `1、F报告书`;
      } else if (item.meccode == 10003) {
        repname = `1、F水电报告书`;
      } else if (item.meccode == 10004) {
        repname = `1、F国康报告书`;
      } else {
        repname = `1、F报告书`;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [code],
        // repname: d.$children[0].$attrs["data-remark"],
        designtype:
          repname.split("、")[1].substr(0, 1) === "F" ? "fast" : "dev",
        repname,
        whereitems: [],
      };
      printBase64(data).then((res) => {
        console.log(res);
        let code = res.data[0].base64String.replace(/[\n\r]/g, "");
        let raw = window.atob(code);
        let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        let url = window.URL.createObjectURL(
          new Blob([uInt8Array], { type: "application/pdf" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `${codeName}-${name}`; // 下载文件的名字
        // a.download = res.data[0].printname; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
    },
  },
};
</script>

<style scoped>
.subject {
  padding: 20px;
}

.searchpar {
  padding: 20px;
}

.lable {
  color: #303133;
}

.btn {
  display: inline-flex;
  padding: 10px 20px;
  color: white;
  font-size: 13px;
  border-radius: 10px;
  margin: 0 10px;
  cursor: pointer;
  background-color: rgba(76, 76, 240, 0.815);
}

.search {
  background-color: rgb(230, 95, 95);
  float: right;
}
</style>