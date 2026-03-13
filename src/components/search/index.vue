<template>
  <div class="_search_container" :class="alignOptions.includes(align) ? align : 'right'">
    <div class="_search_main">
      <div class="_search">
        <div class="search-item" :style="`${item.labelWidth ? `width: ${item.labelWidth}` : labelWidth ? `width: ${labelWidth}` : ''}`" :class="{ 'search-item-label': labelShow }" v-for="(item, index) in newSearchOptions" :key="index">
          <div v-if="!item.components && labelShow" class="search-label">
            {{ item.label }}
          </div>
          <SearchRender :item="item" :labelShow="labelShow" :searchSize="$SearchOptions.searchSize || searchSize" @handleSearch="handleSearch" @handleSetValue="handleSetValue" />
        </div>
        <div class="search-item">
          <el-button icon="el-icon-search" :type="$SearchOptions.searchBtnType || searchBtnType" :size="$SearchOptions.searchSize || searchSize" @click="handleSearch">{{ $SearchOptions.searchText || searchText }}</el-button>
          <el-button v-if="resetBtn" :style="labelShow ? '' : 'margin-left: 0'" :type="$SearchOptions.resetBtnType || resetBtnType" :size="$SearchOptions.searchSize || searchSize" @click="handleReset">{{ $SearchOptions.resetText || resetText }}</el-button>
        </div>
        <template v-if="$slots.default">
          <div style="margin-left: 20px">
            <slot></slot>
          </div>
        </template>
      </div>
      <div class="lookMore" v-if="
          getExpandHideCount() && searchOptions.length > getExpandHideCount()
        ">
        <span class="_open" @click="handleOpen">
          <span>{{ isOpen ? "收起" : "展开" }}</span>
          <i :class="{ _isOpen: !isOpen }" class="
              el-select__caret
              el-input__icon
              el-icon-arrow-up
              _lookMore_icon
            "></i>
        </span>
      </div>
    </div>
    <div class="search_solt">
      <slot name="search_solt"></slot>
    </div>
  </div>
</template>
<script>
import SearchRender from "./render";
export default {
  name: "Search",

  components: {
    SearchRender,
  },

  props: {
    searchOptions: {
      type: Array,
      required: true,
    },
    search: {
      type: Function,
      default: () => {},
    },
    repeatRequest: {
      type: Boolean,
      default: true,
    },
    searchText: {
      type: String,
      default: "搜索",
    },
    searchBtnType: {
      type: String,
      default: "default",
    },
    resetBtn: {
      type: Boolean,
    },
    resetText: {
      type: String,
      default: "重置",
    },
    resetBtnType: {
      type: String,
      default: "default",
    },
    expandHideCount: {
      type: Number,
      default: 0,
    },
    searchSize: {
      type: String,
      default: "small",
    },
    labelShow: {
      type: Boolean,
    },
    align: {
      type: String,
      default: "right",
    },
    arrayParams: {
      type: Boolean,
    },
    labelWidth: {
      type: [Number, String],
    },
  },

  data() {
    return {
      newSearchOptions: [],
      oldParams: {},
      moreOptions: [],
      isOpen: false,
      alignOptions: ["left", "center", "right"],
    };
  },

  // 数据监听
  watch: {
    searchOptions: {
      handler() {
        this.init();
      },
      immediate: true,
    },
  },

  // 计算属性
  computed: {
    rules() {
      return {
        text: {
          target: "el-input", // 元素名称
          value: "", // 默认值
          attrs: {
            // 属性
            type: "text",
            clearable: "clearable",
          },
          placeholder: "", // 占位符
          handler: [], // handler: [input, blur] TODO: 键盘事件参数示例： keyup.enter || keyup.13
        },
        number: {
          target: "el-input",
          value: "", // 默认值
          attrs: {
            type: "number",
            clearable: "clearable",
          },
          placeholder: "",
          handler: [],
        },
        date: {
          target: "el-date-picker",
          value: "",
          type: "",
          attrs: {
            "value-format": "yyyy/MM/dd",
          },
          placeholder: "",
          handler: [], // 可填 change
        },
        dateRange: {
          target: "el-date-picker",
          value: "",
          type: "",
          attrs: {
            type: "datetimerange",
            "range-separator": "至",
            "start-placeholder": "开始日期",
            "end-placeholder": "结束日期",
            // "value-format": "yyyy/MM/dd HH:mm:ss",
            // "default-time": ["00:00:00", "23:59:59"],
          },
          handler: [], // 可填 change
        },
        select: {
          components: "select", // 组件名称
          target: "",
          value: "",
          type: "",
          attrs: {},
          placeholder: "",
          handler: [], // 可填 change
          options: [], // 选项数据 TODO:参数示例 [{ value: true, label: '是' }],
        },
        selectSearch: {
          components: "selectSearch", // 组件名称
          target: "",
          value: "",
          type: "",
          attrs: {},
          placeholder: "",
          request: {
            api: "", // 请求的接口对象
            requestParamName: "", // 请求参数名称
          },
          params: {
            // 参数名称
            label: "label",
            value: "value",
          },
          handler: [], // 可填 change
          options: [], // 选项数据 TODO:参数示例 [{ value: true, label: '是' }],
        },
      };
    },
  },

  // void
  methods: {
    init() {
      this.isOpen = false;
      this.handleRender();
    },
    handleRender() {
      let data = {};
      this.newSearchOptions = [];
      this.searchOptions.forEach((v, k) => {
        if (v.show == false) return;
        if (
          !this.isOpen &&
          this.getExpandHideCount() &&
          k >= this.getExpandHideCount()
        )
          return;
        Object.keys(this.rules).forEach((key) => {
          if (v.type == key) {
            data = { ...this.rules[key], ...v };
          }
        });
        this.newSearchOptions.push(Object.assign({}, data));
      });
    },
    handleSetValue(evt) {
      this.newSearchOptions.forEach((v) => {
        if (v.prop == evt.prop) {
          v.value = evt.value;
        }
      });
      evt.isAction && this.handleSearch();
    },
    handleSearch(status) {
      if (typeof this.search === "function") {
        let params = {};
        this.newSearchOptions.forEach((v) => {
          if (this.handleValidate(v.value)) {
            const value = v.filterData && v.filterData(v.value);
            if (value && value instanceof Object) {
              params = { ...params, ...value };
              return;
            }
            params[v.prop] = v.value;
          }
        });
        if (
          this.repeatRequest === false &&
          JSON.stringify(this.oldParams) == JSON.stringify(params)
        )
          return;
        this.oldParams = Object.assign({}, JSON.parse(JSON.stringify(params)));
        if (this.arrayParams) {
          params = this.handleGetParams(params);
        }
        this.search(params, status);
      }
    },
    handleReset() {
      this.newSearchOptions.forEach((v) => {
        v.value = "";
        v = Object.assign({}, v);
      });
      this.handleSearch("reset");
    },
    handleOpen() {
      this.isOpen = !this.isOpen;
      this.searchOptions.forEach((v) => {
        this.newSearchOptions.forEach((vv) => {
          if (v.prop == vv.prop) {
            v.value = vv.value;
          }
        });
      });
      this.handleRender();
    },
    getExpandHideCount() {
      return this.expandHideCount || this.$SearchOptions.expandHideCount;
    },
    handleValidate(value) {
      if (value instanceof Array) {
        return Boolean(value.length);
      }
      if (
        value === "" ||
        value === void 0 ||
        value === null ||
        value === false
      ) {
        return false;
      }
      return true;
    },
    handleGetParams() {
      const searchParams = this.newSearchOptions.reduce((arr, val) => {
        if (this.handleValidate(val.value)) {
          const value = val.filterData && val.filterData(val.value);
          if (value && value instanceof Array) {
            arr = [...arr, ...value];
            return arr;
          }
          arr.push({
            key: val.prop,
            value: value ? value : val.value,
          });
        }
        return arr;
      }, []);
      return searchParams;
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
._search_container {
  display: flex;
  align-items: flex-start;

  padding: 20px 0;
}

.left {
  justify-content: flex-start;
}

.center {
  justify-content: center;
}

.right {
  justify-content: flex-end;
}

._search_main {
  display: inline-block;

  text-align: left;
}
._search {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
}

.search-label {
  font-size: 14px;
  color: #666;
  font-weight: 700;

  padding: 0 5px;

  white-space: nowrap;
}
.search-item {
  display: flex;
  align-items: center;
}

.search-item-label {
  padding: 10px;
}
.search-item .label {
  font-weight: 700;
  text-align: right;
}

/deep/ ._number input[type="number"] {
  -moz-appearance: textfield;
}
/deep/ ._number input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.lookMore {
  font-size: 13px;
  color: rgba(133, 133, 133, 0.5);

  text-align: center;
}

.lookMore ._open {
  cursor: pointer;
}

._lookMore_icon {
  font-weight: 700;
  transition: 0.3s;
}

._isOpen {
  transform: rotate(180deg);
}

.search_solt {
  margin-top: 10px;
}
</style>