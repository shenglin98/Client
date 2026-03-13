<template>
  <div class="flex-column">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="文档中心" name="document">文档中心</el-tab-pane>
      <el-tab-pane label="下载中心" name="download">
        <el-table height="calc(100vh - 149px)" ref="mainTable" :key="tableKey" :data="tablelist" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
          <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
          <el-table-column prop="name" label="名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="url" label="下载地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="download(scope.row.url)">{{
                  scope.row.url
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="descript" label="说明" show-overflow-tooltip>
          </el-table-column>
        </el-table>

      </el-tab-pane>
    </el-tabs>

  </div>

</template>

<script>
import * as help from "@/api/help";
import waves from "@/directive/waves"; // 水波纹指令
import { mapGetters } from "vuex";
export default {
  name: "assistance",
  components: {},
  directives: {
    waves,
  },
  data() {
    return {
      listLoading: false,
      tablelist: [],
      tableKey: 0,
      activeName: "download",
    };
  },
  filters: {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      var data = {
        tp: "Download",
      };
      help.getList(data).then((response) => {
        this.tablelist = response.data;
        this.listLoading = false;
      });
    },
    download(url) {
      window.open(url);
    },
  },
};
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-select.filter-item.el-select--small {
  width: 100%;
}
</style>
