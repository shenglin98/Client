<template>
  <div class="_select">
    <span class="label" v-if="labelShow">{{ item.label }}</span>
    <el-select @change="handleChange" :size="size" v-model="selected" clearable :placeholder="item.placeholder || item.label" v-bind="item.attrs" :style="`${item.width ? `width: ${item.width}` : ''}`">
      <el-option v-for="value in list" :key="value.value" :label="value.label" :value="value.value">
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
      selected: this.item.value,
      list: [],
    };
  },

  // 数据监听
  watch: {
    "item.options": {
      handler: function (newVal) {
        if (!(newVal instanceof Array)) {
          this.list = newVal.data.map((v) => ({
            label: v[newVal.params.label],
            value: v[newVal.params.value],
          }));
          return;
        }
        this.list = newVal;
      },
      deep: true,
      immediate: true,
    },
    selected(newVal) {
      // console.log(newVal, "selected");
      // this.$emit("handleSetValue", newVal);
      // typeof this.item.onChange == "function" && this.item.onChange(newVal);
    },
    "item.value": {
      handler: function (newVal) {
        // console.log(newVal, "item.value");
        this.selected = newVal;
      },
      deep: true,
      immediate: true,
    },
  },

  // 计算属性
  computed: {},

  // void
  methods: {
    handleChange(newVal) {
      // console.log(newVal, "newVal");
      this.$emit("handleSetValue", newVal);
      this.selected = newVal;
      typeof this.item.onChange == "function" && this.item.onChange(newVal);
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
.label {
  font-size: 14px;
  color: #666;
  font-weight: 700;

  padding: 0 5px;

  white-space: nowrap;
}
</style>