<template>
  <div class="upload-page">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-form">
        <div class="form-item">
          <label>单位名称</label>
          <el-select v-model="searchForm.companycode" placeholder="请选择单位" clearable filterable size="small" @change="handleChangeCompany">
            <el-option v-for="(item, index) in companyitems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code" />
          </el-select>
        </div>
        <div class="form-item">
          <label>批次</label>
          <el-select v-model="searchForm.batch" placeholder="请选择批次" clearable filterable size="small" @change="handleChangeBatch">
            <el-option v-for="(item, index) in batchitems" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="form-item">
          <label>分组</label>
          <el-select v-model="searchForm.groupcode" placeholder="请选择分组" clearable filterable size="small" @change="handleChangeGroup">
            <el-option v-for="(item, index) in groupitems" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="form-item">
          <label>部门</label>
          <el-select v-model="searchForm.departcode" placeholder="请选择部门" clearable filterable size="small">
            <el-option v-for="(item, index) in departitems" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="form-item">
          <label>体检号</label>
          <el-input v-model="searchForm.regid" placeholder="请输入体检号" clearable size="small" />
        </div>
        <div class="form-item">
          <label>电话</label>
          <el-input v-model="searchForm.telephone" placeholder="请输入电话" clearable size="small" />
        </div>
        <div class="form-item">
          <label>姓名</label>
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable size="small" />
        </div>
        <div class="form-item">
          <label>证件号</label>
          <el-input v-model="searchForm.idcard" placeholder="请输入证件号" clearable size="small" />
        </div>
        <div class="form-item">
          <label>上传状态</label>
          <el-select v-model="searchForm.uploadStatus" placeholder="请选择" clearable size="small">
            <el-option label="全部" value="" />
            <el-option label="未上传" value="0" />
            <el-option label="已上传" value="1" />
          </el-select>
        </div>
        <div class="form-actions">
          <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button type="success" size="small" icon="el-icon-upload" @click="handleUpload">上传</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button size="small" icon="el-icon-close" @click="handleClose">关闭</el-button>
        </div>
      </div>
    </div>

    <!-- 上传统计区域 -->
    <div class="statistics-section" v-if="statistics">
      <div class="stat-item">
        <span class="stat-label">总人数：</span>
        <span class="stat-value">{{ statistics.total || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">已上传：</span>
        <span class="stat-value success">{{ statistics.uploaded || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">未上传：</span>
        <span class="stat-value warning">{{ statistics.notUploaded || 0 }}</span>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table :data="tableData" border stripe size="small" v-loading="tableLoading" height="100%" style="width: 100%;">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="regid" label="体检号" width="140" align="center" />
        <el-table-column prop="name" label="姓名" width="80" align="center" />
        <el-table-column prop="sex" label="性别" width="60" align="center" />
        <el-table-column prop="age" label="年龄" width="60" align="center" />
        <el-table-column prop="checktypename" label="检查类型" width="100" align="center" />
        <el-table-column prop="statusname" label="体检状态" width="100" align="center" />
        <el-table-column prop="companyname" label="单位" min-width="150" align="left" />
        <el-table-column prop="mainConclusion" label="主检结论" min-width="180" align="left" />
        <el-table-column prop="uploadStatus" label="上传状态" width="100" align="center">
          <template slot-scope="scope">
            <span :class="['status-tag', 'status-' + scope.row.uploadStatus]">
              {{ scope.row.uploadStatus === 0 ? '未上传' : scope.row.uploadStatus === 1 ? '上传中' : scope.row.uploadStatus === 2 ? '已上传' : '上传失败' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="uploadDate" label="上传时间" width="160" align="center" />
        <el-table-column prop="uploader" label="上传人" width="100" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleUploadRow(scope.row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" background />
    </div>
  </div>
</template>

<script>
import { getOccupationUploadList, getUploadStatics, uploadCompanyData, batchUploadPersonData } from "@/api/occupationUpload";
import { getLoadSearchInfo, getBatch } from "@/api/fullsearch.js";

export default {
  name: "UploadPage",
  data() {
    return {
      searchForm: {
        companycode: "",
        batch: "",
        groupcode: "",
        departcode: "",
        regid: "",
        telephone: "",
        name: "",
        idcard: "",
        uploadStatus: "",
      },
      companyitems: [],
      batchitems: [],
      groupitems: [],
      departitems: [],
      tableData: [],
      tableLoading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      statistics: null,
    };
  },
  mounted() {
    this.handleGetLoadSearchInfo();
  },
  methods: {
    handleGetLoadSearchInfo() {
      getLoadSearchInfo().then((res) => {
        let { companyitems } = res.result;
        this.companyitems = companyitems || [];
      });
    },
    handleChangeCompany() {
      this.searchForm.batch = "";
      this.searchForm.groupcode = "";
      this.searchForm.departcode = "";
      this.batchitems = [];
      this.groupitems = [];
      this.departitems = [];
      if (this.searchForm.companycode) {
        getBatch({ companycode: this.searchForm.companycode }).then((res) => {
          let { batchitems } = res.result;
          this.batchitems = batchitems || [];
        });
      }
    },
    handleChangeBatch(value) {
      this.searchForm.groupcode = "";
      this.searchForm.departcode = "";
      this.groupitems = [];
      this.departitems = [];
      if (value) {
        let flag = this.batchitems.find((k) => value === k.code);
        if (flag) {
          this.groupitems = flag.groupitems || [];
          this.departitems = flag.departitems || [];
        }
      }
    },
    handleChangeGroup(value) {
      this.searchForm.departcode = "";
      this.departitems = [];
      if (value) {
        let flag = this.groupitems.find((k) => value === k.code);
        if (flag) {
          this.departitems = flag.departitems || [];
        }
      } else {
        let flag = this.batchitems.find((k) => this.searchForm.batch === k.code);
        if (flag) {
          this.departitems = flag.departitems || [];
        }
      }
    },
    loadData() {
      this.tableLoading = true;
      const whereitems = [];
      Object.keys(this.searchForm).forEach((key) => {
        if (this.searchForm[key] !== "" && this.searchForm[key] !== null) {
          whereitems.push({
            key: key,
            value: this.searchForm[key],
          });
        }
      });
      const params = {
        page: this.pagination.page,
        limit: this.pagination.pageSize,
        whereitems: whereitems,
      };
      getOccupationUploadList(params)
        .then((res) => {
          if (res.code === 200 && res.result) {
            this.tableData = res.result;
            this.pagination.total = res.count || 0;
          } else {
            this.tableData = [];
            this.pagination.total = 0;
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableData = [];
          this.pagination.total = 0;
          this.tableLoading = false;
        });
    },
    loadStatistics() {
      if (this.searchForm.companycode) {
        getUploadStatics(this.searchForm.companycode)
          .then((res) => {
            if (res.code === 200 && res.result) {
              this.statistics = res.result;
            } else {
              this.statistics = null;
            }
          })
          .catch(() => {
            this.statistics = null;
          });
      } else {
        this.statistics = null;
      }
    },
    handleSearch() {
      if (!this.searchForm.companycode && !this.searchForm.regid) {
        this.$message.warning("请至少填写单位名称或体检号其中一项");
        return;
      }
      this.pagination.page = 1;
      this.loadData();
    //   this.loadStatistics();
    },
    handleReset() {
      this.searchForm = {
        companycode: "",
        batch: "",
        groupcode: "",
        departcode: "",
        regid: "",
        telephone: "",
        name: "",
        idcard: "",
        uploadStatus: "",
      };
      this.batchitems = [];
      this.groupitems = [];
      this.departitems = [];
      this.tableData = [];
      this.pagination.total = 0;
      this.statistics = null;
    },
    handleUpload() {
      if (!this.searchForm.companycode) {
        this.$message.warning("请先选择单位");
        return;
      }
      this.$confirm("确认上传该单位所有数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        uploadCompanyData(this.searchForm.companycode)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success("上传成功");
              this.loadData();
              this.loadStatistics();
            } else {
              this.$message.error(res.message || "上传失败");
            }
          })
          .catch(() => {
            this.$message.error("上传失败");
          });
      }).catch(() => {});
    },
    handleClose() {
      console.log("关闭");
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.loadData();
    },
    handleView(row) {
      console.log("查看:", row);
    },
    handleUploadRow(row) {
      this.$confirm("确认上传该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        batchUploadPersonData([row.regid])
          .then((res) => {
            if (res.code === 200) {
              this.$message.success("上传成功");
              this.loadData();
              this.loadStatistics();
            } else {
              this.$message.error(res.message || "上传失败");
            }
          })
          .catch(() => {
            this.$message.error("上传失败");
          });
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./css/upload";
</style>
