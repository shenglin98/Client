<template>
  <div class="compent-dialog-body">
    <el-dialog :visible.sync="isFlag" width="500px" title="当前缺少打印机必要配置文件" :destroy-on-close="true" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" class="demo-form-inline">
        <el-form-item label="上传文件">
          <input size="mini" type="file" @change="getMd5" />
        </el-form-item>
        <el-form-item label="配置内容">
          <span>
            {{ md5Txt }}
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onSubmit">确定上传</el-button>
        <el-button size="mini" @click="handleclose">稍后上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CompoentsFileMD5",
  components: {},
  props: {
    isFlag: Boolean,
    setFun: Function,
  },
  data() {
    return {
      form: {},
      md5Txt: null, // 获取到的md5
    };
  },
  watch: {},
  mounted() {},
  methods: {
    handleclose() {
      this.md5Txt=''
      this.$emit("setFun", false);
    },
    // 保存本地
    onSubmit() {
      if ((this.md5Txt + "").length >= 32) {
        localStorage.setItem("md5code", this.md5Txt);
        this.$emit("setFun", false);
        this.$message.success("保存成功");
      } else {
        this.$message.error("请上传文件");
        return;
      }
    },
    // 获取文件数据
    getMd5(e) {
      let that = this;
      let file = e.target.files[0];
      let reader = new FileReader();
      if (!!file) {
        reader.readAsBinaryString(file);
        reader.onload = function (e) {
          that.$nextTick(() => {
            that.md5Txt = e.target.result;
          });
        };
      } else that.md5Txt = " ";
    },
  },
};
</script>

<style scoped lang="scss">
</style>
