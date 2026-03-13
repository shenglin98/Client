<template>
  <div class="_select">
    <span v-if="labelShow">{{ item.label }}</span>
    <el-select :size="size" v-model="selected" clearable filterable multiple remote :placeholder="item.placeholder || item.label" :remote-method="handleSearch" v-bind="item.attrs">
      <el-option v-for=" item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "",

  components: {},

  props: {
    item: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: "medium",
    },
    labelShow: {
      type: Boolean,
    },
  },

  data() {
    return {
      selected: [],
      options: [],
    };
  },

  // 数据监听
  watch: {
    selected(newVal) {
      this.$emit("handleSetValue", newVal);
    },
    "item.value": {
      handler: function (newVal) {
        this.selected = newVal;
      },
    },
  },

  // 计算属性
  computed: {},

  // void
  methods: {
    handleSearch(query) {
      if (!query) return;
      let api = this.item.request.api.split(".");
      const request = this.$api[api[0]][api[1]];
      request({
        param: {
          [this.item.request.requestParamName]: query,
        },
      }).then((res) => {
        let options = [];
        res.datas.rows.some((v) => {
          options.push({
            label: v[this.item.params.label],
            value: v[this.item.params.value],
          });
        });
        this.options = options;
      });
    },
  },

  // 生命周期 - 创建之前
  beforeCreate() {},

  // 生命周期 - 创建完成
  created() {},

  // 生命周期 - 挂载之前
  beforeMount() {},

  // 生命周期 - 挂载完成
  mounted() {},

  // 生命周期 - 更新之前
  beforeUpdate() {},

  // 生命周期 - 更新完成
  updated() {},

  // 生命周期 - 销毁之前
  beforeDestroy() {},

  // 生命周期 - 销毁完成
  destroyed() {},

  // 使用keep-alive缓存进入页面触发
  activated() {},

  // 进入路由前
  beforeRouteEnter(to, from, next) {
    next(() => {});
  },

  // 离开路由后
  beforeRouteLeave(to, from, next) {
    next();
  },
};
</script>
<style scoped>
._select .label {
  display: inline-block;
  min-width: 80px;
  white-space: nowrap;
  text-align: right;
}
</style>